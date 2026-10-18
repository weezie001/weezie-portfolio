// Shared email design. Supports crisp high-contrast text across Gmail Light/Dark mode, Apple Mail, and mobile clients.
function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function renderBrandedEmail({ body, outreach = false, contentHtml = '', title = '', label = '', assetBase = 'https://weezie.site' }) {
  const paragraphs = String(body || '').trim().split(/\n\s*\n/)
    .map((paragraph) => `<p class="dark-text" style="margin:0 0 20px;font-size:14px;line-height:1.8;color:#0c0d10;overflow-wrap:anywhere;">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`).join('\n')
  return `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>Enang Weezie</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root {
      color-scheme: light only;
      supported-color-schemes: light only;
    }
    body, table, td, p, h1, span, a {
      font-family: 'JetBrains Mono', Consolas, 'Courier New', monospace;
    }
    /* Gmail app targeting to ensure light-only presentation */
    u + .body {
      background-color: #e9ebf1 !important;
    }
    u + .body .dark-bg {
      background-color: #e9ebf1 !important;
    }
    u + .body .dark-card {
      background-color: #e9ebf1 !important;
    }
    u + .body .dark-text {
      color: #0c0d10 !important;
    }
    /* When an email client supports dark mode media queries, gracefully provide rich dark styling */
    @media (prefers-color-scheme: dark) {
      .dark-bg {
        background-color: #121316 !important;
      }
      .dark-card {
        background-color: #17181c !important;
        border-color: #2b2e38 !important;
      }
      .dark-text {
        color: #f0f2f7 !important;
      }
      .brand-title {
        color: #f0f2f7 !important;
      }
      .brand-dot {
        color: #4a80ff !important;
      }
      .brand-divider {
        border-top-color: #2b2e38 !important;
      }
      .brand-muted {
        color: #949aa8 !important;
      }
      .brand-link {
        color: #4a80ff !important;
      }
    }
  </style>
</head>
<body class="body dark-bg" style="margin:0;padding:0;background-color:#e9ebf1;color:#0c0d10;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#e9ebf1" class="dark-bg" style="background-color:#e9ebf1;">
  <tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="dark-card" bgcolor="#e9ebf1" background="${escapeHtml(assetBase)}/email/doodles-paper.png" style="max-width:600px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;background-color:#e9ebf1;background-image:url('${escapeHtml(assetBase)}/email/doodles-paper.png');background-position:center top;background-size:600px 1120px;border:1px solid #d3d7e0;border-radius:18px;">
    <tr><td style="padding:28px 26px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td width="56"><img src="${escapeHtml(assetBase)}/favicon.png" alt="Enang Weezie" width="48" height="48" style="display:block;border-radius:12px;"></td>
        <td class="brand-title dark-text" style="padding-left:10px;font-size:27px;font-weight:700;letter-spacing:-1.5px;color:#0c0d10;">weezie<span class="brand-dot" style="color:#2f6bff;">.</span></td>
      </tr></table>
    </td></tr>
    <tr><td class="dark-text" style="padding:0 26px 24px;color:#0c0d10;">

      ${label ? `<p style="margin:0 0 12px;font-family:Consolas,'Courier New',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#2f6bff;font-weight:700;">${escapeHtml(label)}</p>` : ''}
      ${title ? `<h1 class="brand-title dark-text" style="margin:0 0 24px;font-size:26px;line-height:1.3;letter-spacing:-0.5px;color:#0c0d10;">${escapeHtml(title)}</h1>` : ''}
      ${contentHtml || paragraphs}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="brand-divider" style="border-top:1px solid #d3d7e0;padding-top:20px;">
        <p class="brand-title dark-text" style="margin:0 0 5px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:13px;font-weight:700;color:#0c0d10;">Enang Weezie</p>
        <p class="brand-muted" style="margin:0 0 10px;font-size:12px;line-height:1.6;color:#3f434e;">Web design &amp; branding</p>
        <a class="brand-link" href="https://weezie.site/" style="font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:12px;color:#2f6bff;text-decoration:underline;">weezie.site</a>
      </td></tr></table>
    </td></tr>
    ${outreach ? `<tr><td class="brand-muted" style="padding:0 26px 26px;font-size:11px;line-height:1.7;color:#3f434e;">Don't want future notes from me? Simply reply &quot;stop&quot; and I'll remove you immediately.</td></tr>` : ''}
  </table>
</td></tr></table>
</body></html>`
}
