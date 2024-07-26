"use client";

import "cropperjs/dist/cropper.css";
import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface CropImageDialogProps {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onCancel: () => void;
}

export default function CropImageDialog({
  src,
  cropAspectRatio,
  onCropped,
  onCancel,
}: CropImageDialogProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const crop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onCancel();
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant={"secondary"} onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
