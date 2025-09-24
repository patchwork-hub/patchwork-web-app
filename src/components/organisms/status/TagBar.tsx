import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type TagBarProps = {
  content?: string;
  marginLeft?: boolean;
};

const extractHashtags = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = doc.querySelectorAll("a.mention.hashtag");
  return Array.from(links).map((link) => ({
    name: link.textContent?.replace("#", "") || "",
    url: link.getAttribute("href") || "",
  }));
};

const TagBar: React.FC<TagBarProps> = ({ content, marginLeft = false }) => {
  if (!content) return null;

  const hashtags = extractHashtags(content);
  if (hashtags.length === 0) return null;

  return (
    <div className={cn("px-4 my-3", { "ml-12": marginLeft })}>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag, index) => (
          <Link
            href={tag.url}
            className={cn(
              "rounded-md text-white bg-green-700 px-2 py-1",
              "hover:opacity-80 transition-colors duration-200",
              "text-sm font-medium"
            )}
            key={index}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagBar;
