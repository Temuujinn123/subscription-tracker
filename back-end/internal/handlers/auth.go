package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"subscription-tracker/internal/models"
	"subscription-tracker/internal/utils"

	"golang.org/x/oauth2"
)

func Register(db models.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.RegisterReq
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Check if user already exist
		existingUser, _ := db.GetUserByEmail(req.Email)

		if existingUser != nil {
			http.Error(w, "User already exist", http.StatusConflict)
			return
		}

		// Create password hash
		passwordHash, err := utils.HashPassword(req.Password)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}

		// Create user
		user := models.User{
			Email:        req.Email,
			Name:         req.Name,
			PasswordHash: passwordHash,
		}

		createdUser, err := db.CreateUser(user)
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		// Generate token
		token, err := utils.GenerateJWT(*createdUser)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		refreshToken, err := utils.GenerateRefreshJWT(*createdUser)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		setHTTPCookie(w, refreshToken)

		response := models.AuthResponse{
			Message: "User registered successfully",
			Token:   token,
			User:    *createdUser,
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(response)
	}
}

func Login(db models.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Getting user by email
		user, err := db.GetUserByEmail(req.Email)
		if err != nil {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// Checking password
		if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// Generate token
		token, err := utils.GenerateJWT(*user)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		refreshToken, err := utils.GenerateRefreshJWT(*user)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		setHTTPCookie(w, refreshToken)

		response := models.AuthResponse{
			Message: "Login Successful",
			Token:   token,
			User:    *user,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func AuthGoogle(db models.Database, googleOauthConfig *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Code string `json:"code"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Exchange authorization code for tokens
		googleToken, err := googleOauthConfig.Exchange(context.Background(), req.Code)
		if err != nil {
			http.Error(w, "Failed to exchange token", http.StatusBadRequest)
			return
		}

		// Get user info from Google
		client := googleOauthConfig.Client(context.Background(), googleToken)
		resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
		if err != nil {
			http.Error(w, "Failed to get user info", http.StatusBadRequest)
			return
		}
		defer resp.Body.Close()

		var googleUser models.GoogleUser
		if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
			http.Error(w, "Failed to decode user info", http.StatusBadRequest)
			return
		}

		// Get user by email
		user, _ := db.GetUserByEmail(googleUser.Email)
		// if err != nil {
		// 	http.Error(w, "Failed to get user", http.StatusInternalServerError)
		// 	return
		// }

		// Create user
		if user == nil {
			var newUser models.User
			newUser.Email = googleUser.Email
			newUser.Name = googleUser.Name
			newUser.PasswordHash = ""
			newUser.ThirdParty = "google"

			createdUser, err := db.CreateUser(newUser)
			if err != nil {
				http.Error(w, "Failed to create user", http.StatusInternalServerError)
				return
			}

			user = createdUser
		}

		// User not registered by google auth
		if user.ThirdParty != "google" {
			http.Error(w, "Email already in use", http.StatusBadRequest)
			return
		}

		// Generate token
		token, err := utils.GenerateJWT(*user)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		// Generate token
		refreshToken, err := utils.GenerateRefreshJWT(*user)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		setHTTPCookie(w, refreshToken)

		response := models.AuthResponse{
			Message: "Login Successful",
			Token:   token,
			User:    *user,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func GetUserDetail(db models.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := r.Context().Value("user").(*models.User)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	}
}

func setHTTPCookie(w http.ResponseWriter, refreshToken string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    refreshToken,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: false,
		Secure:   false,
		// Secure:   os.Getenv("ENV") == "production",
		// SameSite: http.SameSiteLaxMode,
		SameSite: http.SameSiteNoneMode,
	})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    "/",
		Path:     "/api/v1/refresh",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("Logout successfull")
}

func GenerateAccessToken(db models.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("refreshToken")
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		claims, err := utils.ValidateJWT(cookie.Value)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		user, err := db.GetUserByID(claims.UserID)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		token, err := utils.GenerateJWT(*user)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		response := models.AccessTokenResponse{
			Message: "Login Successful",
			Token:   token,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
