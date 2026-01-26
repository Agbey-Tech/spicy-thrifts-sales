import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spicy Thrifts POS | Internal Management",
  description:
    "Spicy Thrifts Point of Sale System – Internal platform for staff to manage sales, inventory, and operations. Secure, efficient, and designed for internal use only.",
  keywords: [
    "Spicy Thrifts",
    "POS",
    "Point of Sale",
    "Inventory Management",
    "Sales Management",
    "Internal System",
    "Staff Dashboard",
    "Retail",
    "Operations",
  ],
  authors: [{ name: "Spicy Thrifts", url: "https://spicythrifts.com" }],
  creator: "Spicy Thrifts",
  openGraph: {
    title: "Spicy Thrifts POS | Internal Management",
    description:
      "Internal platform for Spicy Thrifts staff to manage sales, inventory, and operations.",
    url: "https://spicythrifts.com",
    siteName: "Spicy Thrifts POS",
    images: [
      {
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Spicy Thrifts POS System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // themeColor: "#111827",
  // manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="application-name" content="Spicy Thrifts POS" />
        <meta name="author" content="Spicy Thrifts" />
        <meta name="copyright" content="© 2026 Spicy Thrifts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph and other meta tags are handled by Next.js metadata */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
