"use client"
import Header from "@/components/molecules/common/Header";
import { useLocale } from "@/providers/localeProvider";
import MyInformation from "@/components/templates/settings/MyInformation";
import React from "react";

const MyInformationPage: React.FC = () => {
  const{t}=useLocale()
  return (
    <>
      <Header title={t("screen.my_information")} />
      <div className="flex min-h-svh flex-col items-start justify-start gap-6 p-4 md:p-10">
        <div className="w-full flex flex-col gap-6">
          <MyInformation />
        </div>
      </div>
    </>
  );
};

export default MyInformationPage;
