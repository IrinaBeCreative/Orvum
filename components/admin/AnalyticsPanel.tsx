'use client'

import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { LEAD_STAGES, type Lead } from '@/lib/types'
import { TrendingUp, Users, DollarSign, Star, Clock, Repeat } from 'lucide-react'

const GOLD = '#C9A24D'
const GOLD2 = '#D8B86A'
const SURFACE = '#1A1A1A'
const BORDER = '#2A2A2A'
const MUTED = '#888888'

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <div className="admin-stat">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-gold" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-text-dim">{label}</span>
      </div>
      <div className="font-display text-4xl font-light text-white">{value}</div>
      {sub && <div className="text-text-dim text-[11px] mt-1">{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 text-xs">
        <p className="text-text-muted mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: GOLD }} className="font-medium">{p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue') ? `$${p.value.toLocaleString()}` : p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPanel({
  analytics,
  leads,
}: {
  analytics: { leads: { total: number; new: number; today: number; completed: number }; appointments: { total: number; upcoming: number; today: number } }
  leads: Lead[]
}) {
  // Stage distribution
  const stageData = useMemo(() => {
    return LEAD_STAGES.map((s) => ({
      name: s.label,
      count: leads.filter((l) => l.stage === s.value).length,
    })).filter((d) => d.count > 0)
  }, [leads])

  // Service distribution
  const serviceData = useMemo(() => {
    const map: Record<string, number> = {}
    leads.forEach((l) => { map[l.service] = (map[l.service] ?? 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name: name.replace(' Refinishing', '').replace(' Restoration', ''), count }))
  }, [leads])

  // Monthly leads (last 6 months)
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      map[key] = 0
    }
    leads.forEach((l) => {
      const d = new Date(l._createdAt)
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (map[key] !== undefined) map[key]++
    })
    return Object.entries(map).map(([month, leads]) => ({ month, leads }))
  }, [leads])

  // Property type distribution
  const propertyData = useMemo(() => {
    const map: Record<string, number> = {}
    leads.forEach((l) => { if (l.propertyType) map[l.propertyType] = (map[l.propertyType] ?? 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
  }, [leads])

  const totalRevenue = leads.filter((l) => l.estimateAmount).reduce((s, l) => s + (l.estimateAmount ?? 0), 0)
  const conversionRate = leads.length > 0 ? Math.round((analytics.leads.completed / leads.length) * 100) : 0
  const repeatCount = leads.filter((l) => l.stage === 'repeat_customer').length

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-white mb-1">Analytics</h1>
        <p className="text-text-muted text-sm">All-time performance overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={Users} label="Total Leads" value={analytics.leads.total} />
        <StatCard icon={TrendingUp} label="Completed" value={analytics.leads.completed} sub={`${conversionRate}% conversion`} />
        <StatCard icon={DollarSign} label="Est. Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}k`} sub="From estimates" />
        <StatCard icon={Repeat} label="Repeat" value={repeatCount} sub="Repeat customers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly leads */}
        <div className="bg-surface border border-border p-5">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-5">Monthly Leads (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barCategoryGap="30%">
              <CartesianGrid stroke={BORDER} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1A1A1A' }} />
              <Bar dataKey="leads" fill={GOLD} radius={[0, 0, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stage distribution */}
        <div className="bg-surface border border-border p-5">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-5">Leads by Stage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} layout="vertical" barCategoryGap="25%">
              <CartesianGrid stroke={BORDER} horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: MUTED, fontSize: 9 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1A1A1A' }} />
              <Bar dataKey="count" fill={GOLD2} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top services */}
        <div className="bg-surface border border-border p-5">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-5">Top Services</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviceData} barCategoryGap="30%">
              <CartesianGrid stroke={BORDER} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: MUTED, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1A1A1A' }} />
              <Bar dataKey="count" fill={GOLD} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property types */}
        <div className="bg-surface border border-border p-5">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-text-dim mb-5">Customer Types</h3>
          <div className="flex flex-col gap-3 mt-2">
            {propertyData.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-text-muted text-xs w-36 flex-shrink-0">{p.name}</span>
                <div className="flex-1 h-1.5 bg-bg relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-gold"
                    style={{ width: `${(p.count / Math.max(...propertyData.map((x) => x.count))) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs font-medium w-6 text-right">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
