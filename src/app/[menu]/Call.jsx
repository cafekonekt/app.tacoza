import {
  BellRing,
  BookmarkPlus,
  ConciergeBellIcon,
  Phone,
  Share2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/animations/ShinyButton";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export async function Call({ outlet }) {
  return (
    <div className="flex justify-start items-center gap-2 mx-4">
      <Popover>
        <PopoverTrigger asChild>
          <ShinyButton className="mx-0 text-white">
            <Sparkles className="h-4 w-4 mr-1" /> Ask Waiter
          </ShinyButton>
        </PopoverTrigger>
        <PopoverContent align="start">
          AI feature is comming soon.
        </PopoverContent>
      </Popover>

      <Button size="icon" variant="outline" className="rounded-full">
        <Link href={`tel:${outlet.phone}`}>
          <Phone className="h-4 w-4" />
        </Link>
      </Button>
      <Button size="icon" variant="outline" className="rounded-full">
        <ConciergeBellIcon className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" className="rounded-full">
        <BookmarkPlus className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" className="rounded-full">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
