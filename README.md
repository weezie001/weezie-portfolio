# Enang Weezie — Portfolio

Personal portfolio for **Enang Weezie**, a web designer & product builder based in Abuja, Nigeria.

A neumorphism-styled single page with a full-bleed video intro, an optional
rock-paper-scissors discount game, real client work, and a live "On GitHub" code
showcase — built with Vite, React and Tailwind.

**Live:** _add your Vercel URL after deploying_

## Highlights

- 🎬 **Video hero** — full-bleed intro with a looping typewriter headline
- ✊✋✌️ **Rock-paper-scissors game** — beat me (best of 3, 8 tries) to win **30% off** your first project; the code auto-attaches to the contact form
- 🧑‍🎨 **3D character sections** — About, Partnership and CTA on dark gradient bands
- 💼 **Selected work** — 7 live client sites, with a "straight from the codebase" GitHub section
- 🧩 **Tech-stack chips**, testimonials, and hand-drawn doodle brand marks throughout
- ✉️ **Contact form** wired to Formspree (falls back to a mail-app link)
- ♿ Scroll-reveal animations, fully responsive, and reduced-motion aware

## Tech stack

React 19 · Vite · Tailwind CSS v4 · JetBrains Mono

## Getting started

```bash
npm install
npm run dev      # dev server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Editing content

Almost everything — copy, projects, social links, testimonials and the game
config — lives in [`src/data.js`](src/data.js). Images and videos live in
`public/` (`projects/`, `hands/`, `characters/`, `intro/`, plus `og.png` and the
favicon).

## Deploy

It's a static Vite build. On **Vercel** (or Netlify), import the repo — the
framework is auto-detected (build `npm run build`, output `dist/`).

---

Designed & built by Enang Weezie.
