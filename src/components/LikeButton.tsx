'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Heart } from 'lucide-react'

export default function LikeButton({ postId, userId }: { postId: string, userId?: string }) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      // Ambil total like
      const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('post_id', postId)
      setLikes(count || 0)

      // Cek apakah user ini sudah like
      if (userId) {
        const { data } = await supabase.from('likes').select('*').eq('post_id', postId).eq('user_id', userId).single()
        if (data) setIsLiked(true)
      }
    }
    getData()
  }, [postId, userId])

  const handleLike = async () => {
    if (!userId) return alert('Silakan login dulu!')

    if (isLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId)
      setLikes(prev => prev - 1)
      setIsLiked(false)
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId })
      setLikes(prev => prev + 1)
      setIsLiked(true)
    }
  }

  return (
    <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-50 transition">
      <Heart className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} size={20} />
      <span className="font-bold">{likes}</span>
    </button>
  )
}