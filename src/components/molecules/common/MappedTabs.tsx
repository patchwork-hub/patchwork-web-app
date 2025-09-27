import { cn } from "@/lib/utils";
import React from "react";
import { useRef } from "react";

interface MappedTabsProps {
  activeTab: string;
  tabs: { name: string; value: string }[];
  onTabChange: (tab: { name: string; value: string }) => void;
}
const MappedTabs = ({ activeTab, onTabChange, tabs = [] }: MappedTabsProps) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.value === activeTab)
  );
  const indicatorWidthPercent = tabs.length > 0 ? 100 / tabs.length : 100;

  return (
    <div className="w-full mb-4 flex relative border-b border-b-gray-600 bg-background">
      <div
        className={cn(
          "absolute -bottom-px left-0 h-0.5 bg-foreground transition-transform duration-300 rounded-t-md ease-in-out transform"
        )}
        style={{
          width: `${indicatorWidthPercent}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {tabs.map((tab, index) => (
        <button
          key={tab.value}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          className={`flex-1 text-center py-2 text-lg cursor-pointer font-bold relative ${
            activeTab === tab.value ? "text-foreground" : "text-gray-400"
          } transition-colors duration-300`}
          onClick={() => onTabChange(tab)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default MappedTabs;
