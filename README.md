# Enang Weezie — Portfolio

Personal portfolio for **Enang Weezie**, a web designer & product builder based in Abuja, Nigeria.

A neumorphism-styled single page with a full-bleed video intro, an optional
rock-paper-scissors discount game, real client work, and a live "On GitHub" code
showcase — built with Vite, React and Tailwind.

**Live:** [https://weezie.site](https://weezie.site)

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

The Vite dev server is for frontend work and does not run Cloudflare Pages
Functions, so admin login and `/api/*` features are unavailable there. To test
the admin locally with its real API, copy `.dev.vars.example` to `.dev.vars`,
set a private local `ADMIN_PASSWORD`, then run:

```bash
npm run dev:pages # build and run Pages + Functions → http://localhost:8788
```

This uses Wrangler's local D1 database; it does not connect to the production
database. AI features still use the configured Cloudflare AI binding and may
incur usage. For access from another device on your network, open
`http://<computer-ip>:8788/admin/`.

## Incoming email and CRM notifications

Website inquiries are saved in the CRM and send a read-only Gmail notification
with an **Open CRM Inbox** button. To deliver mail sent directly to
`enang@weezie.site` and `hello@weezie.site` into the CRM as well, deploy the
Cloudflare Email Worker and route those addresses to it:

1. Generate one strong random token and set the same `INBOUND_EMAIL_TOKEN`
   secret on the Pages project and the `weezie-inbound-email` Worker.
2. Deploy the Worker with `npx wrangler deploy --config wrangler.email.toml`.
3. In Cloudflare Email Routing, route both addresses to the
   `weezie-inbound-email` Worker instead of directly forwarding the original
   email to Gmail. The Worker stores the message in the CRM and the Pages
   function sends Gmail a short read-only notification with a link button.
4. Keep the Pages project's `BREVO_API_KEY` and `MAIN_ALERT_EMAIL` production
   secrets configured. Brevo must allow sending from `hello@weezie.site`.

The CRM keeps the received message; the Gmail alert is only a preview and
should not be used to reply. If the alert cannot be sent, Cloudflare logs the
failure while the message remains saved in the CRM.

## Personalized CRM outreach drafts

In the CRM's CSV / Bulk Prospect Importer, upload or paste a CSV with an email
column and optional name, business, website and niche columns. Header names
such as `contact`, `company`, `url` and `industry` are also recognized. Headerless
rows can use `Name, email, Business, Website, Niche`; quoted fields and commas
inside quotes are supported. Imports are limited to 500 prospects per request.

After importing, open the prospect tracker and choose **Draft Personalized
Emails**. Drafts are generated in small batches, saved to each pending prospect
for review, and are never sent automatically. Open **Review personalized
draft** on a prospect to inspect its subject and message; sending that prospect
uses its saved draft. Cloudflare AI personalizes drafts when configured, with
contextual templates as a fallback.

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
