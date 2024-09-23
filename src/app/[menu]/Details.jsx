"use server";
import { Star, MapPin, Phone, LeafyGreen, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function Details({ outlet }) {
  return (
    <section className="w-full flex justify-between my-4">
      <div>
        <h1 className="text-xl font-semibold">{outlet.name}</h1>
        <p className="text-xs pr-4">{outlet.description}</p>
        <p className="text-sm text-muted-foreground flex items-start gap-1 leading-tight">
          <MapPin className="h-3.5 w-3.5 mt-[2px]" /> {outlet.location}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Phone className="h-3.5 w-3.5" /> +91 {outlet.phone}
        </p>

        <div className="text-sm flex gap-2 items-center mt-2">
          <span className="flex items-center">
            <Timer className="h-3.5 w-3.5 mr-1" />{" "}
            {outlet.average_preparation_time} mins • ₹300 for 2
          </span>
        </div>
      </div>
      <div>
        <Badge variant="outline" className="text-white text-base bg-green-700">
          4.7
          <Star className="fill-white w-4 h-4 ml-1" />
        </Badge>
        <p className="text-xs">
          <b>12</b> Reviews
        </p>
      </div>
    </section>
  );
}
