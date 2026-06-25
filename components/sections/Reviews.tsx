import { Star } from 'lucide-react'
import type { Testimonial } from '@/lib/types'

const FALLBACK: Testimonial[] = [
  { _id: '1', name: 'Michael R.', role: 'Homeowner', location: 'Tampa, FL', rating: 5, text: 'ORVUM made our bathroom look brand new without the cost of replacement. Fast, clean, and professional. The tub looks like it came straight out of a showroom.', service: 'Bathtub Refinishing', featured: true, order: 1 },
  { _id: '2', name: 'Sarah L.', role: 'Property Manager', location: 'Brandon, FL', rating: 5, text: 'Excellent finish and attention to detail. The online estimate process was simple and convenient. No back-and-forth calls — just clean results.', service: 'Countertop Refinishing', featured: true, order: 2 },
  { _id: '3', name: 'James T.', role: 'Real Estate Investor', location: 'Riverview, FL', rating: 5, text: 'Great option for rental properties and turnover projects. Professional results and fast communication. I use them on every flip now.', service: 'Complete Transformation', featured: false, order: 3 },
  { _id: '4', name: 'David M.', role: 'Realtor', location: 'Wesley Chapel, FL', rating: 5, text: 'Needed a kitchen ready for showing in 2 days. ORVUM delivered. Buyers assumed the kitchen was newly renovated.', service: 'Kitchen Renew', featured: false, order: 4 },
  { _id: '5', name: 'Amanda C.', role: 'Homeowner', location: 'Apollo Beach, FL', rating: 5, text: 'The tile painting service completely transformed our outdated bathroom. Saved us thousands. The finish is durable and looks genuinely luxurious.', service: 'Tile Painting', featured: false, order: 5 },
  { _id: '6', name: 'Robert K.', role: 'Apartment Community Manager', location: 'Lithia, FL', rating: 5, text: 'We run 80+ units and ORVUM handles all our turnover refinishing. Reliable, fast, and the team leaves every unit cleaner than they found it.', service: 'Multi-Unit Turnover', featured: false, order: 6 },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={12} className="text-gold fill-gold" />
      ))}
    </div>
  )
}

export default function Reviews({ testimonials }: { testimonials?: Testimonial[] }) {
  const list = testimonials && testimonials.length > 0 ? testimonials : FALLBACK

  return (
    <section id="reviews" className="bg-surface py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="section-label">Client Reviews</p>
            <h2 className="section-title">What Clients <span className="text-gold">Say</span></h2>
            <div className="gold-rule" />
          </div>
          <div className="flex items-end gap-4">
            <div className="text-right">
              <div className="font-display text-5xl font-light text-gold leading-none">5.0</div>
              <Stars n={5} />
              <p className="text-text-dim text-[10px] mt-1 tracking-wide">Google Rating</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {list.map((r) => (
            <div key={r._id} className="bg-surface hover:bg-surface-2 transition-colors p-8 flex flex-col group">
              <div className="flex items-start justify-between mb-5">
                <Stars n={r.rating} />
                <span className="text-[9px] tracking-[0.15em] uppercase text-gold/60 border border-gold/20 px-2 py-0.5">
                  {r.service}
                </span>
              </div>
              <blockquote className="text-text-muted text-sm leading-relaxed flex-1 mb-6">
                "{r.text}"
              </blockquote>
              <div className="flex items-center gap-3 border-t border-border pt-5">
                <div className="w-9 h-9 bg-bg border border-border flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-semibold text-sm">{r.name[0]}</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{r.name}</div>
                  <div className="text-text-dim text-xs">{r.role} — {r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 py-7 border-t border-b border-border">
          {['Licensed & Insured', 'Satisfaction Guaranteed', 'Premium Materials', 'Trained Professionals'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span className="text-text-muted text-[10px] tracking-[0.2em] uppercase">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
