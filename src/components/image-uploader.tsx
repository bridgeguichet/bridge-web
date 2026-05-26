"use client";

import { useCallback, useState } from "react";

import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export function ImageUploader({ value, onChange, onRemove }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }

      setIsUploading(true);

      try {
        // Get upload signature from server
        const response = await fetch("/api/upload", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to get upload signature");
        }

        const { signature, timestamp, cloudName, apiKey } = await response.json();

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", "bridge-marketplace");

        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        const data = await uploadResponse.json();
        onChange(data.secure_url);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Erreur lors de l'upload de l'image");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  if (value) {
    return (
      <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
        <img src={value} alt="Uploaded" className="h-full w-full object-cover" />
        {onRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted">
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Cliquez pour ajouter une image</span>
            <span className="text-xs text-muted-foreground/60">PNG, JPG, WebP jusqu'à 5MB</span>
          </>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
      </label>
    </div>
  );
}
