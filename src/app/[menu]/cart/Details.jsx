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
    <Card className="overflow-hidden">
      <CardHeader className="bg-rose-50">
        <CardTitle className="flex gap-1">
          <Store className="h-4 w-4" /> {outlet?.shop?.name}
        </CardTitle>
        <CardDescription>Outlet Information</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 mt-4">
        <div className="flex items-center gap-4">
          <div className="aspect-square">
            <Image
              src="/outlet-thumb.jpg"
              alt="Restaurant"
              height="100"
              width="100"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="text-muted-foreground text-sm">
            <div className="text-base text-primary font-semibold truncate">
              {outlet?.name}
            </div>
            {outlet?.location}
            <div className="flex items-center gap-1">
              <Link
                href={`/${params?.menu}`}
                className="flex items-center text-blue-500"
              >
                View Menu <ChevronRightIcon className="h-4 w-4 mt-1" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
