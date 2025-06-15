import { ProductType } from "@/sanity.types";
import { removeItem } from "framer-motion";
import { StringRule } from "sanity";
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface BasketItem {
    product: ProductType,
    quantity: number
}

interface BasketState {
    itemsList: BasketItem[];
    addItem: (product: ProductType) => void;
    removeItem: (productId: string) => void;
    clearBasket: (productId: string) => void;
    getTotalPrice: () => number;
    getItemCount: (productId: string) => number;
    getGroupedItems: () => BasketItem[];
}

const useShopBasket = create<>()(
    persist(
        (set, get) => ({
            itemsList: [],
            addItem: (ProductToAdd) => set((state) => {
                const existingItem = state.itemsList.find(item => item.product._id === ProductToAdd._id);
                if (existingItem) {
                    return {
                        itemsList: state.itemsList.map(item =>
                            item.product._id === existingItem._id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                } else {
                    return {
                        itemsList: [...state.itemsList, { product: ProductToAdd, quantity: 1 }],
                    };
                }
            }),
            // removeItem: (productId) => set((state) => {

            // })
        }),
        { name: 'basket-store' },
    ),
)
