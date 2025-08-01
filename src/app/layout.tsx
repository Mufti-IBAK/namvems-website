import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "../components/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const meta Metadata = {
  title: "NAMVEMS - Nigerian Association of Muslim Veterinary Medical Students",
  description: "Official website for NAMVEMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}