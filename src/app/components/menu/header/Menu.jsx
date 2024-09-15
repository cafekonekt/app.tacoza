import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, MenuIcon, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { getSession, logout } from "@/app/lib/auth/session";

export async function Menu({ menu }) {
  const session = await getSession();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64 flex-col flex justify-between">
        <SheetHeader className="items-start">
          <SheetTitle>My Account</SheetTitle>
          <SheetDescription>Hi {session?.user?.name}!</SheetDescription>
          <div className="grid items-start text-sm font-medium mt-4">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg pr-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href={`/${menu}/order`}
              className="flex items-center gap-3 rounded-lg pr-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingBag className="h-4 w-4" />
              Orders
            </Link>
          </div>
        </SheetHeader>
        <Button variant="outline">
          <form
            action={async () => {
              "use server";
              await logout();
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 rounded-lg pr-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
