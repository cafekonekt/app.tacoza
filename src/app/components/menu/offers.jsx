"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { DiscountBadge } from "../lottie/lottie";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, CopyCheck, X } from "lucide-react";

// Dummy offers data
const offers = [
  {
    id: 1,
    title: "50% OFF upto ₹80",
    code: "SAVE50",
    condition: "ABOVE ₹199",
    description:
      "Use code SAVE50 and get 50% off upto ₹80 on orders above ₹199",
    terms: [
      "Valid on orders above ₹199",
      "Valid on selected restaurants",
      "Valid till 31st Dec 2024",
    ],
  },
  {
    id: 2,
    title: "30% OFF upto ₹50",
    code: "SAVE30",
    condition: "ABOVE ₹149",
    description:
      "Use code SAVE30 and get 30% off upto ₹50 on orders above ₹149",
    terms: [
      "Valid on orders above ₹149",
      "Valid on all restaurants",
      "Valid till 31st Dec 2024",
    ],
  },
  {
    id: 3,
    title: "10% Cashback upto ₹100",
    code: "CASHBACK10",
    condition: "ABOVE ₹299",
    description: "Get 10% cashback upto ₹100 on orders above ₹299",
    terms: [
      "Valid on orders above ₹299",
      "Valid for all payment methods",
      "Valid till 31st Dec 2024",
    ],
  },
  {
    id: 4,
    title: "Free Delivery",
    code: "FREEDEL",
    condition: "ABOVE ₹99",
    description: "Use code FREEDEL for free delivery on orders above ₹99",
    terms: [
      "Valid on orders above ₹99",
      "Applicable only for selected locations",
      "Valid till 31st Dec 2024",
    ],
  },
];

export function OffersSlider() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedOffer, setSelectedOffer] = React.useState(null);
  const plugin = React.useRef(Autoplay({ delay: 3000 }));

  const openDrawer = (offer) => {
    setSelectedOffer(offer);
    setDrawerOpen(true);
  };

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
      >
        <CarouselContent>
          {offers.map((offer) => (
            <CarouselItem key={offer.id}>
              <div
                className="p-3 flex border shadow m-1 rounded-xl cursor-pointer"
                onClick={() => openDrawer(offer)}
              >
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10">
                    <DiscountBadge />
                  </div>
                </div>
                <div className="ml-2">
                  <div className="text-base font-semibold">{offer.title}</div>
                  <div className="flex gap-2 text-sm font-semibold text-muted-foreground">
                    <span className="border border-dashed border-gray-400 px-2 rounded-md">
                      {offer.code}
                    </span>
                    <p>{offer.condition}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <OfferDetailsDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        offer={selectedOffer}
      />
    </>
  );
}

export function OfferDetailsDrawer({ open, setOpen, offer }) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);

  if (!offer) return null; // Don't render drawer if no offer is selected

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code).then(() => {
      setIsCopied(true); // Switch to CopyCheck icon
      setShowAlert(true); // Show the copied alert

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="mb-10 px-4">
        <DrawerHeader className="relative">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-1 font-bold text-xl text-primary w-fit border border-dashed border-rose-300 p-2 px-4 rounded-md bg-rose-50">
              <div className="w-8 h-8">
                <DiscountBadge />
              </div>
              {offer.code}
              {isCopied ? (
                <CopyCheck
                  size={20}
                  className="ml-4 cursor-pointer"
                  onClick={handleCopy}
                />
              ) : (
                <Copy
                  size={20}
                  className="ml-4 cursor-pointer"
                  onClick={handleCopy}
                />
              )}
            </div>
            {showAlert && (
              <p className="animate-in slide-in-from-top duration-500 flex text-xs text-green-500">
                <Check size={14} className="mr-1" /> Copied
              </p>
            )}
            <DrawerTitle>{offer.title}</DrawerTitle>
            <DrawerDescription>{offer.description}</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute top-0 right-0 rounded-full h-6 w-6"
            >
              <X size={16} />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <Separator className="my-4" />
        <p>Terms and conditions</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          {offer.terms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
