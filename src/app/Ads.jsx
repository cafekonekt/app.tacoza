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
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="h-20 w-full drop-shadow-lg"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
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

export function LargeAds() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="flex aspect-video items-center justify-center">
            <Image
              src="https://api.tacoza.co/media/ad_gallery/full_banner_ads.png"
              alt="Pizza"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex aspect-video items-center justify-center">
            <Image
              src="https://api.tacoza.co/media/ad_gallery/2.png"
              alt="Pizza"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex aspect-video items-center justify-center">
            <Image
              src="https://api.tacoza.co/media/ad_gallery/3.png"
              alt="Pizza"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex aspect-video items-center justify-center">
            <Image
              src="https://api.tacoza.co/media/ad_gallery/4.png"
              alt="Pizza"
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
