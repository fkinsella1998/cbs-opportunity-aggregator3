import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-tertiary disabled:pointer-events-none disabled:opacity-40",
        variant === "default" && "bg-accent text-white hover:bg-accent-dim",
        variant === "ghost" &&
          "border border-border bg-transparent text-text hover:border-text-tertiary",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button };
