import React, { JSX, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { Field } from "@/types/auth";
import { Icons, SOCIAL_MEDIA_LINKS } from "@/utils/constant";
import { GlobeIcon } from "@/components/atoms/icons/Icons";
import { cleanText, extractUserName } from "@/utils/helper/socialLink";
import { Trash2 } from "lucide-react";
import { ThemeText } from "@/components/atoms/common/ThemeText";
import { Badge } from "@/components/atoms/ui/badge";
import { Input } from "@/components/atoms/ui/input";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";

type SocialMediaLink = {
  icon: JSX.Element;
  title: string;
};

type SocialLinksProps = {
  openThemeModal: boolean;
  onClose: () => void;
  onPressAdd: (
    linkTitle: string,
    username: string,
    customCallback?: () => void
  ) => void;
  onPressDelete: (linkTitle: string) => void;
  data: Field[];
  formType: "add" | "edit";
  isOwnProfile?: boolean;
};

const SocialLinks: React.FC<SocialLinksProps> = ({
  openThemeModal,
  onClose,
  onPressAdd,
  formType,
  data,
  onPressDelete,
  isOwnProfile,
}) => {
  const [selectedLink, setSelectedLink] = useState<SocialMediaLink | null>(
    null
  );
  const [username, setUsername] = useState<string | null>(null);

  const getLinks = (): SocialMediaLink[] => {
    const platformTitles = new Set(
      SOCIAL_MEDIA_LINKS.map((link) => link.title)
    );

    if (formType === "edit") {
      return data
        .filter((item) => platformTitles.has(item.name))
        .map((item) => ({
          icon: Icons[item.name] || <GlobeIcon colorScheme={"light"} />,
          title: item.name,
        }));
    }

    return SOCIAL_MEDIA_LINKS.filter(
      (link) => !data?.some((item) => item.name === link.title)
    );
  };

  const handleBack = () => {
    setTimeout(() => {
      setSelectedLink(null);
      setUsername(null);
    }, 600);
  };

  const handleAdd = () => {
    if (username && selectedLink) {
      handleBack();
      onPressAdd(selectedLink.title, username);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedLink(null);
    setUsername(null);
  };

  const socialLinkIcons = getLinks();

  useEffect(() => {
    if (!openThemeModal) return;
    if (formType === "edit" && data && selectedLink) {
      const relatedData = data.find((item) => item.name === selectedLink.title);

      setUsername(extractUserName(cleanText(relatedData?.value!)) || null);
    }
  }, [formType, data, selectedLink]);

  return (
    <Dialog open={openThemeModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isOwnProfile && socialLinkIcons.length > 0 && (
              <ThemeText size="md_16" className="self-center">
                {formType === "edit" ? "Edit link" : "Add new link"}
              </ThemeText>
            )}
          </DialogTitle>
        </DialogHeader>
        {selectedLink ? (
          <div className="space-y-4">
            <Badge className="w-auto h-8 rounded-full bg-gray-300 text-gray-600">
              {selectedLink.icon}
              <span>{selectedLink.title}</span>
            </Badge>
            <Input
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              className="text-patchwork-light-50"
              placeholder="username"
              autoCapitalize="none"
            />
            <Button
              onClick={handleAdd}
              className="w-full"
              variant="outline"
              disabled={!username}
            >
              <p>{formType === "edit" ? "Update" : "Add"}</p>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {socialLinkIcons.length > 0 ? (
              socialLinkIcons.map((link) => (
                <div
                  key={link.title}
                  className={cn(
                    "flex relative",
                    formType === "edit" ? "mr-2 mb-4" : ""
                  )}
                >
                  <Badge
                    className="w-auto h-8 rounded-full bg-gray-300 text-gray-600 cursor-pointer"
                    onClick={() => setSelectedLink(link)}
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </Badge>
                  {formType === "edit" && (
                    <div
                      onClick={() => onPressDelete(link.title)}
                      className="absolute -right-2 -top-3 bg-slate-50 rounded-full flex justify-center items-center w-6 h-6 active:opacity-80"
                      role="button"
                      aria-label={`Delete ${link.title} link`}
                    >
                      <Trash2
                        className="text-orange-500 size-4"
                        data-testid="trash-icon"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : formType === "edit" ? (
              <p className="mx-auto text-lg">
                All social links have been removed!
              </p>
            ) : (
              <p className="mx-auto text-lg">
                All social links have been added!
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SocialLinks;
