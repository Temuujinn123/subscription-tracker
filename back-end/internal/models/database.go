package models

type Database interface {
	GetUserSubscriptions(userId int) ([]Subscription, error)
	GetSubscriptionByID(id int) (*Subscription, error)
	CreateSubscription(req CreateSubscriptionRequest, userId int) (*Subscription, error)
	UpdateSubscription(id int, req CreateSubscriptionRequest) (*Subscription, error)
	DeleteSubscription(id int) error
	GetUpcomingSubscriptions() ([]Subscription, error)

	GetUserSubscriptionsStats(userId int) (*SubscriptionStats, error)

	CreateUser(user User) (*User, error)
	GetUserByID(id int) (*User, error)
	GetUserByEmail(email string) (*User, error)
	Close() error
}
