"use server"
import { headers } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import stripe from '@/lib/stripe';
import Stripe from 'stripe';

import { Metadata } from '@/actions/createCheckoutSession';
import { backendClient } from '@/sanity/lib/backendClient';

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

export async function createOrderInSanity(session: Stripe.Checkout.Session) {
    const {
        id,
        amount_total,
        currency,
        metadata,
        payment_intent,
        customer,
        total_details,
    } = session;
    const { orderNumber, customerName, customerEmail, clerkUserID } = metadata as Metadata;



    const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
        id,
        {
            expand: ["data.price.product"],
        }
    );

    const sanityProducts = lineItemsWithProduct.data.map((item) => ({
        _key: crypto.randomUUID(),
        product: {
            _type: "reference",
            _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
        },
        quantity: item.quantity || 0,
    }));
    const order = await backendClient.create({
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: payment_intent,
        customerName,
        stripeCustomerId: customer,
        clerkUserID: clerkUserID,
        email: customerEmail,
        currency,
        amountDiscount: total_details?.amount_discount ? total_details.amount_discount / 100
            : 0,
        products: sanityProducts,
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString()
    })

    return order
}

