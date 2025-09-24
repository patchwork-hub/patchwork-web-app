"use client"
import React from "react";
import { BellOff } from "lucide-react";
import { useLocale } from "@/providers/localeProvider";


const EmptyNotifications = () => {
  const {t} = useLocale()
  return (
    <div className="flex flex-col items-center justify-center p-8 h-96">
      <div className="w-16 h-16 mb-4">
        <BellOff className="w-full h-full text-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{t("notifications.empty.title")}</h2>
      <p className="text-center text-gray-400">
        {t("notifications.empty.description")}
      </p>
    </div>
  );
};

export default EmptyNotifications;
