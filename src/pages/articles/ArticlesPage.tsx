import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Shield, Mail, Globe, BookOpen, ArrowRight, Loader2 } from 'lucide-react'
import { fetchArticles } from '../../services/firebase/articles'
import { staticArticles } from '../../data/articles'
import ArticleCard from './ArticleCard'

export default function ArticlesPage() {
  const { data: firestoreArticles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000,
  })

  // Static articles always shown; Firestore articles appended and sorted by order
  const articles = [...staticArticles, ...firestoreArticles].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/crest_black_logo.png" alt="CrestApp" className="h-8 w-auto object-contain" />
            <span className="font-bold text-lg tracking-tight">CrestApp</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Login
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Page hero */}
        <section className="relative overflow-hidden border-b border-gray-800 bg-gray-900/40">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/8 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-900/50 border border-brand-700/50 text-brand-400 text-xs font-medium mb-6">
              <BookOpen className="w-3 h-3" />
              Identity &amp; Transformation
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
              Insights &amp; <span className="text-brand-400">Organisation</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              A series exploring identity clarity, the architecture of human transformation, and how CrestApp bridges ancient wisdom with modern performance.
            </p>

            {/* Article nav pills - only shown when articles loaded */}
            {!isLoading && articles.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {articles.map((a) => (
                  <a
                    key={a.id}
                    href={`#article-${a.id}`}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800 hover:bg-brand-900/60 border border-gray-700 hover:border-brand-700/60 text-gray-400 hover:text-brand-300 transition-colors"
                  >
                    {a.order}. {a.title.split(':')[0].split('-')[0].trim()}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Articles */}
        <section className="max-w-4xl mx-auto px-6 py-14">
          <div className="space-y-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
              </div>
            )}
          </div>
        </section>

        {/* CTA - Begin The Journey */}
        <section className="border-t border-gray-800 bg-gray-900/40">
            <div className="max-w-4xl mx-auto px-6 py-16 text-center">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-700" />
                <img
                  src="/crest_black_logo.png"
                  alt="CrestApp crest"
                  className="h-10 w-auto object-contain opacity-70"
                />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-700" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Begin The Journey
              </h2>
              <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
                To explore partnership, integration, or enterprise deployment, reach out to the team behind CrestApp.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:CrestApp@crest.city"
                  className="group flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-brand-700/60 rounded-2xl px-6 py-5 transition-colors w-full sm:w-auto"
                >
                  <div className="w-11 h-11 bg-brand-900/60 rounded-xl flex items-center justify-center group-hover:bg-brand-800/60 transition-colors flex-shrink-0">
                    <Mail className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">Email</p>
                    <p className="text-base font-bold text-brand-400 group-hover:text-brand-300 transition-colors">
                      CrestApp@crest.city
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 w-full sm:w-auto">
                  <div className="w-11 h-11 bg-brand-900/60 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">Web</p>
                    <p className="text-base font-bold text-white">www.crest.city</p>
                  </div>
                </div>
              </div>

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 mt-10 text-sm text-gray-500 hover:text-brand-400 transition-colors"
              >
                Back to top
                <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
              </a>
            </div>
          </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4 text-brand-600" />
            <span>© {new Date().getFullYear()} CrestApp. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <span className="text-gray-700">|</span>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <span className="text-gray-700">|</span>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Support</Link>
            <span className="text-gray-700">|</span>
            <a href="mailto:CrestApp@crest.city" className="hover:text-gray-300 transition-colors">
              CrestApp@crest.city
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
