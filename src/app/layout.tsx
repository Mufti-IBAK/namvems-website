// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutClient from "@/components/LayoutClient";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans"
});

export const metadata: Metadata = {
  title: "NAMVEMS - Nigerian Association of Muslim Veterinary Medical Students",
  description: "Official website for NAMVEMS",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${plusJakartaSans.variable} bg-white flex flex-col min-h-screen`}>
        <AuthProvider>
          <Toaster position="bottom-right" />
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}