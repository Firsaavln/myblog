import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
  const { q, page } = await searchParams
  const supabase = await createClient()
  
  // --- LOGIKA PAGINATION ---
  const POSTS_PER_PAGE = 6
  const currentPage = page ? parseInt(page) : 1
  const from = (currentPage - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  // Siapkan query dengan { count: 'exact' } untuk menghitung total halaman
  let query = supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url)', { count: 'exact' })
    .eq('is_published', true)

  if (q) query = query.ilike('title', `%${q}%`)

  // Eksekusi query dengan limit range (.range)
  const { data: posts, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  // Hitung total halaman
  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 1

  return (
    <main className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {q ? `Hasil Pencarian: "${q}"` : 'Artikel Terbaru'}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            {q ? `Menemukan ${count || 0} artikel yang sesuai.` : 'Eksplorasi wawasan seputar teknologi dan gaya hidup modern.'}
          </p>
        </div>

        {/* Grid Kartu Artikel */}
        {posts && posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden bg-gray-100">
                    {post.image_url ? (
                      <img src={post.image_url} alt={post.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <div className="flex items-center gap-2 mt-4 mb-4">
                      <img src={post.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=Admin&background=DBEAFE&color=2563EB'} className="w-5 h-5 rounded-full" />
                      <span className="text-xs text-gray-500 font-medium">
                        {post.profiles?.full_name || 'Admin Zarie'} • {new Date(post.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                      {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1"><Heart size={16} /> 0</span>
                        <span className="flex items-center gap-1"><MessageCircle size={16} /> 0</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="text-sm font-semibold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* KONTROL PAGINATION UI */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                {/* Tombol Previous */}
                {currentPage > 1 ? (
                  <Link href={`/?${q ? `q=${q}&` : ''}page=${currentPage - 1}`} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
                    <ChevronLeft size={20} />
                  </Link>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-300 cursor-not-allowed">
                    <ChevronLeft size={20} />
                  </div>
                )}

                {/* Indikator Halaman */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* Tombol Next */}
                {currentPage < totalPages ? (
                  <Link href={`/?${q ? `q=${q}&` : ''}page=${currentPage + 1}`} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
                    <ChevronRight size={20} />
                  </Link>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-300 cursor-not-allowed">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <p className="text-gray-400 text-lg">Belum ada artikel yang ditemukan.</p>
          </div>
        )}

      </div>
    </main>
  )
}