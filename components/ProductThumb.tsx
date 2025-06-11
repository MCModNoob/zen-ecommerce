"use client"

import { ProductType } from "@/sanity.types";
import Link from "next/link";
import Image from "next/image";
import { imageUrlFor } from "@/lib/imageURL";


function ProductThumb({ product }: { product: ProductType }) {
    const isOutOfStock = product.stock != null && product.stock <= 0;

    return (
        <Link
            href={`/product/${product.slug?.current}`}
            className={`group flex flex-col  bg-white rounded-lg-border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isOutOfStock ? "opacity-50" : ""}`}
        >
            <div className="relative aspect-square w-full h-full overflow-hidden">
                {product.image && (
                    <Image
                        className="object-contain transition-all duration-300 group-hover:scale-105"
                        src={imageUrlFor(product.image).url()}
                        alt={product.name || "Product Image"}
                        fill
                    />
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 ">
                        <span className="text-white text-lg font-bold">Out of Stock</span>
                    </div>
                )}

            </div>
            <div className="p-4" >
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                </h2>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {product.description
                        ?.map((block) =>
                            block._type === "block"
                                ? block.children?.map((child) => child.text).join(" ")
                                : ""
                        )
                        .join(" ") || "No description available"}
                </p>
                <p className="mt-2 text-lg text-black"> 
                   £{product.price}
                </p>
            </div>
        </Link>
    )
}

export default ProductThumb;