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

import ComponentShowcase from './components/ComponentShowcase.jsx'

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  useReveal()

  useEffect(() => {
    const isAdmin = path.startsWith('/admin')
    const isStore = path.startsWith('/store')
    const isComponents = path.startsWith('/components')
    const page = isAdmin
      ? {
          title: 'Admin CRM | Enang Weezie',
          description: '',
          canonical: '',
          robots: 'noindex, nofollow',
        }
      : isStore
        ? {
            title: 'Digital UI Kits, Templates & AI Packs | Enang Weezie',
            description:
              'Browse production-ready website templates, React UI components, AI agents, workflows and design systems by Enang Weezie, a designer and developer in Abuja, Nigeria.',
            canonical: 'https://weezie.site/store/',
            robots: 'index, follow',
          }
        : isComponents
          ? {
              title: 'Copy-Paste React & Tailwind UI Components | Weezie UI',
              description:
                'Explore copy-and-paste React and Tailwind UI components inspired by top web design sites. Zero dependencies, accessible, production ready.',
              canonical: 'https://weezie.site/components/',
              robots: 'index, follow',
            }
          : {
            title: 'Enang Weezie: Designer & Full-Stack Developer in Abuja, Nigeria',
            description:
              'Designer and full-stack developer in Abuja, Nigeria, working worldwide. Websites, e-commerce, fintech and investment platforms, web apps and AI tools, from $450.',
            canonical: 'https://weezie.site/',
            robots: 'index, follow',
          }

    document.title = page.title

    const setMeta = (key, value, attribute = 'name') => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      if (value) element.setAttribute('content', value)
      else element.remove()
    }

    const canonical = document.head.querySelector('link[rel="canonical"]')
    if (canonical) {
      if (page.canonical) canonical.setAttribute('href', page.canonical)
      else canonical.remove()
    }
    setMeta('description', page.description)
    setMeta('robots', page.robots)
    setMeta('og:title', page.title, 'property')
    setMeta('og:description', page.description, 'property')
    setMeta('og:url', page.canonical, 'property')
    setMeta('twitter:title', page.title)
    setMeta('twitter:description', page.description)
  }, [path])

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

  // Dedicated /components interactive UI showcase & copy-paste library
  if (path.startsWith('/components')) {
    return <ComponentShowcase onNavigate={navigate} />
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
