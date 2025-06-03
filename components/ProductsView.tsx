import { ProductType } from "@/sanity.types";
import { Category } from "@/sanity.types";

interface ProductViewProps {
    products: ProductType[];
    categories: Category[];
}

const ProductsView = ({ products , categories}: ProductViewProps) => {
    return (
      <div>ProductsView</div>
    )
}

export default ProductsView;