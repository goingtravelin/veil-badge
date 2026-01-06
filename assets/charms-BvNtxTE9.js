var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
let D, _, I;
let __tla = (async () => {
  class x {
    constructor(e = 6e4) {
      __publicField(this, "cache", /* @__PURE__ */ new Map());
      __publicField(this, "defaultTtlMs");
      this.defaultTtlMs = e;
    }
    get(e, t, s) {
      const n = this.cache.get(e);
      if (n && Date.now() <= n.expiresAt) return t ? Promise.resolve(n.value) : n.value;
      if (!t) {
        n && this.cache.delete(e);
        return;
      }
      return t().then((o) => (this.set(e, o, s), o));
    }
    set(e, t, s) {
      this.cache.set(e, {
        value: t,
        expiresAt: Date.now() + (s ?? this.defaultTtlMs)
      });
    }
    has(e) {
      const t = this.cache.get(e);
      return t ? Date.now() > t.expiresAt ? (this.cache.delete(e), false) : true : false;
    }
    delete(e) {
      this.cache.delete(e);
    }
    clear() {
      this.cache.clear();
    }
  }
  const E = new x(3e4), A = new x(3e5), R = new x(1e4), b = {
    mainnet: "https://mempool.space/api",
    testnet4: "https://mempool.space/testnet4/api",
    signet: "https://mempool.space/signet/api",
    regtest: "http://localhost:3001/api"
  };
  class C {
    async fetchUtxos(e, t) {
      const s = `utxos:${t}:${e}`;
      return E.get(s, async () => {
        const n = b[t], o = await fetch(`${n}/address/${e}/utxo`);
        if (!o.ok) throw new Error(`Failed to fetch UTXOs: ${o.statusText}`);
        return (await o.json()).map((c) => ({
          txid: c.txid,
          vout: c.vout,
          value: c.value
        }));
      });
    }
    async fetchTransaction(e, t) {
      const s = `tx:${t}:${e}`;
      return A.get(s, async () => {
        const n = b[t], o = await fetch(`${n}/tx/${e}/hex`);
        if (!o.ok) throw new Error(`Failed to fetch transaction: ${o.statusText}`);
        return o.text();
      }, 3e5);
    }
    async broadcast(e, t) {
      const s = b[t], n = await fetch(`${s}/tx`, {
        method: "POST",
        body: e
      });
      if (!n.ok) {
        const o = await n.text();
        throw new Error(`Broadcast failed: ${o}`);
      }
      return n.text();
    }
    async getCurrentBlockHeight(e) {
      const t = `blockHeight:${e}`;
      return R.get(t, async () => {
        const s = b[e], n = await fetch(`${s}/blocks/tip/height`);
        if (!n.ok) throw new Error(`Failed to fetch block height: ${n.statusText}`);
        return parseInt(await n.text(), 10);
      }, 3e4);
    }
    async getAddressInfo(e) {
      throw new Error("getAddressInfo not supported by Mempool.space");
    }
  }
  _ = function(r, e) {
    return new C();
  };
  function O(r) {
    return {
      acceleration: (r & 1) !== 0,
      extraction: (r & 2) !== 0,
      isolated: (r & 4) !== 0,
      too_clean: (r & 8) !== 0,
      erratic: (r & 16) !== 0,
      new_badge: (r & 32) !== 0
    };
  }
  function M(r) {
    if (!(r == null ? void 0 : r.app_public_inputs)) return null;
    for (const [e] of r.app_public_inputs) {
      const t = e.split("/");
      if (t.length === 3 && t[0] === "n" && t[1].length === 64 && t[2].length === 64) return e;
    }
    return null;
  }
  function B(r, e) {
    if (!(r == null ? void 0 : r.app_public_inputs)) return false;
    const t = e.split("/");
    if (t.length !== 3 || t[0] !== "n") return r.app_public_inputs.has(e);
    const s = t[2];
    for (const [n] of r.app_public_inputs) {
      const o = n.split("/");
      if (o.length === 3 && o[0] === "n" && o[2] === s) return true;
    }
    return false;
  }
  function U(r, e, t) {
    var _a;
    if (!((_a = r == null ? void 0 : r.tx) == null ? void 0 : _a.outs) || t < 0 || t >= r.tx.outs.length) return null;
    const s = r.tx.outs[t];
    if (!(s instanceof Map)) return null;
    const n = e.split("/");
    if (n.length !== 3 || n[0] !== "n") return null;
    const o = n[2];
    let a = 0, c = false;
    for (const [g] of r.app_public_inputs) {
      const f = g.split("/");
      if (f.length === 3 && f[0] === "n" && f[2] === o) {
        c = true;
        break;
      }
      a++;
    }
    if (!c) return null;
    const i = s.get(a);
    if (!i || typeof i != "object") return null;
    let l;
    return i instanceof Map ? l = Object.fromEntries(i) : l = i, typeof l.id != "string" || !l.id ? (console.warn("[extractVeilBadge] Invalid badge: missing or invalid id", l), null) : (l.volume_sum_squares !== void 0 && (l.volume_sum_squares = BigInt(l.volume_sum_squares)), typeof l.flags == "number" && (l.flags = O(l.flags)), l);
  }
  var d = ((r) => (r[r.DEBUG = 0] = "DEBUG", r[r.INFO = 1] = "INFO", r[r.WARN = 2] = "WARN", r[r.ERROR = 3] = "ERROR", r))(d || {});
  const F = {
    defaultLevel: d.INFO,
    enableTimestamps: true,
    enableColors: true
  };
  let h = {
    ...F
  };
  const w = {
    DEBUG: "#808080",
    INFO: "#2196F3",
    WARN: "#FF9800",
    ERROR: "#F44336"
  };
  function N() {
    const r = "DEBUG", e = {}, t = r.split(",");
    for (const s of t) {
      const [n, o] = s.includes(":") ? s.split(":") : [
        "",
        s
      ], a = d[o.toUpperCase()];
      a !== void 0 && (n ? e[n] = a : h.defaultLevel = a);
    }
    Object.keys(e).length > 0 && (h.moduleOverrides = e);
  }
  class T {
    constructor(e) {
      this.moduleName = e;
    }
    getLogLevel() {
      var _a;
      return ((_a = h.moduleOverrides) == null ? void 0 : _a[this.moduleName]) ?? h.defaultLevel;
    }
    shouldLog(e) {
      return e >= this.getLogLevel();
    }
    formatMessage(...e) {
      const t = h.enableTimestamps ? (/* @__PURE__ */ new Date()).toISOString().slice(11, 23) : "";
      return [
        t ? `[${t}] [${this.moduleName}]` : `[${this.moduleName}]`,
        ...e
      ];
    }
    debug(e, ...t) {
      if (!this.shouldLog(d.DEBUG)) return;
      const s = this.formatMessage(e, ...t);
      h.enableColors ? console.log(`%c${s[0]}`, `color: ${w.DEBUG}`, ...s.slice(1)) : console.log(...s);
    }
    info(e, ...t) {
      if (!this.shouldLog(d.INFO)) return;
      const s = this.formatMessage(e, ...t);
      h.enableColors ? console.info(`%c${s[0]}`, `color: ${w.INFO}`, ...s.slice(1)) : console.info(...s);
    }
    warn(e, ...t) {
      if (!this.shouldLog(d.WARN)) return;
      const s = this.formatMessage(e, ...t);
      h.enableColors ? console.warn(`%c${s[0]}`, `color: ${w.WARN}`, ...s.slice(1)) : console.warn(...s);
    }
    error(e, ...t) {
      if (!this.shouldLog(d.ERROR)) return;
      const s = this.formatMessage(e, ...t);
      h.enableColors ? console.error(`%c${s[0]}`, `color: ${w.ERROR}`, ...s.slice(1)) : console.error(...s);
    }
  }
  I = function(r) {
    return new T(r);
  };
  N();
  const u = I("CharmsService");
  let y = false, m = null, S = null;
  const p = /* @__PURE__ */ new Map(), v = 100;
  function k(r) {
    return r.slice(0, 64);
  }
  class L {
    async initWasm() {
      if (!y) return m || (m = (async () => {
        try {
          console.log("[CharmsService] Initializing WASM...");
          const e = "/veil-badge/", t = `${e}wasm/charms_lib.js`, s = `${e}wasm/charms_lib_bg.wasm`;
          console.log("[CharmsService] Loading JS from:", t), console.log("[CharmsService] Loading WASM from:", s);
          const n = await fetch(t);
          if (!n.ok) throw new Error(`Failed to load ${t}: ${n.status}`);
          const o = await n.text(), a = new Blob([
            o
          ], {
            type: "application/javascript"
          }), c = URL.createObjectURL(a), i = await import(c).then(async (m2) => {
            await m2.__tla;
            return m2;
          });
          URL.revokeObjectURL(c);
          const l = await fetch(s);
          if (!l.ok) throw new Error(`Failed to load ${s}: ${l.status}`);
          const g = await l.arrayBuffer();
          await i.default(g), S = i, y = true, console.log("[CharmsService] WASM initialized successfully");
        } catch (e) {
          throw m = null, console.error("[CharmsService] Failed to initialize WASM:", e), e;
        }
      })(), m);
    }
    isReady() {
      return y;
    }
    async extractAndVerifySpell(e, t = false) {
      if (!S) throw new Error("WASM module not initialized. Call initWasm() first.");
      const s = k(e);
      if (p.has(s)) {
        const n = p.get(s);
        return u.debug("[extractSpell] Cache hit for", e.slice(0, 16)), n ?? null;
      }
      try {
        u.debug("[extractSpell] Attempting extraction, txHex length:", e.length, "first 20 chars:", e.slice(0, 20));
        const n = S.extractAndVerifySpell({
          bitcoin: e
        }, t);
        if (u.debug("[extractSpell] Result:", n ? "spell found" : "null"), p.size >= v) {
          const o = p.keys().next().value;
          o && p.delete(o);
        }
        return p.set(s, n), n;
      } catch (n) {
        const o = n instanceof Error ? n.message : String(n);
        if (u.debug("[extractSpell] Error:", o.slice(0, 200)), p.size >= v) {
          const a = p.keys().next().value;
          a && p.delete(a);
        }
        return p.set(s, null), null;
      }
    }
    async scanUtxoForBadge(e, t, s, n) {
      try {
        const a = await _("mempool").fetchTransaction(e, n);
        u.debug(`[scanUtxo] Scanning ${e.slice(0, 8)}:${t}`);
        const c = await this.extractAndVerifySpell(a, false);
        if (!c) return u.debug(`[scanUtxo] No spell found in ${e.slice(0, 8)}`), null;
        u.debug(`[scanUtxo] Spell found! outs=${c.tx.outs.length}, app_public_inputs keys:`, c.app_public_inputs ? [
          ...c.app_public_inputs.keys()
        ] : "none");
        const i = c.tx.outs[t];
        if (!i) return u.debug(`[scanUtxo] No charm data at vout ${t}`), null;
        if (u.debug(`[scanUtxo] Charm data at vout ${t}:`, i), !B(c, s)) return u.debug(`[scanUtxo] hasVeilBadge returned false. Looking for veilAppId=${s}`), null;
        const l = U(c, s, t);
        return u.debug("[scanUtxo] extractVeilBadge returned:", l), l;
      } catch (o) {
        const a = o instanceof Error ? o.message : String(o);
        return u.warn("Error scanning UTXO", e.slice(0, 8), ":", a.slice(0, 100)), null;
      }
    }
    async scanUtxoForAnyBadge(e, t, s) {
      try {
        const o = await _("mempool").fetchTransaction(e, s);
        u.debug(`[scanUtxoAny] Scanning ${e.slice(0, 8)}:${t}`);
        const a = await this.extractAndVerifySpell(o, false);
        if (!a) return u.debug(`[scanUtxoAny] No spell found in ${e.slice(0, 8)}`), null;
        u.debug(`[scanUtxoAny] Spell found! outs=${a.tx.outs.length}, app_public_inputs keys:`, a.app_public_inputs ? [
          ...a.app_public_inputs.keys()
        ] : "none");
        const c = M(a);
        if (!c) return u.debug("[scanUtxoAny] No NFT app found in spell"), null;
        u.debug(`[scanUtxoAny] Found NFT app: ${c.slice(0, 20)}...`);
        const i = U(a, c, t);
        return u.debug("[scanUtxoAny] extractVeilBadge returned:", i), i;
      } catch (n) {
        const o = n instanceof Error ? n.message : String(n);
        return u.warn("Error scanning UTXO (any badge)", e.slice(0, 8), ":", o.slice(0, 100)), null;
      }
    }
    async discoverBadgesInUtxos(e, t, s, n) {
      u.debug(`[discoverBadges] Starting discovery with ${e.length} UTXOs, veilAppId=${t}, network=${s}`);
      const o = [], a = 10, c = 100;
      for (let i = 0; i < e.length; i += a) {
        const l = e.slice(i, i + a), g = await Promise.all(l.map(async (f) => {
          const $ = await this.scanUtxoForBadge(f.txid, f.vout, t, s);
          return $ ? {
            ...f,
            badge: $
          } : null;
        }));
        o.push(...g.filter((f) => f !== null)), n && n(Math.min(i + a, e.length), e.length), i + a < e.length && await new Promise((f) => setTimeout(f, c));
      }
      return o;
    }
  }
  D = new L();
})();
export {
  __tla,
  D as a,
  _ as b,
  I as c
};
