import axiosInstance from "@/lib/http";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type SuggestedPeople = {
  source: string;
  account: Account;
};
export type GetSuggestedPeopleQueryKey = [
  "suggested-people",
  { limit: number }
];

export const getSuggestedPeople = async (
  qfContext: QueryFunctionContext<GetSuggestedPeopleQueryKey>
) => {
  const { limit } = qfContext.queryKey[1];
  const resp: AxiosResponse<SuggestedPeople[]> = await axiosInstance.get(
    `/api/v2/suggestions`,
    {
      params: { limit }
    }
  );
  return resp.data;
};
