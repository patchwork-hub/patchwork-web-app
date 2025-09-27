import { useAcceptFollowRequest } from "@/hooks/mutations/notifications/useAcceptFollowRequest";
import { useRejectFollowRequest } from "@/hooks/mutations/notifications/useRejectFollowRequest";
import { useFollowRequestsNotifications } from "@/hooks/queries/notifications/useFollowRequestsNotifications";
import TimeAgo from "@/utils/helper/timeAgo";
import { UserPlus } from "lucide-react";
import Link from "next/link";

import EmptyNotifications from "./EmptyNotifications";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { DisplayName } from "../common/DisplayName";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import Image from "next/image";

const FollowRequestsNotifications = () => {
  const {
    data: followRequestsData,
    fetchNextPage: fetchNextFollowRequests,
    hasNextPage: hasNextFollowRequests,
    isFetchingNextPage: isFetchingNextFollowRequests,
    isLoading,
  } = useFollowRequestsNotifications();

  const loadMoreFollowRequestsRef = useInfiniteScroll(() => {
    if (hasNextFollowRequests && !isFetchingNextFollowRequests) {
      fetchNextFollowRequests();
    }
  });

  const { mutate: acceptFollowRequest } = useAcceptFollowRequest();
  const { mutate: rejectFollowRequest } = useRejectFollowRequest();

  return (
    <div>
      {isLoading && (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      )}
      {followRequestsData?.pages?.every?.((f) => f.data.length === 0) &&
        !isLoading && <EmptyNotifications />}
      {followRequestsData?.pages.map((page) =>
        page.data.map((request) => (
          <div key={request.id} className="py-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="mr-3 text-orange-500">
                <UserPlus size={20} />
              </div>
              <div className="h-10 w-10 bg-blue-200 rounded-full overflow-hidden mr-3">
                <Link href={`/@${request.acct}`}>
                  <Image src={request.avatar} alt={request.username} />
                </Link>
              </div>
              <div className="flex-1">
                <DisplayName
                  emojis={request.emojis}
                  displayName={request.display_name || request.username}
                  acct={request.acct}
                  className="font-medium text-base"
                />
                <p className="text-sm opacity-70">{request.acct}</p>
                <p className="text-gray-400 text-sm">
                  <TimeAgo timestamp={request.created_at} />
                </p>
              </div>
            </div>
            <div className="flex mt-3 ml-12">
              <button
                className="bg-[#96A6C2] text-[#fff] font-medium py-2 px-8 rounded-md mr-2"
                onClick={() => acceptFollowRequest(request.id)}
              >
                Accept
              </button>
              <button
                className="bg-orange-500 text-[#fff] font-medium py-2 px-8 rounded-md border-[0.5px] border-[#96A6C2]"
                onClick={() => rejectFollowRequest(request.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
      <div ref={loadMoreFollowRequestsRef} />
      {isFetchingNextFollowRequests && (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      )}
    </div>
  );
};

export default FollowRequestsNotifications;
