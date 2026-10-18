// Shared email design. Forces solid high-contrast dark text across Gmail Light/Dark mode and mobile clients.
function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function renderBrandedEmail({ body, outreach = false, contentHtml = '', title = '', label = '', assetBase = 'https://weezie.site' }) {
  const paragraphs = String(body || '').trim().split(/\n\s*\n/)
    .map((paragraph) => `<p style="margin:0 0 20px;font-size:14px;line-height:1.8;color:#0c0d10 !important;-webkit-text-fill-color:#0c0d10 !important;overflow-wrap:anywhere;">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`).join('\n')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Enang Weezie</title>
  <style>
    :root {
      color-scheme: light;
      supported-color-schemes: light;
    }
    body, table, td, p, h1, span, a {
      color: #0c0d10 !important;
      -webkit-text-fill-color: #0c0d10 !important;
    }
    @media (prefers-color-scheme: dark) {
      body, table, td, p, h1, span {
        color: #0c0d10 !important;
        -webkit-text-fill-color: #0c0d10 !important;
      }
      .brand-dot {
        color: #2f6bff !important;
        -webkit-text-fill-color: #2f6bff !important;
      }
      .brand-muted {
        color: #3f434e !important;
        -webkit-text-fill-color: #3f434e !important;
      }
      .brand-link {
        color: #2f6bff !important;
        -webkit-text-fill-color: #2f6bff !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#e9ebf1;color:#0c0d10 !important;-webkit-text-fill-color:#0c0d10 !important;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#e9ebf1" style="background-color:#e9ebf1;">
  <tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" background="${escapeHtml(assetBase)}/email/doodles-paper.png" style="max-width:600px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;background-color:#e9ebf1;background-image:url('${escapeHtml(assetBase)}/email/doodles-paper.png');background-position:center top;background-size:600px 1120px;border:1px solid #d3d7e0;border-radius:18px;">
    <tr><td style="padding:28px 26px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td width="56"><img src="${escapeHtml(assetBase)}/favicon.png" alt="Enang Weezie" width="48" height="48" style="display:block;border-radius:12px;"></td>
        <td style="padding-left:10px;font-size:27px;font-weight:700;letter-spacing:-1.5px;color:#0c0d10 !important;-webkit-text-fill-color:#0c0d10 !important;">weezie<span class="brand-dot" style="color:#2f6bff !important;-webkit-text-fill-color:#2f6bff !important;">.</span></td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:0 26px 24px;color:#0c0d10 !important;-webkit-text-fill-color:#0c0d10 !important;">

      ${label ? `<p style="margin:0 0 12px;font-family:Consolas,'Courier New',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#2f6bff !important;-webkit-text-fill-color:#2f6bff !important;font-weight:700;">${escapeHtml(label)}</p>` : ''}
      ${title ? `<h1 style="margin:0 0 24px;font-size:26px;line-height:1.3;letter-spacing:-0.5px;color:#0c0d10 !important;-webkit-text-fill-color:#0c0d10 !important;">${escapeHtml(title)}</h1>` : ''}
      ${contentHtml || paragraphs}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="border-top:1px solid #d3d7e0;padding-top:20px;">
        <p style="margin:0 0 5px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:13px;font-weight:700;color:#0c0d10 !important;-webkit-text-fill-color:#0c0d10 !important;">Enang Weezie</p>
        <p class="brand-muted" style="margin:0 0 10px;font-size:12px;line-height:1.6;color:#3f434e !important;-webkit-text-fill-color:#3f434e !important;">Web design &amp; branding</p>
        <a class="brand-link" href="https://weezie.site/" style="font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:12px;color:#2f6bff !important;-webkit-text-fill-color:#2f6bff !important;text-decoration:underline;">weezie.site</a>
      </td></tr></table>
    </td></tr>
    ${outreach ? `<tr><td class="brand-muted" style="padding:0 26px 26px;font-size:11px;line-height:1.7;color:#3f434e !important;-webkit-text-fill-color:#3f434e !important;">Don't want future notes from me? Simply reply &quot;stop&quot; and I'll remove you immediately.</td></tr>` : ''}
  </table>
</td></tr></table>
</body></html>`
}
