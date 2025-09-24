import React, { useState } from "react";
import { Files, Trash2, Plus } from "lucide-react";
import { useGetStatusDrafts } from "@/hooks/queries/drafts/useGetStatusDrafts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { useDeleteDraft } from "@/hooks/mutations/drafts/useDeleteDraft";
import { useDraftStore } from "../store/useDraftStore";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { isSystemDark } from "@/utils/helper/helper";

export const Drafts = () => {
  const [open, setOpen] = useState(false);
  const {t} = useLocale();
  const { data: draftsData, isLoading: isGettingDrafts } = useGetStatusDrafts();
  const deleteDraftMutation = useDeleteDraft();
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const { theme } = useTheme();
  const { setDraft, removeDraft } = useDraftStore();

  const handleDeleteClick = (draftId: string) => {
    setDraftToDelete(draftId);
  };

  const confirmDelete = () => {
    if (draftToDelete) {
      deleteDraftMutation.mutateAsync(draftToDelete, {
        onSuccess: () => {
          toast.success(t("toast.draft_deleted"));
        },
      });
      removeDraft();
      setDraftToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDraftToDelete(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-2 text-background bg-gray-600 hover:bg-[#aac2eb] border-none hover:text-black!",
                theme === "dark" || (theme === "system" && isSystemDark)
                  ? "text-foreground"
                  : "text-background"
              )}
            >
              <Files className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("tooltip.drafts")}</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="grid-rows-[auto_1fr] bg-background text-foreground border max-w-lg max-h-[80dvh]">
        <DialogHeader>
          <DialogTitle>{t("compose.drafts")}</DialogTitle>
        </DialogHeader>
        {isGettingDrafts ? (
          <div className="text-white">Loading...</div>
        ) : !draftsData ||
          (draftsData &&
            (draftsData.length === 0 ||
              (draftsData.length > 0 && draftsData[0].datas.length === 0))) ? (
          <div className="text-foreground text-center">No drafts available.</div>
        ) : (
          <div className="text-freground space-y-5 min-h-[220px] h-[calc(100%-42px)] overflow-auto">
            {draftsData[0].datas.map((draft, idx, self) => (
              <React.Fragment key={draft.id}>
                <div className="w-full h-auto p-4 border-l-2 border-red-500 bg-background rounded shadow">
                  <div className="w-full flex justify-between items-start text-start">
                    <div
                      onClick={() => {
                        setDraft(draft);
                        setOpen(false);
                      }}
                      className="flex-1"
                    >
                      {draft.params.text && (
                        <p className="text-foreground">{draft.params.text}</p>
                      )}
                      {draft.params.poll && (
                        <p className="text-gray-400 text-sm">
                        {t("timeline.draft.includes_poll")}
                        </p>
                      )}
                      {draft.media_attachments &&
                        draft.media_attachments.length > 0 && (
                          <div className="relative mt-2">
                            {draft.media_attachments[0].url.endsWith(".mp4") ? (
                              <video
                                src={draft.media_attachments[0].url}
                                className="w-full h-32 object-cover rounded"
                                controls
                                autoPlay
                              />
                            ) : (
                              <img
                                src={draft.media_attachments[0].url}
                                alt="Draft media"
                                className="w-full h-32 object-cover rounded"
                              />
                            )}

                            {draft.media_attachments.length > 1 && (
                              <div className="absolute p-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 text-white rounded-full w-fit aspect-square flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                                <span className="text-xs">
                                  {draft.media_attachments.length - 1}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      <p className="text-gray-400 text-sm mt-1">
                        {formatDate(
                          draftsData[0].date || new Date().toISOString()
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(draft.id)}
                      className="text-orange-500 hover:opacity-80 ml-4 cursor-pointer"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                {idx !== self.length - 1 && <hr className="border-gray-600" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <Dialog
          open={!!draftToDelete}
          onOpenChange={(open) => !open && cancelDelete()}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("timeline.draft.delete_draft")}</DialogTitle>
              <DialogDescription
                className={cn("text-gray-300", {
                  "text-black": theme === "light",
                })}
              >
                {t("timeline.draft.delete_alert")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={cancelDelete}
                variant="outline"
                className="border border-gray-400"
              >
                 {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="bg-orange-500 hover:bg-orange-500/90 text-[#ffffff]"
              >
                 {t("common.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
