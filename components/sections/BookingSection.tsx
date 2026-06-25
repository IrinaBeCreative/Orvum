'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Service } from '@/lib/types'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

const APPT_TYPES = [
  { id: 'estimate', label: 'Online Estimate', desc: 'Submit details and receive a quote by email.' },
  { id: 'inspection', label: 'In-Person Inspection', desc: 'A specialist visits for an on-site assessment.' },
  { id: 'service', label: 'Service Appointment', desc: 'Schedule the renewal work once estimate is approved.' },
]

const DEFAULT_SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM']

export default function BookingSection({ services }: { services?: Service[] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [apptType, setApptType] = useState('estimate')
  const [service, setService] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isWeekend = (d: number) => { const day = new Date(year, month, d).getDay(); return day === 0 || day === 6 }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1); setSelectedDay(null) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1); setSelectedDay(null) }

  const handleConfirm = async () => {
    if (!selectedDay || !selectedSlot || !name || !email) {
      toast.error('Please fill in your name, email, select a date and time.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`,
          time: selectedSlot,
          type: apptType,
          service,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
      })
      if (!res.ok) throw new Error('Booking failed')
      setConfirmed(true)
    } catch {
      toast.error('Booking failed. Please try again or call us.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <section id="booking" className="bg-surface py-24 md:py-32">
        <div className="max-w-xl mx-auto px-5 text-center">
          <CheckCircle2 size={52} className="text-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl font-light text-white mb-4">Appointment Requested</h2>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />
          <p className="text-text-muted text-sm leading-relaxed">
            Your appointment request for <span className="text-gold">{MONTHS[month]} {selectedDay}, {year}</span> at{' '}
            <span className="text-gold">{selectedSlot}</span> has been received. We'll confirm by email within 1 business day.
          </p>
          <button onClick={() => { setConfirmed(false); setSelectedDay(null); setSelectedSlot(null) }} className="btn-secondary mt-8">
            Book Another
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="bg-surface py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="mb-12">
          <p className="section-label">Online Scheduling</p>
          <h2 className="section-title">Book an <span className="text-gold">Appointment</span></h2>
          <div className="gold-rule" />
          <p className="section-subtitle">Select appointment type, pick a date and time. No phone call required.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1: Type + info */}
          <div className="flex flex-col gap-4">
            <h3 className="field-label text-base mb-0">1. Select Type & Details</h3>
            {APPT_TYPES.map((t) => (
              <button key={t.id} onClick={() => setApptType(t.id)}
                className={`text-left p-4 border transition-all duration-200 ${apptType === t.id ? 'border-gold bg-bg' : 'border-border hover:border-gold/40'}`}>
                <div className={`text-xs font-medium mb-1 ${apptType === t.id ? 'text-gold' : 'text-white'}`}>{t.label}</div>
                <div className="text-text-dim text-[11px] leading-relaxed">{t.desc}</div>
              </button>
            ))}

            <div className="flex flex-col gap-3 mt-2">
              <div>
                <label className="field-label">Your Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} className="field-input" placeholder="John Smith" />
              </div>
              <div>
                <label className="field-label">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="field-input" placeholder="john@email.com" />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="field-input" placeholder="(813) 555-0100" />
              </div>
              {services && services.length > 0 && (
                <div>
                  <label className="field-label">Service</label>
                  <select value={service} onChange={e => setService(e.target.value)} className="field-input appearance-none bg-surface cursor-pointer">
                    <option value="">Select service</option>
                    {services.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Calendar */}
          <div>
            <h3 className="field-label text-base mb-4">2. Select Date</h3>
            <div className="bg-bg border border-border p-5">
              <div className="flex items-center justify-between mb-5">
                <button onClick={prevMonth} className="text-text-muted hover:text-gold p-1 transition-colors"><ChevronLeft size={17} /></button>
                <span className="text-white text-sm font-medium">{MONTHS[month]} {year}</span>
                <button onClick={nextMonth} className="text-text-muted hover:text-gold p-1 transition-colors"><ChevronRight size={17} /></button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[9px] tracking-widest uppercase text-text-dim py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1
                  const disabled = isPast(d) || isWeekend(d)
                  const sel = selectedDay === d
                  return (
                    <button key={d} disabled={disabled} onClick={() => setSelectedDay(d)}
                      className={`aspect-square flex items-center justify-center text-xs transition-all duration-150 ${
                        disabled ? 'text-border cursor-not-allowed'
                          : sel ? 'bg-gold text-bg font-semibold'
                          : 'text-text-muted hover:bg-surface-2 hover:text-gold cursor-pointer'
                      }`}>
                      {d}
                    </button>
                  )
                })}
              </div>
              <p className="text-text-dim text-[10px] text-center mt-3">Mon–Fri only</p>
            </div>
          </div>

          {/* Step 3: Time + confirm */}
          <div>
            <h3 className="field-label text-base mb-4">3. Select Time</h3>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_SLOTS.map((slot) => (
                <button key={slot} onClick={() => setSelectedSlot(slot)} disabled={!selectedDay}
                  className={`py-3 text-[11px] tracking-wide border transition-all duration-200 ${
                    !selectedDay ? 'border-border/30 text-border cursor-not-allowed'
                      : selectedSlot === slot ? 'bg-gold text-bg border-gold font-semibold'
                      : 'border-border text-text-muted hover:border-gold hover:text-gold'
                  }`}>
                  {slot}
                </button>
              ))}
            </div>

            {selectedDay && selectedSlot && (
              <div className="mt-5 p-4 bg-bg border border-gold/25">
                <p className="field-label">Selection</p>
                <p className="text-white text-sm">{MONTHS[month]} {selectedDay}, {year}</p>
                <p className="text-gold text-sm">{selectedSlot}</p>
              </div>
            )}

            <button onClick={handleConfirm} disabled={!selectedDay || !selectedSlot || loading}
              className={`w-full mt-4 py-4 text-[10px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 ${
                selectedDay && selectedSlot && !loading
                  ? 'bg-gold text-bg hover:bg-gold-2 cursor-pointer'
                  : 'bg-surface text-border cursor-not-allowed'
              }`}>
              {loading ? 'Booking…' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
