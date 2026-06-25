// ServiceAreas
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { ServiceArea } from '@/lib/types'

const FALLBACK: ServiceArea[] = [
  { _id: '1', city: 'Tampa', isPrimary: true, order: 1, description: 'Primary service hub — all services available' },
  { _id: '2', city: 'Brandon', isPrimary: false, order: 2 },
  { _id: '3', city: 'Riverview', isPrimary: false, order: 3 },
  { _id: '4', city: 'Valrico', isPrimary: false, order: 4 },
  { _id: '5', city: 'Lakeland', isPrimary: false, order: 5 },
  { _id: '6', city: 'Plant City', isPrimary: false, order: 6 },
  { _id: '7', city: 'Apollo Beach', isPrimary: false, order: 7 },
  { _id: '8', city: 'Sun City Center', isPrimary: false, order: 8 },
  { _id: '9', city: 'Lithia', isPrimary: false, order: 9 },
  { _id: '10', city: 'Wesley Chapel', isPrimary: false, order: 10 },
]

export function ServiceAreas({ areas }: { areas?: ServiceArea[] }) {
  const list = areas && areas.length > 0 ? areas : FALLBACK
  return (
    <section id="service-areas" className="bg-bg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="section-label">Coverage</p>
            <h2 className="section-title">Service <span className="text-gold">Areas</span></h2>
            <div className="gold-rule" />
            <p className="section-subtitle mb-8">
              Serving homeowners, property managers, realtors, and investors throughout Tampa Bay.
            </p>
            <div className="flex flex-col gap-px bg-border">
              {list.map((a) => (
                <div key={a._id} className="bg-bg hover:bg-surface transition-colors px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin size={13} className={a.isPrimary ? 'text-gold' : 'text-text-dim'} />
                    <span className={`text-sm ${a.isPrimary ? 'text-gold font-medium' : 'text-white'}`}>{a.city}</span>
                    {a.isPrimary && <span className="text-[9px] tracking-[0.15em] uppercase text-gold border border-gold/30 px-1.5 py-0.5">Primary</span>}
                  </div>
                  {a.description && <span className="text-text-dim text-[11px] hidden sm:block">{a.description}</span>}
                </div>
              ))}
              <div className="bg-bg px-5 py-4 flex items-center gap-3">
                <MapPin size={13} className="text-text-dim" />
                <span className="text-text-dim text-sm italic">And surrounding Tampa Bay areas</span>
              </div>
            </div>
            <p className="text-text-dim text-xs mt-4">
              Not sure if we cover your area?{' '}
              <Link href="#estimate" className="text-gold hover:underline">Submit a request</Link>{' '}
              and we'll confirm.
            </p>
          </div>

          {/* Map placeholder */}
          <div className="sticky top-24">
            <div className="bg-surface border border-border aspect-square flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'linear-gradient(#C9A24D 1px, transparent 1px), linear-gradient(90deg, #C9A24D 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              <MapPin size={44} className="text-gold relative z-10" />
              <div className="text-center relative z-10">
                <p className="text-white font-medium mb-1">Tampa Bay Area</p>
                <p className="text-text-muted text-sm">Florida</p>
              </div>
              <div className="relative z-10 flex flex-wrap justify-center gap-x-4 gap-y-1.5 max-w-[240px]">
                {list.slice(0, 6).map((a) => (
                  <div key={a._id} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-gold rounded-full" />
                    <span className="text-text-dim text-[11px]">{a.city}</span>
                  </div>
                ))}
                <span className="text-text-dim text-[11px]">+ more</span>
              </div>
            </div>
            <div className="bg-surface border border-border border-t-0 p-6">
              <h4 className="text-white font-medium text-sm mb-2">Ready to get started?</h4>
              <p className="text-text-muted text-xs leading-relaxed mb-4">
                Submit your estimate request and we'll confirm your area and schedule an appointment.
              </p>
              <Link href="#estimate" className="btn-primary text-[10px] w-full justify-center">
                Get a Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceAreas
