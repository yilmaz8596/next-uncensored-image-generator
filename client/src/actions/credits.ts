"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import prisma from "~/lib/prisma";

export async function getUserCredits(): Promise<
  { success: true; credits: number } | { success: false; credits: 0 }
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { success: false, credits: 0 };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return { success: true, credits: user?.credits ?? 0 };
  } catch {
    return { success: false, credits: 0 };
  }
}
