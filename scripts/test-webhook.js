// This script can be used to test the Stripe webhook locally
// Run with: node scripts/test-webhook.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
const fetch = require('node-fetch');

// Replace with your webhook secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Replace with your local webhook URL
const webhookUrl = 'http://localhost:3000/api/webhook/stripe';

// Create a mock checkout.session.completed event
async function createMockEvent() {
  // Create a test checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Test Product',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    metadata: {
      orderNumber: 'TEST-' + Math.floor(Math.random() * 1000000),
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      clerkUserID: 'test-user-id',
    },
  });

  // Create a mock event
  const event = {
    id: 'evt_test_' + Math.random().toString(36).substring(2, 15),
    object: 'event',
    api_version: '2025-05-28.basil',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: session,
    },
    type: 'checkout.session.completed',
    livemode: false,
  };

  return { event, session };
}

// Sign the payload with the webhook secret
function generateSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}

// Send the mock event to the webhook
async function sendMockWebhook() {
  try {
    const { event, session } = await createMockEvent();
    const payload = JSON.stringify(event);
    const signature = generateSignature(payload, endpointSecret);

    console.log('Sending mock webhook event:', event.type);
    console.log('Session ID:', session.id);
    console.log('Order Number:', session.metadata.orderNumber);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': signature,
      },
      body: payload,
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);
  } catch (error) {
    console.error('Error sending mock webhook:', error);
  }
}

sendMockWebhook();