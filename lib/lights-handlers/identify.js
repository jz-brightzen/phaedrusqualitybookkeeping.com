// POST /api/lights/identify {alias} — browser (X-Passcode). Queues {action:"identify", alias} for the Mac mini,
// which blinks that light (flip to the opposite state ~3s, put it back, twice) so John can see which one it is.
// Same queue, same passcode check and lockouts as toggle. Refused while the home hub is offline.
// The page never knows device IPs; the Mini resolves alias -> ip (and EP40 child) from its own device list.
const crypto = require('crypto');
const L = require('../lights');

module.exports = async (req, res) => {
  if (!L.method(req, res, 'POST')) return;
  try {
    const store = await L.browserAuth(req, res);
    if (!store) return;
    const { body, error } = await L.readJson(req);
    if (error) return L.send(res, error, { error: error === 413 ? 'Body too large' : 'Invalid JSON' });
    if (typeof body.alias !== 'string' || !body.alias || body.alias.length > 100) return L.send(res, 400, { error: 'alias (string) required' });
    const s = await L.readState(store);
    const hub = L.lastReport(s);
    if (hub.offline) return L.send(res, 409, { error: 'hub offline', lastReport: hub.updated });
    if (!Object.prototype.hasOwnProperty.call(s.lights || {}, body.alias)) return L.send(res, 404, { error: 'Unknown light' });
    const cmd = { id: crypto.randomUUID(), action: 'identify', alias: body.alias, ts: Date.now() };
    await store.rpushEx(L.K.queue, JSON.stringify(cmd), 300);
    return L.send(res, 200, { id: cmd.id, queued: true });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
