import { StatusParams } from "./draft";
import { Media } from "./status";

export type Schedule = {
    id: string;
    scheduled_at: string;
    params: StatusParams;
    media_attachments: Media[];
};