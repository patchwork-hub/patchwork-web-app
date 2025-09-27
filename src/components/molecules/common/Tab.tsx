"use client";

import { cn } from "@/lib/utils";
import { isSystemDark } from "@/utils/helper/helper";
import { useTheme } from "next-themes";
import { useState } from "react";

export type TabItem<T extends string> = {
  id: T;
  label: string;
};

type TabProps<T extends string> = {
  items: TabItem<T>[];
  defaultTab?: T extends TabItem<infer U>["id"] ? U : never;
  onTabChange?: (tabId: T) => void;
};

export const Tab = <T extends string>({
  items,
  defaultTab,
  onTabChange,
}: TabProps<T>) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);
  const { theme } = useTheme();
  const handleTabClick = (tabId: T) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div
      className={`relative flex border-b bg-background border-gray-900 ${
       theme === "dark" || (theme === "system" && isSystemDark) ? "border-b-gray-600" : "border-b-gray-300"
      }`}
    >
      <div
        className={cn(
          "cursor-pointer absolute -bottom-px left-0 h-0.5 bg-foreground rounded-t-md transition-transform duration-300 ease-in-out transform"
        )}
        style={{
          width: `${100 / items.length}%`,
          transform: `translateX(${
            items.findIndex((item) => item.id === activeTab) * 100
          }%)`,
        }}
      />
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleTabClick(item.id)}
          className={`cursor-pointer flex-1 py-2 sm:px-4 text-lg font-bold transition-colors
            ${
              activeTab === item.id
                ? "text-foreground"
                : "text-[rgb(150,166,194)] hover:opacity-80"
            }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
