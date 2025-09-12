package scheduler

import (
	"log"
	"subscription-tracker/internal/database"
	"subscription-tracker/internal/email"

	"github.com/robfig/cron/v3"
)

func InitScheduler(db *database.DB) {
	c := cron.New()

	// Check for upcoming subscriptions every day at 9 AM
	c.AddFunc("0 9 * * *", func() {
		log.Println("Checking for upcoming subscriptions...")
		checkUpcomingSubscriptions(db)
	})

	c.Start()
	log.Println("Scheduler started")
}

func checkUpcomingSubscriptions(db *database.DB) {
	subscriptions, err := db.GetUpcomingSubscriptions()
	if err != nil {
		log.Printf("Error fetching upcoming subscriptions: %v", err)
		return
	}

	// Initialize email service (configure with your SMTP settings)
	emailConfig := email.EmailConfig{
		SMTPHost:     "smtp.gmail.com",
		SMTPPort:     587,
		SMTPUser:     "your-email@gmail.com",
		SMTPPassword: "your-app-password",
		FromEmail:    "your-email@gmail.com",
	}

	emailService := email.NewEmailService(emailConfig)

	for _, sub := range subscriptions {
		err := emailService.SendSubscriptionAlert(sub)
		if err != nil {
			log.Printf("Failed to send alert for subscription %s: %v", sub.Name, err)
		}
	}
}