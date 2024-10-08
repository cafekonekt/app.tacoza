"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, NotepadText, Tags } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DiscountBadge } from "../lottie/lottie";

export function Summary({ totalPrice }) {
  const Gst = totalPrice * 0.05;

  return (
    <>
      <div className="p-4 mx-4 border bg-white rounded-lg">
        <div className="flex justify-between items-center font-semibold">
          <span className="flex items-center">
            <div className="h-8 -mr-2 -ml-3">
              <DiscountBadge />
            </div>
            Apply Coupon
          </span>
          <ChevronRight />
        </div>
      </div>
      <Card className="overflow-hidden mx-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="flex gap-1">
              <NotepadText className="h-4 w-4" /> Bill Summary
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{(totalPrice - Gst).toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">GST</span>
                <span>₹{Gst.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span>₹0</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Discount</span>
                <span>₹0</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>₹{totalPrice}</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <li className="flex items-center justify-between font-semibold">
            <span>To Pay</span>
            <span>₹{totalPrice}</span>
          </li>
        </CardContent>
      </Card>
    </>
  );
}
