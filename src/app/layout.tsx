import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedTranslate - Healthcare Doctor-Patient Translation",
  description: "Real-time translation bridge between doctors and patients. Support for multiple languages with AI-powered translation and medical summarization.",
  keywords: ["healthcare", "translation", "doctor", "patient", "medical", "AI", "multilingual"],
  authors: [{ name: "MedTranslate Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
