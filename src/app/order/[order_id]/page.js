import {
  BookmarkPlus,
  ChevronLeft,
  Copy,
  CreditCard,
  MoreVertical,
  Navigation,
  Phone,
  Route,
  Share2,
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
import { Badge } from "@/components/ui/badge";
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
import Script from "next/script";
import {
  PaymentSuccessAnimation,
  PaymentFailAnimation,
  FoodPreparingAnimation,
  PendingPayementAnimation,
} from "@/app/components/lottie/lottie";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PaymentLink } from "./paymentLink";

export const metadata = {
  title: "Order Summary - tacoza (Instant food Ordering)",
  description: "Scan, Crave and Order superfast",
};

export default async function Order({ params }) {
  const order = await getOrder(params);
  if (order.status === 404) notFound();
  const isCounterPayment = (order) => order.payment_method === "cash" && order.payment_status === "active";
  const needsLiteModeMessage = (order) => order.outlet?.lite && order.payment_status == "active";

  return (
    <main className="max-w-lg p-4 gap-4 grid bg-gray-100">
      <h2 className="text-2xl font-semibold">
        <Button size="icon" variant="outline" className="h-8 w-8 mr-2">
          <Link href={`/order`}>
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
            <BreadcrumbLink href={`/order`}>ORDERS</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>SUMMARY</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Payment Status Conditions */}
      {order.payment_status === "success" && (
        <section className="flex flex-col justify-center items-center">
          <PaymentSuccessAnimation />
          <span className="text-green-600 font-bold text-lg">Payment Received</span>
          <span className="text-sm text-center">Rs. {order.total}</span>
        </section>
      )}

      {order.payment_status === "active" && (
        <section className="flex flex-col justify-center items-center">
          {needsLiteModeMessage(order) ? (
            <>
              <PaymentSuccessAnimation />
              <span className="text-green-600 font-bold text-lg">Order Received</span>
              <span className="text-sm text-center">If you have made the payment, please show this to the vendor or pay <PaymentLink order={order} /> if not.</span>
            </>
          ): isCounterPayment(order) && (
            <>
              <PendingPayementAnimation />
              <span className="text-green-600 font-bold text-lg">Payment is pending</span>
              <span className="text-sm text-center">Please pay Rs. {order.total} at the counter</span>
            </>
          )}
        </section>
      )}

      {order.payment_status === "pending" && (
        <section className="flex flex-col justify-center items-center">
          <PendingPayementAnimation />
          <span className="text-yellow-600 font-bold text-lg">
            Payment is processing
          </span>
          <span className="text-sm text-center">
            Please wait, do not make another payment until it is complete.
          </span>
        </section>
      )}

      {order.payment_status === "failed" && (
        <section className="flex flex-col justify-center items-center">
          <PaymentFailAnimation />
          <span className="text-red-600 font-bold text-lg">Payment Failed</span>
          <Payment order={order} params={params} />
        </section>
      )}

      <Card className="overflow-hidden">
        {order.status === "preparing" && (
          <CardHeader className="bg-green-600 items-center">
            <FoodPreparingAnimation />
            <span className="text-secondary font-bold">
              Preparing your order
            </span>
            <span className="flex items-center p-1 px-2 rounded-full text-secondary text-sm bg-white/20">
              <Timer className="w-4 h-4 mr-1" />
              Est.{" "}
              {Math.floor(
                (new Date(order.created_at).getTime() -
                  new Date(order.updated_at).getTime()) /
                (1000 * 60),
              )}{" "}
              mins • Ontime
            </span>
          </CardHeader>
        )}
        <CardContent className="!p-4">
          <div className="text-sm mt-4">
            <div className="grid">
              <span className="font-semibold">{order.outlet.name}</span>
              <span className="text-muted-foreground">
                {order.outlet.address}
              </span>

              <div className="flex items-center gap-1">
                {order.table && <Badge variant="outline" className="text-nowrap w-fit h-8">
                  {order.table}
                </Badge>}
                <Button size="icon" variant="outline" className=" rounded-full">
                  <Link href={`tel:${order.outlet.phone}`}>
                    <Phone className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="icon" variant="outline" className="rounded-full" >
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full">
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Rating />
          <Accordion className="mt-2 px-4 border rounded-lg" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <Route className="h-3.5 w-3.5" />
                  Order Timeline
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Timeline>
                  {order.order_timeline.map((item, key) => (

                    <TimelineItem key={key} status={item.done ? "done" : ""}>
                      <TimelineHeading>{item.stage}</TimelineHeading>
                      <TimelineDot status={item.done ? "done" : ""} />
                      {item.done && (order.order_timeline?.length - 1 !== key) && <TimelineLine done />}
                      <TimelineContent>{item.content}</TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                  <span>₹{item.totalPrice}</span>
                </li>
              ))}
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Payment Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  {order.payment_method.toUpperCase()}
                </dt>
                <dd>**** **** ****</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      {/* Freshwork widget */}
      <Script src="//in.fw-cdn.com/32110607/1125525.js" chat="true" />
    </main>
  );
}
