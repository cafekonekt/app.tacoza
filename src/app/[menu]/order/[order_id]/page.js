import {
  ChevronLeft,
  Copy,
  CreditCard,
  HelpCircle,
  MapPin,
  MoreVertical,
  PhoneCall,
  Star,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/ratings";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components/ui/animations/Timeline";
import { Rating } from "./Rating";
import { getOrder } from "@/app/lib/order/getOrders";
import { notFound } from "next/navigation";
import { Payment } from "./Payment";

export default async function Order({ params }) {
  const order = await getOrder(params);
  if (!order) return notFound();
  return (
    <main className="max-w-lg p-4 gap-4 grid">
      <h2 className="text-2xl font-semibold">
        <Button size="icon" variant="outline" className="h-8 w-8 mr-2">
          <Link href={`/${params.menu}/order`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        Orders Summary
      </h2>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">HOME</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${params.menu}`}>
              {params.menu.toUpperCase()}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${params.menu}/order`}>
              ORDERS
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>SUMMARY</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Restaurant</CardTitle>
          <CardDescription>
            {order.outlet.name}
            <br /> {order.outlet.address}
            <div className="flex items-center gap-1">
              <Badge className="w-fit h-6">{order.table}</Badge>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <PhoneCall className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MapPin className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </div>
          </CardDescription>
        </CardHeader>
        <Rating />
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Status</CardTitle>
          <CardDescription className="flex justify-between items-center">
            Order Delivered
            <span className="flex items-center border p-1 px-2 rounded-full text-green-700 border-green-700 bg-green-100">
              <Timer className="w-4 h-4 mr-1" />
              Est.{" "}
              {Math.floor(
                (new Date(order.created_at).getTime() -
                  new Date(order.updated_at).getTime()) /
                  (1000 * 60),
              )}{" "}
              mins
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline>
            <iframe
              className="flex items-center justify-center w-full h-52"
              src="https://lottie.host/embed/8b3b1e73-5217-4373-a3a8-f868f2ccc493/FCrGjRZ7Pm.json"
            ></iframe>
            <TimelineItem status="done">
              <TimelineHeading>Order Places</TimelineHeading>
              <TimelineDot status="done" />
              <TimelineLine done />
              <TimelineContent>
                Before diving into coding, it is crucial to plan your software
                project thoroughly.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeading>Done!</TimelineHeading>
              <TimelineDot />
              <TimelineLine />
            </TimelineItem>
            <TimelineItem>
              <TimelineHeading>Done!</TimelineHeading>
              <TimelineDot />
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order {order.order_id.split("-")[0]}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Date: {new Date(order.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Need Help
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {order.items.map((item, index) => (
                <li className="flex items-center justify-between" key={index}>
                  <span className="text-muted-foreground">
                    {item.food_item.name} x <span>{item.quantity}</span>
                  </span>
                  <span>{item.totalPrice}</span>
                </li>
              ))}
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>Liam Johnson</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">liam@acme.com</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">+1 234 567 890</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Payment Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Visa
                </dt>
                <dd>**** **** **** 4532</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
      <Payment order={order} params={params} />
    </main>
  );
}
