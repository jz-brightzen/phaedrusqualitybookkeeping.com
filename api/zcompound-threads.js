// GET /api/zcompound-threads — list zCompound expense discussion threads (comment counts).
// Uses GITHUB_TOKEN when set; otherwise returns 503 so the page falls back to threads.json.

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.ZCOMPOUND_GITHUB_TOKEN;
  if (!token) {
    return res.status(503).json({ error: 'GITHUB_TOKEN not configured', fallback: '/zcompound/expenses/threads.json' });
  }

  const query = `query {
    repository(owner:"jz-brightzen", name:"phaedrusqualitybookkeeping.com") {
      discussions(first:50, orderBy:{field:UPDATED_AT, direction:DESC}) {
        nodes { number title url updatedAt comments { totalCount } }
      }
    }
  }`;

  try {
    const r = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'pqb-zcompound-threads',
      },
      body: JSON.stringify({ query }),
    });
    const json = await r.json();
    if (!r.ok || json.errors) {
      return res.status(502).json({ error: 'GitHub GraphQL failed', detail: json.errors || json });
    }
    const nodes = (((json.data || {}).repository || {}).discussions || {}).nodes || [];
    const threads = nodes
      .filter((n) => n.title && n.title.startsWith('zcompound-expenses-'))
      .map((n) => ({
        term: n.title,
        number: n.number,
        url: n.url,
        comments: (n.comments && n.comments.totalCount) || 0,
        updatedAt: n.updatedAt,
      }));
    return res.status(200).json({ asOf: new Date().toISOString(), threads });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
};
