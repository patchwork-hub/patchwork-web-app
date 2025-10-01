"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

type PostContentProps = {
  content: string;
}

const decodeHtml = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.documentElement.textContent || html;
};

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  const decodedContent = decodeHtml(content);

  const editor: Editor | null = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        HTMLAttributes: {
          class: "text-orange-500 hover:underline",
          target: "_blank",
          rel: "nofollow noopener noreferrer",
        },
      }),
    ],
    content: decodedContent,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const html = decodedContent
        .replace(/(#[a-zA-Z0-9]+)/g, '<span class="text-primary-red">$1</span>')
        .replace(
          /(@[a-zA-Z0-9]+)/g,
          '<span class="text-primary-red">$1</span>'
        );
      editor.commands.setContent(html);
    }
  }, [editor, decodedContent]);

  return (
    <div className="p-4">
      <EditorContent editor={editor} />
    </div>
  );
};

export default PostContent;
