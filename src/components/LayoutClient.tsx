// src/components/LayoutClient.tsx
'use client'

import { usePathname } from 'next/navigation';
import AdminLayout from '@/app/(admin)/layout-component';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}