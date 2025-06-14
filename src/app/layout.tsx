
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Auctopus',
  description: 'A fully decentralized Auction platform deployed on Ethereum.',
}
 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {children}
      </body>
    </html>
  );
}
