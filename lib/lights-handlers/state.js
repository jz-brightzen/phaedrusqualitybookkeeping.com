// GET /api/lights/state — browser (X-Passcode). Last state the Mac mini reported.
const L = require('../lights');

module.exports = async (req, res) => {
  if (!L.method(req, res, 'GET')) return;
  try {
    const store = await L.browserAuth(req, res);
    if (!store) return;
    const s = await L.readState(store);
    const hub = L.lastReport(s);
    // lastReport/offline: home hub banner (offline = no /report for 3+ min). stale kept for older pages.
    return L.send(res, 200, { lights: s.lights || {}, updated: s.updated || null, stale: hub.offline, lastReport: hub.updated, offline: hub.offline });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
