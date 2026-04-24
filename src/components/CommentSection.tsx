'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function CommentSection({ postId, user }: { postId: string, user: any }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const supabase = createClient()

  useEffect(() => {
    // 1. Ambil komentar lama
    const fetchComments = async () => {
      const { data } = await supabase.from('comments').select('*, profiles(full_name, avatar_url)').eq('post_id', postId).order('created_at', { ascending: false })
      setComments(data || [])
    }
    fetchComments()

    // 2. Subscribe ke perubahan (Realtime)
    const channel = supabase.channel('realtime_comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, 
      (payload) => {
        // Karena payload INSERT tidak membawa data profil, sebaiknya refresh atau fetch ulang profilnya
        fetchComments()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [postId])

  const sendComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Login dulu bos!')
    
    await supabase.from('comments').insert({ post_id: postId, user_id: user.id, body: newComment })
    setNewComment('')
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Komentar ({comments.length})</h3>
      <form onSubmit={sendComment} className="mb-8">
        <textarea 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-blue-500"
          placeholder="Tulis pendapatmu..."
        />
        <button className="mt-2 bg-black text-white px-6 py-2 rounded-lg">Kirim</button>
      </form>

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <img src={c.profiles?.avatar_url} className="w-10 h-10 rounded-full" />
            <div className="bg-gray-100 p-4 rounded-2xl flex-1">
              <p className="font-bold text-sm">{c.profiles?.full_name}</p>
              <p className="text-gray-700">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}