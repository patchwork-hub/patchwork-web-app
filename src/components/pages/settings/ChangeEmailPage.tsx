"use client"
import React from "react";
import Header from "@/components/molecules/common/Header";
import ChangeEmailForm from "@/components/templates/settings/ChangeEmailForm";
import { useLocale } from "@/providers/localeProvider";

const ChangeEmailPage: React.FC = () => {
  const {t} = useLocale();
  return (
    <div>
      <Header title={t("screen.change_email")} />
      <div className="w-full px-8 pt-12">
        <ChangeEmailForm />
      </div>
    </div>
  );
};

export default ChangeEmailPage;
