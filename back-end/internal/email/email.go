package email

import (
	"fmt"
	"log"

	"subscription-tracker/internal/models"

	"gopkg.in/gomail.v2"
)

type EmailConfig struct {
	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	FromEmail    string
}

type EmailService struct {
	config EmailConfig
	dialer *gomail.Dialer
}

func NewEmailService(config EmailConfig) *EmailService {
	return &EmailService{
		config: config,
		dialer: gomail.NewDialer(config.SMTPHost, config.SMTPPort,
			config.SMTPUser, config.SMTPPassword),
	}
}

func (es *EmailService) SendSubscriptionAlert(sub models.Subscription) error {
	subject := fmt.Sprintf("Upcoming Subscription: %s", sub.Name)
	body := fmt.Sprintf(`
	Hello,

	Your subscription for %s is due on %s.
	Amount: $%.2f
	Billing Cycle: %s

	Thank you,
	Subscription Tracker
	`, sub.Name, sub.NextBillingDate.Format("2006-01-02"),
		sub.Price, sub.BillingCycle)

	m := gomail.NewMessage()
	m.SetHeader("From", es.config.FromEmail)
	m.SetHeader("To", sub.Email)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", body)

	if err := es.dialer.DialAndSend(m); err != nil {
		log.Printf("Failed to send email to %s: %v", sub.Email, err)
		return err
	}

	log.Printf("Email alert sent to %s for subscription %s", sub.Email, sub.Name)
	return nil
}
