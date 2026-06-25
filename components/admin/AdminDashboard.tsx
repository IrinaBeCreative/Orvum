'use client'

import Link from 'next/link'
import { Users, Calendar, TrendingUp, Clock, ArrowRight, ExternalLink } from 'lucide-react'
import { LEAD_STAGES } from '@/lib/types'
import type { Lead } from '@/lib/types'

interface Analytics {
  leads: { total: number; new: number; today: number; completed: number }
  appointments: { total: number; upcoming: number; today: number }
}

function StatCard({ label, value, sub, icon: Icon, gold }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; gold?: boolean
}) {
  return (
    <div className="admin-stat">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-dim text-[10px] tracking-[0.2em] uppercase">{label}</span>
        <Icon size={15} className={gold ? 'text-gold' : 'text-text-dim'} />
      </div>
      <div className={`font-display text-4xl font-light ${gold ? 'text-gold' : 'text-white'}`}>{value}</div>
      {sub && <div className="text-text-dim text-[11px] mt-1">{sub}</div>}
    </div>
  )
}

function StageBadge({ stage }: { stage: string }) {
  const def = LEAD_STAGES.find((s) => s.value === stage)
  return (
    <span className={`admin-badge border ${def?.color ?? 'stage-new'}`}>
      {def?.label ?? stage}
    </span>
  )
}

export default function AdminDashboard({
  analytics,
  recentLeads,
}: {
  analytics: Analytics
  recentLeads: Lead[]
}) {
  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-white mb-1">Dashboard</h1>
        <p className="text-text-dim text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="New Leads Today" value={analytics.leads.today} icon={Users} gold />
        <StatCard label="Total Leads" value={analytics.leads.total} sub="All time" icon={TrendingUp} />
        <StatCard label="Appointments Today" value={analytics.appointments.today} icon={Calendar} />
        <StatCard label="Upcoming" value={analytics.appointments.upcoming} sub="Confirmed" icon={Clock} />
      </div>

      {/* Stage summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border mb-8">
        {[
          { label: 'New', value: analytics.leads.new, stage: 'new' },
          { label: 'Completed', value: analytics.leads.completed, stage: 'completed' },
          { label: 'Total', value: analytics.leads.total, stage: 'new' },
          { label: 'Upcoming Appts', value: analytics.appointments.upcoming, stage: 'scheduled' },
        ].map((item) => (
          <div key={item.label} className="bg-surface p-5 text-center">
            <div className="font-display text-3xl font-light text-white mb-1">{item.value}</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-text-dim">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Recent new leads */}
      <div className="bg-surface border border-border mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-white text-sm font-medium">New Leads</h2>
          <Link href="/admin/leads" className="flex items-center gap-1 text-gold text-xs hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-text-dim text-sm">No new leads</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Property Type</th>
                  <th>Stage</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.slice(0, 10).map((lead) => (
                  <tr key={lead._id}>
                    <td className="text-white font-medium">{lead.fullName}</td>
                    <td>{lead.service}</td>
                    <td>{lead.propertyType}</td>
                    <td><StageBadge stage={lead.stage} /></td>
                    <td>{new Date(lead._createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link href={`/admin/leads/${lead._id}`}
                        className="text-gold hover:underline flex items-center gap-1 text-xs">
                        View <ExternalLink size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: '/admin/leads?stage=new', label: 'Review New Leads', sub: `${analytics.leads.new} waiting` },
          { href: '/admin/appointments', label: 'View Appointments', sub: `${analytics.appointments.upcoming} upcoming` },
          { href: '/admin/ai', label: 'AI Assistant', sub: 'Generate emails, blog, more' },
          { href: '/studio', label: 'Edit Website Content', sub: 'Sanity CMS' },
          { href: '#', label: 'Send Email Campaign', sub: 'Coming soon' },
          { href: '/admin/analytics', label: 'Full Analytics', sub: 'Revenue, conversion' },
        ].map((a) => (
          <Link key={a.label} href={a.href}
            className="bg-surface border border-border hover:border-gold/30 p-4 transition-colors group">
            <div className="text-white text-xs font-medium mb-1 group-hover:text-gold transition-colors">{a.label}</div>
            <div className="text-text-dim text-[11px]">{a.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
