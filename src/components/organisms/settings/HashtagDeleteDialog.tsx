import { Button } from "@/components/atoms/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/atoms/ui/dialog";
import { Dialog } from "@/components/atoms/ui/dialog";
import React from "react";

interface HashtagDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  message: string;
  onDelete: () => void;
}

const HashtagDeleteDialog = ({
  isOpen,
  onOpenChange,
  message,
  onDelete
}: HashtagDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete hashtag</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default HashtagDeleteDialog;
