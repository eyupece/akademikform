"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockApi } from "@/lib/mockApi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await mockApi.login(email, password);
      console.log("Login successful:", response);
      // TODO: Token'ı localStorage'a kaydet
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // TODO: Hata durumunda kullanıcıya bilgi ver
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Branding/Tanıtım */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-tertiary p-16 flex-col justify-between relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white">Akademik Form</h1>
        </div>

        {/* Ana İçerik */}
        <div className="space-y-8 relative z-10">
          <div>
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Hoş Geldiniz 👋
            </h2>
            <p className="text-2xl font-medium text-white/90 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              AI Destekli Akademik Editör
            </p>
            <p className="text-lg text-white/80 max-w-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Akademik yazılarınızı yapay zeka desteğiyle profesyonel seviyeye taşıyın.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">✨</span>
              </div>
              <p className="text-base">AI destekli yazım önerileri</p>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">🎯</span>
              </div>
              <p className="text-base">Otomatik format düzenleme</p>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">📄</span>
              </div>
              <p className="text-base">Çoklu format desteği</p>
            </div>
          </div>
        </div>

        <div className="relative z-10"></div>
      </div>

      {/* Sağ Taraf - Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full mb-4">
              <h1 className="text-xl font-bold text-white">Akademik Form</h1>
            </div>
          </div>

          {/* Form Başlığı */}
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Giriş Yap
            </h3>
            <p className="text-gray-600 mb-8">Hesabınıza giriş yapın ve çalışmaya devam edin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
                   {/* Email Input */}
                   <div className="group">
                     <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                     <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="ornek@email.com"
                       required
                       className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 rounded-xl border-2 border-transparent placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-primary transition-all duration-200 text-[15px]"
                       style={{ fontFamily: 'Poppins, sans-serif' }}
                     />
                   </div>

                   {/* Password Input */}
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">Şifre</label>
                     <div className="relative group">
                       <input
                         type={showPassword ? "text" : "password"}
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="••••••••"
                         required
                         className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 rounded-xl border-2 border-transparent placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-primary transition-all duration-200 text-[15px] pr-12"
                         style={{ fontFamily: 'Poppins, sans-serif' }}
                       />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
                     </div>
                    <div className="text-right">
                      <Link href="/forgot-password" className="text-sm text-brand-primary hover:text-brand-secondary font-medium transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Şifrenizi mi unuttunuz?
                      </Link>
                    </div>
                   </div>

                   {/* Login Button */}
                   <button
                     type="submit"
                     disabled={loading}
                     className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/30 text-[16px] mt-8"
                     style={{ fontFamily: 'Poppins, sans-serif' }}
                   >
                     {loading ? (
                       <span className="flex items-center justify-center gap-2">
                         <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                         </svg>
                         Giriş yapılıyor...
                       </span>
                     ) : "Giriş Yap"}
                   </button>

                   {/* Divider */}
                   <div className="relative my-8">
                     <div className="absolute inset-0 flex items-center">
                       <div className="w-full border-t border-gray-200"></div>
                     </div>
                     <div className="relative flex justify-center text-sm">
                       <span className="px-4 bg-white text-gray-500 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                         veya şununla devam edin
                       </span>
                     </div>
                   </div>

                   {/* Social Login */}
                   <div className="flex justify-center gap-3">
              <button type="button" className="p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-110 duration-200">
                <svg className="w-10 h-10" viewBox="0 0 42 42" fill="none">
                  <circle cx="21" cy="21" r="18" fill="url(#facebook)" />
                  <path d="M23 27V22H25L25.5 19H23V17.5C23 16.95 23.1 16.5 24 16.5H25.5V14C25.2 14 24.3 13.9 23.3 13.9C21.2 13.9 19.8 15.1 19.8 17.2V19H17.5V22H19.8V27H23Z" fill="white"/>
                  <defs>
                    <linearGradient id="facebook" x1="21" y1="3" x2="21" y2="39" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#18ACFE"/>
                      <stop offset="1" stopColor="#0163E0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </button>
              <button type="button" className="p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-110 duration-200">
                <svg className="w-10 h-10" viewBox="0 0 42 42" fill="none">
                  <circle cx="21" cy="21" r="18" fill="#283544" />
                  <path d="M26.5 15.5C26 15.2 25.5 15 25 14.8C24.5 14.6 24 14.5 23.5 14.5C21.8 14.5 20.3 15.3 19.5 16.6C19.3 16.9 19.1 17.2 19 17.6H17V19.5H18.8C18.8 19.6 18.8 19.7 18.8 19.8V20H17V22H18.8V28H21.2V22H23.5L24 19.5H21.2C21.2 19.4 21.2 19.3 21.2 19.2C21.3 18.5 21.5 18 21.9 17.6C22.3 17.2 22.8 17 23.5 17C23.8 17 24.1 17.1 24.4 17.2C24.7 17.3 25 17.5 25.2 17.7L26.5 15.5Z" fill="white"/>
                </svg>
              </button>
              <button type="button" className="p-3 rounded-xl hover:bg-gray-50 transition-all hover:scale-110 duration-200">
                <svg className="w-10 h-10" viewBox="0 0 42 42" fill="none">
                  <path d="M29.5 21.5C29.5 21.2 29.5 21 29.5 20.8H21V23.5H25.8C25.6 24.5 25 25.4 24.1 26L26.3 27.7C28 26.1 29 24 29.5 21.5Z" fill="#4285F4"/>
                  <path d="M21 29.5C23.2 29.5 25.1 28.8 26.5 27.5L24.3 25.8C23.6 26.3 22.7 26.6 21.2 26.6C19 26.6 17.2 25 16.6 22.9L14.3 24.7C15.7 27.4 18.2 29.5 21.2 29.5H21Z" fill="#34A853"/>
                  <path d="M16.5 21C16.5 20.5 16.6 20 16.7 19.5L14.4 17.7C13.9 18.7 13.5 19.8 13.5 21C13.5 22.2 13.8 23.3 14.4 24.3L16.7 22.5C16.6 22 16.5 21.5 16.5 21Z" fill="#FBBC05"/>
                  <path d="M21 15.4C22.6 15.4 24 16 25.1 17L27.1 15C25.5 13.5 23.5 12.5 21 12.5C18.2 12.5 15.7 14.6 14.3 17.3L16.6 19.1C17.2 17 19 15.4 21 15.4Z" fill="#EB4335"/>
                </svg>
              </button>
            </div>
          </form>

          {/* Register Link - Tüm ekranlarda göster */}
          <div className="text-center text-sm text-gray-600 pt-2">
            <p>
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-brand-primary hover:opacity-80 font-medium">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




