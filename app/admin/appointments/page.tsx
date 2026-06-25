import { getAppointments } from '@/lib/sanity/queries'
import AppointmentsPanel from '@/components/admin/AppointmentsPanel'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Appointments — ORVUM Admin' }

export default async function AppointmentsPage() {
  const appointments = await getAppointments()
  return <AppointmentsPanel appointments={appointments} />
}
