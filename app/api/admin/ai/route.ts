import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import {
  generateCustomerEmail,
  generateBlogArticle,
  generatePromotion,
  generateSocialPost,
  suggestFollowUpAction,
} from '@/lib/ai'

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, payload } = await req.json()

  try {
    switch (action) {
      case 'email':
        return NextResponse.json({ result: await generateCustomerEmail(payload.prompt) })
      case 'blog':
        return NextResponse.json({ result: await generateBlogArticle(payload.topic) })
      case 'promotion':
        return NextResponse.json({ result: await generatePromotion(payload) })
      case 'social':
        return NextResponse.json({ result: await generateSocialPost(payload.topic, payload.platform) })
      case 'followup':
        return NextResponse.json({ result: await suggestFollowUpAction(payload.history) })
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err) {
    console.error('[AI route]', err)
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}
