'use client'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Search, LogOut, Menu, X, PenSquare } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  // Mengecek apakah kita sedang di halaman login/register
  const isAuthPage = pathname === '/login' || pathname === '/register'

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Ambil role dari tabel profiles
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        setUser({ ...user, role: profile?.role }) // Simpan role ke state user
      } else {
        setUser(null)
      }
    }
    getUserData()
  }, [pathname])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    setUser(null)
    setIsLoggingOut(false)
    setIsMobileMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/?q=${searchQuery}`)
      setIsMobileMenuOpen(false) 
    }
  }

  const executeSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?q=${searchQuery}`)
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black tracking-tight text-gray-900 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          ZARIE'S <span className="text-blue-600 font-light">BLOG</span>
        </Link>
        
        {/* MENU TENGAH (DESKTOP) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          <Link href="/" className={`${pathname === '/' ? 'text-blue-600' : 'hover:text-gray-900'} transition-colors`}>Home</Link>
          <Link href="/technology" className={`${pathname === '/technology' ? 'text-blue-600' : 'hover:text-gray-900'} transition-colors`}>Technology</Link>
          <Link href="/hobbies" className={`${pathname === '/hobbies' ? 'text-blue-600' : 'hover:text-gray-900'} transition-colors`}>Hobbies</Link>
          <Link href="/about" className={`${pathname === '/about' ? 'text-blue-600' : 'hover:text-gray-900'} transition-colors`}>About</Link>
          <Link href="/contact" className={`${pathname === '/contact' ? 'text-blue-600' : 'hover:text-gray-900'} transition-colors`}>Contact</Link>
        </div>
        
        {/* SISI KANAN (DESKTOP SEARCH & AUTH) */}
        <div className="hidden md:flex items-center gap-5">
          
          {/* Input Search Desktop */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Cari artikel..." 
              className="bg-transparent text-sm outline-none w-40 placeholder-gray-400 text-gray-700"
            />
            <button onClick={executeSearch}>
              <Search size={16} className="text-gray-400 hover:text-blue-600 transition-colors" />
            </button>
          </div>

          {/* Logic Auth: Sembunyikan jika di halaman login/register */}
          {!isAuthPage && (
            user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                
                {/* REVISI: HANYA MUNCUL JIKA USER ADALAH ADMIN */}
                {user.role === 'admin' && (
                  <Link href="/admin/create" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors" title="Tulis Artikel">
                    <PenSquare size={18} />
                    <span>Tulis</span>
                  </Link>
                )}
                
                <div className="flex items-center gap-3">
                  <img 
                    src={user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=DBEAFE&color=2563EB'} 
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover" 
                  />
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all">
                Sign In
              </Link>
            )
          )}
        </div>

        {/* TOMBOL HAMBURGER (MOBILE ONLY) */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg z-50 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-6">
          
          {/* Mobile Search */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Cari artikel..." 
              className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700"
            />
            <button onClick={executeSearch}><Search size={18} className="text-gray-400" /></button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-4 text-base font-semibold text-gray-600">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/technology" onClick={() => setIsMobileMenuOpen(false)}>Technology</Link>
            <Link href="/hobbies" onClick={() => setIsMobileMenuOpen(false)}>Hobbies</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </div>

          <hr className="border-gray-50" />

          {/* Mobile Auth */}
          {!isAuthPage && (
            user ? (
              <div className="flex flex-col gap-4">
                
                {/* REVISI: HANYA MUNCUL JIKA USER ADALAH ADMIN DI MOBILE */}
                {user.role === 'admin' && (
                  <Link href="/admin/create" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-bold">
                    <PenSquare size={18} className="text-blue-600" /> Tulis Artikel Baru
                  </Link>
                )}

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <img src={user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=DBEAFE&color=2563EB'} className="w-10 h-10 rounded-full" />
                    <span className="font-bold text-sm truncate max-w-[150px]">{user.user_metadata?.full_name || 'User'}</span>
                  </div>
                  <button onClick={handleLogout} className="text-red-500 bg-red-50 p-2 rounded-lg"><LogOut size={18} /></button>
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-gray-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all">
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}