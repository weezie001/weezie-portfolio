export default {
  async scheduled(event, env, ctx) {
    const cronSecret = env.CRON_SECRET || env.ADMIN_PASSWORD
    if (!cronSecret) {
      console.error('CRON_SECRET missing on outreach cron worker.')
      return
    }

    try {
      const res = await fetch('https://weezie.site/api/cron', {
        headers: { Authorization: `Bearer ${cronSecret}` },
      })
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

    const url = new URL(request.url)
    const incomingKey = url.searchParams.get('key') || (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
    if (incomingKey !== cronSecret) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized manual cron trigger.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://weezie.site/api/cron', {
      headers: { Authorization: `Bearer ${cronSecret}` },
    })
    const data = await res.text()
    return new Response(data, {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
