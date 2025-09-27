import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const textVariants = cva(
  "text-sm group flex items-center justify-center rounded-md text-foreground",
  {
    variants: {
      variant: {
        default: "text-foreground",
        textGrey: "text-foreground",
        textRedUnderline: "text-patchwork-red-600 underline",
        textOrange: "text-patchwork-red-50",
        textBold: "text-foreground font-bold",
        textOrangeUnderline: "text-patchwork-red-50 underline",
      },
      size: {
        default: "text-sm",
        xs_12: "text-xs",
        fs_13: "text-[13px] leading-[18.5px]",
        sm_14: "text-sm",
        fs_15: "text-[15px] leading-[22.5px]",
        md_16: "text-base",
        lg_18: "text-lg",
        xl_20: "text-xl",
        xl_24: "text-lg md:text-2xl ",
        xl_30: "text-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type TextProps = React.ComponentPropsWithoutRef<"p"> &
  VariantProps<typeof textVariants> & {
    emojis?: Emoji[];
    disabled?: boolean;
  };

const ThemeText = React.forwardRef<React.ElementRef<"p">, TextProps>(
  ({ className, variant, size, children, emojis = [], ...props }, ref) => {
    const renderContent = (content: React.ReactNode): React.ReactNode => {
      if (typeof content === "string") {
        const parts = content.split(/(:\w+:)/g);
        return parts.map((part, index) => {
          const emoji = emojis.find((e) => `:${e.shortcode}:` === part);
          if (emoji) {
            return (
              <Image
                key={index}
                src={emoji.url}
                alt={emoji.shortcode}
                width={16}
                height={16}
                className="inline-block"
              />
            );
          }
          return <span key={index}>{part}</span>;
        });
      }
      return content;
    };

    return (
      <div
        className={cn(
          props.disabled && "opacity-50",
          textVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      >
        {React.Children.map(children, (child) => renderContent(child))}
      </div>
    );
  }
);

ThemeText.displayName = "ThemeText";

export { ThemeText, textVariants };
export type { TextProps };
