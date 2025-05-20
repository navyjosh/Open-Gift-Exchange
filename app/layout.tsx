import { Providers } from "./providers";
import { AuthButtons } from "@/components/AuthButtons";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link'


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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white`}>
        <Providers>
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <h1 className="text-xl font-bold">
              <Link href="/">Wishlist</Link>
            </h1>
            <AuthButtons />
          </header>
          <main className="px-6 py-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
