package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"subscription-tracker/internal/cache"
	"subscription-tracker/internal/models"

	"github.com/gorilla/mux"
)

func GetSubscriptions(db models.Database, cacheService *cache.CacheService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := r.Context().Value("user").(*models.User)

		// Checking if subsciptions in cache
		if cacheService != nil && cacheService.HasUserSubscriptionsCache(user.ID) {
			cachedSubscriptions, err := cacheService.GetCachedUserSubscriptions(user.ID)
			if err == nil {
				w.Header().Set("X-Cache", "HIT")
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(cachedSubscriptions)
				return
			}
		}

		subscriptions, err := db.GetUserSubscriptions(user.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Cache the result for future requests
		if cacheService != nil {
			go func() {
				err := cacheService.CacheUserSubscriptions(user.ID, subscriptions)
				if err != nil {
					log.Printf("Failed to cache subscriptions: %v", err)
				}
			}()
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(subscriptions)
	}
}

func CreateSubscription(db models.Database, cacheService *cache.CacheService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.CreateSubscriptionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		user := r.Context().Value("user").(*models.User)

		subscription, err := db.CreateSubscription(req, user.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//		cacheService.InvalidateUserSubscriptionsAndStatsCache(user.ID)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(subscription)
	}
}

func GetSubscription(db models.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		subscription, err := db.GetSubscriptionByID(id)
		if err != nil {
			http.Error(w, "Subscription not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(subscription)
	}
}

func UpdateSubscription(db models.Database, cacheService *cache.CacheService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		var req models.CreateSubscriptionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		subscription, err := db.UpdateSubscription(id, req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//		cacheService.InvalidateUserSubscriptionsAndStatsCache(id)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(subscription)
	}
}

func DeleteSubscription(db models.Database, cacheService *cache.CacheService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := r.Context().Value("user").(*models.User)

		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		err = db.DeleteSubscription(id, user.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//		cacheService.InvalidateUserSubscriptionsAndStatsCache(id)

		w.WriteHeader(http.StatusNoContent)
	}
}

func GetUserSubscriptionsStats(db models.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := r.Context().Value("user").(*models.User)

		// Checking if subsciptions in cache
		// if cacheService != nil && cacheService.HasUserSubscriptionsCache(user.ID) {
		// 	cachedSubscriptions, err := cacheService.GetCachedUserSubscriptions(user.ID)
		// 	if err == nil {
		// 		w.Header().Set("X-Cache", "HIT")
		// 		w.Header().Set("Content-Type", "application/json")
		// 		json.NewEncoder(w).Encode(cachedSubscriptions)
		// 		return
		// 	}
		// }

		stats, err := db.GetUserSubscriptionsStats(user.ID)
		println(err)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Cache the result for future requests
		// if cacheService != nil {
		// 	go func() {
		// 		err := cacheService.CacheAllSubscriptions(subscriptions)
		// 		if err != nil {
		// 			log.Printf("Failed to cache subscriptions: %v", err)
		// 		}
		// 	}()
		// }

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
	}
}
