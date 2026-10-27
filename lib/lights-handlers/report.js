// POST /api/lights/report {lights:{alias:state}, results:[{id,state,error?}]} — Mac mini (Authorization: Bearer).
const L = require('../lights');

module.exports = async (req, res) => {
  if (!L.method(req, res, 'POST')) return;
  try {
    const store = L.bridgeAuth(req, res);
    if (!store) return;
    const { body, error } = await L.readJson(req);
    if (error) return L.send(res, error, { error: error === 413 ? 'Body too large' : 'Invalid JSON' });
    const { lights, results } = body;
    if (lights !== undefined) {
      if (!lights || typeof lights !== 'object' || Array.isArray(lights)) return L.send(res, 400, { error: 'lights must be an object' });
      const keys = Object.keys(lights);
      if (keys.length > 300) return L.send(res, 400, { error: 'too many lights' });
      for (const k of keys) {
        if (!k || k.length > 100 || !L.STATES.has(lights[k])) return L.send(res, 400, { error: 'bad light entry' });
      }
    }
    if (results !== undefined) {
      if (!Array.isArray(results) || results.length > 100) return L.send(res, 400, { error: 'results must be an array (max 100)' });
      for (const r of results) {
        if (!r || typeof r !== 'object' || !L.ID_RE.test(String(r.id))) return L.send(res, 400, { error: 'bad result entry' });
        if (r.error !== undefined && r.error !== null && (typeof r.error !== 'string' || r.error.length > 200)) return L.send(res, 400, { error: 'bad result error' });
        if (r.state === undefined && r.error) r.state = 'error';
        if (!L.RESULT_STATES.has(r.state)) return L.send(res, 400, { error: 'bad result state' });
      }
    }
    const updated = new Date().toISOString();
    if (lights !== undefined) await store.set(L.K.state, JSON.stringify({ lights, updated }));
    if (results && results.length) await store.setMany(results.map((r) => [L.K.result(r.id), JSON.stringify(r.error ? { state: r.state, error: r.error } : { state: r.state })]), L.RESULT_TTL_S);
    return L.send(res, 200, { ok: true, updated, lights: lights ? Object.keys(lights).length : 0, results: results ? results.length : 0 });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
