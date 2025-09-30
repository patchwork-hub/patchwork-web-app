"use client";
import { useGetSuggestedPeople } from "@/hooks/queries/search/useFetchSuggestion";
import PeopleToFollowView from "./PeopleToFollowView";
import { Account } from "@/types/account";
import { StatusList } from "../status/StatusList";
import { Status } from "@/types/status";
import { cn } from "@/lib/utils";

type SuggestedPeopleBySearchProps = {
  searchData: Account[];
  statusData?: Status[];
  checkNoResults: boolean;
}

const SuggestedPeopleBySearch: React.FC<SuggestedPeopleBySearchProps> = ({
  searchData,
  statusData,
  checkNoResults
}) => {
  const { data } = useGetSuggestedPeople({ limit: 10 });

  const suggestedPeople = data?.map((people) => people.account);

  return (
    <>
      <PeopleToFollowView
        data={searchData ? searchData : suggestedPeople || []}
        checkNoResults={checkNoResults}
      />
      <StatusList
        className={cn(
          statusData &&
            statusData.length > 0 &&
            "mt-4 border-t-[0.5px] border-gray-400"
        )}
        statusList={statusData as unknown as Status[]}
      />
    </>
  );
};

export default SuggestedPeopleBySearch;
