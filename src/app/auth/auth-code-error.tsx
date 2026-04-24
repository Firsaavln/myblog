export default function AuthErrorPage() {
    return (
      <div className="p-10 text-center">
        <h1 className="text-red-500 font-bold">Wah, ada masalah login!</h1>
        <p>Cek apakah SQL Trigger di Supabase sudah benar.</p>
        <a href="/login" className="text-blue-500 underline">Coba Login Lagi</a>
      </div>
    )
  }