"use client";
import { Button } from "@/components/ui/button";
import { cashfree } from "@/app/util/cashfree";
import { RefreshCcw } from "lucide-react";

export function Payment({ order, params }) {
  console.log(order);
  const handlePayment = async () => {
    const checkoutOptions = {
      paymentSessionId: order.payment_session_id,
      returnUrl: `http://localhost:3000/${params.menu}/order/${order.order_id}`,
    };
    cashfree.checkout(checkoutOptions).then(function (result) {
      if (result.error) {
        console.log(result.error.message);
      }
      if (result.redirect) {
        console.log("Redirection");
        console.log(result);
      }
    });
  };
  return (
    <Button
      onClick={handlePayment}
      variant="destructive"
      className="bg-red-600 mt-2"
    >
      <RefreshCcw className="w-4 h-4 mr-1.5" /> Retry Payment
    </Button>
  );
}
