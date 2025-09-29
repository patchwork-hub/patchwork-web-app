"use client"

import Header from "@/components/molecules/common/Header";
import LayoutContainer from "@/components/templates/LayoutContainer";
import { useLocale } from "@/providers/localeProvider";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const {t} = useLocale();
  return (
    <LayoutContainer>
      <Header title={t("list.create_list")} />
      {children}
    </LayoutContainer>
  );
};

export default Layout;
