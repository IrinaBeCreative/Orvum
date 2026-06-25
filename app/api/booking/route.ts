import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeClient } from '@/lib/sanity/client'
import { createCalendarEvent } from '@/lib/google-calendar'
import { sendAppointmentConfirmation } from '@/lib/email/resend'
import { nanoid } from 'nanoid'

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  type: z.enum(['estimate', 'inspection', 'service']),
  service: z.string().optional(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  leadId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const d = parsed.data

    // Parse date/time into Google Calendar format
    const [year, month, day] = d.date.split('-').map(Number)
    const [timeStr, period] = d.time.split(' ')
    let [hours, minutes] = timeStr.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0

    const startDT = new Date(year, month - 1, day, hours, minutes)
    const endDT = new Date(year, month - 1, day, hours + 2, minutes) // 2h block

    // Create appointment in Sanity
    const appointment = await writeClient.create({
      _type: 'appointment',
      date: d.date,
      time: d.time,
      type: d.type,
      service: d.service ?? '',
      customerName: d.customerName,
      customerEmail: d.customerEmail,
      customerPhone: d.customerPhone ?? '',
      notes: d.notes ?? '',
      status: 'confirmed',
      ...(d.leadId ? { lead: { _type: 'reference', _ref: d.leadId } } : {}),
      createdAt: new Date().toISOString(),
    })

    // Sync to Google Calendar
    const gcalResult = await createCalendarEvent({
      summary: `ORVUM — ${d.type === 'service' ? (d.service ?? 'Service') : d.type === 'inspection' ? 'In-Person Inspection' : 'Estimate'} (${d.customerName})`,
      description: `Customer: ${d.customerName}\nEmail: ${d.customerEmail}\nPhone: ${d.customerPhone ?? 'N/A'}\nService: ${d.service ?? 'TBD'}\n${d.notes ? `Notes: ${d.notes}` : ''}`,
      startDateTime: startDT.toISOString(),
      endDateTime: endDT.toISOString(),
      attendeeEmail: d.customerEmail,
      attendeeName: d.customerName,
    })

    // Store Google event ID
    if (gcalResult.eventId) {
      await writeClient.patch(appointment._id).set({ googleEventId: gcalResult.eventId }).commit()
    }

    // Send confirmation email
    const formattedDate = new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    await sendAppointmentConfirmation(
      d.customerEmail,
      d.customerName,
      formattedDate,
      d.time,
      d.service ?? 'Surface Renewal',
      appointment._id
    )

    return NextResponse.json({ success: true, appointmentId: appointment._id })
  } catch (err) {
    console.error('[booking route]', err)
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 })
  }
}
