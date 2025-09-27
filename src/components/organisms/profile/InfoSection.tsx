import React from "react";
import AccountName from "./AccountName";
import UserName from "./UserName";
import { MastodonCustomEmoji } from "../compose/tools/Emoji";
import { useTipTapEditor } from "@/hooks/customs/useTipTapEditor";

type VerticalInfoProps = {
  accountName: string;
  username: string;
  joinedDate?: string;
  userBio?: string;
  hasRedMark?: boolean;
  showChannelFollowers?: boolean;
  acctNameTextStyle?: string;
  emojis?: MastodonCustomEmoji[];
};

const InfoSection = ({
  accountName,
  username,
  joinedDate,
  userBio,
  hasRedMark,
  acctNameTextStyle,
  emojis,
}: VerticalInfoProps) => {
  const { editorjsx } = useTipTapEditor({
    content: userBio,
    editable: false,
    hashtagClassName: "text-orange-500",
  });
  return (
    <div className="flex-1 flex-col space-y-1">
      <AccountName
        {...{ accountName, acctNameTextStyle, hasRedMark, emojis }}
      />
      <UserName {...{ username, joinedDate }} />
      {userBio && editorjsx}
    </div>
  );
};

export default InfoSection;
