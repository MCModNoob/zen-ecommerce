"use client"
import AddToBasketButton from '@/components/AddToBasketButton';
import { useBasketStore } from '@/store/store'
import { useAuth, useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


function BasketPage() {
    const groupedItem = useBasketStore((state) => state.getGroupedItems());
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

    return (
        <div className='container mx-auto p-4 max-w-6xl'>
            <h1 className='text-2xl font-bold mb-4 '>Your basket</h1>
            <div className='flex flex-col lg:flex-row gap-8'>
                <div className='flex-grow'>
                    {groupedItem?.map((item) => (
                        <div key={item.product._id}
                            className='mb-4 p-4 border rounded flex items-center justify-between'>

                            <div>{item.product.name}</div>

                            <div className='flex items-center ml-4 flex-shrink-0'>
                                <AddToBasketButton product={item.product} disabled={item.product.stock != null && item.product.stock <= 0} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BasketPage