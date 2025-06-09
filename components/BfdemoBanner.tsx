async function BfdemoBanner() {
    const sale = await getActiveSaleByCouponCode("BFDEMO")
    return <div>Black Friday Banner</div>
}