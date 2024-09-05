"use client";
import { useRef, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SwatchBook, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import { Star } from "lucide-react"; // Import Star correctly as a named export
import { Separator } from "@/components/ui/separator";
import { Customize } from "./Customize";
import { SearchMenu } from "./SearchMenu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const iconMap = {
  veg: "/veg.svg",
  nonveg: "/non-veg.svg",
  egg: "/egg.svg",
};

export function MenuTab({ items, setFocusCategory }) {
  const { cartItems } = useCart();

  const getFoodItemCount = (item) => {
    if (item.sub_categories && item.sub_categories.length > 0) {
      return item.sub_categories.reduce((total, subCategory) => {
        return total + (subCategory.food_items ? subCategory.food_items.length : 0);
      }, 0);
    } else {
      return item.food_items ? item.food_items.length : 0;
    }
  };

  return (
    <div className={`fixed ${cartItems?.length > 0 ? 'bottom-20' : 'bottom-0'} right-0 m-2 w-fit`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="rounded-full aspect-square h-16 w-16 flex flex-col justify-center items-center bg-black text-white text-xs shadow-lg">
            <SwatchBook />
            Menu
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-6">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((item) => (
            <DropdownMenuItem key={item.id} onClick={() => setFocusCategory(item.name)}>
              {item.name}
              <DropdownMenuShortcut>
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {getFoodItemCount(item)}
                </Badge>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function MenuItemComponent({ item }) {
  return (
    <>
      <div className="grid grid-cols-5 gap-2 justify-between py-8">
        <div className="col-span-3">
          <Image
            src={iconMap[item.food_type]}
            alt="Dash"
            height="16"
            width="16"
          />
          <p className="text-lg font-medium">{item.name}</p>
          <span className="text-base font-medium text-muted-foreground">
            ₹ {item.price}
          </span>
          <span className="text-green-700 flex gap-1 items-center my-2">
            <Star className="fill-green-700 w-4 h-4 ml-1" />
            {item.rating}
            <p className="text-primary text-xs">(12 Ratings)</p>
          </span>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="col-span-2">
          <div className="relative flex flex-col items-center aspect-square align-top">
            <img
              src="https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/01cf72fa714c88dfe8d77145d6cf1091"
              className="w-full h-full object-cover rounded-xl"
            />
            <div
              className={`absolute ${item.variants ? "bottom-[-4vh]" : "bottom-[-2vh]"
                } flex flex-col items-center`}
            >
              <Customize item={item} />
              {item.variants && (
                <p className="text-xs text-muted-foreground/50 font-semibold mt-1">
                  Customisable
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Separator className={`${item.variants ? "mt-2" : ""}`} />
    </>
  );
}

function CategoryComponent({ category, depth = 0, focusCategory }) {
  const isSubCategory = depth >= 1;
  const categoryRef = useRef(null);

  useEffect(() => {
    if (focusCategory && focusCategory === category.name) {
      categoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusCategory, category.name]);

  return (
    <Accordion type="single" collapsible defaultValue={category.name}>
      <AccordionItem value={category.name}>
        <AccordionTrigger
          className={`${isSubCategory ? "border-none" : "border-b"}`}
          ref={categoryRef}
        >
          <p
            className={`font-bold ${isSubCategory ? "text-base text-muted-foreground" : "text-xl"}`}
          >
            {category.name}
          </p>
        </AccordionTrigger>
        <AccordionContent>
          {/* Check if sub_categories exists and has items */}
          {Array.isArray(category.sub_categories) &&
            category.sub_categories.length > 0
            ? // If subcategories exist, recursively render them
            category.sub_categories.map((subCategory) => (
              <CategoryComponent
                key={subCategory.name}
                category={subCategory}
                depth={depth + 1} // Increment the depth for subcategories
              />
            ))
            : // If no subcategories, render the menu items
            category.food_items.map((item) => (
              <MenuItemComponent key={item.name} item={item} />
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function MenuAccordion({ items }) {
  const [focusCategory, setFocusCategory] = useState(null);
  return (
    <>
      <section className="w-full">
        <div className="">
          <div className="flex justify-between">
            <span className="flex items-center text-muted-foreground text-sm">
              Filters <Settings2 className="w-3.5 h-3.5 ml-1" />{" "}
              <Separator orientation="vertical" className="mx-2" />
            </span>
            <ToggleGroup type="single" variant="outline">
              <ToggleGroupItem
                value="bold"
                aria-label="Toggle bold"
                className="gap-2 px-4 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
              >
                <Image src="/veg.svg" alt="Dash" height="16" width="16" />
                <span>Veg</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="italic"
                aria-label="Toggle italic"
                className="gap-2 px-4 data-[state=on]:bg-yellow-50 data-[state=on]:text-yellow-400"
              >
                <Image src="/egg.svg" alt="Dash" height="16" width="16" />
                <span>Egg</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="strikethrough"
                aria-label="Toggle strikethrough"
                className="gap-2 px-4 whitespace-nowrap data-[state=on]:bg-red-100 data-[state=on]:text-red-800"
              >
                <Image src="/non-veg.svg" alt="Dash" height="16" width="16" />
                <span>Non-Veg</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <SearchMenu items={items} />
          {/* Menu */}
          <div className="space-y-4">
            {items.map((category) => (
              <CategoryComponent key={category.name} category={category} focusCategory={focusCategory} />
            ))}
          </div>
        </div>
      </section>
      <MenuTab items={items} setFocusCategory={setFocusCategory} />
    </>
  );
}
