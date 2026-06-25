import { google } from 'googleapis'

function getAuthClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  return auth
}

export async function createCalendarEvent(params: {
  summary: string
  description: string
  startDateTime: string
  endDateTime: string
  attendeeEmail: string
  attendeeName: string
}) {
  try {
    const auth = getAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      sendUpdates: 'all',
      requestBody: {
        summary: params.summary,
        description: params.description,
        start: { dateTime: params.startDateTime, timeZone: 'America/New_York' },
        end: { dateTime: params.endDateTime, timeZone: 'America/New_York' },
        attendees: [
          { email: params.attendeeEmail, displayName: params.attendeeName },
          { email: process.env.OWNER_EMAIL! },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 120 },
          ],
        },
        colorId: '5', // Yellow — close to gold
      },
    })
    return { success: true, eventId: event.data.id }
  } catch (err) {
    console.error('[Google Calendar] createEvent error:', err)
    return { success: false, eventId: null }
  }
}

export async function updateCalendarEvent(eventId: string, params: {
  startDateTime: string
  endDateTime: string
  description?: string
}) {
  try {
    const auth = getAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })
    await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId,
      sendUpdates: 'all',
      requestBody: {
        start: { dateTime: params.startDateTime, timeZone: 'America/New_York' },
        end: { dateTime: params.endDateTime, timeZone: 'America/New_York' },
        ...(params.description ? { description: params.description } : {}),
      },
    })
    return { success: true }
  } catch (err) {
    console.error('[Google Calendar] updateEvent error:', err)
    return { success: false }
  }
}

export async function deleteCalendarEvent(eventId: string) {
  try {
    const auth = getAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId,
      sendUpdates: 'all',
    })
    return { success: true }
  } catch (err) {
    console.error('[Google Calendar] deleteEvent error:', err)
    return { success: false }
  }
}

export async function getAvailableSlots(date: string): Promise<string[]> {
  try {
    const auth = getAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })

    const startOfDay = new Date(`${date}T00:00:00`)
    const endOfDay = new Date(`${date}T23:59:59`)

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const bookedTimes = (res.data.items ?? []).map((e) =>
      e.start?.dateTime
        ? new Date(e.start.dateTime).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true
          })
        : null
    ).filter(Boolean)

    const allSlots = [
      '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    ]

    return allSlots.filter((slot) => !bookedTimes.includes(slot))
  } catch {
    return ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
  }
}
