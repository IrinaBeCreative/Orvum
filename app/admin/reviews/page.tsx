import Link from 'next/link'
import { ExternalLink, Star } from 'lucide-react'

export const metadata = { title: 'Reviews — ORVUM Admin' }

export default function ReviewsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="font-display text-3xl font-light text-white mb-2">Reviews</h1>
      <p className="text-text-muted text-sm mb-10">
        Manage testimonials and track Google Reviews.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        <div className="bg-surface border border-border p-6">
          <Star size={22} className="text-gold mb-3" />
          <div className="font-display text-4xl font-light text-white mb-1">5.0</div>
          <div className="text-text-dim text-xs tracking-wide">Google Rating</div>
        </div>
        <div className="bg-surface border border-border p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">Review Link</div>
            <p className="text-text-muted text-xs leading-relaxed">
              Share this link to request Google reviews after service completion.
            </p>
          </div>
          <a
            href="https://g.page/r/your-google-review-link/review"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-gold text-xs hover:underline"
          >
            Open Review Link <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="bg-surface border border-border p-6 mb-4">
        <h2 className="text-white text-sm font-medium mb-2">Edit Testimonials in CMS</h2>
        <p className="text-text-muted text-xs leading-relaxed mb-4">
          Add, edit, and remove testimonials directly from Sanity CMS. Changes appear on the website within 60 seconds.
        </p>
        <a
          href="/studio/desk/testimonial"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-[10px] flex items-center gap-2 w-fit"
        >
          Open CMS <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}
