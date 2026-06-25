import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (R) => R.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['General', 'Services', 'Pricing', 'Booking', 'Property Managers'] } }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'question', subtitle: 'category' } },
})
