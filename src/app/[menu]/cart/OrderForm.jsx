"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bike, HelpCircle, Package, UtensilsCrossed } from "lucide-react";
import { Summary } from "@/app/components/orderForm/Summary";
import { checkout } from "@/app/lib/order/checkout";
import { useCart } from "@/context/CartContext";
import { useDrawer } from "@/context/DrawerContext";
import { cashfree } from "@/app/util/cashfree";
import { logout } from "@/app/lib/auth/session";
import ShinyButton from "@/components/ui/animations/ShinyButton";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SERVICE_MAP_ICON = {
  dine_in: <UtensilsCrossed className="h-3.5 w-3.5 mr-1" />,
  takeaway: <Package className="h-3.5 w-3.5 mr-1" />,
  delivery: <Bike className="h-3.5 w-3.5 mr-1" />,
};

export function OrderForm({ params, outlet, tables, table, session }) {
  const { cartItems } = useCart();
  const { openDrawer } = useDrawer();
  const router = useRouter();

  const tableSelectRef = React.useRef(null);

  const [paymentDrawer, setPaymentDrawer] = React.useState(false);
  const [order, setOrder] = React.useState({
    type: "dine_in",
    table_id: table?.table_id,
  });
  const [alert, setAlert] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("online");

  const totalPrice = cartItems?.reduce(
    (acc, item) => acc + Number(item.totalPrice),
    0,
  );

  const handleOrderType = ({ target: { name, value } }) =>
    setOrder((prev) => ({ ...prev, [name]: value }));

  const showAlert = (message) => setAlert(message);

  const validateOrder = () => {
    if (!session) return openDrawer();
    if (!order.type) return showAlert("Please select an order type");
    if (order.type === "dine_in" && !order.table_id) {
      showAlert("Please select a table");
      tableSelectRef.current?.focus();
      return;
    }
    if (cartItems.length === 0) return showAlert("Empty cart");
    return true;
  };

  const selectPaymentMethod = () => {
    if (validateOrder()) setPaymentDrawer(true);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await checkout({
        params,
        order_type: order.type,
        table_id: order.table_id,
        instructions: order.instruction,
        payment_method: paymentMethod,
      });
      if (response?.error) return logout();
      if (response?.payment_session_id) {
        cashfree
          .checkout({
            paymentSessionId: response.payment_session_id,
            returnUrl: `https://app.tacoza.co/order/${response.order_id}`,
          })
          .catch((err) => console.error(err));
      }
      router.push(`/order/${response.order_id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setPaymentDrawer(false);
    await handlePayment();
  };

  const renderToggleGroupItem = (value, label, icon = null) => (
    <ToggleGroupItem
      className="w-full flex justify-between h-16 text-base font-bold  data-[state=on]:border-2  data-[state=on]:border-primary  data-[state=on]:text-primary  data-[state=on]:bg-rose-50"
      value={value}
    >
      {icon} {label}
    </ToggleGroupItem>
  );

  return (
    <>
      <Card className="mx-4 p-6 gap-3 shadow-none items-start flex flex-col">
        <Label htmlFor="type">Order Type</Label>
        <ToggleGroup
          id="type"
          type="single"
          defaultValue="dine_in"
          onValueChange={(value) =>
            setOrder((prev) => ({ ...prev, type: value }))
          }
        >
          {outlet.services.map((service, key) => (
            <ToggleGroupItem
              key={key}
              value={service}
              className="border rounded-full data-[state=on]:text-primary data-[state=on]:border-primary data-[state=on]:bg-rose-100"
            >
              {SERVICE_MAP_ICON[service]}
              {service
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Separator className="my-1" />

        <Label htmlFor="table_id" className="flex items-center">
          Table
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="h-4 w-4 ml-1" />
            </PopoverTrigger>
            <PopoverContent align="start" className="bg-rose-50">
              <p className="text-sm">
                Table number will be present on table or below the QR code.
              </p>
            </PopoverContent>
          </Popover>
        </Label>
        <Select
          id="table_id"
          onValueChange={(value) =>
            setOrder((prev) => ({ ...prev, table_id: value }))
          }
          value={order.table_id || table?.table_id}
        >
          <SelectTrigger ref={tableSelectRef}>
            <SelectValue placeholder="Select Table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table) => (
              <SelectItem key={table.table_id} value={table.table_id}>
                {table.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {alert && <p className="text-xs text-red-500">{alert}</p>}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger htmlFor="instruction">
              Add Cooking Instruction
            </AccordionTrigger>
            <AccordionContent>
              <Textarea
                id="instruction"
                name="instruction"
                placeholder="Add your cooking instruction"
                onChange={handleOrderType}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <Summary totalPrice={totalPrice} />

      <ShinyButton
        onClick={selectPaymentMethod}
        className="sticky bottom-5 mx-4 w-auto p-6 rounded-xl text-lg font-bold text-white shadow-xl"
        disabled={loading}
        shimmerWidth={150}
      >
        Proceed to Pay ₹{totalPrice}
      </ShinyButton>

      <Drawer open={paymentDrawer} onOpenChange={setPaymentDrawer}>
        <DrawerContent className="mb-4">
          <DrawerHeader className="flex items-start w-full">
            <div className="flex flex-col items-start w-full">
              <DrawerDescription>
                Pay ₹{totalPrice} to Place your order
              </DrawerDescription>
              <DrawerTitle>Select Payment Method</DrawerTitle>
            </div>
          </DrawerHeader>

          <ToggleGroup
            className="w-full flex-col gap-4 p-4"
            type="single"
            variant="outline"
            defaultValue={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            {outlet.payment_methods.includes("online") &&
              renderToggleGroupItem("online", "Pay Now", <OnlineImage />)}

            {outlet.payment_methods.includes("cash") &&
              renderToggleGroupItem("cash", "Pay Cash", <CashImage />)}
          </ToggleGroup>

          <DrawerFooter>
            <Button
              className="text-lg font-bold h-12"
              onClick={placeOrder}
              disabled={!paymentMethod || loading}
            >
              Place Order
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const CashImage = () => (
  <Image
    src="/rupee.png"
    width={60}
    height={16}
    alt="cash"
    className="object-cover h-8 w-12 rounded-[5px]"
  />
);

const OnlineImage = () => (
  <Image
    src="/payonline.png"
    width={400}
    height={100}
    alt="online"
    className="h-10 w-40"
  />
);
