import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import HashtagHighlight from "../extensions/HashTagHighlight";
import { MastodonEmojiExtension } from "../extensions/MastodonEmojiExtension";
import { MentionExtension } from "../extensions/MentionExtension";
import { useCustomEmojiStore } from "../store/useCustomEmojiStore";
import { MastodonCustomEmoji } from "../tools/Emoji";
import { getCharCount } from "../utils/getCharCount";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/molecules/providers/localeProvider";

type PropsType = {
  content?: string;
  editable?: boolean;
  readOnly?: boolean;
  className?: string;
  minHeight?: string;
  placeholder?: string;
  disableMentions?: boolean;
  onPressEnter?: () => void;
  onClick?: (e: any) => void;
  maxLength?: number;
  hashtagClassName?: string;
  emojis?: MastodonCustomEmoji[];
  maxLines?: number;
  contentClassName?: string;
};

export const useTipTapEditor = ({
  content = "",
  minHeight = "",
  editable = true,
  className = "",
  hashtagClassName = "text-[#9baec8]",
  placeholder = "Start typing here...",
  disableMentions = false,
  onPressEnter,
  maxLength = 500,
  emojis = [],
  maxLines = 5,
  contentClassName = "",
  onClick,
}: PropsType) => {
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const {t} = useLocale();
  const { emojis: customEmojis = [] } = useCustomEmojiStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ history: false }),
      Link.configure({
        HTMLAttributes: {
          class: "[&:not(.hashtag)]:text-orange-500 break-all text-lilac",
        },
        openOnClick: false,
      }),
      HashtagHighlight.configure({ hashtagClassName }),
      // Conditionally include MentionExtension based on disableMentions prop
      ...(disableMentions ? [] : [MentionExtension]),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      // Add the Mastodon emoji extension
      MastodonEmojiExtension.configure({
        customEmojis: customEmojis ? [...customEmojis, ...emojis] : emojis,
        renderOnlyWhenReadonly: true, // Only render emojis in readonly mode
      }),
    ],
    editorProps: {
      attributes: {
        class: minHeight,
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === "Enter" && onPressEnter) {
            // Prevent the default Enter behavior
            event.preventDefault();
            onPressEnter();
            return true;
          }
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      if (getCharCount(content) > maxLength) {
        editor.commands.setContent(content.slice(0, maxLength));
      }
    },
    content,
    editable,
  });

  useEffect(() => {
    if (editor && content) {
      const doc = new DOMParser().parseFromString(content, "text/html");
      
      const links = doc.querySelectorAll("a");
      links.forEach((link) => {
        const href = link.getAttribute("href");
        const linkText = link.textContent?.trim();
        
        if (href && linkText && (linkText === href || linkText.startsWith("http"))) {
          try {
            const url = new URL(href);
            let cleanText = url.hostname + url.pathname + url.search + url.hash;
            if (cleanText.startsWith("www.")) {
              cleanText = cleanText.substring(4);
            }
            link.textContent = cleanText;
          } catch (e) {
            console.log(e)
          }
        }
      });
      
      const paragraphs = doc.querySelectorAll("p");
      paragraphs.forEach((p) => {
        const hasText = p.textContent?.trim() !== "";
        const hasElements = p.children.length > 0;
        const hasBreaks = p.innerHTML.includes("<br>");
        
        if (!hasText && !hasElements && !hasBreaks) {
          p.remove();
        }
      });

      const cleanedContent = doc.body.innerHTML;
      if (editor.getHTML() !== cleanedContent) {
        editor.commands.setContent(cleanedContent);
      }
    }
  }, [editor, content]);

  // Update custom emojis when they change
  useEffect(() => {
    if (editor) {
      editor.view.updateState(editor.state);
    }
  }, [editor, customEmojis]);

  // Check if content exceeds max lines
  useEffect(() => {
    if (editor && !editable) {
      // Need to wait for the editor to render
      setTimeout(() => {
        const editorElement = editorRef.current;
        if (editorElement) {
          const textLines =
            editorElement.clientHeight /
            parseFloat(getComputedStyle(editorElement).lineHeight);

          // Set collapse state if lines exceed maxLines
          setShouldCollapse(textLines > maxLines);
        }
      }, 0);
    }
  }, [editor, maxLines, editable]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const editorjsx = editor ? (
    <div className={className}>
      <EditorContent
        ref={editorRef}
        onClick={onClick}
        editor={editor}
        style={{
          maxHeight:
            !expanded && shouldCollapse && !editable
              ? `calc(1.5em * ${maxLines} - 1em)`
              : "unset",
        }}
        className={cn(
          "[&_*]:focus:outline-none [&_*]:focus:border-0 overflow-hidden text-foreground [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-8 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-8 [&_li]:mb-2",
          contentClassName
        )}
      />

      {shouldCollapse && !editable && !expanded && (
        <div className="mt-2">
          <button
            onClick={toggleExpand}
            className="text-orange-500 text-sm font-medium read-more cursor-pointer"
          >
            {t("common.see_more")}
          </button>
        </div>
      )}
    </div>
  ) : null;

  return { editor, editorjsx };
};
