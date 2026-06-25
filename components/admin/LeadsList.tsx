'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Filter, ExternalLink } from 'lucide-react'
import { LEAD_STAGES, type Lead, type LeadStage } from '@/lib/types'
import { toast } from 'sonner'

function StageBadge({ stage }: { stage: LeadStage }) {
  const def = LEAD_STAGES.find((s) => s.value === stage)
  return (
    <span className={`admin-badge border ${def?.color ?? 'stage-new'}`}>
      {def?.label ?? stage}
    </span>
  )
}

export default function LeadsList({
  initialLeads,
  currentStage,
}: {
  initialLeads: Lead[]
  currentStage: string
}) {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return leads
    const q = search.toLowerCase()
    return leads.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q) ||
        l.phone.includes(q)
    )
  }, [leads, search])

  const changeStage = async (id: string, stage: LeadStage) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stage }),
      })
      if (!res.ok) throw new Error()
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, stage } : l)))
      toast.success('Stage updated')
    } catch {
      toast.error('Failed to update stage')
    } finally {
      setUpdatingId(null)
    }
  }

  const setStageFilter = (stage: string) => {
    router.push(`/admin/leads${stage !== 'all' ? `?stage=${stage}` : ''}`)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-light text-white mb-1">CRM Leads</h1>
          <p className="text-text-muted text-sm">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>
      </div>

      {/* Stage filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStageFilter('all')}
          className={`text-[9px] tracking-[0.2em] uppercase font-medium px-3 py-2 transition-all ${
            currentStage === 'all' ? 'bg-gold text-bg' : 'border border-border text-text-muted hover:border-gold/40'
          }`}
        >
          All
        </button>
        {LEAD_STAGES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStageFilter(s.value)}
            className={`text-[9px] tracking-[0.2em] uppercase font-medium px-3 py-2 transition-all ${
              currentStage === s.value ? 'bg-gold text-bg' : 'border border-border text-text-muted hover:border-gold/40'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone…"
          className="field-input pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-border overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-sm">No leads found.</div>
        ) : (
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Type</th>
                <th>Stage</th>
                <th>Date</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div className="text-white font-medium text-sm">{lead.fullName}</div>
                  </td>
                  <td>
                    <div className="text-xs">{lead.email}</div>
                    <div className="text-text-dim text-[11px]">{lead.phone}</div>
                  </td>
                  <td className="text-xs max-w-[140px] truncate">{lead.service}</td>
                  <td className="text-xs">{lead.propertyType}</td>
                  <td>
                    {updatingId === lead._id ? (
                      <span className="text-text-dim text-[11px]">Updating…</span>
                    ) : (
                      <select
                        value={lead.stage}
                        onChange={(e) => changeStage(lead._id, e.target.value as LeadStage)}
                        className="bg-bg border border-border text-[10px] tracking-[0.1em] uppercase py-1.5 px-2 text-text-muted cursor-pointer hover:border-gold/40 transition-colors outline-none"
                      >
                        {LEAD_STAGES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="text-xs whitespace-nowrap">
                    {new Date(lead._createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="text-xs">
                    {lead.estimateAmount ? `$${lead.estimateAmount.toLocaleString()}` : <span className="text-text-dim">—</span>}
                  </td>
                  <td>
                    <Link href={`/admin/leads/${lead._id}`}
                      className="flex items-center gap-1 text-gold text-[11px] hover:underline whitespace-nowrap">
                      View <ExternalLink size={11} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
