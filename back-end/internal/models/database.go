package models

type Database interface {
	GetUserSubscriptions(userID int) ([]Subscription, error)
	GetSubscriptionByID(id int) (*Subscription, error)
	CreateSubscription(req CreateSubscriptionRequest, userID int) (*Subscription, error)
	UpdateSubscription(id int, req CreateSubscriptionRequest) (*Subscription, error)
	DeleteSubscription(id int, userID int) error
	GetUpcomingSubscriptions() ([]Subscription, error)

	GetUserSubscriptionsStats(userID int) (*SubscriptionStats, error)

	CreateUser(user User) (*User, error)
	GetUserByID(id int) (*User, error)
	GetUserByEmail(email string) (*User, error)
	Close() error
}
