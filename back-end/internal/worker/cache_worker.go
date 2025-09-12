package worker

import (
	"context"
	"log"
	"subscription-tracker/internal/cache"
	"subscription-tracker/internal/models"
	"time"
)

type CacheWorker struct {
	cacheService *cache.CacheService
	db           models.Database
	ctx          context.Context
	cancel       context.CancelFunc
}

func NewCacheWorker(cacheService *cache.CacheService, db models.Database) *CacheWorker {
	ctx, cancel := context.WithCancel(context.Background())
	return &CacheWorker{
		cacheService: cacheService,
		db:           db,
		ctx:          ctx,
		cancel:       cancel,
	}
}

func (w *CacheWorker) Start() {
	log.Println("Starting cache worker...")

	// Initial cache warm-up
	w.warmUpCache()

	// Start periodic cache refresh
	go w.periodicCacheRefresh(5 * time.Minute) // Refresh every 5 minutes

	// Start cache invalidation listener
	go w.cacheInvalidationListener()
}

func (w *CacheWorker) Stop() {
	w.cancel()
	log.Println("Cache worker stopped")
}

func (w *CacheWorker) warmUpCache() {
	log.Println("Warming up cache...")

	// Cache all subscriptions
	subscriptions, err := w.db.GetAllSubscriptions()
	if err != nil {
		log.Printf("Failed to warm up subscriptions cache: %v", err)
		return
	}

	err = w.cacheService.CacheAllSubscriptions(subscriptions)
	if err != nil {
		log.Printf("Failed to cache subscriptions during warm-up: %v", err)
	}
}

func (w *CacheWorker) periodicCacheRefresh(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-w.ctx.Done():
			return
		case <-ticker.C:
			w.refreshCache()
		}
	}
}

func (w *CacheWorker) refreshCache() {
	log.Println("Refreshing cache...")

	// Get fresh data from database
	subscriptions, err := w.db.GetAllSubscriptions()
	if err != nil {
		log.Printf("Failed to refresh subscriptions cache: %v", err)
		return
	}

	// Update cache
	err = w.cacheService.CacheAllSubscriptions(subscriptions)
	if err != nil {
		log.Printf("Failed to update subscriptions cache: %v", err)
		return
	}

	log.Printf("Cache refreshed successfully. Cached %d subscriptions", len(subscriptions))
}

func (w *CacheWorker) cacheInvalidationListener() {
	// This is a simplified version. In production, you might want to use:
	// 1. PostgreSQL LISTEN/NOTIFY for database changes
	// 2. Redis pub/sub for distributed cache invalidation
	// 3. Database triggers

	// For now, we'll use periodic checking with a shorter interval
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	lastCheck := time.Now()

	for {
		select {
		case <-w.ctx.Done():
			return
		case <-ticker.C:
			w.checkForDatabaseChanges(lastCheck)
			lastCheck = time.Now()
		}
	}
}

func (w *CacheWorker) checkForDatabaseChanges(since time.Time) {
	// Check if any subscriptions were modified since last check
	// This is a simplified implementation
	// In production, you might want to add a "last_modified" column to your table

	// For demonstration, we'll just refresh the cache if it's been a while
	// or if we detect significant changes
	w.refreshCache()
}

// Manual cache invalidation methods
func (w *CacheWorker) InvalidateSubscriptionsCache() {
	err := w.cacheService.InvalidateSubscriptionsCache()
	if err != nil {
		log.Printf("Failed to invalidate subscriptions cache: %v", err)
	} else {
		log.Println("Subscriptions cache invalidated")
	}
}

func (w *CacheWorker) InvalidateUserSubscriptionsCache(userID int) {
	err := w.cacheService.InvalidateUserSubscriptionsCache(userID)
	if err != nil {
		log.Printf("Failed to invalidate user subscriptions cache: %v", err)
	} else {
		log.Printf("User %d subscriptions cache invalidated", userID)
	}
}
