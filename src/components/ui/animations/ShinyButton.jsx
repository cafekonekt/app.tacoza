import { cn } from "@/lib/utils";
import { Button } from "../button";

const ShinyButton = ({
  children,
  className,
  shimmerWidth = 100,
  onClick,
  disabled,
}) => {
  return (
    <Button
      style={{
        "--shimmer-width": `${shimmerWidth}px`,
      }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "mx-auto max-w-md text-white/70 dark:text-neutral-400/70",

        // Shimmer effect
        "animate-shimmer bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shimmer gradient
        "bg-gradient-to-r from-transparent via-rose-50/60 via-50% to-transparent dark:via-white/80",

        className,
      )}
    >
      {children}
    </Button>
  );
};

export default ShinyButton;
