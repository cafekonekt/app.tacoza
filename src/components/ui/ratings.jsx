import React from "react";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function StarRating({
  numStars = 5,
  icon,
  setValue,
  value,
  disabled,
  showcase,
  iconProps = {},
  wrapperProps = {},
}) {
  const { className: wrapperClassName, ...restWrapperProps } = wrapperProps;
  const { className: iconClassName, ...restIconProps } = iconProps;
  const IconComponent = icon;

  return React.createElement(
    "div",
    {
      className: cn("flex items-center gap-1", wrapperClassName),
      ...restWrapperProps,
    },
    Array.from({ length: numStars }, (_, i) => {
      const isRated = i < value;
      const styledIconProps = {
        onMouseEnter: () => !showcase && !disabled && setValue(i + 1),
        className: cn(
          "fill-primary stroke-primary size-6",
          {
            "opacity-50 pointer-events-none": disabled,
            "transition-transform duration-300 hover:scale-110":
              !disabled && !showcase,
            "!fill-muted !stroke-muted": !isRated,
          },
          iconClassName,
        ),
        ...restIconProps,
      };
      return React.createElement(
        "div",
        { key: i },
        IconComponent
          ? React.createElement(IconComponent, styledIconProps)
          : React.createElement(StarIcon, styledIconProps),
      );
    }),
  );
}

export { StarRating };
