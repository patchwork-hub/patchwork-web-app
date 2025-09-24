import { DisplayName } from "@/components/atoms/common/DisplayName";
import { BadgeCheck } from "lucide-react";
import React from "react";
import { MastodonCustomEmoji } from "../compose/tools/Emoji";
import { ProfileNameRedMark } from "@/components/atoms/icons/Icons";

type AccountNameProps = {
  accountName: string;
  acctNameTextStyle?: string;
  hasRedMark?: boolean;
  emojis?: MastodonCustomEmoji[];
};

const AccountName = ({
  accountName,
  acctNameTextStyle,
  hasRedMark,
  emojis,
  ...props
}: AccountNameProps & React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div className="flex gap-2 items-center" {...props}>
      <DisplayName
        emojis={emojis}
        displayName={accountName}
        notLink
        className={`font-SourceSans3_Bold text-[17px] mr-2 leading-6 inline ${acctNameTextStyle}`}
      />
      {hasRedMark && (
        <ProfileNameRedMark style={{ flexShrink: 0 }} width={20} height={20}/>
      )}
    </div>
  );
};

export default AccountName;
