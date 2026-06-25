'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { GalleryItem } from '@/lib/types'

const CATS = ['All', 'Bath Refresh', 'Surface Upgrade', 'Kitchen Renew', 'Tile Painting', 'Caulking', 'Complete Transformation']

const FALLBACK: GalleryItem[] = [
  { _id: '1', title: 'Bathtub Refinishing', description: 'Porcelain tub restored from stained to glossy white.', category: 'Bath Refresh', beforeImage: { asset: { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80' } }, afterImage: { asset: { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80' } } },
  { _id: '2', title: 'Countertop Renewal', description: 'Laminate countertop renewed with premium surface coating.', category: 'Surface Upgrade', beforeImage: { asset: { url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80' } }, afterImage: { asset: { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80' } } },
  { _id: '3', title: 'Cabinet Transformation', description: 'Kitchen cabinets transformed with professional refinishing.', category: 'Kitchen Renew', beforeImage: { asset: { url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80' } }, afterImage: { asset: { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' } } },
  { _id: '4', title: 'Full Bathroom Renewal', description: 'Complete bathroom transformation including tub, tile, and caulking.', category: 'Complete Transformation', beforeImage: { asset: { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80' } }, afterImage: { asset: { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80' } } },
  { _id: '5', title: 'Tile Painting', description: 'Outdated tile painted and sealed for a modern look.', category: 'Tile Painting', beforeImage: { asset: { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80' } }, afterImage: { asset: { url: 'https://images.unsplash.com/photo-1620626011761-996317702b8d?w=600&q=80' } } },
  { _id: '6', title: 'Professional Caulking', description: 'Old moldy caulk removed and replaced with clean silicone.', category: 'Caulking', beforeImage: { asset: { url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80' } }, afterImage: { asset: { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80' } } },
]

function GalleryCard({ item }: { item: GalleryItem }) {
  const [after, setAfter] = useState(false)
  return (
    <div className="group bg-surface border border-border hover:border-gold/30 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={after ? item.afterImage?.asset?.url : item.beforeImage?.asset?.url}
          alt={`${item.title} ${after ? 'after' : 'before'}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 ${
            after ? 'bg-gold text-bg' : 'bg-bg/80 text-white'
          }`}>
            {after ? 'After' : 'Before'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-[9px] tracking-[0.15em] uppercase text-gold border border-gold/40 px-2 py-0.5 bg-bg/70 backdrop-blur-sm">
            {item.category}
          </span>
        </div>
        <button
          onClick={() => setAfter(!after)}
          className="absolute bottom-3 right-3 bg-gold text-bg text-[9px] tracking-[0.15em] uppercase font-bold px-3 py-1.5 hover:bg-gold-2 transition-colors"
        >
          {after ? 'See Before' : 'See After'}
        </button>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white text-sm font-medium mb-2">{item.title}</h3>
        <p className="text-text-muted text-xs leading-relaxed flex-1">{item.description}</p>
        <Link href="#estimate" className="mt-4 flex items-center gap-2 text-gold text-[10px] tracking-[0.2em] uppercase hover:gap-3 transition-all">
          Get Similar Results <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}

export default function Gallery({ items }: { items?: GalleryItem[] }) {
  const [cat, setCat] = useState('All')
  const list = items && items.length > 0 ? items : FALLBACK
  const filtered = cat === 'All' ? list : list.filter((i) => i.category === cat)

  return (
    <section id="gallery" className="bg-bg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="mb-12">
          <p className="section-label">Before & After</p>
          <h2 className="section-title">Real Results. <span className="text-gold">Real Projects.</span></h2>
          <div className="gold-rule" />
          <p className="section-subtitle">
            Toggle each card to compare before and after. Every project completed with premium materials.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-[9px] tracking-[0.2em] uppercase font-medium px-4 py-2 transition-all duration-200 ${
                cat === c ? 'bg-gold text-bg' : 'border border-border text-text-muted hover:border-gold/40 hover:text-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {filtered.map((item) => <GalleryCard key={item._id} item={item} />)}
        </div>
      </div>
    </section>
  )
}
