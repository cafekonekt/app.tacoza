"use client";
import { useState, useEffect } from "react";
import { MapPin, Search, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchLoadingAnimation } from "./components/lottie/lottie";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TextRotate } from "@/components/ui/TextRotate";

export function SearchRestaurant({ restaurants }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const restaurantNames = restaurants.map((restaurant) => restaurant.name);

  // Handle search logic
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredRestaurants([]);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      // Filter restaurants by name or description
      const results = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.location
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          restaurant.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );

      setFilteredRestaurants(results);
      setLoading(false);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, restaurants]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start items-center text-muted-foreground mt-2"
        >
          <Search className="w-4 h-4 mr-2" /> Search for{" "}
          <TextRotate
            className="ml-1"
            duration={2000}
            words={restaurantNames}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-3/4 w-full">
        <DrawerHeader>
          <div className="flex items-center justify-between w-full">
            <DrawerTitle className="truncate">Search Restaurants</DrawerTitle>
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
            placeholder="Search for restaurants..."
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
          <section className="overflow-y-scroll h-[60vh]">
            {/* Display search results */}
            {!loading && filteredRestaurants.length > 0
              ? filteredRestaurants.map((restaurant) => (
                  <div key={restaurant.id}>
                    <RestaurantItemComponent restaurant={restaurant} />
                  </div>
                ))
              : !loading && (
                  <p className="text-center text-gray-500 text-sm">
                    Nothing found
                  </p>
                )}
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RestaurantItemComponent({ restaurant }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 justify-between py-2">
        <div className="p-2 aspect-square col-span-1">
          <Image
            src={restaurant.image || "/outlet-thumb.jpg"}
            alt={restaurant.name}
            width={100}
            height={100}
            className="object-cover rounded-lg"
          />
        </div>
        <div className="col-span-3 leading-tight">
          <p className="font-medium leading-tight">{restaurant.name}</p>
          <span className="text-sm font-medium text-muted-foreground">
            {restaurant.description}
          </span>
          <p className="flex items-center text-muted-foreground text-xs line-clamp-2">
            <MapPin className="h-3 w-3 mr-1" /> {restaurant.location}
          </p>
          <span className="text-green-700 flex gap-1 items-center">
            <Star className="fill-green-700 w-3.5 h-3.5 ml-1" />
            <p className="text-sm">{restaurant.rating}</p>
            <p className="text-primary text-xs">
              ({restaurant.ratingCount} Ratings)
            </p>
          </span>
        </div>
      </div>
      <Separator className="mt-2" />
    </div>
  );
}
