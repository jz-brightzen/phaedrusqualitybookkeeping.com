// GET /api/lights/result?id= — browser (X-Passcode). {state, error?} once the Mini reported it, else {pending:true}.
const L = require('../../lib/lights');

module.exports = async (req, res) => {
  if (!L.method(req, res, 'GET')) return;
  try {
    const store = await L.browserAuth(req, res);
    if (!store) return;
    const id = String((req.query && req.query.id) || new URL(req.url, 'http://x').searchParams.get('id') || '');
    if (!L.ID_RE.test(id)) return L.send(res, 400, { error: 'bad id' });
    const raw = await store.get(L.K.result(id));
    if (!raw) return L.send(res, 200, { pending: true });
    let r; try { r = JSON.parse(raw); } catch { r = { state: 'error', error: 'unreadable result' }; }
    return L.send(res, 200, r.error ? { state: r.state, error: r.error } : { state: r.state });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
