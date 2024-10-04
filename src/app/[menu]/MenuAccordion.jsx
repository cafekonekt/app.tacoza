"use client";
import { useRef, useEffect, useState, useCallback } from "react";
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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Counter from "@/app/components/menu/menuAccordion/Counter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
// icons
import { SwatchBook, Settings2, Search, X, LeafyGreen } from "lucide-react";
import { Star } from "lucide-react";
// components
import { Customize } from "@/app/components/menu/menuAccordion/Customize";
// context
import { useCart } from "@/context/CartContext";
import { SearchLoadingAnimation } from "../components/lottie/lottie";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
// utils
const iconMap = {
  veg: "/veg.svg",
  nonveg: "/non-veg.svg",
  egg: "/egg.svg",
};
import { SquareMinus, SquarePlus } from "lucide-react";
import { SetQuantity } from "@/app/components/cart/item/SetQuantity";
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
        <DropdownMenuContent className="relative w-56 max-h-64 mr-5 overflow-y-scroll no-scrollbar">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="overflow-y-scroll no-scrollbar">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setFocusCategory(item.name)}
              >
                {item.name}
                <DropdownMenuShortcut>
                  <div className="bg-rose-600 opacity-100 text-white flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {getFoodItemCount(item)}
                  </div>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function MenuItemComponent({ item }) {
  const [imageSrc, setImageSrc] = useState(item.image_url || "/food-thumb.jpg");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { addToCart, updateQuantity, getItemFromCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item, null, [], item.price, quantity);
    setQuantity(1);
  };

  const handleImageError = () => setImageSrc("/food-thumb.jpg");
  const existingItems = getItemFromCart(item.id);

  const increment = () => {
    if (item.variant || item.addons) {
      setAddDrawerOpen(true);
    } else {
      if (existingItems?.length > 0) {
        updateQuantity(existingItems[0].item_id, existingItems[0].quantity + 1);
      } else {
        setQuantity((q) => q + 1);
      }
    }
  };

  const decrement = () => {
    if (item.variant || item.addons) {
      setEditDrawerOpen(true);
    } else {
      if (existingItems?.length > 0) {
        updateQuantity(existingItems[0].item_id, existingItems[0].quantity - 1);
      } else {
        setQuantity((q) => (q > 1 ? q - 1 : 1));
      }
    }
  };

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
          <p className="text-base leading-tight font-medium mt-1">
            {item.name}
          </p>
          <span className="text-base font-medium text-muted-foreground">
            {item.price}
          </span>
          <span className="text-green-700 flex gap-1 items-center my-2">
            <Star className="fill-green-700 w-4 h-4 ml-1" />
            {item.rating}
            <p className="text-primary text-xs">(12 Ratings)</p>
          </span>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {item.description}
          </p>
          <ItemDetailDrawer
            item={item}
            isDrawerOpen={detailsOpen}
            setIsDrawerOpen={setDetailsOpen}
          />
        </div>
        <div className="col-span-2">
          <div className="relative flex flex-col items-center aspect-square align-top">
            <Image
              src={imageSrc}
              alt={item.name}
              onError={handleImageError}
              layout="fill"
              className="object-cover rounded-lg"
              onClick={() => setDetailsOpen(!detailsOpen)}
            />
            {existingItems.length > 0 ? (
              <div className="absolute bottom-[-2vh]">
                <div className="flex items-center justify-center w-fit bg-rose-50 rounded p-1 text-rose-600">
                  <SquareMinus size={24} onClick={decrement} />
                  <span id="counter" className="font-bold w-8 text-center">
                    {existingItems?.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    ) || quantity}
                  </span>
                  <SquarePlus size={24} onClick={increment} />
                </div>
              </div>
            ) : (
              <div
                className={`absolute ${item.variant || item.addons
                  ? "bottom-[-4vh]"
                  : "bottom-[-2vh]"
                  } flex flex-col items-center`}
              >
                <Button
                  className="border-2 border-rose-500 text-rose-500 text-base font-semibold shadow-lg"
                  variant="outline"
                  onClick={() => {
                    if (item.variant || item.addons) {
                      setAddDrawerOpen(true);
                    } else {
                      handleAddToCart();
                    }
                  }}
                >
                  ADD
                </Button>
                {(item.variant || item.addons) && (
                  <p className="text-xs text-muted-foreground/50 font-semibold mt-1">
                    Customisable
                  </p>
                )}
              </div>
            )}
          </div>
          {/* Add Drawer */}
          {(item.variant || item.addons) &&
            <Customize
              item={item}
              addDrawerOpen={addDrawerOpen}
              setAddDrawerOpen={setAddDrawerOpen}
            />}
          {/* Edit Drawer */}
          <Drawer open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
            <DrawerContent className="mb-4">
              <DrawerHeader className="flex items-start w-full">
                <div className="flex flex-col items-start w-full">
                  <DrawerDescription>Add or remove items</DrawerDescription>
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
              {existingItems.map((item, key) => (
                <div className="px-4 my-2" key={key}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium flex items-center gap-1">
                      <Image
                        src={iconMap[item.food_item.food_type]}
                        alt="Dash"
                        height="14"
                        width="14"
                      />
                      {item.food_item?.name}
                      {item.variant && ` - ${item.variant.name}`}
                    </p>
                    <SetQuantity item={item} />
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="font-medium text-muted-foreground">
                      ₹ {item.food_item.price}
                    </span>
                    <span className="font-medium">₹ {item.totalPrice}</span>
                  </div>
                </div>
              ))}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <Separator className={`${item.variant || item.addons ? "mt-2" : ""}`} />
    </>
  );
}

export function MenuDisabledItemComponent({ item }) {
  const [imageSrc, setImageSrc] = useState(item.image_url || "/food-thumb.jpg");
  const handleImageError = () => setImageSrc("/food-thumb.jpg");

  return (
    <>
      <div className="grid grid-cols-5 gap-2 justify-between py-8">
        <div className="col-span-3">
          <Image
            src={iconMap[item.food_type]}
            alt={item.name}
            onError={handleImageError}
            height="16"
            width="16"
          />
          <p className="text-base leading-tight font-medium mt-1">
            {item.name}
          </p>
          <span className="text-base font-medium text-muted-foreground">
            ₹ {item.price}
          </span>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {item.description}
          </p>
          <ItemDetailDrawer item={item} />
        </div>
        <div className="col-span-2">
          <div className="relative flex flex-col items-center aspect-square align-top">
            <Image
              src={imageSrc}
              alt={item.name}
              layout="fill"
              className="object-cover rounded-lg grayscale"
            />

            <div className="absolute bottom-[-2vh] max-w-28 p-1 rounded-md text-center leading-none text-xs text-gray-500 border-2 border-gray-400 shadow bg-white">
              Item currently unavailable
            </div>
          </div>
        </div>
      </div>
      <Separator className={`${item.variant ? "mt-2" : ""}`} />
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
            category.food_items.map((item) =>
              item.in_stock ? (
                <MenuItemComponent key={item.name} item={item} />
              ) : (
                <MenuDisabledItemComponent key={item.name} item={item} />
              ),
            )}
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
            <DrawerTitle className="truncate">Search in Menu</DrawerTitle>
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

          <section className="overflow-y-scroll no-scrollbar h-[60vh]">
            {/* Display search results */}
            {!loading && filteredItems.length > 0
              ? filteredItems.map((item) => (
                <div key={item.name}>
                  <MenuItemComponent item={item} />
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

export function MenuAccordion({ items, outlet }) {
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
          <div className="flex">
            <div className="flex items-center text-muted-foreground text-sm">
              Filters <Settings2 className="w-3.5 h-3.5 ml-1" />{" "}
              <Separator orientation="vertical" className="mx-2" />
            </div>

            <div className="flex items-center gap-1 overflow-x-scroll no-scrollbar">
              {
                outlet.type?.length === 1 ? (
                  <p className="text-sm whitespace-nowrap h-full text-green-600 bg-gradient-to-bl from-green-200 border flex items-center gap-1  p-1 px-2 rounded-xl w-fit">
                    <LeafyGreen className="h-3.5 w-3.5 fill-green-200" /> Pure Veg
                  </p>) : (
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    onValueChange={(value) => setFoodTypeFilter(value)} // Set filter state
                  >
                    {outlet.type.map((type, key) => (
                      <ToggleGroupItem
                        key={key}
                        value={type}
                        aria-label="Veg Filter"
                        className="gap-2 px-4 data-[state=on]:bg-gray-100 align-left"
                      >
                        <Image
                          src={iconMap[type]}
                          alt="Veg"
                          height="16"
                          width="16"
                        />
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )
              }
            </div>
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

export function ItemDetailDrawer({ item, isDrawerOpen, setIsDrawerOpen }) {
  const [imageSrc, setImageSrc] = useState(item.image_url || "/food-thumb.jpg");
  const handleImageError = () => {
    setImageSrc("/food-thumb.jpg"); // Fallback image on error
  };
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent>
        <div className="relative my-2 px-4">
          <Image
            src={imageSrc}
            alt="Item"
            height="300"
            width="500"
            onError={handleImageError}
            className="w-full aspect-video rounded-lg object-cover"
          />
          <Button
            className="absolute top-2 right-6 h-6 w-6"
            size="icon"
            variant="outline"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-4 mt-2 mb-8">
          <Image
            src={iconMap[item.food_type]}
            alt="Dash"
            height="16"
            width="16"
          />
          <DialogTitle className="text-lg mt-1 leading-none font-medium">
            {item.name}
          </DialogTitle>
          <span className="text-base font-medium text-muted-foreground">
            ₹ {item.price}
          </span>
          <span className="text-green-700 flex gap-1 items-center my-2">
            <Star className="fill-green-700 w-4 h-4 ml-1" />
            {item.rating}
            <p className="text-primary text-xs">(12 Ratings)</p>
          </span>
          <p className="text-muted-foreground text-xs">{item.description}</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}