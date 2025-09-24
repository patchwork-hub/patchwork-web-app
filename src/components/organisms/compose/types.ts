import { Media } from "@/types/status";

export type LinkPreview = {
    url: string;
    favicon?: string;
    title: string;
    description: string;
    images?: {
        src: string;
        size?: Array<number>;
        type?: string;
    }[];
    videos?: [];
};

export type Visibility = 'public' | 'unlisted' | 'private' | 'direct';

export type StatusComposeFormData = {
    status: string;
    visibility: Visibility;
    poll?: {
        options: string[];
        multiple: boolean;
        expires_in: number;
    };
    media_ids?: string[];
    media_attributes?:Partial<Media>[]
    sensitive?: boolean;
    language: string;
    in_reply_to_id?: string;
    scheduled_at?: string;
}

export type State = {
    showPollForm: boolean;
    showLanguageModal: boolean;
    charCount: number;
};

export type Action =
    | { type: 'TOGGLE_POLL_FORM'; payload: boolean }
    | { type: 'SET_POLL'; payload: StatusComposeFormData['poll'] | undefined }
    | { type: 'TOGGLE_LANGUAGE_MODAL'; payload: boolean }
    | { type: 'SET_CHAR_COUNT'; payload: number }
    | { type: 'RESET_FORM' };


export const POLL_DURATION_OPTIONS = [
    { label: '5 minutes', value: 300 },
    { label: '30 minutes', value: 1800 },
    { label: '1 hour', value: 3600 },
    { label: '6 hours', value: 21600 },
    { label: '1 day', value: 86400 },
    { label: '3 days', value: 259200 },
    { label: '7 days', value: 604800 },
] as const;

export const POLL_LIMITS = {
    MIN_OPTIONS: 2,
    MAX_OPTIONS: 4,
    MAX_OPTION_TEXT_LENGTH: 50,
} as const;

export const POLL_TYPES = [
    { label: 'Single choice', value: false },
    { label: 'Multiple choice', value: true },
] as const;

export const POLL_INITIAL = {
    options: ['', ''],
    expires_in: POLL_DURATION_OPTIONS['4']['value'],
    multiple: POLL_TYPES['0']['value'],
};
export type PathsToStringProps<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object 
        ? `.${PathsToStringProps<T[K]> & string}` 
        : ""}`
    }[keyof T]
  : never;