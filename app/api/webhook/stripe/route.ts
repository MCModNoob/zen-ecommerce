import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import Stripe from 'stripe';
import { updateOrder } from '@/lib/orders';

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      console.error('Missing signature or endpoint secret');
      return new NextResponse('Webhook signature verification failed', { status: 400 });
    }
    
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      
      // Retrieve the session with line items
      const expandedSession = await stripe.checkout.sessions.retrieve(
        checkoutSession.id,
        { expand: ['line_items', 'line_items.data.price.product'] }
      );
      
      if (!expandedSession.metadata?.orderNumber) {
        console.error('No order number found in session metadata');
        return new NextResponse('No order number found', { status: 400 });
      }

      // Update the order in Sanity
      await updateOrder({
        orderNumber: expandedSession.metadata.orderNumber,
        updates: {
          status: 'paid',
          stripeCustomerId: expandedSession.customer as string,
          stripePaymentIntentId: expandedSession.payment_intent as string,
        }
      });
      
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('Webhook received', { status: 200 });
}

// The updateOrder function is now imported from @/lib/orders