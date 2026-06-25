import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'appointment',
  title: 'Appointment',
  type: 'document',
  fields: [
    defineField({ name: 'date', title: 'Date', type: 'date', validation: (R) => R.required() }),
    defineField({ name: 'time', title: 'Time', type: 'string' }),
    defineField({ name: 'type', title: 'Appointment Type', type: 'string', options: { list: ['estimate', 'inspection', 'service'] } }),
    defineField({ name: 'service', title: 'Service', type: 'string' }),
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string' }),
    defineField({ name: 'customerEmail', title: 'Customer Email', type: 'string' }),
    defineField({ name: 'customerPhone', title: 'Customer Phone', type: 'string' }),
    defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['pending', 'confirmed', 'completed', 'cancelled'] }, initialValue: 'confirmed' }),
    defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 3 }),
    defineField({ name: 'googleEventId', title: 'Google Calendar Event ID', type: 'string', readOnly: true }),
    defineField({ name: 'lead', title: 'Related Lead', type: 'reference', to: [{ type: 'lead' }] }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
  orderings: [{ title: 'Date (Newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'customerName', subtitle: 'date', description: 'service' }, prepare({ title, subtitle, description }) { return { title, subtitle: `${subtitle} — ${description}` } } },
})
