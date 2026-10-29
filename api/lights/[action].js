// /api/lights/:action — one function (Hobby caps a deployment at 12 functions).
// Browser (X-Passcode): state, toggle, identify, rooms, result. Mac mini (Bearer): queue, report.
const L = require('../../lib/lights');
const handlers = {
  state: require('../../lib/lights-handlers/state'),
  toggle: require('../../lib/lights-handlers/toggle'),
  identify: require('../../lib/lights-handlers/identify'),
  rooms: require('../../lib/lights-handlers/rooms'),
  result: require('../../lib/lights-handlers/result'),
  queue: require('../../lib/lights-handlers/queue'),
  report: require('../../lib/lights-handlers/report'),
};

module.exports = async (req, res) => {
  let action = req.query && req.query.action;
  if (!action) { const m = /^\/api\/lights\/([a-z]+)/.exec(String(req.url || '')); action = m && m[1]; }
  const h = Object.prototype.hasOwnProperty.call(handlers, action) ? handlers[action] : null;
  if (!h) return L.send(res, 404, { error: 'Not found' });
  return h(req, res);
};
