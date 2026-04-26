import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const APP_URL = process.env.APP_URL || 'https://forgefit.fitness';

async function getWaitlistPosition() {
  if (!AUDIENCE_ID) return null;
  try {
    const { data, error } = await resend.contacts.list({ audienceId: AUDIENCE_ID });
    if (error) {
      console.error('contacts.list error', error);
      return null;
    }
    return (data?.data?.length || 0) + 1;
  } catch (e) {
    console.error('contacts.list threw', e);
    return null;
  }
}

async function addToAudience(email) {
  if (!AUDIENCE_ID) return;
  try {
    await resend.contacts.create({
      audienceId: AUDIENCE_ID,
      email,
      unsubscribed: false,
    });
  } catch (e) {
    // duplicates throw — that's fine
    console.error('contacts.create error (likely duplicate)', e);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  const normalEmail = email.toLowerCase().trim();

  // Resend free tier is 2 req/sec — sequence carefully:
  //   1. contacts.list (Resend #1) — get position
  //   2. emails.send (Resend #2) — main outcome
  //   3. small delay
  //   4. contacts.create (Resend #3) — add to audience for future broadcasts
  // LaunchList (different service) fires in parallel with no Resend cost.

  const position = await getWaitlistPosition();
  fetch('https://getlaunchlist.com/s/tMLE9k', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'email=' + encodeURIComponent(normalEmail),
  }).catch((e) => console.error('LaunchList forward failed', e));

  const subject = position ? `You're #${position} on the ForgeFit waitlist` : `You're on the ForgeFit waitlist`;

  const { data, error } = await resend.emails.send({
    from: 'ForgeFit <noreply@forgefit.fitness>',
    to: [normalEmail],
    subject,
    html: brandedEmailHtml({ position, appUrl: APP_URL, logoUrl: 'https://forgefitwaitlist.vercel.app/forge-logo.png' }),
  });

  if (error) {
    console.error('Resend send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  // Email sent — wait past rate limit window then add to audience
  await new Promise((r) => setTimeout(r, 700));
  await addToAudience(normalEmail);

  return res.status(200).json({ success: true, position, emailId: data?.id });
}

// ── Branded email template ──────────────────────────────────────────────────
function brandedEmailHtml({ position, appUrl, logoUrl }) {
  const heroNumber = position ? `#${position}` : '';
  const heroLabel = position ? 'on the waitlist' : 'on the waitlist';
  const previewText = position
    ? `You're #${position} on the ForgeFit waitlist. The AI gym coach is on its way.`
    : `You're on the ForgeFit waitlist. The AI gym coach is on its way.`;

  // Brand tokens (matched to forgefit/client design system):
  //   bg          #080809
  //   card        rgba(255,255,255,0.04) → flattened to #14141A for email
  //   border      rgba(255,255,255,0.08) → flattened to #22222A
  //   lime        #C8F542
  //   lime-dark   #a8d620
  //   ink         #FFFFFF
  //   ink-mute    #9A9AA3
  //   ink-faint   #5A5A63

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
    <!-- "light dark" tells Gmail/Apple Mail "this email handles both modes itself; do NOT auto-adapt".
         Without this Gmail iOS aggressively inverts our intentional dark colors. -->
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>ForgeFit</title>
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      body, table, td, div, p, h1, span { box-sizing: border-box; }
      body {
        margin: 0 !important; padding: 0 !important;
        background-color: #080809 !important;
        background-image: url('https://forgefitwaitlist.vercel.app/bg-dark.png') !important;
        background-repeat: repeat !important;
      }
      /* The image bg is the "nuclear" defense — Gmail's color adapter can't
         invert image pixels. Even if it lightens our solid bg, the tiled
         #080809 PNG underneath keeps the canvas dark. */
      .ff-canvas {
        background-color: #080809 !important;
        background-image: url('https://forgefitwaitlist.vercel.app/bg-dark.png') !important;
        background-repeat: repeat !important;
      }
      .ff-card { background-color: #0F0F14 !important; }
      .ff-lime { color: #C8F542 !important; }
      .ff-white { color: #FFFFFF !important; }
      .ff-mute { color: #9A9AA3 !important; }
      .ff-cta-bg { background-color: #C8F542 !important; }
      .ff-cta-text { color: #080809 !important; }

      /* Gmail iOS / Android dark-mode hooks. Gmail rewrites attrs with
         data-ogsc / data-ogsb when adapting; targeting these locks colors. */
      u + .body .ff-canvas,
      [data-ogsc] .ff-canvas,
      [data-ogsb] .ff-canvas { background-color: #080809 !important; }
      [data-ogsc] .ff-card,
      [data-ogsb] .ff-card { background-color: #0F0F14 !important; }
      [data-ogsc] .ff-lime { color: #C8F542 !important; }
      [data-ogsc] .ff-white { color: #FFFFFF !important; }
      [data-ogsc] .ff-mute { color: #9A9AA3 !important; }

      /* Explicit dark-mode rule reaffirms intended palette so Gmail doesn't
         "fix" it for us. */
      @media (prefers-color-scheme: dark) {
        body, .ff-canvas { background-color: #080809 !important; }
        .ff-card { background-color: #0F0F14 !important; }
        .ff-lime { color: #C8F542 !important; }
        .ff-white { color: #FFFFFF !important; }
        .ff-cta-bg { background-color: #C8F542 !important; }
        .ff-cta-text { color: #080809 !important; }
      }
      @media (prefers-color-scheme: light) {
        body, .ff-canvas { background-color: #080809 !important; }
        .ff-card { background-color: #0F0F14 !important; }
        .ff-lime { color: #C8F542 !important; }
        .ff-white { color: #FFFFFF !important; }
        .ff-cta-bg { background-color: #C8F542 !important; }
        .ff-cta-text { color: #080809 !important; }
      }
    </style>
    <!--[if mso]>
    <style>table,td,div,h1,p {font-family: Arial, sans-serif !important;}</style>
    <![endif]-->
  </head>
  <body class="body" bgcolor="#080809" style="margin:0;padding:0;background-color:#080809;color:#FFFFFF;-webkit-font-smoothing:antialiased;width:100%;">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#080809;">
      ${previewText}
    </div>

    <!-- Full-width dark canvas — repeats in case Gmail strips body bg -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ff-canvas" bgcolor="#080809" style="background-color:#080809 !important;background:#080809 !important;width:100%;">
      <tr>
        <td class="ff-canvas" bgcolor="#080809" align="center" style="background-color:#080809;padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ff-canvas" bgcolor="#080809" style="background-color:#080809;width:100%;max-width:100%;">
            <tr>
              <td class="ff-canvas" bgcolor="#080809" align="center" style="background-color:#080809;padding:48px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#080809" style="max-width:600px;width:100%;background-color:#080809;">

                  <!-- Lime accent bar -->
                  <tr>
                    <td class="ff-canvas" bgcolor="#080809" align="center" style="background-color:#080809;padding-bottom:24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td bgcolor="#C8F542" height="3" width="48" style="background-color:#C8F542;line-height:3px;font-size:0;border-radius:2px;">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Logo -->
                  <tr>
                    <td class="ff-canvas" bgcolor="#080809" align="center" style="background-color:#080809;padding-bottom:8px;">
                      <img src="${logoUrl}" alt="ForgeFit" width="72" height="72" style="display:block;border:0;outline:0;width:72px;height:72px;" />
                    </td>
                  </tr>

                  <!-- Wordmark under logo -->
                  <tr>
                    <td class="ff-canvas" bgcolor="#080809" align="center" style="background-color:#080809;padding-bottom:40px;">
                      <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:4px;color:#5A5A63;text-transform:uppercase;">
                        FORGE<span style="color:#C8F542;">FIT</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Hero card with lime top border -->
                  <tr>
                    <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;border-top:3px solid #C8F542;border-radius:0 0 20px 20px;padding:48px 40px 40px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;">

                        ${position ? `
                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" align="center" style="background-color:#0F0F14;padding-bottom:8px;">
                            <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C8F542;">
                              ▸ Your spot
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" align="center" style="background-color:#0F0F14;padding-bottom:8px;">
                            <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:96px;font-weight:900;letter-spacing:-5px;color:#C8F542;line-height:1;text-shadow:0 0 32px rgba(200,245,66,0.3);">
                              ${heroNumber}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" align="center" style="background-color:#0F0F14;padding-bottom:36px;">
                            <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#9A9AA3;">
                              ${heroLabel}
                            </p>
                          </td>
                        </tr>
                        ` : `
                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" align="center" style="background-color:#0F0F14;padding-bottom:36px;">
                            <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:36px;font-weight:900;letter-spacing:-1px;color:#C8F542;line-height:1.1;">
                              You're in.
                            </p>
                          </td>
                        </tr>
                        `}

                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;padding-bottom:16px;">
                            <h1 style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:#FFFFFF;line-height:1.25;">
                              Train Smarter. <span style="color:#C8F542;">Get Stronger.</span>
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;padding-bottom:32px;">
                            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;color:#9A9AA3;line-height:1.6;">
                              Thanks for joining ForgeFit early access. You're one of the first to get the AI gym coach built for serious lifters — not another logbook.
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;padding-bottom:32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;">
                              <tr>
                                <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;padding-bottom:18px;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C8F542;">
                                  ━━ What you're getting
                                </td>
                              </tr>
                              ${featureRow('Ember', 'Your AI coach in your pocket')}
                              ${featureRow('AI workouts', 'Personalised plans that adapt as you progress')}
                              ${featureRow('Progressive overload', 'Smart suggestions every set, every session')}
                              ${featureRow('Strength analytics', 'PRs, ratios, ranks — Copper to Prismatic')}
                            </table>
                          </td>
                        </tr>

                        <!-- CTA -->
                        <tr>
                          <td class="ff-card" bgcolor="#0F0F14" align="center" style="background-color:#0F0F14;padding-bottom:8px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td bgcolor="#C8F542" style="background-color:#C8F542;border-radius:12px;box-shadow:0 4px 24px rgba(200,245,66,0.25);">
                                  <a href="${appUrl}" style="display:inline-block;padding:18px 36px;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;letter-spacing:0.5px;color:#080809;text-decoration:none;text-transform:uppercase;">
                                    Visit forgefit.fitness →
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>

                  <!-- Sub-message under card -->
                  <tr>
                    <td class="ff-canvas" bgcolor="#080809" style="background-color:#080809;padding:32px 40px 0;">
                      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:400;color:#9A9AA3;line-height:1.6;">
                        We'll email you the moment your spot opens up. Until then — stay consistent. Every set counts.
                      </p>
                      <p style="margin:24px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:400;color:#FFFFFF;">
                        — Campbell
                        <span style="color:#5A5A63;">· Founder, ForgeFit</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td class="ff-canvas" bgcolor="#080809" style="background-color:#080809;padding:48px 40px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ff-canvas" bgcolor="#080809" style="background-color:#080809;border-top:1px solid #22222A;">
                        <tr>
                          <td class="ff-canvas" bgcolor="#080809" style="background-color:#080809;padding-top:24px;">
                            <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#5A5A63;line-height:1.5;">
                              You received this because you joined the ForgeFit waitlist at <a href="${appUrl}" style="color:#C8F542;text-decoration:none;">forgefit.fitness</a>.
                            </p>
                            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#5A5A63;">
                              © 2026 ForgeFit <span style="color:#C8F542;">·</span> Train Smarter <span style="color:#C8F542;">·</span> Get Stronger
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function featureRow(title, desc) {
  return `<tr>
    <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;padding:10px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;">
        <tr>
          <td class="ff-card" bgcolor="#0F0F14" width="8" valign="top" style="background-color:#0F0F14;padding-top:8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#C8F542" width="8" height="8" style="background-color:#C8F542;border-radius:4px;line-height:8px;font-size:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
          <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;padding-left:16px;">
            <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;line-height:1.3;">
              ${title}
            </p>
            <p style="margin:3px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#9A9AA3;line-height:1.4;">
              ${desc}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}
