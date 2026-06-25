import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'serviceArea',
  title: 'Service Area',
  type: 'document',
  fields: [
    defineField({ name: 'city', title: 'City', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'county', title: 'County', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'string' }),
    defineField({ name: 'isPrimary', title: 'Primary Service Area', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'city', subtitle: 'county' } },
})
