// /api/lights/rooms — browser (X-Passcode) for both methods. Page-only room labels; devices are never renamed.
//   GET                      -> {rooms: {alias: room}}         (1 auth MGET + 1 HGETALL)
//   POST {alias, room}       -> {ok, alias, room}              (room "" / null / "Unassigned" clears it)
// Stored in one Redis hash (lights:rooms). Alias must be a light the Mini currently reports.
const L = require('../lights');

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return L.send(res, 405, { error: 'Method not allowed' });
  }
  try {
    const store = await L.browserAuth(req, res);
    if (!store) return;
    if (req.method === 'GET') {
      const raw = await store.hgetall(L.K.rooms);
      const rooms = {};
      for (const [a, r] of Object.entries(raw || {})) { const c = L.cleanRoom(r); if (c && a.length <= 100) rooms[a] = c; }
      return L.send(res, 200, { rooms });
    }
    const { body, error } = await L.readJson(req);
    if (error) return L.send(res, error, { error: error === 413 ? 'Body too large' : 'Invalid JSON' });
    if (typeof body.alias !== 'string' || !body.alias || body.alias.length > 100) return L.send(res, 400, { error: 'alias (string) required' });
    const clear = body.room === null || body.room === '' || (typeof body.room === 'string' && /^\s*unassigned\s*$/i.test(body.room));
    const room = clear ? null : L.cleanRoom(body.room);
    if (!clear && !room) return L.send(res, 400, { error: `room must be 1-${L.ROOM_MAX} letters, numbers, spaces or ' & ( ) . , / # + -` });
    const s = await L.readState(store);
    if (!Object.prototype.hasOwnProperty.call(s.lights || {}, body.alias)) return L.send(res, 404, { error: 'Unknown light' });
    if (room) await store.hset(L.K.rooms, body.alias, room);
    else await store.hdel(L.K.rooms, body.alias);
    return L.send(res, 200, { ok: true, alias: body.alias, room });
  } catch (e) {
    return L.send(res, 502, { error: 'store unavailable' });
  }
};
