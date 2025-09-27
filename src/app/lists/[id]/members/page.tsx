"use client";
import Header from "@/components/atoms/common/Header";
import LoadingSpinner from "@/components/atoms/common/LoadingSpinner";
import PrimaryButton from "@/components/atoms/common/PrimaryButton";
import SearchInput from "@/components/atoms/common/Searchinput";
import { ThemeText } from "@/components/molecules/common/ThemeText";
import { AccountListIcon } from "@/components/atoms/icons/Icons";
import { Modal } from "@/components/atoms/ui/modal";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import {
  useAddAccountToList,
  useRemoveAccountFromList,
} from "@/hooks/mutations/lists/useAddAccountToList";
import { useFollowAccount } from "@/hooks/mutations/status/useFollowAccount";
import { useCheckAccountRelationship } from "@/hooks/queries/status/useCheckAccountRelationship";
import { useAccountsInList } from "@/hooks/queries/useAccountsInList.query";
import { useSearchAccounts } from "@/hooks/queries/useSearchMembers";
import { useVerifyAuthToken } from "@/hooks/queries/useVerifyAuthToken.query";
import { cn } from "@/lib/utils";
import { useActiveDomainStore } from "@/store/auth/activeDomain";
import { isSystemDark } from "@/utils/helper/helper";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import { toast } from "sonner";

export default function ListMember({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {t} = useLocale();
  const [userAcct, setUserAcct] = useState<string>("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
  const [showAddToList, setShowAddToList] = useState<boolean>(false);
  const router = useRouter();
  const { domain_name: activeDomain } = useActiveDomainStore();
  const onSearch = (searchTerm: string) => {
    setSearchTriggered(true);
    setSearchTerm(searchTerm);
  };
  const followMutation = useFollowAccount();
  const { mutate: addToList } = useAddAccountToList();
  const { data: AccountsInList, isLoading: AccountInListLoading } =
    useAccountsInList({
      id,
      domain_name: activeDomain,
    });
  const memberIds = new Set(
    AccountsInList?.map((member: Account) => member.id)
  );

  const { data: currentAccount } = useVerifyAuthToken({
    enabled: true,
  });
  const { theme } = useTheme();
  const { mutate: removeFromList } = useRemoveAccountFromList();
  const { data: searchList, isLoading: searchLoading } = useSearchAccounts(
    searchTerm,
    searchTriggered
  );
  const accountIds = searchList?.accounts?.map((account) => account.id) || [];
  const queryString = accountIds
    .map((id) => `id[]=${id}`)
    .join("&")
    .replace(/^id\[\]=/, "");

  const { data: relationships } = useCheckAccountRelationship({
    id: queryString,
    enabled: accountIds.length > 0,
  });

  const relationshipMap = relationships
    ? relationships.reduce((acc, rel) => {
        acc[rel.id] = {
          following: rel.following,
          requested: rel.requested,
        };
        return acc;
      }, {})
    : {};
  const handleToggleListMember = (acc: Account, type: string) => {
    if (type === "add") {
      setSelectedAccountId(acc.id);
      setUserAcct(acc.acct);
      setShowAddToList(true);
    }
    if (type === "remove") {
      handleRemoveFromList(acc.id);
    }
  };

  const handleAddToList = () => {
    followMutation.mutate(selectedAccountId, {
      onSuccess: () => {
        addToList(
          {
            listId: id,
            accountIds: selectedAccountId,
          },
          {
            onSuccess: () => {
              setShowAddToList(false);
            },
            onError: (error: any) => {
              console.error("Failed to add to list:", error);
            },
          }
        );
      },
      onError: (error) => {
        toast.error(`${error?.response?.data.error}.`);
        console.error("Failed to follow account:", error);
      },
    });
  };

  const handleRemoveFromList = (accId: string) => {
    removeFromList(
      {
        listId: id,
        accountIds: accId,
      },
      {
        onSuccess: () => {
          setShowAddToList(false);
        },
        onError: (error) => {
          console.error("Failed to remove from list:", error);
        },
      }
    );
  };

  return (
    <>
      <Header title={t("screen.manage_list_members")} />
      <div className="h-full flex flex-col space-y-4">
        <div className="flex flex-col items-start p-4">
          <ThemeText className="flex items-center gap-1">
            <span>{t("list.add_to_your_list")}</span>
            {/* <span>{searchTerm}</span> */}
          </ThemeText>
          <p className="text-sm text-gray-400">
            {t("list.add_list_desc")}
          </p>
          <div className="w-full mt-4">
            <SearchInput onSearch={onSearch} placeholder={t("list.search_users")}/>
          </div>
        </div>

        {searchLoading ? (
          <div className="h-full">
            <LoadingSpinner />
          </div>
        ) : searchList &&
          searchTerm.length > 0 &&
          searchList.accounts.length > 0 ? (
          <div className="mb-auto">
            {searchList.accounts.map((acc, index) => {
              const isInList = memberIds.has(acc.id);
              const status = relationshipMap[acc.id] ?? {
                following: false,
                requested: false,
              };

              return (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between py-2 px-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={acc.avatar ?? FALLBACK_PREVIEW_IMAGE_URL}
                        alt="Profile Picture"
                        priority
                        width={100}
                        height={100}
                        className="w-16 h-16  object-cover rounded-full transition-all duration-300 ease-in-out aspect-square"
                      />

                      <div className="flex flex-col">
                        <ThemeText
                          size="lg_18"
                          className="text-start justify-start"
                          emojis={acc.emojis}
                        >
                          {acc.display_name || acc.username}
                        </ThemeText>

                        <p className="text-foreground font-normal text-base">
                          @{acc.acct}
                        </p>
                      </div>
                    </div>

                    {currentAccount?.id !== acc.id && (
                      <button
                        className="text-white cursor-pointer bg-orange-500 border-gray-600 rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          handleToggleListMember(
                            acc,
                            isInList ? "remove" : "add"
                          );
                        }}
                      >
                        {isInList ? `${t("common.remove")}` : `${t("common.add")}`}
                      </button>
                    )}
                  </div>
                  <p className="underline w-full h-px bg-gray-600"></p>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <>
            {AccountInListLoading ? (
              <div className="h-full">
                <LoadingSpinner />
              </div>
            ) : AccountsInList && AccountsInList.length > 0 ? (
              AccountsInList.map((acc, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="flex items-center justify-between py-2 px-4 gap-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src={acc.avatar ?? FALLBACK_PREVIEW_IMAGE_URL}
                          alt="Profile Picture"
                          priority
                          width={100}
                          height={100}
                          className="w-16 h-16 object-cover rounded-full transition-all duration-300 ease-in-out aspect-square"
                        />

                        <div className="flex flex-col flex-1 min-w-0">
                          {" "}
                          {/* Added flex-1 and min-w-0 to constrain the container */}
                          <ThemeText
                            size="lg_18"
                            className="text-start justify-start"
                          >
                            {acc.display_name || acc.username}
                          </ThemeText>
                          <p
                            className="text-foreground font-normal text-base truncate" // Added truncate class
                            title={acc.acct} // Optional: Show full handle on hover
                          >
                            @{acc.acct}
                          </p>
                        </div>
                      </div>

                      <button
                        className="border border-gray-600 rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleRemoveFromList(acc.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="underline w-full h-px bg-gray-600"></p>
                  </React.Fragment>
                );
              })
            ) : (
              <div className="flex flex-col items-center">
                <AccountListIcon  stroke={cn(theme === "dark" || (theme === "system" && isSystemDark) ? "#fff" : "#333")}/>
                <ThemeText size="sm_14" variant="textBold">
                  {t("list.add_to_your_list")}
                </ThemeText>
                <ThemeText size="sm_14" variant="textGrey">
                  {t("list.find_user_to_add")}
                </ThemeText>
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        isOpen={showAddToList}
        onClose={() => setShowAddToList(false)}
        title={t("list.follow_user")}
      >
        <p className="py-4">
          {t("list.follow_to_list_message", { username: userAcct })}
        </p>
        <div className="w-full flex items-center justify-end space-x-6">
          <button
            className="cursor-pointer hover:underline"
            onClick={() => setShowAddToList(false)}
          >
            {t("common.cancel")}
          </button>
          <button
            className="text-orange-500 cursor-pointer hover:text-orange-500/80 transition-colors duration-300"
            onClick={handleAddToList}
          >
            {t("list.follow_and_add_to_list")}
          </button>
        </div>
      </Modal>
      <PrimaryButton
        text={t("common.done")}
        isPending={false}
        className="max-w-[90%] mx-auto mt-4 sticky bottom-20 sm:bottom-4"
        onClick={() => {
          router.push(`/lists/${id}`);
        }}
      />
    </>
  );
}
