"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Counter from "@/app/components/menu/menuAccordion/Counter";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

// Dummy Data for the Item
const item = {
  id: 1,
  name: "Deluxe Veggie Pizza",
  basePrice: 249, // Base price without any variants
  description: "A delicious veggie pizza with fresh toppings",
  image: "/images/deluxe_veggie_pizza.jpg", // Image path

  // Variant categories
  variantCategories: [
    {
      variantCategoryId: 101,
      name: "Crust Type",
      variantOptions: [
        { variantOptionId: 1011, name: "Thin Crust", additionalPrice: 0 }, // Base price
        { variantOptionId: 1012, name: "Hand Tossed", additionalPrice: 20 },
        { variantOptionId: 1013, name: "Cheese Burst", additionalPrice: 50 },
      ],
    },
    {
      variantCategoryId: 102,
      name: "Size",
      variantOptions: [
        { variantOptionId: 1021, name: "Small", additionalPrice: 0 }, // Base price
        { variantOptionId: 1022, name: "Medium", additionalPrice: 50 },
        { variantOptionId: 1023, name: "Large", additionalPrice: 100 },
      ],
    },
  ],

  // Add-ons
  addons: [
    { addonId: 201, name: "Extra Cheese", price: 25 },
    { addonId: 202, name: "Garlic Bread", price: 49 },
    { addonId: 203, name: "Dips", price: 19 },
  ],

  // Combinations (mapped to the selected variant option IDs and their final price)
  combinationPrices: [
    { combination: [1011, 1021], price: 249 }, // Thin Crust + Small
    { combination: [1011, 1022], price: 299 }, // Thin Crust + Medium
    { combination: [1011, 1023], price: 349 }, // Thin Crust + Large
    { combination: [1012, 1021], price: 269 }, // Hand Tossed + Small
    { combination: [1012, 1022], price: 319 }, // Hand Tossed + Medium
    { combination: [1012, 1023], price: 369 }, // Hand Tossed + Large
    { combination: [1013, 1021], price: 299 }, // Cheese Burst + Small
    { combination: [1013, 1022], price: 349 }, // Cheese Burst + Medium
    { combination: [1013, 1023], price: 399 }, // Cheese Burst + Large
  ],
};

export function VariantAddon({
  variantCategories,
  selectedVariants,
  onVariantChange,
  addons,
  selectedAddons,
  onAddonChange,
  showAddons,
}) {
  return (
    <div className="mx-4">
      {/* Variants */}
      {variantCategories.map((variantCategory, index) => (
        <div key={index} className="mb-4">
          <Label forhtml={variantCategory.name}>{variantCategory.name}</Label>
          <RadioGroup
            className="flex flex-col gap-2 bg-accent rounded-xl p-4"
            value={selectedVariants[variantCategory.variantCategoryId] || ""}
            onValueChange={(value) =>
              onVariantChange(variantCategory.variantCategoryId, value)
            }
          >
            {variantCategory.variantOptions.map((option) => (
              <div
                className="flex items-center justify-between w-full"
                key={option.variantOptionId}
              >
                <div className="w-full flex items-center justify-between">
                  <p className="font-medium flex items-center gap-2">
                    <Image src="/veg.svg" alt="Dash" height="16" width="16" />
                    {option.name}
                  </p>
                  <span className="text-muted-foreground mr-4">
                    ₹{option.additionalPrice}
                  </span>
                </div>
                <RadioGroupItem
                  value={option.variantOptionId}
                  id={option.name}
                />
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}

      {/* Add-ons */}
      {showAddons && addons && addons.length > 0 && (
        <>
          <Label forhtml="addon">Add-on</Label>
          <section className="flex flex-col gap-2 bg-accent rounded-xl p-4">
            {addons.map((addon, index) => (
              <div
                className="flex items-center justify-between w-full"
                key={index}
              >
                <div className="w-full flex items-center justify-between mr-4">
                  <p className="font-medium flex items-center gap-2">
                    <Image src="/egg.svg" alt="Dash" height="16" width="16" />
                    {addon.name}
                  </p>
                  <span className="text-muted-foreground">
                    + ₹{addon.price}
                  </span>
                </div>
                <Checkbox
                  value={addon}
                  id={addon.name}
                  checked={selectedAddons.includes(addon)}
                  onCheckedChange={(checked) => onAddonChange(addon, checked)}
                />
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

export function Customize() {
  const { addToCart } = useCart();

  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(item.basePrice || 0);
  const [count, setCount] = useState(1);
  const [showAddons, setShowAddons] = useState(false);

  // Handle variant selection change
  const handleVariantChange = (categoryId, optionId) => {
    setSelectedVariants((prev) => ({ ...prev, [categoryId]: optionId }));
  };

  // Handle addon change
  const handleAddonChange = (addon, isChecked) => {
    if (isChecked) {
      setSelectedAddons((prev) => [...prev, addon]);
    } else {
      setSelectedAddons((prev) => prev.filter((item) => item !== addon));
    }
  };

  // Calculate the total price based on selected variants and addons
  useEffect(() => {
    let selectedVariantIds = Object.values(selectedVariants);

    // Find the price for the selected variant combination
    let selectedCombination = item.combinationPrices.find((comb) =>
      selectedVariantIds.every((id) => comb.combination.includes(id)),
    );
    let combinationPrice = selectedCombination
      ? selectedCombination.price
      : item.basePrice;

    // Calculate addons price
    let addonsPrice = selectedAddons.reduce(
      (sum, addon) => sum + parseFloat(addon.price),
      0,
    );

    setTotalPrice(combinationPrice * count + addonsPrice);

    // Show addons only after all variants are selected
    setShowAddons(selectedVariantIds.length === item.variantCategories.length);
  }, [selectedVariants, selectedAddons, count]);

  const handleAddToCart = () => {
    addToCart(
      {
        ...item,
      },
      selectedVariants,
      selectedAddons,
      totalPrice,
      count,
    );
  };

  return (
    <Drawer>
      {item.variantCategories || item.addons?.length > 0 ? (
        <DrawerTrigger asChild>
          <Button
            className="border-2 border-rose-500 bg-rose-50 text-rose-500 text-base font-semibold shadow-lg"
            variant="outline"
          >
            ADD
          </Button>
        </DrawerTrigger>
      ) : (
        <Button
          className="border-2 border-rose-500 bg-rose-50 text-rose-500 text-base font-semibold shadow-lg"
          variant="outline"
          onClick={handleAddToCart}
        >
          ADD
        </Button>
      )}
      {item && (
        <DrawerContent>
          <DrawerHeader className="flex items-start w-full">
            <div className="flex flex-col items-start w-full">
              <DrawerDescription>
                {item.name} • ₹{item.basePrice || item.price}
              </DrawerDescription>
              <DrawerTitle>Customise as per your taste</DrawerTitle>
            </div>
            <DrawerClose>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full h-6 w-6"
              >
                <X size={16} />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <Separator className="my-4" />
          <VariantAddon
            variantCategories={item.variantCategories}
            selectedVariants={selectedVariants}
            onVariantChange={handleVariantChange}
            addons={item.addons}
            selectedAddons={selectedAddons}
            onAddonChange={handleAddonChange}
            showAddons={showAddons}
          />
          <DrawerFooter>
            <div className="flex w-full gap-2 justify-between">
              <span className="flex items-center gap-4 text-base font-bold">
                ₹ {totalPrice}
                <Counter count={count} setCount={setCount} />
              </span>
              <DrawerClose>
                <Button
                  className="bg-rose-500 text-white text-base font-semibold w-24 shadow-lg"
                  variant="outline"
                  onClick={handleAddToCart}
                >
                  ADD
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      )}
    </Drawer>
  );
}
