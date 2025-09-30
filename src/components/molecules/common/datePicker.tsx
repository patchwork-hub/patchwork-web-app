"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, isBefore, startOfDay, addMinutes, isSameDay } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/ui/button";
import { Calendar } from "@/components/atoms/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/atoms/ui/scroll-area";
import { TooltipTrigger } from "@/components/atoms/ui/tooltip";
import { Tooltip } from "@/components/atoms/ui/tooltip";
import { TooltipContent } from "@/components/atoms/ui/tooltip";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useDateTimePickerStore } from "@/components/organisms/compose/store/useDateTimePickerStore";
import { isSystemDark } from "@/utils/helper/helper";
import { useLocale } from "@/providers/localeProvider";

type DateTimePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  hideLabel?: boolean;
  disablePastDates?: boolean;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  hideLabel = false,
  disablePastDates = false,
  disabled = false,
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value);
  const {t} = useLocale();
  const { isDateOpen, setIsDateOpen } = useDateTimePickerStore();
  const [isOpen, setIsOpen] = useState(isDateOpen??false);
  const { theme } = useTheme();
  // Sync internal state with external value prop
  useEffect(() => {
    setDate(value);
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Preserve the time from the current date, if any
      if (date) {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      }
      setDate(newDate);
      if (onChange) {
        onChange(newDate);
      }
    } else {
      setDate(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === "PM"
            ? currentHours < 12
              ? currentHours + 12
              : currentHours
            : currentHours >= 12
            ? currentHours - 12
            : currentHours
        );
      }
      setDate(newDate);
      if (onChange) {
        onChange(newDate);
      }
    }
  };

  // Function to disable past dates
  const isDateDisabled = (date: Date) => {
    if (!disablePastDates) return false;
    const today = startOfDay(new Date());
    return isBefore(date, today);
  };

  // Function to determine if a time should be disabled
  const isTimeDisabled = (
    type: "hour" | "minute" | "ampm",
    value: number | string
  ) => {
    if (!date || !isSameDay(date, new Date())) return false; // Only apply time restrictions for today

    const now = new Date();
    const minSelectableTime = addMinutes(now, 6); // Current time + 5 minutes
    const selectedHour = date.getHours();
    const isPM = selectedHour >= 12;

    if (type === "hour") {
      const hour = (parseInt(value.toString()) % 12) + (isPM ? 12 : 0);
      return hour < minSelectableTime.getHours();
    } else if (type === "minute") {
      const minute = parseInt(value.toString());
      if (selectedHour < minSelectableTime.getHours()) return true;
      if (selectedHour === minSelectableTime.getHours()) {
        return minute < minSelectableTime.getMinutes();
      }
      return false;
    } else if (type === "ampm") {
      if (value === "AM" && minSelectableTime.getHours() >= 12) return true;
      if (value === "PM" && minSelectableTime.getHours() < 12) return true;
      return false;
    }
    return false;
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
        setIsDateOpen(open);
        setIsOpen(open);
    }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-gray-600 hover:bg-[#aac2eb] border-none hover:text-black!",
                !date && !hideLabel && "text-muted-foreground",
                hideLabel && "p-0 justify-center",
                theme === "dark" || (theme === "system" && isSystemDark)
                  ? "text-foreground"
                  : "text-background"
              )}
              disabled={disabled}
              
            >
              <CalendarIcon className="h-4 w-4" />
              {!hideLabel && (
                <span className={cn(hideLabel ? "" : "ml-2")}>
                  {date
                    ? format(date, "MM/dd/yyyy hh:mm aa")
                    : "MM/DD/YYYY hh:mm aa"}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("tooltip.schedule")}</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-auto p-0 bg-background dark:bg-primary text-primary dark:text-white">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => disabled || isDateDisabled(date)}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                    disabled={disabled || isTimeDisabled("hour", hour)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                    disabled={disabled || isTimeDisabled("minute", minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                    disabled={disabled || isTimeDisabled("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
