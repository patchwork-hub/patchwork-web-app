"use client";
import { cn } from "@/lib/utils";
import { useLinkStatus } from "next/link";

type LinkStatusProps = {
  roundedFull?: boolean;
};

export const LinkStatus = ({ roundedFull = false }: LinkStatusProps) => {
  const { pending } = useLinkStatus();
  return pending ? (
    <div
      className={cn(
        "absolute inset-0 custom-slide",
        roundedFull ? "rounded-full" : "rounded-lg",
        "opacity-50"
      )}
    />
  ) : null;
};
