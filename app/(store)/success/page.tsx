'use client'

import { Button } from "@/components/ui/button"
import { useBasketStore } from "@/store/store"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

function SuccessPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber")
    const clearBasket = useBasketStore((state) => state.clearBasket)

    useEffect(() => {
        if (orderNumber) {
            clearBasket();
        }

    }, [orderNumber, clearBasket]);

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
        >
            <div
                className="bg-white p-12 rounded-2xl shadow-lg max-w-2xl w-full mx-4"
              >
                <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 bg-green-200 rounded-lg flex items-center justify-center">
                        <svg
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            stroke="currentcolor"
                            viewBox="0 0 24 24"
                        >

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="text-4xl fond-bold mb-6 text-center">
                    Thank you for your order!
                </h1>
                {orderNumber && (
                    <p className="text-center text-gray-600 mb-8">
                        Your order number is: <span className="font-semibold">{orderNumber}</span>
                    </p>
                )}
                <div className="space-y-4 ">
                    <p className="text-gray-600 px-15">
                        A confirmation email has been sent to your registered email
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 ">
                        <Button asChild>
                            <Link href="/orders">View Order Details</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SuccessPage;