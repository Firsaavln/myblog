import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Post } from '@/types/blog' // Import tipe data tadi

export default async function Home() {
  const supabase = await createClient()
  
  // Ambil data dengan tipe yang jelas
  const { data: posts }: { data: Post[] | null } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-5xl mx-auto py-20 px-6">
      <div className="flex justify-between items-end mb-12">
        <h1 className="text-5xl font-black">Blog Terbaru</h1>
        <Link href="/admin/create" className="text-blue-600 font-medium hover:underline">
          + Tulis Artikel
        </Link>
      </div>

      {/* Cek jika posts kosong */}
      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl border-dashed">
          <p className="text-gray-400">Belum ada artikel. Mulai menulis sekarang!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="aspect-video overflow-hidden rounded-2xl bg-gray-100 mb-4 border">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    No Image
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                {post.content}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}