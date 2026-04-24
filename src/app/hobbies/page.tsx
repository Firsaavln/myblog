import { Camera, Wrench, TrendingUp } from 'lucide-react'

export default function HobbiesPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto py-20 px-6 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center"><Wrench size={24} /></div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><TrendingUp size={24} /></div>
            <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center"><Camera size={24} /></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Hobbies & Lifestyle</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Ruang berbagi di luar layar monitor. Mulai dari diskusi maintenance motor klasik seperti Vespa Sprint 1976 dan Honda Accord, hingga analisa siklus dividen blue-chip di pasar saham.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
         <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <p className="text-gray-400 text-lg">Artikel hobi dan gaya hidup akan segera hadir.</p>
          </div>
      </div>
    </main>
  )
}