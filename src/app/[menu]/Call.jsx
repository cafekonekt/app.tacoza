import {
  BellRing,
  BookmarkPlus,
  ConciergeBellIcon,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/animations/ShinyButton";

export async function Call() {
  return (
    <div className="flex justify-start items-center gap-2 border-b pb-4">
      <ShinyButton className="mx-0 text-white">
        <ConciergeBellIcon className="h-4 w-4 mr-1" /> Call Waiter
      </ShinyButton>
      <Button size="icon" variant="outline" className="rounded-full">
        <BookmarkPlus className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" className="rounded-full">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
