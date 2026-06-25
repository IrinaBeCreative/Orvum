import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { writeClient } from '@/lib/sanity/client'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[Stripe webhook] signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as { metadata: { leadId?: string }; amount: number; id: string }
    const { leadId } = pi.metadata

    if (leadId) {
      await writeClient
        .patch(leadId)
        .set({ stage: 'deposit_paid' })
        .setIfMissing({ payments: [] })
        .append('payments', [
          {
            _key: nanoid(6),
            amount: pi.amount / 100,
            status: 'paid',
            stripeId: pi.id,
            paidAt: new Date().toISOString(),
          },
        ])
        .commit()
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata: { leadId?: string }; amount_total: number | null; payment_intent: string | { id: string } | null }
    const { leadId } = session.metadata
    if (leadId) {
      await writeClient.patch(leadId).set({ stage: 'deposit_paid' }).commit()
    }
  }

  return NextResponse.json({ received: true })
}
