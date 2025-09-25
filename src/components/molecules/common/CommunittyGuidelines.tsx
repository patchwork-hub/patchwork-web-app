"use client";
import React from "react";
import { ThemeText } from "./ThemeText";
import { useLocale } from "@/components/molecules/providers/localeProvider";

type Props = {
  channelAbout: {
    rules?: { text: string }[];
    attributes?: {
      patchwork_community_rules?: string[] | string;
    };
  } | null;
};

const ChannelGuidelines: React.FC<Props> = ({ channelAbout }) => {
  const { t } = useLocale();
  if (
    !channelAbout ||
    channelAbout?.rules?.length === 0 ||
    channelAbout?.attributes?.patchwork_community_rules?.length === 0
  )
    return <></>;
  return (
    <>
      <div className="flex flex-col items-start px-4">
        <ThemeText className="text-start text-[15px]" variant="textBold">
          {t("channel.channel_guidelines")}
        </ThemeText>
        <div>
          {channelAbout &&
            ((channelAbout?.rules?.length ?? 0) > 0 ||
            (channelAbout?.attributes?.patchwork_community_rules?.length ?? 0) >
              0 ? (
              (channelAbout?.rules?.length ?? 0) > 0 ? (
                channelAbout.rules?.map(
                  (item: { text: string }, idx: number) => (
                    <div className="flex items-center gap-2 my-2" key={idx}>
                      <ThemeText className="text-bold text-white bg-orange-500 w-6 h-6 rounded-full px-2.5 py-1">
                        {idx + 1}
                      </ThemeText>
                      <ThemeText>{item.text}</ThemeText>
                    </div>
                  )
                )
              ) : Array.isArray(
                  channelAbout.attributes?.patchwork_community_rules
                ) ? (
                channelAbout.attributes.patchwork_community_rules.map(
                  (rule: string, idx: number) => (
                    <div className="flex items-center gap-2 my-2" key={idx}>
                      <ThemeText className="text-bold text-white bg-orange-500 rounded-full px-2.5 py-1">
                        {idx + 1}
                      </ThemeText>
                      <ThemeText>{rule}</ThemeText>
                    </div>
                  )
                )
              ) : (
                <ThemeText className="mb-4">
                  {channelAbout.attributes?.patchwork_community_rules}
                </ThemeText>
              )
            ) : (
              <ThemeText className="mb-4">No guidelines available.</ThemeText>
            ))}
        </div>
      </div>
      <p className="w-full bg-gray-/600 h-px"></p>
    </>
  );
};

export default ChannelGuidelines;
