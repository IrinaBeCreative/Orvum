import { defineType, defineField } from 'sanity'

const STAGES = [
  { title: 'New Lead', value: 'new' },
  { title: 'Photos Received', value: 'photos_received' },
  { title: 'Estimate Sent', value: 'estimate_sent' },
  { title: 'Estimate Approved', value: 'estimate_approved' },
  { title: 'Deposit Paid', value: 'deposit_paid' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'Tech Assigned', value: 'assigned' },
  { title: 'Completed', value: 'completed' },
  { title: 'Review Requested', value: 'review_requested' },
  { title: 'Repeat Customer', value: 'repeat_customer' },
  { title: 'Cancelled', value: 'cancelled' },
]

export default defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'service', title: 'Service Requested', type: 'string' }),
    defineField({ name: 'propertyType', title: 'Property Type', type: 'string' }),
    defineField({ name: 'description', title: 'Project Description', type: 'text', rows: 4 }),
    defineField({ name: 'preferredDate', title: 'Preferred Date', type: 'string' }),
    defineField({ name: 'preferredTime', title: 'Preferred Time', type: 'string' }),
    defineField({ name: 'stage', title: 'Lead Stage', type: 'string', options: { list: STAGES }, initialValue: 'new' }),
    defineField({ name: 'estimateAmount', title: 'Estimate Amount ($)', type: 'number' }),
    defineField({ name: 'notes', title: 'Internal Notes', type: 'text', rows: 4 }),
    defineField({ name: 'assignedTech', title: 'Assigned Technician', type: 'string' }),
    defineField({ name: 'isCommercial', title: 'Commercial Lead', type: 'boolean', initialValue: false }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'image' }] }),
    defineField({
      name: 'emailLog', title: 'Email Log', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'subject', title: 'Subject', type: 'string' }),
          defineField({ name: 'sentAt', title: 'Sent At', type: 'datetime' }),
          defineField({ name: 'status', title: 'Status', type: 'string' }),
        ],
      }],
    }),
    defineField({
      name: 'payments', title: 'Payment Records', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'amount', title: 'Amount ($)', type: 'number' }),
          defineField({ name: 'status', title: 'Status', type: 'string' }),
          defineField({ name: 'stripeId', title: 'Stripe Payment ID', type: 'string' }),
          defineField({ name: 'paidAt', title: 'Paid At', type: 'datetime' }),
        ],
      }],
    }),
    defineField({ name: 'source', title: 'Lead Source', type: 'string', options: { list: ['website', 'phone', 'referral', 'google', 'facebook', 'instagram', 'other'] } }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
  orderings: [{ title: 'Newest First', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] }],
  preview: { select: { title: 'fullName', subtitle: 'service', description: 'stage' }, prepare({ title, subtitle, description }) { return { title, subtitle: `${subtitle} — ${description}` } } },
})
