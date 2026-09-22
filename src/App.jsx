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
import Clients from './components/Clients.jsx'
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
      {/*
        The game sits directly under the hero by design: the intro video ends
        and scrolls straight into it, so the hook is the first thing a visitor
        meets. Everything after it follows the buyer's questions in order:
        can you do this? (Work) → what can I buy? (Services/Pricing) → who else
        trusted you? (Clients) → who are you? (About) → is this a fit?
        (Partnership) → the ask. CodeShowcase sits below Contact: it sells to a
        technical evaluator, not to a business buying a site, so it must not
        stand between the visitor and the form.
      */}
      <main>
        <Hero />
        <RockPaperScissors />
        <Work />
        <Marquee />
        <Services />
        <Clients />
        <About />
        <Partnership />
        <CollabCTA />
        <Contact />
        <CodeShowcase />
      </main>
      <Footer />
      <ProjectBrief />
    </>
  )
}
