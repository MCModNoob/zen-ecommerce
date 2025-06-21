"use server"
import { headers } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import stripe from '@/lib/stripe';
import Stripe from 'stripe';

import { createOrderInSanity } from '@/sanity/lib/orders/createOrderInSanity';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
        return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const webhooksecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhooksecret) {
        console.error('Missing stripe webhook secret, its not set')
        return NextResponse.json(
            { error: "stripe webhook secret is not set" },
            { status: 400 }
        )
    }
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhooksecret);
    } catch (err) {
        return NextResponse.json(
            { error: `webhook error:${err}` }, { status: 400 });
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        try {
            const order = await createOrderInSanity(session);
            console.log("Order created in Sanity:", order)
        } catch (err) {
            return NextResponse.json(
                { error: "Error creating order" ,err},
                { status: 500 },
            );
        }
    }
    return NextResponse.json({ received: true });
}

