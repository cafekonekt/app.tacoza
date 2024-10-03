"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { HeartLabelBadge } from "../../lottie/lottie";

export function ComboItemComponent() {
  return (
    <div className="grid gap-2 py-4 bg-gray-100">
      <div className="flex gap-3 px-4 overflow-x-scroll no-scrollbar scroll-smooth">
        {Array.from({ length: 5 }).map((_, index) => (
          <ComboItem key={index} />
        ))}
      </div>
    </div>
  );
}

export function ComboItem() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );
  const pluginFade = React.useRef(Fade());

  return (
    <Card className="min-w-52 grid gap-2">
      <Carousel
        plugins={[plugin.current, pluginFade.current]}
        className="relative w-full p-2"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="flex h-24 w-full items-center justify-center">
                <Image
                  src="/pizza.jpg"
                  alt="hello"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full rounded"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <span className="absolute top-3 right-3 bg-primary text-xs text-white rounded px-1">
          3 Items
        </span>
        <div className="absolute -top-2 -left-4">
          <HeartLabelBadge />
        </div>
      </Carousel>
      <div className="flex flex-col justify-between w-full px-2 pb-2">
        <div className="flex items-center gap-1">
          <Image src="/veg.svg" alt="veg" height="16" width="16" />
          <span className="rounded-full px-1 py-0.5 bg-gradient-to-r from-lime-200  to-transparent text-xs text-lime-800">
            SAVE ₹20 with this combo
          </span>
        </div>
        <p className="text-base leading-tight font-medium mt-1">
          Paneer Bhurji <span className="text-muted-foreground">+</span> Curd
          <span className="text-muted-foreground">+</span> Raita
        </p>
        <div className="flex items-end justify-between w-full">
          <span className="text-base font-medium text-muted-foreground">
            ₹199
          </span>
          <Button
            className="bg-rose-50 p-2 h-8 w-fit border border-rose-600 text-rose-600 hover:text-rose-300 text-xs rounded-[10px] font-bold"
            variant="outline"
          >
            See Items <Play size={10} className="ml-1 fill-primary" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
