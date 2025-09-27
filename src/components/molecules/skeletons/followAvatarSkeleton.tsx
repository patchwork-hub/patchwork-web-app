import React from "react";

const FollowAvatarSkeleton = () => {
  return (
    <div className="relative w-32 sm:w-36 h-32 sm:h-36 rounded-full overflow-hidden bg-gray-300">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 blur-md bg-[length:50%_200%] animate-[shimmer_2s_linear_infinite]" />
    </div>
  );
};

export default FollowAvatarSkeleton;
