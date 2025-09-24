import { StatusComposeFormData, Visibility } from "@/components/organisms/compose/types";
import { Media } from "./status";

export type DraftStatusesResponse = {
    date: string;
    datas: DraftStatusItem[];
} []

export type DraftStatusItem = {
    id: string;
    params: StatusParams;
    media_attachments: Media[];
}

export type StatusParams = {
    poll: null | StatusComposeFormData['poll'];
    text: string;
    drafted: boolean;
    language: string;
    media_ids: string[];
    sensitive: boolean;
    text_count: number;
    visibility: Visibility;
    idempotency: any;
    scheduled_at: null | string;
    spoiler_text: string;
    community_ids: null | string[];
    application_id: number;
    in_reply_to_id: null | string;
    is_rss_content: boolean;
    is_meta_preview: boolean;
    with_rate_limit: boolean;
    allowed_mentions: any;
    is_only_for_followers: boolean;
}

export type DraftComposeFormData = Pick<
    StatusComposeFormData,
    | 'in_reply_to_id'
    | 'language'
    | 'media_ids'
    | 'poll'
    | 'status'
    | 'visibility'
    | 'sensitive'
> & {
    drafted: boolean;
}