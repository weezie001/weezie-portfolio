// Anti-Spam & Deliverability Guard for enang@weezie.site and hello@weezie.site
// Protects domain reputation by scanning outbound cold/broadcast emails before sending.

const SPAM_TRIGGER_WORDS = [
  '100% free',
  'act now',
  'buy direct',
  'cash bonus',
  'click here',
  'Dear friend',
  'double your',
  'earn extra cash',
  'eliminate bad credit',
  'fast cash',
  'financial freedom',
  'free money',
  'guaranteed',
  'limited time offer',
  'make money',
  'million dollars',
  'no catch',
  'no cost',
  'no credit check',
  'no obligation',
  'no strings attached',
  'once in a lifetime',
  'risk-free',
  'urgent',
  'winner',
  'work from home',
  '$$$',
]

export function analyzeSpamRisk(subject = '', body = '') {
  const issues = []
  let score = 100 // 100 = Cleanest inbox placement, <60 = High spam risk

  const fullText = `${subject} ${body}`.toLowerCase()

  // 1. Check spam trigger words
  const matchedWords = SPAM_TRIGGER_WORDS.filter((w) => fullText.includes(w.toLowerCase()))
  if (matchedWords.length > 0) {
    score -= matchedWords.length * 12
    issues.push(`Contains spam-filter trigger phrases: "${matchedWords.join('", "')}"`)
  }

  // 2. Check ALL CAPS in subject
  const upperLetters = (subject.match(/[A-Z]/g) || []).length
  const allLetters = (subject.match(/[a-zA-Z]/g) || []).length
  if (allLetters > 6 && upperLetters / allLetters > 0.6) {
    score -= 20
    issues.push('Subject line uses too many CAPITAL letters (triggers spam filters).')
  }

  // 3. Check excessive exclamation marks
  const exclamations = (`${subject} ${body}`.match(/!/g) || []).length
  if (exclamations > 3) {
    score -= 10
    issues.push(`Too many exclamation marks (${exclamations}). Keep it to 0 or 1 for cold outreach.`)
  }

  // 4. Check excessive links (cold emails with >2 links often land in Promotions/Spam)
  const links = (body.match(/https?:\/\//gi) || []).length
  if (links > 2) {
    score -= 15
    issues.push(`Contains ${links} URLs. Cold emails perform best with 1 link (e.g., https://weezie.site).`)
  }

  // 5. Check subject length
  if (subject.trim().length > 72) {
    score -= 8
    issues.push('Subject line is over 72 characters. Short, conversational subjects get higher open rates.')
  }

  // 6. Check very short or empty body
  if (body.trim().length > 0 && body.trim().length < 40) {
    score -= 10
    issues.push('Email body is very short — add natural conversational context so filters trust it.')
  }

  const finalScore = Math.max(0, Math.min(100, score))
  const status = finalScore >= 80 ? 'Clean (Inbox Ready)' : finalScore >= 60 ? 'Caution (Tweak Recommended)' : 'High Spam Risk (Blocked)'

  return {
    score: finalScore,
    status,
    safe: finalScore >= 60,
    issues,
  }
}

export function appendAntiSpamFooter(body = '', isColdOrBroadcast = false) {
  if (!isColdOrBroadcast) return body
  if (/unsubscribe|opt out|stop receiving/i.test(body)) return body
  return `${body.trim()}\n\n---\nSent by Enang Weezie (https://weezie.site) · Abuja, Nigeria.\nDon't want future notes from me? Simply reply "stop" and I'll remove you immediately.`
}
