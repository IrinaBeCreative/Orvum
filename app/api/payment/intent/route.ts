import { NextRequest, NextResponse } from 'next/server'
import { createDepositPaymentIntent } from '@/lib/stripe'
import { getLead } from '@/lib/sanity/queries'
import { getSiteSettings } from '@/lib/sanity/queries'

export async function POST(req: NextRequest) {
  try {
    const { leadId, customerEmail, customerName } = await req.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const [lead, settings] = await Promise.all([getLead(leadId), getSiteSettings()])
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const depositAmount = settings?.depositAmount ?? 150

    const paymentIntent = await createDepositPaymentIntent({
      amount: depositAmount,
      leadId,
      customerEmail: customerEmail ?? lead.email,
      customerName: customerName ?? lead.fullName,
      service: lead.service,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: depositAmount,
    })
  } catch (err) {
    console.error('[payment/intent]', err)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
