import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string', initialValue: 'Beautiful Surfaces. Lasting Value.' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'string', initialValue: 'Restore Instead of Replace.' }),
    defineField({ name: 'ctaPrimary', title: 'Primary Button Label', type: 'string', initialValue: 'Get Free Estimate' }),
    defineField({ name: 'ctaSecondary', title: 'Secondary Button Label', type: 'string', initialValue: 'Book Appointment' }),
    defineField({
      name: 'backgroundImage', title: 'Background Image', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'trustPoints', title: 'Trust Points', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string' }),
          defineField({ name: 'sub', title: 'Sub-label', type: 'string' }),
        ],
        preview: { select: { title: 'label', subtitle: 'sub' } },
      }],
    }),
  ],
})
