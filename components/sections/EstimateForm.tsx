'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, CheckCircle2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import type { Service } from '@/lib/types'

const schema = z.object({
  fullName: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Required'),
  address: z.string().min(5, 'Required'),
  service: z.string().min(1, 'Select a service'),
  propertyType: z.string().min(1, 'Select a type'),
  description: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const PROPERTY_TYPES = ['Homeowner', 'Realtor', 'Property Manager', 'Apartment Community', 'Investor / House Flipper']
const TIME_SLOTS = ['8:00 AM – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 PM – 2:00 PM', '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM']

const FALLBACK_SERVICES = [
  'Bathtub Refinishing', 'Shower Restoration', 'Countertop Refinishing',
  'Cabinet Refinishing', 'Tile Painting', 'Tile & Grout Refresh',
  'Professional Caulking', 'Chip & Crack Repair', 'Complete Transformation', 'Multiple Services',
]

export default function EstimateForm({ services }: { services?: Service[] }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const serviceNames = services && services.length > 0
    ? services.map((s) => s.name)
    : FALLBACK_SERVICES

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v))
      files.forEach((f) => formData.append('photos', f))

      const res = await fetch('/api/estimate', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error ?? 'Submission failed')

      setSubmitted(true)
      reset()
      setFiles([])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files).slice(0, 8))
  }

  if (submitted) {
    return (
      <section id="estimate" className="bg-bg py-24 md:py-32">
        <div className="max-w-xl mx-auto px-5 text-center">
          <CheckCircle2 size={52} className="text-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl font-light text-white mb-4">Request Received</h2>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Thank you for contacting ORVUM. We received your request and will review your
            project details shortly. Expect a response within 1 business day.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary">
            Submit Another Request
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="estimate" className="bg-bg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="section-label">Free Estimate</p>
            <h2 className="section-title">Start Your Project <span className="text-gold">Online</span></h2>
            <div className="gold-rule" />
            <p className="section-subtitle mb-10">
              Fill out the form and receive a transparent estimate by email. No phone call required.
              Photos are optional but speed up the process.
            </p>
            <div className="flex flex-col gap-7">
              {[
                { n: '01', t: 'Submit your details', s: 'Less than 2 minutes' },
                { n: '02', t: 'Upload photos (optional)', s: 'Faster, more accurate estimates' },
                { n: '03', t: 'Receive your estimate', s: 'Within 1 business day' },
                { n: '04', t: 'Book your appointment', s: 'Online, on your schedule' },
              ].map((i) => (
                <div key={i.n} className="flex items-start gap-5">
                  <span className="font-display text-4xl font-light text-gold/25 w-12 flex-shrink-0">{i.n}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{i.t}</div>
                    <div className="text-text-dim text-xs mt-0.5">{i.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-surface border border-border p-8 lg:p-10"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full name */}
              <div className="sm:col-span-2">
                <label className="field-label">Full Name *</label>
                <input {...register('fullName')} className="field-input" placeholder="John Smith" />
                {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="field-label">Email *</label>
                <input type="email" {...register('email')} className="field-input" placeholder="john@email.com" />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="field-label">Phone *</label>
                <input type="tel" {...register('phone')} className="field-input" placeholder="(813) 555-0100" />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="field-label">Property Address *</label>
                <input {...register('address')} className="field-input" placeholder="123 Main St, Tampa, FL" />
                {errors.address && <p className="field-error">{errors.address.message}</p>}
              </div>

              {/* Property type */}
              <div>
                <label className="field-label">Property Type *</label>
                <select {...register('propertyType')} className="field-input appearance-none bg-surface cursor-pointer">
                  <option value="">Select type</option>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.propertyType && <p className="field-error">{errors.propertyType.message}</p>}
              </div>

              {/* Service */}
              <div>
                <label className="field-label">Service Needed *</label>
                <select {...register('service')} className="field-input appearance-none bg-surface cursor-pointer">
                  <option value="">Select service</option>
                  {serviceNames.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className="field-error">{errors.service.message}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="field-label">Project Description</label>
                <textarea {...register('description')} rows={3} className="field-input resize-none"
                  placeholder="Describe the surfaces, any chips, stains, or specific concerns..." />
              </div>

              {/* Date */}
              <div>
                <label className="field-label">Preferred Date</label>
                <input type="date" {...register('preferredDate')} className="field-input"
                  min={new Date().toISOString().split('T')[0]} />
              </div>

              {/* Time */}
              <div>
                <label className="field-label">Preferred Time</label>
                <select {...register('preferredTime')} className="field-input appearance-none bg-surface cursor-pointer">
                  <option value="">Select time window</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* File upload */}
              <div className="sm:col-span-2">
                <label className="field-label">Upload Photos (optional)</label>
                <div
                  className="border border-dashed border-border hover:border-gold/50 transition-colors p-6 text-center cursor-pointer relative"
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles}
                    className="sr-only" aria-label="Upload photos" />
                  <Upload size={22} className="text-gold mx-auto mb-2" />
                  <p className="text-text-muted text-xs">Click to upload photos</p>
                  <p className="text-text-dim text-[11px] mt-1">JPG, PNG — max 8 files, 10MB each</p>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-bg border border-border px-3 py-1.5 text-[11px] text-text-muted">
                        <span className="truncate max-w-[130px]">{f.name}</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                          <X size={11} className="text-text-dim hover:text-gold" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-8 group">
              {loading ? 'Submitting…' : 'Submit Estimate Request'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <p className="text-center text-text-dim text-[11px] mt-4">
              We respond within 1 business day. No commitment required.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
