"use client";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function ItemAdded({ params }) {
  const { cartItems } = useCart();
  const redirect_url = params.table_id
    ? `/${params.menu}/cart/${params.table_id}`
    : `/${params.menu}/cart`;

  return (
    cartItems.length > 0 && (
      <button className="fixed bottom-0 right-0 w-full bg-rose-600 flex items-center justify-between p-6 animate-in slide-in-from-bottom">
        <span className="text-white font-bold">
          {cartItems.length} item added
        </span>
        <span className="text-white font-bold flex gap-2">
          <Link href={redirect_url} className="flex items-center gap-2">
            View Cart <ShoppingBag />
          </Link>
        </span>
      </button>
    )
  );
}
