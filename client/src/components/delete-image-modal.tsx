"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { GeneratedImage } from "~/components/image-history";

interface DeleteImageModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onConfirm: (image: GeneratedImage) => Promise<void>;
}

export default function DeleteImageModal({
  image,
  onClose,
  onConfirm,
}: DeleteImageModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!image) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(image);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image preview */}
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <Image
            src={image.imageUrl}
            alt={image.prompt}
            fill
            unoptimized
            className="object-cover opacity-40"
          />
          {/* Destructive overlay icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive/60 bg-destructive/20 shadow-lg">
              <Trash2 className="h-7 w-7 text-destructive" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-1 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <h2
              id="delete-modal-title"
              className="text-base font-semibold text-foreground"
            >
              Delete Image
            </h2>
          </div>
          <p className="mb-1 text-sm text-muted-foreground">
            This action cannot be undone. The image will be permanently removed.
          </p>
          <p className="line-clamp-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs italic text-muted-foreground">
            &ldquo;{image.prompt}&rdquo;
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-border px-6 pb-6 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
