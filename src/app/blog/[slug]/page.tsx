import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, User } from 'lucide-react'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'

// 1. SEO & Metadata Dinamis
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('title, content, image_url')
    .eq('slug', slug)
    .single()

  if (!post) return { title: 'Artikel Tidak Ditemukan' }

  return {
    title: `${post.title} | Modern Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''), // Hapus tag HTML untuk deskripsi
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      images: post.image_url ? [post.image_url] : [],
    },
  }
}

// 2. Halaman Utama Artikel
export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Ambil data artikel, profil penulis, dan session user sekaligus
  const [postResponse, userResponse] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(full_name, avatar_url)')
      .eq('slug', slug)
      .single(),
    supabase.auth.getUser()
  ])

  const { data: post, error } = postResponse
  const { user } = userResponse.data

  if (error || !post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar & Nav Minimalis */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition">
            <ChevronLeft size={18} />
            Kembali
          </Link>
          <div className="hidden md:block text-sm font-bold truncate max-w-[200px]">
            {post.title}
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </nav>

      <article className="max-w-3xl mx-auto py-12 px-6">
        {/* Header Artikel */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <img 
                src={post.profiles?.avatar_url || 'https://via.placeholder.com/40'} 
                alt="Author" 
                className="w-8 h-8 rounded-full border"
              />
              <span className="font-semibold text-gray-900">{post.profiles?.full_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(post.created_at).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Gambar Utama */}
        {post.image_url && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Isi Konten (TipTap HTML) */}
        {/* 'prose' adalah class dari tailwind typography */}
        <div 
          className="prose prose-lg prose-blue max-w-none mb-16 
          prose-headings:font-black prose-a:text-blue-600 
          prose-img:rounded-2xl prose-pre:bg-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* AdSense Slot 1 (Contoh Penempatan) */}
        <div className="my-10 p-4 bg-gray-50 border border-dashed rounded-xl text-center text-gray-400 text-xs uppercase tracking-widest">
          Iklan AdSense di Sini
        </div>

        <hr className="border-gray-100 my-10" />

        {/* Footer Artikel & Interaksi */}
        <footer className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LikeButton postId={post.id} userId={user?.id} />
              <p className="text-sm text-gray-500 italic">
                Suka dengan artikel ini? Klik ikon hati!
              </p>
            </div>
          </div>

          {/* Section Komentar */}
          <section className="bg-gray-50 -mx-6 px-6 py-12 rounded-t-[3rem]">
            <CommentSection postId={post.id} user={user} />
          </section>
        </footer>
      </article>

      {/* Footer Minimalis */}
      <footer className="py-12 border-t text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Modern Blog. Built with Next.js & Supabase.
      </footer>
    </div>
  )
}