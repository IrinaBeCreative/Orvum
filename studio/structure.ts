import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('ORVUM CMS')
    .items([
      S.listItem()
        .title('⚙️ Site Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('🏠 Hero Section')
        .child(S.document().schemaType('hero').documentId('hero')),
      S.divider(),
      S.listItem().title('📦 Service Packages').child(S.documentTypeList('package').title('Packages')),
      S.listItem().title('🔧 Services').child(S.documentTypeList('service').title('Services')),
      S.listItem().title('🖼️ Before & After Gallery').child(S.documentTypeList('galleryItem').title('Gallery')),
      S.listItem().title('⭐ Testimonials').child(S.documentTypeList('testimonial').title('Testimonials')),
      S.listItem().title('❓ FAQ').child(S.documentTypeList('faq').title('FAQ')),
      S.listItem().title('📍 Service Areas').child(S.documentTypeList('serviceArea').title('Service Areas')),
      S.listItem().title('🎯 Promotions').child(S.documentTypeList('promotion').title('Promotions')),
      S.divider(),
      S.listItem().title('📝 Blog Posts').child(S.documentTypeList('post').title('Blog Posts')),
      S.listItem().title('🗂️ Categories').child(S.documentTypeList('category').title('Categories')),
      S.listItem().title('👤 Authors').child(S.documentTypeList('author').title('Authors')),
      S.divider(),
      S.listItem().title('🧾 CRM Leads').child(S.documentTypeList('lead').title('Leads')),
      S.listItem().title('📅 Appointments').child(S.documentTypeList('appointment').title('Appointments')),
    ])
