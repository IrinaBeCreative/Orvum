import { NextRequest, NextResponse } from 'next/server'
import { sanityClient, writeClient } from '@/lib/sanity/client'
import {
  sendPhotoReminderEmail,
  sendEstimateFollowUpEmail,
  send30DayFollowUp,
  send180DayReminder,
  sendAppointmentReminder24h,
} from '@/lib/email/resend'
import { nanoid } from 'nanoid'

// Called daily at 9 AM via Vercel Cron
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results: string[] = []

  try {
    // ── 1. Photo reminder (24h after submission, no photos) ──────────────────
    const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()

    const needsPhotoReminder = await sanityClient.fetch(
      `*[_type == "lead" && stage == "new" && count(photos) == 0 && _createdAt <= $cutoff24h && _createdAt > $cutoff48h && !defined(photoReminderSent)]{_id, fullName, email}`
      , { cutoff24h, cutoff48h }
    )

    for (const lead of needsPhotoReminder) {
      await sendPhotoReminderEmail(lead.email, lead.fullName, lead._id)
      await writeClient.patch(lead._id).set({ photoReminderSent: now.toISOString() })
        .setIfMissing({ emailLog: [] })
        .append('emailLog', [{ _key: nanoid(6), subject: 'We Still Need Your Photos', sentAt: now.toISOString(), status: 'sent' }])
        .commit()
      results.push(`photo_reminder: ${lead._id}`)
    }

    // ── 2. Estimate follow-up (48h after estimate_sent, no response) ─────────
    const cutoff48hAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()
    const cutoff96hAgo = new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString()

    const needsEstimateFollowup = await sanityClient.fetch(
      `*[_type == "lead" && stage == "estimate_sent" && _updatedAt <= $cutoff48h && _updatedAt > $cutoff96h && !defined(estimateFollowupSent)]{_id, fullName, email, service}`
      , { cutoff48h: cutoff48hAgo, cutoff96h: cutoff96hAgo }
    )

    for (const lead of needsEstimateFollowup) {
      await sendEstimateFollowUpEmail(lead.email, lead.fullName, lead.service, lead._id)
      await writeClient.patch(lead._id).set({ estimateFollowupSent: now.toISOString() })
        .setIfMissing({ emailLog: [] })
        .append('emailLog', [{ _key: nanoid(6), subject: 'Any Questions About Your Estimate?', sentAt: now.toISOString(), status: 'sent' }])
        .commit()
      results.push(`estimate_followup: ${lead._id}`)
    }

    // ── 3. 30-day follow-up ───────────────────────────────────────────────────
    const cutoff30dMin = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000).toISOString()
    const cutoff30dMax = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString()

    const needs30Day = await sanityClient.fetch(
      `*[_type == "lead" && stage == "completed" && _updatedAt >= $min && _updatedAt <= $max && !defined(followup30Sent)]{_id, fullName, email}`
      , { min: cutoff30dMin, max: cutoff30dMax }
    )

    for (const lead of needs30Day) {
      await send30DayFollowUp(lead.email, lead.fullName)
      await writeClient.patch(lead._id).set({ followup30Sent: now.toISOString() })
        .setIfMissing({ emailLog: [] })
        .append('emailLog', [{ _key: nanoid(6), subject: 'How Is Everything Looking?', sentAt: now.toISOString(), status: 'sent' }])
        .commit()
      results.push(`30day_followup: ${lead._id}`)
    }

    // ── 4. 180-day maintenance reminder ──────────────────────────────────────
    const cutoff180dMin = new Date(now.getTime() - 181 * 24 * 60 * 60 * 1000).toISOString()
    const cutoff180dMax = new Date(now.getTime() - 179 * 24 * 60 * 60 * 1000).toISOString()

    const needs180Day = await sanityClient.fetch(
      `*[_type == "lead" && stage in ["completed", "repeat_customer"] && _updatedAt >= $min && _updatedAt <= $max && !defined(maintenance180Sent)]{_id, fullName, email}`
      , { min: cutoff180dMin, max: cutoff180dMax }
    )

    for (const lead of needs180Day) {
      await send180DayReminder(lead.email, lead.fullName)
      await writeClient.patch(lead._id).set({ maintenance180Sent: now.toISOString() })
        .setIfMissing({ emailLog: [] })
        .append('emailLog', [{ _key: nanoid(6), subject: 'Surface Maintenance Reminder', sentAt: now.toISOString(), status: 'sent' }])
        .commit()
      results.push(`180day_reminder: ${lead._id}`)
    }

    // ── 5. Appointment reminder 24h before ───────────────────────────────────
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const tomorrowAppointments = await sanityClient.fetch(
      `*[_type == "appointment" && date == $date && status == "confirmed" && !defined(reminder24hSent)]{_id, date, time, service, customerName, customerEmail}`
      , { date: tomorrowStr }
    )

    for (const apt of tomorrowAppointments) {
      await sendAppointmentReminder24h(apt.customerEmail, apt.customerName, apt.date, apt.time, apt.service)
      await writeClient.patch(apt._id).set({ reminder24hSent: now.toISOString() }).commit()
      results.push(`apt_reminder_24h: ${apt._id}`)
    }

    return NextResponse.json({ success: true, processed: results.length, results })
  } catch (err) {
    console.error('[cron/email-sequences]', err)
    return NextResponse.json({ error: 'Cron job failed', details: String(err) }, { status: 500 })
  }
}
