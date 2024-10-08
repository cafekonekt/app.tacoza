"use server";
import { Promo } from "@/app/components/auth/Auth";
import { Images } from "lucide-react";
import Image from "next/image";

export async function Gallery({ outlet }) {
  return (
    <div className="relative">
      {(outlet.gallery?.length > 0 && <Promo gallery={outlet.gallery} />) || (
        <Image
          src="/banner-thumb.png"
          alt="banner"
          width={200}
          height={200}
          className="h-40 w-full object-cover rounded-lg"
        />
      )}
      <div className="p-1 px-2 absolute flex items-center bottom-0 right-2 rounded-full text-xs backdrop-blur shadow-md text-secondary mb-2">
        <span className="h-2.5 w-2.5 rounded-full mr-1 bg-green-500" /> OPEN
      </div>
      <div className="absolute bottom-2 left-2 flex items-end">
        <Image
          src={outlet?.logo || "/outlet-thumb.jpg"}
          alt="logo"
          width={50}
          height={50}
          className="h-10 w-10 object-cover rounded-full"
        />
      </div>
    </div>
  );
}
