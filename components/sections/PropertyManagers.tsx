'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Check, Upload, X, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const BENEFITS = [
  { t: 'Faster Turnovers', d: 'Most services completed in 1 day. Minimize vacancy days and get units market-ready faster.' },
  { t: 'Lower Costs', d: 'Surface renewal costs a fraction of full replacement — without cutting quality.' },
  { t: 'Multi-Unit Pricing', d: 'Volume discounts for apartment communities and property management companies.' },
  { t: 'Recurring Agreements', d: 'Establish a recurring maintenance schedule. One call, consistent results.' },
]

const SERVICES = [
  'Apartment turnover services', 'Bathtub refinishing', 'Shower restoration',
  'Countertop refinishing', 'Cabinet refinishing', 'Tile painting',
  'Caulking replacement', 'Chip and crack repair', 'Multi-unit projects',
  'Recurring service agreements', 'Volume discounts',
]

type FormData = {
  companyName: string; contactName: string; email: string; phone: string;
  address: string; units: string; servicesNeeded: string; recurringNeeds: string; notes: string;
}

export default function PropertyManagers() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => v && fd.append(k, v))
      files.forEach((f) => fd.append('photos', f))
      fd.append('type', 'commercial')

      const res = await fetch('/api/estimate', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      reset()
      setFiles([])
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="property-managers" className="bg-bg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <p className="section-label">Property Managers & Investors</p>
            <h2 className="section-title">
              Turn Units Faster.<br />
              <span className="text-gold">Replace Less.</span>
            </h2>
            <div className="gold-rule" />
            <p className="section-subtitle mb-8">
              ORVUM helps property managers reduce turnover costs with professional surface renewal
              for bathrooms, kitchens, countertops, cabinets, tile, and caulking throughout Tampa Bay.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div key={b.t} className="bg-surface border border-border p-5 hover:border-gold/30 transition-colors">
                  <div className="w-6 h-px bg-gold mb-4" />
                  <h4 className="text-white text-sm font-medium mb-2">{b.t}</h4>
                  <p className="text-text-muted text-xs leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border p-8">
            <h3 className="text-gold text-[10px] tracking-[0.25em] uppercase font-semibold mb-6">
              Services for Property Managers
            </h3>
            <ul className="flex flex-col gap-3 mb-8">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-center gap-3">
                  <Check size={12} className="text-gold flex-shrink-0" />
                  <span className="text-text-muted text-xs">{s}</span>
                </li>
              ))}
            </ul>
            <a href="#pm-form" className="btn-primary text-[10px] w-full justify-center">
              Request Commercial Quote
            </a>
          </div>
        </div>

        {/* Commercial form */}
        <div id="pm-form" className="border-t border-border pt-16">
          <h3 className="font-display text-3xl font-light text-white mb-2">Commercial Quote Request</h3>
          <div className="gold-rule" />

          {submitted ? (
            <div className="text-center py-16">
              <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
              <p className="text-white font-light text-lg">Quote request received.</p>
              <p className="text-text-muted text-sm mt-2">We'll respond within 1 business day.</p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary text-[10px] mt-6">
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div><label className="field-label">Company Name *</label><input required {...register('companyName')} className="field-input" placeholder="ABC Property Mgmt" /></div>
              <div><label className="field-label">Contact Name *</label><input required {...register('contactName')} className="field-input" placeholder="Jane Smith" /></div>
              <div><label className="field-label">Email *</label><input required type="email" {...register('email')} className="field-input" placeholder="jane@company.com" /></div>
              <div><label className="field-label">Phone *</label><input required type="tel" {...register('phone')} className="field-input" placeholder="(813) 555-0100" /></div>
              <div><label className="field-label">Property Address</label><input {...register('address')} className="field-input" placeholder="123 Main St, Tampa, FL" /></div>
              <div><label className="field-label">Number of Units</label><input type="number" min="1" {...register('units')} className="field-input" placeholder="e.g. 24" /></div>
              <div className="sm:col-span-2 lg:col-span-3"><label className="field-label">Services Needed</label><input {...register('servicesNeeded')} className="field-input" placeholder="e.g. Bathtub refinishing, countertop refinishing, caulking" /></div>
              <div>
                <label className="field-label">Recurring Needs</label>
                <select {...register('recurringNeeds')} className="field-input appearance-none bg-bg cursor-pointer">
                  <option value="">Select</option>
                  <option>One-time project</option>
                  <option>Monthly recurring</option>
                  <option>Quarterly recurring</option>
                  <option>As-needed basis</option>
                </select>
              </div>
              <div className="sm:col-span-1 lg:col-span-2"><label className="field-label">Project Notes</label><textarea {...register('notes')} rows={3} className="field-input resize-none" placeholder="Additional details..." /></div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="field-label">Upload Photos (optional)</label>
                <div className="border border-dashed border-border hover:border-gold/50 transition-colors p-5 text-center cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => e.target.files && setFiles(Array.from(e.target.files))} className="sr-only" />
                  <Upload size={18} className="text-gold mx-auto mb-1" />
                  <p className="text-text-muted text-xs">Upload project photos</p>
                </div>
                {files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-surface border border-border px-2.5 py-1 text-[11px] text-text-muted">
                        <span className="truncate max-w-[110px]">{f.name}</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X size={10} className="text-text-dim hover:text-gold" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Submitting…' : 'Submit Commercial Quote Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
