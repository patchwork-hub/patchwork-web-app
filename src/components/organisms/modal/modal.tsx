import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: (payload?: unknown) => void;
  children: React.ReactNode;
  onBackdropClick?: () => void; 
}

const AnimatePresenceFixedType = AnimatePresence as React.ComponentType<React.ComponentProps<typeof AnimatePresence>>;

export default function Modal({ open, onClose, children, onBackdropClick }: ModalProps) {

   const handleBackdropClick = () => {
    if (onBackdropClick) {
      onBackdropClick();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <AnimatePresenceFixedType mode="wait" key="modal">
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <motion.div
              className="fixed z-50 inset-0 bg-black/50"
              onClick={handleBackdropClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />

            <motion.div
              className="relative w-full max-w-xl z-50 border rounded-lg bg-background p-4 shadow-lg h-auto max-h-4/5 mt-4 mx-4 mb-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="no-scrollbar">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresenceFixedType>
    </>
  );
}
