import { useEffect, useState, lazy, Suspense } from 'react'
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
import AboutPage from './components/AboutPage.jsx'
import WorkPage from './components/WorkPage.jsx'
import CaseStudyDetail from './components/CaseStudyDetail.jsx'
const ComponentShowcase = lazy(() => import('./components/ComponentShowcase.jsx'))
const LandingPageShowcase = lazy(() => import('./components/LandingPageShowcase.jsx'))
import { CASE_STUDIES } from './data/caseStudiesData.js'
import { useReveal } from './hooks/useReveal.js'

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  useReveal(path)

  useEffect(() => {
    const isAdmin = path.startsWith('/admin') || path.startsWith('/crm') || path.startsWith('/dashboard')
    const isStore = path.startsWith('/store')
    const isComponents = path.startsWith('/components')
    const isTemplates = path.startsWith('/templates')
    const isAILab = path.startsWith('/ai-lab')
    const isAbout = path.startsWith('/about')
    const isWork = path.startsWith('/work')
    const workSlug = isWork ? path.replace(/^\/work\/?/, '').replace(/\/$/, '') : null

    let pageTitle = 'Enang Weezie: Designer & Full-Stack Developer'
    let pageDesc = 'Designer and full-stack developer, working worldwide. Websites, e-commerce, fintech and investment platforms, web apps and AI tools, from $450.'
    let pageCanonical = 'https://weezie.site/'
    let pageRobots = 'index, follow'

    if (isAdmin) {
      pageTitle = 'Admin CRM | Enang Weezie'
      pageDesc = ''
      pageCanonical = ''
      pageRobots = 'noindex, nofollow'
    } else if (isAILab) {
      pageTitle = 'AI Lab: Instant Website Auditor & PRD Architect | Enang Weezie'
      pageDesc = 'Instant AI-powered website conversion audit and technical MVP architecture blueprint generator by Enang Weezie.'
      pageCanonical = 'https://weezie.site/ai-lab/'
    } else if (isStore) {
      pageTitle = 'Digital UI Kits, Templates & AI Packs | Enang Weezie'
      pageDesc = 'Browse production-ready website templates, React UI components, AI agents, workflows and design systems by Enang Weezie.'
      pageCanonical = 'https://weezie.site/store/'
    } else if (isComponents) {
      pageTitle = 'Copy-Paste React & Tailwind UI Components | Weezie UI'
      pageDesc = 'Explore 35 original React and Tailwind UI components across navigation, forms, pricing, design systems and motion. Full source, examples and a runnable starter included.'
      pageCanonical = 'https://weezie.site/components/'
    } else if (isTemplates) {
      pageTitle = '10 High-End Landing Page Templates Suite | Weezie Studio'
      pageDesc = 'Explore 10 production-ready website templates with kinetic motion scroll, luxury branding, and responsive mobile architecture.'
      pageCanonical = 'https://weezie.site/templates/'
    } else if (isAbout) {
      pageTitle = 'About Enang Weezie — Web Designer & Product Engineer'
      pageDesc = 'Learn about Enang Weezie, design philosophy, technical stack, experience timeline, and approach to building high-converting digital products.'
      pageCanonical = 'https://weezie.site/about/'
    } else if (isWork && workSlug) {
      const found = CASE_STUDIES.find((s) => s.slug === workSlug)
      if (found) {
        pageTitle = `${found.client} Case Study & Architecture | Enang Weezie`
        pageDesc = found.description
        pageCanonical = `https://weezie.site/work/${found.slug}/`
      } else {
        pageTitle = 'Case Studies & Client Work | Enang Weezie'
        pageDesc = 'Explore comprehensive case studies across e-commerce, automated SaaS engines, and multi-portal operations platforms.'
        pageCanonical = 'https://weezie.site/work/'
      }
    } else if (isWork) {
      pageTitle = 'Selected Work & Case Studies | Enang Weezie'
      pageDesc = 'Explore comprehensive case studies across e-commerce, automated SaaS engines, and multi-portal operations platforms.'
      pageCanonical = 'https://weezie.site/work/'
    }

    document.title = pageTitle

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
      if (pageCanonical) canonical.setAttribute('href', pageCanonical)
      else canonical.remove()
    }
    setMeta('description', pageDesc)
    setMeta('robots', pageRobots)
    setMeta('og:title', pageTitle, 'property')
    setMeta('og:description', pageDesc, 'property')
    setMeta('og:url', pageCanonical, 'property')
    setMeta('twitter:title', pageTitle)
    setMeta('twitter:description', pageDesc)
  }, [path])

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(nextPath) {
    if (nextPath.includes('#')) {
      const [routePath, hash] = nextPath.split('#')
      const targetRoute = routePath || '/'
      window.history.pushState({}, '', nextPath)
      setPath(targetRoute)
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          el.querySelectorAll('.reveal').forEach((item) => item.classList.add('in'))
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 70)
      return
    }

    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Dedicated /admin CRM dashboard route (with /crm and /dashboard aliases)
  if (path.startsWith('/admin') || path.startsWith('/crm') || path.startsWith('/dashboard')) {
    return <AdminCRM onNavigate={navigate} />
  }

  // Dedicated /ai-lab route
  if (path.startsWith('/ai-lab')) {
    return (
      <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
        <Navbar onNavigate={navigate} currentPath="/ai-lab" />
        <main className="pt-24 pb-12 md:pt-28">
          <AILab fullPage onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
        <ProjectBrief />
      </div>
    )
  }

  // Dedicated /store digital products & freebies route
  if (path.startsWith('/store')) {
    return (
      <div className="min-h-screen bg-paper text-ink selection:bg-blue selection:text-white">
        <Navbar onNavigate={navigate} currentPath="/store" />
        <main className="pt-24 pb-12 md:pt-28">
          <StoreSection fullPage onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
        <ProjectBrief />
      </div>
    )
  }

  // Dedicated /components interactive UI showcase & copy-paste library
  if (path.startsWith('/components')) {
    return <Suspense fallback={<p role="status" className="p-10">Loading the component library...</p>}><ComponentShowcase onNavigate={navigate} /></Suspense>
  }

  // Dedicated /templates landing page templates showcase
  if (path.startsWith('/templates')) {
    return (
      <Suspense fallback={<p role="status" className="p-10">Loading templates showcase...</p>}>
        <LandingPageShowcase onNavigate={navigate} />
      </Suspense>
    )
  }

  // Dedicated /about page
  if (path.startsWith('/about')) {
    return <AboutPage onNavigate={navigate} />
  }

  // Dedicated individual /work/:slug case study route
  if (path.startsWith('/work/')) {
    const slug = path.replace(/^\/work\//, '').replace(/\/$/, '')
    if (slug) {
      return <CaseStudyDetail slug={slug} onNavigate={navigate} />
    }
    return <WorkPage onNavigate={navigate} />
  }

  // Dedicated /work overview directory
  if (path.startsWith('/work')) {
    return <WorkPage onNavigate={navigate} />
  }

  // Main Home Page
  return (
    <>
      <Loader />
      <Navbar onNavigate={navigate} currentPath="/" />
      <main>
        <Hero />
        <RockPaperScissors />
        <About onNavigate={navigate} />
        <Work onNavigate={navigate} />
        <Marquee />
        <Services />
        <CodeShowcase />
        <RateCard />
        <StoreSection onNavigate={navigate} />
        <AILab onNavigate={navigate} />
        <Clients />
        <Partnership />
        <FAQ />
        <CollabCTA />
        <Contact />
      </main>
      <Footer onNavigate={navigate} />
      <ProjectBrief />
    </>
  )
}
