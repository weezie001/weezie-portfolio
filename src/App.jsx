import Loader from './components/Loader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import RockPaperScissors from './components/RockPaperScissors.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Work from './components/Work.jsx'
import CodeShowcase from './components/CodeShowcase.jsx'
import Partnership from './components/Partnership.jsx'
import Testimonials from './components/Testimonials.jsx'
import CollabCTA from './components/CollabCTA.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ProjectBrief from './components/ProjectBrief.jsx'
import { useReveal } from './hooks/useReveal.js'

export default function App() {
  useReveal()

  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <RockPaperScissors />
        <Marquee />
        <About />
        <Services />
        <Work />
        <CodeShowcase />
        <Partnership />
        <Testimonials />
        <CollabCTA />
        <Contact />
      </main>
      <Footer />
      <ProjectBrief />
    </>
  )
}
