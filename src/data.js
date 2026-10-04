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
  email: 'enangweezie@gmail.com',
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
  currencies: ['NGN', 'USD'],
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

// PROJECT BRIEF ADD-ONS (EDIT ME)
// Every feature a visitor can tick in the project brief, with its price.
//
//   Brief total = plan price for the website type they pick
//               + every add-on they tick (plus anything those depend on)
//
//   includedFrom: the cheapest plan that already covers it. On that plan and
//                 every plan above it, the feature adds nothing.
//   requires:     features it cannot work without. They are counted
//                 automatically, so a wallet can never be priced without the
//                 accounts and admin panel it needs to function.
export const briefFeatureGroups = [
  {
    group: 'Content & pages',
    items: [
      { label: 'Blog / News Section', price: { NGN: 150000, USD: 150 }, includedFrom: 'Business Website' },
      { label: 'Gallery / Portfolio Showcase', price: { NGN: 100000, USD: 100 }, includedFrom: 'Business Website' },
      { label: 'Multi-language', price: { NGN: 250000, USD: 250 } },
    ],
  },
  {
    group: 'Accounts & admin',
    items: [
      { label: 'User Registration / Login', price: { NGN: 300000, USD: 300 }, includedFrom: 'Web App / AI Build' },
      { label: 'User Dashboard / Profiles', price: { NGN: 400000, USD: 350 }, requires: ['User Registration / Login'] },
      { label: 'Admin Dashboard', price: { NGN: 450000, USD: 400 }, includedFrom: 'Online Store' },
      {
        label: 'Staff Roles & Permissions',
        price: { NGN: 350000, USD: 300 },
        includedFrom: 'Web App / AI Build',
        requires: ['User Registration / Login', 'Admin Dashboard'],
      },
    ],
  },
  {
    group: 'Payments & commerce',
    items: [
      { label: 'Payment Processing (Paystack / Stripe)', price: { NGN: 350000, USD: 300 }, includedFrom: 'Online Store' },
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
      { label: 'Inventory / Stock Management', price: { NGN: 500000, USD: 450 }, includedFrom: 'Online Store', requires: ['Admin Dashboard'] },
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
      { label: 'Third-party API Integrations', price: { NGN: 400000, USD: 350 }, includedFrom: 'Web App / AI Build' },
      { label: 'Real-time Features (live updates, chat)', price: { NGN: 450000, USD: 400 } },
    ],
  },
]

// Other priced answers in the brief.
export const briefPricing = {
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
