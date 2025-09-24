import { Account, Status } from "./status";

type NotificationType =
  | "mention"
  | "status"
  | "reblog"
  | "favourite"
  | "follow"
  | "poll"
  | "update"
  | "admin.report";

export type Notification = {
  id: string;
  type: NotificationType;
  group_key: string;
  status: Status;
  account: Account;
  created_at: string;
  report: {
    id: number;
    comment: string;
    target_account: Account;
  };
};
export type NotificationMarker = {
  notifications: {
    last_read_id: string;
    version: number;
    updated_at: string;
  };
};
export type NotificationGroup = {
  group_key: string;
  notifications_count: number;
  type: NotificationType;
  most_recent_notification_id: string;
  sample_account_ids: string[];
  status_id?: string;
  page_min_id?: string;
  page_max_id?: string;
  latest_page_notification_at?: string;
};

export type GroupedNotificationResults = {
  accounts: Account[];
  statuses?: Status[];
  notification_groups: NotificationGroup[];
};

export type PaginatedResponse<T> = {
  data: T;
  nextMaxId: string;
};
