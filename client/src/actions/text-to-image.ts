"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import prisma from "~/lib/prisma";


export async function getUserImageProjects(): Promise<
  | { success: true; imageProjects: object[] }
  | { success: false; imageProjects: [] }
> {
  try {
    // TODO: fetch image projects from DB for the current session user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, imageProjects: [] };

    const userId = session.user.id;
    const imageProjects = await prisma.imageProject.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, imageProjects };
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
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    const resp = await fetch(`${process.env.MODAL_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params), // userId is not part of the Pydantic Req model
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      return { success: false, error: `Generation API error: ${errorText}` };
    }

    const data = await resp.json() as {
      image_url: string;
      image_s3_key: string;
      seed: number;
      model_id: string;
    };

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });

    await prisma.imageProject.create({
      data: {
        userId,
        s3Key: data.image_s3_key,
        imageUrl: data.image_url,
        prompt: params.prompt,
        negativePrompt: params.negative_prompt,
        width: params.width,
        height: params.height,
        numInferenceSteps: params.num_inference_steps,
        guidanceScale: params.guidance_scale,
        seed: data.seed,
        modelId: data.model_id,
      },
    });

    console.log(data);
    return {
      success: true,
      imageUrl: data.image_url,
      s3_key: data.image_s3_key,
      seed: data.seed,
      modelId: data.model_id,
    };
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
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.imageProject.delete({
      where: { id: projectId, userId: session.user.id },
    });
    console.log("deleteImageProject called with:", projectId);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
