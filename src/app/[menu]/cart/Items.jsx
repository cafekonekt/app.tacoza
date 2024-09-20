"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Utensils } from "lucide-react";
import Image from "next/image";
import { SetQuantity } from "@/app/components/cart/item/SetQuantity";
import { useCart } from "@/context/CartContext";
// utils
const iconMap = {
  veg: "/veg.svg",
  nonveg: "/non-veg.svg",
  egg: "/egg.svg",
};

export function Items() {
  const { cartItems } = useCart();
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-rose-50">
        <CardTitle className="flex gap-1">
          <Utensils className="h-4 w-4" /> Items
        </CardTitle>
        <CardDescription>Customize your quantity</CardDescription>
      </CardHeader>
      {cartItems.map((item, key) => (
        <CardContent key={key}>
          <div className="mt-2">
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
          <p className="text-muted-foreground text-xs">
            {item.addons &&
              item.addons.length > 0 &&
              item.addons.map((addon, key) => (
                <span key={key}>
                  {addon.name}
                  {key < item.addons.length - 1 ? ", " : ""}
                </span>
              ))}
          </p>
        </CardContent>
      ))}
    </Card>
  );
}
