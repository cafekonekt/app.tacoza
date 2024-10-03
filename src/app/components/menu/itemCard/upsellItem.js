import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function UpsellItemComponent() {
  return (
    <div className="grid gap-2 py-4 bg-gray-100">
      <span className="flex gap-1 px-4 items-center text-base font-semibold my-2">
        <Sparkles size={16} className="fill-primary text-primary" />
        People mostly pair this with
      </span>
      <div className="flex gap-3 px-4 overflow-x-scroll no-scrollbar">
        {Array.from({ length: 5 }).map((_, index) => (
          <UpsellItem key={index} />
        ))}
      </div>
    </div>
  );
}

export function UpsellItem() {
  return (
    <Card className="max-w-72 flex gap-2 p-2">
      <div className="relative aspect-square h-20 col-span-1">
        <Image
          src="/pizza.jpg"
          alt="hello"
          layout="fill"
          className="object-cover rounded"
        />
        <Image
          src="/veg.svg"
          alt="veg"
          height="12"
          width="12"
          className="absolute top-1 left-1 bg-white rounded-[3px]"
        />
      </div>
      <div className="flex flex-col justify-between w-full col-span-2">
        <p className="text-base leading-tight font-medium">
          Paneer Bhurji with Curd
        </p>
        <div className="flex items-end justify-between w-full">
          <span className="text-base font-medium text-muted-foreground">
            ₹199
          </span>
          <Button
            className="bg-rose-50 w-24 scale-75 border border-rose-600 text-rose-600 hover:text-rose-300 text-base rounded-[10px] font-bold"
            variant="outline"
          >
            ADD
          </Button>
        </div>
      </div>
    </Card>
  );
}
