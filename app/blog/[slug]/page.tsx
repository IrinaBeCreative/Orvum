import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getBlogPost, getBlogPosts, getSiteSettings } from '@/lib/sanity/queries'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getBlogPosts(100)
  return posts.map((p: { slug: { current: string } }) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(post.coverImage?.asset?.url ? { images: [{ url: post.coverImage.asset.url }] } : {}),
    },
    alternates: { canonical: `/blog/${slug}` },
  }
}

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-5 text-text-muted text-sm leading-relaxed">{children}</p>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="font-display text-2xl font-light text-white mt-10 mb-4">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="font-display text-xl font-light text-white mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-gold pl-5 italic text-text-muted my-6">{children}</blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => <ul className="mb-5 flex flex-col gap-2">{children}</ul>,
    number: ({ children }: { children?: React.ReactNode }) => <ol className="mb-5 flex flex-col gap-2 list-decimal ml-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex gap-2 text-text-muted text-sm">
        <span className="text-gold flex-shrink-0">—</span>
        {children}
      </li>
    ),
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getBlogPost(slug), getSiteSettings()])
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: 'ORVUM' },
    publisher: { '@type': 'Organization', name: 'ORVUM', logo: { '@type': 'ImageObject', url: 'https://www.orvum.com/logo.png' } },
    ...(post.coverImage?.asset?.url ? { image: post.coverImage.asset.url } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.orvum.com/blog/${slug}` },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.orvum.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.orvum.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.orvum.com/blog/${slug}` },
    ],
  }

  return (
    <main className="bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar settings={settings} />

      {/* Cover image */}
      {post.coverImage?.asset?.url && (
        <div className="pt-20">
          <div className="w-full aspect-[21/7] max-h-[520px] overflow-hidden relative">
            <img src={post.coverImage.asset.url} alt={post.coverImage.alt ?? post.title}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          </div>
        </div>
      )}

      <article className={`max-w-2xl mx-auto px-5 lg:px-8 ${post.coverImage ? '-mt-24 relative z-10' : 'pt-32'} pb-24`}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-text-dim mb-10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-text-muted truncate max-w-[180px]">{post.title}</span>
        </nav>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex gap-2 mb-5">
            {post.categories.map((c) => (
              <span key={c.name} className="text-[9px] tracking-[0.2em] uppercase text-gold border border-gold/30 px-2.5 py-1 font-medium">
                {c.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-5">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-text-dim text-xs">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          {post.author?.name && (
            <>
              <span className="text-border">·</span>
              <span className="text-text-dim text-xs">By {post.author.name}</span>
            </>
          )}
        </div>

        <div className="w-12 h-px bg-gold mb-10" />

        {post.body ? (
          <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} components={ptComponents} />
        ) : (
          <p className="text-text-muted text-sm leading-relaxed">{post.excerpt}</p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[9px] tracking-[0.15em] uppercase text-text-dim border border-border px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-surface border border-border p-8 text-center">
          <div className="w-8 h-px bg-gold mx-auto mb-4" />
          <h3 className="font-display text-2xl font-light text-white mb-3">Ready to Restore Your Surfaces?</h3>
          <p className="text-text-muted text-sm mb-6">Get a free estimate for your project online. No phone call required.</p>
          <Link href="/#estimate" className="btn-primary">Get a Free Estimate</Link>
        </div>

        <div className="mt-8">
          <Link href="/blog" className="flex items-center gap-2 text-text-dim text-xs hover:text-gold transition-colors">
            <ArrowLeft size={13} /> Back to Blog
          </Link>
        </div>
      </article>

      <Footer settings={settings} />
    </main>
  )
}
