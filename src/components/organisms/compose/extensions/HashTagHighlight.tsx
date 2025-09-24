import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

const HashtagHighlight = Extension.create({
  name: 'hashtagHighlight',
  addOptions() {
    return {
      hashtagClassName: 'text-[#9baec8]', // Default class
    };
  },
  addProseMirrorPlugins() {
    const { hashtagClassName } = this.options; // Access options here
    return [
      new Plugin({
        key: new PluginKey('hashtagHighlight'),
        props: {
          decorations(state) {
            const decorations = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || '';
                const regex = /\s*#(\w+)\s*/g;
                let match;

                // Skip decoration if the text node has a link mark
                const hasLinkMark = node.marks && node.marks.some(mark => mark.type.name === 'link');
                if (hasLinkMark) return;

                while ((match = regex.exec(text)) !== null) {
                  const startIndex = pos + match.index + match[0].indexOf('#');
                  const endIndex = startIndex + match[0].trim().length;

                  const decoration = Decoration.inline(startIndex, endIndex, {
                    class: `${hashtagClassName} hashtag`,
                  });
                  decorations.push(decoration);
                }
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
        appendTransaction: (transactions, oldState, newState) => {
          const tr = newState.tr;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (node.isText && node.marks) {
              const linkMark = node.marks.find(mark => mark.type.name === 'link');
              if (linkMark && linkMark.attrs.href) {
                const href = linkMark.attrs.href;
                const hashtagMatch = href.match(/\/tags\/([^\/?#]+)/i);
                if (hashtagMatch) {
                  const hashtag = hashtagMatch[1];
                  tr.removeMark(pos, pos + node.nodeSize, linkMark.type);
                  tr.addMark(pos, pos + node.nodeSize, newState.schema.marks.link.create({
                    href: `/hashtags/${hashtag}`,
                    rel: 'tag',
                    class: `${hashtagClassName} break-all mention hashtag`,
                    target: null,
                  }));
                  modified = true;
                }
              }
            }
          });

          return modified ? tr : null;
        },
        priority: 1000,
      }),
    ];
  },
});

export default HashtagHighlight;