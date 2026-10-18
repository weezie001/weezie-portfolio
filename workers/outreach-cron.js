export default {
  async scheduled(event, env, ctx) {
    // Random jitter (10 to 120 seconds) for natural pacing
    const jitterMs = Math.floor(10000 + Math.random() * 110000)
    await new Promise((r) => setTimeout(r, jitterMs))

    const cronSecret = env.CRON_SECRET || env.ADMIN_PASSWORD
    if (!cronSecret) {
      console.error('CRON_SECRET missing on outreach cron worker.')
      return
    }

    try {
      const res = await fetch(`https://weezie.site/api/cron?key=${encodeURIComponent(cronSecret)}`)
      const data = await res.json()
      console.log('Outreach cron result:', JSON.stringify(data))
    } catch (err) {
      console.error('Outreach cron error:', err.message)
    }
  },

  async fetch(request, env, ctx) {
    const cronSecret = env.CRON_SECRET || env.ADMIN_PASSWORD
    if (!cronSecret) {
      return new Response('CRON_SECRET not configured', { status: 500 })
    }
    const res = await fetch(`https://weezie.site/api/cron?key=${encodeURIComponent(cronSecret)}`)
    const data = await res.text()
    return new Response(data, {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
