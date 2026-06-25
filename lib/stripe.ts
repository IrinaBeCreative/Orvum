import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
})

export async function createDepositPaymentIntent(params: {
  amount: number        // in dollars
  leadId: string
  customerEmail: string
  customerName: string
  service: string
}) {
  return stripe.paymentIntents.create({
    amount: Math.round(params.amount * 100), // convert to cents
    currency: 'usd',
    receipt_email: params.customerEmail,
    metadata: {
      leadId: params.leadId,
      service: params.service,
      type: 'deposit',
    },
    description: `ORVUM Deposit — ${params.service}`,
  })
}

export async function createCheckoutSession(params: {
  amount: number
  leadId: string
  customerEmail: string
  service: string
  successUrl: string
  cancelUrl: string
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `ORVUM — ${params.service}`,
            description: 'Service deposit. Balance due upon completion.',
          },
          unit_amount: Math.round(params.amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { leadId: params.leadId, type: 'deposit' },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })
}
