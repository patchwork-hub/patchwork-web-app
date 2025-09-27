"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/ui/tabs";
import SearchInput from "@/components/molecules/common/Searchinput";
import HomeHeader from "@/components/molecules/HomeHeader";
import { useLocale } from "@/providers/localeProvider";
import ChannelBySearch from "@/components/organisms/search/ChannelsTab";
import HashtagBySearch from "@/components/organisms/search/HashtagBySearch";
import SuggestedPeopleBySearch from "@/components/organisms/search/People&PostsTab";
import {
  useSearchAllQueries,
  useSearchChannelAndCommunity,
} from "@/hooks/queries/search/useSearchAllQueries";
import { useSearchStore } from "@/stores/search/useSearchStore";
import { Account } from "@/types/account";
import { Status as StatusType } from "@/types/status";
import { isSystemDark } from "@/utils/helper/helper";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchList = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { theme } = useTheme();
  const {t} = useLocale();

  const { setSearch } = useSearchStore();
  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchKeyword(value);
    setSearch(value);
  }, 500);

  const { data: searchAllRes } = useSearchAllQueries({
    q: searchKeyword,
    resolve: true,
    limit: 11,
    options: { enabled: searchKeyword.length > 0 },
  });

  const { data: searchChannelRes } = useSearchChannelAndCommunity({
    searchKeyword,
    enabled: searchKeyword.length > 0,
  });

  const transformedAccounts = searchAllRes?.accounts?.map((account) => ({
    ...account,
    tags: [],
    account_id: account.id,
    domain: null,
    image_url: account.avatar,
    primary_community_slug: "",
    primary_community_name: "",
    collection_count: 0,
    community_count: 0,
    country: "",
    country_common_name: "",
    dob: "",
    is_followed: false,
    is_requested: false,
    subtitle: "",
    contributor_role: "",
    voices: "",
    media: "",
    hash_tag_count: 0,
    email: "",
    phone: "",
    about_me: "",
  })) as Account[];

  const checkNoResults = useMemo(() => {
    const accountsLength = searchAllRes?.accounts?.length ?? 0;
    const hashtagsLength = searchAllRes?.hashtags?.length ?? 0;
    const statusesLength = searchAllRes?.statuses?.length ?? 0;

    return accountsLength === 0 && hashtagsLength === 0 && statusesLength === 0;
  }, [searchAllRes?.accounts, searchAllRes?.hashtags, searchAllRes?.statuses]);


  return (
    <div className="w-full px-4 pb-16 sm:pb-0">
      <HomeHeader search={true}/>
      <div className="w-full mx-auto my-4">
        <SearchInput
          className="border-[0.5px] border-gray-400 sticky"
          onSearch={debouncedSearch}
          placeholder={t("search.search")}
        />
      </div>
      <Tabs
        defaultValue={tab || "people-posts"}
        className="w-full"
        onValueChange={(value) => {
          router.push(`/search?tab=${value}`);
        }}
      >
        <TabsList
          className={`grid w-full grid-cols-2 bg-background text-foreground border-[0.5px] ${
            theme === "dark" || (theme === "system" && isSystemDark)
              ? "border-gray-600"
              : "border-gray-300"
          }`}
        >
          <TabsTrigger
            value="people-posts"
            className="cursor-pointer border-none"
          >
            {t("search.people_and_posts")}
          </TabsTrigger>
          <TabsTrigger value="channels" className="cursor-pointer border-none">
            {t("search.channels")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="people-posts">
          <HashtagBySearch hashtagsSearchResult={searchAllRes?.hashtags??[]} />
          <SuggestedPeopleBySearch
            searchData={transformedAccounts}
            statusData={searchAllRes?.statuses as unknown as StatusType[]}
            checkNoResults={checkNoResults}
          />
        </TabsContent>
        <TabsContent value="channels">
          <ChannelBySearch searchData={searchChannelRes as ChannelAndCollectionSearch} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchList;
