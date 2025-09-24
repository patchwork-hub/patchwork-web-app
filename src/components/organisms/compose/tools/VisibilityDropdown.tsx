import { FC, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/atoms/ui/dropdown-menu";
import { Button } from "@/components/atoms/ui/button";
import { useVisibilityStore } from "../store/useVisibilityStore";
import { GlobeIcon, CircleCheck, Moon, Lock, AtSign } from "lucide-react";
import { Visibility } from "../types";
import { TooltipContent } from "@/components/atoms/ui/tooltip";
import { Tooltip } from "@/components/atoms/ui/tooltip";
import { TooltipTrigger } from "@/components/atoms/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";

export const visibilities: Record<Visibility, string> = {
  public: "Anyone",
  unlisted: "Anyone, but not listed in timelines",
  private: "Followers only",
  direct: "People mentioned only",
};

export const visibilityIcons = {
  public: GlobeIcon,
  unlisted: Moon,
  private: Lock,
  direct: AtSign,
};

export const VisibilityDropdown: FC<{
  defaultVisibility?: Visibility;
  disabled?: boolean;
}> = ({ defaultVisibility = "public", disabled = false }) => {
  const [selectedItem, setSelectedItem] = useState<Visibility>("public");
  const {t} = useLocale();
  const { setVisibility } = useVisibilityStore();
  const { theme } = useTheme();
  useEffect(() => {
    setVisibility(defaultVisibility);
  }, [defaultVisibility]);

  const SelectedIcon = visibilityIcons[selectedItem];

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button
              variant="outline"
              className={cn(
                "flex items-center bg-gray-600 gap-2 text-white hover:bg-[#aac2eb] border-none hover:text-black!"
              )}
            >
              <SelectedIcon className="group-hover:text-black!" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("tooltip.privacy")}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="bg-background text-foreground shadow-md">
        {Object.keys(visibilities).map((option: Visibility) => {
          const Icon = visibilityIcons[option];
          return (
            <DropdownMenuItem
              key={option}
              onClick={() => {
                setVisibility(option);
                setSelectedItem(option);
              }}
            >
              <Icon />
               {t(`timeline.visibility.${option}`)}
              {selectedItem === option && (
                <CircleCheck className="text-orange-500 ml-2" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
