import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast'; // 1. Import Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zarie's Modern Blog",
  description: "Eksplorasi wawasan teknologi dan gaya hidup modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased bg-[#FAFAFA] text-gray-900`}>
        <Navbar />
        
        <main>{children}</main>

        <footer className="bg-white border-t border-gray-100 py-12">
          {/* ... isi footer kamu ... */}
        </footer>

        {/* 2. Styling Toast Elegan & Mewah */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#111827', // text-gray-900
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
              borderRadius: '9999px', // Bentuk kapsul (pill)
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid #F3F4F6', // border-gray-100
              padding: '12px 24px',
            },
            success: {
              iconTheme: { primary: '#2563EB', secondary: '#ffffff' }, // Aksen Biru (Azure)
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#ffffff' }, // Merah halus
            },
          }}
        />
      </body>
    </html>
  );
}