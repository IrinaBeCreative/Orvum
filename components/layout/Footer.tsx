import Link from 'next/link'
import type { SiteSettings } from '@/lib/types'

const QUICK_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Property Managers', href: '#property-managers' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#estimate' },
]

const AREAS = ['Tampa', 'Brandon', 'Riverview', 'Valrico', 'Lakeland', 'Plant City', 'Apollo Beach', 'Sun City Center', 'Lithia', 'Wesley Chapel']

const SERVICES = [
  'Bathtub Refinishing', 'Shower Restoration', 'Countertop Refinishing',
  'Cabinet Refinishing', 'Tile Painting', 'Professional Caulking',
  'Chip & Crack Repair', 'Complete Transformation',
]

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const phone = settings?.phone ?? '813-555-0148'
  const email = settings?.email ?? 'info@orvum.com'
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#030303] border-t border-border">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-gold font-display text-2xl font-semibold tracking-[0.15em] mb-1">
              ORVUM
            </div>
            <div className="text-[8px] tracking-[0.3em] uppercase text-text-dim mb-5">
              Restore Instead of Replace
            </div>
            <p className="text-text-dim text-xs leading-relaxed mb-6">
              {settings?.footerText ?? 'Premium surface renewal for homes and properties throughout Tampa Bay, Florida.'}
            </p>
            <div className="flex gap-3">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 border border-border flex items-center justify-center text-text-dim hover:border-gold hover:text-gold transition-all text-xs font-bold">
                  f
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 border border-border flex items-center justify-center text-text-dim hover:border-gold hover:text-gold transition-all text-[10px] font-bold">
                  ig
                </a>
              )}
              {settings?.googleBusinessUrl && (
                <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 border border-border flex items-center justify-center text-text-dim hover:border-gold hover:text-gold transition-all text-[10px] font-bold">
                  G
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white font-semibold mb-5">Services</h4>
            <ul className="flex flex-col gap-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link href="#services" className="text-text-dim text-xs hover:text-gold transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white font-semibold mb-5">Service Areas</h4>
            <ul className="flex flex-col gap-2.5">
              {AREAS.map((a) => (
                <li key={a}>
                  <Link href="#service-areas" className="text-text-dim text-xs hover:text-gold transition-colors">
                    {a}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white font-semibold mb-5">Contact</h4>
            <div className="flex flex-col gap-3 text-text-dim text-xs">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-1">Phone</div>
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-white hover:text-gold transition-colors">
                  {phone}
                </a>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-1">Email</div>
                <a href={`mailto:${email}`} className="text-white hover:text-gold transition-colors">
                  {email}
                </a>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-1">Location</div>
                <span className="text-white">Tampa, FL</span>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-1">License</div>
                <span className="text-white">{settings?.licenseText ?? 'Licensed & Insured'}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="#estimate" className="btn-primary text-[10px] py-3 px-5 w-full justify-center">
                Get Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-dim text-[11px]">
            © {year} ORVUM. All rights reserved. Tampa Bay Surface Renewal.
          </p>
          <div className="flex gap-5">
            {QUICK_LINKS.slice(0, 4).map((l) => (
              <Link key={l.href} href={l.href} className="text-text-dim text-[11px] hover:text-gold transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
