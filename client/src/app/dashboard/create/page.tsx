"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateImage as generateImageAction,
  getUserImageProjects,
} from "~/actions/text-to-image";
import { toast } from "sonner";

import ImageSettings from "~/components/image-settings";
import PromptInput from "~/components/prompt-input";
import ImageHistory from "~/components/image-history";

export interface GeneratedImage {
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

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [numInferenceSteps, setNumInferenceSteps] = useState(9);
  const [guidanceScale, setGuidanceScale] = useState(0);
  const [seed, setSeed] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [, projectsResult] = await Promise.all([
          authClient.getSession(),
          getUserImageProjects(),
        ]);

        if (projectsResult.success && projectsResult.imageProjects) {
          const mappedProjects = (
            projectsResult.imageProjects as {
              s3Key: string;
              imageUrl: string;
              prompt: string;
              negativePrompt: string | null;
              width: number;
              height: number;
              numInferenceSteps: number;
              guidanceScale: number;
              seed: number;
              modelId: string;
              createdAt: string | Date;
            }[]
          ).map((project) => ({
            s3_key: project.s3Key,
            imageUrl: project.imageUrl,
            prompt: project.prompt,
            negativePrompt: project.negativePrompt,
            width: project.width,
            height: project.height,
            numInferenceSteps: project.numInferenceSteps,
            guidanceScale: project.guidanceScale,
            seed: project.seed,
            modelId: project.modelId,
            timestamp: new Date(project.createdAt),
          }));
          setGeneratedImages(mappedProjects);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeData();
  }, []);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt!");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateImageAction({
        prompt,
        negative_prompt: negativePrompt.trim() ? negativePrompt.trim() : undefined,
        width,
        height,
        num_inference_steps: numInferenceSteps,
        guidance_scale: guidanceScale,
        seed: seed.trim() ? parseInt(seed, 10) : undefined,
      });

      if (!result.success || !result.imageUrl || !result.s3_key) {
        throw new Error(result.error ?? "Generation failed");
      }

      router.refresh();

      const newImage: GeneratedImage = {
        s3_key: result.s3_key,
        imageUrl: result.imageUrl,
        prompt,
        negativePrompt: negativePrompt.trim() ? negativePrompt.trim() : null,
        width,
        height,
        numInferenceSteps,
        guidanceScale,
        seed: result.seed ?? (seed.trim() ? parseInt(seed, 10) : 0),
        modelId: result.modelId ?? "Tongyi-MAI/Z-Image-Turbo",
        timestamp: new Date(),
      };

      setCurrentImage(newImage);
      setGeneratedImages([newImage, ...generatedImages].slice(0, 20));
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate image";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="min-h-screen">
          {/* Header */}
          <div className="border-border bg-card mb-4 rounded-lg border p-4 text-center">
            <h1 className="text-foreground mb-1 text-lg font-bold">
              Text-to-Image Generator
            </h1>
            <p className="text-muted-foreground mx-auto max-w-xl text-xs">
              Generate images from text prompts
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left – Settings */}
            <div className="order-2 space-y-3 lg:order-1 lg:col-span-1">
              <ImageSettings
                prompt={prompt}
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                numInferenceSteps={numInferenceSteps}
                setNumInferenceSteps={setNumInferenceSteps}
                guidanceScale={guidanceScale}
                setGuidanceScale={setGuidanceScale}
                seed={seed}
                setSeed={setSeed}
                isGenerating={isGenerating}
                onGenerate={generateImage}
              />
            </div>

            {/* Right – Prompt & Preview */}
            <div className="order-1 space-y-3 lg:order-2 lg:col-span-2">
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                currentImage={currentImage}
                onDownload={(img) => window.open(img.imageUrl, "_blank")}
              />
            </div>
          </div>

          {/* History */}
          <div className="mt-6">
            <ImageHistory
              generatedImages={generatedImages}
              onDownload={(img) => window.open(img.imageUrl, "_blank")}
            />
          </div>
        </div>
      </SignedIn>
    </>
  );
}
