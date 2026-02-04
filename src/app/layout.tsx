import type { Metadata } from "next";
import { Rubik, Bree_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const breeSerif = Bree_Serif({
  variable: "--font-bree-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modular Vector Playground",
  description: "Compose, layer, and export Lucide SVGs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.variable} ${breeSerif.variable} antialiased font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
