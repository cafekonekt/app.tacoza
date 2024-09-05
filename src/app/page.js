"use client";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scanner } from "@yudiel/react-qr-scanner";
import { SearchRestro } from "./search";

export default function Scan() {
  return (
    <main className="flex max-w-lg min-h-screen flex-col gap-4 items-center p-6 overflow-hidden">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">
          <Button size="icon" variant="outline" className="h-8 w-8 mr-2">
            <ChefHat className="h-4 w-4" />
          </Button>
          Restro
        </h2>
      </div>
      <SearchRestro />
      <p>or</p>
      <p>Scan the QR code to order</p>
      <Scanner onScan={(result) => console.log(result)} />
    </main>
  );
}
