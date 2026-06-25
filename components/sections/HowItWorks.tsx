import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const STEPS = [
  { n: '01', title: 'Submit Your Request', body: 'Choose your service and fill out the online form. No phone call required. Takes less than 2 minutes.' },
  { n: '02', title: 'Upload Photos', body: 'Upload photos of the surfaces to be renewed. Optional — but helps us send a faster, more accurate estimate.' },
  { n: '03', title: 'Receive Your Estimate', body: 'ORVUM reviews your project and sends a transparent, itemized estimate to your email within 1 business day.' },
  { n: '04', title: 'Book Your Appointment', body: 'Select your preferred date and time from our online calendar. Instant confirmation — no waiting on hold.' },
  { n: '05', title: 'We Renew Your Space', body: 'Your technician arrives, completes the work with precision, and leaves the area clean and ready to use.' },
]

export default function HowItWorks() {
  return (
    <section className="bg-surface py-24 md:py-32 relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[clamp(100px,18vw,240px)] font-light text-bg select-none pointer-events-none leading-none">
        HOW
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="mb-14">
          <p className="section-label">The Process</p>
          <h2 className="section-title">How It <span className="text-gold">Works</span></h2>
          <div className="gold-rule" />
          <p className="section-subtitle">
            From request to renewed surface — entirely online. No unnecessary phone calls.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-border">
          {STEPS.map((step, i) => (
            <div key={step.n} className="bg-surface hover:bg-surface-2 transition-colors p-7 flex flex-col gap-5 group">
              <div className="flex items-center gap-3">
                <span className="font-display text-4xl font-light text-border group-hover:text-gold/20 transition-colors">
                  {step.n}
                </span>
                <div className="w-6 h-px bg-gold" />
              </div>
              <h3 className="text-white font-medium text-sm">{step.title}</h3>
              <p className="text-text-muted text-xs leading-relaxed flex-1">{step.body}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex justify-end">
                  <ArrowRight size={14} className="text-gold/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="#estimate" className="btn-primary group">
            Start Your Project Online
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
