import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Promotion Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'discountType', title: 'Discount Type', type: 'string', options: { list: ['percentage', 'fixed'] } }),
    defineField({ name: 'discountValue', title: 'Discount Value', type: 'number', description: 'e.g. 10 for 10% or 75 for $75 off' }),
    defineField({ name: 'code', title: 'Promo Code', type: 'string', description: 'Optional — leave blank for automatic discount' }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'datetime' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'datetime' }),
    defineField({ name: 'services', title: 'Applies to Services', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }] }),
  ],
  preview: { select: { title: 'title', subtitle: 'code', media: undefined } },
})
