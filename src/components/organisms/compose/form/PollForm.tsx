import React from "react";
import { Button } from "@/components/atoms/ui/button";
import { Input } from "@/components/atoms/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/ui/select";
import { usePollStore } from "../store/usePollStore";
import { X } from "lucide-react";
import { POLL_DURATION_OPTIONS, POLL_LIMITS, POLL_TYPES } from "../types";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";

const PollFormWrapper: React.FC = () => {
  const {
    pollOptions,
    setPollOptions,
    pollChoiceType,
    setPollChoiceType,
    pollDuration,
    setPollDuration,
  } = usePollStore();

  return (
    <PollForm
      pollOptions={pollOptions}
      setPollOptions={setPollOptions}
      pollChoiceType={pollChoiceType}
      setPollChoiceType={setPollChoiceType}
      pollDuration={pollDuration}
      setPollDuration={setPollDuration}
    />
  );
};

interface PollFormProps {
  pollOptions: string[];
  setPollOptions: (options: string[]) => void;
  pollChoiceType: "single" | "multiple";
  setPollChoiceType: (choiceType: "single" | "multiple") => void;
  pollDuration: number;
  setPollDuration: (duration: number) => void;
}

export const PollForm: React.FC<PollFormProps> = ({
  pollOptions,
  setPollOptions,
  pollChoiceType,
  setPollChoiceType,
  pollDuration,
  setPollDuration,
}) => {
  const { theme } = useTheme();
  const {t} = useLocale()
  return (
    <div className="my-4 p-4 rounded-lg text-foreground">
      <h3 className="text-lg font-semibold mb-4">{t("poll.create_title")}</h3>
      {pollOptions.map((option, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <Input
            value={option}
            onChange={(e) => {
              const newOptions = [...pollOptions];
              newOptions[index] = e.target.value;
              setPollOptions(newOptions);
            }}
            placeholder={`${t("poll.option")} ${index + 1}`}
            // className="flex-1 bg-gray-600 text-white border-none rounded-lg h-12 focus:ring-0"
          />
          {pollOptions.length > POLL_LIMITS.MIN_OPTIONS && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() =>
                setPollOptions(pollOptions.filter((_, i) => i !== index))
              }
              className="h-8 w-8 bg-transparent hover:bg-transparent"
              aria-label={`Remove option ${index + 1}`}
            >
              <X color="red" />
            </Button>
          )}
        </div>
      ))}
      <Button
        onClick={() => setPollOptions([...pollOptions, ""])}
        className="mt-2 bg-green-700 text-white hover:opacity-90 rounded-md h-10"
        disabled={pollOptions.length >= POLL_LIMITS.MAX_OPTIONS}
      >
        {t("poll.add_option")}
      </Button>
      <div className="mt-4 flex justify-between gap-5">
        <Select
          value={pollChoiceType}
          onValueChange={(value: "single" | "multiple") =>
            setPollChoiceType(value)
          }
        >
          <SelectTrigger className="bg-green-700 text-white border-none rounded-lg h-10 focus:ring-0">
            <SelectValue placeholder="Single choice" />
          </SelectTrigger>
          <SelectContent
            className={cn("bg-primary text-white", {
              "bg-white": theme === "light",
            })}
          >
            {POLL_TYPES.map((type) => (
              <SelectItem
                key={type.label}
                value={type.value ? "multiple" : "single"}
                className={cn("text-white", {
                  "text-black focus:text-white": theme === "light",
                })}
              >
                  {t(`poll.${type.value ? "multiple" : "single"}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={pollDuration.toString()}
          onValueChange={(value: string) => setPollDuration(Number(value))}
        >
          <SelectTrigger className="text-white bg-green-700 border-none rounded-lg h-10 focus:ring-0">
            <SelectValue placeholder="1 day" />
          </SelectTrigger>
          <SelectContent
            className={cn("bg-primary text-white", {
              "bg-white": theme === "light",
            })}
          >
            {POLL_DURATION_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value.toString()}
                className={cn("text-white", {
                  "text-black focus:text-white": theme === "light",
                })}
              >
                 {t(`poll.poll_duration.${option.value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PollFormWrapper;
