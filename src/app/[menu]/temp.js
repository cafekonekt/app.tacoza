"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Star } from "lucide-react"; // Import Star correctly as a named export
import { Separator } from "@/components/ui/separator";
import { Customize } from "./Customize";
import { useState, useEffect } from "react"; // Add useState, useEffect hooks

const iconMap = {
  veg: "/veg.svg",
  nonveg: "/non-veg.svg",
  egg: "/egg.svg",
};

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
              className={`absolute ${
                item.variants ? "bottom-[-4vh]" : "bottom-[-2vh]"
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

function CategoryComponent({ category, depth = 0 }) {
  const isSubCategory = depth >= 1;

  return (
    <Accordion type="single" collapsible defaultValue={category.name}>
      <AccordionItem value={category.name}>
        <AccordionTrigger
          className={`${isSubCategory ? "border-none" : "border-b"}`}
        >
          <p
            className={`font-bold ${isSubCategory ? "text-base text-muted-foreground" : "text-xl"}`}
          >
            {category.name}
          </p>
        </AccordionTrigger>
        <AccordionContent>
          {Array.isArray(category.sub_categories) &&
          category.sub_categories.length > 0
            ? category.sub_categories.map((subCategory) => (
                <CategoryComponent
                  key={subCategory.name}
                  category={subCategory}
                  depth={depth + 1}
                />
              ))
            : category.food_items.map((item) => (
                <MenuItemComponent key={item.name} item={item} />
              ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function MenuAccordion({ items }) {
  return (
    <div className="space-y-4">
      {items.map((category) => (
        <CategoryComponent key={category.name} category={category} />
      ))}
    </div>
  );
}

// SearchMenu Component
import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TextRotate } from "@/components/ui/TextRotate";

export function SearchMenu({ items }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Handle search logic
  useEffect(() => {
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

  //Handles dishes name change
  const dishItems = [
    "Paneer Tikka Masala",
    "Biryani",
    "Samosas",
    "Dosa",
    "Idli",
    "Vada Pav",
    "Chole Bhature",
    "Pani Puri",
    "Aloo Paratha",
    "Chicken Tikka",
    "Gulab Jamun",
    "Jalebi",
    "Malai Kofta",
    "Hyderabadi Biryani",
    "Fish Curry",
    "Dal Makhani",
    "Baigan Bharta",
    "Poha",
    "Masala Dosa",
  ];
  const [index, setIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % dishItems.length);
      setAnimationKey((prevKey) => prevKey + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [dishItems]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start items-center text-muted-foreground mt-2"
        >
          <Search className="w-4 h-4 mr-2" /> Search for
          <TextRotate
            className="ml-1"
            duration={2000}
            words={[
              "Paneer Tikka Masala",
              "Biryani",
              "Samosas",
              "Dosa",
              "Idli",
              "Vada Pav",
              "Chole Bhature",
              "Pani Puri",
              "Aloo Paratha",
              "Chicken Tikka",
              "Gulab Jamun",
              "Jalebi",
              "Malai Kofta",
              "Hyderabadi Biryani",
              "Fish Curry",
              "Dal Makhani",
              "Baigan Bharta",
              "Poha",
              "Masala Dosa",
            ]}
          />
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
              <Image
                src="/loader.gif"
                alt="loading"
                width={50}
                height={50}
                className="opacity-80"
                draggable={false}
              />
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
