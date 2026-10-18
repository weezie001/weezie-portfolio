# Weezie Brand Delivery Kit

A studio operating system for designing and handing over a brand.

This is not a logo folder. It is the full kit a professional designer needs so every client job has the same structure, the same files, and a clean handover.

Use it in two ways:

1. **Your practice** — duplicate this kit for every brand job. Fill the templates. Drop finals into the asset folders. Zip `09-handover` for the client.
2. **A product** — sell this structure to other designers, or sell a filled kit as an add-on next to a website.

---

## What a real brand kit is

A client can only *use* a brand if you give them three layers:

| Layer | What it is | If you skip it |
|---|---|---|
| **Strategy** | Who it is for, what it says, how it sounds | Pretty logo, random copy |
| **Identity system** | Logo, colour, type, space, image, icon, motion | One lockup that breaks on a story |
| **Applications** | Files they actually open: cards, social, email, slides, web tokens | A PDF they never open again |

The folders in this kit map to those layers.

---

## Kit map

```
brand-delivery-kit/
├── README.md                          ← you are here
├── START-A-JOB.md                     ← duplicate + rename for a client
├── index.html                         ← open this: kit dashboard + brand book
│
├── 00-studio/                         ← how YOU work (do not send to client)
│   ├── SCOPE-TIERS.md                 what you sell at each price
│   ├── NAMING-CONVENTION.md
│   ├── FIGMA-FILE-STRUCTURE.md
│   ├── TOOLSET.md                     software + export presets
│   └── APPROVAL-CHECKLIST.md
│
├── 01-intake/                         ← discovery before you draw
│   ├── PROJECT-BRIEF.md
│   ├── DISCOVERY-QUESTIONNAIRE.md
│   └── COMPETITIVE-AUDIT.md
│
├── 02-strategy/                       ← words before pixels
│   ├── BRAND-PLATFORM.md
│   ├── MESSAGING-FRAMEWORK.md
│   └── VOICE-AND-TONE.md
│
├── 03-identity/                       ← the system
│   ├── LOGO-SYSTEM.md
│   ├── COLOR-SYSTEM.md
│   ├── TYPOGRAPHY.md
│   ├── IMAGERY-ICONOGRAPHY.md
│   ├── LAYOUT-GRID.md
│   └── MOTION.md
│
├── 04-guidelines/
│   └── BRAND-GUIDELINES.md            ← client-facing bible
│
├── 05-tokens/                         ← design-to-code handoff
│   ├── design-tokens.json
│   ├── tokens.css
│   └── tailwind.preset.js
│
├── 06-assets/                         ← drop finished files here
│   ├── logos/
│   ├── colours/
│   ├── type/
│   ├── icons/
│   ├── photography/
│   ├── patterns/
│   └── mockups/
│
├── 07-applications/                   ← things the business uses
│   ├── stationery/
│   ├── digital/
│   ├── social/
│   └── cip-optional/
│
├── 08-handover/                       ← what you zip and send
│   ├── DELIVERY-CHECKLIST.md
│   ├── FILE-MANIFEST.md
│   ├── LICENSE-AND-USAGE.md
│   └── CLIENT-WALKTHROUGH.md
│
└── sample/                            ← filled “Atelier North” example
    └── (see index.html brand book)
```

---

## How to run a job (short)

1. Copy this whole folder. Rename it `YYYY-client-name-brand-kit`.
2. Fill `01-intake` on the kickoff call. Do not design yet.
3. Lock `02-strategy` with the client (one page is enough).
4. Design the identity in Figma using `00-studio/FIGMA-FILE-STRUCTURE.md`.
5. Export into `06-assets` using the naming convention.
6. Fill `04-guidelines` and `05-tokens` from the same values (never two palettes).
7. Build only the applications in the sold tier (`00-studio/SCOPE-TIERS.md`).
8. Walk the client through `08-handover/CLIENT-WALKTHROUGH.md`. Zip and send.

One source of truth: **guidelines + tokens**. Mockups are proof. Random extra logos in WhatsApp are not the kit.

---

## What “done” looks like for the client

They receive a zip with:

- Brand guidelines (PDF or this HTML book)
- Logo pack (SVG + PNG, light/dark, mark/wordmark/lockup)
- Colour values (hex, RGB, CMYK, Pantone if print)
- Font files **or** license links (never pirate fonts)
- Social avatars + cover templates
- Email signature
- Tokens for the developer (`tokens.css` + JSON)
- License: what they own, what they can change, what they cannot

That is a professional handover. Everything else is scope you billed for.
