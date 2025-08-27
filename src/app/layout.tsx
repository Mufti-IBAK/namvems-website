// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';

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
      {/* The body tag is the direct and only child of html */}
      <body className={`${inter.className} bg-white`}>
        {/* The AuthProvider wraps everything inside the body */}
        <AuthProvider>
          {/* The Toaster is a direct child of the provider, ensuring it has context */}
          <Toaster position="bottom-right" />
          {/* The children (your page layouts) are siblings to the Toaster */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}