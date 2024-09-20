"use client";
import { useState, useRef, useEffect } from "react";
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
import { getSession } from "@/app/lib/auth/session";
import { Menu } from "@/app/components/menu/header/Menu";
import { DrawerProvider } from "@/context/DrawerContext";

export default function Scan() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  // const [session, setSession] = useState(null);
  
  // useEffect(() => {
  //   (async () => {
  //     const session = await getSession();
  //     setSession(session);
  //   })()
  // }, []);
  
  const handleScan = (result) => {
    const scannedBarcode = result[0];
    const scannedUrl = scannedBarcode?.rawValue;
    if (scannedUrl && scannedUrl.startsWith("https://api.tacoza.co")) {
      router.push(scannedUrl);
    } else {
      setErrorMessage("Please scan a Tacoza QR code, placed on your table.");
    }
  };

  return (
    <DrawerProvider>
    <main className="flex max-w-lg min-h-screen bg-gradient-to-tr from-rose-600 to-rose-500 flex-col gap-4 overflow-hidden">
      <div className="rounded-b-3xl shadow-xl bg-white p-6 pb-10 flex flex-col gap-3">
        <div className="flex justify-between">
          <Image src="/logo.png" alt="logo" width={150} height={100} />

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
    </DrawerProvider>
  );
}

export function Ads() {
  const plugin = useRef(
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
              alt="pizza"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-20 items-center justify-center">
            <img
              src="https://b.zmtcdn.com/data/pictures/2/20415942/d8ad25988e906612aea78a82543e25c7.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*"
              alt="burger"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-20 items-center justify-center">
            <img
              src="https://b.zmtcdn.com/data/pictures/chains/7/19016907/bedddb08e3eafa541fdec9db26613993.jpg?output-format=webp&fit=around|300:273&crop=300:273;*,*"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
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
