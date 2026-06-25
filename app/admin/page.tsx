import { getAnalyticsSnapshot, getLeads } from '@/lib/sanity/queries'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard — ORVUM Admin' }

export default async function AdminPage() {
  const [analytics, recentLeads] = await Promise.all([
    getAnalyticsSnapshot(),
    getLeads('new'),
  ])

  return <AdminDashboard analytics={analytics} recentLeads={recentLeads} />
}
