package models

type Database interface {
	GetAllSubscriptions() ([]Subscription, error)
	GetSubscriptionByID(id int) (*Subscription, error)
	CreateSubscription(req CreateSubscriptionRequest) (*Subscription, error)
	UpdateSubscription(id int, req CreateSubscriptionRequest) (*Subscription, error)
	DeleteSubscription(id int) error
	GetUpcomingSubscriptions() ([]Subscription, error)

	CreateUser(user User) (*User, error)
	GetUserByID(id int) (*User, error)
	GetUserByEmail(email string) (*User, error)
	Close() error
}
