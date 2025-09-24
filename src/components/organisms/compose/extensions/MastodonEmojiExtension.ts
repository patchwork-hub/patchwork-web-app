import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { MastodonCustomEmoji } from '../tools/Emoji';


export type MastodonEmojiOptions = {
    customEmojis: MastodonCustomEmoji[];
    renderOnlyWhenReadonly: boolean;
};

export const MastodonEmojiExtension = Extension.create<MastodonEmojiOptions>({
    name: 'mastodonEmoji',

    addOptions() {
        return {
            customEmojis: [],
            renderOnlyWhenReadonly: true,
        };
    },

    addProseMirrorPlugins() {
        const { customEmojis, renderOnlyWhenReadonly } = this.options;
        const editor = this.editor;

        return [
            new Plugin({
                key: new PluginKey('mastodonEmoji'),
                props: {
                    decorations(state) {
                        // Skip rendering if we're in editable mode and the renderOnlyWhenReadonly option is true
                        if (renderOnlyWhenReadonly && editor.isEditable) {
                            return DecorationSet.empty;
                        }

                        const { doc } = state;
                        const decorations: Decoration[] = [];

                        // The regex pattern to match :emoji: syntax
                        const emojiPattern = /:([a-zA-Z0-9_]+):/g;

                        // Process all text nodes in the document
                        doc.descendants((node, pos) => {
                            if (node.isText) {
                                const text = node.text || '';
                                let match;

                                // Find all emoji patterns in the text
                                while ((match = emojiPattern.exec(text)) !== null) {
                                    const [fullMatch, shortcode] = match;
                                    const from = pos + match.index;
                                    const to = from + fullMatch.length;

                                    // Find the matching custom emoji
                                    const emoji = customEmojis.find(e => e.shortcode === shortcode);

                                    if (emoji) {
                                        // Create a decoration to replace the :emoji: with an image
                                        const decoration = Decoration.widget(from, () => {
                                            const img = document.createElement('img');
                                            img.src = emoji.url;
                                            img.alt = `:${shortcode}:`;
                                            img.title = `:${shortcode}:`;
                                            img.className = 'inline-block align-middle';
                                            img.style.height = '1.2em'; // Match the line height
                                            img.style.width = 'auto';   // Maintain aspect ratio
                                            return img;
                                        }, { side: -1 });

                                        // Create a decoration to hide the original text
                                        const hideDecoration = Decoration.inline(from, to, {
                                            style: 'display: none',
                                        });

                                        decorations.push(decoration, hideDecoration);
                                    }
                                }
                            }

                            return true;
                        });

                        return DecorationSet.create(doc, decorations);
                    },
                },
            }),
        ];
    },
});