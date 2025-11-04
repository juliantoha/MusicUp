# Email Notifications Setup

MusicUp sends transactional emails for booking confirmations, concert reminders, and completion notifications using [Resend](https://resend.com).

## Email Types

1. **Booking Confirmation** - Sent immediately when a performer books a concert
   - Includes concert details, location, date/time, piece info
   - Links to download sheet music and audio (if available)

2. **48-Hour Reminder** - Automated reminder sent 2 days before concert
   - Sent via Vercel Cron daily at 9 AM UTC
   - Only sent to performers with `status='confirmed'` bookings
   - Includes all concert details and practice material links

3. **Completion Thank You** - Sent after admin completes a concert
   - Thanks performer for their contribution
   - Confirms 3.0 service hours credited
   - Link to view hours dashboard

## Setup Instructions

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your sending domain (or use onboarding@resend.dev for testing)
3. Get your API key from [API Keys](https://resend.com/api-keys)

### 2. Configure Environment Variables

Add these to your `.env.local`:

```bash
# Resend API Key
RESEND_API_KEY=re_your_api_key_here

# Sender email (must be verified in Resend)
FROM_EMAIL=noreply@yourdomain.com

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron secrets (generate random strings)
CRON_SECRET=your-random-secret-here
API_KEY=your-api-key-here
```

### 3. Deploy to Vercel

The `vercel.json` file configures a cron job to run daily at 9 AM UTC:

```json
{
  "crons": [
    {
      "path": "/api/cron/concert-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

After deployment:
1. Go to your Vercel project settings
2. Navigate to "Cron Jobs" tab
3. Verify the cron job is active
4. Add `CRON_SECRET` to your environment variables

### 4. Testing Emails in Development

#### Test Booking Confirmation
1. Book a concert as a performer
2. Check your email inbox
3. Verify all details are correct and links work

#### Test 48-Hour Reminder (Manual)
Use curl or Postman to trigger the cron endpoint:

```bash
curl -X POST http://localhost:3000/api/cron/concert-reminders \
  -H "X-API-Key: your-api-key-here"
```

Or visit: `http://localhost:3000/api/cron/concert-reminders?key=your-api-key-here`

#### Test Completion Email
1. Complete a concert as an admin (mark performers as "performed")
2. Check performer email inboxes
3. Verify hours are shown and dashboard link works

## Email Template Customization

Templates are located in `src/lib/email/templates.ts`:

- `bookingConfirmationTemplate()` - Booking confirmation
- `concertReminderTemplate()` - 48-hour reminder
- `completionThankYouTemplate()` - Completion thank you

Each template uses inline CSS for email client compatibility.

## Troubleshooting

### Emails not sending
1. Check `RESEND_API_KEY` is correct
2. Verify `FROM_EMAIL` is verified in Resend dashboard
3. Check server logs for error messages
4. For development, Resend allows 100 emails/day on free plan

### Cron not running
1. Verify `CRON_SECRET` environment variable is set in Vercel
2. Check Vercel Cron Jobs dashboard for execution logs
3. Ensure deployment was successful
4. Check that `vercel.json` is in project root

### Wrong concert date in reminders
1. Cron runs daily at 9 AM UTC
2. Finds concerts scheduled for (now + 48 hours)
3. Only sends to bookings with `status='confirmed'`
4. Check your concert `scheduled_date` is correct

## Production Considerations

### Email Deliverability
- Use a verified domain (not onboarding@resend.dev)
- Add SPF, DKIM, and DMARC records
- Monitor bounce rates in Resend dashboard

### Rate Limits
- Resend free plan: 100 emails/day
- Resend Pro plan: 50,000 emails/month
- Consider batching for large concerts

### Monitoring
- Check Vercel Cron logs regularly
- Monitor Resend dashboard for delivery issues
- Set up error alerts for email failures

## API Reference

### Email Functions

All functions are located in `src/lib/email/actions.ts`:

**sendBookingConfirmationEmail(bookingId: string)**
- Sends booking confirmation to performer
- Called automatically after booking creation
- Returns `{ success: true, emailId: string }` or `{ error: string }`

**sendConcertReminderEmail(bookingId: string)**
- Sends 48-hour reminder to performer
- Called by cron job for upcoming concerts
- Returns `{ success: true, emailId: string }` or `{ error: string }`

**sendCompletionThankYouEmail(performerId: string, concertId: string)**
- Sends thank you with hours credited
- Called automatically when concert is completed
- Returns `{ success: true, emailId: string }` or `{ error: string }`

### Cron Endpoint

**GET/POST /api/cron/concert-reminders**
- Finds all confirmed bookings for concerts in ~48 hours
- Sends reminder emails to all matching performers
- Requires `Authorization: Bearer {CRON_SECRET}` header
- Returns summary of emails sent

Example response:
```json
{
  "success": true,
  "message": "Sent 12 reminders",
  "total": 12,
  "successful": 12,
  "failed": 0,
  "targetDate": "2025-12-25"
}
```

## Development vs Production

### Development
- Use `onboarding@resend.dev` as FROM_EMAIL
- Resend test mode (emails go to your account only)
- Manual cron testing via POST endpoint

### Production
- Verify custom domain
- Set up proper DNS records
- Use Vercel Cron for automated reminders
- Monitor delivery rates and errors
