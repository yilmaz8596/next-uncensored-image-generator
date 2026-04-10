"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import DeleteImageModal from "~/components/delete-image-modal";
import { deleteImageProject } from "~/actions/text-to-image";

export interface GeneratedImage {
  id?: string;
  s3_key: string;
  imageUrl: string;
  prompt: string;
  negativePrompt?: string | null;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  seed: number;
  modelId: string;
  timestamp: Date;
}

interface ImageHistoryProps {
  generatedImages: GeneratedImage[];
  onDownload: (img: GeneratedImage) => void;
  onDelete?: (img: GeneratedImage) => void;
}

export default function ImageHistory({
  generatedImages,
  onDownload,
  onDelete,
}: ImageHistoryProps) {
  const [pendingDelete, setPendingDelete] = useState<GeneratedImage | null>(null);

  const handleDeleteConfirm = async (img: GeneratedImage) => {
    if (!img.id) {
      toast.error("Cannot delete: image ID missing");
      return;
    }
    const result = await deleteImageProject(img.id);
    if (result.success) {
      toast.success("Image deleted");
      onDelete?.(img);
    } else {
      toast.error(result.error ?? "Failed to delete image");
    }
    setPendingDelete(null);
  };
  return (
    <div className="border-t border-border bg-card px-2 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2">
            <div className="h-6 w-0.5 rounded-full bg-linear-to-b from-chart-1 to-chart-2"></div>
            <h2 className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-xl font-bold text-transparent">
              Recent Generations
            </h2>
            <div className="h-6 w-0.5 rounded-full bg-linear-to-b from-chart-2 to-chart-1"></div>
          </div>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Your image generation history
          </p>
        </div>

        {generatedImages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {generatedImages.map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <ImageIcon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(img.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={img.imageUrl}
                    alt={img.prompt}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>

                <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                  {img.prompt}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onDownload(img)}
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 gap-1 px-2 text-xs"
                  >
                    <Download className="h-3 w-3" />
                    Open
                  </Button>
                  <Button
                    onClick={() => setPendingDelete(img)}
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="relative mx-auto mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 animate-pulse rounded-full bg-primary/10"></div>
              </div>
              <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border bg-card shadow-sm">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">
                No generations yet
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
                Start by entering a prompt and generating your first image
              </p>
            </div>
          </div>
        )}
      </div>

      <DeleteImageModal
        image={pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
