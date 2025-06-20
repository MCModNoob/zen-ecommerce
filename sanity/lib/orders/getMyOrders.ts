import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";


export const getMyOrders = async(userId: string): Promise<MY_ORDERS_QUERYResult> =>{

    if (!userId) {
        throw new Error("User ID is required");
    }

    const MY_ORDERS_QUERY = defineQuery(`
            *[_type == "order" && clerkUserID == $userId] | order(orderDate desc){
                ...,
                products[]{
                    ...,
                    product->
                }
            }
        `)

    try {
        const myOrders = await sanityFetch({
            query: MY_ORDERS_QUERY,
            params: { userId }
        });

        return myOrders.data || [];

    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}