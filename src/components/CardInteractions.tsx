'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Heart, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface CardInteractionsProps {
  postId: string
  slug: string
  initialLikes: number
  initialComments: number
  userId?: string
  initialIsLiked: boolean
}

export default function CardInteractions({
  postId,
  slug,
  initialLikes,
  initialComments,
  userId,
  initialIsLiked
}: CardInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const supabase = createClient()

  // Realtime listener untuk update dari user lain
  useEffect(() => {
    const channel = supabase.channel(`card-likes-${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes', filter: `post_id=eq.${postId}` }, 
      () => {
        // Ambil jumlah like terbaru jika ada perubahan di background
        const fetchCount = async () => {
          const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('post_id', postId)
          if (count !== null) setLikes(count)
        }
        fetchCount()
      })
      .subscribe()
      
    return () => { supabase.removeChannel(channel) }
  }, [postId, supabase])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // Mencegah klik menyebar (misal jika ada link pembungkus)
    if (!userId) return toast.error('Silakan Sign In untuk menyukai artikel!')

    // Optimistic UI: Berubah instan di layar
    const wasLiked = isLiked
    setIsLiked(!wasLiked)
    setLikes(prev => wasLiked ? prev - 1 : prev + 1)

    // Kirim data ke database di background
    try {
      if (wasLiked) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId)
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: userId })
      }
    } catch (error) {
      setIsLiked(wasLiked)
      setLikes(prev => wasLiked ? prev + 1 : prev - 1)
      toast.error('Gagal memproses like')
    }
  }

  return (
    <div className="flex items-center gap-4 text-gray-400 text-sm">
      {/* Tombol Like (Interaktif) */}
      <button 
        onClick={handleLike} 
        className="flex items-center gap-1.5 hover:text-red-500 transition-colors group cursor-pointer"
        title={isLiked ? "Batal Suka" : "Sukai Artikel"}
      >
        <Heart 
          size={18} 
          className={`transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'group-hover:scale-110'}`} 
        />
        <span className={`${isLiked ? 'text-red-500 font-bold' : 'font-medium'}`}>{likes}</span>
      </button>

      {/* Tombol Komentar (Arahkan ke detail artikel bagian komentar) */}
      <Link 
        href={`/blog/${slug}#comments`} 
        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group"
      >
        <MessageCircle size={18} className="group-hover:scale-110 transition-transform duration-300" />
        <span className="font-medium">{initialComments}</span>
      </Link>
    </div>
  )
}