import React, { useState } from "react";
import { Trash2, Plus, ChevronRight } from "lucide-react";
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
import { toast } from "sonner";
import { useDeleteSchedule } from "@/hooks/mutations/schedule/useDeleteSchedule";
import { useGetSchedules } from "@/hooks/queries/schedule/useGetSchedules";
import { useScheduleStore } from "../store/useScheduleStore";
import { TooltipTrigger } from "@/components/atoms/ui/tooltip";
import { Tooltip } from "@/components/atoms/ui/tooltip";
import { useModalAction } from "../../modal/modal.context";
import { useDateTimePickerStore } from "../store/useDateTimePickerStore";
import { useLocale } from "@/providers/localeProvider";
import Image from "next/image";

export const Schedules = () => {
  const [open, setOpen] = useState(false);
  const { openModal } = useModalAction();
  const { data: scheduleData, isLoading } = useGetSchedules();
  const { setIsDateOpen } = useDateTimePickerStore();
  const deleteMutation = useDeleteSchedule();
  const [dataToDelete, setDataToDelete] = useState<string | null>(null);
  const { setSchedule, removeSchedule } = useScheduleStore();

  const handleDeleteClick = (id: string) => {
    setDataToDelete(id);
  };

  const confirmDelete = () => {
    if (dataToDelete) {
      deleteMutation.mutateAsync(dataToDelete, {
        onSuccess: () => {
          toast.success(t("toast.schedule_deleted"));
        },
      });
      removeSchedule();
      setDataToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDataToDelete(null);
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
  const { t } = useLocale();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              {t("screen.scheduled_posts")}
              <ChevronRight />
            </div>
          </DialogTrigger>
        </TooltipTrigger>
      </Tooltip>
      <DialogContent className="grid-rows-[auto_1fr] bg-background text-foreground border max-w-lg max-h-[80dvh]">
        <DialogHeader>
          <DialogTitle>{t("setting.scheduled_posts")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-foreground">Loading...</div>
        ) : !scheduleData || (scheduleData && scheduleData.length === 0) ? (
          <div className="text-foreground text-center flex flex-col items-center space-y-4 justify-center">
            <p>{t("compose.schedule.no_schedule")}</p>
            <Button
              className="px-2 bg-orange-500 w-fit hover:text-white!"
              onClick={() => {
                openModal("COMPOSE_FORM_VIEW");
                setOpen(false);
                setIsDateOpen(true);
              }}
            >
              <p>{t("compose.schedule.schedule_new_post")}</p>
            </Button>
          </div>
        ) : (
          <div className="text-foreground space-y-5 min-h-[220px] h-[calc(100%-42px)] overflow-auto">
            {scheduleData.map((schedule, idx, self) => (
              <React.Fragment key={schedule.id}>
                <div className="w-full h-auto p-4 border-l-2 border-red-500 rounded shadow">
                  <div className="w-full flex justify-between items-start text-start">
                    <div
                      onClick={() => {
                          setSchedule(schedule);
                          setOpen(false);
                          openModal("COMPOSE_FORM_VIEW");
                      }}
                      className="flex-1"
                    >
                      {schedule.params.text && (
                        <p className="text-foreground">
                          {schedule.params.text}
                        </p>
                      )}
                      {schedule.params.poll && (
                        <p className="text-gray-400 text-sm">
                          {t("timeline.draft.includes_poll")}
                        </p>
                      )}
                      {schedule.media_attachments &&
                        schedule.media_attachments.length > 0 && (
                          <div className="relative mt-2">
                            <Image
                              src={schedule.media_attachments[0].url}
                              alt="Schedule media"
                              className="w-full h-32 object-cover rounded"
                            />
                            {schedule.media_attachments.length > 1 && (
                              <div className="absolute p-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 text-white rounded-full w-fit aspect-square flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                                <span className="text-xs">
                                  {schedule.media_attachments.length - 1}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      <p className="text-gray-400 text-sm mt-1">
                        {formatDate(
                          schedule.scheduled_at || new Date().toISOString()
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(schedule.id)}
                      className="text-orange-500 hover:opacity-90 ml-4 cursor-pointer"
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
          open={!!dataToDelete}
          onOpenChange={(open) => !open && cancelDelete()}
        >
          <DialogContent className="bg-background text-foreground border-none">
            <DialogHeader>
              <DialogTitle>{t("timeline.delete_schedule_title")}</DialogTitle>
              <DialogDescription className="text-foreground">
                {t("timeline.confirm_delete_schedule")}
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
                className="bg-orange-500 hover:bg-orange-500/90"
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
