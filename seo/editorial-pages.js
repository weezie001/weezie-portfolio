import { projects, site } from '../src/data.js'

const root = 'https://weezie.site'
const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Case studies describe delivered scope. No unverified performance claims.
export const caseStudies = [
  {
    path: '/work/padup-creations/', client: 'PadUp Creations',
    title: 'A storefront connected to the business behind it.',
    description: 'How Enang Weezie brought product shopping, payments and role-based business portals together for PadUp Creations.',
    category: 'Commerce + business operations',
    intro: 'A business website has more than one audience. Customers need to find and buy the right product. The team behind the business needs to manage what happens next. The PadUp Creations build connects those two sides.',
    sections: [
      ['The design problem', 'The scope combined a public product catalogue with internal workflows for staff and distributors. Treating everything as one undifferentiated website would make both shopping and day-to-day operations harder to navigate. The design focus was to give each audience a clear place to start.'],
      ['What I built', 'I designed and built the storefront and business platform, including Paystack payments, location-aware pricing and four role-based portals. The documented scope includes orders, staff, distributor access, payroll and compliance workflows.'],
      ['How the experience fits together', 'The public-facing experience puts products and purchase options in reach of customers. Staff and distributor entry points serve a different purpose: access to the work behind the storefront. Keeping these journeys distinct helps the interface communicate what each visitor can do next.'],
      ['What is delivered', 'The result is a connected commerce and operations platform. The public site includes a product catalogue, ordering paths, order tracking and staff and distributor entry points.'],
      ['What this means for a similar project', 'If your website sells products while your team also manages orders or distribution, the useful starting point is a map of those different journeys. The visual design and access structure can then support the work people actually need to do.'],
    ],
    features: ['Product storefront', 'Paystack payments', 'Location-aware pricing', 'Role-based portals'],
  },
  {
    path: '/work/b-d-renovations/', client: 'B&D Renovations',
    title: 'From renovation ideas to a clearer enquiry.',
    description: 'A renovation website case study by Enang Weezie: project work, reviews and a guided estimate flow in one customer journey.',
    category: 'Service business + enquiries',
    intro: 'Someone planning a renovation needs to understand the work, feel confident in the contractor and know how to start a conversation. This build brings those decisions into one website experience.',
    sections: [
      ['The design problem', 'A renovation enquiry often begins before the customer knows exactly how to describe the job. The design focus was to make the business easier to evaluate and give visitors a more specific starting point than an open-ended contact message.'],
      ['What I built', 'The project combines a renovation-firm website, a project portfolio, Google review integration and a guided estimate flow. The estimate experience is presented as a short, three-minute route into the enquiry process.'],
      ['Why those pieces belong together', 'The portfolio shows the kind of work the business offers. Reviews provide a separate source of customer perspective. The estimate flow gives an interested visitor a next step. Each element answers a different question: what can you do, can I trust you, and how do we begin?'],
      ['What is delivered', 'The delivered website brings project examples, review content and an estimate entry point together. Visitors can move from exploring the work to starting a project enquiry.'],
      ['What this means for a similar project', 'For an established service business, a redesign should connect proof of the work with a useful action. Before adding more pages, make it clear what a prospective customer needs to see and what information would help the business respond.'],
    ],
    features: ['Project portfolio', 'Google review integration', 'Guided estimate flow', 'Clear enquiry path'],
  },
].map((study) => ({ ...study, project: projects.find((project) => project.client === study.client) }))

export const editorialPages = [
  { path: '/about/', title: 'About Enang Weezie | weezie.site', description: 'Meet Enang Weezie, the designer and full-stack developer behind weezie.site. Web design, branding, e-commerce and AI tools for businesses.', kind: 'about' },
  { path: '/work/', title: 'Web Design & Development Case Studies | Enang Weezie', description: 'Explore website and business-platform projects by Enang Weezie, with the design problem, delivered features and approach behind each build.', kind: 'work' },
  ...caseStudies.map((study) => ({ ...study, title: `${study.client} Case Study | Enang Weezie`, kind: 'study', headline: study.title })),
]

function cards() {
  return `<div class="cards">${caseStudies.map((study) => `<a class="case-card" href="${study.path}"><img src="${study.project.image}" alt="${esc(study.client)} website project" width="800" height="500" loading="lazy"><div><p class="eyebrow">${esc(study.category)}</p><h3>${esc(study.client)}</h3><p>${esc(study.title)}</p><span class="text-link">Read the case study &rarr;</span></div></a>`).join('')}</div>`
}

function content(page) {
  if (page.kind === 'about') return `<section class="hero about-hero"><div><p class="eyebrow">The person behind weezie.site</p><h1>Hi, I'm<br>Enang Weezie.</h1><p class="lead">Weezie.site is my portfolio and design studio. I design websites, shape brands and build the software behind them.</p></div><img class="portrait" src="/favicon.png" alt="Illustrated portrait of Enang Weezie" width="256" height="256"></section>
    <div class="reading"><section><h2>A designer who also builds.</h2><p>I am a web designer and full-stack developer working with businesses and founders worldwide. My work includes marketing websites, e-commerce, business platforms, web applications and AI tools.</p><p>I work across the visible experience and the systems behind it: how a page communicates, how a customer gets in touch, how a payment works and how the team manages the result.</p></section>
    <section><h2>What I can help with</h2><ul><li><strong>Websites and rebranding.</strong> A clearer identity, stronger presentation of your work and a useful next step for visitors.</li><li><strong>Online stores and business platforms.</strong> Products, payments, orders, dashboards and role-based access.</li><li><strong>AI tools and integrations.</strong> Features and workflows built around a specific business task.</li></ul></section>
    <section><h2>Work you can explore</h2><p>PadUp Creations combines commerce with business operations. B&D Renovations connects project examples and reviews with an estimate flow. The case studies below explain the scope and the thinking behind each build.</p></section></div>${cards()}
    <section class="reading"><h2>Find me elsewhere</h2><p>This is my official portfolio at <a href="https://weezie.site/">weezie.site</a>. You can also find my code on <a href="https://github.com/weezie001" rel="me">GitHub as weezie001</a>, connect with <a href="https://www.linkedin.com/in/enang-wisdom-344636237/" rel="me">Enang Wisdom on LinkedIn</a>, or <a href="${esc(site.cv)}">read my CV</a>.</p></section>`
  if (page.kind === 'work') return `<section class="hero"><p class="eyebrow">Selected work / Enang Weezie</p><h1>The work.<br>The thinking behind it.</h1><p class="lead">A closer look at the problem each project addresses, what I built and how the pieces fit together.</p></section>${cards()}`
  return `<section class="hero"><p class="eyebrow">${esc(page.client)} / ${esc(page.category)}</p><h1>${esc(page.headline)}</h1><p class="lead">${esc(page.intro)}</p><p class="byline">Design &amp; development by <a href="/about/">Enang Weezie</a></p></section>
    <img class="project-image" src="${page.project.image}" alt="${esc(page.client)} project overview" width="1200" height="750">
    <div class="tags">${page.features.map((feature) => `<span>${esc(feature)}</span>`).join('')}</div>
    <article class="reading">${page.sections.map(([heading, paragraph]) => `<section><h2>${esc(heading)}</h2><p>${esc(paragraph)}</p></section>`).join('')}
    <p><a class="button" href="${esc(page.project.href)}" target="_blank" rel="noopener noreferrer">Visit the project &nearr;</a></p><p><a href="/work/">Explore the other case study &rarr;</a></p></article>`
}

export function renderEditorialPage(page, baseGraph) {
  const canonical = `${root}${page.path}`
  const graph = baseGraph['@graph'].filter((item) => ['Person', 'ProfessionalService', 'WebSite'].includes(item['@type']))
  graph.push({ '@type': page.kind === 'about' ? 'AboutPage' : page.kind === 'work' ? 'CollectionPage' : 'Article', '@id': `${canonical}#page`, url: canonical, name: page.title, headline: page.headline || page.title, description: page.description, isPartOf: { '@id': `${root}/#website` }, author: { '@id': `${root}/#person` }, ...(page.kind === 'about' ? { mainEntity: { '@id': `${root}/#person` } } : {}), ...(page.project ? { image: `${root}${page.project.image}` } : {}) })
  const structured = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.png"><meta property="og:type" content="${page.kind === 'study' ? 'article' : 'website'}"><meta property="og:site_name" content="Enang Weezie"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${root}${page.project?.image || '/og.png'}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${structured}</script>
  <style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#e9ebf1;color:#0c0d10;font:16px/1.8 'JetBrains Mono',Consolas,monospace}a{color:inherit;text-underline-offset:5px}a:focus-visible{outline:3px solid #2f6bff;outline-offset:5px}header,main,footer{max-width:1120px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid #d3d7e0}nav{display:flex;flex-wrap:wrap;gap:22px;font-size:13px}.brand{display:flex;align-items:center;gap:10px;font-weight:bold;font-size:24px;text-decoration:none}.brand img{width:36px;border-radius:8px}.brand b{color:#2f6bff}.hero{padding:64px 0 48px;background:url('/email/doodles-paper.png') right top/600px auto no-repeat}.about-hero{display:grid;grid-template-columns:1fr 230px;gap:40px;align-items:center}.portrait{width:100%;height:auto;border-radius:28px;transform:rotate(3deg);box-shadow:12px 12px 30px #c6c9d4}h1{font-size:clamp(36px,5vw,64px);line-height:1.12;letter-spacing:-3px;max-width:900px;margin:20px 0 28px}h2{font-size:25px;line-height:1.35;letter-spacing:-.7px}h3{font-size:24px;line-height:1.3;margin:10px 0}.eyebrow{text-transform:uppercase;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#1e50d6}.lead{font-size:18px;max-width:780px;color:#3f434e}.reading{max-width:760px;margin:44px auto}.reading section{margin:40px 0}.reading p,.reading li{color:#3f434e}.reading li{margin:14px 0}.cards{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin:30px 0 60px}.case-card{display:block;text-decoration:none;border:1px solid #d3d7e0;border-radius:24px;overflow:hidden;box-shadow:6px 6px 16px #c6c9d4,-6px -6px 16px #fff}.case-card img{display:block;width:100%;height:240px;object-fit:cover;object-position:top}.case-card>div{padding:24px}.text-link{color:#1e50d6;font-weight:bold;font-size:13px}.project-image{display:block;width:100%;height:auto;max-height:620px;object-fit:cover;object-position:top;border-radius:24px;border:1px solid #d3d7e0}.tags{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0}.tags span{padding:8px 14px;border:1px solid #d3d7e0;border-radius:30px;font-size:12px}.byline{font-size:13px}.cta{padding:36px;border-radius:24px;background:#0c0d10;color:white;margin:60px 0 30px}.cta p{max-width:700px;color:#d3d7e0}.button{display:inline-block;background:#2f6bff;color:#fff;padding:13px 22px;border-radius:30px;text-decoration:none;font-size:13px;font-weight:bold}footer{border-top:1px solid #d3d7e0;font-size:12px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;padding-bottom:40px}footer div{display:flex;flex-wrap:wrap;gap:18px}@media(max-width:640px){header,main,footer{padding-left:20px;padding-right:20px}header{align-items:flex-start}nav{gap:12px;font-size:11px}.brand{font-size:19px}.brand img{width:28px}.hero{padding-top:38px}.about-hero{grid-template-columns:1fr}.portrait{width:120px;grid-row:1}.cards{grid-template-columns:1fr}h1{letter-spacing:-1.5px}.lead{font-size:16px}.cta{padding:24px}.case-card img{height:210px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style></head><body>
  <header><a class="brand" href="/"><img src="/favicon.png" alt="">weezie<b>.</b></a><nav aria-label="Main navigation"><a href="/about/"${page.kind === 'about' ? ' aria-current="page"' : ''}>About</a><a href="/work/"${page.kind === 'work' ? ' aria-current="page"' : ''}>Case studies</a><a href="/store/">Store</a><a href="/#contact">Contact</a></nav></header>
  <main>${content(page)}<section class="cta"><p class="eyebrow" style="color:#8aaaff">Have a project in mind?</p><h2>Let's make the next step clearer.</h2><p>Tell me what your business needs and what is getting in the way. We can work out the useful starting point together.</p><a class="button" href="/#contact">Start a conversation</a></section></main>
  <footer><span>weezie.site / Enang Weezie</span><div><a href="/about/">About</a><a href="/work/">Case studies</a><a href="https://github.com/weezie001">GitHub</a><a href="https://www.linkedin.com/in/enang-wisdom-344636237/">LinkedIn</a><a href="/privacy.html">Privacy</a></div></footer></body></html>`
}
