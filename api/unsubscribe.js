import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const APP_URL = process.env.APP_URL || 'https://forgefit.fitness';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token || typeof token !== 'string' || token.length !== 64) {
    return res.status(400).send(resultPage('Invalid unsubscribe link.', true));
  }

  const { data: entry, error } = await supabase
    .from('waitlist')
    .select('id, email, status, unsubscribed_at')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (error || !entry) {
    return res.status(404).send(resultPage('This unsubscribe link is invalid.', true));
  }

  if (entry.unsubscribed_at) {
    return res.status(200).send(resultPage('You\'ve already been unsubscribed. You won\'t receive any more emails from ForgeFit.', false));
  }

  const { error: updateError } = await supabase
    .from('waitlist')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('id', entry.id);

  if (updateError) {
    console.error('Unsubscribe update error:', updateError);
    return res.status(500).send(resultPage('Something went wrong. Please try again or email hello@forgefit.fitness.', true));
  }

  return res.status(200).send(resultPage('You\'ve been unsubscribed from ForgeFit emails. You won\'t hear from us again.', false));
}

function resultPage(message, isError) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#080809" />
  <title>Unsubscribe — ForgeFit</title>
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
      font-size: 28px; font-weight: 900;
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
    }
    .icon.ok { background: rgba(200, 245, 66, 0.15); color: #C8F542; }
    .icon.err { background: rgba(255, 59, 48, 0.15); color: #FF3B30; }
    h1 { font-size: 24px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 16px; }
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
    <div class="icon ${isError ? 'err' : 'ok'}">${isError ? '!' : '&#10003;'}</div>
    <h1>${isError ? 'Oops' : 'Unsubscribed'}</h1>
    <p class="msg">${message}</p>
    <a href="${APP_URL}" class="cta">Back to ForgeFit &rarr;</a>
  </div>
</body>
</html>`;
}
