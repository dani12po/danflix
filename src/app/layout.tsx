import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StreamFlix - Watch Movies & Series Online",
  description: "Stream your favorite movies and series in HD quality. Unlimited entertainment at your fingertips.",
  keywords: ["movies", "series", "streaming", "online", "watch", "HD"],
  authors: [{ name: "StreamFlix" }],
  openGraph: {
    title: "StreamFlix - Watch Movies & Series Online",
    description: "Stream your favorite movies and series in HD quality.",
    type: "website",
    locale: "en_US",
    siteName: "StreamFlix",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamFlix - Watch Movies & Series Online",
    description: "Stream your favorite movies and series in HD quality.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
