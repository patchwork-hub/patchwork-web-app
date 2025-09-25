import React from "react";

const CardSkeleton = () => {
  return (
    <div className="relative w-36 sm:w-40 h-38 sm:h-40 rounded-lg overflow-hidden bg-gray-300">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 blur-md bg-[length:50%_200%] animate-[shimmer_2s_linear_infinite]" />
    </div>
  );
};

export default CardSkeleton;
