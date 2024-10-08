import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export function Details({ params, outlet }) {
  return (
    <div className="bg-white p-4 rounded-lg overflow-hidden mx-4">
      <div className="flex gap-1 hidden">
        <Store className="h-4 w-4" /> {outlet?.shop?.name}
      </div>
      <div className="grid gap-2">
        <div className="flex items-center gap-4">
          <div className="aspect-square h-14">
            <Image
              src={outlet.logo ? outlet.logo : "/outlet-thumb.jpg"}
              alt="Restaurant"
              height="100"
              width="100"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-muted-foreground leading-tight text-xs">
            <div className="text-base text-black font-semibold truncate">
              {outlet?.name}
            </div>
            {outlet?.location}
            <div className="flex items-center gap-1">
              <Link
                href={`/${params?.menu}`}
                className="flex items-center text-primary"
              >
                View Menu <ChevronRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
