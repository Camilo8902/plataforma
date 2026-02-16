import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MultiVend - Multi-Tenant SaaS Marketplace",
    template: "%s | MultiVend",
  },
  description: "A sophisticated multi-tenant marketplace platform with elegant luxury aesthetics",
  keywords: ["multi-tenant", "saas", "marketplace", "e-commerce", "luxury"],
  authors: [{ name: "MultiVend Team" }],
  openGraph: {
    title: "MultiVend - Multi-Tenant SaaS Marketplace",
    description: "A sophisticated multi-tenant marketplace platform with elegant luxury aesthetics",
    type: "website",
    locale: "en_US",
  },
};

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${outfit.variable} font-body antialiased bg-background text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
