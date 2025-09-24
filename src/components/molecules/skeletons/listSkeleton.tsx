import React from "react";

const ListSkeleton = () => {
  return (
    <div className="relative w-30 h-8 rounded-full overflow-hidden bg-gray-300 opacity-20 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 blur-md bg-[length:50%_200%] animate-[shimmer_2s_linear_infinite]" />
    </div>
  );
};

export default ListSkeleton;
