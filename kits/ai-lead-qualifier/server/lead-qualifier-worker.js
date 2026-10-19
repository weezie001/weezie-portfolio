// ============================================================
// Cloudflare Worker: 24/7 AI Lead Qualifier & Dispatcher
// Connects OpenAI or Cloudflare Workers AI to email/webhook
// ============================================================
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: true, status: 'AI Lead Qualifier Worker Active' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { messages, userContact } = await request.json().catch(() => ({}));
    
    // Send email or webhook notification with lead summary
    if (userContact) {
      console.log('QUALIFIED LEAD CAPTURED:', userContact);
    }

    return new Response(JSON.stringify({ ok: true, message: 'Lead recorded' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};