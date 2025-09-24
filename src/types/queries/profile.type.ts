export type AccountInfoQueryParam = {
  id: string;
  domain_name: string;
};

export type AccountInfoQueryKey = ["get_account_info", AccountInfoQueryParam];

export type CheckRelationshipQueryParam = {
  accountIds: string[];
};

export type CheckRelationshipQueryKey = [
  "check-relationship-to-other-accounts",
  CheckRelationshipQueryParam
];