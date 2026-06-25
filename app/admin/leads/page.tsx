import { getLeads } from '@/lib/sanity/queries'
import LeadsList from '@/components/admin/LeadsList'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'CRM Leads — ORVUM Admin' }

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; q?: string }>
}) {
  const params = await searchParams
  const stage = params.stage ?? 'all'
  const leads = await getLeads(stage)

  return <LeadsList initialLeads={leads} currentStage={stage} />
}
