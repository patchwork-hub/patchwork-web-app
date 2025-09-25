import React, { useState, useRef } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/atoms/ui/dialog";
import { Button } from "../atoms/ui/button";

const ASPECT_RATIOS = {
  "1:1": { width: 1, height: 1, label: "Avatar" },
  "36:10": { width: 36, height: 10, label: "Banner" },
  "3.35:1": { width: 700, height: 200, label: "Profile Header" }
};

const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
const maxSize = 2 * 1024 * 1024;

type ImagePickerProps = {
  defaultRatio?: "1:1" | "36:10" | "3.35:1";
  onCrop: (file: File) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const ImagePicker: React.FC<ImagePickerProps> = ({
  defaultRatio = "1:1",
  onCrop,
  children,
  className,
  disabled = false
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  const currentAspectRatio = ASPECT_RATIOS[defaultRatio];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > maxSize) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert("File type not allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setIsModalOpen(true);

      setTimeout(() => {
        if (imageRef.current) {
          if (cropperRef.current) {
            cropperRef.current.destroy();
          }

          cropperRef.current = new Cropper(imageRef.current, {
            aspectRatio: currentAspectRatio.width / currentAspectRatio.height,
            viewMode: 1,
            dragMode: "move",
            background: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            guides: true,
            autoCropArea: 0.8,
            responsive: true,
            restore: true,
            checkCrossOrigin: false
          });
        }
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    if (!cropperRef.current) return;

    try {
      const canvas = cropperRef.current.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high"
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped-image.jpg", {
            type: "image/jpeg"
          });
          onCrop(file);
        }
      }, "image/jpeg");
    } catch (error) {
      console.error("Crop failed:", error);
    }

    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`relative ${className ?? ""}`}>
        <input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          accept={allowedTypes.join(",")}
          onChange={handleImageUpload}
          value=""
          disabled={disabled}
        />
        {children}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="h-[24rem] w-full">
            <div className="relative h-full w-full overflow-hidden">
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={imageRef}
                  src={image}
                  alt="Upload preview"
                  className="block max-w-full"
                  style={{ opacity: 0 }}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={handleCrop}
              className="flex items-center space-x-2"
            >
              <span>Crop</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePicker;
