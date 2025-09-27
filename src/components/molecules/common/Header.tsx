"use client";
import GoBack from "./GoBack";
import { cn } from "@/lib/utils";
import { ListMembersIcon, PenIcon, SettingIcon, StatusDeleteIcon } from "@/components/atoms/icons/Icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/ui/popover";
import { useLocale } from "@/providers/localeProvider";

interface THeader {
  title: string | React.ReactNode;
  setting?: boolean;
  handleDelete?: () => void;
  handleEditMember?: () => void;
  handleEditInfo?: () => void;
  backRoute?: string;
}

export default function Header({
  title,
  setting = false,
  handleDelete,
  handleEditMember,
  handleEditInfo,
  backRoute,
}: THeader) {
  const {t} = useLocale();
  return (
    <div
      className={`bg-background w-full p-4 sticky top-0 z-10 ${
        setting
          ? "flex items-center justify-between border-b-[0.5px] border-b-gray-200"
          : "border-b-[0.5px] border-[#96A6C2]"
      }`}
    >
      <GoBack
        className="opacity-80 active:opacity-80 text-foreground hover:opacity-90"
        backRoute={backRoute}
      />

      <h3
        className={`text-base text-foreground font-bold md:text-lg ${
          setting
            ? ""
            : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        }`}
      >
        {title}
      </h3>
      {setting && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "p-2.5 border border-gray-600 rounded-full active:opacity-80 cursor-pointer hover:opacity-90"
              )}
            >
              <SettingIcon />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className={cn(
              "w-fit bg-background dark:bg-primary z-40 text-primary dark:text-white border rounded-lg flex flex-col items-start justify-items-start space-y-2 shadow-md"
            )}
          >
            <p
              className="flex gap-3 hover:opacity-70 w-full cursor-pointer"
              onClick={handleEditInfo}
            >
              <PenIcon className="w-5 h-5" />
              {t("timeline.edit_list_info")}
            </p>
            <p
              className="flex gap-3 hover:opacity-70 w-full cursor-pointer"
              onClick={handleEditMember}
            >
              <ListMembersIcon /> {t("timeline.edit_list_members")}
            </p>
            <p
              className="flex gap-3 hover:opacity-70 w-full cursor-pointer"
              onClick={handleDelete}
            >
              <StatusDeleteIcon />  {t("timeline.delete_list")}
            </p>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
