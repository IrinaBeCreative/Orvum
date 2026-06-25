'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const DEFAULT_TRUST = [
  { label: 'Save Thousands', sub: 'vs Full Replacement' },
  { label: 'Fast Turnaround', sub: 'Most Projects 1 Day' },
  { label: 'Minimal Disruption', sub: 'No Demolition' },
  { label: 'Premium Results', sub: 'Like-New Finish' },
]

export default function Hero({ hero, settings }: { hero?: Record<string, unknown>; settings?: Record<string, unknown> }) {
  const headline = (hero?.headline as string) ?? 'Beautiful Surfaces. Lasting Value.'
  const subheadline = (hero?.subheadline as string) ?? 'Restore Instead of Replace.'
  const bgUrl = (hero as Record<string, { asset?: { url: string } }> | undefined)?.backgroundImage?.asset?.url
    ?? 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=90'

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/92 lg:via-bg/85 to-bg/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
        {/* Gold accent glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-gold/5 blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 lg:px-8 pt-28 pb-16">
        <div className="max-w-[680px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-px bg-gold" />
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium">
              Tampa Bay Surface Renewal
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(42px,6vw,80px)] font-light leading-[1.02] mb-5">
            {headline.includes('Lasting Value') ? (
              <>
                Beautiful Surfaces.<br />
                <span className="text-gold">Lasting Value.</span>
              </>
            ) : (
              headline
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-text-muted text-lg md:text-xl font-light leading-relaxed mb-10 max-w-[520px]">
            {subheadline !== 'Restore Instead of Replace.' ? (
              subheadline
            ) : (
              'We renew bathtubs, showers, countertops, cabinets, and tile — without the cost and hassle of replacement.'
            )}
          </p>

          {/* Buttons */}
          <div className="flex flex-col xs:flex-row gap-4 mb-14">
            <Link href="#estimate" className="btn-primary group">
              Get a Free Estimate
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#booking" className="btn-secondary">
              Book Appointment
            </Link>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-3">
            {DEFAULT_TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <CheckCircle2 size={15} className="text-gold flex-shrink-0" />
                <div>
                  <div className="text-white text-xs font-medium">{t.label}</div>
                  <div className="text-text-dim text-[11px]">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent animate-pulse" />
      </div>
    </section>
  )
}
