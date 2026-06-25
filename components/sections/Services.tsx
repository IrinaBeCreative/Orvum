import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import type { Service } from '@/lib/types'

const FALLBACK: Service[] = [
  { _id: '1', name: 'Bathtub Refinishing', slug: { current: 'bathtub-refinishing' }, shortDescription: 'Restore worn, stained, scratched, or outdated tubs with a smooth, like-new finish.', description: '', bullets: ['Porcelain, fiberglass, and acrylic tubs','Color restoration and change options','Chip and crack repair included','Slip-resistant coating available'], order: 1, active: true, image: { asset: { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80' } } },
  { _id: '2', name: 'Shower Restoration', slug: { current: 'shower-restoration' }, shortDescription: 'Refresh fiberglass and tile showers for a clean, modern look without full replacement.', description: '', bullets: ['Fiberglass and tile shower panels','Waterproof coating systems','Grout refresh and sealing','Mold and mildew removal'], order: 2, active: true, image: { asset: { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80' } } },
  { _id: '3', name: 'Countertop Refinishing', slug: { current: 'countertop-refinishing' }, shortDescription: 'Upgrade worn countertops with a durable, beautiful new surface finish.', description: '', bullets: ['Laminate, cultured marble, tile','Stain and scratch removal','Color and finish customization','Durable protective coating'], order: 3, active: true, image: { asset: { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80' } } },
  { _id: '4', name: 'Cabinet Refinishing', slug: { current: 'cabinet-refinishing' }, shortDescription: 'Refresh cabinets with a clean, modern finish and optional hardware upgrades.', description: '', bullets: ['Wood, MDF, and laminate cabinets','Professional cleaning and prep','Smooth factory-quality finish','Hardware upgrade options'], order: 4, active: true, image: { asset: { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' } } },
  { _id: '5', name: 'Tile Painting', slug: { current: 'tile-painting' }, shortDescription: 'Transform outdated wall and floor tile with a fresh, modern look.', description: '', bullets: ['Wall and floor tile painting','Waterproof finish','Color change options','Durable protection'], order: 5, active: true, image: { asset: { url: 'https://images.unsplash.com/photo-1620626011761-996317702b8d?w=600&q=80' } } },
  { _id: '6', name: 'Professional Caulking', slug: { current: 'professional-caulking' }, shortDescription: 'Fresh silicone. Clean finish. Lasting protection.', description: '', bullets: ['Old caulk removal','Premium silicone application','Mold prevention','Clean, sharp lines'], order: 6, active: true, image: { asset: { url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80' } } },
  { _id: '7', name: 'Chip & Crack Repair', slug: { current: 'chip-crack-repair' }, shortDescription: 'Repair chips, cracks, and surface imperfections before they become bigger problems.', description: '', bullets: ['Porcelain and fiberglass repair','Color-matched filler','Seamless surface blending','Preventive sealing'], order: 7, active: true, image: { asset: { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80' } } },
]

export default function Services({ services }: { services?: Service[] }) {
  const list = services && services.length > 0 ? services : FALLBACK

  return (
    <section id="services" className="bg-surface py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="mb-14">
          <p className="section-label">What We Do</p>
          <h2 className="section-title max-w-lg">
            Complete Surface <span className="text-gold">Renewal</span>
          </h2>
          <div className="gold-rule" />
          <p className="section-subtitle">
            Every service uses premium materials and is performed by trained professionals.
            We restore surfaces to like-new condition — without demolition costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
          {list.map((svc) => (
            <div
              key={svc._id}
              className="bg-surface hover:bg-surface-2 transition-colors duration-300 group flex flex-col sm:flex-row"
            >
              {/* Image */}
              {svc.image?.asset?.url && (
                <div className="sm:w-44 lg:w-48 flex-shrink-0 overflow-hidden">
                  <div
                    className="h-44 sm:h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${svc.image.asset.url}')` }}
                    role="img"
                    aria-label={svc.image.alt ?? svc.name}
                  >
                    <div className="w-full h-full bg-black/25 group-hover:bg-black/10 transition-colors" />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-white font-medium text-sm tracking-wide mb-3 group-hover:text-gold transition-colors">
                  {svc.name}
                </h3>
                <p className="text-text-muted text-xs leading-relaxed mb-5">
                  {svc.shortDescription}
                </p>
                <ul className="flex flex-col gap-2 mb-5 flex-1">
                  {svc.bullets?.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <Check size={11} className="text-gold flex-shrink-0" />
                      <span className="text-text-dim text-[11px]">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#estimate"
                  className="mt-auto flex items-center gap-2 text-gold text-[10px] tracking-[0.2em] uppercase hover:gap-3 transition-all"
                >
                  Get a Quote <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
