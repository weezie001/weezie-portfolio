# Beacon section and route library

The template ships a complete marketing site: one landing view with fifteen
sections and seven companion hash routes, filled with a fictional sample
product (Pulsegrid). Header, hero, footer, a 404 and at least one route with
a form (sign-up, trial or contact) always ship. Pick the rest to fit the
story, keep the canonical order, and delete unused sections together with
their CSS and JS. Route slugs and labels are yours to rename (update the
`ROUTES` key and every link together).

All IDs below exist in `template.html`; keep them stable so nav links,
footer links and the router keep working.

## Landing view (`data-view="home"`)

Canonical order:
header, hero, logos, features, product, alerting, tour, setup, numbers,
customers, pricing, security, faq, start (CTA), footer.

Default pick for a typical SaaS: all of them. For a pre-launch waitlist:
header, hero, logos (or drop), features, product, numbers (or drop), faq, start,
footer, plus the sign-up route.

### 1. Header (required) `.site-header`
Sticky. Transparent at the top; once the page scrolls a sentinel observed by
IntersectionObserver adds `.is-stuck` (blurred `--overlay`, hairline, 72px to
60px height). Wordmark with the brand mark, a Product mega menu (6 items with
icon chips + a changelog footer row; hover with intent delay on fine pointers,
click, arrow keys, Esc), 3-4 links with an active indicator (section spy on
home, route match elsewhere), theme toggle, Sign in, Start free. Under 960px
the links collapse into a focus-trapped sheet (Esc, backdrop and link click
close it).

### 2. Hero (required) `#top`
Small and calm, exactly five things in a centered column: a static badge
(`.badge`, "Browser checks now in beta"), the gradient H1 on two lines
(60px / 500 on desktop, 40px on phones, three lines there), an 18px
one-sentence subtitle, and two 46px buttons ("Start monitoring free" primary,
"See it in action" outline, which scrolls to `#product`). Behind it one
beam (`.hero-beam`). Padding 104px above and 96px below, so the H1 starts
about 227px from the top and the logo row is visible in the first screen at
1440x900. No product UI, stats, chips or floating cards in the hero.
Everything animates in within ~0.9s.

### 3. Logos `.logos`
One line of plain copy ("On call for 2,400 engineering teams…") over six
fictional wordmarks, each with a simple abstract SVG mark and a different
type treatment (caps, italic, light, mono). Rendered from `LOGOS`.

### 4. Features `#features`
Left-aligned H2 + lede, then a 6-column bento: one wide cell (4) with an
animated explanation (region-by-region check results resolving into a
verdict, replayable), one dark cell (2) with a cron/heartbeat terminal list,
then three cells (2 each): certificate countdown, mini status page with
uptime bars, alert channels with an escalation chain. Mobile: 2 columns at
tablet, 1 column on phones.

### 4b. Product `#product`
"See the product, not a promise": centered H2 + lede, then the live console
(`.product-stage`, max 1024px, inside the 8px `.window-frame`): sidebar,
breadcrumb, KPI tiles, response-time chart with a working 1h / 24h / 7d range
switch and hover tooltip, active incident card, on-call card, monitors table
with 24h status bars, and a floating alert toast. The chart is drawn on load
and replays its draw the first time the console scrolls into view; the toast
slides in 0.9s later; the checks counter only ticks while the console is on
screen. Phones drop the sidebar, the search and the toast.

### 5. Alerting `#alerting`
Editorial split: square photograph (night, phone glowing blue on a bedside
table) with a frosted stat card in its dark corner, beside an H2, lede and
three icon rows. The one mood image on the page; it supports the
"only wake someone when it matters" claim.

### 6. Tour `#tour`
Centered H2 + lede, segmented tabs, and the product window again with three
panels: incident timeline (with responders and details), on-call calendar
(rotations, override, upcoming handoff, time off, load), public status page
(90-day bars). Three caption columns below. The section sits on a soft
`--bg-sunk` band that fades in and out.

### 7. Setup `#setup`
Two columns: H2, lede and three step buttons (they are tabs) on the left; a
dark code window on the right whose file name, code and result line change
with the step. Copy button with a "Copied" state (clipboard when allowed,
selection fallback in sandboxed frames).

### 8. Numbers `.numbers`
Full-width band between hairlines, four stats separated by vertical
hairlines, large Geist numerals with a muted unit. Count up once when
visible. Use organic, attributable figures.

### 9. Customers `#customers`
H2, then a featured story card (environmental portrait left, quote,
attribution and three result metrics right), then a masonry of testimonial
cards with portraits rendered from `QUOTES`. Six show on desktop (three on
phones); "Show all stories" reveals the rest and turns into "Show fewer".
With three or fewer quotes the fade and button are removed automatically;
otherwise use 7-9 so the button reveals something on desktop.

### 10. Pricing `#pricing`
Centered H2 + lede with a monthly/yearly switch ("2 months free"). Two to
four plans (three in the sample; set `.plans` to `repeat(n, minmax(0, 1fr))`
and give each `?plan=` slug a `PLANS` entry); the featured one is raised with
a beam highlight on its top edge. The comparison table takes one `<th>` per
plan and one value per plan in each `COMPARE` row.
Prices swap with a short blur-in; notes change to the yearly total; plan CTAs
carry `?plan=` and `&billing=yearly` into the sign-up route. Enterprise strip
below, then a "Compare all features" disclosure revealing a grouped table
(`COMPARE` data, sticky first column, horizontal scroll on small screens).

### 11. Security `#security`
Short H2 + lede left, 2x2 icon grid with hairline dividers right.

### 12. FAQ `#faq`
Two columns: sticky aside with H2 and a "Talk to sales" help card; accordion
on the right (grid-rows height animation, plus icon rotates to a cross).
Product questions only.

### 13. CTA `#start`
Card with the beam leaking from two corners, gradient H2, lede, inline email
form with validation, loading and an inline success message, and three
reassurance items.

### 14. Footer (required) `.site-footer`
Brand, mission line and a live "All systems operational" pill to the status
route; Product / Company / Legal columns; newsletter form; legal row; social
marks as SVG pointing at real routes (changelog feed, contact, status).

## Companion routes (hash router)

The router reads `#/route?query`, shows one `[data-view]`, sets the document
title, scrolls to top and moves focus to the route's H1. Plain `#anchor`
links scroll smoothly on home and return to home from any route. Navigation
is state-first (`go(hash)`), so it works even where the frame refuses URL
changes. Every route has exactly one H1 and a "Back to home" link.

| Route | View | Contents |
| --- | --- | --- |
| `#/signup`, `#/signin` | `auth` | Segmented Create account / Sign in; plan chip from `?plan=&billing=`; name, work email, password with show/hide and strength meter, terms checkbox; SSO and forgot-password flows; loading then "Check your inbox" success. Aside with three benefits and one testimonial. |
| `#/contact` | `contact` | "Talk to sales": three next steps, team photograph, two office addresses; form (name, email, company, team size, monitors, message) with validation and a personal success state. |
| `#/changelog` | `changelog` | Subscribe form, filter chips with counts (All / New / Improved / Fixed), search with an empty state and "Clear filters", entries from `CHANGELOG` with date, version, tag, body, bullet list and an optional flow vignette. |
| `#/status` | `status` | The company's own status page: banner, components from `STATUS` with 90-day bars and hover tooltips naming each incident, past incidents. |
| `#/privacy`, `#/terms` | `legal` | One template, two documents from `LEGAL`; sticky table of contents with smooth in-page scroll. |
| anything else | `404` | "This page is not being monitored", links home and to status. |

When the output is a framework project, turn these into real routes
(`/signup`, `/contact`, …) and keep the same layouts.
