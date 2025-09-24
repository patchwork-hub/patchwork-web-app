export type ListsQueryKey = ["lists"];

export type SingleListQueryKey = [
  "single-list",
  { id: number | string; domain_name: string }
];

export type AccountInListQueryKey = [
  "accounts-in-list",
  { id: number | string; domain_name: string }
];

export type CreateListPayload = {
  title: string;
  exclusive: boolean;
  replies_policy: string;
};

export type CreateListResponse = {
  id: number | string;
  title: string;
  exclusive: boolean;
  replies_policy: string;
};
