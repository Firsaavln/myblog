import { createClient } from './client'

export async function uploadImage(file: File) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `thumbnails/${fileName}`

  const { error, data } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file)

  if (error) throw error

  // Ambil URL publik gambar
  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath)

  return publicUrl
}