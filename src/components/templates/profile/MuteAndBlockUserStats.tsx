import { Button } from "@/components/atoms/ui/button";
import { useLocale } from "@/providers/localeProvider";
import InfoSection from "@/components/organisms/profile/InfoSection";
import {
  useBlockUnBlockUserMutation,
  useMuteUnmuteUserMutation
} from "@/hooks/mutations/profile/useMuteUnmuteUser";
import { MuteBlockUserAccount } from "@/types/profile";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";

type MuteAndBlockUserStatsProps = {
  data?: MuteBlockUserAccount[];
  type: "MUTE" | "BLOCK";
  lastItem?: React.JSX.Element;
}

const MuteAndBlockUserStats: React.FC<MuteAndBlockUserStatsProps> = ({ data, type, lastItem }) => {
  const { mutate: toggleMute } = useMuteUnmuteUserMutation();
  const {t} = useLocale()
  const { mutate: toggleBlock } =
    useBlockUnBlockUserMutation();

  const onToggleMuteBtn = (item: MuteBlockUserAccount) => {
    if (type === "BLOCK") {
      return toggleBlock({
        accountId: item.id,
        toBlock: !!item.isUnBlockedNow
      });
    }
    toggleMute({ accountId: item.id, toMute: !!item.isUnMutedNow });
  };

  return (
    <div className="p-4 space-y-4">
      {data &&
        data?.map((each, key) => (
          <div key={key} className="flex justify-between items-start">
            <div className="flex gap-x-2 justify-start items-start">
              <Image
                src={each?.avatar}
                alt={each?.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <InfoSection
                emojis={each?.emojis}
                accountName={each?.display_name || each?.username}
                username={each?.acct}
                joinedDate={dayjs(each?.created_at).format("MMM YYYY")}
              />
            </div>
            <div>
              <Button
                className="rounded-full px-3 w-auto h-7"
                onClick={() => onToggleMuteBtn(each)}
              >
                {type === "MUTE"
                  ? each.isUnMutedNow
                    ? `${t("timeline.mute")}`
                    :  `${t("common.unmute")}`
                  : each.isUnBlockedNow
                    ? `${t("timeline.block")}`
                    : `${t("common.unblock")}`}
                {/* {getRelationshipStatus(each?.id)} */}
              </Button>
            </div>
          </div>
        )).concat(lastItem ? [lastItem] : [])}
    </div>
  );
};

export default MuteAndBlockUserStats;
