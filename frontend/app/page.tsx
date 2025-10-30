import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Akademik Form Editörü
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI destekli akademik doküman hazırlama platformu
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
}


