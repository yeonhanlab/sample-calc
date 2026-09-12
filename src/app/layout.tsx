import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-loaded",
  display: "swap",
});

const lcd = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lcd-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RETRO CALC",
  description:
    "핑크 레트로 픽셀 계산기 — Next.js 16 · TypeScript · decimal.js · Tailwind CSS",
  applicationName: "RETRO CALC",
  appleWebApp: {
    capable: true,
    title: "RETRO CALC",
    statusBarStyle: "black",
  },
  icons: {
    // Browser tab favicon: a pink-dominant variant of the app icon — at
    // 16-32px the app icon's dark LCD bezel downscales into a muddy purple
    // average, so the tab icon gets its own lighter palette (see
    // scripts/generate-icons.mjs). The app/home-screen icon (apple +
    // manifest.ts) keeps the original dark-bezel design.
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#e9b5ca",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // next/font variables live on <html> so Tailwind's @theme `--font-pixel`
    // (resolved at :root) can see `--font-pixel-loaded`; on <body> it can't.
    <html lang="ko" className={`${pixel.variable} ${lcd.variable}`}>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
