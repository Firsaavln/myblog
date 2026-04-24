'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { MessageSquare, Send, Trash2, Edit2, X, Check, ShieldCheck, Reply } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CommentSection({ postId, user }: { postId: string, user: any }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [currentUserRole, setCurrentUserRole] = useState<string>('user')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  
  // STATE BARU UNTUK FITUR REPLY
  const [replyingTo, setReplyingTo] = useState<{ id: string, name: string } | null>(null)

  const supabase = createClient()

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(full_name, avatar_url, role)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    
    if (data) setComments(data)
  }, [postId, supabase])

  useEffect(() => {
    fetchComments()

    const fetchUserRole = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (data) setCurrentUserRole(data.role || 'user')
      }
    }
    fetchUserRole()

    const channel = supabase.channel(`realtime-comments-${postId}`)
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, 
        () => {
          fetchComments() 
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, user, fetchComments, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return toast.error('Sign In dulu untuk ikut berdiskusi!')
    if (!newComment.trim()) return toast.error('Komentar tidak boleh kosong!')

    setLoading(true)
    const toastId = toast.loading(replyingTo ? 'Mengirim balasan...' : 'Mengirim komentar...')

    try {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        body: newComment.trim(),
        parent_id: replyingTo ? replyingTo.id : null // Menyimpan ID parent jika sedang membalas
      })
      
      if (error) throw error
      
      setNewComment('')
      setReplyingTo(null) // Reset state reply setelah berhasil
      
      await fetchComments() 
      
      toast.success(replyingTo ? 'Balasan terkirim!' : 'Komentar terkirim!', { id: toastId })
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim komentar.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-gray-900">Yakin ingin menghapus ini?</span>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
            Batal
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id)
              const deleteToast = toast.loading('Menghapus...')
              const { error } = await supabase.from('comments').delete().eq('id', commentId)
              
              if (!error) {
                setComments(prev => prev.filter(c => c.id !== commentId && c.parent_id !== commentId))
                toast.success('Dihapus!', { id: deleteToast })
              } else {
                toast.error('Gagal menghapus.', { id: deleteToast })
              }
            }} 
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    ), { duration: 5000 })
  }

  const startEdit = (comment: any) => {
    setEditingId(comment.id)
    setEditContent(comment.body) 
  }

  const saveEdit = async (commentId: string) => {
    if (!editContent.trim()) return toast.error('Tidak boleh kosong!')
    
    const toastId = toast.loading('Menyimpan perubahan...')
    try {
      const { error } = await supabase.from('comments').update({ body: editContent.trim() }).eq('id', commentId)
      if (error) throw error
      
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, body: editContent.trim() } : c))
      setEditingId(null)
      toast.success('Diperbarui!', { id: toastId })
    } catch (error) {
      toast.error('Gagal memperbarui.', { id: toastId })
    }
  }

  // FUNGSI MULAI MEMBALAS
  const startReply = (comment: any, rootParentId: string) => {
    setReplyingTo({ id: rootParentId, name: comment.profiles?.full_name || 'Anonymous' })
    
    // Auto-Tag jika membalas komentar anak (sub-comment)
    if (comment.id !== rootParentId) {
      const tag = `@${(comment.profiles?.full_name || 'User').replace(/\s+/g, '')} `
      setNewComment(tag)
    } else {
      setNewComment('')
    }
    
    // Auto fokus ke kolom input
    document.getElementById('comment-input')?.focus()
  }

  // FUNGSI RENDER KOMENTAR (Bisa digunakan untuk Parent maupun Child)
  const renderCommentNode = (comment: any, isReply = false, rootParentId: string) => {
    const canModify = user && (user.id === comment.user_id || currentUserRole === 'admin');
    const avatarSize = isReply ? "w-8 h-8" : "w-12 h-12";
    
    // Format teks agar Tag @nama berwarna biru
    const formattedBody = comment.body.split(' ').map((word: string, i: number) => 
      word.startsWith('@') ? <span key={i} className="text-blue-600 font-semibold">{word} </span> : word + ' '
    );

    return (
      <div key={comment.id} className="flex gap-3 sm:gap-4">
        <img 
          src={comment.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=U&background=F3F4F6&color=9CA3AF'} 
          className={`${avatarSize} rounded-full border border-gray-100 shrink-0 object-cover mt-1`} 
          alt="Avatar"
        />
        
        <div className={`flex-1 bg-white border p-4 sm:p-5 rounded-3xl shadow-sm rounded-tl-none group transition-all ${comment.profiles?.role === 'admin' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
                {comment.profiles?.full_name || 'Anonymous'}
                {comment.profiles?.role === 'admin' && (
                  <span title="Verified Admin" className="flex items-center justify-center">
                     <ShieldCheck size={14} className="text-blue-600" />
                  </span>
                )}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                {new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* ACTION MENU (REPLY, EDIT, DELETE) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {user && (
                <button onClick={() => startReply(comment, rootParentId)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Balas">
                  <Reply size={14} />
                </button>
              )}
              {canModify && editingId !== comment.id && (
                <>
                  <button onClick={() => startEdit(comment)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(comment.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {editingId === comment.id ? (
            <div className="mt-3 relative">
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm text-gray-900 min-h-[100px]"
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-all"><X size={14} /> Batal</button>
                <button onClick={() => saveEdit(comment.id)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"><Check size={14} /> Simpan</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {formattedBody}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Pisahkan Komentar Utama dan Balasan
  const topLevelComments = comments.filter(c => !c.parent_id)

  return (
    <div className="mt-8" id="comments">
      <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <MessageSquare className="text-blue-600" /> Diskusi ({comments.length})
      </h3>

      <form onSubmit={handleSend} className="mb-12">
        {/* Indikator Sedang Membalas */}
        {replyingTo && (
          <div className="mb-3 flex items-center gap-2 text-sm text-blue-700 font-bold bg-blue-50/50 border border-blue-100 px-4 py-2 rounded-2xl w-fit">
            <Reply size={16} className="text-blue-500" />
            Membalas {replyingTo.name}
            <button type="button" onClick={() => { setReplyingTo(null); setNewComment(''); }} className="ml-2 p-1 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="relative group">
          {user ? (
            <img 
              src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/40'} 
              className="absolute left-4 top-4 w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" 
              alt="User"
            />
          ) : (
            <div className="absolute left-4 top-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">?</div>
          )}
          
          <textarea 
            id="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? (replyingTo ? "Tulis balasan..." : "Tuliskan pandangan Anda...") : "Sign In untuk mulai berdiskusi..."}
            disabled={!user || loading}
            className={`w-full pl-18 pr-6 py-5 bg-white border ${replyingTo ? 'border-blue-300 ring-4 ring-blue-500/10' : 'border-gray-200'} rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none min-h-[120px] shadow-sm text-sm text-gray-900 placeholder-gray-400`}
          />
          <button 
            type="submit" 
            disabled={!user || loading || !newComment.trim()}
            className="absolute right-4 bottom-4 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
          >
            <Send size={16} /> {replyingTo ? 'Balas' : 'Kirim'}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-medium text-sm">Belum ada diskusi. Jadilah yang pertama berkomentar!</p>
          </div>
        ) : (
          topLevelComments.map(parent => {
            // Ambil semua balasan untuk komentar utama ini (diurutkan dari yang paling lama ke terbaru)
            const replies = comments
              .filter(c => c.parent_id === parent.id)
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

            return (
              <div key={parent.id} className="flex flex-col gap-4">
                {/* 1. RENDER KOMENTAR UTAMA */}
                {renderCommentNode(parent, false, parent.id)}

                {/* 2. RENDER BALASAN (Jika ada) */}
                {replies.length > 0 && (
                  <div className="pl-12 sm:pl-16 flex flex-col gap-4 border-l-2 border-gray-50 ml-4 sm:ml-6 mt-[-8px]">
                    {replies.map(reply => renderCommentNode(reply, true, parent.id))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}