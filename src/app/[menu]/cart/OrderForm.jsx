"use client";
import * as React from "react";
// components ui
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
// icons
import { Bike, Package, UtensilsCrossed } from "lucide-react";
// animations
import ShinyText from "@/components/ui/animations/ShinyText";
// components
import { Summary } from "@/app/components/orderForm/Summary";
// server actions
import { checkout } from "@/app/lib/order/checkout";
// hooks
import { useCart } from "@/context/CartContext";
import { useDrawer } from "@/context/DrawerContext";

import { cashfree } from "@/app/util/cashfree";

const SERVICE_MAP_ICON = {
  dine_in: <UtensilsCrossed className="h-3.5 w-3.5 mr-1" />,
  takeaway: <Package className="h-3.5 w-3.5 mr-1" />,
  delivery: <Bike className="h-3.5 w-3.5 mr-1" />,
};

export function OrderForm({ params, outlet, tables, table, session }) {
  const { cartItems } = useCart();
  const { openDrawer } = useDrawer();

  const tableSelectRef = React.useRef(null); // 1. Create a ref for the SelectTrigger
  
  const [order, setOrder] = React.useState({
    type: "dine_in",
    table_id: table?.table_id,
  });
  const totalPrice = cartItems?.reduce((acc, item) => acc + item.totalPrice, 0);
  const [alert, setAlert] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleOrderType = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!session) {
      openDrawer();
      return;
    }
    if (order.type === "dine_in" && !order.table_id) {
      setAlert("Please select a table");
      tableSelectRef.current?.focus();
      return;
    }
    setLoading(true);
    try {
      const response = await checkout({
        params,
        order_type: order.type,
        table_id: order.table_id,
        instructions: order.instruction,
      });
 
      if (response) {
        setOrder({ type: "dine_in" });
        const checkoutOptions = {
          paymentSessionId: response.payment_session_id,
          // returnUrl: `${process.env.SERVER_URL}/${params.menu}/order/${response.order_id}`,
          returnUrl: `https://app.tacoza.co/order/${response.order_id}`,
        };
        cashfree.checkout(checkoutOptions).then(function (result) {
          if (result.error) {
            console.error(result.error.message);
          }
          if (result.redirect) {
            console.log("Redirection");
            // console.log(result);
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6 gap-3 items-start flex flex-col">
        <Label forhtml="type">Order Type</Label>
        <ToggleGroup
          id="type"
          type="single"
          defaultValue="dine_in"
          onValueChange={(value) => {
            setOrder({ ...order, type: value });
          }}
        >
          {
            outlet.services.map((service, key) => (
              <ToggleGroupItem
                key={key}
                value={service}
                className={`border rounded-full data-[state=on]:text-primary data-[state=on]:border-primary data-[state=on]:bg-rose-100`}
              >
                {SERVICE_MAP_ICON[service]}
                {service.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </ToggleGroupItem>
            ))
          }
        </ToggleGroup>
        <Label forhtml="instruction">Add Cooking Instruction</Label>
        <Textarea
          id="instruction"
          name="instruction"
          placeholder="Add your cooking instruction"
          onChange={handleOrderType}
        />
        <Label htmlFor="table_id">Table</Label>
        <Select
          id="table_id"
          onValueChange={(value) => {
            setOrder({ ...order, table_id: value });
            setAlert(null); // Clear alert when a table is selected
          }}
          value={order.table_id || table?.table_id}
        >
          <SelectTrigger ref={tableSelectRef}>
            <SelectValue placeholder="Select Table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table, key) => (
              <SelectItem key={key} value={table.table_id}>
                {table.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {alert && <p className="text-xs text-red-500">{alert}</p>}
      </Card>
      <Summary totalPrice={totalPrice} />
      <Button
        onClick={handleSubmit}
        className="sticky bottom-5 right-0 p-6 rounded-xl shadow-xl"
        disabled={loading}
      >
        <ShinyText
          shimmerWidth={300}
          className="drop-shadow-lg text-lg font-bold"
        >
          Proceed to Pay ₹{totalPrice}
        </ShinyText>
      </Button>
    </>
  );
}
