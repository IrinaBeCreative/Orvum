import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <main className="bg-bg min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="text-center">
          <div className="font-display text-[120px] font-light text-border leading-none mb-4">404</div>
          <h1 className="font-display text-3xl font-light text-white mb-3">Page Not Found</h1>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />
          <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
