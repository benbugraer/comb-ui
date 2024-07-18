import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Provider from "./provider";
import { ThemeProvider } from "@/components/theme-provider";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CombUI | Home",
  description:
    "CombUI is a design system for building modern web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          (clsx("antialiased bg-contrast dark:bg-primary text-primary w-full"),
          urbanist.className)
        }
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <div className="mx-auto px-6 pb-24 pt-16 md:px-6 md:pb-44 md:pt-20">
            <Provider>{children}</Provider>
          </div>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
