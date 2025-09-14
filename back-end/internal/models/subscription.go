package models

import (
	"time"
)

type Subscription struct {
	ID              int       `json:"id"`
	Name            string    `json:"name"`
	Price           float64   `json:"price"`
	BillingCycle    string    `json:"billingCycle"` // monthly, yearly, etc.
	NextBillingDate time.Time `json:"nextBillingDate"`
	Email           string    `json:"email"`
	Category        string    `json:"category"`
	IsActive        bool      `json:"isActive"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type CreateSubscriptionRequest struct {
	Name            string  `json:"name" validate:"required"`
	Price           float64 `json:"price" validate:"required,gt=0"`
	Category        string  `json:"category" validate:"required"`
	BillingCycle    string  `json:"billingCycle" validate:"required,oneof=monthly yearly weekly"`
	NextBillingDate string  `json:"nextBillingDate" validate:"required"`
}
