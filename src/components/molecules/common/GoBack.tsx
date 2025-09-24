"use client";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search/useSearchStore";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface GoBackProps extends React.ComponentPropsWithoutRef<"div"> {
  backRoute?: string;
}

const GoBack: React.FC<GoBackProps> = ({ className, backRoute }) => {
  const router = useRouter();
  const { setSearch } = useSearchStore();

  const handleBack = (backRoute?: string): void => {
    setSearch(""); // reset search when back to home page
    if (backRoute) {
      router.push(backRoute);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={cn(
        "w-9 h-9 border-[0.5px] border-[#96A6C2] rounded-full p-1 cursor-pointer hover:opacity-70 transition-opacity duration-300 text-gray-800",
        className
      )}
    >
      <ChevronLeft size={25} onClick={() => handleBack(backRoute)} />
    </div>
  );
};

export default GoBack;
