"use client"
import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { useBasketStore } from "@/store/store";

function Header() {
    const { user } = useUser();
    const itemCount = useBasketStore((state) => state.itemsList.reduce((totalCount, current) => totalCount + current.quantity, 0))

    const createClerkPasskey = async () => {
        try {
            const response = await user?.createPasskey();
            console.log(response);
        } catch (err) {
            console.error("Error:", JSON.stringify(err, null, 2));
        }
    };

    return (
        <header className="flex flex-wrap justify-between items-center px-4 py-2 sm:flex-row flex-col">
            {/* Top row */}
            <div className="flex w-full flex-wrap justify-between items-center space-x-2 ">
                <Link href="/"
                    className="
                    text-3xl
                    font-bold
                    text-green-500
                    hover:opacity-50
                    cursor-pointer
                    mx-auto
                    sm:mx-0
                ">
                    Zen</Link>
                <Form action="/search"
                    className="w-full mt-2 sm:w-auto flex-1 sm:mx-4 sm:mt-0">
                    <input
                        type="text"
                        name="query"
                        placeholder="Search for products"
                        className="
                        bg-gray-100
                        text-gray-800px-r
                        py-2
                        rounded
                        focus:outline-none
                        focus:ring-2
                        focus:rinset-ring-blue-500
                        focus:ring-opacity-50
                        border
                        w-full
                        max-w-4xl
                    "
                    />
                </Form>
                <div className="flex flex-1 justify-between items-center space-x-2 mt-2 not-last:sm:mt-0">
                    <Link href="/basket"
                        className="
                        flex-1 
                        relative
                        flex
                        justify-center
                        sm:justify-start
                        sm:flex-none
                        items-center
                        space-x-2
                        bg-green-400
                        hover:bg-green-800
                        text-white
                        font-bold
                        py-2
                        px-4
                        rounded"
                    >
                        <TrolleyIcon className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded w-5 h-5 flex items-center justify-center text-xs ">{itemCount}</span>
                        <span>My Basket</span>
                    </Link>

                    {/* User area */}
                    <ClerkLoaded>
                        {user && (
                            <Link
                                href="/orders"
                                className="flex-1 
                                relative 
                                flex 
                                justify-center 
                                sm:justify-start 
                                sm:flex-none 
                                items-center 
                                space-x-2
                                bg-green-400
                                hover:bg-green-800
                                text-white
                                font-bold
                                py-2
                                px-4
                                rounded
                        ">
                                <PackageIcon className="w-6 h-6" />
                                <span>My orders</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-2">
                                <UserButton />
                                <div className="hidden sm:block text-xs">
                                    <p className="text-gray-400">Welcome Back</p>
                                    <p className="font-bold">{user.fullName}!</p>
                                </div>
                            </div>
                        ) : (
                            <SignInButton mode="modal" />
                        )}
                        {user?.passkeys.length === 0 && (
                            <button onClick={createClerkPasskey}
                                className="bg-white hover:bg-green-800 hover:text-white animate-pulse text-blue-500 font-bold py-2 px-4 rounded
                            border-blue-300 border"
                            >
                                Create a passkey now
                            </button>
                        )}
                    </ClerkLoaded>
                </div>
            </div>
        </header>
    )
}

export default Header