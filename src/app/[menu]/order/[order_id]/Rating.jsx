"use client"
import { useState } from "react";
import { StarRating } from "@/components/ui/ratings";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function Rating() {
  const [value, setValue] = useState(3);
  return (
    <CardContent className="grid gap-2 mt-4">
      <Label forhtml="review">Rate this Restaurant</Label>
      <StarRating
        value={value}
        setValue={setValue}
        iconProps={{ className: "fill-yellow-500 stroke-yellow-500" }}
      />
    </CardContent>
  );
}
