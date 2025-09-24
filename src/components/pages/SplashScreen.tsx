"use client";
import { PatchworkWhiteLogo } from "@/components/atoms/icons/patchwork-white-logo";
import { Button } from "@/components/atoms/ui/button";
import { useLocale } from "@/components/molecules/providers/localeProvider";
// import HorizontalScrollCards from "@/components/splash/HorizontalScrollCards";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const SplashScreen = () => {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <section className="h-screen w-full flex flex-col justify-center space-y-8 py-4 overflow-hidden bg-orange-900 text-white">
      <div className="flex flex-col items-center gap-2 px-4">
        <PatchworkWhiteLogo />
        <h4 className="font-bold text-3xl sm:text-4xl mb-2">Patchwork</h4>
      </div>
      <div className="max-w-[400px] text-center mx-auto px-4">
        <h3 className="font-bold uppercase">
          <span className="text-2xl">W</span>
          <span className="text-xl">elcome</span>
          <span className="text-2xl">!</span>
        </h3>
        {/* <p className="text-base">{t("invitation.message")}</p> */}
      </div>

      {/* <div className="mt-auto">
        <HorizontalScrollCards />
      </div> */}

      <div className="px-4">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={() => router.push("/auth/sign-up")}
            className={cn(
              "w-full max-w-xs bg-mome-orange font-bold text-base rounded-md py-2 cursor-pointer hover:opacity-90"
            )}
          >
            {t("login.create_account")}
          </button>
        </div>
        <div className="flex justify-center items-center gap-2 mb-4">
          <p className="text-white">{t("login.have_account")}</p>
          <Button
            variant="outline"
            onClick={() => router.push("/auth/sign-in")}
            className={cn(
              "hover:opacity-80 border-white rounded-3xl text-white shadow-xs hover:text-white"
            )}
          >
            {t("login.sign_in")}
          </Button>
        </div>
        <div className="text-center">
          <Link href="/home" className="underline underline-offset-3">
            Guest view
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center justify-between px-10">
        <p></p>
        <p className="text-white text-center text-xs sm:text-sm">
          <a
            href="https://www.newsmastfoundation.org/terms-conditions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("setting.terms_and_conditions")}
          </a>
          ,{" "}
          <a
            href="https://mo-me.social/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("setting.privacy_policy")}
          </a>
        </p>
      </div>
    </section>
  );
};

export default SplashScreen;
