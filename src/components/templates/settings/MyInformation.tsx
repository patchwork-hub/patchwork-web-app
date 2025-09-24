"use client";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import {
  useGetNewsmastAccountDetail,
  useVerifyAuthToken,
} from "@/hooks/queries/useVerifyAuthToken.query";
import { useActiveDomainStore } from "@/store/auth/activeDomain";
import { useAuthStore } from "@/store/auth/authStore";
import { PATCHWORK_INSTANCE } from "@/utils/constant";
import { ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const MyInformation = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {t} = useLocale()

  const { data: userInfo } = useVerifyAuthToken({ enabled: true });
  const { userOriginInstance } = useAuthStore();
  const { domain_name } = useActiveDomainStore();
  const { data: newsmastAccountInfo, isLoading } = useGetNewsmastAccountDetail({
    domain_name: domain_name,
    options: {
      enabled: userOriginInstance !== PATCHWORK_INSTANCE,
    },
  });
  return (
    <div className="space-y-8">
      <div
        className="flex justify-between w-full cursor-pointer"
        onClick={() => {
          startTransition(() => {
            router.push("/settings/info/change-email");
            localStorage.setItem(
              "oldEmail",
              userOriginInstance !== PATCHWORK_INSTANCE
                ? newsmastAccountInfo?.email!
                : userInfo?.source?.email!
            );
          });
        }}
      >
        <div className="flex gap-2 items-center">
          <Mail />
          <p>{t("login.email")}</p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="text-orange-500">
            {userOriginInstance !== PATCHWORK_INSTANCE
              ? newsmastAccountInfo?.email
              : userInfo?.source?.email || "None"}
          </p>
          <ChevronRight />
        </div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex gap-2 items-center">
          <Phone />
          <p>{t("login.phone_number")}</p>
        </div>

        <div className="flex gap-2 items-center">
          <div>
            {userOriginInstance !== PATCHWORK_INSTANCE
              ? newsmastAccountInfo?.phone
              : userInfo?.source?.phone || "None"}
          </div>
          <ChevronRight />
        </div>
      </div>
    </div>
  );
};

export default MyInformation;
