package scheduler

import (
	"log"
	"os"
	"time"

	"subscription-tracker/internal/database"
	"subscription-tracker/internal/email"

	"github.com/resend/resend-go/v2"
	"github.com/robfig/cron/v3"
)

func InitScheduler(db *database.DB) {
	c := cron.New()

	// Check for upcoming subscriptions every day at 12 AM
	c.AddFunc("00 00 * * *", func() {
		log.Println("Checking for upcoming subscriptions...")
		CheckUpcomingSubscriptions(db)
	})

	c.Start()
	log.Println("Scheduler started")
}

func CheckUpcomingSubscriptions(db *database.DB) {
	subscriptions, err := db.GetUpcomingSubscriptions()
	if err != nil {
		log.Printf("Error fetching upcoming subscriptions: %v", err)
		return
	}

	// Initialize email service
	sendInterval := 5 * time.Second

	apiKey := os.Getenv("RESEND_API_KEY")

	client := resend.NewClient(apiKey)

	emailService := email.NewEmailService(client, "noreply@subtrack.sbs")

	for _, sub := range subscriptions {
		err := emailService.SendSubscriptionAlert(sub)
		if err != nil {
			log.Printf("Failed to send alert for subscription %s: %v", sub.Name, err)
		}

		time.Sleep(sendInterval)
	}

	errUpdate := db.UpdateUpcomingSubscription()
	if errUpdate != nil {
		log.Printf("Error updating upcoming subscriptions: %v", err)
		return
	}
}
