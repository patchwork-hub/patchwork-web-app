import {
  FacebookIcon,
  YoutubeIcon,
  InstagramIcon,
  LinkedinIcon,
  RedditIcon,
  TwitterXIcon,
  TikTokIcon,
  TwitchIcon,
  PatreonIcon
} from "@/components/atoms/icons/Icons";
import { JSX } from "react";
import Cookies from "js-cookie";

export const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://patchwork.io";
export const DEFAULT_DASHBOARD_API_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_API_URL || "https://dashboard.channel.org";
export const STAGING_DASHBOARD_API_URL =
  process.env.NEXT_PUBLIC_STAGING_DASHBOARD_API_URL || "https://staging-dashboard.patchwork.online";

export const MOME_INSTANCE = "https://mo-me.social";
export const PATCHWORK_INSTANCE = "https://patchwork.io";
export const CHANNEL_ORG_INSTANCE = "https://channel.org";
export const MASTODON_INSTANCE = "https://mastodon.social";

export const isDevelopment = process.env.NODE_ENV === 'development';
export const userOriginInstanceDomain = Cookies.get("domain") ?? MOME_INSTANCE;

export const DEFAULT_REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_REDIRECT_URI ||
      "http://localhost:3000/auth/sign-in"
    : process.env.NEXT_PUBLIC_REDIRECT_URI || // TODO: add redirect_uri for production [https://web.channel.org/auth/sign-in]
      "https://staging-web.channel.org/auth/sign-in";

export const SOCIAL_MEDIA_LINKS = [
  { icon: <TwitterXIcon />, title: "X" },
  { icon: <FacebookIcon />, title: "Facebook" },
  { icon: <InstagramIcon />, title: "Instagram" },
  { icon: <LinkedinIcon />, title: "Linkedin" },
  { icon: <RedditIcon />, title: "Reddit" },
  { icon: <YoutubeIcon />, title: "Youtube" },
  { icon: <TikTokIcon />, title: "TikTok" },
  { icon: <TwitchIcon />, title: "Twitch" },
  { icon: <PatreonIcon />, title: "Patreon" }
];

export const Icons: Record<string, JSX.Element> = {
  Twitter: <TwitterXIcon />,
  X: <TwitterXIcon />,
  Facebook: <FacebookIcon />,
  Instagram: <InstagramIcon />,
  Linkedin: <LinkedinIcon />,
  Reddit: <RedditIcon />,
  Youtube: <YoutubeIcon />,
  TikTok: <TikTokIcon />,
  Twitch: <TwitchIcon />,
  Patreon: <PatreonIcon />
};

export const MANDATORY_BIO =
  "This Channel is curated by a human and distributed automatically. See home.channel.org/about. Questions about content? DM me! Report Community Guideline violations to the Channel.org server.";
