import { useChannelFeedCollection } from "@/hooks/queries/useChannelFeedCollection";
import { useCollectionChannelList } from "@/hooks/queries/useCollections.query";
import { useNewsmastCollections } from "@/hooks/queries/useNewsmastCollections";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../atoms/ui/button";
import ExploreCard from "../organisms/search/ExploreCard";
import { useDraftStore } from "../organisms/compose/store/useDraftStore";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { getToken } from "@/stores/auth";
import { LinkStatus } from "./common/LinkStatus";
import SearchInput from "./common/Searchinput";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { useLocale } from "@/providers/localeProvider";

const RightSidebar = () => {
  const router = useRouter();
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const token = getToken()
  const isHomePage = pathname === "/home";
  const [searchKeyword, setSearchKeyword] = useState("");

  const { isDirty, setSaveAsDraftModalOpen, setNavigateAction } =
    useDraftStore();

  const { data: collectionList } = useCollectionChannelList();

  const { data: newsmastColletionlList } = useNewsmastCollections();

  const { data: channelFeedCollectionList } = useChannelFeedCollection({
    enabled: true,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("s", value);
    } else {
      params.delete("s");
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, 500);

  useEffect(() => {
    const search = searchParams.get("s");
    if (search) {
      setSearchKeyword(search);
    }else{
      setSearchKeyword("");
    }
  }, [searchParams]);

  const handleCloseSearch = () => {
    setSearchKeyword("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("s");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <aside
      className="hidden lg:block max-sm:hidden h-dvh px-5 sticky overflow-y-auto top-0 left-0 z-30"
      style={{
        boxShadow: "-5px 0 5px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="mt-4 mb-6 flex items-center justify-between">
        <p className="text-xl font-bold">{t("channel.explore_channels")}</p>
        <Link
          className="relative"
          href="/search/explore"
          onNavigate={(e) => {
            if (isDirty) {
              e.preventDefault();
              setNavigateAction(() => router.push("/search/explore"));
              setSaveAsDraftModalOpen(true);
            }
          }}
        >
          <Button
            variant="outline"
            className="text-sm border-[0.5px] border-[#96A6C2] px-2 p-1 h-auto"
          >
            {t("common.see_all")}
          </Button>
          <LinkStatus />
        </Link>
      </div>
      {isHomePage && !token && (
        <SearchInput
          className="sticky my-4"
          onSearch={debouncedSearch}
          placeholder=""
          value={searchKeyword}
          closeIcon={searchKeyword.length > 0}
          onClose={handleCloseSearch}
        />
      )}

      <div className="pb-6 flex justify-between items-center gap-4 w-full">
        <ExploreCard
          title={t("screen.channels")}
          count={channelFeedCollectionList?.[0]?.attributes.community_count || 0}
          image={[
            channelFeedCollectionList?.[1]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            channelFeedCollectionList?.[2]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            channelFeedCollectionList?.[3]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            channelFeedCollectionList?.[4]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
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
          count={newsmastColletionlList?.[0]?.attributes.community_count || 0}
          image={[
            newsmastColletionlList?.[1]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            newsmastColletionlList?.[2]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            newsmastColletionlList?.[3]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            newsmastColletionlList?.[4]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
          ]}
          type="newsmast"
          onClick={() => {
            if (isDirty) {
              setNavigateAction(() => router.push("/newsmast"));
              setSaveAsDraftModalOpen(true);
            } else {
              router.push("/newsmast");
            }
          }}
        />
      </div>

      <div className="pb-6 flex justify-between items-center gap-4">
        <ExploreCard
          title={t("screen.communities")}
          count={collectionList?.[0]?.attributes.community_count || 0}
          image={[
            collectionList?.[1]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            collectionList?.[2]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            collectionList?.[3]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
            collectionList?.[4]?.attributes.avatar_image_url || FALLBACK_PREVIEW_IMAGE_URL,
          ]}
          type="collection"
          onClick={() => {
            if (isDirty) {
              setNavigateAction(() => router.push("/communities"));
              setSaveAsDraftModalOpen(true);
            } else {
              router.push("/communities");
            }
          }}
        />
      </div>
    </aside>
  );
};

export default RightSidebar;
