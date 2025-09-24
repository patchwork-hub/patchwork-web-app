"use client";
import Header from "@/components/atoms/common/Header";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { BookmarkList } from "@/components/organisms/status/BookmarkList";
import React from "react";

const BookmarksPage = () => {
  const {t} = useLocale()

  return (
    <div className="mb-16">
      <Header title={t("screen.bookmarks")} />
      <BookmarkList />
    </div>
  );
};

export default BookmarksPage;
