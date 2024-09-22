"use client";
import { useRef, useEffect, useState } from "react";
// components UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TextRotate } from "@/components/ui/TextRotate";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
// icons
import { SwatchBook, Settings2, Search, X } from "lucide-react";
import { Star } from "lucide-react";
// components
import { Customize } from "@/app/components/menu/menuAccordion/Customize";
// context
import { useCart } from "@/context/CartContext";
import { SearchLoadingAnimation } from "../components/lottie/lottie";
// utils
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
        return (
          total + (subCategory.food_items ? subCategory.food_items.length : 0)
        );
      }, 0);
    } else {
      return item.food_items ? item.food_items.length : 0;
    }
  };

  return (
    <div
      className={`fixed ${cartItems?.length > 0 ? "bottom-20" : "bottom-0"} right-0 m-2 w-fit`}
    >
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
            <DropdownMenuItem
              key={item.id}
              onClick={() => setFocusCategory(item.name)}
            >
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
            <Image
              src={item.image_url ? item.image_url : ''}
              alt={item.name}
              layout="fill"
              className="object-cover rounded-lg"
            />

            <div
              className={`absolute ${item.variants ? "bottom-[-4vh]" : "bottom-[-2vh]"} flex flex-col items-center`}
            >
              <Customize item={item} />
              {item.variants || item.addons?.length > 0 && (
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
      categoryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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

export function SearchMenu({ items }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const words = items.flatMap((category) => [
    ...(category.food_items || []).map((item) => item.name),
    ...(category.sub_categories || []).flatMap((subcategory) =>
      (subcategory.food_items || []).map((item) => item.name),
    ),
  ]);


  // Handle search logic
  useEffect(() => {
    // Recursively search through categories and subcategories
    const searchItems = (category) => {
      let results = [];
      // Search food_items in the current category
      category.food_items.forEach((item) => {
        if (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push(item);
        }
      });
      // Search sub_categories recursively
      if (
        Array.isArray(category.sub_categories) &&
        category.sub_categories.length > 0
      ) {
        category.sub_categories.forEach((subCategory) => {
          results = [...results, ...searchItems(subCategory)];
        });
      }

      return results;
    };

    if (searchQuery === "") {
      setFilteredItems([]);
      return;
    }
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      let results = [];
      // Search through all categories and subcategories
      items.forEach((category) => {
        results = [...results, ...searchItems(category)];
      });
      setFilteredItems(results);
      setLoading(false);
    }, 300); // Debounce for 300ms
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, items]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start items-center text-muted-foreground mt-2"
        >
          <Search className="w-4 h-4 mr-2" /> Search for
          <TextRotate className="ml-1" duration={2000} words={words} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-3/4 w-full">
        <DrawerHeader>
          <div className="flex items-center justify-between w-full">
            <DrawerTitle className="truncate">
              Search in Kohlis Menu
            </DrawerTitle>
            <DrawerClose>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full h-6 w-6"
              >
                <X size={16} />
              </Button>
            </DrawerClose>
          </div>

          <Input
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </DrawerHeader>

        <div className="flex flex-col gap-4 p-4">
          {loading && (
            <div className="flex justify-center">
              <SearchLoadingAnimation />
            </div>
          )}

          {/* Display search results */}
          {!loading && filteredItems.length > 0
            ? filteredItems.map((item) => (
              <div className="overflow-y-scroll" key={item.name}>
                <MenuItemComponent item={item} />
              </div>
            ))
            : !loading && (
              <p className="text-center text-gray-500 text-sm">
                Nothing found
              </p>
            )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function MenuAccordion({ items }) {
  console.log("Menu Accordion")
  const [focusCategory, setFocusCategory] = useState(null);
  const [foodTypeFilter, setFoodTypeFilter] = useState(null);

  // Filter items based on the selected food type
  const filteredItems = items.map((category) => {
    // Filter food_items in the category
    const filteredFoodItems = category.food_items.filter((item) => {
      if (!foodTypeFilter) return true; // Show all if no filter is selected
      return item.food_type === foodTypeFilter; // Match selected food type
    });

    // Filter food_items in the subcategories
    const filteredSubCategories = category.sub_categories.map((sub) => ({
      ...sub,
      food_items: sub.food_items.filter((item) => {
        if (!foodTypeFilter) return true;
        return item.food_type === foodTypeFilter;
      }),
    }));

    return {
      ...category,
      food_items: filteredFoodItems,
      sub_categories: filteredSubCategories,
    };
  });

  return (
    <>
      <section className="w-full">
        <div className="">
          <div className="flex justify-between">
            <span className="flex items-center text-muted-foreground text-sm">
              Filters <Settings2 className="w-3.5 h-3.5 ml-1" />{" "}
              <Separator orientation="vertical" className="mx-2" />
            </span>
            {/* Toggle Group to select the filter */}
            <ToggleGroup
              type="single"
              variant="outline"
              onValueChange={(value) => setFoodTypeFilter(value)} // Set filter state
            >
              <ToggleGroupItem
                value="veg"
                aria-label="Veg Filter"
                className="gap-2 px-4 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
              >
                <Image src="/veg.svg" alt="Veg" height="16" width="16" />
                <span>Veg</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="egg"
                aria-label="Egg Filter"
                className="gap-2 px-4 data-[state=on]:bg-yellow-50 data-[state=on]:text-yellow-400"
              >
                <Image src="/egg.svg" alt="Egg" height="16" width="16" />
                <span>Egg</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="nonveg"
                aria-label="Non-Veg Filter"
                className="gap-2 px-4 whitespace-nowrap data-[state=on]:bg-red-100 data-[state=on]:text-red-800"
              >
                <Image
                  src="/non-veg.svg"
                  alt="Non-Veg"
                  height="16"
                  width="16"
                />
                <span>Non-Veg</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Search Menu */}
          <SearchMenu items={filteredItems} />

          {/* Menu */}
          <div className="space-y-4">
            {filteredItems.map((category) => (
              <CategoryComponent
                key={category.name}
                category={category}
                focusCategory={focusCategory}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pass setFocusCategory to MenuTab */}
      <MenuTab items={filteredItems} setFocusCategory={setFocusCategory} />
    </>
  );
}
