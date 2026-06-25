'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Property Managers', href: '#property-managers' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Service Areas', href: '#service-areas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#estimate' },
]

export default function Navbar({ settings }: { settings?: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const phone = settings?.phone ?? '813-555-0148'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-[72px] flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group" aria-label="ORVUM home">
            <div className="text-gold font-display text-2xl font-semibold tracking-[0.15em] group-hover:text-gold-2 transition-colors">
              ORVUM
            </div>
            <div className="text-[8px] tracking-[0.3em] uppercase text-text-dim font-light -mt-0.5">
              Restore Instead of Replace
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden xl:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-gold transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden xl:flex items-center gap-4">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-gold transition-colors"
            >
              <Phone size={12} className="text-gold" />
              {phone}
            </a>
            <Link href="#estimate" className="btn-primary text-[10px] py-3 px-5">
              Get Estimate
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 text-white"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-40 bg-bg transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: 72 }}
      >
        <nav className="flex flex-col h-full overflow-y-auto px-5 pt-4 pb-10 border-t border-border">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-4 border-b border-border text-sm tracking-[0.15em] uppercase text-text-muted hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-8">
            <Link href="#estimate" onClick={() => setOpen(false)} className="btn-primary justify-center">
              Get a Free Estimate
            </Link>
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="btn-secondary justify-center flex items-center gap-2">
              <Phone size={14} /> {phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
