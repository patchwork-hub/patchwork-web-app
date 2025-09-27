"use client";
import { useRouter } from "next/navigation";
import ComposeForm from "../compose/form/ComposeForm";
import Modal from "./modal";
import { useModalAction, useModalState } from "./modal.context";
import { useCreateStatus } from "@/hooks/mutations/status/useCreateStatus";
import { useDraftStore } from "../compose/store/useDraftStore";
import EditPost from "../edit-status/EditPost";

const ManagedModal = () => {
  const { isOpen, view } = useModalState();
  const { closeModal } = useModalAction();
  const { mutateAsync, isPending } = useCreateStatus();

  const { isDirty, setSaveAsDraftModalOpen } = useDraftStore();

  const handleClose = () => {
    if (isDirty) {
      setSaveAsDraftModalOpen(true);
    } else {
      closeModal();
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose} onBackdropClick={handleClose}>
      {view === "COMPOSE_FORM_VIEW" && (
        <ComposeForm
          hideDraft={false}
          disbledDraft={false}
          hideSchedule={false}
          loading={isPending}
          onSubmit={async (formData) => {
            const data = await mutateAsync({ formData });
            if (data.id) closeModal();
            return !!data;
          }}
        />
      )}
      {view === "EDIT_COMPOSE_FORM_VIEW" && (
        <EditPost/>
      )}
    </Modal>
  );
};

export default ManagedModal;
