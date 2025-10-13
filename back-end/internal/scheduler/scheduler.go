package scheduler

import (
	"log"
	"os"
	"time"

	"subscription-tracker/internal/database"
	"subscription-tracker/internal/email"

	"github.com/robfig/cron/v3"
)

func InitScheduler(db *database.DB) {
	c := cron.New()

	// Check for upcoming subscriptions every day at 12 AM
	c.AddFunc("49 19 * * *", func() {
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

	// Initialize email service
	sendInterval := 5 * time.Second

	emailConfig := email.EmailConfig{
		SMTPHost:     "smtp.gmail.com",
		SMTPPort:     465,
		SMTPUser:     os.Getenv("SMTP_USER"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
		FromEmail:    os.Getenv("SMTP_FROM"),
	}

	emailService := email.NewEmailService(emailConfig)

	for _, sub := range subscriptions {
		err := emailService.SendSubscriptionAlert(sub)
		if err != nil {
			log.Printf("Failed to send alert for subscription %s: %v", sub.Name, err)
		}

		time.Sleep(sendInterval)
	}
}
