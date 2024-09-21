import { BellRing, BookmarkPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function Call() {
  return (
    <div className="flex gap-2">
      <Button>
        <BellRing className="h-4 w-4 mr-2" /> Call Waiter
      </Button>
      <Button>
        <BookmarkPlus className="h-4 w-4" />
      </Button>
      <Button>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
