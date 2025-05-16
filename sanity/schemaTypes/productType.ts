import { TrolleyIcon } from "@sanity/icons";
import { Select } from "@sanity/ui";
import { title } from "process";
import { defineField, defineType, Preview } from "sanity";

export const productType = defineType({
    name: 'productType',
    title: 'Product type',
    type: 'document',
    icon: TrolleyIcon,
    fields: [
        defineField({
            name:"name",
            title:"product Name",
            type:"string",
            validation:(Rule) => Rule.required(),
        }),
        defineField({
            name:"slug",
            title:"slug",
            type:"slug",
            options:{
                source:"name",
                maxLength: 96,
            },
        }),
        defineField({
            name:"image",
            title:"Product Image",
            type:"image",
            options:{
                hotspot:true,
            }
        }),
        defineField({
            name:"description",
            title:"Description",
            type:"blockContent",
        }),
        defineField({
            name:"price",
            title:"Price",
            type:"number",
            validation:(Rule) => Rule.required().min(0),
        }),
        defineField({
            name:"catagories",
            title:"Categories",
            type:"array",
            of:[{type:"reference",to: {type:"category"}}]
        }),
        defineField({
            name:"stock",
            title:"Stock",
            type:"number",
            validation:(Rule) => Rule.required().min(0),
        }),
    ],
    preview: {
        select:{
            title:"name",
            media:"image",
            subtitle:"price",
        },
        prepare(select) {
            return {
                title: select.title,
                subtitle:`$${select.subtitle}`,
                media: select.media
            } 
        }
    }
})