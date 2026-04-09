"use server";

export async function getUserCredits(): Promise<
  { success: true; credits: number } | { success: false; credits: 0 }
> {
  try {
    // TODO: fetch credits from DB for the current session user
    return { success: true, credits: 0 };
  } catch {
    return { success: false, credits: 0 };
  }
}
