# Email open tracking audit / 19 October 2026

## Finding

The current tracker does not provide human-only open counts. An automated request to the custom email pixel can mark a prospect as Opened and increment the same counters used by the CRM's Initial Read / Follow-up Read displays.

This confirms the counting flaw. It does not establish which historical production requests came from bots: the live database has aggregate counters and first/last-open timestamps, without an event-level request log or a human/bot classification.

## Verification

Reviewed the tracking code in `functions/api/track.js`, the pixel inserted by `src/lib/brandedEmail.js`, send paths in the admin and cron functions, and read/open displays in `src/components/AdminCRM.jsx`. Tracking source files have no local changes relative to HEAD; no tracking logic was edited or deployed during this audit.

Executed the actual GET and POST handlers and their SQL against a real SQLite database held entirely in memory, using a D1-compatible adapter. Network requests were disabled. The only test recipient was `audit@example.invalid`. Test harness and structured results are under `.tmp/email-open-audit/`.

| Test | Result |
| --- | --- |
| Pixel request with `SecurityScannerBot/1.0` user agent | Sent became Opened; initial counter increased from 0 to 1 |
| Pixel request with explicit prefetch headers | Sent became Opened; initial counter increased from 0 to 1 |
| Same bot pixel request twice | Initial counter increased to 2 |
| Bot request for follow-up pixel | Follow-up Sent became Follow-up Opened; follow-up counter increased to 1 |
| Click webhook with scanner user agent | Marked Opened; initial counter increased to 1 |
| Identical opened webhook delivered twice | Initial counter increased to 2 |
| Separate `proxy_open` webhook | Ignored by the current event allowlist |

The last case matters: the POST handler does ignore the separate proxy-open event type. That does not protect the custom GET pixel, which counts automatic image requests independently.

Handler SHA-256: `2f0cbab0d218b230be0147284f94239dc725e487db33c68169bc880c3cf5f807`.

## Live records checked

Read-only D1 schema and SELECT queries confirmed:

- 298 prospects.
- 76 prospects with at least one initial open; 86 total initial-open events.
- 21 prospects with at least one follow-up open; 28 total follow-up-open events.
- No dedicated tracking-event table, bot classification, request user-agent/IP log or webhook-event deduplication record in the application database.

Initial and follow-up prospect groups can overlap; do not add them as distinct people. These totals are recorded events, not verified human reads. The queries wrote zero application rows. No live tracking URL, send endpoint or outbound email was triggered. Provider-side historical logs and account filtering settings were not inspected.

## Interpretation and follow-on work

The code confirms that bot and prefetch image loads are counted today. The available production records cannot prove how many of the historical opens were bots, so they should not be relabeled retrospectively as confirmed humans or confirmed bots.

A correction should separate raw image loads, suspected automation/proxy activity and estimated human engagement; exclude known automation from human-open totals; deduplicate events; preserve provider message IDs and classification evidence; and use stronger engagement signals for follow-up decisions. The webhook must be handled separately from the custom pixel. A pixel fetch alone cannot guarantee a person opened or read the message, and a browser-like user agent alone is not proof of a human.

No fix has been implemented: the user requested verification and a report.

## Primary documentation checked

- [Brevo: Apple Mail Privacy Protection and bot activity](https://help.brevo.com/hc/en-us/articles/4406537065618-About-Apple-Mail-Privacy-Protection-MPP-and-bot-activity-in-Brevo): security scanning and privacy preloads can inflate opens; Brevo provides report filters for these categories. Its account settings were not verified here.
- [Brevo: Transactional webhooks](https://developers.brevo.com/docs/transactional-webhooks): separate opened, click and proxy-open event schemas, including user-agent and message identifiers where provided.
