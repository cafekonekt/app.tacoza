'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotepadText, Tags } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function Summary({ totalPrice }) {
  const Gst = totalPrice * 0.05;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="flex gap-1">
            <NotepadText className="h-4 w-4" /> Bill Summary
          </CardTitle>
          <CardDescription>Apply Offers to get discount</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <Label forhtml="coupon" className="flex items-center mb-1">
          <Tags className="h-3.5 w-3.5 mr-1" /> Discount
        </Label>
        <div className="flex items-center gap-2 mb-4">
          <Input
            id="coupon"
            label="Coupon Code"
            placeholder="Enter coupon code"
          />
          <Button>Apply</Button>
        </div>
        <div className="grid gap-3">
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹ {totalPrice - Gst}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">GST</span>
              <span>₹ {Gst}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Platform Fee</span>
              <span>₹ 0</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Discount</span>
              <span>₹ 0</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>₹ {totalPrice}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <li className="flex items-center justify-between font-semibold">
          <span>To Pay</span>
          <span>₹ {totalPrice}</span>
        </li>
      </CardContent>
    </Card>
  );
}
