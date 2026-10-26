import { outreachDraft } from './outreachCopy.js'
// Client-side API bridge for Cloudflare Pages Functions (/api/*)
// with automatic local persistence fallback so everything works both in
// local `npm run dev` and on production Cloudflare Pages + D1.
import { storeProducts as seedProducts } from '../data.js'
import { analyzeSpamRisk } from './spamGuard.js'

const LS_KEYS = {
  leads: 'weezie_crm_leads_v1',
  products: 'weezie_crm_products_v1',
  orders: 'weezie_crm_orders_v1',
  emails: 'weezie_crm_emails_v1',
  inbox: 'weezie_crm_inbox_v1',
  cold: 'weezie_crm_cold_v1',
  files: 'weezie_crm_files_v1',
  adminKey: 'weezie_admin_key_v1',
  paystackPubKey: 'weezie_paystack_pk_v1',
  paystackSecKey: 'weezie_paystack_sk_v1',
}

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    /* ignore */
  }
}

export function getSavedAdminKey() {
  try {
    const key = localStorage.getItem(LS_KEYS.adminKey) || ''
    if (key === 'weezie-admin-2026') {
      localStorage.removeItem(LS_KEYS.adminKey)
      return ''
    }
    return key
  } catch {
    return ''
  }
}

export function setSavedAdminKey(key) {
  try {
    if (key) localStorage.setItem(LS_KEYS.adminKey, key)
    else localStorage.removeItem(LS_KEYS.adminKey)
  } catch {
    /* ignore */
  }
}

export function getPaystackPublicKey() {
  try {
    return (
      localStorage.getItem(LS_KEYS.paystackPubKey) ||
      import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY ||
      ''
    )
  } catch {
    return ''
  }
}

export function setPaystackPublicKey(pk) {
  try {
    localStorage.setItem(LS_KEYS.paystackPubKey, String(pk || '').trim())
  } catch {
    /* ignore */
  }
}

export function getPaystackSecretKey() {
  try {
    return localStorage.getItem(LS_KEYS.paystackSecKey) || ''
  } catch {
    return ''
  }
}

export function setPaystackSecretKey(sk) {
  try {
    if (sk) localStorage.setItem(LS_KEYS.paystackSecKey, String(sk || '').trim())
    else localStorage.removeItem(LS_KEYS.paystackSecKey)
  } catch {
    /* ignore */
  }
}

// Universal File Reader & Uploader (accepts ANY file type: .zip, .pdf, .fig, .mp4, .png, .csv, etc.)
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '')
      resolve({
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size || 0,
        base64,
        dataUrl,
      })
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export async function uploadAnyFile(adminKey, file) {
  const parsed = await readFileAsBase64(file)
  try {
    const res = await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify({
        filename: parsed.filename,
        mime_type: parsed.mimeType,
        size_bytes: parsed.sizeBytes,
        base64: parsed.base64,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.ok) return { ...data, base64: parsed.base64 }
    }
  } catch {
    /* local fallback below */
  }

  const localFiles = readLocal(LS_KEYS.files, [])
  const item = {
    id: Date.now(),
    file_key: `${Date.now()}-${parsed.filename}`,
    filename: parsed.filename,
    mime_type: parsed.mimeType,
    size_bytes: parsed.sizeBytes,
    downloadUrl: parsed.dataUrl,
    created_at: new Date().toISOString(),
  }
  // Store metadata (avoid blowing localStorage quota on giant files)
  writeLocal(LS_KEYS.files, [
    { ...item, downloadUrl: parsed.sizeBytes < 1500000 ? parsed.dataUrl : `/downloads/${parsed.filename}` },
    ...localFiles,
  ])

  return {
    ok: true,
    fileKey: item.file_key,
    filename: parsed.filename,
    mimeType: parsed.mimeType,
    sizeBytes: parsed.sizeBytes,
    downloadUrl: parsed.sizeBytes < 1500000 ? parsed.dataUrl : `/downloads/${parsed.filename}`,
    base64: parsed.base64,
  }
}

// Submit a lead (Contact form, Project Brief, Freebie download, AI lead)
export async function submitLeadToCRM(payload) {
  const localLeads = readLocal(LS_KEYS.leads, [])
  const newLocalLead = {
    id: Date.now(),
    name: payload.name || 'Visitor',
    email: payload.email || '',
    phone: payload.phone || '',
    source: payload.source || 'contact',
    status: 'New',
    plan: payload.plan || '',
    budget: payload.budget || '',
    currency: payload.currency || 'USD',
    estimated_total: payload.estimated_total || '',
    discount_code: payload.discount_code || '',
    message: payload.message || '',
    brief_json: payload.brief ? JSON.stringify(payload.brief) : '{}',
    subscribed: 1,
    notes: '',
    created_at: new Date().toISOString(),
  }
  writeLocal(LS_KEYS.leads, [newLocalLead, ...localLeads])

  if (payload.source !== 'freebie') {
    const localInbox = readLocal(LS_KEYS.inbox, [])
    writeLocal(LS_KEYS.inbox, [
      {
        id: Date.now() + 2,
        mailbox: 'enang@weezie.site',
        from_email: payload.email || '',
        from_name: payload.name || 'Visitor',
        subject:
          payload.source === 'brief'
            ? `Project Brief: ${payload.plan || 'Custom Build'} (${payload.estimated_total || 'Quote'})`
            : `Website Inquiry from ${payload.name || 'Visitor'}`,
        body_text: payload.message || 'Submitted via weezie.site',
        is_read: 0,
        created_at: new Date().toISOString(),
      },
      ...localInbox,
    ])
  }

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    /* fallback to local */
  }

  const matchedProd = seedProducts.find((p) => p.slug === payload.product_slug)
  return {
    ok: true,
    leadId: newLocalLead.id,
    downloadUrl: matchedProd?.file_url || '/downloads/weezie-free-hero-pack.zip',
    productTitle: matchedProd?.title || 'Weezie Freebie Pack',
  }
}

// Fetch Store Products
export async function fetchStoreProducts() {
  try {
    const res = await fetch('/api/products')
    if (res.ok) {
      const data = await res.json()
      if (data?.paystackPublicKey) {
        setPaystackPublicKey(data.paystackPublicKey)
      }
      if (Array.isArray(data?.products) && data.products.length > 0) {
        return data.products
      }
    }
  } catch {
    /* fallback */
  }
  const localProds = readLocal(LS_KEYS.products, null)
  return Array.isArray(localProds) && localProds.length > 0 ? localProds : seedProducts
}

// Run AI Website Auditor or AI Project Architect
export async function runAITool({ tool, input, context }) {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, input, context }),
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    /* fallback below */
  }

  const isArch = tool === 'architect'
  const isComplex = /wallet|fintech|ai|saas|dashboard|portal|marketplace|crypto|booking/i.test(input)
  const isStore = /shop|store|ecommerce|fashion|drop|cart|product/i.test(input)
  const recommendedPlan = isComplex ? 'Web App / AI Build' : isStore ? 'Online Store' : 'Business Website'

  const preview = isArch
    ? {
        projectName: context ? `${context} Platform` : 'Custom Product Build',
        recommendedPlan,
        estimatedTimeline: isComplex ? '4 to 6 weeks' : isStore ? '3 to 4 weeks' : '2 to 3 weeks',
        recommendedStack: ['React 19 + Tailwind CSS v4', 'Cloudflare Workers + D1 SQL', 'Paystack Checkout', 'Brevo Automated Emails'],
        coreModules: [
          'High-converting public landing page & interactive onboarding flow',
          isComplex
            ? 'Role-based user & admin dashboard with live wallet/data ledger'
            : 'Custom catalogue/service showcase with instant checkout & admin inbox',
          'Automated transactional emails, analytics events & SEO schema',
        ],
        summary: `To ship "${input.slice(0, 80)}" cleanly, focus V1 on a fast React + Cloudflare edge architecture with Paystack monetization and an admin control center built in from day one.`,
      }
    : {
        overallScore: 69,
        scores: { uxDesign: 73, conversion: 62, speedSeo: 72 },
        verdict: `${input} has a solid visual direction for ${context || 'its market'}, but lacks an immediate interactive hook and friction-free conversion path above the fold.`,
        quickWins: [
          'Replace generic hero sub-copy with a sharp outcome-driven value proposition + social proof.',
          'Add an interactive price/ROI estimator so leads self-qualify before leaving the page.',
          'Tighten mobile tap targets and add structured JSON-LD schema for AI search engines.',
        ],
        recommendedPlan: 'Business Website',
      }

  const fullReportCache = isArch
    ? `# Complete Technical PRD, Database Schema & MVP Roadmap\n\n## 1. Product Vision\n- **Concept:** ${input}\n- **Target Audience:** ${context || 'Modern users'}\n- **Recommended Plan:** ${recommendedPlan}\n\n## 2. Architecture & Stack\n- React 19 + Vite + Tailwind CSS v4\n- Cloudflare Pages Functions + D1 SQL Database + R2 Object Storage\n- Paystack (NGN & USD) + Brevo Email Automation\n\n## 3. Core SQL Schema\n\`\`\`sql\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  name TEXT NOT NULL,\n  email TEXT UNIQUE NOT NULL,\n  role TEXT DEFAULT 'user',\n  created_at TEXT DEFAULT (datetime('now'))\n);\n\`\`\`\n\n## 4. 4-Week Execution Plan\n- **Week 1:** UI/UX Wireframes & Design System\n- **Week 2:** Core Frontend & Database API\n- **Week 3:** Paystack Checkout & Admin Dashboard\n- **Week 4:** QA, Custom Domain & Launch`
    : `# Full 10-Point UX, Conversion & SEO Rebuild Blueprint for ${input}\n\n## 1. Rewritten Hero Section\n- **Headline:** Stop losing ready-to-buy customers to a slow, forgettable website.\n- **Sub-headline:** Built for ${context || 'ambitious brands'} ready to turn visitors into booked revenue.\n- **Primary CTA:** Start Your 2-Minute Instant Quote →\n\n## 2. Top 10 High-ROI Fixes\n1. Add an interactive quote/value calculator right under the hero.\n2. Pair every service claim with real client proof.\n3. Replace static forms with a guided project brief.\n4. Preload display fonts and optimize hero media.\n5. Add JSON-LD + \`llms.txt\` for AI search discovery.\n6. Pin a mobile sticky action bar.\n7. Answer pricing & timeline transparently in an FAQ.\n8. Add 1-click Paystack & WhatsApp kickoff paths.\n9. Automate instant Brevo email follow-ups.\n10. Upgrade card hierarchy with tactile depth.`

  return {
    ok: true,
    runId: Date.now(),
    tool,
    preview,
    teaserMd: fullReportCache.slice(0, 280) + '\n\n🔒 [Unlock the full Deep-Dive Blueprint & Copy Deck below…]',
    fullReportCache,
  }
}

// Verify Paystack order and record in CRM
export async function verifyAndRecordOrder(payload) {
  const localOrders = readLocal(LS_KEYS.orders, [])
  const newOrder = {
    id: Date.now(),
    reference: payload.reference || `WZ-${Date.now()}`,
    buyer_name: payload.name || 'Customer',
    buyer_email: payload.email || '',
    item_type: payload.item_type || 'product',
    item_id: payload.item_id || '',
    item_title: payload.item_title || 'Digital Item',
    currency: payload.currency || 'NGN',
    amount: Number(payload.amount || 0),
    status: 'paid',
    download_url: payload.download_url || `/downloads/${payload.item_id}.zip`,
    created_at: new Date().toISOString(),
  }
  writeLocal(LS_KEYS.orders, [newOrder, ...localOrders])

  const localLeads = readLocal(LS_KEYS.leads, [])
  writeLocal(LS_KEYS.leads, [
    {
      id: Date.now() + 1,
      name: newOrder.buyer_name,
      email: newOrder.buyer_email,
      phone: '',
      source: newOrder.item_type === 'ai_unlock' ? 'ai_tool' : 'store',
      status: 'Won',
      plan: newOrder.item_title,
      budget: '',
      currency: newOrder.currency,
      estimated_total: `${newOrder.currency === 'NGN' ? '₦' : '$'}${newOrder.amount.toLocaleString('en-US')}`,
      discount_code: '',
      message: `Purchased ${newOrder.item_title} (Ref: ${newOrder.reference})`,
      brief_json: '{}',
      subscribed: 1,
      notes: '',
      created_at: new Date().toISOString(),
    },
    ...localLeads,
  ])

  try {
    const res = await fetch('/api/paystack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => null)
    if (res.ok && data?.ok) return data
    return { ok: false, error: data?.error || 'Payment could not be verified.' }
  } catch {
    return { ok: false, error: 'Network error while verifying payment. Contact hello@weezie.site with your reference.' }
  }
}

// Retrieve cached key or fetch dynamically from /api/products
export async function getEffectivePaystackPublicKey() {
  let key = getPaystackPublicKey()
  if (key) return key
  try {
    const res = await fetch('/api/products')
    const data = await res.json().catch(() => null)
    if (data?.paystackPublicKey) {
      setPaystackPublicKey(data.paystackPublicKey)
      return data.paystackPublicKey
    }
  } catch {
    /* ignore */
  }
  return ''
}

// Load Paystack inline script dynamically and launch checkout
export async function launchPaystackPopup({ email, amount, currency = 'NGN', reference, metadata, onSuccess, onCancel }) {
  const publicKey = await getEffectivePaystackPublicKey()

  if (!publicKey) {
    // Fail closed: never hand out a product without a real payment.
    alert('Payments are not enabled yet. Please configure your Paystack keys in the Admin CRM under Orders & Keys.')
    if (onCancel) onCancel()
    return
  }

  function openHandler() {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: Math.round(Number(amount) * 100),
      currency,
      ref: reference || `WZ-${Date.now()}`,
      metadata: metadata || {},
      callback: (response) => {
        onSuccess({ reference: response.reference, simulated: false })
      },
      onClose: () => {
        if (onCancel) onCancel()
      },
    })
    handler.openIframe()
  }

  if (window.PaystackPop) {
    openHandler()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://js.paystack.co/v1/inline.js'
  script.async = true
  script.onload = openHandler
  script.onerror = () => {
    alert('Could not load Paystack checkout. Please check your connection and try again.')
    if (onCancel) onCancel()
  }
  document.body.appendChild(script)
}

// Admin Dashboard API calls
export async function fetchAdminDashboard(adminKey) {
  const defaultInbox = readLocal(LS_KEYS.inbox, [
    {
      id: 1,
      mailbox: 'enang@weezie.site',
      from_email: 'system@weezie.site',
      from_name: 'Weezie Mail System',
      subject: 'Welcome to your dedicated enang@weezie.site & hello@weezie.site Inbox!',
      body_text:
        'Incoming emails and client inquiries appear right here. You also get a read-only alert on your main Gmail so you know when to log in and reply from weezie.site/admin.',
      is_read: 0,
      created_at: new Date().toISOString(),
    },
  ])

  try {
    const res = await fetch('/api/admin', {
      headers: { 'X-Admin-Key': adminKey },
    })
    if (res.status === 401) {
      return { ok: false, unauthorized: true, error: 'Incorrect admin password.' }
    }
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json()
      if (data.d1Connected) {
        writeLocal(LS_KEYS.leads, data.leads || [])
        writeLocal(LS_KEYS.orders, data.orders || [])
        writeLocal(LS_KEYS.cold, data.coldProspects || [])
        writeLocal(LS_KEYS.emails, data.emails || [])
        writeLocal(LS_KEYS.inbox, data.inbox || [])
      }
      return {
        ...data,
        leads: Array.isArray(data.leads) ? data.leads : readLocal(LS_KEYS.leads, []),
        products: Array.isArray(data.products) && data.products.length ? data.products : readLocal(LS_KEYS.products, seedProducts),
        orders: Array.isArray(data.orders) ? data.orders : readLocal(LS_KEYS.orders, []),
        emails: Array.isArray(data.emails) ? data.emails : readLocal(LS_KEYS.emails, []),
        inbox: Array.isArray(data.inbox) ? data.inbox : defaultInbox,
        coldProspects: Array.isArray(data.coldProspects) ? data.coldProspects : readLocal(LS_KEYS.cold, []),
        uploadedFiles: Array.isArray(data.uploadedFiles) ? data.uploadedFiles : readLocal(LS_KEYS.files, []),
      }
    }
  } catch {
    /* fallback to local mode below */
  }

  // Resilient fallback for local dev or offline mode
  const localPk = getPaystackPublicKey()
  const localSk = getPaystackSecretKey()
  return {
    ok: true,
    localMode: true,
    d1Connected: false,
    brevoConfigured: false,
    paystackConfigured: Boolean(localPk),
    paystackPublicKey: localPk,
    paystackSecretKeySet: Boolean(localSk),
    paystackIsTest: (localPk || '').startsWith('pk_test_') || (localSk || '').startsWith('sk_test_'),
    leads: readLocal(LS_KEYS.leads, []),
    products: readLocal(LS_KEYS.products, seedProducts),
    orders: readLocal(LS_KEYS.orders, []),
    emails: readLocal(LS_KEYS.emails, []),
    inbox: readLocal(LS_KEYS.inbox, defaultInbox),
    coldProspects: readLocal(LS_KEYS.cold, []),
    uploadedFiles: readLocal(LS_KEYS.files, []),
  }
}

export async function postAdminAction(adminKey, payload) {
  const { action } = payload

  // Anti-spam check on cold/broadcast sends
  if (action === 'send_broadcast' || action === 'send_cold_campaign' || (action === 'send_email' && payload.is_cold)) {
    const check = analyzeSpamRisk(payload.subject, payload.body)
    if (!check.safe) {
      return {
        ok: false,
        error: `Anti-Spam Guard blocked send (Score ${check.score}/100): ${check.issues.join(' ')}`,
      }
    }
  }

  if (action === 'update_lead') {
    const list = readLocal(LS_KEYS.leads, []).map((l) =>
      l.id === payload.id ? { ...l, status: payload.status, notes: payload.notes ?? l.notes } : l,
    )
    writeLocal(LS_KEYS.leads, list)
  } else if (action === 'delete_lead') {
    const list = readLocal(LS_KEYS.leads, []).filter((l) => l.id !== payload.id)
    writeLocal(LS_KEYS.leads, list)
  } else if (action === 'mark_inbox_read') {
    const list = readLocal(LS_KEYS.inbox, []).map((m) => (m.id === payload.id ? { ...m, is_read: 1 } : m))
    writeLocal(LS_KEYS.inbox, list)
  } else if (action === 'delete_inbox') {
    const list = readLocal(LS_KEYS.inbox, []).filter((m) => m.id !== payload.id)
    writeLocal(LS_KEYS.inbox, list)
  } else if (action === 'send_email') {
    const emails = readLocal(LS_KEYS.emails, [])
    writeLocal(LS_KEYS.emails, [
      {
        id: Date.now(),
        from_email: payload.from_email,
        to_email: payload.to_email,
        recipient_name: payload.to_name || '',
        subject: payload.subject,
        body_text: payload.body,
        email_type: payload.is_cold ? 'cold' : 'direct',
        attachment_name: payload.attachment?.name || '',
        status: 'sent',
        created_at: new Date().toISOString(),
      },
      ...emails,
    ])
  } else if (action === 'send_broadcast') {
    const emails = readLocal(LS_KEYS.emails, [])
    writeLocal(LS_KEYS.emails, [
      {
        id: Date.now(),
        from_email: payload.from_email,
        to_email: `Broadcast (${payload.audience})`,
        recipient_name: `All ${payload.audience} leads`,
        subject: payload.subject,
        body_text: payload.body,
        email_type: 'broadcast',
        attachment_name: payload.attachment?.name || '',
        status: 'sent',
        created_at: new Date().toISOString(),
      },
      ...emails,
    ])
  } else if (action === 'import_cold_prospects') {
    const existing = readLocal(LS_KEYS.cold, [])
    const existingEmails = new Set(existing.map((p) => String(p.email).toLowerCase()))
    const added = (payload.prospects || [])
      .filter((p) => p.email && !existingEmails.has(String(p.email).toLowerCase()))
      .map((p, idx) => ({
        id: Date.now() + idx,
        name: p.name || 'Founder',
        email: String(p.email).toLowerCase(),
        business: p.business || '',
        website: p.website || '',
        niche: p.niche || '',
        custom_opener: p.custom_opener || '',
        custom_subject: p.custom_subject || '',
        status: 'Pending',
        followup_count: 0,
        last_contacted_at: '',
        created_at: new Date().toISOString(),
      }))
    writeLocal(LS_KEYS.cold, [...added, ...existing])
  } else if (action === 'send_cold_campaign') {
    const targetEmails = new Set((payload.targets || []).map((t) => String(t.email).toLowerCase()))
    const isFollowup = Boolean(payload.is_followup)
    const list = readLocal(LS_KEYS.cold, []).map((p) => {
      if (!targetEmails.has(String(p.email).toLowerCase())) return p
      const nextFollowup = isFollowup ? Number(p.followup_count || 0) + 1 : Number(p.followup_count || 0)
      return {
        ...p,
        status: isFollowup ? `Follow-up ${nextFollowup}` : 'Sent',
        followup_count: nextFollowup,
        last_contacted_at: new Date().toISOString(),
      }
    })
    writeLocal(LS_KEYS.cold, list)

    const emails = readLocal(LS_KEYS.emails, [])
    const sentAt = new Date().toISOString()
    const sentEmails = (payload.targets || [])
      .filter((prospect) => prospect.email && prospect.status !== 'Unsubscribed')
      .map((prospect, index) => {
        const personalizedDraft = !isFollowup && prospect.custom_opener
        const replaceTokens = (text) =>
          String(text || '')
            .replace(/\{\{\s*name\s*\}\}/gi, prospect.name || 'there')
            .replace(/\{\{\s*business\s*\}\}/gi, prospect.business || 'your business')
            .replace(/\{\{\s*website\s*\}\}/gi, prospect.website || 'your site')
            .replace(/\{\{\s*niche\s*\}\}/gi, prospect.niche || 'your industry')
        return {
          id: Date.now() + index,
          from_email: payload.from_email,
          to_email: prospect.email,
          recipient_name: prospect.name || '',
          subject: replaceTokens(personalizedDraft ? prospect.custom_subject || payload.subject : payload.subject),
          body_text: replaceTokens(personalizedDraft || payload.body),
          email_type: isFollowup ? 'followup' : 'cold',
          attachment_name: payload.attachment?.name || '',
          status: 'sent',
          created_at: sentAt,
        }
      })
    writeLocal(LS_KEYS.emails, [...sentEmails, ...emails])
  } else if (action === 'delete_cold_prospect') {
    const list = readLocal(LS_KEYS.cold, []).filter((p) => p.id !== payload.id)
    writeLocal(LS_KEYS.cold, list)
  } else if (action === 'clear_queue') {
    const list = readLocal(LS_KEYS.cold, []).filter((p) => p.status !== 'Pending')
    writeLocal(LS_KEYS.cold, list)
  } else if (action === 'clear_all_cold_prospects') {
    writeLocal(LS_KEYS.cold, [])
  } else if (action === 'clear_sales') {
    writeLocal(LS_KEYS.orders, [])
  } else if (action === 'delete_order') {
    const list = readLocal(LS_KEYS.orders, []).filter((o) => o.id !== payload.id && o.reference !== payload.reference)
    writeLocal(LS_KEYS.orders, list)
  } else if (action === 'save_product') {
    const prods = readLocal(LS_KEYS.products, seedProducts)
    const p = payload.product
    const features = Array.isArray(p.features)
      ? p.features
      : String(p.features || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
    if (p.id) {
      writeLocal(
        LS_KEYS.products,
        prods.map((item) => (item.id === p.id ? { ...item, ...p, features } : item)),
      )
    } else {
      writeLocal(LS_KEYS.products, [
        {
          ...p,
          id: Date.now(),
          slug:
            String(p.slug || p.title || '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-') || `item-${Date.now()}`,
          features,
          downloads_count: 0,
        },
        ...prods,
      ])
    }
  } else if (action === 'delete_product') {
    const prods = readLocal(LS_KEYS.products, seedProducts).filter((p) => p.id !== payload.id)
    writeLocal(LS_KEYS.products, prods)
  } else if (action === 'save_paystack_keys') {
    const pk = payload.publicKey !== undefined ? payload.publicKey : payload.public_key
    const sk = payload.secretKey !== undefined ? payload.secretKey : payload.secret_key
    if (pk !== undefined) setPaystackPublicKey(pk)
    if (sk !== undefined) setPaystackSecretKey(sk)
  } else if (action === 'mark_cold_opened') {
    const list = readLocal(LS_KEYS.cold, []).map((p) => {
      if (p.id === payload.id || (payload.email && String(p.email).toLowerCase() === String(payload.email).toLowerCase())) {
        return {
          ...p,
          status: p.status === 'Replied' || p.status === 'Won' ? p.status : 'Opened',
          open_count: (p.open_count || 0) + 1,
          opened_at: p.opened_at || new Date().toISOString(),
          last_opened_at: new Date().toISOString(),
        }
      }
      return p
    })
    writeLocal(LS_KEYS.cold, list)
  }

  try {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      return await res.json()
    }
    const errData = await res.json().catch(() => null)
    if (errData?.error) return { ok: false, error: errData.error }
  } catch {
    /* local fallback already updated */
  }

  if (action === 'generate_cold_opener') {
    const name = payload.name || 'Founder'
    const business = payload.business || 'your company'
    const website = payload.website || ''
    const niche = payload.niche || 'digital'
    return {
      ok: true,
      subject: outreachDraft({ name, business }).subject,
      pitch: outreachDraft({ name, business }).body,
    }
  }

  if (action === 'generate_cold_drafts') {
    const drafts = (payload.prospects || []).map((prospect) => {
      const name = prospect.name || 'Founder'
      const business = prospect.business || 'your business'
      const niche = prospect.niche || 'your industry'
      const website = prospect.website || ''
      const { subject, body } = outreachDraft(prospect)
      return { ...prospect, email: String(prospect.email).toLowerCase(), subject, body }
    })
    const emails = new Set(drafts.map((draft) => draft.email))
    const prospects = readLocal(LS_KEYS.cold, []).map((prospect) => {
      const draft = drafts.find((item) => item.email === String(prospect.email).toLowerCase())
      return draft ? { ...prospect, custom_subject: draft.subject, custom_opener: draft.body } : prospect
    })
    writeLocal(LS_KEYS.cold, prospects)
    return { ok: true, draftedCount: emails.size, drafts, simulated: true }
  }

  return { ok: true, simulated: true }
}
