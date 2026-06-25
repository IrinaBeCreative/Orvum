import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { sendEstimateEmail } from '@/lib/email/resend'
import { writeClient } from '@/lib/sanity/client'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { leadId, customerEmail, customerName, service, total, notes } = body

  try {
    await sendEstimateEmail(customerEmail, customerName, service, total, leadId, notes)

    // Log in Sanity
    await writeClient
      .patch(leadId)
      .set({ estimateAmount: total, stage: 'estimate_sent' })
      .setIfMissing({ emailLog: [] })
      .append('emailLog', [
        {
          _key: nanoid(6),
          subject: 'Your ORVUM Estimate Is Ready',
          sentAt: new Date().toISOString(),
          status: 'sent',
        },
      ])
      .commit()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[quote route]', err)
    return NextResponse.json({ error: 'Failed to send estimate' }, { status: 500 })
  }
}
