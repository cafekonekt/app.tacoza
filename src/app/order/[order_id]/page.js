import {
  ChevronLeft,
  Copy,
  CreditCard,
  HelpCircle,
  Home,
  MapPin,
  MoreVertical,
  PhoneCall,
  RefreshCcw,
  Route,
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
import Script from "next/script";
import {
  PaymentSuccessAnimation,
  PaymentFailAnimation,
  FoodPreparingAnimation,
} from "@/app/components/lottie/lottie";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getPayment } from "@/app/lib/order/getPayment";

export default async function Order({ params }) {
  const order = await getOrder(params);
  console.log(order);
  if (!order) return notFound();
  // const orderResponse = await getPayment(params);
  // const paymentSuccess = orderResponse.some(
  //   (transaction) =>
  //     transaction.find(([key, value]) => key === "payment_status")[1] ===
  //     "SUCCESS",
  // );
  // const paymentPending = orderResponse.some(
  //   (transaction) =>
  //     transaction.find(([key, value]) => key === "payment_status")[1] ===
  //     "PENDING",
  // );
  // const paymentFailed = orderResponse.every(
  //   (transaction) =>
  //     transaction.find(([key, value]) => key === "payment_status")[1] ===
  //     "FAILED",
  // );

  return (
    <main className="max-w-lg p-4 gap-4 grid">
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

      {order.payment_status === "success" && (
        <section className="flex flex-col justify-center items-center">
          <PaymentSuccessAnimation />
          <span className="text-green-600 font-bold text-lg">
            Payment Received
          </span>
          <span className="text-sm text-center">
            Rs. { order.total }<br /> Ref Id: XXXX23423XXXX
          </span>
        </section>
      )}

      {/* Payment Processing */}
      {order.payment_status === "pending" && (
        <section className="flex flex-col justify-center items-center">
          <PaymentFailAnimation />
          <span className="text-blue-600 font-bold text-lg">
            Your payment is processing.
          </span>
          <span className="text-sm text-center">
            Please wait, do not make another payment until it is complete.
          </span>
        </section>
      )}

      {/* Payment Failed */}
      {order.payment_status === "failed" || order.payment_status === "active" && (
        <section className="flex flex-col justify-center items-center">
          <PaymentFailAnimation />
          <span className="text-red-600 font-bold text-lg">Payment Failed</span>
          <span className="text-sm text-center">
            Customer rejected UPI request or other failure reasons.
          </span>
          <Payment order={order} params={params} />
        </section>
      )}


      <Card className="overflow-hidden">
        {
          order.status === "preparing" && (
            <CardHeader className="bg-green-600 items-center">
              <FoodPreparingAnimation />
              <span className="text-secondary font-bold">Preparing your order</span>
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
            </CardHeader>)
        }
        <CardContent>
          <div className="text-sm mt-4">
            <div className="flex justify-between">
              <div className="grid">
                <span className="font-semibold">{order.outlet.name}</span>
                <span className="text-muted-foreground">
                  {order.outlet.address}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="w-fit h-6">
                  {order.table}
                </Badge>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <PhoneCall className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <Rating />
          <Separator className="mt-2" />
          <Accordion className="-mb-4" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex items-center gap-1">
                  <Route className="h-3.5 w-3.5" />
                  Order Timeline
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Timeline>
                  <TimelineItem status="done">
                    <TimelineHeading>Order Placed</TimelineHeading>
                    <TimelineDot status="done" />
                    <TimelineLine done />
                    <TimelineContent>{order.created_at}</TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineHeading>Payment</TimelineHeading>
                    <TimelineDot status="error" />
                    <TimelineLine />
                    <TimelineContent>Failed</TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineHeading>Preparing Food</TimelineHeading>
                    <TimelineDot />
                    <TimelineLine />
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineHeading>Served</TimelineHeading>
                    <TimelineDot />
                  </TimelineItem>
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
                <dd>{order.user.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">{order.user.email}</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">{order.user.phone}</a>
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

      {/* Freshwork widget */}
      <Script src="//in.fw-cdn.com/32110607/1125525.js" chat="true" />
    </main>
  );
}