import ProductsView from "@/components/ProductsView";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const products = await getAllProducts();

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //   `>>> rendered the home page cached with ${products.length} products and ${products.length} categories`
  // );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      <h1>Hello world absdfs</h1>

      <div className="flex flex-col gap-4"> 
        <ProductsView products={products} categories={[]}/>
      </div>
    </div>
  );
}
