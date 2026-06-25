import { defineType, defineField } from 'sanity'

const CATEGORIES = ['Bath Refresh', 'Surface Upgrade', 'Kitchen Renew', 'Tile Painting', 'Caulking', 'Complete Transformation', 'Cabinet Refinishing', 'Other']

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: CATEGORIES.map((c) => ({ title: c, value: c })) } }),
    defineField({
      name: 'beforeImage', title: 'Before Image', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'afterImage', title: 'After Image', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      validation: (R) => R.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'category', media: 'afterImage' } },
})
