'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Plus, Trash2, Send, Loader2 } from 'lucide-react'
import { LEAD_STAGES, type Lead, type LeadStage, type QuoteLineItem } from '@/lib/types'
import { toast } from 'sonner'

function StageBadge({ stage }: { stage: LeadStage }) {
  const def = LEAD_STAGES.find((s) => s.value === stage)
  return <span className={`admin-badge border ${def?.color ?? 'stage-new'}`}>{def?.label ?? stage}</span>
}

export default function LeadDetail({ lead: initialLead }: { lead: Lead }) {
  const [lead, setLead] = useState<Lead>(initialLead)
  const [notes, setNotes] = useState(lead.notes ?? '')
  const [estimateAmount, setEstimateAmount] = useState(lead.estimateAmount?.toString() ?? '')
  const [assignedTech, setAssignedTech] = useState(lead.assignedTech ?? '')
  const [saving, setSaving] = useState(false)

  // Quote builder
  const [items, setItems] = useState<QuoteLineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, total: 0 },
  ])
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(7)
  const [warranty, setWarranty] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [sendingQuote, setSendingQuote] = useState(false)

  // AI email generator
  const [emailPrompt, setEmailPrompt] = useState('')
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [generatingEmail, setGeneratingEmail] = useState(false)

  const updateLead = async (payload: Partial<Lead>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead._id, ...payload }),
      })
      if (!res.ok) throw new Error()
      setLead((prev) => ({ ...prev, ...payload }))
      toast.success('Saved')
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const changeStage = (stage: LeadStage) => updateLead({ stage })
  const saveNotes = () => updateLead({ notes, estimateAmount: parseFloat(estimateAmount) || undefined, assignedTech })

  // Quote builder helpers
  const updateItem = (i: number, field: keyof QuoteLineItem, val: string | number) => {
    setItems((prev) => {
      const updated = [...prev]
      updated[i] = { ...updated[i], [field]: val }
      if (field === 'quantity' || field === 'unitPrice') {
        updated[i].total = Number(updated[i].quantity) * Number(updated[i].unitPrice)
      }
      return updated
    })
  }
  const addItem = () => setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0, total: 0 }])
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, j) => j !== i))

  const subtotal = items.reduce((s, it) => s + it.total, 0)
  const discountAmt = subtotal * (discount / 100)
  const taxAmt = (subtotal - discountAmt) * (tax / 100)
  const total = subtotal - discountAmt + taxAmt

  const sendQuote = async () => {
    setSendingQuote(true)
    try {
      const res = await fetch('/api/admin/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead._id,
          customerEmail: lead.email,
          customerName: lead.fullName,
          service: lead.service,
          items, subtotal, discount: discountAmt, tax: taxAmt, total,
          warranty, notes: quoteNotes,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Estimate sent to customer')
      changeStage('estimate_sent')
    } catch {
      toast.error('Failed to send estimate')
    } finally {
      setSendingQuote(false)
    }
  }

  const generateEmail = async () => {
    if (!emailPrompt.trim()) return
    setGeneratingEmail(true)
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'email', payload: { prompt: `Customer: ${lead.fullName}, Service: ${lead.service}, Stage: ${lead.stage}. Situation: ${emailPrompt}` } }),
      })
      const data = await res.json()
      setGeneratedEmail(data.result)
    } catch {
      toast.error('AI generation failed')
    } finally {
      setGeneratingEmail(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Back */}
      <Link href="/admin/leads" className="flex items-center gap-2 text-text-dim text-xs hover:text-gold transition-colors mb-6">
        <ArrowLeft size={13} /> Back to Leads
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-white mb-1">{lead.fullName}</h1>
          <p className="text-text-muted text-sm">{lead.service} · {lead.propertyType}</p>
        </div>
        <div className="flex items-center gap-3">
          <StageBadge stage={lead.stage} />
          <select
            value={lead.stage}
            onChange={(e) => changeStage(e.target.value as LeadStage)}
            className="bg-bg border border-border text-[10px] tracking-[0.1em] uppercase py-2.5 px-3 text-text-muted cursor-pointer outline-none hover:border-gold/40"
          >
            {LEAD_STAGES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: customer info */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-border p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-4">Contact</h3>
            {[
              { label: 'Email', value: lead.email },
              { label: 'Phone', value: lead.phone },
              { label: 'Address', value: lead.address },
              { label: 'Submitted', value: new Date(lead._createdAt).toLocaleString() },
            ].map((r) => (
              <div key={r.label} className="mb-3">
                <div className="text-[10px] text-text-dim tracking-wide uppercase mb-0.5">{r.label}</div>
                <div className="text-white text-xs">{r.value}</div>
              </div>
            ))}
          </div>

          {/* Preferred */}
          {(lead.preferredDate || lead.preferredTime) && (
            <div className="bg-surface border border-border p-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-3">Preferred Schedule</h3>
              {lead.preferredDate && <div className="text-white text-xs mb-1">📅 {lead.preferredDate}</div>}
              {lead.preferredTime && <div className="text-white text-xs">🕐 {lead.preferredTime}</div>}
            </div>
          )}

          {/* Photos */}
          {lead.photos && lead.photos.length > 0 && (
            <div className="bg-surface border border-border p-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-3">
                Photos ({lead.photos.length})
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {lead.photos.map((p, i) => (
                  <a key={i} href={p.asset.url} target="_blank" rel="noopener noreferrer">
                    <img src={p.asset.url} alt={`Photo ${i + 1}`}
                      className="w-full aspect-square object-cover hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Email log */}
          {lead.emailLog && lead.emailLog.length > 0 && (
            <div className="bg-surface border border-border p-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-3">Email Log</h3>
              <div className="flex flex-col gap-2">
                {lead.emailLog.map((e, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Mail size={11} className="text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-white">{e.subject}</div>
                      <div className="text-[10px] text-text-dim">{new Date(e.sentAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle: notes + internal */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-border p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-4">Internal Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="field-input resize-none mb-4"
              placeholder="Add notes, observations, follow-up reminders…"
            />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="field-label">Estimate Amount</label>
                <input
                  value={estimateAmount}
                  onChange={(e) => setEstimateAmount(e.target.value)}
                  type="number" className="field-input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="field-label">Assigned Tech</label>
                <input
                  value={assignedTech}
                  onChange={(e) => setAssignedTech(e.target.value)}
                  className="field-input"
                  placeholder="Tech name"
                />
              </div>
            </div>
            <button onClick={saveNotes} disabled={saving} className="btn-primary text-[10px] py-3">
              {saving ? 'Saving…' : 'Save Notes'}
            </button>
          </div>

          {/* Description */}
          {lead.description && (
            <div className="bg-surface border border-border p-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-3">Customer Description</h3>
              <p className="text-text-muted text-xs leading-relaxed">{lead.description}</p>
            </div>
          )}

          {/* AI email assistant */}
          <div className="bg-surface border border-border p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-gold mb-4">AI Email Generator</h3>
            <textarea
              value={emailPrompt}
              onChange={(e) => setEmailPrompt(e.target.value)}
              rows={2}
              className="field-input resize-none mb-3"
              placeholder="e.g. Follow up on estimate, no response in 3 days"
            />
            <button onClick={generateEmail} disabled={generatingEmail} className="btn-ghost text-[10px] flex items-center gap-2 mb-3">
              {generatingEmail ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              {generatingEmail ? 'Generating…' : 'Generate Email'}
            </button>
            {generatedEmail && (
              <div className="bg-bg border border-border p-4">
                <p className="text-text-muted text-xs leading-relaxed whitespace-pre-wrap">{generatedEmail}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(generatedEmail); toast.success('Copied') }}
                  className="mt-3 text-gold text-[10px] hover:underline"
                >
                  Copy to clipboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: quote builder */}
        <div className="bg-surface border border-border p-5">
          <h3 className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-4">Quote Builder</h3>

          <div className="flex flex-col gap-2 mb-4">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-start">
                <input
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  className="field-input text-xs"
                  placeholder="Service description"
                />
                <input
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                  type="number" min="1"
                  className="field-input w-14 text-xs text-center"
                  title="Qty"
                />
                <input
                  value={item.unitPrice}
                  onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))}
                  type="number" min="0"
                  className="field-input w-20 text-xs"
                  placeholder="Price"
                />
                <button onClick={() => removeItem(i)} className="text-text-dim hover:text-amber-400 p-2">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={addItem} className="flex items-center gap-1.5 text-gold text-[10px] hover:underline mb-4">
            <Plus size={12} /> Add Line Item
          </button>

          <div className="border-t border-border pt-4 mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="field-label">Discount %</label>
                <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="field-input text-sm" />
              </div>
              <div>
                <label className="field-label">Tax %</label>
                <input type="number" min="0" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="field-input text-sm" />
              </div>
            </div>
            <div>
              <label className="field-label">Warranty</label>
              <input value={warranty} onChange={(e) => setWarranty(e.target.value)} className="field-input text-sm" placeholder="e.g. 2-year warranty" />
            </div>
          </div>

          <div className="bg-bg border border-border p-4 mb-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs"><span className="text-text-dim">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-xs"><span className="text-text-dim">Discount ({discount}%)</span><span>-${discountAmt.toFixed(2)}</span></div>}
            <div className="flex justify-between text-xs"><span className="text-text-dim">Tax ({tax}%)</span><span>${taxAmt.toFixed(2)}</span></div>
            <div className="flex justify-between text-white font-semibold text-sm border-t border-border pt-2 mt-1">
              <span>Total</span><span className="text-gold">${total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="field-label">Quote Notes</label>
            <textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} rows={2}
              className="field-input resize-none mb-4" placeholder="Additional notes for customer…" />
          </div>

          <button onClick={sendQuote} disabled={sendingQuote || items[0].description === ''}
            className="btn-primary w-full justify-center text-[10px]">
            {sendingQuote ? <Loader2 size={14} className="animate-spin mr-2" /> : <Send size={13} />}
            {sendingQuote ? 'Sending…' : 'Send Estimate to Customer'}
          </button>
        </div>
      </div>
    </div>
  )
}
