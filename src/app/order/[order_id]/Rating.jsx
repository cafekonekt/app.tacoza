"use client";
import { useState } from "react";
import { StarRating } from "@/components/ui/ratings";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function Rating() {
  const [value, setValue] = useState(3);
  return (
    <div className="mt-2 px-4 py-2 border rounded-lg">
      <span className="text-sm font-semibold">Rate this outlet</span>
      <StarRating
        value={value}
        setValue={setValue}
        iconProps={{ className: "fill-yellow-500 stroke-yellow-500" }}
      />
    </div>
  );
}
