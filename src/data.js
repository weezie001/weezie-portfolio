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
  // Client intake form — visitors click this to send full project details
  intakeForm: 'https://cl-intake-form.netlify.app/',
  // Contact form endpoint (Formspree) — submissions land in enangweezie@gmail.com.
  formEndpoint: 'https://formspree.io/f/xlgqezad',

  location: 'Abuja, Nigeria — working worldwide',
  roles: ['Web Designer', 'UI/UX Designer', 'Product Builder'],
  heroBlurb:
    'A designer & product builder passionate about crafting bold, memorable websites and interfaces.',
  aboutBlurb:
    "With years of hands-on experience, I specialise in web design, UI/UX and brand identity. I love partnering with businesses that want to stand out and showcase their very best side. Let's build something people remember.",
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

// Real projects. Screenshots live in /public/projects.
// Set `href` to each live URL when ready (EDIT ME).
export const projects = [
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

// EDIT ME: swap for real client quotes when you have them.
export const testimonials = [
  {
    quote: 'Weezie brought our concept to life in a way we never thought possible. The design was detailed and stylish, and it helped us convert far more visitors.',
    name: 'Michael T.',
    role: 'Protosphere Innovations',
  },
  {
    quote: 'Fast, communicative and wildly creative. Our brand finally feels like it stands out. I would recommend Weezie to anyone serious about growth.',
    name: 'Sarah K.',
    role: 'Westech Visuals',
  },
  {
    quote: 'The prototype Weezie created was perfect for pitching to investors. Precise, polished and delivered ahead of schedule.',
    name: 'James E.',
    role: 'Innovertero Design',
  },
  {
    quote: 'A dynamic edge to our whole brand. Attention to detail on every screen, and always a step ahead of the brief. Seriously impressive.',
    name: 'Megan S.',
    role: 'Boldedge Marketing',
  },
  {
    quote: 'We came with a rough idea and left with a product that looked like a funded startup. Weezie just gets it — fast, clean and on-brand.',
    name: 'David R.',
    role: 'Apex Interactive',
  },
  {
    quote: 'Easily the smoothest project I have run this year. Clear updates, zero drama, and a site our customers actually compliment.',
    name: 'Aisha B.',
    role: 'Northlane Studio',
  },
]

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
  maxGames: 10,        // tries to win the 30% discount (saved on the visitor's device)
  maxFunGames: 8,      // extra games "just for fun" once the offer is gone
  winsPerGame: 2,      // best-of-3 → first to 2 throws wins the game
  discountPct: 30,     // reward on a win
  winChancePct: 10,    // % chance to win the discount, per game
  funWinChancePct: 45, // % chance to win a "just for fun" game
}
