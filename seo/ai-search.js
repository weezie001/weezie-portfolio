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
import { site, projects, services, rateCard, faqs, skills } from '../src/data.js'

const URL = 'https://weezie-portfolio.vercel.app/'
const ID = {
  person: URL + '#person',
  service: URL + '#service',
  work: URL + '#work',
  faq: URL + '#faq',
  website: URL + '#website',
}
const MARK = { jsonld: '<!-- ai-search:jsonld -->', mirror: '<!-- ai-search:mirror -->' }
const SUMMARY =
  'Designer and full-stack developer in Abuja, Nigeria, working with clients worldwide. Designs and builds websites, e-commerce, fintech and investment platforms, web apps and AI tools, end to end.'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const toNumber = price => Number(String(price).replace(/[^0-9.]/g, '')) || 0
const isFrom = price => /^from\s/i.test(String(price).trim())
const address = { '@type': 'PostalAddress', addressLocality: 'Abuja', addressRegion: 'FCT', addressCountry: 'NG' }

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

export function jsonLd() {
  const usd = rateCard.tiers.map(t => toNumber(t.price.USD))
  return {
    '@context': 'https://schema.org',
    '@graph': [
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
        address,
        knowsLanguage: 'en',
        knowsAbout: [
          'Web Design', 'UI/UX Design', 'Front-End Development', 'Full-Stack Development', 'React',
          'Tailwind CSS', 'JavaScript', 'E-commerce Development', 'Fintech Platforms', 'Investment Platforms',
          'Payment Integration (Paystack, Stripe)', 'KYC and Identity Verification', 'AI Integration',
          'Brand Identity', 'Figma', 'Prototyping', 'Web Applications',
        ],
        sameAs: ['https://github.com/weezie001'],
        worksFor: { '@id': ID.service },
      },
      {
        '@type': 'ProfessionalService',
        '@id': ID.service,
        name: 'Enang Weezie Design & Development',
        description: 'Freelance web design and full-stack development studio based in Abuja, Nigeria, working with clients worldwide.',
        url: URL,
        image: URL + 'og.png',
        email: 'mailto:' + site.email,
        founder: { '@id': ID.person },
        address,
        areaServed: [
          { '@type': 'City', name: 'Abuja' },
          { '@type': 'Country', name: 'Nigeria' },
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
      { '@type': 'WebSite', '@id': ID.website, url: URL, name: site.name, inLanguage: 'en', publisher: { '@id': ID.person } },
    ],
  }
}

export function mirror() {
  const plan = t =>
    `<li><strong>${esc(t.name)}</strong>: ${esc(t.price.USD)} (${esc(t.price.NGN)}), ${esc(t.timeline)}. ${esc(t.blurb)} Includes: ${esc(t.includes.join('; '))}.</li>`
  return `<noscript>
      <div style="max-width:52rem;margin:0 auto;padding:2rem 1.25rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.6;color:#2b2f3a">
        <h1>${esc(site.name)}: Designer &amp; Full-Stack Developer in Abuja, Nigeria</h1>
        <p><strong>${esc(site.location)}. Available for new projects.</strong></p>
        <p>${esc(site.aboutBlurb)}</p>
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
        <p>Email: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a><br />GitHub: <a href="https://github.com/weezie001">github.com/weezie001</a><br />CV: <a href="${esc(site.cv)}">download my CV (PDF)</a></p>
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
    `- Email: ${site.email}`,
    '- GitHub: https://github.com/weezie001',
    `- Location: ${site.location}`,
    '- Availability: available for new projects',
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
    '## Frequently asked questions',
    '',
    ...faqs.flatMap(f => [`### ${f.q}`, '', f.a, '']),
  ].join('\n')
}

export default function aiSearch() {
  return {
    name: 'ai-search',
    transformIndexHtml(html) {
      for (const mark of Object.values(MARK)) {
        if (!html.includes(mark)) throw new Error(`ai-search: placeholder ${mark} is missing from index.html`)
      }
      // < keeps a "<" in any string from ever closing the script tag early.
      const ld = JSON.stringify(jsonLd(), null, 2).replace(/</g, '\\u003c')
      return html
        .replace(MARK.jsonld, `<script type="application/ld+json">\n${ld}\n    </script>`)
        .replace(MARK.mirror, mirror())
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/llms.txt') return next()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(llmsTxt())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() })
    },
  }
}
