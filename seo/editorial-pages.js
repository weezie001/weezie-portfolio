import { projects, site } from '../src/data.js'
import { CASE_STUDIES } from '../src/data/caseStudiesData.js'

const root = 'https://weezie.site'
const esc = (value) => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const caseStudies = CASE_STUDIES.map((study) => ({
  path: `/work/${study.slug}/`,
  client: study.client,
  title: `${study.client} Case Study & Architecture | Enang Weezie`,
  headline: `${study.client}: ${study.tagline}`,
  description: study.description,
  category: study.category,
  intro: study.overview,
  problem: study.problem,
  solution: study.solution,
  features: study.features,
  userFlow: study.userFlow,
  siteMap: study.siteMap,
  impact: study.impact,
  liveUrl: study.liveUrl,
  image: study.image,
  project: projects.find((p) => p.client === study.client) || { image: study.image, href: study.liveUrl },
  kind: 'study',
}))

export const editorialPages = [
  {
    path: '/about/',
    title: 'About Enang Weezie — Web Designer & Product Engineer',
    description: 'Meet Enang Weezie, the designer and full-stack developer behind weezie.site. Web design, branding, e-commerce and AI tools for businesses.',
    kind: 'about',
  },
  {
    path: '/work/',
    title: 'Selected Work & Case Studies | Enang Weezie',
    description: 'Explore website and business-platform projects by Enang Weezie, with the design problem, delivered features, user flows, and site maps.',
    kind: 'work',
  },
  ...caseStudies,
]

function cards() {
  return `<div class="cards">${caseStudies.map((study) => `<a class="case-card" href="${study.path}"><img src="${study.project?.image || study.image}" alt="${esc(study.client)} website project" width="800" height="500" loading="lazy"><div><p class="eyebrow">${esc(study.category)}</p><h3>${esc(study.client)}</h3><p>${esc(study.headline)}</p><span class="text-link">Read case study, user flow &amp; architecture &rarr;</span></div></a>`).join('')}</div>`
}

export function content(page) {
  if (page.kind === 'about') {
    return `<section class="hero about-hero"><div><p class="eyebrow">The person behind weezie.site</p><h1>Hi, I'm<br>Enang Weezie.</h1><p class="lead">Weezie.site is my portfolio and design studio. I design websites, shape brands and build the software behind them.</p></div><img class="portrait" src="/favicon.png" alt="Illustrated portrait of Enang Weezie" width="256" height="256"></section>
    <div class="reading"><section><h2>A designer who also builds.</h2><p>I am a web designer and full-stack developer working with businesses and founders worldwide. My work includes marketing websites, e-commerce, business platforms, web applications and AI tools.</p><p>I work across the visible experience and the systems behind it: how a page communicates, how a customer gets in touch, how a payment works and how the team manages the result.</p></section>
    <section><h2>What I can help with</h2><ul><li><strong>Websites and rebranding.</strong> A clearer identity, stronger presentation of your work and a useful next step for visitors.</li><li><strong>Online stores and business platforms.</strong> Products, payments, orders, dashboards and role-based access.</li><li><strong>AI tools and integrations.</strong> Features and workflows built around a specific business task.</li></ul></section>
    <section><h2>Work you can explore</h2><p>Detailed case studies with interactive user flows and site maps across all client builds.</p></section></div>${cards()}
    <section class="reading"><h2>Find me elsewhere</h2><p>This is my official portfolio at <a href="https://weezie.site/">weezie.site</a>. You can also find my code on <a href="https://github.com/weezie001" rel="me">GitHub as weezie001</a>, connect with <a href="https://www.linkedin.com/in/enang-wisdom-344636237/" rel="me">Enang Wisdom on LinkedIn</a>, email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>, or <a href="${esc(site.cv)}">read my CV</a>.</p></section>`
  }

  if (page.kind === 'work') {
    return `<section class="hero"><p class="eyebrow">Selected work / Enang Weezie</p><h1>The work.<br>The architecture behind it.</h1><p class="lead">A closer look at the problem each project addresses, what I built, how users move through each system, and complete site maps.</p></section>${cards()}`
  }

  const userFlowHtml = page.userFlow ? `
    <section>
      <h2>Interactive User Flow</h2>
      <ol style="padding-left:20px;margin:20px 0;">
        ${page.userFlow.map((step) => `<li style="margin:16px 0;"><strong>Step ${esc(step.step)}: ${esc(step.title)}</strong><br>${esc(step.description)}</li>`).join('')}
      </ol>
    </section>
  ` : ''

  const siteMapHtml = page.siteMap ? `
    <section>
      <h2>Site Map &amp; Architecture</h2>
      ${page.siteMap.map((node) => `<div style="margin:16px 0;"><h3>${esc(node.section)}</h3><ul>${node.routes.map((r) => `<li><code>${esc(r)}</code></li>`).join('')}</ul></div>`).join('')}
    </section>
  ` : ''

  return `<section class="hero"><p class="eyebrow">${esc(page.client)} / ${esc(page.category)}</p><h1>${esc(page.headline)}</h1><p class="lead">${esc(page.intro)}</p><p class="byline">Design &amp; development by <a href="/about/">Enang Weezie</a></p></section>
    <img class="project-image" src="${page.project?.image || page.image}" alt="${esc(page.client)} project overview" width="1200" height="750">
    <div class="tags">${(page.features || []).map((feature) => `<span>${esc(feature)}</span>`).join('')}</div>
    <article class="reading">
      <section><h2>The Problem</h2><p>${esc(page.problem)}</p></section>
      <section><h2>What I Built</h2><p>${esc(page.solution)}</p></section>
      ${userFlowHtml}
      ${siteMapHtml}
      <section><h2>Measurable Business Impact</h2><p>${esc(page.impact)}</p></section>
      <p><a class="button" href="${esc(page.project?.href || page.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit the project &nearr;</a></p>
      <p><a href="/work/">Explore all case studies &rarr;</a></p>
    </article>`
}

function replaceMeta(html, attribute, key, replacement) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta(?=[^>]*\\b${attribute}="${escapedKey}")[^>]*>`, 'i')
  return html.replace(pattern, replacement)
}

export function editorialHtml(homeHtml, page, baseGraph) {
  const canonical = `${root}${page.path}`
  const title = esc(page.title)
  const description = esc(page.description)

  let html = homeHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<noscript>[\s\S]*?<\/noscript>/i, `<noscript><div style="max-width:52rem;margin:0 auto;padding:2rem 1.25rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.6;color:#2b2f3a">${content(page)}</div></noscript>`)

  html = replaceMeta(html, 'name', 'description', `<meta name="description" content="${description}" />`)
  html = replaceMeta(html, 'property', 'og:url', `<meta property="og:url" content="${canonical}" />`)
  html = replaceMeta(html, 'property', 'og:title', `<meta property="og:title" content="${title}" />`)
  html = replaceMeta(html, 'property', 'og:description', `<meta property="og:description" content="${description}" />`)
  html = replaceMeta(html, 'name', 'twitter:title', `<meta name="twitter:title" content="${title}" />`)
  html = replaceMeta(html, 'name', 'twitter:description', `<meta name="twitter:description" content="${description}" />`)

  if (page.image) {
    html = replaceMeta(html, 'property', 'og:image', `<meta property="og:image" content="${root}${page.image}" />`)
    html = replaceMeta(html, 'name', 'twitter:image', `<meta name="twitter:image" content="${root}${page.image}" />`)
  }

  if (baseGraph) {
    const graph = baseGraph['@graph'].filter((item) => ['Person', 'ProfessionalService', 'WebSite'].includes(item['@type']))
    graph.push({
      '@type': page.kind === 'about' ? 'AboutPage' : page.kind === 'work' ? 'CollectionPage' : 'Article',
      '@id': `${canonical}#page`,
      url: canonical,
      name: page.title,
      headline: page.headline || page.title,
      description: page.description,
      isPartOf: { '@id': `${root}/#website` },
      author: { '@id': `${root}/#person` },
      ...(page.kind === 'about' ? { mainEntity: { '@id': `${root}/#person` } } : {}),
      ...(page.image ? { image: `${root}${page.image}` } : {}),
    })
    const structured = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n${structured}\n    </script>`,
    )
  }

  return html
}
