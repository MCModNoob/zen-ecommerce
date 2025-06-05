import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { Category } from "@/sanity.types";

export const getAllCategories = async (): Promise<Category[]> => {
    const All_CATEGORIES_QUERY = defineQuery(`
    *[
        _type == "category"
    ] | order(name asc)
    `);

    try {
        const allCategories = await sanityFetch({
            query: All_CATEGORIES_QUERY,
        });

        return allCategories.data || [];

    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};