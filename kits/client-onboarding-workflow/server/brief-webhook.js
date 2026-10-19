export default {
  async fetch(req, env) {
    const data = await req.json();
    console.log('New brief received:', data);
    return new Response(JSON.stringify({ ok: true, status: 'Logged' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};