"use client";

import { useEffect, useState } from "react";
import { DEFAULT_API_URL } from "@/utils/constant";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/ui/accordion";
import Cookies from "js-cookie";
import { HomeTimeline } from "@/components/organisms/status/HomeTimeline";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/providers/localeProvider";
import { useGetCommunityAbout } from "@/hooks/queries/useGetChannelAbout.query";
import PatchworkLogo from "@/components/atoms/icons/patchwork-logo";
import ExploreCard from "@/components/organisms/search/ExploreCard";
import { useChannelFeedCollection } from "@/hooks/queries/useChannelFeedCollection";
import { useDraftStore } from "@/components/organisms/compose/store/useDraftStore";
import { useNewsmastCollections } from "@/hooks/queries/useNewsmastCollections";
import { useCollectionChannelList } from "@/hooks/queries/useCollections.query";
import ChannelBySearch from "@/components/organisms/search/ChannelsTab";
import { useSearchChannelAndCommunity } from "@/hooks/queries/search/useSearchAllQueries";
import Link from "next/link";
import { useActiveDomainStore, useSelectedDomain } from "@/stores/auth/activeDomain";
import LayoutContainer from "@/components/templates/LayoutContainer";
import MappedTabs from "@/components/molecules/common/MappedTabs";

const PublicHome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("activeTab") ?? "posts";
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const { t } = useLocale();
  const { isDirty, setSaveAsDraftModalOpen, setNavigateAction } =
    useDraftStore();
  const [searchKeyword, setSearchKeyword] = useState("");

  const [activeTab, setActiveTab] = useState<string>("posts");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    // Set initial state
    setIsMobile(mediaQuery.matches);
    // Listen for changes
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const tabs = [
    { name: `${t("timeline.posts")}`, value: "posts" },
    { name: `${t("timeline.about")}`, value: "about" },
    // Show Explore channels only on mobile
    ...(isMobile ? [{ name: `Channels`, value: "explore_channels" }] : []),
  ];

  const handleTabChange = (tab: { name: string; value: string }) => {
    setActiveTab(tab.value);
    router.replace(`/home?activeTab=${tab.value}`);
  };

  const { data: searchChannelRes, isFetching: searchLoading } = useSearchChannelAndCommunity({
      searchKeyword,
      enabled: searchKeyword.length > 0,
    });

  const domain_name = useSelectedDomain();

  const { actions } = useActiveDomainStore();

  const { data: channelAbout } = useGetCommunityAbout(domain);

  const { data: collectionList } = useCollectionChannelList();

  const { data: channelFeedCollectionList } = useChannelFeedCollection({
    enabled: true,
  });

  const { data: newsmastColletionlList } = useNewsmastCollections();

  useEffect(() => {
    if (domain_name !== domain) {
      actions.setDomain(domain);
    }
  }, []);

  useEffect(() => {
  const search = searchParams.get("s");
  if (search) {
    setSearchKeyword(search);
  } else {
    setSearchKeyword("");
  }
}, [searchParams]);

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  if (searchKeyword.length > 0) {
    return (
      <LayoutContainer>
         <ChannelBySearch searchData={searchChannelRes} fromHome loading={searchLoading}/>
     </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      <div className="w-full p-4 flex flex-row justify-start items-center sticky top-0 z-40 bg-background gap-4">
        <div className="rounded-full">
          <PatchworkLogo className="w-12 h-12" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-foreground text-2xl font-bold">
            {t("timeline.welcome")}
          </h3>
        </div>
      </div>
      <div className="sticky top-[80px] z-10">
        <MappedTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
        />
      </div>
      {activeTab === "about" && (
        <div className="p-4 h-full flex flex-col justify-between gap-4">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-2xl font-bold">patchwork.io</p>
              <p>
                Your social media
              </p>
            </div>

            <Accordion
              type="single"
              collapsible
              className="rounded-none"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="bg-gray-300 dark:bg-gray-500 p-4 font-bold text-lg">
                  About
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-4">
                    <h3 className="text-lg">YOUR SOCIAL MEDIA APP</h3>
                    <p>
                      Patchwork is a powerful, white-label social media app and
                      technology package enabling your organisation to control
                      your own social media platform, built around your content,
                      and your community.
                    </p>
                    <p>
                      Put your brand, values and content in people’s hands, in
                      the place where they spend their online lives - their
                      phones. We’ll build a custom app for you, tailored the way
                      you want it, accessible on iOS, Android and the web.
                      Centred on a dedicated Channel for your community of
                      users.
                    </p>
                    <p>
                      The world’s social media platforms have been hijacked by a
                      handful of powerful interests. They push narrow, toxic
                      agendas at the expense of safety, truth and public
                      interest – eroding democracy and destroying life in their
                      path. It’s time for a social media revolution.
                    </p>
                    <p>
                      Patchwork is the app for a new digital public space built
                      around independent, trustworthy, media. Building out from
                      your content and community, Patchwork connects you with a
                      global movement of activists and pioneers working for
                      social change.
                    </p>
                    <div className="space-y-2">
                      <p>HEALTHY SOCIAL MEDIA:</p>
                      <ul className="list-disc pl-8">
                        <li>No toxic algorithm</li>
                        <li>Effective, human-led moderation</li>
                        <li>Controlled by the people, for the people</li>
                        <li>Open source</li>
                        <li>Community focused</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p>YOUR APP. YOUR:</p>
                      <ul className="list-disc pl-8">
                        <li>Name</li>
                        <li>Branding</li>
                        <li>Content</li>
                        <li>Channels</li>
                        <li>Separate App Store listing</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p>CONNECTED COMMUNITIES</p>
                      <p>
                        Patchwork is a part of the open social web - a network
                        of interoperable apps and communities talking to each
                        other. Using Patchwork you can connect with users on
                        Mastodon, Pixelfed, Bluesky and beyond. A new, lively
                        and thriving social media community showing how making
                        and sharing content can be done differently.
                      </p>
                    </div>
                    <div className="space-y-2 pb-8 md:pb-4">
                      <p>THE NEWSMAST FOUNDATION</p>
                      <p>
                        Patchwork is developed and delivered by the Newsmast
                        Foundation, a UK-based charity working to use social
                        media to share knowledge, for good.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="rounded-none">
              <AccordionItem value="item-2">
                <AccordionTrigger className="bg-gray-300 dark:bg-gray-500 p-4 font-bold text-lg">
                  Server rules
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  {channelAbout?.rules?.map((rule, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-start gap-2"
                    >
                      <div className=" w-7 h-7 bg-orange-900 rounded-full flex-shrink-0">
                        <p className="flex justify-center items-center h-full text-white">
                          {index + 1}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-base">{rule?.text}</p>

                        {rule?.hint?.includes("https://") ? (
                          <Link href={rule?.hint} target="_blank">
                            {rule?.hint}
                          </Link>
                        ) : (
                          <p>{rule?.hint}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="bg-gray-300 dark:bg-gray-500 p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <div className="space-y-2">
                    <p className="font-medium"> Administered by:</p>
                    <div className="flex md:flex-row flex-col md:items-center gap-3">
                      <PatchworkLogo className="w-12 h-12" />
                      <div>
                        <p>
                          {channelAbout?.contact?.account?.display_name ?? "-"}
                        </p>
                        <p>{channelAbout?.contact?.account?.username ?? "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <div className="flex space-x-4 h-full">
                    <p className="w-px h-full bg-gray-400 dark:bg-gray-50 dark:opacity-15 md:block hidden"></p>
                    <div className="space-y-2">
                      <p className="font-medium">Contact:</p>
                      <Link
                        href={`mailto:${channelAbout?.contact?.email}`}
                        className="hover:underline underline-offset-2"
                      >
                        {channelAbout?.contact?.email}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400 space-y-2 flex flex-col items-center">
            <div className="flex justify-start items-center gap-3">
              <p>Patchwork:</p>
              <Link href="/" className="underline underline-offset-3">
                View source code
              </Link>
            </div>

            <div className="flex justify-start items-center gap-3">
              <p>Mastodon:</p>
              <Link
                href="https://github.com/mastodon/mastodon"
                className="underline underline-offset-3"
              >
                View source code
              </Link>
            </div>

            <div>
              <p>4.4.0-alpha.2</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "posts" && (
        <div className="mb-4">
          <HomeTimeline
            excludeDirect
            excludeReplies
            instanceUrl={domain_name}
            limit={50}
            remote={false}
            onlyMedia={false}
            isCommunity={true}
            local={true}
          />
        </div>
      )}

      {activeTab === "explore_channels" && (
        <div className="mb-4 md:mb-12 p-4">
          <div className="pb-6 flex justify-between items-center gap-4 w-full">
            <ExploreCard
              title={t("screen.channels")}
              count={channelFeedCollectionList?.[0]?.attributes.community_count}
              image={[
                channelFeedCollectionList?.[1]?.attributes.avatar_image_url,
                channelFeedCollectionList?.[2]?.attributes.avatar_image_url,
                channelFeedCollectionList?.[3]?.attributes.avatar_image_url,
                channelFeedCollectionList?.[4]?.attributes.avatar_image_url,
              ]}
              type="channel"
              onClick={() => {
                if (isDirty) {
                  setNavigateAction(() => router.push("/channels"));
                  setSaveAsDraftModalOpen(true);
                } else {
                  router.push("/channels");
                }
              }}
            />
          </div>

          <div className="pb-6 flex justify-between items-center gap-4 w-full">
            <ExploreCard
              title={t("screen.newsmast_channels")}
              count={newsmastColletionlList?.[0]?.attributes.community_count}
              image={[
                newsmastColletionlList?.[1]?.attributes.avatar_image_url,
                newsmastColletionlList?.[2]?.attributes.avatar_image_url,
                newsmastColletionlList?.[3]?.attributes.avatar_image_url,
                newsmastColletionlList?.[4]?.attributes.avatar_image_url,
              ]}
              type="newsmast"
              onClick={() => {
                if (isDirty) {
                  setNavigateAction(() =>
                    router.push("/newsmast-channel/all-collection")
                  );
                  setSaveAsDraftModalOpen(true);
                } else {
                  router.push("/newsmast-channel/all-collection");
                }
              }}
            />
          </div>

          <div className="pb-6 flex justify-between items-center gap-4">
            <ExploreCard
              title={t("screen.communities")}
              count={collectionList?.[0]?.attributes.community_count}
              image={[
                collectionList?.[1]?.attributes.avatar_image_url,
                collectionList?.[2]?.attributes.avatar_image_url,
                collectionList?.[3]?.attributes.avatar_image_url,
                collectionList?.[4]?.attributes.avatar_image_url,
              ]}
              type="collection"
              onClick={() => {
                if (isDirty) {
                  setNavigateAction(() =>
                    router.push("/communities/communities?slug=all-collection")
                  );
                  setSaveAsDraftModalOpen(true);
                } else {
                  router.push("/communities/communities?slug=all-collection");
                }
              }}
            />
          </div>
        </div>
      )}
    </LayoutContainer>
  );
};

export default PublicHome;
