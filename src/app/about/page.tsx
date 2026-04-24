'use client' // Tambahkan ini untuk memastikan komponen berjalan lancar di sisi client
import { User, Mail, Globe, Info } from 'lucide-react' 

// PASTIKAN ada kata 'export default function'
export default function AboutPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="shrink-0 relative">
            {/* Menggunakan Placeholder div jika gambar belum ada */}
            <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
              <User size={64} className="text-blue-200" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info size={20} className="text-blue-600" />
              <h1 className="text-3xl font-black text-gray-900">Tentang Zarie</h1>
            </div>
            <p className="text-blue-600 font-semibold mb-6">Web Developer & Tech Enthusiast</p>
            
            <div className="prose prose-gray max-w-none text-gray-600 mb-8 leading-relaxed">
              <p>
                Halo! Saya adalah seorang developer yang memiliki passion dalam membangun aplikasi web modern dan efisien. Fokus utama saya saat ini berada di ekosistem React, Node.js, dan pengelolaan database menggunakan Supabase.
              </p>
              <p>
                Selain menulis kode, saya menggunakan blog ini sebagai jurnal digital untuk mendokumentasikan perjalanan saya—baik itu saat merancang sistem, maupun sekadar menikmati hobi merawat kendaraan klasik dan memantau pasar saham.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Globe size={18} />
              </a>
              <a href="mailto:contact@zarie.com" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}