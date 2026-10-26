import { outreachDraft, outreachFollowup } from '../lib/outreachCopy.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { storeCategories, senderEmails, crmEmailTemplates } from '../data.js'
import {
  getSavedAdminKey,
  setSavedAdminKey,
  getPaystackPublicKey,
  setPaystackPublicKey,
  getPaystackSecretKey,
  setPaystackSecretKey,
  fetchAdminDashboard,
  postAdminAction,
  uploadAnyFile,
  readFileAsBase64,
} from '../lib/crmStore.js'
import { analyzeSpamRisk, appendAntiSpamFooter } from '../lib/spamGuard.js'
import { parseProspectCsv, exportToCsv } from '../lib/prospectCsv.js'
import { engagementFor, hasEstimatedOpen, hasSuspectedOpen, hasUnverifiedOpen, trackingTime } from '../lib/emailEngagement.js'
import OutreachAnalytics, { prospectKey } from './OutreachAnalytics.jsx'
import ProspectEngagement from './ProspectEngagement.jsx'

const STATUS_OPTIONS = ['New', 'Contacted', 'Quoted', 'Won', 'Archived']

const PROSPECT_COLUMNS = [
  { key: 'name', label: 'Contact Name' },
  { key: 'business', label: 'Company / Business' },
  { key: 'email', label: 'Email Address' },
  { key: 'website', label: 'Website URL' },
  { key: 'niche', label: 'Niche / Industry' },
  { key: 'status', label: 'Current Status' },
  { key: 'open_count', label: 'Legacy Initial Loads (All Classes)', accessor: (p) => p.open_count || 0 },
  { key: 'initial_estimated', label: 'Estimated Initial Opens', accessor: p => engagementFor(p).initial.estimated },
  { key: 'initial_recorded', label: 'Recorded Initial Signals (All Classes)', accessor: p => engagementFor(p).initial.recorded },
  { key: 'initial_suspected', label: 'Suspected Initial Automation', accessor: p => engagementFor(p).initial.suspected },
  { key: 'initial_proxy', label: 'Initial Proxy Loads', accessor: p => engagementFor(p).initial.proxy },
  { key: 'initial_unverified', label: 'Unverified Initial Loads', accessor: p => engagementFor(p).initial.unverified },
  { key: 'initial_evidence', label: 'Initial Historical Evidence', accessor: p => engagementFor(p).initial.reason },
  { key: 'followup_count', label: 'Followup Sent Count', accessor: (p) => p.followup_count || 0 },
  { key: 'followup_open_count', label: 'Legacy Followup Loads (All Classes)', accessor: (p) => p.followup_open_count || 0 },
  { key: 'followup_estimated', label: 'Estimated Followup Opens', accessor: p => engagementFor(p).followup.estimated },
  { key: 'followup_recorded', label: 'Recorded Followup Signals (All Classes)', accessor: p => engagementFor(p).followup.recorded },
  { key: 'followup_suspected', label: 'Suspected Followup Automation', accessor: p => engagementFor(p).followup.suspected },
  { key: 'followup_proxy', label: 'Followup Proxy Loads', accessor: p => engagementFor(p).followup.proxy },
  { key: 'followup_unverified', label: 'Unverified Followup Loads', accessor: p => engagementFor(p).followup.unverified },
  { key: 'unknown_recorded', label: 'Unattributed Recorded Loads', accessor: p => engagementFor(p).unknown.recorded },
  { key: 'opened_at', label: 'Legacy Initial First Load At (UTC)', accessor: (p) => p.opened_at || '' },
  { key: 'followup_opened_at', label: 'Legacy Followup First Load At (UTC)', accessor: (p) => p.followup_opened_at || '' },
  { key: 'initial_estimated_at', label: 'Latest Estimated Initial Open At (UTC)', accessor: p => engagementFor(p).initial.estimatedAt },
  { key: 'followup_estimated_at', label: 'Latest Estimated Followup Open At (UTC)', accessor: p => engagementFor(p).followup.estimatedAt },
  { key: 'last_contacted_at', label: 'Last Contacted', accessor: (p) => p.last_contacted_at || p.sent_at || '' },
  { key: 'custom_opener', label: 'AI Custom Pitch', accessor: (p) => p.custom_opener || '' },
  { key: 'created_at', label: 'Created At', accessor: (p) => p.created_at || '' },
]

const LEAD_COLUMNS = [
  { key: 'name', label: 'Lead Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'source', label: 'Lead Source' },
  { key: 'status', label: 'Lead Status' },
  { key: 'plan', label: 'Requested Plan / Pack' },
  { key: 'budget', label: 'Budget Range' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'message', label: 'Message / Notes' },
  { key: 'created_at', label: 'Submitted Date' },
]

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
  const [authed, setAuthed] = useState(() => Boolean(getSavedAdminKey()))
  const [loading, setLoading] = useState(false)
  const [authErr, setAuthErr] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Tabs: 'inbox' | 'cold' | 'mail' | 'leads' | 'store' | 'orders'
  const [tab, setTab] = useState('inbox')
  const [data, setData] = useState({
    d1Connected: false,
    brevoConfigured: false,
    paystackConfigured: false,
    paystackPublicKey: '',
    paystackSecretKeySet: false,
    paystackIsTest: false,
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
  const [analyticsSelection, setAnalyticsSelection] = useState(null)
  const [coldSubject, setColdSubject] = useState(outreachDraft({ business: '{{business}}' }).subject)
  const [coldBody, setColdBody] = useState(outreachDraft({ name: '{{name}}', business: '{{business}}' }).body)
  const [coldAttachment, setColdAttachment] = useState(null)
  const [coldStatusMsg, setColdStatusMsg] = useState('')
  const [coldSearch, setColdSearch] = useState('')
  const [displayLimit, setDisplayLimit] = useState(25)
  const [showColdTemplateEditor, setShowColdTemplateEditor] = useState(false)

  // Product editor + universal file upload state
  const [editingProduct, setEditingProduct] = useState(EMPTY_PRODUCT)
  const [prodStatus, setProdStatus] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)

  // Paystack gateway settings (Public & Secret keys, Test/Live)
  const [paystackPk, setPaystackPk] = useState(getPaystackPublicKey)
  const [paystackSk, setPaystackSk] = useState(getPaystackSecretKey)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [savingKeys, setSavingKeys] = useState(false)
  const [keysFeedback, setKeysFeedback] = useState('')
  const [pkSaved, setPkSaved] = useState(false)
  const [copiedWebhook, setCopiedWebhook] = useState(false)
  const [copiedCallback, setCopiedCallback] = useState(false)

  // Live Anti-Spam Deliverability Checkers
  const mailSpamCheck = useMemo(() => analyzeSpamRisk(subject, mailBody), [subject, mailBody])
  const coldSpamCheck = useMemo(() => analyzeSpamRisk(coldSubject, coldBody), [coldSubject, coldBody])

  async function handleSavePaystackKeys(e) {
    e?.preventDefault?.()
    setSavingKeys(true)
    setKeysFeedback('')
    try {
      const cleanPk = paystackPk.trim()
      const cleanSk = paystackSk.trim()
      await postAdminAction(adminKey, {
        action: 'save_paystack_keys',
        publicKey: cleanPk,
        secretKey: cleanSk,
      })
      setPaystackPublicKey(cleanPk)
      setPaystackSecretKey(cleanSk)
      setKeysFeedback('✅ Paystack keys saved to database successfully!')
      setPkSaved(true)
      await loadDashboard(adminKey)
    } catch (err) {
      setKeysFeedback(`❌ Failed to save keys: ${err?.message || 'Network error'}`)
    } finally {
      setSavingKeys(false)
    }
  }

  async function loadDashboard(keyToUse = adminKey) {
    if (!keyToUse) {
      setAuthed(false)
      return
    }
    setLoading(true)
    setAuthErr('')
    const res = await fetchAdminDashboard(keyToUse)
    setLoading(false)
    if (res?.ok) {
      setAuthed(true)
      setSavedAdminKey(keyToUse)
      setData(res)
      if (res.paystackPublicKey && !paystackPk) {
        setPaystackPk(res.paystackPublicKey)
      }
    } else if (res?.unauthorized) {
      setAuthed(false)
      setSavedAdminKey('')
      setAuthErr(res?.error || 'Invalid admin password. Please try again.')
    } else {
      // Keep dashboard authed on network glitch or local mode
      setAuthed(true)
    }
  }

  useEffect(() => {
    const saved = getSavedAdminKey()
    if (saved) {
      loadDashboard(saved)
    } else {
      setAuthed(false)
    }
  }, [])

  function handleLogin(e) {
    e?.preventDefault?.()
    const trimmed = inputKey.trim()
    if (!trimmed) {
      setAuthErr('Please enter your admin password.')
      return
    }
    setAdminKey(trimmed)
    loadDashboard(trimmed)
  }

  function handleLogout() {
    setSavedAdminKey('')
    setAdminKey('')
    setInputKey('')
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
    let validTargets = (targets || []).filter((target) => target.email && target.status !== 'Unsubscribed')
    if (isFollowup && validTargets.length > 1) {
      validTargets = validTargets.filter((t) => Number(t.followup_count || 0) === 0 && t.status !== 'Follow-up Sent' && t.status !== 'Follow-up Opened')
    }
    if (validTargets.length === 0) {
      setColdStatusMsg('ℹ️ All selected prospects have already received a follow-up and are protected from resending.')
      return
    }
    targets = validTargets

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

  async function handleClearQueue() {
    if (!window.confirm(`Are you sure you want to remove all ${pendingColdList.length} pending prospects from the queue?`)) return
    await postAdminAction(adminKey, { action: 'clear_queue' })
    await loadDashboard()
  }

  async function handleClearSales() {
    if (!window.confirm(`Are you sure you want to clear all ${ordersList.length} sales and orders?`)) return
    await postAdminAction(adminKey, { action: 'clear_sales' })
    await loadDashboard()
  }

  async function handleDeleteOrder(id, reference) {
    if (!window.confirm('Delete this order record?')) return
    await postAdminAction(adminKey, { action: 'delete_order', id, reference })
    await loadDashboard()
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
      <section className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 sm:px-6 md:px-10">
        <div className="w-full max-w-md rounded-[28px] bg-paper p-6 neu sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">// weezie.site · Admin CRM</p>
          <h1 className="display mt-2 text-3xl text-ink sm:text-4xl">CRM Login.</h1>
          <p className="mt-2 text-xs font-medium leading-relaxed text-ink-soft">
            Enter your admin password to access your dedicated <strong>enang@weezie.site</strong> inbox, cold outreach engine, store catalogue, and CRM records.
          </p>

          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value)
                    if (authErr) setAuthErr('')
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full rounded-2xl bg-paper px-4 py-3.5 pr-16 text-sm font-medium text-ink outline-none neu-inset focus:ring-2 focus:ring-blue/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-ink-soft hover:text-ink transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {authErr && (
              <div className="rounded-xl bg-red-500/10 p-3 text-xs font-bold text-red-600">
                {authErr}
              </div>
            )}
            
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading || !inputKey.trim()}
                className="btn-gradient w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-50"
              >
                {loading ? 'Verifying Password…' : 'Unlock Admin CRM →'}
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

  const leadsList = Array.isArray(data?.leads) ? data.leads : []
  const productsList = Array.isArray(data?.products) ? data.products : []
  const ordersList = Array.isArray(data?.orders) ? data.orders : []
  const emailsList = Array.isArray(data?.emails) ? data.emails : []
  const inboxList = Array.isArray(data?.inbox) ? data.inbox : []
  const coldList = Array.isArray(data?.coldProspects) ? data.coldProspects : []
  const uploadedFilesList = Array.isArray(data?.uploadedFiles) ? data.uploadedFiles : []

  const unreadCount = inboxList.filter((m) => !m.is_read).length
  const filteredInbox = inboxList.filter((m) => mailboxFilter === 'all' || m.mailbox === mailboxFilter)

  const pendingColdList = coldList.filter((p) => p.status === 'Pending')
  const sentColdList = coldList.filter((p) => ['Sent', 'Opened'].includes(p.status) && !hasEstimatedOpen(p) && Number(p.followup_count || 0) === 0)
  
  // Estimated initial opens are independent of the current sales stage.
  const initialOpenedColdList = coldList.filter(
    (p) =>
      hasEstimatedOpen(p),
  )

  // Follow-up Sent (dispatched, waiting for open)
  const followupSentList = coldList.filter(
    (p) =>
      Number(p.followup_count || 0) > 0 && !hasEstimatedOpen(p, 'followup') && !['Replied', 'Unsubscribed'].includes(p.status),
  )

  // Follow-up Opened (estimated provider opens for follow-up emails)
  const followupOpenedList = coldList.filter(
    (p) =>
      hasEstimatedOpen(p, 'followup'),
  )

  const repliedColdList = coldList.filter((p) => p.status === 'Replied')
  const unsubscribedColdList = coldList.filter((p) => p.status === 'Unsubscribed')

  // Total unique prospects who opened ANY outreach email
  const allOpenedColdList = coldList.filter(
    (p) =>
      hasEstimatedOpen(p, 'all'),
  )
  const openedColdList = allOpenedColdList

  const sentColdCount = coldList.filter((p) => p.last_contacted_at || ['Sent', 'Opened', 'Follow-up Sent', 'Follow-up Opened', 'Follow-up 1', 'Follow-up 2', 'Replied', 'Unsubscribed'].includes(p.status)).length
  const coldOpenRate = sentColdCount > 0 ? Math.round((allOpenedColdList.length / sentColdCount) * 100) : 0

  // Needs follow-up: Outreached (Sent or Opened), but ZERO follow-ups sent yet, AND not already followed up!
  const needsFollowupList = coldList.filter(
    (p) =>
      (p.status === 'Sent' || p.status === 'Opened' || Number(p.open_count || 0) > 0) &&
      Number(p.followup_count || 0) === 0 &&
      p.status !== 'Follow-up Sent' &&
      p.status !== 'Follow-up Opened' &&
      p.status !== 'Follow-up 1' &&
      p.status !== 'Replied' &&
      p.status !== 'Unsubscribed',
  )

  // Priority follow-up: specifically those who opened the initial email and haven't received a follow-up yet!
  const openedNeedsFollowupList = needsFollowupList.filter(
    (p) => hasEstimatedOpen(p),
  )

  const needsDraftList = coldList.filter((p) => p.status === 'Pending' && !p.custom_opener)

  const filteredCold = coldList.filter((p) => {
    if (analyticsSelection && !analyticsSelection.keys.includes(prospectKey(p))) return false
    // 1. Status Filter
    if (coldFilter === 'Pending' && p.status !== 'Pending') return false
    if (coldFilter === 'Sent' && !sentColdList.includes(p)) return false
    if (coldFilter === 'Opened') {
      const isInitialOpened = hasEstimatedOpen(p)
      if (!isInitialOpened) return false
    }
    if (coldFilter === 'Follow-up Sent') {
      const isFUSent = followupSentList.includes(p)
      if (!isFUSent) return false
    }
    if (coldFilter === 'Follow-up Opened') {
      const isFUOpened = hasEstimatedOpen(p, 'followup')
      if (!isFUOpened) return false
    }
    if (coldFilter === 'Replied' && p.status !== 'Replied') return false
    if (coldFilter === 'Unsubscribed' && p.status !== 'Unsubscribed') return false
    if (coldFilter === 'Suspected' && !hasSuspectedOpen(p)) return false
    if (coldFilter === 'Unverified' && !hasUnverifiedOpen(p)) return false

    // 2. Search Filter
    if (coldSearch && coldSearch.trim()) {
      const q = coldSearch.trim().toLowerCase()
      const matchName = (p.name || '').toLowerCase().includes(q)
      const matchEmail = (p.email || '').toLowerCase().includes(q)
      const matchBiz = (p.business || '').toLowerCase().includes(q)
      const matchNiche = (p.niche || '').toLowerCase().includes(q)
      if (!matchName && !matchEmail && !matchBiz && !matchNiche) return false
    }
    return true
  })

  const filteredLeads = leadsList.filter((l) => sourceFilter === 'all' || l.source === sourceFilter)
  const totalNgnRevenue = ordersList
    .filter((o) => o.currency === 'NGN')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0)
  const totalUsdRevenue = ordersList
    .filter((o) => o.currency === 'USD')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0)
  const activeColdPreview = coldSendPreview?.targets[coldPreviewIndex]
  const activeColdEmail = activeColdPreview
    ? getColdEmailPreview(activeColdPreview, coldSendPreview.isFollowup, coldSubject, coldBody)
    : null

  return (
    <section className="min-h-screen bg-paper px-2 sm:px-6 py-4 sm:py-10 md:px-10 overflow-x-hidden w-full max-w-full">
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
      <div className="mx-auto max-w-7xl w-full min-w-0">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">
              // weezie.site · Webmail, Cold Outreach, CRM &amp; Store
            </p>
            <h1 className="display mt-1 text-2xl sm:text-4xl md:text-5xl text-ink">WEEZIE CONTROL CENTER</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="/store/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/store/')
                }
              }}
              className="neu-hover rounded-full bg-paper px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm"
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
              className="neu-hover rounded-full bg-paper px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink neu-sm"
            >
              Portfolio ↗
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-ink px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Status pills & KPIs */}
        <div className="mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-paper p-4 sm:p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
              Dedicated Inbox (@weezie.site)
            </span>
            <p className="display mt-1 text-2xl sm:text-3xl text-ink">
              {inboxList.length}{' '}
              {unreadCount > 0 && <span className="text-sm font-bold text-blue">({unreadCount} unread)</span>}
            </p>
            <span className="mt-1 block text-[11px] font-medium text-blue">
              Read-only alerts active → Gmail
            </span>
          </div>

          <div className="rounded-2xl bg-paper p-4 sm:p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
              Cold Outreach &amp; Anti-Spam
            </span>
            <p className="display mt-1 text-2xl sm:text-3xl text-ink">{coldList.length} prospects</p>
            <span className="mt-1 block text-[11px] font-medium text-green-700">
              🛡️ SPF + DKIM + DMARC Active
            </span>
          </div>

          <div className="rounded-2xl bg-paper p-4 sm:p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">CRM Leads &amp; Store</span>
            <p className="display mt-1 text-2xl sm:text-3xl text-ink">
              {leadsList.length} leads · {productsList.length} items
            </p>
            <span className="mt-1 block text-[11px] font-medium text-ink-soft">
              {data.d1Connected ? '🟢 Cloudflare D1 Active' : '🟢 Local + Seed Store Active'}
            </span>
          </div>

          <div className="rounded-2xl bg-paper p-4 sm:p-5 neu-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">Store &amp; AI Revenue</span>
            <p className="display mt-1 text-xl sm:text-2xl text-ink">
              ${totalUsdRevenue.toLocaleString('en-US')} · ₦{totalNgnRevenue.toLocaleString('en-US')}
            </p>
            <span className="mt-1 block text-[11px] font-medium text-ink-soft">{ordersList.length} paid orders</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 sm:mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          {[
            ['inbox', 'Inbox', `1. Inbox (${inboxList.length})`],
            ['cold', 'Cold Email', `2. Cold Email & Auto-Drip (${pendingColdList.length} Pending)`],
            ['mail', 'Compose', `3. Compose & Broadcast (${emailsList.length})`],
            ['leads', 'Leads', `4. Leads & Briefs (${leadsList.length})`],
            ['store', 'Store', `5. Store & File Uploader (${productsList.length})`],
            ['orders', 'Orders', `6. Orders & Keys (${ordersList.length})`],
          ].map(([id, shortLabel, fullLabel]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`shrink-0 rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] transition whitespace-nowrap ${
                tab === id ? 'btn-gradient text-white' : 'neu-hover bg-paper text-ink-soft neu-sm hover:text-ink'
              }`}
            >
              <span className="sm:hidden">{shortLabel} ({id === 'cold' ? pendingColdList.length : id === 'inbox' ? inboxList.length : id === 'mail' ? emailsList.length : id === 'leads' ? leadsList.length : id === 'store' ? productsList.length : ordersList.length})</span>
              <span className="hidden sm:inline">{fullLabel}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: DEDICATED INBOX FOR ENANG@WEEZIE.SITE & HELLO@WEEZIE.SITE */}
        {tab === 'inbox' && (
          <div className="mt-6 sm:mt-8 rounded-[28px] bg-paper p-4 sm:p-6 neu">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="display text-xl sm:text-2xl text-ink">Dedicated @weezie.site Inbox</h2>
                <p className="mt-1 text-xs font-medium text-ink-soft">
                  All incoming messages to <strong>enang@weezie.site</strong> &amp; <strong>hello@weezie.site</strong>{' '}
                  land here. Your main Gmail receives a read-only alert so you can log in here and reply as your custom
                  domain.
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none sm:flex-wrap">
                {[
                  ['all', 'All Mailboxes'],
                  ['enang@weezie.site', 'enang@weezie.site'],
                  ['hello@weezie.site', 'hello@weezie.site'],
                ].map(([mb, label]) => (
                  <button
                    key={mb}
                    type="button"
                    onClick={() => setMailboxFilter(mb)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${
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
                    className={`rounded-2xl bg-paper p-4 sm:p-5 neu-sm ${!msg.is_read ? 'ring-2 ring-blue/40' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
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
                        <h3 className="display mt-2 text-base sm:text-lg text-ink break-words">{msg.subject}</h3>
                        <p className="text-xs font-bold text-ink-soft break-all">
                          From: {msg.from_name ? `${msg.from_name} (${msg.from_email})` : msg.from_email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
                        <button
                          type="button"
                          onClick={() => replyToInboxMessage(msg)}
                          className="btn-gradient rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-[0.1em]"
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
                    <p className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-paper p-3.5 font-mono text-xs leading-relaxed text-ink neu-inset">
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
          <div className="mt-8 space-y-8 w-full min-w-0 max-w-full">
            {/* Sub-tool picker */}
            <div className="flex flex-col gap-4 rounded-[28px] bg-paper p-4 sm:p-6 neu w-full min-w-0 max-w-full">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue">
                  // Zero API Credits Needed · Powered by Free Cloudflare Workers AI + Anti-Spam Guard
                </p>
                <h2 className="display mt-1 text-xl sm:text-2xl text-ink">Cold Email Outreach Suite (enang@weezie.site)</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none flex-nowrap sm:flex-wrap shrink-0 max-w-full">
                {[
                  ['cron', `⏱️ 24h Auto-Drip (${pendingColdList.length} Pending)`],
                  ['tracker', `Prospect Tracker (${coldList.length}) · ${allOpenedColdList.length} Estimated Opens`],
                  ['import', 'CSV Importer'],
                  ['ai', 'AI Copy Generator'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setColdSubTab(id)}
                    className={`shrink-0 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] whitespace-nowrap ${
                      coldSubTab === id ? 'btn-gradient text-white' : 'bg-paper text-ink-soft neu-sm'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <OutreachAnalytics prospects={coldList} webhookConfigured={data.trackingWebhookConfigured} connected={data.d1Connected} selection={analyticsSelection}
              onInspect={selection => {
                setAnalyticsSelection(selection)
                if (selection) {
                  setColdSubTab('tracker')
                  setColdFilter('all')
                  setColdSearch('')
                  setDisplayLimit(25)
                }
              }} />
            {analyticsSelection && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-blue/5 p-4 text-sm text-ink" role="status">
              <span>Showing {analyticsSelection.label}</span>
              <button type="button" onClick={() => setAnalyticsSelection(null)} className="rounded-full px-4 py-2 font-bold neu-sm">Clear graph selection</button>
            </div>}
            <div className="grid gap-8 lg:grid-cols-12 w-full min-w-0 max-w-full">
              {/* Left panel: Tool 1, Tool 2, Tool 3, or Cron Dashboard */}
              <div className={`rounded-[28px] bg-paper p-4 sm:p-6 neu w-full min-w-0 max-w-full overflow-hidden ${coldSubTab === 'tracker' ? 'lg:col-span-12' : 'lg:col-span-6'}`}>
                {coldSubTab === 'cron' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="display text-xl text-ink">Automated 24h Drip Engine</h3>
                        <p className="text-xs font-medium text-ink-soft">
                          Drips pending cold emails over 24 hours at randomized intervals (~1 email every 6 minutes with natural human pacing).
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Cloud Cron Active (*/6m)
                      </span>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5">
                      <div className="rounded-2xl bg-paper p-3 sm:p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Pending</p>
                        <p className="display mt-1 text-xl sm:text-2xl text-blue">{pendingColdList.length}</p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">In queue</p>
                      </div>
                      <div className="rounded-2xl bg-paper p-3 sm:p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Outreached</p>
                        <p className="display mt-1 text-xl sm:text-2xl text-green-600">{sentColdCount}</p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">Total sent</p>
                      </div>
                      <div className="rounded-2xl bg-paper p-3 sm:p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Estimated opens</p>
                        <p className="display mt-1 text-xl sm:text-2xl text-indigo-600">
                          {allOpenedColdList.length} <span className="text-xs font-semibold text-ink-soft">({coldOpenRate}%)</span>
                        </p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">Share of contacted prospects</p>
                      </div>
                      <div className="rounded-2xl bg-paper p-3 sm:p-4 neu-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Cadence</p>
                        <p className="display mt-1 text-xl sm:text-2xl text-ink">~1 / 6m</p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">~10 / hour</p>
                      </div>
                      <div className="rounded-2xl bg-paper p-3 sm:p-4 neu-sm col-span-2 lg:col-span-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Est. Time</p>
                        <p className="display mt-1 text-xl sm:text-2xl text-ink">
                          {pendingColdList.length === 0 ? '0h' : `~${Math.round((pendingColdList.length * 6) / 60 * 10) / 10}h`}
                        </p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">Auto-adapts</p>
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
                      {pendingColdList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearQueue}
                          className="rounded-full bg-paper px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 neu-sm hover:bg-red-50 transition"
                          title="Remove all pending prospects from queue"
                        >
                          🗑️ Clear Queue ({pendingColdList.length})
                        </button>
                      )}
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
                  <div className="space-y-5 w-full min-w-0 max-w-full">
                    {/* Header & Overall Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0 max-w-full">
                      <div className="min-w-0 flex-1">
                        <h3 className="display text-xl sm:text-2xl text-ink">3. Prospect &amp; Follow-Up Tracker</h3>
                        <p className="mt-1 text-xs text-ink-soft">
                          {coldList.length} Total Prospects · {pendingColdList.length} Pending · {sentColdList.length} Initial Sent · <span className="font-bold text-blue">{initialOpenedColdList.length} Estimated Initial Opens</span> · <span className="font-bold text-purple-700">{coldList.filter(p => Number(p.followup_count || 0) > 0).length} Followed Up</span> · <span className="font-bold text-amber-600">{followupOpenedList.length} Estimated Follow-up Opens</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowColdTemplateEditor(!showColdTemplateEditor)}
                          className="rounded-full bg-paper px-3.5 sm:px-4 py-2 text-xs font-bold text-blue neu-sm hover:underline"
                        >
                          {showColdTemplateEditor ? '▲ Close Template Editor' : '✏️ View & Edit Email Templates'}
                        </button>
                        <button
                          type="button"
                          onClick={() => loadDashboard()}
                          className="rounded-full bg-paper px-3 py-2 text-xs font-bold text-ink neu-sm"
                          title="Refresh Queue"
                        >
                          🔄 Refresh
                        </button>
                      </div>
                    </div>

                    {/* Resend Safety & Action Bar */}
                    <div className="rounded-2xl bg-paper p-4 neu-inset w-full min-w-0 max-w-full">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full min-w-0 max-w-full">
                        <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                          <span className="text-xs font-bold text-green-700 bg-green-500/15 border border-green-500/20 px-3 py-1 rounded-full shrink-0">
                            🛡️ Resend Protection Active
                          </span>
                          <span className="text-[11px] text-ink-soft">
                            {followupSentList.length + followupOpenedList.length} prospect(s) already followed up are locked from accidental re-batching.
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-ink-soft shrink-0">
                            Batch
                            <select
                              value={coldBatchSize}
                              onChange={(e) => setColdBatchSize(Number(e.target.value))}
                              className="rounded-full bg-paper px-2.5 py-1 text-xs font-bold text-ink neu-sm"
                            >
                              {[5, 10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </label>

                          {openedNeedsFollowupList.length > 0 && (
                            <button
                              type="button"
                              disabled={draftGenerating || coldSending}
                              onClick={() => handlePreviewColdToTargets(openedNeedsFollowupList.slice(0, coldBatchSize), true)}
                              className="btn-gradient rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider disabled:opacity-60"
                            >
                              Review follow-up to estimated opens ({openedNeedsFollowupList.length})
                            </button>
                          )}

                          {needsFollowupList.length > 0 && (
                            <button
                              type="button"
                              disabled={draftGenerating || coldSending}
                              onClick={() => handlePreviewColdToTargets(needsFollowupList.slice(0, coldBatchSize), true)}
                              className="rounded-full bg-paper px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-purple-800 neu-sm hover:text-purple-900 disabled:opacity-60"
                            >
                              Follow-up All Unreplied ({needsFollowupList.length})
                            </button>
                          )}

                          {pendingColdList.length > 0 && (
                            <button
                              type="button"
                              disabled={draftGenerating || coldSending}
                              onClick={() => handlePreviewColdToTargets(pendingColdList.slice(0, coldBatchSize), false)}
                              className="rounded-full bg-paper px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink neu-sm hover:text-blue disabled:opacity-60"
                            >
                              Review Initial Batch ({pendingColdList.length})
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Template Editor within Tracker */}
                    {showColdTemplateEditor && (
                      <div className="rounded-2xl border border-blue/20 bg-blue/5 p-5 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="display text-lg text-ink">Cold Pitch &amp; Follow-Up Templates</h4>
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
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">
                              Initial Cold Pitch Subject
                            </label>
                            <input
                              type="text"
                              value={coldSubject}
                              onChange={(e) => setColdSubject(e.target.value)}
                              className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-bold text-ink outline-none neu-inset"
                            />
                            <label className="mt-3 mb-1 block text-[11px] font-bold uppercase text-ink-soft">
                              Initial Cold Pitch Body
                            </label>
                            <textarea
                              rows="6"
                              value={coldBody}
                              onChange={(e) => setColdBody(e.target.value)}
                              className="w-full rounded-xl bg-paper p-3 font-mono text-xs leading-relaxed text-ink outline-none neu-inset"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-bold uppercase text-ink-soft">
                              Follow-Up Subject Line (Auto-Re: prefixed)
                            </label>
                            <input
                              type="text"
                              value={`Re: ${coldSubject.replace(/^re:\s*/i, '')}`}
                              disabled
                              className="w-full rounded-xl bg-paper px-3.5 py-2.5 text-xs font-bold text-ink-soft outline-none neu-inset opacity-80"
                            />
                            <label className="mt-3 mb-1 block text-[11px] font-bold uppercase text-ink-soft">
                              Approved Polite Follow-Up Template
                            </label>
                            <div className="rounded-xl bg-paper p-3 font-mono text-xs leading-relaxed text-ink outline-none neu-inset whitespace-pre-wrap">
                              {outreachFollowup}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Search & Filter Bar with Export */}
                    <div className="space-y-3 w-full min-w-0 max-w-full">
                      {/* Search & Export Toolbar */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full min-w-0 max-w-full bg-paper p-3 sm:p-4 rounded-2xl neu-inset">
                      <div className="relative w-full max-w-sm">
                        <input
                          type="text"
                          value={coldSearch}
                          onChange={(e) => {
                            setColdSearch(e.target.value)
                            setDisplayLimit(25)
                          }}
                          placeholder="🔍 Search name, company, email or niche…"
                          className="w-full rounded-full bg-paper px-4 py-2 text-xs font-medium text-ink outline-none neu-sm placeholder:text-ink-soft"
                        />
                        {coldSearch && (
                          <button
                            type="button"
                            onClick={() => setColdSearch('')}
                            className="absolute right-3 top-2 text-xs font-bold text-ink-soft hover:text-red-500"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Universal Prospect Download Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const filterSlug = coldFilter === 'all' ? 'all' : coldFilter.toLowerCase().replace(/[\s-]+/g, '_')
                            const filename = `weezie_prospects_${filterSlug}_${new Date().toISOString().slice(0, 10)}.csv`
                            exportToCsv(filename, filteredCold, PROSPECT_COLUMNS)
                          }}
                          className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
                          title="Download current filtered list to CSV"
                        >
                          <span>📥</span>
                          <span>Download Current ({filteredCold.length})</span>
                        </button>

                        <select
                          onChange={(e) => {
                            const val = e.target.value
                            if (!val) return
                            const d = new Date().toISOString().slice(0, 10)
                            if (val === 'all') exportToCsv(`weezie_all_prospects_${d}.csv`, coldList, PROSPECT_COLUMNS)
                            if (val === 'initial_opened') exportToCsv(`weezie_prospects_initial_viewed_${d}.csv`, initialOpenedColdList, PROSPECT_COLUMNS)
                            if (val === 'followup_opened') exportToCsv(`weezie_prospects_followup_viewed_${d}.csv`, followupOpenedList, PROSPECT_COLUMNS)
                            if (val === 'all_opened') exportToCsv(`weezie_prospects_all_viewed_${d}.csv`, allOpenedColdList, PROSPECT_COLUMNS)
                            if (val === 'selected') exportToCsv(`weezie_prospects_current_selection_${d}.csv`, filteredCold, PROSPECT_COLUMNS)
                            if (val === 'suspected') exportToCsv(`weezie_prospects_suspected_automation_${d}.csv`, coldList.filter(hasSuspectedOpen), PROSPECT_COLUMNS)
                            if (val === 'unverified') exportToCsv(`weezie_prospects_unverified_opens_${d}.csv`, coldList.filter(hasUnverifiedOpen), PROSPECT_COLUMNS)
                            if (val === 'followup_sent') exportToCsv(`weezie_prospects_followup_sent_${d}.csv`, followupSentList, PROSPECT_COLUMNS)
                            if (val === 'sent') exportToCsv(`weezie_prospects_sent_${d}.csv`, sentColdList, PROSPECT_COLUMNS)
                            if (val === 'pending') exportToCsv(`weezie_prospects_pending_${d}.csv`, pendingColdList, PROSPECT_COLUMNS)
                            if (val === 'replied') exportToCsv(`weezie_prospects_replied_${d}.csv`, repliedColdList, PROSPECT_COLUMNS)
                            e.target.value = ''
                          }}
                          defaultValue=""
                          className="rounded-full bg-paper px-3.5 py-2 text-xs font-bold text-ink outline-none neu-sm cursor-pointer"
                        >
                          <option value="" disabled>📥 Download By Type…</option>
                          <option value="initial_opened">Estimated Initial Opens ({initialOpenedColdList.length})</option>
                          <option value="followup_opened">Estimated Follow-up Opens ({followupOpenedList.length})</option>
                          <option value="all_opened">Estimated Opens, All Stages ({allOpenedColdList.length})</option>
                          <option value="selected">Current Graph / Filter Selection ({filteredCold.length})</option>
                          <option value="suspected">Suspected Automation / Proxy ({coldList.filter(hasSuspectedOpen).length})</option>
                          <option value="unverified">Unverified Opens ({coldList.filter(hasUnverifiedOpen).length})</option>
                          <option value="followup_sent">📨 Follow-up Sent ({followupSentList.length})</option>
                          <option value="sent">📤 Initial Sent ({sentColdList.length})</option>
                          <option value="pending">⏳ Pending Queue ({pendingColdList.length})</option>
                          <option value="replied">💬 Replied ({repliedColdList.length})</option>
                          <option value="all">📁 All Prospects ({coldList.length})</option>
                        </select>
                      </div>
                    </div>

                      <div className="w-full min-w-0 max-w-full overflow-x-auto pb-2 scrollbar-none">
                        <div className="inline-flex items-center gap-1.5 min-w-max">
                          {[
                            { id: 'all', label: `All (${coldList.length})` },
                            { id: 'Pending', label: `⏳ Pending (${pendingColdList.length})` },
                            { id: 'Sent', label: `📤 Sent (${sentColdList.length})` },
                            { id: 'Opened', label: `Estimated Initial Opens (${initialOpenedColdList.length})` },
                            { id: 'Follow-up Sent', label: `📨 Follow-up Sent (${followupSentList.length})` },
                            { id: 'Follow-up Opened', label: `Estimated Follow-up Opens (${followupOpenedList.length})` },
                            { id: 'Suspected', label: `Suspected Automation / Proxy (${coldList.filter(hasSuspectedOpen).length})` },
                            { id: 'Unverified', label: `Unverified Opens (${coldList.filter(hasUnverifiedOpen).length})` },
                            { id: 'Replied', label: `💬 Replied (${repliedColdList.length})` },
                            { id: 'Unsubscribed', label: `🚫 Unsubscribed (${unsubscribedColdList.length})` },
                          ].map(({ id, label }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                setColdFilter(id)
                                setDisplayLimit(25)
                              }}
                              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase whitespace-nowrap transition-all ${
                                coldFilter === id ? 'bg-ink text-white' : 'bg-paper text-ink-soft neu-sm hover:text-ink'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Prospects List (No truncation!) */}
                    <div className="space-y-3 w-full min-w-0 max-w-full">
                      {filteredCold.length === 0 ? (
                        <div className="rounded-2xl bg-paper p-8 text-center neu-inset">
                          <p className="text-xs font-medium text-ink-soft">
                            {coldSearch ? `No prospects match "${coldSearch}".` : 'No prospects found in this status filter.'}
                          </p>
                        </div>
                      ) : (
                        filteredCold.slice(0, displayLimit).map((p) => {
                          const isFollowupSent = Number(p.followup_count || 0) > 0 || ['Follow-up Sent', 'Follow-up Opened', 'Follow-up 1', 'Follow-up 2'].includes(p.status)

                          return (
                            <div
                              key={p.id || p.email}
                              className="rounded-2xl bg-paper p-3.5 sm:p-4 neu-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 transition-all w-full min-w-0 max-w-full overflow-hidden"
                            >
                              <div className="min-w-0 flex-1 max-w-full overflow-hidden">
                                <div className="flex flex-wrap items-center gap-2">
                                  <ProspectEngagement prospect={p} />

                                  {p.niche && (
                                    <span className="rounded-full bg-paper px-2.5 py-0.5 text-[10px] font-semibold text-ink-soft neu-sm">
                                      {p.niche}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                  <h4 className="text-sm font-bold text-ink break-words">{p.name || 'Unnamed Contact'}</h4>
                                  {p.business && (
                                    <span className="text-xs font-semibold text-ink-soft break-words">· {p.business}</span>
                                  )}
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                                  <span className="font-mono font-medium select-all text-ink break-all">{p.email}</span>
                                  {p.website && (
                                    <a
                                      href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue hover:underline break-all"
                                    >
                                      {p.website.replace(/^https?:\/\//, '')} ↗
                                    </a>
                                  )}
                                </div>

                                {p.last_contacted_at && <p className="mt-2 text-[11px] text-ink-soft">Last contacted: {new Date(trackingTime(p.last_contacted_at)).toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} (Lagos)</p>}

                                {p.custom_opener && (
                                  <details className="mt-2.5 max-w-2xl rounded-xl bg-paper p-3 neu-inset overflow-hidden">
                                    <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.08em] text-blue">
                                      Review personalized AI pitch
                                    </summary>
                                    <p className="mt-2 text-xs font-bold text-ink break-words">{p.custom_subject || `A website idea for ${p.business || 'your business'}`}</p>
                                    <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-ink-soft break-words">{p.custom_opener}</p>
                                  </details>
                                )}
                              </div>

                              {/* Card Action Buttons */}
                              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 shrink-0 self-start lg:self-center">
                                {p.status === 'Pending' ? (
                                  <>
                                    <button
                                      type="button"
                                      disabled={draftGenerating || coldSending}
                                      onClick={() => handlePreviewColdToTargets([p], false)}
                                      className="rounded-full bg-paper px-3 py-1.5 text-[10px] font-bold uppercase text-ink neu-sm"
                                    >
                                      Review
                                    </button>
                                    <button
                                      type="button"
                                      disabled={draftGenerating || coldSending}
                                      onClick={() => handlePreviewColdToTargets([p], false, true)}
                                      className="btn-gradient rounded-full px-3 py-1.5 text-[10px] font-bold uppercase disabled:opacity-60"
                                    >
                                      Send Initial
                                    </button>
                                  </>
                                ) : !isFollowupSent ? (
                                  <>
                                    <button
                                      type="button"
                                      disabled={draftGenerating || coldSending || p.status === 'Unsubscribed'}
                                      onClick={() => handlePreviewColdToTargets([p], true)}
                                      className="rounded-full bg-paper px-3 py-1.5 text-[10px] font-bold uppercase text-blue neu-sm"
                                    >
                                      Review F/U
                                    </button>
                                    <button
                                      type="button"
                                      disabled={draftGenerating || coldSending || p.status === 'Unsubscribed'}
                                      onClick={() => handlePreviewColdToTargets([p], true, true)}
                                      className="btn-gradient rounded-full px-3 py-1.5 text-[10px] font-bold uppercase disabled:opacity-60"
                                    >
                                      Send Follow-up 🚀
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span className="rounded-full bg-paper px-3 py-1 text-[10px] font-bold text-green-700 neu-inset">
                                      Followed Up ✓
                                    </span>
                                    <button
                                      type="button"
                                      disabled={draftGenerating || coldSending || p.status === 'Unsubscribed'}
                                      onClick={() => handlePreviewColdToTargets([p], true)}
                                      className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-bold text-ink-soft neu-sm hover:text-blue"
                                      title="Manually re-send another follow-up"
                                    >
                                      Re-send
                                    </button>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    postAdminAction(adminKey, { action: 'delete_cold_prospect', id: p.id }).then(() =>
                                      loadDashboard(),
                                    )
                                  }
                                  className="px-2 py-1 text-xs font-bold text-ink-soft hover:text-red-600"
                                  title="Delete prospect"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>

                    {/* Pagination / Show More */}
                    {filteredCold.length > displayLimit && (
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setDisplayLimit((n) => n + 25)}
                          className="btn-gradient rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
                        >
                          Load More (+25) · Showing {displayLimit} of {filteredCold.length}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDisplayLimit(filteredCold.length)}
                          className="rounded-full bg-paper px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink neu-sm"
                        >
                          Show All ({filteredCold.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right panel: Live Activity Stream (when cron) OR Cold Campaign Composer */}
              {coldSubTab !== 'tracker' && (
                <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-6">
                  {coldSubTab === 'cron' ? (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="display text-xl text-ink">Recent Drip Activity</h3>
                        <span className="text-xs font-bold text-ink-soft">
                          {sentColdCount} contacted · {allOpenedColdList.length} estimated opens
                        </span>
                      </div>
                    <p className="mt-1 text-xs font-medium text-ink-soft">
                      Real-time audit log of prospects contacted by the automated engine with live open tracking.
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
                          .map((p) => {
                            return (
                              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-paper p-3 text-xs neu-sm">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <p className="font-bold text-ink break-words">
                                      {p.name} · <span className="font-normal text-ink-soft">{p.business || p.email}</span>
                                    </p>
                                    <ProspectEngagement prospect={p} compact />
                                  </div>
                                  <p className="text-[11px] text-ink-soft break-all">{p.email}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                    {p.last_contacted_at && (
                                      <span className="text-[10px] text-blue">Contacted: {new Date(p.last_contacted_at).toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>

                              </div>
                            )
                          })
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
            )}
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
                      <option value="all">All Subscribed Leads &amp; Buyers ({leadsList.length})</option>
                      <option value="freebie">
                        Freebie Downloaders Only ({leadsList.filter((l) => l.source === 'freebie').length})
                      </option>
                      <option value="brief">
                        Project Brief Leads ({leadsList.filter((l) => l.source === 'brief').length})
                      </option>
                      <option value="store">
                        Store Buyers ({leadsList.filter((l) => l.source === 'store').length})
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
                {emailsList.length === 0 ? (
                  <p className="text-xs font-medium text-ink-soft">No emails sent yet.</p>
                ) : (
                  emailsList.map((em) => (
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
            <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="display text-2xl text-ink">Leads, Briefs &amp; Freebie Subscribers</h2>
                <p className="mt-1 text-xs text-ink-soft">
                  Inbound client inquiries, project briefs, AI Lab audits, and freebie downloads.
                </p>
              </div>

              {/* Export Leads CSV Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date().toISOString().slice(0, 10)
                    exportToCsv(`weezie_leads_${sourceFilter}_${d}.csv`, filteredLeads, LEAD_COLUMNS)
                  }}
                  className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
                  title="Download currently filtered leads"
                >
                  <span>📥</span>
                  <span>Export {sourceFilter === 'all' ? 'All Leads' : `${sourceFilter} Leads`} ({filteredLeads.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const d = new Date().toISOString().slice(0, 10)
                    exportToCsv(`weezie_all_leads_${d}.csv`, leadsList, LEAD_COLUMNS)
                  }}
                  className="neu-hover rounded-full bg-paper px-3.5 py-2 text-xs font-bold text-ink neu-sm"
                  title="Export all inbound leads regardless of filter"
                >
                  Export Complete Database ({leadsList.length})
                </button>
              </div>
            </div>

            {/* Source Filter Pills */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1.5 scrollbar-none sm:flex-wrap">
              {['all', 'brief', 'contact', 'freebie', 'store', 'ai_tool'].map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSourceFilter(src)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${
                    sourceFilter === src ? 'bg-ink text-white' : 'bg-paper text-ink-soft neu-sm'
                  }`}
                >
                  {src === 'all' ? `All Sources (${leadsList.length})` : `${src} (${leadsList.filter(l => l.source === src).length})`}
                </button>
              ))}
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
                    <div key={lead.id} className="rounded-2xl bg-paper p-4 sm:p-5 neu-sm">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
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

                          <h3 className="display mt-2 text-lg sm:text-xl text-ink break-words">
                            {lead.name}{' '}
                            <span className="font-mono text-xs sm:text-sm font-normal text-ink-soft break-all">({lead.email})</span>
                          </h3>
                          {lead.phone && <p className="text-xs font-semibold text-ink-soft break-all">📞 {lead.phone}</p>}
                          {lead.estimated_total && (
                            <p className="mt-1 text-xs font-bold text-blue">Estimate shown: {lead.estimated_total}</p>
                          )}
                          {lead.message && <p className="mt-2 text-sm font-medium text-ink whitespace-pre-wrap break-words">{lead.message}</p>}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
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
              <h2 className="display text-2xl text-ink">Active Store Catalogue ({productsList.length})</h2>
              <div className="mt-4 space-y-3">
                {productsList.map((p) => (
                  <div
                    key={p.slug || p.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-paper p-4 neu-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue">{p.category}</span>
                      <h4 className="display text-base sm:text-lg text-ink break-words">{p.title}</h4>
                      <p className="text-xs font-medium text-ink-soft">
                        {p.is_freebie ? 'FREEBIE' : `$${p.price_usd} · ₦${Number(p.price_ngn || 0).toLocaleString()}`} ·{' '}
                        {p.downloads_count || 0} downloads
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="display text-2xl text-ink">Orders &amp; Unlocks ({ordersList.length})</h2>
                {ordersList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSales}
                    className="rounded-full bg-paper px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-red-600 neu-sm hover:bg-red-50 transition"
                  >
                    🗑️ Clear Sales
                  </button>
                )}
              </div>
              {ordersList.length === 0 ? (
                <p className="mt-4 text-xs font-medium text-ink-soft">
                  No paid orders yet. Purchases from the Digital Store and AI Lab Deep-Dive packs appear here
                  automatically.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {ordersList.map((o) => (
                    <div key={o.reference || o.id} className="relative rounded-2xl bg-paper p-4 neu-sm">
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(o.id, o.reference)}
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-ink-soft hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete order"
                      >
                        ✕
                      </button>
                      <div className="flex flex-wrap items-center justify-between gap-2 pr-8">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue break-all">
                          {o.reference} · {o.item_type}
                        </span>
                        <span className="display text-base sm:text-lg text-ink">
                          {o.currency === 'NGN' ? '₦' : '$'}
                          {Number(o.amount || 0).toLocaleString('en-US')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-ink break-words">{o.item_title}</p>
                      <p className="text-xs font-medium text-ink-soft break-all">
                        Buyer: {o.buyer_name} ({o.buyer_email})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-paper p-6 neu lg:col-span-5">
              {(() => {
                const isPkTest = Boolean(paystackPk?.trim().startsWith('pk_test_'))
                const isPkLive = Boolean(paystackPk?.trim().startsWith('pk_live_'))
                const isSkTest = Boolean(paystackSk?.trim().startsWith('sk_test_'))
                const isSkLive = Boolean(paystackSk?.trim().startsWith('sk_live_'))
                const isMismatch = Boolean((isPkLive && isSkTest) || (isPkTest && isSkLive))

                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="display text-2xl text-ink">Paystack Gateway</h3>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        isMismatch
                          ? 'bg-red-500/20 text-red-700 border border-red-500/30'
                          : (isPkTest || isSkTest || data.paystackIsTest)
                            ? 'bg-amber-500/15 text-amber-800'
                            : (isPkLive && isSkLive)
                              ? 'bg-green-500/15 text-green-700'
                              : 'bg-paper text-ink-soft neu-sm'
                      }`}>
                        {isMismatch
                          ? '⚠️ Mode Mismatch'
                          : (isPkTest || isSkTest || data.paystackIsTest)
                            ? '🟡 Test Mode Active'
                            : (isPkLive && isSkLive)
                              ? '🟢 Live Production'
                              : '⚪ Gateway Incomplete'}
                      </span>
                    </div>

                    {isMismatch && (
                      <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-800">
                        <p className="font-bold text-sm">
                          ⚠️ Mode Mismatch: {isPkLive ? 'Live Public Key' : 'Test Public Key'} + {isSkTest ? 'Test Secret Key' : 'Live Secret Key'}
                        </p>
                        <p className="mt-1 leading-relaxed">
                          You entered a <strong>{isPkLive ? 'pk_live_...' : 'pk_test_...'}</strong> Public Key with a <strong>{isSkTest ? 'sk_test_...' : 'sk_live_...'}</strong> Secret Key.
                          Paystack requires both keys to match the same mode.
                        </p>
                        <p className="mt-2 font-bold text-red-900">
                          👉 To test purchases: In your Paystack dashboard, turn on the <strong>Test mode</strong> toggle and paste your <strong>pk_test_...</strong> Public Key below.
                        </p>
                      </div>
                    )}

                    <p className="mt-2 text-xs font-medium leading-relaxed text-ink-soft">
                      Connect your Paystack keys below. Test keys let you verify digital product checkouts, instant delivery emails, and download links with simulated cards without spending real money.
                    </p>
                  </>
                )
              })()}

              <form onSubmit={handleSavePaystackKeys} className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase text-ink-soft">Paystack Public Key</label>
                    <span className="text-[10px] text-ink-soft">Client-side popup</span>
                  </div>
                  <input
                    type="text"
                    value={paystackPk}
                    onChange={(e) => {
                      setPaystackPk(e.target.value)
                      setPkSaved(false)
                      setKeysFeedback('')
                    }}
                    placeholder="Paste Public Key (pk_test_... or pk_live_...)"
                    className="w-full rounded-xl bg-paper px-4 py-3 font-mono text-xs text-ink outline-none neu-inset"
                  />
                  <p className="mt-1 text-[10px] text-ink-soft">
                    Starts with <code className="rounded bg-paper px-1 py-0.5 neu-inset">pk_test_</code> for test mode or <code className="rounded bg-paper px-1 py-0.5 neu-inset">pk_live_</code> for live payments.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase text-ink-soft">Paystack Secret Key</label>
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="text-[10px] font-bold text-blue hover:underline"
                    >
                      {showSecretKey ? 'Hide Secret Key' : 'Reveal Secret Key'}
                    </button>
                  </div>
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={paystackSk}
                    onChange={(e) => {
                      setPaystackSk(e.target.value)
                      setPkSaved(false)
                      setKeysFeedback('')
                    }}
                    placeholder="Paste Secret Key (sk_test_... or sk_live_...)"
                    className="w-full rounded-xl bg-paper px-4 py-3 font-mono text-xs text-ink outline-none neu-inset"
                  />
                  <p className="mt-1 text-[10px] text-ink-soft">
                    Starts with <code className="rounded bg-paper px-1 py-0.5 neu-inset">sk_test_</code>. Stored securely in database &amp; verified on backend (`/api/paystack`).
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={savingKeys}
                    className="btn-gradient w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-50"
                  >
                    {savingKeys ? 'Saving to Database…' : '💾 Save Paystack Gateway Keys'}
                  </button>
                  {keysFeedback && (
                    <p className="mt-2 text-xs font-bold text-blue text-center">{keysFeedback}</p>
                  )}
                  {pkSaved && !keysFeedback && (
                    <p className="mt-2 text-xs font-bold text-green-700 text-center">✅ Saved to Cloudflare &amp; Browser!</p>
                  )}
                </div>
              </form>

              {/* Paystack Webhook & Callback Configuration */}
              <div className="mt-6 rounded-2xl bg-blue/10 border border-blue/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue">
                    ⚡ Paystack Webhook &amp; Callback URLs
                  </p>
                  <span className="text-[10px] font-bold text-blue bg-blue/15 px-2 py-0.5 rounded-full">
                    Copy to Paystack
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ink-soft leading-relaxed">
                  Paste these URLs into your <strong>Paystack Dashboard &rarr; Settings &rarr; Preferences / Developer &rarr; API Keys &amp; Webhooks</strong> so digital orders &amp; receipts are automatically fulfilled:
                </p>

                <div className="mt-3 space-y-2.5">
                  <div className="rounded-xl bg-paper p-3 neu-inset">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                        Live / Test Webhook URL
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText?.('https://weezie.site/api/paystack')
                          setCopiedWebhook(true)
                          setTimeout(() => setCopiedWebhook(false), 2000)
                        }}
                        className="rounded-full bg-blue px-2.5 py-1 text-[10px] font-bold text-white hover:opacity-90 transition-opacity"
                      >
                        {copiedWebhook ? '✓ Copied!' : '📋 Copy Webhook'}
                      </button>
                    </div>
                    <code className="mt-1.5 block select-all font-mono text-xs font-bold text-ink break-all">
                      https://weezie.site/api/paystack
                    </code>
                    <p className="mt-1 text-[10px] text-ink-soft">
                      Paystack sends a background confirmation when payment completes. Automatically delivers receipt, order, and download link to customer email.
                    </p>
                  </div>

                  <div className="rounded-xl bg-paper p-3 neu-inset">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                        Callback URL
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText?.('https://weezie.site/store')
                          setCopiedCallback(true)
                          setTimeout(() => setCopiedCallback(false), 2000)
                        }}
                        className="rounded-full bg-blue px-2.5 py-1 text-[10px] font-bold text-white hover:opacity-90 transition-opacity"
                      >
                        {copiedCallback ? '✓ Copied!' : '📋 Copy Callback'}
                      </button>
                    </div>
                    <code className="mt-1.5 block select-all font-mono text-xs font-bold text-ink break-all">
                      https://weezie.site/store
                    </code>
                    <p className="mt-1 text-[10px] text-ink-soft">
                      Where customer browsers return after completing checkout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Paystack Test Cards Cheatsheet */}
              <div className="mt-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    🧪 Official Paystack Test Card Cheatsheet
                  </p>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    Zero Real Charge
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-amber-900/80 leading-relaxed">
                  Use these credentials in the checkout modal when testing with <code className="font-mono font-bold">pk_test_</code>:
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-ink">
                  <div className="rounded-xl bg-paper p-2 neu-inset">
                    <span className="text-[9px] uppercase tracking-wider text-ink-soft block font-sans font-bold">Card Number (Success)</span>
                    <span className="font-bold select-all text-blue">4084 0840 8408 4081</span>
                  </div>
                  <div className="rounded-xl bg-paper p-2 neu-inset">
                    <span className="text-[9px] uppercase tracking-wider text-ink-soft block font-sans font-bold">Expiry Date</span>
                    <span className="font-bold select-all">12 / 30</span>
                  </div>
                  <div className="rounded-xl bg-paper p-2 neu-inset">
                    <span className="text-[9px] uppercase tracking-wider text-ink-soft block font-sans font-bold">CVV</span>
                    <span className="font-bold select-all">408</span>
                  </div>
                  <div className="rounded-xl bg-paper p-2 neu-inset">
                    <span className="text-[9px] uppercase tracking-wider text-ink-soft block font-sans font-bold">PIN / OTP</span>
                    <span className="font-bold select-all">PIN: 1111 · OTP: 123456</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-paper p-4 neu-inset">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
                  100% Free Stack Summary (Zero API Credits Needed)
                </p>
                <ul className="mt-2 space-y-1.5 font-mono text-[11px] text-ink-soft">
                  <li>• AI Tools &amp; Cold Opener: Cloudflare Workers AI (Free)</li>
                  <li>• Database &amp; Files: Cloudflare D1 + R2 (Free)</li>
                  <li>• Inbound Mail: Cloudflare Email Routing → Read-Only Alert</li>
                  <li>• Outbound Mail: Brevo Free Tier (300/day free)</li>
                  <li>• Payment Verification: Paystack API (Test Mode Ready)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
