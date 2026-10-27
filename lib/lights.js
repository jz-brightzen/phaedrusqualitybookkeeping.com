// Shared helpers for /api/lights/* — same-origin queue between the /zcompound/lights/ page and the Mac mini.
// Nothing connects into the house: the Mini polls GET /api/lights/queue and POSTs /api/lights/report.
// Storage: Upstash Redis REST (pqb_jz_KV_REST_API_URL/_TOKEN, else KV_REST_API_*, else UPSTASH_REDIS_REST_*).
// Never logs passcodes or tokens.

const crypto = require('crypto');

const MAX_BODY = 32 * 1024;
const K = {
  state: 'lights:state',
  queue: 'lights:queue',
  result: (id) => `lights:result:${id}`,
  ipFail: (ip) => `lights:fail:ip:${ip}`,
  globalFail: 'lights:fail:global',
  globalLock: 'lights:lock:global',
};
const IP_LIMIT = 5;          // wrong codes per IP per minute
const GLOBAL_LIMIT = 20;     // wrong codes per hour, all IPs
const GLOBAL_LOCK_S = 15 * 60;
const RESULT_TTL_S = 10 * 60;
const CMD_MAX_AGE_MS = 60 * 1000;
const STALE_MS = 3 * 60 * 1000; // /state says stale:true when the last report is older than this

// ---------- storage ----------
// The Mini polls /queue every 2s (~43k calls/day), so the queue read is ONE billable command:
// LPOP key count is an atomic read-and-delete, and an empty queue writes nothing.
// (Upstash bills EVAL as 1 + each redis.call, and MULTI/EXEC as N+2, so both cost more.)
const POP_MAX = 50;

function redisStore() {
  const env = process.env;
  const url = env.pqb_jz_KV_REST_API_URL || env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.pqb_jz_KV_REST_API_TOKEN || env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const call = async (path, body) => {
    const r = await fetch(url.replace(/\/+$/, '') + path, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j) throw new Error(`store error ${r.status}`);
    return j;
  };
  const one = async (cmd) => { const j = await call('', cmd); if (j.error) throw new Error('store error'); return j.result; };
  const pipe = async (cmds) => { const j = await call('/pipeline', cmds); return j.map((x) => { if (x.error) throw new Error('store error'); return x.result; }); };
  return {
    get: (k) => one(['GET', k]),
    mget: (...ks) => one(['MGET', ...ks]),
    set: (k, v, ex) => one(ex ? ['SET', k, v, 'EX', String(ex)] : ['SET', k, v]),
    incrEx: async (k, ex) => (await pipe([['INCR', k], ['EXPIRE', k, String(ex), 'NX']]))[0],
    rpushEx: (k, v, ex) => pipe([['RPUSH', k, v], ['EXPIRE', k, String(ex)]]),
    popAll: async () => (await one(['LPOP', K.queue, String(POP_MAX)])) || [],
    setMany: (pairs, ex) => pipe(pairs.map(([k, v]) => ['SET', k, v, 'EX', String(ex)])),
  };
}

let storeOverride = null;
function getStore() { return storeOverride || redisStore(); }
function _setStore(s) { storeOverride = s; } // tests only

// ---------- http helpers ----------
function send(res, code, obj) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(code).json(obj);
}

async function readJson(req) {
  if (Number(req.headers['content-length'] || 0) > MAX_BODY) return { error: 413 };
  let raw;
  if (Buffer.isBuffer(req.body)) raw = req.body;
  else if (typeof req.body === 'string') raw = Buffer.from(req.body);
  else if (req.body && typeof req.body === 'object') raw = Buffer.from(JSON.stringify(req.body));
  else {
    const chunks = []; let size = 0;
    for await (const c of req) { size += c.length; if (size > MAX_BODY) return { error: 413 }; chunks.push(c); }
    raw = Buffer.concat(chunks);
  }
  if (raw.length > MAX_BODY) return { error: 413 };
  try { const v = JSON.parse(raw.toString('utf8')); return v && typeof v === 'object' && !Array.isArray(v) ? { body: v } : { error: 400 }; }
  catch { return { error: 400 }; }
}

function clientIp(req) {
  const xf = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = xf || String(req.headers['x-real-ip'] || '').trim() || 'unknown';
  return ip.replace(/[^0-9a-fA-F:.]/g, '').slice(0, 64) || 'unknown';
}

function envHash(name) {
  const v = String(process.env[name] || '').trim().toLowerCase();
  return /^[0-9a-f]{64}$/.test(v) ? v : null;
}
function hashMatches(secret, expectedHex) {
  if (typeof secret !== 'string' || !secret || secret.length > 512) return false;
  const got = crypto.createHash('sha256').update(secret, 'utf8').digest();
  const want = Buffer.from(expectedHex, 'hex');
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}

// Browser auth with lockouts. Returns null when OK, otherwise already responded.
async function browserAuth(req, res) {
  const expected = envHash('LIGHTS_PASSCODE_SHA256');
  const store = getStore();
  if (!expected || !store) { send(res, 503, { error: 'bridge not set up' }); return false; }
  const ip = clientIp(req);
  const [lock, ipFails] = await store.mget(K.globalLock, K.ipFail(ip));
  if (lock) { send(res, 429, { error: 'locked', scope: 'global', retryAfter: GLOBAL_LOCK_S }); return false; }
  if (Number(ipFails || 0) >= IP_LIMIT) { send(res, 429, { error: 'locked', scope: 'ip', retryAfter: 60 }); return false; }
  if (hashMatches(req.headers['x-passcode'], expected)) return store;
  await store.incrEx(K.ipFail(ip), 60);
  const g = await store.incrEx(K.globalFail, 3600);
  if (Number(g) >= GLOBAL_LIMIT) await store.set(K.globalLock, '1', GLOBAL_LOCK_S);
  send(res, 401, { error: 'bad passcode' });
  return false;
}

function bridgeAuth(req, res) {
  const expected = envHash('BRIDGE_TOKEN_SHA256');
  const store = getStore();
  if (!expected || !store) { send(res, 503, { error: 'bridge not set up' }); return false; }
  const m = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ''));
  if (!m || !hashMatches(m[1].trim(), expected)) { send(res, 401, { error: 'unauthorized' }); return false; }
  return store;
}

function method(req, res, allowed) {
  if (req.method === allowed) return true;
  res.setHeader('Allow', allowed);
  send(res, 405, { error: 'Method not allowed' });
  return false;
}

const STATES = new Set(['on', 'off', 'unknown']);
const RESULT_STATES = new Set(['on', 'off', 'unknown', 'error']);
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

async function readState(store) {
  const raw = await store.get(K.state);
  if (!raw) return { lights: {}, updated: null };
  try { return JSON.parse(raw); } catch { return { lights: {}, updated: null }; }
}

module.exports = {
  K, IP_LIMIT, GLOBAL_LIMIT, GLOBAL_LOCK_S, RESULT_TTL_S, CMD_MAX_AGE_MS, STALE_MS, POP_MAX,
  STATES, RESULT_STATES, ID_RE,
  getStore, _setStore, send, readJson, clientIp, hashMatches, browserAuth, bridgeAuth, method, readState,
};
