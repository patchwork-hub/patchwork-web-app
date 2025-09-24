import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { Input } from "@/components/atoms/ui/input";
import { FC, useState } from "react";
import { languages } from "../language/language";
import { useLanguageStore } from "../store/useLanguageStore";
import { Tooltip } from "@/components/atoms/ui/tooltip";
import { TooltipTrigger } from "@/components/atoms/ui/tooltip";
import { TooltipContent } from "@/components/atoms/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";

type LanguageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LanguageModal: FC<LanguageModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { language, setLanguage } = useLanguageStore();
  const [languageSearch, setLanguageSearch] = useState("");
  const { theme } = useTheme();
  const {t} = useLocale();
  const languageData = Object.entries(languages).map(
    ([code, [name, nativeName]]) => ({ code, name, nativeName })
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "bg-gray-600 hover:bg-[#aac2eb] border-none px-2 hover:text-black!",
                theme === "dark" || (theme === "system" && isSystemDark)
                  ? "text-foreground"
                  : "text-background"
              )}
            >
              <div className="h-5 uppercase">{language}</div>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("tooltip.language")}</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>{t("compose.select_language")}</DialogTitle>
        </DialogHeader>
        <Input
          value={languageSearch}
          onChange={(e) => setLanguageSearch(e.target.value)}
          placeholder="Search languages"
          className="text-white"
        />
        <ul className="max-h-40 overflow-auto">
          {languageData
            .filter((lang) =>
              lang.name.toLowerCase().includes(languageSearch.toLowerCase())
            )
            .map((lang) => (
              <li
                key={lang.code}
                className="p-2 hover:bg-secondary rounded-md cursor-pointer"
                onClick={() => {
                  setLanguage(lang.code);
                  onOpenChange(false);
                }}
              >
                {lang.nativeName} ({lang.name})
              </li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
