import { LoaderCircle } from "lucide-react";
import React from "react";

interface ButtonProps {
  isPending: boolean;
  onClick?: () => void;
  text: string | React.ReactNode;
  type?: "submit" | "button";
  className?: string;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  isPending,
  onClick,
  text,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-orange-900 hover:bg-orange-900 hover:opacity-90 text-[#fff] py-2 px-4 rounded-md transition-colors duration-200 ${className}`}
    >
      <span>
        {isPending ? (
          <LoaderCircle className="w-full animate-spin text-[#fff] text-center" />
        ) : (
          text
        )}
      </span>
    </button>
  );
};

export default PrimaryButton;
