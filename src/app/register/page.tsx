'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  
  const supabase = createClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', content: '' })

    // Proses Pendaftaran
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: `https://ui-avatars.com/api/?name=${fullName}&background=DBEAFE&color=2563EB`, // Avatar default dari inisial nama
        },
      },
    })

    if (error) {
      setMessage({ type: 'error', content: error.message })
      setLoading(false)
    } else {
      setMessage({ type: 'success', content: 'Registrasi berhasil! Silakan cek email untuk verifikasi atau langsung login jika konfirmasi email dimatikan.' })
      setLoading(false)
      // Redirect ke login setelah beberapa detik
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#FAFAFA] px-6 py-12">
      <div className="bg-white max-w-md w-full p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-blue-100/40 border border-gray-100 relative overflow-hidden">
        
        {/* Dekorasi Gradient Halus */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

        <div className="relative z-10 text-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <UserPlus size={28} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Buat Akun</h1>
          <p className="text-gray-500 text-sm mb-8">Bergabunglah untuk mulai berinteraksi di Zarie's Blog.</p>

          {message.content && (
            <div className={`mb-6 p-4 rounded-2xl text-xs font-bold border ${
              message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
            }`}>
              {message.content}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-left">
            {/* Input Nama Lengkap */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Zarie Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm text-gray-700 font-medium"
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm text-gray-700 font-medium"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm text-gray-700 font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50">
             <p className="text-sm text-gray-500 font-medium">
              Sudah punya akun? <Link href="/login" className="text-blue-600 font-black hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}