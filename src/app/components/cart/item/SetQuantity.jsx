import React from "react";
import { useCart } from "@/context/CartContext";
import { SquareMinus, SquarePlus } from "lucide-react";

export function SetQuantity({ item }) {
  const { updateQuantity } = useCart();
  
  const decrement = async () => {
    await updateQuantity(item?.item_id, item?.quantity - 1);
  };
  const increment = async () => {
    await updateQuantity(item?.item_id, item?.quantity + 1);
  };

  return (
    <div className="flex items-center justify-center w-fit bg-rose-50 rounded p-1 text-rose-600">
      <SquareMinus size={24} onClick={decrement} />
      <span id="counter" className="font-bold w-8 text-center">
        {item?.quantity}
      </span>
      <SquarePlus size={24} onClick={increment} />
    </div>
  );
}
