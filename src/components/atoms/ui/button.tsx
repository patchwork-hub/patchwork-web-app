import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { isSystemDark } from "@/utils/helper/helper";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-orange-900 text-primary-foreground shadow-xs hover:opacity-90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border text-foreground hover:text-accent-foreground",
        secondary:
          "bg-foreground text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-accent-foreground",
        link: "text-foreground underline underline-offset-4",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-2",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-3",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const { theme } = useTheme();
  return (
    <Comp
      data-slot="button"
      disabled={loading}
      className={cn(
        "relative flex items-center justify-center cursor-pointer",
        loading && "opacity-75 cursor-not-allowed",
        buttonVariants({ variant, size, className }),
        { "hover:text-gray-200":theme === "dark" || (theme === "system" && isSystemDark) }
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin w-5 h-5" /> : children}
    </Comp>
  );
}

export { Button, buttonVariants };
