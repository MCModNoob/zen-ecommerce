"use client"

import { client } from "@/sanity/lib/client"
import { Category } from "@/sanity/sanity.types"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


interface CategorySelectorProps {
    categories: Category[]
}

export function CategorySelectorComponent({ categories }: CategorySelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string>("")
    const router = useRouter()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] relative flex  sm:justify-start sm:flex-none  space-x-2 bg-green-500 hover:bg-green-200 cursor-pointer hover:text-white text-white 
                    font-bold py-2 rounded"
                >
                    {value
                        ? categories.find((category) => category._id === value)?.title
                        : "Filter by category"}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search categories..." 
                        className="h-9"
                        onKeyDown={(e)=>{
                            if (e.key ==="Enter") {
                                const selectedCategory = categories.find ((c)=> 
                                c.title 
                                 ?.toLowerCase()
                                .includes(e.currentTarget.value.toLowerCase())
                                );
                                if ( selectedCategory?.slug?.current) {
                                     setValue(selectedCategory._id);
                                     router.push(`/categories/${selectedCategory.slug.current}`)
                                     setOpen(false)
                                }
                            };
                        }}
                    />
                    <CommandList>
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem
                                    key={category._id}
                                    value={category.title}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === category.title ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {category.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}