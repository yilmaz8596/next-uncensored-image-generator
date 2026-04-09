"use server";

export async function getUserImageProjects(): Promise<
  | { success: true; imageProjects: object[] }
  | { success: false; imageProjects: [] }
> {
  try {
    // TODO: fetch image projects from DB for the current session user
    return { success: true, imageProjects: [] };
  } catch {
    return { success: false, imageProjects: [] };
  }
}

export async function generateImage(params: {
  prompt: string;
  negative_prompt?: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed?: number;
}): Promise<
  | { success: true; imageUrl: string; s3_key: string; seed?: number; modelId?: string }
  | { success: false; error: string; imageUrl?: never; s3_key?: never }
> {
  try {
    // TODO: call image generation API, upload to S3, save to DB
    console.log("generateImage called with:", params);
    return { success: false, error: "Image generation not yet implemented" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function deleteImageProject(
  projectId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: delete image project from DB and S3
    console.log("deleteImageProject called with:", projectId);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
