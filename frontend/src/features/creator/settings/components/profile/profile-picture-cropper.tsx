"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import Button from "@/src/components/atoms/button";

const OUTPUT_SIZE = 320;

interface ProfilePictureCropperProps {
  file: File;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

export function ProfilePictureCropper({
  file,
  onCancel,
  onConfirm,
}: ProfilePictureCropperProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
        setImageError("");
      }
    };
    reader.onerror = () => setImageError("Unable to read this image file.");
    reader.readAsDataURL(file);

    return () => reader.abort();
  }, [file]);

  const createCroppedFile = async () => {
    if (!croppedAreaPixels || isPreparing) return;
    setIsPreparing(true);

    try {
      const image = new Image();
      image.src = imageUrl;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9),
      );
      if (!blob) return;

      onConfirm(
        new File([blob], "profile-picture.jpg", { type: "image/jpeg" }),
      );
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-title"
    >
      <section className="w-full max-w-[500px] rounded-lg bg-white p-6 shadow-2xl">
        <h2 id="crop-title" className="text-2xl text-[#141518]">
          Crop profile picture
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Drag the image to position it inside the highlighted circle.
        </p>

        <div className="relative mx-auto mt-5 h-[320px] w-full overflow-hidden bg-gray-900 cursor-grab active:cursor-grabbing">
          {imageUrl ? (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              objectFit="cover"
              disableAutomaticStylesInjection
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_area, pixels) => setCroppedAreaPixels(pixels)}
              onMediaLoaded={() => setImageError("")}
              mediaProps={{
                onError: () =>
                  setImageError(
                    "This image format could not be displayed. Try a PNG, JPEG, or WebP image.",
                  ),
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/70">
              Loading image...
            </div>
          )}
        </div>

        {imageError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {imageError}
          </p>
        )}

        <label className="mt-5 block text-sm font-medium text-[#141518]">
          Zoom
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="mt-2 w-full accent-[#6b1fa8]"
          />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPreparing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#6b1fa8] text-white hover:bg-[#5a1a8f]"
            onClick={() => void createCroppedFile()}
            disabled={!croppedAreaPixels || isPreparing || Boolean(imageError)}
          >
            {isPreparing ? "Preparing..." : "Use Photo"}
          </Button>
        </div>
      </section>
    </div>
  );
}
