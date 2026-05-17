
import Navbar from '../components/Navbar'
import {Hero} from '../components/Hero'
import {Features} from '../components/Feature'
import {Analytics} from '../components/Analytics'
import {Testimonials} from '../components/Testimonials'
import {FAQ} from '../components/FAQ'
import {FinalCTA} from '../components/FinalCTA'
import {Footer} from '../components/Footer'
import LandingGuard from '../components/LandingGuard'

export default function HomePage() {
  return (
    <LandingGuard>
      <main>
        <Navbar />
        <Hero />
        <section id="features">
          <Features />
        </section>
        <section id="analytics">
          <Analytics />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <FinalCTA />
        <Footer />
      </main>
    </LandingGuard>
  )
}
