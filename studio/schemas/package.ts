import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'package',
  title: 'Service Package',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Package Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 } }),
    defineField({ name: 'price', title: 'Starting Price ($)', type: 'number', validation: (R) => R.required().positive() }),
    defineField({ name: 'priceLabel', title: 'Price Label', type: 'string', description: 'e.g. "Starting at" or "From"' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'featured', title: 'Featured (Most Popular)', type: 'boolean', initialValue: false }),
    defineField({ name: 'includes', title: 'What\'s Included', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'image', title: 'Package Image', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })] }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Display Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'price', media: 'image' }, prepare({ title, subtitle }) { return { title, subtitle: `$${subtitle}` } } },
})
