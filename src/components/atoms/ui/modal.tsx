import { createPortal } from "react-dom";
import { FC, PropsWithChildren } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  className?: string;
};

export const Modal: FC<PropsWithChildren & ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = "",
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[99] flex items-center justify-center p-4 animate-in fade-in duration-300"
      )}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full border max-w-md rounded-lg bg-background p-6 shadow-xl animate-in zoom-in-95 duration-300",
          className
        )}
        role="dialog"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-modal="true"
      >
        <div className="flex justify-between items-center">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
          )}
          <button
            className="bg-transparent"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};
