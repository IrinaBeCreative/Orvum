import { getAnalyticsSnapshot, getLeads } from '@/lib/sanity/queries'
import AnalyticsPanel from '@/components/admin/AnalyticsPanel'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Analytics — ORVUM Admin' }

export default async function AnalyticsPage() {
  const [analytics, leads] = await Promise.all([getAnalyticsSnapshot(), getLeads()])
  return <AnalyticsPanel analytics={analytics} leads={leads} />
}
