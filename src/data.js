// ============================================================
// EDIT ME: all site content lives here.
// Swap placeholder project images by dropping files into
// /public/projects and setting the `image` paths below.
// ============================================================

export const site = {
  name: 'Enang Weezie',
  firstName: 'WEEZIE',
  logo: 'Weezie.',
  wordmark: 'enang weezie',
  email: 'enang@weezie.site',
  secondaryEmail: 'enangweezie@gmail.com',
  cv: '/enang-weezie-cv.pdf', // downloadable résumé hosted on the site
  // Contact form endpoint (Formspree) — submissions land in enangweezie@gmail.com.
  formEndpoint: 'https://formspree.io/f/xlgqezad',

  location: 'Abuja, Nigeria · working worldwide',
  roles: ['Web Designer', 'Full-Stack Developer', 'AI / Product Engineer'],
  heroBlurb:
    'A designer and full-stack developer who ships real products: websites, web apps, e-commerce and AI tools.',
  aboutBlurb:
    "I design and build products end to end: marketing sites, e-commerce, web apps and AI tools. From a live business platform with payments and staff portals to a desktop AI assistant, I take ideas from a blank repo to shipped. Let's build something people remember.",
  // homepage intro videos (Weezie waking up) — landscape for desktop, portrait for mobile
  video: {
    landscape: '/intro/intro-landscape.mp4',
    landscapePoster: '/intro/intro-landscape-poster.jpg',
    portrait: '/intro/intro-portrait.mp4',
    portraitPoster: '/intro/intro-portrait-poster.jpg',
  },
}

// Cut-out 3D character scenes (transparent PNGs) used on the dark bands
export const characters = {
  about: '/characters/about.png',
  partnership: '/characters/partnership.png',
  showing: '/characters/showing.png',
}

export const aboutStats = [
  { value: '3+', label: 'Years designing' },
  { value: '20+', label: 'Projects shipped' },
  { value: '100%', label: 'Client-obsessed' },
]

// Partnership section copy (EDIT ME)
export const partners = [
  { title: 'Agencies', desc: 'White-label design & build for studios that need extra firepower on a deadline.' },
  { title: 'Startups', desc: 'From idea to launch — brand, landing page and product UI that raise the bar.' },
  { title: 'Founders', desc: 'A design partner who ships fast, communicates clearly and treats your goal as the brief.' },
]

export const skills = [
  'Figma', 'Web Design', 'UI / UX', 'React', 'Tailwind CSS',
  'Framer', 'Branding', 'Product Design', 'Prototyping', 'Web Apps',
]

export const services = [
  {
    n: '01',
    title: 'Web Design',
    desc: 'Landing pages and full websites designed to look bold and convert visitors into customers.',
  },
  {
    n: '02',
    title: 'UI / UX Design',
    desc: 'Interfaces for apps and dashboards — wireframes to polished, developer-ready design systems.',
  },
  {
    n: '03',
    title: 'Development',
    desc: 'Pixel-perfect builds with React and Tailwind CSS. Fast, responsive and SEO-friendly.',
  },
  {
    n: '04',
    title: 'Brand Identity',
    desc: 'Logos, colours and type that give your business one consistent, memorable voice.',
  },
  {
    n: '05',
    title: 'Prototyping',
    desc: 'Clickable, high-fidelity prototypes for testing and pitching ideas before a single line of code.',
  },
]

// RATE CARD (EDIT ME). These figures were reviewed and kept deliberately: a
// higher set was trialled and rolled back to these.
// Prices are set per currency on purpose (not converted), so local and
// international rates move independently.
// The component also supports two optional fields, both currently unused:
//   rush: 'string'                    → a band under the cards
//   from: { NGN: '…', USD: '…' }      → a sub-line under a tier's price
export const rateCard = {
  currencies: ['USD', 'NGN'], // first one is the default everywhere
  note: 'Starting points, not final quotes. Every project gets priced properly after we talk.',
  tiers: [
    {
      name: 'Landing Page',
      blurb: 'One page that sells one thing: a launch, a product, a campaign.',
      price: { NGN: '₦500,000', USD: '$450' },
      timeline: '1 week',
      popular: false,
      includes: [
        'Single page, custom designed',
        'Mobile and tablet responsive',
        'Contact or waitlist form',
        'Basic SEO and social share cards',
        '1 round of revisions',
      ],
    },
    {
      name: 'Business Website',
      blurb: 'The full site your business is judged by. Multi-page, built to convert.',
      price: { NGN: '₦1,000,000', USD: '$900' },
      timeline: '2 to 3 weeks',
      popular: true,
      includes: [
        'Up to 6 custom pages',
        'Brand-matched design system',
        'CMS so you can edit content',
        'Full SEO setup and analytics',
        'Speed and accessibility pass',
        '2 rounds of revisions',
      ],
    },
    {
      name: 'Online Store',
      blurb: 'Sell properly: products, payments, orders and an admin you control.',
      price: { NGN: '₦2,000,000', USD: '$1,800' },
      timeline: '3 to 4 weeks',
      popular: false,
      includes: [
        'Everything in Business Website',
        'Product catalogue and cart',
        'Paystack or Stripe checkout',
        'Orders dashboard and admin',
        'Stock and delivery setup',
        'Staff training walkthrough',
      ],
    },
    {
      name: 'Web App / AI Build',
      blurb: 'Custom software: dashboards, portals, automations, AI tools.',
      price: { NGN: 'from ₦4,000,000', USD: 'from $3,500' },
      timeline: 'scoped together',
      popular: false,
      includes: [
        'Discovery and technical scoping',
        'Custom backend and database',
        'User accounts and role-based access',
        'Third-party and AI integrations',
        'Deployment and handover docs',
        'Post-launch support window',
      ],
    },
  ],
}

// PROJECT BRIEF FEATURES (EDIT ME)
// Every feature a visitor can tick in the project brief, with its price.
// Prices are NEVER shown to visitors: they only feed the total.
//
//   Brief total = the chosen plan's rate-card price
//               + the prices of extra features ticked beyond the plan
//
// Features the plan already includes (briefPricing.planFeatures below) show
// as ticked and locked "In your plan" and are never charged on top.
//
//   requires:  features it cannot work without. Ticking it ticks them too,
//              so a wallet can never be priced without the accounts and
//              admin panel it needs to function.
export const briefFeatureGroups = [
  {
    group: 'Content & pages',
    items: [
      { label: 'Blog / News Section', price: { NGN: 150000, USD: 150 } },
      { label: 'Gallery / Portfolio Showcase', price: { NGN: 100000, USD: 100 } },
      { label: 'Multi-language', price: { NGN: 250000, USD: 250 } },
    ],
  },
  {
    group: 'Accounts & admin',
    items: [
      { label: 'User Registration / Login', price: { NGN: 300000, USD: 300 } },
      { label: 'User Dashboard / Profiles', price: { NGN: 400000, USD: 350 }, requires: ['User Registration / Login'] },
      { label: 'Admin Dashboard', price: { NGN: 450000, USD: 400 } },
      {
        label: 'Staff Roles & Permissions',
        price: { NGN: 350000, USD: 300 },
        requires: ['User Registration / Login', 'Admin Dashboard'],
      },
    ],
  },
  {
    group: 'Payments & commerce',
    items: [
      { label: 'Payment Processing (Paystack / Stripe)', price: { NGN: 350000, USD: 300 } },
      {
        label: 'Subscriptions / Recurring Billing',
        price: { NGN: 450000, USD: 400 },
        requires: ['Payment Processing (Paystack / Stripe)', 'User Registration / Login'],
      },
      { label: 'Invoices & Receipts', price: { NGN: 300000, USD: 250 }, requires: ['Payment Processing (Paystack / Stripe)'] },
      { label: 'Coupons & Discount Codes', price: { NGN: 150000, USD: 150 }, requires: ['Payment Processing (Paystack / Stripe)'] },
      {
        label: 'Multi-vendor Marketplace',
        price: { NGN: 1400000, USD: 1200 },
        requires: ['User Registration / Login', 'Admin Dashboard', 'Payment Processing (Paystack / Stripe)'],
      },
    ],
  },
  {
    group: 'Finance & fintech',
    items: [
      { label: 'Wallet & Balance System', price: { NGN: 700000, USD: 600 }, requires: ['User Registration / Login', 'Admin Dashboard'] },
      {
        label: 'Deposits & Withdrawals',
        price: { NGN: 600000, USD: 500 },
        requires: ['Wallet & Balance System', 'Payment Processing (Paystack / Stripe)'],
      },
      { label: 'Money Transfers (user to user)', price: { NGN: 600000, USD: 500 }, requires: ['Wallet & Balance System'] },
      { label: 'Investment Plans & ROI Tracking', price: { NGN: 900000, USD: 800 }, requires: ['Wallet & Balance System'] },
      { label: 'Transaction History & Statements', price: { NGN: 300000, USD: 250 }, requires: ['Wallet & Balance System'] },
      { label: 'KYC / Identity Verification', price: { NGN: 450000, USD: 400 }, requires: ['User Registration / Login'] },
      { label: 'Referral & Affiliate Program', price: { NGN: 400000, USD: 350 }, requires: ['User Registration / Login'] },
      { label: 'Crypto Payments', price: { NGN: 600000, USD: 500 } },
    ],
  },
  {
    group: 'Business tools',
    items: [
      { label: 'CRM (leads, clients, pipeline)', price: { NGN: 800000, USD: 700 }, requires: ['User Registration / Login', 'Admin Dashboard'] },
      { label: 'Online Booking / Reservations', price: { NGN: 450000, USD: 400 } },
      { label: 'Inventory / Stock Management', price: { NGN: 500000, USD: 450 }, requires: ['Admin Dashboard'] },
      { label: 'HR & Payroll', price: { NGN: 800000, USD: 700 }, requires: ['Staff Roles & Permissions'] },
      { label: 'Reports & Analytics Dashboard', price: { NGN: 450000, USD: 400 }, requires: ['Admin Dashboard'] },
      { label: 'Live Chat / Support Desk', price: { NGN: 300000, USD: 250 } },
      { label: 'Email Newsletter / Notifications', price: { NGN: 150000, USD: 150 } },
      { label: 'SMS / WhatsApp Notifications', price: { NGN: 300000, USD: 250 } },
    ],
  },
  {
    group: 'AI & automation',
    items: [
      { label: 'AI Chatbot', price: { NGN: 600000, USD: 500 } },
      { label: 'AI Recommendations / Content', price: { NGN: 700000, USD: 600 } },
      { label: 'Workflow Automations', price: { NGN: 450000, USD: 400 } },
    ],
  },
  {
    group: 'Apps & integrations',
    items: [
      { label: 'Mobile App (iOS / Android)', price: { NGN: 3000000, USD: 2500 } },
      { label: 'Third-party API Integrations', price: { NGN: 400000, USD: 350 } },
      { label: 'Real-time Features (live updates, chat)', price: { NGN: 450000, USD: 400 } },
    ],
  },
]

// Other priced answers in the brief.
export const briefPricing = {
  // Features each plan already includes. In the brief they show ticked and
  // locked as "In your plan", and they are covered by the plan price, so the
  // total for a plan with no extras is exactly its rate-card price.
  planFeatures: {
    'Landing Page': [],
    'Business Website': ['Blog / News Section'],
    'Online Store': [
      'Blog / News Section',
      'Payment Processing (Paystack / Stripe)',
      'Admin Dashboard',
      'Inventory / Stock Management',
    ],
    'Web App / AI Build': [
      'User Registration / Login',
      'Admin Dashboard',
      'Staff Roles & Permissions',
      'Third-party API Integrations',
    ],
  },
  branding: {
    full: { label: 'Branding package (logo, colours, fonts)', price: { NGN: 300000, USD: 250 } },
    partial: { label: 'Colour & type system around your logo', price: { NGN: 150000, USD: 120 } },
  },
  editsOnlyRate: 0.5, // "just edits" to an existing site pays half the plan price
  // Monthly, so it is shown beside the one-off total, never added into it.
  maintenance: { label: 'Maintenance retainer', price: { NGN: 100000, USD: 80 } },
}

// Real projects. Screenshots live in /public/projects.
// Products & apps lead; client websites follow.
export const projects = [
  {
    client: 'PadUp Creations',
    tag: 'Business Platform · Live',
    desc: 'Full business platform: a Paystack storefront with geo-pricing, plus four role-based portals for staff, distributors, orders, payroll and compliance.',
    href: 'https://padupcreations.com',
    image: '/projects/padup.jpg',
  },
  {
    client: 'ASH.CO',
    tag: 'E-commerce · Live',
    desc: 'Street-fashion store and admin: product drops, a lookbook, an orders inbox and WhatsApp checkout, with a dark/light theme.',
    href: 'https://ash-co-silk.vercel.app',
    image: '/projects/ashco.jpg',
  },
  {
    n: '01',
    client: 'Maxi Innovation',
    tag: 'SaaS · AI Lead Systems',
    desc: 'AI-powered lead engines that qualify, nurture and book buyers 24/7 for real-estate & construction teams.',
    href: 'https://maxiinovation.vercel.app',
    image: '/projects/maxi.jpg',
  },
  {
    n: '02',
    client: 'HEIS KITS',
    tag: 'E-commerce',
    desc: 'Premium football-kit store with AI virtual try-on, a size advisor and live-score integration.',
    href: 'https://heiskits.com',
    image: '/projects/heiskits.jpg',
  },
  {
    n: '03',
    client: 'SpagKing',
    tag: 'Restaurant',
    desc: "Lokoja's No.1 food brand — a bold menu experience with signature dishes and online ordering.",
    href: 'https://spag-king.vercel.app',
    image: '/projects/spagking.jpg',
  },
  {
    n: '04',
    client: 'B&D Renovations',
    tag: 'Construction',
    desc: 'Renovation-firm site with an instant 3-minute estimate flow, master portfolio and Google reviews.',
    href: 'https://b-d-renovations.vercel.app',
    image: '/projects/bnd.jpg',
  },
  {
    n: '05',
    client: 'ESPEFAWIS',
    tag: 'Agriculture',
    desc: 'Agro supply-chain platform connecting Nigerian farmers to markets, with light/dark mode.',
    href: 'https://www.espefawis.com',
    image: '/projects/espefawis.jpg',
  },
  {
    n: '06',
    client: 'Weezie Stash',
    tag: 'Product Landing',
    desc: 'Presale landing page for an 8-piece street stash kit — countdown, waitlist and bold graffiti brand.',
    href: 'https://weezie-stash.vercel.app',
    image: '/projects/weeziestash.jpg',
  },
  {
    n: '07',
    client: 'CertVerify',
    tag: 'Web App · Blockchain',
    desc: 'Academic-certificate verification — paste a hash and confirm authenticity against the blockchain instantly.',
    href: 'https://certverify-eta.vercel.app',
    image: '/projects/certverify.jpg',
  },
]

// Real businesses shipped for. This is the honest social proof: every name
// here maps to a project in `projects` above or a repo in `githubRepos` below.
export const clients = [
  {
    name: 'PadUp Creations',
    sector: 'Manufacturing',
    delivered: 'Business platform with Paystack payments, plus staff, distributor and payroll portals.',
  },
  {
    name: 'ASH.CO',
    sector: 'Fashion',
    delivered: 'E-commerce storefront, lookbook and an orders admin with WhatsApp checkout.',
  },
  {
    name: 'Maxi Innovation',
    sector: 'Real Estate',
    delivered: 'AI lead engine that qualifies, nurtures and books buyers around the clock.',
  },
  {
    name: 'HEIS KITS',
    sector: 'Sportswear',
    delivered: 'Football-kit store with AI virtual try-on, a size advisor and live scores.',
  },
  {
    name: 'SpagKing',
    sector: 'Restaurant',
    delivered: 'Menu experience and online ordering for Lokoja No.1 food brand.',
  },
  {
    name: 'B&D Renovations',
    sector: 'Construction',
    delivered: 'Instant 3-minute estimate flow, master portfolio and review integration.',
  },
  {
    name: 'ESPEFAWIS',
    sector: 'Agriculture',
    delivered: 'Agro supply-chain platform connecting Nigerian farmers to markets.',
  },
  {
    name: 'EK Construction',
    sector: 'Construction',
    delivered: 'Brand site and identity for a New York building contractor.',
  },
]

// REAL client quotes only. Deliberately empty: the clients section renders the
// roster above without it, and each quote appears automatically once added.
// Never fill this with invented names.
export const testimonials = []

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/enang-wisdom-344636237/' },
  { label: 'GitHub', href: 'https://github.com/weezie001' },
  { label: 'CV / Résumé', href: site.cv },
  { label: 'Email', href: `mailto:${site.email}` },
]

// GitHub repos — shown as code-editor cards in the "on GitHub" section
export const githubRepos = [
  {
    title: 'Maxi Innovation',
    repo: 'https://github.com/weezie001/maxiinovation',
    file: 'index.html',
    lang: 'HTML',
    code: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Maxi Innovation — AI Lead Systems for Real Estate</title>
  <meta name="description"
    content="AI-powered lead systems that qualify, nurture
    and book buyers 24/7." />
  <meta name="theme-color" content="#04061a" />
  <link rel="canonical" href="https://maxiinovation.vercel.app/" />
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Maxi Innovation — AI Lead Systems" />
  <meta property="og:image"
    content="https://maxiinovation.vercel.app/poster.jpg" />
</head>`,
  },
  {
    title: 'SpagKing',
    repo: 'https://github.com/weezie001/Spag-king',
    file: 'README.md',
    lang: 'Markdown',
    code: `# SpagKing — Website

Marketing + online-ordering site for **SpagKing**
("A Different Experience With Food") — Lokoja's No.1 food brand.

## What's here
| File       | Purpose                                        |
| ---------- | ---------------------------------------------- |
| index.html | 3D liquid-glass landing, parallax, specials    |
| menu.html  | Full menu page — every item, real pricing      |
| styles.css | Liquid-glass design system (gold + black)      |
| script.js  | Cart, WhatsApp checkout, 3D tilt, scroll fx    |`,
  },
  {
    title: 'HEIS KITS',
    repo: 'https://github.com/weezie001/He-is--kit',
    file: 'drizzle.config.ts',
    lang: 'TypeScript',
    code: `import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { buildMysqlPoolConfig } from "./server/_core/dbConfig";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle");
}

const { host, port, user, password, database, ssl } =
  buildMysqlPoolConfig(connectionString);

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: { host: host!, port, user, password, database },
});`,
  },
  {
    title: 'EK Construction',
    repo: 'https://github.com/weezie001/EK-CONSTRUCTION-I',
    file: 'ek-construction.html',
    lang: 'CSS',
    code: `<title>E K Construction Design Inc — Building NY's Future</title>
<style>
  :root {
    --gold:        #C5A059;
    --gold-bright: #E9C176;
    --gold-dim:    #8B7B3A;
    --black:       #0C0F0F;
    --surface:     #121414;
    --surface-2:   #1E2020;
    --text:        #E2E2E2;
    --text-dim:    #9A8F80;
    --border:      #4E4639;
  }
</style>`,
  },
]

// 3D clay hand images used by the game (brown hands on white)
export const rpsHands = {
  rock: '/hands/rock.png',
  paper: '/hands/paper.png',
  scissors: '/hands/scissors.png',
}

// --- Rock-Paper-Scissors discount game config (tweak freely) ---
export const gameConfig = {
  maxGames: 10,        // tries to win the discount (saved on the visitor's device)
  maxFunGames: 8,      // extra games "just for fun" once the offer is gone
  winsPerGame: 2,      // best-of-3 → first to 2 throws wins the game
  discountPct: 15,     // reward on a win (drives every "% off" string on the site)
  winChancePct: 10,    // % chance to win the discount, per game
  funWinChancePct: 45, // % chance to win a "just for fun" game
}

// FAQ (EDIT ME). Shown on the site, and handed to search engines and AI
// assistants as structured data and in /llms.txt, so these are the answers
// they quote. Prices, timelines and the discount are read from the config
// above, so a price change here updates every answer automatically.
const planBy = name => rateCard.tiers.find(t => t.name === name)
const bare = price => price.replace(/^from\s+/i, '')
const pricePair = name => `${bare(planBy(name).price.USD)} (${bare(planBy(name).price.NGN)})`
const care = briefPricing.maintenance.price

export const faqs = [
  {
    q: 'How much does a website cost?',
    a: `A landing page starts at ${pricePair('Landing Page')}, a full business website at ${pricePair('Business Website')} and an online store at ${pricePair('Online Store')}. Custom web apps, fintech platforms and AI builds start at ${pricePair('Web App / AI Build')}. The project brief on this site shows an estimate for your exact features.`,
  },
  {
    q: 'How long does it take to build a website?',
    a: `About ${planBy('Landing Page').timeline} for a landing page, ${planBy('Business Website').timeline} for a business website and ${planBy('Online Store').timeline} for an online store. Web apps are scheduled together after a short discovery call.`,
  },
  {
    q: 'Do you build fintech and investment platforms?',
    a: 'Yes. I build wallets and ledgers, deposits and withdrawals with limits and approvals, identity checks (KYC), investment plans with portfolio tracking, and admin panels with audit logs, with Paystack or Stripe payments.',
  },
  {
    q: 'Do you work with clients outside Nigeria?',
    a: 'Yes. I am based in Abuja, Nigeria and work with clients worldwide, with prices in US dollars or naira.',
  },
  {
    q: 'Can you add AI features to my website or app?',
    a: 'Yes. AI chatbots, AI recommendations and content, and workflow automations, built into your site or app and connected to your own data.',
  },
  {
    q: 'Do you offer maintenance after launch?',
    a: `Yes, from $${care.USD} (₦${care.NGN.toLocaleString('en-US')}) a month for updates, backups and small fixes.`,
  },
  {
    q: 'How do I start a project?',
    a: 'Fill the 2-minute project brief on this site. It shows an estimate as you pick your plan and features, and I reply within 24 hours.',
  },
  {
    q: 'Is there a discount?',
    a: `Beat me at rock-paper-scissors on this site and you win ${gameConfig.discountPct}% off your first project.`,
  },
]

// ============================================================
// DIGITAL STORE & TEMPLATES (EDIT ME or manage from /admin)
// ============================================================
export const storeCategories = [
  'All',
  'Brand Kits',
  'Landing Pages',
  'Components',
  'AI Prompts & Agents',
  'Workflows',
  'UI/UX Systems',
  'Freebies',
]

export const storeProducts = [
  {
    id: 10,
    slug: 'weezie-ui-components-bundle',
    title: 'Weezie UI — 30 Production React & Tailwind Blocks',
    category: 'Components',
    tagline: '30 copy-paste React + Tailwind UI components inspired by VibePrompts, Minimal Gallery, Kage, Refero, DESIGN.md & Mobbin.',
    description:
      'The complete 30-component commercial UI system recreated in pure React and Tailwind CSS. Bento grids, dynamic pricing estimators, OTP verification, floating ⌘K palettes, ghost collaborative cursors, luxury typography headlines, device frames, and multi-step flowcharts. Zero external dependency lock-in, accessible, fully responsive, and copy-paste ready.',
    price_ngn: 35000,
    price_usd: 29,
    is_freebie: false,
    badge: 'Featured',
    cover_image: '/og.png',
    preview_url: '/components',
    file_url: '/downloads/weezie-ui-components.zip',
    features: [
      '30 Standalone React + Tailwind CSS component files',
      'VibePrompts, Minimal Gallery, Kage, Refero, DESIGN.md & Mobbin inspired',
      'Interactive live showcase with 1-click source code copy',
      'Commercial royalty-free license for unlimited personal & client projects',
    ],
    downloads_count: 58,
  },
  {
    id: 8,
    slug: 'weezie-brand-delivery-kit',
    title: 'Brand Delivery Kit — Studio OS for Client Identity',
    category: 'Brand Kits',
    tagline: 'The full structure a designer needs to run a brand job: intake, system, tokens, applications, handover.',
    description:
      'A professional brand-delivery system, not a logo dump. Duplicate-per-client folders, discovery and strategy templates, logo/colour/type/motion specs, Figma page map, design tokens (CSS/JSON/Tailwind), stationery and social specs, email signature, license + walkthrough scripts, plus a filled Atelier North sample book you can open in the browser.',
    price_ngn: 18000,
    price_usd: 15,
    is_freebie: false,
    badge: 'New',
    cover_image: '/store/brand-delivery-kit.svg',
    preview_url: '/kits/brand-delivery-kit/index.html',
    file_url: '/downloads/weezie-brand-delivery-kit.zip',
    features: [
      'Starter / Standard / Full CIP scope tiers you can actually sell',
      'Fill-in strategy, identity, guidelines and handover documents',
      'tokens.css, design-tokens.json and Tailwind preset for developers',
      'Live HTML brand book + sample joinery identity (Atelier North)',
    ],
    downloads_count: 0,
  },
  {
    id: 1,
    slug: 'neumorphic-agency-landing-template',
    title: 'Neumorphic Portfolio & Agency Kit',
    category: 'Landing Pages',
    tagline: 'High-converting React 19 + Tailwind v4 landing page with interactive estimate calculator.',
    description:
      'Complete production-ready landing page template built with React 19, Vite, and Tailwind CSS v4. Includes a soft neumorphic design system, pricing calculator modal, scroll-reveal animations, and SEO structured data out of the box.',
    price_ngn: 35000,
    price_usd: 29,
    is_freebie: false,
    badge: 'Bestseller',
    cover_image: '/projects/maxi.jpg',
    preview_url: 'https://weezie.site',
    file_url: '/downloads/neumorphic-agency-kit.zip',
    features: [
      'React 19 + Vite + Tailwind CSS v4 source code',
      'Interactive Project Brief & Quote Calculator component',
      'Built-in JSON-LD SEO & llms.txt generator',
      'Responsive mobile & desktop layouts',
    ],
    downloads_count: 42,
  },
  {
    id: 2,
    slug: 'streetwear-ecommerce-starter',
    title: 'Streetwear Drops & WhatsApp Checkout UI',
    category: 'Landing Pages',
    tagline: 'Drop-style fashion storefront with lookbook, cart drawer, and instant WhatsApp/Paystack checkout.',
    description:
      'Designed for modern fashion and merch brands. Features countdown product drops, lookbook gallery, size advisor modal, dark/light mode toggle, and dual Paystack + WhatsApp order routing.',
    price_ngn: 45000,
    price_usd: 39,
    is_freebie: false,
    badge: 'Popular',
    cover_image: '/projects/ashco.jpg',
    preview_url: 'https://ash-co-silk.vercel.app',
    file_url: '/downloads/streetwear-ecommerce-starter.zip',
    features: [
      'Product drop countdown & lookbook grid',
      'Slide-over cart with WhatsApp & Paystack checkout',
      'Admin orders inbox view',
      'Dark & light theme tokens',
    ],
    downloads_count: 31,
  },
  {
    id: 3,
    slug: 'fintech-glass-ui-components',
    title: 'Fintech & Wallet UI Component Pack (40+ Blocks)',
    category: 'Components',
    tagline: 'Copy-paste React & Tailwind components for wallets, ROI charts, KYC flows, and ledgers.',
    description:
      'Everything you need to assemble a clean fintech dashboard or investment web app in hours instead of weeks. Includes balance cards, multi-currency toggles, transaction tables, KYC upload steps, and role-based sidebar layouts.',
    price_ngn: 25000,
    price_usd: 22,
    is_freebie: false,
    badge: '40+ Components',
    cover_image: '/projects/padup.jpg',
    preview_url: 'https://padupcreations.com',
    file_url: '/downloads/fintech-ui-components.zip',
    features: [
      '40+ responsive React + Tailwind CSS components',
      'Wallet balance cards, transfer modals & ledger tables',
      'Multi-step KYC verification UI flow',
      'Zero external UI library bloat',
    ],
    downloads_count: 27,
  },
  {
    id: 4,
    slug: 'ai-lead-qualifier-agent-pack',
    title: '24/7 AI Sales & Lead Qualifier Agent + Prompts',
    category: 'AI Prompts & Agents',
    tagline: 'System prompts, qualification rubrics, and Worker endpoint to turn visitors into booked calls.',
    description:
      'The exact AI agent architecture used to qualify real-estate, construction, and agency leads around the clock. Includes battle-tested system prompts, objection-handling trees, JSON output schemas, and a Cloudflare Worker script.',
    price_ngn: 30000,
    price_usd: 25,
    is_freebie: false,
    badge: 'AI Agent',
    cover_image: '/projects/heiskits.jpg',
    preview_url: 'https://maxiinovation.vercel.app',
    file_url: '/downloads/ai-lead-qualifier-agent.zip',
    features: [
      'Production system prompts for service & real-estate leads',
      'Structured JSON lead-scoring schema',
      'Ready-to-deploy Cloudflare Workers AI endpoint',
      'Prompt tuning guide for custom niches',
    ],
    downloads_count: 54,
  },
  {
    id: 5,
    slug: 'client-onboarding-crm-workflow',
    title: 'Automated Client Onboarding & Brief-to-CRM Workflow',
    category: 'Workflows',
    tagline: 'End-to-end automation blueprint: intake form → instant quote → CRM pipeline → Brevo email sequence.',
    description:
      'Stop losing leads in your DMs. This workflow pack connects your website intake form directly to a database and triggers personalized confirmation and follow-up emails automatically.',
    price_ngn: 20000,
    price_usd: 18,
    is_freebie: false,
    badge: 'Automation',
    cover_image: '/projects/bnd.jpg',
    preview_url: 'https://weezie.site/intake/',
    file_url: '/downloads/client-onboarding-workflow.zip',
    features: [
      'Webhook & Cloudflare Worker automation scripts',
      '5 high-converting client email templates (HTML + Plain text)',
      'Auto-quote calculation logic',
      'Step-by-step setup guide',
    ],
    downloads_count: 19,
  },
  {
    id: 6,
    slug: 'liquid-gold-nero-design-system',
    title: 'Liquid Glass & Tactile Neumorphism Design System',
    category: 'UI/UX Systems',
    tagline: 'Figma tokens, typography scale, CSS variables, and tactile button/card recipes.',
    description:
      'Two complete signature visual systems in one pack: the Tactile Neumorphic Paper system and the Dark Liquid-Glass Gold system. Includes CSS custom properties, shadow recipes, and interactive button states.',
    price_ngn: 22000,
    price_usd: 19,
    is_freebie: false,
    badge: 'Design System',
    cover_image: '/projects/spagking.jpg',
    preview_url: 'https://spag-king.vercel.app',
    file_url: '/downloads/weezie-design-systems.zip',
    features: [
      'Neumorphic & Liquid-Glass CSS token files',
      'Typography pairings & responsive clamp() scales',
      'Interactive card, badge, and input states',
      'Figma variables & style guide reference',
    ],
    downloads_count: 38,
  },
  {
    id: 7,
    slug: 'free-high-converting-hero-pack',
    title: 'Freebie: 5 High-Converting Hero Sections + AI Prompt Cheat Sheet',
    category: 'Freebies',
    tagline: 'Free starter pack: 5 responsive React + Tailwind hero sections and 15 UI/UX design prompts.',
    description:
      'Grab 5 ready-to-use hero layouts (Video Intro, SaaS Split, Dark Luxury, Product Waitlist, and Agency Bold) plus my personal cheat sheet of 15 prompts for generating sharp landing page copy and layouts.',
    price_ngn: 0,
    price_usd: 0,
    is_freebie: true,
    badge: '100% Free',
    cover_image: '/projects/weeziestash.jpg',
    preview_url: 'https://weezie-stash.vercel.app',
    file_url: '/downloads/weezie-free-hero-pack.zip',
    features: [
      '5 copy-paste React + Tailwind CSS Hero components',
      '15 curated prompts for landing page copy & UI critique',
      ' SEO & OpenGraph head tag checklist',
      'Commercial use allowed on unlimited projects',
    ],
    downloads_count: 164,
  },
]

// ============================================================
// AI LAB CONFIG (Freemium Preview + Paystack Deep-Dive Unlock)
// ============================================================
export const aiLabConfig = {
  unlockPrice: {
    NGN: 5000,
    USD: 5,
    displayNGN: '₦5,000',
    displayUSD: '$5',
  },
  tools: [
    {
      id: 'audit',
      name: 'AI Website Auditor & Roaster',
      badge: 'Free Instant Score + Pro Pack',
      desc: 'Paste your website URL and niche. Get an instant UX, Conversion & SEO score with 3 quick fixes for free — or unlock the full 10-point rewrite & rebuild blueprint.',
    },
    {
      id: 'architect',
      name: 'AI Project & Startup Architect',
      badge: 'Free MVP Spec + Pro PRD',
      desc: 'Describe the website, app, or AI tool you want to build. Get an instant stack & timeline recommendation for free — or unlock the full Technical PRD, Database Schema & Sitemap.',
    },
  ],
}

// ============================================================
// CRM & EMAIL SENDER CONFIG
// ============================================================
export const senderEmails = [
  { address: 'enang@weezie.site', name: 'Enang Weezie', label: 'enang@weezie.site (Personal / Founder)' },
  { address: 'hello@weezie.site', name: 'Enang Weezie Studio', label: 'hello@weezie.site (Studio / Store)' },
]

export const crmEmailTemplates = [
  {
    id: 'brief_reply',
    label: '1. Project Brief Follow-up',
    subject: 'Re: Your project brief on weezie.site — Next steps',
    body: `Hi {{name}},

Thanks for sending over your project brief on weezie.site! I've reviewed your selections and estimate.

I'd love to hop on a quick 15-minute call (or chat on WhatsApp) to lock in the scope so we can get started this week.

What time works best for you tomorrow?

Best,
Enang Weezie
https://weezie.site`,
  },
  {
    id: 'quote_ready',
    label: '2. Custom Proposal & Quote',
    subject: 'Your project proposal & timeline — Enang Weezie',
    body: `Hi {{name}},

Following up on your inquiry — here is the proposed plan to bring your project to life:

• Scope & Deliverables: Custom design, responsive build, and full deployment
• Timeline: Ready to kick off immediately upon 50% deposit
• Next Step: Reply to this email to confirm and I will send over the invoice and kickoff checklist.

Let me know if you have any questions!

Best,
Enang Weezie
https://weezie.site`,
  },
  {
    id: 'broadcast_drop',
    label: '3. New Template / Product Drop (Broadcast)',
    subject: 'New drop on weezie.site: Ship your next project 5x faster ⚡',
    body: `Hi {{name}},

I just dropped a brand-new template and AI workflow pack in the weezie.site store!

Whether you're launching a new product, upgrading your UI, or automating lead capture, you can grab it now (plus check out the new interactive AI Website Auditor & Project Architect on the site):

👉 Explore the Store: https://weezie.site/store

As always, reply directly to this email if you need a custom build.

Cheers,
Enang Weezie
https://weezie.site`,
  },
]

