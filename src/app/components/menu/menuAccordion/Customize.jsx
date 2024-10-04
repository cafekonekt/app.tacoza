"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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

// Reusable Component for displaying variants and options
function VariantSelection({
  variant,
  selectedOption,
  onSelectOption,
  onVariantChange,
}) {
  const handleOptionChange = (value) => {
    onSelectOption(variant.id, value);
    const selectedVariantOption = variant.options.find(
      (option) => option.id === parseInt(value)
    );
    const nextVariant = selectedVariantOption?.variant; // Handle nested variant
    onVariantChange(variant.id, value, nextVariant);
  };

  return (
    <div className="mx-4">
      <Label htmlFor={variant.name}>{variant.name}</Label>
      <RadioGroup
        className="flex flex-col gap-2 bg-accent rounded-xl p-4"
        onValueChange={handleOptionChange}
        value={selectedOption?.[variant.id]}
      >
        {variant.options.map((option) => (
          <div className="flex items-center justify-between w-full" key={option.id}>
            <p className="font-medium flex items-center gap-2">
              <Image src="/veg.svg" alt="Veg" height="16" width="16" />
              {option.name}
            </p>
            <span className="text-muted-foreground mr-4">
              {option.price && `₹ ${option.price}`}
            </span>
            <RadioGroupItem value={option.id} id={option.name} />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

// Reusable Component for handling Addons
function AddonSelection({ addons, selectedAddons, onAddonChange }) {
  return (
    <>
      <Label htmlFor="addon">Add-on</Label>
      <section className="flex flex-col gap-2 bg-accent rounded-xl p-4">
        {addons.map((addon) => (
          <div className="flex items-center justify-between w-full" key={addon.id}>
            <p className="font-medium flex items-center gap-2">
              <Image src="/egg.svg" alt="Dash" height="16" width="16" />
              {addon.name}
            </p>
            <span className="text-muted-foreground">+ ₹{addon.price}</span>
            <Checkbox
              checked={selectedAddons.includes(addon)}
              onCheckedChange={(checked) => onAddonChange(addon, checked)}
            />
          </div>
        ))}
      </section>
    </>
  );
}

// Main Customize Component
export function Customize({ item, addDrawerOpen, setAddDrawerOpen }) {
  const { addToCart } = useCart();
  const [count, setCount] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(
    item.steps === 1
      ? { [item.variant.id]: item.variant.options.find((option) => parseFloat(option.price) === parseFloat(item.price))?.id }
      : {}
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(parseFloat(item.price) || 0);
  const [selectedVariant, setSelectedVariant] = useState(item.variant); // Root variant
  const [availableAddons, setAvailableAddons] = useState(
    item.addons?.filter((addon) => addon.applied_variant.length === 0)
  );
  const [previousVariants, setPreviousVariants] = useState([]);

  console.log(availableAddons, item.name);

  useEffect(() => {
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + parseFloat(addon.price), 0);
    const variantPrice =
      selectedVariant &&
      selectedOptions &&
      selectedVariant.options.find((option) => option.id === parseInt(selectedOptions[selectedVariant.id]))?.price;
    const finalPrice = (parseFloat(variantPrice || item.price) * count) + addonsPrice;
    setTotalPrice(finalPrice);

    console.log(currentStep, selectedOptions, item.steps);
    if (currentStep === item.steps) {
      const variantSlug = Object.values(selectedOptions).join("-");
      const matchedVariant = item.item_variants.find((variant) => variant.variant_slug === variantSlug);
      console.log("Selected Variant", variantSlug, matchedVariant, item.name);
      setAvailableAddons(item.addons?.filter((addon) => addon.applied_variant.includes(matchedVariant?.id)));
    }
  }, [selectedVariant, selectedAddons, count, item, selectedOptions, currentStep]);

  const handleAddToCart = () => {
    const variantSlug = Object.values(selectedOptions).join("-");
    const matchedVariant = item.item_variants.find((variant) => variant.variant_slug === variantSlug);
    addToCart(item, matchedVariant, selectedAddons, totalPrice, count);
  };

  const handleVariantChange = (variantId, value, nextVariant) => {
    setSelectedOptions({
      ...selectedOptions,
      [variantId]: value
    });
    if (nextVariant) {
      setPreviousVariants((prev) => [...prev, selectedVariant]);
      setSelectedVariant(nextVariant);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleAddonChange = (addon, isChecked) => {
    setSelectedAddons((prev) =>
      isChecked ? [...prev, addon] : prev.filter((a) => a.id !== addon.id)
    );
  };

  const handleGoBack = (variant) => {
    setCurrentStep((prev) => prev - 1);
    setPreviousVariants((prev) => prev.filter((v) => v.id !== variant.id));
    setSelectedVariant(variant);
  };

  return (
    <Drawer open={addDrawerOpen} onOpenChange={setAddDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex w-full justify-between">
            <div>
              <DrawerDescription>{item.name} • ₹ {item.price}</DrawerDescription>
              <DrawerTitle>Customize your selection</DrawerTitle>
            </div>
            <DrawerClose>
              <Button size="icon" variant="outline" className="rounded-full h-6 w-6">
                <X size={16} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <Separator className="my-4" />

        {previousVariants.map((variant) => (
          <div key={variant.id} className="mb-4 flex justify-between items-center">
            <span>{`${variant.name} - ${variant.options.find((opt) => opt.id === selectedOptions[variant.id])?.name}`}</span>
            <Button variant="link" onClick={() => handleGoBack(variant)}>Change</Button>
          </div>
        ))}

        {selectedVariant && (
          <VariantSelection
            variant={selectedVariant}
            selectedOption={selectedOptions}
            onSelectOption={setSelectedOptions}
            onVariantChange={handleVariantChange}
          />
        )}

        {(currentStep === item.steps || !item.steps) && availableAddons?.length>0 && (
          <AddonSelection
            addons={availableAddons}
            selectedAddons={selectedAddons}
            onAddonChange={handleAddonChange}
          />
        )}

        <DrawerFooter>
          <div className="flex w-full gap-2 justify-between">
            <span className="flex items-center gap-4 text-base font-bold">
              {(currentStep === item.steps || !item.steps) ? (
                <>
                  ₹ {totalPrice}
                  <Counter count={count} setCount={setCount} />
                </>
              ) : (
                <div className="flex justify-center my-4">
                  <span>Step {currentStep} of {item.steps}</span>
                </div>
              )}
            </span>
            {(currentStep === item.steps || !item.steps) && (
              <DrawerClose>
                <Button
                  className="bg-rose-500 text-white text-base font-semibold w-24 shadow-lg"
                  variant="outline"
                  onClick={handleAddToCart}
                >
                  ADD
                </Button>
              </DrawerClose>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
