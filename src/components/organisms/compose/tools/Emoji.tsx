import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React from 'react';
import { useCustomEmojiStore } from '../store/useCustomEmojiStore';
import { useTheme } from 'next-themes';
import { isSystemDark } from '@/utils/helper/helper';

export interface MastodonCustomEmoji {
  shortcode: string;
  url: string;
  static_url: string;
  visible_in_picker: boolean;
  category?: string;
}

interface EmojiMartEmoji {
  id: string;
  name: string;
  keywords: string[];
  imageUrl: string;
  skins: { src: string }[];
}

interface EmojiMartCategory {
  id: string;
  name: string;
  emojis: EmojiMartEmoji[];
}

type CustomEmojis = EmojiMartCategory[];

interface MastodonEmojiPickerProps {
  onEmojiSelect?: (emoji: { id: string; native?: string; shortcodes: string }) => void;
}

const convertToEmojiMartCustomWithCategories = (mastodonEmojis: MastodonCustomEmoji[]): CustomEmojis => {
  if (!Array.isArray(mastodonEmojis)) {
    console.error('mastodonEmojis is not an array:', mastodonEmojis);
    return [];
  }

  const categoryMap: { [key: string]: EmojiMartEmoji[] } = {};

  mastodonEmojis
    .filter(emoji => emoji.visible_in_picker && emoji.url && typeof emoji.url === 'string')
    .forEach(emoji => {
      const category = emoji.category || 'Custom';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push({
        id: emoji.shortcode,
        name: emoji.shortcode,
        keywords: [emoji.shortcode],
        imageUrl: emoji.url,
        skins: [{ src: emoji.url }],
      });
    });

  return Object.entries(categoryMap).map(([id, emojis]) => ({
    id,
    name: id,
    emojis,
  }));
};

const MastodonEmojiPicker: React.FC<MastodonEmojiPickerProps> = ({ onEmojiSelect }) => {
  const { emojis } = useCustomEmojiStore();
  const { theme } = useTheme();
  const customEmojis: CustomEmojis = emojis ? convertToEmojiMartCustomWithCategories(emojis) : [];

  return (
    <Picker
      data={data}
      custom={customEmojis}
      onEmojiSelect={onEmojiSelect}
      theme={theme === "dark" || (theme === "system" && isSystemDark) ? 'dark' : 'light'}
    />
  );
};

export default MastodonEmojiPicker;