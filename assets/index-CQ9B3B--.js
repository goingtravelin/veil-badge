const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vendor-DaCOpwfI.js","assets/bitcoin-vendor-GUW4GuwG.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as g, R as Ae, j as e, A as z, C as $e, a as oe, S as _t, U as ie, W as ke, T as We, b as J, c as Xe, d as Tt, e as ue, f as Se, I as ze, g as Ye, F as At, h as $t, X as De, K as _e, i as Ne, k as Pt, E as It, l as Bt, L as re, m as Ct, P as pt, n as xt, o as Et, p as ht, G as Ut, q as Mt, s as Ot, t as Rt, u as Ce, v as mt, w as Wt, M as Lt, x as Ft } from "./react-vendor-pRRzawSB.js";
import { c as H, a as ne, b as Z, __tla as __tla_0 } from "./charms-BvNtxTE9.js";
import { p as Vt, q as Xt, s as Pe, B as K } from "./vendor-DaCOpwfI.js";
import { s as V, e as He, d as he } from "./bitcoin-vendor-GUW4GuwG.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  (function() {
    const s = document.createElement("link").relList;
    if (s && s.supports && s.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) n(a);
    new MutationObserver((a) => {
      for (const o of a) if (o.type === "childList") for (const c of o.addedNodes) c.tagName === "LINK" && c.rel === "modulepreload" && n(c);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(a) {
      const o = {};
      return a.integrity && (o.integrity = a.integrity), a.referrerPolicy && (o.referrerPolicy = a.referrerPolicy), a.crossOrigin === "use-credentials" ? o.credentials = "include" : a.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
    }
    function n(a) {
      if (a.ep) return;
      a.ep = true;
      const o = r(a);
      fetch(a.href, o);
    }
  })();
  const Ee = H("useCharmsWasm");
  function Dt(t = false) {
    const [s, r] = g.useState(false), [n, a] = g.useState(null), [o, c] = g.useState(false), l = g.useCallback(async () => {
      if (!s && !o) {
        c(true), a(null);
        try {
          Ee.debug("[useCharmsWasm] Initializing WASM module..."), await ne.initWasm(), r(true), Ee.debug("[useCharmsWasm] WASM ready:", ne.isReady());
        } catch (i) {
          const d = i instanceof Error ? i.message : "Unknown error";
          Ee.error("[useCharmsWasm] Failed to initialize WASM:", d), a(d), r(false);
        } finally {
          c(false);
        }
      }
    }, [
      s,
      o
    ]);
    return g.useEffect(() => {
      t && l();
    }, [
      t,
      l
    ]), {
      wasmReady: s,
      wasmError: n,
      initWasm: l
    };
  }
  const Je = "veil_burned_utxos";
  class Ht {
    getBurnedUtxos() {
      try {
        const s = localStorage.getItem(Je);
        return s ? JSON.parse(s) : [];
      } catch {
        return [];
      }
    }
    addBurnedUtxo(s) {
      const r = this.getBurnedUtxos();
      r.some((n) => n.utxoId === s) || (r.push({
        utxoId: s,
        burnedAt: Date.now()
      }), localStorage.setItem(Je, JSON.stringify(r)));
    }
    isUtxoBurned(s) {
      return this.getBurnedUtxos().some((r) => r.utxoId === s);
    }
  }
  function ft() {
    return new Ht();
  }
  const qt = "modulepreload", Kt = function(t) {
    return "/veil-badge/" + t;
  }, Qe = {}, bt = function(s, r, n) {
    let a = Promise.resolve();
    if (r && r.length > 0) {
      let c = function(d) {
        return Promise.all(d.map((m) => Promise.resolve(m).then((p) => ({
          status: "fulfilled",
          value: p
        }), (p) => ({
          status: "rejected",
          reason: p
        }))));
      };
      document.getElementsByTagName("link");
      const l = document.querySelector("meta[property=csp-nonce]"), i = (l == null ? void 0 : l.nonce) || (l == null ? void 0 : l.getAttribute("nonce"));
      a = c(r.map((d) => {
        if (d = Kt(d), d in Qe) return;
        Qe[d] = true;
        const m = d.endsWith(".css"), p = m ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${d}"]${p}`)) return;
        const x = document.createElement("link");
        if (x.rel = m ? "stylesheet" : qt, m || (x.as = "script"), x.crossOrigin = "", x.href = d, i && x.setAttribute("nonce", i), document.head.appendChild(x), m) return new Promise((v, u) => {
          x.addEventListener("load", v), x.addEventListener("error", () => u(new Error(`Unable to preload CSS for ${d}`)));
        });
      }));
    }
    function o(c) {
      const l = new Event("vite:preloadError", {
        cancelable: true
      });
      if (l.payload = c, window.dispatchEvent(l), !l.defaultPrevented) throw c;
    }
    return a.then((c) => {
      for (const l of c || []) l.status === "rejected" && o(l.reason);
      return s().catch(o);
    });
  }, Gt = [
    "https://v8.charms.dev/spells/prove"
  ];
  function be(t) {
    return "https://v8.charms.dev/spells/prove";
  }
  const de = {
    mainnet: be(),
    testnet4: be(),
    signet: be(),
    regtest: be()
  }, zt = {
    endpoint: de.testnet4,
    timeout: 3e5,
    retries: 2,
    mock: false
  };
  function ge(t) {
    return new Promise((s) => setTimeout(s, t));
  }
  const Ze = H("AppBinary"), Yt = "2026-01-05-vk-fix";
  let pe = null;
  pe = null;
  function Jt() {
    pe = null;
  }
  async function Qt(t = false) {
    if (t && Jt(), pe) return pe;
    try {
      const s = await fetch(`/veil-badge/charms/veil.wasm?v=${Yt}`, {
        cache: "no-store"
      });
      if (!s.ok) throw new Error(`Failed to load app binary: ${s.statusText}`);
      const r = await s.arrayBuffer(), n = new Uint8Array(r);
      Ze.info(`[AppBinary] Loaded WASM: ${n.length} bytes, first 4 bytes: ${n[0]},${n[1]},${n[2]},${n[3]}`);
      let a = "";
      const o = 8192;
      for (let l = 0; l < n.length; l += o) {
        const i = n.subarray(l, l + o);
        a += String.fromCharCode(...i);
      }
      const c = btoa(a);
      return pe = c, c;
    } catch (s) {
      throw Ze.error("[AppBinary] Failed to load Veil app binary:", s), new Error("Failed to load Charms app binary. Ensure veil.wasm is in public/charms/");
    }
  }
  async function Zt(t) {
    const s = await Qt();
    return {
      [t]: s
    };
  }
  const G = H("ProverService");
  class yt {
    constructor(s = "testnet4", r = {}) {
      __publicField(this, "config");
      __publicField(this, "network");
      this.network = s, this.config = {
        ...zt,
        ...r
      };
    }
    async prove(s, r) {
      var _a, _b, _c, _d, _e2;
      const n = r == null ? void 0 : r.onProgress, a = this.network === "regtest" ? [
        de[this.network]
      ] : Gt;
      let o = null, c = 0;
      for (let i = 0; i < this.config.retries; i++) {
        const d = a[c];
        try {
          const m = new URL(d).hostname;
          n == null ? void 0 : n(`Submitting to prover (${m})${i > 0 ? ` - attempt ${i + 1}/${this.config.retries}` : ""}...`);
          const p = new AbortController(), x = this.config.timeout, v = setTimeout(() => p.abort(), x);
          let u = 0, y = false;
          const k = setInterval(() => {
            if (y) return;
            u += 5;
            const E = Math.floor(x / 1e3);
            u < 30 ? n == null ? void 0 : n(`Generating ZK proof... (${u}s)`) : u < 60 ? n == null ? void 0 : n(`Still generating proof... this can take 1-3 minutes (${u}s)`) : u < E ? n == null ? void 0 : n(`Proof generation in progress... please wait (${u}s / ${E}s timeout)`) : n == null ? void 0 : n(`Waiting for prover response... (${u}s - may have timed out)`);
          }, 5e3);
          let T;
          try {
            const E = Vt(s.spellYaml);
            let I;
            if (this.config.mock) I = {
              "0000000000000000000000000000000000000000000000000000000000000000": ""
            };
            else {
              n == null ? void 0 : n("Loading app binary...");
              const W = (_a = E == null ? void 0 : E.apps) == null ? void 0 : _a.$00;
              if (!W || typeof W != "string") throw new Error("Invalid spell: missing or invalid app specification in apps.$00");
              const R = W.split("/");
              if (R.length !== 3) throw new Error(`Invalid app spec format: ${W}. Expected "n/appId/vk"`);
              const w = R[2];
              I = await Zt(w);
            }
            const S = {
              spell: E,
              binaries: I,
              prev_txs: ((_b = s.prevTxs) == null ? void 0 : _b.map((W) => ({
                bitcoin: W
              }))) || [],
              funding_utxo: `${s.fundingUtxo.txid}:${s.fundingUtxo.vout}`,
              funding_utxo_value: s.fundingUtxoValue,
              change_address: s.changeAddress,
              fee_rate: s.feeRate || 2,
              chain: "bitcoin"
            };
            s.signingPubkey && (S.signing_pubkey = s.signingPubkey, G.info("Including signing_pubkey in prover request for web wallet compatibility")), G.info("Sending prove request:", {
              endpoint: d,
              spell: JSON.stringify(E, null, 2).substring(0, 1e3),
              binaryVKs: Object.keys(I),
              binarySizes: Object.entries(I).map(([W, R]) => ({
                vk: W.substring(0, 16) + "...",
                sizeBytes: Math.round(R.length * 3 / 4),
                sizeKB: Math.round(R.length * 3 / 4 / 1024),
                b64Start: R.substring(0, 50),
                b64End: R.substring(R.length - 50)
              })),
              prevTxCount: ((_c = s.prevTxs) == null ? void 0 : _c.length) || 0,
              fundingUtxo: S.funding_utxo,
              fundingValue: S.funding_utxo_value,
              changeAddress: S.change_address,
              feeRate: S.fee_rate
            });
            const j = JSON.stringify(S);
            try {
              const W = {
                ...S,
                binaries: {
                  ...S.binaries
                }
              };
              for (const R of Object.keys(W.binaries)) W.binaries[R] = `[${S.binaries[R].length} chars base64]`;
              localStorage.setItem("lastProverRequest", JSON.stringify(W, null, 2)), G.info("DEBUG: Full request saved to localStorage.lastProverRequest (run: copy(localStorage.lastProverRequest) in console)"), localStorage.setItem("lastProverSpell", JSON.stringify(S.spell, null, 2)), G.info("DEBUG: Spell JSON saved to localStorage.lastProverSpell");
            } catch (W) {
              G.info("DEBUG: Could not save request to localStorage:", W);
            }
            T = await fetch(`${d}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body: j,
              signal: p.signal
            });
            const O = j.match(/"f27666[^"]+":"([^"]{100})/);
            G.info("Request body binary start:", (O == null ? void 0 : O[1]) || "not found");
          } catch (E) {
            throw y = true, clearInterval(k), clearTimeout(v), E instanceof Error && E.name === "AbortError" ? new Error(`Prover request timed out after ${x / 1e3}s`) : E;
          }
          if (y = true, clearInterval(k), clearTimeout(v), !T.ok) {
            const E = await T.text();
            G.error("Prover request failed:", {
              status: T.status,
              statusText: T.statusText,
              endpoint: d,
              responseBody: E,
              headers: Object.fromEntries(T.headers.entries())
            });
            let I = E, S = "";
            try {
              const j = JSON.parse(E);
              I = j.error || j.message || JSON.stringify(j), j.suggestion && (S = ` ${j.suggestion}`);
            } catch {
              T.status === 502 ? S = " The Charms prover service appears to be down. Please try again in a few minutes." : T.status === 503 ? S = " The prover service is temporarily unavailable. Please try again shortly." : T.status === 504 && (S = " The prover service timed out. It may be experiencing heavy load.");
            }
            throw new Error(`Prover error (${T.status} ${T.statusText}): ${I || "No error details provided"}${S}`);
          }
          const h = await T.json();
          if (!Array.isArray(h) || h.length !== 2) throw new Error(`Invalid prover response: expected array of 2 transactions, got ${JSON.stringify(h)}`);
          let P, B;
          if (typeof h[0] == "string") [P, B] = h;
          else if (typeof h[0] == "object" && h[0] !== null) P = h[0].bitcoin || h[0].cardano || "", B = h[1].bitcoin || h[1].cardano || "";
          else throw new Error(`Invalid prover response format: ${JSON.stringify(h)}`);
          if (G.info("Prover response parsed:", {
            commitTxLength: (P == null ? void 0 : P.length) || 0,
            spellTxLength: (B == null ? void 0 : B.length) || 0,
            commitTxPreview: (P == null ? void 0 : P.substring(0, 50)) || "empty",
            spellTxPreview: (B == null ? void 0 : B.substring(0, 50)) || "empty"
          }), !B || B.length === 0) throw new Error("Prover returned empty spell transaction");
          return n == null ? void 0 : n("Proof generated successfully!"), {
            success: true,
            commitTx: P,
            spellTx: B
          };
        } catch (m) {
          o = m instanceof Error ? m : new Error(String(m));
          const p = o.message.includes("Failed to fetch") || o.message.includes("ERR_CONNECTION") || o.message.includes("NetworkError") || o.message.includes("Network request failed");
          if (G.error(`Prover attempt ${i + 1}/${this.config.retries} failed:`, {
            error: o.message,
            stack: o.stack,
            endpoint: d,
            attempt: i + 1,
            isConnectionError: p
          }), p && c < a.length - 1) {
            c++;
            const x = a[c];
            G.info(`Connection failed, trying fallback endpoint: ${x}`), n == null ? void 0 : n("Primary prover unavailable, trying fallback..."), i = -1, await ge(1e3);
            continue;
          }
          if (i < this.config.retries - 1) {
            let x = Math.min(1e3 * Math.pow(2, i), 1e4);
            if (m && typeof m == "object" && "status" in m && m.status === 429) {
              const v = m && typeof m == "object" && "headers" in m ? (_e2 = (_d = m.headers) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d, "Retry-After") : null;
              if (v) {
                const u = parseInt(v, 10);
                isNaN(u) || (x = u * 1e3);
              }
            }
            n == null ? void 0 : n(`Prover request failed, retrying in ${x / 1e3}s...`), await ge(x);
          }
        }
      }
      const l = a.slice(0, c + 1).map((i) => {
        try {
          return new URL(i).hostname;
        } catch {
          return i;
        }
      }).join(", ");
      return {
        success: false,
        error: `${(o == null ? void 0 : o.message) || "Unknown prover error"} (tried: ${l})`
      };
    }
    async isAvailable() {
      const s = de[this.network] || this.config.endpoint;
      try {
        return (await fetch(s.replace("/spells/prove", "/ready"), {
          method: "GET",
          signal: AbortSignal.timeout(5e3)
        })).ok;
      } catch {
        return false;
      }
    }
    async validate(s) {
      const r = de[this.network] || this.config.endpoint;
      try {
        const n = await fetch(r.replace("/spells/prove", "/validate"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            proof: s
          })
        });
        return n.ok ? {
          valid: true
        } : {
          valid: false,
          error: await n.text()
        };
      } catch (n) {
        return {
          valid: false,
          error: n instanceof Error ? n.message : "Unknown error"
        };
      }
    }
    async getVersion() {
      const s = de[this.network] || this.config.endpoint;
      try {
        const r = await fetch(s.replace("/spells/prove", "/version"));
        return r.ok ? (await r.json()).version ?? "unknown" : "unknown";
      } catch {
        return "unknown";
      }
    }
    getNetwork() {
      return this.network;
    }
    setNetwork(s) {
      this.network = s;
    }
    getConfig() {
      return {
        ...this.config
      };
    }
    updateConfig(s) {
      this.config = {
        ...this.config,
        ...s
      };
    }
  }
  class es {
    constructor() {
      __publicField(this, "wasmModule", null);
    }
    async initialize() {
      if (!this.wasmModule) try {
        const s = await bt(() => import("./charms_lib-DC2Hh_uI.js"), []);
        await s.default(), this.wasmModule = s;
      } catch (s) {
        throw G.error("Failed to initialize WASM prover:", s), s;
      }
    }
    async prove(s) {
      await this.initialize();
      try {
        const r = this.wasmModule.prove(s.spellYaml, s.prevTxs, s.fundingUtxo, s.fundingUtxoValue, s.changeAddress, s.feeRate);
        return {
          success: true,
          commitTx: r.commit_tx,
          spellTx: r.spell_tx
        };
      } catch (r) {
        return {
          success: false,
          error: r instanceof Error ? r.message : "WASM proving failed"
        };
      }
    }
    async isAvailable() {
      try {
        return await this.initialize(), true;
      } catch {
        return false;
      }
    }
    async validate(s) {
      await this.initialize();
      try {
        return {
          valid: this.wasmModule.validate(s)
        };
      } catch (r) {
        return {
          valid: false,
          error: r instanceof Error ? r.message : "WASM validation failed"
        };
      }
    }
    async getVersion() {
      var _a, _b;
      try {
        return await this.initialize(), ((_b = (_a = this.wasmModule).version) == null ? void 0 : _b.call(_a)) ?? "wasm-local";
      } catch {
        return "unavailable";
      }
    }
  }
  class ts {
    constructor() {
      __publicField(this, "shouldFail", false);
      __publicField(this, "delay", 100);
    }
    setFailMode(s) {
      this.shouldFail = s;
    }
    setDelay(s) {
      this.delay = s;
    }
    async prove(s, r) {
      var _a, _b, _c, _d;
      const n = r == null ? void 0 : r.onProgress;
      if (n == null ? void 0 : n("Generating mock proof..."), await ge(this.delay), this.delay > 1e3 && (n == null ? void 0 : n("Mock proof generation in progress..."), await ge(this.delay)), this.shouldFail) return {
        success: false,
        error: "Mock prover failure"
      };
      const a = ((_a = s.fundingUtxo) == null ? void 0 : _a.txid) || "00".repeat(32), o = ((_b = s.fundingUtxo) == null ? void 0 : _b.vout.toString()) || "0", c = [
        "02000000",
        "01",
        ((_c = a.match(/.{2}/g)) == null ? void 0 : _c.reverse().join("")) || "00".repeat(32),
        ((_d = parseInt(o).toString(16).padStart(8, "0").match(/.{2}/g)) == null ? void 0 : _d.reverse().join("")) || "00000000",
        "00",
        "ffffffff",
        "01",
        "2202000000000000",
        "16",
        "0014" + "00".repeat(20),
        "00000000"
      ].join(""), l = [
        "02000000",
        "01",
        "00".repeat(32),
        "00000000",
        "00",
        "ffffffff",
        "01",
        "2202000000000000",
        "16",
        "0014" + "00".repeat(20),
        "00000000"
      ].join("");
      return n == null ? void 0 : n("Mock proof complete!"), {
        success: true,
        commitTx: c,
        spellTx: l,
        isMock: true
      };
    }
    async isAvailable() {
      return !this.shouldFail;
    }
    async validate(s) {
      return await ge(50), this.shouldFail ? {
        valid: false,
        error: "Mock validation failure"
      } : {
        valid: true
      };
    }
    async getVersion() {
      return "mock-1.0.0";
    }
  }
  function wt(t = "remote", s) {
    switch (t) {
      case "wasm":
        return new es();
      case "mock":
        return new ts();
      case "remote":
      default:
        return new yt(s == null ? void 0 : s.network, s == null ? void 0 : s.config);
    }
  }
  new yt("testnet4");
  const A = H("WalletService");
  class ss {
    constructor(s) {
      this.unisatProvider = s;
    }
    async requestAccounts() {
      A.debug("[UnisatAdapter] Requesting accounts...");
      try {
        const s = await this.unisatProvider.requestAccounts();
        if (A.debug("[UnisatAdapter] Got accounts:", s), s && s.length > 0) {
          const r = s[0];
          if (A.info("[UnisatAdapter] Connected address:", r), r.startsWith("tb1p") || r.startsWith("bc1p")) A.info("[UnisatAdapter] \u2705 Taproot address detected - compatible with Charms");
          else if (r.startsWith("tb1q") || r.startsWith("bc1q")) throw A.warn("[UnisatAdapter] \u26A0\uFE0F SegWit address detected. For Charms, switch to Taproot in UniSat settings."), new Error(`Charms requires a Taproot address (bc1p.../tb1p...).

To switch to Taproot in UniSat:
1. Click on your address at the top of UniSat
2. Select "Taproot (P2TR)" address type
3. Reconnect your wallet

Current address: ${r}`);
        }
        return s;
      } catch (s) {
        throw A.error("[UnisatAdapter] Failed to get accounts:", s), s;
      }
    }
    async getPublicKey() {
      A.debug("[UnisatAdapter] Getting public key...");
      try {
        const s = await this.unisatProvider.getPublicKey();
        return A.debug("[UnisatAdapter] Got public key:", s), s;
      } catch (s) {
        throw A.error("[UnisatAdapter] Failed to get public key:", s), s;
      }
    }
    async signMessage(s) {
      A.debug("[UnisatAdapter] Signing message...");
      try {
        const r = await this.unisatProvider.signMessage(s, "bip322-simple");
        return A.debug("[UnisatAdapter] Message signed"), r;
      } catch (r) {
        throw A.error("[UnisatAdapter] Failed to sign message:", r), r;
      }
    }
    async signPsbt(s, r) {
      A.debug("[UnisatAdapter] Signing PSBT...", {
        psbtLength: s.length,
        signInputs: r || "all inputs"
      });
      try {
        let n = s;
        if (!/^[0-9a-fA-F]+$/.test(s)) {
          A.debug("[UnisatAdapter] Converting PSBT from base64 to hex");
          const i = atob(s);
          n = Array.from(i, (d) => d.charCodeAt(0).toString(16).padStart(2, "0")).join("");
        }
        const a = {
          autoFinalized: false
        };
        if (r) {
          const i = [];
          for (const [d, m] of Object.entries(r)) for (const p of m) i.push({
            index: p,
            address: d
          });
          i.length > 0 && (a.toSignInputs = i);
        }
        A.debug("[UnisatAdapter] Calling signPsbt with options:", a);
        const o = await this.unisatProvider.signPsbt(n, a);
        A.debug("[UnisatAdapter] PSBT signed, length:", o.length);
        const c = new Uint8Array(o.match(/.{1,2}/g).map((i) => parseInt(i, 16))), l = btoa(String.fromCharCode(...c));
        return A.debug("[UnisatAdapter] Converted signed PSBT to base64"), l;
      } catch (n) {
        throw A.error("[UnisatAdapter] Failed to sign PSBT:", n), n;
      }
    }
    async getNetwork() {
      try {
        return await this.unisatProvider.getNetwork();
      } catch {
        return "unknown";
      }
    }
  }
  class rs {
    constructor(s) {
      this.xverseProvider = s;
    }
    async requestAccounts() {
      var _a;
      A.debug("[XverseAdapter] Requesting accounts with wallet_requestPermissions...");
      try {
        A.debug("[XverseAdapter] Calling wallet_requestPermissions...");
        const s = await this.xverseProvider.request("wallet_requestPermissions");
        A.debug("[XverseAdapter] Permission response:", s), A.debug("[XverseAdapter] Calling getAddresses...");
        const r = await this.xverseProvider.request("getAddresses", {
          purposes: [
            "payment",
            "ordinals"
          ]
        });
        if (A.debug("[XverseAdapter] getAddresses response:", r), r == null ? void 0 : r.error) throw new Error(`Xverse error: ${r.error.message}`);
        if (((_a = r == null ? void 0 : r.result) == null ? void 0 : _a.addresses) && Array.isArray(r.result.addresses)) {
          r.result.addresses.forEach((o, c) => {
            A.debug(`[XverseAdapter] Address ${c}:`, {
              address: o.address,
              purpose: o.purpose,
              addressType: o.addressType
            });
          });
          const n = r.result.addresses.find((o) => {
            var _a2, _b;
            return o.purpose === "ordinals" || ((_a2 = o.address) == null ? void 0 : _a2.startsWith("tb1p")) || ((_b = o.address) == null ? void 0 : _b.startsWith("bc1p"));
          });
          if (!n) {
            A.error("[XverseAdapter] \u26A0\uFE0F NO TAPROOT ADDRESS FOUND!"), A.error("[XverseAdapter] Charms requires a Taproot (bc1p.../tb1p...) address"), A.error("[XverseAdapter] Available addresses:", r.result.addresses.map((l) => l.address));
            const o = r.result.addresses.map((l) => l.address).join(", ");
            throw r.result.addresses.every((l) => {
              var _a2, _b;
              return ((_a2 = l.address) == null ? void 0 : _a2.startsWith("tb1q")) || ((_b = l.address) == null ? void 0 : _b.startsWith("bc1q"));
            }) ? new Error(`Charms requires a Taproot (bc1p.../tb1p...) address, but your wallet only provided SegWit addresses.

To enable Taproot addresses in Xverse:
1. Open Xverse wallet settings
2. Enable "Bitcoin" and "Ordinals & BRC-20"
3. Disconnect and reconnect your wallet

Current addresses: ${o}`) : new Error(`No Taproot address found. Charms requires a Taproot (bc1p.../tb1p...) address.

Please ensure your wallet supports Taproot/Ordinals and try reconnecting.

Available addresses: ${o}`);
          }
          const a = n;
          return A.info("[XverseAdapter] \u2705 Using ordinals/Taproot address for Charms:", a.address), [
            a.address
          ];
        }
        if (Array.isArray(r)) return r.map((n) => n.address || n);
        throw A.error("[XverseAdapter] Unexpected response format:", r), new Error("Unexpected response format from Xverse wallet");
      } catch (s) {
        throw A.error("[XverseAdapter] Failed to get accounts:", s), s;
      }
    }
    async getPublicKey() {
      var _a;
      A.debug("[XverseAdapter] Getting public key...");
      try {
        const s = await this.xverseProvider.request("getAddresses", {
          purposes: [
            "payment",
            "ordinals"
          ]
        });
        if (A.debug("[XverseAdapter] getAddresses for pubkey:", s), s == null ? void 0 : s.error) throw new Error(`Xverse error: ${s.error.message}`);
        if (((_a = s == null ? void 0 : s.result) == null ? void 0 : _a.addresses) && Array.isArray(s.result.addresses)) {
          const r = s.result.addresses.find((a) => {
            var _a2, _b;
            return a.purpose === "ordinals" || ((_a2 = a.address) == null ? void 0 : _a2.startsWith("tb1p")) || ((_b = a.address) == null ? void 0 : _b.startsWith("bc1p"));
          });
          if (!r) throw new Error(`Charms requires a Taproot (bc1p.../tb1p...) address, but your wallet only provided SegWit addresses.

To enable Taproot addresses in Xverse:
1. Open Xverse wallet settings
2. Enable "Bitcoin" and "Ordinals & BRC-20"
3. Disconnect and reconnect your wallet`);
          const n = r.publicKey || r.pubkey;
          return A.debug("[XverseAdapter] Extracted pubkey from ordinals address:", {
            purpose: r.purpose,
            address: r.address,
            pubkey: n
          }), n;
        }
        if (Array.isArray(s)) return s[0].publicKey || s[0].pubkey;
        throw new Error("Could not extract public key from response");
      } catch (s) {
        throw A.error("[XverseAdapter] Failed to get public key:", s), s;
      }
    }
    async signMessage(s) {
      var _a;
      const r = await this.xverseProvider.request("signMessage", {
        message: s,
        address: ""
      });
      if (r == null ? void 0 : r.error) throw new Error(`Xverse error: ${r.error.message}`);
      return ((_a = r == null ? void 0 : r.result) == null ? void 0 : _a.signature) || (r == null ? void 0 : r.signature) || r;
    }
    async signPsbt(s, r) {
      var _a;
      A.debug("[XverseAdapter] Signing PSBT:", {
        psbtLength: s.length,
        signInputs: r || "all inputs"
      });
      const n = {
        psbt: s,
        broadcast: false
      };
      r && (n.signInputs = r);
      const a = await this.xverseProvider.request("signPsbt", n);
      if (a == null ? void 0 : a.error) throw new Error(`Xverse error: ${a.error.message}`);
      return ((_a = a == null ? void 0 : a.result) == null ? void 0 : _a.psbt) || (a == null ? void 0 : a.psbt) || a;
    }
  }
  class ns {
    constructor() {
      __publicField(this, "provider", null);
      __publicField(this, "currentAddress", null);
      __publicField(this, "currentPubkey", null);
    }
    async connect() {
      const s = this.getProvider();
      if (!s) throw new Error("No Bitcoin wallet found. Please install Unisat, Xverse, or Leather.");
      const r = await s.requestAccounts();
      if (!r || r.length === 0) throw new Error("No accounts returned from wallet");
      const n = r[0], a = await s.getPublicKey();
      return this.provider = s, this.currentAddress = n, this.currentPubkey = a, {
        address: n,
        pubkey: a
      };
    }
    disconnect() {
      this.provider = null, this.currentAddress = null, this.currentPubkey = null;
    }
    async signMessage(s) {
      if (this.provider || (A.debug("[WalletService] Auto-connecting before signMessage..."), await this.connect()), !this.provider) throw new Error("Wallet not connected");
      return this.provider.signMessage(s);
    }
    async signPsbt(s, r) {
      if (this.provider || (A.debug("[WalletService] Auto-connecting before signPsbt..."), await this.connect()), !this.provider) throw new Error("Wallet not connected");
      if (!this.provider.signPsbt) throw new Error("Wallet does not support PSBT signing");
      return this.provider.signPsbt(s, r);
    }
    async getPublicKey() {
      if (this.currentPubkey || (A.debug("[WalletService] Auto-connecting before getPublicKey..."), await this.connect()), !this.currentPubkey) throw new Error("Wallet not connected");
      return this.currentPubkey;
    }
    isConnected() {
      return this.provider !== null && this.currentAddress !== null;
    }
    getProvider() {
      var _a;
      return typeof window > "u" ? null : (A.debug("[WalletService] Checking for wallet providers:", {
        unisat: !!window.unisat,
        xverse: !!window.xverse,
        leather: !!window.leather,
        bitcoin: !!window.bitcoin,
        XverseProviders: !!window.XverseProviders,
        BitcoinProvider: !!window.BitcoinProvider
      }), window.unisat ? (A.debug("[WalletService] Using Unisat wallet"), new ss(window.unisat)) : window.xverse ? (A.debug("[WalletService] Using Xverse wallet (window.xverse)"), window.xverse) : ((_a = window.XverseProviders) == null ? void 0 : _a.BitcoinProvider) ? (A.debug("[WalletService] Using Xverse wallet (XverseProviders)"), A.debug("[WalletService] XverseProviders object:", window.XverseProviders), A.debug("[WalletService] BitcoinProvider object:", window.XverseProviders.BitcoinProvider), new rs(window.XverseProviders.BitcoinProvider)) : window.leather ? (A.debug("[WalletService] Using Leather wallet"), window.leather) : window.bitcoin ? (A.debug("[WalletService] Using generic bitcoin provider"), window.bitcoin) : (A.error("[WalletService] No Bitcoin wallet provider found"), null));
    }
  }
  class as {
    constructor() {
      __publicField(this, "connected", false);
      __publicField(this, "mockAddress", "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx");
      __publicField(this, "mockPubkey", "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798");
    }
    async connect() {
      return this.connected = true, {
        address: this.mockAddress,
        pubkey: this.mockPubkey
      };
    }
    disconnect() {
      this.connected = false;
    }
    async signMessage(s) {
      if (!this.connected) throw new Error("Wallet not connected");
      return `mock_signature_${s.slice(0, 16)}`;
    }
    async signPsbt(s) {
      if (!this.connected) throw new Error("Wallet not connected");
      return s;
    }
    async getPublicKey() {
      if (!this.connected) throw new Error("Wallet not connected");
      return this.mockPubkey;
    }
    isConnected() {
      return this.connected;
    }
  }
  function Ue(t = "browser") {
    return t === "mock" ? new as() : new ns();
  }
  class os {
    async sha256Hex(s) {
      const n = new TextEncoder().encode(s), a = await crypto.subtle.digest("SHA-256", n);
      return Array.from(new Uint8Array(a)).map((l) => l.toString(16).padStart(2, "0")).join("");
    }
    async generateNonce() {
      const s = new Uint8Array(32);
      return crypto.getRandomValues(s), Array.from(s).map((n) => n.toString(16).padStart(2, "0")).join("");
    }
    async generateBadgeId(s) {
      return this.sha256Hex(s);
    }
  }
  class is {
    constructor() {
      __publicField(this, "nonceCounter", 0);
    }
    async sha256Hex(s) {
      return (s.split("").reduce((a, o) => a + o.charCodeAt(0), 0) % 256).toString(16).padStart(2, "0").repeat(32);
    }
    async generateNonce() {
      return (this.nonceCounter++).toString(16).padStart(64, "0");
    }
    async generateBadgeId(s) {
      return this.sha256Hex(s);
    }
    reset() {
      this.nonceCounter = 0;
    }
  }
  function vt(t = "web") {
    return t === "mock" ? new is() : new os();
  }
  const Y = {
    MIN_TRUST_TO_VOUCH: 30,
    MIN_TRUST_TO_RECEIVE_VOUCH: 20,
    WINDOW_SIZE_BLOCKS: 4320,
    MIN_VOUCH_LOCK_BLOCKS: 1008,
    NEW_BADGE_THRESHOLD_BLOCKS: 12960,
    ISOLATION_THRESHOLD: 20,
    TOO_CLEAN_TX_THRESHOLD: 50,
    ACCELERATION_THRESHOLD: 3,
    EXTRACTION_MULTIPLIER: 10,
    ERRATIC_CV_THRESHOLD: 2,
    RISK_WEIGHTS: {
      acceleration: 25,
      extraction: 30,
      isolated: 20,
      too_clean: 10,
      erratic: 15,
      new_badge: 15
    },
    SEVERITY_DAMAGE: {
      Minor: 5,
      Major: 15,
      Severe: 50
    },
    DUST_LIMIT_SATS: 546,
    MIN_FUNDING_SATS: 2e3,
    MAX_STAKE_PERCENT: 100,
    MIN_STAKE_PERCENT: 1,
    TRUST_LEVELS: {
      CRITICAL_MAX: 20,
      LOW_MAX: 40,
      MEDIUM_MAX: 60,
      HIGH_MAX: 80
    },
    RISK_LEVELS: {
      MINIMAL_MAX: 15,
      LOW_MAX: 30,
      MODERATE_MAX: 50,
      HIGH_MAX: 75
    },
    BACKING_TIERS: {
      MIN_BACKED_COUNT: 10,
      MIN_BACKED_RATIO: 0.7
    }
  };
  function cs() {
    return {
      backed_count: 0,
      unbacked_count: 0,
      backed_volume: 0,
      unbacked_volume: 0
    };
  }
  function ls() {
    return {
      acceleration: false,
      extraction: false,
      isolated: false,
      too_clean: false,
      erratic: false,
      new_badge: false
    };
  }
  function ds(t, s, r) {
    return {
      id: t,
      created_at: r,
      pubkey: s,
      tx_total: 0,
      tx_positive: 0,
      tx_negative: 0,
      volume_total: 0,
      volume_sum_squares: BigInt(0),
      window_tx_count: 0,
      window_volume: 0,
      window_start: r,
      counterparty_count: 0,
      backing: cs(),
      vouches_out: [],
      vouches_in: [],
      cascade_damage: 0,
      trust: 15,
      risk: 35,
      flags: {
        ...ls(),
        isolated: true,
        new_badge: true
      },
      active_transactions: [],
      reporting_transactions: [],
      outcomes: {
        mutualPositive: 0,
        mutualNegative: 0,
        contestedIPositive: 0,
        contestedINegative: 0,
        timeout: 0,
        mutualTimeout: 0
      },
      last_nonce: "0".repeat(64),
      last_update: r
    };
  }
  function us(t, s) {
    return !t || t.length < 20 ? {
      valid: false,
      errors: [
        "Invalid address"
      ]
    } : !s || s.length < 64 ? {
      valid: false,
      errors: [
        "Invalid pubkey"
      ]
    } : {
      valid: true,
      errors: []
    };
  }
  function gs(t) {
    return !t.txid || t.txid.length !== 64 ? {
      valid: false,
      errors: [
        "Invalid UTXO txid"
      ]
    } : t.value < Y.MIN_FUNDING_SATS ? {
      valid: false,
      errors: [
        `UTXO value ${t.value} below minimum ${Y.MIN_FUNDING_SATS}`
      ]
    } : {
      valid: true,
      errors: []
    };
  }
  const et = "0".repeat(64), me = "387be787323b18dee023608f81ee6ba263b3b5a63efb4953a4ca6541e95c48b6", ps = 2e3;
  function jt(t, s, r = ps, n) {
    const a = t.filter((o) => {
      const c = `${o.txid}:${o.vout}`;
      return !(o.value < r || n && n.includes(c));
    });
    return a.length === 0 ? null : a.reduce((o, c) => c.value < o.value ? c : o);
  }
  const xs = 1008, hs = 432, ms = 144, ye = [
    {
      label: "1 day",
      blocks: 144
    },
    {
      label: "3 days",
      blocks: 432
    },
    {
      label: "7 days",
      blocks: 1008
    },
    {
      label: "14 days",
      blocks: 2016
    },
    {
      label: "30 days",
      blocks: 4320
    }
  ];
  function fs(t, s) {
    return Math.max(0, t - s);
  }
  function se(t) {
    const s = t * 10;
    if (s < 60) return `${s} minutes`;
    const r = Math.floor(s / 60);
    if (r < 24) return `${r} hour${r === 1 ? "" : "s"}`;
    const n = Math.floor(r / 24);
    return `${n} day${n === 1 ? "" : "s"}`;
  }
  function Te(t) {
    return t >= 1e8 ? `${(t / 1e8).toFixed(2)} BTC` : t >= 1e6 ? `${(t / 1e6).toFixed(2)}M sats` : t >= 1e3 ? `${(t / 1e3).toFixed(1)}k sats` : `${t} sats`;
  }
  function bs(t, s = 8) {
    return t.length <= s * 2 + 3 ? t : `${t.slice(0, s)}...${t.slice(-s)}`;
  }
  const xe = H("TaprootKeyService");
  V.initEccLib(He);
  const ys = Xt(He), Ie = "veil_seed_phrase";
  function ws(t) {
    return t.length === 33 ? K.from(t.subarray(1, 33)) : t;
  }
  function vs(t = true) {
    return t ? V.networks.testnet : V.networks.bitcoin;
  }
  async function Be(t, s, r = true) {
    const n = await Pe.mnemonicToSeed(t), a = vs(r), o = ys.fromSeed(n, a), l = `m/86'/${r ? "1'" : "0'"}/0'/0/${s}`, i = o.derivePath(l), d = i.privateKey;
    if (!d) throw new Error(`Could not derive private key for index ${s}`);
    const m = K.from(i.publicKey), p = ws(m), x = V.crypto.taggedHash("TapTweak", p), v = K.from(x), u = m[0] === 3, y = K.from(d), k = u ? K.from(he.privateNegate(y)) : y, T = he.privateAdd(k, v);
    if (!T) throw new Error("Tweak resulted in invalid private key");
    const h = V.payments.p2tr({
      internalPubkey: p,
      network: a
    });
    if (!h.address || !h.output) throw new Error("Failed to generate P2TR address");
    return {
      index: s,
      derivationPath: l,
      privateKey: K.from(d),
      tweakedPrivateKey: K.from(T),
      internalPubkey: p,
      xOnlyPubkey: p,
      address: h.address,
      script: h.output.toString("hex"),
      p2tr: h
    };
  }
  async function Le(t, s, r = true, n = 100) {
    xe.debug("Searching for address index matching script:", s.substring(0, 20) + "...");
    for (let a = 0; a < n; a++) {
      const o = await Be(t, a, r);
      if (o.script === s) return xe.info(`Found matching address at index ${a}:`, o.address), o;
    }
    return xe.warn(`No matching address found in first ${n} indices`), null;
  }
  function js(t, s) {
    const r = V.Transaction.fromHex(t);
    if (s >= r.outs.length) throw new Error(`Output index ${s} out of range (tx has ${r.outs.length} outputs)`);
    return r.outs[s].value;
  }
  function Ns(t) {
    if (!Pe.validateMnemonic(t)) throw new Error("Invalid seed phrase");
    localStorage.setItem(Ie, t), xe.info("Seed phrase stored");
  }
  function fe() {
    return localStorage.getItem(Ie);
  }
  function ae() {
    return !!localStorage.getItem(Ie);
  }
  function ks() {
    localStorage.removeItem(Ie), xe.info("Seed phrase cleared");
  }
  function Ss() {
    return Pe.generateMnemonic(128);
  }
  function _s(t) {
    return Pe.validateMnemonic(t);
  }
  async function Fe(t, s = true) {
    return (await Be(t, 0, s)).address;
  }
  async function Ts(t, s = true) {
    const r = fe();
    if (!r) throw new Error("No seed phrase stored");
    const n = await Be(r, 0, s), a = V.crypto.sha256(K.from(t, "utf8")), o = he.signSchnorr(a, n.privateKey);
    return K.from(o).toString("hex");
  }
  const L = H("TransactionSigningService");
  V.initEccLib(He);
  async function As(t, s, r = true) {
    L.info("Signing commit transaction...");
    const n = fe();
    if (!n) throw new Error("Seed phrase not found. Please import your seed phrase first.");
    try {
      const c = V.Transaction.fromHex(t).ins[0].index, l = js(s, c);
      L.debug("Funding UTXO value:", l);
      const m = V.Transaction.fromHex(s).outs[c].script.toString("hex"), p = await Le(n, m, r);
      if (!p) throw new Error("Could not find matching address for funding UTXO script. Make sure you imported the correct seed phrase that controls this address.");
      L.info("Found matching key at index:", p.index, "address:", p.address);
      const x = V.Transaction.fromHex(t);
      x.version = 2;
      const v = x.hashForWitnessV1(0, [
        p.p2tr.output
      ], [
        l
      ], V.Transaction.SIGHASH_DEFAULT), u = K.from(he.signSchnorr(v, p.tweakedPrivateKey));
      x.ins[0].witness = [
        u
      ];
      const y = x.toHex(), k = x.getId();
      return L.info("Commit transaction signed successfully:", k), {
        success: true,
        txid: k,
        signedHex: y
      };
    } catch (a) {
      throw L.error("Error signing commit transaction:", a), a;
    }
  }
  async function $s(t, s, r = [], n = true) {
    var _a, _b;
    L.info("Signing spell transaction...");
    const a = fe();
    if (!a) throw new Error("Seed phrase not found. Please import your seed phrase first.");
    try {
      const o = V.Transaction.fromHex(t), c = V.Transaction.fromHex(s), l = c.getId();
      o.version = 2, L.debug("Spell TX has", o.ins.length, "inputs"), L.debug("Commit TX ID:", l);
      for (let u = 0; u < o.ins.length; u++) {
        const y = o.ins[u];
        L.debug(`Input ${u} witness:`, {
          hasWitness: !!y.witness,
          witnessLength: ((_a = y.witness) == null ? void 0 : _a.length) || 0,
          witnessItems: ((_b = y.witness) == null ? void 0 : _b.map((k) => k.length + " bytes")) || []
        });
      }
      const i = [], d = [], m = /* @__PURE__ */ new Map();
      for (let u = 0; u < o.ins.length; u++) {
        const y = o.ins[u], k = K.from(y.hash).reverse().toString("hex"), T = y.index;
        if (L.debug(`Input ${u}: ${k}:${T}`), k === l) {
          const h = c.outs[T], P = h.script, B = h.value;
          if (L.debug(`Input ${u} spends commit output, value:`, B), L.debug("Commit output script:", P.toString("hex")), y.witness && y.witness.length > 0 && y.witness.some((S) => S.length > 0)) {
            L.info(`Input ${u} (commit output) already has witness with ${y.witness.length} items - prover signed it`), i.push(P), d.push(B);
            continue;
          }
          L.info(`Input ${u} (commit output) has no valid witness - need to find keys`), L.info("This may indicate a problem - per Charms docs, prover should sign the commit input");
          const I = await Le(a, P.toString("hex"), n);
          if (!I) throw new Error(`Could not find keys for commit output at input ${u}. The commit output address may not be derived from your seed phrase.`);
          i.push(P), d.push(B), m.set(u, {
            keys: I,
            isCommitInput: true
          });
        } else {
          const h = y.witness && y.witness.length > 0 && y.witness.some((j) => j.length > 0);
          h && L.info(`Input ${u} already has witness - skipping signing`);
          let P = null;
          for (const j of r) {
            const O = V.Transaction.fromHex(j);
            if (O.getId() === k) {
              P = O;
              break;
            }
          }
          if (!P) {
            const j = r.map((O) => {
              try {
                return V.Transaction.fromHex(O).getId();
              } catch {
                return "invalid";
              }
            });
            throw L.error(`Previous TX not found for input ${u}`, {
              lookingFor: k,
              available: j
            }), new Error(`Previous transaction not found for input ${u} (${k}). Available: ${j.join(", ")}`);
          }
          const B = P.outs[T], E = B.script, I = B.value;
          if (L.debug(`Input ${u} spends external UTXO, value:`, I), h) {
            i.push(E), d.push(I);
            continue;
          }
          const S = await Le(a, E.toString("hex"), n);
          if (!S) throw new Error(`Could not find keys for input ${u}. The UTXO may not be owned by your wallet.`);
          i.push(E), d.push(I), m.set(u, {
            keys: S,
            isCommitInput: false
          });
        }
      }
      const p = [];
      for (let u = 0; u < o.ins.length; u++) {
        const y = o.hashForWitnessV1(u, i, d, V.Transaction.SIGHASH_DEFAULT);
        p.push(y);
      }
      for (let u = 0; u < o.ins.length; u++) {
        const y = o.ins[u];
        if (y.witness && y.witness.length > 0 && y.witness.some((P) => P.length > 0)) {
          L.debug(`Skipping input ${u} - already has witness from prover`);
          continue;
        }
        const T = m.get(u);
        if (!T) throw new Error(`No signing data for input ${u}`);
        const h = K.from(he.signSchnorr(p[u], T.keys.tweakedPrivateKey));
        o.ins[u].witness = [
          h
        ], L.debug(`Signed input ${u} with key at index ${T.keys.index}`);
      }
      const x = o.toHex(), v = o.getId();
      return L.info("Spell transaction signed successfully:", v), {
        success: true,
        txid: v,
        signedHex: x
      };
    } catch (o) {
      throw L.error("Error signing spell transaction:", o), o;
    }
  }
  const q = H("mintBadge"), Ps = {
    appId: "0".repeat(64),
    appVk: me
  };
  function Is(t, s, r, n, a = Ps) {
    return `version: 8

apps:
  $00: "n/${a.appId}/${a.appVk}"

ins:
  - utxo_id: "${t}"
    charms: {}

outs:
  - address: "${s}"
    sats: ${Y.DUST_LIMIT_SATS}
    charms:
      $00:
        id: "${n.id}"
        created_at: ${n.created_at}
        pubkey: "${n.pubkey}"
        tx_total: 0
        tx_positive: 0
        tx_negative: 0
        volume_total: 0
        volume_sum_squares: 0
        window_tx_count: 0
        window_volume: 0
        window_start: ${n.window_start}
        counterparty_count: 0
        backing:
          backed_count: 0
          unbacked_count: 0
          backed_volume: 0
          unbacked_volume: 0
        vouches_out: []
        vouches_in: []
        cascade_damage: 0
        active_transactions: []
        reporting_transactions: []
        outcomes:
          mutual_positive: 0
          mutual_negative: 0
          contested_i_positive: 0
          contested_i_negative: 0
          timeout: 0
          mutual_timeout: 0
        trust: 15
        risk: 35
        flags: 36
        last_nonce: "${n.last_nonce}"
        last_update: ${n.last_update}

public_args:
  $00:
    Mint:
      pubkey: "${r}"
      current_block: ${n.created_at}
`;
  }
  async function Bs(t, s) {
    var _a, _b, _c, _d;
    const { bitcoin: r, prover: n, storage: a, crypto: o, network: c, onProgress: l } = s, i = l || (() => {
    });
    try {
      i("Validating inputs...");
      const d = us(t.address, t.pubkey);
      if (!d.valid) return {
        success: false,
        error: `Validation failed: ${d.errors.join(", ")}`
      };
      i("Fetching UTXOs...");
      let m = t.address;
      if (ae()) {
        const f = await Fe(localStorage.getItem("veil_seed_phrase"), c === "testnet4");
        q.info(`Using seed phrase address for UTXOs: ${f}`), m = f;
      }
      const p = await r.fetchUtxos(m, c), v = (((_a = a.getBurnedUtxos) == null ? void 0 : _a.call(a)) ?? []).map((f) => f.utxoId);
      v.length > 0 && q.info(`Filtering out ${v.length} burned UTXOs from prover cache`);
      const y = [
        ...p.filter((f) => {
          const b = `${f.txid}:${f.vout}`;
          return !v.includes(b);
        })
      ].sort((f, b) => f.value - b.value);
      if (y.length < 2) {
        const f = v.length > 0 ? ` (${v.length} UTXOs are burned from previous prover attempts - they expire after 24h)` : "";
        return {
          success: false,
          error: `Need at least 2 available UTXOs for minting: one for genesis (spell input) and one for funding (fees). Found ${y.length}.${f}`
        };
      }
      const k = y[0], T = y.slice(1), h = jt(T, void 0, Y.MIN_FUNDING_SATS, v);
      if (!h) return {
        success: false,
        error: `No suitable funding UTXO found. Need at least ${Y.MIN_FUNDING_SATS} sats (excluding genesis UTXO and burned UTXOs).`
      };
      const P = gs(h);
      if (!P.valid) return {
        success: false,
        error: P.errors.join(", ")
      };
      i("Generating badge ID...");
      const B = `${k.txid}:${k.vout}`, E = await o.generateBadgeId(B), I = await o.sha256Hex(B);
      i("Getting current block height...");
      const S = await r.getCurrentBlockHeight(c);
      i("Creating badge...");
      const j = ds(E, t.pubkey, S);
      i("Building spell...");
      const O = Is(B, t.address, t.pubkey, j, {
        appId: I,
        appVk: me
      });
      i("Fetching previous transactions...");
      const W = await r.fetchTransaction(k.txid, c);
      if (i("Generating ZK proof..."), !await n.isAvailable()) return {
        success: false,
        error: "Prover service is not available"
      };
      const w = `${h.txid}:${h.vout}`;
      a.addBurnedUtxo && (a.addBurnedUtxo(B), a.addBurnedUtxo(w), q.info(`Marked UTXOs as burned before prover call: genesis=${B}, funding=${w}`));
      let _;
      t.pubkey && t.pubkey.length === 66 ? (_ = t.pubkey.slice(2), q.info("Converted compressed pubkey to x-only for Taproot:", {
        compressedPubkey: t.pubkey.substring(0, 10) + "...",
        xOnlyPubkey: _.substring(0, 10) + "..."
      })) : t.pubkey && t.pubkey.length === 64 && (_ = t.pubkey, q.info("Pubkey already in x-only format"));
      const N = await n.prove({
        spellYaml: O,
        prevTxs: [
          W
        ],
        fundingUtxo: {
          txid: h.txid,
          vout: h.vout
        },
        fundingUtxoValue: h.value,
        changeAddress: t.address,
        feeRate: 2,
        signingPubkey: _
      });
      if (!N.success || !N.spellTx) {
        let f = `Proof generation failed: ${N.error || "Unknown error"}`;
        return ((_b = N.error) == null ? void 0 : _b.includes("duplicate funding UTXO")) && (f = "These UTXOs have already been used in a previous prover request. The Charms prover caches requests for ~24 hours. Please wait for more UTXOs or try again later."), q.error("Mint badge proof generation failed:", {
          error: N.error,
          spellYaml: O.substring(0, 500),
          genesisUtxo: B,
          fundingUtxo: h,
          changeAddress: t.address
        }), {
          success: false,
          error: f
        };
      }
      i("Preparing transactions for signing...");
      let C, U;
      if (q.info("Proof result transactions:", {
        hasCommitTx: !!N.commitTx,
        commitTxLength: ((_c = N.commitTx) == null ? void 0 : _c.length) || 0,
        hasSpellTx: !!N.spellTx,
        spellTxLength: ((_d = N.spellTx) == null ? void 0 : _d.length) || 0
      }), N.isMock) i("Mock mode: Simulating broadcast..."), C = N.commitTx ? "0000000000000000000000000000000000000000000000000000000000000000" : void 0, U = "1111111111111111111111111111111111111111111111111111111111111111", i(`Mock TX: ${U.slice(0, 8)}...`);
      else {
        if (!ae()) return {
          success: false,
          error: "No seed phrase found. Please import your seed phrase in Settings to enable transaction signing."
        };
        const f = c !== "mainnet";
        if (N.commitTx && N.commitTx.length > 0) {
          if (!/^[0-9a-fA-F]+$/.test(N.commitTx)) return {
            success: false,
            error: `Invalid commit transaction format (not hex): ${N.commitTx.substring(0, 50)}...`
          };
          i("Signing commit transaction...");
          try {
            const b = await r.fetchTransaction(h.txid, c), $ = await As(N.commitTx, b, f);
            q.info("Commit transaction signed:", {
              txid: $.txid,
              signedHexLength: $.signedHex.length
            }), i("Broadcasting commit transaction..."), C = await r.broadcast($.signedHex, c), i(`Commit TX: ${C.slice(0, 8)}...`);
          } catch (b) {
            const $ = b instanceof Error ? b.message : String(b);
            return q.error("Failed to sign commit transaction:", {
              error: $,
              fundingUtxo: h
            }), {
              success: false,
              error: `Failed to sign commit transaction: ${$}`
            };
          }
          i("Waiting for commit TX to propagate..."), await new Promise((b) => setTimeout(b, 1e3));
        }
        if (!N.spellTx || N.spellTx.length === 0) return {
          success: false,
          error: "Prover returned empty spell transaction"
        };
        if (!/^[0-9a-fA-F]+$/.test(N.spellTx)) return {
          success: false,
          error: `Invalid spell transaction format (not hex): ${N.spellTx.substring(0, 50)}...`
        };
        i("Signing spell transaction...");
        try {
          const b = await r.fetchTransaction(C, c), $ = [], D = await r.fetchTransaction(k.txid, c);
          if ($.push(D), h.txid !== k.txid) {
            const ee = await r.fetchTransaction(h.txid, c);
            $.push(ee);
          }
          q.info("Passing prev TXs to spell signing:", {
            count: $.length,
            genesisTxid: k.txid,
            fundingTxid: h.txid
          });
          const X = await $s(N.spellTx, b, $, f);
          q.info("Spell transaction signed:", {
            txid: X.txid,
            signedHexLength: X.signedHex.length
          }), i("Broadcasting spell transaction..."), U = await r.broadcast(X.signedHex, c), i(`Spell TX: ${U.slice(0, 8)}...`);
        } catch (b) {
          const $ = b instanceof Error ? b.message : String(b);
          return q.error("Failed to sign spell transaction:", {
            error: $,
            stack: b instanceof Error ? b.stack : void 0
          }), {
            success: false,
            error: `Failed to sign spell transaction: ${$}`
          };
        }
      }
      return i("Finalizing badge..."), j.utxo = {
        txid: U,
        vout: 0,
        value: Y.DUST_LIMIT_SATS
      }, i("Badge minted successfully!"), {
        success: true,
        data: {
          badge: j,
          txid: U,
          commitTxid: C
        }
      };
    } catch (d) {
      return {
        success: false,
        error: d instanceof Error ? d.message : "Unknown error"
      };
    }
  }
  const M = H("useWallet"), tt = {
    connected: false,
    address: null,
    pubkey: null,
    network: "testnet4",
    utxos: []
  }, qe = "veil_minted_badges";
  function Cs() {
    try {
      const t = localStorage.getItem(qe);
      return t ? JSON.parse(t).map((r) => ({
        ...r,
        volume_sum_squares: BigInt(r.volume_sum_squares || 0)
      })) : [];
    } catch {
      return [];
    }
  }
  function st(t) {
    try {
      const s = /* @__PURE__ */ new Map();
      for (const a of t) {
        if (!(a == null ? void 0 : a.id) || typeof a.id != "string") {
          M.warn("[Veil] Skipping badge with invalid id during persistence:", a);
          continue;
        }
        s.set(a.id, a);
      }
      const n = Array.from(s.values()).map((a) => ({
        ...a,
        volume_sum_squares: (a.volume_sum_squares ?? BigInt(0)).toString()
      }));
      localStorage.setItem(qe, JSON.stringify(n));
    } catch (s) {
      M.error("[Veil] Failed to persist badges:", s);
    }
  }
  function Es() {
    const [t, s] = g.useState(tt), [r, n] = g.useState([]), [a, o] = g.useState(/* @__PURE__ */ new Map()), [c, l] = g.useState(null), [i, d] = g.useState(null), [m, p] = g.useState(false), [x, v] = g.useState(null), u = g.useRef(null), y = g.useMemo(() => {
      const w = r[0];
      if (!w) return null;
      const _ = a.get(w.id);
      return _ ? {
        badge: w,
        utxo: _
      } : w.utxo ? {
        badge: w,
        utxo: {
          txid: w.utxo.txid,
          vout: w.utxo.vout,
          value: w.utxo.value ?? 546,
          scriptPubKey: ""
        }
      } : null;
    }, [
      r,
      a
    ]);
    g.useEffect(() => {
      const w = Cs();
      w.length > 0 && (M.debug("[Veil] Loaded", w.length, "persisted badges"), n(w));
    }, []), g.useEffect(() => {
      (async () => {
        const _ = localStorage.getItem("veil_wallet_address"), N = localStorage.getItem("veil_wallet_pubkey"), C = localStorage.getItem("veil_wallet_network") || "testnet4";
        if (_ && N) {
          M.debug("[Veil] Restoring wallet connection"), s({
            connected: true,
            address: _,
            pubkey: N.length === 64 ? "02" + N : N,
            network: C,
            utxos: []
          });
          try {
            const f = await Z("mempool").fetchUtxos(_, C);
            s((b) => ({
              ...b,
              utxos: f
            })), M.debug("[Veil] Loaded", f.length, "UTXOs");
          } catch (U) {
            M.error("[Veil] Failed to fetch UTXOs on restore:", U);
          }
        }
      })();
    }, []);
    const k = g.useCallback(async (w = "browser") => {
      l(null), p(true);
      try {
        if (w === "seed") {
          if (!ae()) throw new Error("No seed phrase configured. Please import your seed phrase first.");
          const $ = fe(), D = "testnet4", ee = await Be($, 0, true), Q = ee.address, Ke = "02" + ee.xOnlyPubkey.toString("hex");
          M.debug("[Veil] Connecting with seed phrase address:", Q), s({
            connected: true,
            address: Q,
            pubkey: Ke,
            network: D,
            utxos: []
          }), localStorage.setItem("veil_wallet_address", Q), localStorage.setItem("veil_wallet_pubkey", Ke), localStorage.setItem("veil_wallet_network", D), localStorage.setItem("veil_wallet_mode", w);
          const Ge = await Z("mempool").fetchUtxos(Q, D);
          s((St) => ({
            ...St,
            utxos: Ge
          })), M.debug("[Veil] Connected with", Ge.length, "UTXOs");
          return;
        }
        const _ = Ue("browser"), { address: N, pubkey: C } = await _.connect(), U = "testnet4";
        s({
          connected: true,
          address: N,
          pubkey: C.length === 64 ? "02" + C : C,
          network: U,
          utxos: []
        }), localStorage.setItem("veil_wallet_address", N), localStorage.setItem("veil_wallet_pubkey", C), localStorage.setItem("veil_wallet_network", U), localStorage.setItem("veil_wallet_mode", w);
        const b = await Z("mempool").fetchUtxos(N, U);
        s(($) => ({
          ...$,
          utxos: b
        })), M.debug("[Veil] Connected with", b.length, "UTXOs");
      } catch (_) {
        const N = _ instanceof Error ? _.message : "Connection failed";
        throw l(N), _;
      } finally {
        p(false);
      }
    }, []), T = g.useCallback(() => {
      localStorage.removeItem("veil_wallet_address"), localStorage.removeItem("veil_wallet_pubkey"), localStorage.removeItem("veil_wallet_network"), localStorage.removeItem("veil_wallet_mode"), localStorage.removeItem(qe), s(tt), n([]), l(null), d(null), v(null), M.debug("[Veil] Wallet disconnected");
    }, []), h = g.useCallback(async () => {
      if (!(!t.connected || !t.address)) try {
        const _ = await Z("mempool").fetchUtxos(t.address, t.network);
        s((N) => ({
          ...N,
          utxos: _
        })), M.debug("[Veil] Refreshed", _.length, "UTXOs");
      } catch (w) {
        M.error("[Veil] Failed to refresh UTXOs:", w), l(w instanceof Error ? w.message : "Failed to refresh UTXOs");
      }
    }, [
      t.connected,
      t.address,
      t.network
    ]), P = g.useCallback(async () => {
      var _a;
      if (M.debug(`[refreshBadges] Called. connected=${t.connected}, utxos=${((_a = t.utxos) == null ? void 0 : _a.length) || 0}`), !t.connected || !t.utxos) return;
      if (u.current) return M.debug("[refreshBadges] Already in progress, reusing existing promise"), u.current;
      const w = async () => {
        var _a2;
        try {
          const _ = `n/${et}/${me}`;
          M.debug(`[refreshBadges] Scanning ${t.utxos.length} UTXOs with veilAppSpec=${_}`);
          const N = await ne.discoverBadgesInUtxos(t.utxos, _, t.network);
          M.debug(`[refreshBadges] Discovery complete. Found ${N.length} badges`), n((U) => {
            const f = /* @__PURE__ */ new Map();
            for (const $ of U) f.set($.id, $);
            for (const $ of N) f.set($.badge.id, $.badge);
            const b = Array.from(f.values());
            return st(b), b;
          });
          const C = /* @__PURE__ */ new Map();
          for (const U of N) {
            if (!((_a2 = U.badge) == null ? void 0 : _a2.id)) {
              M.warn("[refreshBadges] Skipping discovered badge with missing id");
              continue;
            }
            const f = t.utxos.find((b) => b.txid === U.txid && b.vout === U.vout);
            f && C.set(U.badge.id, f);
          }
          n((U) => {
            M.debug(`[refreshBadges] Processing ${U.length} badges for stored UTXOs`);
            for (const f of U) {
              if (!(f == null ? void 0 : f.id)) {
                M.warn("[refreshBadges] Skipping badge with missing id");
                continue;
              }
              if (M.debug(`[refreshBadges] Badge ${f.id.slice(0, 8)} - utxoMap.has=${C.has(f.id)}, badge.utxo=${f.utxo ? `${f.utxo.txid.slice(0, 8)}:${f.utxo.vout}` : "none"}`), !C.has(f.id) && f.utxo) {
                const b = t.utxos.find(($) => $.txid === f.utxo.txid && $.vout === f.utxo.vout);
                b ? (M.debug(`[refreshBadges] Found stored UTXO for badge ${f.id.slice(0, 8)}:`, b.txid.slice(0, 8), b.vout), C.set(f.id, b)) : M.debug(`[refreshBadges] Stored UTXO NOT FOUND in wallet.utxos for badge ${f.id.slice(0, 8)}`);
              }
              if (!C.has(f.id)) {
                const b = t.utxos.find(($) => $.value === 546 || $.value >= 330 && $.value <= 1e3);
                b && (M.debug(`[refreshBadges] Found potential UTXO for badge ${f.id.slice(0, 8)}:`, b.txid.slice(0, 8)), C.set(f.id, b));
              }
            }
            return U;
          }), o(C);
          for (const [U, f] of C.entries()) M.debug(`[refreshBadges] utxoMap entry: badge=${U.slice(0, 8)}, utxo=${f.txid.slice(0, 8)}:${f.vout}`);
          M.debug("[Veil] Refreshed badges, found", N.length, "utxoMap size:", C.size);
        } catch (_) {
          M.warn("[Veil] Badge discovery error (this is normal if you have no badges):", _);
        } finally {
          u.current = null;
        }
      };
      return u.current = w(), u.current;
    }, [
      t.connected,
      t.utxos,
      t.network
    ]);
    g.useEffect(() => {
      t.connected && t.utxos.length > 0 && P();
    }, [
      t.connected,
      t.utxos,
      P
    ]);
    const B = g.useCallback(async (w) => {
      if (!t.connected) throw new Error("Wallet not connected");
      if (ae()) {
        M.info("Signing message with seed phrase");
        const N = t.network !== "mainnet";
        return Ts(w, N);
      }
      return M.info("Signing message with browser wallet"), Ue("browser").signMessage(w);
    }, [
      t.connected,
      t.network
    ]), E = g.useCallback(async () => {
      if (!t.pubkey) throw new Error("Wallet not connected");
      return t.pubkey;
    }, [
      t.pubkey
    ]), I = g.useCallback(async () => {
      if (!t.connected || !t.address || !t.pubkey) throw new Error("Wallet not connected");
      v("Starting badge mint..."), l(null);
      try {
        const w = Z("mempool"), _ = wt(), N = vt(), C = ft(), U = Ue(), f = {
          bitcoin: w,
          prover: _,
          crypto: N,
          storage: C,
          wallet: U,
          network: t.network,
          onProgress: (D) => {
            M.info("[Mint]", D), v(D);
          }
        }, b = await Bs({
          address: t.address,
          pubkey: t.pubkey
        }, f);
        if (!b.success || !b.data) throw new Error(b.error || "Mint failed");
        const $ = b.data.badge;
        return n((D) => {
          const X = [
            ...D,
            $
          ];
          return st(X), X;
        }), $.utxo && o((D) => {
          const X = new Map(D);
          return X.set($.id, {
            txid: $.utxo.txid,
            vout: $.utxo.vout,
            value: $.utxo.value ?? 546,
            scriptPubKey: ""
          }), X;
        }), v(null), d(`Badge minted! TXID: ${b.data.txid.slice(0, 16)}...`), b.data.txid;
      } catch (w) {
        const _ = w instanceof Error ? w.message : "Unknown error";
        throw M.error("[Mint] Failed:", _), l(_), v(null), w;
      }
    }, [
      t
    ]), S = g.useCallback(async (w, _, N, C, U, f, b) => {
      throw !t.connected || !t.address ? new Error("Wallet not connected") : new Error("Not implemented");
    }, [
      t
    ]), j = g.useCallback(async (w, _, N, C, U) => {
      throw !t.connected || !t.address ? new Error("Wallet not connected") : new Error("Not implemented");
    }, [
      t
    ]), O = g.useCallback(async (w, _, N) => {
      throw !t.connected || !t.address ? new Error("Wallet not connected") : new Error("Not implemented");
    }, [
      t
    ]), W = g.useCallback(async (w) => {
      var _a;
      try {
        const N = await Z("mempool").fetchTransaction(w, t.network), C = await ne.extractAndVerifySpell(N);
        if (!C) return M.warn("[Veil] No valid spell found in transaction"), null;
        if ((_a = C.tx) == null ? void 0 : _a.outs) {
          for (const U of C.tx.outs) if (U instanceof Map) {
            for (const [, f] of U) if (f && typeof f == "object") return f;
          }
        }
        return null;
      } catch (_) {
        return M.error("[Veil] Failed to verify transaction:", _), null;
      }
    }, [
      t.network
    ]), R = g.useCallback(async (w, _) => {
      try {
        const N = `n/${et}/${me}`;
        return await ne.scanUtxoForBadge(w, _, N, t.network);
      } catch (N) {
        return M.error("[Veil] Failed to verify counterparty badge:", N), null;
      }
    }, [
      t.network
    ]);
    return {
      wallet: t,
      connect: k,
      disconnect: T,
      refreshUtxos: h,
      refreshBadges: P,
      signMessage: B,
      getPublicKey: E,
      mintBadge: I,
      recordTransaction: S,
      vouch: j,
      unvouch: O,
      verifyTransaction: W,
      verifyCounterpartyBadge: R,
      myBadge: y,
      badges: r,
      badgeUtxos: a,
      error: c,
      loading: m,
      txStatus: x,
      successMessage: i,
      clearSuccess: () => d(null)
    };
  }
  async function Us(t) {
    const s = {
      mainnet: "https://blockstream.info/api/blocks/tip/height",
      testnet4: "https://mempool.space/testnet4/api/blocks/tip/height",
      signet: "https://mempool.space/signet/api/blocks/tip/height",
      regtest: "http://localhost:3001/api/blockchain/height"
    };
    try {
      const r = await fetch(s[t]);
      if (!r.ok) throw new Error("Failed to fetch block height");
      const n = await r.text();
      return parseInt(n, 10);
    } catch (r) {
      return M.warn("[Veil] Failed to get block height (using fallback):", r), 87e4;
    }
  }
  function rt(t) {
    return t >= 1e8 ? `${(t / 1e8).toFixed(4)} BTC` : t >= 1e6 ? `${(t / 1e6).toFixed(2)}M sats` : t >= 1e3 ? `${(t / 1e3).toFixed(1)}k sats` : `${t} sats`;
  }
  function Ms(t) {
    const s = t / 144;
    return s < 1 ? `${Math.round(t / 6)}h` : s < 30 ? `${Math.round(s)}d` : s < 365 ? `${Math.round(s / 30)}mo` : `${(s / 365).toFixed(1)}y`;
  }
  function Os(t, s = 8) {
    return t.length <= s * 2 + 2 ? t : `${t.slice(0, s)}...${t.slice(-s)}`;
  }
  function Rs(t, s) {
    const { CRITICAL_MAX: r, LOW_MAX: n, MEDIUM_MAX: a, HIGH_MAX: o } = Y.TRUST_LEVELS;
    return s && t < r ? "new" : t < r ? "critical" : t < n ? "low" : t < a ? "medium" : t < o ? "high" : "excellent";
  }
  function Ws(t) {
    const { MINIMAL_MAX: s, LOW_MAX: r, MODERATE_MAX: n, HIGH_MAX: a } = Y.RISK_LEVELS;
    return t < s ? "minimal" : t < r ? "low" : t < n ? "moderate" : t < a ? "high" : "critical";
  }
  const Ls = {
    sm: {
      width: 80,
      strokeWidth: 6,
      fontSize: "text-lg"
    },
    md: {
      width: 120,
      strokeWidth: 8,
      fontSize: "text-2xl"
    },
    lg: {
      width: 160,
      strokeWidth: 10,
      fontSize: "text-4xl"
    }
  }, Fs = {
    new: {
      stroke: "#8b5cf6",
      bg: "bg-purple-500/10",
      text: "text-purple-500"
    },
    critical: {
      stroke: "#ef4444",
      bg: "bg-red-500/10",
      text: "text-red-500"
    },
    low: {
      stroke: "#f97316",
      bg: "bg-orange-500/10",
      text: "text-orange-500"
    },
    medium: {
      stroke: "#eab308",
      bg: "bg-yellow-500/10",
      text: "text-yellow-500"
    },
    high: {
      stroke: "#22c55e",
      bg: "bg-green-500/10",
      text: "text-green-500"
    },
    excellent: {
      stroke: "#06b6d4",
      bg: "bg-cyan-500/10",
      text: "text-cyan-500"
    }
  }, Nt = Ae.memo(function({ trust: s, size: r = "md", showLabel: n = true, isNewBadge: a = false }) {
    const o = Ls[r], c = Rs(s, a), l = Fs[c], i = (o.width - o.strokeWidth) / 2, d = 2 * Math.PI * i, m = s / 100 * d, p = d - m;
    return e.jsxs("div", {
      className: "flex flex-col items-center gap-2",
      children: [
        e.jsxs("div", {
          className: "relative",
          style: {
            width: o.width,
            height: o.width
          },
          children: [
            e.jsxs("svg", {
              className: "transform -rotate-90",
              width: o.width,
              height: o.width,
              children: [
                e.jsx("circle", {
                  cx: o.width / 2,
                  cy: o.width / 2,
                  r: i,
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: o.strokeWidth,
                  className: "text-gray-700"
                }),
                e.jsx("circle", {
                  cx: o.width / 2,
                  cy: o.width / 2,
                  r: i,
                  fill: "none",
                  stroke: l.stroke,
                  strokeWidth: o.strokeWidth,
                  strokeLinecap: "round",
                  strokeDasharray: d,
                  strokeDashoffset: p,
                  className: "transition-all duration-500 ease-out"
                })
              ]
            }),
            e.jsx("div", {
              className: "absolute inset-0 flex items-center justify-center",
              children: e.jsx("span", {
                className: `font-bold ${o.fontSize} ${l.text}`,
                children: s
              })
            })
          ]
        }),
        n && e.jsx("div", {
          className: `px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${l.bg} ${l.text}`,
          children: c
        })
      ]
    });
  }), { RISK_WEIGHTS: te } = Y, nt = {
    acceleration: {
      icon: We,
      label: "Acceleration",
      description: "Recent activity velocity exceeds historical average by 3x",
      weight: te.acceleration
    },
    extraction: {
      icon: ke,
      label: "Extraction",
      description: "Proposed value exceeds 10x average transaction",
      weight: te.extraction
    },
    isolated: {
      icon: ie,
      label: "Isolated",
      description: "Low network score from incoming vouches",
      weight: te.isolated
    },
    too_clean: {
      icon: _t,
      label: "Too Clean",
      description: "High transaction count with zero negative outcomes",
      weight: te.too_clean
    },
    erratic: {
      icon: oe,
      label: "Erratic",
      description: "High variance in transaction values (CV > 2.0)",
      weight: te.erratic
    },
    new_badge: {
      icon: $e,
      label: "New Badge",
      description: "Account age less than 90 days",
      weight: te.new_badge
    }
  }, at = {
    minimal: "text-green-400 bg-green-500/10 border-green-500/20",
    low: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    moderate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    critical: "text-red-400 bg-red-500/10 border-red-500/20"
  }, Vs = Ae.memo(function({ flags: s, risk: r, compact: n = false }) {
    const a = Ws(r), o = Object.entries(s).filter(([c, l]) => l);
    return n ? e.jsxs("div", {
      className: "flex items-center gap-2",
      children: [
        e.jsxs("div", {
          className: `flex items-center gap-1 px-2 py-1 rounded-md border ${at[a]}`,
          children: [
            e.jsx(z, {
              className: "w-3 h-3"
            }),
            e.jsx("span", {
              className: "text-xs font-medium",
              children: r
            })
          ]
        }),
        e.jsx("div", {
          className: "flex gap-1",
          children: o.map(([c]) => {
            const l = nt[c], i = l.icon;
            return e.jsx("div", {
              className: "p-1 rounded bg-gray-800 text-gray-400",
              title: l.label,
              children: e.jsx(i, {
                className: "w-3 h-3"
              })
            }, c);
          })
        })
      ]
    }) : e.jsxs("div", {
      className: "space-y-3",
      children: [
        e.jsxs("div", {
          className: `flex items-center justify-between p-3 rounded-lg border ${at[a]}`,
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                e.jsx(z, {
                  className: "w-5 h-5"
                }),
                e.jsx("span", {
                  className: "font-medium",
                  children: "Risk Score"
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                e.jsx("span", {
                  className: "text-2xl font-bold",
                  children: r
                }),
                e.jsx("span", {
                  className: "text-xs uppercase tracking-wide opacity-75",
                  children: a
                })
              ]
            })
          ]
        }),
        e.jsx("div", {
          className: "grid grid-cols-2 gap-2",
          children: Object.entries(nt).map(([c, l]) => {
            const i = s[c], d = l.icon;
            return e.jsxs("div", {
              className: `
                p-3 rounded-lg border transition-all
                ${i ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-gray-800/50 border-gray-700 text-gray-500"}
              `,
              children: [
                e.jsxs("div", {
                  className: "flex items-center justify-between mb-1",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx(d, {
                          className: "w-4 h-4"
                        }),
                        e.jsx("span", {
                          className: "text-sm font-medium",
                          children: l.label
                        })
                      ]
                    }),
                    e.jsxs("span", {
                      className: "text-xs opacity-75",
                      children: [
                        "+",
                        l.weight
                      ]
                    })
                  ]
                }),
                e.jsx("p", {
                  className: "text-xs opacity-60 line-clamp-2",
                  children: l.description
                })
              ]
            }, c);
          })
        })
      ]
    });
  });
  function Xs({ badge: t, currentBlock: s, expanded: r = false }) {
    const [n, a] = Ae.useState(false), o = async () => {
      await navigator.clipboard.writeText(t.id), a(true), setTimeout(() => a(false), 2e3);
    }, c = t.tx_total > 0 ? Math.round(t.tx_positive / t.tx_total * 100) : 100, l = t.tx_total > 0 ? Math.round(t.volume_total / t.tx_total) : 0, i = s - t.created_at, d = t.vouches_in.reduce((m, p) => m + p.stake_percent, 0);
    return e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl overflow-hidden",
      children: [
        e.jsx("div", {
          className: "bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 border-b border-gray-800",
          children: e.jsxs("div", {
            className: "flex items-start justify-between",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("div", {
                    className: "p-2 bg-purple-500/20 rounded-lg",
                    children: e.jsx(J, {
                      className: "w-6 h-6 text-purple-400"
                    })
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("h3", {
                        className: "font-semibold text-white",
                        children: "Veil Badge"
                      }),
                      e.jsxs("button", {
                        onClick: o,
                        className: "flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors",
                        children: [
                          e.jsx("span", {
                            className: "font-mono",
                            children: Os(t.id)
                          }),
                          e.jsx(Xe, {
                            className: "w-3 h-3"
                          }),
                          n && e.jsx("span", {
                            className: "text-green-400 ml-1",
                            children: "Copied!"
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              e.jsx(Nt, {
                trust: t.trust,
                size: "sm",
                showLabel: false,
                isNewBadge: t.flags.new_badge
              })
            ]
          })
        }),
        e.jsxs("div", {
          className: "p-4 grid grid-cols-2 md:grid-cols-4 gap-4",
          children: [
            e.jsx(we, {
              icon: oe,
              label: "Transactions",
              value: t.tx_total.toString(),
              subValue: `${c}% success`,
              color: "blue"
            }),
            e.jsx(we, {
              icon: We,
              label: "Volume",
              value: rt(t.volume_total),
              subValue: `avg ${rt(l)}`,
              color: "green"
            }),
            e.jsx(we, {
              icon: ie,
              label: "Network",
              value: `${d}%`,
              subValue: `${t.vouches_in.length} vouchers`,
              color: "purple"
            }),
            e.jsx(we, {
              icon: $e,
              label: "Age",
              value: Ms(i),
              subValue: `block ${t.created_at}`,
              color: "cyan"
            })
          ]
        }),
        r && e.jsx(e.Fragment, {
          children: e.jsxs("div", {
            className: "px-4 pb-4 border-t border-gray-800 pt-4",
            children: [
              e.jsxs("div", {
                className: "grid grid-cols-2 gap-4 mb-4",
                children: [
                  e.jsxs("div", {
                    className: "bg-gray-800/50 rounded-lg p-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2 mb-2",
                        children: [
                          e.jsx(We, {
                            className: "w-4 h-4 text-green-400"
                          }),
                          e.jsx("span", {
                            className: "text-sm text-gray-400",
                            children: "Positive"
                          })
                        ]
                      }),
                      e.jsx("span", {
                        className: "text-xl font-bold text-green-400",
                        children: t.tx_positive
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "bg-gray-800/50 rounded-lg p-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2 mb-2",
                        children: [
                          e.jsx(Tt, {
                            className: "w-4 h-4 text-red-400"
                          }),
                          e.jsx("span", {
                            className: "text-sm text-gray-400",
                            children: "Negative"
                          })
                        ]
                      }),
                      e.jsx("span", {
                        className: "text-xl font-bold text-red-400",
                        children: t.tx_negative
                      })
                    ]
                  })
                ]
              }),
              e.jsx(Vs, {
                flags: t.flags,
                risk: t.risk
              })
            ]
          })
        })
      ]
    });
  }
  function we({ icon: t, label: s, value: r, subValue: n, color: a }) {
    const o = {
      blue: "text-blue-400 bg-blue-500/10",
      green: "text-green-400 bg-green-500/10",
      purple: "text-purple-400 bg-purple-500/10",
      cyan: "text-cyan-400 bg-cyan-500/10",
      red: "text-red-400 bg-red-500/10"
    };
    return e.jsxs("div", {
      className: "bg-gray-800/50 rounded-lg p-3",
      children: [
        e.jsxs("div", {
          className: "flex items-center gap-2 mb-1",
          children: [
            e.jsx("div", {
              className: `p-1 rounded ${o[a]}`,
              children: e.jsx(t, {
                className: `w-3 h-3 ${o[a].split(" ")[0]}`
              })
            }),
            e.jsx("span", {
              className: "text-xs text-gray-500",
              children: s
            })
          ]
        }),
        e.jsx("div", {
          className: "text-lg font-semibold text-white",
          children: r
        }),
        n && e.jsx("div", {
          className: "text-xs text-gray-500",
          children: n
        })
      ]
    });
  }
  const ot = H("CharmsErrorBoundary");
  class Ds extends g.Component {
    constructor(s) {
      super(s);
      __publicField(this, "handleReset", () => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null
        });
      });
      __publicField(this, "handleReload", () => {
        window.location.reload();
      });
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null
      };
    }
    static getDerivedStateFromError(s) {
      return {
        hasError: true,
        error: s,
        errorInfo: null
      };
    }
    componentDidCatch(s, r) {
      ot.error("[CharmsErrorBoundary] Caught error:", s), ot.error("[CharmsErrorBoundary] Error info:", r), this.setState({
        error: s,
        errorInfo: r
      });
    }
    render() {
      var _a, _b;
      if (!this.state.hasError) return this.props.children;
      const { error: s } = this.state, { fallbackMode: r = "error" } = this.props, n = ((_a = s == null ? void 0 : s.message) == null ? void 0 : _a.toLowerCase().includes("wasm")) || ((_b = s == null ? void 0 : s.message) == null ? void 0 : _b.toLowerCase().includes("module"));
      return r === "demo" && n ? e.jsx("div", {
        className: "min-h-screen bg-gray-950 text-white flex items-center justify-center p-4",
        children: e.jsx("div", {
          className: "max-w-md w-full bg-gray-900 border border-yellow-700 rounded-xl p-6",
          children: e.jsxs("div", {
            className: "flex items-start gap-4",
            children: [
              e.jsx("div", {
                className: "p-3 bg-yellow-900/30 rounded-lg",
                children: e.jsx(z, {
                  className: "w-6 h-6 text-yellow-400"
                })
              }),
              e.jsxs("div", {
                className: "flex-1",
                children: [
                  e.jsx("h2", {
                    className: "text-lg font-semibold text-yellow-300 mb-2",
                    children: "WASM Module Error"
                  }),
                  e.jsx("p", {
                    className: "text-gray-400 text-sm mb-4",
                    children: "The Charms WASM module failed to load. You can continue in demo mode with limited functionality."
                  }),
                  e.jsx("div", {
                    className: "bg-gray-950 rounded p-3 mb-4",
                    children: e.jsx("code", {
                      className: "text-xs text-red-400 break-all",
                      children: s == null ? void 0 : s.message
                    })
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      e.jsx("button", {
                        onClick: this.handleReset,
                        className: "flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium transition-colors",
                        children: "Continue in Demo Mode"
                      }),
                      e.jsx("button", {
                        onClick: this.handleReload,
                        className: "px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors",
                        children: e.jsx(ue, {
                          className: "w-4 h-4"
                        })
                      })
                    ]
                  })
                ]
              })
            ]
          })
        })
      }) : r === "retry" ? e.jsx("div", {
        className: "min-h-screen bg-gray-950 text-white flex items-center justify-center p-4",
        children: e.jsx("div", {
          className: "max-w-md w-full bg-gray-900 border border-red-700 rounded-xl p-6",
          children: e.jsxs("div", {
            className: "flex items-start gap-4",
            children: [
              e.jsx("div", {
                className: "p-3 bg-red-900/30 rounded-lg",
                children: e.jsx(z, {
                  className: "w-6 h-6 text-red-400"
                })
              }),
              e.jsxs("div", {
                className: "flex-1",
                children: [
                  e.jsx("h2", {
                    className: "text-lg font-semibold text-red-300 mb-2",
                    children: "Something went wrong"
                  }),
                  e.jsx("p", {
                    className: "text-gray-400 text-sm mb-4",
                    children: "An error occurred while processing your request. You can try again or reload the page."
                  }),
                  s && e.jsx("div", {
                    className: "bg-gray-950 rounded p-3 mb-4",
                    children: e.jsx("code", {
                      className: "text-xs text-red-400 break-all",
                      children: s.message
                    })
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      e.jsx("button", {
                        onClick: this.handleReset,
                        className: "flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors",
                        children: "Try Again"
                      }),
                      e.jsxs("button", {
                        onClick: this.handleReload,
                        className: "px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        children: [
                          e.jsx(ue, {
                            className: "w-4 h-4"
                          }),
                          "Reload"
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        })
      }) : e.jsx("div", {
        className: "min-h-screen bg-gray-950 text-white flex items-center justify-center p-4",
        children: e.jsx("div", {
          className: "max-w-2xl w-full bg-gray-900 border border-red-700 rounded-xl p-6",
          children: e.jsxs("div", {
            className: "flex items-start gap-4",
            children: [
              e.jsx("div", {
                className: "p-3 bg-red-900/30 rounded-lg",
                children: e.jsx(z, {
                  className: "w-6 h-6 text-red-400"
                })
              }),
              e.jsxs("div", {
                className: "flex-1",
                children: [
                  e.jsx("h2", {
                    className: "text-lg font-semibold text-red-300 mb-2",
                    children: "Application Error"
                  }),
                  e.jsx("p", {
                    className: "text-gray-400 text-sm mb-4",
                    children: "An unexpected error occurred. Please try reloading the page."
                  }),
                  s && e.jsxs("div", {
                    className: "mb-4",
                    children: [
                      e.jsx("div", {
                        className: "text-xs text-gray-500 mb-2",
                        children: "Error details:"
                      }),
                      e.jsx("div", {
                        className: "bg-gray-950 rounded p-3 overflow-auto max-h-48",
                        children: e.jsxs("code", {
                          className: "text-xs text-red-400",
                          children: [
                            s.toString(),
                            this.state.errorInfo && e.jsxs(e.Fragment, {
                              children: [
                                e.jsx("br", {}),
                                e.jsx("br", {}),
                                this.state.errorInfo.componentStack
                              ]
                            })
                          ]
                        })
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      e.jsxs("button", {
                        onClick: this.handleReload,
                        className: "px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        children: [
                          e.jsx(ue, {
                            className: "w-4 h-4"
                          }),
                          "Reload Page"
                        ]
                      }),
                      false
                    ]
                  })
                ]
              })
            ]
          })
        })
      });
    }
  }
  function Hs({ wallet: t, onDisconnect: s, onClose: r }) {
    var _a, _b, _c;
    const n = g.useRef(null), [a, o] = g.useState(false), c = async () => {
      if (t.address) {
        try {
          await navigator.clipboard.writeText(t.address), o(true);
        } catch {
          const i = document.createElement("textarea");
          i.value = t.address, i.style.position = "fixed", i.style.left = "-9999px", document.body.appendChild(i), i.focus(), i.select();
          try {
            document.execCommand("copy"), o(true);
          } catch {
            console.error("Failed to copy address");
          }
          document.body.removeChild(i);
        }
        setTimeout(() => o(false), 2e3);
      }
    };
    g.useEffect(() => {
      function i(m) {
        n.current && !n.current.contains(m.target) && r();
      }
      const d = setTimeout(() => {
        document.addEventListener("mousedown", i);
      }, 100);
      return () => {
        clearTimeout(d), document.removeEventListener("mousedown", i);
      };
    }, [
      r
    ]), g.useEffect(() => {
      function i(d) {
        d.key === "Escape" && r();
      }
      return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
    }, [
      r
    ]);
    const l = () => {
      s(), r();
    };
    return e.jsx("div", {
      ref: n,
      className: "absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50",
      children: e.jsxs("div", {
        className: "p-4 space-y-3",
        children: [
          e.jsx("h3", {
            className: "font-medium text-white mb-3",
            children: "Wallet"
          }),
          e.jsx(ce, {
            label: "Status",
            children: e.jsx("span", {
              className: "text-green-400",
              children: "Connected"
            })
          }),
          e.jsx(ce, {
            label: "Network",
            children: e.jsx("span", {
              className: "text-white capitalize",
              children: t.network
            })
          }),
          e.jsx(ce, {
            label: "Address",
            children: e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                e.jsxs("code", {
                  className: "text-purple-400 text-xs font-mono",
                  children: [
                    (_a = t.address) == null ? void 0 : _a.slice(0, 12),
                    "...",
                    (_b = t.address) == null ? void 0 : _b.slice(-8)
                  ]
                }),
                e.jsx("button", {
                  onClick: c,
                  className: "p-1 hover:bg-gray-700 rounded transition-colors",
                  title: "Copy address",
                  children: a ? e.jsx("svg", {
                    className: "w-4 h-4 text-green-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: e.jsx("path", {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M5 13l4 4L19 7"
                    })
                  }) : e.jsx("svg", {
                    className: "w-4 h-4 text-gray-400 hover:text-white",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: e.jsx("path", {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    })
                  })
                })
              ]
            })
          }),
          e.jsx(ce, {
            label: "Public Key",
            children: e.jsxs("code", {
              className: "text-gray-500 text-xs font-mono",
              children: [
                (_c = t.pubkey) == null ? void 0 : _c.slice(0, 12),
                "..."
              ]
            })
          }),
          e.jsx(ce, {
            label: "UTXOs",
            children: e.jsx("span", {
              className: "text-white",
              children: t.utxos.length
            })
          }),
          e.jsx("button", {
            onClick: l,
            className: "w-full mt-4 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors",
            children: "Disconnect Wallet"
          })
        ]
      })
    });
  }
  function ce({ label: t, children: s }) {
    return e.jsxs("div", {
      className: "flex items-center justify-between py-2",
      children: [
        e.jsx("span", {
          className: "text-gray-400",
          children: t
        }),
        s
      ]
    });
  }
  function kt(t) {
    const s = JSON.stringify(t);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function Ve(t) {
    let s = t.replace(/-/g, "+").replace(/_/g, "/");
    for (; s.length % 4; ) s += "=";
    const r = atob(s), n = JSON.parse(r);
    if (!n.id || !n.proposerBadgeId) throw new Error("Invalid proposal: missing required fields");
    if (!n.counterpartyBadgeId && !n.counterpartyAddress) throw new Error("Invalid proposal: must specify counterparty badge ID or address");
    return n;
  }
  function qs(t, s) {
    const r = kt(t);
    return `${`${window.location.origin}${window.location.pathname}`.replace(/\/$/, "")}?proposal=${r}`;
  }
  function Ks(t) {
    return `veil://proposal/${kt(t)}`;
  }
  function Gs(t) {
    try {
      if (t.startsWith("veil://proposal/")) {
        const n = t.replace("veil://proposal/", "");
        return Ve(n);
      }
      const r = new URL(t).searchParams.get("proposal");
      return r ? Ve(r) : null;
    } catch {
      return null;
    }
  }
  async function zs(t) {
    const s = Ys(t), r = new ArrayBuffer(s.byteLength);
    new Uint8Array(r).set(s);
    const n = await crypto.subtle.digest("SHA-256", r), a = new Uint8Array(n);
    return Array.from(a).map((o) => o.toString(16).padStart(2, "0")).join("");
  }
  function Ys(t) {
    const s = new TextEncoder(), r = [];
    r.push(Me(t.proposerBadgeId)), r.push(Me(t.proposerBadgeUtxo.txid));
    const n = new Uint8Array(4);
    if (new DataView(n.buffer).setUint32(0, t.proposerBadgeUtxo.vout, false), r.push(n), t.counterpartyBadgeId) r.push(Me(t.counterpartyBadgeId));
    else if (t.counterpartyAddress) {
      const l = s.encode(t.counterpartyAddress);
      r.push(nr(l));
    } else r.push(new Uint8Array(32));
    r.push(sr(t.value)), r.push(new Uint8Array([
      rr(t.category)
    ])), r.push(ve(t.windowBlocks)), r.push(ve(t.reportWindowBlocks)), r.push(ve(t.createdAt)), r.push(ve(t.expiresAt)), t.memo && r.push(s.encode(t.memo));
    const a = r.reduce((l, i) => l + i.length, 0), o = new Uint8Array(a);
    let c = 0;
    for (const l of r) o.set(l, c), c += l.length;
    return o;
  }
  async function Js(t, s) {
    const r = s + ms, n = {
      proposerBadgeId: t.proposerBadgeId,
      proposerBadgeUtxo: t.proposerBadgeUtxo,
      counterpartyBadgeId: t.counterpartyBadgeId,
      counterpartyAddress: t.counterpartyAddress,
      value: t.value,
      category: t.category,
      windowBlocks: t.windowBlocks ?? xs,
      reportWindowBlocks: t.reportWindowBlocks ?? hs,
      createdAt: s,
      expiresAt: r,
      memo: t.memo
    };
    return {
      id: await zs(n),
      ...n
    };
  }
  async function Qs(t, s) {
    const r = await s(t.id);
    return {
      ...t,
      proposerSignature: r
    };
  }
  function Zs(t) {
    if (!t.id || t.id.length !== 64) return {
      valid: false,
      error: "Invalid proposal ID"
    };
    if (!t.proposerBadgeId || t.proposerBadgeId.length !== 64) return {
      valid: false,
      error: "Invalid proposer badge ID"
    };
    const s = t.counterpartyBadgeId && t.counterpartyBadgeId.length === 64, r = t.counterpartyAddress && t.counterpartyAddress.length > 0;
    return !s && !r ? {
      valid: false,
      error: "Must provide either counterparty badge ID or Bitcoin address"
    } : s && t.proposerBadgeId === t.counterpartyBadgeId ? {
      valid: false,
      error: "Cannot transact with yourself"
    } : r && t.counterpartyAddress && !/^(bc1|tb1|bcrt1|[13mn2])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(t.counterpartyAddress) ? {
      valid: false,
      error: "Invalid Bitcoin address format"
    } : !t.value || t.value <= 0 ? {
      valid: false,
      error: "Value must be greater than 0"
    } : !t.windowBlocks || t.windowBlocks <= 0 ? {
      valid: false,
      error: "Settlement window must be greater than 0"
    } : !t.reportWindowBlocks || t.reportWindowBlocks <= 0 ? {
      valid: false,
      error: "Report window must be greater than 0"
    } : !t.proposerSignature || t.proposerSignature.length < 64 ? {
      valid: false,
      error: "Invalid signature"
    } : {
      valid: true
    };
  }
  function er(t, s) {
    return s > t.expiresAt;
  }
  function tr(t, s) {
    return t.counterpartyBadgeId === s;
  }
  function Me(t) {
    const s = new Uint8Array(t.length / 2);
    for (let r = 0; r < s.length; r++) s[r] = parseInt(t.substr(r * 2, 2), 16);
    return s;
  }
  function ve(t) {
    const s = new Uint8Array(4);
    return s[0] = t & 255, s[1] = t >> 8 & 255, s[2] = t >> 16 & 255, s[3] = t >> 24 & 255, s;
  }
  function sr(t) {
    const s = new Uint8Array(8);
    s[0] = t & 255, s[1] = t >> 8 & 255, s[2] = t >> 16 & 255, s[3] = t >> 24 & 255;
    const r = Math.floor(t / 4294967296);
    return s[4] = r & 255, s[5] = r >> 8 & 255, s[6] = r >> 16 & 255, s[7] = r >> 24 & 255, s;
  }
  function rr(t) {
    switch (t) {
      case "Trade":
        return 0;
      case "Loan":
        return 1;
      case "Service":
        return 2;
      case "Other":
        return 3;
      default:
        return 3;
    }
  }
  function nr(t) {
    let s = 0;
    for (let n = 0; n < t.length; n++) s = (s << 5) - s + t[n], s = s & s;
    const r = new Uint8Array(32);
    for (let n = 0; n < 32; n++) r[n] = s >> n % 4 * 8 & 255, s = (s << 5) - s ^ t[n % t.length];
    return r;
  }
  async function ar(t) {
    try {
      const s = await bt(() => import("./vendor-DaCOpwfI.js").then((n) => n.b), __vite__mapDeps([0,1])), r = Ks(t);
      return s.toDataURL(r, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 256
      });
    } catch {
      return console.warn("QR code generation requires: npm install qrcode @types/qrcode"), null;
    }
  }
  function or({ myBadgeId: t, myBadgeUtxo: s, currentBlock: r, signMessage: n, onProposalCreated: a }) {
    const [o, c] = g.useState(""), [l, i] = g.useState(""), [d, m] = g.useState(false), [p, x] = g.useState(0), [v, u] = g.useState("Trade"), [y, k] = g.useState(ye[2].blocks), [T, h] = g.useState(""), [P, B] = g.useState("form"), [E, I] = g.useState(null), [S, j] = g.useState(false), [O, W] = g.useState(null), [R, w] = g.useState(null), [_, N] = g.useState(null), C = g.useCallback(async (b) => {
      if (b.preventDefault(), I(null), d) {
        if (!l) {
          I("Please enter a Bitcoin address");
          return;
        }
        if (!/^(bc1|tb1|bcrt1|[13mn2])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(l)) {
          I("Please enter a valid Bitcoin address");
          return;
        }
      } else {
        if (!o || o.length !== 64) {
          I("Please enter a valid 64-character badge ID or use address instead");
          return;
        }
        if (o === t) {
          I("Cannot transact with yourself");
          return;
        }
      }
      if (p <= 0) {
        I("Value must be greater than 0");
        return;
      }
      B("signing");
      try {
        const D = await Js({
          proposerBadgeId: t,
          proposerBadgeUtxo: s,
          counterpartyBadgeId: d ? void 0 : o,
          counterpartyAddress: d ? l : void 0,
          value: p,
          category: v,
          windowBlocks: y,
          memo: T || void 0
        }, r), X = await Qs(D, n), ee = qs(X);
        let Q = null;
        try {
          Q = await ar(X);
        } catch {
        }
        W(X), w(ee), N(Q), B("share"), a == null ? void 0 : a(X);
      } catch ($) {
        I($ instanceof Error ? $.message : "Failed to create proposal"), B("form");
      }
    }, [
      d,
      o,
      l,
      t,
      p,
      v,
      y,
      T,
      r,
      n,
      a
    ]), U = g.useCallback(async () => {
      R && (await navigator.clipboard.writeText(R), j(true), setTimeout(() => j(false), 2e3));
    }, [
      R
    ]), f = g.useCallback(() => {
      c(""), i(""), m(false), x(0), u("Trade"), k(ye[2].blocks), h(""), B("form"), I(null), W(null), w(null), N(null);
    }, []);
    if (P === "signing") return e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-6 text-center",
      children: [
        e.jsx("div", {
          className: "w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        }),
        e.jsx("h3", {
          className: "text-xl font-semibold text-white mb-2",
          children: "Creating Proposal"
        }),
        e.jsx("p", {
          className: "text-gray-400",
          children: "Please sign the proposal in your wallet..."
        })
      ]
    });
    if (P === "share" && O) {
      const b = ye.find(($) => $.blocks === O.windowBlocks);
      return e.jsxs("div", {
        className: "bg-gray-900 border border-gray-800 rounded-xl overflow-hidden",
        children: [
          e.jsxs("div", {
            className: "p-4 border-b border-gray-800 bg-green-500/10",
            children: [
              e.jsxs("h3", {
                className: "font-semibold text-white flex items-center gap-2",
                children: [
                  e.jsx(Se, {
                    className: "w-5 h-5 text-green-400"
                  }),
                  "Proposal Created"
                ]
              }),
              e.jsx("p", {
                className: "text-sm text-gray-400 mt-1",
                children: "Share this with your counterparty to accept"
              })
            ]
          }),
          e.jsxs("div", {
            className: "p-4 space-y-4",
            children: [
              e.jsxs("div", {
                className: "bg-gray-800/50 rounded-lg p-4 space-y-2",
                children: [
                  e.jsxs("div", {
                    className: "flex justify-between text-sm",
                    children: [
                      e.jsx("span", {
                        className: "text-gray-400",
                        children: "Value"
                      }),
                      e.jsx("span", {
                        className: "text-white font-medium",
                        children: Te(O.value)
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex justify-between text-sm",
                    children: [
                      e.jsx("span", {
                        className: "text-gray-400",
                        children: "Category"
                      }),
                      e.jsx("span", {
                        className: "text-white",
                        children: O.category
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex justify-between text-sm",
                    children: [
                      e.jsx("span", {
                        className: "text-gray-400",
                        children: "Settlement Window"
                      }),
                      e.jsx("span", {
                        className: "text-white",
                        children: (b == null ? void 0 : b.label) || se(O.windowBlocks)
                      })
                    ]
                  }),
                  O.memo && e.jsxs("div", {
                    className: "flex justify-between text-sm",
                    children: [
                      e.jsx("span", {
                        className: "text-gray-400",
                        children: "Memo"
                      }),
                      e.jsx("span", {
                        className: "text-white truncate ml-4",
                        children: O.memo
                      })
                    ]
                  })
                ]
              }),
              _ && e.jsx("div", {
                className: "flex justify-center",
                children: e.jsx("div", {
                  className: "bg-white p-3 rounded-lg",
                  children: e.jsx("img", {
                    src: _,
                    alt: "Proposal QR Code",
                    className: "w-48 h-48"
                  })
                })
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx("label", {
                    className: "block text-sm font-medium text-gray-400",
                    children: "Or share this link"
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      e.jsx("input", {
                        type: "text",
                        readOnly: true,
                        value: R || "",
                        className: "flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 truncate"
                      }),
                      e.jsx("button", {
                        onClick: U,
                        className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2",
                        children: S ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsx(Se, {
                              className: "w-4 h-4"
                            }),
                            "Copied"
                          ]
                        }) : e.jsxs(e.Fragment, {
                          children: [
                            e.jsx(Xe, {
                              className: "w-4 h-4"
                            }),
                            "Copy"
                          ]
                        })
                      })
                    ]
                  })
                ]
              }),
              e.jsxs("div", {
                className: "bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3",
                children: [
                  e.jsx(ze, {
                    className: "w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                  }),
                  e.jsx("div", {
                    className: "text-sm text-blue-200",
                    children: e.jsxs("p", {
                      children: [
                        "This proposal expires in ~24 hours. Once your counterparty accepts, the settlement window begins and you'll both have",
                        " ",
                        (b == null ? void 0 : b.label) || se(O.windowBlocks),
                        " to complete the transaction before reporting outcomes."
                      ]
                    })
                  })
                ]
              }),
              e.jsx("div", {
                className: "flex gap-3",
                children: e.jsx("button", {
                  onClick: f,
                  className: "flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors",
                  children: "Create Another"
                })
              })
            ]
          })
        ]
      });
    }
    return e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl overflow-hidden",
      children: [
        e.jsxs("div", {
          className: "p-4 border-b border-gray-800",
          children: [
            e.jsxs("h3", {
              className: "font-semibold text-white flex items-center gap-2",
              children: [
                e.jsx(Ye, {
                  className: "w-5 h-5 text-purple-400"
                }),
                "Propose Transaction"
              ]
            }),
            e.jsx("p", {
              className: "text-sm text-gray-500 mt-1",
              children: "Create a proposal to send to your counterparty"
            })
          ]
        }),
        e.jsxs("form", {
          onSubmit: C,
          className: "p-4 space-y-4",
          children: [
            e.jsxs("div", {
              children: [
                e.jsxs("div", {
                  className: "flex items-center justify-between mb-2",
                  children: [
                    e.jsxs("label", {
                      className: "block text-sm font-medium text-gray-400",
                      children: [
                        "Counterparty ",
                        d ? "Bitcoin Address" : "Badge ID"
                      ]
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: () => {
                        m(!d), c(""), i(""), I(null);
                      },
                      className: "text-xs text-purple-400 hover:text-purple-300 transition-colors",
                      children: d ? "Use Badge ID instead" : "They don't have a badge yet"
                    })
                  ]
                }),
                d ? e.jsxs(e.Fragment, {
                  children: [
                    e.jsx("input", {
                      type: "text",
                      value: l,
                      onChange: (b) => i(b.target.value.trim()),
                      placeholder: "tb1q... or bc1q...",
                      className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 font-mono text-sm"
                    }),
                    e.jsxs("p", {
                      className: "text-xs text-gray-500 mt-1 flex items-start gap-1",
                      children: [
                        e.jsx(ze, {
                          className: "w-3 h-3 mt-0.5 flex-shrink-0"
                        }),
                        e.jsx("span", {
                          children: "They'll be prompted to create a badge when accepting"
                        })
                      ]
                    })
                  ]
                }) : e.jsx("input", {
                  type: "text",
                  value: o,
                  onChange: (b) => c(b.target.value.toLowerCase()),
                  placeholder: "Enter 64-character hex ID...",
                  className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 font-mono text-sm"
                })
              ]
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className: "block text-sm font-medium text-gray-400 mb-1",
                  children: "Transaction Value (sats)"
                }),
                e.jsx("input", {
                  type: "number",
                  value: p || "",
                  onChange: (b) => x(parseInt(b.target.value) || 0),
                  placeholder: "100000",
                  min: "1",
                  className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                }),
                p > 0 && e.jsx("p", {
                  className: "text-xs text-gray-500 mt-1",
                  children: Te(p)
                })
              ]
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className: "block text-sm font-medium text-gray-400 mb-1",
                  children: "Transaction Category"
                }),
                e.jsxs("select", {
                  value: v,
                  onChange: (b) => u(b.target.value),
                  className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white",
                  children: [
                    e.jsx("option", {
                      value: "Trade",
                      children: "Trade"
                    }),
                    e.jsx("option", {
                      value: "Loan",
                      children: "Loan"
                    }),
                    e.jsx("option", {
                      value: "Service",
                      children: "Service"
                    }),
                    e.jsx("option", {
                      value: "Other",
                      children: "Other"
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className: "block text-sm font-medium text-gray-400 mb-1",
                  children: "Settlement Window"
                }),
                e.jsx("select", {
                  value: y,
                  onChange: (b) => k(parseInt(b.target.value)),
                  className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white",
                  children: ye.map((b) => e.jsx("option", {
                    value: b.blocks,
                    children: b.label
                  }, b.blocks))
                }),
                e.jsx("p", {
                  className: "text-xs text-gray-500 mt-1",
                  children: "Time for the real-world transaction to complete before reporting outcomes"
                })
              ]
            }),
            e.jsxs("div", {
              children: [
                e.jsxs("label", {
                  className: "block text-sm font-medium text-gray-400 mb-1",
                  children: [
                    "Memo ",
                    e.jsx("span", {
                      className: "text-gray-600",
                      children: "(optional)"
                    })
                  ]
                }),
                e.jsx("input", {
                  type: "text",
                  value: T,
                  onChange: (b) => h(b.target.value),
                  placeholder: "e.g., For the vintage guitar",
                  maxLength: 100,
                  className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                })
              ]
            }),
            E && e.jsx("div", {
              className: "bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm",
              children: E
            }),
            e.jsxs("button", {
              type: "submit",
              className: "w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
              children: [
                e.jsx(Ye, {
                  className: "w-4 h-4"
                }),
                "Sign & Create Proposal"
              ]
            })
          ]
        })
      ]
    });
  }
  function ir({ proposal: t, myBadgeId: s, currentBlock: r, proposerTrust: n, signMessage: a, onAccept: o, onDecline: c, onError: l }) {
    const [i, d] = g.useState(null), [m, p] = g.useState(null), [x, v] = g.useState("review"), [u, y] = g.useState(null), [k, T] = g.useState(null);
    g.useEffect(() => {
      if (typeof t == "string") try {
        const S = Ve(t);
        d(S), p(null);
      } catch (S) {
        p(S instanceof Error ? S.message : "Invalid proposal"), d(null);
      }
      else d(t), p(null);
    }, [
      t
    ]);
    const h = [];
    if (i) {
      const S = Zs(i);
      S.valid || h.push(S.error), er(i, r) && h.push("This proposal has expired"), i.counterpartyBadgeId && !tr(i, s) && h.push("You are not the intended counterparty for this proposal");
    }
    const P = i && h.length === 0, B = i ? fs(i.expiresAt, r) : 0, E = g.useCallback(async () => {
      if (!(!i || !P)) {
        v("signing"), y(null);
        try {
          const S = await a(i.id), j = await o(i, S);
          T(j), v("accepted");
        } catch (S) {
          const j = S instanceof Error ? S.message : "Failed to accept proposal";
          y(j), v("error"), l == null ? void 0 : l(j);
        }
      }
    }, [
      i,
      P,
      a,
      o,
      l
    ]), I = g.useCallback(() => {
      c == null ? void 0 : c();
    }, [
      c
    ]);
    return !i && !m ? e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-6 text-center",
      children: [
        e.jsx("div", {
          className: "w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        }),
        e.jsx("p", {
          className: "text-gray-400",
          children: "Loading proposal..."
        })
      ]
    }) : m ? e.jsx("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-6",
      children: e.jsxs("div", {
        className: "flex items-start gap-4",
        children: [
          e.jsx("div", {
            className: "w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0",
            children: e.jsx(z, {
              className: "w-6 h-6 text-red-400"
            })
          }),
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-lg font-semibold text-white mb-1",
                children: "Invalid Proposal"
              }),
              e.jsx("p", {
                className: "text-gray-400",
                children: m
              })
            ]
          })
        ]
      })
    }) : x === "signing" ? e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-6 text-center",
      children: [
        e.jsx("div", {
          className: "w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        }),
        e.jsx("h3", {
          className: "text-xl font-semibold text-white mb-2",
          children: "Accepting Proposal"
        }),
        e.jsx("p", {
          className: "text-gray-400",
          children: "Please sign to accept in your wallet..."
        })
      ]
    }) : x === "error" ? e.jsx("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-6",
      children: e.jsxs("div", {
        className: "flex items-start gap-4",
        children: [
          e.jsx("div", {
            className: "w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0",
            children: e.jsx(z, {
              className: "w-6 h-6 text-red-400"
            })
          }),
          e.jsxs("div", {
            className: "flex-1",
            children: [
              e.jsx("h3", {
                className: "text-lg font-semibold text-white mb-1",
                children: "Acceptance Failed"
              }),
              e.jsx("p", {
                className: "text-gray-400 mb-4",
                children: u
              }),
              e.jsx("button", {
                onClick: () => v("review"),
                className: "px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors",
                children: "Try Again"
              })
            ]
          })
        ]
      })
    }) : x === "accepted" && k ? e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl overflow-hidden",
      children: [
        e.jsxs("div", {
          className: "p-4 border-b border-gray-800 bg-green-500/10",
          children: [
            e.jsxs("h3", {
              className: "font-semibold text-white flex items-center gap-2",
              children: [
                e.jsx(Se, {
                  className: "w-5 h-5 text-green-400"
                }),
                "Proposal Accepted"
              ]
            }),
            e.jsx("p", {
              className: "text-sm text-gray-400 mt-1",
              children: "The transaction is now active on both badges"
            })
          ]
        }),
        e.jsxs("div", {
          className: "p-4 space-y-4",
          children: [
            e.jsxs("div", {
              className: "bg-gray-800/50 rounded-lg p-4 space-y-2",
              children: [
                e.jsxs("div", {
                  className: "flex justify-between text-sm",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Value"
                    }),
                    e.jsx("span", {
                      className: "text-white font-medium",
                      children: Te(k.value)
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex justify-between text-sm",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Category"
                    }),
                    e.jsx("span", {
                      className: "text-white",
                      children: k.category
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex justify-between text-sm",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Settlement Ends"
                    }),
                    e.jsxs("span", {
                      className: "text-white",
                      children: [
                        "Block ",
                        k.windowEndsAt.toLocaleString()
                      ]
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex justify-between text-sm",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Report Deadline"
                    }),
                    e.jsxs("span", {
                      className: "text-white",
                      children: [
                        "Block ",
                        k.reportDeadline.toLocaleString()
                      ]
                    })
                  ]
                })
              ]
            }),
            e.jsx("div", {
              className: "bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-200",
              children: e.jsxs("p", {
                children: [
                  "Complete your transaction within the settlement window. After it closes, you'll both have ",
                  se(k.reportDeadline - k.windowEndsAt),
                  " to report the outcome."
                ]
              })
            })
          ]
        })
      ]
    }) : e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl overflow-hidden",
      children: [
        e.jsxs("div", {
          className: "p-4 border-b border-gray-800",
          children: [
            e.jsxs("h3", {
              className: "font-semibold text-white flex items-center gap-2",
              children: [
                e.jsx(At, {
                  className: "w-5 h-5 text-purple-400"
                }),
                "Incoming Proposal"
              ]
            }),
            e.jsx("p", {
              className: "text-sm text-gray-500 mt-1",
              children: "Review this proposal before accepting"
            })
          ]
        }),
        e.jsxs("div", {
          className: "p-4 space-y-4",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg",
              children: [
                e.jsx("div", {
                  className: "w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center",
                  children: e.jsx($t, {
                    className: "w-5 h-5 text-purple-400"
                  })
                }),
                e.jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [
                    e.jsx("p", {
                      className: "text-sm text-gray-400",
                      children: "From"
                    }),
                    e.jsx("p", {
                      className: "text-white font-mono text-sm truncate",
                      children: bs(i.proposerBadgeId, 12)
                    })
                  ]
                }),
                n !== void 0 && e.jsxs("div", {
                  className: "text-right",
                  children: [
                    e.jsx("p", {
                      className: "text-sm text-gray-400",
                      children: "Trust"
                    }),
                    e.jsx("p", {
                      className: "text-white font-medium",
                      children: n
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "bg-gray-800/50 rounded-lg p-4 space-y-3",
              children: [
                e.jsxs("div", {
                  className: "flex justify-between",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Value"
                    }),
                    e.jsx("span", {
                      className: "text-white font-semibold text-lg",
                      children: Te(i.value)
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex justify-between",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Category"
                    }),
                    e.jsx("span", {
                      className: "text-white",
                      children: i.category
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex justify-between",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Settlement Window"
                    }),
                    e.jsx("span", {
                      className: "text-white",
                      children: se(i.windowBlocks)
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex justify-between",
                  children: [
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Report Window"
                    }),
                    e.jsx("span", {
                      className: "text-white",
                      children: se(i.reportWindowBlocks)
                    })
                  ]
                }),
                i.memo && e.jsxs("div", {
                  className: "pt-2 border-t border-gray-700",
                  children: [
                    e.jsx("p", {
                      className: "text-gray-400 text-sm",
                      children: "Memo"
                    }),
                    e.jsx("p", {
                      className: "text-white",
                      children: i.memo
                    })
                  ]
                })
              ]
            }),
            B > 0 && B < 72 && e.jsxs("div", {
              className: "flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg",
              children: [
                e.jsx($e, {
                  className: "w-4 h-4 text-yellow-400"
                }),
                e.jsxs("span", {
                  className: "text-yellow-200 text-sm",
                  children: [
                    "Expires in ~",
                    se(B)
                  ]
                })
              ]
            }),
            h.length > 0 && e.jsxs("div", {
              className: "p-3 bg-red-500/10 border border-red-500/20 rounded-lg",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-2 mb-2",
                  children: [
                    e.jsx(z, {
                      className: "w-4 h-4 text-red-400"
                    }),
                    e.jsx("span", {
                      className: "text-red-400 font-medium",
                      children: "Cannot Accept"
                    })
                  ]
                }),
                e.jsx("ul", {
                  className: "text-red-300 text-sm space-y-1",
                  children: h.map((S, j) => e.jsxs("li", {
                    children: [
                      "\u2022 ",
                      S
                    ]
                  }, j))
                })
              ]
            }),
            P && e.jsxs("div", {
              className: "p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400",
              children: [
                e.jsxs("p", {
                  className: "flex items-center gap-2 mb-2",
                  children: [
                    e.jsx(J, {
                      className: "w-4 h-4"
                    }),
                    e.jsx("span", {
                      className: "text-gray-300",
                      children: "How it works"
                    })
                  ]
                }),
                e.jsxs("ol", {
                  className: "space-y-1 ml-6 list-decimal",
                  children: [
                    e.jsx("li", {
                      children: "Accept to start the settlement window"
                    }),
                    e.jsx("li", {
                      children: "Complete your transaction off-chain"
                    }),
                    e.jsx("li", {
                      children: "Both parties report the outcome"
                    }),
                    e.jsx("li", {
                      children: "Your badges update based on reports"
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex gap-3",
              children: [
                e.jsxs("button", {
                  onClick: I,
                  className: "flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                  children: [
                    e.jsx(De, {
                      className: "w-4 h-4"
                    }),
                    "Decline"
                  ]
                }),
                e.jsxs("button", {
                  onClick: E,
                  disabled: !P,
                  className: "flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                  children: [
                    e.jsx(Se, {
                      className: "w-4 h-4"
                    }),
                    "Accept"
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function cr({ onSeedPhraseChange: t, isTestnet: s = true, walletAddress: r }) {
    const [n, a] = g.useState(false), [o, c] = g.useState(false), [l, i] = g.useState(""), [d, m] = g.useState(false), [p, x] = g.useState(null), [v, u] = g.useState(null), [y, k] = g.useState(null), [T, h] = g.useState(false);
    g.useEffect(() => {
      const j = ae();
      a(j), j && P();
    }, []);
    const P = async () => {
      const j = fe();
      if (j) try {
        const O = await Fe(j, s);
        k(O);
      } catch (O) {
        console.error("Failed to derive address:", O);
      }
    }, B = async () => {
      x(null), u(null), h(true);
      try {
        const j = l.trim().toLowerCase();
        if (!_s(j)) {
          x("Invalid seed phrase. Please enter a valid 12 or 24 word BIP-39 mnemonic."), h(false);
          return;
        }
        Ns(j), a(true), i(""), c(false);
        const O = await Fe(j, s);
        k(O), u("Seed phrase imported successfully!"), t == null ? void 0 : t(true);
      } catch (j) {
        x(j instanceof Error ? j.message : "Failed to import seed phrase");
      } finally {
        h(false);
      }
    }, E = async () => {
      x(null), u(null), h(true);
      try {
        const j = Ss();
        i(j), m(true), u("New seed phrase generated. SAVE IT SECURELY before importing!");
      } catch (j) {
        x(j instanceof Error ? j.message : "Failed to generate seed phrase");
      } finally {
        h(false);
      }
    }, I = () => {
      window.confirm("Are you sure you want to remove your seed phrase? You will not be able to sign transactions until you import it again.") && (ks(), a(false), k(null), u("Seed phrase removed."), t == null ? void 0 : t(false));
    }, S = (j) => {
      navigator.clipboard.writeText(j), u("Copied to clipboard!"), setTimeout(() => u(null), 2e3);
    };
    return e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-6",
      children: [
        e.jsxs("div", {
          className: "flex items-center gap-3 mb-4",
          children: [
            e.jsx(_e, {
              className: "w-6 h-6 text-purple-400"
            }),
            e.jsx("h3", {
              className: "text-lg font-semibold text-white",
              children: "Seed Phrase"
            })
          ]
        }),
        e.jsxs("div", {
          className: "flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4",
          children: [
            e.jsx(z, {
              className: "w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"
            }),
            e.jsxs("div", {
              className: "text-sm text-yellow-400",
              children: [
                e.jsx("strong", {
                  children: "Security Warning:"
                }),
                " Your seed phrase is stored locally in your browser. This is not secure for large amounts. Only use with testnet funds or small amounts."
              ]
            })
          ]
        }),
        n ? e.jsxs("div", {
          className: "space-y-4",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg",
              children: [
                e.jsx(Ne, {
                  className: "w-5 h-5 text-green-400"
                }),
                e.jsx("span", {
                  className: "text-green-400",
                  children: "Seed phrase imported - ready for signing"
                })
              ]
            }),
            y && e.jsxs("div", {
              className: "p-3 bg-gray-800/50 rounded-lg",
              children: [
                e.jsx("div", {
                  className: "text-sm text-gray-400 mb-1",
                  children: "Primary Taproot Address (index 0)"
                }),
                e.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    e.jsx("code", {
                      className: "text-sm text-purple-400 font-mono break-all",
                      children: y
                    }),
                    e.jsx("button", {
                      onClick: () => S(y),
                      className: "p-1 hover:bg-gray-700 rounded",
                      title: "Copy address",
                      children: e.jsx(Xe, {
                        className: "w-4 h-4 text-gray-400"
                      })
                    })
                  ]
                }),
                r && r !== y && e.jsx("div", {
                  className: "mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg",
                  children: e.jsxs("div", {
                    className: "flex items-start gap-2",
                    children: [
                      e.jsx(z, {
                        className: "w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"
                      }),
                      e.jsxs("div", {
                        className: "text-xs text-red-400",
                        children: [
                          e.jsx("strong", {
                            children: "Address Mismatch!"
                          }),
                          " Your connected wallet address is different from this seed phrase address. Either:",
                          e.jsxs("ul", {
                            className: "mt-1 ml-3 list-disc",
                            children: [
                              e.jsx("li", {
                                children: "Import your wallet's seed phrase (from UniSat/Leather settings)"
                              }),
                              e.jsx("li", {
                                children: "Or fund this address with testnet BTC instead"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                r && r === y && e.jsx("div", {
                  className: "mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg",
                  children: e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      e.jsx(Ne, {
                        className: "w-4 h-4 text-green-400"
                      }),
                      e.jsx("span", {
                        className: "text-xs text-green-400",
                        children: "\u2713 Wallet address matches seed phrase - ready to mint!"
                      })
                    ]
                  })
                }),
                e.jsxs("div", {
                  className: "text-xs text-gray-500 mt-2",
                  children: [
                    "Fund this address on ",
                    s ? "testnet4" : "mainnet",
                    " to mint badges."
                  ]
                })
              ]
            }),
            e.jsxs("button", {
              onClick: I,
              className: "flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors",
              children: [
                e.jsx(Pt, {
                  className: "w-4 h-4"
                }),
                "Remove Seed Phrase"
              ]
            })
          ]
        }) : e.jsx("div", {
          className: "space-y-4",
          children: o ? e.jsxs("div", {
            className: "space-y-3",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className: "block text-sm text-gray-400 mb-2",
                    children: "Enter your 12 or 24 word seed phrase"
                  }),
                  e.jsxs("div", {
                    className: "relative",
                    children: [
                      e.jsx("textarea", {
                        value: l,
                        onChange: (j) => i(j.target.value),
                        placeholder: "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12",
                        className: `w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-sm resize-none ${d ? "" : "blur-sm hover:blur-none focus:blur-none"}`,
                        rows: 3
                      }),
                      e.jsx("button", {
                        onClick: () => m(!d),
                        className: "absolute right-2 top-2 p-1 hover:bg-gray-700 rounded",
                        title: d ? "Hide" : "Show",
                        children: d ? e.jsx(It, {
                          className: "w-4 h-4 text-gray-400"
                        }) : e.jsx(Bt, {
                          className: "w-4 h-4 text-gray-400"
                        })
                      })
                    ]
                  })
                ]
              }),
              e.jsxs("div", {
                className: "flex gap-3",
                children: [
                  e.jsx("button", {
                    onClick: B,
                    disabled: T || !l.trim(),
                    className: "flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors",
                    children: T ? "Importing..." : "Import"
                  }),
                  e.jsx("button", {
                    onClick: () => {
                      c(false), i(""), x(null);
                    },
                    className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors",
                    children: "Cancel"
                  })
                ]
              })
            ]
          }) : e.jsxs("div", {
            className: "flex gap-3",
            children: [
              e.jsxs("button", {
                onClick: () => c(true),
                className: "flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors",
                children: [
                  e.jsx(_e, {
                    className: "w-5 h-5"
                  }),
                  "Import Existing Seed Phrase"
                ]
              }),
              e.jsxs("button", {
                onClick: E,
                disabled: T,
                className: "flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors",
                title: "Generate new seed phrase",
                children: [
                  e.jsx(ue, {
                    className: `w-5 h-5 ${T ? "animate-spin" : ""}`
                  }),
                  "Generate New"
                ]
              })
            ]
          })
        }),
        p && e.jsxs("div", {
          className: "mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg",
          children: [
            e.jsx(z, {
              className: "w-5 h-5 text-red-400 flex-shrink-0"
            }),
            e.jsx("span", {
              className: "text-sm text-red-400",
              children: p
            })
          ]
        }),
        v && e.jsxs("div", {
          className: "mt-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg",
          children: [
            e.jsx(Ne, {
              className: "w-5 h-5 text-green-400 flex-shrink-0"
            }),
            e.jsx("span", {
              className: "text-sm text-green-400",
              children: v
            })
          ]
        }),
        e.jsx("div", {
          className: "mt-4 p-3 bg-gray-800/50 rounded-lg",
          children: e.jsxs("div", {
            className: "text-sm text-gray-400",
            children: [
              e.jsx("strong", {
                className: "text-white",
                children: "How it works:"
              }),
              e.jsxs("ul", {
                className: "mt-2 space-y-1 list-disc list-inside text-gray-500",
                children: [
                  e.jsx("li", {
                    children: "Your seed phrase derives Taproot keys using BIP-86 path"
                  }),
                  e.jsx("li", {
                    children: "Keys are used to sign Charms commit and spell transactions"
                  }),
                  e.jsx("li", {
                    children: "Standard Taproot signing for Charms transactions"
                  }),
                  e.jsx("li", {
                    children: "Fund the derived Taproot address to mint badges"
                  })
                ]
              })
            ]
          })
        })
      ]
    });
  }
  function lr({ onConnect: t, onGoToSettings: s, loading: r, wasmReady: n, wasmError: a, walletError: o }) {
    const c = ae();
    return e.jsx("div", {
      className: "min-h-screen bg-gray-950 text-white flex items-center justify-center p-4",
      children: e.jsxs("div", {
        className: "max-w-md w-full",
        children: [
          e.jsxs("div", {
            className: "flex flex-col items-center mb-8",
            children: [
              e.jsx("div", {
                className: "p-4 bg-purple-600 rounded-2xl mb-4",
                children: e.jsx(J, {
                  className: "w-12 h-12"
                })
              }),
              e.jsx("h1", {
                className: "text-3xl font-bold mb-2",
                children: "Veil"
              }),
              e.jsx("p", {
                className: "text-gray-400 text-center",
                children: "Anonymous Reputation Protocol"
              })
            ]
          }),
          a && e.jsxs("div", {
            className: "mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm",
            children: [
              e.jsx("strong", {
                children: "WASM Error:"
              }),
              " ",
              a,
              e.jsx("p", {
                className: "mt-2 text-xs text-gray-400",
                children: "Try refreshing the page. If the issue persists, the site may still be deploying."
              })
            ]
          }),
          o && e.jsxs("div", {
            className: "mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400 text-sm",
            children: [
              e.jsx("strong", {
                children: "Error:"
              }),
              " ",
              o
            ]
          }),
          e.jsxs("div", {
            className: "bg-gray-900 border border-gray-800 rounded-2xl p-8",
            children: [
              e.jsx("h2", {
                className: "text-xl font-semibold mb-2 text-center",
                children: c ? "Ready to Enter" : "Get Started"
              }),
              e.jsx("p", {
                className: "text-gray-400 text-sm text-center mb-6",
                children: c ? "Your seed phrase is configured. Enter Veil to start building reputation." : "Import your seed phrase to sign transactions and mint badges."
              }),
              e.jsxs("div", {
                className: "flex items-center justify-center gap-2 mb-6 p-3 rounded-lg bg-gray-800/50",
                children: [
                  e.jsx(_e, {
                    className: `w-5 h-5 ${c ? "text-green-400" : "text-yellow-400"}`
                  }),
                  e.jsx("span", {
                    className: `text-sm font-medium ${c ? "text-green-400" : "text-yellow-400"}`,
                    children: c ? "\u2713 Seed phrase configured" : "Seed phrase required"
                  })
                ]
              }),
              c ? e.jsx("button", {
                onClick: t,
                disabled: r || !n,
                className: "w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-xl font-medium transition-colors",
                children: r ? e.jsxs(e.Fragment, {
                  children: [
                    e.jsx(re, {
                      className: "w-5 h-5 animate-spin"
                    }),
                    "Entering..."
                  ]
                }) : n ? e.jsxs(e.Fragment, {
                  children: [
                    "Enter Veil",
                    e.jsx(Ct, {
                      className: "w-5 h-5"
                    })
                  ]
                }) : e.jsxs(e.Fragment, {
                  children: [
                    e.jsx(re, {
                      className: "w-5 h-5 animate-spin"
                    }),
                    "Loading..."
                  ]
                })
              }) : e.jsx("button", {
                onClick: s,
                disabled: !n,
                className: "w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-xl font-medium transition-colors",
                children: n ? e.jsxs(e.Fragment, {
                  children: [
                    e.jsx(_e, {
                      className: "w-5 h-5"
                    }),
                    "Import Seed Phrase"
                  ]
                }) : e.jsxs(e.Fragment, {
                  children: [
                    e.jsx(re, {
                      className: "w-5 h-5 animate-spin"
                    }),
                    "Loading..."
                  ]
                })
              }),
              c && e.jsx("button", {
                onClick: s,
                className: "w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-400 transition-colors",
                children: "Manage Seed Phrase"
              }),
              e.jsx("p", {
                className: "text-gray-500 text-xs mt-4 text-center",
                children: "Your seed phrase is stored locally and used to sign transactions."
              })
            ]
          }),
          e.jsxs("div", {
            className: "mt-8 space-y-3",
            children: [
              e.jsx(Oe, {
                icon: J,
                title: "Anonymous Reputation",
                description: "Build trust without revealing your identity"
              }),
              e.jsx(Oe, {
                icon: oe,
                title: "Private Transactions",
                description: "Record deals with zero-knowledge proofs"
              }),
              e.jsx(Oe, {
                icon: ie,
                title: "Vouch Network",
                description: "Stake your reputation on trusted peers"
              })
            ]
          })
        ]
      })
    });
  }
  function Oe({ icon: t, title: s, description: r }) {
    return e.jsxs("div", {
      className: "flex items-start gap-3 text-sm",
      children: [
        e.jsx(t, {
          className: "w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
        }),
        e.jsxs("div", {
          children: [
            e.jsx("div", {
              className: "text-white font-medium",
              children: s
            }),
            e.jsx("div", {
              className: "text-gray-500",
              children: r
            })
          ]
        })
      ]
    });
  }
  function dr({ wallet: t, badge: s, currentBlock: r, loading: n, onMintBadge: a }) {
    return s !== void 0 ? e.jsxs("div", {
      className: "space-y-6",
      children: [
        e.jsx("div", {
          className: "flex items-center justify-between",
          children: e.jsx("h2", {
            className: "text-2xl font-bold",
            children: "Your Badge"
          })
        }),
        s && e.jsxs("div", {
          className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
          children: [
            e.jsx("div", {
              className: "lg:col-span-2",
              children: e.jsx(Xs, {
                badge: s,
                currentBlock: r,
                expanded: true
              })
            }),
            e.jsx("div", {
              className: "space-y-6",
              children: e.jsxs("div", {
                className: "bg-gray-900 border border-gray-800 rounded-xl p-6",
                children: [
                  e.jsx("h3", {
                    className: "text-sm font-medium text-gray-400 mb-4",
                    children: "Trust Score"
                  }),
                  e.jsx("div", {
                    className: "flex justify-center",
                    children: e.jsx(Nt, {
                      trust: s.trust,
                      size: "lg",
                      isNewBadge: s.flags.new_badge
                    })
                  })
                ]
              })
            })
          ]
        })
      ]
    }) : e.jsx(ur, {
      wallet: t,
      loading: n,
      onMintBadge: a
    });
  }
  function ur({ wallet: t, loading: s, onMintBadge: r }) {
    return e.jsxs(e.Fragment, {
      children: [
        e.jsxs("div", {
          className: "text-center mb-8",
          children: [
            e.jsx("h2", {
              className: "text-3xl font-bold mb-2",
              children: "Welcome to Veil"
            }),
            e.jsx("p", {
              className: "text-gray-400",
              children: "Create your anonymous reputation badge to get started"
            })
          ]
        }),
        e.jsxs("div", {
          className: "bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-purple-700/50 rounded-2xl p-8 max-w-2xl mx-auto",
          children: [
            e.jsxs("div", {
              className: "text-center mb-6",
              children: [
                e.jsx("div", {
                  className: "inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4",
                  children: e.jsx(J, {
                    className: "w-8 h-8"
                  })
                }),
                e.jsx("h3", {
                  className: "text-2xl font-bold mb-2",
                  children: "Mint Your Badge"
                }),
                e.jsx("p", {
                  className: "text-gray-300",
                  children: "Your badge is your anonymous identity on Veil. It tracks your reputation without revealing your transaction history."
                })
              ]
            }),
            e.jsx("button", {
              onClick: r,
              disabled: s || t.utxos.length === 0,
              className: "w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-xl font-medium transition-colors text-lg",
              children: s ? e.jsxs(e.Fragment, {
                children: [
                  e.jsx(re, {
                    className: "w-6 h-6 animate-spin"
                  }),
                  "Minting Badge..."
                ]
              }) : e.jsxs(e.Fragment, {
                children: [
                  e.jsx(pt, {
                    className: "w-6 h-6"
                  }),
                  "Mint Badge (546 sats)"
                ]
              })
            }),
            t.utxos.length === 0 && e.jsx("p", {
              className: "text-yellow-400 text-sm mt-4 text-center",
              children: "\u26A0\uFE0F No UTXOs found. Fund your wallet with testnet4 bitcoin first."
            })
          ]
        }),
        e.jsx(gr, {})
      ]
    });
  }
  function gr() {
    return e.jsxs("div", {
      className: "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8",
      children: [
        e.jsx(Re, {
          icon: oe,
          title: "Record Transactions",
          description: "Build reputation through private transaction records",
          color: "purple"
        }),
        e.jsx(Re, {
          icon: ie,
          title: "Vouch Network",
          description: "Stake reputation on trusted peers and earn network bonuses",
          color: "cyan"
        }),
        e.jsx(Re, {
          icon: J,
          title: "Anonymous Trust",
          description: "Prove your reputation without revealing your history",
          color: "green"
        })
      ]
    });
  }
  function Re({ icon: t, title: s, description: r, color: n }) {
    const a = {
      purple: "text-purple-400",
      cyan: "text-cyan-400",
      green: "text-green-400"
    }[n];
    return e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-6 text-center",
      children: [
        e.jsx(t, {
          className: `w-8 h-8 ${a} mx-auto mb-3`
        }),
        e.jsx("h4", {
          className: "font-semibold mb-2",
          children: s
        }),
        e.jsx("p", {
          className: "text-sm text-gray-400",
          children: r
        })
      ]
    });
  }
  const it = H("SpellGenerator"), ct = 546;
  function pr(t) {
    const { acceptorBadgeUtxo: s, acceptorOldBadge: r, acceptorNewBadge: n, acceptorAddress: a, proposerBadgeUtxo: o, proposerOldBadge: c, proposerNewBadge: l, proposerAddress: i, proposalId: d, value: m, category: p, windowBlocks: x, reportWindowBlocks: v, currentBlock: u } = t;
    it.info("Generating AcceptProposal spell (atomic):", {
      proposerUtxo: `${o.txid.slice(0, 8)}:${o.vout}`,
      proposerBadgeId: c.id.slice(0, 16),
      acceptorUtxo: `${s.txid.slice(0, 8)}:${s.vout}`,
      acceptorBadgeId: r.id.slice(0, 16),
      proposalId: d.slice(0, 16),
      value: m,
      category: p
    });
    const y = c.id, k = r.id, T = me, h = je(c), P = je(l), B = je(r), E = je(n), I = `version: 8

apps:
  $00: "n/${y}/${T}"
  $01: "n/${k}/${T}"

ins:
  # Input 0: Proposer's current badge
  - utxo_id: "${o.txid}:${o.vout}"
    charms:
      $00:
${h}

  # Input 1: Acceptor's current badge
  - utxo_id: "${s.txid}:${s.vout}"
    charms:
      $01:
${B}

outs:
  # Output 0: Updated proposer badge
  - address: "${i}"
    sats: ${ct}
    charms:
      $00:
${P}

  # Output 1: Updated acceptor badge
  - address: "${a}"
    sats: ${ct}
    charms:
      $01:
${E}

public_args:
  $00:
    AcceptProposal:
      proposal_id: "${d}"
      value: ${m}
      category: ${p}
      window_blocks: ${x}
      report_window_blocks: ${v}
      current_block: ${u}
  $01:
    AcceptProposal:
      proposal_id: "${d}"
      value: ${m}
      category: ${p}
      window_blocks: ${x}
      report_window_blocks: ${v}
      current_block: ${u}
`;
    return it.debug("Generated atomic AcceptProposal spell YAML"), I;
  }
  function je(t) {
    const s = "        ";
    return [
      `id: "${t.id}"`,
      `created_at: ${t.created_at}`,
      `pubkey: "${t.pubkey}"`,
      `tx_total: ${t.tx_total}`,
      `tx_positive: ${t.tx_positive}`,
      `tx_negative: ${t.tx_negative}`,
      `volume_total: ${t.volume_total}`,
      `volume_sum_squares: ${t.volume_sum_squares}`,
      `window_tx_count: ${t.window_tx_count}`,
      `window_volume: ${t.window_volume}`,
      `window_start: ${t.window_start}`,
      `counterparty_count: ${t.counterparty_count}`,
      "backing:",
      `  backed_count: ${t.backing.backed_count}`,
      `  unbacked_count: ${t.backing.unbacked_count}`,
      `  backed_volume: ${t.backing.backed_volume}`,
      `  unbacked_volume: ${t.backing.unbacked_volume}`,
      `vouches_out: ${lt(t.vouches_out)}`,
      `vouches_in: ${lt(t.vouches_in)}`,
      `cascade_damage: ${t.cascade_damage}`,
      `active_transactions: ${xr(t.active_transactions)}`,
      `reporting_transactions: ${hr(t.reporting_transactions)}`,
      "outcomes:",
      `  mutual_positive: ${t.outcomes.mutualPositive}`,
      `  mutual_negative: ${t.outcomes.mutualNegative}`,
      `  contested_i_positive: ${t.outcomes.contestedIPositive}`,
      `  contested_i_negative: ${t.outcomes.contestedINegative}`,
      `  timeout: ${t.outcomes.timeout}`,
      `  mutual_timeout: ${t.outcomes.mutualTimeout}`,
      `trust: ${t.trust}`,
      `risk: ${t.risk}`,
      `flags: ${mr(t.flags)}`,
      `last_nonce: "${t.last_nonce}"`,
      `last_update: ${t.last_update}`
    ].map((n) => s + n).join(`
`);
  }
  function lt(t) {
    return t.length === 0 ? "[]" : `[${t.map((r) => `{ badge_id: "${r.badge_id}", stake_percent: ${r.stake_percent}, created_at: ${r.created_at}, unlock_at: ${r.unlock_at} }`).join(", ")}]`;
  }
  function xr(t) {
    return t.length === 0 ? "[]" : `[${t.map((r) => `{ id: "${r.id}", counterparty_badge_id: "${r.counterpartyBadgeId}", value: ${r.value}, category: "${r.category}", started_at: ${r.startedAt}, window_ends_at: ${r.windowEndsAt}, report_deadline: ${r.reportDeadline}, i_am_proposer: ${r.iAmProposer} }`).join(", ")}]`;
  }
  function hr(t) {
    return t.length === 0 ? "[]" : `[${t.map((r) => `{ id: "${r.id}", counterparty_badge_id: "${r.counterpartyBadgeId}", value: ${r.value}, category: "${r.category}", report_deadline: ${r.reportDeadline}, my_report: ${r.myReport ? `"${r.myReport}"` : "null"}, i_am_proposer: ${r.iAmProposer} }`).join(", ")}]`;
  }
  function mr(t) {
    let s = 0;
    return t.acceleration && (s |= 1), t.extraction && (s |= 2), t.isolated && (s |= 4), t.too_clean && (s |= 8), t.erratic && (s |= 16), t.new_badge && (s |= 32), s;
  }
  const F = H("acceptProposal");
  async function fr(t, s) {
    var _a, _b;
    const { proposal: r, myBadge: n, myBadgeUtxo: a, myAddress: o } = t, { bitcoin: c, prover: l, storage: i, network: d, onProgress: m } = s;
    F.info("Starting acceptProposal:", {
      proposalId: r.id.slice(0, 16),
      myBadgeId: n.id.slice(0, 16),
      myBadgeUtxo: `${a.txid.slice(0, 8)}:${a.vout}`,
      availableUtxos: t.availableUtxos.length,
      proposerBadgeId: r.proposerBadgeId.slice(0, 16),
      value: r.value,
      network: d
    });
    try {
      m == null ? void 0 : m("Validating proposal...");
      const p = await c.getCurrentBlockHeight(d);
      if (F.debug("Current block height:", p), p > r.expiresAt) return {
        success: false,
        error: `Proposal expired at block ${r.expiresAt}, current block is ${p}`
      };
      if (r.counterpartyBadgeId !== n.id) return {
        success: false,
        error: "This proposal is not addressed to your badge"
      };
      m == null ? void 0 : m("Fetching proposer badge...");
      const x = r.proposerBadgeUtxo;
      F.debug("Fetching proposer badge from UTXO:", `${x.txid.slice(0, 8)}:${x.vout}`);
      const v = await ne.scanUtxoForAnyBadge(x.txid, x.vout, d);
      if (!v) return {
        success: false,
        error: "Proposer badge not found or invalid. They may have spent it. Please request a new proposal."
      };
      if (v.id !== r.proposerBadgeId) return {
        success: false,
        error: "Proposer badge ID mismatch. Invalid proposal."
      };
      F.info("Proposer badge verified:", {
        badgeId: v.id.slice(0, 16),
        utxo: `${x.txid.slice(0, 8)}:${x.vout}`
      }), m == null ? void 0 : m("Creating active transaction...");
      const u = p + r.windowBlocks, y = u + r.reportWindowBlocks, k = {
        id: r.id,
        counterpartyBadgeId: r.proposerBadgeId,
        value: r.value,
        category: r.category,
        startedAt: p,
        windowEndsAt: u,
        reportDeadline: y,
        iAmProposer: false
      }, T = {
        id: r.id,
        counterpartyBadgeId: n.id,
        value: r.value,
        category: r.category,
        startedAt: p,
        windowEndsAt: u,
        reportDeadline: y,
        iAmProposer: true
      }, h = {
        ...n,
        active_transactions: [
          ...n.active_transactions,
          k
        ],
        last_update: p
      }, P = {
        ...v,
        active_transactions: [
          ...v.active_transactions,
          T
        ],
        last_update: p
      }, B = o;
      m == null ? void 0 : m("Generating atomic spell...");
      const E = pr({
        acceptorBadgeUtxo: a,
        acceptorOldBadge: n,
        acceptorNewBadge: h,
        acceptorAddress: o,
        proposerBadgeUtxo: {
          txid: x.txid,
          vout: x.vout,
          value: 546,
          scriptPubKey: ""
        },
        proposerOldBadge: v,
        proposerNewBadge: P,
        proposerAddress: B,
        proposalId: r.id,
        value: r.value,
        category: r.category,
        windowBlocks: r.windowBlocks,
        reportWindowBlocks: r.reportWindowBlocks,
        currentBlock: p
      });
      F.debug("Generated atomic spell YAML length:", E.length), F.debug("Fetching acceptor badge prev tx:", a.txid.slice(0, 16));
      const I = await c.fetchTransaction(a.txid, d);
      F.debug("Fetching proposer badge prev tx:", x.txid.slice(0, 16));
      const S = await c.fetchTransaction(x.txid, d);
      F.debug("Both prev txs fetched"), m == null ? void 0 : m("Selecting funding UTXO..."), F.debug("Available UTXOs for funding:", t.availableUtxos.map((f) => ({
        txid: f.txid.slice(0, 8),
        vout: f.vout,
        value: f.value
      })));
      const j = t.availableUtxos.filter((f) => !(f.txid === a.txid && f.vout === a.vout || f.txid === x.txid && f.vout === x.vout));
      F.debug("UTXOs after filtering both badge UTXOs:", j.length);
      const W = (((_a = i.getBurnedUtxos) == null ? void 0 : _a.call(i)) ?? []).map((f) => f.utxoId);
      F.debug("Burned UTXOs to exclude:", W.length);
      const R = 5e3, w = jt(j, void 0, R, W);
      if (!w) return F.error("No suitable funding UTXO found:", {
        availableUtxos: j.map((f) => ({
          txid: f.txid.slice(0, 8),
          value: f.value
        })),
        minRequired: R
      }), {
        success: false,
        error: `No suitable funding UTXO found. Need at least ${R} sats (separate from both badge UTXOs) to pay transaction fees.`
      };
      F.info("Selected funding UTXO:", {
        txid: w.txid.slice(0, 8),
        vout: w.vout,
        value: w.value
      }), m == null ? void 0 : m("Proving transaction...");
      const _ = [
        I,
        S
      ];
      if (w.txid !== a.txid && w.txid !== x.txid) {
        F.debug("Fetching funding prev tx:", w.txid.slice(0, 16));
        const f = await c.fetchTransaction(w.txid, d);
        _.push(f);
      }
      F.info("Sending to prover:", {
        spellYamlLength: E.length,
        prevTxsCount: _.length,
        fundingUtxo: `${w.txid.slice(0, 8)}:${w.vout}`,
        fundingValue: w.value,
        changeAddress: o.slice(0, 16)
      });
      const N = `${w.txid}:${w.vout}`;
      (_b = i.addBurnedUtxo) == null ? void 0 : _b.call(i, N), F.debug("Marked funding UTXO as burned:", N);
      const C = await l.prove({
        spellYaml: E,
        prevTxs: _,
        fundingUtxo: {
          txid: w.txid,
          vout: w.vout
        },
        fundingUtxoValue: w.value,
        changeAddress: o,
        feeRate: 2
      });
      if (!C.success || !C.spellTx) return {
        success: false,
        error: C.error || "Proof generation failed"
      };
      if (C.isMock) return F.info("Mock mode: skipping broadcast"), {
        success: true,
        data: {
          txid: "mock_txid_" + Date.now(),
          activeTransaction: k,
          updatedBadge: h
        }
      };
      m == null ? void 0 : m("Broadcasting transaction...");
      const U = await c.broadcast(C.spellTx, d);
      return F.info("Proposal accepted successfully (atomic)", {
        txid: U,
        proposalId: r.id
      }), {
        success: true,
        data: {
          txid: U,
          activeTransaction: k,
          updatedBadge: h
        }
      };
    } catch (p) {
      const x = p instanceof Error ? p.message : "Unknown error";
      return F.error("acceptProposal failed:", {
        error: x
      }), {
        success: false,
        error: x
      };
    }
  }
  const le = H("TransactionsPage");
  function br({ myBadge: t, currentBlock: s, signMessage: r, onBadgeUpdate: n, wallet: a }) {
    const [o, c] = g.useState("propose"), [l, i] = g.useState(null);
    g.useEffect(() => {
      const x = window.location.href, v = Gs(x);
      v && (le.info("Found proposal in URL:", v.id), i(v), c("accept"), window.history.replaceState({}, "", window.location.pathname));
    }, []);
    const d = (x) => {
      le.info("Proposal created:", x.id);
    }, m = async (x, v) => {
      if (le.info("Accepting proposal:", x.id), !a.address) throw new Error("Wallet not connected");
      try {
        const u = Z("mempool"), y = wt("remote"), k = vt(), T = ft(), h = await fr({
          proposal: x,
          myBadge: t.badge,
          myBadgeUtxo: t.utxo,
          availableUtxos: a.utxos,
          myAddress: a.address,
          mySignature: v,
          network: a.network
        }, {
          bitcoin: u,
          prover: y,
          crypto: k,
          storage: T,
          network: a.network,
          onProgress: (P) => le.info("Progress:", P)
        });
        if (!h.success || !h.data) throw new Error(h.error || "Failed to accept proposal");
        return n == null ? void 0 : n(h.data.updatedBadge), i(null), c("inbox"), h.data.activeTransaction;
      } catch (u) {
        throw le.error("Failed to accept proposal:", u), u;
      }
    }, p = () => {
      i(null), c("inbox");
    };
    return e.jsxs("div", {
      className: "space-y-6",
      children: [
        e.jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            e.jsx("h2", {
              className: "text-2xl font-bold",
              children: "Transactions"
            }),
            e.jsxs("div", {
              className: "flex gap-2",
              children: [
                e.jsxs("button", {
                  onClick: () => c("propose"),
                  className: `px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${o === "propose" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`,
                  children: [
                    e.jsx(pt, {
                      className: "w-4 h-4"
                    }),
                    "Propose"
                  ]
                }),
                e.jsxs("button", {
                  onClick: () => c("inbox"),
                  className: `px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${o === "inbox" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`,
                  children: [
                    e.jsx(xt, {
                      className: "w-4 h-4"
                    }),
                    "Inbox"
                  ]
                })
              ]
            })
          ]
        }),
        e.jsxs("div", {
          className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
          children: [
            e.jsxs("div", {
              className: "lg:col-span-2",
              children: [
                o === "inbox" && e.jsx(yr, {
                  activeTransactions: t.badge.active_transactions,
                  currentBlock: s
                }),
                o === "propose" && e.jsx(or, {
                  myBadgeId: t.badge.id,
                  myBadgeUtxo: t.utxo,
                  currentBlock: s,
                  signMessage: r,
                  onProposalCreated: d
                }),
                o === "accept" && l && e.jsx(ir, {
                  proposal: l,
                  myBadgeId: t.badge.id,
                  currentBlock: s,
                  signMessage: r,
                  onAccept: m,
                  onDecline: p
                })
              ]
            }),
            e.jsx("div", {
              className: "space-y-4",
              children: e.jsx(wr, {})
            })
          ]
        })
      ]
    });
  }
  function yr({ activeTransactions: t, currentBlock: s }) {
    return t.length === 0 ? e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-8 text-center",
      children: [
        e.jsx(xt, {
          className: "w-12 h-12 text-gray-600 mx-auto mb-4"
        }),
        e.jsx("h3", {
          className: "text-lg font-medium text-white mb-2",
          children: "No Active Transactions"
        }),
        e.jsx("p", {
          className: "text-gray-400",
          children: "Create a proposal or accept one from a counterparty to get started."
        })
      ]
    }) : e.jsx("div", {
      className: "space-y-4",
      children: t.map((r) => {
        const n = r.windowEndsAt - s, a = n <= 0;
        return e.jsxs("div", {
          className: "bg-gray-900 border border-gray-800 rounded-xl p-4",
          children: [
            e.jsxs("div", {
              className: "flex items-center justify-between mb-3",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    a ? e.jsx(Et, {
                      className: "w-5 h-5 text-yellow-400"
                    }) : e.jsx($e, {
                      className: "w-5 h-5 text-blue-400"
                    }),
                    e.jsxs("span", {
                      className: "font-medium text-white",
                      children: [
                        r.category,
                        " Transaction"
                      ]
                    })
                  ]
                }),
                e.jsxs("span", {
                  className: "text-sm text-gray-400",
                  children: [
                    r.value.toLocaleString(),
                    " sats"
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "text-sm text-gray-500",
              children: [
                e.jsxs("p", {
                  children: [
                    "ID: ",
                    r.id.slice(0, 16),
                    "..."
                  ]
                }),
                e.jsxs("p", {
                  children: [
                    "Counterparty: ",
                    r.counterpartyBadgeId.slice(0, 16),
                    "..."
                  ]
                }),
                !a && e.jsxs("p", {
                  className: "text-blue-400",
                  children: [
                    n,
                    " blocks remaining (~",
                    Math.round(n * 10 / 60),
                    " hours)"
                  ]
                }),
                a && e.jsx("p", {
                  className: "text-yellow-400",
                  children: "Ready to report outcome"
                })
              ]
            })
          ]
        }, r.id);
      })
    });
  }
  function wr() {
    const t = [
      {
        title: "Propose",
        description: "Create a proposal with transaction details"
      },
      {
        title: "Accept",
        description: "Counterparty reviews and accepts"
      },
      {
        title: "Settle",
        description: "Complete your transaction"
      },
      {
        title: "Report",
        description: "Both parties report the outcome"
      }
    ];
    return e.jsxs("div", {
      className: "bg-gray-900 border border-gray-800 rounded-xl p-4",
      children: [
        e.jsx("h3", {
          className: "font-medium text-white mb-4",
          children: "How It Works"
        }),
        e.jsx("div", {
          className: "space-y-4",
          children: t.map((s, r) => e.jsxs("div", {
            className: "flex gap-3",
            children: [
              e.jsx("div", {
                className: "w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-medium flex-shrink-0",
                children: r + 1
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("p", {
                    className: "text-white font-medium text-sm",
                    children: s.title
                  }),
                  e.jsx("p", {
                    className: "text-gray-500 text-sm",
                    children: s.description
                  })
                ]
              })
            ]
          }, r))
        })
      ]
    });
  }
  function vr(t) {
    return e.jsx("div", {
      className: "flex flex-col items-center justify-center min-h-[60vh] text-center px-4",
      children: e.jsxs("div", {
        className: "bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md",
        children: [
          e.jsx("div", {
            className: "w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6",
            children: e.jsx(ie, {
              className: "w-8 h-8 text-purple-400"
            })
          }),
          e.jsx("h2", {
            className: "text-2xl font-bold text-white mb-3",
            children: "Vouch Network"
          }),
          e.jsx("p", {
            className: "text-gray-400 mb-6",
            children: "Stake your reputation on people you trust. When they succeed, you both benefit. When they fail, you share the damage."
          }),
          e.jsxs("div", {
            className: "bg-gray-800/50 rounded-lg p-4 mb-6",
            children: [
              e.jsx("h3", {
                className: "text-sm font-medium text-gray-300 mb-2",
                children: "How it works:"
              }),
              e.jsxs("ul", {
                className: "text-sm text-gray-500 space-y-1 text-left",
                children: [
                  e.jsx("li", {
                    children: "\u2022 Vouch for others with a stake percentage"
                  }),
                  e.jsx("li", {
                    children: "\u2022 Receive network bonus from incoming vouches"
                  }),
                  e.jsx("li", {
                    children: "\u2022 Cascade damage flows through vouch chains"
                  })
                ]
              })
            ]
          }),
          e.jsxs("div", {
            className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-400",
            children: [
              e.jsx(ht, {
                className: "w-4 h-4"
              }),
              "Coming Soon"
            ]
          })
        ]
      })
    });
  }
  function jr(t) {
    return e.jsx("div", {
      className: "flex flex-col items-center justify-center min-h-[60vh] text-center px-4",
      children: e.jsxs("div", {
        className: "bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md",
        children: [
          e.jsx("div", {
            className: "w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6",
            children: e.jsx(Ut, {
              className: "w-8 h-8 text-cyan-400"
            })
          }),
          e.jsx("h2", {
            className: "text-2xl font-bold text-white mb-3",
            children: "Network Visualization"
          }),
          e.jsx("p", {
            className: "text-gray-400 mb-6",
            children: "See your web of trust. Visualize who vouches for you, who you vouch for, and how reputation flows through the network."
          }),
          e.jsxs("div", {
            className: "bg-gray-800/50 rounded-lg p-4 mb-6",
            children: [
              e.jsx("h3", {
                className: "text-sm font-medium text-gray-300 mb-2",
                children: "Features:"
              }),
              e.jsxs("ul", {
                className: "text-sm text-gray-500 space-y-1 text-left",
                children: [
                  e.jsx("li", {
                    children: "\u2022 Interactive network graph"
                  }),
                  e.jsx("li", {
                    children: "\u2022 Stake flow visualization"
                  }),
                  e.jsx("li", {
                    children: "\u2022 Cascade damage paths"
                  })
                ]
              })
            ]
          }),
          e.jsxs("div", {
            className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-400",
            children: [
              e.jsx(ht, {
                className: "w-4 h-4"
              }),
              "Coming Soon"
            ]
          })
        ]
      })
    });
  }
  function dt({ wallet: t, badge: s, onDisconnect: r, onBack: n, onSeedPhraseChange: a }) {
    var _a, _b;
    const o = (c) => t.network === "regtest" ? null : `https://mempool.space${t.network === "mainnet" ? "" : `/${t.network}`}/tx/${c}`;
    return e.jsxs("div", {
      className: "space-y-6",
      children: [
        e.jsxs("div", {
          className: "flex items-center gap-4",
          children: [
            n && e.jsx("button", {
              onClick: n,
              className: "p-2 hover:bg-gray-800 rounded-lg transition-colors",
              children: e.jsx(Mt, {
                className: "w-5 h-5"
              })
            }),
            e.jsx("h2", {
              className: "text-2xl font-bold",
              children: "Settings"
            })
          ]
        }),
        e.jsxs("div", {
          className: "max-w-2xl space-y-4",
          children: [
            e.jsx(cr, {
              onSeedPhraseChange: a,
              isTestnet: t.network !== "mainnet",
              walletAddress: t.address || void 0
            }),
            t.connected && e.jsxs("div", {
              className: "bg-gray-900 border border-gray-800 rounded-xl p-6",
              children: [
                e.jsxs("h3", {
                  className: "font-medium text-white mb-4 flex items-center gap-2",
                  children: [
                    e.jsx(ke, {
                      className: "w-5 h-5"
                    }),
                    "Connected Wallet"
                  ]
                }),
                e.jsxs("div", {
                  className: "space-y-3",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsx("span", {
                          className: "text-xs text-gray-500 uppercase tracking-wide",
                          children: "Address"
                        }),
                        e.jsx("p", {
                          className: "text-sm text-gray-300 font-mono break-all mt-1",
                          children: t.address
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("span", {
                          className: "text-xs text-gray-500 uppercase tracking-wide",
                          children: "Network"
                        }),
                        e.jsx("p", {
                          className: "text-sm text-gray-300 mt-1 capitalize",
                          children: t.network || "testnet4"
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("span", {
                          className: "text-xs text-gray-500 uppercase tracking-wide",
                          children: "UTXOs"
                        }),
                        e.jsxs("p", {
                          className: "text-sm text-gray-300 mt-1",
                          children: [
                            ((_a = t.utxos) == null ? void 0 : _a.length) || 0,
                            " available"
                          ]
                        })
                      ]
                    }),
                    e.jsxs("button", {
                      onClick: r,
                      className: "flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors mt-4",
                      children: [
                        e.jsx(Ot, {
                          className: "w-4 h-4"
                        }),
                        "Disconnect Wallet"
                      ]
                    })
                  ]
                })
              ]
            }),
            ((_b = s == null ? void 0 : s.utxo) == null ? void 0 : _b.txid) && e.jsxs("div", {
              className: "bg-gray-900 border border-gray-800 rounded-xl p-6",
              children: [
                e.jsxs("h3", {
                  className: "font-medium text-white mb-4 flex items-center gap-2",
                  children: [
                    e.jsx(Rt, {
                      className: "w-5 h-5"
                    }),
                    "Badge Transaction"
                  ]
                }),
                e.jsx("p", {
                  className: "text-sm text-gray-400 mb-4",
                  children: "View the Bitcoin transaction that minted your Veil Badge on the blockchain."
                }),
                e.jsxs("div", {
                  className: "mb-4",
                  children: [
                    e.jsx("span", {
                      className: "text-xs text-gray-500 uppercase tracking-wide",
                      children: "Transaction ID"
                    }),
                    e.jsx("p", {
                      className: "text-sm text-gray-300 font-mono break-all mt-1",
                      children: s.utxo.txid
                    })
                  ]
                }),
                o(s.utxo.txid) ? e.jsxs("a", {
                  href: o(s.utxo.txid),
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/30 rounded-lg text-sm transition-colors",
                  children: [
                    "View on Mempool.space",
                    e.jsx(Ce, {
                      className: "w-4 h-4"
                    })
                  ]
                }) : e.jsxs("p", {
                  className: "text-sm text-gray-500",
                  children: [
                    "No public block explorer available for ",
                    t.network
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "bg-gray-900 border border-gray-800 rounded-xl p-6",
              children: [
                e.jsxs("h3", {
                  className: "font-medium text-white mb-4 flex items-center gap-2",
                  children: [
                    e.jsx(mt, {
                      className: "w-5 h-5"
                    }),
                    "About Veil Badge"
                  ]
                }),
                e.jsx("p", {
                  className: "text-sm text-gray-400 mb-4",
                  children: "Privacy-preserving reputation on Bitcoin. Build trust without revealing your identity."
                }),
                e.jsxs("div", {
                  className: "flex flex-wrap gap-3",
                  children: [
                    e.jsxs("a", {
                      href: "https://github.com/goingtravelin/veil-badge",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors",
                      children: [
                        e.jsx(Wt, {
                          className: "w-4 h-4"
                        }),
                        "GitHub",
                        e.jsx(Ce, {
                          className: "w-3 h-3"
                        })
                      ]
                    }),
                    e.jsxs("a", {
                      href: "https://charms.dev",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors",
                      children: [
                        "Charms Protocol",
                        e.jsx(Ce, {
                          className: "w-3 h-3"
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  }
  const ut = H("App"), gt = [
    {
      id: "dashboard",
      icon: J,
      label: "Dashboard"
    },
    {
      id: "transactions",
      icon: oe,
      label: "Transactions"
    },
    {
      id: "vouch",
      icon: ie,
      label: "Vouch"
    },
    {
      id: "network",
      icon: ue,
      label: "Network"
    },
    {
      id: "settings",
      icon: mt,
      label: "Settings"
    }
  ];
  function Nr() {
    return window.location.search.includes("proposal=") ? "transactions" : "dashboard";
  }
  function kr() {
    const [t, s] = g.useState(Nr), [r, n] = g.useState(false), [a, o] = g.useState(0), { wasmReady: c, wasmError: l, initWasm: i } = Dt(true), { wallet: d, connect: m, disconnect: p, myBadge: x, refreshBadges: v, refreshUtxos: u, mintBadge: y, signMessage: k, error: T, loading: h, txStatus: P, successMessage: B, clearSuccess: E } = Es(), I = x, S = I == null ? void 0 : I.badge, j = I !== null;
    g.useEffect(() => {
      async function R() {
        try {
          const _ = await Us(d.network);
          o(_);
        } catch (_) {
          ut.warn("[App] Failed to fetch block height, will retry:", _);
        }
      }
      R();
      const w = setInterval(R, 6e4);
      return () => clearInterval(w);
    }, [
      d.network
    ]), g.useEffect(() => {
      d.connected && v();
    }, [
      d.connected,
      v
    ]), g.useEffect(() => {
      d.connected && !j && t !== "dashboard" && s("dashboard");
    }, [
      d.connected,
      j,
      t
    ]);
    const O = g.useCallback(async () => {
      c || await i(), await m("seed");
    }, [
      m,
      i,
      c
    ]);
    if (!d.connected) return t === "settings" ? e.jsx("div", {
      className: "min-h-screen bg-gray-950 text-white p-4",
      children: e.jsx("div", {
        className: "max-w-2xl mx-auto",
        children: e.jsx(dt, {
          wallet: d,
          badge: S,
          loading: h,
          wasmReady: c,
          wasmError: l,
          onConnect: O,
          onDisconnect: p,
          onBack: () => s("dashboard"),
          onSeedPhraseChange: () => {
          }
        })
      })
    }) : e.jsx(lr, {
      onConnect: O,
      onGoToSettings: () => s("settings"),
      loading: h,
      wasmReady: c,
      wasmError: l,
      walletError: T
    });
    const W = () => {
      switch (t) {
        case "dashboard":
          return e.jsx(dr, {
            wallet: d,
            badge: S,
            currentBlock: a,
            loading: h,
            onMintBadge: y,
            onConnect: O
          });
        case "transactions":
          return I ? e.jsx(br, {
            myBadge: I,
            currentBlock: a,
            signMessage: k,
            wallet: d,
            onBadgeUpdate: (R) => {
              ut.debug("[App] Badge updated:", R.id), v();
            }
          }) : e.jsxs("div", {
            className: "bg-gray-900 border border-gray-800 rounded-xl p-8 text-center",
            children: [
              e.jsx("div", {
                className: "w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center",
                children: e.jsx(oe, {
                  className: "w-8 h-8 text-purple-400"
                })
              }),
              e.jsx("h3", {
                className: "text-xl font-semibold text-white mb-2",
                children: "No Badge Found"
              }),
              e.jsx("p", {
                className: "text-gray-400 mb-4",
                children: "You need a Veil Badge to record transactions. Go to the Dashboard to mint your badge."
              }),
              e.jsx("button", {
                onClick: () => s("dashboard"),
                className: "px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors",
                children: "Go to Dashboard"
              })
            ]
          });
        case "vouch":
          return e.jsx(vr, {});
        case "network":
          return e.jsx(jr, {});
        case "settings":
          return e.jsx(dt, {
            wallet: d,
            badge: S,
            loading: h,
            wasmReady: c,
            wasmError: l,
            onConnect: O,
            onDisconnect: p,
            onRefreshUtxos: u,
            onSeedPhraseChange: () => {
            }
          });
        default:
          return null;
      }
    };
    return e.jsxs("div", {
      className: "min-h-screen bg-gray-950 text-white",
      children: [
        e.jsx(Sr, {
          view: t,
          setView: s,
          currentBlock: a,
          wallet: d,
          walletLoading: h,
          hasBadge: j,
          mobileMenuOpen: r,
          setMobileMenuOpen: n,
          onConnect: O,
          onDisconnect: p
        }),
        e.jsxs("main", {
          className: "max-w-7xl mx-auto px-4 py-8",
          children: [
            T && !d.connected && e.jsxs("div", {
              className: "mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400",
              children: [
                e.jsx("strong", {
                  children: "Error:"
                }),
                " ",
                T
              ]
            }),
            B && e.jsxs("div", {
              className: "mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl text-green-300 flex items-center justify-between",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [
                    e.jsx(Ne, {
                      className: "w-5 h-5"
                    }),
                    B
                  ]
                }),
                e.jsx("button", {
                  onClick: E,
                  className: "text-green-400 hover:text-green-300 transition-colors",
                  children: e.jsx(De, {
                    className: "w-5 h-5"
                  })
                })
              ]
            }),
            P && e.jsxs("div", {
              className: "mb-6 p-4 bg-purple-900/30 border border-purple-700 rounded-xl text-purple-300 flex items-center gap-3",
              children: [
                e.jsx(re, {
                  className: "w-5 h-5 animate-spin"
                }),
                P
              ]
            }),
            W()
          ]
        }),
        e.jsx("footer", {
          className: "border-t border-gray-800 mt-12 py-6",
          children: e.jsxs("div", {
            className: "max-w-7xl mx-auto px-4 text-center text-sm text-gray-500",
            children: [
              e.jsx("p", {
                children: "Veil Protocol - Built with Charms on Bitcoin"
              }),
              e.jsx("p", {
                className: "mt-1 text-xs",
                children: "Prove everything. Reveal nothing."
              })
            ]
          })
        })
      ]
    });
  }
  function Sr({ view: t, setView: s, currentBlock: r, wallet: n, walletLoading: a, hasBadge: o, mobileMenuOpen: c, setMobileMenuOpen: l, onConnect: i, onDisconnect: d }) {
    var _a, _b;
    const [m, p] = g.useState(false), x = (u) => {
      const y = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors";
      return t === u ? `${y} bg-purple-600 text-white` : `${y} text-gray-400 hover:text-white hover:bg-gray-800`;
    }, v = (u) => {
      const y = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
      return t === u ? `${y} bg-purple-600 text-white` : `${y} text-gray-400 hover:text-white hover:bg-gray-800`;
    };
    return e.jsxs("header", {
      className: "border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50",
      children: [
        e.jsxs("div", {
          className: "max-w-7xl mx-auto px-4 h-16 flex items-center justify-between",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className: "p-2 bg-purple-600 rounded-lg",
                  children: e.jsx(J, {
                    className: "w-5 h-5"
                  })
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h1", {
                      className: "font-bold text-lg",
                      children: "Veil"
                    }),
                    e.jsx("p", {
                      className: "text-xs text-gray-500 hidden sm:block",
                      children: "Anonymous Reputation"
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "hidden md:flex items-center gap-1",
              children: [
                o && gt.map(({ id: u, icon: y, label: k }) => e.jsxs("button", {
                  onClick: () => s(u),
                  className: x(u),
                  children: [
                    e.jsx(y, {
                      className: "w-4 h-4"
                    }),
                    e.jsx("span", {
                      className: "text-sm font-medium",
                      children: k
                    })
                  ]
                }, u)),
                !o && e.jsx("div", {
                  className: "text-sm text-gray-500 px-4",
                  children: "Mint a badge to unlock all features"
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsxs("div", {
                  className: "hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm",
                  children: [
                    e.jsx("div", {
                      className: "w-2 h-2 rounded-full bg-green-400 animate-pulse"
                    }),
                    e.jsx("span", {
                      className: "text-gray-400",
                      children: "Block"
                    }),
                    e.jsx("span", {
                      className: "font-mono text-white",
                      children: r.toLocaleString()
                    })
                  ]
                }),
                n.connected ? e.jsxs("div", {
                  className: "relative",
                  children: [
                    e.jsxs("button", {
                      onClick: () => p(!m),
                      className: "flex items-center gap-2 px-3 py-1.5 bg-green-900/50 border border-green-700 rounded-lg hover:bg-green-900/70 transition-colors cursor-pointer",
                      children: [
                        e.jsx(ke, {
                          className: "w-4 h-4 text-green-400"
                        }),
                        e.jsxs("span", {
                          className: "text-sm text-green-400 hidden sm:inline",
                          children: [
                            (_a = n.address) == null ? void 0 : _a.slice(0, 8),
                            "...",
                            (_b = n.address) == null ? void 0 : _b.slice(-4)
                          ]
                        }),
                        e.jsx("span", {
                          className: "text-sm text-green-400 sm:hidden",
                          children: "Connected"
                        })
                      ]
                    }),
                    m && e.jsx(Hs, {
                      wallet: n,
                      onDisconnect: d,
                      onClose: () => p(false)
                    })
                  ]
                }) : e.jsxs("button", {
                  onClick: i,
                  disabled: a,
                  className: "flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 rounded-lg transition-colors",
                  children: [
                    a ? e.jsx(re, {
                      className: "w-4 h-4 animate-spin"
                    }) : e.jsx(ke, {
                      className: "w-4 h-4"
                    }),
                    e.jsx("span", {
                      className: "text-sm font-medium hidden sm:inline",
                      children: a ? "Connecting..." : "Connect"
                    })
                  ]
                }),
                e.jsx("button", {
                  onClick: () => l(!c),
                  className: "md:hidden p-2 text-gray-400 hover:text-white",
                  children: c ? e.jsx(De, {
                    className: "w-6 h-6"
                  }) : e.jsx(Lt, {
                    className: "w-6 h-6"
                  })
                })
              ]
            })
          ]
        }),
        c && e.jsx("div", {
          className: "md:hidden border-t border-gray-800 bg-gray-900 p-4",
          children: o ? e.jsx("div", {
            className: "flex flex-col gap-1",
            children: gt.map(({ id: u, icon: y, label: k }) => e.jsxs("button", {
              onClick: () => {
                s(u), l(false);
              },
              className: v(u),
              children: [
                e.jsx(y, {
                  className: "w-5 h-5"
                }),
                e.jsx("span", {
                  className: "font-medium",
                  children: k
                })
              ]
            }, u))
          }) : e.jsx("div", {
            className: "text-center py-4 text-gray-500 text-sm",
            children: "Mint a badge to unlock all features"
          })
        })
      ]
    });
  }
  Ft.createRoot(document.getElementById("root")).render(e.jsx(Ae.StrictMode, {
    children: e.jsx(Ds, {
      fallbackMode: "retry",
      children: e.jsx(kr, {})
    })
  }));
});
