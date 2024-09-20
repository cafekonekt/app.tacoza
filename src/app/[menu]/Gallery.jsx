import { Promo } from "@/app/components/auth/Auth";
import { Images } from "lucide-react";
import Image from "next/image";

export function Gallery({ outlet }) {
  return (
    <div className="relative">
      {outlet?.gallery?.length > 0 && <Promo gallery={outlet.gallery}/>}
      <div className="absolute flex items-center bottom-0 right-0 rounded-full text-xs px-1.5 bg-black/30  shadow-md text-white m-2">
        <Images className="h-3-5 w-3.5 mr-1" /> More
      </div>
      <div className="absolute bottom-0 left-0 flex items-end">
        <Image
          src={outlet?.logo || "/images/food.jpg"}
          alt="gallery"
          width={50}
          height={50}
          className=" m-2 h-10 w-10 object-cover rounded-full"
        />
        <div className="p-1 px-2 flex items-center  rounded-full text-xs bg-black/30  shadow-md text-secondary mb-2">
          <span className="h-2 w-2 rounded-full mr-1 bg-green-600" /> Open
        </div>
      </div>
    </div>
  );
}
