import { cn } from "@/lib/utils";
import React from "react";

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  subtitle?: string;
}

export const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, subtitle, children, ...props }, ref) => {
    return (
      <div className="mb-12 text-center">
        {subtitle && (
          <p className="text-primary font-mono text-sm tracking-widest mb-2 uppercase">
            {subtitle}
          </p>
        )}
        <h2
          ref={ref}
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight",
            className
          )}
          {...props}
        >
          {children}
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mt-4 clip-chamfer" />
      </div>
    );
  }
);
SectionTitle.displayName = "SectionTitle";
