'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Calendar, FileText,
  Settings, LogOut, Zap, BarChart3, MessageSquare,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'CRM / Leads', icon: Users },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/ai', label: 'AI Assistant', icon: Zap },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="text-gold font-display text-lg font-semibold tracking-[0.15em]">ORVUM</div>
        <div className="text-[8px] tracking-[0.25em] uppercase text-text-dim mt-0.5">Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-3 text-xs font-medium transition-all duration-150 ${
                active
                  ? 'text-gold bg-gold/5 border-r-2 border-gold'
                  : 'text-text-muted hover:text-white hover:bg-surface-2'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-4">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 text-text-dim text-[11px] hover:text-gold transition-colors mb-3">
          View Website →
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-text-dim text-[11px] hover:text-amber-400 transition-colors w-full">
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
