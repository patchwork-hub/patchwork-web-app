export const ProfileSkeleton = () => {
  return (
    <div className="w-full">
      {/* Cover Photo Skeleton */}
      <div className="relative">
        <div className="h-[200px] w-full bg-[#96A6C2] animate-pulse"></div>
        {/* Profile Picture Skeleton (overlapping the cover photo) */}
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <div className="w-[90px] h-[90px] md:w-[133px] md:h-[133px] aspect-square bg-[#96A6C2] rounded-full animate-pulse border-4 border-[#96a6c2]"></div>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="pt-20 px-4">
        <div className="flex items-start justify-between">
          <div>
            {/* Username Skeleton */}
            <div className="h-6 w-28 bg-[#96A6C2] rounded animate-pulse mb-1"></div>
            {/* Handle Skeleton */}
            <div className="h-4 w-20 bg-[#96A6C2] rounded animate-pulse"></div>
          </div>
          {/* Edit Account Button Skeleton */}
          <div className="h-8 w-24 bg-[#96A6C2] rounded-full animate-pulse"></div>
        </div>

        {/* Join Date and Links Section */}
        <div className="mt-3 space-y-1">
          {/* Join Date Skeleton */}
          <div className="h-4 w-32 bg-[#96A6C2] rounded animate-pulse"></div>
          {/* Links Skeleton */}
          <div className="h-4 w-16 bg-[#96A6C2] rounded animate-pulse"></div>
        </div>

        {/* Stats Section */}
        <div className="mt-3 flex space-x-4">
          {/* Posts Skeleton */}
          <div className="h-4 w-20 bg-[#96A6C2] rounded animate-pulse"></div>
          {/* Following Skeleton */}
          <div className="h-4 w-24 bg-[#96A6C2] rounded animate-pulse"></div>
          {/* Followers Skeleton */}
          <div className="h-4 w-20 bg-[#96A6C2] rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}