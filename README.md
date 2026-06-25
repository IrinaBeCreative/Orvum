# ORVUM — Premium Surface Renewal Website

Complete production website with CMS, CRM, Booking, Sales Automation, and AI tools.

**Tech Stack:** Next.js 15 · React · TypeScript · Tailwind CSS · Sanity CMS · Resend · Stripe · Google Calendar · Anthropic AI

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Variables](#environment-variables)
3. [Sanity CMS Setup](#sanity-cms-setup)
4. [Deployment to Vercel](#deployment-to-vercel)
5. [Admin Panel Login](#admin-panel-login)
6. [How to Edit Website Content](#how-to-edit-website-content)
7. [How to Add a New Service](#how-to-add-a-new-service)
8. [How to Change a Price](#how-to-change-a-price)
9. [How to Replace Images](#how-to-replace-images)
10. [CRM & Lead Management](#crm--lead-management)
11. [Booking System](#booking-system)
12. [Email Automation](#email-automation)
13. [AI Assistant](#ai-assistant)
14. [Google Calendar Setup](#google-calendar-setup)
15. [Stripe Setup](#stripe-setup)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/orvum.git
cd orvum

# Install dependencies (installs both Next.js app and Sanity studio)
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in all env vars (see below)

# Run development server
npm run dev

# In a separate terminal, run Sanity Studio
npm run sanity
```

Website: http://localhost:3000  
Admin Panel: http://localhost:3000/admin  
Sanity Studio: http://localhost:3333  

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values.

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: `production`) | sanity.io/manage |
| `SANITY_API_TOKEN` | Sanity API token with write access | sanity.io/manage → API → Tokens |
| `RESEND_API_KEY` | Resend email API key | resend.com |
| `RESEND_FROM_EMAIL` | Sending email address | Your verified Resend domain |
| `OWNER_EMAIL` | Owner's notification email | Your email |
| `STRIPE_SECRET_KEY` | Stripe secret key | dashboard.stripe.com |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | dashboard.stripe.com |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | dashboard.stripe.com → Webhooks |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | console.cloud.google.com |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | console.cloud.google.com |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID | Google Calendar → Settings |
| `GOOGLE_REFRESH_TOKEN` | Google refresh token | OAuth flow (see below) |
| `ANTHROPIC_API_KEY` | Anthropic API key | console.anthropic.com |
| `ADMIN_EMAIL` | Admin login email | Your email |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | See below |
| `JWT_SECRET` | Random 32+ character secret | Use: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | https://www.orvum.com |

### Generate Admin Password Hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 12).then(h => console.log(h))"
```

Copy the output into `ADMIN_PASSWORD_HASH`.

---

## Sanity CMS Setup

1. Go to [sanity.io](https://sanity.io) and create a free account
2. Create a new project named "ORVUM"
3. Choose dataset name: `production`
4. Copy your Project ID from the dashboard
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   ```
6. Create an API token with **Editor** permissions:
   - Go to sanity.io/manage → Your Project → API → Tokens
   - Create new token, copy it to `SANITY_API_TOKEN`
7. Deploy Sanity Studio:
   ```bash
   npm run sanity:deploy
   ```
   - Choose a unique studio name (e.g., `orvum-studio`)
   - Studio URL: `https://orvum-studio.sanity.studio`

---

## Deployment to Vercel

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables from `.env.local` to Vercel's Environment Variables section
4. Deploy

**Stripe Webhook Setup:**
- In Stripe Dashboard → Webhooks → Add endpoint
- URL: `https://www.orvum.com/api/stripe/webhook`
- Events: `payment_intent.succeeded`, `checkout.session.completed`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## Admin Panel Login

URL: `https://www.orvum.com/admin`

Login with the email and password you set in `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`.

The admin panel includes:
- **Dashboard** — new leads, appointments, quick stats
- **CRM / Leads** — all customer inquiries with pipeline management
- **Appointments** — scheduled appointments view
- **Analytics** — revenue charts, conversion data, top services
- **AI Assistant** — generate emails, blog posts, promotions
- **Reviews** — manage testimonials
- **Content** — links to CMS sections
- **Settings** — environment variable guide

---

## How to Edit Website Content

All content is managed through **Sanity Studio**.

**Access Sanity Studio:** `https://your-studio.sanity.studio` or `http://localhost:3333` during development.

### Edit Phone Number
1. Open Sanity Studio
2. Click **⚙️ Site Settings**
3. Update the **Phone Number** field
4. Click **Publish**
5. Website updates within 60 seconds

### Edit Hero Headline
1. Open Sanity Studio
2. Click **🏠 Hero Section**
3. Edit **Headline** and **Subheadline**
4. Upload a new **Background Image** if needed
5. Click **Publish**

---

## How to Add a New Service

1. Open Sanity Studio
2. Click **🔧 Services** → **+ Create new**
3. Fill in:
   - **Service Name** (e.g., "Marble Restoration")
   - **Short Description** (1-2 sentences)
   - **Feature Bullets** (e.g., "Natural stone repair", "Polishing and sealing")
   - **Service Image** (upload a photo)
   - Set **Active** to ✓
   - Set **Display Order** (lower = appears first)
4. Click **Publish**

The new service appears on the website within 60 seconds and is automatically added to the estimate form's service dropdown.

---

## How to Change a Price

1. Open Sanity Studio
2. Click **📦 Service Packages**
3. Click the package you want to edit (e.g., "Bath Refresh")
4. Update the **Starting Price ($)** field
5. Click **Publish**

Price updates appear on the website within 60 seconds.

---

## How to Replace Images

### Hero Background Image
1. Sanity Studio → **🏠 Hero Section**
2. Click the **Background Image** field → upload new image
3. Use the **hotspot** tool to set focus point
4. Publish

### Before & After Gallery
1. Sanity Studio → **🖼️ Before & After Gallery** → **+ Create new**
2. Fill in **Title**, **Description**, **Category**
3. Upload **Before Image** and **After Image**
4. Publish

### Service Images
1. Sanity Studio → **🔧 Services**
2. Click the service → update **Service Image**
3. Publish

---

## CRM & Lead Management

Every estimate request automatically:
1. Creates a **Lead** in Sanity CMS
2. Sends a **Thank You email** to the customer
3. Sends a **notification email** to the owner

**To manage leads:**
1. Go to Admin Panel → **CRM / Leads**
2. Filter by stage using the stage filter pills
3. Click any lead to open the detail view
4. Change stage using the dropdown
5. Add internal notes
6. Build and send estimates using the **Quote Builder**
7. Use **AI Email Generator** to draft follow-up emails

**Lead stages:**
- New Lead → Photos Received → Estimate Sent → Estimate Approved → Deposit Paid → Scheduled → Tech Assigned → Completed → Review Requested → Repeat Customer

---

## Booking System

Customers can book appointments directly from the website.

When booked:
- Appointment saved to Sanity CMS
- Synced to Google Calendar
- Confirmation email sent to customer

**To view appointments:** Admin Panel → **Appointments**

---

## Email Automation

The system automatically sends:

| Trigger | Email |
|---------|-------|
| Form submitted | Thank You + next steps |
| 24h later, no photos | Photo reminder |
| Estimate sent | Estimate with approve link |
| 48h after estimate | Follow-up |
| Appointment booked | Confirmation |
| 24h before appointment | Reminder |
| Service completed | Thank you + care instructions + review request |
| 30 days later | Check-in + upsell |
| 180 days later | Maintenance reminder |

To trigger the timed emails (24h, 48h, 30-day, 180-day), set up a cron job on Vercel:

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/email-sequences", "schedule": "0 9 * * *" }
  ]
}
```

---

## AI Assistant

Access from Admin Panel → **AI Assistant**.

Available tools:
- **Customer Email** — generate professional emails for any customer situation
- **Blog Article** — write SEO-optimized articles (600-900 words)
- **Promotion Copy** — create seasonal discount messages
- **Social Post** — write Instagram, Facebook, or Google Business posts
- **Follow-Up Action** — get AI suggestions based on customer history

Also available directly in lead detail pages for per-customer email generation.

---

## Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google Calendar API**
4. Create **OAuth 2.0 credentials** (Desktop App type)
5. Download credentials
6. Run the OAuth flow to get a refresh token:
   ```bash
   node scripts/get-google-token.js
   ```
7. Copy refresh token to `GOOGLE_REFRESH_TOKEN`
8. Get your Calendar ID:
   - Google Calendar → Settings → Your Calendar → Calendar ID
   - Copy to `GOOGLE_CALENDAR_ID`

---

## Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Copy API keys to env vars
3. For deposits: set `depositRequired=true` and `depositAmount` in Sanity Site Settings
4. Set up webhook endpoint pointing to `/api/stripe/webhook`

Accepted: Visa, Mastercard, Amex, Apple Pay, Google Pay

---

## Performance Notes

- ISR (Incremental Static Regeneration) with 60s revalidation
- Images served from Sanity CDN with automatic optimization
- Lighthouse score target: 95+
- No client-side data fetching on initial page load

---

## Support

For technical support or customization, contact your developer.

ORVUM is built on production-grade infrastructure:
- **Next.js 15** (Vercel) — hosting
- **Sanity** — CMS
- **Resend** — email
- **Stripe** — payments
- **Google Calendar** — scheduling
- **Anthropic Claude** — AI tools
