// POST /api/giscus-forward — GitHub Discussion webhook → Cursor automations webhook
// Adds the Authorization Bearer header GitHub cannot send.

const crypto = require('crypto');

const CURSOR_URL = process.env.CURSOR_GISCUS_WEBHOOK_URL;
const CURSOR_TOKEN = process.env.CURSOR_GISCUS_WEBHOOK_TOKEN;
const GITHUB_SECRET = process.env.GISCUS_GITHUB_WEBHOOK_SECRET;

function timingSafeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function verifyGitHubSignature(rawBody, signatureHeader, secret) {
  if (!secret) return true; // optional until secret is set
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return timingSafeEqual(expected, signatureHeader);
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  if (req.body && typeof req.body === 'object') return Buffer.from(JSON.stringify(req.body));
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!CURSOR_URL || !CURSOR_TOKEN) {
    return res.status(500).json({ error: 'CURSOR_GISCUS_WEBHOOK_URL or CURSOR_GISCUS_WEBHOOK_TOKEN not configured' });
  }

  const raw = await readRawBody(req);
  const sig = req.headers['x-hub-signature-256'];
  if (!verifyGitHubSignature(raw, sig, GITHUB_SECRET)) {
    return res.status(401).json({ error: 'Invalid GitHub signature' });
  }

  let event;
  try {
    event = JSON.parse(raw.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const githubEvent = req.headers['x-github-event'] || '';
  const action = event.action || '';
  // Only forward new discussion / discussion_comment creates
  if (action && action !== 'created') {
    return res.status(200).json({ ok: true, skipped: true, reason: 'action not created' });
  }
  if (githubEvent && githubEvent !== 'discussion' && githubEvent !== 'discussion_comment' && githubEvent !== 'ping') {
    return res.status(200).json({ ok: true, skipped: true, reason: 'unrelated event' });
  }
  if (githubEvent === 'ping') {
    return res.status(200).json({ ok: true, ping: true });
  }

  const body = {
    source: 'pqb-giscus-forwarder',
    github_event: githubEvent,
    action,
    repository: 'jz-brightzen/phaedrusqualitybookkeeping.com',
    event,
  };

  const upstream = await fetch(CURSOR_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CURSOR_TOKEN}`,
      'Content-Type': 'application/json',
      'X-GitHub-Event': githubEvent,
      'X-GitHub-Delivery': req.headers['x-github-delivery'] || '',
    },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  if (!upstream.ok) {
    return res.status(502).json({
      error: 'Cursor webhook rejected',
      status: upstream.status,
      body: text.slice(0, 300),
    });
  }
  return res.status(200).json({ ok: true, forwarded: true, status: upstream.status });
};
