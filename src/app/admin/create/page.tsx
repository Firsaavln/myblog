'use client'
import { useState } from 'react'
import { uploadImage } from '@/utils/supabase/storage'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ImagePlus, Send, LayoutDashboard } from 'lucide-react'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ''
      if (file) imageUrl = await uploadImage(file)

      const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

      const { error } = await supabase.from('posts').insert([
        { title, content, slug, image_url: imageUrl, is_published: true }
      ])

      if (error) throw error
      alert('Artikel berhasil tayang!')
      router.push('/')
    } catch (err) {
      alert('Gagal posting artikel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-4xl mx-auto py-12 px-6">
        
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" /> Editor Artikel
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input Judul */}
          <div>
            <input 
              type="text" 
              placeholder="Judul Artikel Anda..." 
              className="w-full text-4xl md:text-5xl font-black text-gray-900 placeholder-gray-300 outline-none bg-transparent"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Area Upload Gambar */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition">
            <input 
              type="file" 
              id="cover-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="cover-upload" className="cursor-pointer flex flex-col items-center gap-3 text-gray-500">
              <ImagePlus size={40} className="text-gray-300" />
              <span className="font-medium text-sm">{file ? file.name : 'Klik untuk upload gambar cover (Opsional)'}</span>
            </label>
          </div>

          {/* Area Teks Konten */}
          <div className="bg-[#FAFAFA] rounded-2xl border border-gray-100 p-2">
            <textarea 
              placeholder="Mulai menulis cerita Anda di sini..." 
              className="w-full h-96 p-6 text-lg text-gray-700 bg-transparent outline-none resize-none leading-relaxed"
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Action Bar Bawah (Sticky) */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-200 px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50">
            <span className="text-sm font-medium text-gray-500 hidden md:block">Status: <span className="text-orange-500">Draft</span></span>
            <button 
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send size={16} />
              {loading ? 'Menyimpan...' : 'Publish Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}