import type { MetadataRoute } from 'next'
import { getBlogPosts, getServices } from '@/lib/sanity/queries'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.orvum.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([getBlogPosts(100), getServices()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post: { slug: { current: string }; publishedAt: string }) => ({
    url: `${BASE}/blog/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
