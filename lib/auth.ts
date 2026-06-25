import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-prod')
const COOKIE = 'orvum_admin_token'
const EXPIRES = 60 * 60 * 8 // 8 hours

export async function signAdminToken(email: string) {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + EXPIRES)
    .sign(SECRET)
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { email: string; role: string }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function validateAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminEmail || !adminHash) return false
  if (email !== adminEmail) return false

  return bcrypt.compare(password, adminHash)
}

export function setAdminCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: EXPIRES,
    path: '/',
  }
}

export function clearAdminCookie() {
  return { name: COOKIE, value: '', maxAge: 0, path: '/' }
}
