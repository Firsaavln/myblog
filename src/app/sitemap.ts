import { createClient } from '@/utils/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: posts } = await supabase.from('posts').select('slug, created_at')

  const postEntries = posts?.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
  })) ?? []

  return [
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/`, lastModified: new Date() },
    ...postEntries,
  ]
}