import { BasketIcon, TagIcon } from "@sanity/icons";
import { title } from "process";
import { defineArrayMember, defineField, defineType } from "sanity";

export const salesType = defineType({
   name: 'sales',
   title: 'Sales',
   type: 'document',
   icon: TagIcon,
   fields: [
    defineField({
        name: 'title',
        title: 'sales title',
        type: 'string',
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'description',
        title: 'sales description',
        type: 'text',
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'discountAmount',
        title: 'discount amount',
        type: 'number',
        description: 'The amount of discount to apply to the order',
    }),
    defineField({
        name: 'couponCode',
        title: 'coupon code',
        type: 'string',
        description: 'The coupon code to apply to the order',
    }),
    defineField({
        name: 'startDate',
        title: 'start date',
        type: 'datetime',
        description: 'The start date of the sale',
    }),
    defineField({
        name: 'endDate',
        title: 'end date',
        type: 'datetime',
        description: 'The end date of the sale',
    }),
    defineField({
        name: 'isActive',
        title: 'is active',
        type: 'boolean',
        description: 'Whether the sale is active',
        initialValue: true,
    })
   ],
})