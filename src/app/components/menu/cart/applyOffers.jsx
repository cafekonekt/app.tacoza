"use client";
import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { BadgePercent, Check, ChevronRight, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DiscountBadge } from "../../lottie/lottie";

// ApplyOffers Component
export function ApplyOffers({
  coupons,
  cartValue,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  const [bestOffer, setBestOffer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    const best = calculateBestOffer(coupons, cartValue);
    setBestOffer(best);
  }, [coupons, cartValue]);

  // Apply best offer
  const handleApply = (offer) => {
    setBestOffer({ ...offer, isApplied: true });
    onApplyCoupon(offer);
    setSuccessOpen(true);
    setDrawerOpen(false);
  };

  const handleRemoveOffer = () => {
    setBestOffer(calculateBestOffer(coupons, cartValue)); // Recalculate best offer after removal
    onRemoveCoupon();
  };

  // Confetti animation when coupon is successfully applied
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    if (successOpen) {
      triggerConfetti();
      const timer = setTimeout(() => setSuccessOpen(false), 3000); // Auto-close after 5 seconds
      return () => clearTimeout(timer); // Cleanup
    }
  }, [successOpen]);

  // Calculate best offer
  const calculateBestOffer = (coupons, cartValue) => {
    return (
      coupons
        .filter(
          (coupon) => coupon.isApplicable && cartValue >= coupon.minCartValue,
        )
        .sort((a, b) => b.discount - a.discount)[0] || null
    );
  };

  // Handle manual input of coupon code (case-insensitive)
  const handleManualApply = () => {
    const foundCoupon = coupons.find(
      (coupon) =>
        coupon.code.toLowerCase() === couponInput.toLowerCase() &&
        coupon.isApplicable &&
        cartValue >= coupon.minCartValue,
    );
    if (foundCoupon) {
      handleApply(foundCoupon);
    }
  };

  return (
    <div>
      {/* Applied Offer View */}
      {bestOffer?.isApplied ? (
        <div className="p-4 border bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex gap-1 text-base font-semibold">
              &apos{bestOffer.code}&apos applied
              </div>
              <div className="flex -mt-1 text-sm text-muted-foreground">
                <Check size={16} className="text-primary" />
                <span className="text-primary mr-1">
                  ₹{bestOffer.discount}
                </span>{" "}
                discount savings
              </div>
            </div>
            <button
              className="text-primary font-semibold text-sm"
              onClick={handleRemoveOffer}
            >
              Remove
            </button>
          </div>
        </div>
      ) : bestOffer ? (
        <>
          {/* Best Offer */}
          <div className="p-4 border bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-0.5 text-base font-semibold">
                  <BadgePercent size={24} className="fill-primary text-white" />
                  {bestOffer?.code}
                </div>
                <div className="flex gap-2 -mt-1 text-sm text-muted-foreground">
                  Save ₹{bestOffer?.discount} on this order
                </div>
              </div>
              <button
                className="text-primary font-semibold text-sm"
                onClick={() => handleApply(bestOffer)}
              >
                Apply
              </button>
            </div>
            {/* Show all coupons button */}
            <div
              className="border-t-2 border-dashed pt-2 mt-2 flex justify-center items-center text-sm text-muted-foreground cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            >
              Show all coupons <ChevronRight size={16} className="ml-1" />
            </div>
          </div>

          {/* Alert if cart value is too low */}
          {bestOffer && cartValue < bestOffer.minCartValue && (
            <p className="text-xs text-primary font-semibold">
              Add ₹{bestOffer.minCartValue - cartValue} value item to avail this
              offer
            </p>
          )}
        </>
      ) : (
        // If no offers available, show this div
        <div
          className="p-4 border bg-white rounded-lg shadow-md"
          onClick={() => setDrawerOpen(true)}
        >
          <div className="flex justify-between items-center font-semibold">
            <span>Apply Coupon</span>
            <ChevronRight />
          </div>
        </div>
      )}

      {/* Drawer for coupon selection */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader className="flex items-start justify-between w-full">
            <div className="flex-col flex justify-start">
              <DrawerTitle>Apply Coupon and Offers</DrawerTitle>
              <DrawerDescription className="text-left">
                Cart Value • ₹{cartValue}
              </DrawerDescription>
            </div>
            <DrawerClose>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full h-6 w-6"
              >
                <X size={16} />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="relative px-4 shadow pb-2">
            <Input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="bg-white w-full h-12"
              placeholder="Enter coupon code"
            />
            <Button
              size="sm"
              className="absolute top-2 right-6 h-8"
              onClick={handleManualApply}
            >
              Apply
            </Button>
          </div>
          <div className="px-4 pt-2 bg-gray-200 grid gap-2 overflow-y-scroll">
            {coupons
              .sort((a, b) => (b.isApplicable ? 1 : -1))
              .map((coupon) => (
                <div
                  key={coupon.code}
                  className={`p-4 border bg-white rounded-lg shadow-md last:mb-10 ${
                    !coupon.isApplicable ? "grayscale" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-0.5 text-base font-semibold">
                        <BadgePercent
                          size={24}
                          className="fill-primary text-white"
                        />
                        {coupon.code}
                      </div>
                      <div className="flex gap-2 -mt-1 text-sm font-semibold text-muted-foreground">
                        Save ₹{coupon.discount} on this order
                      </div>
                      <div className="flex gap-2 text-sm leading-none text-muted-foreground">
                        {coupon.description}
                      </div>
                    </div>
                    <button
                      className={`text-primary font-semibold text-sm ${
                        !coupon.isApplicable ? "cursor-not-allowed" : ""
                      }`}
                      onClick={() => coupon.isApplicable && handleApply(coupon)}
                      disabled={!coupon.isApplicable}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-xs rounded-lg justify-center">
          <div className="max-h-20">
            <DiscountBadge />
          </div>
          <DialogHeader>
            <DialogTitle>You saved ₹{bestOffer?.discount || 0}</DialogTitle>
            <DialogDescription>
              Coupon code has been applied to your order.
            </DialogDescription>
          </DialogHeader>
          <p className="text-green-600 text-sm mt-4 text-center">Wow! Thanks</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
