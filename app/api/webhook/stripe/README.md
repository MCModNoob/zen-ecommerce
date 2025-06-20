# Stripe Webhook Integration

This webhook handles Stripe payment events for the ecommerce_web_zen application.

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SANITY_API_TOKEN=your_sanity_api_token
```

### 2. Stripe Webhook Configuration

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. For local development:
   - Use a tool like [ngrok](https://ngrok.com/) to expose your local server
   - Set the webhook URL to `https://your-ngrok-url.ngrok.io/api/webhook/stripe`
4. For production:
   - Set the webhook URL to `https://your-domain.com/api/webhook/stripe`
5. Select the following events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
6. Copy the signing secret and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Webhook Functionality

This webhook currently handles the following events:

### `checkout.session.completed`

When a checkout session is completed:
1. The webhook retrieves the session details including line items
2. Updates the corresponding order in Sanity with:
   - Status: 'paid'
   - Stripe Customer ID
   - Stripe Payment Intent ID

### `payment_intent.succeeded`

Currently logs the successful payment intent. You can extend this to handle additional business logic.

## Testing

To test the webhook locally:

1. Install ngrok: `npm install -g ngrok`
2. Start your Next.js application: `npm run dev`
3. In a separate terminal, start ngrok: `ngrok http 3000`
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update your Stripe webhook endpoint in the Stripe Dashboard
6. Make a test purchase on your site
7. Check the logs to verify the webhook is processing correctly

## Troubleshooting

- Check the server logs for any errors
- Verify that all environment variables are set correctly
- Ensure the Stripe webhook secret is correct
- Confirm that the Sanity API token has write permissions