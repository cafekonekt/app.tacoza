import React from "react";
import { useCart } from "@/context/CartContext";
import { SquareMinus, SquarePlus } from "lucide-react";

export function SetQuantity({ item }) {
    const { updateQuantity } = useCart();
    const [quantity, setQuantity] = React.useState(item.quantity);
    
    const decrement = async () => {
        setQuantity(quantity-1)
        await updateQuantity(item?.id, quantity-1);
    };
    const increment = async () => {
        setQuantity(quantity+1);
        await updateQuantity(item?.id, quantity+1);
    };

    return (
        <div className="flex items-center justify-center w-fit bg-blue-50 rounded-md p-1 text-blue-600">
            <SquareMinus size={24} onClick={decrement} />
            <span id="counter" className="font-bold w-8 text-center">
                {quantity}
            </span>
            <SquarePlus size={24} onClick={increment} />
        </div>
    );
}