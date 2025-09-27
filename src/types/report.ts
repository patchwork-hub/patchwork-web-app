import { Field } from "./status";

export const reportTypes = ["spam", "legal", "violation", "other"] as const;

export type ReportType = typeof reportTypes[number];

export type ReportOption = {
    title: string;
    description: string;
}

export const reportOptions: Record<ReportType, ReportOption> = {
    spam: {
        title: "It's spam",
        description: "Malicious links, fake engagement, or repetitive replies"
    },
    legal: {
        title: "It's illegal",
        description: "You believe it violates the law of your or the server's country"
    },
    violation: {
        title: "It violates server rules",
        description: "You are aware that it breaks specific rules"
    },
    other: {
        title: "It's something else",
        description: "The issue does not fit into other categories",
    }
}

export type Rule = {
    id: string;
    text: string;
}

export type Report = {
    id: string;
    action_taken: boolean;
    action_taken_at: string;
    category: string;
    comment: string;
    forwarded: boolean;
    created_at: string;
    status_ids: string[];
    rule_ids: string[];
    target_account: TargetAccount;
}

export type TargetAccount = {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    locked: boolean;
    bot: boolean;
    discoverable: boolean;
    group: boolean;
    created_at: string;
    note: string;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    last_status_at: string;
    emojis: unknown[];
    fields: Field[];
}