"use client";
import { ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ListNav = () => {
    const pathname = usePathname();

    console.log(pathname, "pathname");

    return (
        <div className="grid items-start text-sm font-medium mt-4">
            <Link
                href={`/profile?prev=${pathname}`}
                className="flex items-center gap-3 rounded-lg pr-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
                <User className="h-4 w-4" />
                Profile
            </Link>
            <Link
                href={`/order?prev=${pathname}`}
                className="flex items-center gap-3 rounded-lg pr-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
                <ShoppingBag className="h-4 w-4" />
                Orders
            </Link>
        </div>
    );
};
