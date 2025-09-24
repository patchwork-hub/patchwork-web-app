"use client";
import * as React from "react";
import QueryProvider from "./queryProvider";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/atoms/ui/sonner";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      defaultTheme="system"
      storageKey="patchwork-theme"
    >
      <QueryProvider>
        {children}
        <Toaster richColors position="top-right" visibleToasts={1} />
      </QueryProvider>
    </NextThemesProvider>
  );
}
