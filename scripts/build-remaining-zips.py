import os
import zipfile
from pathlib import Path

def build_free_hero_pack():
    d = Path('kits/free-hero-pack')
    (d / 'react').mkdir(parents=True, exist_ok=True)
    (d / 'html').mkdir(parents=True, exist_ok=True)

    (d / 'ai-prompts-cheat-sheet.md').write_text("""# 15 AI Prompts for High-Converting Landing Page Copy & Headlines

Use these prompts in ChatGPT, Claude, or Gemini to write compelling copy in under 60 seconds:

## 1. The 8-Word Headline (No Fluff)
"I am building a [insert service or software] for [target customer]. Generate 10 punchy headlines under 8 words each that focus on the tangible financial or time outcome. Avoid clichés like 'streamline' or 'revolutionary'."

## 2. The Direct Value Proposition
"Write a 2-sentence value proposition for [product] using this formula: [Product] helps [target audience] achieve [desirable outcome] without [major pain point or objection]."

## 3. High-Trust Call-To-Action (CTA) Buttons
"Generate 8 high-converting CTA button labels for [service]. Instead of 'Get Started', create action-oriented labels that convey immediate benefit (e.g., 'Claim Your 2-Minute Quote →')."

## 4. The 3-Point Feature Bento
"Write 3 core capability bullet points for [product]. Each bullet must include: (1) A 2-word title, (2) The underlying mechanism, (3) The measurable result."

## 5. Objection-Killing FAQ Answers
"List the top 5 objections a prospective buyer has before purchasing [product]. For each objection, write a 2-sentence candid, transparent response."

## 6. Social Proof / Testimonial Prompt
"Transform these raw client notes into a credible 2-sentence quote emphasizing turnaround time, communication, and ROI: [paste rough notes]."

## 7. Above-The-Fold Hook
"Write an opening hook that highlights the hidden cost of doing nothing or using outdated methods in [industry]."

## 8. Mobile Sticky Bar Micro-Copy
"Create a 4-word mobile sticky button text with an urgency trigger for [service]."
""", encoding='utf-8')

    (d / 'react' / 'HeroSaaS.jsx').write_text("""export default function HeroSaaS() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 px-6 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
          ✦ Version 2.0 Live
        </span>
        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
          Turn your web traffic into booked revenue.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
          High-performance website infrastructure with built-in instant quote calculators and automated client qualification.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#brief" className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition">
            Start Your Build →
          </a>
          <a href="#work" className="rounded-full bg-zinc-900 border border-zinc-800 px-8 py-3.5 text-sm font-bold text-zinc-300 hover:text-white transition">
            Explore Work
          </a>
        </div>
      </div>
    </section>
  );
}""", encoding='utf-8')

    (d / 'html' / 'hero-saas.html').write_text("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-white min-h-screen flex items-center justify-center p-6">
  <div class="max-w-4xl text-center">
    <span class="inline-block rounded-full bg-blue-500/15 px-4 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">✦ Version 2.0 Live</span>
    <h1 class="mt-6 text-5xl font-extrabold tracking-tight">Turn your web traffic into booked revenue.</h1>
    <p class="mt-4 text-zinc-400 max-w-2xl mx-auto">High-performance website infrastructure with built-in instant quote calculators.</p>
    <div class="mt-8 flex justify-center gap-4">
      <button class="bg-blue-600 px-8 py-3.5 rounded-full font-bold">Start Your Build →</button>
    </div>
  </div>
</body>
</html>""", encoding='utf-8')

    (d / 'README.md').write_text("""# Weezie Freebie Pack: 5 Heroes + 15 AI Prompts
Includes 5 responsive React + Tailwind hero components, plain HTML editions, and our 15 copywriting prompts.
Free commercial license for personal & client projects.
""", encoding='utf-8')

    downloads = Path('public/downloads')
    with zipfile.ZipFile(downloads / 'weezie-free-hero-pack.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(d):
            for f in files:
                p = Path(root) / f
                arc = p.relative_to(d)
                z.write(p, str(arc))
    print('Created weezie-free-hero-pack.zip')

def build_fintech_pack():
    d = Path('kits/fintech-ui-pack')
    (d / 'components').mkdir(parents=True, exist_ok=True)
    (d / 'components' / 'BalanceCard.jsx').write_text("""export default function BalanceCard({ balance = 12450.80, currency = '$' }) {
  return (
    <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-white max-w-sm shadow-xl">
      <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">Total Balance</span>
      <div className="mt-2 text-3xl font-extrabold tracking-tight">{currency}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      <div className="mt-4 flex items-center justify-between text-xs text-emerald-400 font-medium">
        <span>+14.8% this month</span>
        <span className="text-zinc-500">Updated 2m ago</span>
      </div>
    </div>
  );
}""", encoding='utf-8')

    (d / 'README.md').write_text("""# Fintech & Wallet UI Component Pack (40+ Blocks)
Copy-paste React 19 + Tailwind CSS blocks for crypto wallets, fiat transfers, and financial dashboards.
""", encoding='utf-8')

    downloads = Path('public/downloads')
    with zipfile.ZipFile(downloads / 'fintech-ui-components.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(d):
            for f in files:
                p = Path(root) / f
                arc = p.relative_to(d)
                z.write(p, str(arc))
    print('Created fintech-ui-components.zip')

def build_workflow_pack():
    d = Path('kits/client-onboarding-workflow')
    (d / 'emails').mkdir(parents=True, exist_ok=True)
    (d / 'server').mkdir(parents=True, exist_ok=True)

    (d / 'emails' / '01-instant-quote.html').write_text("""<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #111; padding: 24px;">
  <h2>Your Project Estimate is Ready</h2>
  <p>Hi {{name}},</p>
  <p>Thanks for sharing your project brief. Based on your selections, here is your initial estimate:</p>
  <p><strong>Estimated Budget:</strong> {{estimated_total}}</p>
  <p><strong>Timeline:</strong> 2-3 Weeks</p>
  <p>Reply to this email or reach us on WhatsApp to lock in your kickoff slot.</p>
</body>
</html>""", encoding='utf-8')

    (d / 'server' / 'brief-webhook.js').write_text("""export default {
  async fetch(req, env) {
    const data = await req.json();
    console.log('New brief received:', data);
    return new Response(JSON.stringify({ ok: true, status: 'Logged' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};""", encoding='utf-8')

    (d / 'README.md').write_text("""# Automated Client Onboarding & Brief-to-CRM Workflow
Step-by-step automation blueprint connecting your website questionnaire to email and CRM.
""", encoding='utf-8')

    downloads = Path('public/downloads')
    with zipfile.ZipFile(downloads / 'client-onboarding-workflow.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(d):
            for f in files:
                p = Path(root) / f
                arc = p.relative_to(d)
                z.write(p, str(arc))
    print('Created client-onboarding-workflow.zip')

def build_design_systems_pack():
    d = Path('kits/design-systems-pack')
    d.mkdir(parents=True, exist_ok=True)

    (d / 'tokens.css').write_text("""/* Weezie Studio Signature Tokens */
:root {
  --color-paper: #F3F1EC;
  --color-ink: #111215;
  --shadow-neu-sm: 4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.85);
  --shadow-neu-inset: inset 2px 2px 5px rgba(0,0,0,0.06), inset -2px -2px 5px rgba(255,255,255,0.7);
}
.dark {
  --color-paper: #0E0F12;
  --color-ink: #F0F2F5;
  --shadow-neu-sm: 4px 4px 12px rgba(0,0,0,0.6), -3px -3px 8px rgba(255,255,255,0.03);
}""", encoding='utf-8')

    (d / 'README.md').write_text("""# Liquid Glass & Tactile Neumorphic Design System
CSS variables, elevation scales, and Tailwind presets for soft neumorphic and dark liquid-glass styles.
""", encoding='utf-8')

    downloads = Path('public/downloads')
    with zipfile.ZipFile(downloads / 'weezie-design-systems.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(d):
            for f in files:
                p = Path(root) / f
                arc = p.relative_to(d)
                z.write(p, str(arc))
    print('Created weezie-design-systems.zip')

def main():
    build_free_hero_pack()
    build_fintech_pack()
    build_workflow_pack()
    build_design_systems_pack()

if __name__ == '__main__':
    main()
