import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/auth'

export async function POST() {
  const cookie = clearAdminCookie()
  const res = NextResponse.json({ success: true })
  res.cookies.set(cookie)
  return res
}
