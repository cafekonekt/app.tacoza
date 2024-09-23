"use server";
import { SearchRestaurant, SearchRestro } from "./search";
import Image from "next/image";
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
import { DrawerProvider } from "@/context/DrawerContext";
import { QRScanner } from "./Scanner";
import { Ads } from "./Ads";
import { getSession } from "./lib/auth/session";
import { Menu } from "./components/menu/header/Menu";
import { Auth } from "./components/auth/Auth";

// export const metadata = {
//   title: "Home - tacoza (Instant food Ordering)",
//   description: "Scan, Crave and Order superfast",
// };

const restaurants = [
  {
    id: 1,
    name: "Kohlis Restaurant",
    description: "North Indian, Chinese, Fast Food",
    location: "Dharam Tekri, Chindwara",
    image: "/outlet-thumb.jpg", // Replace with actual image paths
    rating: 4.2,
    ratingCount: 12,
  },
  {
    id: 2,
    name: "Saffron Spice",
    description: "Indian, Thai, Continental",
    location: "MG Road, Indore",
    rating: 4.5,
    ratingCount: 50,
  },
  {
    id: 3,
    name: "Urban Diner",
    description: "Burgers, Steaks, Beverages",
    location: "Phoenix Market City, Mumbai",
    rating: 4.3,
    ratingCount: 25,
  },
  {
    id: 4,
    name: "The Royal Feast",
    description: "Luxury Dining, Multi-cuisine",
    location: "Connaught Place, Delhi",
    rating: 4.7,
    ratingCount: 100,
  },
  {
    id: 5,
    name: "Green Bowl",
    description: "Vegan, Healthy, Organic",
    location: "Brigade Road, Bangalore",
    rating: 4.1,
    ratingCount: 30,
  },
];

export default async function Scan() {
  const session = await getSession();
  return (
    <DrawerProvider>
      <main className="flex max-w-lg min-h-screen bg-gradient-to-tr from-rose-600 to-rose-500 flex-col gap-4 overflow-hidden">
        <div className="rounded-b-3xl shadow-xl bg-white p-6 pb-10 flex flex-col gap-3">
          <div className="flex justify-between">
            <Image src="/logo.png" alt="logo" width={150} height={100} />
            {!session?.user?.name || !session?.user?.email ? (
              <Auth />
            ) : (
              <Menu />
            )}
          </div>
          <SearchRestaurant restaurants={restaurants} />
          <Ads />
        </div>
        <div className="flex flex-col items-center justify-center p-8">
          <ShinyText className="font-bold flex items-center" shimmerWidth={100}>
            Scan the QR code to order <HowtoScan />
          </ShinyText>
          <QRScanner />
        </div>
      </main>
    </DrawerProvider>
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
          <DrawerClose asChild>
            <Button variant="outline">
              <ScanQrCode className="w-4 h-4 mr-1" /> Scan Now
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
