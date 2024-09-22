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

export function VariantAddon({
  variant,
  selectedVariant,
  onVariantChange,
  addons,
  selectedAddons,
  onAddonChange,
}) {
  return (
    <div className="mx-4">
      {/* Variant */}
      {variant && (
        <>
          <Label forhtml="size">{variant?.name}</Label>
          <RadioGroup
            className="flex flex-col gap-2 bg-accent rounded-xl p-4"
            value={selectedVariant}
            onValueChange={(value) => onVariantChange(value)}
          >
            {variant?.type?.map((option, index) => (
              <div
                className="flex items-center justify-between w-full"
                key={index}
              >
                <div className="w-full flex items-center justify-between">
                  <p className="font-medium flex items-center gap-2">
                    <Image src="/veg.svg" alt="Dash" height="16" width="16" />
                    {option.name}
                  </p>
                  <span className="text-muted-foreground mr-4">
                    ₹{option.price}
                  </span>
                </div>
                <RadioGroupItem
                  value={option}
                  id={option.variant}
                  checked={selectedVariant.price === option.price}
                />
              </div>
            ))}
          </RadioGroup>
        </>
      )}

      {/* Add-on */}
      {addons && addons.length > 0 && (
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

export function Customize({ item }) {
  const { addToCart } = useCart();

  // State to manage selected variant and add-ons
  // default variant should be the the one which has same price as item price
  const [selectedVariant, setSelectedVariant] = useState(
    item?.variants?.type.find((variant) => variant.price === item.price),
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [count, setCount] = React.useState(1);

  // Calculate total price whenever the selected variant or add-ons change
  useEffect(() => {
    if (count <= 0) {
      setCount(1);
    }
    let addonsPrice = selectedAddons.reduce(
      (sum, addon) => sum + parseFloat(addon.price),
      0,
    );
    if (selectedVariant) {
      setTotalPrice(parseFloat(selectedVariant.price) * count + addonsPrice);
    } else {
      setTotalPrice(parseFloat(item.price) * count + addonsPrice);
    }
  }, [selectedVariant, selectedAddons, count, item.price]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddonChange = (addonPrice, isChecked) => {
    if (isChecked) {
      setSelectedAddons((prev) => [...prev, addonPrice]);
    } else {
      setSelectedAddons((prev) => prev.filter((price) => price !== addonPrice));
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        ...item,
      },
      selectedVariant,
      selectedAddons,
      totalPrice,
      count,
    );
  };

  return (
    <Drawer>
      {item.variants || item.addons?.length > 0 ? (
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
                {item.name} • ₹{item.price}
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
            variant={item.variants}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
            addons={item.addons}
            selectedAddons={selectedAddons}
            onAddonChange={handleAddonChange}
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
