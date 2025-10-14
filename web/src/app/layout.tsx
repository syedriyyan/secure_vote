// Use system fonts to avoid build-time network fetch failures
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalLayout } from "@/components/ConditionalLayout";

import { Web3Provider } from "@/lib/web3";

const geistSans = { variable: "--font-geist-sans" } as const;
const geistMono = { variable: "--font-geist-mono" } as const;

export const metadata: Metadata = {
  title: "SecureVote - Blockchain Voting System",
  description: "Secure blockchain-based voting platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex bg-gray-50`}
      >
        <Web3Provider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Web3Provider>
        <Toaster />
      </body>
    </html>
  );
}
