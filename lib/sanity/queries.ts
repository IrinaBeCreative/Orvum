import { sanityClient } from './client'

// ── Settings ──────────────────────────────────────────────────────────────────
export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{
    siteName, tagline, heroHeadline, heroSubheadline,
    phone, email, address,
    facebookUrl, instagramUrl, googleBusinessUrl,
    depositAmount, depositRequired,
    metaTitle, metaDescription, ogImage,
    footerText, licenseText
  }`)
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export async function getHero() {
  return sanityClient.fetch(`*[_type == "hero"][0]{
    headline, subheadline, ctaPrimary, ctaSecondary,
    backgroundImage{ asset->{ url, _id }, alt },
    trustPoints[]{ icon, label, sub }
  }`)
}

// ── Packages ──────────────────────────────────────────────────────────────────
export async function getPackages() {
  return sanityClient.fetch(`*[_type == "package"] | order(order asc){
    _id, name, slug, price, priceLabel, description, featured,
    includes[], image{ asset->{ url }, alt }, order
  }`)
}

// ── Services ──────────────────────────────────────────────────────────────────
export async function getServices() {
  return sanityClient.fetch(`*[_type == "service"] | order(order asc){
    _id, name, slug, description, shortDescription, bullets[],
    image{ asset->{ url }, alt }, order, active
  }`)
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export async function getGalleryItems() {
  return sanityClient.fetch(`*[_type == "galleryItem"] | order(_createdAt desc){
    _id, title, description, category,
    beforeImage{ asset->{ url }, alt },
    afterImage{ asset->{ url }, alt }
  }`)
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export async function getTestimonials() {
  return sanityClient.fetch(`*[_type == "testimonial"] | order(order asc){
    _id, name, role, location, rating, text, service, featured, order
  }`)
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
export async function getFaq() {
  return sanityClient.fetch(`*[_type == "faq"] | order(order asc){
    _id, question, answer, category, order
  }`)
}

// ── Service Areas ─────────────────────────────────────────────────────────────
export async function getServiceAreas() {
  return sanityClient.fetch(`*[_type == "serviceArea"] | order(order asc){
    _id, city, county, description, isPrimary, order
  }`)
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export async function getBlogPosts(limit = 10) {
  return sanityClient.fetch(`*[_type == "post" && published == true] | order(publishedAt desc)[0...${limit}]{
    _id, title, slug, excerpt, publishedAt,
    coverImage{ asset->{ url }, alt },
    categories[]->{ name, slug },
    tags[],
    author->{ name, image{ asset->{ url } } }
  }`)
}

export async function getBlogPost(slug: string) {
  return sanityClient.fetch(`*[_type == "post" && slug.current == $slug && published == true][0]{
    _id, title, slug, excerpt, publishedAt, body,
    coverImage{ asset->{ url }, alt },
    categories[]->{ name, slug },
    tags[], metaTitle, metaDescription,
    author->{ name, image{ asset->{ url } } }
  }`, { slug })
}

// ── Promotions ────────────────────────────────────────────────────────────────
export async function getActivePromotions() {
  const now = new Date().toISOString()
  return sanityClient.fetch(`*[_type == "promotion" && active == true && startDate <= $now && endDate >= $now]{
    _id, title, description, discountType, discountValue, code,
    startDate, endDate, services[]->{ name }
  }`, { now })
}

// ── Leads (admin only - server-side) ─────────────────────────────────────────
export async function getLeads(stage?: string) {
  const filter = stage && stage !== 'all'
    ? `*[_type == "lead" && stage == $stage]`
    : `*[_type == "lead"]`
  return sanityClient.fetch(`${filter} | order(_createdAt desc){
    _id, _createdAt, fullName, email, phone, address,
    service, propertyType, stage, description,
    preferredDate, preferredTime, estimateAmount,
    notes, photos[]{ asset->{ url } }, assignedTech
  }`, stage ? { stage } : {})
}

export async function getLead(id: string) {
  return sanityClient.fetch(`*[_type == "lead" && _id == $id][0]{
    _id, _createdAt, _updatedAt, fullName, email, phone, address,
    service, propertyType, stage, description, preferredDate, preferredTime,
    estimateAmount, notes, photos[]{ asset->{ url } }, assignedTech,
    emailLog[]{ subject, sentAt, status },
    payments[]{ amount, status, stripeId, paidAt }
  }`, { id })
}

// ── Appointments ──────────────────────────────────────────────────────────────
export async function getAppointments(dateFrom?: string, dateTo?: string) {
  return sanityClient.fetch(`*[_type == "appointment" && status != "cancelled"] | order(date asc){
    _id, date, time, service, customer->{ fullName, email, phone },
    lead->{ _id, stage }, status, notes, googleEventId
  }`)
}

// ── Analytics snapshot ────────────────────────────────────────────────────────
export async function getAnalyticsSnapshot() {
  const [leads, appointments] = await Promise.all([
    sanityClient.fetch(`{
      "total": count(*[_type == "lead"]),
      "new": count(*[_type == "lead" && stage == "new"]),
      "today": count(*[_type == "lead" && dateTime(_createdAt) > dateTime(now()) - 60*60*24]),
      "completed": count(*[_type == "lead" && stage == "completed"]),
      "byStage": *[_type == "lead"]{ stage } | {
        "new": count(*[stage == "new"]),
        "quoted": count(*[stage == "quoted"]),
        "scheduled": count(*[stage == "scheduled"]),
        "completed": count(*[stage == "completed"])
      }
    }`),
    sanityClient.fetch(`{
      "total": count(*[_type == "appointment"]),
      "upcoming": count(*[_type == "appointment" && date >= $today && status == "confirmed"]),
      "today": count(*[_type == "appointment" && date == $today])
    }`, { today: new Date().toISOString().split('T')[0] }),
  ])
  return { leads, appointments }
}
