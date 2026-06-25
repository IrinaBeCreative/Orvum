'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const j = await res.json()
        setError(j.error ?? 'Invalid credentials')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-gold font-display text-3xl font-semibold tracking-[0.15em] mb-1">ORVUM</div>
          <div className="text-[9px] tracking-[0.3em] uppercase text-text-dim">Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border p-8 flex flex-col gap-5">
          <div>
            <label className="field-label">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="field-input" placeholder="owner@orvum.com" required autoFocus
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input pr-10" required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-gold transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="text-amber-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
