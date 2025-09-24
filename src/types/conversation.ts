import { Account, Status } from "./status";

export type Conversation = {
    id: string;
    unread: boolean;
    accounts: Account[];
    last_status: Status;
}

export type NotificationRequest  = {
    id: string;
    created_at: string;
    updated_at: string;
    notifications_count: string;
    account: Account;
    last_status: Status;
}