// ============================================================
// 24/7 AI Sales Agent — Standalone Floating Chat Widget
// Paste this 1-line script onto any website to activate
// ============================================================
(function() {
  const container = document.createElement('div');
  container.id = 'weezie-ai-widget';
  container.innerHTML = `
    <style>
      #weezie-chat-bubble { position: fixed; bottom: 24px; right: 24px; z-index: 9999; width: 60px; height: 60px; border-radius: 50%; background: #0066FF; box-shadow: 0 8px 24px rgba(0,102,255,0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s ease; border: none; outline: none; }
      #weezie-chat-bubble:hover { transform: scale(1.06); }
      #weezie-chat-window { position: fixed; bottom: 96px; right: 24px; z-index: 9999; width: 360px; max-width: calc(100vw - 48px); height: 500px; max-height: calc(100vh - 120px); background: #121316; border: 1px solid #23252a; border-radius: 24px; box-shadow: 0 16px 40px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
      #weezie-chat-header { background: #181a1f; padding: 16px; border-bottom: 1px solid #23252a; display: flex; align-items: center; justify-content: space-between; color: #fff; }
      #weezie-chat-messages { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
      .wz-msg { max-width: 80%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.45; }
      .wz-bot { background: #202227; color: #e4e7eb; align-self: flex-start; border-bottom-left-radius: 4px; }
      .wz-user { background: #0066FF; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
      #weezie-chat-input-bar { padding: 12px; border-top: 1px solid #23252a; display: flex; gap: 8px; background: #181a1f; }
      #weezie-chat-input { flex: 1; background: #121316; border: 1px solid #2e3138; border-radius: 20px; padding: 10px 14px; color: #fff; font-size: 13px; outline: none; }
      #weezie-chat-send { background: #0066FF; color: #fff; border: none; border-radius: 20px; padding: 8px 16px; font-weight: bold; cursor: pointer; }
    </style>
    <button id="weezie-chat-bubble" aria-label="Chat with Sales Agent">💬</button>
    <div id="weezie-chat-window">
      <div id="weezie-chat-header">
        <div>
          <div style="font-weight: bold; font-size: 14px;">Aria · Client Advisor</div>
          <div style="font-size: 11px; color: #10b981;">● Active 24/7</div>
        </div>
        <button id="weezie-chat-close" style="background:none; border:none; color:#888; font-size:18px; cursor:pointer;">✕</button>
      </div>
      <div id="weezie-chat-messages">
        <div class="wz-msg wz-bot">Hi there! 👋 I am your project assistant. Are you looking to launch a website, web app, or redesign an existing project?</div>
      </div>
      <form id="weezie-chat-input-bar">
        <input type="text" id="weezie-chat-input" placeholder="Type your reply…" autocomplete="off" required />
        <button type="submit" id="weezie-chat-send">Send</button>
      </form>
    </div>
  `;
  document.body.appendChild(container);

  const bubble = document.getElementById('weezie-chat-bubble');
  const win = document.getElementById('weezie-chat-window');
  const close = document.getElementById('weezie-chat-close');
  const form = document.getElementById('weezie-chat-input-bar');
  const input = document.getElementById('weezie-chat-input');
  const msgs = document.getElementById('weezie-chat-messages');

  bubble.onclick = () => { win.style.display = win.style.display === 'flex' ? 'none' : 'flex'; };
  close.onclick = () => { win.style.display = 'none'; };

  const cannedAnswers = [
    "That sounds exciting! What is your ideal timeline or target launch date?",
    "Got it. What investment budget range are you working with for this build ($450 - $1,500+)?",
    "Awesome. What is the best WhatsApp number or email address to send over our kickoff proposal?",
    "Thank you! Our lead designer has been notified and will message you within 24 hours with your custom project roadmap. Talk soon! 🚀"
  ];
  let step = 0;

  form.onsubmit = (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;
    const uMsg = document.createElement('div');
    uMsg.className = 'wz-msg wz-user';
    uMsg.textContent = txt;
    msgs.appendChild(uMsg);
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(() => {
      const bMsg = document.createElement('div');
      bMsg.className = 'wz-msg wz-bot';
      bMsg.textContent = cannedAnswers[Math.min(step, cannedAnswers.length - 1)];
      step++;
      msgs.appendChild(bMsg);
      msgs.scrollTop = msgs.scrollHeight;
    }, 700);
  };
})();