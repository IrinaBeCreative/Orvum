import { NextRequest, NextResponse } from 'next/server'
import { validateAdminCredentials, signAdminToken, setAdminCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const valid = await validateAdminCredentials(email, password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signAdminToken(email)
    const cookie = setAdminCookie(token)

    const res = NextResponse.json({ success: true })
    res.cookies.set(cookie)
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
