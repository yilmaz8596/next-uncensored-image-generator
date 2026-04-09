"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";

export default function Upgrade() {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "6c84189e-1ce2-4214-ac43-b439bb1e544e",
        "038b2068-adb4-4d8b-803c-640462f71ed4",
        "dd2f6988-aa65-476f-abec-f25c2ba0c58b",
      ],
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="group/upgrade relative ml-2 overflow-hidden border-orange-400/50 text-orange-400 transition-all duration-300 hover:border-orange-500/70 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
      style={{
        background: "linear-gradient(to right, color-mix(in srgb, orange 10%, transparent), color-mix(in srgb, pink 10%, transparent))",
      }}
      onClick={upgrade}
    >
      <div className="relative z-10 flex items-center gap-2">
        <Crown className="h-4 w-4 transition-transform duration-300 group-hover/upgrade:rotate-12" />
        <span className="font-medium">Upgrade</span>
        <Sparkles className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover/upgrade:opacity-100" />
      </div>
      <div className="absolute inset-0 z-0 rounded-md opacity-0 transition-opacity duration-300 group-hover/upgrade:opacity-100"
        style={{ background: "linear-gradient(to right, #f97316, #ec4899)" }}
      />
    </Button>
  );
}
