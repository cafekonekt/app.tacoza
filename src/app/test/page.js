"use client";
import React from "react";
import { ApplyOffers } from "../components/menu/cart/applyOffers";

// Dummy data for testing
const coupons = [
  {
    code: "SAVE50",
    discount: 99,
    percentage: 50,
    minCartValue: 400,
    maxDiscount: 100,
    description: "Get 50% off up to ₹100 on orders above ₹400",
    expiry: "2024-12-31",
    isApplicable: true,
  },
  {
    code: "NEWUSER10",
    discount: 50,
    percentage: 10,
    minCartValue: 500,
    maxDiscount: 50,
    description: "Get 10% off up to ₹50 on orders above ₹500",
    expiry: "2024-12-31",
    isApplicable: false,
  },
  {
    code: "FLAT70",
    discount: 300,
    percentage: 50,
    minCartValue: 600,
    maxDiscount: 300,
    description: "Get 70% off up to ₹300 on orders above ₹600",
    expiry: "2024-12-31",
    isApplicable: true,
  },
  {
    code: "FREESHIP",
    discount: 50,
    percentage: 100,
    minCartValue: 600,
    maxDiscount: 50,
    description: "Free shipping on orders above ₹600",
    expiry: "2024-12-31",
    isApplicable: true,
  },
  {
    code: "SUMMER25",
    discount: 75,
    percentage: 25,
    minCartValue: 300,
    maxDiscount: 75,
    description: "Get 25% off up to ₹75 on orders above ₹300",
    expiry: "2024-12-31",
    isApplicable: true,
  },
];

const cartValue = 700;

export default function CartPage() {
  const handleApplyCoupon = (coupon) => {
    console.log(`Coupon applied: ${coupon.code}`);
  };

  const handleRemoveCoupon = () => {
    console.log("Coupon removed");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Your Cart</h1>
      <p className="text-sm text-muted-foreground">Total: ₹{cartValue}</p>

      {/* Apply Offers Component */}
      <ApplyOffers
        coupons={coupons}
        cartValue={cartValue}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />
    </div>
  );
}
