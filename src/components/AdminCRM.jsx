import { useEffect, useMemo, useState } from 'react'
import { storeCategories, senderEmails, crmEmailTemplates } from '../data.js'
import {
  getSavedAdminKey,
  setSavedAdminKey,
  getPaystackPublicKey,
  setPaystackPublicKey,
  fetchAdminDashboard,
  postAdminAction,
  uploadAnyFile,
  readFileAsBase64,
} from '../lib/crmStore.js'
import { analyzeSpamRisk } from '../lib/spamGuard.js'

const STATUS_OPTIONS = ['New', 'Contacted', 'Quoted', 'Won', 'Archived']

const EMPTY_PRODUCT = {
  id: null,
  title: '',
  slug: '',
  category: 'Landing Pages',
  tagline: '',
  description: '',
  price_ngn: 25000,
  price_usd: 22,
  is_freebie: false,
  badge: 'New',
  cover_image: '/projects/maxi.jpg',
  preview_url: 'https://weezie.site',
  file_url: '/downloads/weezie-free-hero-pack.zip',
  features: 'React 19 + Tailwind CSS v4\nResponsive mobile & desktop\nFull source code included',
  active: true,
}

export default function AdminCRM({ onNavigate }) {
  const [adminKey, setAdminKey] = useState(getSavedAdminKey)
  const [inputKey, setInputKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authErr, setAuthErr] = useState('')

  // Tabs: 'inbox' | 'cold' | 'mail' | 'leads' | 'store' | 'orders'
  const [tab, setTab] = useState('inbox')
  const [data, setData] = useState({
    d1Connected: false,
    brevoConfigured: false,
    paystackConfigured: false,
    leads: [],
    products: [],
    orders: [],
    emails: [],
    inbox: [],
    coldProspects: [],
    uploadedFiles: [],
  })

  // Inbox state
  const [mailboxFilter, setMailboxFilter] = useState('all') // 'all' | 'enang@weezie.site' | 'hello@weezie.site'

  // Leads filters
  const [sourceFilter, setSourceFilter] = useState('all')
  const [expandedLead, setExpandedLead] = useState(null)

  // Email composer state
  const [mailMode, setMailMode] = useState('direct') // 'direct' | 'broadcast'
  const [fromEmail, setFromEmail] = useState(senderEmails[0].address)
  const [toEmail, setToEmail] = useState('')
  const [toName, setToName] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [broadcastAudience, setBroadcastAudience] = useState('all')
  const [subject, setSubject] = useState('')
  const [mailBody, setMailBody] = useState('')
  const [mailAttachment, setMailAttachment] = useState(null) // { name, content, sizeBytes }
  const [mailStatus, setMailStatus] = useState('')

  // Cold Outreach Suite state (All 3 tools: 1. AI Cold Opener, 2. CSV Bulk Import, 3. Follow-up Tracker)
  const [coldSubTab, setColdSubTab] = useState('ai') // 'ai' | 'import' | 'tracker'
  const [aiProspect, setAiProspect] = useState({ name: '', email: '', business: '', website: '', niche: '' })
  const [aiGenerating, setAiGenerating] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [coldFilter, setColdFilter] = useState('all') // 'all' | 'Pending' | 'Sent' | 'Follow-up 1' | 'Replied'
  const [coldSubject, setColdSubject] = useState('Quick idea for {{business}}')
  const [coldBody, setColdBody] = useState(
    `Hi {{name}},\n\nI was looking at {{website}} earlier today — love what you're building at {{business}}.\n\nI noticed 3 quick conversion upgrades on your site that could help turn more visitors into booked clients:\n1. Adding an interactive quote/booking flow right below the hero section.\n2. Tightening the mobile speed and headline hierarchy for first-time buyers.\n3. Adding structured AI search data so ChatGPT and Google rank {{business}} higher.\n\nI'm Enang Weezie, a full-stack designer & developer (https://weezie.site). Would you be open to me sending over a quick 2-minute mockup for {{business}}?\n\nBest,\nEnang Weezie\nhttps://weezie.site`,
  )
  const [coldAttachment, setColdAttachment] = useState(null)
  const [coldStatusMsg, setColdStatusMsg] = useState('')

  // Product editor + universal file upload state
  const [editingProduct, setEditingProduct] = useState(EMPTY_PRODUCT)
  const [prodStatus, setProdStatus] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)

  // Paystack public key setting
  const [paystackPk, setPaystackPk] = useState(getPaystackPublicKey)
  const [pkSaved, setPkSaved] = useState(false)

  // Live Anti-Spam Deliverability Checkers
  const mailSpamCheck = useMemo(() => analyzeSpamRisk(subject, mailBody), [subject, mailBody])
  const coldSpamCheck = useMemo(() => analyzeSpamRisk(coldSubject, coldBody), [coldSubject, coldBody])

  async function loadDashboard(keyToUse = adminKey) {
    if (!keyToUse) return
    setLoading(true)
    setAuthErr('')
    const res = await fetchAdminDashboard(keyToUse)
    setLoading(false)
    if (res?.ok) {
      setAuthed(true)
      setSavedAdminKey(keyToUse)
      setData(res)
    } else {
      setAuthed(false)
      setAuthErr(res?.error || 'Invalid admin password.')
    }
  }

  useEffect(() => {
    if (adminKey) {
      loadDashboard(adminKey)
    }
  }, [])

  function handleLogin(e) {
    e.preventDefault()
    const trimmed = inputKey.trim()
    setAdminKey(trimmed)
    loadDashboard(trimmed)
  }

  function handleLogout() {
    setSavedAdminKey('')
    setAdminKey('')
    setAuthed(false)
  }

  function replyToInboxMessage(msg) {
    setMailMode('direct')
    setFromEmail(msg.mailbox || 'enang@weezie.site')
    setToEmail(msg.from_email)
    setToName(msg.from_name || '')
    setSubject(msg.subject?.startsWith('Re:') ? msg.subject : `Re: ${msg.subject || 'Your message'}`)
    setMailBody(
      `Hi ${msg.from_name || 'there'},\n\nThanks for your email!\n\n\nBest,\nEnang Weezie\nhttps://weezie.site\n\n--- On ${new Date(
        msg.created_at,
      ).toLocaleDateString()}, ${msg.from_email} wrote: ---\n> ${String(msg.body_text || '').replace(/\n/g, '\n> ')}`,
    )
    postAdminAction(adminKey, { action: 'mark_inbox_read', id: msg.id }).then(() => loadDashboard())
    setTab('mail')
  }

  function openEmailForLead(lead) {
    setMailMode('direct')
    setSelectedLeadId(lead.id)
    setFromEmail('enang@weezie.site')
    setToEmail(lead.email)
    setToName(lead.name || '')
    setSubject(
      lead.source === 'brief'
        ? `Re: Your ${lead.plan || 'project'} brief on weezie.site`
        : `Following up on your inquiry — Enang Weezie`,
    )
    setMailBody(
      `Hi ${lead.name || 'there'},\n\nThanks for reaching out on weezie.site${
        lead.plan ? ` regarding ${lead.plan}` : ''
      }${lead.discount_code ? ` (I've applied your ${lead.discount_code} discount code!)` : ''}.\n\nI've reviewed your details and would love to get started. When are you free for a quick 15-minute kickoff chat?\n\nBest,\nEnang Weezie\nhttps://weezie.site`,
    )
    setMailStatus('')
    setTab('mail')
  }

  function applyTemplate(tpl) {
    setSubject(tpl.subject)
    const replaced = tpl.body.replace(/\{\{\s*name\s*\}\}/gi, mailMode === 'direct' ? toName || 'there' : '{{name}}')
    setMailBody(replaced)
  }

  async function handleAttachFile(e, target = 'mail') {
    const file = e.target.files?.[0]
    if (!file) return
    const parsed = await readFileAsBase64(file)
    const att = { name: parsed.filename, content: parsed.base64, sizeBytes: parsed.sizeBytes }
    if (target === 'cold') setColdAttachment(att)
    else setMailAttachment(att)
  }

  async function handleSendMail(e) {
    e.preventDefault()
    if (!mailSpamCheck.safe) {
      setMailStatus(`❌ Blocked by Anti-Spam Guard (Score ${mailSpamCheck.score}/100): ${mailSpamCheck.issues[0]}`)
      return
    }
    setMailStatus('Sending…')
    if (mailMode === 'direct') {
      const res = await postAdminAction(adminKey, {
        action: 'send_email',
        lead_id: selectedLeadId,
        from_email: fromEmail,
        to_email: toEmail,
        to_name: toName,
        subject,
        body: mailBody,
        attachment: mailAttachment,
      })
      if (res?.ok) {
        setMailStatus(
          res.simulated
            ? '✅ Logged in CRM! (Add BREVO_API_KEY in Cloudflare Pages to send live emails)'
            : `✅ Email sent from ${fromEmail} to ${toEmail}!`,
        )
        setMailAttachment(null)
        loadDashboard()
      } else {
        setMailStatus(`❌ ${res?.error || 'Could not send email'}`)
      }
    } else {
      const fallbackRecipients = data.leads
        .filter((l) => broadcastAudience === 'all' || l.source === broadcastAudience)
        .map((l) => ({ email: l.email, name: l.name }))

      const res = await postAdminAction(adminKey, {
        action: 'send_broadcast',
        from_email: fromEmail,
        audience: broadcastAudience,
        subject,
        body: mailBody,
        attachment: mailAttachment,
        fallback_recipients: fallbackRecipients,
      })
      if (res?.ok) {
        setMailStatus(`✅ Broadcast sent to ${res.sentCount ?? fallbackRecipients.length} recipients!`)
        setMailAttachment(null)
        loadDashboard()
      } else {
        setMailStatus(`❌ ${res?.error || 'Broadcast failed'}`)
      }
    }
  }

  // Cold Outreach Tool 1: AI Cold Opener Generator
  async function handleGenerateAIColdOpener(e) {
    e.preventDefault()
    setAiGenerating(true)
    setColdStatusMsg('')
    const res = await postAdminAction(adminKey, {
      action: 'generate_cold_opener',
      ...aiProspect,
    })
    setAiGenerating(false)
    if (res?.ok) {
      setColdSubject(res.subject)
      setColdBody(res.pitch)
      if (aiProspect.email) {
        await postAdminAction(adminKey, {
          action: 'import_cold_prospects',
          prospects: [{ ...aiProspect, custom_opener: res.pitch }],
        })
        loadDashboard()
      }
      setColdStatusMsg('✨ AI Cold Email generated (100% Free via Cloudflare AI) & loaded into your Campaign Composer below!')
    }
  }

  // Cold Outreach Tool 2: CSV / Bulk Prospect Importer
  async function handleImportCSVText(e) {
    e.preventDefault()
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    const parsed = []
    for (const line of lines) {
      if (/^name\s*,\s*email/i.test(line)) continue // skip header row
      const parts = line.split(',').map((s) => s.trim())
      const emailPart = parts.find((p) => p.includes('@'))
      if (!emailPart) continue
      parsed.push({
        name: parts[0] && !parts[0].includes('@') ? parts[0] : 'Founder',
        email: emailPart,
        business: parts[2] || parts[1] || 'your company',
        website: parts[3] || '',
        niche: parts[4] || 'digital business',
      })
    }
    if (parsed.length === 0) {
      setColdStatusMsg('❌ No valid emails found. Use format: Name, email@company.com, Business Name, https://site.com, Niche')
      return
    }
    await postAdminAction(adminKey, { action: 'import_cold_prospects', prospects: parsed })
    setCsvText('')
    setColdStatusMsg(`✅ Imported ${parsed.length} prospects into your Cold Outreach pipeline!`)
    setColdSubTab('tracker')
    loadDashboard()
  }

  async function handleCSVFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setCsvText(text)
  }

  // Cold Outreach Tool 3: Send Cold Campaign or Follow-Up
  async function handleSendColdToTargets(targets, isFollowup = false) {
    if (!coldSpamCheck.safe) {
      setColdStatusMsg(`❌ Anti-Spam Guard blocked send (Score ${coldSpamCheck.score}/100): ${coldSpamCheck.issues[0]}`)
      return
    }
    if (!targets || targets.length === 0) {
      setColdStatusMsg('❌ No prospects in this filter to send to.')
      return
    }
    setColdStatusMsg(`Sending ${isFollowup ? 'follow-up' : 'cold email'} to ${targets.length} prospect(s)…`)
    const useSubject = isFollowup && !coldSubject.startsWith('Re:') ? `Re: ${coldSubject}` : coldSubject
    const useBody = isFollowup
      ? `Hi {{name}},\n\nJust floating this to the top of your inbox in case you missed my note earlier this week about {{business}}.\n\nWould you be open to me sending over a quick 2-minute mockup showing the 3 conversion upgrades on your site?\n\nBest,\nEnang Weezie\nhttps://weezie.site`
      : coldBody

    const res = await postAdminAction(adminKey, {
      action: 'send_cold_campaign',
      from_email: 'enang@weezie.site',
      subject: useSubject,
      body: useBody,
      is_followup: isFollowup,
      attachment: coldAttachment,
      targets,
    })
    if (res?.ok) {
      setColdStatusMsg(`✅ Sent ${isFollowup ? 'Follow-up' : 'Cold Campaign'} from enang@weezie.site to ${res.sentCount ?? targets.length} prospect(s)!`)
      loadDashboard()
    } else {
      setColdStatusMsg(`❌ ${res?.error || 'Failed to send cold campaign'}`)
    }
  }

  // Universal File Upload for Store Products (any file type!)
  async function handleProductFileUpload(e, fieldName = 'file_url') {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    setProdStatus(`Uploading ${file.name}…`)
    try {
      const uploaded = await uploadAnyFile(adminKey, file)
      if (uploaded?.ok) {
        setEditingProduct((prev) => ({ ...prev, [fieldName]: uploaded.downloadUrl }))
        setProdStatus(`✅ Uploaded ${file.name} (${Math.round(file.size / 1024)} KB)!`)
        loadDashboard()
      } else {
        setProdStatus(`❌ Could not upload ${file.name}`)
      }
    } catch (err) {
      setProdStatus(`❌ ${err.message || 'Upload error'}`)
    } finally {
      setUploadingFile(false)
    }
  }

  async function handleLeadStatusChange(leadId, newStatus) {
    await postAdminAction(adminKey, { action: 'update_lead', id: leadId, status: newStatus })
    loadDashboard()
  }

  async function handleDeleteLead(leadId) {
    await postAdminAction(adminKey, { action: 'delete_lead', id: leadId })
    loadDashboard()
  }

  async function handleSaveProduct(e) {
    e.preventDefault()
    setProdStatus('Saving product…')
    const res = await postAdminAction(adminKey, {
      action: 'save_product',
      product: editingProduct,
    })
    if (res?.ok) {
      setProdStatus('✅ Product saved to Store!')
      setEditingProduct(EMPTY_PRODUCT)
      loadDashboard()
    } else {
      setProdStatus(`❌ ${res?.error || 'Failed to save'}`)
    }
  }

  async function handleDeleteProduct(id) {
    await postAdminAction(adminKey, { action: 'delete_product', id })
    loadDashboard()
  }

  function startEditProduct(p) {
    setEditingProduct({
      ...p,
      features: Array.isArray(p.features) ? p.features.join('\n') : p.features || '',
    })
    setProdStatus('')
  }

  if (!authed) {
    return (
      <section className="min-h-screen bg-paper px-6 py-20 md:px-10">
        <div className="mx-auto max-w-md rounded-[28px] bg-paper p-8 neu">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// weezie.site · Admin CRM</p>
          <h1 className="display mt-2 text-4xl text-ink">CRM Login.</h1>
          <p className="mt-2 text-xs font-medium text-ink-soft">
            Log in to read your <strong>enang@weezie.site</strong> &amp; <strong>hello@weezie.site</strong> inbox, run
            AI cold email campaigns, upload any file, and manage your digital store.
          </p>

          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter password (default: weezie-admin-2026)"
                className="w-full rounded-2xl bg-paper px-4 py-3.5 text-sm font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
              />
            </div>
            {authErr && <p className="text-xs font-bold text-red-600">{authErr}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
            >
              {loading ? 'Unlocking CRM…' : 'Open Admin CRM →'}
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-4 text-center">
            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/')
                }
              }}
              className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft hover:text-blue"
            >
              ← Back to weezie.site
            </a>
          </div>
        </div>
      </section>
    )
  }

  const inboxList = Array.isArray(data.inbox) ? data.inbox : []
  const unreadCount = inboxList.filter((m) => !m.is_read).length
  const filteredInbox = inboxList.filter((m) => mailboxFilter === 'all' || m.mailbox === mailboxFilter)

  const coldList = Array.isArray(data.coldProspects) ? data.coldProspects : []
  const filteredCold = coldList.filter((p) => coldFilter === 'all' || p.status === coldFilter)
  const needsFollowupList = coldList.filter((p) => p.status === 'Sent' || p.status === 'Follow-up 1')

  const filteredLeads = data.leads.filter((l) => sourceFilter === 'all' || l.source === sourceFilter)
  const totalNgnRevenue = data.orders
    .filter((o) => o.currency === 'NGN')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0)
  const totalUsdRevenue = data.orders
    .filter((o) => o.currency === 'USD')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0)

  return (
    <section className="min-h-screen bg-paper px-6 py-12 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">
              // weezie.site · Webmail, Cold Outreach, CRM &amp; Store
            </p>
            <h1 className="display mt-1 text-4xl text-ink md:text-5xl">WEEZIE CONTROL CENTER</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/store"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/store')
                }
              }}
              className="neu-hover rounded-full bg-paper px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm"
            >
              View Store ↗
            </a>
            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/')
                }
              }}
              className="neu-hover rounded-full bg-paper px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm"
            >
              Portfolio ↗
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-ink px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Status pills & KPIs */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-paper p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
              Dedicated Inbox (@weezie.site)
            </span>
            <p className="display mt-1 text-3xl text-ink">
              {inboxList.length}{' '}
              {unreadCount > 0 && <span className="text-sm font-bold text-blue">({unreadCount} unread)</span>}
            </p>
            <span className="mt-1 block text-[11px] font-medium text-blue">
              Read-only alerts active → Gmail
            </span>
          </div>

          <div className="rounded-2xl bg-paper p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
              Cold Outreach &amp; Anti-Spam
            </span>
            <p className="display mt-1 text-3xl text-ink">{coldList.length} prospects</p>
            <span className="mt-1 block text-[11px] font-medium text-green-700">
              🛡️ SPF + DKIM + DMARC Active
            </span>
          </div>

          <div className="rounded-2xl bg-paper p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">CRM Leads &amp; Store</span>
            <p className="display mt-1 text-3xl text-ink">
              {data.leads.length} leads · {data.products.length} items
            </p>
            <span className="mt-1 block text-[11px] font-medium text-ink-soft">
              {data.d1Connected ? '🟢 Cloudflare D1 Active' : '🟢 Local + Seed Store Active'}
            </span>
          </div>

          <div className="rounded-2xl bg-paper p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">Store &amp; AI Revenue</span>
            <p className="display mt-1 text-2xl text-ink">
              ${totalUsdRevenue.toLocaleString('en-US')} · ₦{totalNgnRevenue.toLocaleString('en-US')}
            </p>
            <span className="mt-1 block text-[11px] font-medium text-ink-soft">{data.orders.length} paid orders</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            ['inbox', `1. Inbox (${inboxList.length})`],
            ['cold', `2. Cold Email Engine (${coldList.length})`],
            ['mail', `3. Compose & Broadcast (${data.emails.length})`],
            ['leads', `4. Leads & Briefs (${data.leads.length})`],
            ['store', `5. Store & File Uploader (${data.products.length})`],
            ['orders', `6. Orders & Keys (${data.orders.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                tab === id ? 'btn-gradient text-white' : 'neu-hover bg-paper text-ink-soft neu-sm hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: DEDICATED INBOX FOR ENANG@WEEZIE.SITE & HELLO@WEEZIE.SITE */}
        {tab === 'inbox' && (
          <div className="mt-8 rounded-[28px] bg-paper p-6 neu">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="display text-2xl text-ink">Dedicated @weezie.site Inbox</h2>
                <p className="mt-1 text-xs font-medium text-ink-soft">
                  All incoming messages to <strong>enang@weezie.site</strong> &amp; <strong>hello@weezie.site</strong>{' '}
                  land here. Your main Gmail receives a read-only alert so you can log in here and reply as your custom
                  domain.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ['all', 'All Mailboxes'],
                  ['enang@weezie.site', 'enang@weezie.site'],
                  ['hello@weezie.site', 'hello@weezie.site'],
                ].map(([mb, label]) => (
                  <button
                    key={mb}
                    type="button"
                    onClick={() => setMailboxFilter(mb)}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                      mailboxFilter === mb ? 'bg-ink text-white' : 'bg-paper text-ink-soft neu-sm'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filteredInbox.length === 0 ? (
              <p className="mt-6 text-sm font-medium text-ink-soft">No messages in this mailbox yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredInbox.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl bg-paper p-5 neu-sm ${!msg.is_read ? 'ring-2 ring-blue/40' : ''}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue">
                            To: {msg.mailbox}
                          </span>
                          {!msg.is_read && (
                            <span className="rounded-full bg-blue px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                              NEW
                            </span>
                          )}
                          <span className="text-[11px] font-medium text-ink-soft">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="display mt-2 text-lg text-ink">{msg.subject}</h3>
                        <p className="text-xs font-bold text-ink-soft">
                          From: {msg.from_name ? `${msg.from_name} (${msg.from_email})` : msg.from_email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => replyToInboxMessage(msg)}
                          className="btn-gradient rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em]"
                        >
                          Reply as {msg.mailbox} ↩
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            postAdminAction(adminKey, { action: 'delete_inbox', id: msg.id }).then(() => loadDashboard())
                          }
                          className="rounded-full px-2.5 py-1.5 text-xs font-bold text-ink-soft hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap rounded-xl bg-paper p-3.5 font-mono text-xs leading-relaxed text-ink neu-inset">
                      {msg.body_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COLD OUTREACH ENGINE (ALL 3 TOOLS + ANTI-SPAM GUARD) */}
        {tab === 'cold' && (
          <div className="mt-8 space-y-8">
            {/* Sub-tool picker */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-paper p-6 neu">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue">
                  // Zero API Credits Needed · Powered by Free Cloudflare Workers AI + Anti-Spam Guard
                </p>
                <h2 className="display mt-1 text-2xl text-ink">Cold Email Outreach Suite (enang@weezie.site)</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ['ai', '1. AI Cold Opener Generator'],
                  ['import', '2. CSV / Bulk Prospect Importer'],
                  ['tracker', `3. Follow-Up Tracker (${coldList.length})`],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setColdSubTab(id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] ${
                      coldSubTab === id ? 'btn-gradient text-white' : 'bg-paper text-ink-soft neu-sm'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left panel: Tool 1, Tool 2, or Tool 3 */}
              <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-6">
                {coldSubTab === 'ai' && (
                  <form onSubmit={handleGenerateAIColdOpener} className="flex flex-col gap-3.5">
                    <h3 className="display text-xl text-ink">1. AI Cold Opener &amp; Website Fix Generator</h3>
                    <p className="text-xs font-medium text-ink-soft">
                      Enter a prospect&rsquo;s details. Cloudflare AI writes a personalized, spam-free pitch with 3
                      website fixes and saves them to your prospect list.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        value={aiProspect.name}
                        onChange={(e) => setAiProspect({ ...aiProspect, name: e.target.value })}
                        placeholder="Decision Maker Name *"
                        className="rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                      />
                      <input
                        type="email"
                        value={aiProspect.email}
                        onChange={(e) => setAiProspect({ ...aiProspect, email: e.target.value })}
                        placeholder="Prospect Email (optional to save)"
                        className="rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                      />
                      <input
                        type="text"
                        required
                        value={aiProspect.business}
                        onChange={(e) => setAiProspect({ ...aiProspect, business: e.target.value })}
                        placeholder="Company / Brand Name *"
                        className="rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                      />
                      <input
                        type="text"
                        value={aiProspect.website}
                        onChange={(e) => setAiProspect({ ...aiProspect, website: e.target.value })}
                        placeholder="Website URL (e.g. acme.com)"
                        className="rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                      />
                    </div>
                    <input
                      type="text"
                      value={aiProspect.niche}
                      onChange={(e) => setAiProspect({ ...aiProspect, niche: e.target.value })}
                      placeholder="Industry / Niche (e.g. Real Estate, MedSpa, Construction, Fintech)"
                      className="rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                    />
                    <button
                      type="submit"
                      disabled={aiGenerating}
                      className="btn-gradient mt-1 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
                    >
                      {aiGenerating ? 'Writing Custom Pitch…' : 'Generate AI Cold Email (Free) ⚡'}
                    </button>
                  </form>
                )}

                {coldSubTab === 'import' && (
                  <form onSubmit={handleImportCSVText} className="flex flex-col gap-3.5">
                    <h3 className="display text-xl text-ink">2. CSV / Bulk Prospect Importer</h3>
                    <p className="text-xs font-medium text-ink-soft">
                      Upload a `.csv` file or paste rows below in the format:{' '}
                      <code>Name, email@domain.com, Business Name, https://website.com, Niche</code>
                    </p>
                    <div>
                      <label className="neu-hover inline-block cursor-pointer rounded-full bg-paper px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-blue neu-sm">
                        📂 Upload .CSV File
                        <input type="file" accept=".csv,.txt" onChange={handleCSVFileUpload} className="hidden" />
                      </label>
                    </div>
                    <textarea
                      rows="7"
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder={`David Mark, david@skylinebuilders.com, Skyline Builders, https://skylinebuilders.com, Construction\nSarah Cole, sarah@velvetglow.co, Velvet Glow, https://velvetglow.co, E-commerce`}
                      className="w-full rounded-xl bg-paper p-3.5 font-mono text-xs text-ink outline-none neu-inset"
                    />
                    <button
                      type="submit"
                      className="btn-gradient rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
                    >
                      Import Prospects to Pipeline →
                    </button>
                  </form>
                )}

                {coldSubTab === 'tracker' && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="display text-xl text-ink">3. Prospect &amp; Follow-Up Tracker</h3>
                      {needsFollowupList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSendColdToTargets(needsFollowupList, true)}
                          className="btn-gradient rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em]"
                        >
                          Send 1-Click Follow-Up to {needsFollowupList.length} Unreplied ↻
                        </button>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['all', 'Pending', 'Sent', 'Follow-up 1', 'Replied', 'Unsubscribed'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setColdFilter(st)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                            coldFilter === st ? 'bg-ink text-white' : 'bg-paper text-ink-soft neu-sm'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 max-h-96 space-y-2.5 overflow-y-auto pr-1">
                      {filteredCold.length === 0 ? (
                        <p className="text-xs font-medium text-ink-soft">
                          No prospects in this status yet. Import a CSV or generate one with AI!
                        </p>
                      ) : (
                        filteredCold.map((p) => (
                          <div
                            key={p.id || p.email}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-paper p-3.5 neu-sm"
                          >
                            <div>
                              <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase text-blue">
                                {p.status}
                              </span>
                              <p className="mt-1 text-xs font-bold text-ink">
                                {p.name} · {p.business || p.email}
                              </p>
                              <p className="text-[11px] font-medium text-ink-soft">{p.email}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSendColdToTargets([p], p.status !== 'Pending')}
                                className="btn-gradient rounded-full px-3 py-1.5 text-[10px] font-bold uppercase"
                              >
                                {p.status === 'Pending' ? 'Send Cold ✉️' : 'Follow Up ↻'}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  postAdminAction(adminKey, { action: 'delete_cold_prospect', id: p.id }).then(() =>
                                    loadDashboard(),
                                  )
                                }
                                className="px-2 text-xs font-bold text-ink-soft hover:text-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right panel: Cold Campaign Composer + Live Anti-Spam Guard */}
              <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="display text-xl text-ink">Cold Campaign Composer</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                      coldSpamCheck.score >= 80
                        ? 'bg-green-600/15 text-green-700'
                        : coldSpamCheck.score >= 60
                          ? 'bg-amber-500/20 text-amber-800'
                          : 'bg-red-600/15 text-red-700'
                    }`}
                  >
                    🛡️ Deliverability: {coldSpamCheck.score}/100 ({coldSpamCheck.status})
                  </span>
                </div>

                {coldSpamCheck.issues.length > 0 && (
                  <div className="mt-3 rounded-xl bg-amber-500/10 p-3 text-[11px] font-semibold text-amber-900">
                    {coldSpamCheck.issues.map((iss, i) => (
                      <p key={i}>⚠️ {iss}</p>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">
                      Subject Line (Supports {'{{name}}'}, {'{{business}}'})
                    </label>
                    <input
                      type="text"
                      value={coldSubject}
                      onChange={(e) => setColdSubject(e.target.value)}
                      className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-bold text-ink outline-none neu-inset"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">
                      Cold Pitch Body (Auto-adds polite opt-out footer to prevent spam reports)
                    </label>
                    <textarea
                      rows="8"
                      value={coldBody}
                      onChange={(e) => setColdBody(e.target.value)}
                      className="w-full rounded-xl bg-paper p-3.5 font-mono text-xs leading-relaxed text-ink outline-none neu-inset"
                    />
                  </div>

                  {/* Attach any file to cold email */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="neu-hover inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-bold uppercase text-ink neu-sm">
                      📎 Attach Any File (PDF, Image, Pitch, ZIP)
                      <input type="file" onChange={(e) => handleAttachFile(e, 'cold')} className="hidden" />
                    </label>
                    {coldAttachment && (
                      <span className="text-xs font-bold text-blue">
                        Attached: {coldAttachment.name}{' '}
                        <button type="button" onClick={() => setColdAttachment(null)} className="ml-1 text-red-600">
                          ✕
                        </button>
                      </span>
                    )}
                  </div>

                  {coldStatusMsg && <p className="text-xs font-bold text-blue">{coldStatusMsg}</p>}

                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSendColdToTargets(
                          coldList.filter((p) => p.status === 'Pending'),
                          false,
                        )
                      }
                      className="btn-gradient rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
                    >
                      Send to All Pending Prospects ({coldList.filter((p) => p.status === 'Pending').length}) →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT MAILER & BROADCASTS (WITH ANTI-SPAM METER & UNIVERSAL ATTACHMENT) */}
        {tab === 'mail' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="display text-2xl text-ink">Compose Email</h2>
                <div className="flex gap-2 rounded-full bg-paper p-1 neu-inset">
                  <button
                    type="button"
                    onClick={() => setMailMode('direct')}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${
                      mailMode === 'direct' ? 'btn-gradient text-white' : 'text-ink-soft'
                    }`}
                  >
                    1-on-1 Client Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setMailMode('broadcast')}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${
                      mailMode === 'broadcast' ? 'btn-gradient text-white' : 'text-ink-soft'
                    }`}
                  >
                    Bulk Broadcast 📣
                  </button>
                </div>
              </div>

              {/* Anti-Spam Deliverability Badge */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper p-3 neu-inset">
                <span className="text-[11px] font-bold uppercase text-ink-soft">
                  🛡️ Anti-Spam Deliverability Score:
                </span>
                <span
                  className={`text-xs font-bold ${
                    mailSpamCheck.score >= 80
                      ? 'text-green-700'
                      : mailSpamCheck.score >= 60
                        ? 'text-amber-700'
                        : 'text-red-600'
                  }`}
                >
                  {mailSpamCheck.score}/100 — {mailSpamCheck.status}
                </span>
              </div>
              {mailSpamCheck.issues.length > 0 && (
                <div className="mt-2 rounded-xl bg-amber-500/10 p-2.5 text-[11px] font-semibold text-amber-900">
                  {mailSpamCheck.issues.map((iss, idx) => (
                    <p key={idx}>⚠️ {iss}</p>
                  ))}
                </div>
              )}

              {/* Quick Starter Templates */}
              <div className="mt-4">
                <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                  1-Click Email Templates:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {crmEmailTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="neu-hover rounded-full bg-paper px-3 py-1.5 text-[11px] font-bold text-blue neu-sm"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendMail} className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                    Send From (@weezie.site)
                  </label>
                  <select
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    className="w-full rounded-xl bg-paper px-4 py-3 text-sm font-bold text-ink outline-none neu-inset"
                  >
                    {senderEmails.map((s) => (
                      <option key={s.address} value={s.address}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {mailMode === 'direct' ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                        Client Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                        placeholder="client@company.com"
                        className="w-full rounded-xl bg-paper px-4 py-3 text-sm font-medium text-ink outline-none neu-inset"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={toName}
                        onChange={(e) => setToName(e.target.value)}
                        placeholder="Client Name"
                        className="w-full rounded-xl bg-paper px-4 py-3 text-sm font-medium text-ink outline-none neu-inset"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                      Broadcast Audience
                    </label>
                    <select
                      value={broadcastAudience}
                      onChange={(e) => setBroadcastAudience(e.target.value)}
                      className="w-full rounded-xl bg-paper px-4 py-3 text-sm font-bold text-ink outline-none neu-inset"
                    >
                      <option value="all">All Subscribed Leads &amp; Buyers ({data.leads.length})</option>
                      <option value="freebie">
                        Freebie Downloaders Only ({data.leads.filter((l) => l.source === 'freebie').length})
                      </option>
                      <option value="brief">
                        Project Brief Leads ({data.leads.filter((l) => l.source === 'brief').length})
                      </option>
                      <option value="store">
                        Store Buyers ({data.leads.filter((l) => l.source === 'store').length})
                      </option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject…"
                    className="w-full rounded-xl bg-paper px-4 py-3 text-sm font-medium text-ink outline-none neu-inset"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                    Message Body * {mailMode === 'broadcast' && '(Use {{name}} to personalize)'}
                  </label>
                  <textarea
                    rows="8"
                    required
                    value={mailBody}
                    onChange={(e) => setMailBody(e.target.value)}
                    placeholder="Write your email…"
                    className="w-full rounded-xl bg-paper px-4 py-3 font-mono text-xs leading-relaxed text-ink outline-none neu-inset"
                  />
                </div>

                {/* Universal File Attachment */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="neu-hover inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-bold uppercase text-ink neu-sm">
                    📎 Attach Any File (PDF, ZIP, Image, Doc, Audio/Video)
                    <input type="file" onChange={(e) => handleAttachFile(e, 'mail')} className="hidden" />
                  </label>
                  {mailAttachment && (
                    <span className="text-xs font-bold text-blue">
                      Attached: {mailAttachment.name} ({Math.round(mailAttachment.sizeBytes / 1024)} KB)
                      <button type="button" onClick={() => setMailAttachment(null)} className="ml-2 text-red-600">
                        ✕
                      </button>
                    </span>
                  )}
                </div>

                {mailStatus && <p className="text-xs font-bold text-blue">{mailStatus}</p>}

                <button
                  type="submit"
                  className="btn-gradient rounded-full px-8 py-4 text-xs font-bold uppercase tracking-[0.14em]"
                >
                  {mailMode === 'direct' ? `Send Email as ${fromEmail} →` : `Send Broadcast Campaign →`}
                </button>
              </form>
            </div>

            {/* Sent History */}
            <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-5">
              <h3 className="display text-2xl text-ink">Sent History</h3>
              <p className="mt-1 text-xs font-medium text-ink-soft">
                Every 1-on-1 reply, cold pitch, and broadcast sent from your CRM.
              </p>
              <div className="mt-4 max-h-[540px] space-y-3 overflow-y-auto pr-1">
                {data.emails.length === 0 ? (
                  <p className="text-xs font-medium text-ink-soft">No emails sent yet.</p>
                ) : (
                  data.emails.map((em) => (
                    <div key={em.id} className="rounded-2xl bg-paper p-4 neu-sm">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-blue">
                        <span>
                          {em.email_type} {em.attachment_name ? `· 📎 ${em.attachment_name}` : ''}
                        </span>
                        <span>{new Date(em.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-ink">{em.subject}</p>
                      <p className="text-[11px] font-medium text-ink-soft">
                        From: {em.from_email} → To: {em.to_email}
                      </p>
                      <p className="mt-2 line-clamp-3 whitespace-pre-wrap font-mono text-[11px] text-ink-soft">
                        {em.body_text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEADS & BRIEFS PIPELINE */}
        {tab === 'leads' && (
          <div className="mt-8 rounded-[28px] bg-paper p-6 neu">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="display text-2xl text-ink">Leads, Briefs &amp; Freebie Subscribers</h2>
              <div className="flex flex-wrap gap-2">
                {['all', 'brief', 'contact', 'freebie', 'store', 'ai_tool'].map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSourceFilter(src)}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                      sourceFilter === src ? 'bg-ink text-white' : 'bg-paper text-ink-soft neu-sm'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <p className="mt-6 text-sm font-medium text-ink-soft">
                No leads in this view yet. Try submitting the Contact form, Project Brief, or claiming a Freebie on the
                store!
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredLeads.map((lead) => {
                  const isExpanded = expandedLead === lead.id
                  let briefDetails = null
                  try {
                    const parsed = JSON.parse(lead.brief_json || '{}')
                    if (Object.keys(parsed).length > 0) briefDetails = parsed
                  } catch {
                    /* ignore */
                  }

                  return (
                    <div key={lead.id} className="rounded-2xl bg-paper p-5 neu-sm">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue">
                              {lead.source}
                            </span>
                            {lead.plan && (
                              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                                {lead.plan}
                              </span>
                            )}
                            {lead.discount_code && (
                              <span className="rounded-full bg-green-600/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-green-700">
                                🎉 {lead.discount_code}
                              </span>
                            )}
                            <span className="text-[11px] font-medium text-ink-soft">
                              {new Date(lead.created_at).toLocaleString()}
                            </span>
                          </div>

                          <h3 className="display mt-2 text-xl text-ink">
                            {lead.name}{' '}
                            <span className="font-mono text-sm font-normal text-ink-soft">({lead.email})</span>
                          </h3>
                          {lead.phone && <p className="text-xs font-semibold text-ink-soft">📞 {lead.phone}</p>}
                          {lead.estimated_total && (
                            <p className="mt-1 text-xs font-bold text-blue">Estimate shown: {lead.estimated_total}</p>
                          )}
                          {lead.message && <p className="mt-2 text-sm font-medium text-ink">{lead.message}</p>}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={lead.status || 'New'}
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                            className="rounded-full bg-paper px-3.5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink outline-none neu-inset"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => openEmailForLead(lead)}
                            className="btn-gradient rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em]"
                          >
                            Email Client ✉️
                          </button>

                          {briefDetails && (
                            <button
                              type="button"
                              onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                              className="neu-hover rounded-full bg-paper px-3.5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm"
                            >
                              {isExpanded ? 'Hide Brief' : 'Full Brief ↓'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="rounded-full px-2.5 py-2 text-xs font-bold text-ink-soft hover:text-red-600"
                            title="Delete lead"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {isExpanded && briefDetails && (
                        <div className="mt-4 rounded-xl bg-paper p-4 neu-inset">
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue">
                            Full Project Brief Answers
                          </p>
                          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                            {Object.entries(briefDetails).map(([k, v]) => (
                              <div key={k} className="text-xs">
                                <dt className="font-bold uppercase text-ink-soft">{k.replace(/_/g, ' ')}:</dt>
                                <dd className="font-medium text-ink">
                                  {Array.isArray(v) ? v.join(', ') : String(v)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STORE PRODUCT MANAGER & UNIVERSAL FILE UPLOADER */}
        {tab === 'store' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-5">
              <div className="flex items-center justify-between">
                <h2 className="display text-2xl text-ink">
                  {editingProduct.id ? 'Edit Product' : 'Add Store Product'}
                </h2>
                {editingProduct.id && (
                  <button
                    type="button"
                    onClick={() => setEditingProduct(EMPTY_PRODUCT)}
                    className="text-xs font-bold text-blue underline"
                  >
                    + New Instead
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    placeholder="e.g. SaaS Dashboard Starter Kit"
                    className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-bold text-ink outline-none neu-inset"
                    >
                      {storeCategories
                        .filter((c) => c !== 'All')
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">Badge</label>
                    <input
                      type="text"
                      value={editingProduct.badge || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      placeholder="Bestseller / Free"
                      className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">Price (NGN ₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.price_ngn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price_ngn: Number(e.target.value) })}
                      className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">Price (USD $)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.price_usd}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price_usd: Number(e.target.value) })}
                      className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-ink">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.is_freebie)}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_freebie: e.target.checked,
                        price_ngn: e.target.checked ? 0 : editingProduct.price_ngn,
                        price_usd: e.target.checked ? 0 : editingProduct.price_usd,
                      })
                    }
                  />
                  Email-Gated Freebie (0 NGN / 0 USD — builds your CRM email list)
                </label>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">Short Tagline *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.tagline}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    placeholder="1-sentence value hook"
                    className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">Full Description</label>
                  <textarea
                    rows="3"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-medium text-ink outline-none neu-inset"
                  />
                </div>

                {/* Universal File Uploader for Product Download File & Cover Image */}
                <div className="rounded-2xl bg-paper p-3.5 neu-inset">
                  <p className="text-[11px] font-bold uppercase text-blue">
                    📦 Upload Any Product File (.ZIP, .PDF, .FIG, .MP4, .JSON, .DOCX, etc.)
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <label className="neu-hover cursor-pointer rounded-full bg-paper px-3.5 py-1.5 text-[11px] font-bold uppercase text-ink neu-sm">
                      {uploadingFile ? 'Uploading…' : '⬆️ Choose Product File from PC'}
                      <input
                        type="file"
                        onChange={(e) => handleProductFileUpload(e, 'file_url')}
                        className="hidden"
                      />
                    </label>
                    <label className="neu-hover cursor-pointer rounded-full bg-paper px-3.5 py-1.5 text-[11px] font-bold uppercase text-ink neu-sm">
                      🖼️ Upload Cover Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductFileUpload(e, 'cover_image')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editingProduct.file_url}
                      onChange={(e) => setEditingProduct({ ...editingProduct, file_url: e.target.value })}
                      placeholder="Download URL (/api/files?key=...)"
                      className="w-full rounded-lg bg-paper px-2.5 py-1.5 text-[11px] font-medium text-ink outline-none neu-sm"
                    />
                    <input
                      type="text"
                      value={editingProduct.cover_image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, cover_image: e.target.value })}
                      placeholder="Cover Image URL"
                      className="w-full rounded-lg bg-paper px-2.5 py-1.5 text-[11px] font-medium text-ink outline-none neu-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">
                    Included Features (one per line)
                  </label>
                  <textarea
                    rows="3"
                    value={editingProduct.features}
                    onChange={(e) => setEditingProduct({ ...editingProduct, features: e.target.value })}
                    className="w-full rounded-xl bg-paper px-3.5 py-2.5 font-mono text-xs text-ink outline-none neu-inset"
                  />
                </div>

                {prodStatus && <p className="text-xs font-bold text-blue">{prodStatus}</p>}

                <button
                  type="submit"
                  className="btn-gradient mt-1 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
                >
                  {editingProduct.id ? 'Update Product →' : 'Publish to Store →'}
                </button>
              </form>
            </div>

            <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-7">
              <h2 className="display text-2xl text-ink">Active Store Catalogue ({data.products.length})</h2>
              <div className="mt-4 space-y-3">
                {data.products.map((p) => (
                  <div
                    key={p.slug || p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper p-4 neu-sm"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue">{p.category}</span>
                      <h4 className="display text-lg text-ink">{p.title}</h4>
                      <p className="text-xs font-medium text-ink-soft">
                        {p.is_freebie ? 'FREEBIE' : `$${p.price_usd} · ₦${Number(p.price_ngn || 0).toLocaleString()}`} ·{' '}
                        {p.downloads_count || 0} downloads
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditProduct(p)}
                        className="neu-hover rounded-full bg-paper px-4 py-2 text-xs font-bold uppercase text-ink neu-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="rounded-full px-3 py-2 text-xs font-bold text-ink-soft hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ORDERS & KEYS SETUP */}
        {tab === 'orders' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-7">
              <h2 className="display text-2xl text-ink">Orders &amp; Unlocks ({data.orders.length})</h2>
              {data.orders.length === 0 ? (
                <p className="mt-4 text-xs font-medium text-ink-soft">
                  No paid orders yet. Purchases from the Digital Store and AI Lab Deep-Dive packs appear here
                  automatically.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.orders.map((o) => (
                    <div key={o.reference || o.id} className="rounded-2xl bg-paper p-4 neu-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue">
                          {o.reference} · {o.item_type}
                        </span>
                        <span className="display text-lg text-ink">
                          {o.currency === 'NGN' ? '₦' : '$'}
                          {Number(o.amount || 0).toLocaleString('en-US')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-ink">{o.item_title}</p>
                      <p className="text-xs font-medium text-ink-soft">
                        Buyer: {o.buyer_name} ({o.buyer_email})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-5">
              <h3 className="display text-2xl text-ink">Paystack &amp; Brevo Setup</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-ink-soft">
                Paste your <strong>Paystack Public Key</strong> (`pk_live_...` or `pk_test_...`) below to activate the
                live Paystack payment popup immediately.
              </p>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-bold uppercase text-ink-soft">Paystack Public Key</label>
                <input
                  type="text"
                  value={paystackPk}
                  onChange={(e) => {
                    setPaystackPk(e.target.value)
                    setPkSaved(false)
                  }}
                  placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-xl bg-paper px-4 py-3 font-mono text-xs text-ink outline-none neu-inset"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPaystackPublicKey(paystackPk)
                    setPkSaved(true)
                  }}
                  className="btn-gradient mt-3 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em]"
                >
                  Save Paystack Key
                </button>
                {pkSaved && <p className="mt-2 text-xs font-bold text-blue">✅ Saved!</p>}
              </div>

              <div className="mt-6 rounded-2xl bg-paper p-4 neu-inset">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
                  100% Free Stack Summary (Zero API Credits Needed)
                </p>
                <ul className="mt-2 space-y-1.5 font-mono text-[11px] text-ink-soft">
                  <li>• AI Tools &amp; Cold Opener: Cloudflare Workers AI (Free)</li>
                  <li>• Database &amp; Files: Cloudflare D1 + R2 (Free)</li>
                  <li>• Inbound Mail: Cloudflare Email Routing → Read-Only Alert</li>
                  <li>• Outbound Mail: Brevo Free Tier (300/day free)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
