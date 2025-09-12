package models

import (
	"time"
)

type Subscription struct {
	ID              int       `json:"id"`
	Name            string    `json:"name"`
	Price           float64   `json:"price"`
	BillingCycle    string    `json:"billing_cycle"` // monthly, yearly, etc.
	NextBillingDate time.Time `json:"next_billing_date"`
	Email           string    `json:"email"`
	IsActive        bool      `json:"is_active"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type CreateSubscriptionRequest struct {
	Name            string    `json:"name" validate:"required"`
	Price           float64   `json:"price" validate:"required,gt=0"`
	BillingCycle    string    `json:"billing_cycle" validate:"required,oneof=monthly yearly weekly daily"`
	NextBillingDate time.Time `json:"next_billing_date" validate:"required"`
	Email           string    `json:"email" validate:"required,email"`
}
