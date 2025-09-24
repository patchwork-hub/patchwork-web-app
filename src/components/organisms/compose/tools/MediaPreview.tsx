import { FC, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { Input } from "@/components/atoms/ui/input";
import { useMediaStore } from "../store/useMediaStore";
import { Crop, X } from "lucide-react";
import { useUpdateMedia } from "@/hooks/mutations/media/useUpdateMedia";
import { Media } from "@/types/status";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { UploadMediaMutation } from "@/hooks/mutations/status/useUploadMedia";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { toast } from "sonner";

type MediaPreviewProps = {
  mediaAttachments: Media[];
  uploadMedia: UploadMediaMutation["mutateAsync"];
};

export const MediaPreview: FC<MediaPreviewProps> = ({
  mediaAttachments,
  uploadMedia,
}) => {
  const {
    mediaLocalUrls,
    setMediaLocalUrls,
    altTexts,
    setAltTexts,
    isSensitive,
    media,
    setMedia,
    mediaAttributes,
    setMediaAttributes,
    uploading,
    setUploading,
  } = useMediaStore();
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const { mutateAsync: updateMedia, isPending: isUpdatingMedia } =
    useUpdateMedia();

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const { theme } = useTheme();

  const handleCropStart = (index: number) => {
    setCurrentImageIndex(index);
    setIsCropModalOpen(true);
    setTimeout(() => {
      if (imageRef.current) {
        if (cropperRef.current) {
          cropperRef.current.destroy();
        }

        cropperRef.current = new Cropper(imageRef.current, {
          viewMode: 1,
          dragMode: "move",
          background: true,
          cropBoxMovable: true,
          cropBoxResizable: true,
          guides: true,
          autoCropArea: 0.8,
          responsive: true,
          restore: true,
          checkCrossOrigin: false,
        });
      }
    }, 100);
  };

  const handleCropComplete = async () => {
    if (!cropperRef.current) return;

    try {
      const canvas = cropperRef.current.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "cropped-image.jpg", {
            type: "image/jpeg",
          });
          const newUrl = URL.createObjectURL(blob);
          const newMediaLocalUrls = [...mediaLocalUrls];
          newMediaLocalUrls[currentImageIndex] = newUrl;
          setMediaLocalUrls(newMediaLocalUrls);

          const newUploading = [...uploading];
          newUploading[currentImageIndex] = true;
          setUploading(newUploading);

          setIsCropModalOpen(false);
          const uploadedMedia = await uploadMedia({ file, description: "" });
          const newMedia = [...media];
          newMedia[currentImageIndex] = uploadedMedia;
          setMedia(newMedia);

          const oldUploading = [...uploading];
          oldUploading[currentImageIndex] = false;
          setUploading(oldUploading);
        }
      }, "image/jpeg");
    } catch (error) {
      setIsCropModalOpen(false);
      console.error("Crop failed:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    const filterFn = (_, i) => i !== index;
    setMedia(media.filter(filterFn));
    setMediaLocalUrls(mediaLocalUrls.filter(filterFn));
    setAltTexts(altTexts.filter(filterFn));
  };

  const handleUpdate = () => {
    if (currentImageIndex === null) return;

    const mediaId = media[currentImageIndex!]?.id;

    // if already posted media, cannot use update api
    if (mediaAttachments?.find((it) => it.id === mediaId)) {
      const idx = mediaAttributes.findIndex((it) => it.id === mediaId);
      if (idx != -1) {
        mediaAttributes[idx]["description"] = altTexts[currentImageIndex];
        setMediaAttributes([...mediaAttributes]);
      } else {
        setMediaAttributes([
          ...mediaAttributes,
          {
            id: mediaId,
            description: altTexts[currentImageIndex],
          },
        ]);
      }
      setShowImageModal(false);
    }
    // if new uploaded and not posted yet, can use update api
    else {
      updateMedia({
        id: media[currentImageIndex!]?.id,
        description: altTexts[currentImageIndex!],
      }).then((_) => setShowImageModal(false))
      .catch((error) => {
        toast.error(error.response.data.error+"." || "Failed to update media description. Please try again.");
      });
    }
  };

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {mediaLocalUrls.map((localUrl, index) => (
        <div
          key={index}
          className="relative inline-block w-full sm:w-[360px] aspect-video"
        >
          {/* Image */}

          {uploading[index] && (
            <div className="border border-gray-300 rounded-md bg-[#96A6C2] bg-opacity-50 flex items-center justify-center w-full sm:w-[360px] aspect-video">
              Uploading...
            </div>
          )}
          {!uploading[index] &&
            (localUrl.includes("image") ||
              localUrl.endsWith(".gif") ||
              media[index]?.type === "image" ||
              (media[index]?.url || media[index]?.preview_url)?.endsWith(
                ".png"
              )) && (
              <div className="relative w-full sm:w-[360px] aspect-video">
                <img
                  src={localUrl}
                  alt={altTexts[index] || ""}
                  className="w-full sm:w-[360px] aspect-video object-cover border border-gray-300 rounded-md"
                />
                {isSensitive && (
                  <div className="absolute inset-0 rounded-md backdrop-blur-lg" />
                )}
              </div>
            )}
          {!uploading[index] &&
            (localUrl.includes("video") || media[index]?.type !== "image") &&
            !(media[index]?.url || media[index]?.preview_url)?.endsWith(
              ".png"
            ) &&
            !localUrl.endsWith(".gif") && (
              <div className="relative w-full sm:w-[360px] aspect-video">
                <video
                  src={localUrl}
                  controls
                  className="w-full object-cover max-h-[365px] aspect-video"
                />
                {isSensitive && (
                  <div className="absolute inset-0 rounded-md backdrop-blur-lg" />
                )}
              </div>
            )}

          {/* Edit Alt Button (Top-Left) */}
          <Dialog
            open={showImageModal && currentImageIndex === index}
            onOpenChange={setShowImageModal}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className={cn(
                  "absolute top-2 left-2 bg-gray-800 text-gray-300 hover:bg-gray-700",
                  {
                    "text-orange-500": altTexts[index],
                  }
                )}
                onClick={() => setCurrentImageIndex(index)}
              >
                ALT
              </Button>
            </DialogTrigger>
            <DialogContent
              className={cn("bg-black text-white", {
                "bg-white": theme === "light",
              })}
            >
              <DialogHeader>
                <DialogTitle
                  className={cn({ "text-black": theme === "light" })}
                >
                  Edit alt
                </DialogTitle>
              </DialogHeader>
              <Input
                value={altTexts[index] || ""}
                onChange={(e) => {
                  const newAltTexts = [...altTexts];
                  newAltTexts[index] = e.target.value;
                  setAltTexts(newAltTexts);
                }}
                placeholder="Alt text"
                className="bg-gray-900 text-white"
              />
              <div className="space-x-2">
                <Button loading={isUpdatingMedia} onClick={handleUpdate}>
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImageModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {!uploading[index] &&
            (localUrl.includes("image") || media[index]?.type === "image") && (
              <Dialog
                open={isCropModalOpen && currentImageIndex === index}
                onOpenChange={setIsCropModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white hover:bg-gray-700"
                    onClick={() => handleCropStart(index)}
                  >
                    <Crop />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={cn("max-w-4xl", {
                    "bg-white": theme === "light",
                  })}
                >
                  <DialogHeader>
                    <DialogTitle>Crop</DialogTitle>
                  </DialogHeader>

                  <div className="h-[24rem] w-full">
                    <div className="relative h-full w-full overflow-hidden">
                      {currentImageIndex !== null && (
                        <img
                          ref={imageRef}
                          src={
                            mediaLocalUrls[currentImageIndex]?.startsWith(
                              "http"
                            )
                              ? `/api/images?url=${mediaLocalUrls[currentImageIndex]}`
                              : mediaLocalUrls[currentImageIndex]
                          }
                          alt="Upload preview"
                          className="block max-w-full"
                          style={{ opacity: 0 }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => setIsCropModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCropComplete}
                      className="flex items-center space-x-2"
                    >
                      <span>Crop</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

          {/* Remove Button (Top-Right) */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-2 right-2"
          >
            <X />
          </Button>
        </div>
      ))}
    </div>
  );
};
