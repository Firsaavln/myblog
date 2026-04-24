import { Code2, MonitorSmartphone, Database } from 'lucide-react'

export default function TechnologyPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto py-20 px-6 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Code2 size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Technology</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Catatan eksplorasi seputar modern web development, dari arsitektur React, implementasi Supabase, hingga perancangan relasi database SQL.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
         {/* Konten akan diisi dengan daftar post kategori teknologi nantinya */}
         <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <MonitorSmartphone size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 text-lg">Kumpulan artikel teknologi sedang disiapkan.</p>
          </div>
      </div>
    </main>
  )
}