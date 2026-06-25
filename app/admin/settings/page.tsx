import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata = { title: 'Settings — ORVUM Admin' }

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="font-display text-3xl font-light text-white mb-2">Settings</h1>
      <p className="text-text-muted text-sm mb-10">
        Website content and settings are managed through Sanity CMS.
      </p>

      <div className="flex flex-col gap-3">
        {[
          { label: 'Edit Site Settings', sub: 'Phone, email, address, social, deposit amount', href: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/studio/desk/siteSettings` },
          { label: 'Edit Hero Section', sub: 'Headline, subheadline, background image, CTA buttons', href: '/studio/desk/hero' },
          { label: 'Edit Service Packages', sub: 'Prices, descriptions, features', href: '/studio/desk/package' },
          { label: 'Edit Services', sub: 'Add or remove services, descriptions, images', href: '/studio/desk/service' },
          { label: 'Edit Gallery', sub: 'Before & After photos', href: '/studio/desk/galleryItem' },
          { label: 'Edit Testimonials', sub: 'Customer reviews', href: '/studio/desk/testimonial' },
          { label: 'Edit FAQ', sub: 'Frequently asked questions', href: '/studio/desk/faq' },
          { label: 'Edit Service Areas', sub: 'Cities and coverage', href: '/studio/desk/serviceArea' },
          { label: 'Edit Blog', sub: 'Articles, categories, authors', href: '/studio/desk/post' },
          { label: 'Edit Promotions', sub: 'Active discounts and promo codes', href: '/studio/desk/promotion' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface border border-border hover:border-gold/30 p-5 flex items-center justify-between group transition-colors"
          >
            <div>
              <div className="text-white text-sm font-medium group-hover:text-gold transition-colors">{item.label}</div>
              <div className="text-text-dim text-xs mt-0.5">{item.sub}</div>
            </div>
            <ExternalLink size={14} className="text-text-dim group-hover:text-gold transition-colors" />
          </a>
        ))}
      </div>

      <div className="mt-10 bg-surface border border-border p-6">
        <h2 className="text-white text-sm font-medium mb-3">Environment Variables</h2>
        <p className="text-text-muted text-xs leading-relaxed mb-4">
          API keys, email, Stripe, and Google Calendar credentials are managed through environment variables.
          See the README for setup instructions.
        </p>
        <Link href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
          className="btn-secondary text-[10px] py-2.5 px-5 flex items-center gap-2 w-fit">
          Manage on Vercel <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  )
}
