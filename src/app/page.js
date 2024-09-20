"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Scanner } from "@yudiel/react-qr-scanner";
import { SearchRestro } from "./search";
import Image from "next/image";
import { Auth } from "@/app/components/auth/Auth";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import ShinyText from "@/components/ui/animations/ShinyText";
import { HelpCircle, ScanQrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowtoScanAnimation } from "./components/lottie/lottie";

export default function Scan() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleScan = (result) => {
    const scannedBarcode = result[0];
    const scannedUrl = scannedBarcode?.rawValue;
    if (scannedUrl && scannedUrl.startsWith("https://tacoza.co")) {
      router.push(scannedUrl);
    } else {
      setErrorMessage("Please scan a Tacoza QR code, placed on your table.");
    }
  };

  return (
    <main className="flex max-w-lg min-h-screen bg-gradient-to-tr from-rose-600 to-rose-500 flex-col gap-4 overflow-hidden">
      <div className="rounded-b-3xl shadow-xl bg-white p-6 pb-10 flex flex-col gap-3">
        <div className="flex justify-between">
          <Image src="/logo.png" alt="logo" width={150} height={100} />
          <Auth />
        </div>
        <SearchRestro />
        <Ads />
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <ShinyText className="font-bold flex items-center" shimmerWidth={100}>
          Scan the QR code to order <HowtoScan />
        </ShinyText>
        <div className="inset-10">
          <Scanner onScan={handleScan} />
          {errorMessage && (
            <p className="text-white font-bold mt-4 bg-white bg-opacity-20 text-center rounded-lg">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export function Ads() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="h-20 w-full drop-shadow-lg"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="flex h-20 items-center justify-center">
            <Image
              src="/pizza.jpg"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
              alt="ad"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-20 items-center justify-center">
            <Image
              src="/banner-thumb.png"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
              alt="ad"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-20 items-center justify-center">
            <Image
              src="/banner-thumb.png"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
              alt="ad"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}

function HowtoScan() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <HelpCircle className="fill-secondary/30 w-4 h-4 ml-1" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Find QR code on your table or at outlet.</DrawerTitle>
          <DrawerDescription>
            Simply spot the QR scan with any scanner, outlet menu will be
            visible. Select your favourite meals an order it.
          </DrawerDescription>
        </DrawerHeader>
        <HowtoScanAnimation />
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">
              <ScanQrCode className="w-4 h-4 mr-1" /> Scan Now
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
