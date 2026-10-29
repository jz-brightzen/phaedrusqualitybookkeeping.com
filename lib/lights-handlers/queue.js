// GET /api/lights/queue — Mac mini (Authorization: Bearer). Returns and removes pending commands.
// Commands older than 60s are dropped. Polled every 6s: exactly one Redis command per call.
// Shapes: {id, action:"toggle", alias, on, ts} and {id, action:"identify", alias, ts} (no "on"; a bridge
// that predates identify rejects it because "on" isn't a boolean, so it can never switch a light by mistake).
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
      if (c.action === 'identify') commands.push({ id: c.id, action: 'identify', alias: c.alias, ts: c.ts });
      else commands.push({ id: c.id, action: 'toggle', alias: c.alias, on: c.on, ts: c.ts });
    }
    return L.send(res, 200, { commands, dropped });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
