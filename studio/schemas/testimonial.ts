import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Customer Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'e.g. Homeowner, Property Manager, Realtor' }),
    defineField({ name: 'location', title: 'Location', type: 'string', description: 'e.g. Tampa, FL' }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', initialValue: 5, validation: (R) => R.required().min(1).max(5) }),
    defineField({ name: 'text', title: 'Review Text', type: 'text', rows: 4, validation: (R) => R.required() }),
    defineField({ name: 'service', title: 'Service Used', type: 'string' }),
    defineField({ name: 'featured', title: 'Featured Review', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'name', subtitle: 'text' } },
})
