"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockApi } from "@/lib/mockApi";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await mockApi.forgotPassword(email);
      console.log("Password reset requested:", response);
      setEmailSent(true);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      // TODO: Hata durumunda kullanıcıya bilgi ver (toast ile)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Branding/Tanıtım */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-tertiary via-brand-primary to-brand-secondary p-16 flex-col justify-between relative overflow-hidden">
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
              Sorun Değil 🔐
            </h2>
            <p className="text-2xl font-medium text-white/90 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Şifrenizi Sıfırlayın
            </p>
            <p className="text-lg text-white/80 max-w-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
              E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">🔒</span>
              </div>
              <p className="text-base">Güvenli ve hızlı sıfırlama</p>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">📧</span>
              </div>
              <p className="text-base">E-posta ile doğrulama</p>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">⚡</span>
              </div>
              <p className="text-base">Anında erişim</p>
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

          {emailSent ? (
            /* Başarı Mesajı */
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  E-posta Gönderildi!
                </h3>
                <p className="text-gray-600 mb-4">
                  Şifre sıfırlama bağlantısı <span className="font-semibold text-brand-primary">{email}</span> adresine gönderildi.
                </p>
                <p className="text-sm text-gray-500">
                  E-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-brand-primary/30 text-[16px]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Giriş Sayfasına Dön
                </button>

                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-[16px]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Tekrar Gönder
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                E-posta gelmedi mi? Spam klasörünü kontrol edin.
              </p>
            </div>
          ) : (
            /* Form */
            <>
              {/* Form Başlığı */}
              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Şifremi Unuttum
                </h3>
                <p className="text-gray-600 mb-8">
                  Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                </p>
              </div>

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

                {/* Submit Button */}
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
                      Gönderiliyor...
                    </span>
                  ) : "Şifre Sıfırlama Bağlantısı Gönder"}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="text-center text-sm text-gray-600 pt-4">
                <p>
                  Şifrenizi hatırladınız mı?{" "}
                  <Link href="/login" className="text-brand-primary hover:opacity-80 font-medium">
                    Giriş Yapın
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

