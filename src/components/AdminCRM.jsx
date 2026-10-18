import { outreachDraft, outreachFollowup } from '../lib/outreachCopy.js'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { analyzeSpamRisk, appendAntiSpamFooter } from '../lib/spamGuard.js'
import { parseProspectCsv } from '../lib/prospectCsv.js'

const STATUS_OPTIONS = ['New', 'Contacted', 'Quoted', 'Won', 'Archived']

function replaceColdTokens(text, prospect) {
  return String(text || '')
    .replace(/\{\{\s*name\s*\}\}/gi, prospect.name || 'there')
    .replace(/\{\{\s*business\s*\}\}/gi, prospect.business || 'your business')
    .replace(/\{\{\s*website\s*\}\}/gi, prospect.website || 'your site')
    .replace(/\{\{\s*niche\s*\}\}/gi, prospect.niche || 'your industry')
}

function getColdEmailPreview(prospect, isFollowup, coldSubject, coldBody) {
  const subjectTemplate = isFollowup && !coldSubject.startsWith('Re:') ? `Re: ${coldSubject}` : coldSubject
  const bodyTemplate = isFollowup
    ? outreachFollowup
    : coldBody
  const personalizedDraft = !isFollowup && prospect.custom_opener
  const subject = replaceColdTokens(
    personalizedDraft ? prospect.custom_subject || subjectTemplate : subjectTemplate,
    prospect,
  )
  const body = replaceColdTokens(personalizedDraft || bodyTemplate, prospect)

  return {
    subject,
    bodyBeforeFooter: body,
    body: appendAntiSpamFooter(body, true),
  }
}

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
  const [mailPreview, setMailPreview] = useState(null)
  const [mailPreviewIndex, setMailPreviewIndex] = useState(0)
  const [mailSending, setMailSending] = useState(false)
  const mailSendLock = useRef(false)
  const coldSendLock = useRef(false)

  const [coldSubTab, setColdSubTab] = useState('cron') // 'cron' | 'tracker' | 'import' | 'ai'
  const [cronTriggering, setCronTriggering] = useState(false)
  const [cronFeedback, setCronFeedback] = useState(null)
  const [aiProspect, setAiProspect] = useState({ name: '', email: '', business: '', website: '', niche: '' })
  const [aiGenerating, setAiGenerating] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [draftGenerating, setDraftGenerating] = useState(false)
  const [coldSending, setColdSending] = useState(false)
  const [coldBatchSize, setColdBatchSize] = useState(10)
  const [coldSendPreview, setColdSendPreview] = useState(null)
  const [coldPreviewIndex, setColdPreviewIndex] = useState(0)
  const [coldPreviewReviewed, setColdPreviewReviewed] = useState([])
  const [coldFilter, setColdFilter] = useState('all') // 'all' | 'Pending' | 'Sent' | 'Follow-up 1' | 'Replied'
  const [coldSubject, setColdSubject] = useState(outreachDraft({ business: '{{business}}' }).subject)
  const [coldBody, setColdBody] = useState(outreachDraft({ name: '{{name}}', business: '{{business}}' }).body)
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
    const keyToTry = adminKey || 'weezie-admin-2026'
    loadDashboard(keyToTry)
  }, [])

  function handleLogin(e) {
    e?.preventDefault?.()
    const trimmed = (inputKey || 'weezie-admin-2026').trim()
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

  function handleSendMail(e) {
    e.preventDefault()
    if (mailSending) return
    if (!mailSpamCheck.safe) {
      setMailStatus(`Blocked by Anti-Spam Guard: ${mailSpamCheck.issues.join(' ')}`)
      return
    }
    const recipients = mailMode === 'direct'
      ? [{ email: toEmail.trim(), name: toName.trim() }]
      : data.leads
        .filter((lead) => lead.email && Number(lead.subscribed) === 1 &&
          (broadcastAudience === 'all' || lead.source === broadcastAudience))
        .map((lead) => ({ email: lead.email, name: lead.name }))
        .filter((lead, index, list) => list.findIndex((item) => item.email === lead.email && item.name === lead.name) === index)
    if (!recipients.length) {
      setMailStatus('No subscribed recipients in this audience.')
      return
    }
    setMailPreviewIndex(0)
    setMailStatus('')
    const draft = {
      action: mailMode === 'direct' ? 'send_email' : 'send_broadcast',
      lead_id: selectedLeadId,
      from_email: fromEmail,
      to_email: toEmail.trim(),
      to_name: toName.trim(),
      audience: broadcastAudience,
      subject: subject.trim(),
      body: mailBody.trim(),
      attachment: mailAttachment,
      fallback_recipients: recipients,
      reviewed_recipients: recipients,
    }
    if (e.nativeEvent.submitter?.value === 'send') handleConfirmMailSend(draft)
    else setMailPreview(draft)
  }

  async function handleConfirmMailSend(draft = mailPreview) {
    if (!draft || mailSendLock.current) return
    mailSendLock.current = true
    setMailSending(true)
    setMailStatus('Sending...')
    try {
      const res = await postAdminAction(adminKey, draft)
      if (!res?.ok) {
        setMailStatus(res?.error || 'Could not send email.')
        return
      }
      setMailStatus(res.simulated
        ? 'Logged in CRM only; live email delivery is not configured.'
        : draft.action === 'send_email'
          ? `Email sent to ${draft.to_email}!`
          : `Broadcast sent to ${res.sentCount ?? draft.fallback_recipients.length} recipients!`)
      setMailPreview(null)
      setMailAttachment(null)
      await loadDashboard()
    } catch (error) {
      setMailStatus(`Send failed: ${error.message}`)
    } finally {
      mailSendLock.current = false
      setMailSending(false)
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
      setColdStatusMsg('✨ Approved email template personalized & loaded into your Campaign Composer below!')
    }
  }

  async function handleTriggerCronNow() {
    setCronTriggering(true)
    setCronFeedback(null)
    try {
      const res = await fetch(`/api/cron?key=${encodeURIComponent(adminKey)}`)
      const result = await res.json()
      setCronFeedback(result)
      await loadDashboard(adminKey)
    } catch (err) {
      setCronFeedback({ ok: false, error: err.message })
    } finally {
      setCronTriggering(false)
    }
  }

  // Cold Outreach Tool 2: CSV / Bulk Prospect Importer
  async function handleImportCSVText(e) {
    e.preventDefault()
    let parsed
    try {
      parsed = parseProspectCsv(csvText)
    } catch (error) {
      setColdStatusMsg(`❌ ${error.message}`)
      return
    }
    if (parsed.length === 0) {
      setColdStatusMsg('❌ No valid email addresses found. Include a name and email column, or use Name, email, Business, Website, Niche.')
      return
    }
    const result = await postAdminAction(adminKey, { action: 'import_cold_prospects', prospects: parsed })
    if (!result?.ok) {
      setColdStatusMsg(`❌ ${result?.error || 'Could not import prospects.'}`)
      return
    }
    setCsvText('')
    setColdStatusMsg(`✅ Imported ${result.importedCount ?? parsed.length} prospects. Generate and review personalized drafts in the tracker before sending.`)
    setColdSubTab('tracker')
    loadDashboard()
  }

  async function handleCSVFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setCsvText(await file.text())
      setColdStatusMsg(`Loaded ${file.name}. Review the rows, then import to your pipeline.`)
    } catch (error) {
      setColdStatusMsg(`❌ Could not read ${file.name}: ${error.message}`)
    } finally {
      e.target.value = ''
    }
  }

  async function handleGenerateBulkDrafts(targets, regenerate = false) {
    const prospects = targets.filter((prospect) => prospect.status === 'Pending' && (regenerate || !prospect.custom_opener))
    if (prospects.length === 0) {
      setColdStatusMsg('All selected pending prospects already have drafts.')
      return
    }

    setDraftGenerating(true)
    let drafted = 0
    let failed = 0
    let failureMessage = ''
    try {
      for (let index = 0; index < prospects.length; index += 10) {
        setColdStatusMsg(`Personalizing approved emails: ${Math.min(index + 10, prospects.length)} of ${prospects.length}…`)
        const result = await postAdminAction(adminKey, {
          action: 'generate_cold_drafts',
          prospects: prospects.slice(index, index + 10),
        })
        if (!result?.ok) {
          failed = prospects.length - index
          failureMessage = result?.error || 'The server could not generate this batch.'
          break
        }
        drafted += result.draftedCount || 0
      }
      await loadDashboard()
      setColdStatusMsg(
        failed
          ? `⚠️ Drafted ${drafted}; ${failed} could not be drafted. ${failureMessage}`
          : `✅ ${drafted} personalized drafts are ready to review. Nothing was sent.`,
      )
    } catch (error) {
      setColdStatusMsg(`❌ Draft generation failed: ${error.message}`)
    } finally {
      setDraftGenerating(false)
    }
  }

  // Cold Outreach Tool 3: Send Cold Campaign or Follow-Up
  function handlePreviewColdToTargets(targets, isFollowup = false, sendNow = false) {
    if (coldSendLock.current) return
    targets = (targets || []).filter((target) => target.email && target.status !== 'Unsubscribed')
    if (targets.length === 0) {
      setColdStatusMsg('❌ No prospects in this filter to send to.')
      return
    }

    const blocked = targets
      .map((prospect) => {
        const preview = getColdEmailPreview(prospect, isFollowup, coldSubject, coldBody)
        return { prospect, check: analyzeSpamRisk(preview.subject, preview.bodyBeforeFooter) }
      })
      .find(({ check }) => !check.safe)
    if (blocked) {
      setColdStatusMsg(
        `❌ Anti-Spam Guard blocked ${blocked.prospect.email} (Score ${blocked.check.score}/100): ${blocked.check.issues.join(' ')}`,
      )
      return
    }

    if (sendNow) {
      handleConfirmColdSend({ targets, isFollowup })
      return
    }
    setColdPreviewIndex(0)
    setColdPreviewReviewed([0])
    setColdSendPreview({ targets, isFollowup })
    setColdStatusMsg('')
  }

  async function handleConfirmColdSend(preview = coldSendPreview) {
    if (!preview || coldSendLock.current) return
    coldSendLock.current = true
    const { targets, isFollowup } = preview
    setColdSending(true)
    setColdStatusMsg(`Sending ${isFollowup ? 'follow-up' : 'cold email'} to ${targets.length} prospect(s)…`)
    const useSubject = isFollowup && !coldSubject.startsWith('Re:') ? `Re: ${coldSubject}` : coldSubject
    const useBody = isFollowup
      ? outreachFollowup
      : coldBody

    try {
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
        setColdSendPreview(null)
        await loadDashboard()
      } else {
        setColdStatusMsg(`❌ ${res?.error || 'Failed to send cold campaign'}`)
      }
    } catch (error) {
      setColdStatusMsg(`❌ Send failed: ${error.message}`)
    } finally {
      coldSendLock.current = false
      setColdSending(false)
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
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Admin password (default: weezie-admin-2026)"
                className="w-full rounded-2xl bg-paper px-4 py-3.5 text-sm font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
              />
            </div>
            {authErr && <p className="text-xs font-bold text-red-600">{authErr}</p>}
            
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
              >
                {loading ? 'Unlocking CRM…' : 'Open Admin CRM →'}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setInputKey('weezie-admin-2026')
                  loadDashboard('weezie-admin-2026')
                }}
                className="neu-hover rounded-full bg-paper px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-blue neu-sm hover:text-ink"
              >
                ⚡ 1-Click Unlock with Default Password
              </button>
            </div>
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
  const needsDraftList = coldList.filter((p) => p.status === 'Pending' && !p.custom_opener)
  const needsFollowupList = coldList.filter((p) => p.status === 'Sent')
  const pendingColdList = coldList.filter((p) => p.status === 'Pending')

  const filteredLeads = (data.leads || []).filter((l) => sourceFilter === 'all' || l.source === sourceFilter)
  const totalNgnRevenue = (data.orders || [])
    .filter((o) => o.currency === 'NGN')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0)
  const totalUsdRevenue = (data.orders || [])
    .filter((o) => o.currency === 'USD')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0)
  const activeColdPreview = coldSendPreview?.targets[coldPreviewIndex]
  const activeColdEmail = activeColdPreview
    ? getColdEmailPreview(activeColdPreview, coldSendPreview.isFollowup, coldSubject, coldBody)
    : null

  return (
    <section className="min-h-screen bg-paper px-6 py-12 md:px-10">
      {mailPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/60 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="mail-preview-title"
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-paper p-6 neu md:p-8">
            <h2 id="mail-preview-title" className="display text-2xl text-ink">Review before sending</h2>
            <p className="mt-3 text-sm text-ink-soft">Nothing sends until you confirm below.</p>
            <p className="mt-4 text-xs font-bold text-ink">Message {mailPreviewIndex + 1} of {mailPreview.fallback_recipients.length}</p>
            {mailPreview.fallback_recipients.length > 1 && (
              <div className="mt-3 flex gap-3">
                <button type="button" disabled={mailSending || mailPreviewIndex === 0}
                  onClick={() => setMailPreviewIndex((index) => index - 1)} className="rounded-full px-4 py-2 neu-sm disabled:opacity-40">Previous</button>
                <button type="button" disabled={mailSending || mailPreviewIndex === mailPreview.fallback_recipients.length - 1}
                  onClick={() => setMailPreviewIndex((index) => index + 1)} className="rounded-full px-4 py-2 neu-sm disabled:opacity-40">Next</button>
              </div>
            )}
            <div className="mt-4 rounded-2xl p-4 text-sm text-ink neu-inset">
              <p className="break-all"><strong>From:</strong> {mailPreview.from_email.startsWith('hello@') ? 'Enang Weezie Studio' : 'Enang Weezie'} &lt;{mailPreview.from_email}&gt;</p>
              <p className="mt-2 break-all"><strong>To:</strong> {mailPreview.fallback_recipients[mailPreviewIndex].name} &lt;{mailPreview.fallback_recipients[mailPreviewIndex].email}&gt;</p>
              <p className="mt-3 break-words"><strong>Subject:</strong> {mailPreview.subject}</p>
              <p className="mt-4 whitespace-pre-wrap break-words leading-relaxed">{mailPreview.action === 'send_broadcast'
                ? appendAntiSpamFooter(mailPreview.body.replace(/\{\{\s*name\s*\}\}/gi, mailPreview.fallback_recipients[mailPreviewIndex].name || 'there'), true)
                : mailPreview.body}</p>
              {mailPreview.attachment && <p className="mt-4 border-t border-ink/10 pt-3">Attachment: {mailPreview.attachment.name} ({Math.round(mailPreview.attachment.sizeBytes / 1024)} KB)</p>}
            </div>
            {mailStatus && <p role="status" className="mt-4 text-sm text-blue">{mailStatus}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button type="button" autoFocus disabled={mailSending} onClick={() => setMailPreview(null)}
                className="rounded-full px-5 py-3 text-xs font-bold neu-sm disabled:opacity-60">Back to editing</button>
              <button type="button" disabled={mailSending} onClick={() => handleConfirmMailSend()}
                className="btn-gradient rounded-full px-5 py-3 text-xs font-bold disabled:opacity-60">
                {mailSending ? 'Sending?' : mailPreview.action === 'send_email' ? 'Confirm and send email' : `Confirm and send broadcast (${mailPreview.fallback_recipients.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
      {coldSendPreview && activeColdPreview && activeColdEmail && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/60 p-4"
          role="presentation"
        >
          <div
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-paper p-6 neu md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cold-email-preview-title"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue">
                  {coldSendPreview.isFollowup ? 'Follow-up preview' : 'Cold email preview'}
                </p>
                <h2 id="cold-email-preview-title" className="display mt-1 text-2xl text-ink">
                  Review before sending
                </h2>
              </div>
              <button
                type="button"
                disabled={coldSending}
                onClick={() => setColdSendPreview(null)}
                className="rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink neu-sm disabled:opacity-60"
              >
                Close
              </button>
            </div>

            <p className="mt-4 rounded-xl bg-blue/10 p-3 text-xs font-medium leading-relaxed text-ink">
              This batch will send to <strong>{coldSendPreview.targets.length}</strong> recipient(s).
              Use the arrows to review messages. Nothing sends from this screen until you choose
              <strong> Send</strong>.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-ink">
                Message {coldPreviewIndex + 1} of {coldSendPreview.targets.length}
                <span className="ml-2 font-medium text-ink-soft">
                  · reviewed {coldPreviewReviewed.length}/{coldSendPreview.targets.length}
                </span>
              </p>
              {coldSendPreview.targets.length > 1 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setColdPreviewIndex((index) => Math.max(0, index - 1))}
                    disabled={coldPreviewIndex === 0 || coldSending}
                    className="rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink neu-sm disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = Math.min(coldSendPreview.targets.length - 1, coldPreviewIndex + 1)
                      setColdPreviewIndex(nextIndex)
                      setColdPreviewReviewed((reviewed) => (
                        reviewed.includes(nextIndex) ? reviewed : [...reviewed, nextIndex]
                      ))
                    }}
                    disabled={coldPreviewIndex === coldSendPreview.targets.length - 1 || coldSending}
                    className="rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink neu-sm disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 rounded-2xl bg-paper p-4 neu-inset">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">From</p>
              <p className="mt-1 text-sm text-ink">Enang Weezie &lt;enang@weezie.site&gt;</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">To</p>
              <p className="mt-1 break-all text-sm text-ink">
                {activeColdPreview.name ? `${activeColdPreview.name} · ` : ''}{activeColdPreview.email}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">Subject</p>
              <p className="mt-1 break-words text-sm font-bold text-ink">{activeColdEmail.subject}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">Message</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink">{activeColdEmail.body}</p>
              {coldAttachment && (
                <p className="mt-4 border-t border-ink/10 pt-3 text-xs font-medium text-ink-soft">
                  Attachment: {coldAttachment.name}
                </p>
              )}
            </div>

            {coldStatusMsg && <p role="status" className="mt-4 text-sm text-blue">{coldStatusMsg}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={coldSending}
                onClick={() => setColdSendPreview(null)}
                className="rounded-full bg-paper px-5 py-2.5 text-xs font-bold uppercase text-ink neu-sm disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={coldSending}
                onClick={() => handleConfirmColdSend()}
                className="btn-gradient rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] disabled:opacity-60"
              >
                {coldSending ? 'Sending...' : `Send (${coldSendPreview.targets.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
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
              href="/store/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/store/')
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
            ['cold', `2. Cold Email & Auto-Drip (${pendingColdList.length} Pending)`],
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
                  ['cron', `⏱️ 24h Auto-Drip (${pendingColdList.length} Pending)`],
                  ['tracker', `Prospect Tracker (${coldList.length})`],
                  ['import', 'CSV Importer'],
                  ['ai', 'AI Copy Generator'],
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
              {/* Left panel: Tool 1, Tool 2, Tool 3, or Cron Dashboard */}
              <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-6">
                {coldSubTab === 'cron' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="display text-xl text-ink">Automated 24h Drip Engine</h3>
                        <p className="text-xs font-medium text-ink-soft">
                          Drips pending cold emails over 24 hours at randomized intervals (~1 email every 14 minutes with natural human pacing).
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Cloud Cron Active (*/14m)
                      </span>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-2xl bg-paper p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Pending in Queue</p>
                        <p className="display mt-1 text-2xl text-blue">{pendingColdList.length}</p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">Waiting in queue</p>
                      </div>
                      <div className="rounded-2xl bg-paper p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Outreached</p>
                        <p className="display mt-1 text-2xl text-green-600">{coldList.filter((p) => p.status !== 'Pending').length}</p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">Total contacted</p>
                      </div>
                      <div className="rounded-2xl bg-paper p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Sending Cadence</p>
                        <p className="display mt-1 text-2xl text-ink">~1 / 14m</p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">~4.3 emails / hour</p>
                      </div>
                      <div className="rounded-2xl bg-paper p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Est. Time Remaining</p>
                        <p className="display mt-1 text-2xl text-ink">
                          {pendingColdList.length === 0 ? '0h' : `~${Math.round((pendingColdList.length * 14) / 60 * 10) / 10}h`}
                        </p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">Auto-adapts to queue</p>
                      </div>
                    </div>

                    {/* Continuous CSV Resumption Banner */}
                    <div className="rounded-2xl border border-blue/20 bg-blue/5 p-4 text-xs">
                      <p className="font-bold text-ink">📥 How Continuous Drip Works</p>
                      <p className="mt-1 text-ink-soft leading-relaxed">
                        Whenever you return and upload a new CSV in the <strong>CSV Importer</strong> tab, new prospects are added as <strong>Pending</strong>. The automated Cloudflare cron job will detect them and seamlessly continue dripping them out without any manual setup.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={cronTriggering || pendingColdList.length === 0}
                        onClick={handleTriggerCronNow}
                        className="btn-gradient rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                      >
                        {cronTriggering ? 'Sending Next Prospect…' : '⚡ Trigger Next Send Now'}
                      </button>
                      <button
                        type="button"
                        onClick={() => loadDashboard()}
                        className="rounded-full bg-paper px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink neu-sm hover:text-blue"
                      >
                        🔄 Refresh Queue
                      </button>
                      <button
                        type="button"
                        onClick={() => setColdSubTab('import')}
                        className="rounded-full bg-paper px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-blue neu-sm"
                      >
                        📂 Upload More Prospects (CSV)
                      </button>
                    </div>

                    {/* Feedback Toast */}
                    {cronFeedback && (
                      <div className={`rounded-xl p-3 text-xs ${cronFeedback.ok ? 'bg-green-500/10 text-green-800' : 'bg-red-500/10 text-red-800'}`}>
                        {cronFeedback.ok ? (
                          cronFeedback.sent ? (
                            <span>✅ Sent to <strong>{cronFeedback.sentTo?.email}</strong> ({cronFeedback.sentTo?.business}). {cronFeedback.remainingPending} prospects remaining in queue.</span>
                          ) : (
                            <span>ℹ️ {cronFeedback.message}</span>
                          )
                        ) : (
                          <span>❌ Error: {cronFeedback.error}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
                      {aiGenerating ? 'Preparing Email…' : 'Use Approved Email Template ⚡'}
                    </button>
                  </form>
                )}

                {coldSubTab === 'import' && (
                  <form onSubmit={handleImportCSVText} className="flex flex-col gap-3.5">
                    <h3 className="display text-xl text-ink">2. CSV / Bulk Prospect Importer</h3>
                    <p className="text-xs font-medium text-ink-soft">
                      Upload or paste a CSV with an email column. Name, business, website and industry columns are optional;
                      extra columns such as IDs are ignored. Headerless rows are also supported when an email is present.
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
                      placeholder={`ID,Contact Name,Email,Company,Website,Industry\n5,Matt Meline,matt@example.com,Allgreen Tree Service,https://allgreen.example,Landscaping`}
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
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-ink-soft">
                          Batch size
                          <select
                            value={coldBatchSize}
                            onChange={(event) => setColdBatchSize(Number(event.target.value))}
                            className="rounded-full bg-paper px-3 py-2 text-xs text-ink neu-sm"
                          >
                            {[5, 10, 25, 50].map((size) => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </label>
                        {pendingColdList.some((prospect) => prospect.custom_opener) && (
                          <button type="button" disabled={draftGenerating || coldSending} onClick={() => handleGenerateBulkDrafts(pendingColdList, true)} className="rounded-full px-4 py-2 text-xs font-bold neu-sm disabled:opacity-60">Rewrite pending drafts</button>
                        )}
                        {needsDraftList.length > 0 && (
                          <button
                            type="button"
                            disabled={draftGenerating || coldSending}
                            onClick={() => handleGenerateBulkDrafts(needsDraftList)}
                            className="btn-gradient rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] disabled:opacity-60"
                          >
                            {draftGenerating ? 'Drafting…' : `Draft ${needsDraftList.length} Personalized Emails ✨`}
                          </button>
                        )}
                        {needsFollowupList.length > 0 && (
                        <><button type="button" disabled={draftGenerating || coldSending} onClick={() => handlePreviewColdToTargets(needsFollowupList.slice(0, coldBatchSize), true)} className="btn-gradient rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] disabled:opacity-60">Review follow-ups</button>
                          <button type="button" disabled={draftGenerating || coldSending} onClick={() => handlePreviewColdToTargets(needsFollowupList.slice(0, coldBatchSize), true, true)} className="btn-gradient rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] disabled:opacity-60">Send follow-ups</button></>
                        )}
                        {pendingColdList.length > 0 && (
                          <><button type="button" disabled={draftGenerating || coldSending} onClick={() => handlePreviewColdToTargets(pendingColdList.slice(0, coldBatchSize), false)} className="btn-gradient rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] disabled:opacity-60">Review batch</button>
                          <button type="button" disabled={draftGenerating || coldSending} onClick={() => handlePreviewColdToTargets(pendingColdList.slice(0, coldBatchSize), false, true)} className="btn-gradient rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] disabled:opacity-60">Send batch</button></>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-medium text-ink-soft">
                      Review opens the message. Send delivers immediately. Rewrite pending drafts replaces existing unsent copy with the new approach; drafting never sends email.
                    </p>

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
                              {p.custom_opener && (
                                <details className="mt-2 max-w-xl rounded-xl bg-paper p-3 neu-inset">
                                  <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.08em] text-blue">
                                    Review personalized draft
                                  </summary>
                                  <p className="mt-2 text-xs font-bold text-ink">{p.custom_subject || `A website idea for ${p.business || 'your business'}`}</p>
                                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-ink-soft">{p.custom_opener}</p>
                                </details>
                              )}
                            </div>
                            <div className="flex gap-1.5">
                              <><button type="button" disabled={draftGenerating || coldSending || p.status === 'Unsubscribed'} onClick={() => handlePreviewColdToTargets([p], p.status !== 'Pending')} className="btn-gradient rounded-full px-3 py-1.5 text-[10px] font-bold uppercase disabled:opacity-60">Review</button>
                          <button type="button" disabled={draftGenerating || coldSending || p.status === 'Unsubscribed'} onClick={() => handlePreviewColdToTargets([p], p.status !== 'Pending', true)} className="btn-gradient rounded-full px-3 py-1.5 text-[10px] font-bold uppercase disabled:opacity-60">Send</button></>
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

              {/* Right panel: Live Activity Stream (when cron) OR Cold Campaign Composer */}
              <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-6">
                {coldSubTab === 'cron' ? (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="display text-xl text-ink">Recent Drip Activity</h3>
                      <span className="text-xs font-bold text-ink-soft">
                        {coldList.filter((p) => p.status !== 'Pending').length} contacted
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-ink-soft">
                      Real-time audit log of prospects contacted by the automated engine.
                    </p>

                    <div className="mt-4 max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
                      {coldList.filter((p) => p.status !== 'Pending').length === 0 ? (
                        <div className="rounded-2xl bg-paper p-8 text-center neu-inset">
                          <p className="text-xs text-ink-soft">No emails sent yet. Trigger the first send above or wait for the next cron tick.</p>
                        </div>
                      ) : (
                        coldList
                          .filter((p) => p.status !== 'Pending')
                          .slice(0, 25)
                          .map((p) => (
                            <div key={p.id} className="flex items-center justify-between rounded-xl bg-paper p-3 text-xs neu-sm">
                              <div className="min-w-0 pr-2">
                                <p className="truncate font-bold text-ink">
                                  {p.name} · <span className="font-normal text-ink-soft">{p.business || p.email}</span>
                                </p>
                                <p className="truncate text-[11px] text-ink-soft">{p.email}</p>
                                {p.last_contacted_at && (
                                  <p className="text-[10px] text-blue">Contacted: {new Date(p.last_contacted_at).toLocaleString()}</p>
                                )}
                              </div>
                              <span className="shrink-0 rounded-full bg-green-500/15 px-2.5 py-1 text-[10px] font-bold text-green-700">
                                {p.status || 'Sent'} ✅
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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

                </div>
              </>
            )}
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

                <div className="flex flex-wrap gap-3">
                  <button type="submit" value="review" disabled={mailSending} className="rounded-full px-8 py-4 text-xs font-bold neu-sm disabled:opacity-60">Review</button>
                  <button type="submit" value="send" disabled={mailSending} className="btn-gradient rounded-full px-8 py-4 text-xs font-bold disabled:opacity-60">{mailSending ? 'Sending...' : 'Send'}</button>
                </div>
                <p className="text-xs text-ink-soft">Send delivers immediately. Choose Review to check the message first.</p>
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
