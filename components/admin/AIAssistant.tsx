'use client'

import { useState } from 'react'
import { Zap, Mail, FileText, Megaphone, Share2, Lightbulb, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Tool = 'email' | 'blog' | 'promotion' | 'social' | 'followup'

const TOOLS: { id: Tool; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'email', label: 'Customer Email', icon: Mail, desc: 'Generate a professional customer email for any situation.' },
  { id: 'blog', label: 'Blog Article', icon: FileText, desc: 'Write an SEO-optimized blog post for your website.' },
  { id: 'promotion', label: 'Promotion Copy', icon: Megaphone, desc: 'Create seasonal promotions and discount offers.' },
  { id: 'social', label: 'Social Post', icon: Share2, desc: 'Write Instagram, Facebook, or Google Business posts.' },
  { id: 'followup', label: 'Follow-Up Action', icon: Lightbulb, desc: 'Get AI suggestions based on customer history.' },
]

export default function AIAssistant() {
  const [active, setActive] = useState<Tool>('email')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  // Tool-specific inputs
  const [emailPrompt, setEmailPrompt] = useState('')
  const [blogTopic, setBlogTopic] = useState('')
  const [promoSeason, setPromoSeason] = useState('')
  const [promoService, setPromoService] = useState('')
  const [promoDiscount, setPromoDiscount] = useState('')
  const [socialTopic, setSocialTopic] = useState('')
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'facebook' | 'google'>('instagram')
  const [followupHistory, setFollowupHistory] = useState('')

  const run = async () => {
    setLoading(true)
    setResult('')
    try {
      let payload: Record<string, string> = {}
      if (active === 'email') payload = { prompt: emailPrompt }
      if (active === 'blog') payload = { topic: blogTopic }
      if (active === 'promotion') payload = { season: promoSeason, service: promoService, discount: promoDiscount }
      if (active === 'social') payload = { topic: socialTopic, platform: socialPlatform }
      if (active === 'followup') payload = { history: followupHistory }

      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: active, payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (active === 'blog' && typeof data.result === 'object') {
        setResult(`TITLE: ${data.result.title}\n\nEXCERPT: ${data.result.excerpt}\n\n${data.result.body}`)
      } else {
        setResult(typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2))
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI request failed')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    toast.success('Copied to clipboard')
  }

  const activeTool = TOOLS.find((t) => t.id === active)!

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-white mb-1 flex items-center gap-3">
          <Zap size={22} className="text-gold" />
          AI Assistant
        </h1>
        <p className="text-text-muted text-sm">Generate emails, blog articles, promotions, and social posts using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool selector */}
        <div className="flex flex-col gap-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActive(tool.id); setResult('') }}
              className={`text-left p-4 border transition-all duration-200 ${
                active === tool.id ? 'border-gold bg-surface' : 'border-border hover:border-gold/30 bg-surface'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <tool.icon size={13} className={active === tool.id ? 'text-gold' : 'text-text-dim'} />
                <span className={`text-xs font-medium ${active === tool.id ? 'text-gold' : 'text-white'}`}>
                  {tool.label}
                </span>
              </div>
              <p className="text-text-dim text-[11px] leading-relaxed">{tool.desc}</p>
            </button>
          ))}
        </div>

        {/* Input + output */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-surface border border-border p-6">
            <h3 className="text-gold text-[10px] tracking-[0.25em] uppercase mb-5">{activeTool.label}</h3>

            {active === 'email' && (
              <div>
                <label className="field-label">Describe the situation</label>
                <textarea value={emailPrompt} onChange={(e) => setEmailPrompt(e.target.value)} rows={4}
                  className="field-input resize-none"
                  placeholder="e.g. Customer hasn't responded to estimate for 3 days. Service: bathtub refinishing. Politely follow up." />
              </div>
            )}

            {active === 'blog' && (
              <div>
                <label className="field-label">Blog Topic</label>
                <input value={blogTopic} onChange={(e) => setBlogTopic(e.target.value)}
                  className="field-input" placeholder="e.g. How to know when to refinish vs replace your bathtub" />
              </div>
            )}

            {active === 'promotion' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">Season / Event</label>
                  <input value={promoSeason} onChange={(e) => setPromoSeason(e.target.value)}
                    className="field-input" placeholder="e.g. Spring 2025" />
                </div>
                <div>
                  <label className="field-label">Service</label>
                  <input value={promoService} onChange={(e) => setPromoService(e.target.value)}
                    className="field-input" placeholder="e.g. Bathtub Refinishing" />
                </div>
                <div>
                  <label className="field-label">Discount</label>
                  <input value={promoDiscount} onChange={(e) => setPromoDiscount(e.target.value)}
                    className="field-input" placeholder="e.g. $75 off" />
                </div>
              </div>
            )}

            {active === 'social' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Topic</label>
                  <input value={socialTopic} onChange={(e) => setSocialTopic(e.target.value)}
                    className="field-input" placeholder="e.g. Before & after bathtub transformation" />
                </div>
                <div>
                  <label className="field-label">Platform</label>
                  <select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value as typeof socialPlatform)}
                    className="field-input appearance-none bg-bg cursor-pointer">
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="google">Google Business</option>
                  </select>
                </div>
              </div>
            )}

            {active === 'followup' && (
              <div>
                <label className="field-label">Customer History</label>
                <textarea value={followupHistory} onChange={(e) => setFollowupHistory(e.target.value)} rows={4}
                  className="field-input resize-none"
                  placeholder="e.g. Lead submitted 5 days ago. Estimate sent 3 days ago. No response. Service: countertop refinishing. Property: rental apartment." />
              </div>
            )}

            <button onClick={run} disabled={loading} className="btn-primary mt-5 flex items-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              {loading ? 'Generating…' : 'Generate with AI'}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-surface border border-gold/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gold text-[10px] tracking-[0.25em] uppercase">Result</h3>
                <button onClick={copy} className="flex items-center gap-1.5 text-text-muted text-[10px] hover:text-gold transition-colors">
                  <Copy size={11} /> Copy
                </button>
              </div>
              <pre className="text-text-muted text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
