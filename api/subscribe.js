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

  const positionLine = position ? `You're <strong>#${position}</strong> on the list.` : `You're on the list.`;
  const subject = position ? `You're #${position} on the ForgeFit waitlist 🏋️` : `You're on the ForgeFit waitlist 🏋️`;

  const { data, error } = await resend.emails.send({
    from: 'ForgeFit <noreply@forgefit.fitness>',
    to: [normalEmail],
    subject,
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background:#050505;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#f0f0f0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:48px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:16px;border:1px solid #1a1a1a;overflow:hidden;max-width:560px;width:100%;">

            <tr>
              <td style="padding:40px 40px 32px;border-bottom:1px solid #1a1a1a;">
                <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#f0f0f0;">
                  FORGE<span style="color:#A3FF12;">FIT</span>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:40px;">
                <h1 style="margin:0 0 16px;font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#f0f0f0;line-height:1.2;">
                  You're in. 💪
                </h1>
                <p style="margin:0 0 24px;font-size:18px;color:#A3FF12;line-height:1.4;font-weight:600;">
                  ${positionLine}
                </p>
                <p style="margin:0 0 24px;font-size:16px;color:#888;line-height:1.6;">
                  Thanks for joining the ForgeFit beta waitlist. You're one of the first people to get access to the AI gym coach built for serious lifters.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;border-radius:12px;margin-bottom:24px;">
                  <tr>
                    <td style="padding:24px;">
                      <p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:1px;color:#A3FF12;text-transform:uppercase;">What you're getting early access to</p>
                      <table cellpadding="0" cellspacing="0">
                        <tr><td style="padding:6px 0;font-size:15px;color:#ccc;">⚡ AI-generated personalised workouts</td></tr>
                        <tr><td style="padding:6px 0;font-size:15px;color:#ccc;">📈 Smart progressive overload tracking</td></tr>
                        <tr><td style="padding:6px 0;font-size:15px;color:#ccc;">🏆 Personal records &amp; strength analytics</td></tr>
                        <tr><td style="padding:6px 0;font-size:15px;color:#ccc;">🤖 Ember — your AI coach in your pocket</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 32px;font-size:15px;color:#666;line-height:1.6;">
                  We'll email you the moment your spot opens up. Until then, stay consistent — every set counts.
                </p>

                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:#A3FF12;border-radius:10px;">
                      <a href="${APP_URL}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#050505;text-decoration:none;letter-spacing:-0.2px;">
                        Learn more →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 40px;border-top:1px solid #1a1a1a;">
                <p style="margin:0;font-size:13px;color:#444;line-height:1.6;">
                  You're receiving this because you signed up at the ForgeFit waitlist.<br/>
                  © 2026 ForgeFit. <a href="${APP_URL}" style="color:#666;">forgefit.fitness</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
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
