// src/components/LayoutClient.tsx
'use client'

import { usePathname } from 'next/navigation';
import AdminLayout from '@/app/(admin)/layout-component'; // Imports the component from Step 1
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If the URL path starts with /admin, render our specialized AdminLayout
  if (pathname.startsWith('/admin')) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // For all other pages, render the public layout
  return (
    <>
      <Header />
      <main className="flex-grow pt-20"> {/* Added padding-top to fix header overlap */}
        {children}
      </main>
      <Footer />
    </>
  );
}