import { useTipTapEditor } from "@/components/organisms/compose/hooks/useTipTapEditor";
import { MastodonCustomEmoji } from "@/components/organisms/compose/tools/Emoji";
import Link from "next/link";
import { FC } from "react";

interface DisplayNameProps {
  acct?: string;
  displayName: string;
  className?: string;
  emojis?: MastodonCustomEmoji[];
  notLink?: boolean;
}

export const DisplayName: FC<DisplayNameProps> = ({
  acct,
  displayName,
  className,
  emojis = [],
  notLink = false,
}) => {
  const { editorjsx } = useTipTapEditor({
    editable: false,
    content: displayName,
    emojis,
    className: notLink ? className : "text-white",
  });

  return notLink ? (
    editorjsx
  ) : (
    <Link href={`/@${acct}`} className={className}>
      {editorjsx}
    </Link>
  );
};
