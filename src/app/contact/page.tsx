import { Mail, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-500">Ada pertanyaan, ajakan kolaborasi, atau sekadar ingin menyapa? Silakan kirim pesan.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Info Cards */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-500 text-sm mt-1">hello@zarieblog.com</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Location</h3>
                <p className="text-gray-500 text-sm mt-1">Jakarta, Indonesia</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Nama Lengkap</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Pesan</label>
                <textarea rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Tulis pesan Anda di sini..."></textarea>
              </div>
              <button type="button" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Kirim Pesan <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  )
}