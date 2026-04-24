import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Share2, Bookmark } from 'lucide-react'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [postResponse, userResponse] = await Promise.all([
    supabase.from('posts').select('*, profiles(full_name, avatar_url)').eq('slug', slug).single(),
    supabase.auth.getUser()
  ])

  const { data: post, error } = postResponse
  const { user } = userResponse.data

  if (error || !post) notFound()

  return (
    <div className="bg-white min-h-screen">
      <article className="max-w-3xl mx-auto py-16 px-6">
        
        {/* Navigasi Kembali */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm mb-12">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        {/* Header Artikel */}
        <header className="mb-12">
          {/* Label/Kategori (Opsional, bisa diubah dinamis nanti) */}
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Technology
          </span>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between border-y border-gray-100 py-4">
            <div className="flex items-center gap-4">
              <img src={post.profiles?.avatar_url || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full border border-gray-200" />
              <div>
                <p className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  <User size={14} className="text-gray-400" /> {post.profiles?.full_name}
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                  <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Aksi Share & Save */}
            <div className="flex items-center gap-3 text-gray-400">
              <button className="p-2 hover:bg-gray-50 hover:text-blue-600 rounded-full transition"><Share2 size={18} /></button>
              <button className="p-2 hover:bg-gray-50 hover:text-blue-600 rounded-full transition"><Bookmark size={18} /></button>
            </div>
          </div>
        </header>

        {/* Gambar Cover */}
        {post.image_url && (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Konten Artikel */}
        <div 
          className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="my-16 border-gray-100" />

        {/* Interaksi Bawah */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4 mb-10">
            <LikeButton postId={post.id} userId={user?.id} />
            <span className="text-sm text-gray-500 font-medium">Berikan apresiasi jika tulisan ini bermanfaat.</span>
          </div>
          <CommentSection postId={post.id} user={user} />
        </div>

      </article>
    </div>
  )
}