import "~/styles/globals.css";

import { type Metadata } from "next";
import {cn} from "../lib/utils";
import { Nunito, Geist_Mono } from "next/font/google";
import { Providers } from "../components/providers";
import { Toaster } from "sonner";
import { TooltipProvider } from "../components/ui/tooltip";

const fontSans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
});


export const metadata: Metadata = {
  title: "SnapShot - Uncensored Image Generation",
  description: "Generate uncensored images with ease. Powered by Stable Diffusion and hosted on AWS.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(fontSans.variable)}>
      <body>
        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
