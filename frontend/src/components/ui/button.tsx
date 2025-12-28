import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(259_100%_59%/0.4)] hover:shadow-[0_0_30px_hsl(259_100%_59%/0.6)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_0_20px_hsl(233_100%_69%/0.3)] hover:shadow-[0_0_30px_hsl(233_100%_69%/0.5)]",
        ghost: "hover:bg-muted hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        cosmic: "bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-[0_0_30px_hsl(259_100%_59%/0.5)] hover:shadow-[0_0_50px_hsl(259_100%_59%/0.7)] hover:scale-105 active:scale-100",
        cosmicOutline: "border-2 border-[hsl(258,100%,59%)] bg-transparent text-[hsl(270,60%,82%)] hover:bg-[hsl(258,100%,59%,0.2)] hover:shadow-[0_0_20px_hsl(258,100%,59%,0.3)]",
        glow: "bg-gradient-to-r from-[hsl(258,100%,59%)] to-[hsl(233,100%,67%)] text-primary-foreground animate-pulse-glow hover:scale-105 active:scale-100",
        glass: "bg-card/60 backdrop-blur-md border border-border/50 text-foreground hover:bg-card/80 hover:border-primary/50",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-14 rounded-xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
