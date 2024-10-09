import { ChevronLeft, ChevronRightIcon, RotateCcwSquare } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import Image from "next/image";

import { notFound } from "next/navigation";
import { getSession, logout } from "@/app/lib/auth/session";
import { apiGet } from "@/handlers/apiHandler";

export const metadata = {
  title: "My Orders - tacoza (Instant food Ordering)",
  description: "Scan, Crave and Order superfast",
};

const iconMap = {
  veg: "/veg.svg",
  nonveg: "/non-veg.svg",
  egg: "/egg.svg",
};

export default async function Order() {
  const user = await getSession();
  const orderHistory = await apiGet(`/api/shop/orders/`, {
    headers: {
      Authorization: `Bearer ${user?.tokens?.access}`,
    },
  });
  if (orderHistory.status === 404 || orderHistory.status === 401) notFound();

  return (
    <main
      className="max-w-lg p-4 gap-4 flex flex-col bg-gray-100"
      suppressHydrationWarning
    >
      <h2 className="text-2xl font-semibold">
        <Link href={`/`}>
          <Button size="icon" variant="outline" className="h-8 w-8 mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        Orders History
      </h2>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">HOME</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>ORDERS</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {orderHistory?.map((order, key) => (
        <Card className="overflow-hidden" key={key}>
          <CardHeader className="bg-rose-50">
            <div className="flex items-center gap-4">
              <div className="aspect-square h-14">
                <Image
                  src={
                    order.outlet.logo ? order.outlet.logo : "/outlet-thumb.jpg"
                  }
                  alt="Restaurant"
                  height="100"
                  width="100"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-muted-foreground leading-tight text-xs">
                <div className="text-base text-black font-semibold truncate">
                  {order.outlet.name}
                </div>
                {order.outlet.location}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/${order.outlet.menu_slug}`}
                    className="flex items-center text-primary"
                  >
                    View Menu <ChevronRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 mt-4">
            {order.items.map((item, key) => (
              <div className="flex items-center justify-between" key={key}>
                <p className="font-medium flex items-center gap-2 leading-tight">
                  <Image
                    src={iconMap[item.food_item.food_type]}
                    alt="veg"
                    height="16"
                    width="16"
                  />
                  <span className="text-muted-foreground text-nowrap">
                    {item.quantity} x
                  </span>
                  {item?.food_item?.name}
                </p>
              </div>
            ))}
            <Separator />
            <Link href={`/order/${order.order_id}`}>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-muted-foreground truncate">
                  Ordered on {new Date(order.created_at).toLocaleDateString()}
                  <p className="text-base">{order.status.toUpperCase()}</p>
                </span>
                <span className="flex items-center text-base font-medium text-nowrap">
                  ₹{order.total} <ChevronRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
            <Separator className="hidden" />

            <Button className="hidden h-8 gap-1 w-fit">
              <RotateCcwSquare className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Reorder
              </span>
            </Button>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
