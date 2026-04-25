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
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>ForgeFit</title>
  </head>
  <body style="margin:0;padding:0;background:#080809;color:#FFFFFF;-webkit-font-smoothing:antialiased;">
    <!-- Preheader (hidden, shows in inbox preview) -->
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#080809;">
      ${previewText}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080809;">
      <tr>
        <td align="center" style="padding:48px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:32px;">
                <img src="${logoUrl}" alt="ForgeFit" width="64" height="64" style="display:block;border:0;outline:0;width:64px;height:64px;" />
              </td>
            </tr>

            <!-- Hero card -->
            <tr>
              <td style="background:#14141A;border:1px solid #22222A;border-radius:20px;padding:48px 40px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                  ${position ? `
                  <!-- Big position number -->
                  <tr>
                    <td align="center" style="padding-bottom:8px;">
                      <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C8F542;">
                        Your spot
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:8px;">
                      <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:80px;font-weight:900;letter-spacing:-4px;color:#FFFFFF;line-height:1;">
                        ${heroNumber}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9A9AA3;">
                        ${heroLabel}
                      </p>
                    </td>
                  </tr>
                  ` : `
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:-1px;color:#FFFFFF;line-height:1.1;">
                        You're on the list.
                      </p>
                    </td>
                  </tr>
                  `}

                  <!-- Headline + body -->
                  <tr>
                    <td style="padding-bottom:16px;">
                      <h1 style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#FFFFFF;line-height:1.25;">
                        Train Smarter. Get Stronger.
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:32px;">
                      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;color:#9A9AA3;line-height:1.6;">
                        Thanks for joining ForgeFit early access. You're one of the first to get the AI gym coach built for serious lifters — not another logbook.
                      </p>
                    </td>
                  </tr>

                  <!-- Feature list -->
                  <tr>
                    <td style="padding-bottom:32px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-bottom:14px;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C8F542;">
                            What you're getting
                          </td>
                        </tr>
                        ${featureRow('Ember', 'Your AI coach in your pocket')}
                        ${featureRow('AI workouts', 'Personalised plans that adapt as you progress')}
                        ${featureRow('Progressive overload', 'Smart suggestions every set, every session')}
                        ${featureRow('Strength analytics', 'PRs, ratios, ranks — Bronze to Ultimate Chad')}
                      </table>
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td align="center" style="padding-bottom:8px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background:#C8F542;border-radius:12px;">
                            <a href="${appUrl}" style="display:inline-block;padding:16px 32px;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.3px;color:#080809;text-decoration:none;">
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

            <!-- Sub-message -->
            <tr>
              <td style="padding:32px 40px 0;">
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
              <td style="padding:48px 40px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #22222A;">
                  <tr>
                    <td style="padding-top:24px;">
                      <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#5A5A63;line-height:1.5;">
                        You received this because you joined the ForgeFit waitlist at <a href="${appUrl}" style="color:#9A9AA3;text-decoration:none;">forgefit.fitness</a>.
                      </p>
                      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#5A5A63;">
                        © 2026 ForgeFit · Train Smarter · Get Stronger
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
  </body>
</html>`;
}

function featureRow(title, desc) {
  return `<tr>
    <td style="padding:8px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="6" valign="top" style="padding-top:8px;">
            <div style="width:6px;height:6px;border-radius:50%;background:#C8F542;"></div>
          </td>
          <td style="padding-left:14px;">
            <p style="margin:0;font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;line-height:1.3;">
              ${title}
            </p>
            <p style="margin:2px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#9A9AA3;line-height:1.4;">
              ${desc}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}
