package cache

import (
	"log"

	"subscription-tracker/internal/models"
	"subscription-tracker/internal/redis"
)

type CacheService struct {
	redisClient *redis.RedisClient
	db          models.Database
}

func NewCacheService(redisClient *redis.RedisClient, db models.Database) *CacheService {
	return &CacheService{
		redisClient: redisClient,
		db:          db,
	}
}

// Subscription caching methods
func (c *CacheService) CacheUserSubscriptions(userID int, subscriptions []models.Subscription) error {
	cacheKey := c.redisClient.GetUserSubscriptionsCacheKey(userID)
	ttl := c.redisClient.GetCacheTTL()

	err := c.redisClient.Set(cacheKey, subscriptions, ttl)
	if err != nil {
		log.Printf("Failed to cache user subscriptions: %v", err)
		return err
	}

	log.Printf("Cached %d subscriptions for user %d", len(subscriptions), userID)
	return nil
}

func (c *CacheService) GetCachedUserSubscriptions(userID int) ([]models.Subscription, error) {
	cacheKey := c.redisClient.GetUserSubscriptionsCacheKey(userID)
	var subscriptions []models.Subscription

	err := c.redisClient.Get(cacheKey, &subscriptions)
	if err != nil {
		return nil, err
	}

	return subscriptions, nil
}

func (c *CacheService) CacheUserStats(userID int, stats *models.SubscriptionStats) error {
	cacheKey := c.redisClient.GetUserStatsCacheKey(userID)
	ttl := c.redisClient.GetCacheTTL()

	err := c.redisClient.Set(cacheKey, stats, ttl)
	if err != nil {
		log.Printf("Failed to cache user stats: %v", err)
		return err
	}

	log.Printf("Cached stats for user %d", userID)
	return nil
}

func (c *CacheService) GetCachedUserStats(userID int) (*models.SubscriptionStats, error) {
	cacheKey := c.redisClient.GetUserStatsCacheKey(userID)
	var stats *models.SubscriptionStats

	err := c.redisClient.Get(cacheKey, &stats)
	if err != nil {
		return nil, err
	}

	return stats, nil
}

// Invalidation methods
func (c *CacheService) InvalidateUserSubscriptionsCache(userID int) error {
	cacheKey := c.redisClient.GetUserSubscriptionsCacheKey(userID)
	return c.redisClient.Delete(cacheKey)
}

func (c *CacheService) InvalidateUserStatsCache(userID int) error {
	cacheKey := c.redisClient.GetUserStatsCacheKey(userID)
	return c.redisClient.Delete(cacheKey)
}

func (c *CacheService) InvalidateUserSubscriptionsAndStatsCache(userID int) error {
	cacheKey := c.redisClient.GetUserSubscriptionsCacheKey(userID)
	err := c.redisClient.Delete(cacheKey)
	if err != nil {
		return err
	}

	cacheKey = c.redisClient.GetUserStatsCacheKey(userID)
	err = c.redisClient.Delete(cacheKey)

	return err
}

// Check if cache exists
func (c *CacheService) HasUserSubscriptionsCache(userID int) bool {
	cacheKey := c.redisClient.GetUserSubscriptionsCacheKey(userID)
	return c.redisClient.Exists(cacheKey)
}

func (c *CacheService) HasUserStatsCache(userID int) bool {
	cacheKey := c.redisClient.GetUserStatsCacheKey(userID)
	return c.redisClient.Exists(cacheKey)
}
