"use client";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

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
                alt="ad"
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-xl"
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