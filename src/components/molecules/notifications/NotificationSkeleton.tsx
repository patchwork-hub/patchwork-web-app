export const NotificationSkeleton = () => {
    return (
        <div className="w-full p-4 ">
            <div className="flex items-center py-3 border-b-[0.5px] border-[#96A6C2]">
                <div className="w-10 h-10 rounded-full bg-[#96A6C2] animate-pulse mr-3"></div>
                <div className="flex-1">
                    <div className="h-4 bg-[#96A6C2] animate-pulse rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-[#96A6C2] animate-pulse rounded w-2/3"></div>
                </div>
                <div className="h-4 bg-[#96A6C2] animate-pulse rounded w-12 ml-3"></div>
            </div>
        </div>
    );
};