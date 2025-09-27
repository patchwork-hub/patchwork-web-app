import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useVotePoll } from "@/hooks/mutations/status/useVotePoll";
import type { Poll, Status } from "@/types/status";
import { Button } from "@/components/atoms/ui/button";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/ui/radio-group";
import { Label } from "@/components/atoms/ui/label";
import { CircleCheck, RefreshCcw } from "lucide-react";
import { useGetPoll } from "@/hooks/queries/poll/getPoll";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { StatusListResponse } from "@/services/status/fetchAccountStatuses";
import { motion } from "framer-motion";
import { useLocale } from "@/providers/localeProvider";

type PollProps = {
  poll: Poll;
};

const Poll: React.FC<PollProps> = ({ poll }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    poll.own_votes ?? []
  );
  const {t} = useLocale();
  const [showResults, setShowResults] = useState<boolean>(poll?.voted ?? false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const votePollMutation = useVotePoll();

  const {
    data: refreshedPollData,
    refetch,
    isRefetching,
  } = useGetPoll(poll.id);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (refreshedPollData) {
      queryClient.setQueriesData(
        { queryKey: ["statusList"] },
        getPollStatusListUpdaterFn(refreshedPollData)
      );
    }
  }, [refreshedPollData, queryClient]);

  useEffect(() => {
    if (poll.expires_at) {
      const now = dayjs();
      const expiresAt = dayjs(poll.expires_at);
      const distance = expiresAt.diff(now);

      if (distance <= 0) {
        setTimeLeft("Expired");
      } else {
        const hours = expiresAt.diff(now, "hour");
        const minutes = expiresAt.diff(now, "minute") % 60;
        const seconds = expiresAt.diff(now, "second") % 60;
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }
  }, [poll.expires_at]);

  const handleVote = (choices: number[]) => {
    votePollMutation.mutate({ id: poll.id, choices });
    setShowResults(true);
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setSelectedOptions((prev) =>
      checked ? [...prev, index] : prev.filter((i) => i !== index)
    );
  };

  const handleRadioChange = (value: string) => {
    setSelectedOptions([Number(value)]);
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length > 0) handleVote(selectedOptions);
  };

  const handleRefresh = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["status"] });
  };

  return (
    <div className={cn("mt-2", { "opacity-90": isRefetching })}>
      {showResults ? (
        poll.options.map((option, index) => {
          const percentage =
            poll.votes_count && poll.voters_count
              ? (option.votes_count / poll.voters_count) * 100
              : 0;
          return (
            <div key={index}>
              <div className="relative flex justify-between text-left py-2 px-4 mb-2 rounded-lg overflow-hidden text-white bg-tab">
                <span className="z-10 flex gap-4 items-center">
                  {option.title}
                  {poll.voted && poll.own_votes.includes(index) && (
                    <CircleCheck className="w-4 h-4" />
                  )}
                </span>
                <motion.div
                  className="bg-orange-900 h-full absolute top-0 left-0"
                  initial={{ width: "0%" }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <div className="text-xs mt-1 z-10">
                  {percentage.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="mt-2 mb-5">
          {poll.multiple ? (
            <div className="flex flex-col gap-2">
              {poll.options.map((option, index) => (
                <Label key={index} className="flex items-center">
                  <Checkbox
                    checked={selectedOptions.includes(index)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(index, checked as boolean)
                    }
                    disabled={poll.expired || poll.voted}
                    className="mr-2"
                  />
                  {option.title}
                </Label>
              ))}
            </div>
          ) : (
            <RadioGroup
              value={String(selectedOptions[0])}
              onValueChange={handleRadioChange}
              className="flex flex-col gap-3"
            >
              {poll.options.map((option, index) => (
                <div key={index}>
                  <Label className="flex items-center cursor-pointer">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      checked={selectedOptions.includes(index)}
                      disabled={poll.expired || (!poll.multiple && poll.voted)}
                    />
                    {option.title}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      )}
      <div className="flex justify-between mt-2">
        {!poll.expired && !poll.voted && (
          <Button
            variant="outline"
            onClick={() => setShowResults(!showResults)}
            className="px-2 text-sm text-foreground hover:bg-transparent border-[#96A6C2]"
          >
            {showResults ? "Hide Results" : "Show Results"}
          </Button>
        )}
        {!poll.expired && !poll.voted && (
          <div className="flex justify-between">
            <Button
              onClick={handleSubmitVote}
              className="min-w-[94px] bg-orange-500 hover:bg-orange-500/90 text-white px-2 py-0 rounded-md text-sm"
              disabled={poll.expired || poll.voted || showResults}
            >
              Send vote
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-2 items-center">
        <div className="text-xs text-foreground">
          {poll.votes_count} votes from {poll.voters_count} voters ▸{" "}
          {poll.expired ? "Closed" : timeLeft}
        </div>
        <Button
          disabled={isRefetching}
          onClick={handleRefresh}
          variant="outline"
          className="min-w-[94px] text-froeground hover:text-foreground px-2 py-0 rounded-md text-sm"
        >
          {t("poll.refresh")}
          <RefreshCcw />
        </Button>
      </div>
    </div>
  );
};

const getPollStatusListUpdaterFn =
  (poll: Poll) => (old: { pages: StatusListResponse[]; pageParams: unknown }) => {
    if (!old) return old;
    const pages = old.pages?.map((page) => ({
      ...page,
      statuses: page.statuses?.map(getUpdater(poll)),
    }));
    return {
      pages,
      pageParams: old.pageParams,
    };
  };

const getUpdater = (poll: Poll) => (status: Status) => {
  if (!status || !status.poll) return status;
  if (status.poll.id === poll.id) {
    return {
      ...status,
      poll,
    };
  } else if (status.reblog && status.reblog.poll.id === poll.id) {
    return {
      ...status,
      reblog: {
        ...status.reblog,
        poll,
      },
    };
  }
  return status;
};

export default Poll;
