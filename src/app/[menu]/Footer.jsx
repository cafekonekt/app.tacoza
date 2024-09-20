import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import Image from "next/image";

export function Footer({ outlet }) {
  return (
    <section className="bg-muted p-4 pb-20">
      <p className="text-muted-foreground/70 text-xs font-bold">Disclaimer:</p>
      <ul className="mx-3 list-disc text-muted-foreground/70 text-xs">
        <li>All prices are set directly by restaurant.</li>
        <li>
          All nutritional information is indicative and approximate, it may vary
          depending on the preparation and ingredients used.
        </li>
        <li>
          Dish details and images might be AI crafted for better experience.
        </li>
      </ul>
      <Separator className="my-4" />

      <div aria-hidden="true" className="flex items-center gap-2">
        <Image
          className="h-6 w-12"
          src="/fssai.avif"
          alt="FSSAI"
          width={120}
          height={60}
          draggable={false}
        />
        <p className="text-muted-foreground/70 text-xs">
          License No. XX2235500XXXXX
        </p>
      </div>
      <Separator className="my-4" />
      <p className="text-muted-foreground/80 text-xs font-bold">
        {outlet.name}
      </p>
      <p className="text-muted-foreground/70 text-xs">
        (Outlet: {outlet.name})
      </p>
      <p className="text-muted-foreground/70 text-xs flex items-center">
        <MapPin className="w-3 h-3" /> {outlet.location}
      </p>
    </section>
  );
}
