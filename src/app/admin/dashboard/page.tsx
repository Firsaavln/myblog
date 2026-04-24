import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from('posts').select('id, title, slug, created_at')

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Manajemen Konten</h1>
        <Link href="/admin/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
          Buat Post Baru
        </Link>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold">Judul</th>
              <th className="p-4 text-sm font-semibold">Tanggal</th>
              <th className="p-4 text-sm font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{post.title}</td>
                <td className="p-4 text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-3">
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 text-sm">Lihat</Link>
                  <button className="text-red-600 text-sm">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}