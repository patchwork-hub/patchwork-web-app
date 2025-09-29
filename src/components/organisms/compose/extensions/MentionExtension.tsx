import Mention from '@tiptap/extension-mention';
import { Editor } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance, Props } from 'tippy.js';
import { Account } from '@/types/status';
import { debounce } from 'lodash';
import { searchAccounts } from '@/services/status/account';
import Image from 'next/image';

// Mention Suggestion Component
type MentionSuggestionProps = {
    query: string
    editor: Editor
    range: { from: number; to: number }
    items: Account[]
    isFetching: boolean
}

const MentionSuggestion: React.FC<MentionSuggestionProps> = ({ editor, range, items, isFetching }) => {
    return !isFetching && items.length === 0 ? null : (
        <div className="bg-gray-800 text-white p-2 rounded shadow max-h-[400px] overflow-auto">
            {isFetching ? (
                <div>
                    <MentionSkeleton />
                    <MentionSkeleton />
                    <MentionSkeleton />
                </div>
            ) : (
                items.map(account => (
                    <div
                        key={account.id}
                        className="p-1 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => {
                            editor
                                .chain()
                                .focus()
                                .deleteRange(range)
                                .insertContent({
                                    type: 'mention',
                                    attrs: { label: `@${account.acct}`, class: 'text-orange-500' }
                                })
                                .run()
                        }}
                    >
                        <Image src={account.avatar} alt={account.username} className="w-6 h-6 rounded-[8px] mr-2" />
                        <div>
                            <div className="font-bold">{account.username}</div>
                            <div className="text-sm text-gray-400">@{account.acct}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

const debouncedSearchAccounts = debounce(async (query: string, callback: (data: Account[]) => void) => {
    const data = await searchAccounts(query);
    callback(data);
}, 300);

interface TiptapSuggestionProps {
    query: string;
    editor: Editor;
    range: { from: number; to: number };
    clientRect?: (() => DOMRect | null) | null;
    command: (props: { editor: Editor; range: { from: number; to: number }; attrs: Record<string, unknown> }) => void;
}

const suggestion = {
    items: async () => {
        return [];
    },

    render: () => {
        let component: ReactRenderer | null = null;
        let popup: Instance<Props>[] | null = null;

        return {

            onStart: (props: TiptapSuggestionProps) => {
                const { query } = props;
                debouncedSearchAccounts(query, (data) => {
                    if (!component) {
                        component = new ReactRenderer(MentionSuggestion, {
                            props: { ...props, items: data, isFetching: true },
                            editor: props.editor,
                        });
                    } else {
                        component.updateProps({ ...props, items: data, isFetching: false });
                    }

                     if (!popup) {
                        popup = tippy('body', {
                            getReferenceClientRect: () => {
                                const rect = props.clientRect?.();
                                return rect || new DOMRect(0, 0, 0, 0);
                            },
                            appendTo: () => document.body,
                            content: component.element,
                            showOnCreate: true,
                            interactive: true,
                            trigger: 'manual',
                            placement: 'bottom-start',
                            popperOptions: {
                                strategy: 'fixed'
                            }
                        });
                    } else {
                        popup[0].setContent(component.element);
                    }
                });
            },

            onUpdate: (props: TiptapSuggestionProps) => {
                const { query } = props;
                debouncedSearchAccounts(query, (data) => {
                    if (component) {
                        component.updateProps({ ...props, items: data, isFetching: false });
                    }
                    if (popup && popup[0]) {
                        popup[0].setProps({
                            getReferenceClientRect: () => {
                                const rect = props.clientRect?.();
                                return rect || new DOMRect(0, 0, 0, 0);
                            },
                        });
                    }
                });
            },

            onKeyDown(props: { event: KeyboardEvent }) {
                if (props.event.key === 'Escape' && popup && popup[0]) {
                    popup[0].hide();
                    return true;
                }
                return false;
            },

            onExit: () => {
                // Ensure popup exists and hasn’t been destroyed
                if (popup && popup[0] && !popup[0].state.isDestroyed) {
                    popup[0].destroy();
                    popup = null; // Clear reference
                }
                // Ensure component exists and hasn’t been destroyed
                if (component && typeof component.destroy === 'function') {
                    component.destroy();
                    component = null; // Clear reference
                }
            },
        };
    },
};

const MentionSkeleton = () => (
    <div className="animate-pulse flex gap-2 items-center">
        <div className="w-6 h-6 bg-gray-700 rounded-[8px] aspect-square"></div>
        <div className='flex flex-col gap-1'>
            <div className="min-w-[200px] h-4 bg-gray-700 rounded mb-2"></div>
            <div className="min-w-[200px] h-4 bg-gray-700 rounded mb-2"></div>
        </div>
    </div>
)

export const MentionExtension = Mention.configure({
    HTMLAttributes: { class: 'text-orange-500' },
    suggestion,
    renderText: ({ node }) => node.attrs.label,
    renderHTML: ({ node }) => node.attrs.label
});