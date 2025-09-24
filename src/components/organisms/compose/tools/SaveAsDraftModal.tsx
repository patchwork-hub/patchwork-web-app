"use client";

import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { FC } from "react";
import { useDraftStore } from "../store/useDraftStore";
import { useModalAction } from "../../modal/modal.context";
import { useScheduleStore } from "../store/useScheduleStore";

export const SaveAsDraftModal: FC<{
  onConfirm: () => void;
}> = ({ onConfirm }) => {
  const {closeModal} = useModalAction()
  const {
    saveAsDraftModalOpen,
    setSaveAsDraftModalOpen,
    navigateAction,
    setNavigateAction,
  } = useDraftStore();
const {schedule, removeSchedule} = useScheduleStore()
  const handleConfirm = () => {
    onConfirm();
    setSaveAsDraftModalOpen(false);
    navigateAction();
    setNavigateAction(() => {});
  };

  const onDiscard = () => {
    setSaveAsDraftModalOpen(false);
    closeModal()
    navigateAction();
    setNavigateAction(() => {});
    if(schedule){
      removeSchedule()
    }
  };

  const onClose = () => {
    setSaveAsDraftModalOpen(false);
  };

  return (
    <Dialog open={saveAsDraftModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unsaved changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Would you like to save them as a draft
            before leaving?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onDiscard}
            className="hover:text-foreground"
          >
            Discard
          </Button>
          <Button onClick={handleConfirm}>Save as draft</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
