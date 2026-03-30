import { cn } from "@/lib/utils";
import React from "react";

interface TechCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const TechCard = React.forwardRef<HTMLDivElement, TechCardProps>(
  ({ className, hoverEffect = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card text-foreground p-6 tech-border transition-all duration-300",
          hoverEffect && "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(211,192,101,0.1)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TechCard.displayName = "TechCard";
