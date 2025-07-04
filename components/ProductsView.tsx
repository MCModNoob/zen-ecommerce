"use client"

import { ProductType } from "@/sanity.types";
import { Category } from "@/sanity.types";
import ProductGrid from "./ProductGrid"; 
import { CategorySelectorComponent } from "@/components/ui/Category-selector";


interface ProductViewProps {
    products: ProductType[];
    categories: Category[];
}

const ProductsView = ({ products , categories}: ProductViewProps) => {
    return (
      <div className="flex flex-col ">
        {/* categories */}
        <div className="w-full sm:w-[200px]">
          <CategorySelectorComponent categories={categories}/>
        </div>
     
        {/* products */}
        <div>
          <ProductGrid products={products} /> 
          <hr className="W-1/2 sm:w-3/4"/>
        </div>
      </div>
      
    )
}

export default ProductsView;