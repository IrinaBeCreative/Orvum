import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const BRAND = `You are an AI assistant for ORVUM, a premium surface renewal company in Tampa Bay, Florida. 
ORVUM restores bathtubs, showers, countertops, cabinets, and tile — instead of replacing them.
Brand voice: premium, professional, confident, trustworthy, minimal. Never cheesy or salesy.
Color palette: black and gold. Target: homeowners with $100k+ income, realtors, property managers.`

export async function generateCustomerEmail(prompt: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `${BRAND}\n\nWrite a professional email for the following situation:\n${prompt}\n\nOutput only the email body (no subject line). Keep it concise and premium.`,
      },
    ],
  })
  return (msg.content[0] as { text: string }).text
}

export async function generateEstimateNotes(serviceDetails: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: `${BRAND}\n\nWrite professional estimate notes for the following service:\n${serviceDetails}\n\nKeep it brief, technical, and professional. 2-3 sentences max.`,
      },
    ],
  })
  return (msg.content[0] as { text: string }).text
}

export async function generateBlogArticle(topic: string): Promise<{ title: string; excerpt: string; body: string }> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `${BRAND}\n\nWrite a premium SEO blog article about: ${topic}\n\nFormat as JSON with keys: title, excerpt (1-2 sentences), body (markdown format). The article should be helpful, informative, and position ORVUM as the expert. 600-900 words.`,
      },
    ],
  })
  try {
    const text = (msg.content[0] as { text: string }).text
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { title: topic, excerpt: '', body: (msg.content[0] as { text: string }).text }
  }
}

export async function generatePromotion(params: {
  season: string
  service: string
  discount: string
}): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `${BRAND}\n\nWrite a short, premium promotional message for:\nSeason: ${params.season}\nService: ${params.service}\nDiscount: ${params.discount}\n\nMax 3 sentences. Premium tone.`,
      },
    ],
  })
  return (msg.content[0] as { text: string }).text
}

export async function generateSocialPost(topic: string, platform: 'instagram' | 'facebook' | 'google'): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `${BRAND}\n\nWrite a ${platform} post about: ${topic}\nKeep it premium and professional. Include relevant hashtags for ${platform}. No emojis overload.`,
      },
    ],
  })
  return (msg.content[0] as { text: string }).text
}

export async function suggestFollowUpAction(leadHistory: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `${BRAND}\n\nBased on this customer history:\n${leadHistory}\n\nSuggest the best next action for the sales team. Be specific and actionable. Max 2 sentences.`,
      },
    ],
  })
  return (msg.content[0] as { text: string }).text
}
