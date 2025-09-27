import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/organisms/modal/modal.context";
import ManagedModal from "@/components/organisms/modal/managed-modal";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { ThemeProvider } from "@/providers/themeProvider";
import ThemeInitializer from "@/components/molecules/common/ThemeInitializer";
import { FCMProvider } from "@/providers/fcmProvider";

const sourceSans3 = Outfit({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Patchwork",
  description:
    "Patchwork is built on Mastodon’s open-source platform, bringing together key contributors, connections and conversations from around the Fediverse.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(sourceSans3.className, "overscroll-none ")}
      suppressHydrationWarning
    >
      <body
        className="antialiased overscroll-none transition-colors duration-200 ease-in-out"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
            <ManagedModal />
            <ThemeInitializer />
            <FCMProvider>{children}</FCMProvider>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
