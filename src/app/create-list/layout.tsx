"use client"
import Header from "@/components/atoms/common/Header";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import LayoutContainer from "@/components/templates/LayoutContainer";
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
