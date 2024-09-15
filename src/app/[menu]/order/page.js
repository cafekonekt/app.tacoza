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
import { getOrders } from "@/app/lib/order/getOrders";

const iconMap = {
  veg: "/veg.svg",
  nonveg: "/non-veg.svg",
  egg: "/egg.svg",
};

export default async function Order({ params }) {
  const outletSlug = params.menu;
  const orderHistory = await getOrders(params);
  return (
    <main className="max-w-lg p-4 gap-4 grid" suppressHydrationWarning>
      <h2 className="text-2xl font-semibold">
        <Link href={`/${outletSlug}`}>
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
            <BreadcrumbLink href={`/${outletSlug}`}>
              {outletSlug.toUpperCase()}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>ORDERS</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {orderHistory?.map((order, key) => (
        <Card className="overflow-hidden" key={key}>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="aspect-square">
                <Image
                  src="/pizza.jpg"
                  alt="Restaurant"
                  height="100"
                  width="100"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="text-muted-foreground text-sm">
                <div className="text-base text-primary font-semibold">
                  Sagar Gaire, Chhindwara
                </div>
                Liam Johnson1234 Main St.Anytown, CA 12345
                <div className="flex items-center gap-1">
                  <Link
                    href="tel:+1234567890"
                    className="flex items-center text-blue-500"
                  >
                    View Menu <ChevronRightIcon className="h-4 w-4 mt-1" />
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 mt-4">
            {order.items.map((item, key) => (
              <div className="flex items-center justify-between" key={key}>
                <p className="font-medium flex items-center gap-2">
                  <Image
                    src={iconMap[item.food_item.food_type]}
                    alt="Dash"
                    height="16"
                    width="16"
                  />
                  <span className="text-muted-foreground">
                    {item.quantity} x
                  </span>
                  {item?.food_item?.name}
                </p>
              </div>
            ))}
            <Separator />
            <Link href={`/${outletSlug}/order/${order.order_id}`}>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-muted-foreground truncate">
                  Ordered on {new Date(order.created_at).toLocaleDateString()},{" "}
                  {new Date(order.created_at).toLocaleTimeString()}
                  <p className="text-base">Completed</p>
                </span>
                <span className="flex items-center text-base font-medium">
                  ₹ {order.total} <ChevronRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
            <Separator />

            <Button className="h-8 gap-1 w-fit">
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
