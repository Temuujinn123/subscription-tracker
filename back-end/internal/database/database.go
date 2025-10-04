package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"subscription-tracker/internal/cache"
	"subscription-tracker/internal/models"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
	cacheService *cache.CacheService
}

func InitDB(cacheService *cache.CacheService) (*DB, error) {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
	)

	sqlDB, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %v", err)
	}

	err = sqlDB.Ping()
	if err != nil {
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	db := &DB{
		DB:           sqlDB,
		cacheService: cacheService,
	}

	createUsersTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		password_hash TEXT NOT NULL,
		third_party TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
	`

	_, err = db.Exec(createUsersTableSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to create users tablel: %v", err)
	}

	createTableSQL := `
	CREATE TABLE IF NOT EXISTS subscriptions (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		category TEXT NOT NULL,
		price DECIMAL(10,2) NOT NULL,
		billing_cycle TEXT NOT NULL,
		next_billing_date DATE NOT NULL,
		user_id INTEGER NOT NULL,
        CONSTRAINT fk_users
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,
		is_active BOOLEAN DEFAULT true,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to create table: %v", err)
	}

	log.Println("PostgreSQL database initialized successfully")
	return db, nil
}

func (db *DB) Close() error {
	return db.DB.Close()
}

func (db *DB) GetUserSubscriptions(userId int) ([]models.Subscription, error) {
	query := `
			SELECT 
				s.id, 
				s.name, 
				s.category, 
				s.price, 
				s.billing_cycle, 
				s.next_billing_date, 
				s.is_active, 
				s.created_at, 
				s.updated_at,
				u.email
			FROM subscriptions s
			LEFT JOIN users u
			ON s.user_id = u.id
			WHERE s.user_id = $1
			`

	rows, err := db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	subscriptions := []models.Subscription{}
	for rows.Next() {
		var sub models.Subscription
		err := rows.Scan(
			&sub.ID,
			&sub.Name,
			&sub.Category,
			&sub.Price,
			&sub.BillingCycle,
			&sub.NextBillingDate,
			&sub.IsActive,
			&sub.CreatedAt,
			&sub.UpdatedAt,
			&sub.Email,
		)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, sub)
	}

	return subscriptions, nil
}

func (db *DB) GetSubscriptionByID(id int) (*models.Subscription, error) {
	query := `
			SELECT 
				s.id, 
				s.name, 
				s.category, 
				s.price, 
				s.billing_cycle, 
				s.next_billing_date, 
				s.is_active, 
				s.created_at, 
				s.updated_at,
				u.email
			FROM subscriptions s
			LEFT JOIN users u
			ON s.user_id = u.id
			WHERE s.id = $1
		`

	row := db.QueryRow(query, id)
	var sub models.Subscription
	err := row.Scan(
		&sub.ID,
		&sub.Name,
		&sub.Category,
		&sub.Price,
		&sub.BillingCycle,
		&sub.NextBillingDate,
		&sub.IsActive,
		&sub.CreatedAt,
		&sub.UpdatedAt,
		&sub.Email,
	)
	if err != nil {
		return nil, err
	}

	return &sub, nil
}

func (db *DB) CreateSubscription(req models.CreateSubscriptionRequest, userId int) (*models.Subscription, error) {
	query := `INSERT INTO subscriptions (name, category, price, billing_cycle, next_billing_date, user_id)
	          VALUES ($1, $2, $3, $4, $5, $6) 
	          RETURNING id, name, category, price, billing_cycle, next_billing_date, is_active, created_at, updated_at`

	var sub models.Subscription
	err := db.QueryRow(
		query,
		req.Name,
		req.Category,
		req.Price,
		req.BillingCycle,
		req.NextBillingDate,
		userId,
	).Scan(
		&sub.ID,
		&sub.Name,
		&sub.Category,
		&sub.Price,
		&sub.BillingCycle,
		&sub.NextBillingDate,
		&sub.IsActive,
		&sub.CreatedAt,
		&sub.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Invalidate cache after creation
	if db.cacheService != nil {
		db.cacheService.InvalidateSubscriptionsCache()
	}

	return &sub, nil
}

func (db *DB) UpdateSubscription(id int, req models.CreateSubscriptionRequest) (*models.Subscription, error) {
	query := `UPDATE subscriptions 
			  SET 
			  	name = $1, 
				category = $2,
				price = $3, 
				billing_cycle = $4, 
				next_billing_date = $5, 
				updated_at = CURRENT_TIMESTAMP 
	          WHERE id = $6 
			  RETURNING id, name, category, price, billing_cycle, next_billing_date, is_active, created_at, updated_at`

	var sub models.Subscription
	err := db.QueryRow(query, req.Name, req.Category, req.Price, req.BillingCycle, req.NextBillingDate, id).
		Scan(
			&sub.ID,
			&sub.Name,
			&sub.Category,
			&sub.Price,
			&sub.BillingCycle,
			&sub.NextBillingDate,
			&sub.IsActive,
			&sub.CreatedAt,
			&sub.UpdatedAt,
		)
	if err != nil {
		return nil, err
	}

	// Invalidate cache after update
	if db.cacheService != nil {
		db.cacheService.InvalidateSubscriptionsCache()
	}

	return &sub, nil
}

func (db *DB) DeleteSubscription(id int) error {
	query := `DELETE FROM subscriptions WHERE id = $1`
	_, err := db.Exec(query, id)

	// Invalidate cache after delete
	if db.cacheService != nil {
		db.cacheService.InvalidateSubscriptionsCache()
	}

	return err
}

func (db *DB) GetUpcomingSubscriptions() ([]models.Subscription, error) {
	query := `
		SELECT 
			s.id, 
			s.name, 
			s.category, 
			s.price, 
			s.billing_cycle, 
			s.next_billing_date, 
			s.is_active, 
			s.created_at, 
			s.updated_at,
			u.email
		FROM subscriptions s
		LEFT JOIN users u
		ON s.user_id = u.id
		WHERE s.next_billing_date <= CURRENT_DATE + INTERVAL '3 days'
		AND s.is_active = true
	`

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscriptions []models.Subscription
	for rows.Next() {
		var sub models.Subscription
		err := rows.Scan(
			&sub.ID,
			&sub.Name,
			&sub.Category,
			&sub.Price,
			&sub.BillingCycle,
			&sub.NextBillingDate,
			&sub.IsActive,
			&sub.CreatedAt,
			&sub.UpdatedAt,
			&sub.Email,
		)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, sub)
	}

	return subscriptions, nil
}

// Statistic methods
func (db *DB) GetUserSubscriptionsStats(userId int) (*models.SubscriptionStats, error) {
	query := `
		SELECT 
			(
				SELECT SUM(s.price) from subscriptions s WHERE s.user_id = $1 and s.is_active = 'true' 
			) as total_monthly,
			(
				SELECT COUNT(s.*) from subscriptions s WHERE s.user_id = $1 and s.is_active = 'true'
			) as active_count,
			(
				SELECT s.price from subscriptions s WHERE s.user_id = $1 and s.is_active = 'true' ORDER BY s.next_billing_date LIMIT 1
			) as next_payment
	`

	row := db.QueryRow(query, userId)
	var stats models.SubscriptionStats
	err := row.Scan(
		&stats.TotalMonthly,
		&stats.ActiveCount,
		&stats.NextPayment,
	)
	if err != nil {
		return nil, err
	}

	return &stats, nil
}

// User-related methods

func (db *DB) CreateUser(user models.User) (*models.User, error) {
	query := `
		INSERT INTO users (email, password_hash, name, third_party)
		VALUES ($1, $2, $3, $4)
		RETURNING id, email, name, third_party, created_at, updated_at
	`

	var currentUser models.User
	err := db.QueryRow(
		query,
		user.Email,
		user.PasswordHash,
		user.Name,
		user.ThirdParty,
	).Scan(
		&currentUser.ID,
		&currentUser.Email,
		&currentUser.Name,
		&currentUser.ThirdParty,
		&currentUser.UpdatedAt,
		&currentUser.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &currentUser, nil
}

func (db *DB) GetUserByID(id int) (*models.User, error) {
	query := `
		SELECT 
			id,
			name,
			email,
			updated_at,
			created_at
		FROM users
		WHERE
			id = $1
	`

	row := db.QueryRow(query, id)
	var user models.User
	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.UpdatedAt,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (db *DB) GetUserByEmail(email string) (*models.User, error) {
	query := `
		SELECT 
			id, 
			name, 
			password_hash,
			email, 
			third_party, 
			created_at, 
			updated_at
		FROM users
		WHERE
			email = $1
	`

	row := db.QueryRow(query, email)

	var user models.User
	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.PasswordHash,
		&user.Email,
		&user.ThirdParty,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	fmt.Println(err)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
