import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { ProductType } from "@/sanity.types";

export const getAllProducts = async (): Promise<ProductType[]> => {
    const All_PRODUCTS_QUERY = defineQuery(`
    *[
        _type == "productType"
    ] | order(name asc)
    `);

    try {
        const allProducts = await sanityFetch({
            query: All_PRODUCTS_QUERY,
        });

        return allProducts.data || [];

    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};