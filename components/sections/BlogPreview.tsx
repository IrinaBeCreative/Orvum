import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { BlogPost } from '@/lib/types'

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
          <div>
            <p className="section-label">Knowledge</p>
            <h2 className="section-title">From the <span className="text-gold">Blog</span></h2>
            <div className="gold-rule" />
          </div>
          <Link href="/blog" className="btn-ghost flex items-center gap-2">
            View All Articles <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="bg-bg hover:bg-surface transition-colors group flex flex-col"
            >
              {post.coverImage?.asset?.url && (
                <div className="overflow-hidden aspect-[16/9]">
                  <img
                    src={post.coverImage.asset.url}
                    alt={post.coverImage.alt ?? post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                {post.categories?.[0] && (
                  <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-semibold mb-3">
                    {post.categories[0].name}
                  </span>
                )}
                <h3 className="text-white text-sm font-medium leading-snug mb-3 group-hover:text-gold transition-colors">
                  {post.title}
                </h3>
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
      </div>
    </section>
  )
}
