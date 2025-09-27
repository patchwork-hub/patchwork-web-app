import React from "react";

export function HomeSkeleton() {
  return (
    <div className="relative w-full h-48 md:h-66 cursor-pointer animate-pulse">
      <div className="w-full h-48 md:h-66 bg-gray-300 rounded-lg" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70 rounded-lg" />
      <div className="absolute bottom-0 left-0 p-2 md:p-4 flex items-center justify-between w-full">
        <div className="h-6 w-32 bg-gray-600 rounded-md" />
        <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-600 rounded-full" />
      </div>
    </div>
  );
}
