import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/atoms/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { cn } from "@/lib/utils";
import { Media } from "@/types/status";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTheme } from "next-themes";
import React, { useState } from "react";

type MediaAttachmentPreviewProps = {
  media: Media;
  sensitive: boolean;
  className?: string;
};

const MediaAttachmentPreview: React.FC<MediaAttachmentPreviewProps> = ({
  media,
  sensitive,
  className,
}) => {
  const [viewSensitive, setViewSensitive] = useState(sensitive);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useTheme();
  const handleImageClick = () => {
    if (media.type === "image" && !viewSensitive) {
      setIsImageViewerOpen(true);
    }
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  return (
    <div className={cn("relative w-full bg-background rounded-md", className)}>
      {media.type === "image" ? (
        <img
          src={media.preview_url}
          alt={media.description}
          aria-label={media.description}
          className={cn(
            "w-full h-full object-cover max-h-[350px] rounded-md cursor-pointer"
          )}
          onClick={handleImageClick}
        />
      ) : (
        <video
          aria-label={media.description}
          src={media.url}
          controls={media.type === "gifv" ? false : true}
          playsInline={media.type === "gifv"}
          controlsList="nodownload"
          loop={media.type === "gifv"}
          autoPlay={media.type === "gifv"}
          className={cn("w-full h-full object-cover max-h-[350px] rounded-md")}
        />
      )}

      {/* Alt Text Popover */}
      {media.description && (
        <div className="absolute top-2 right-2">
          <Button
            variant="outline"
            size="sm"
            className={cn("h-6 px-2 bg-gray-800 text-white border-none", {
              "hover:text-white bg-gray-500": theme === "light",
            })}
            aria-label="Show alt text"
            onClick={() => setIsDialogOpen(!isDialogOpen)}
          >
            ALT
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="border-none">
              <DialogHeader>
                <DialogTitle className="text-center font-bold">
                  Alt text
                </DialogTitle>
                <DialogDescription className="text-foreground text-sm">
                  {media.description}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Sensitive Content Overlay */}
      {viewSensitive && (
        <div className="absolute inset-0 rounded-md backdrop-blur-lg flex items-center justify-center">
          <button
            onClick={() => setViewSensitive(false)}
            className="bg-gray-800 text-[#fff] px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            <strong>Sensitive content</strong>
            <br />
            Click to view
          </button>
        </div>
      )}

      {/* Full-Screen Image Viewer */}
      {isImageViewerOpen && media.type === "image" && (
        <div
          className="fixed inset-0 bg-black/70 bg-opacity-90 flex items-center justify-center z-60"
          onClick={closeImageViewer}
        >
          <div className="max-w-[90vw] max-h-[90vh]">
            <img
              src={media.url || media.preview_url}
              alt={media.description}
              aria-label={media.description}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          <button
            onClick={closeImageViewer}
            className="fixed top-4 right-4 bg-gray-800 text-[#fff] px-2 py-1 rounded-md hover:bg-gray-700 focus:outline-none"
            aria-label="Close image viewer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaAttachmentPreview;
