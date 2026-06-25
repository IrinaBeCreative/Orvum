import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@orvum.com'
const OWNER = process.env.OWNER_EMAIL ?? 'info@orvum.com'
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.orvum.com'

function baseLayout(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<style>
  body{margin:0;padding:0;background:#050505;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#CFCFCF;}
  .wrap{max-width:600px;margin:0 auto;background:#111111;border:1px solid #2A2A2A;}
  .header{background:#050505;padding:32px 40px;border-bottom:1px solid #2A2A2A;text-align:center;}
  .logo{font-size:22px;letter-spacing:0.15em;color:#C9A24D;font-weight:700;}
  .tagline{font-size:10px;color:#888;letter-spacing:0.25em;text-transform:uppercase;margin-top:4px;}
  .body{padding:40px;}
  .gold-rule{width:48px;height:1px;background:#C9A24D;margin:24px 0;}
  .btn{display:inline-block;background:#C9A24D;color:#050505 !important;font-weight:700;
       font-size:12px;letter-spacing:0.15em;text-transform:uppercase;padding:14px 28px;
       text-decoration:none;}
  .btn-outline{display:inline-block;border:1px solid #C9A24D;color:#C9A24D !important;font-weight:700;
               font-size:12px;letter-spacing:0.15em;text-transform:uppercase;padding:13px 27px;
               text-decoration:none;}
  .info-row{display:flex;gap:16px;margin-bottom:8px;font-size:13px;}
  .info-label{color:#888;min-width:120px;}
  .info-value{color:#fff;}
  .footer{padding:24px 40px;border-top:1px solid #2A2A2A;font-size:11px;color:#555;text-align:center;}
  .footer a{color:#C9A24D;text-decoration:none;}
  h1{font-size:28px;font-weight:300;color:#fff;line-height:1.2;margin:0 0 8px;}
  h2{font-size:20px;font-weight:400;color:#fff;margin:0 0 12px;}
  p{font-size:14px;line-height:1.7;margin:0 0 16px;}
  .gold{color:#C9A24D;}
  .divider{border:none;border-top:1px solid #2A2A2A;margin:24px 0;}
</style>
</head>
<body>
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
<div class="wrap">
  <div class="header">
    <div class="logo">ORVUM</div>
    <div class="tagline">Restore Instead of Replace</div>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    <p>ORVUM · Tampa Bay, FL · Licensed &amp; Insured</p>
    <p><a href="tel:8135550148">813-555-0148</a> · <a href="mailto:info@orvum.com">info@orvum.com</a></p>
    <p><a href="${SITE}">www.orvum.com</a></p>
  </div>
</div>
</body></html>`
}

// ── 1. Thank you / confirmation ───────────────────────────────────────────────
export async function sendThankYouEmail(to: string, name: string, service: string, leadId: string) {
  const html = baseLayout(`
    <h1>Thank You, ${name}.</h1>
    <div class="gold-rule"></div>
    <p>We received your estimate request for <strong class="gold">${service}</strong>. Our team will review your project details and respond within 1 business day.</p>
    <h2>What Happens Next</h2>
    <p>1. We review your project details<br>
    2. We prepare a transparent estimate<br>
    3. You receive your estimate by email<br>
    4. You book your appointment online</p>
    <p>If you have project photos, uploading them now helps us send a faster and more accurate estimate.</p>
    <div style="margin:28px 0;">
      <a href="${SITE}/upload/${leadId}" class="btn">Upload Photos</a>
    </div>
    <hr class="divider">
    <p style="font-size:12px;color:#888;">Questions? Reply to this email or call us at <a href="tel:8135550148" style="color:#C9A24D;">813-555-0148</a>.</p>
  `, `We received your request for ${service}. Here's what happens next.`)

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: 'Thank You for Contacting ORVUM',
    html,
  })
}

// ── 2. Photo reminder (24h) ───────────────────────────────────────────────────
export async function sendPhotoReminderEmail(to: string, name: string, leadId: string) {
  const html = baseLayout(`
    <h1>We Still Need Your Photos</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name},</p>
    <p>We're still working on your estimate request. Uploading photos of the surfaces you'd like renewed helps us provide a more accurate quote — and speeds up the process significantly.</p>
    <div style="margin:28px 0;">
      <a href="${SITE}/upload/${leadId}" class="btn">Upload Photos Now</a>
    </div>
    <p>Photos are optional — but recommended. If you prefer to proceed without them, we may schedule an in-person inspection instead.</p>
  `, 'Upload photos to speed up your estimate.')

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: 'We Still Need Your Photos — ORVUM',
    html,
  })
}

// ── 3. Estimate sent ──────────────────────────────────────────────────────────
export async function sendEstimateEmail(
  to: string,
  name: string,
  service: string,
  estimateAmount: number,
  leadId: string,
  notes?: string
) {
  const html = baseLayout(`
    <h1>Your Estimate Is Ready</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name},</p>
    <p>We reviewed your project and prepared your estimate for <strong class="gold">${service}</strong>.</p>
    <div style="background:#1A1A1A;border:1px solid #2A2A2A;padding:24px;margin:20px 0;">
      <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:8px;">Estimate Total</div>
      <div style="font-size:40px;font-weight:300;color:#fff;">$${estimateAmount.toFixed(2)}</div>
      <div style="font-size:11px;color:#888;margin-top:4px;">Starting price — final price confirmed on-site</div>
    </div>
    ${notes ? `<p>${notes}</p>` : ''}
    <div style="display:flex;gap:12px;margin:28px 0;flex-wrap:wrap;">
      <a href="${SITE}/estimate/approve/${leadId}" class="btn">Approve Estimate</a>
      <a href="${SITE}/estimate/questions/${leadId}" class="btn-outline">Ask a Question</a>
    </div>
    <p>This estimate is valid for 30 days. Reply to this email if you have any questions.</p>
  `, `Your ORVUM estimate for ${service} is ready — $${estimateAmount.toFixed(2)}.`)

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: 'Your ORVUM Estimate Is Ready',
    html,
  })
}

// ── 4. Follow-up (48h after estimate, no response) ───────────────────────────
export async function sendEstimateFollowUpEmail(to: string, name: string, service: string, leadId: string) {
  const html = baseLayout(`
    <h1>Any Questions About Your Estimate?</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name},</p>
    <p>We sent your estimate for <strong class="gold">${service}</strong> a couple of days ago and wanted to follow up. If you have any questions about the scope of work, materials, or process — we're happy to help.</p>
    <div style="margin:28px 0;">
      <a href="${SITE}/estimate/approve/${leadId}" class="btn">View Estimate</a>
    </div>
    <p>We're here when you're ready. You can also reply directly to this email.</p>
  `, 'Just checking in about your ORVUM estimate.')

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: 'Any Questions About Your Estimate? — ORVUM',
    html,
  })
}

// ── 5. Appointment confirmation ───────────────────────────────────────────────
export async function sendAppointmentConfirmation(
  to: string,
  name: string,
  date: string,
  time: string,
  service: string,
  appointmentId: string
) {
  const html = baseLayout(`
    <h1>Appointment Confirmed</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name}, your appointment is confirmed. Here are your details:</p>
    <div style="background:#1A1A1A;border:1px solid #2A2A2A;padding:24px;margin:20px 0;">
      <div class="info-row"><span class="info-label">Service</span><span class="info-value gold">${service}</span></div>
      <div class="info-row"><span class="info-label">Date</span><span class="info-value">${date}</span></div>
      <div class="info-row"><span class="info-label">Time</span><span class="info-value">${time}</span></div>
    </div>
    <p>Your technician will arrive during your scheduled window. Please ensure the work area is accessible.</p>
    <div style="margin:28px 0;">
      <a href="${SITE}/appointment/${appointmentId}" class="btn-outline">Manage Appointment</a>
    </div>
  `, `Your ORVUM appointment is confirmed for ${date} at ${time}.`)

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: `Appointment Confirmed — ${date} at ${time}`,
    html,
  })
}

// ── 6. Appointment reminder (24h before) ─────────────────────────────────────
export async function sendAppointmentReminder24h(
  to: string, name: string, date: string, time: string, service: string
) {
  const html = baseLayout(`
    <h1>Your Appointment Is Tomorrow</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name}, this is a reminder that your ORVUM appointment is scheduled for <strong class="gold">tomorrow</strong>.</p>
    <div style="background:#1A1A1A;border:1px solid #2A2A2A;padding:24px;margin:20px 0;">
      <div class="info-row"><span class="info-label">Service</span><span class="info-value">${service}</span></div>
      <div class="info-row"><span class="info-label">Date</span><span class="info-value gold">${date}</span></div>
      <div class="info-row"><span class="info-label">Time</span><span class="info-value">${time}</span></div>
    </div>
    <p>Please ensure the work area is cleared and accessible. Questions? Reply to this email or call us.</p>
  `, `Reminder: Your ORVUM appointment is tomorrow at ${time}.`)

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: `Appointment Reminder — Tomorrow at ${time}`,
    html,
  })
}

// ── 7. Post-service thank you + review request ────────────────────────────────
export async function sendPostServiceEmail(to: string, name: string, service: string) {
  const reviewUrl = 'https://g.page/r/your-google-review-link/review'
  const html = baseLayout(`
    <h1>Thank You for Choosing ORVUM</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name},</p>
    <p>Your <strong class="gold">${service}</strong> project is complete. We hope you're delighted with the results. Your renewed surfaces are backed by our warranty — see the care instructions below.</p>
    <h2>Care Instructions</h2>
    <p>• Avoid abrasive cleaners for the first 30 days<br>
    • Use soft cloths or non-scratch sponges<br>
    • For shower surfaces, allow 24-48 hours before water exposure<br>
    • Mild soap and water is recommended for regular cleaning</p>
    <hr class="divider">
    <h2>Leave Us a Review</h2>
    <p>If you're happy with the results, a Google review means the world to a small business. It takes less than 60 seconds.</p>
    <div style="margin:20px 0;">
      <a href="${reviewUrl}" class="btn">Leave a Google Review</a>
    </div>
  `, `Your ${service} project is complete. Thank you for choosing ORVUM.`)

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: 'Your Project Is Complete — ORVUM',
    html,
  })
}

// ── 8. 30-day follow-up ───────────────────────────────────────────────────────
export async function send30DayFollowUp(to: string, name: string) {
  const html = baseLayout(`
    <h1>How Is Everything Looking?</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name},</p>
    <p>It's been about a month since we completed your project. We hope you're still loving the results.</p>
    <p>If there's anything we can help with — or if you have other surfaces that could use renewal — we're just a message away.</p>
    <div style="margin:24px 0;">
      <a href="${SITE}#estimate" class="btn">Request Another Estimate</a>
    </div>
  `, 'Just checking in — how are your renewed surfaces looking?')

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: 'How Is Everything Looking? — ORVUM',
    html,
  })
}

// ── 9. 180-day maintenance reminder ──────────────────────────────────────────
export async function send180DayReminder(to: string, name: string) {
  const html = baseLayout(`
    <h1>Time for a Refresh?</h1>
    <div class="gold-rule"></div>
    <p>Hi ${name},</p>
    <p>It's been about 6 months since we worked on your property. We recommend periodic maintenance to keep surfaces looking their best.</p>
    <p>Consider:</p>
    <div style="background:#1A1A1A;border:1px solid #2A2A2A;padding:20px;margin:16px 0;">
      <p style="margin:0;">• Professional Caulking Replacement<br>
      • Tile & Grout Refresh<br>
      • Countertop Renewal<br>
      • Cabinet Touch-Up</p>
    </div>
    <div style="margin:24px 0;">
      <a href="${SITE}#estimate" class="btn">Book Maintenance Service</a>
    </div>
  `, 'Time for a surface maintenance refresh? See what ORVUM recommends.')

  return resend.emails.send({
    from: `ORVUM <${FROM}>`,
    to,
    subject: 'Surface Maintenance Reminder — ORVUM',
    html,
  })
}

// ── Owner notification ────────────────────────────────────────────────────────
export async function notifyOwnerNewLead(lead: {
  fullName: string; email: string; phone: string;
  service: string; address: string; propertyType: string; leadId: string
}) {
  const html = baseLayout(`
    <h1>New Lead Received</h1>
    <div class="gold-rule"></div>
    <div style="background:#1A1A1A;border:1px solid #2A2A2A;padding:24px;margin:20px 0;">
      <div class="info-row"><span class="info-label">Name</span><span class="info-value">${lead.fullName}</span></div>
      <div class="info-row"><span class="info-label">Email</span><span class="info-value">${lead.email}</span></div>
      <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${lead.phone}</span></div>
      <div class="info-row"><span class="info-label">Service</span><span class="info-value gold">${lead.service}</span></div>
      <div class="info-row"><span class="info-label">Address</span><span class="info-value">${lead.address}</span></div>
      <div class="info-row"><span class="info-label">Property Type</span><span class="info-value">${lead.propertyType}</span></div>
    </div>
    <div style="margin:20px 0;">
      <a href="${SITE}/admin/leads/${lead.leadId}" class="btn">View Lead in CRM</a>
    </div>
  `)

  return resend.emails.send({
    from: `ORVUM CRM <${FROM}>`,
    to: OWNER,
    subject: `New Lead: ${lead.fullName} — ${lead.service}`,
    html,
  })
}
