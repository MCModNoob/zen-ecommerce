
export function formatCurrency(amount: number,
    CurrencyCode: string = "GBP") :string{
try{
    return new Intl.NumberFormat("en-GB",{
        style:"currency",
        currency:CurrencyCode.toUpperCase(),
    }).format(amount)
}catch(err){
    console.error("INVALID CURRENCY CODE: ",err);
    return `${CurrencyCode.toUpperCase()} ${amount.toFixed(2)}`;
}
}