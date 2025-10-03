import {
  getSuggestedPeople,
  GetSuggestedPeopleQueryKey,
  SuggestedPeople
} from "@/services/search/fetchSuggestion";
import { QueryOptionHelper } from "@/utils/helper/helper";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

export const useGetSuggestedPeople = ({
  options,
  ...queryParam
}: GetSuggestedPeopleQueryKey[1] & {
  options?: QueryOptionHelper<SuggestedPeople[] | undefined>;
}) => {
  const queryKey: GetSuggestedPeopleQueryKey = ["suggested-people", queryParam];

  return useQuery({
    queryKey,
    queryFn: (context) => getSuggestedPeople(context as QueryFunctionContext<GetSuggestedPeopleQueryKey>),
    ...options
  });
};