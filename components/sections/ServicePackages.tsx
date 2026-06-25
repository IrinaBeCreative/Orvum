import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import type { Package } from '@/lib/types'

const FALLBACK_PACKAGES = [
  { _id: '1', name: 'Bath Refresh', price: 499, description: 'Refinish your bathtub or shower and make it look like new.', featured: false, includes: ['Bathtub or shower refinishing','Color options','Surface sealing','1-year warranty'], order: 1 },
  { _id: '2', name: 'Surface Upgrade', price: 599, description: 'Restore and refinish countertops for a fresh, modern look.', featured: false, includes: ['Countertop repair and refinishing','Stain and scratch removal','New surface finish','1-year warranty'], order: 2 },
  { _id: '3', name: 'Kitchen Renew', price: 899, description: 'Refinish cabinets and transform your kitchen without replacement.', featured: true, includes: ['Cabinet cleaning and prep','Professional refinishing','New hardware options','2-year warranty'], order: 3 },
  { _id: '4', name: 'Complete Transformation', price: 1599, description: 'Full-service renewal for bathroom or kitchen surfaces.', featured: false, includes: ['Bathtub or shower refinishing','Countertop refinishing','Cabinet refinishing','Tile and grout refresh','2-year warranty'], order: 4 },
]

export default function ServicePackages({
  packages,
  promotions,
}: {
  packages?: Package[]
  promotions?: unknown[]
}) {
  const pkgs = packages && packages.length > 0 ? packages : (FALLBACK_PACKAGES as Package[])

  return (
    <section id="pricing" className="bg-bg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label">Service Packages</p>
          <h2 className="section-title">
            Beautiful Results.{' '}
            <span className="text-gold">Simple Pricing.</span>
          </h2>
          <div className="w-12 h-px bg-gold mx-auto my-6" />
          <p className="section-subtitle mx-auto text-center">
            Transparent pricing with no hidden fees. Every package includes professional
            preparation, premium materials, and a satisfaction guarantee.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border">
          {pkgs.map((pkg) => (
            <div
              key={pkg._id}
              className={`relative flex flex-col transition-all duration-300 group ${
                pkg.featured ? 'bg-surface' : 'bg-bg hover:bg-surface'
              }`}
            >
              {/* Top gold bar if featured */}
              {pkg.featured && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gold" />
              )}
              {pkg.featured && (
                <div className="absolute -top-3.5 left-6 bg-gold text-bg text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1">
                  Most Popular
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                <div className="mb-7">
                  <h3 className="text-gold text-[10px] tracking-[0.25em] uppercase font-semibold mb-4">
                    {pkg.name}
                  </h3>
                  <div className="text-[11px] tracking-widest uppercase text-text-dim mb-2">
                    Starting at
                  </div>
                  <div className="font-display text-5xl font-light text-white mb-5">
                    ${pkg.price.toLocaleString()}
                  </div>
                  <div className="w-8 h-px bg-gold mb-5" />
                  <p className="text-text-muted text-sm leading-relaxed">{pkg.description}</p>
                </div>

                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {pkg.includes?.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={13} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-text-muted text-xs leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="#estimate"
                  className={`flex items-center justify-center gap-2 py-3.5 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all duration-200 group/btn ${
                    pkg.featured
                      ? 'bg-gold text-bg hover:bg-gold-2'
                      : 'border border-border text-text-muted hover:border-gold hover:text-gold'
                  }`}
                >
                  Get Started
                  <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-text-dim text-xs mt-8">
          All prices are starting rates. Final price depends on surface size and condition.{' '}
          <Link href="#estimate" className="text-gold hover:underline">
            Request a free estimate
          </Link>{' '}
          for an exact quote.
        </p>
      </div>
    </section>
  )
}
