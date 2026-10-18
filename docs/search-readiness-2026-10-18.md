# Search and AI discovery audit: 18 October 2026

Production deployment: https://b702d62b.weezie-site.pages.dev
Canonical website: https://weezie.site/
Method: direct HTTP requests, HTML/XML parsing and source inspection. No Chrome used for this audit.

## Verified on production

- Sitemap at https://weezie.site/sitemap.xml returns 200 and lists 15 public URLs: home, store, AI Lab, components, privacy, About, work index and eight case studies.
- All 15 sitemap URLs return 200, have unique titles, descriptions and canonical URLs matching the final response URL. None has a noindex directive.
- Robots.txt advertises the sitemap and permits those pages for Googlebot, OAI-SearchBot, Claude-SearchBot and PerplexityBot.
- Sample requests using those user-agent names receive 200 without a challenge. These are simulations from our network, not evidence that verified crawler IPs have visited.
- Structured JSON parses on the 14 marketing/product/editorial pages. Privacy does not require structured data. Parsing is not a rich-result eligibility certification.
- Site identity metadata includes LinkedIn and GitHub. Public business email is enang@weezie.site; alternate email is enangweezie@gmail.com.
- Admin, CRM, dashboard and intake pages return noindex. They intentionally do not belong in the public sitemap.
- HTTP redirects to HTTPS. The www host serves content with the apex canonical; a permanent www-to-apex redirect remains optional consolidation work.

## Fixed and deployed

- AI Lab and Components now have their own no-JavaScript descriptions, headings and WebPage structured data instead of the homepage fallback and homepage FAQ schema.
- Privacy sitemap URL and canonical now use /privacy, matching Cloudflare's extensionless redirect.
- Missing URLs now return a branded 404 instead of the homepage with status 200.
- Homepage fallback links now expose store, AI Lab and components. llms.txt now links to About, work and each case study.
- Repaired the editorial development middleware's outdated renderer reference.

## Still unverified or outside technical eligibility

- Search Console previously confirmed the homepage was indexed. Current indexing, last crawl, selected canonical and sitemap submission/last-read status for all pages still require Search Console data. No submission or indexing request was made during this audit.
- No evidence yet confirms citation in Google AI Overviews, ChatGPT search or other AI answers. Allowing crawlers and publishing a sitemap do not guarantee inclusion.
- Most routes are React pages with noscript text fallbacks, not fully server-rendered React. Full prerendering/SSR is a useful next improvement for consistent text extraction across crawlers. The build also warns about a large JavaScript bundle.
- Continue publishing factual project evidence and useful service explanations. Earn relevant independent references and keep the same business name, website and profile links across public profiles. Avoid fabricated testimonials or guaranteed AI-ranking promises.
- The LinkedIn website form was submitted before browser use was stopped; its saved result was not independently verified. GitHub profile update was verified in the earlier UI session.

## Next Search Console checks

1. Confirm sitemap.xml is submitted successfully and note its last-read date.
2. Review indexed/not-indexed totals and reasons in Page indexing.
3. Inspect the 15 sitemap URLs for Google-selected canonical, last crawl and indexing status. Request indexing for updated priority pages if needed.
4. Track branded queries (weezie.site, Enang Weezie, Enang Wisdom) and relevant service queries over time. AI Overview placement is not a separate technical switch.

References: https://developers.google.com/search/docs/appearance/ai-features and https://developers.cloudflare.com/pages/configuration/serving-pages/
Raw page evidence: search-audit-2026-10-18.json. Repeat with python scripts/audit-search.py.
