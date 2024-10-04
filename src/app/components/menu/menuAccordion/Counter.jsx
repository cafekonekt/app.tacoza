"use client";
import { useCart } from "@/context/CartContext";
import { SquareMinus, SquarePlus } from "lucide-react";
import React from "react";

function Counter({ count, setCount }) {
  const decrement = () => {
    if (count === 1) {
      return;
    }
    setCount(count - 1);
  };
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div className="flex items-center justify-center bg-rose-50 rounded p-1 text-rose-600">
      <SquareMinus size={24} onClick={decrement} />
      <span id="counter" className="font-bold w-8 text-center">
        {count}
      </span>
      <SquarePlus size={24} onClick={increment} />
    </div>
  );
}

export default Counter;
