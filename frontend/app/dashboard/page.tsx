"use client";

import Link from "next/link";
import { useState } from "react";
import { mockApi } from "@/lib/mockApi";

export default function DashboardPage() {
  const [projects] = useState(mockApi.getProjects());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Yeni Proje Oluştur */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Yeni Doküman Başlat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/editor/new?template=tubitak-2209a"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 hover:bg-indigo-50 transition cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                TÜBİTAK 2209-A
              </h3>
              <p className="text-sm text-gray-600">
                Araştırma projesi başvuru formu
              </p>
            </Link>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 opacity-50 cursor-not-allowed">
              <h3 className="font-semibold text-gray-900 mb-2">
                Tez Şablonu
              </h3>
              <p className="text-sm text-gray-600">Yakında eklenecek</p>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 opacity-50 cursor-not-allowed">
              <h3 className="font-semibold text-gray-900 mb-2">
                Makale Şablonu
              </h3>
              <p className="text-sm text-gray-600">Yakında eklenecek</p>
            </div>
          </div>
        </div>

        {/* Geçmiş Projelerim */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Geçmiş Projelerim
          </h2>
          {projects.length === 0 ? (
            <p className="text-gray-600">Henüz projeniz bulunmuyor.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/editor/${project.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:bg-indigo-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Şablon: {project.template_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Son güncelleme: {new Date(project.updated_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {project.sections?.length || 0} bölüm
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


