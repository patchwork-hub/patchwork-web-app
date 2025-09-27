import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Eye, EyeOff, X } from "lucide-react";
import { useTheme } from "next-themes";

interface InputProps extends React.ComponentProps<"input"> {
  showTogglePassword?: boolean;
  closeIcon?: boolean;
  icon?: React.ReactNode;
  onClose?: () => void;
}

function Input({
  className,
  type,
  icon,
  closeIcon,
  showTogglePassword,
  onClose,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const { theme } = useTheme();

  return (
    <div className="relative w-full">
      {icon && <span className="absolute top-2 left-2 z-20">{icon}</span>}
      <input
        type={showPassword && type === "password" ? "text" : type}
        data-slot="input"
        className={cn(
          "bg-gray-500 border-input file:text-foreground placeholder:text-muted-foreground selection:bg-foreground selection:text-background flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-gray-500 focus-visible:ring-ring/50 focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-800",
          className,
          {
            "bg-gray-100 border-gray-400 text-black": theme === "light",
          }
        )}
        {...props}
      />

      <Button
        tabIndex={type !== "password" ? -1 : undefined}
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showTogglePassword &&
          (showPassword ? (
            <Eye
              className={cn("h-4 w-4", { "text-black": theme === "light" })}
              aria-hidden="true"
            />
          ) : (
            <EyeOff
              className={cn("h-4 w-4", { "text-black": theme === "light" })}
              aria-hidden="true"
            />
          ))}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      {closeIcon && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
          onClick={onClose}
        >
          <X />
          <span className="sr-only">Close button</span>
        </Button>
      )}
    </div>
  );
}

export { Input };
