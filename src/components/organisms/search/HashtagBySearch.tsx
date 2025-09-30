import { useLocale } from "@/providers/localeProvider";
import { HashtagDetail } from "@/types/patchwork";
import { calculateHashTagCount } from "@/utils/helper/helper";
import { ChevronRightIcon, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type HashTagsBySearchResultProps = {
  hashtagsSearchResult: HashtagDetail[];
}

const HashTagsBySearchResult = ({
  hashtagsSearchResult
}: HashTagsBySearchResultProps) => {
  const {t} = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const navigateToHashTagDetail = (hashTagName: HashtagDetail["name"]) => {
    startTransition(() => {
      router.push(`/hashtags/${hashTagName}`);
    });
  };

  return (
    hashtagsSearchResult?.length > 0 && (
      <div className="mx-4 mt-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center justify-start gap-x-2">
            <Flame className="h-5 w-5" />
            <p className="font-semibold text-lg">{t("search.trending")}</p>
          </div>
        </div>
        {Array.isArray(hashtagsSearchResult) &&
          hashtagsSearchResult.slice(0, 4).map((hashtag, index) => (
            <div
              key={index}
              onClick={() => navigateToHashTagDetail(hashtag.name)}
              className="flex items-center justify-between border-b border-gray-600 py-2"
            >
              <div>
                <p className="font-SourceSans3_Bold text-md_16">
                  #{hashtag.name}
                </p>
                <p className="opacity-60">{`${calculateHashTagCount(
                  hashtag.history,
                  "uses"
                )} ${t("hashtag_detail.post_plural")} ${t("hashtag_detail.from")} ${calculateHashTagCount(
                  hashtag.history,
                  "accounts"
                )} ${t("hashtag_detail.participant_plural")}`}</p>
              </div>
              <ChevronRightIcon />
            </div>
          ))}
      </div>
    )
  );
};

export default HashTagsBySearchResult;
