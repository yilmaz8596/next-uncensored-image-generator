# SnapShot — Uncensored AI Image Generator

A full-stack AI image generation platform powered by Stable Diffusion, built with Next.js 15, deployed on Railway, and backed by a Modal serverless GPU backend.

Users get **10 free credits** on sign-up and can purchase more via Polar. Each image generation costs 1 credit and is stored permanently in S3.

---

## Features

- **Uncensored image generation** — runs `Tongyi-MAI/Z-Image-Turbo` via HuggingFace Diffusers on a Modal serverless GPU (no content filtering)
- **Fine-grained controls** — width, height, inference steps, guidance scale, and seed for reproducible results
- **Credit system** — 10 free credits on sign-up; buy more with one-time credit packs via Polar
- **Image history** — every generation saved to S3 and PostgreSQL; browsable, searchable, sortable, and deletable
- **Polar billing** — Beginner (50 credits), Pro (100 credits), and Elite (200 credits) packs; webhook auto-credits on payment
- **Polar customer portal** — one-click access to billing history and receipts
- **Auth** — email/password via Better Auth with session management and password change
- **Animated landing page** — Framer Motion scroll animations and demo gallery
- **Mobile-responsive** — sheet-based sidebar on small screens

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Framer Motion |
| Auth | Better Auth v1.6 + `@daveyplate/better-auth-ui` |
| Payments | Polar (`@polar-sh/better-auth`, `@polar-sh/nextjs`) |
| Database | PostgreSQL via Prisma 6 + `@prisma/adapter-pg` |
| Storage | AWS S3 |
| AI Backend | Modal (serverless GPU) + HuggingFace Diffusers |
| Deployment | Railway (Docker) + GitHub Actions CI/CD |
| Validation | Zod + `@t3-oss/env-nextjs` |
| Forms | React Hook Form + Zod resolvers |
| Notifications | Sonner |
| Icons | Lucide React + HugeIcons |

---

## Project Structure

```
├── api/
│   └── text-to-image/
│       ├── text-to-image.py      # Modal serverless GPU endpoint (Stable Diffusion)
│       └── requirements.txt
├── client/                       # Next.js application
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── actions/              # Server actions
│   │   │   ├── credits.ts        # getUserCredits()
│   │   │   └── text-to-image.ts  # generateImage(), getUserImageProjects(), deleteImageProject()
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── auth/[path]/  # Sign in, sign up, forgot password
│   │   │   ├── api/auth/[...all] # Better Auth API handler
│   │   │   ├── dashboard/
│   │   │   │   ├── create/       # Image generation
│   │   │   │   ├── customer-portal/ # Polar portal redirect
│   │   │   │   ├── projects/     # Image history
│   │   │   │   ├── settings/     # Account & security
│   │   │   │   └── upgrade/      # Credit purchase
│   │   │   └── page.tsx          # Landing page
│   │   ├── components/
│   │   │   ├── sidebar/          # App sidebar, credits display, nav items
│   │   │   └── ui/               # shadcn/ui primitives
│   │   ├── lib/
│   │   │   ├── auth.ts           # Better Auth config + Polar plugin
│   │   │   ├── auth-client.ts    # Client-side auth instance
│   │   │   └── prisma.ts         # Prisma singleton
│   │   └── env.js                # Type-safe environment variables
│   ├── railway.toml
│   └── package.json
├── Dockerfile                    # Used by Railway
└── .github/workflows/ci-cd.yml   # CI (lint + typecheck) + Railway deploy
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database
- [Modal](https://modal.com) account with the `text-to-image` app deployed
- AWS S3 bucket
- [Polar](https://polar.sh) account (sandbox for development)

### 1. Clone and install

```bash
git clone https://github.com/your-username/next-uncensored-image-generator
cd next-uncensored-image-generator/client
npm install
```

### 2. Set up environment variables

Create `client/.env` (copy from below and fill in your values):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/snapshot"

# Better Auth
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# App URL (used in auth client)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Polar (use sandbox for development)
POLAR_ACCESS_TOKEN="your-polar-access-token"
POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"

# Modal (serverless GPU endpoint)
MODAL_URL="https://your-org--text-to-image-model-generate.modal.run"

# AWS S3
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_REGION="eu-north-1"
```

### 3. Run database migrations

```bash
npm run db:generate   # create + apply migrations (development)
# or
npm run db:migrate    # apply existing migrations (production)
```

### 4. Deploy the Modal backend

```bash
cd ../api/text-to-image

# Set Modal secrets:
# modal secret create aws-s3-secret AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=...
# modal secret create hf-secret HF_TOKEN=...

modal deploy text-to-image.py
```

Copy the generated endpoint URL into `MODAL_URL`.

### 5. Start the development server

```bash
cd ../../client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables Reference

### Server-side

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ | Auth signing secret (32+ random chars) |
| `BETTER_AUTH_URL` | ✅ | Full app URL (e.g. `https://your-app.railway.app`) |
| `POLAR_ACCESS_TOKEN` | ✅ | Polar API access token |
| `POLAR_WEBHOOK_SECRET` | ✅ | Polar webhook signing secret |
| `MODAL_URL` | ✅ | Modal serverless endpoint URL |
| `NODE_ENV` | ✅ | `development` or `production` |

### Client-side (build-time)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | ✅ | Full app URL (baked into JS bundle) |

---

## Polar Payments Setup

1. Create a Polar account at [polar.sh](https://polar.sh) and enable sandbox mode
2. Create three one-time products with these IDs in `client/src/lib/auth.ts`:
   - **Beginner** — 50 credits
   - **Pro** — 100 credits
   - **Elite** — 200 credits
3. Add a webhook pointing to:
   ```
   https://your-app.railway.app/api/auth/polar/webhooks
   ```
   Select the `order.paid` event and copy the signing secret into `POLAR_WEBHOOK_SECRET`
4. Set `POLAR_ACCESS_TOKEN` from your Polar API settings

---

## Database Schema

### `User`
- `id`, `name`, `email`, `emailVerified`, `image`
- **`credits Int @default(10)`** — decremented on each image generation
- Relations: `sessions`, `accounts`, `imageProjects`

### `ImageProject`
- `id` (CUID), `prompt`, `negativePrompt?`, `name?`
- `imageUrl` (public S3 URL), `s3Key`
- `width`, `height`, `numInferenceSteps`, `guidanceScale`, `seed` (BigInt)
- `modelId` — the HuggingFace model used
- `userId` (FK → User, cascade delete)

---

## Deployment (Railway)

### Railway Variables

| Variable | Value |
|---|---|
| `DATABASE_URL` | Railway internal Postgres URL |
| `BETTER_AUTH_URL` | `https://your-app.up.railway.app` |
| `BETTER_AUTH_SECRET` | Generated secret |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.up.railway.app` |
| `POLAR_ACCESS_TOKEN` | From Polar dashboard |
| `POLAR_WEBHOOK_SECRET` | From Polar webhook settings |
| `MODAL_URL` | Modal endpoint URL |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

### Pre-deploy command (Railway Settings → Deploy)

```bash
npx prisma migrate deploy
```

### GitHub Actions CI/CD

The `.github/workflows/ci-cd.yml` pipeline runs on every push to `main`:

1. **CI** — type-check (`tsc --noEmit`) + lint (`eslint src`)
2. **Deploy** — `railway up` deploys via Docker to Railway

Required GitHub secrets: `RAILWAY_TOKEN`  
Required GitHub variables: `RAILWAY_SERVICE_NAME`

---

## Scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run typecheck    # TypeScript type checking
npm run db:generate  # Create and apply new migrations
npm run db:migrate   # Apply existing migrations (production)
```

---

## License

MIT
