package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"subscription-tracker/internal/cache"
	"subscription-tracker/internal/database"
	"subscription-tracker/internal/handlers"
	"subscription-tracker/internal/middleware"
	"subscription-tracker/internal/redis"
	"subscription-tracker/internal/scheduler"
	"subscription-tracker/internal/worker"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func main() {
	// Initialize .env
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize Redis
	redisClient := redis.NewRedisClient()
	if redisClient == nil {
		log.Println("Redis not available, running without cache")
	}

	// Initialize cache service
	var cacheService *cache.CacheService
	if redisClient != nil {
		cacheService = cache.NewCacheService(redisClient, nil)
		defer redisClient.Close()
	}

	// Initialize database
	db, err := database.InitDB(cacheService)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Update cache service with database reference
	if cacheService != nil {
		cacheService = cache.NewCacheService(redisClient, db)
	}

	// Initialize cache worker
	var cacheWorker *worker.CacheWorker
	if cacheService != nil {
		cacheWorker = worker.NewCacheWorker(cacheService, db)
		cacheWorker.Start()
		defer cacheWorker.Stop()
	}

	// Initialize scheduler for email alerts
	scheduler.InitScheduler(db)

	// GoogleOAuth
	googleOauthConfig := &oauth2.Config{
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}

	// Set up routes
	router := mux.NewRouter()
	basePath := "/api/v1"

	// Public routes
	router.HandleFunc(basePath+"/register", handlers.Register(db)).Methods("POST")
	router.HandleFunc(basePath+"/login", handlers.Login(db)).Methods("POST")
	router.HandleFunc(basePath+"/auth/google", handlers.AuthGoogle(db, googleOauthConfig)).Methods("POST")
	router.HandleFunc(basePath+"/refresh", handlers.GenerateAccessToken(db)).Methods("POST")

	// Protected routes (require authentication)
	authRouter := router.PathPrefix("/").Subrouter()
	authRouter.Use(middleware.AuthMiddleware(db))

	// Porotected routes
	authRouter.HandleFunc(basePath+"/subscriptions/stats", handlers.GetUserSubscriptionsStats(db)).Methods("GET")
	authRouter.HandleFunc(basePath+"/detail", handlers.GetUserDetail(db)).Methods("GET")
	authRouter.HandleFunc(basePath+"/subscriptions", handlers.GetSubscriptions(db, cacheService)).Methods("GET")
	authRouter.HandleFunc(basePath+"/subscriptions", handlers.CreateSubscription(db)).Methods("POST")
	authRouter.HandleFunc(basePath+"/subscriptions/{id}", handlers.GetSubscription(db)).Methods("GET")
	authRouter.HandleFunc(basePath+"/subscriptions/{id}", handlers.UpdateSubscription(db)).Methods("PUT")
	authRouter.HandleFunc(basePath+"/subscriptions/{id}", handlers.DeleteSubscription(db)).Methods("DELETE")

	// Cache management endpoints (for debugging)
	if cacheService != nil {
		router.HandleFunc("/cache/clear", func(w http.ResponseWriter, r *http.Request) {
			err := cacheService.InvalidateSubscriptionsCache()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write([]byte("Cache cleared successfully"))
		}).Methods("POST")
	}

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://subscription-tracker-6l63s08l4-temuujinn123s-projects.vercel.app", "https://subscription-tracker-gamma.vercel.app"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "X-Requested-With"},
		AllowCredentials: true,
		MaxAge:           3600,
		Debug:            os.Getenv("ENV") == "development", // Enable debug in development
	})

	// Wrap the router with CORS middleware
	handler := c.Handler(router)

	// Start server
	server := &http.Server{
		Addr:         ":8080",
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	log.Println("Server starting on :8080")
	log.Fatal(server.ListenAndServe())
}
