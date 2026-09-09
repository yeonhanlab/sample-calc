import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

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
};

export const viewport: Viewport = {
  themeColor: "#250a1b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${pixel.variable} ${lcd.variable}`}>{children}</body>
    </html>
  );
}
