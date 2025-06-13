import { defineQuery } from 'next-sanity'
import React from 'react'
import { sanityFetch } from '../live';


export const getProductByCategory = async (categorySlug: string) => {

    const PRODUCT_BY_CATEGORY_QUERY = defineQuery(`
        *[
            _type == "productType"
            && references(*[_type == "category" && slug.current == $categorySlug]._id)
        ]
    `);

    try {
        const products = await sanityFetch({
            query: PRODUCT_BY_CATEGORY_QUERY,
            params: {
                categorySlug
            }
        })
        return products.data || []
    } catch (error) {
        console.error("Error fetching products by category", error)
        return []
    }
}

export default getProductByCategory