// GET /api/lights/state — browser (X-Passcode). Last state the Mac mini reported.
const L = require('../../lib/lights');

module.exports = async (req, res) => {
  if (!L.method(req, res, 'GET')) return;
  try {
    const store = await L.browserAuth(req, res);
    if (!store) return;
    const s = await L.readState(store);
    const t = s.updated ? Date.parse(s.updated) : NaN;
    const stale = !(t > 0) || Date.now() - t > L.STALE_MS;
    return L.send(res, 200, { lights: s.lights || {}, updated: s.updated || null, stale });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
