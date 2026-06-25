import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({ name: 'heroSubheadline', title: 'Hero Subheadline', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string', description: 'Display format: 813-555-0148' }),
    defineField({ name: 'email', title: 'Email Address', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'facebookUrl', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'googleBusinessUrl', title: 'Google Business URL', type: 'url' }),
    defineField({ name: 'depositRequired', title: 'Require Booking Deposit?', type: 'boolean', initialValue: false }),
    defineField({ name: 'depositAmount', title: 'Deposit Amount ($)', type: 'number', description: 'Amount in dollars required to confirm appointment' }),
    defineField({ name: 'metaTitle', title: 'Default SEO Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Default SEO Description', type: 'text', rows: 3 }),
    defineField({ name: 'ogImage', title: 'Default OG Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'footerText', title: 'Footer Description', type: 'text', rows: 2 }),
    defineField({ name: 'licenseText', title: 'License / Legal Text', type: 'string', description: 'e.g. Licensed & Insured — Lic #12345' }),
  ],
  preview: { select: { title: 'siteName', subtitle: 'phone' } },
})
