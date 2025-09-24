"use client";
import Header from "@/components/atoms/common/Header";
import { Button } from "@/components/atoms/ui/button";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import ContributorProfile from "@/components/organisms/settings/ContributorProfile";
import HorizontalItemRenderer from "@/components/organisms/settings/HorizontalItemRenderer";
import { useChangeChannelPostsType } from "@/hooks/mutations/profile/useChannelContent";
import {
  useGetChannelFilterOutKeyword,
  useGetChannelPostsType,
  useGetMutedContributorList,
  useGetMyTotalChannelList,
} from "@/hooks/queries/useChannelContent";
import React, { useState } from "react";
import { toast } from "sonner";
import ContributorDialog from "@/components/organisms/settings/ContributorDialog";
import { ThemeText } from "@/components/atoms/common/ThemeText";
import FilterKeywordItem from "@/components/organisms/settings/FilterKeywordItem";
import FilterOutKeywordModal from "@/components/organisms/settings/FilterOutKeywordDialog";

const FilterChannelContentPage = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentModalType: "contributor",
    isModalInEditMode: false,
  });

  const { data: myChannels } = useGetMyTotalChannelList();
  const channelId = myChannels?.[0]?.id || "";

  const { data: contributors, isLoading: isLoadingContributorList } =
    useGetMutedContributorList(channelId, !!channelId);

  const { data: keywordList, isLoading: isLoadingKeywordList } =
    useGetChannelFilterOutKeyword(channelId, !!channelId);

  const { data: channelPostsType } = useGetChannelPostsType(channelId);

  const { mutate } = useChangeChannelPostsType({
    onMutate: (variables) => {
      const { channelId, ...updatedVariables } = variables;
      queryClient.setQueryData<ChannelPostType>(
        ["channel-posts-type", { channelId }],
        (old) => {
          if (!old) return old;
          return updatedVariables;
        }
      );
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
    },
  });

  return (
    <div className="mb-16">
      <Header title="Filter channel content" />
      <div className="px-4 py-6">
        <p className="text-lg font-bold">Filter content</p>
        <p className="text-sm text-white">
          Filter content from the wider network to ensure you channel stays
          relevant.
        </p>
        <div className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-bold">Type of posts</p>
            <p className="text-sm text-white">
              Select which types of content are included in this channel.
            </p>
            <div className="p-4 border border-slate-200 rounded-sm mb-4 flex items-center">
              <Checkbox
                data-testid="posts-checkbox"
                className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-red-500"
                indicatorClassName="text-white"
                checked={!!channelPostsType?.posts}
                onCheckedChange={() => {
                  mutate({
                    ...channelPostsType!,
                    posts: !channelPostsType?.posts,
                    channelId,
                  });
                }}
              />
              <p className="ml-2">Posts</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-sm mb-4 flex items-center">
              <Checkbox
                data-testid="reposts-checkbox"
                className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-red-500"
                indicatorClassName="text-white"
                checked={!!channelPostsType?.reposts}
                onCheckedChange={() => {
                  mutate({
                    ...channelPostsType!,
                    reposts: !channelPostsType?.reposts,
                    channelId,
                  });
                }}
              />
              <p className="ml-2">Reposts</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-sm mb-4 flex items-center">
              <Checkbox
                data-testid="reply-checkbox"
                className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-red-500"
                indicatorClassName="text-white"
                checked={!!channelPostsType?.replies}
                onCheckedChange={() => {
                  mutate({
                    ...channelPostsType!,
                    replies: !channelPostsType?.replies,
                    channelId,
                  });
                }}
              />
              <p className="ml-2">Replies</p>
            </div>
          </div>
        </div>

        <div
          className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4"
          data-testid="muted-contributors-section"
        >
          <div className="space-y-2">
            <p className="text-lg font-bold">{`Mute contributors (${
              contributors?.length || 0
            })`}</p>
            <p className="text-sm text-white">
              Add key contributors by searching for them below. Posts from these
              contributors will be prominently featured in your channel.
            </p>
            {contributors && contributors?.length > 0 && (
              <HorizontalItemRenderer
                data={contributors}
                renderItem={(item) =>
                  item && (
                    <ContributorProfile
                      account={item}
                      channelId={channelId}
                      operationType="mute"
                      className="mr-4"
                    />
                  )
                }
              />
            )}
            {!contributors && isLoadingContributorList && (
              <HorizontalItemRenderer
                data={[1, 2, 3]}
                renderItem={(item) => (
                  <div
                    className="my-2 mx-3 items-center"
                    data-testid="skeleton-loader"
                  >
                    <div className="bg-slate-300 rounded-full w-[80] h-[80]"></div>
                    <div className="bg-slate-300 rounded-full w-[80] h-[10] my-2"></div>
                    <div className="bg-slate-300 rounded-full w-[50] h-[10]"></div>
                  </div>
                )}
              />
            )}
            {contributors && contributors?.length == 0 && (
              <p>* You have not added any contributors to this channel.</p>
            )}
            <Button
              variant="outline"
              className="rounded-3xl mt-5 border-slate-400 w-full"
              onClick={() => {
                setModalState({
                  isOpen: true,
                  currentModalType: "contributor",
                  isModalInEditMode: false,
                });
              }}
            >
              <p>Add another</p>
            </Button>
          </div>
        </div>

        <div className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-bold">Mute keywords</p>
            <p className="text-sm text-white">
              Add keyword filters to prevent posts from the wider network which
              contain this keyword from appearing in the channel.
            </p>
            <div className="flex justify-evenly">
              <div className="flex-1">
                <p>Keyword</p>
              </div>
              <div className="flex-1">
                <div className="flex-1">
                  <p>Hashtag?</p>
                </div>
                <div className="flex-1" />
              </div>
            </div>
            {keywordList &&
              keywordList?.length > 0 &&
              keywordList.map((item, idx) => {
                return (
                  <div key={idx}>
                    <FilterKeywordItem
                      keyword={item}
                      channelId={channelId}
                      itemType="filter-out"
                    />
                  </div>
                );
              })}
            {keywordList && keywordList.length == 0 && (
              <ThemeText variant="textGrey">
                * You have not added any keyword to this channel yet.
              </ThemeText>
            )}
            <Button
              variant="outline"
              className="rounded-3xl mt-5 border-slate-400 w-full"
              onClick={() => {
                setModalState({
                  isOpen: true,
                  currentModalType: "keyword",
                  isModalInEditMode: false,
                });
              }}
            >
              <ThemeText>Add another</ThemeText>
            </Button>
          </div>
        </div>
      </div>

      <ContributorDialog
        isOpen={
          modalState.isOpen && modalState.currentModalType == "contributor"
        }
        onClose={() => {
          setModalState({
            isOpen: false,
            currentModalType: "contributor",
            isModalInEditMode: false,
          });
        }}
        type="mute"
      />

      <FilterOutKeywordModal
        isOpen={modalState.isOpen && modalState.currentModalType == "keyword"}
        onClose={() => {
          setModalState({
            isOpen: false,
            currentModalType: "keyword",
            isModalInEditMode: false,
          });
        }}
        channelId={channelId}
      />
    </div>
  );
};

export default FilterChannelContentPage;
