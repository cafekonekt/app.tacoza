"use client";
import * as React from "react";
import { useState, useEffect } from "react";
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

export function SearchMenu() {
  const searchItems = [
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
      setIndex((prevIndex) => (prevIndex + 1) % searchItems.length);
      setAnimationKey((prevKey) => prevKey + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [searchItems]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground mt-2"
        >
          <Search className="w-4 h-4 mr-2" /> Search for &#x0022;
          {searchItems[index]}&#x0022;
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-3/4 w-full">
        <DrawerHeader className="">
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
            key={animationKey}
            placeholder={`Search for "${searchItems[index]}"`}
            className="inline-block fade-in-50"
          />
        </DrawerHeader>
        <p className="text-center text-gray-500 text-sm">Noting found</p>
      </DrawerContent>
    </Drawer>
  );
}
