'use client'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button 
        onClick={loginWithGoogle}
        className="bg-white text-black border px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all"
      >
        Login dengan Google
      </button>
    </div>
  )
}