import { ExternalLink } from 'lucide-react'

export const metadata = { title: 'Content — ORVUM Admin' }

const SECTIONS = [
  { label: 'Hero Section', sub: 'Headline, subheadline, background image', href: '/studio/desk/hero' },
  { label: 'Service Packages', sub: 'Prices, descriptions, features', href: '/studio/desk/package' },
  { label: 'Services', sub: 'Add services, descriptions, images', href: '/studio/desk/service' },
  { label: 'Before & After Gallery', sub: 'Upload before/after photos', href: '/studio/desk/galleryItem' },
  { label: 'Testimonials', sub: 'Customer reviews and ratings', href: '/studio/desk/testimonial' },
  { label: 'FAQ', sub: 'Questions and answers', href: '/studio/desk/faq' },
  { label: 'Service Areas', sub: 'Cities served', href: '/studio/desk/serviceArea' },
  { label: 'Blog Posts', sub: 'Articles, categories, tags', href: '/studio/desk/post' },
  { label: 'Promotions', sub: 'Active discounts and offers', href: '/studio/desk/promotion' },
  { label: 'Site Settings', sub: 'Phone, email, social, footer', href: '/studio/desk/siteSettings' },
]

export default function ContentPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="font-display text-3xl font-light text-white mb-2">Content</h1>
      <p className="text-text-muted text-sm mb-10">
        All website content is managed through Sanity CMS. Click any section to edit.
      </p>
      <div className="flex flex-col gap-2">
        {SECTIONS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            className="bg-surface border border-border hover:border-gold/30 px-5 py-4 flex items-center justify-between group transition-colors">
            <div>
              <div className="text-white text-sm font-medium group-hover:text-gold transition-colors">{s.label}</div>
              <div className="text-text-dim text-xs mt-0.5">{s.sub}</div>
            </div>
            <ExternalLink size={13} className="text-text-dim group-hover:text-gold transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
