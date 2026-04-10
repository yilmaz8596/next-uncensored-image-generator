"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";

export default function Upgrade() {
  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="group/upgrade relative ml-2 overflow-hidden border-orange-400/50 text-orange-400 transition-all duration-300 hover:border-orange-500/70 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
      style={{
        background: "linear-gradient(to right, color-mix(in srgb, orange 10%, transparent), color-mix(in srgb, pink 10%, transparent))",
      }}
    >
      <Link href="/dashboard/upgrade">
        <div className="relative z-10 flex items-center gap-2">
          <Crown className="h-4 w-4 transition-transform duration-300 group-hover/upgrade:rotate-12" />
          <span className="font-medium">Upgrade</span>
          <Sparkles className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover/upgrade:opacity-100" />
        </div>
        <div className="absolute inset-0 z-0 rounded-md opacity-0 transition-opacity duration-300 group-hover/upgrade:opacity-100"
          style={{ background: "linear-gradient(to right, #f97316, #ec4899)" }}
        />
      </Link>
    </Button>
  );
}
