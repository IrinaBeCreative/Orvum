import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'ORVUM Admin', robots: { index: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex h-screen bg-bg text-white overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-bg">
        {children}
      </main>
    </div>
  )
}
