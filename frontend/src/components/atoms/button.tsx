import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseProps = Omit<React.ComponentProps<typeof ShadcnButton>, "variant" | "size">;

type ButtonProps = BaseProps & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  selected?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  selected = false,
  className,
  ...props
}: ButtonProps) {
  const mappedVariant = 
    variant === "ghost" ? "ghost" : 
    variant === "outline" ? "outline" : 
    "default";
    
  const mappedSize = 
    size === "sm" ? "sm" : 
    size === "lg" || size === "xl" ? "lg" : 
    "default";

  return (
    <ShadcnButton
      variant={mappedVariant}
      size={mappedSize}
      className={cn(
        variant === "ghost" && "outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:outline-none",
        selected && "text-accent font-semibold border-b-2 border-accent border-x-0 border-t-0 rounded-none outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:outline-none",
        size === "xl" && "h-12 px-5 text-md", 
        className
      )}
      {...props}
    />
  );
}