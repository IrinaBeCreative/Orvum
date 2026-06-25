import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.orvum.com'),
  title: {
    default: 'ORVUM | Premium Surface Renewal — Tampa Bay, FL',
    template: '%s | ORVUM',
  },
  description:
    'Premium bathtub refinishing, shower restoration, countertop refinishing, cabinet refinishing, and tile renewal in Tampa Bay, Florida. Save thousands vs replacement. Get a free estimate online.',
  keywords: [
    'bathtub refinishing Tampa', 'countertop refinishing Tampa Bay',
    'cabinet refinishing Florida', 'shower restoration Tampa',
    'tile painting Tampa Bay', 'surface renewal Tampa',
    'bathtub reglazing Tampa', 'bathroom restoration Brandon FL',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'ORVUM | Premium Surface Renewal — Tampa Bay, FL',
    description: 'Restore instead of replace. Premium surface renewal for homes and properties throughout Tampa Bay.',
    siteName: 'ORVUM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORVUM | Premium Surface Renewal',
    description: 'Restore instead of replace. Tampa Bay\'s premier surface renewal company.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: '/',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.orvum.com',
  name: 'ORVUM',
  alternateName: 'Orvum Surface Renewal',
  description: 'Premium surface renewal company in Tampa Bay, Florida. Specializing in bathtub refinishing, shower restoration, countertop refinishing, cabinet refinishing, and tile painting.',
  url: 'https://www.orvum.com',
  telephone: '+18135550148',
  email: 'info@orvum.com',
  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card, Apple Pay, Google Pay',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tampa',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 27.9506, longitude: -82.4572 },
  areaServed: ['Tampa','Brandon','Riverview','Valrico','Lakeland','Plant City','Apollo Beach','Sun City Center','Lithia','Wesley Chapel'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Surface Renewal Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bathtub Refinishing', description: 'Professional bathtub refinishing and reglazing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shower Restoration', description: 'Fiberglass and tile shower restoration' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Countertop Refinishing', description: 'Countertop repair and surface refinishing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cabinet Refinishing', description: 'Cabinet cleaning, prep, and professional refinishing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tile Painting', description: 'Wall and floor tile painting with waterproof finish' } },
    ],
  },
  sameAs: [
    'https://www.facebook.com/orvum',
    'https://www.instagram.com/orvum',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-bg text-white antialiased" suppressHydrationWarning>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid #2A2A2A',
              color: '#fff',
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
