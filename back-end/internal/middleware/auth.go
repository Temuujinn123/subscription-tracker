package middleware

import (
	"context"
	"net/http"
	"strings"
	"subscription-tracker/internal/models"
	"subscription-tracker/internal/utils"
)

func AuthMiddleware(db models.Database) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get token from authorization header
			authHeaer := r.Header.Get("Authorization")
			if authHeaer == "" {
				http.Error(w, "Authorization header required", http.StatusUnauthorized)
				return
			}

			// Check if the header has Bearer format
			parts := strings.Split(authHeaer, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Authorization header format must be: Bearer {token}", http.StatusUnauthorized)
				return
			}

			tokenString := parts[1]

			claims, err := utils.ValidateJWT(tokenString)
			if err != nil {
				http.Error(w, "Invalid token", http.StatusUnauthorized)
				return
			}

			// Get user form db
			user, err := db.GetUserByID(claims.UserID)
			if err != nil {
				http.Error(w, "Invalid token", http.StatusUnauthorized)
				return
			}

			// Add user to context
			ctx := context.WithValue(r.Context(), "user", user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
