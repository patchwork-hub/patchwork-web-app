export const StatusSkeleton = () => {
  return (
    <div>
      <div className="flex space-x-2 items-center">
        <div className="w-12 h-12 bg-gray-600 rounded-full aspect-square"></div>
        <div className="flex flex-col w-[200px]">
          <div className="h-4 bg-foreground animate-pulse rounded"></div>
          <div className="h-4 bg-foreground animate-pulse rounded mt-2"></div>
        </div>
      </div>
      <div className="h-4 bg-foreground animate-pulse rounded mt-2 ms-12"></div>
      <div className="flex max-h-[365px] aspect-video animate-pulse bg-foreground rounded mt-2 ms-12"></div>
      <div className="flex justify-between mt-2 ms-12">
        <div className="w-8 h-6 bg-foreground rounded animate-pulse"></div>
        <div className="w-8 h-6 bg-foreground rounded animate-pulse"></div>
        <div className="w-8 h-6 bg-foreground rounded animate-pulse"></div>
        <div className="w-8 h-6 bg-foreground rounded animate-pulse"></div>
      </div>
    </div>
  );
};
