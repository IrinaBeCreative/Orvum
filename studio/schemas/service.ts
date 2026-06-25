import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Service Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 } }),
    defineField({ name: 'shortDescription', title: 'Short Description', type: 'text', rows: 2, description: 'Shown in service cards (1-2 sentences)' }),
    defineField({ name: 'description', title: 'Full Description', type: 'text', rows: 5 }),
    defineField({ name: 'bullets', title: 'Feature Bullets', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'image', title: 'Service Image', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })] }),
    defineField({ name: 'active', title: 'Active (shown on website)', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Display Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'shortDescription', media: 'image' } },
})
