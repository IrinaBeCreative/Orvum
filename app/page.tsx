import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import TrustBar from '@/components/sections/TrustBar'
import ServicePackages from '@/components/sections/ServicePackages'
import Services from '@/components/sections/Services'
import Gallery from '@/components/sections/Gallery'
import HowItWorks from '@/components/sections/HowItWorks'
import EstimateForm from '@/components/sections/EstimateForm'
import BookingSection from '@/components/sections/BookingSection'
import PropertyManagers from '@/components/sections/PropertyManagers'
import Reviews from '@/components/sections/Reviews'
import ServiceAreas from '@/components/sections/ServiceAreas'
import FAQ from '@/components/sections/FAQ'
import BlogPreview from '@/components/sections/BlogPreview'
import Footer from '@/components/layout/Footer'
import {
  getSiteSettings, getHero, getPackages, getServices,
  getGalleryItems, getTestimonials, getFaq, getServiceAreas,
  getBlogPosts, getActivePromotions,
} from '@/lib/sanity/queries'

export const revalidate = 60 // ISR — revalidate every 60 seconds

export default async function HomePage() {
  const [
    settings, hero, packages, services,
    gallery, testimonials, faq, areas,
    posts, promotions,
  ] = await Promise.all([
    getSiteSettings(),
    getHero(),
    getPackages(),
    getServices(),
    getGalleryItems(),
    getTestimonials(),
    getFaq(),
    getServiceAreas(),
    getBlogPosts(3),
    getActivePromotions(),
  ])

  return (
    <main className="bg-bg">
      <Navbar settings={settings} />
      <Hero hero={hero} settings={settings} />
      <TrustBar />
      <ServicePackages packages={packages} promotions={promotions} />
      <Services services={services} />
      <Gallery items={gallery} />
      <HowItWorks />
      <EstimateForm services={services} />
      <BookingSection services={services} />
      <PropertyManagers />
      <Reviews testimonials={testimonials} />
      <ServiceAreas areas={areas} />
      <FAQ items={faq} />
      {posts.length > 0 && <BlogPreview posts={posts} />}
      <Footer settings={settings} />
    </main>
  )
}
