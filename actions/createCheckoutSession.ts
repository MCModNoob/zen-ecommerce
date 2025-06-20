"use server"

import { imageUrlFor } from "@/lib/imageURL";
import stripe from "@/lib/stripe";
import { ProductType } from "@/sanity.types";
import { BasketItem } from "@/store/store";
import { createOrder } from "@/lib/orders";
// Remove unused imports
// import { metadata } from "next-sanity/studio";
// import { tree } from "next/dist/build/templates/app-page";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserID: string;
}

export type GroupedBasketItem = {
    product: BasketItem["product"]
    quantity: number;
}

export async function createCheckoutSession(
    items: GroupedBasketItem[],
    metadata: Metadata
) {
    try {
        const itemWithoutPrice = items.filter((item) => !item.product.price);
        if (itemWithoutPrice.length > 0) {
            throw new Error("Some items do not have a price");
        }
        //searching for existing customer by email
        const custmomers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1,
        });

        let customerId: string | undefined;
        if (custmomers.data.length > 0) {
            customerId = custmomers.data[0].id;
        }

        // Calculate total price for the order
        const totalPrice = items.reduce(
            (total, item) => total + (item.product.price || 0) * item.quantity,
            0
        );

        // Create the order in Sanity first
        await createOrder({
            items,
            metadata,
            totalPrice,
            currency: "gbp",
            status: "pending"
        });

        // Then create the Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : "always",
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            mode: "payment",
            allow_promotion_codes: true,
            success_url: `${process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
            cancel_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/basket`,
            line_items: items.map(item => ({
                price_data: {
                    currency: "gbp",
                    unit_amount: Math.round(item.product.price! * 100),
                    product_data: {
                        name: item.product.name || "Unnamed Product",
                        description: `Product ID: ${item.product._id}`,
                        metadata: {
                            id: item.product._id,
                        },
                        images: item.product.image
                            ? [imageUrlFor(item.product.image).url()]
                            : undefined,
                    },
                },
                quantity: item.quantity,
            })),
        });
        return session.url;
    } catch (error) {

        console.error("ERROR CREATING CHECKOUT SESSION", error);
        throw error;
    }
}