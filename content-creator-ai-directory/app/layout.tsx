import type { Metadata } from "next";
import { Raleway, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Content Creator Tools Directory",
  description:
    "Discover the best AI tools for video, copywriting, image, and audio creation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${raleway.variable} ${geistMono.variable} antialiased font-sans`}
        >
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
