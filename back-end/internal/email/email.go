package email

import (
	"fmt"
	"log"

	"subscription-tracker/internal/models"

	"github.com/resend/resend-go/v2"
)

type EmailConfig struct {
	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	FromEmail    string
}

type EmailService struct {
	client    *resend.Client
	fromEmail string
}

func NewEmailService(client *resend.Client, fromEmail string) *EmailService {
	return &EmailService{
		client:    client,
		fromEmail: fromEmail,
	}
}

func (es *EmailService) SendSubscriptionAlert(sub models.Subscription) error {
	subject := fmt.Sprintf("Upcoming Subscription: %s", sub.Name)
	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Due</title>
</head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;background:#f4f4f4">
    <div style="max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
        <h2 style="color:#333;margin-top:0">Hello,</h2>
        <p>Your subscription for <strong>%s</strong> is due on <strong>%s</strong>.</p>
        <p><strong>Amount:</strong> $%.2f</p>
        <p><strong>Billing Cycle:</strong> %s</p>
        <hr style="border:none;border-top:1px solid #eee;margin:30px 0">
        <p style="color:#666;margin:0">Thank you,<br><strong>Subscription Tracker</strong></p>
    </div>
</body>
</html>
`, sub.Name, sub.NextBillingDate.Format("2006-01-02"),
		sub.Price, sub.BillingCycle)

	params := &resend.SendEmailRequest{
		From:    es.fromEmail,
		To:      []string{sub.Email},
		Html:    body,
		Subject: subject,
	}

	_, err := es.client.Emails.Send(params)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	log.Printf("Email alert sent to %s for subscription %s", sub.Email, sub.Name)
	return nil
}
