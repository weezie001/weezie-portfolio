import { editorialPages, editorialHtml } from './editorial-pages.js'
// Builds everything search engines and AI assistants read without running
// JavaScript, straight from src/data.js, so it can never drift from the site:
//
//   - JSON-LD structured data in <head> (who, services, priced plans,
//     projects, FAQ)
//   - a plain-HTML copy of the page inside <noscript>
//   - /llms.txt, the plain-text summary AI assistants look for
//
// index.html holds two placeholders that this plugin fills at dev and build
// time. Edit content in src/data.js, never in the generated output.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { site, projects, services, rateCard, faqs, skills, storeProducts } from '../src/data.js'

const URL = 'https://weezie.site/'
const STORE_URL = `${URL}store/`
const STORE_TITLE = 'Digital UI Kits, Templates & AI Packs | Enang Weezie'
const STORE_DESCRIPTION =
  'Browse production-ready website templates, React UI components, AI agents, workflows and design systems by Enang Weezie, a designer and developer.'
const AI_LAB_URL = `${URL}ai-lab/`
const AI_LAB_TITLE = 'AI Lab: Instant Website Auditor & PRD Architect | Enang Weezie'
const AI_LAB_DESCRIPTION =
  'Instant AI-powered website conversion audit and technical MVP architecture blueprint generator by Enang Weezie.'
const COMPONENTS_URL = `${URL}components/`
const COMPONENTS_TITLE = 'Copy-Paste React & Tailwind UI Components | Weezie UI'
const COMPONENTS_DESCRIPTION =
  'Explore 35 original React and Tailwind UI components across navigation, forms, pricing, design systems and motion. Full source, examples and a runnable starter included.'
const ID = {
  person: URL + '#person',
  service: URL + '#service',
  work: URL + '#work',
  faq: URL + '#faq',
  website: URL + '#website',
}
const MARK = { jsonld: '<!-- ai-search:jsonld -->', mirror: '<!-- ai-search:mirror -->' }
const SUMMARY =
  'Designer and full-stack developer, working with clients worldwide. Designs and builds websites, e-commerce, fintech and investment platforms, web apps and AI tools, end to end.'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const toNumber = price => Number(String(price).replace(/[^0-9.]/g, '')) || 0
const isFrom = price => /^from\s/i.test(String(price).trim())

function planOffer(t) {
  return {
    '@type': 'Offer',
    name: t.name,
    description: t.blurb,
    // "from $3,500" is a floor, not a fixed price.
    priceSpecification: Object.entries(t.price).map(([currency, price]) => ({
      '@type': 'PriceSpecification',
      priceCurrency: currency,
      ...(isFrom(price) ? { minPrice: toNumber(price) } : { price: toNumber(price) }),
    })),
    itemOffered: {
      '@type': 'Service',
      name: t.name,
      description: `${t.blurb} Includes: ${t.includes.join('; ')}. Timeline: ${t.timeline}.`,
    },
  }
}

export function jsonLd(includeStore = false) {
  const usd = rateCard.tiers.map(t => toNumber(t.price.USD))
  const graph = [
      {
        '@type': 'Person',
        '@id': ID.person,
        name: site.name,
        alternateName: 'Enang Wisdom',
        jobTitle: 'Web Designer & Full-Stack Developer',
        description: SUMMARY,
        url: URL,
        email: 'mailto:' + site.email,
        image: URL + 'og.png',
        knowsLanguage: 'en',
        knowsAbout: [
          'Web Design', 'UI/UX Design', 'Front-End Development', 'Full-Stack Development', 'React',
          'Tailwind CSS', 'JavaScript', 'E-commerce Development', 'Fintech Platforms', 'Investment Platforms',
          'Payment Integration (Paystack, Stripe)', 'KYC and Identity Verification', 'AI Integration',
          'Brand Identity', 'Figma', 'Prototyping', 'Web Applications',
        ],
        sameAs: ['https://github.com/weezie001', 'https://www.linkedin.com/in/enang-wisdom-344636237/'],
        worksFor: { '@id': ID.service },
      },
      {
        '@type': 'ProfessionalService',
        '@id': ID.service,
        name: 'Enang Weezie Design & Development',
        description: 'Freelance web design and full-stack development studio, working with clients worldwide.',
        url: URL,
        image: URL + 'og.png',
        email: 'mailto:' + site.email,
        founder: { '@id': ID.person },
        areaServed: [
          { '@type': 'Place', name: 'Worldwide (remote)' },
        ],
        availableLanguage: 'en',
        priceRange: `$${Math.min(...usd).toLocaleString('en-US')} to $${Math.max(...usd).toLocaleString('en-US')}+`,
        hasOfferCatalog: [
          { '@type': 'OfferCatalog', name: 'Website and app plans', itemListElement: rateCard.tiers.map(planOffer) },
          {
            '@type': 'OfferCatalog',
            name: 'Design and development services',
            itemListElement: services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.desc } })),
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': ID.work,
        name: 'Selected projects by Enang Weezie',
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'WebSite', name: p.client, url: p.href, description: p.desc, creator: { '@id': ID.person } },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': ID.faq,
        mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      { '@type': 'WebSite', '@id': ID.website, url: URL, name: site.name, alternateName: ['weezie.site'], inLanguage: 'en', publisher: { '@id': ID.person } },
    ]

  if (includeStore) {
    graph.push(
      {
        '@type': 'CollectionPage',
        '@id': `${STORE_URL}#page`,
        url: STORE_URL,
        name: STORE_TITLE,
        description: STORE_DESCRIPTION,
        isPartOf: { '@id': ID.website },
        mainEntity: { '@id': `${STORE_URL}#products` },
      },
      {
        '@type': 'ItemList',
        '@id': `${STORE_URL}#products`,
        name: 'Digital products by Enang Weezie',
        numberOfItems: storeProducts.length,
        itemListElement: storeProducts.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.title,
            description: product.description,
            category: product.category,
            image: `${URL.replace(/\/$/, '')}${product.cover_image}`,
            url: STORE_URL,
            offers: [
              { '@type': 'Offer', priceCurrency: 'USD', price: product.price_usd, url: STORE_URL, availability: 'https://schema.org/InStock' },
              { '@type': 'Offer', priceCurrency: 'NGN', price: product.price_ngn, url: STORE_URL, availability: 'https://schema.org/InStock' },
            ],
          },
        })),
      },
    )
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

function escapeHtml(value) {
  return esc(value).replace(/'/g, '&#39;')
}

function storeMirror() {
  return `<noscript>
    <main>
      <h1>Digital UI Kits, Templates &amp; AI Packs</h1>
      <p>${escapeHtml(STORE_DESCRIPTION)}</p>
      <p><a href="/">Enang Weezie — designer and developer</a></p>
      <h2>Digital products</h2>
      <ul>${storeProducts.map(product => `<li><strong>${escapeHtml(product.title)}</strong> — ${escapeHtml(product.category)}. ${escapeHtml(product.description)} Price: ${product.is_freebie ? 'Free' : `$${product.price_usd} USD or ₦${Number(product.price_ngn).toLocaleString('en-NG')} NGN`}.</li>`).join('')}</ul>
      <p>Questions? Email <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>.</p>
    </main>
  </noscript>`
}

function replaceMeta(html, attribute, key, replacement) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta(?=[^>]*\\b${attribute}="${escapedKey}")[^>]*>`, 'i')
  return html.replace(pattern, replacement)
}

function storeHtml(homeHtml) {
  const title = escapeHtml(STORE_TITLE)
  const description = escapeHtml(STORE_DESCRIPTION)
  let html = homeHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${STORE_URL}" />`)
    .replace(/<noscript>[\s\S]*?<\/noscript>/i, storeMirror())

  html = replaceMeta(html, 'name', 'description', `<meta name="description" content="${description}" />`)
  html = replaceMeta(html, 'property', 'og:url', `<meta property="og:url" content="${STORE_URL}" />`)
  html = replaceMeta(html, 'property', 'og:title', `<meta property="og:title" content="${title}" />`)
  html = replaceMeta(html, 'property', 'og:description', `<meta property="og:description" content="${description}" />`)
  html = replaceMeta(html, 'name', 'twitter:title', `<meta name="twitter:title" content="${title}" />`)
  html = replaceMeta(html, 'name', 'twitter:description', `<meta name="twitter:description" content="${description}" />`)
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${JSON.stringify(jsonLd(true), null, 2).replace(/</g, '\\u003c')}\n    </script>`,
  )
  return html
}

function adminHtml(homeHtml) {
  return homeHtml
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>Admin CRM | Enang Weezie</title>')
    .replace(/<link rel="canonical"[^>]*>/i, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>/i, '<noscript><p>Admin sign-in requires JavaScript.</p></noscript>')
    .replace('</head>', '<meta name="robots" content="noindex, nofollow" />\n  </head>')
}

function aiLabHtml(homeHtml) {
  const title = escapeHtml(AI_LAB_TITLE)
  const description = escapeHtml(AI_LAB_DESCRIPTION)
  let html = homeHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${AI_LAB_URL}" />`)
  html = replaceMeta(html, 'name', 'description', `<meta name="description" content="${description}" />`)
  html = replaceMeta(html, 'property', 'og:url', `<meta property="og:url" content="${AI_LAB_URL}" />`)
  html = replaceMeta(html, 'property', 'og:title', `<meta property="og:title" content="${title}" />`)
  html = replaceMeta(html, 'property', 'og:description', `<meta property="og:description" content="${description}" />`)
  html = replaceMeta(html, 'name', 'twitter:title', `<meta name="twitter:title" content="${title}" />`)
  html = replaceMeta(html, 'name', 'twitter:description', `<meta name="twitter:description" content="${description}" />`)
  return toolPageHtml(html, AI_LAB_URL, AI_LAB_TITLE, AI_LAB_DESCRIPTION,
    '<h2>Website conversion auditor</h2><p>Enter your website URL and business context to get an AI-generated review of potential conversion problems and suggested improvements.</p><h2>PRD architect</h2><p>Describe your app idea to generate a product requirements document and technical architecture outline. Review generated recommendations before implementing them.</p><p>Enable JavaScript to run the tools and view the available report options.</p>')
}

function componentsHtml(homeHtml) {
  const title = escapeHtml(COMPONENTS_TITLE)
  const description = escapeHtml(COMPONENTS_DESCRIPTION)
  let html = homeHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${COMPONENTS_URL}" />`)
  html = replaceMeta(html, 'name', 'description', `<meta name="description" content="${description}" />`)
  html = replaceMeta(html, 'property', 'og:url', `<meta property="og:url" content="${COMPONENTS_URL}" />`)
  html = replaceMeta(html, 'property', 'og:title', `<meta property="og:title" content="${title}" />`)
  html = replaceMeta(html, 'property', 'og:description', `<meta property="og:description" content="${description}" />`)
  html = replaceMeta(html, 'name', 'twitter:title', `<meta name="twitter:title" content="${title}" />`)
  html = replaceMeta(html, 'name', 'twitter:description', `<meta name="twitter:description" content="${description}" />`)
  return toolPageHtml(html, COMPONENTS_URL, COMPONENTS_TITLE, COMPONENTS_DESCRIPTION,
    '<p>Explore interactive React and Tailwind UI examples, inspect the JSX source, and copy the implementation into your project.</p><h2>Component examples</h2><ul><li>Asymmetric bento grid</li><li>Usage-based pricing slider</li><li>OTP verification input</li><li>Feature comparison matrix</li><li>Split-screen authentication card</li><li>Minimal cards, navigation, filters, view toggle and submission modal</li></ul><p>Enable JavaScript to interact with previews and copy source code. Authentication and verification interfaces need your own backend integration.</p>')
}

function toolPageHtml(html, url, title, description, body) {
  const graph = jsonLd()['@graph'].filter(item => ['Person', 'ProfessionalService', 'WebSite'].includes(item['@type']))
  graph.push({ '@type': 'WebPage', '@id': url + '#page', url, name: title, description,
    isPartOf: { '@id': ID.website }, author: { '@id': ID.person } })
  return html
    .replace(/<noscript>[\s\S]*?<\/noscript>/i, `<noscript><main style="max-width:52rem;margin:auto;padding:2rem;font-family:monospace;line-height:1.7"><h1>${esc(title)}</h1><p>${esc(description)}</p>${body}<nav><a href="/">Home</a> | <a href="/about/">About Enang Weezie</a> | <a href="/work/">Case studies</a> | <a href="/store/">Store</a></nav></main></noscript>`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`)
}

function sitemap() {
  const urls = [
    URL,
    STORE_URL,
    AI_LAB_URL,
    COMPONENTS_URL,
    `${URL}privacy`,
    `${URL}kits/brand-delivery-kit/`,
    ...editorialPages.map(page => `${URL.replace(/\/$/, '')}${page.path}`),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`
}

export function mirror() {
  const plan = t =>
    `<li><strong>${esc(t.name)}</strong>: ${esc(t.price.USD)} (${esc(t.price.NGN)}), ${esc(t.timeline)}. ${esc(t.blurb)} Includes: ${esc(t.includes.join('; '))}.</li>`
  return `<noscript>
      <div style="max-width:52rem;margin:0 auto;padding:2rem 1.25rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.6;color:#2b2f3a">
        <h1>${esc(site.name)}: Designer &amp; Full-Stack Developer</h1>
        <p><a href="${URL}">weezie.site</a> &mdash; ${esc(site.name)}. Web design, branding and AI tools.</p>
        <p><strong>${esc(site.location)}. Available for new projects.</strong></p>
        <p>${esc(site.aboutBlurb)}</p>
        <p><a href="/about/">About Enang Weezie</a> | <a href="/work/">Project case studies</a> | <a href="/store/">Digital products</a> | <a href="/ai-lab/">AI Lab</a> | <a href="/components/">React components</a></p>
        <h2>Selected work</h2>
        <ul>${projects.map(p => `<li><a href="${esc(p.href)}">${esc(p.client)}</a> (${esc(p.tag)}): ${esc(p.desc)}</li>`).join('')}</ul>
        <h2>Services</h2>
        <ul>${services.map(s => `<li><strong>${esc(s.title)}:</strong> ${esc(s.desc)}</li>`).join('')}</ul>
        <h2>Pricing</h2>
        <p>${esc(rateCard.note)}</p>
        <ul>${rateCard.tiers.map(plan).join('')}</ul>
        <h2>Frequently asked questions</h2>
        ${faqs.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
        <h2>Skills</h2>
        <p>${esc(skills.join(', '))}.</p>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> (alt: <a href="mailto:${esc(site.secondaryEmail)}">${esc(site.secondaryEmail)}</a>)<br />GitHub: <a href="https://github.com/weezie001">github.com/weezie001</a><br />LinkedIn: <a href="https://www.linkedin.com/in/enang-wisdom-344636237/">Enang Wisdom (Enang Weezie)</a><br />CV: <a href="${esc(site.cv)}">download my CV (PDF)</a></p>
      </div>
    </noscript>`
}

export function llmsTxt() {
  return [
    `# ${site.name}`,
    '',
    `> ${SUMMARY}`,
    '',
    `- Website: ${URL}`,
    `- Digital products: ${STORE_URL}`,
    `- Business Email: ${site.email}`,
    `- Alternative Email: ${site.secondaryEmail}`,
    '- GitHub: https://github.com/weezie001',
    '- LinkedIn: https://www.linkedin.com/in/enang-wisdom-344636237/',
    `- Location: ${site.location}`,
    '- Availability: available for new projects',
    '',
    '## Pages and case studies',
    '',
    ...editorialPages.map(page => `- [${page.title}](${URL.replace(/\/$/, '')}${page.path}): ${page.description}`),
    `- [AI Lab](${AI_LAB_URL}): Website auditor and PRD architect.`,
    `- [React components](${COMPONENTS_URL}): Interactive previews and source code.`,
    '',
    '## Pricing',
    '',
    rateCard.note,
    '',
    ...rateCard.tiers.map(t => `- ${t.name}: ${t.price.USD} (${t.price.NGN}), ${t.timeline}. ${t.blurb} Includes: ${t.includes.join('; ')}.`),
    '',
    '## Services',
    '',
    ...services.map(s => `- ${s.title}: ${s.desc}`),
    '',
    '## Selected work',
    '',
    ...projects.map(p => `- [${p.client}](${p.href}): ${p.tag}. ${p.desc}`),
    '',
    '## Digital products',
    '',
    ...storeProducts.map(product => `- [${product.title}](${STORE_URL}): ${product.category}. ${product.description} ${product.is_freebie ? 'Free download.' : `Available for $${product.price_usd} USD or ₦${Number(product.price_ngn).toLocaleString('en-NG')} NGN.`}`),
    '',
    '## Frequently asked questions',
    '',
    ...faqs.flatMap(f => [`### ${f.q}`, '', f.a, '']),
  ].join('\n')
}

export default function aiSearch() {
  let outputDir
  let command

  return {
    name: 'ai-search',
    configResolved(config) {
      outputDir = resolve(config.root, config.build.outDir)
      command = config.command
    },
    transformIndexHtml(html, ctx) {
      for (const mark of Object.values(MARK)) {
        if (!html.includes(mark)) throw new Error(`ai-search: placeholder ${mark} is missing from index.html`)
      }
      // < keeps a "<" in any string from ever closing the script tag early.
      const ld = JSON.stringify(jsonLd(), null, 2).replace(/</g, '\\u003c')
      const transformed = html
        .replace(MARK.jsonld, `<script type="application/ld+json">\n${ld}\n    </script>`)
        .replace(MARK.mirror, mirror())
      return ctx.path.startsWith('/store') ? storeHtml(transformed) : transformed
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new globalThis.URL(req.url, 'http://localhost').pathname
        const page = editorialPages.find(page => page.path.replace(/\/$/, '') === pathname.replace(/\/$/, ''))
        if (!page) return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        const source = await readFile(resolve(server.config.root, 'index.html'), 'utf8')
        const home = await server.transformIndexHtml(req.url, source)
        res.end(editorialHtml(home, page, jsonLd()))
      })
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/llms.txt') return next()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(llmsTxt())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() })
    },
    async closeBundle() {
      if (command !== 'build') return
      const homeHtml = await readFile(resolve(outputDir, 'index.html'), 'utf8')
      await Promise.all(editorialPages.map(async page => {
        const dir = resolve(outputDir, page.path.replace(/^\//, ''))
        await mkdir(dir, { recursive: true })
        await writeFile(resolve(dir, 'index.html'), editorialHtml(homeHtml, page, jsonLd()))
      }))
      await mkdir(resolve(outputDir, 'store'), { recursive: true })
      await mkdir(resolve(outputDir, 'admin'), { recursive: true })
      await mkdir(resolve(outputDir, 'crm'), { recursive: true })
      await mkdir(resolve(outputDir, 'dashboard'), { recursive: true })
      await mkdir(resolve(outputDir, 'components'), { recursive: true })
      await mkdir(resolve(outputDir, 'ai-lab'), { recursive: true })
      await Promise.all([
        writeFile(resolve(outputDir, 'store/index.html'), storeHtml(homeHtml)),
        writeFile(resolve(outputDir, 'admin/index.html'), adminHtml(homeHtml)),
        writeFile(resolve(outputDir, 'crm/index.html'), adminHtml(homeHtml)),
        writeFile(resolve(outputDir, 'dashboard/index.html'), adminHtml(homeHtml)),
        writeFile(resolve(outputDir, 'components/index.html'), componentsHtml(homeHtml)),
        writeFile(resolve(outputDir, 'ai-lab/index.html'), aiLabHtml(homeHtml)),
        writeFile(resolve(outputDir, 'sitemap.xml'), sitemap()),
      ])
    },
  }
}
