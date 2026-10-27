// POST /api/lights/toggle {alias, on} — browser (X-Passcode). Queues a command for the Mac mini.
const crypto = require('crypto');
const L = require('../../lib/lights');

module.exports = async (req, res) => {
  if (!L.method(req, res, 'POST')) return;
  try {
    const store = await L.browserAuth(req, res);
    if (!store) return;
    const { body, error } = await L.readJson(req);
    if (error) return L.send(res, error, { error: error === 413 ? 'Body too large' : 'Invalid JSON' });
    if (typeof body.alias !== 'string' || !body.alias || body.alias.length > 100 || typeof body.on !== 'boolean') {
      return L.send(res, 400, { error: 'alias (string) and on (boolean) required' });
    }
    const s = await L.readState(store);
    // Exact, case-sensitive match ("Tiffany lamp" and "Tiffany Lamp" are different lights).
    if (!Object.prototype.hasOwnProperty.call(s.lights || {}, body.alias)) return L.send(res, 404, { error: 'Unknown light' });
    const cmd = { id: crypto.randomUUID(), alias: body.alias, on: body.on, ts: Date.now() };
    await store.rpushEx(L.K.queue, JSON.stringify(cmd), 300);
    return L.send(res, 200, { id: cmd.id, queued: true });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
