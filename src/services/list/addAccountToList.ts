import axiosInstance from "@/lib/http";

type AccountToListParams = {
  listId: string;
  accountIds: string;
};

export const addAccountToList = async ({
  listId,
  accountIds,
}: AccountToListParams) => {
  const response = await axiosInstance.post(
    `/api/v1/lists/${listId}/accounts`,
    {
      account_ids: [accountIds],
    }
  );
  return response.data;
};

export const removeAccountfromList = async ({
  listId,
  accountIds,
}: AccountToListParams) => {
  const response = await axiosInstance.delete(
    `/api/v1/lists/${listId}/accounts?account_ids[]=${accountIds}`
  );
  return response.data;
};
