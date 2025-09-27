"use client";


import { ChevronRight, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import ListSkeleton from "../skeletons/listSkeleton";
import { ThemeText } from "../common/ThemeText";
import { HashtagsFollowing } from "@/types/patchwork";
import { useLocale } from "@/providers/localeProvider";

type TLists = {
  data: HashtagsFollowing[];
  loading?: boolean;
};

const HashtagLists = ({ data, loading = false }: TLists) => {
  const router = useRouter();
  const modifiedLists = data?.slice(0, 10);
  const {t} = useLocale()

  if (!loading && (!data || data.length === 0)) {
    return null;
  }

  const renderHeader = () => (
    <div className="mb-4 flex justify-between items-center px-4">
      <ThemeText size="lg_18" variant="textBold" className="justify-start">
        {t("screen.hashtags")}
      </ThemeText>
      <ThemeText
        size="md_16"
        className="cursor-pointer"
        onClick={() => router.push("/hashtags")}
      >
        {t("common.view_all")}
      </ThemeText>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 ${index === 0 ? "ml-4" : ""} ${
            index === 2 ? "mr-4" : ""
          }`}
        >
          <ListSkeleton />
        </div>
      ))}
    </div>
  );

  const renderHashtags = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {modifiedLists.map((list, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 border rounded-full border-foreground px-2 py-1 ${
            index === 0 ? "ml-4!" : ""
          } ${index === modifiedLists.length - 1 ? "mr-4" : ""}`}
          onClick={() => router.push(`/hashtags/${list.name}`)}
        >
          <div className="flex items-center justify-center space-x-2">
            <Hash className="w-5 h-5" />
            <ThemeText>{list.name}</ThemeText>
            <ChevronRight className="w-4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-8">
      {renderHeader()}
      {loading ? renderLoadingState() : renderHashtags()}
    </div>
  );
};

export default HashtagLists;
