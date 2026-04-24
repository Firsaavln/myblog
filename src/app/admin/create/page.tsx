'use client'
import { useState } from 'react'
import { uploadImage } from '@/utils/supabase/storage'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

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
    <div className="max-w-2xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-8">Tulis Artikel Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          type="text" placeholder="Judul Artikel..." 
          className="w-full text-4xl font-bold outline-none border-b focus:border-black pb-2"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <textarea 
          placeholder="Mulai menulis di sini..." 
          className="w-full h-64 text-lg outline-none resize-none"
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button 
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400"
        >
          {loading ? 'Sabar, lagi upload...' : 'Publish Sekarang'}
        </button>
      </form>
    </div>
  )
}