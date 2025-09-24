import http from "@/lib/http";
import { NotificationRequest } from "@/types/conversation";
import {
  GroupedNotificationResults,
  Notification,
  NotificationMarker,
  PaginatedResponse,
} from "@/types/notification";
import { Account, AccountRelationship } from "@/types/status";
import { getMaxId } from "@/utils";

export const getNotificationRequests = async () => {
  const res = await http.get<NotificationRequest[]>(
    "/api/v1/notifications/requests"
  );
  return res.data;
};

export const getNotificationMarker = async () => {
  const res = await http.get<NotificationMarker>(
    "/api/v1/markers?timeline[]=notifications"
  );
  return res.data;
};

export const acceptNotificationRequest = async (id: string) => {
  const res = await http.post(`/api/v1/notifications/requests/${id}/accept`);
  return res.data;
};

export const dismissNotificationRequest = async (id: string) => {
  const res = await http.post(`/api/v1/notifications/requests/${id}/dismiss`);
  return res.data;
};

export const saveLastReadIdNotification = async (id: string) => {
  const formData = new FormData();
  formData.append("notifications[last_read_id]", id);

  const res = await http.post(`/api/v1/markers`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getNotifications = async (pageParam: any) => {
  const res = await http.get<Notification[]>("/api/v1/notifications", {
    params: {
      types: ["favourite", "reblog", "follow"],
      exclude_types: ["follow_request"],
      max_id: pageParam,
    },
  });

  return {
    data: res.data,
    nextMaxId: getMaxId(res.headers["link"]),
  } as PaginatedResponse<Notification[]>;
};

export const getMentionNotifications = async (pageParam: any) => {
  const res = await http.get<Notification[]>("/api/v1/notifications", {
    params: {
      grouped_types: ["favourite", "reblog", "follow"],
      exclude_types: [
        "follow",
        "follow_request",
        "favourite",
        "reblog",
        "poll",
        "status",
        "update",
        "admin.sign_up",
        "admin.report",
        "moderation_warning",
        "severed_relationships",
        "annual_report",
      ],
      max_id: pageParam,
    },
  });

  return {
    data: res.data,
    nextMaxId: getMaxId(res.headers["link"]),
  } as PaginatedResponse<Notification[]>;
};

export const getGroupedNotifications = async (pageParam: any) => {
  const res = await http.get<GroupedNotificationResults>(
    "/api/v2/notifications",
    {
      params: {
        grouped_types: ["favourite", "reblog", "follow"],
        exclude_types: ["follow_request"],
        max_id: pageParam,
      },
    }
  );

  return {
    data: res.data,
    nextMaxId: getMaxId(res.headers["link"]),
  } as PaginatedResponse<GroupedNotificationResults>;
};

export const getFollowRequestNotifications = async (pageParam: any) => {
  const res = await http.get<Account[]>("/api/v1/follow_requests", {
    params: {
      max_id: pageParam,
    },
  });

  return {
    data: res.data,
    nextMaxId: getMaxId(res.headers["link"]),
  } as PaginatedResponse<Account[]>;
};

export const acceptFollowRequest = async (id: string) => {
  const res = await http.post<AccountRelationship>(
    `/api/v1/follow_requests/${id}/authorize`
  );
  return res.data;
};

export const rejectFollowRequest = async (id: string) => {
  const res = await http.post<AccountRelationship>(
    `/api/v1/follow_requests/${id}/reject`
  );
  return res.data;
};

export const getMuteStatus = async () => {
  const res = await http.get<{ mute: boolean }>(
    "/api/v1/notification_tokens/get_mute_status"
  );
  return res.data;
};

export const getEmailStatus = async () => {
  const res = await http.get<{ data: boolean }>(
    "/api/v1/patchwork/email_settings"
  );
  return res.data;
};

export const muteNotifications = async (mute: boolean) => {
  const res = await http.post<{ mute: boolean }>(
    "/api/v1/notification_tokens/update_mute",
    { mute }
  );
  return res.data;
};

export const emailNotifications = async (allow: boolean) => {
  const res = await http.post<{ message: string }>(
    `/api/v1/patchwork/email_settings/notification?allowed=${allow}`
  );
  return res.data;
};
