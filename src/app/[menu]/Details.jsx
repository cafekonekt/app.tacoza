"use server";
import { Star, MapPin, Phone, LeafyGreen, Timer, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export async function Details({ outlet }) {
  return (
    <section className="w-full my-4 border pt-2 rounded-xl">
      <div className="flex justify-between mb-2">
        <div className="">
          {outlet.type?.length === 1 ? (
            <p className="mx-2 text-sm whitespace-nowrap text-green-600 border border-green-100 bg-gradient-to-bl from-green-200 via-green-50 flex items-center gap-1 p-1 px-2 rounded-xl h-fit w-fit">
              <LeafyGreen className="h-3.5 w-3.5 fill-green-200" /> Pure Veg
            </p>
          ) : null}

          <h1 className="text-lg font-semibold px-2">{outlet.name}</h1>
          <p className="text-sm text-muted-foreground flex items-start gap-1 px-2 leading-tight capitalize">
            <MapPin className="h-3.5 w-3.5" /> {outlet.location}
          </p>
          <p className="text-sm mt-2 pl-2 pr-4">{outlet.description}</p>
        </div>
        <div className="px-2">
          <Badge variant="outline" className="text-white text-sm bg-green-700">
            4.3
            <Star className="fill-white w-3 h-3 ml-1" />
          </Badge>
          <p className="text-xs hidden">
            <b>12</b> Reviews
          </p>
        </div>
      </div>
      <Separator />
      <div className="p-2 text-sm flex gap-2 items-center bg-gradient-to-l from-red-100 to-transparent rounded-b-xl">
        <span className="flex items-center">
          <Timer className="h-3.5 w-3.5 mr-1" />
          {outlet.average_preparation_time} mins • ₹300 for 2
          <Users className="h-3.5 w-3.5 ml-1" />
        </span>
      </div>
    </section>
  );
}
