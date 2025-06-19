"use client"
import AddToBasketButton from '@/components/AddToBasketButton';
import { Button } from '@/components/ui/button';
import { imageUrlFor } from '@/lib/imageURL';
import { useBasketStore } from '@/store/store'
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


function BasketPage() {
    const groupedItem = useBasketStore((state) => state.getGroupedItems());
    const totalPrice = useBasketStore((state) => state.getTotalPrice())
    const { isSignedIn } = useAuth();
    const { user } = useUser()
    const router = useRouter()

    const [isClient, setIsClient] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => { setIsClient(true); }, [])

    if (!isClient) {
        return <Loader />
    }
    if (groupedItem.length === 0) {
        return (
            <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]'>
                <h1 className='text-2xl font-bold mb-6 text-gray-800 '>Your basket</h1>
                <p className='tedxt-gray-600 text-lg '>your basket is empty</p>
            </div>
        )
    }

    const handleCheckOut = async () => { }

    return (
        <div className='container mx-auto p-4 max-w-6xl'>
            <h1 className='text-2xl font-bold mb-4 '>Your basket</h1>
            <div className='flex flex-col lg:flex-row gap-8'>
                <div className='flex-grow'>
                    {groupedItem?.map((item) => (
                        <div key={item.product._id}
                            className='mb-4 p-4 border rounded flex items-center justify-between'>

                            <div

                                onClick={() => {
                                    router.push(`/product/${item.product.slug?.current}`)
                                }}
                            >
                                <div className='w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4'>
                                {item.product.image &&(
                                   < Image
                                    src={imageUrlFor(item.product.image).url()}
                                    alt={item.product.name?? "product image"}
                                    className='w-full h-full object-cover rounded'
                                    width={96}
                                    height={96}
                                   />
                                )}
                                </div>
                                <div className='min-w-0'>
                                    <h2 className='text-lg sm:text-xl font-semibold truncate'>
                                        {item.product.name}
                                    </h2>
                                    <p className='text-sm sm:text-base'>
                                        Price: £
                                        {((item.product.price?? 0)* item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center ml-4 flex-shrink-0'>
                                <AddToBasketButton product={item.product} disabled={item.product.stock != null && item.product.stock <= 0} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className='w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto
                '>
                    <h3 className='text-xl font-semibold'> Order Summary</h3>
                    <div className='mt-4 space-y-2'>
                        <p className='flex justify-between'>
                            <span>Items:</span>
                            <span>
                                {groupedItem.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        </p>
                        <p className='flex justify-between text-2xl font-bold border-t pt-2'>
                            <span>Total:</span>
                            <span>
                                £{totalPrice}
                            </span>
                        </p>
                    </div>
                  
                  
                    {isSignedIn ? (
                        <button
                            onClick={handleCheckOut}
                            disabled={isLoading}
                            className='mt-4 w-full bg-green-400 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-500'
                        >
                            {isLoading ? "Processing..." : "Checkout"}
                        </button>
                    ) :
                        (
                            <SignInButton mode="modal">
                                <button className='mt-4 w-full bg-green-400 text-2xl text-white px-4 py-2 rounded hover:bg-green-300'>
                                    Sign in to Checkout
                                </button>
                            </SignInButton>
                        )}
                </div>
                <div className='h-64 lg:h-0'>
                    {/* spacer */}
                </div>
            </div>
        </div>
    )
}

export default BasketPage