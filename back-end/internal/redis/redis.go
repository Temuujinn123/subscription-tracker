package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	client *redis.Client
	ctx    context.Context
}

func NewRedisClient() *RedisClient {
	host := getEnv("REDIS_HOST", "localhost")
	port := getEnv("REDIS_PORT", "6379")
	password := getEnv("REDIS_PASSWORD", "")
	db := getEnvAsInt("REDIS_DB", 0)

	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		Password: password,
		DB:       db,
	})

	ctx := context.Background()

	// Test connection
	_, err := client.Ping(ctx).Result()
	if err != nil {
		log.Printf("Failed to connect to Redis: %v", err)
		return nil
	}

	log.Println("Connected to Redis successfully")
	return &RedisClient{
		client: client,
		ctx:    ctx,
	}
}

func (r *RedisClient) Set(key string, value interface{}, expiration time.Duration) error {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.client.Set(r.ctx, key, jsonValue, expiration).Err()
}

func (r *RedisClient) Get(key string, dest interface{}) error {
	val, err := r.client.Get(r.ctx, key).Result()
	if err != nil {
		return err
	}

	return json.Unmarshal([]byte(val), dest)
}

func (r *RedisClient) Delete(key string) error {
	return r.client.Del(r.ctx, key).Err()
}

func (r *RedisClient) Exists(key string) bool {
	result, err := r.client.Exists(r.ctx, key).Result()
	return err == nil && result > 0
}

func (r *RedisClient) GetCacheTTL() time.Duration {
	ttl := getEnvAsInt("REDIS_CACHE_TTL", 3600)
	return time.Duration(ttl) * time.Second
}

func (r *RedisClient) Close() error {
	return r.client.Close()
}

// Cache key generators
func (r *RedisClient) GetUserSubscriptionsCacheKey(userID int) string {
	keyPattern := getEnv("CACHE_KEY_USER_SUBSCRIPTIONS", "subscriptions:user:%d")
	return fmt.Sprintf(keyPattern, userID)
}

func (r *RedisClient) GetUserStatsCacheKey(userID int) string {
	keyPattern := getEnv("CACHE_KEY_USER_STATS", "stats:user:%d")
	return fmt.Sprintf(keyPattern, userID)
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
