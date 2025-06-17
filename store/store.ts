import { ProductType } from "@/sanity.types";
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
    clearBasket: () => void;
    getTotalPrice: () => number;
    getItemCount: (productId: string) => number;
    getGroupedItems: () => BasketItem[];
}

export const useBasketStore = create<BasketState>()(
    persist(
        (set, get) => ({
            itemsList: [],
            addItem: (ProductToAdd) => set((state) => {
                const existingItem = state.itemsList.find(item => item.product._id === ProductToAdd._id);
                if (existingItem) {
                    return {
                        itemsList: state.itemsList.map(item =>
                            item.product._id === existingItem.product._id
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
            removeItem: (productId) => set((state) => ({
                itemsList: state.itemsList.reduce((acc, current) => {
                    if (current.product._id === productId) {
                        if (current.quantity > 1) {
                            acc.push({ ...current, quantity: current.quantity - 1 });
                        }
                    } else {
                        acc.push({ ...current })
                    }
                    return acc;
                }, [] as BasketItem[])
            })),
            clearBasket: () => set({ itemsList: [] }),
            getTotalPrice: () => {
                return get().itemsList.reduce((acc, current) => acc + (current.product.price ?? 0) * current.quantity, 0)
            },
            getItemCount : (productId) =>{
                const item = get().itemsList.find((item) => item.product._id === productId)
                return item ? item.quantity : 0
            },
            getGroupedItems : () => get().itemsList,
        }),
        { name: 'basket-store' },
    ),
)
