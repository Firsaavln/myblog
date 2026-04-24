'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShieldCheck, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  // Login dengan Google
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  // Login dengan Email & Password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#FAFAFA] px-6 py-12">
      <div className="bg-white max-w-md w-full p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-blue-100/40 border border-gray-100 relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 text-center">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <ShieldCheck size={28} />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-8">Masuk untuk mengelola artikel dan berinteraksi.</p>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl border border-red-100">
              {errorMsg}
            </div>
          )}

          {/* Form Email Login */}
          <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-4 text-xs font-bold text-gray-300 uppercase tracking-widest">atau</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* Google Login */}
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-50 hover:border-blue-100 transition-all group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Lanjutkan dengan Google
          </button>

          <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col gap-3">
             <p className="text-sm text-gray-500">
              Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar</Link>
            </p>
            <Link href="/" className="text-xs text-gray-400 hover:text-blue-600 transition font-medium">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}