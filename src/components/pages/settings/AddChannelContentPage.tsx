"use client";
import ContentTypeSwitch from "@/components/organisms/profile/ContentTypeSwitch";
import Header from "@/components/atoms/common/Header";
import {
  useGetChannelContentType,
  useGetChannelFilterKeyword,
  useGetChannelHashtagList,
  useGetContributorList,
  useGetMyTotalChannelList,
} from "@/hooks/queries/useChannelContent";
import React, { useState } from "react";
import HorizontalItemRenderer from "@/components/organisms/settings/HorizontalItemRenderer";
import ContributorProfile from "@/components/organisms/settings/ContributorProfile";
import { ThemeText } from "@/components/atoms/common/ThemeText";
import { Button } from "@/components/atoms/ui/button";
import ContributorDialog from "@/components/organisms/settings/ContributorDialog";
import HashtagItem from "@/components/organisms/settings/Hashtag";
import SearchHashtagModal from "@/components/organisms/settings/SearchHashtagDialog";
import FilterKeywordItem from "@/components/organisms/settings/FilterKeywordItem";
import FilterInKeywordModal from "@/components/organisms/settings/FilterInKeywordDialog";

type ModalProps = {
  isOpen: boolean;
  currentModalType: "contributor" | "hashtag" | "keyword";
  isModalInEditMode?: false;
};

const AddChannelContentPage = () => {
  const [modalState, setModalState] = useState<ModalProps>({
    isOpen: false,
    currentModalType: "contributor",
    isModalInEditMode: false,
  });

  const { data: myChannels } = useGetMyTotalChannelList();
  const channelId = myChannels?.[0]?.id || "";

  const { data: contributors, isLoading: isLoadingContributorList } =
    useGetContributorList(channelId, !!channelId);

  const { data: hashtagList, isLoading: isLoadingHashtagList } =
    useGetChannelHashtagList(channelId, !!channelId);

  const { data: keywordList, isLoading: isLoadingKeywordList } =
    useGetChannelFilterKeyword(channelId, !!channelId);

  const { data: channelContentType } = useGetChannelContentType(channelId);

  const orConnection =
    channelContentType?.[0]?.attributes?.custom_condition === "or_condition";
  const andConnection =
    channelContentType?.[0]?.attributes?.custom_condition === "and_condition";

  return (
    <div className="mb-16">
      <Header title="Add channel content" />
      <div className="px-4 py-6">
        <p className="text-lg font-bold">Add content</p>
        <p className="text-sm text-white">
          Populate your channel with content from across the New Social network.
          Here you can define rules that specify what content is included in
          your channel.
        </p>
        <div className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-bold">Content type</p>
            <p className="text-sm text-white">
              First, choose whether you want your Channel to be open to anyone's
              posts or closed to selected contributors when they use a specific
              hashtag.
            </p>
          </div>
          <ContentTypeSwitch
            isSwitchOn={orConnection}
            channelId={channelId}
            label="Open to anyone"
            type="open"
          />
          <ContentTypeSwitch
            isSwitchOn={andConnection}
            channelId={channelId}
            label="Selected contributors only"
            type="selected"
          />
        </div>

        {channelContentType && orConnection && (
          <div className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-bold">Channel hashtag</p>
              <p className="text-sm text-white flex flex-col gap-x-2">
                <span>
                  Anyone can join the conversation by adding your Channel
                  hashtag to their post. Here's the preset channel hashtag. If
                  you'd like to change this or add an additional hashtag, email
                </span>
                <a
                  href="mailto:support@newsmast.org"
                  className="text-orange-500"
                >
                  support@newsmast.org.
                </a>
              </p>
            </div>
            <div>
              <p>Hashtag*</p>
              {hashtagList &&
                hashtagList?.length > 0 &&
                hashtagList.map((item, idx) => {
                  return (
                    <div key={idx}>
                      <HashtagItem
                        channelId={channelId}
                        hashtag={item}
                        isLastOne={hashtagList.length == 1}
                      />
                    </div>
                  );
                })}
            </div>
            {/* <Button
              variant="outline"
              className="rounded-3xl mt-5 border-slate-400 w-full"
              onClick={() => {
                setModalState({
                  isOpen: true,
                  currentModalType: "hashtag"
                });
              }}
            >
              <ThemeText>Add another</ThemeText>
            </Button> */}
          </div>
        )}

        <div className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-bold">{`Add sources - contributors (${
              contributors?.length || 0
            })`}</p>
            <p className="text-sm text-white">
              Select contributors, all their content will be added to your
              Channel.
            </p>
          </div>
          {contributors && contributors?.length > 0 && (
            <HorizontalItemRenderer
              data={contributors}
              renderItem={(item) => (
                <ContributorProfile
                  account={item}
                  channelId={channelId}
                  className="mr-4"
                  operationType="follow"
                />
              )}
            />
          )}
          {!contributors && isLoadingContributorList && (
            <HorizontalItemRenderer
              data={[1, 2, 3]}
              renderItem={(item) => (
                <div className="my-2 mx-3 items-center" data-testid="loader">
                  <div className="bg-slate-300 rounded-full w-[80] h-[80]"></div>
                  <div className="bg-slate-300 rounded-full w-[80] h-[10] my-2"></div>
                  <div className="bg-slate-300 rounded-full w-[50] h-[10]"></div>
                </div>
              )}
            />
          )}
          {contributors && contributors?.length == 0 && (
            <ThemeText variant="textGrey">
              * You have not added any contributors to this channel.
            </ThemeText>
          )}
          <Button
            variant="outline"
            className="rounded-3xl mt-5 border-slate-400 w-full"
            onClick={() => {
              setModalState({
                isOpen: true,
                currentModalType: "contributor",
              });
            }}
          >
            <ThemeText>Add new contributor</ThemeText>
          </Button>
        </div>

        {channelContentType && andConnection && (
          <div className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-bold">Add labels - hashtags</p>
              <p className="text-sm text-white flex flex-col gap-x-2">
                Use labels to keep your Channel on topic. Choose a Channel
                hashtag so contributors can join the conversation, or leave
                blank and display all their posts.
              </p>
            </div>
            <div>
              <p>Hashtag*</p>
              {hashtagList &&
                hashtagList?.length > 0 &&
                hashtagList.map((item, idx) => {
                  return (
                    <div key={idx}>
                      <HashtagItem
                        channelId={channelId}
                        hashtag={item}
                        isLastOne={hashtagList.length == 1}
                      />
                    </div>
                  );
                })}
            </div>
            <Button
              variant="outline"
              className="rounded-3xl mt-5 border-slate-400 w-full"
              data-testid="add-hashtag-button"
              onClick={() => {
                setModalState({
                  isOpen: true,
                  currentModalType: "hashtag",
                });
              }}
            >
              <ThemeText>Add another</ThemeText>
            </Button>
          </div>
        )}

        <div className="border border-slate-300 dark:border-gray-600 p-4 mt-8 space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-bold">Add label - keywords</p>
            <p className="text-sm text-white">
              Use labels to keep your Channel on topic. Only posts using these
              keywords will appear in your Channel.
            </p>
          </div>
          <div>
            <p>Keyword *</p>
            {keywordList &&
              keywordList?.length > 0 &&
              keywordList.map((item, idx) => {
                return (
                  <div key={idx}>
                    <FilterKeywordItem
                      keyword={item}
                      channelId={channelId}
                      itemType="filter-in"
                    />
                  </div>
                );
              })}
          </div>
          <Button
            variant="outline"
            className="rounded-3xl mt-5 border-slate-400 w-full"
            onClick={() => {
              setModalState({
                isOpen: true,
                currentModalType: "keyword",
              });
            }}
          >
            <ThemeText>Add another</ThemeText>
          </Button>
        </div>
      </div>

      <ContributorDialog
        isOpen={
          modalState.isOpen && modalState.currentModalType == "contributor"
        }
        onClose={() => {
          setModalState({ isOpen: false, currentModalType: "contributor" });
        }}
        type="follow"
      />

      <SearchHashtagModal
        isOpen={modalState.isOpen && modalState.currentModalType == "hashtag"}
        onClose={() => {
          setModalState({ isOpen: false, currentModalType: "hashtag" });
        }}
        channelId={channelId}
      />

      <FilterInKeywordModal
        isOpen={modalState.isOpen && modalState.currentModalType == "keyword"}
        onClose={() => {
          setModalState({ isOpen: false, currentModalType: "keyword" });
        }}
        channelId={channelId}
      />
    </div>
  );
};

export default AddChannelContentPage;
