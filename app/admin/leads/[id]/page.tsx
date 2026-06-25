import { notFound } from 'next/navigation'
import { getLead } from '@/lib/sanity/queries'
import LeadDetail from '@/components/admin/LeadDetail'

export const dynamic = 'force-dynamic'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLead(id)
  if (!lead) notFound()
  return <LeadDetail lead={lead} />
}
