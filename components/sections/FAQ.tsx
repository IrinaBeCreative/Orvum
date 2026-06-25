'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { FaqItem } from '@/lib/types'

const FALLBACK: FaqItem[] = [
  { _id: '1', question: 'Do I need to call to get an estimate?', answer: 'No. You can submit your request online, upload photos, and book an appointment through our website. No phone call required.', order: 1 },
  { _id: '2', question: 'Is refinishing cheaper than replacement?', answer: 'Yes. Surface renewal typically costs a fraction of full replacement and avoids major demolition, mess, and extended downtime.', order: 2 },
  { _id: '3', question: 'How long does the work take?', answer: 'Most projects are completed in one day depending on surface size and condition. We\'ll confirm the timeline when you book.', order: 3 },
  { _id: '4', question: 'Can I upload photos with my request?', answer: 'Yes. Photos are optional but highly recommended — they help us provide a faster and more accurate estimate.', order: 4 },
  { _id: '5', question: 'Do you work with property managers?', answer: 'Yes. We work with apartment communities, landlords, realtors, and property managers throughout Tampa Bay. We offer multi-unit pricing and recurring service agreements.', order: 5 },
  { _id: '6', question: 'Do you offer recurring service agreements?', answer: 'Yes. Commercial clients can request recurring service agreements and multi-unit pricing. Contact us for a commercial quote.', order: 6 },
  { _id: '7', question: 'What surfaces can you refinish?', answer: 'We refinish bathtubs, showers, countertops, cabinets, wall and floor tile. We also perform professional caulking replacement and chip and crack repair.', order: 7 },
  { _id: '8', question: 'How do I pay for the service?', answer: 'We accept credit cards, Apple Pay, Google Pay, and PayPal through our secure online payment system. A deposit may be required to confirm your appointment.', order: 8 },
]

function FAQItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-white text-sm font-medium group-hover:text-gold transition-colors">
          {item.question}
        </span>
        <span className="flex-shrink-0 text-gold">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-text-muted text-sm leading-relaxed">{item.answer}</p>
      </div>
    </div>
  )
}

export default function FAQ({ items }: { items?: FaqItem[] }) {
  const list = items && items.length > 0 ? items : FALLBACK

  return (
    <section id="faq" className="bg-surface py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label">FAQ</p>
          <h2 className="section-title">Common <span className="text-gold">Questions</span></h2>
          <div className="w-12 h-px bg-gold mx-auto mt-6" />
        </div>
        <div className="border-t border-border">
          {list.map((item) => <FAQItem key={item._id} item={item} />)}
        </div>
      </div>
    </section>
  )
}
