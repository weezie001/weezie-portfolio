import PostalMime from 'postal-mime'

const INBOXES = new Set(['enang@weezie.site', 'hello@weezie.site'])

export default {
  async email(message, env) {
    const mailbox = String(message.to || '').trim().toLowerCase()
    if (!INBOXES.has(mailbox)) {
      message.setReject('This inbox is not configured.')
      return
    }

    if (!env.INBOUND_EMAIL_TOKEN) {
      throw new Error('INBOUND_EMAIL_TOKEN is not configured for the inbound email Worker.')
    }

    const email = await PostalMime.parse(message.raw)
    const sender = Array.isArray(email.from) ? email.from[0] : email.from
    const fromEmail = String(sender?.address || message.from || '').trim().toLowerCase()
    if (!fromEmail) {
      message.setReject('The message does not have a valid sender address.')
      return
    }

    const bodyText = String(email.text || email.html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ') || '').trim()
    const response = await fetch('https://weezie.site/api/inbound', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.INBOUND_EMAIL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: mailbox,
        from_email: fromEmail,
        from_name: sender?.name || '',
        subject: email.subject || '(No Subject)',
        text: bodyText,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`CRM rejected inbound email (${response.status}): ${detail}`)
    }

    const result = await response.json()
    if (!result.ok) throw new Error(result.error || 'CRM did not save the inbound email.')
    if (!result.notificationSent) {
      console.error('Inbound email was saved to the CRM, but its Gmail notification was not sent.')
    }
  },
}
