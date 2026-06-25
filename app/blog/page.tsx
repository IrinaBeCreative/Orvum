import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getBlogPosts, getSiteSettings } from '@/lib/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Surface Renewal Tips & Guides | ORVUM',
  description: 'Expert tips on bathtub refinishing, countertop renewal, cabinet restoration, and surface maintenance from ORVUM — Tampa Bay surface renewal specialists.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getBlogPosts(30), getSiteSettings()])

  return (
    <main className="bg-bg">
      <Navbar settings={settings} />

      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <p className="section-label">Knowledge Base</p>
          <h1 className="section-title">Surface Renewal <span className="text-gold">Blog</span></h1>
          <div className="gold-rule" />
          <p className="section-subtitle max-w-md">
            Expert guides and tips on bathtub refinishing, countertop renewal, and surface maintenance.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center text-text-muted py-20">
              <p>No articles published yet.</p>
              <Link href="/" className="text-gold hover:underline mt-2 inline-block">Return home</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {posts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug.current}`}
                  className="bg-bg hover:bg-surface transition-colors group flex flex-col">
                  {post.coverImage?.asset?.url && (
                    <div className="overflow-hidden aspect-[16/9]">
                      <img src={post.coverImage.asset.url} alt={post.coverImage.alt ?? post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {post.categories?.[0] && (
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-semibold mb-3">
                        {post.categories[0].name}
                      </span>
                    )}
                    <h2 className="text-white text-sm font-medium leading-snug mb-3 group-hover:text-gold transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-text-muted text-xs leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-text-dim text-[11px]">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <ArrowRight size={13} className="text-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  )
}
