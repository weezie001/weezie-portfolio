import { json, corsHeaders, ensureDb } from './_utils.js'

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

function buildFallbackAudit(url, niche) {
  const cleanUrl = url.replace(/^https?:\/\//i, '').replace(/\/$/, '') || 'your-website.com'
  const preview = {
    overallScore: 68,
    scores: {
      uxDesign: 72,
      conversion: 61,
      speedSeo: 71,
    },
    verdict: `${cleanUrl} has a solid foundation for ${niche || 'its market'}, but visitors lack an immediate interactive hook and friction-free conversion path above the fold.`,
    quickWins: [
      'Replace generic hero sub-copy with a sharp outcome-driven value proposition + instant social proof.',
      'Add an interactive price/ROI estimator or micro-calculator so leads self-qualify before leaving.',
      'Tighten mobile tap targets, contrast hierarchy, and add structured JSON-LD schema for AI search engines.',
    ],
    recommendedPlan: 'Business Website',
  }

  const fullReportMd = `# Full 10-Point UX, Conversion & SEO Rebuild Blueprint for ${cleanUrl}

## 1. Executive Summary & Conversion Diagnosis
- **Target Niche:** ${niche || 'Modern Digital Business'}
- **Overall Score:** 68 / 100
- **Primary Bottleneck:** High bounce risk between the hero section and the final call-to-action due to passive copy and static contact forms.

## 2. Rewritten High-Converting Hero Copy
- **Eyebrow:** \`// TRUSTED BY TOP CLIENTS IN ${(niche || 'YOUR INDUSTRY').toUpperCase()}\`
- **Headline:** Stop losing ready-to-buy customers to a slow, forgettable website.
- **Sub-headline:** We help ${niche || 'ambitious brands'} convert visitors into booked revenue with fast, custom-engineered digital experiences.
- **Primary CTA:** Start Your 2-Minute Instant Quote →
- **Secondary CTA:** See Live Client Results

## 3. 10-Point Action Plan (Ranked by Revenue Impact)
1. **Above-the-Fold Hook:** Add a 10-second looping product/service preview or interactive calculator right below the hero.
2. **Trust Architecture:** Pair every service claim with a named client deliverable and measurable outcome.
3. **Interactive Lead Capture:** Swap plain "Contact Us" forms for a step-by-step interactive brief that calculates an instant ball-park quote.
4. **Speed & Core Web Vitals:** Preload display fonts, convert hero images to AVIF/WebP, and lazy-load below-the-fold media.
5. **AI Search Readiness (\`llms.txt\` + JSON-LD):** Add \`ProfessionalService\` and \`FAQPage\` schema so ChatGPT, Claude, and Perplexity recommend ${cleanUrl}.
6. **Mobile Thumb-Zone Navigation:** Anchor a sticky "Get Instant Estimate" CTA bar on mobile screens.
7. **Objection-Killer FAQ:** Answer pricing, timeline, and process questions transparently before the contact section.
8. **WhatsApp & Paystack Fast-Track:** Give high-intent buyers a 1-click payment or direct WhatsApp kickoff option.
9. **Automated Follow-Up Sequence:** Connect form submissions to an instant Brevo email confirmation with a portfolio PDF.
10. **Visual Contrast & Tactile Depth:** Upgrade flat cards to a cohesive design system with clear active/hover states.

## 4. Recommended Weezie Build Package
- **Suggested Tier:** **Business Website ($900 / ₦1,000,000)** — *Your $5 / ₦5,000 audit unlock is 100% credited when you book your rebuild with Enang Weezie.*`

  return { preview, fullReportMd }
}

function buildFallbackArchitect(idea, audience) {
  const shortIdea = idea.slice(0, 90)
  const isComplex = /wallet|fintech|ai|saas|dashboard|portal|marketplace|crypto|booking/i.test(idea)
  const isStore = /shop|store|ecommerce|fashion|drop|cart|product/i.test(idea)
  const recommendedPlan = isComplex ? 'Web App / AI Build' : isStore ? 'Online Store' : 'Business Website'

  const preview = {
    projectName: audience ? `${audience} Platform` : 'Custom Product Build',
    recommendedPlan,
    estimatedTimeline: isComplex ? '4 to 6 weeks' : isStore ? '3 to 4 weeks' : '2 to 3 weeks',
    recommendedStack: ['React 19 + Tailwind CSS v4', 'Cloudflare Workers + D1 SQL', 'Paystack / Stripe Checkout', 'Brevo Automated Emails'],
    coreModules: [
      'High-converting public landing page & interactive onboarding flow',
      isComplex
        ? 'Role-based user & admin dashboard with live wallet/data ledger'
        : 'Custom catalogue/service showcase with instant checkout & admin inbox',
      'Automated transactional emails, analytics events & SEO schema',
    ],
    summary: `To ship "${shortIdea}" cleanly, focus V1 on a fast React + Cloudflare edge architecture with Paystack monetization and an admin control center built in from day one.`,
  }

  const fullReportMd = `# Complete Technical PRD, Database Schema & MVP Roadmap

## 1. Product Vision & Scope
- **Concept:** ${idea}
- **Target Users:** ${audience || 'Customers & Admin Operators'}
- **Recommended Weezie Tier:** **${recommendedPlan}**
- **Target Launch Timeline:** ${preview.estimatedTimeline}

## 2. System Architecture
- **Frontend:** React 19, Vite, Tailwind CSS v4 (Responsive Desktop + Mobile Web App)
- **Backend API:** Serverless Edge Functions (\`/api/*\`) with JWT/Session Auth
- **Database:** Relational SQL (Cloudflare D1 / PostgreSQL)
- **Payments & Billing:** Paystack (NGN + USD) with server-side webhook verification
- **Notifications:** Brevo Transactional Email API + WhatsApp deep-links

## 3. Core Database Schema (SQL Blueprint)
\`\`\`sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer', -- 'customer' | 'staff' | 'admin'
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  reference TEXT UNIQUE NOT NULL,
  currency TEXT DEFAULT 'NGN',
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  metadata_json TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);
\`\`\`

## 4. Key API Endpoints
- \`POST /api/auth/session\` — User registration, login & magic-link verification
- \`GET /api/dashboard/overview\` — Aggregated metrics, recent activity & status
- \`POST /api/payments/initialize\` & \`POST /api/payments/verify\` — Paystack checkout & webhook handler
- \`POST /api/admin/actions\` — Role-protected management & export endpoints

## 5. Week-by-Week Execution Roadmap
- **Week 1:** UI/UX Wireframes, Design System Tokens & Core Database Schema
- **Week 2:** Public Marketing Pages + User Authentication & Core Workflows
- **Week 3:** Paystack Payment Integration, Admin Portal & Automated Emails
- **Week 4:** Speed Pass, QA Testing, Custom Domain DNS & Production Launch`

  return { preview, fullReportMd }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const tool = String(body.tool || 'audit').trim() // 'audit' | 'architect'
    const inputPrimary = String(body.input || '').trim()
    const inputSecondary = String(body.context || '').trim()

    if (!inputPrimary) {
      return json({ ok: false, error: 'Please provide a URL or project description first.' }, 400)
    }

    let result =
      tool === 'architect'
        ? buildFallbackArchitect(inputPrimary, inputSecondary)
        : buildFallbackAudit(inputPrimary, inputSecondary)

    // If Cloudflare Workers AI binding is available, enhance the analysis with Llama 3.3
    if (env?.AI) {
      try {
        const prompt =
          tool === 'architect'
            ? `You are Enang Weezie's AI Project Architect on weezie.site. A client wants to build: "${inputPrimary}" for "${inputSecondary || 'general users'}".
Respond ONLY with valid JSON matching this exact structure:
{
  "preview": {
    "projectName": "short catchy name",
    "recommendedPlan": "Landing Page" | "Business Website" | "Online Store" | "Web App / AI Build",
    "estimatedTimeline": "e.g. 3 to 4 weeks",
    "recommendedStack": ["tech 1", "tech 2", "tech 3", "tech 4"],
    "coreModules": ["module 1", "module 2", "module 3"],
    "summary": "2 sentence executive architecture summary"
  },
  "fullReportMd": "Detailed Markdown PRD including 1. Product Vision, 2. System Architecture, 3. SQL Database Schema, 4. API Endpoints, and 5. Week-by-week launch roadmap."
}`
            : `You are Enang Weezie's AI Website Auditor & Roaster on weezie.site. Audit this website/brand: "${inputPrimary}" in niche "${inputSecondary || 'digital business'}".
Respond ONLY with valid JSON matching this exact structure:
{
  "preview": {
    "overallScore": 71,
    "scores": { "uxDesign": 74, "conversion": 65, "speedSeo": 74 },
    "verdict": "2 sentence sharp, honest critique of what is holding their conversions back",
    "quickWins": ["specific fix 1", "specific fix 2", "specific fix 3"],
    "recommendedPlan": "Landing Page" | "Business Website" | "Online Store" | "Web App / AI Build"
  },
  "fullReportMd": "Detailed Markdown 10-Point UX, Conversion & SEO Rebuild Blueprint including Rewritten Hero Copy, 10 ranked fixes, and SEO/Schema recommendations."
}`

        const aiRes = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [
            { role: 'system', content: 'Return raw valid JSON only without markdown code fences.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1400,
        })

        const rawText = String(aiRes?.response || '').trim()
        const jsonMatch = rawText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed?.preview && parsed?.fullReportMd) {
            result = parsed
          }
        }
      } catch {
        // Fallback already prepared in `result`
      }
    }

    const db = await ensureDb(env)
    let runId = Date.now()
    if (db) {
      const ins = await db
        .prepare(
          `INSERT INTO ai_runs (tool, input_text, preview_json, full_report_md, unlocked)
           VALUES (?, ?, ?, ?, 0)`,
        )
        .bind(tool, `${inputPrimary} | ${inputSecondary}`, JSON.stringify(result.preview), result.fullReportMd)
        .run()
      runId = ins?.meta?.last_row_id || runId
    }

    return json({
      ok: true,
      runId,
      tool,
      preview: result.preview,
      // Also return fullReportMd to client only after unlock, or keep a preview teaser
      teaserMd: result.fullReportMd.slice(0, 340) + '\n\n🔒 [Unlock the full Deep-Dive Blueprint & Copy Deck below…]',
      fullReportCache: result.fullReportMd,
    })
  } catch (err) {
    return json({ ok: false, error: err.message || 'AI error' }, 500)
  }
}
