import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/providers";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventory Management | System",
  description: "Restaurant inventory management system",
  generator: "Inventory Management System",
  icons: {
    icon: [
      {
        url: "/inventory-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/inventory-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/inventory-logo.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/inventory-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
