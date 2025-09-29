"use client";

import Image from "next/image";
import { useAcceptNotificationRequest } from "@/hooks/mutations/conversations/useAcceptNotificationRequest";
import { useDismissNotificationRequest } from "@/hooks/mutations/conversations/useDismissNotificationRequest";
import { useNotificationRequests } from "@/hooks/queries/conversations/useGetNotificationRequests";
import { FC } from "react";
import { Button } from "@/components/atoms/ui/button";
import { getRawText } from "@/lib/utils";
import TimeAgo from "@/utils/helper/timeAgo";
import { useLocale } from "@/providers/localeProvider";
import { DisplayName } from "@/components/molecules/common/DisplayName";
import { NotificationRequest } from "@/types/conversation";
import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";


const RequestListItem: React.FC<{
  request: NotificationRequest;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}> = ({ request, onAccept, onDismiss }) => {
  const {t} = useLocale();
  return (
    <li className="flex gap-5 items-start rounded-md p-[10px] bg-white/10">
      <div className="w-12 h-12 aspect-square">
        <Image
          className="w-12 h-12 aspect-square rounded-2xl"
          src={request.account.avatar}
          alt={request.account.display_name || request.account.username}
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col">
          <DisplayName
            className="text-[15px]"
            emojis={request.account.emojis as MastodonCustomEmoji[]}
            acct={request.account.acct}
            displayName={
              request.account.display_name || request.account.username
            }
          />
          <p className="text-[13px] text-white/60 line-clamp-1">
            {getRawText(request.last_status.content)}
          </p>
          <TimeAgo
            className="text-[13px] text-white/50 whitespace-nowrap"
            timestamp={request.last_status.created_at}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onAccept(request.id)}>
            {t("common.accept")}
          </Button>
          <Button
            className="text-[#fff]"
            variant="destructive"
            onClick={() => onDismiss(request.id)}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </div>
    </li>
  );
};

const ConversationRequestsPage: FC = () => {
  const { data, isLoading } = useNotificationRequests();
  const {t} = useLocale();
  const { mutate: accept } = useAcceptNotificationRequest();
  const { mutate: dismiss } = useDismissNotificationRequest();

  const handleAccept = (id: string) => {
    accept(id);
  };

  const handleDismiss = (id: string) => {
    dismiss(id);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-4">
      <h1 className="text-2xl text-foreground my-2">{t("screen.message_requests")}</h1>
      {data && data?.length >0 ?
      <ul className="space-y-2">
        {data?.map((request) => (
          <RequestListItem
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onDismiss={handleDismiss}
          />
        ))}
      </ul>: <p className="flex items-center justify-center h-full">{t("conversation.no_message_requests")}</p> }
    </div>
  );
};

export default ConversationRequestsPage;
