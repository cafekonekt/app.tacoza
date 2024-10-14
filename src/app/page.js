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
import { Menu } from "@/app/components/menu/header/Menu";
import { Auth } from "@/app/components/auth/Auth";
import { apiGet } from "@/handlers/apiHandler";

export const metadata = {
  title: "Home - tacoza (Instant food Ordering)",
  description: "Scan, Crave and Order superfast",
};

export default async function Scan() {
  const session = await getSession();
  const restaurants = await apiGet("/api/shop/list-outlets");
  console.log(restaurants);
  return (
    <DrawerProvider>
      <main className="flex max-w-lg min-h-screen bg-gradient-to-tr from-rose-600 to-rose-500 flex-col gap-4 overflow-hidden">
        <div className="rounded-b-3xl shadow-xl bg-white p-6 pb-10 flex flex-col gap-3">
          <div className="flex justify-between">
            <Image src="/logo.png" alt="logo" width={150} height={100} />
            {!session?.user?.name || !session?.user?.email ? <Auth /> : <Menu />}
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
