"use client";

import { ChevronRight, Menu } from "lucide-react";
import React from "react";
import ListSkeleton from "../skeletons/listSkeleton";
import { useRouter } from "next/navigation";
import { useLocale } from "@/providers/localeProvider";
import { ThemeText } from "../common/ThemeText";
import { Lists } from "@/types/patchwork";

type TLists = {
  data: Lists[];
  loading?: boolean;
};

const MyLists = ({ data, loading = false }: TLists) => {
  const router = useRouter();
  const modifiedLists = data?.slice(0, 10);
  const {t} = useLocale()

  if (!loading && (!data || data.length === 0)) {
    return <div className="mb-18 sm:mb-16"></div>;
  }

  const handleList = (list: Lists) => {
    router.push(`/lists/${list.id}`);
  };

  const renderHeader = () => (
    <div className="mb-4 flex justify-between items-center px-4">
      <ThemeText size="lg_18" variant="textBold" className="justify-start">
        {t("my_lists")}
      </ThemeText>
      <ThemeText
        size="md_16"
        className="cursor-pointer"
        onClick={() => router.push("/lists")}
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

  const renderLists = () => (
    <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
      {modifiedLists.map((list, index) => (
        <div
          key={index}
          className={`relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 border rounded-full border-foreground px-2 py-1 ${
            index === 0 ? "ml-4!" : ""
          } ${index === modifiedLists.length - 1 ? "mr-4" : ""}`}
          onClick={() => {
            handleList(list);
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Menu />
            <ThemeText>{list.title}</ThemeText>
            <ChevronRight className="w-4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-8 mb-22 sm:mb-16">
      {renderHeader()}
      {loading ? renderLoadingState() : renderLists()}
    </div>
  );
};

export default MyLists;
