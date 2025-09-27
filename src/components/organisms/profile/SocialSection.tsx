import { Badge } from "@/components/atoms/ui/badge";
import { Button } from "@/components/atoms/ui/button";
import { useLocale } from "@/providers/localeProvider";
import { cn } from "@/lib/utils";
import { Field } from "@/types/auth";
import { Icons } from "@/utils/constant";
import { isAccFromChannelOrg } from "@/utils/helper/helper";
import { cleanText } from "@/utils/helper/socialLink";
import { GlobeIcon, Link, PenIcon, PlusIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { toast } from "sonner";
import { Account } from "@/types/account";
import { useAuthStore } from "@/stores/auth/authStore";

type SocialSectionProps = {
  accountInfo: Account;
  isMyAccount?: boolean;
  onAddSocialLink?: () => void;
  onEditSocialLink?: () => void;
  onClickLinkByOtherInstanceUser?: (linkInfo: {
    label: string;
    content: string;
  }) => void;
};

const SocialSection = ({
  accountInfo,
  isMyAccount,
  onEditSocialLink,
  onAddSocialLink,
}: SocialSectionProps) => {
  const linkCount = accountInfo?.fields?.filter((field) => field.value).length;
  const { userOriginInstance } = useAuthStore();
  const { theme } = useTheme();
  const {t} = useLocale();

  const isUserFromChannelOrg = isAccFromChannelOrg(
    accountInfo.acct,
    userOriginInstance
  );

  // render items
  const renderSocialIcons = (field: Field) => {
    const { name, value } = field;
    if (!value) return null;
    const Icon = name.toLowerCase().includes("website") ? (
      <GlobeIcon className="w-5 h-5" />
    ) : (
      Icons[name] || <GlobeIcon className="w-5 h-5" />
    );

    return (
      <Badge
        className={cn(
          "w-8 h-8 bg-gray-800 rounded-full cursor-pointer flex justify-center items-center p-0! m-0!",
          {
            "text-white bg-gray-300": theme === "light",
          }
        )}
        onClick={() => {
          window.open(cleanText(value), "_blank", "noopener,noreferrer");
        }}
      >
        {Icon}
      </Badge>
    );
  };

  return (
    <div className="mt-3 space-y-2">
      <p className="flex flex-row items-center text-sm gap-x-1">
        <Link size={15} />
        <span>
          {t('social_links.links')}
          <span className="ml-1">({linkCount})</span>
        </span>
      </p>
      <div className="flex justify-start items-center gap-1 flex-wrap">
        {isMyAccount && (
          <>
            <Button
              className="w-8 h-8 rounded-full"
              onClick={() => {
                if (!isUserFromChannelOrg && linkCount === 4) {
                    toast.error(
                        "Mastodon users can only have up to 4 field attributes."
                    );
                } else {
                    if (onAddSocialLink) {
                        onAddSocialLink();
                    }
                }
              }}
            >
              <PlusIcon />
            </Button>
            {accountInfo?.fields?.find((v) => v.value) && (
              <Button
                className="w-8 h-8 rounded-full p-2.5"
                onClick={onEditSocialLink}
              >
                <PenIcon className="w-[13px] h-[13px]" />
              </Button>
            )}
          </>
        )}
        <div className="overflow-auto flex justify-center items-center flex-wrap gap-1 testing">
          {accountInfo?.fields?.map((field, key) => (
            <React.Fragment key={key}>
              {renderSocialIcons(field)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialSection;
