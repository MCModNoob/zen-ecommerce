import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";

async function productPage({
    params,
}: {
    params: Promise<{
        slug: string
    }>
}) {
    const {slug} = await params;
    const product = await getProductBySlug(slug)

    return <div>product page</div>
}
export default productPage