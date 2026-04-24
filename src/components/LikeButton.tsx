'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LikeButton({ postId, userId }: { postId: string, userId?: string }) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('post_id', postId)
      setLikes(count || 0)

      if (userId) {
        const { data } = await supabase.from('likes').select('*').eq('post_id', postId).eq('user_id', userId).single()
        if (data) setIsLiked(true)
      }
    }
    getData()

    // Realtime listener: jika ada user lain ngelike, angka kita ikut berubah!
    const channel = supabase.channel(`likes-${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes', filter: `post_id=eq.${postId}` }, 
      () => {
        getData() // Refresh hitungan jika ada perubahan dari luar
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [postId, userId])

  const handleLike = async () => {
    if (!userId) return toast.error('Silakan Sign In untuk menyukai artikel!')

    // OPTIMISTIC UI: Ubah UI duluan secepat kilat!
    const wasLiked = isLiked
    setIsLiked(!wasLiked)
    setLikes(prev => wasLiked ? prev - 1 : prev + 1)

    // Background process ke Supabase
    try {
      if (wasLiked) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId)
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: userId })
      }
    } catch (error) {
      // Rollback jika ternyata gagal kirim ke database
      setIsLiked(wasLiked)
      setLikes(prev => wasLiked ? prev + 1 : prev - 1)
      toast.error('Gagal memproses like')
    }
  }

  return (
    <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm group">
      <Heart className={`transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 group-hover:text-red-400'}`} size={20} />
      <span className="font-bold text-gray-700">{likes}</span>
    </button>
  )
}