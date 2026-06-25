import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeClient } from '@/lib/sanity/client'
import { sendThankYouEmail, notifyOwnerNewLead } from '@/lib/email/resend'
import { nanoid } from 'nanoid'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(3),
  service: z.string().min(1),
  propertyType: z.string().min(1),
  description: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  type: z.enum(['residential', 'commercial']).optional(),
  // commercial extras
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  units: z.string().optional(),
  servicesNeeded: z.string().optional(),
  recurringNeeds: z.string().optional(),
  notes: z.string().optional(),
})

// Rate limiting (simple in-memory)
const rateLimitMap = new Map<string, { count: number; reset: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }

  try {
    const formData = await req.formData()
    const raw: Record<string, string> = {}
    formData.forEach((value, key) => {
      if (key !== 'photos') raw[key] = value.toString()
    })

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const leadId = nanoid(10)

    // Upload photos to Sanity if any
    const photos = formData.getAll('photos') as File[]
    const photoAssets: { _type: string; _key: string; asset: { _type: string; _ref: string } }[] = []

    for (const photo of photos.slice(0, 8)) {
      if (photo.size === 0) continue
      if (photo.size > 10_000_000) continue
      if (!photo.type.startsWith('image/')) continue

      const buffer = Buffer.from(await photo.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: photo.name,
        contentType: photo.type,
      })
      photoAssets.push({
        _type: 'image',
        _key: nanoid(6),
        asset: { _type: 'reference', _ref: asset._id },
      })
    }

    // Create lead in Sanity
    const lead = await writeClient.create({
      _type: 'lead',
      leadId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      service: data.service,
      propertyType: data.propertyType,
      description: data.description ?? '',
      preferredDate: data.preferredDate ?? '',
      preferredTime: data.preferredTime ?? '',
      stage: 'new',
      isCommercial: data.type === 'commercial',
      companyName: data.companyName ?? '',
      notes: data.notes ?? '',
      photos: photoAssets,
      emailLog: [],
      source: 'website',
      createdAt: new Date().toISOString(),
    })

    // Send emails (non-blocking)
    await Promise.allSettled([
      sendThankYouEmail(data.email, data.fullName, data.service, lead._id),
      notifyOwnerNewLead({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        service: data.service,
        address: data.address,
        propertyType: data.propertyType,
        leadId: lead._id,
      }),
    ])

    // Log email in Sanity
    await writeClient
      .patch(lead._id)
      .setIfMissing({ emailLog: [] })
      .append('emailLog', [
        {
          _key: nanoid(6),
          subject: 'Thank You for Contacting ORVUM',
          sentAt: new Date().toISOString(),
          status: 'sent',
        },
      ])
      .commit()

    return NextResponse.json({ success: true, leadId: lead._id })
  } catch (err) {
    console.error('[estimate route]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
