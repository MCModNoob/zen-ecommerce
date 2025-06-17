import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";

import { notFound } from "next/navigation";
import Image from "next/image";
import {  imageUrlFor } from "@/lib/imageURL";
import { PortableText } from "next-sanity";
import AddToBasketButton from "@/components/AddToBasketButton";
import { productType } from "@/sanity/schemaTypes/productType";

async function productPage({
    params,
}: {
    params: Promise<{
        slug: string
    }>
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug)

    if (!product) {
        return notFound();
    }

    const isOutOfStock = product.stock != null && product.stock <= 0;

    return (
        <div className="container mx-auto px-2 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <div
                    className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity/50" : ""}`}
                  >
                    {product.image && (
                        <Image
                            src={imageUrlFor(product.image).url()}
                            alt={product.name ?? "product image"}
                            fill
                            className="object-contain transition-transform duration-300 hover:scale-105"
                        />
                    )}

                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-white font-bold text-2xl">Out of stock</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-between"
                >
                    <h1 className="text-3xl font-bold mb-4 "
                    >
                        {product.name}
                    </h1>
                    <div className="text-xl font-semibold mb-4">
                    £{product.price?.toFixed(2)}
                    </div>
                    <div className="prose max-w-none mb-6">
                        {Array.isArray(product.description) && (
                            <PortableText value={product.description}/>
                        )}
                    </div>
                    <div className="mt-6">
                    <AddToBasketButton product={product} disabled={isOutOfStock}/>
                    </div>
                </div>
            </div>
        </div>)
}
export default productPage