// ── Sanity image ──────────────────────────────────────────────────────────────
export interface SanityImage {
  asset: { url: string; _id?: string }
  alt?: string
}

// ── Site settings ─────────────────────────────────────────────────────────────
export interface SiteSettings {
  siteName: string
  tagline: string
  heroHeadline: string
  heroSubheadline: string
  phone: string
  email: string
  address: string
  facebookUrl?: string
  instagramUrl?: string
  googleBusinessUrl?: string
  depositAmount?: number
  depositRequired?: boolean
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  footerText?: string
  licenseText?: string
}

// ── Package ───────────────────────────────────────────────────────────────────
export interface Package {
  _id: string
  name: string
  slug: { current: string }
  price: number
  priceLabel?: string
  description: string
  featured: boolean
  includes: string[]
  image?: SanityImage
  order: number
}

// ── Service ───────────────────────────────────────────────────────────────────
export interface Service {
  _id: string
  name: string
  slug: { current: string }
  description: string
  shortDescription: string
  bullets: string[]
  image?: SanityImage
  order: number
  active: boolean
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export interface GalleryItem {
  _id: string
  title: string
  description: string
  category: string
  beforeImage: SanityImage
  afterImage: SanityImage
}

// ── Testimonial ───────────────────────────────────────────────────────────────
export interface Testimonial {
  _id: string
  name: string
  role: string
  location: string
  rating: number
  text: string
  service: string
  featured: boolean
  order: number
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
export interface FaqItem {
  _id: string
  question: string
  answer: string
  category?: string
  order: number
}

// ── Service area ──────────────────────────────────────────────────────────────
export interface ServiceArea {
  _id: string
  city: string
  county?: string
  description?: string
  isPrimary: boolean
  order: number
}

// ── Lead stages ───────────────────────────────────────────────────────────────
export type LeadStage =
  | 'new'
  | 'photos_received'
  | 'estimate_sent'
  | 'estimate_approved'
  | 'deposit_paid'
  | 'scheduled'
  | 'assigned'
  | 'completed'
  | 'review_requested'
  | 'repeat_customer'
  | 'cancelled'

export const LEAD_STAGES: { value: LeadStage; label: string; color: string }[] = [
  { value: 'new',               label: 'New Lead',          color: 'stage-new' },
  { value: 'photos_received',   label: 'Photos Received',   color: 'stage-photos' },
  { value: 'estimate_sent',     label: 'Estimate Sent',     color: 'stage-estimate' },
  { value: 'estimate_approved', label: 'Estimate Approved', color: 'stage-approved' },
  { value: 'deposit_paid',      label: 'Deposit Paid',      color: 'stage-deposit' },
  { value: 'scheduled',         label: 'Scheduled',         color: 'stage-scheduled' },
  { value: 'assigned',          label: 'Tech Assigned',     color: 'stage-assigned' },
  { value: 'completed',         label: 'Completed',         color: 'stage-completed' },
  { value: 'review_requested',  label: 'Review Requested',  color: 'stage-review' },
  { value: 'repeat_customer',   label: 'Repeat Customer',   color: 'stage-repeat' },
  { value: 'cancelled',         label: 'Cancelled',         color: 'stage-cancelled' },
]

// ── Lead ─────────────────────────────────────────────────────────────────────
export interface Lead {
  _id: string
  _createdAt: string
  _updatedAt?: string
  fullName: string
  email: string
  phone: string
  address: string
  service: string
  propertyType: string
  stage: LeadStage
  description?: string
  preferredDate?: string
  preferredTime?: string
  estimateAmount?: number
  notes?: string
  photos?: SanityImage[]
  assignedTech?: string
  emailLog?: EmailLogEntry[]
  payments?: PaymentRecord[]
}

export interface EmailLogEntry {
  subject: string
  sentAt: string
  status: 'sent' | 'failed' | 'opened'
}

export interface PaymentRecord {
  amount: number
  status: 'pending' | 'paid' | 'refunded'
  stripeId?: string
  paidAt?: string
}

// ── Estimate form ─────────────────────────────────────────────────────────────
export interface EstimateFormData {
  fullName: string
  email: string
  phone: string
  address: string
  service: string
  propertyType: string
  description?: string
  preferredDate?: string
  preferredTime?: string
  photos?: File[]
}

// ── Appointment ───────────────────────────────────────────────────────────────
export type AppointmentType = 'estimate' | 'inspection' | 'service'
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Appointment {
  _id: string
  date: string
  time: string
  type: AppointmentType
  service: string
  status: AppointmentStatus
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
  googleEventId?: string
  leadId?: string
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  coverImage?: SanityImage
  categories?: { name: string; slug: { current: string } }[]
  tags?: string[]
  body?: unknown[]
  metaTitle?: string
  metaDescription?: string
  author?: { name: string; image?: SanityImage }
}

// ── Quote builder ─────────────────────────────────────────────────────────────
export interface QuoteLineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Quote {
  leadId: string
  items: QuoteLineItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  warranty?: string
  notes?: string
  validUntil?: string
}

// ── Property manager form ─────────────────────────────────────────────────────
export interface PropertyManagerFormData {
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
  numberOfUnits?: number
  servicesNeeded: string
  recurringNeeds?: string
  notes?: string
  photos?: File[]
}
