import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import prisma from "~/lib/prisma";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

const PRODUCT_CREDITS: Record<string, number> = {
  "a9aa27ce-a3ba-46bd-b185-0d421a28dd8c": 50,
  "d06706c3-b785-4a89-b7cb-d85620cf5d2e": 100,
  "3d40a70d-cfe9-42a9-8f11-573ae2566fa9": 200,
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            { productId: "a9aa27ce-a3ba-46bd-b185-0d421a28dd8c", slug: "beginner" },
            { productId: "d06706c3-b785-4a89-b7cb-d85620cf5d2e", slug: "pro" },
            { productId: "3d40a70d-cfe9-42a9-8f11-573ae2566fa9", slug: "elite" },
          ],
          successUrl: "/dashboard/upgrade?success=true&checkoutId={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onOrderPaid: async (payload) => {
            try {
              const productId = payload.data.productId;
              const externalId = payload.data.customer.externalId;
              const customerEmail = payload.data.customer.email;
              const creditsToAdd = productId ? PRODUCT_CREDITS[productId] : undefined;

              console.log("[polar webhook] order.paid", { productId, externalId, customerEmail, creditsToAdd });

              if (!creditsToAdd) {
                console.log("[polar webhook] unknown productId:", productId);
                return;
              }

              // Try externalId (our DB user ID) first, fall back to email
              const user = externalId
                ? await prisma.user.findUnique({ where: { id: externalId } })
                : null;

              if (user) {
                const updated = await prisma.user.update({
                  where: { id: user.id },
                  data: { credits: { increment: creditsToAdd } },
                });
                console.log("[polar webhook] credits updated via externalId, new credits:", updated.credits);
              } else if (customerEmail) {
                const emailUser = await prisma.user.findUnique({ where: { email: customerEmail } });
                if (emailUser) {
                  const updated = await prisma.user.update({
                    where: { id: emailUser.id },
                    data: { credits: { increment: creditsToAdd } },
                  });
                  console.log("[polar webhook] credits updated via email, new credits:", updated.credits);
                } else {
                  console.error("[polar webhook] no user found for externalId or email — skipping");
                }
              } else {
                console.error("[polar webhook] no externalId or email — skipping");
              }
            } catch (e) {
              // Log but never re-throw: the plugin returns 400 on any thrown error,
              // causing Polar to disable the webhook after repeated failures.
              console.error("[polar webhook] handler error:", e);
            }
          },
        }),
      ],
    }),
  ],
});