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
func (c *CacheService) CacheAllSubscriptions(subscriptions []models.Subscription) error {
	cacheKey := c.redisClient.GetSubscriptionsCacheKey()
	ttl := c.redisClient.GetCacheTTL()

	err := c.redisClient.Set(cacheKey, subscriptions, ttl)
	if err != nil {
		log.Printf("Failed to cache subscriptions: %v", err)
		return err
	}

	log.Printf("Cached %d subscriptions with key: %s", len(subscriptions), cacheKey)
	return nil
}

func (c *CacheService) GetCachedSubscriptions() ([]models.Subscription, error) {
	cacheKey := c.redisClient.GetSubscriptionsCacheKey()
	var subscriptions []models.Subscription

	err := c.redisClient.Get(cacheKey, &subscriptions)
	if err != nil {
		return nil, err
	}

	return subscriptions, nil
}

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

// Invalidation methods
func (c *CacheService) InvalidateSubscriptionsCache() error {
	cacheKey := c.redisClient.GetSubscriptionsCacheKey()
	return c.redisClient.Delete(cacheKey)
}

func (c *CacheService) InvalidateUserSubscriptionsCache(userID int) error {
	cacheKey := c.redisClient.GetUserSubscriptionsCacheKey(userID)
	return c.redisClient.Delete(cacheKey)
}

// Check if cache exists
func (c *CacheService) HasSubscriptionsCache() bool {
	cacheKey := c.redisClient.GetSubscriptionsCacheKey()
	return c.redisClient.Exists(cacheKey)
}

func (c *CacheService) HasUserSubscriptionsCache(userID int) bool {
	cacheKey := c.redisClient.GetUserSubscriptionsCacheKey(userID)
	return c.redisClient.Exists(cacheKey)
}
