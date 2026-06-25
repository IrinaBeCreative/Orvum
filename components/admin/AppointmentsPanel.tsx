'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, User, Phone, ExternalLink } from 'lucide-react'
import type { Appointment } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  pending: 'bg-gold/10 text-gold border-gold/30',
  completed: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  cancelled: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30',
}

export default function AppointmentsPanel({ appointments }: { appointments: Appointment[] }) {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all')

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  // Group by date
  const grouped = filtered.reduce((acc, apt) => {
    const d = apt.date
    if (!acc[d]) acc[d] = []
    acc[d].push(apt)
    return acc
  }, {} as Record<string, Appointment[]>)

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-light text-white mb-1">Appointments</h1>
          <p className="text-text-muted text-sm">{filtered.length} scheduled</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['all', 'confirmed', 'pending', 'completed'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-[9px] tracking-[0.2em] uppercase font-medium px-3 py-2 transition-all border ${
              filter === s ? 'bg-gold text-bg border-gold' : 'border-border text-text-muted hover:border-gold/40'
            }`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="bg-surface border border-border p-12 text-center text-text-muted text-sm">
          No appointments found.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, apts]) => {
              const dateObj = new Date(date + 'T12:00:00')
              const isToday = date === today
              const isPast = date < today
              return (
                <div key={date}>
                  <div className={`flex items-center gap-3 mb-3`}>
                    <div className={`text-[10px] tracking-[0.2em] uppercase font-semibold ${
                      isToday ? 'text-gold' : isPast ? 'text-text-dim' : 'text-white'
                    }`}>
                      {isToday ? '— Today — ' : ''}
                      {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-text-dim text-[10px]">{apts.length} appt{apts.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {apts
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((apt) => (
                        <div key={apt._id}
                          className={`bg-surface border p-5 flex flex-col gap-3 transition-colors ${
                            isToday ? 'border-gold/30' : 'border-border'
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock size={13} className="text-gold" />
                              <span className="text-white text-sm font-medium">{apt.time}</span>
                            </div>
                            <span className={`admin-badge border ${STATUS_COLORS[apt.status] ?? ''}`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={12} className="text-text-dim" />
                            <span className="text-white text-xs">{apt.customerName}</span>
                          </div>
                          {apt.customerPhone && (
                            <a href={`tel:${apt.customerPhone.replace(/\D/g, '')}`}
                              className="flex items-center gap-2 text-text-dim hover:text-gold transition-colors text-xs">
                              <Phone size={12} />
                              {apt.customerPhone}
                            </a>
                          )}
                          <div className="text-gold text-xs">{apt.service}</div>
                          {apt.notes && <p className="text-text-dim text-[11px] leading-relaxed">{apt.notes}</p>}
                        </div>
                      ))}
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
