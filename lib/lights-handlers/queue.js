// GET /api/lights/queue — Mac mini (Authorization: Bearer). Returns and removes pending commands.
// Commands older than 60s are dropped. Polled every 2s: exactly one Redis command per call.
const L = require('../lights');

module.exports = async (req, res) => {
  if (!L.method(req, res, 'GET')) return;
  try {
    const store = L.bridgeAuth(req, res);
    if (!store) return;
    const items = await store.popAll();
    const now = Date.now();
    const commands = [];
    let dropped = 0;
    for (const raw of items) {
      let c; try { c = JSON.parse(raw); } catch { dropped++; continue; }
      if (!c || typeof c.ts !== 'number' || now - c.ts > L.CMD_MAX_AGE_MS) { dropped++; continue; }
      commands.push({ id: c.id, alias: c.alias, on: c.on, ts: c.ts });
    }
    return L.send(res, 200, { commands, dropped });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
