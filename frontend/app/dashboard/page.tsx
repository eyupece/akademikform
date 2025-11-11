"use client";

import Link from "next/link";
import { useState } from "react";
import { mockApi } from "@/lib/mockApi";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { calculateProgress } from "@/lib/sectionHelpers";

export default function DashboardPage() {
  const [projects] = useState(mockApi.getProjects());

  return (
    <div className="min-h-screen bg-shade-light">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary shadow-lg relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-10 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-5 left-40 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Merhaba! 👋
              </h1>
              <p className="text-white/90 text-lg">Projelerinizi yönetin veya yeni bir doküman oluşturun</p>
            </div>
            <button
              onClick={() => window.location.href = "/login"}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-200 border border-white/30"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Yeni Proje Oluştur */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Yeni Doküman Başlat
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Template Card */}
            <Link
              href="/editor/new?template=tubitak-2209a"
              className="group relative bg-white rounded-2xl p-8 shadow-card hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-brand-primary overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">📝</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                  TÜBİTAK 2209-A
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Araştırma projesi başvuru formu
                </p>
                
                {/* Arrow Icon */}
                <div className="mt-4 flex items-center text-brand-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Başlat
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Coming Soon Cards */}
            <div className="relative bg-white rounded-2xl p-8 shadow-card border-2 border-gray-100 overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  Yakında
                </span>
              </div>
              <div className="opacity-50">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tez Şablonu
                </h3>
                <p className="text-gray-600 text-sm">
                  Lisans ve yüksek lisans tez şablonu
                </p>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl p-8 shadow-card border-2 border-gray-100 overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  Yakında
                </span>
              </div>
              <div className="opacity-50">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Makale Şablonu
                </h3>
                <p className="text-gray-600 text-sm">
                  Akademik makale ve paper şablonu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Geçmiş Projelerim */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Geçmiş Projelerim
            </h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-card">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📂</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz proje yok</h3>
              <p className="text-gray-600 mb-6">
                İlk projenizi oluşturarak başlayın!
              </p>
              <Link
                href="/editor/new?template=tubitak-2209a"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span>Yeni Proje Oluştur</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => {
                const progress = calculateProgress(project);
                return (
                  <Link
                    key={project.id}
                    href={`/editor/${project.id}`}
                    className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-brand-primary"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                            {project.title}
                          </h3>
                          <Badge variant="primary">
                            {project.sections?.length || 0} bölüm
                          </Badge>
                          {progress.completed === progress.total && progress.total > 0 && (
                            <Badge variant="completed">
                              ✓ Tamamlandı
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{project.template_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(project.updated_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <ProgressBar
                        value={progress.completed}
                        max={progress.total}
                        showLabel={true}
                        size="md"
                        variant={progress.percentage === 100 ? "success" : "primary"}
                      />
                    </div>

                    <div className="flex items-center text-brand-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Düzenlemeye devam et
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}




