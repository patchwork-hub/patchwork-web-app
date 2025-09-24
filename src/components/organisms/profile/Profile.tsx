import GoBack from "@/components/atoms/common/GoBack";
import { Button } from "@/components/atoms/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { ProfileChat } from "@/components/molecules/conversation/ProfileChat";
import { ProfileSkeleton } from "@/components/molecules/skeletons/profileSkeleton";
import { useAccountInfo } from "@/hooks/queries/profile/useAccountInfo";
import { useProfileMutation } from "@/hooks/queries/profile/useProfile";
import { useCheckAccountRelationship } from "@/hooks/queries/status/useCheckAccountRelationship";
import { UpdateProfilePayload } from "@/types/profile";
import { Account, AccountRelationship } from "@/types/status";
import { checkIsAccountVerified } from "@/utils/helper/helper";
import {
  addSocialLink,
  generateFieldsAttributes,
  removeSocialLink,
} from "@/utils/helper/socialLink";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
import {
  BlockAction,
  FollowAction,
  MuteAction,
  ReportAction,
} from "../status/StatusActions";
import InfoSection from "./InfoSection";
import SocialLinks from "./SocialLinks";
import SocialSection from "./SocialSection";
import { formatNumber } from "@/utils/formatNumber";
import { isValidImageUrl, sanitizeInput } from "@/utils";
import { MANDATORY_BIO } from "@/utils/constant";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import useLoggedIn from "@/lib/auth/useLoggedIn";
import LoginDialog from "../status/LoginDialog";

const BlockAndReportPopover: FC<{
  account: Account;
  relationship: AccountRelationship[];
}> = ({ account, relationship }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const isLoggedIn = useLoggedIn();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border-[0.5px] border-[#96A6C2] aspect-square rounded-full text-[#96A6C2]"
            onClick={() => {
              if (!isLoggedIn) {
                setOpenDialog(true);
              }
            }}
          >
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <BlockAction relationship={relationship} accountId={account.id} />
          <ReportAction account={account} />
          <MuteAction relationship={relationship} accountId={account.id} />
        </PopoverContent>
      </Popover>
      <LoginDialog
        actionType="login"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
};

export const Profile: FC<{
  userId: string;
  isOwnProfile: boolean;
}> = ({ userId, isOwnProfile }) => {
  const { data: relationship } = useCheckAccountRelationship({
    id: userId,
    enabled: true,
  });

  const [socialLinkAction, setSocialLinkAction] = useState<{
    visible: boolean;
    formType: "add" | "edit";
  }>({ visible: false, formType: "add" });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useTheme();
  const { t } = useLocale();
  const isLoggedIn = useLoggedIn();

  const domain = Cookies.get("domain");

  const { data: accountInfoData, isLoading: isFetchingAccInfo } =
    useAccountInfo(userId);

  const { mutateAsync, isPending: profilePending } = useProfileMutation({
    onError: (error) => {
      console.log("error => ", error);
    },
  });

  const isAccVerified =
    !!accountInfoData && checkIsAccountVerified(accountInfoData?.fields);

  const editProfileRoute = () => {
    startTransition(() => {
      router.push("/profile/edit");
    });
  };

  const handleSocialLinkChange = async (
    link: string,
    username: string,
    type: "edit" | "delete"
  ) => {
    if (accountInfoData) {
      const note = sanitizeInput(
        accountInfoData?.note?.replace(" " + MANDATORY_BIO, "")
      );
      const updatedProfile: UpdateProfilePayload = {
        display_name: accountInfoData?.display_name,
        // note: note + "\r\n\r\n " + MANDATORY_BIO,
        note,
        fields_attributes: generateFieldsAttributes(
          accountInfoData,
          link,
          username,
          type
        ),
      };
      if (type == "edit") {
        setSocialLinkAction((prev) => ({ ...prev, visible: false }));
        addSocialLink(userId, link, username);
      } else {
        removeSocialLink(userId, link);
      }
      await mutateAsync(updatedProfile);
    }
  };

  return (
    <div className="mb-2">
      {accountInfoData && (
        <>
          <div className="relative bg-gray-400 mb-11 md:mb-18">
            <Image
              src={
                isValidImageUrl(accountInfoData?.header)
                  ? accountInfoData?.header
                  : FALLBACK_PREVIEW_IMAGE_URL
              }
              width={700}
              height={200}
              style={{
                aspectRatio: 3.35 / 1,
                objectFit: "cover",
              }}
              className="w-full h-[200px]"
              alt="Preview"
            />
            <div className="absolute top-4 left-4">
              <GoBack className="bg-gray-500 opacity-80 text-[#fff]" />
            </div>
            <div className="absolute start-0 w-full bottom-0 flex justify-between items-end px-4 translate-y-11 md:translate-y-18">
              <div
                className={cn(
                  "w-[90px] h-[90px] md:w-[133px] md:h-[133px] rounded-full overflow-hidden border-4 border-primary",
                  {
                    "border-gray-50": theme === "light",
                  }
                )}
              >
                <Image
                  src={
                    isValidImageUrl(accountInfoData?.avatar)
                      ? accountInfoData?.avatar
                      : FALLBACK_PREVIEW_IMAGE_URL
                  }
                  width={133}
                  height={133}
                  className="aspect-square object-cover"
                  alt="Preview"
                />
              </div>

              {isOwnProfile && (
                <Button
                  onClick={editProfileRoute}
                  className="rounded-4xl border-[0.5px] w-[110px] md:mb-4"
                  loading={isPending}
                >
                  Edit account
                </Button>
              )}
              {!isOwnProfile && (
                <div className="flex gap-2">
                  {!domain && (
                    <ProfileChat
                      accountId={userId}
                      acct={accountInfoData?.acct}
                    />
                  )}
                  <FollowAction
                    asButton
                    relationship={relationship}
                    accountId={accountInfoData.id}
                  />
                  <BlockAndReportPopover
                    relationship={relationship}
                    account={accountInfoData as unknown as Account}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="px-4 space-y-4 py-4">
            <div>
              <InfoSection
                emojis={accountInfoData?.emojis}
                hasRedMark={isAccVerified}
                accountName={
                  accountInfoData?.display_name || accountInfoData?.username
                }
                username={accountInfoData?.acct}
                joinedDate={dayjs(accountInfoData?.created_at).format(
                  "MMM YYYY"
                )}
                userBio={accountInfoData?.note?.replace(
                  " " + MANDATORY_BIO,
                  ""
                )}
              />
            </div>
            <SocialSection
              isMyAccount={isOwnProfile}
              accountInfo={accountInfoData}
              onAddSocialLink={() =>
                setSocialLinkAction({
                  visible: true,
                  formType: "add",
                })
              }
              onEditSocialLink={() =>
                setSocialLinkAction({
                  visible: true,
                  formType: "edit",
                })
              }
            />

            <div className="flex justify-start items-center gap-x-2 text-sm">
              <p>
                {formatNumber(accountInfoData?.statuses_count)}{" "}
                <span className="text-gray-400">
                  {accountInfoData?.statuses_count <= 1
                    ? t("timeline.post")
                    : t("timeline.post_plural")}
                </span>
              </p>
              <p
                className="cursor-pointer"
                onClick={() => {
                  if (isLoggedIn) {
                    router.push(`/@${accountInfoData.acct}/following`);
                  } else {
                    setOpenDialog(true);
                  }
                }}
              >
                {formatNumber(accountInfoData?.following_count)}{" "}
                <span className="text-gray-400">{t("timeline.following")}</span>
              </p>
              <p
                className="cursor-pointer"
                onClick={() => {
                  if (isLoggedIn) {
                    router.push(`/@${accountInfoData.acct}/followers`);
                  } else {
                    setOpenDialog(true);
                  }
                }}
              >
                {formatNumber(accountInfoData?.followers_count)}{" "}
                <span className="text-gray-400">
                  {accountInfoData?.followers_count <= 1
                    ? t("timeline.follower")
                    : t("timeline.follower_plural")}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
      <SocialLinks
        isOwnProfile={isOwnProfile}
        openThemeModal={socialLinkAction.visible}
        onClose={() => {
          setSocialLinkAction((prev) => ({ ...prev, visible: false }));
        }}
        onPressAdd={(link, username, customCallback) => {
          handleSocialLinkChange(link, username, "edit");
          customCallback && customCallback();
        }}
        onPressDelete={(link) => {
          handleSocialLinkChange(link, " ", "delete");
        }}
        formType={socialLinkAction.formType}
        data={accountInfoData?.fields?.filter((v) => v.value)}
      />
      {isFetchingAccInfo && <ProfileSkeleton />}
      <LoginDialog
        actionType="login"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </div>
  );
};
