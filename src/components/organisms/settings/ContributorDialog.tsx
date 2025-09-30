import { Button } from "@/components/atoms/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/atoms/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/atoms/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/atoms/ui/popover";
import { useUserRelationshipMutation } from "@/hooks/mutations/profile/useCheckRelationship";
import { useMuteUnmuteUserMutation } from "@/hooks/mutations/profile/useMuteUnmuteUser";
import {
  useGetMyTotalChannelList,
  useSearchContributor
} from "@/hooks/queries/useChannelContent";
import { useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { RelationShip } from "@/types/profile";
import { Contributor, SearchContributorRes } from "@/types/patchwork";
import { Account } from "@/types/account";

type ContributorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "follow" | "mute";
}

const ContributorDialog = ({
  isOpen,
  onClose,
  type
}: ContributorDialogProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [userAccount, setUserAccount] = useState<Contributor>();

  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchKeyword(value);
  }, 500);

  const { data: myChannels } = useGetMyTotalChannelList();
  const channelId = myChannels?.[0]?.id || "";

  const { data: searchedUsers } = useSearchContributor({
    keyword: searchKeyword,
    enabled: searchKeyword.length > 1
  });

  const { mutate: mutateUserFollow } = useUserRelationshipMutation({
    onSuccess: (newRelationship, { isFollowing }) => {
      const queryKey = ["search-contributor", { keyword: searchKeyword }];
      const previousData =
        queryClient.getQueryData<SearchContributorRes>(queryKey);
      if (previousData) {
        const updatedData: SearchContributorRes = {
          ...previousData,
          accounts: previousData.accounts.map((account) => {
            if (type == "follow") {
              return account.id === userAccount?.id
                ? {
                    ...account,
                    following: isFollowing ? "not_followed" : "following"
                  }
                : account;
            }
            return account.id === userAccount?.id
              ? { ...account, is_muted: !account.is_muted }
              : account;
          })
        };
        queryClient.setQueryData(queryKey, updatedData);
      }
      queryClient.invalidateQueries({
        queryKey: ["contributor-list", { channelId }]
      });
    }
  });

  const { mutate: toggleMute } = useMuteUnmuteUserMutation({
    onSuccess: (response) => {
      const queryKey = ["search-contributor", { keyword: searchKeyword }];
      const previousData =
        queryClient.getQueryData<SearchContributorRes>(queryKey);
      if (previousData) {
        const updatedData: SearchContributorRes = {
          ...previousData,
          accounts: previousData.accounts.map((account) => {
            if (type == "follow") {
              return account.id === userAccount?.id
                ? { ...account, following: "following" }
                : account;
            }
            return account.id === userAccount?.id
              ? { ...account, is_muted: !account.is_muted }
              : account;
          })
        };
        queryClient.setQueryData(queryKey, updatedData);
      }

      queryClient.invalidateQueries({
        queryKey: ["muted-contributor-list", { channelId }]
      });
    }
  });

  const handleFollow = (id: string, isFollowing: boolean) => {
    mutateUserFollow({
      accountId: id,
      isFollowing: isFollowing
    });
  };

  const handleMute = (id: string, isMuted: boolean) => {
    toggleMute({ accountId: id, toMute: !isMuted });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setOpen(false);
        onClose();
        setSearchKeyword("");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "follow" ? (
              <p>Add contributor</p>
            ) : (
              <p>Mute a contributor</p>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Info size={16} />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="p-4 space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="mt-1">*</span>
                    <span>
                      To search for local accounts, use the name or username.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-1">*</span>
                    <span>
                      To search for accounts from the Fediverse, use the format
                      @username@domain.
                    </span>
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-4">
          <p>
            Use the search functionality below to add contributors to your
            channel.
          </p>
        </DialogDescription>
        <Popover open={open} onOpenChange={setOpen}>
          <Command shouldFilter={false} className="h-auto">
            <CommandInput
              placeholder="Search by name or username"
              className="w-full h-9"
              onValueChange={(value) => {
                setInputValue(value);
                debouncedSearch(value);
              }}
            />
            <CommandList>
              {searchedUsers?.accounts?.length > 0 ? (
                <CommandGroup className="space-y-2">
                  {searchedUsers?.accounts?.map((account: Contributor) => (
                    <CommandItem key={account.id} className="mb-2">
                      <div className="flex items-start gap-4 w-full">
                        <div className="flex-shrink-0">
                          {account?.avatar_url && (
                            <Image
                              className="rounded-full"
                              width={50}
                              height={50}
                              src={account?.avatar_url}
                              alt={account?.username}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {account?.display_name || account?.username}
                          </p>
                          <p className="text-sm mb-1">
                            @{account.username}@{account.domain}
                          </p>
                          <p
                            className="text-sm text-gray-400 line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: account?.note
                            }}
                          />
                        </div>
                        {type == "follow" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => {
                              handleFollow(
                                account.id,
                                account.following == "following"
                              );
                              setUserAccount(account);
                            }}
                          >
                            {account.following == "following"
                              ? "Unfollow"
                              : "Follow"}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => {
                              handleMute(account.id, account.is_muted);
                              setUserAccount(account);
                            }}
                          >
                            {account.is_muted ? "Unmute" : "Mute"}
                          </Button>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : inputValue?.length > 0 ? (
                <CommandEmpty>No contributor found.</CommandEmpty>
              ) : (
                <CommandEmpty>
                  Search for a contributor to add to your channel.
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </Popover>
      </DialogContent>
    </Dialog>
  );
};

export default ContributorDialog;
