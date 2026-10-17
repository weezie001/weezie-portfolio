import { useEffect, useState } from 'react'
import Loader from './components/Loader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import RockPaperScissors from './components/RockPaperScissors.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import RateCard from './components/RateCard.jsx'
import StoreSection from './components/StoreSection.jsx'
import AILab from './components/AILab.jsx'
import Work from './components/Work.jsx'
import CodeShowcase from './components/CodeShowcase.jsx'
import Partnership from './components/Partnership.jsx'
import Clients from './components/Clients.jsx'
import FAQ from './components/FAQ.jsx'
import CollabCTA from './components/CollabCTA.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ProjectBrief from './components/ProjectBrief.jsx'
import AdminCRM from './components/AdminCRM.jsx'
import { useReveal } from './hooks/useReveal.js'

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  useReveal()

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(nextPath) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Dedicated /admin CRM dashboard route
  if (path.startsWith('/admin')) {
    return <AdminCRM onNavigate={navigate} />
  }

  // Dedicated /store digital products & freebies route
  if (path.startsWith('/store')) {
    return (
      <>
        <main>
          <StoreSection fullPage onNavigate={navigate} />
        </main>
        <Footer />
        <ProjectBrief />
      </>
    )
  }

  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <RockPaperScissors />
        <Work />
        <Marquee />
        <Services />
        <RateCard />
        <StoreSection onNavigate={navigate} />
        <AILab />
        <Clients />
        <About />
        <Partnership />
        <FAQ />
        <CollabCTA />
        <Contact />
        <CodeShowcase />
      </main>
      <Footer />
      <ProjectBrief />
    </>
  )
}
