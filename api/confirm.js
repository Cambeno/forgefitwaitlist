import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const APP_URL = process.env.APP_URL || 'https://forgefit.fitness';

/**
 * Add a confirmed address to the Resend broadcast audience.
 *
 * This used to run in api/subscribe.js behind a hard-coded 700ms sleep, which
 * added that latency to every signup and — worse — put addresses into a
 * marketing audience before they had confirmed. Running it here means only
 * double opted-in people are ever added, and the signup path no longer sleeps.
 *
 * Never allowed to fail the confirmation: the user has done their part.
 */
async function addToResendAudience(email) {
  if (!AUDIENCE_ID) return;
  try {
    await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
  } catch (err) {
    // Duplicates throw, which is expected and harmless.
    console.error('[WAITLIST] Resend audience add failed (non-fatal)', err);
  }
}

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token || typeof token !== 'string' || token.length !== 64) {
    return res.status(400).send(errorPage('Invalid confirmation link.'));
  }

  const { data: entry, error } = await supabase
    .from('waitlist')
    .select('id, email, status, confirmation_token_expires_at, waitlist_position')
    .eq('confirmation_token', token)
    .maybeSingle();

  if (error || !entry) {
    return res.status(404).send(errorPage('This confirmation link is invalid or has already been used.'));
  }

  if (entry.status === 'confirmed') {
    return res.status(200).send(successPage(entry.waitlist_position, true));
  }

  if (entry.status === 'unsubscribed') {
    return res.status(400).send(errorPage('This email has been unsubscribed. Sign up again at forgefit.fitness.'));
  }

  // Check token expiry (24 hours)
  const expiresAt = new Date(entry.confirmation_token_expires_at);
  if (Date.now() > expiresAt.getTime()) {
    // Clean up expired entry
    await supabase.from('waitlist').delete().eq('id', entry.id);
    return res.status(410).send(errorPage('This confirmation link has expired. Please sign up again at forgefit.fitness.'));
  }

  // Confirm the entry
  const { error: updateError } = await supabase
    .from('waitlist')
    .update({
      status: 'confirmed',
      confirmation_timestamp: new Date().toISOString(),
      confirmation_token: null,
      confirmation_token_expires_at: null,
    })
    .eq('id', entry.id);

  if (updateError) {
    console.error('Confirmation update error:', updateError);
    return res.status(500).send(errorPage('Something went wrong. Please try again.'));
  }

  // Now that consent is confirmed, add them to the broadcast audience.
  await addToResendAudience(entry.email);

  return res.status(200).send(successPage(entry.waitlist_position, false));
}

function successPage(position, alreadyConfirmed) {
  const heading = alreadyConfirmed ? 'Already confirmed' : 'You\'re in!';
  const message = alreadyConfirmed
    ? 'Your spot was already confirmed. We\'ll email you when TestFlight access opens.'
    : 'Your waitlist spot is locked in. We\'ll email you the moment your TestFlight invite is ready.';

  return pageShell(`
    <div class="icon">&#10003;</div>
    <h1>${heading}</h1>
    ${position ? `<p class="position">#${position}</p>` : ''}
    <p class="msg">${message}</p>
    <a href="${APP_URL}" class="cta">Back to ForgeFit &rarr;</a>
  `);
}

function errorPage(message) {
  return pageShell(`
    <div class="icon err">!</div>
    <h1>Oops</h1>
    <p class="msg">${message}</p>
    <a href="${APP_URL}" class="cta">Back to ForgeFit &rarr;</a>
  `);
}

function pageShell(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#080809" />
  <title>ForgeFit — Waitlist Confirmation</title>
  <link rel="icon" type="image/png" href="/forge-logo.png" />
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #080809; color: #fff;
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 480px; width: 100%;
      background: #0F0F14; border: 1px solid #22222A;
      border-radius: 24px; padding: 48px 40px;
      text-align: center;
    }
    .icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: rgba(200, 245, 66, 0.15); color: #C8F542;
      font-size: 28px; font-weight: 900;
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
    }
    .icon.err { background: rgba(255, 59, 48, 0.15); color: #FF3B30; }
    h1 {
      font-size: 28px; font-weight: 900; letter-spacing: -0.02em;
      margin-bottom: 12px;
    }
    .position {
      font-size: 64px; font-weight: 900; color: #C8F542;
      letter-spacing: -3px; line-height: 1; margin-bottom: 16px;
    }
    .msg { font-size: 16px; color: #9A9AA3; line-height: 1.5; margin-bottom: 32px; }
    .cta {
      display: inline-block; padding: 14px 32px;
      background: #C8F542; color: #080809;
      font-weight: 800; font-size: 14px; letter-spacing: 0.5px;
      text-transform: uppercase; text-decoration: none;
      border-radius: 12px;
      transition: transform 0.2s, filter 0.2s;
    }
    .cta:hover { transform: translateY(-2px); filter: brightness(1.1); }
  </style>
</head>
<body>
  <div class="card">
    ${content}
  </div>
</body>
</html>`;
}
