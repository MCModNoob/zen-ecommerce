import ProductsView from "@/components/ProductsView";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { ProductType } from "@/sanity.types";
import { Category } from "@/sanity.types";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import BfdemoBanner from "@/components/BfdemoBanner";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //   `>>> rendered the home page cached with ${products.length} products and ${products.length} categories`
  // );

  return (
    <div className="min-h-screen sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <BfdemoBanner />
      <div className="mt-8 flex flex-col items-center min-h-screen bg-gray-200 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
