import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutClient from "@/components/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
      {/* FIX: The flexbox layout is now defined on the body tag */}
      <body className={`${inter.className} bg-white flex flex-col min-h-screen`}>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}