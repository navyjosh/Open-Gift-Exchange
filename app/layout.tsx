import { Providers } from "./providers";
import { AuthButtons } from "@/components/AuthButtons";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LayoutShell from "@/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wishlist",
  description: "A simple wishlist / gift exchange webapp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white`}
      >
        <Providers>
          {/* Client component needed to conditionally render header */}
          <LayoutShell>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
