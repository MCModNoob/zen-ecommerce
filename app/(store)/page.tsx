import ProductsView from "@/components/ProductsView";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import BfdemoBanner from "@/components/BfdemoBanner";


export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();


  return (
    <div className="min-h-screen sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <BfdemoBanner />
      <div className="mt-8 flex flex-col items-center min-h-screen bg-gray-200 p-4">
        
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
