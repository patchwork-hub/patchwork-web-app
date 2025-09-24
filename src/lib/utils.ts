import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRawText(htmlString: string) {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}

export function getExactUsername(url: string) {
  const username = url.split("/").pop();
  const domain = new URL(url).hostname;
  return username && domain
    ? `${username.includes("@") ? "" : "@"}${username}@${domain}`
    : undefined;
}

export const truncateUsername = (username: string) => {
  if (username?.length > 15) {
    return username.substring(0, 12) + "...";
  }
  return username;
};
