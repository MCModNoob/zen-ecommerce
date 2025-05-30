import { BasketIcon } from "@sanity/icons";
import { title } from "process";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    icon: BasketIcon,
    fields: [
        defineField({
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'stripeCustomerId',
            title: 'stripe Customer Id',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'stripePaymentIntentId',
            title: 'stripe Payment Intent Id',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [
                defineArrayMember({
                type: 'object', 
                fields: [
                    defineField({ 
                        name: 'product', 
                        title: 'Product bought', 
                        type: 'reference', 
                        to: [{ type: 'productType' }] }),
                    defineField({ 
                        name: 'quantity', 
                        title: 'Quantity purchased', 
                        type: 'number' }),
                ],
                preview: {
                    select: {
                        product: 'product.name',
                        quantity: 'quantity',
                        image: 'product.image',
                        price: 'product.price',
                        currency: 'product.currency',
                    },
                    prepare(select) {
                        return {
                            title: `${select.product} x ${select.quantity}`,
                            subtitle: `${select.price} ${select.currency}`,
                            media: select.image,
                        }
                    },
                }
            })],
        }),
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'currency',
            title: 'currency',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'amountDiscount',
            title: 'Amount Discount',
            type: 'number',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'status',
            title: 'Order Status',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    {title: 'Pending', value: 'pending'},
                    {title: 'Paid', value: 'paid'},
                    {title: 'Failed', value: 'failed'},
                    {title: 'Refunded', value: 'refunded'},
                    {title: 'Cancelled', value: 'cancelled'},
                    {title: 'Shipped', value: 'shipped'},
                    {title: 'Delivered', value: 'delivered'},
                ],
            },
        }),
        defineField({
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Customer Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        }),
        
    ],
    preview: {
        select: {
            name: 'customerName',
            amount: 'totalPrice',
            currency: 'currency',
            orderId: 'orderNumber',
            email: 'email',
            status: 'status',
            date: 'orderDate',
        },
        prepare(select) {
            const orderIdSnippet = select.orderId.slice(0, 5) + '...' + select.orderId.slice(-5);
            return {
                title: `${select.name} (${orderIdSnippet}) `,
                subtitle: `${select.amount} ${select.currency} ${select.email}`,
                media: BasketIcon,
            }
        }
    }
});