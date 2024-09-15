import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Auth } from "@/app/components/auth/Auth";

export async function Header({ params, session }) {
  return (
    <div className="flex justify-between">
      <h2 className="text-2xl font-semibold">
        <Link href={`/${params.menu}`}>
          <Button size="icon" variant="outline" className="h-8 w-8 mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        Cart
      </h2>
      {!session && <Auth />}
    </div>
  );
}