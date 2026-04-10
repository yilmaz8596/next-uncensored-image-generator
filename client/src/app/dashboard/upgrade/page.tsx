"use client";

import { Check, Coins, Crown, Sparkles, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const CREDIT_PACKAGES = [
  {
    id: "a9aa27ce-a3ba-46bd-b185-0d421a28dd8c",
    credits: 50,
    price: 2.99,
    highlight: false,
    icon: Coins,
    perCredit: "$0.10",
    features: ["50 image generations", "All styles & models", "S3 cloud storage", "Image history"],
  },
  {
    id: "d06706c3-b785-4a89-b7cb-d85620cf5d2e",
    credits: 100,
    price: 4.99,
    label: "Pro Pack",
    highlight: true,
    icon: Zap,
    perCredit: "$0.09",
    features: ["100 image generations", "All styles & models", "S3 cloud storage", "Image history", "Priority queue"],
  },
  {
    id: "3d40a70d-cfe9-42a9-8f11-573ae2566fa9",
    credits: 200,
    price: 6.99,
    label: "Elite Pack",
    highlight: false,
    icon: Crown,
    perCredit: "$0.07",
    features: ["200 image generations", "All styles & models", "S3 cloud storage", "Image history", "Priority queue", "Best value"],
  },
];

function CreditPackageCard({
  pkg,
}: {
  pkg: (typeof CREDIT_PACKAGES)[number];
}) {
  const Icon = pkg.icon;
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        pkg.highlight
          ? "border-orange-500/60 bg-linear-to-b from-orange-500/10 to-transparent shadow-lg shadow-orange-500/10"
          : "border-border bg-card hover:border-orange-500/30"
      }`}
    >
      {pkg.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 rounded-full bg-linear-to-r from-orange-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white shadow">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div
          className={`rounded-xl p-2.5 ${
            pkg.highlight
              ? "bg-linear-to-br from-orange-500 to-pink-500 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{pkg.label}</h3>
          <p className="text-xs text-muted-foreground">{pkg.perCredit} per credit</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold text-foreground">${pkg.price}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-orange-400">{pkg.credits} credits</span> one-time
        </p>
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 shrink-0 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={() => authClient.checkout({ products: [pkg.id] })}
        className={`w-full font-semibold ${
          pkg.highlight
            ? "bg-linear-to-r from-orange-500 to-pink-500 text-white hover:opacity-90"
            : "border border-orange-400/50 bg-transparent text-orange-400 hover:bg-orange-500/10"
        }`}
        variant={pkg.highlight ? "default" : "outline"}
      >
        Get {pkg.credits} Credits
      </Button>
    </div>
  );
}

function SuccessBanner() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
      <Check className="h-5 w-5 shrink-0" />
      <p className="text-sm font-medium">
        Payment successful! Your credits have been added and are ready to use.
      </p>
    </div>
  );
}

function UpgradeContent() {
  const params = useSearchParams();
  const success = params.get("success") === "true";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {success && <SuccessBanner />}

      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <span className="flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400">
            <Crown className="h-4 w-4" />
            Upgrade Your Credits
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Choose a Credit Package
        </h1>
        <p className="mt-3 text-muted-foreground">
          One-time purchase. Credits never expire. Unlock uncensored AI image generation.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {CREDIT_PACKAGES.map((pkg) => (
          <CreditPackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Secure checkout powered by Polar &middot; No subscription &middot; Credits added instantly after payment
      </p>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <UpgradeContent />
  );
}
