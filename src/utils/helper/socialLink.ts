import { queryClient } from "@/providers/queryProvider";
import { Account } from "@/types/account";
import { UpdateProfilePayload } from "@/types/profile";

export const getFullSocialLink = (
  platform: string,
  username: string
): string => {
  const platformURLs: Record<string, string> = {
    X: "https://x.com/",
    Instagram: "https://instagram.com/",
    Linkedin: "https://www.linkedin.com/in/",
    Youtube: "https://www.youtube.com/@",
    Facebook: "https://www.facebook.com/",
    Reddit: "https://www.reddit.com/user/",
    TikTok: "https://www.tiktok.com/@",
    Twitch: "https://www.twitch.tv/",
    Patreon: "https://www.patreon.com/"
  };

  return platformURLs[platform]
    ? `${platformURLs[platform]}${username}`
    : username;
};

export const extractUserName = (url: string | undefined): string | null => {
  const patterns: Record<string, RegExp> = {
    X: /https?:\/\/x\.com\/([^/?]+)/,
    Instagram: /https?:\/\/instagram\.com\/([^/?]+)/,
    Linkedin: /https?:\/\/www\.linkedin\.com\/in\/([^/?]+)/,
    Youtube: /https?:\/\/www\.youtube\.com\/@([^/?]+)/,
    Facebook: /https?:\/\/www\.facebook\.com\/([^/?]+)/,
    Reddit: /https?:\/\/www\.reddit\.com\/user\/([^/?]+)/,
    TikTok: /https?:\/\/www\.tiktok\.com\/@([^/?]+)/,
    Twitch: /https?:\/\/www\.twitch\.tv\/([^/?]+)/,
    Patreon: /https?:\/\/www\.patreon\.com\/([^/?]+)/
  };

  for (const [_, regex] of Object.entries(patterns)) {
    const match = url?.match(regex);
    if (match) return match[1];
  }

  return null;
};

export const cleanText = (htmlString: string): string => {
  if (!htmlString) return "";
  return htmlString
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<br\s*\/?>(\s*<br\s*\/?>)*/gi, "\n")
    .replace(/<\/?p>/gi, " ")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
};

export const generateFieldsAttributes = (
  userInfo: Account,
  link: string,
  username: string,
  type: "edit" | "delete"
): UpdateProfilePayload["fields_attributes"] => {
  const platforms = new Set([
    "X",
    "Instagram",
    "Linkedin",
    "Youtube",
    "Facebook",
    "Reddit",
    "TikTok",
    "Twitch",
    "Patreon"
  ]);

  const updatedFields = userInfo?.fields.map((field) => {
    if (platforms.has(field.name)) {
      let value = cleanText(field.value!) || "";

      if (type === "delete" && link === field.name) {
        value = "";
      } else if (link === field.name && username) {
        value = getFullSocialLink(field.name, username);
      }
      return { name: field.name, value };
    }

    return { name: field.name, value: cleanText(field.value) };
  });

  const missingPlatforms = Array.from(platforms).filter(
    (platform) => !userInfo.fields.some((field) => field.name === platform)
  );

  const platformDefaults = missingPlatforms.map((platform) => ({
    name: platform,
    value:
      platform === link && username ? getFullSocialLink(platform, username) : ""
  }));

  return [...updatedFields, ...platformDefaults];
};

export const addSocialLink = (
  id: string,
  socialMediaName: string,
  socialMediaUsername: string
) => {
  queryClient.setQueryData<Account>(["get_account_info",id], (oldData) => {
    if (!oldData) return oldData;

    const targetName = socialMediaName.trim();
    const usernameAfterRemovingHTMLTags = cleanText(socialMediaUsername);
    const fullURL = getFullSocialLink(
      targetName,
      usernameAfterRemovingHTMLTags
    );

    const updatedFields = oldData.fields.some(
      (field) => field.name.trim() === targetName
    )
      ? oldData.fields.map((field) =>
          field.name.trim() === targetName
            ? { ...field, value: fullURL }
            : field
        )
      : [...oldData.fields, { name: socialMediaName, value: fullURL }];

    return {
      ...oldData,
      fields: updatedFields
    };
  });
};

export const removeSocialLink = (
  id: string,
  socialMediaName: string
) => {
  queryClient.setQueryData<Account>(["get_account_info",id], (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      fields: oldData?.fields.map((field) =>
        field.name == socialMediaName ? { ...field, value: "" } : field
      )
    };
  });
};
