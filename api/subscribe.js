import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
// The Resend audience is populated at confirmation time (api/confirm.js), not
// here — only double opted-in addresses belong in a broadcast audience.
const APP_URL = process.env.APP_URL || 'https://forgefit.fitness';
const CONSENT_VERSION = 'v1.0';

// NOTE ON CAPTCHA
// A Turnstile path used to live here. It was inert — the secret was never set,
// so verification short-circuited to `true`, and the client always posted an
// empty token. Setting the env var would therefore have rejected every real
// signup. It has been removed rather than left as protection that isn't.
// To add it back properly you need BOTH halves: render the Turnstile widget in
// SignupForm.astro and post its token, AND verify that token here. Doing only
// the server half breaks the form.

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── Disposable email domain blocklist ──────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'dispostable.com', 'mailnesia.com', 'maildrop.cc', 'discard.email',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'temp-mail.org',
  'fakeinbox.com', 'tempail.com', 'tempr.email', '10minutemail.com',
  'minutemail.com', 'emailondeck.com', 'getnada.com', 'mohmal.com',
  'burnermail.io', 'inboxbear.com', 'mailcatch.com', 'mailsac.com',
  'harakirimail.com', 'tmpmail.net', 'tmpmail.org', 'bupmail.com',
  'tmail.ws', 'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'spam4.me', 'spamgourmet.com', 'mytemp.email',
  'mailtemp.net', 'airmail.cc', 'crazymailing.com',
]);

const FAKE_PATTERNS = [
  /^test@test\./i, /^asdf@/i, /^aaa@/i, /^abc@abc\./i,
  /^admin@example\./i, /^user@example\./i, /^foo@bar\./i,
  /^noreply@/i, /^no-reply@/i,
];

// ── Helpers ────────────────────────────────────────────────────────────────

function validateEmail(email) {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!re.test(email)) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase();
  if (!domain.includes('.')) return false;
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;
  return true;
}

function isDisposableEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  if (DISPOSABLE_DOMAINS.has(domain)) return true;
  for (const pattern of FAKE_PATTERNS) {
    if (pattern.test(email)) return true;
  }
  return false;
}

function normalizeEmail(email) {
  const trimmed = email.trim();
  const [local, domain] = trimmed.split('@');
  if (!local || !domain) return trimmed.toLowerCase();
  return `${local}@${domain.toLowerCase()}`;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

async function checkRateLimit(ip) {
  const { data } = await supabase.rpc('check_rate_limit', { check_ip: ip });
  return data === true;
}

async function recordRateLimit(ip) {
  await supabase.from('waitlist_rate_limits').insert({ ip_address: ip });

  // Prune old rows. A `cleanup_rate_limits()` function already existed in the
  // database (deletes anything older than 24h) but nothing ever called it, and
  // pg_cron is not installed on this project — so the table only ever grew.
  // Calling the existing function keeps the retention policy in one place
  // instead of hard-coding a second cutoff here.
  // Deliberately non-fatal: failing to tidy up must never fail a signup.
  try {
    await supabase.rpc('cleanup_rate_limits');
  } catch (err) {
    console.error('[WAITLIST] rate-limit cleanup failed (non-fatal)', err);
  }
}

async function getWaitlistPosition() {
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });
  return (count || 0) + 1;
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, website, ff_ts } = req.body;
  const ip = getClientIP(req);

  // 1. Honeypot check — bots fill hidden fields. Silently fake success.
  if (website) {
    return res.status(200).json({ success: true, position: Math.floor(Math.random() * 200) + 50 });
  }

  // 2. Time-based check — submissions under 2 seconds are bots. Silently fake success.
  if (ff_ts) {
    const elapsed = Date.now() - parseInt(ff_ts, 10);
    if (!Number.isFinite(elapsed) || elapsed < 2000) {
      return res.status(200).json({ success: true, position: Math.floor(Math.random() * 200) + 50 });
    }
  }

  // 3. Basic email validation
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Please enter your email address.' });
  }

  const normalEmail = normalizeEmail(email);

  if (!validateEmail(normalEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // 4. Disposable email check
  if (isDisposableEmail(normalEmail)) {
    return res.status(400).json({ error: 'Please use a permanent email address.' });
  }

  // 5. Rate limiting, per IP. Threshold and window live in the Supabase
  // `check_rate_limit` function. Check BEFORE recording: recording first made
  // each attempt count against itself, so the effective allowance was one
  // lower than the configured limit.
  const withinLimit = await checkRateLimit(ip);
  if (!withinLimit) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }
  await recordRateLimit(ip);

  // 7. Check for duplicate email
  const { data: existing } = await supabase
    .from('waitlist')
    .select('id, status, confirmation_token_expires_at')
    .eq('email', normalEmail)
    .maybeSingle();

  if (existing) {
    if (existing.status === 'confirmed') {
      return res.status(200).json({ success: true, position: null, message: 'You\'re already on the waitlist!' });
    }

    if (existing.status === 'pending') {
      // Only answer "check your inbox" while the link is actually live.
      // Previously this ignored expiry, so anyone whose 24h token lapsed was
      // locked out permanently: every retry pointed them at a dead link and
      // there was no path back. Expired rows are cleared so they can re-sign up.
      const expiresAt = existing.confirmation_token_expires_at
        ? new Date(existing.confirmation_token_expires_at).getTime()
        : 0;

      if (Date.now() < expiresAt) {
        return res.status(200).json({
          success: true,
          position: null,
          message: 'Check your inbox for the confirmation link.',
        });
      }
    }

    // Expired pending, or unsubscribed: drop the old row and let them re-sign up.
    await supabase.from('waitlist').delete().eq('id', existing.id);
  }

  // 8. Generate tokens
  const confirmationToken = generateToken();
  const unsubscribeToken = generateToken();
  const position = await getWaitlistPosition();

  // 9. Insert into Supabase waitlist (pending until confirmed)
  const { error: insertError } = await supabase.from('waitlist').insert({
    email: normalEmail,
    status: 'pending',
    signup_ip: ip,
    confirmation_token: confirmationToken,
    confirmation_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    consent_copy_version: CONSENT_VERSION,
    unsubscribe_token: unsubscribeToken,
    waitlist_position: position,
  });

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    if (insertError.code === '23505') {
      return res.status(200).json({ success: true, position: null, message: 'You\'re already on the waitlist!' });
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  // 10. Send double opt-in confirmation email
  const confirmUrl = `${APP_URL}/api/confirm?token=${confirmationToken}`;
  const unsubUrl = `${APP_URL}/api/unsubscribe?token=${unsubscribeToken}`;

  const { error: emailError } = await resend.emails.send({
    from: 'ForgeFit <noreply@forgefit.fitness>',
    to: [normalEmail],
    subject: `Confirm your ForgeFit waitlist spot (#${position})`,
    html: confirmationEmailHtml({ position, confirmUrl, unsubUrl, appUrl: APP_URL }),
  });

  if (emailError) {
    // Roll the row back. It was inserted as 'pending' before the send, so
    // leaving it behind strands the user permanently: the duplicate guard
    // answers every retry with "check your inbox" for an email that was never
    // delivered, and there is no way for them to recover.
    await supabase
      .from('waitlist')
      .delete()
      .eq('email', normalEmail)
      .eq('status', 'pending');

    // Distinguish "we hit our sending ceiling" from a genuine failure, so a
    // launch-day quota problem is obvious in the logs instead of looking like
    // a generic 500.
    const status = emailError.statusCode ?? emailError.status;
    const quotaHit =
      status === 429 ||
      /rate.?limit|quota|too many/i.test(`${emailError.name} ${emailError.message}`);

    console.error(
      quotaHit ? '[WAITLIST] Resend sending limit reached' : '[WAITLIST] Resend send error',
      emailError
    );

    return res.status(quotaHit ? 503 : 500).json({
      error: quotaHit
        ? 'We are handling a lot of signups right now. Please try again in a few minutes.'
        : 'Failed to send confirmation email. Please try again.',
    });
  }

  // LaunchList used to be fired here as backup tracking. Removed 2026-08-03:
  // it was an undisclosed third-party processor (absent from the privacy
  // policy's list) receiving every address, and it ran BEFORE double opt-in —
  // handing out addresses the code deliberately withholds from the Resend
  // audience until they are confirmed. Supabase is the source of truth, so it
  // was redundant as well as leaky. Closing the account was not enough on its
  // own: the fetch still transmitted the address, and the swallowed rejection
  // meant that would never have surfaced.

  return res.status(200).json({ success: true, position });
}

// ── Confirmation email template (double opt-in) ──────────────────────────

function confirmationEmailHtml({ position, confirmUrl, unsubUrl, appUrl }) {
  const previewText = `Confirm your ForgeFit waitlist spot — you're #${position}. One click to lock it in.`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Confirm your spot — ForgeFit</title>
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      body, table, td, div, p, h1, span { box-sizing: border-box; }
      body { margin: 0 !important; padding: 0 !important; background-color: #080809 !important; }
      .ff-canvas { background-color: #080809 !important; }
      .ff-card { background-color: #0F0F14 !important; }
      .ff-lime { color: #C8F542 !important; }
      .ff-white { color: #FFFFFF !important; }
      .ff-mute { color: #9A9AA3 !important; }
      u + .body .ff-canvas, [data-ogsc] .ff-canvas, [data-ogsb] .ff-canvas { background-color: #080809 !important; }
      [data-ogsc] .ff-card, [data-ogsb] .ff-card { background-color: #0F0F14 !important; }
      [data-ogsc] .ff-lime { color: #C8F542 !important; }
      [data-ogsc] .ff-white { color: #FFFFFF !important; }
      @media (prefers-color-scheme: dark) {
        body, .ff-canvas { background-color: #080809 !important; }
        .ff-card { background-color: #0F0F14 !important; }
      }
      @media (prefers-color-scheme: light) {
        body, .ff-canvas { background-color: #080809 !important; }
        .ff-card { background-color: #0F0F14 !important; }
      }
    </style>
  </head>
  <body class="body" bgcolor="#080809" style="margin:0;padding:0;background-color:#080809;color:#FFFFFF;-webkit-font-smoothing:antialiased;width:100%;">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#080809;">${previewText}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="ff-canvas" bgcolor="#080809" style="background-color:#080809;width:100%;">
      <tr>
        <td class="ff-canvas" bgcolor="#080809" align="center" style="background-color:#080809;padding:48px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:8px;">
                <img src="https://forgefitwaitlist.vercel.app/forge-logo.png" alt="ForgeFit" width="56" height="56" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:32px;">
                <p style="margin:0;font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#5A5A63;text-transform:uppercase;">FORGE<span style="color:#C8F542;">FIT</span></p>
              </td>
            </tr>

            <!-- Card -->
            <tr>
              <td class="ff-card" bgcolor="#0F0F14" style="background-color:#0F0F14;border-top:3px solid #C8F542;border-radius:0 0 20px 20px;padding:48px 40px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                  <tr>
                    <td align="center" style="padding-bottom:8px;">
                      <p style="margin:0;font-family:'Barlow',sans-serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C8F542;">&#9658; Confirm your spot</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:8px;">
                      <p style="margin:0;font-family:'Barlow',sans-serif;font-size:80px;font-weight:900;letter-spacing:-4px;color:#C8F542;line-height:1;">#${position}</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <p style="margin:0;font-family:sans-serif;font-size:16px;color:#9A9AA3;line-height:1.5;">Click the button below to confirm your spot on the ForgeFit waitlist. This link expires in 24 hours.</p>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td bgcolor="#C8F542" style="background-color:#C8F542;border-radius:12px;">
                            <a href="${confirmUrl}" style="display:inline-block;padding:18px 40px;font-family:'Barlow',sans-serif;font-size:16px;font-weight:800;letter-spacing:0.5px;color:#080809;text-decoration:none;text-transform:uppercase;">Confirm my spot &rarr;</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom:16px;">
                      <p style="margin:0;font-family:sans-serif;font-size:14px;color:#5A5A63;line-height:1.5;">If the button doesn't work, copy and paste this link:<br/><a href="${confirmUrl}" style="color:#C8F542;word-break:break-all;font-size:12px;">${confirmUrl}</a></p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:32px 40px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #22222A;">
                  <tr>
                    <td style="padding-top:24px;">
                      <p style="margin:0 0 8px;font-family:sans-serif;font-size:12px;color:#5A5A63;line-height:1.5;">
                        You received this because you signed up at <a href="${appUrl}" style="color:#C8F542;text-decoration:none;">forgefit.fitness</a>. If you didn't sign up, ignore this email.
                      </p>
                      <p style="margin:0 0 8px;font-family:sans-serif;font-size:12px;color:#5A5A63;">
                        <a href="${unsubUrl}" style="color:#9A9AA3;text-decoration:underline;">Unsubscribe</a>
                      </p>
                      <p style="margin:0;font-family:sans-serif;font-size:12px;color:#5A5A63;">
                        &copy; 2026 ForgeFit &middot; Campbell Blair &middot; Australia
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
