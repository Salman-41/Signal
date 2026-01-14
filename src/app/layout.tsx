import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Signal | Trend Intelligence Platform",
  description:
    "Understand what is changing, where, and how fast. Real-time signal detection across economic, climate, technology, and public interest indicators.",
  keywords: [
    "trends",
    "signals",
    "economic data",
    "climate data",
    "technology trends",
    "data visualization",
    "intelligence platform",
  ],
  authors: [{ name: "Signal" }],
  openGraph: {
    title: "Signal | Trend Intelligence Platform",
    description:
      "Real-time signal detection across economic, climate, technology, and public interest indicators.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal | Trend Intelligence Platform",
    description:
      "Real-time signal detection across economic, climate, technology, and public interest indicators.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#f9fafb] text-[#0f172a] antialiased">
        <SmoothScrollProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
