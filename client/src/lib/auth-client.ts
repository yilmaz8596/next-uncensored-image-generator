import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth/client";
import { env } from "~/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [polarClient()],
});