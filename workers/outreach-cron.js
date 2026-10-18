export default {
  async scheduled(event, env, ctx) {
    const cronSecret = env.CRON_SECRET || env.ADMIN_PASSWORD
    if (!cronSecret) {
      console.error('CRON_SECRET missing on outreach cron worker.')
      return
    }

    try {
      const res = await fetch(`https://weezie.site/api/cron?key=${encodeURIComponent(cronSecret)}`)
      const data = await res.json()
      console.log('Outreach cron executed successfully:', JSON.stringify(data))
    } catch (err) {
      console.error('Outreach cron fetch error:', err.message)
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
