import { B as U, r as dt, a as er, c as tr, d as rr, e as nr, f as wt, g as Je, h as ir, i as Zt, j as sr, k as or, l as ur, m as cr, n as fr } from "./vendor-DaCOpwfI.js";
function ar(r, T) {
  for (var l = 0; l < T.length; l++) {
    const n = T[l];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const f in n) if (f !== "default" && !(f in r)) {
        const w = Object.getOwnPropertyDescriptor(n, f);
        w && Object.defineProperty(r, f, w.get ? w : { enumerable: true, get: () => n[f] });
      }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
function hr(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var ut = {}, ne = {}, he = {}, Et;
function fe() {
  return Et || (Et = 1, Object.defineProperty(he, "__esModule", { value: true }), he.testnet = he.regtest = he.bitcoin = void 0, he.bitcoin = { messagePrefix: `Bitcoin Signed Message:
`, bech32: "bc", bip32: { public: 76067358, private: 76066276 }, pubKeyHash: 0, scriptHash: 5, wif: 128 }, he.regtest = { messagePrefix: `Bitcoin Signed Message:
`, bech32: "bcrt", bip32: { public: 70617039, private: 70615956 }, pubKeyHash: 111, scriptHash: 196, wif: 239 }, he.testnet = { messagePrefix: `Bitcoin Signed Message:
`, bech32: "tb", bip32: { public: 70617039, private: 70615956 }, pubKeyHash: 111, scriptHash: 196, wif: 239 }), he;
}
var ct = {}, Ce = {}, ft = {}, pe = {}, _t;
function Jt() {
  if (_t) return pe;
  _t = 1, Object.defineProperty(pe, "__esModule", { value: true }), pe.encode = pe.decode = pe.check = void 0;
  function r(n) {
    if (n.length < 8 || n.length > 72 || n[0] !== 48 || n[1] !== n.length - 2 || n[2] !== 2) return false;
    const f = n[3];
    if (f === 0 || 5 + f >= n.length || n[4 + f] !== 2) return false;
    const w = n[5 + f];
    return !(w === 0 || 6 + f + w !== n.length || n[4] & 128 || f > 1 && n[4] === 0 && !(n[5] & 128) || n[f + 6] & 128 || w > 1 && n[f + 6] === 0 && !(n[f + 7] & 128));
  }
  pe.check = r;
  function T(n) {
    if (n.length < 8) throw new Error("DER sequence length is too short");
    if (n.length > 72) throw new Error("DER sequence length is too long");
    if (n[0] !== 48) throw new Error("Expected DER sequence");
    if (n[1] !== n.length - 2) throw new Error("DER sequence length is invalid");
    if (n[2] !== 2) throw new Error("Expected DER integer");
    const f = n[3];
    if (f === 0) throw new Error("R length is zero");
    if (5 + f >= n.length) throw new Error("R length is too long");
    if (n[4 + f] !== 2) throw new Error("Expected DER integer (2)");
    const w = n[5 + f];
    if (w === 0) throw new Error("S length is zero");
    if (6 + f + w !== n.length) throw new Error("S length is invalid");
    if (n[4] & 128) throw new Error("R value is negative");
    if (f > 1 && n[4] === 0 && !(n[5] & 128)) throw new Error("R value excessively padded");
    if (n[f + 6] & 128) throw new Error("S value is negative");
    if (w > 1 && n[f + 6] === 0 && !(n[f + 7] & 128)) throw new Error("S value excessively padded");
    return { r: n.slice(4, 4 + f), s: n.slice(6 + f) };
  }
  pe.decode = T;
  function l(n, f) {
    const w = n.length, p = f.length;
    if (w === 0) throw new Error("R length is zero");
    if (p === 0) throw new Error("S length is zero");
    if (w > 33) throw new Error("R length is too long");
    if (p > 33) throw new Error("S length is too long");
    if (n[0] & 128) throw new Error("R value is negative");
    if (f[0] & 128) throw new Error("S value is negative");
    if (w > 1 && n[0] === 0 && !(n[1] & 128)) throw new Error("R value excessively padded");
    if (p > 1 && f[0] === 0 && !(f[1] & 128)) throw new Error("S value excessively padded");
    const g = U.allocUnsafe(6 + w + p);
    return g[0] = 48, g[1] = g.length - 2, g[2] = 2, g[3] = n.length, n.copy(g, 4), g[4 + w] = 2, g[5 + w] = f.length, f.copy(g, 6 + w), g;
  }
  return pe.encode = l, pe;
}
var _e = {}, bt;
function yt() {
  if (bt) return _e;
  bt = 1, Object.defineProperty(_e, "__esModule", { value: true }), _e.REVERSE_OPS = _e.OPS = void 0;
  const r = { OP_FALSE: 0, OP_0: 0, OP_PUSHDATA1: 76, OP_PUSHDATA2: 77, OP_PUSHDATA4: 78, OP_1NEGATE: 79, OP_RESERVED: 80, OP_TRUE: 81, OP_1: 81, OP_2: 82, OP_3: 83, OP_4: 84, OP_5: 85, OP_6: 86, OP_7: 87, OP_8: 88, OP_9: 89, OP_10: 90, OP_11: 91, OP_12: 92, OP_13: 93, OP_14: 94, OP_15: 95, OP_16: 96, OP_NOP: 97, OP_VER: 98, OP_IF: 99, OP_NOTIF: 100, OP_VERIF: 101, OP_VERNOTIF: 102, OP_ELSE: 103, OP_ENDIF: 104, OP_VERIFY: 105, OP_RETURN: 106, OP_TOALTSTACK: 107, OP_FROMALTSTACK: 108, OP_2DROP: 109, OP_2DUP: 110, OP_3DUP: 111, OP_2OVER: 112, OP_2ROT: 113, OP_2SWAP: 114, OP_IFDUP: 115, OP_DEPTH: 116, OP_DROP: 117, OP_DUP: 118, OP_NIP: 119, OP_OVER: 120, OP_PICK: 121, OP_ROLL: 122, OP_ROT: 123, OP_SWAP: 124, OP_TUCK: 125, OP_CAT: 126, OP_SUBSTR: 127, OP_LEFT: 128, OP_RIGHT: 129, OP_SIZE: 130, OP_INVERT: 131, OP_AND: 132, OP_OR: 133, OP_XOR: 134, OP_EQUAL: 135, OP_EQUALVERIFY: 136, OP_RESERVED1: 137, OP_RESERVED2: 138, OP_1ADD: 139, OP_1SUB: 140, OP_2MUL: 141, OP_2DIV: 142, OP_NEGATE: 143, OP_ABS: 144, OP_NOT: 145, OP_0NOTEQUAL: 146, OP_ADD: 147, OP_SUB: 148, OP_MUL: 149, OP_DIV: 150, OP_MOD: 151, OP_LSHIFT: 152, OP_RSHIFT: 153, OP_BOOLAND: 154, OP_BOOLOR: 155, OP_NUMEQUAL: 156, OP_NUMEQUALVERIFY: 157, OP_NUMNOTEQUAL: 158, OP_LESSTHAN: 159, OP_GREATERTHAN: 160, OP_LESSTHANOREQUAL: 161, OP_GREATERTHANOREQUAL: 162, OP_MIN: 163, OP_MAX: 164, OP_WITHIN: 165, OP_RIPEMD160: 166, OP_SHA1: 167, OP_SHA256: 168, OP_HASH160: 169, OP_HASH256: 170, OP_CODESEPARATOR: 171, OP_CHECKSIG: 172, OP_CHECKSIGVERIFY: 173, OP_CHECKMULTISIG: 174, OP_CHECKMULTISIGVERIFY: 175, OP_NOP1: 176, OP_NOP2: 177, OP_CHECKLOCKTIMEVERIFY: 177, OP_NOP3: 178, OP_CHECKSEQUENCEVERIFY: 178, OP_NOP4: 179, OP_NOP5: 180, OP_NOP6: 181, OP_NOP7: 182, OP_NOP8: 183, OP_NOP9: 184, OP_NOP10: 185, OP_CHECKSIGADD: 186, OP_PUBKEYHASH: 253, OP_PUBKEY: 254, OP_INVALIDOPCODE: 255 };
  _e.OPS = r;
  const T = {};
  _e.REVERSE_OPS = T;
  for (const l of Object.keys(r)) {
    const n = r[l];
    T[n] = l;
  }
  return _e;
}
var le = {}, Tt;
function pr() {
  if (Tt) return le;
  Tt = 1, Object.defineProperty(le, "__esModule", { value: true }), le.decode = le.encode = le.encodingLength = void 0;
  const r = yt();
  function T(f) {
    return f < r.OPS.OP_PUSHDATA1 ? 1 : f <= 255 ? 2 : f <= 65535 ? 3 : 5;
  }
  le.encodingLength = T;
  function l(f, w, p) {
    const g = T(w);
    return g === 1 ? f.writeUInt8(w, p) : g === 2 ? (f.writeUInt8(r.OPS.OP_PUSHDATA1, p), f.writeUInt8(w, p + 1)) : g === 3 ? (f.writeUInt8(r.OPS.OP_PUSHDATA2, p), f.writeUInt16LE(w, p + 1)) : (f.writeUInt8(r.OPS.OP_PUSHDATA4, p), f.writeUInt32LE(w, p + 1)), g;
  }
  le.encode = l;
  function n(f, w) {
    const p = f.readUInt8(w);
    let g, a;
    if (p < r.OPS.OP_PUSHDATA1) g = p, a = 1;
    else if (p === r.OPS.OP_PUSHDATA1) {
      if (w + 2 > f.length) return null;
      g = f.readUInt8(w + 1), a = 2;
    } else if (p === r.OPS.OP_PUSHDATA2) {
      if (w + 3 > f.length) return null;
      g = f.readUInt16LE(w + 1), a = 3;
    } else {
      if (w + 5 > f.length) return null;
      if (p !== r.OPS.OP_PUSHDATA4) throw new Error("Unexpected opcode");
      g = f.readUInt32LE(w + 1), a = 5;
    }
    return { opcode: p, number: g, size: a };
  }
  return le.decode = n, le;
}
var be = {}, Pt;
function lr() {
  if (Pt) return be;
  Pt = 1, Object.defineProperty(be, "__esModule", { value: true }), be.encode = be.decode = void 0;
  function r(n, f, w) {
    f = f || 4, w = w === void 0 ? true : w;
    const p = n.length;
    if (p === 0) return 0;
    if (p > f) throw new TypeError("Script number overflow");
    if (w && (n[p - 1] & 127) === 0 && (p <= 1 || (n[p - 2] & 128) === 0)) throw new Error("Non-minimally encoded script number");
    if (p === 5) {
      const a = n.readUInt32LE(0), y = n.readUInt8(4);
      return y & 128 ? -((y & -129) * 4294967296 + a) : y * 4294967296 + a;
    }
    let g = 0;
    for (let a = 0; a < p; ++a) g |= n[a] << 8 * a;
    return n[p - 1] & 128 ? -(g & ~(128 << 8 * (p - 1))) : g;
  }
  be.decode = r;
  function T(n) {
    return n > 2147483647 ? 5 : n > 8388607 ? 4 : n > 32767 ? 3 : n > 127 ? 2 : n > 0 ? 1 : 0;
  }
  function l(n) {
    let f = Math.abs(n);
    const w = T(f), p = U.allocUnsafe(w), g = n < 0;
    for (let a = 0; a < w; ++a) p.writeUInt8(f & 255, a), f >>= 8;
    return p[w - 1] & 128 ? p.writeUInt8(g ? 128 : 0, w - 1) : g && (p[w - 1] |= 128), p;
  }
  return be.encode = l, be;
}
var Te = {}, at = {}, Ot;
function re() {
  return Ot || (Ot = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: true }), r.oneOf = r.Null = r.BufferN = r.Function = r.UInt32 = r.UInt8 = r.tuple = r.maybe = r.Hex = r.Buffer = r.String = r.Boolean = r.Array = r.Number = r.Hash256bit = r.Hash160bit = r.Buffer256bit = r.isTaptree = r.isTapleaf = r.TAPLEAF_VERSION_MASK = r.Satoshi = r.isPoint = r.stacksEqual = r.typeforce = void 0;
    const T = dt();
    r.typeforce = er();
    const l = T.Buffer.alloc(32, 0), n = T.Buffer.from("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f", "hex");
    function f(s, c) {
      return s.length !== c.length ? false : s.every((b, o) => b.equals(c[o]));
    }
    r.stacksEqual = f;
    function w(s) {
      if (!T.Buffer.isBuffer(s) || s.length < 33) return false;
      const c = s[0], b = s.slice(1, 33);
      if (b.compare(l) === 0 || b.compare(n) >= 0) return false;
      if ((c === 2 || c === 3) && s.length === 33) return true;
      const o = s.slice(33);
      return o.compare(l) === 0 || o.compare(n) >= 0 ? false : c === 4 && s.length === 65;
    }
    r.isPoint = w;
    const p = 21 * 1e14;
    function g(s) {
      return r.typeforce.UInt53(s) && s <= p;
    }
    r.Satoshi = g, r.TAPLEAF_VERSION_MASK = 254;
    function a(s) {
      return !s || !("output" in s) || !T.Buffer.isBuffer(s.output) ? false : s.version !== void 0 ? (s.version & r.TAPLEAF_VERSION_MASK) === s.version : true;
    }
    r.isTapleaf = a;
    function y(s) {
      return (0, r.Array)(s) ? s.length !== 2 ? false : s.every((c) => y(c)) : a(s);
    }
    r.isTaptree = y, r.Buffer256bit = r.typeforce.BufferN(32), r.Hash160bit = r.typeforce.BufferN(20), r.Hash256bit = r.typeforce.BufferN(32), r.Number = r.typeforce.Number, r.Array = r.typeforce.Array, r.Boolean = r.typeforce.Boolean, r.String = r.typeforce.String, r.Buffer = r.typeforce.Buffer, r.Hex = r.typeforce.Hex, r.maybe = r.typeforce.maybe, r.tuple = r.typeforce.tuple, r.UInt8 = r.typeforce.UInt8, r.UInt32 = r.typeforce.UInt32, r.Function = r.typeforce.Function, r.BufferN = r.typeforce.BufferN, r.Null = r.typeforce.Null, r.oneOf = r.typeforce.oneOf;
  })(at)), at;
}
var vt;
function dr() {
  if (vt) return Te;
  vt = 1, Object.defineProperty(Te, "__esModule", { value: true }), Te.encode = Te.decode = void 0;
  const r = Jt(), T = ie(), l = re(), { typeforce: n } = l, f = U.alloc(1, 0);
  function w(y) {
    let s = 0;
    for (; y[s] === 0; ) ++s;
    return s === y.length ? f : (y = y.slice(s), y[0] & 128 ? U.concat([f, y], 1 + y.length) : y);
  }
  function p(y) {
    y[0] === 0 && (y = y.slice(1));
    const s = U.alloc(32, 0), c = Math.max(0, 32 - y.length);
    return y.copy(s, c), s;
  }
  function g(y) {
    const s = y.readUInt8(y.length - 1);
    if (!(0, T.isDefinedHashType)(s)) throw new Error("Invalid hashType " + s);
    const c = r.decode(y.slice(0, -1)), b = p(c.r), o = p(c.s);
    return { signature: U.concat([b, o], 64), hashType: s };
  }
  Te.decode = g;
  function a(y, s) {
    if (n({ signature: l.BufferN(64), hashType: l.UInt8 }, { signature: y, hashType: s }), !(0, T.isDefinedHashType)(s)) throw new Error("Invalid hashType " + s);
    const c = U.allocUnsafe(1);
    c.writeUInt8(s, 0);
    const b = w(y.slice(0, 32)), o = w(y.slice(32, 64));
    return U.concat([r.encode(b, o), c]);
  }
  return Te.encode = a, Te;
}
var At;
function ie() {
  return At || (At = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: true }), r.signature = r.number = r.isCanonicalScriptSignature = r.isDefinedHashType = r.isCanonicalPubKey = r.toStack = r.fromASM = r.toASM = r.decompile = r.compile = r.countNonPushOnlyOPs = r.isPushOnly = r.OPS = void 0;
    const T = Jt(), l = yt();
    Object.defineProperty(r, "OPS", { enumerable: true, get: function() {
      return l.OPS;
    } });
    const n = pr(), f = lr(), w = dr(), p = re(), { typeforce: g } = p, a = l.OPS.OP_RESERVED;
    function y(B) {
      return p.Number(B) && (B === l.OPS.OP_0 || B >= l.OPS.OP_1 && B <= l.OPS.OP_16 || B === l.OPS.OP_1NEGATE);
    }
    function s(B) {
      return p.Buffer(B) || y(B);
    }
    function c(B) {
      return p.Array(B) && B.every(s);
    }
    r.isPushOnly = c;
    function b(B) {
      return B.length - B.filter(s).length;
    }
    r.countNonPushOnlyOPs = b;
    function o(B) {
      if (B.length === 0) return l.OPS.OP_0;
      if (B.length === 1) {
        if (B[0] >= 1 && B[0] <= 16) return a + B[0];
        if (B[0] === 129) return l.OPS.OP_1NEGATE;
      }
    }
    function _(B) {
      return U.isBuffer(B);
    }
    function h(B) {
      return p.Array(B);
    }
    function I(B) {
      return U.isBuffer(B);
    }
    function S(B) {
      if (_(B)) return B;
      g(p.Array, B);
      const q = B.reduce((D, x) => I(x) ? x.length === 1 && o(x) !== void 0 ? D + 1 : D + n.encodingLength(x.length) + x.length : D + 1, 0), M = U.allocUnsafe(q);
      let G = 0;
      if (B.forEach((D) => {
        if (I(D)) {
          const x = o(D);
          if (x !== void 0) {
            M.writeUInt8(x, G), G += 1;
            return;
          }
          G += n.encode(M, D.length, G), D.copy(M, G), G += D.length;
        } else M.writeUInt8(D, G), G += 1;
      }), G !== M.length) throw new Error("Could not decode chunks");
      return M;
    }
    r.compile = S;
    function A(B) {
      if (h(B)) return B;
      g(p.Buffer, B);
      const q = [];
      let M = 0;
      for (; M < B.length; ) {
        const G = B[M];
        if (G > l.OPS.OP_0 && G <= l.OPS.OP_PUSHDATA4) {
          const D = n.decode(B, M);
          if (D === null || (M += D.size, M + D.number > B.length)) return null;
          const x = B.slice(M, M + D.number);
          M += D.number;
          const se = o(x);
          se !== void 0 ? q.push(se) : q.push(x);
        } else q.push(G), M += 1;
      }
      return q;
    }
    r.decompile = A;
    function E(B) {
      if (_(B) && (B = A(B)), !B) throw new Error("Could not convert invalid chunks to ASM");
      return B.map((q) => {
        if (I(q)) {
          const M = o(q);
          if (M === void 0) return q.toString("hex");
          q = M;
        }
        return l.REVERSE_OPS[q];
      }).join(" ");
    }
    r.toASM = E;
    function m(B) {
      return g(p.String, B), S(B.split(" ").map((q) => l.OPS[q] !== void 0 ? l.OPS[q] : (g(p.Hex, q), U.from(q, "hex"))));
    }
    r.fromASM = m;
    function H(B) {
      return B = A(B), g(c, B), B.map((q) => I(q) ? q : q === l.OPS.OP_0 ? U.allocUnsafe(0) : f.encode(q - a));
    }
    r.toStack = H;
    function k(B) {
      return p.isPoint(B);
    }
    r.isCanonicalPubKey = k;
    function C(B) {
      const q = B & -129;
      return q > 0 && q < 4;
    }
    r.isDefinedHashType = C;
    function X(B) {
      return !U.isBuffer(B) || !C(B[B.length - 1]) ? false : T.check(B.slice(0, -1));
    }
    r.isCanonicalScriptSignature = X, r.number = f, r.signature = w;
  })(ft)), ft;
}
var Pe = {}, It;
function ye() {
  if (It) return Pe;
  It = 1, Object.defineProperty(Pe, "__esModule", { value: true }), Pe.value = Pe.prop = void 0;
  function r(l, n, f) {
    Object.defineProperty(l, n, { configurable: true, enumerable: true, get() {
      const w = f.call(this);
      return this[n] = w, w;
    }, set(w) {
      Object.defineProperty(this, n, { configurable: true, enumerable: true, value: w, writable: true });
    } });
  }
  Pe.prop = r;
  function T(l) {
    let n;
    return () => (n !== void 0 || (n = l()), n);
  }
  return Pe.value = T, Pe;
}
var kt;
function wr() {
  if (kt) return Ce;
  kt = 1, Object.defineProperty(Ce, "__esModule", { value: true }), Ce.p2data = void 0;
  const r = fe(), T = ie(), l = re(), n = ye(), f = T.OPS;
  function w(p, g) {
    if (!p.data && !p.output) throw new TypeError("Not enough data");
    g = Object.assign({ validate: true }, g || {}), (0, l.typeforce)({ network: l.typeforce.maybe(l.typeforce.Object), output: l.typeforce.maybe(l.typeforce.Buffer), data: l.typeforce.maybe(l.typeforce.arrayOf(l.typeforce.Buffer)) }, p);
    const y = { name: "embed", network: p.network || r.bitcoin };
    if (n.prop(y, "output", () => {
      if (p.data) return T.compile([f.OP_RETURN].concat(p.data));
    }), n.prop(y, "data", () => {
      if (p.output) return T.decompile(p.output).slice(1);
    }), g.validate && p.output) {
      const s = T.decompile(p.output);
      if (s[0] !== f.OP_RETURN) throw new TypeError("Output is invalid");
      if (!s.slice(1).every(l.typeforce.Buffer)) throw new TypeError("Output is invalid");
      if (p.data && !(0, l.stacksEqual)(p.data, y.data)) throw new TypeError("Data mismatch");
    }
    return Object.assign(y, p);
  }
  return Ce.p2data = w, Ce;
}
var Fe = {}, Ht;
function yr() {
  if (Ht) return Fe;
  Ht = 1, Object.defineProperty(Fe, "__esModule", { value: true }), Fe.p2ms = void 0;
  const r = fe(), T = ie(), l = re(), n = ye(), f = T.OPS, w = f.OP_RESERVED;
  function p(g, a) {
    if (!g.input && !g.output && !(g.pubkeys && g.m !== void 0) && !g.signatures) throw new TypeError("Not enough data");
    a = Object.assign({ validate: true }, a || {});
    function y(h) {
      return T.isCanonicalScriptSignature(h) || (a.allowIncomplete && h === f.OP_0) !== void 0;
    }
    (0, l.typeforce)({ network: l.typeforce.maybe(l.typeforce.Object), m: l.typeforce.maybe(l.typeforce.Number), n: l.typeforce.maybe(l.typeforce.Number), output: l.typeforce.maybe(l.typeforce.Buffer), pubkeys: l.typeforce.maybe(l.typeforce.arrayOf(l.isPoint)), signatures: l.typeforce.maybe(l.typeforce.arrayOf(y)), input: l.typeforce.maybe(l.typeforce.Buffer) }, g);
    const c = { network: g.network || r.bitcoin };
    let b = [], o = false;
    function _(h) {
      o || (o = true, b = T.decompile(h), c.m = b[0] - w, c.n = b[b.length - 2] - w, c.pubkeys = b.slice(1, -2));
    }
    if (n.prop(c, "output", () => {
      if (g.m && c.n && g.pubkeys) return T.compile([].concat(w + g.m, g.pubkeys, w + c.n, f.OP_CHECKMULTISIG));
    }), n.prop(c, "m", () => {
      if (c.output) return _(c.output), c.m;
    }), n.prop(c, "n", () => {
      if (c.pubkeys) return c.pubkeys.length;
    }), n.prop(c, "pubkeys", () => {
      if (g.output) return _(g.output), c.pubkeys;
    }), n.prop(c, "signatures", () => {
      if (g.input) return T.decompile(g.input).slice(1);
    }), n.prop(c, "input", () => {
      if (g.signatures) return T.compile([f.OP_0].concat(g.signatures));
    }), n.prop(c, "witness", () => {
      if (c.input) return [];
    }), n.prop(c, "name", () => {
      if (!(!c.m || !c.n)) return `p2ms(${c.m} of ${c.n})`;
    }), a.validate) {
      if (g.output) {
        if (_(g.output), !l.typeforce.Number(b[0])) throw new TypeError("Output is invalid");
        if (!l.typeforce.Number(b[b.length - 2])) throw new TypeError("Output is invalid");
        if (b[b.length - 1] !== f.OP_CHECKMULTISIG) throw new TypeError("Output is invalid");
        if (c.m <= 0 || c.n > 16 || c.m > c.n || c.n !== b.length - 3) throw new TypeError("Output is invalid");
        if (!c.pubkeys.every((h) => (0, l.isPoint)(h))) throw new TypeError("Output is invalid");
        if (g.m !== void 0 && g.m !== c.m) throw new TypeError("m mismatch");
        if (g.n !== void 0 && g.n !== c.n) throw new TypeError("n mismatch");
        if (g.pubkeys && !(0, l.stacksEqual)(g.pubkeys, c.pubkeys)) throw new TypeError("Pubkeys mismatch");
      }
      if (g.pubkeys) {
        if (g.n !== void 0 && g.n !== g.pubkeys.length) throw new TypeError("Pubkey count mismatch");
        if (c.n = g.pubkeys.length, c.n < c.m) throw new TypeError("Pubkey count cannot be less than m");
      }
      if (g.signatures) {
        if (g.signatures.length < c.m) throw new TypeError("Not enough signatures provided");
        if (g.signatures.length > c.m) throw new TypeError("Too many signatures provided");
      }
      if (g.input) {
        if (g.input[0] !== f.OP_0) throw new TypeError("Input is invalid");
        if (c.signatures.length === 0 || !c.signatures.every(y)) throw new TypeError("Input has invalid signature(s)");
        if (g.signatures && !(0, l.stacksEqual)(g.signatures, c.signatures)) throw new TypeError("Signature mismatch");
        if (g.m !== void 0 && g.m !== g.signatures.length) throw new TypeError("Signature count mismatch");
      }
    }
    return Object.assign(c, g);
  }
  return Fe.p2ms = p, Fe;
}
var Le = {}, Nt;
function gr() {
  if (Nt) return Le;
  Nt = 1, Object.defineProperty(Le, "__esModule", { value: true }), Le.p2pk = void 0;
  const r = fe(), T = ie(), l = re(), n = ye(), f = T.OPS;
  function w(p, g) {
    if (!p.input && !p.output && !p.pubkey && !p.input && !p.signature) throw new TypeError("Not enough data");
    g = Object.assign({ validate: true }, g || {}), (0, l.typeforce)({ network: l.typeforce.maybe(l.typeforce.Object), output: l.typeforce.maybe(l.typeforce.Buffer), pubkey: l.typeforce.maybe(l.isPoint), signature: l.typeforce.maybe(T.isCanonicalScriptSignature), input: l.typeforce.maybe(l.typeforce.Buffer) }, p);
    const a = n.value(() => T.decompile(p.input)), s = { name: "p2pk", network: p.network || r.bitcoin };
    if (n.prop(s, "output", () => {
      if (p.pubkey) return T.compile([p.pubkey, f.OP_CHECKSIG]);
    }), n.prop(s, "pubkey", () => {
      if (p.output) return p.output.slice(1, -1);
    }), n.prop(s, "signature", () => {
      if (p.input) return a()[0];
    }), n.prop(s, "input", () => {
      if (p.signature) return T.compile([p.signature]);
    }), n.prop(s, "witness", () => {
      if (s.input) return [];
    }), g.validate) {
      if (p.output) {
        if (p.output[p.output.length - 1] !== f.OP_CHECKSIG) throw new TypeError("Output is invalid");
        if (!(0, l.isPoint)(s.pubkey)) throw new TypeError("Output pubkey is invalid");
        if (p.pubkey && !p.pubkey.equals(s.pubkey)) throw new TypeError("Pubkey mismatch");
      }
      if (p.signature && p.input && !p.input.equals(s.input)) throw new TypeError("Signature mismatch");
      if (p.input) {
        if (a().length !== 1) throw new TypeError("Input is invalid");
        if (!T.isCanonicalScriptSignature(s.signature)) throw new TypeError("Input has invalid signature");
      }
    }
    return Object.assign(s, p);
  }
  return Le.p2pk = w, Le;
}
var We = {}, ht = {}, Ut;
function de() {
  return Ut || (Ut = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: true }), r.taggedHash = r.TAGGED_HASH_PREFIXES = r.TAGS = r.hash256 = r.hash160 = r.sha256 = r.sha1 = r.ripemd160 = void 0;
    const T = tr(), l = rr(), n = nr();
    function f(s) {
      return U.from((0, T.ripemd160)(Uint8Array.from(s)));
    }
    r.ripemd160 = f;
    function w(s) {
      return U.from((0, l.sha1)(Uint8Array.from(s)));
    }
    r.sha1 = w;
    function p(s) {
      return U.from((0, n.sha256)(Uint8Array.from(s)));
    }
    r.sha256 = p;
    function g(s) {
      return U.from((0, T.ripemd160)((0, n.sha256)(Uint8Array.from(s))));
    }
    r.hash160 = g;
    function a(s) {
      return U.from((0, n.sha256)((0, n.sha256)(Uint8Array.from(s))));
    }
    r.hash256 = a, r.TAGS = ["BIP0340/challenge", "BIP0340/aux", "BIP0340/nonce", "TapLeaf", "TapBranch", "TapSighash", "TapTweak", "KeyAgg list", "KeyAgg coefficient"], r.TAGGED_HASH_PREFIXES = { "BIP0340/challenge": U.from([123, 181, 45, 122, 159, 239, 88, 50, 62, 177, 191, 122, 64, 125, 179, 130, 210, 243, 242, 216, 27, 177, 34, 79, 73, 254, 81, 143, 109, 72, 211, 124, 123, 181, 45, 122, 159, 239, 88, 50, 62, 177, 191, 122, 64, 125, 179, 130, 210, 243, 242, 216, 27, 177, 34, 79, 73, 254, 81, 143, 109, 72, 211, 124]), "BIP0340/aux": U.from([241, 239, 78, 94, 192, 99, 202, 218, 109, 148, 202, 250, 157, 152, 126, 160, 105, 38, 88, 57, 236, 193, 31, 151, 45, 119, 165, 46, 216, 193, 204, 144, 241, 239, 78, 94, 192, 99, 202, 218, 109, 148, 202, 250, 157, 152, 126, 160, 105, 38, 88, 57, 236, 193, 31, 151, 45, 119, 165, 46, 216, 193, 204, 144]), "BIP0340/nonce": U.from([7, 73, 119, 52, 167, 155, 203, 53, 91, 155, 140, 125, 3, 79, 18, 28, 244, 52, 215, 62, 247, 45, 218, 25, 135, 0, 97, 251, 82, 191, 235, 47, 7, 73, 119, 52, 167, 155, 203, 53, 91, 155, 140, 125, 3, 79, 18, 28, 244, 52, 215, 62, 247, 45, 218, 25, 135, 0, 97, 251, 82, 191, 235, 47]), TapLeaf: U.from([174, 234, 143, 220, 66, 8, 152, 49, 5, 115, 75, 88, 8, 29, 30, 38, 56, 211, 95, 28, 181, 64, 8, 212, 211, 87, 202, 3, 190, 120, 233, 238, 174, 234, 143, 220, 66, 8, 152, 49, 5, 115, 75, 88, 8, 29, 30, 38, 56, 211, 95, 28, 181, 64, 8, 212, 211, 87, 202, 3, 190, 120, 233, 238]), TapBranch: U.from([25, 65, 161, 242, 229, 110, 185, 95, 162, 169, 241, 148, 190, 92, 1, 247, 33, 111, 51, 237, 130, 176, 145, 70, 52, 144, 208, 91, 245, 22, 160, 21, 25, 65, 161, 242, 229, 110, 185, 95, 162, 169, 241, 148, 190, 92, 1, 247, 33, 111, 51, 237, 130, 176, 145, 70, 52, 144, 208, 91, 245, 22, 160, 21]), TapSighash: U.from([244, 10, 72, 223, 75, 42, 112, 200, 180, 146, 75, 242, 101, 70, 97, 237, 61, 149, 253, 102, 163, 19, 235, 135, 35, 117, 151, 198, 40, 228, 160, 49, 244, 10, 72, 223, 75, 42, 112, 200, 180, 146, 75, 242, 101, 70, 97, 237, 61, 149, 253, 102, 163, 19, 235, 135, 35, 117, 151, 198, 40, 228, 160, 49]), TapTweak: U.from([232, 15, 225, 99, 156, 156, 160, 80, 227, 175, 27, 57, 193, 67, 198, 62, 66, 156, 188, 235, 21, 217, 64, 251, 181, 197, 161, 244, 175, 87, 197, 233, 232, 15, 225, 99, 156, 156, 160, 80, 227, 175, 27, 57, 193, 67, 198, 62, 66, 156, 188, 235, 21, 217, 64, 251, 181, 197, 161, 244, 175, 87, 197, 233]), "KeyAgg list": U.from([72, 28, 151, 28, 60, 11, 70, 215, 240, 178, 117, 174, 89, 141, 78, 44, 126, 215, 49, 156, 89, 74, 92, 110, 199, 158, 160, 212, 153, 2, 148, 240, 72, 28, 151, 28, 60, 11, 70, 215, 240, 178, 117, 174, 89, 141, 78, 44, 126, 215, 49, 156, 89, 74, 92, 110, 199, 158, 160, 212, 153, 2, 148, 240]), "KeyAgg coefficient": U.from([191, 201, 4, 3, 77, 28, 136, 232, 200, 14, 34, 229, 61, 36, 86, 109, 100, 130, 78, 214, 66, 114, 129, 192, 145, 0, 249, 77, 205, 82, 201, 129, 191, 201, 4, 3, 77, 28, 136, 232, 200, 14, 34, 229, 61, 36, 86, 109, 100, 130, 78, 214, 66, 114, 129, 192, 145, 0, 249, 77, 205, 82, 201, 129]) };
    function y(s, c) {
      return p(U.concat([r.TAGGED_HASH_PREFIXES[s], c]));
    }
    r.taggedHash = y;
  })(ht)), ht;
}
var Bt;
function mr() {
  if (Bt) return We;
  Bt = 1, Object.defineProperty(We, "__esModule", { value: true }), We.p2pkh = void 0;
  const r = de(), T = fe(), l = ie(), n = re(), f = ye(), w = wt(), p = l.OPS;
  function g(a, y) {
    if (!a.address && !a.hash && !a.output && !a.pubkey && !a.input) throw new TypeError("Not enough data");
    y = Object.assign({ validate: true }, y || {}), (0, n.typeforce)({ network: n.typeforce.maybe(n.typeforce.Object), address: n.typeforce.maybe(n.typeforce.String), hash: n.typeforce.maybe(n.typeforce.BufferN(20)), output: n.typeforce.maybe(n.typeforce.BufferN(25)), pubkey: n.typeforce.maybe(n.isPoint), signature: n.typeforce.maybe(l.isCanonicalScriptSignature), input: n.typeforce.maybe(n.typeforce.Buffer) }, a);
    const s = f.value(() => {
      const _ = U.from(w.decode(a.address)), h = _.readUInt8(0), I = _.slice(1);
      return { version: h, hash: I };
    }), c = f.value(() => l.decompile(a.input)), b = a.network || T.bitcoin, o = { name: "p2pkh", network: b };
    if (f.prop(o, "address", () => {
      if (!o.hash) return;
      const _ = U.allocUnsafe(21);
      return _.writeUInt8(b.pubKeyHash, 0), o.hash.copy(_, 1), w.encode(_);
    }), f.prop(o, "hash", () => {
      if (a.output) return a.output.slice(3, 23);
      if (a.address) return s().hash;
      if (a.pubkey || o.pubkey) return r.hash160(a.pubkey || o.pubkey);
    }), f.prop(o, "output", () => {
      if (o.hash) return l.compile([p.OP_DUP, p.OP_HASH160, o.hash, p.OP_EQUALVERIFY, p.OP_CHECKSIG]);
    }), f.prop(o, "pubkey", () => {
      if (a.input) return c()[1];
    }), f.prop(o, "signature", () => {
      if (a.input) return c()[0];
    }), f.prop(o, "input", () => {
      if (a.pubkey && a.signature) return l.compile([a.signature, a.pubkey]);
    }), f.prop(o, "witness", () => {
      if (o.input) return [];
    }), y.validate) {
      let _ = U.from([]);
      if (a.address) {
        if (s().version !== b.pubKeyHash) throw new TypeError("Invalid version or Network mismatch");
        if (s().hash.length !== 20) throw new TypeError("Invalid address");
        _ = s().hash;
      }
      if (a.hash) {
        if (_.length > 0 && !_.equals(a.hash)) throw new TypeError("Hash mismatch");
        _ = a.hash;
      }
      if (a.output) {
        if (a.output.length !== 25 || a.output[0] !== p.OP_DUP || a.output[1] !== p.OP_HASH160 || a.output[2] !== 20 || a.output[23] !== p.OP_EQUALVERIFY || a.output[24] !== p.OP_CHECKSIG) throw new TypeError("Output is invalid");
        const h = a.output.slice(3, 23);
        if (_.length > 0 && !_.equals(h)) throw new TypeError("Hash mismatch");
        _ = h;
      }
      if (a.pubkey) {
        const h = r.hash160(a.pubkey);
        if (_.length > 0 && !_.equals(h)) throw new TypeError("Hash mismatch");
        _ = h;
      }
      if (a.input) {
        const h = c();
        if (h.length !== 2) throw new TypeError("Input is invalid");
        if (!l.isCanonicalScriptSignature(h[0])) throw new TypeError("Input has invalid signature");
        if (!(0, n.isPoint)(h[1])) throw new TypeError("Input has invalid pubkey");
        if (a.signature && !a.signature.equals(h[0])) throw new TypeError("Signature mismatch");
        if (a.pubkey && !a.pubkey.equals(h[1])) throw new TypeError("Pubkey mismatch");
        const I = r.hash160(h[1]);
        if (_.length > 0 && !_.equals(I)) throw new TypeError("Hash mismatch");
      }
    }
    return Object.assign(o, a);
  }
  return We.p2pkh = g, We;
}
var qe = {}, Rt;
function Sr() {
  if (Rt) return qe;
  Rt = 1, Object.defineProperty(qe, "__esModule", { value: true }), qe.p2sh = void 0;
  const r = de(), T = fe(), l = ie(), n = re(), f = ye(), w = wt(), p = l.OPS;
  function g(a, y) {
    if (!a.address && !a.hash && !a.output && !a.redeem && !a.input) throw new TypeError("Not enough data");
    y = Object.assign({ validate: true }, y || {}), (0, n.typeforce)({ network: n.typeforce.maybe(n.typeforce.Object), address: n.typeforce.maybe(n.typeforce.String), hash: n.typeforce.maybe(n.typeforce.BufferN(20)), output: n.typeforce.maybe(n.typeforce.BufferN(23)), redeem: n.typeforce.maybe({ network: n.typeforce.maybe(n.typeforce.Object), output: n.typeforce.maybe(n.typeforce.Buffer), input: n.typeforce.maybe(n.typeforce.Buffer), witness: n.typeforce.maybe(n.typeforce.arrayOf(n.typeforce.Buffer)) }), input: n.typeforce.maybe(n.typeforce.Buffer), witness: n.typeforce.maybe(n.typeforce.arrayOf(n.typeforce.Buffer)) }, a);
    let s = a.network;
    s || (s = a.redeem && a.redeem.network || T.bitcoin);
    const c = { network: s }, b = f.value(() => {
      const h = U.from(w.decode(a.address)), I = h.readUInt8(0), S = h.slice(1);
      return { version: I, hash: S };
    }), o = f.value(() => l.decompile(a.input)), _ = f.value(() => {
      const h = o(), I = h[h.length - 1];
      return { network: s, output: I === p.OP_FALSE ? U.from([]) : I, input: l.compile(h.slice(0, -1)), witness: a.witness || [] };
    });
    if (f.prop(c, "address", () => {
      if (!c.hash) return;
      const h = U.allocUnsafe(21);
      return h.writeUInt8(c.network.scriptHash, 0), c.hash.copy(h, 1), w.encode(h);
    }), f.prop(c, "hash", () => {
      if (a.output) return a.output.slice(2, 22);
      if (a.address) return b().hash;
      if (c.redeem && c.redeem.output) return r.hash160(c.redeem.output);
    }), f.prop(c, "output", () => {
      if (c.hash) return l.compile([p.OP_HASH160, c.hash, p.OP_EQUAL]);
    }), f.prop(c, "redeem", () => {
      if (a.input) return _();
    }), f.prop(c, "input", () => {
      if (!(!a.redeem || !a.redeem.input || !a.redeem.output)) return l.compile([].concat(l.decompile(a.redeem.input), a.redeem.output));
    }), f.prop(c, "witness", () => {
      if (c.redeem && c.redeem.witness) return c.redeem.witness;
      if (c.input) return [];
    }), f.prop(c, "name", () => {
      const h = ["p2sh"];
      return c.redeem !== void 0 && c.redeem.name !== void 0 && h.push(c.redeem.name), h.join("-");
    }), y.validate) {
      let h = U.from([]);
      if (a.address) {
        if (b().version !== s.scriptHash) throw new TypeError("Invalid version or Network mismatch");
        if (b().hash.length !== 20) throw new TypeError("Invalid address");
        h = b().hash;
      }
      if (a.hash) {
        if (h.length > 0 && !h.equals(a.hash)) throw new TypeError("Hash mismatch");
        h = a.hash;
      }
      if (a.output) {
        if (a.output.length !== 23 || a.output[0] !== p.OP_HASH160 || a.output[1] !== 20 || a.output[22] !== p.OP_EQUAL) throw new TypeError("Output is invalid");
        const S = a.output.slice(2, 22);
        if (h.length > 0 && !h.equals(S)) throw new TypeError("Hash mismatch");
        h = S;
      }
      const I = (S) => {
        if (S.output) {
          const A = l.decompile(S.output);
          if (!A || A.length < 1) throw new TypeError("Redeem.output too short");
          if (S.output.byteLength > 520) throw new TypeError("Redeem.output unspendable if larger than 520 bytes");
          if (l.countNonPushOnlyOPs(A) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
          const E = r.hash160(S.output);
          if (h.length > 0 && !h.equals(E)) throw new TypeError("Hash mismatch");
          h = E;
        }
        if (S.input) {
          const A = S.input.length > 0, E = S.witness && S.witness.length > 0;
          if (!A && !E) throw new TypeError("Empty input");
          if (A && E) throw new TypeError("Input and witness provided");
          if (A) {
            const m = l.decompile(S.input);
            if (!l.isPushOnly(m)) throw new TypeError("Non push-only scriptSig");
          }
        }
      };
      if (a.input) {
        const S = o();
        if (!S || S.length < 1) throw new TypeError("Input too short");
        if (!U.isBuffer(_().output)) throw new TypeError("Input is invalid");
        I(_());
      }
      if (a.redeem) {
        if (a.redeem.network && a.redeem.network !== s) throw new TypeError("Network mismatch");
        if (a.input) {
          const S = _();
          if (a.redeem.output && !a.redeem.output.equals(S.output)) throw new TypeError("Redeem.output mismatch");
          if (a.redeem.input && !a.redeem.input.equals(S.input)) throw new TypeError("Redeem.input mismatch");
        }
        I(a.redeem);
      }
      if (a.witness && a.redeem && a.redeem.witness && !(0, n.stacksEqual)(a.redeem.witness, a.witness)) throw new TypeError("Witness and redeem.witness mismatch");
    }
    return Object.assign(c, a);
  }
  return qe.p2sh = g, qe;
}
var Me = {}, Ct;
function Er() {
  if (Ct) return Me;
  Ct = 1, Object.defineProperty(Me, "__esModule", { value: true }), Me.p2wpkh = void 0;
  const r = de(), T = fe(), l = ie(), n = re(), f = ye(), w = Je(), p = l.OPS, g = U.alloc(0);
  function a(y, s) {
    if (!y.address && !y.hash && !y.output && !y.pubkey && !y.witness) throw new TypeError("Not enough data");
    s = Object.assign({ validate: true }, s || {}), (0, n.typeforce)({ address: n.typeforce.maybe(n.typeforce.String), hash: n.typeforce.maybe(n.typeforce.BufferN(20)), input: n.typeforce.maybe(n.typeforce.BufferN(0)), network: n.typeforce.maybe(n.typeforce.Object), output: n.typeforce.maybe(n.typeforce.BufferN(22)), pubkey: n.typeforce.maybe(n.isPoint), signature: n.typeforce.maybe(l.isCanonicalScriptSignature), witness: n.typeforce.maybe(n.typeforce.arrayOf(n.typeforce.Buffer)) }, y);
    const c = f.value(() => {
      const _ = w.bech32.decode(y.address), h = _.words.shift(), I = w.bech32.fromWords(_.words);
      return { version: h, prefix: _.prefix, data: U.from(I) };
    }), b = y.network || T.bitcoin, o = { name: "p2wpkh", network: b };
    if (f.prop(o, "address", () => {
      if (!o.hash) return;
      const _ = w.bech32.toWords(o.hash);
      return _.unshift(0), w.bech32.encode(b.bech32, _);
    }), f.prop(o, "hash", () => {
      if (y.output) return y.output.slice(2, 22);
      if (y.address) return c().data;
      if (y.pubkey || o.pubkey) return r.hash160(y.pubkey || o.pubkey);
    }), f.prop(o, "output", () => {
      if (o.hash) return l.compile([p.OP_0, o.hash]);
    }), f.prop(o, "pubkey", () => {
      if (y.pubkey) return y.pubkey;
      if (y.witness) return y.witness[1];
    }), f.prop(o, "signature", () => {
      if (y.witness) return y.witness[0];
    }), f.prop(o, "input", () => {
      if (o.witness) return g;
    }), f.prop(o, "witness", () => {
      if (y.pubkey && y.signature) return [y.signature, y.pubkey];
    }), s.validate) {
      let _ = U.from([]);
      if (y.address) {
        if (b && b.bech32 !== c().prefix) throw new TypeError("Invalid prefix or Network mismatch");
        if (c().version !== 0) throw new TypeError("Invalid address version");
        if (c().data.length !== 20) throw new TypeError("Invalid address data");
        _ = c().data;
      }
      if (y.hash) {
        if (_.length > 0 && !_.equals(y.hash)) throw new TypeError("Hash mismatch");
        _ = y.hash;
      }
      if (y.output) {
        if (y.output.length !== 22 || y.output[0] !== p.OP_0 || y.output[1] !== 20) throw new TypeError("Output is invalid");
        if (_.length > 0 && !_.equals(y.output.slice(2))) throw new TypeError("Hash mismatch");
        _ = y.output.slice(2);
      }
      if (y.pubkey) {
        const h = r.hash160(y.pubkey);
        if (_.length > 0 && !_.equals(h)) throw new TypeError("Hash mismatch");
        if (_ = h, !(0, n.isPoint)(y.pubkey) || y.pubkey.length !== 33) throw new TypeError("Invalid pubkey for p2wpkh");
      }
      if (y.witness) {
        if (y.witness.length !== 2) throw new TypeError("Witness is invalid");
        if (!l.isCanonicalScriptSignature(y.witness[0])) throw new TypeError("Witness has invalid signature");
        if (!(0, n.isPoint)(y.witness[1]) || y.witness[1].length !== 33) throw new TypeError("Witness has invalid pubkey");
        if (y.signature && !y.signature.equals(y.witness[0])) throw new TypeError("Signature mismatch");
        if (y.pubkey && !y.pubkey.equals(y.witness[1])) throw new TypeError("Pubkey mismatch");
        const h = r.hash160(y.witness[1]);
        if (_.length > 0 && !_.equals(h)) throw new TypeError("Hash mismatch");
      }
    }
    return Object.assign(o, y);
  }
  return Me.p2wpkh = a, Me;
}
var Ve = {}, Ft;
function _r() {
  if (Ft) return Ve;
  Ft = 1, Object.defineProperty(Ve, "__esModule", { value: true }), Ve.p2wsh = void 0;
  const r = de(), T = fe(), l = ie(), n = re(), f = ye(), w = Je(), p = l.OPS, g = U.alloc(0);
  function a(s) {
    return !!(U.isBuffer(s) && s.length === 65 && s[0] === 4 && (0, n.isPoint)(s));
  }
  function y(s, c) {
    if (!s.address && !s.hash && !s.output && !s.redeem && !s.witness) throw new TypeError("Not enough data");
    c = Object.assign({ validate: true }, c || {}), (0, n.typeforce)({ network: n.typeforce.maybe(n.typeforce.Object), address: n.typeforce.maybe(n.typeforce.String), hash: n.typeforce.maybe(n.typeforce.BufferN(32)), output: n.typeforce.maybe(n.typeforce.BufferN(34)), redeem: n.typeforce.maybe({ input: n.typeforce.maybe(n.typeforce.Buffer), network: n.typeforce.maybe(n.typeforce.Object), output: n.typeforce.maybe(n.typeforce.Buffer), witness: n.typeforce.maybe(n.typeforce.arrayOf(n.typeforce.Buffer)) }), input: n.typeforce.maybe(n.typeforce.BufferN(0)), witness: n.typeforce.maybe(n.typeforce.arrayOf(n.typeforce.Buffer)) }, s);
    const b = f.value(() => {
      const I = w.bech32.decode(s.address), S = I.words.shift(), A = w.bech32.fromWords(I.words);
      return { version: S, prefix: I.prefix, data: U.from(A) };
    }), o = f.value(() => l.decompile(s.redeem.input));
    let _ = s.network;
    _ || (_ = s.redeem && s.redeem.network || T.bitcoin);
    const h = { network: _ };
    if (f.prop(h, "address", () => {
      if (!h.hash) return;
      const I = w.bech32.toWords(h.hash);
      return I.unshift(0), w.bech32.encode(_.bech32, I);
    }), f.prop(h, "hash", () => {
      if (s.output) return s.output.slice(2);
      if (s.address) return b().data;
      if (h.redeem && h.redeem.output) return r.sha256(h.redeem.output);
    }), f.prop(h, "output", () => {
      if (h.hash) return l.compile([p.OP_0, h.hash]);
    }), f.prop(h, "redeem", () => {
      if (s.witness) return { output: s.witness[s.witness.length - 1], input: g, witness: s.witness.slice(0, -1) };
    }), f.prop(h, "input", () => {
      if (h.witness) return g;
    }), f.prop(h, "witness", () => {
      if (s.redeem && s.redeem.input && s.redeem.input.length > 0 && s.redeem.output && s.redeem.output.length > 0) {
        const I = l.toStack(o());
        return h.redeem = Object.assign({ witness: I }, s.redeem), h.redeem.input = g, [].concat(I, s.redeem.output);
      }
      if (s.redeem && s.redeem.output && s.redeem.witness) return [].concat(s.redeem.witness, s.redeem.output);
    }), f.prop(h, "name", () => {
      const I = ["p2wsh"];
      return h.redeem !== void 0 && h.redeem.name !== void 0 && I.push(h.redeem.name), I.join("-");
    }), c.validate) {
      let I = U.from([]);
      if (s.address) {
        if (b().prefix !== _.bech32) throw new TypeError("Invalid prefix or Network mismatch");
        if (b().version !== 0) throw new TypeError("Invalid address version");
        if (b().data.length !== 32) throw new TypeError("Invalid address data");
        I = b().data;
      }
      if (s.hash) {
        if (I.length > 0 && !I.equals(s.hash)) throw new TypeError("Hash mismatch");
        I = s.hash;
      }
      if (s.output) {
        if (s.output.length !== 34 || s.output[0] !== p.OP_0 || s.output[1] !== 32) throw new TypeError("Output is invalid");
        const S = s.output.slice(2);
        if (I.length > 0 && !I.equals(S)) throw new TypeError("Hash mismatch");
        I = S;
      }
      if (s.redeem) {
        if (s.redeem.network && s.redeem.network !== _) throw new TypeError("Network mismatch");
        if (s.redeem.input && s.redeem.input.length > 0 && s.redeem.witness && s.redeem.witness.length > 0) throw new TypeError("Ambiguous witness source");
        if (s.redeem.output) {
          const S = l.decompile(s.redeem.output);
          if (!S || S.length < 1) throw new TypeError("Redeem.output is invalid");
          if (s.redeem.output.byteLength > 3600) throw new TypeError("Redeem.output unspendable if larger than 3600 bytes");
          if (l.countNonPushOnlyOPs(S) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
          const A = r.sha256(s.redeem.output);
          if (I.length > 0 && !I.equals(A)) throw new TypeError("Hash mismatch");
          I = A;
        }
        if (s.redeem.input && !l.isPushOnly(o())) throw new TypeError("Non push-only scriptSig");
        if (s.witness && s.redeem.witness && !(0, n.stacksEqual)(s.witness, s.redeem.witness)) throw new TypeError("Witness and redeem.witness mismatch");
        if (s.redeem.input && o().some(a) || s.redeem.output && (l.decompile(s.redeem.output) || []).some(a)) throw new TypeError("redeem.input or redeem.output contains uncompressed pubkey");
      }
      if (s.witness && s.witness.length > 0) {
        const S = s.witness[s.witness.length - 1];
        if (s.redeem && s.redeem.output && !s.redeem.output.equals(S)) throw new TypeError("Witness and redeem.output mismatch");
        if (s.witness.some(a) || (l.decompile(S) || []).some(a)) throw new TypeError("Witness contains uncompressed pubkey");
      }
    }
    return Object.assign(h, s);
  }
  return Ve.p2wsh = y, Ve;
}
var Ke = {}, Oe = {}, Lt;
function gt() {
  if (Lt) return Oe;
  Lt = 1, Object.defineProperty(Oe, "__esModule", { value: true }), Oe.getEccLib = Oe.initEccLib = void 0;
  const r = {};
  function T(g, a) {
    g ? g !== r.eccLib && ((a == null ? void 0 : a.DANGER_DO_NOT_VERIFY_ECCLIB) || f(g), r.eccLib = g) : r.eccLib = g;
  }
  Oe.initEccLib = T;
  function l() {
    if (!r.eccLib) throw new Error("No ECC Library provided. You must call initEccLib() with a valid TinySecp256k1Interface instance");
    return r.eccLib;
  }
  Oe.getEccLib = l;
  const n = (g) => U.from(g, "hex");
  function f(g) {
    w(typeof g.isXOnlyPoint == "function"), w(g.isXOnlyPoint(n("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"))), w(g.isXOnlyPoint(n("fffffffffffffffffffffffffffffffffffffffffffffffffffffffeeffffc2e"))), w(g.isXOnlyPoint(n("f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9"))), w(g.isXOnlyPoint(n("0000000000000000000000000000000000000000000000000000000000000001"))), w(!g.isXOnlyPoint(n("0000000000000000000000000000000000000000000000000000000000000000"))), w(!g.isXOnlyPoint(n("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"))), w(typeof g.xOnlyPointAddTweak == "function"), p.forEach((a) => {
      const y = g.xOnlyPointAddTweak(n(a.pubkey), n(a.tweak));
      a.result === null ? w(y === null) : (w(y !== null), w(y.parity === a.parity), w(U.from(y.xOnlyPubkey).equals(n(a.result))));
    });
  }
  function w(g) {
    if (!g) throw new Error("ecc library invalid");
  }
  const p = [{ pubkey: "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", tweak: "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140", parity: -1, result: null }, { pubkey: "1617d38ed8d8657da4d4761e8057bc396ea9e4b9d29776d4be096016dbd2509b", tweak: "a8397a935f0dfceba6ba9618f6451ef4d80637abf4e6af2669fbc9de6a8fd2ac", parity: 1, result: "e478f99dab91052ab39a33ea35fd5e6e4933f4d28023cd597c9a1f6760346adf" }, { pubkey: "2c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991", tweak: "823c3cd2142744b075a87eade7e1b8678ba308d566226a0056ca2b7a76f86b47", parity: 0, result: "9534f8dc8c6deda2dc007655981c78b49c5d96c778fbf363462a11ec9dfd948c" }];
  return Oe;
}
var pt = {}, ee = {}, Wt;
function $e() {
  if (Wt) return ee;
  Wt = 1, Object.defineProperty(ee, "__esModule", { value: true }), ee.BufferReader = ee.BufferWriter = ee.cloneBuffer = ee.reverseBuffer = ee.writeUInt64LE = ee.readUInt64LE = ee.varuint = void 0;
  const r = re(), { typeforce: T } = r, l = ir();
  ee.varuint = l;
  function n(s, c) {
    if (typeof s != "number") throw new Error("cannot write a non-number as a number");
    if (s < 0) throw new Error("specified a negative value for writing an unsigned value");
    if (s > c) throw new Error("RangeError: value out of range");
    if (Math.floor(s) !== s) throw new Error("value has a fractional component");
  }
  function f(s, c) {
    const b = s.readUInt32LE(c);
    let o = s.readUInt32LE(c + 4);
    return o *= 4294967296, n(o + b, 9007199254740991), o + b;
  }
  ee.readUInt64LE = f;
  function w(s, c, b) {
    return n(c, 9007199254740991), s.writeInt32LE(c & -1, b), s.writeUInt32LE(Math.floor(c / 4294967296), b + 4), b + 8;
  }
  ee.writeUInt64LE = w;
  function p(s) {
    if (s.length < 1) return s;
    let c = s.length - 1, b = 0;
    for (let o = 0; o < s.length / 2; o++) b = s[o], s[o] = s[c], s[c] = b, c--;
    return s;
  }
  ee.reverseBuffer = p;
  function g(s) {
    const c = U.allocUnsafe(s.length);
    return s.copy(c), c;
  }
  ee.cloneBuffer = g;
  class a {
    static withCapacity(c) {
      return new a(U.alloc(c));
    }
    constructor(c, b = 0) {
      this.buffer = c, this.offset = b, T(r.tuple(r.Buffer, r.UInt32), [c, b]);
    }
    writeUInt8(c) {
      this.offset = this.buffer.writeUInt8(c, this.offset);
    }
    writeInt32(c) {
      this.offset = this.buffer.writeInt32LE(c, this.offset);
    }
    writeUInt32(c) {
      this.offset = this.buffer.writeUInt32LE(c, this.offset);
    }
    writeUInt64(c) {
      this.offset = w(this.buffer, c, this.offset);
    }
    writeVarInt(c) {
      l.encode(c, this.buffer, this.offset), this.offset += l.encode.bytes;
    }
    writeSlice(c) {
      if (this.buffer.length < this.offset + c.length) throw new Error("Cannot write slice out of bounds");
      this.offset += c.copy(this.buffer, this.offset);
    }
    writeVarSlice(c) {
      this.writeVarInt(c.length), this.writeSlice(c);
    }
    writeVector(c) {
      this.writeVarInt(c.length), c.forEach((b) => this.writeVarSlice(b));
    }
    end() {
      if (this.buffer.length === this.offset) return this.buffer;
      throw new Error(`buffer size ${this.buffer.length}, offset ${this.offset}`);
    }
  }
  ee.BufferWriter = a;
  class y {
    constructor(c, b = 0) {
      this.buffer = c, this.offset = b, T(r.tuple(r.Buffer, r.UInt32), [c, b]);
    }
    readUInt8() {
      const c = this.buffer.readUInt8(this.offset);
      return this.offset++, c;
    }
    readInt32() {
      const c = this.buffer.readInt32LE(this.offset);
      return this.offset += 4, c;
    }
    readUInt32() {
      const c = this.buffer.readUInt32LE(this.offset);
      return this.offset += 4, c;
    }
    readUInt64() {
      const c = f(this.buffer, this.offset);
      return this.offset += 8, c;
    }
    readVarInt() {
      const c = l.decode(this.buffer, this.offset);
      return this.offset += l.decode.bytes, c;
    }
    readSlice(c) {
      if (this.buffer.length < this.offset + c) throw new Error("Cannot read slice out of bounds");
      const b = this.buffer.slice(this.offset, this.offset + c);
      return this.offset += c, b;
    }
    readVarSlice() {
      return this.readSlice(this.readVarInt());
    }
    readVector() {
      const c = this.readVarInt(), b = [];
      for (let o = 0; o < c; o++) b.push(this.readVarSlice());
      return b;
    }
  }
  return ee.BufferReader = y, ee;
}
var qt;
function mt() {
  return qt || (qt = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: true }), r.tweakKey = r.tapTweakHash = r.tapleafHash = r.findScriptPath = r.toHashTree = r.rootHashFromPath = r.MAX_TAPTREE_DEPTH = r.LEAF_VERSION_TAPSCRIPT = void 0;
    const T = dt(), l = gt(), n = de(), f = $e(), w = re();
    r.LEAF_VERSION_TAPSCRIPT = 192, r.MAX_TAPTREE_DEPTH = 128;
    const p = (h) => "left" in h && "right" in h;
    function g(h, I) {
      if (h.length < 33) throw new TypeError(`The control-block length is too small. Got ${h.length}, expected min 33.`);
      const S = (h.length - 33) / 32;
      let A = I;
      for (let E = 0; E < S; E++) {
        const m = h.slice(33 + 32 * E, 65 + 32 * E);
        A.compare(m) < 0 ? A = o(A, m) : A = o(m, A);
      }
      return A;
    }
    r.rootHashFromPath = g;
    function a(h) {
      if ((0, w.isTapleaf)(h)) return { hash: s(h) };
      const I = [a(h[0]), a(h[1])];
      I.sort((E, m) => E.hash.compare(m.hash));
      const [S, A] = I;
      return { hash: o(S.hash, A.hash), left: S, right: A };
    }
    r.toHashTree = a;
    function y(h, I) {
      if (p(h)) {
        const S = y(h.left, I);
        if (S !== void 0) return [...S, h.right.hash];
        const A = y(h.right, I);
        if (A !== void 0) return [...A, h.left.hash];
      } else if (h.hash.equals(I)) return [];
    }
    r.findScriptPath = y;
    function s(h) {
      const I = h.version || r.LEAF_VERSION_TAPSCRIPT;
      return n.taggedHash("TapLeaf", T.Buffer.concat([T.Buffer.from([I]), _(h.output)]));
    }
    r.tapleafHash = s;
    function c(h, I) {
      return n.taggedHash("TapTweak", T.Buffer.concat(I ? [h, I] : [h]));
    }
    r.tapTweakHash = c;
    function b(h, I) {
      if (!T.Buffer.isBuffer(h) || h.length !== 32 || I && I.length !== 32) return null;
      const S = c(h, I), A = (0, l.getEccLib)().xOnlyPointAddTweak(h, S);
      return !A || A.xOnlyPubkey === null ? null : { parity: A.parity, x: T.Buffer.from(A.xOnlyPubkey) };
    }
    r.tweakKey = b;
    function o(h, I) {
      return n.taggedHash("TapBranch", T.Buffer.concat([h, I]));
    }
    function _(h) {
      const I = f.varuint.encodingLength(h.length), S = T.Buffer.allocUnsafe(I);
      return f.varuint.encode(h.length, S), T.Buffer.concat([S, h]);
    }
  })(pt)), pt;
}
var Mt;
function br() {
  if (Mt) return Ke;
  Mt = 1, Object.defineProperty(Ke, "__esModule", { value: true }), Ke.p2tr = void 0;
  const r = dt(), T = fe(), l = ie(), n = re(), f = gt(), w = mt(), p = ye(), g = Je(), a = St(), y = l.OPS, s = 1, c = 80;
  function b(o, _) {
    if (!o.address && !o.output && !o.pubkey && !o.internalPubkey && !(o.witness && o.witness.length > 1)) throw new TypeError("Not enough data");
    _ = Object.assign({ validate: true }, _ || {}), (0, n.typeforce)({ address: n.typeforce.maybe(n.typeforce.String), input: n.typeforce.maybe(n.typeforce.BufferN(0)), network: n.typeforce.maybe(n.typeforce.Object), output: n.typeforce.maybe(n.typeforce.BufferN(34)), internalPubkey: n.typeforce.maybe(n.typeforce.BufferN(32)), hash: n.typeforce.maybe(n.typeforce.BufferN(32)), pubkey: n.typeforce.maybe(n.typeforce.BufferN(32)), signature: n.typeforce.maybe(n.typeforce.anyOf(n.typeforce.BufferN(64), n.typeforce.BufferN(65))), witness: n.typeforce.maybe(n.typeforce.arrayOf(n.typeforce.Buffer)), scriptTree: n.typeforce.maybe(n.isTaptree), redeem: n.typeforce.maybe({ output: n.typeforce.maybe(n.typeforce.Buffer), redeemVersion: n.typeforce.maybe(n.typeforce.Number), witness: n.typeforce.maybe(n.typeforce.arrayOf(n.typeforce.Buffer)) }), redeemVersion: n.typeforce.maybe(n.typeforce.Number) }, o);
    const h = p.value(() => (0, a.fromBech32)(o.address)), I = p.value(() => {
      if (!(!o.witness || !o.witness.length)) return o.witness.length >= 2 && o.witness[o.witness.length - 1][0] === c ? o.witness.slice(0, -1) : o.witness.slice();
    }), S = p.value(() => {
      if (o.scriptTree) return (0, w.toHashTree)(o.scriptTree);
      if (o.hash) return { hash: o.hash };
    }), A = o.network || T.bitcoin, E = { name: "p2tr", network: A };
    if (p.prop(E, "address", () => {
      if (!E.pubkey) return;
      const m = g.bech32m.toWords(E.pubkey);
      return m.unshift(s), g.bech32m.encode(A.bech32, m);
    }), p.prop(E, "hash", () => {
      const m = S();
      if (m) return m.hash;
      const H = I();
      if (H && H.length > 1) {
        const k = H[H.length - 1], C = k[0] & n.TAPLEAF_VERSION_MASK, X = H[H.length - 2], B = (0, w.tapleafHash)({ output: X, version: C });
        return (0, w.rootHashFromPath)(k, B);
      }
      return null;
    }), p.prop(E, "output", () => {
      if (E.pubkey) return l.compile([y.OP_1, E.pubkey]);
    }), p.prop(E, "redeemVersion", () => o.redeemVersion ? o.redeemVersion : o.redeem && o.redeem.redeemVersion !== void 0 && o.redeem.redeemVersion !== null ? o.redeem.redeemVersion : w.LEAF_VERSION_TAPSCRIPT), p.prop(E, "redeem", () => {
      const m = I();
      if (!(!m || m.length < 2)) return { output: m[m.length - 2], witness: m.slice(0, -2), redeemVersion: m[m.length - 1][0] & n.TAPLEAF_VERSION_MASK };
    }), p.prop(E, "pubkey", () => {
      if (o.pubkey) return o.pubkey;
      if (o.output) return o.output.slice(2);
      if (o.address) return h().data;
      if (E.internalPubkey) {
        const m = (0, w.tweakKey)(E.internalPubkey, E.hash);
        if (m) return m.x;
      }
    }), p.prop(E, "internalPubkey", () => {
      if (o.internalPubkey) return o.internalPubkey;
      const m = I();
      if (m && m.length > 1) return m[m.length - 1].slice(1, 33);
    }), p.prop(E, "signature", () => {
      if (o.signature) return o.signature;
      const m = I();
      if (!(!m || m.length !== 1)) return m[0];
    }), p.prop(E, "witness", () => {
      if (o.witness) return o.witness;
      const m = S();
      if (m && o.redeem && o.redeem.output && o.internalPubkey) {
        const H = (0, w.tapleafHash)({ output: o.redeem.output, version: E.redeemVersion }), k = (0, w.findScriptPath)(m, H);
        if (!k) return;
        const C = (0, w.tweakKey)(o.internalPubkey, m.hash);
        if (!C) return;
        const X = r.Buffer.concat([r.Buffer.from([E.redeemVersion | C.parity]), o.internalPubkey].concat(k));
        return [o.redeem.output, X];
      }
      if (o.signature) return [o.signature];
    }), _.validate) {
      let m = r.Buffer.from([]);
      if (o.address) {
        if (A && A.bech32 !== h().prefix) throw new TypeError("Invalid prefix or Network mismatch");
        if (h().version !== s) throw new TypeError("Invalid address version");
        if (h().data.length !== 32) throw new TypeError("Invalid address data");
        m = h().data;
      }
      if (o.pubkey) {
        if (m.length > 0 && !m.equals(o.pubkey)) throw new TypeError("Pubkey mismatch");
        m = o.pubkey;
      }
      if (o.output) {
        if (o.output.length !== 34 || o.output[0] !== y.OP_1 || o.output[1] !== 32) throw new TypeError("Output is invalid");
        if (m.length > 0 && !m.equals(o.output.slice(2))) throw new TypeError("Pubkey mismatch");
        m = o.output.slice(2);
      }
      if (o.internalPubkey) {
        const C = (0, w.tweakKey)(o.internalPubkey, E.hash);
        if (m.length > 0 && !m.equals(C.x)) throw new TypeError("Pubkey mismatch");
        m = C.x;
      }
      if (m && m.length && !(0, f.getEccLib)().isXOnlyPoint(m)) throw new TypeError("Invalid pubkey for p2tr");
      const H = S();
      if (o.hash && H && !o.hash.equals(H.hash)) throw new TypeError("Hash mismatch");
      if (o.redeem && o.redeem.output && H) {
        const C = (0, w.tapleafHash)({ output: o.redeem.output, version: E.redeemVersion });
        if (!(0, w.findScriptPath)(H, C)) throw new TypeError("Redeem script not in tree");
      }
      const k = I();
      if (o.redeem && E.redeem) {
        if (o.redeem.redeemVersion && o.redeem.redeemVersion !== E.redeem.redeemVersion) throw new TypeError("Redeem.redeemVersion and witness mismatch");
        if (o.redeem.output) {
          if (l.decompile(o.redeem.output).length === 0) throw new TypeError("Redeem.output is invalid");
          if (E.redeem.output && !o.redeem.output.equals(E.redeem.output)) throw new TypeError("Redeem.output and witness mismatch");
        }
        if (o.redeem.witness && E.redeem.witness && !(0, n.stacksEqual)(o.redeem.witness, E.redeem.witness)) throw new TypeError("Redeem.witness and witness mismatch");
      }
      if (k && k.length) if (k.length === 1) {
        if (o.signature && !o.signature.equals(k[0])) throw new TypeError("Signature mismatch");
      } else {
        const C = k[k.length - 1];
        if (C.length < 33) throw new TypeError(`The control-block length is too small. Got ${C.length}, expected min 33.`);
        if ((C.length - 33) % 32 !== 0) throw new TypeError(`The control-block length of ${C.length} is incorrect!`);
        const X = (C.length - 33) / 32;
        if (X > 128) throw new TypeError(`The script path is too long. Got ${X}, expected max 128.`);
        const B = C.slice(1, 33);
        if (o.internalPubkey && !o.internalPubkey.equals(B)) throw new TypeError("Internal pubkey mismatch");
        if (!(0, f.getEccLib)().isXOnlyPoint(B)) throw new TypeError("Invalid internalPubkey for p2tr witness");
        const q = C[0] & n.TAPLEAF_VERSION_MASK, M = k[k.length - 2], G = (0, w.tapleafHash)({ output: M, version: q }), D = (0, w.rootHashFromPath)(C, G), x = (0, w.tweakKey)(B, D);
        if (!x) throw new TypeError("Invalid outputKey for p2tr witness");
        if (m.length && !m.equals(x.x)) throw new TypeError("Pubkey mismatch for p2tr witness");
        if (x.parity !== (C[0] & 1)) throw new Error("Incorrect parity");
      }
    }
    return Object.assign(E, o);
  }
  return Ke.p2tr = b, Ke;
}
var Vt;
function ze() {
  return Vt || (Vt = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: true }), r.p2tr = r.p2wsh = r.p2wpkh = r.p2sh = r.p2pkh = r.p2pk = r.p2ms = r.embed = void 0;
    const T = wr();
    Object.defineProperty(r, "embed", { enumerable: true, get: function() {
      return T.p2data;
    } });
    const l = yr();
    Object.defineProperty(r, "p2ms", { enumerable: true, get: function() {
      return l.p2ms;
    } });
    const n = gr();
    Object.defineProperty(r, "p2pk", { enumerable: true, get: function() {
      return n.p2pk;
    } });
    const f = mr();
    Object.defineProperty(r, "p2pkh", { enumerable: true, get: function() {
      return f.p2pkh;
    } });
    const w = Sr();
    Object.defineProperty(r, "p2sh", { enumerable: true, get: function() {
      return w.p2sh;
    } });
    const p = Er();
    Object.defineProperty(r, "p2wpkh", { enumerable: true, get: function() {
      return p.p2wpkh;
    } });
    const g = _r();
    Object.defineProperty(r, "p2wsh", { enumerable: true, get: function() {
      return g.p2wsh;
    } });
    const a = br();
    Object.defineProperty(r, "p2tr", { enumerable: true, get: function() {
      return a.p2tr;
    } });
  })(ct)), ct;
}
var Kt;
function St() {
  if (Kt) return ne;
  Kt = 1, Object.defineProperty(ne, "__esModule", { value: true }), ne.toOutputScript = ne.fromOutputScript = ne.toBech32 = ne.toBase58Check = ne.fromBech32 = ne.fromBase58Check = void 0;
  const r = fe(), T = ze(), l = ie(), n = re(), f = Je(), w = wt(), p = 40, g = 2, a = 16, y = 2, s = 80, c = "WARNING: Sending to a future segwit version address can lead to loss of funds. End users MUST be warned carefully in the GUI and asked if they wish to proceed with caution. Wallets should verify the segwit version from the output of fromBech32, then decide when it is safe to use which version of segwit.";
  function b(E, m) {
    const H = E.slice(2);
    if (H.length < g || H.length > p) throw new TypeError("Invalid program length for segwit address");
    const k = E[0] - s;
    if (k < y || k > a) throw new TypeError("Invalid version for segwit address");
    if (E[1] !== H.length) throw new TypeError("Invalid script for segwit address");
    return console.warn(c), I(H, k, m.bech32);
  }
  function o(E) {
    const m = U.from(w.decode(E));
    if (m.length < 21) throw new TypeError(E + " is too short");
    if (m.length > 21) throw new TypeError(E + " is too long");
    const H = m.readUInt8(0), k = m.slice(1);
    return { version: H, hash: k };
  }
  ne.fromBase58Check = o;
  function _(E) {
    let m, H;
    try {
      m = f.bech32.decode(E);
    } catch {
    }
    if (m) {
      if (H = m.words[0], H !== 0) throw new TypeError(E + " uses wrong encoding");
    } else if (m = f.bech32m.decode(E), H = m.words[0], H === 0) throw new TypeError(E + " uses wrong encoding");
    const k = f.bech32.fromWords(m.words.slice(1));
    return { version: H, prefix: m.prefix, data: U.from(k) };
  }
  ne.fromBech32 = _;
  function h(E, m) {
    (0, n.typeforce)((0, n.tuple)(n.Hash160bit, n.UInt8), arguments);
    const H = U.allocUnsafe(21);
    return H.writeUInt8(m, 0), E.copy(H, 1), w.encode(H);
  }
  ne.toBase58Check = h;
  function I(E, m, H) {
    const k = f.bech32.toWords(E);
    return k.unshift(m), m === 0 ? f.bech32.encode(H, k) : f.bech32m.encode(H, k);
  }
  ne.toBech32 = I;
  function S(E, m) {
    m = m || r.bitcoin;
    try {
      return T.p2pkh({ output: E, network: m }).address;
    } catch {
    }
    try {
      return T.p2sh({ output: E, network: m }).address;
    } catch {
    }
    try {
      return T.p2wpkh({ output: E, network: m }).address;
    } catch {
    }
    try {
      return T.p2wsh({ output: E, network: m }).address;
    } catch {
    }
    try {
      return T.p2tr({ output: E, network: m }).address;
    } catch {
    }
    try {
      return b(E, m);
    } catch {
    }
    throw new Error(l.toASM(E) + " has no matching Address");
  }
  ne.fromOutputScript = S;
  function A(E, m) {
    m = m || r.bitcoin;
    let H, k;
    try {
      H = o(E);
    } catch {
    }
    if (H) {
      if (H.version === m.pubKeyHash) return T.p2pkh({ hash: H.hash }).output;
      if (H.version === m.scriptHash) return T.p2sh({ hash: H.hash }).output;
    } else {
      try {
        k = _(E);
      } catch {
      }
      if (k) {
        if (k.prefix !== m.bech32) throw new Error(E + " has an invalid prefix");
        if (k.version === 0) {
          if (k.data.length === 20) return T.p2wpkh({ hash: k.data }).output;
          if (k.data.length === 32) return T.p2wsh({ hash: k.data }).output;
        } else if (k.version === 1) {
          if (k.data.length === 32) return T.p2tr({ pubkey: k.data }).output;
        } else if (k.version >= y && k.version <= a && k.data.length >= g && k.data.length <= p) return console.warn(c), l.compile([k.version + s, k.data]);
      }
    }
    throw new Error(E + " has no matching Script");
  }
  return ne.toOutputScript = A, ne;
}
var De = {}, Ge = {}, Dt;
function Tr() {
  if (Dt) return Ge;
  Dt = 1, Object.defineProperty(Ge, "__esModule", { value: true }), Ge.fastMerkleRoot = void 0;
  function r(T, l) {
    if (!Array.isArray(T)) throw TypeError("Expected values Array");
    if (typeof l != "function") throw TypeError("Expected digest Function");
    let n = T.length;
    const f = T.concat();
    for (; n > 1; ) {
      let w = 0;
      for (let p = 0; p < n; p += 2, ++w) {
        const g = f[p], a = p + 1 === n ? g : f[p + 1], y = U.concat([g, a]);
        f[w] = l(y);
      }
      n = w;
    }
    return f[0];
  }
  return Ge.fastMerkleRoot = r, Ge;
}
var je = {}, Gt;
function xe() {
  if (Gt) return je;
  Gt = 1, Object.defineProperty(je, "__esModule", { value: true }), je.Transaction = void 0;
  const r = $e(), T = de(), l = ie(), n = ie(), f = re(), { typeforce: w } = f;
  function p(I) {
    const S = I.length;
    return r.varuint.encodingLength(S) + S;
  }
  function g(I) {
    const S = I.length;
    return r.varuint.encodingLength(S) + I.reduce((A, E) => A + p(E), 0);
  }
  const a = U.allocUnsafe(0), y = [], s = U.from("0000000000000000000000000000000000000000000000000000000000000000", "hex"), c = U.from("0000000000000000000000000000000000000000000000000000000000000001", "hex"), b = U.from("ffffffffffffffff", "hex"), o = { script: a, valueBuffer: b };
  function _(I) {
    return I.value !== void 0;
  }
  class h {
    constructor() {
      this.version = 1, this.locktime = 0, this.ins = [], this.outs = [];
    }
    static fromBuffer(S, A) {
      const E = new r.BufferReader(S), m = new h();
      m.version = E.readInt32();
      const H = E.readUInt8(), k = E.readUInt8();
      let C = false;
      H === h.ADVANCED_TRANSACTION_MARKER && k === h.ADVANCED_TRANSACTION_FLAG ? C = true : E.offset -= 2;
      const X = E.readVarInt();
      for (let q = 0; q < X; ++q) m.ins.push({ hash: E.readSlice(32), index: E.readUInt32(), script: E.readVarSlice(), sequence: E.readUInt32(), witness: y });
      const B = E.readVarInt();
      for (let q = 0; q < B; ++q) m.outs.push({ value: E.readUInt64(), script: E.readVarSlice() });
      if (C) {
        for (let q = 0; q < X; ++q) m.ins[q].witness = E.readVector();
        if (!m.hasWitnesses()) throw new Error("Transaction has superfluous witness data");
      }
      if (m.locktime = E.readUInt32(), A) return m;
      if (E.offset !== S.length) throw new Error("Transaction has unexpected data");
      return m;
    }
    static fromHex(S) {
      return h.fromBuffer(U.from(S, "hex"), false);
    }
    static isCoinbaseHash(S) {
      w(f.Hash256bit, S);
      for (let A = 0; A < 32; ++A) if (S[A] !== 0) return false;
      return true;
    }
    isCoinbase() {
      return this.ins.length === 1 && h.isCoinbaseHash(this.ins[0].hash);
    }
    addInput(S, A, E, m) {
      return w(f.tuple(f.Hash256bit, f.UInt32, f.maybe(f.UInt32), f.maybe(f.Buffer)), arguments), f.Null(E) && (E = h.DEFAULT_SEQUENCE), this.ins.push({ hash: S, index: A, script: m || a, sequence: E, witness: y }) - 1;
    }
    addOutput(S, A) {
      return w(f.tuple(f.Buffer, f.Satoshi), arguments), this.outs.push({ script: S, value: A }) - 1;
    }
    hasWitnesses() {
      return this.ins.some((S) => S.witness.length !== 0);
    }
    stripWitnesses() {
      this.ins.forEach((S) => {
        S.witness = y;
      });
    }
    weight() {
      const S = this.byteLength(false), A = this.byteLength(true);
      return S * 3 + A;
    }
    virtualSize() {
      return Math.ceil(this.weight() / 4);
    }
    byteLength(S = true) {
      const A = S && this.hasWitnesses();
      return (A ? 10 : 8) + r.varuint.encodingLength(this.ins.length) + r.varuint.encodingLength(this.outs.length) + this.ins.reduce((E, m) => E + 40 + p(m.script), 0) + this.outs.reduce((E, m) => E + 8 + p(m.script), 0) + (A ? this.ins.reduce((E, m) => E + g(m.witness), 0) : 0);
    }
    clone() {
      const S = new h();
      return S.version = this.version, S.locktime = this.locktime, S.ins = this.ins.map((A) => ({ hash: A.hash, index: A.index, script: A.script, sequence: A.sequence, witness: A.witness })), S.outs = this.outs.map((A) => ({ script: A.script, value: A.value })), S;
    }
    hashForSignature(S, A, E) {
      if (w(f.tuple(f.UInt32, f.Buffer, f.Number), arguments), S >= this.ins.length) return c;
      const m = l.compile(l.decompile(A).filter((C) => C !== n.OPS.OP_CODESEPARATOR)), H = this.clone();
      if ((E & 31) === h.SIGHASH_NONE) H.outs = [], H.ins.forEach((C, X) => {
        X !== S && (C.sequence = 0);
      });
      else if ((E & 31) === h.SIGHASH_SINGLE) {
        if (S >= this.outs.length) return c;
        H.outs.length = S + 1;
        for (let C = 0; C < S; C++) H.outs[C] = o;
        H.ins.forEach((C, X) => {
          X !== S && (C.sequence = 0);
        });
      }
      E & h.SIGHASH_ANYONECANPAY ? (H.ins = [H.ins[S]], H.ins[0].script = m) : (H.ins.forEach((C) => {
        C.script = a;
      }), H.ins[S].script = m);
      const k = U.allocUnsafe(H.byteLength(false) + 4);
      return k.writeInt32LE(E, k.length - 4), H.__toBuffer(k, 0, false), T.hash256(k);
    }
    hashForWitnessV1(S, A, E, m, H, k) {
      if (w(f.tuple(f.UInt32, w.arrayOf(f.Buffer), w.arrayOf(f.Satoshi), f.UInt32), arguments), E.length !== this.ins.length || A.length !== this.ins.length) throw new Error("Must supply prevout script and value for all inputs");
      const C = m === h.SIGHASH_DEFAULT ? h.SIGHASH_ALL : m & h.SIGHASH_OUTPUT_MASK, B = (m & h.SIGHASH_INPUT_MASK) === h.SIGHASH_ANYONECANPAY, q = C === h.SIGHASH_NONE, M = C === h.SIGHASH_SINGLE;
      let G = a, D = a, x = a, se = a, oe = a;
      if (!B) {
        let R = r.BufferWriter.withCapacity(36 * this.ins.length);
        this.ins.forEach((F) => {
          R.writeSlice(F.hash), R.writeUInt32(F.index);
        }), G = T.sha256(R.end()), R = r.BufferWriter.withCapacity(8 * this.ins.length), E.forEach((F) => R.writeUInt64(F)), D = T.sha256(R.end()), R = r.BufferWriter.withCapacity(A.map(p).reduce((F, K) => F + K)), A.forEach((F) => R.writeVarSlice(F)), x = T.sha256(R.end()), R = r.BufferWriter.withCapacity(4 * this.ins.length), this.ins.forEach((F) => R.writeUInt32(F.sequence)), se = T.sha256(R.end());
      }
      if (q || M) {
        if (M && S < this.outs.length) {
          const R = this.outs[S], F = r.BufferWriter.withCapacity(8 + p(R.script));
          F.writeUInt64(R.value), F.writeVarSlice(R.script), oe = T.sha256(F.end());
        }
      } else {
        const R = this.outs.map((K) => 8 + p(K.script)).reduce((K, z) => K + z), F = r.BufferWriter.withCapacity(R);
        this.outs.forEach((K) => {
          F.writeUInt64(K.value), F.writeVarSlice(K.script);
        }), oe = T.sha256(F.end());
      }
      const ue = (H ? 2 : 0) + (k ? 1 : 0), O = 174 - (B ? 49 : 0) - (q ? 32 : 0) + (k ? 32 : 0) + (H ? 37 : 0), P = r.BufferWriter.withCapacity(O);
      if (P.writeUInt8(m), P.writeInt32(this.version), P.writeUInt32(this.locktime), P.writeSlice(G), P.writeSlice(D), P.writeSlice(x), P.writeSlice(se), q || M || P.writeSlice(oe), P.writeUInt8(ue), B) {
        const R = this.ins[S];
        P.writeSlice(R.hash), P.writeUInt32(R.index), P.writeUInt64(E[S]), P.writeVarSlice(A[S]), P.writeUInt32(R.sequence);
      } else P.writeUInt32(S);
      if (k) {
        const R = r.BufferWriter.withCapacity(p(k));
        R.writeVarSlice(k), P.writeSlice(T.sha256(R.end()));
      }
      return M && P.writeSlice(oe), H && (P.writeSlice(H), P.writeUInt8(0), P.writeUInt32(4294967295)), T.taggedHash("TapSighash", U.concat([U.from([0]), P.end()]));
    }
    hashForWitnessV0(S, A, E, m) {
      w(f.tuple(f.UInt32, f.Buffer, f.Satoshi, f.UInt32), arguments);
      let H = U.from([]), k, C = s, X = s, B = s;
      if (m & h.SIGHASH_ANYONECANPAY || (H = U.allocUnsafe(36 * this.ins.length), k = new r.BufferWriter(H, 0), this.ins.forEach((M) => {
        k.writeSlice(M.hash), k.writeUInt32(M.index);
      }), X = T.hash256(H)), !(m & h.SIGHASH_ANYONECANPAY) && (m & 31) !== h.SIGHASH_SINGLE && (m & 31) !== h.SIGHASH_NONE && (H = U.allocUnsafe(4 * this.ins.length), k = new r.BufferWriter(H, 0), this.ins.forEach((M) => {
        k.writeUInt32(M.sequence);
      }), B = T.hash256(H)), (m & 31) !== h.SIGHASH_SINGLE && (m & 31) !== h.SIGHASH_NONE) {
        const M = this.outs.reduce((G, D) => G + 8 + p(D.script), 0);
        H = U.allocUnsafe(M), k = new r.BufferWriter(H, 0), this.outs.forEach((G) => {
          k.writeUInt64(G.value), k.writeVarSlice(G.script);
        }), C = T.hash256(H);
      } else if ((m & 31) === h.SIGHASH_SINGLE && S < this.outs.length) {
        const M = this.outs[S];
        H = U.allocUnsafe(8 + p(M.script)), k = new r.BufferWriter(H, 0), k.writeUInt64(M.value), k.writeVarSlice(M.script), C = T.hash256(H);
      }
      H = U.allocUnsafe(156 + p(A)), k = new r.BufferWriter(H, 0);
      const q = this.ins[S];
      return k.writeInt32(this.version), k.writeSlice(X), k.writeSlice(B), k.writeSlice(q.hash), k.writeUInt32(q.index), k.writeVarSlice(A), k.writeUInt64(E), k.writeUInt32(q.sequence), k.writeSlice(C), k.writeUInt32(this.locktime), k.writeUInt32(m), T.hash256(H);
    }
    getHash(S) {
      return S && this.isCoinbase() ? U.alloc(32, 0) : T.hash256(this.__toBuffer(void 0, void 0, S));
    }
    getId() {
      return (0, r.reverseBuffer)(this.getHash(false)).toString("hex");
    }
    toBuffer(S, A) {
      return this.__toBuffer(S, A, true);
    }
    toHex() {
      return this.toBuffer(void 0, void 0).toString("hex");
    }
    setInputScript(S, A) {
      w(f.tuple(f.Number, f.Buffer), arguments), this.ins[S].script = A;
    }
    setWitness(S, A) {
      w(f.tuple(f.Number, [f.Buffer]), arguments), this.ins[S].witness = A;
    }
    __toBuffer(S, A, E = false) {
      S || (S = U.allocUnsafe(this.byteLength(E)));
      const m = new r.BufferWriter(S, A || 0);
      m.writeInt32(this.version);
      const H = E && this.hasWitnesses();
      return H && (m.writeUInt8(h.ADVANCED_TRANSACTION_MARKER), m.writeUInt8(h.ADVANCED_TRANSACTION_FLAG)), m.writeVarInt(this.ins.length), this.ins.forEach((k) => {
        m.writeSlice(k.hash), m.writeUInt32(k.index), m.writeVarSlice(k.script), m.writeUInt32(k.sequence);
      }), m.writeVarInt(this.outs.length), this.outs.forEach((k) => {
        _(k) ? m.writeUInt64(k.value) : m.writeSlice(k.valueBuffer), m.writeVarSlice(k.script);
      }), H && this.ins.forEach((k) => {
        m.writeVector(k.witness);
      }), m.writeUInt32(this.locktime), A !== void 0 ? S.slice(A, m.offset) : S;
    }
  }
  return je.Transaction = h, h.DEFAULT_SEQUENCE = 4294967295, h.SIGHASH_DEFAULT = 0, h.SIGHASH_ALL = 1, h.SIGHASH_NONE = 2, h.SIGHASH_SINGLE = 3, h.SIGHASH_ANYONECANPAY = 128, h.SIGHASH_OUTPUT_MASK = 3, h.SIGHASH_INPUT_MASK = 128, h.ADVANCED_TRANSACTION_MARKER = 0, h.ADVANCED_TRANSACTION_FLAG = 1, je;
}
var jt;
function Pr() {
  if (jt) return De;
  jt = 1, Object.defineProperty(De, "__esModule", { value: true }), De.Block = void 0;
  const r = $e(), T = de(), l = Tr(), n = xe(), f = re(), { typeforce: w } = f, p = new TypeError("Cannot compute merkle root for zero transactions"), g = new TypeError("Cannot compute witness commit for non-segwit block");
  class a {
    constructor() {
      this.version = 1, this.prevHash = void 0, this.merkleRoot = void 0, this.timestamp = 0, this.witnessCommit = void 0, this.bits = 0, this.nonce = 0, this.transactions = void 0;
    }
    static fromBuffer(b) {
      if (b.length < 80) throw new Error("Buffer too small (< 80 bytes)");
      const o = new r.BufferReader(b), _ = new a();
      if (_.version = o.readInt32(), _.prevHash = o.readSlice(32), _.merkleRoot = o.readSlice(32), _.timestamp = o.readUInt32(), _.bits = o.readUInt32(), _.nonce = o.readUInt32(), b.length === 80) return _;
      const h = () => {
        const A = n.Transaction.fromBuffer(o.buffer.slice(o.offset), true);
        return o.offset += A.byteLength(), A;
      }, I = o.readVarInt();
      _.transactions = [];
      for (let A = 0; A < I; ++A) {
        const E = h();
        _.transactions.push(E);
      }
      const S = _.getWitnessCommit();
      return S && (_.witnessCommit = S), _;
    }
    static fromHex(b) {
      return a.fromBuffer(U.from(b, "hex"));
    }
    static calculateTarget(b) {
      const o = ((b & 4278190080) >> 24) - 3, _ = b & 8388607, h = U.alloc(32, 0);
      return h.writeUIntBE(_, 29 - o, 3), h;
    }
    static calculateMerkleRoot(b, o) {
      if (w([{ getHash: f.Function }], b), b.length === 0) throw p;
      if (o && !y(b)) throw g;
      const _ = b.map((I) => I.getHash(o)), h = (0, l.fastMerkleRoot)(_, T.hash256);
      return o ? T.hash256(U.concat([h, b[0].ins[0].witness[0]])) : h;
    }
    getWitnessCommit() {
      if (!y(this.transactions)) return null;
      const b = this.transactions[0].outs.filter((_) => _.script.slice(0, 6).equals(U.from("6a24aa21a9ed", "hex"))).map((_) => _.script.slice(6, 38));
      if (b.length === 0) return null;
      const o = b[b.length - 1];
      return o instanceof U && o.length === 32 ? o : null;
    }
    hasWitnessCommit() {
      return this.witnessCommit instanceof U && this.witnessCommit.length === 32 || this.getWitnessCommit() !== null;
    }
    hasWitness() {
      return s(this.transactions);
    }
    weight() {
      const b = this.byteLength(false, false), o = this.byteLength(false, true);
      return b * 3 + o;
    }
    byteLength(b, o = true) {
      return b || !this.transactions ? 80 : 80 + r.varuint.encodingLength(this.transactions.length) + this.transactions.reduce((_, h) => _ + h.byteLength(o), 0);
    }
    getHash() {
      return T.hash256(this.toBuffer(true));
    }
    getId() {
      return (0, r.reverseBuffer)(this.getHash()).toString("hex");
    }
    getUTCDate() {
      const b = /* @__PURE__ */ new Date(0);
      return b.setUTCSeconds(this.timestamp), b;
    }
    toBuffer(b) {
      const o = U.allocUnsafe(this.byteLength(b)), _ = new r.BufferWriter(o);
      return _.writeInt32(this.version), _.writeSlice(this.prevHash), _.writeSlice(this.merkleRoot), _.writeUInt32(this.timestamp), _.writeUInt32(this.bits), _.writeUInt32(this.nonce), b || !this.transactions || (r.varuint.encode(this.transactions.length, o, _.offset), _.offset += r.varuint.encode.bytes, this.transactions.forEach((h) => {
        const I = h.byteLength();
        h.toBuffer(o, _.offset), _.offset += I;
      })), o;
    }
    toHex(b) {
      return this.toBuffer(b).toString("hex");
    }
    checkTxRoots() {
      const b = this.hasWitnessCommit();
      return !b && this.hasWitness() ? false : this.__checkMerkleRoot() && (b ? this.__checkWitnessCommit() : true);
    }
    checkProofOfWork() {
      const b = (0, r.reverseBuffer)(this.getHash()), o = a.calculateTarget(this.bits);
      return b.compare(o) <= 0;
    }
    __checkMerkleRoot() {
      if (!this.transactions) throw p;
      const b = a.calculateMerkleRoot(this.transactions);
      return this.merkleRoot.compare(b) === 0;
    }
    __checkWitnessCommit() {
      if (!this.transactions) throw p;
      if (!this.hasWitnessCommit()) throw g;
      const b = a.calculateMerkleRoot(this.transactions, true);
      return this.witnessCommit.compare(b) === 0;
    }
  }
  De.Block = a;
  function y(c) {
    return c instanceof Array && c[0] && c[0].ins && c[0].ins instanceof Array && c[0].ins[0] && c[0].ins[0].witness && c[0].ins[0].witness instanceof Array && c[0].ins[0].witness.length > 0;
  }
  function s(c) {
    return c instanceof Array && c.some((b) => typeof b == "object" && b.ins instanceof Array && b.ins.some((o) => typeof o == "object" && o.witness instanceof Array && o.witness.length > 0));
  }
  return De;
}
var Xe = {}, Z = {}, Q = {}, Xt;
function lt() {
  if (Xt) return Q;
  Xt = 1, Object.defineProperty(Q, "__esModule", { value: true }), Q.signatureBlocksAction = Q.checkInputForSig = Q.pubkeyInScript = Q.pubkeyPositionInScript = Q.witnessStackToScriptWitness = Q.isP2TR = Q.isP2SHScript = Q.isP2WSHScript = Q.isP2WPKH = Q.isP2PKH = Q.isP2PK = Q.isP2MS = void 0;
  const r = Zt(), T = ie(), l = xe(), n = de(), f = ze();
  function w(o) {
    return (_) => {
      try {
        return o({ output: _ }), true;
      } catch {
        return false;
      }
    };
  }
  Q.isP2MS = w(f.p2ms), Q.isP2PK = w(f.p2pk), Q.isP2PKH = w(f.p2pkh), Q.isP2WPKH = w(f.p2wpkh), Q.isP2WSHScript = w(f.p2wsh), Q.isP2SHScript = w(f.p2sh), Q.isP2TR = w(f.p2tr);
  function p(o) {
    let _ = U.allocUnsafe(0);
    function h(E) {
      _ = U.concat([_, U.from(E)]);
    }
    function I(E) {
      const m = _.length, H = r.encodingLength(E);
      _ = U.concat([_, U.allocUnsafe(H)]), r.encode(E, _, m);
    }
    function S(E) {
      I(E.length), h(E);
    }
    function A(E) {
      I(E.length), E.forEach(S);
    }
    return A(o), _;
  }
  Q.witnessStackToScriptWitness = p;
  function g(o, _) {
    const h = (0, n.hash160)(o), I = o.slice(1, 33), S = T.decompile(_);
    if (S === null) throw new Error("Unknown script error");
    return S.findIndex((A) => typeof A == "number" ? false : A.equals(o) || A.equals(h) || A.equals(I));
  }
  Q.pubkeyPositionInScript = g;
  function a(o, _) {
    return g(o, _) !== -1;
  }
  Q.pubkeyInScript = a;
  function y(o, _) {
    return c(o).some((I) => s(I, T.signature.decode, _));
  }
  Q.checkInputForSig = y;
  function s(o, _, h) {
    const { hashType: I } = _(o), S = [];
    switch (I & l.Transaction.SIGHASH_ANYONECANPAY && S.push("addInput"), I & 31) {
      case l.Transaction.SIGHASH_ALL:
        break;
      case l.Transaction.SIGHASH_SINGLE:
      case l.Transaction.SIGHASH_NONE:
        S.push("addOutput"), S.push("setInputSequence");
        break;
    }
    return S.indexOf(h) === -1;
  }
  Q.signatureBlocksAction = s;
  function c(o) {
    let _ = [];
    if ((o.partialSig || []).length === 0) {
      if (!o.finalScriptSig && !o.finalScriptWitness) return [];
      _ = b(o);
    } else _ = o.partialSig;
    return _.map((h) => h.signature);
  }
  function b(o) {
    const _ = o.finalScriptSig ? T.decompile(o.finalScriptSig) || [] : [], h = o.finalScriptWitness ? T.decompile(o.finalScriptWitness) || [] : [];
    return _.concat(h).filter((I) => U.isBuffer(I) && T.isCanonicalScriptSignature(I)).map((I) => ({ signature: I }));
  }
  return Q;
}
var zt;
function Or() {
  if (zt) return Z;
  zt = 1, Object.defineProperty(Z, "__esModule", { value: true }), Z.checkTaprootInputForSigs = Z.tapTreeFromList = Z.tapTreeToList = Z.tweakInternalPubKey = Z.checkTaprootOutputFields = Z.checkTaprootInputFields = Z.isTaprootOutput = Z.isTaprootInput = Z.serializeTaprootSignature = Z.tapScriptFinalizer = Z.toXOnly = void 0;
  const r = re(), T = xe(), l = lt(), n = mt(), f = ze(), w = lt(), p = (O) => O.length === 32 ? O : O.slice(1, 33);
  Z.toXOnly = p;
  function g(O, P, R) {
    const F = se(P, O, R);
    try {
      const z = D(P, F).concat(F.script).concat(F.controlBlock);
      return { finalScriptWitness: (0, l.witnessStackToScriptWitness)(z) };
    } catch (K) {
      throw new Error(`Can not finalize taproot input #${O}: ${K}`);
    }
  }
  Z.tapScriptFinalizer = g;
  function a(O, P) {
    const R = P ? U.from([P]) : U.from([]);
    return U.concat([O, R]);
  }
  Z.serializeTaprootSignature = a;
  function y(O) {
    return O && !!(O.tapInternalKey || O.tapMerkleRoot || O.tapLeafScript && O.tapLeafScript.length || O.tapBip32Derivation && O.tapBip32Derivation.length || O.witnessUtxo && (0, l.isP2TR)(O.witnessUtxo.script));
  }
  Z.isTaprootInput = y;
  function s(O, P) {
    return O && !!(O.tapInternalKey || O.tapTree || O.tapBip32Derivation && O.tapBip32Derivation.length || P && (0, l.isP2TR)(P));
  }
  Z.isTaprootOutput = s;
  function c(O, P, R) {
    B(O, P, R), M(O, P, R);
  }
  Z.checkTaprootInputFields = c;
  function b(O, P, R) {
    q(O, P, R), o(O, P);
  }
  Z.checkTaprootOutputFields = b;
  function o(O, P) {
    if (!P.tapTree && !P.tapInternalKey) return;
    const R = P.tapInternalKey || O.tapInternalKey, F = P.tapTree || O.tapTree;
    if (R) {
      const { script: K } = O, z = _(R, F);
      if (K && !K.equals(z)) throw new Error("Error adding output. Script or address missmatch.");
    }
  }
  function _(O, P) {
    const R = P && S(P.leaves), { output: F } = (0, f.p2tr)({ internalPubkey: O, scriptTree: R });
    return F;
  }
  function h(O, P) {
    const R = P.tapInternalKey, F = R && (0, n.tweakKey)(R, P.tapMerkleRoot);
    if (!F) throw new Error(`Cannot tweak tap internal key for input #${O}. Public key: ${R && R.toString("hex")}`);
    return F.x;
  }
  Z.tweakInternalPubKey = h;
  function I(O) {
    if (!(0, r.isTaptree)(O)) throw new Error("Cannot convert taptree to tapleaf list. Expecting a tapree structure.");
    return k(O);
  }
  Z.tapTreeToList = I;
  function S(O = []) {
    return O.length === 1 && O[0].depth === 0 ? { output: O[0].script, version: O[0].leafVersion } : C(O);
  }
  Z.tapTreeFromList = S;
  function A(O, P) {
    return m(O).some((F) => (0, w.signatureBlocksAction)(F, E, P));
  }
  Z.checkTaprootInputForSigs = A;
  function E(O) {
    return { signature: O.slice(0, 64), hashType: O.slice(64)[0] || T.Transaction.SIGHASH_DEFAULT };
  }
  function m(O) {
    const P = [];
    if (O.tapKeySig && P.push(O.tapKeySig), O.tapScriptSig && P.push(...O.tapScriptSig.map((R) => R.signature)), !P.length) {
      const R = H(O.finalScriptWitness);
      R && P.push(R);
    }
    return P;
  }
  function H(O) {
    if (!O) return;
    const P = O.slice(2);
    if (P.length === 64 || P.length === 65) return P;
  }
  function k(O, P = [], R = 0) {
    if (R > n.MAX_TAPTREE_DEPTH) throw new Error("Max taptree depth exceeded.");
    return O ? (0, r.isTapleaf)(O) ? (P.push({ depth: R, leafVersion: O.version || n.LEAF_VERSION_TAPSCRIPT, script: O.output }), P) : (O[0] && k(O[0], P, R + 1), O[1] && k(O[1], P, R + 1), P) : [];
  }
  function C(O) {
    let P;
    for (const R of O) if (P = X(R, P), !P) throw new Error("No room left to insert tapleaf in tree");
    return P;
  }
  function X(O, P, R = 0) {
    if (R > n.MAX_TAPTREE_DEPTH) throw new Error("Max taptree depth exceeded.");
    if (O.depth === R) return P ? void 0 : { output: O.script, version: O.leafVersion };
    if ((0, r.isTapleaf)(P)) return;
    const F = X(O, P && P[0], R + 1);
    if (F) return [F, P && P[1]];
    const K = X(O, P && P[1], R + 1);
    if (K) return [P && P[0], K];
  }
  function B(O, P, R) {
    const F = y(O) && ue(P), K = ue(O) && y(P), z = O === P && y(P) && ue(P);
    if (F || K || z) throw new Error(`Invalid arguments for Psbt.${R}. Cannot use both taproot and non-taproot fields.`);
  }
  function q(O, P, R) {
    const F = s(O) && ue(P), K = ue(O) && s(P), z = O === P && s(P) && ue(P);
    if (F || K || z) throw new Error(`Invalid arguments for Psbt.${R}. Cannot use both taproot and non-taproot fields.`);
  }
  function M(O, P, R) {
    if (P.tapMerkleRoot) {
      const F = (P.tapLeafScript || []).every((z) => G(z, P.tapMerkleRoot)), K = (O.tapLeafScript || []).every((z) => G(z, P.tapMerkleRoot));
      if (!F || !K) throw new Error(`Invalid arguments for Psbt.${R}. Tapleaf not part of taptree.`);
    } else if (O.tapMerkleRoot && !(P.tapLeafScript || []).every((K) => G(K, O.tapMerkleRoot))) throw new Error(`Invalid arguments for Psbt.${R}. Tapleaf not part of taptree.`);
  }
  function G(O, P) {
    if (!P) return true;
    const R = (0, n.tapleafHash)({ output: O.script, version: O.leafVersion });
    return (0, n.rootHashFromPath)(O.controlBlock, R).equals(P);
  }
  function D(O, P) {
    const R = (0, n.tapleafHash)({ output: P.script, version: P.leafVersion });
    return (O.tapScriptSig || []).filter((F) => F.leafHash.equals(R)).map((F) => x(P.script, F)).sort((F, K) => K.positionInScript - F.positionInScript).map((F) => F.signature);
  }
  function x(O, P) {
    return Object.assign({ positionInScript: (0, l.pubkeyPositionInScript)(P.pubkey, O) }, P);
  }
  function se(O, P, R) {
    if (!O.tapScriptSig || !O.tapScriptSig.length) throw new Error(`Can not finalize taproot input #${P}. No tapleaf script signature provided.`);
    const F = (O.tapLeafScript || []).sort((K, z) => K.controlBlock.length - z.controlBlock.length).find((K) => oe(K, O.tapScriptSig, R));
    if (!F) throw new Error(`Can not finalize taproot input #${P}. Signature for tapleaf script not found.`);
    return F;
  }
  function oe(O, P, R) {
    const F = (0, n.tapleafHash)({ output: O.script, version: O.leafVersion });
    return (!R || R.equals(F)) && P.find((z) => z.leafHash.equals(F)) !== void 0;
  }
  function ue(O) {
    return O && !!(O.redeemScript || O.witnessScript || O.bip32Derivation && O.bip32Derivation.length);
  }
  return Z;
}
var xt;
function vr() {
  if (xt) return Xe;
  xt = 1, Object.defineProperty(Xe, "__esModule", { value: true }), Xe.Psbt = void 0;
  const r = sr(), T = Zt(), l = or(), n = St(), f = $e(), w = fe(), p = ze(), g = mt(), a = ie(), y = xe(), s = Or(), c = lt(), b = { network: w.bitcoin, maximumFeeRate: 5e3 };
  class o {
    static fromBase64(e, t = {}) {
      const u = U.from(e, "base64");
      return this.fromBuffer(u, t);
    }
    static fromHex(e, t = {}) {
      const u = U.from(e, "hex");
      return this.fromBuffer(u, t);
    }
    static fromBuffer(e, t = {}) {
      const u = r.Psbt.fromBuffer(e, _), d = new o(t, u);
      return M(d.__CACHE.__TX, d.__CACHE), d;
    }
    constructor(e = {}, t = new r.Psbt(new h())) {
      this.data = t, this.opts = Object.assign({}, b, e), this.__CACHE = { __NON_WITNESS_UTXO_TX_CACHE: [], __NON_WITNESS_UTXO_BUF_CACHE: [], __TX_IN_CACHE: {}, __TX: this.data.globalMap.unsignedTx.tx, __UNSAFE_SIGN_NONSEGWIT: false }, this.data.inputs.length === 0 && this.setVersion(2);
      const u = (d, v, N, W) => Object.defineProperty(d, v, { enumerable: N, writable: W });
      u(this, "__CACHE", false, true), u(this, "opts", false, true);
    }
    get inputCount() {
      return this.data.inputs.length;
    }
    get version() {
      return this.__CACHE.__TX.version;
    }
    set version(e) {
      this.setVersion(e);
    }
    get locktime() {
      return this.__CACHE.__TX.locktime;
    }
    set locktime(e) {
      this.setLocktime(e);
    }
    get txInputs() {
      return this.__CACHE.__TX.ins.map((e) => ({ hash: (0, f.cloneBuffer)(e.hash), index: e.index, sequence: e.sequence }));
    }
    get txOutputs() {
      return this.__CACHE.__TX.outs.map((e) => {
        let t;
        try {
          t = (0, n.fromOutputScript)(e.script, this.opts.network);
        } catch {
        }
        return { script: (0, f.cloneBuffer)(e.script), value: e.value, address: t };
      });
    }
    combine(...e) {
      return this.data.combine(...e.map((t) => t.data)), this;
    }
    clone() {
      const e = o.fromBuffer(this.data.toBuffer());
      return e.opts = JSON.parse(JSON.stringify(this.opts)), e;
    }
    setMaximumFeeRate(e) {
      H(e), this.opts.maximumFeeRate = e;
    }
    setVersion(e) {
      H(e), C(this.data.inputs, "setVersion");
      const t = this.__CACHE;
      return t.__TX.version = e, t.__EXTRACTED_TX = void 0, this;
    }
    setLocktime(e) {
      H(e), C(this.data.inputs, "setLocktime");
      const t = this.__CACHE;
      return t.__TX.locktime = e, t.__EXTRACTED_TX = void 0, this;
    }
    setInputSequence(e, t) {
      H(t), C(this.data.inputs, "setInputSequence");
      const u = this.__CACHE;
      if (u.__TX.ins.length <= e) throw new Error("Input index too high");
      return u.__TX.ins[e].sequence = t, u.__EXTRACTED_TX = void 0, this;
    }
    addInputs(e) {
      return e.forEach((t) => this.addInput(t)), this;
    }
    addInput(e) {
      if (arguments.length > 1 || !e || e.hash === void 0 || e.index === void 0) throw new Error("Invalid arguments for Psbt.addInput. Requires single object with at least [hash] and [index]");
      (0, s.checkTaprootInputFields)(e, e, "addInput"), C(this.data.inputs, "addInput"), e.witnessScript && He(e.witnessScript);
      const t = this.__CACHE;
      this.data.addInput(e);
      const u = t.__TX.ins[t.__TX.ins.length - 1];
      G(t, u);
      const d = this.data.inputs.length - 1, v = this.data.inputs[d];
      return v.nonWitnessUtxo && Ae(this.__CACHE, v, d), t.__FEE = void 0, t.__FEE_RATE = void 0, t.__EXTRACTED_TX = void 0, this;
    }
    addOutputs(e) {
      return e.forEach((t) => this.addOutput(t)), this;
    }
    addOutput(e) {
      if (arguments.length > 1 || !e || e.value === void 0 || e.address === void 0 && e.script === void 0) throw new Error("Invalid arguments for Psbt.addOutput. Requires single object with at least [script or address] and [value]");
      C(this.data.inputs, "addOutput");
      const { address: t } = e;
      if (typeof t == "string") {
        const { network: d } = this.opts, v = (0, n.toOutputScript)(t, d);
        e = Object.assign({}, e, { script: v });
      }
      (0, s.checkTaprootOutputFields)(e, e, "addOutput");
      const u = this.__CACHE;
      return this.data.addOutput(e), u.__FEE = void 0, u.__FEE_RATE = void 0, u.__EXTRACTED_TX = void 0, this;
    }
    extractTransaction(e) {
      if (!this.data.inputs.every(E)) throw new Error("Not finalized");
      const t = this.__CACHE;
      if (e || k(this, t, this.opts), t.__EXTRACTED_TX) return t.__EXTRACTED_TX;
      const u = t.__TX.clone();
      return Be(this.data.inputs, u, t, true), u;
    }
    getFeeRate() {
      return oe("__FEE_RATE", "fee rate", this.data.inputs, this.__CACHE);
    }
    getFee() {
      return oe("__FEE", "fee", this.data.inputs, this.__CACHE);
    }
    finalizeAllInputs() {
      return (0, l.checkForInput)(this.data.inputs, 0), me(this.data.inputs.length).forEach((e) => this.finalizeInput(e)), this;
    }
    finalizeInput(e, t) {
      const u = (0, l.checkForInput)(this.data.inputs, e);
      return (0, s.isTaprootInput)(u) ? this._finalizeTaprootInput(e, u, void 0, t) : this._finalizeInput(e, u, t);
    }
    finalizeTaprootInput(e, t, u = s.tapScriptFinalizer) {
      const d = (0, l.checkForInput)(this.data.inputs, e);
      if ((0, s.isTaprootInput)(d)) return this._finalizeTaprootInput(e, d, t, u);
      throw new Error(`Cannot finalize input #${e}. Not Taproot.`);
    }
    _finalizeInput(e, t, u = ue) {
      const { script: d, isP2SH: v, isP2WSH: N, isSegwit: W } = ae(e, t, this.__CACHE);
      if (!d) throw new Error(`No script found for input #${e}`);
      X(t);
      const { finalScriptSig: L, finalScriptWitness: V } = u(e, t, d, W, v, N);
      if (L && this.data.updateInput(e, { finalScriptSig: L }), V && this.data.updateInput(e, { finalScriptWitness: V }), !L && !V) throw new Error(`Unknown error finalizing input #${e}`);
      return this.data.clearFinalizedInput(e), this;
    }
    _finalizeTaprootInput(e, t, u, d = s.tapScriptFinalizer) {
      if (!t.witnessUtxo) throw new Error(`Cannot finalize input #${e}. Missing withness utxo.`);
      if (t.tapKeySig) {
        const v = p.p2tr({ output: t.witnessUtxo.script, signature: t.tapKeySig }), N = (0, c.witnessStackToScriptWitness)(v.witness);
        this.data.updateInput(e, { finalScriptWitness: N });
      } else {
        const { finalScriptWitness: v } = d(e, t, u);
        this.data.updateInput(e, { finalScriptWitness: v });
      }
      return this.data.clearFinalizedInput(e), this;
    }
    getInputType(e) {
      const t = (0, l.checkForInput)(this.data.inputs, e), u = Ye(e, t, this.__CACHE), d = ke(u, e, "input", t.redeemScript || nt(t.finalScriptSig), t.witnessScript || it(t.finalScriptWitness)), v = d.type === "raw" ? "" : d.type + "-", N = Ze(d.meaningfulScript);
      return v + N;
    }
    inputHasPubkey(e, t) {
      const u = (0, l.checkForInput)(this.data.inputs, e);
      return tt(t, u, e, this.__CACHE);
    }
    inputHasHDKey(e, t) {
      const u = (0, l.checkForInput)(this.data.inputs, e), d = m(t);
      return !!u.bip32Derivation && u.bip32Derivation.some(d);
    }
    outputHasPubkey(e, t) {
      const u = (0, l.checkForOutput)(this.data.outputs, e);
      return rt(t, u, e, this.__CACHE);
    }
    outputHasHDKey(e, t) {
      const u = (0, l.checkForOutput)(this.data.outputs, e), d = m(t);
      return !!u.bip32Derivation && u.bip32Derivation.some(d);
    }
    validateSignaturesOfAllInputs(e) {
      return (0, l.checkForInput)(this.data.inputs, 0), me(this.data.inputs.length).map((u) => this.validateSignaturesOfInput(u, e)).reduce((u, d) => d === true && u, true);
    }
    validateSignaturesOfInput(e, t, u) {
      const d = this.data.inputs[e];
      return (0, s.isTaprootInput)(d) ? this.validateSignaturesOfTaprootInput(e, t, u) : this._validateSignaturesOfInput(e, t, u);
    }
    _validateSignaturesOfInput(e, t, u) {
      const d = this.data.inputs[e], v = (d || {}).partialSig;
      if (!d || !v || v.length < 1) throw new Error("No signatures to validate");
      if (typeof t != "function") throw new Error("Need validator function to validate signatures");
      const N = u ? v.filter((Y) => Y.pubkey.equals(u)) : v;
      if (N.length < 1) throw new Error("No signatures for this pubkey");
      const W = [];
      let L, V, j;
      for (const Y of N) {
        const te = a.signature.decode(Y.signature), { hash: Se, script: J } = j !== te.hashType ? R(e, Object.assign({}, d, { sighashType: te.hashType }), this.__CACHE, true) : { hash: L, script: V };
        j = te.hashType, L = Se, V = J, B(Y.pubkey, J, "verify"), W.push(t(Y.pubkey, Se, te.signature));
      }
      return W.every((Y) => Y === true);
    }
    validateSignaturesOfTaprootInput(e, t, u) {
      const d = this.data.inputs[e], v = (d || {}).tapKeySig, N = (d || {}).tapScriptSig;
      if (!d && !v && !(N && !N.length)) throw new Error("No signatures to validate");
      if (typeof t != "function") throw new Error("Need validator function to validate signatures");
      u = u && (0, s.toXOnly)(u);
      const W = u ? ve(e, d, this.data.inputs, u, this.__CACHE) : F(e, d, this.data.inputs, this.__CACHE);
      if (!W.length) throw new Error("No signatures for this pubkey");
      const L = W.find((j) => !j.leafHash);
      let V = 0;
      if (v && L) {
        if (!t(L.pubkey, L.hash, z(v))) return false;
        V++;
      }
      if (N) for (const j of N) {
        const Y = W.find((te) => j.pubkey.equals(te.pubkey));
        if (Y) {
          if (!t(j.pubkey, Y.hash, z(j.signature))) return false;
          V++;
        }
      }
      return V > 0;
    }
    signAllInputsHD(e, t = [y.Transaction.SIGHASH_ALL]) {
      if (!e || !e.publicKey || !e.fingerprint) throw new Error("Need HDSigner to sign input");
      const u = [];
      for (const d of me(this.data.inputs.length)) try {
        this.signInputHD(d, e, t), u.push(true);
      } catch {
        u.push(false);
      }
      if (u.every((d) => d === false)) throw new Error("No inputs were signed");
      return this;
    }
    signAllInputsHDAsync(e, t = [y.Transaction.SIGHASH_ALL]) {
      return new Promise((u, d) => {
        if (!e || !e.publicKey || !e.fingerprint) return d(new Error("Need HDSigner to sign input"));
        const v = [], N = [];
        for (const W of me(this.data.inputs.length)) N.push(this.signInputHDAsync(W, e, t).then(() => {
          v.push(true);
        }, () => {
          v.push(false);
        }));
        return Promise.all(N).then(() => {
          if (v.every((W) => W === false)) return d(new Error("No inputs were signed"));
          u();
        });
      });
    }
    signInputHD(e, t, u = [y.Transaction.SIGHASH_ALL]) {
      if (!t || !t.publicKey || !t.fingerprint) throw new Error("Need HDSigner to sign input");
      return Ue(e, this.data.inputs, t).forEach((v) => this.signInput(e, v, u)), this;
    }
    signInputHDAsync(e, t, u = [y.Transaction.SIGHASH_ALL]) {
      return new Promise((d, v) => {
        if (!t || !t.publicKey || !t.fingerprint) return v(new Error("Need HDSigner to sign input"));
        const W = Ue(e, this.data.inputs, t).map((L) => this.signInputAsync(e, L, u));
        return Promise.all(W).then(() => {
          d();
        }).catch(v);
      });
    }
    signAllInputs(e, t) {
      if (!e || !e.publicKey) throw new Error("Need Signer to sign input");
      const u = [];
      for (const d of me(this.data.inputs.length)) try {
        this.signInput(d, e, t), u.push(true);
      } catch {
        u.push(false);
      }
      if (u.every((d) => d === false)) throw new Error("No inputs were signed");
      return this;
    }
    signAllInputsAsync(e, t) {
      return new Promise((u, d) => {
        if (!e || !e.publicKey) return d(new Error("Need Signer to sign input"));
        const v = [], N = [];
        for (const [W] of this.data.inputs.entries()) N.push(this.signInputAsync(W, e, t).then(() => {
          v.push(true);
        }, () => {
          v.push(false);
        }));
        return Promise.all(N).then(() => {
          if (v.every((W) => W === false)) return d(new Error("No inputs were signed"));
          u();
        });
      });
    }
    signInput(e, t, u) {
      if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
      const d = (0, l.checkForInput)(this.data.inputs, e);
      return (0, s.isTaprootInput)(d) ? this._signTaprootInput(e, d, t, void 0, u) : this._signInput(e, t, u);
    }
    signTaprootInput(e, t, u, d) {
      if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
      const v = (0, l.checkForInput)(this.data.inputs, e);
      if ((0, s.isTaprootInput)(v)) return this._signTaprootInput(e, v, t, u, d);
      throw new Error(`Input #${e} is not of type Taproot.`);
    }
    _signInput(e, t, u = [y.Transaction.SIGHASH_ALL]) {
      const { hash: d, sighashType: v } = P(this.data.inputs, e, t.publicKey, this.__CACHE, u), N = [{ pubkey: t.publicKey, signature: a.signature.encode(t.sign(d), v) }];
      return this.data.updateInput(e, { partialSig: N }), this;
    }
    _signTaprootInput(e, t, u, d, v = [y.Transaction.SIGHASH_DEFAULT]) {
      const N = this.checkTaprootHashesForSig(e, t, u, d, v), W = N.filter((V) => !V.leafHash).map((V) => (0, s.serializeTaprootSignature)(u.signSchnorr(V.hash), t.sighashType))[0], L = N.filter((V) => !!V.leafHash).map((V) => ({ pubkey: (0, s.toXOnly)(u.publicKey), signature: (0, s.serializeTaprootSignature)(u.signSchnorr(V.hash), t.sighashType), leafHash: V.leafHash }));
      return W && this.data.updateInput(e, { tapKeySig: W }), L.length && this.data.updateInput(e, { tapScriptSig: L }), this;
    }
    signInputAsync(e, t, u) {
      return Promise.resolve().then(() => {
        if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
        const d = (0, l.checkForInput)(this.data.inputs, e);
        return (0, s.isTaprootInput)(d) ? this._signTaprootInputAsync(e, d, t, void 0, u) : this._signInputAsync(e, t, u);
      });
    }
    signTaprootInputAsync(e, t, u, d) {
      return Promise.resolve().then(() => {
        if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
        const v = (0, l.checkForInput)(this.data.inputs, e);
        if ((0, s.isTaprootInput)(v)) return this._signTaprootInputAsync(e, v, t, u, d);
        throw new Error(`Input #${e} is not of type Taproot.`);
      });
    }
    _signInputAsync(e, t, u = [y.Transaction.SIGHASH_ALL]) {
      const { hash: d, sighashType: v } = P(this.data.inputs, e, t.publicKey, this.__CACHE, u);
      return Promise.resolve(t.sign(d)).then((N) => {
        const W = [{ pubkey: t.publicKey, signature: a.signature.encode(N, v) }];
        this.data.updateInput(e, { partialSig: W });
      });
    }
    async _signTaprootInputAsync(e, t, u, d, v = [y.Transaction.SIGHASH_DEFAULT]) {
      const N = this.checkTaprootHashesForSig(e, t, u, d, v), W = [], L = N.filter((j) => !j.leafHash)[0];
      if (L) {
        const j = Promise.resolve(u.signSchnorr(L.hash)).then((Y) => ({ tapKeySig: (0, s.serializeTaprootSignature)(Y, t.sighashType) }));
        W.push(j);
      }
      const V = N.filter((j) => !!j.leafHash);
      if (V.length) {
        const j = V.map((Y) => Promise.resolve(u.signSchnorr(Y.hash)).then((te) => ({ tapScriptSig: [{ pubkey: (0, s.toXOnly)(u.publicKey), signature: (0, s.serializeTaprootSignature)(te, t.sighashType), leafHash: Y.leafHash }] })));
        W.push(...j);
      }
      return Promise.all(W).then((j) => {
        j.forEach((Y) => this.data.updateInput(e, Y));
      });
    }
    checkTaprootHashesForSig(e, t, u, d, v) {
      if (typeof u.signSchnorr != "function") throw new Error(`Need Schnorr Signer to sign taproot input #${e}.`);
      const N = ve(e, t, this.data.inputs, u.publicKey, this.__CACHE, d, v);
      if (!N || !N.length) throw new Error(`Can not sign for input #${e} with the key ${u.publicKey.toString("hex")}`);
      return N;
    }
    toBuffer() {
      return S(this.__CACHE), this.data.toBuffer();
    }
    toHex() {
      return S(this.__CACHE), this.data.toHex();
    }
    toBase64() {
      return S(this.__CACHE), this.data.toBase64();
    }
    updateGlobal(e) {
      return this.data.updateGlobal(e), this;
    }
    updateInput(e, t) {
      return t.witnessScript && He(t.witnessScript), (0, s.checkTaprootInputFields)(this.data.inputs[e], t, "updateInput"), this.data.updateInput(e, t), t.nonWitnessUtxo && Ae(this.__CACHE, this.data.inputs[e], e), this;
    }
    updateOutput(e, t) {
      const u = this.data.outputs[e];
      return (0, s.checkTaprootOutputFields)(u, t, "updateOutput"), this.data.updateOutput(e, t), this;
    }
    addUnknownKeyValToGlobal(e) {
      return this.data.addUnknownKeyValToGlobal(e), this;
    }
    addUnknownKeyValToInput(e, t) {
      return this.data.addUnknownKeyValToInput(e, t), this;
    }
    addUnknownKeyValToOutput(e, t) {
      return this.data.addUnknownKeyValToOutput(e, t), this;
    }
    clearFinalizedInput(e) {
      return this.data.clearFinalizedInput(e), this;
    }
  }
  Xe.Psbt = o;
  const _ = (i) => new h(i);
  class h {
    constructor(e = U.from([2, 0, 0, 0, 0, 0, 0, 0, 0, 0])) {
      this.tx = y.Transaction.fromBuffer(e), q(this.tx), Object.defineProperty(this, "tx", { enumerable: false, writable: true });
    }
    getInputOutputCounts() {
      return { inputCount: this.tx.ins.length, outputCount: this.tx.outs.length };
    }
    addInput(e) {
      if (e.hash === void 0 || e.index === void 0 || !U.isBuffer(e.hash) && typeof e.hash != "string" || typeof e.index != "number") throw new Error("Error adding input.");
      const t = typeof e.hash == "string" ? (0, f.reverseBuffer)(U.from(e.hash, "hex")) : e.hash;
      this.tx.addInput(t, e.index, e.sequence);
    }
    addOutput(e) {
      if (e.script === void 0 || e.value === void 0 || !U.isBuffer(e.script) || typeof e.value != "number") throw new Error("Error adding output.");
      this.tx.addOutput(e.script, e.value);
    }
    toBuffer() {
      return this.tx.toBuffer();
    }
  }
  function I(i, e, t) {
    switch (t) {
      case "pubkey":
      case "pubkeyhash":
      case "witnesspubkeyhash":
        return A(1, i.partialSig);
      case "multisig":
        const u = p.p2ms({ output: e });
        return A(u.m, i.partialSig, u.pubkeys);
      default:
        return false;
    }
  }
  function S(i) {
    if (i.__UNSAFE_SIGN_NONSEGWIT !== false) throw new Error("Not BIP174 compliant, can not export");
  }
  function A(i, e, t) {
    if (!e) return false;
    let u;
    if (t ? u = t.map((d) => {
      const v = st(d);
      return e.find((N) => N.pubkey.equals(v));
    }).filter((d) => !!d) : u = e, u.length > i) throw new Error("Too many signatures");
    return u.length === i;
  }
  function E(i) {
    return !!i.finalScriptSig || !!i.finalScriptWitness;
  }
  function m(i) {
    return (e) => !(!e.masterFingerprint.equals(i.fingerprint) || !i.derivePath(e.path).publicKey.equals(e.pubkey));
  }
  function H(i) {
    if (typeof i != "number" || i !== Math.floor(i) || i > 4294967295 || i < 0) throw new Error("Invalid 32 bit integer");
  }
  function k(i, e, t) {
    const u = e.__FEE_RATE || i.getFeeRate(), d = e.__EXTRACTED_TX.virtualSize(), v = u * d;
    if (u >= t.maximumFeeRate) throw new Error(`Warning: You are paying around ${(v / 1e8).toFixed(8)} in fees, which is ${u} satoshi per byte for a transaction with a VSize of ${d} bytes (segwit counted as 0.25 byte per byte). Use setMaximumFeeRate method to raise your threshold, or pass true to the first arg of extractTransaction.`);
  }
  function C(i, e) {
    i.forEach((t) => {
      if ((0, s.isTaprootInput)(t) ? (0, s.checkTaprootInputForSigs)(t, e) : (0, c.checkInputForSig)(t, e)) throw new Error("Can not modify transaction, signatures exist.");
    });
  }
  function X(i) {
    if (!i.sighashType || !i.partialSig) return;
    const { partialSig: e, sighashType: t } = i;
    e.forEach((u) => {
      const { hashType: d } = a.signature.decode(u.signature);
      if (t !== d) throw new Error("Signature sighash does not match input sighash type");
    });
  }
  function B(i, e, t) {
    if (!(0, c.pubkeyInScript)(i, e)) throw new Error(`Can not ${t} for this input with the key ${i.toString("hex")}`);
  }
  function q(i) {
    if (!i.ins.every((t) => t.script && t.script.length === 0 && t.witness && t.witness.length === 0)) throw new Error("Format Error: Transaction ScriptSigs are not empty");
  }
  function M(i, e) {
    i.ins.forEach((t) => {
      G(e, t);
    });
  }
  function G(i, e) {
    const t = (0, f.reverseBuffer)(U.from(e.hash)).toString("hex") + ":" + e.index;
    if (i.__TX_IN_CACHE[t]) throw new Error("Duplicate input detected.");
    i.__TX_IN_CACHE[t] = 1;
  }
  function D(i, e) {
    return (t, u, d, v) => {
      const N = i({ redeem: { output: d } }).output;
      if (!u.equals(N)) throw new Error(`${e} for ${v} #${t} doesn't match the scriptPubKey in the prevout`);
    };
  }
  const x = D(p.p2sh, "Redeem script"), se = D(p.p2wsh, "Witness script");
  function oe(i, e, t, u) {
    if (!t.every(E)) throw new Error(`PSBT must be finalized to calculate ${e}`);
    if (i === "__FEE_RATE" && u.__FEE_RATE) return u.__FEE_RATE;
    if (i === "__FEE" && u.__FEE) return u.__FEE;
    let d, v = true;
    if (u.__EXTRACTED_TX ? (d = u.__EXTRACTED_TX, v = false) : d = u.__TX.clone(), Be(t, d, u, v), i === "__FEE_RATE") return u.__FEE_RATE;
    if (i === "__FEE") return u.__FEE;
  }
  function ue(i, e, t, u, d, v) {
    const N = Ze(t);
    if (!I(e, t, N)) throw new Error(`Can not finalize input #${i}`);
    return O(t, N, e.partialSig, u, d, v);
  }
  function O(i, e, t, u, d, v) {
    let N, W;
    const L = Ne(i, e, t), V = v ? p.p2wsh({ redeem: L }) : null, j = d ? p.p2sh({ redeem: V || L }) : null;
    return u ? (V ? W = (0, c.witnessStackToScriptWitness)(V.witness) : W = (0, c.witnessStackToScriptWitness)(L.witness), j && (N = j.input)) : j ? N = j.input : N = L.input, { finalScriptSig: N, finalScriptWitness: W };
  }
  function P(i, e, t, u, d) {
    const v = (0, l.checkForInput)(i, e), { hash: N, sighashType: W, script: L } = R(e, v, u, false, d);
    return B(t, L, "sign"), { hash: N, sighashType: W };
  }
  function R(i, e, t, u, d) {
    const v = t.__TX, N = e.sighashType || y.Transaction.SIGHASH_ALL;
    we(N, d);
    let W, L;
    if (e.nonWitnessUtxo) {
      const Y = Ie(t, e, i), te = v.ins[i].hash, Se = Y.getHash();
      if (!te.equals(Se)) throw new Error(`Non-witness UTXO hash for input #${i} doesn't match the hash specified in the prevout`);
      const J = v.ins[i].index;
      L = Y.outs[J];
    } else if (e.witnessUtxo) L = e.witnessUtxo;
    else throw new Error("Need a Utxo input item for signing");
    const { meaningfulScript: V, type: j } = ke(L.script, i, "input", e.redeemScript, e.witnessScript);
    if (["p2sh-p2wsh", "p2wsh"].indexOf(j) >= 0) W = v.hashForWitnessV0(i, V, L.value, N);
    else if ((0, c.isP2WPKH)(V)) {
      const Y = p.p2pkh({ hash: V.slice(2) }).output;
      W = v.hashForWitnessV0(i, Y, L.value, N);
    } else {
      if (e.nonWitnessUtxo === void 0 && t.__UNSAFE_SIGN_NONSEGWIT === false) throw new Error(`Input #${i} has witnessUtxo but non-segwit script: ${V.toString("hex")}`);
      !u && t.__UNSAFE_SIGN_NONSEGWIT !== false && console.warn(`Warning: Signing non-segwit inputs without the full parent transaction means there is a chance that a miner could feed you incorrect information to trick you into paying large fees. This behavior is the same as Psbt's predecessor (TransactionBuilder - now removed) when signing non-segwit scripts. You are not able to export this Psbt with toBuffer|toBase64|toHex since it is not BIP174 compliant.
*********************
PROCEED WITH CAUTION!
*********************`), W = v.hashForSignature(i, V, N);
    }
    return { script: V, sighashType: N, hash: W };
  }
  function F(i, e, t, u) {
    const d = [];
    if (e.tapInternalKey) {
      const N = K(i, e, u);
      N && d.push(N);
    }
    if (e.tapScriptSig) {
      const N = e.tapScriptSig.map((W) => W.pubkey);
      d.push(...N);
    }
    return d.map((N) => ve(i, e, t, N, u)).flat();
  }
  function K(i, e, t) {
    const { script: u } = Re(i, e, t);
    return (0, c.isP2TR)(u) ? u.subarray(2, 34) : null;
  }
  function z(i) {
    return i.length === 64 ? i : i.subarray(0, 64);
  }
  function ve(i, e, t, u, d, v, N) {
    const W = d.__TX, L = e.sighashType || y.Transaction.SIGHASH_DEFAULT;
    we(L, N);
    const V = t.map((J, Ee) => Re(Ee, J, d)), j = V.map((J) => J.script), Y = V.map((J) => J.value), te = [];
    if (e.tapInternalKey && !v) {
      const J = K(i, e, d) || U.from([]);
      if ((0, s.toXOnly)(u).equals(J)) {
        const Ee = W.hashForWitnessV1(i, j, Y, L);
        te.push({ pubkey: u, hash: Ee });
      }
    }
    const Se = (e.tapLeafScript || []).filter((J) => (0, c.pubkeyInScript)(u, J.script)).map((J) => {
      const Ee = (0, g.tapleafHash)({ output: J.script, version: J.leafVersion });
      return Object.assign({ hash: Ee }, J);
    }).filter((J) => !v || v.equals(J.hash)).map((J) => {
      const Ee = W.hashForWitnessV1(i, j, Y, L, J.hash);
      return { pubkey: u, hash: Ee, leafHash: J.hash };
    });
    return te.concat(Se);
  }
  function we(i, e) {
    if (e && e.indexOf(i) < 0) {
      const t = et(i);
      throw new Error(`Sighash type is not allowed. Retry the sign method passing the sighashTypes array of whitelisted types. Sighash type: ${t}`);
    }
  }
  function Ne(i, e, t) {
    let u;
    switch (e) {
      case "multisig":
        const d = ce(i, t);
        u = p.p2ms({ output: i, signatures: d });
        break;
      case "pubkey":
        u = p.p2pk({ output: i, signature: t[0].signature });
        break;
      case "pubkeyhash":
        u = p.p2pkh({ output: i, pubkey: t[0].pubkey, signature: t[0].signature });
        break;
      case "witnesspubkeyhash":
        u = p.p2wpkh({ output: i, pubkey: t[0].pubkey, signature: t[0].signature });
        break;
    }
    return u;
  }
  function ae(i, e, t) {
    const u = t.__TX, d = { script: null, isSegwit: false, isP2SH: false, isP2WSH: false };
    if (d.isP2SH = !!e.redeemScript, d.isP2WSH = !!e.witnessScript, e.witnessScript) d.script = e.witnessScript;
    else if (e.redeemScript) d.script = e.redeemScript;
    else if (e.nonWitnessUtxo) {
      const v = Ie(t, e, i), N = u.ins[i].index;
      d.script = v.outs[N].script;
    } else e.witnessUtxo && (d.script = e.witnessUtxo.script);
    return (e.witnessScript || (0, c.isP2WPKH)(d.script)) && (d.isSegwit = true), d;
  }
  function Ue(i, e, t) {
    const u = (0, l.checkForInput)(e, i);
    if (!u.bip32Derivation || u.bip32Derivation.length === 0) throw new Error("Need bip32Derivation to sign with HD");
    const d = u.bip32Derivation.map((N) => {
      if (N.masterFingerprint.equals(t.fingerprint)) return N;
    }).filter((N) => !!N);
    if (d.length === 0) throw new Error("Need one bip32Derivation masterFingerprint to match the HDSigner fingerprint");
    return d.map((N) => {
      const W = t.derivePath(N.path);
      if (!N.pubkey.equals(W.publicKey)) throw new Error("pubkey did not match bip32Derivation");
      return W;
    });
  }
  function ce(i, e) {
    return p.p2ms({ output: i }).pubkeys.map((u) => (e.filter((d) => d.pubkey.equals(u))[0] || {}).signature).filter((u) => !!u);
  }
  function ge(i) {
    let e = 0;
    function t(N) {
      return e += N, i.slice(e - N, e);
    }
    function u() {
      const N = T.decode(i, e);
      return e += T.decode.bytes, N;
    }
    function d() {
      return t(u());
    }
    function v() {
      const N = u(), W = [];
      for (let L = 0; L < N; L++) W.push(d());
      return W;
    }
    return v();
  }
  function et(i) {
    let e = i & y.Transaction.SIGHASH_ANYONECANPAY ? "SIGHASH_ANYONECANPAY | " : "";
    switch (i & 31) {
      case y.Transaction.SIGHASH_ALL:
        e += "SIGHASH_ALL";
        break;
      case y.Transaction.SIGHASH_SINGLE:
        e += "SIGHASH_SINGLE";
        break;
      case y.Transaction.SIGHASH_NONE:
        e += "SIGHASH_NONE";
        break;
    }
    return e;
  }
  function Ae(i, e, t) {
    i.__NON_WITNESS_UTXO_BUF_CACHE[t] = e.nonWitnessUtxo;
    const u = y.Transaction.fromBuffer(e.nonWitnessUtxo);
    i.__NON_WITNESS_UTXO_TX_CACHE[t] = u;
    const d = i, v = t;
    delete e.nonWitnessUtxo, Object.defineProperty(e, "nonWitnessUtxo", { enumerable: true, get() {
      const N = d.__NON_WITNESS_UTXO_BUF_CACHE[v], W = d.__NON_WITNESS_UTXO_TX_CACHE[v];
      if (N !== void 0) return N;
      {
        const L = W.toBuffer();
        return d.__NON_WITNESS_UTXO_BUF_CACHE[v] = L, L;
      }
    }, set(N) {
      d.__NON_WITNESS_UTXO_BUF_CACHE[v] = N;
    } });
  }
  function Be(i, e, t, u) {
    let d = 0;
    i.forEach((L, V) => {
      if (u && L.finalScriptSig && (e.ins[V].script = L.finalScriptSig), u && L.finalScriptWitness && (e.ins[V].witness = ge(L.finalScriptWitness)), L.witnessUtxo) d += L.witnessUtxo.value;
      else if (L.nonWitnessUtxo) {
        const j = Ie(t, L, V), Y = e.ins[V].index, te = j.outs[Y];
        d += te.value;
      }
    });
    const v = e.outs.reduce((L, V) => L + V.value, 0), N = d - v;
    if (N < 0) throw new Error("Outputs are spending more than Inputs");
    const W = e.virtualSize();
    t.__FEE = N, t.__EXTRACTED_TX = e, t.__FEE_RATE = Math.floor(N / W);
  }
  function Ie(i, e, t) {
    const u = i.__NON_WITNESS_UTXO_TX_CACHE;
    return u[t] || Ae(i, e, t), u[t];
  }
  function Ye(i, e, t) {
    const { script: u } = Re(i, e, t);
    return u;
  }
  function Re(i, e, t) {
    if (e.witnessUtxo !== void 0) return { script: e.witnessUtxo.script, value: e.witnessUtxo.value };
    if (e.nonWitnessUtxo !== void 0) {
      const d = Ie(t, e, i).outs[t.__TX.ins[i].index];
      return { script: d.script, value: d.value };
    } else throw new Error("Can't find pubkey in input without Utxo data");
  }
  function tt(i, e, t, u) {
    const d = Ye(t, e, u), { meaningfulScript: v } = ke(d, t, "input", e.redeemScript, e.witnessScript);
    return (0, c.pubkeyInScript)(i, v);
  }
  function rt(i, e, t, u) {
    const d = u.__TX.outs[t].script, { meaningfulScript: v } = ke(d, t, "output", e.redeemScript, e.witnessScript);
    return (0, c.pubkeyInScript)(i, v);
  }
  function nt(i) {
    if (!i) return;
    const e = a.decompile(i);
    if (!e) return;
    const t = e[e.length - 1];
    if (!(!U.isBuffer(t) || Qe(t) || ot(t) || !a.decompile(t))) return t;
  }
  function it(i) {
    if (!i) return;
    const e = ge(i), t = e[e.length - 1];
    if (!(Qe(t) || !a.decompile(t))) return t;
  }
  function st(i) {
    if (i.length === 65) {
      const e = i[64] & 1, t = i.slice(0, 33);
      return t[0] = 2 | e, t;
    }
    return i.slice();
  }
  function Qe(i) {
    return i.length === 33 && a.isCanonicalPubKey(i);
  }
  function ot(i) {
    return a.isCanonicalScriptSignature(i);
  }
  function ke(i, e, t, u, d) {
    const v = (0, c.isP2SHScript)(i), N = v && u && (0, c.isP2WSHScript)(u), W = (0, c.isP2WSHScript)(i);
    if (v && u === void 0) throw new Error("scriptPubkey is P2SH but redeemScript missing");
    if ((W || N) && d === void 0) throw new Error("scriptPubkey or redeemScript is P2WSH but witnessScript missing");
    let L;
    return N ? (L = d, x(e, i, u, t), se(e, u, d, t), He(L)) : W ? (L = d, se(e, i, d, t), He(L)) : v ? (L = u, x(e, i, u, t)) : L = i, { meaningfulScript: L, type: N ? "p2sh-p2wsh" : v ? "p2sh" : W ? "p2wsh" : "raw" };
  }
  function He(i) {
    if ((0, c.isP2WPKH)(i) || (0, c.isP2SHScript)(i)) throw new Error("P2WPKH or P2SH can not be contained within P2WSH");
  }
  function Ze(i) {
    return (0, c.isP2WPKH)(i) ? "witnesspubkeyhash" : (0, c.isP2PKH)(i) ? "pubkeyhash" : (0, c.isP2MS)(i) ? "multisig" : (0, c.isP2PK)(i) ? "pubkey" : "nonstandard";
  }
  function me(i) {
    return [...Array(i).keys()];
  }
  return Xe;
}
var Yt;
function Ar() {
  return Yt || (Yt = 1, (function(r) {
    Object.defineProperty(r, "__esModule", { value: true }), r.initEccLib = r.Transaction = r.opcodes = r.Psbt = r.Block = r.script = r.payments = r.networks = r.crypto = r.address = void 0;
    const T = St();
    r.address = T;
    const l = de();
    r.crypto = l;
    const n = fe();
    r.networks = n;
    const f = ze();
    r.payments = f;
    const w = ie();
    r.script = w;
    var p = Pr();
    Object.defineProperty(r, "Block", { enumerable: true, get: function() {
      return p.Block;
    } });
    var g = vr();
    Object.defineProperty(r, "Psbt", { enumerable: true, get: function() {
      return g.Psbt;
    } });
    var a = yt();
    Object.defineProperty(r, "opcodes", { enumerable: true, get: function() {
      return a.OPS;
    } });
    var y = xe();
    Object.defineProperty(r, "Transaction", { enumerable: true, get: function() {
      return y.Transaction;
    } });
    var s = gt();
    Object.defineProperty(r, "initEccLib", { enumerable: true, get: function() {
      return s.initEccLib;
    } });
  })(ut)), ut;
}
var Nr = Ar(), $ = {}, Qt;
function Ir() {
  if (Qt) return $;
  Qt = 1;
  var r = ur(), T = fr(), l = cr();
  function n(i) {
    var e = /* @__PURE__ */ Object.create(null);
    return i && Object.keys(i).forEach(function(t) {
      if (t !== "default") {
        var u = Object.getOwnPropertyDescriptor(i, t);
        Object.defineProperty(e, t, u.get ? u : { enumerable: true, get: function() {
          return i[t];
        } });
      }
    }), e.default = i, Object.freeze(e);
  }
  var f = n(T), w = n(l);
  const p = r.secp256k1.ProjectivePoint, g = "Expected Private", a = "Expected Point", y = "Expected Tweak", s = "Expected Hash", c = "Expected Signature", b = "Expected Extra Data (32 bytes)", o = "Expected Scalar", _ = "Bad Recovery Id", h = 32, I = 32, S = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 254, 186, 174, 220, 230, 175, 72, 160, 59, 191, 210, 94, 140, 208, 54, 65, 65]), A = 32, E = new Uint8Array(32), m = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 69, 81, 35, 25, 80, 183, 95, 196, 64, 45, 161, 114, 47, 201, 186, 238]), H = BigInt(1);
  function k(i) {
    return i instanceof Uint8Array;
  }
  function C(i, e) {
    for (let t = 0; t < 32; ++t) if (i[t] !== e[t]) return i[t] < e[t] ? -1 : 1;
    return 0;
  }
  function X(i) {
    return C(i, E) === 0;
  }
  function B(i) {
    return !(!(i instanceof Uint8Array) || i.length !== I || C(i, S) >= 0);
  }
  function q(i) {
    return i instanceof Uint8Array && i.length === 64 && C(i.subarray(0, 32), S) < 0 && C(i.subarray(32, 64), S) < 0;
  }
  function M(i) {
    return k(i) && i.length === 64 && C(i.subarray(0, 32), m) < 0;
  }
  function G(i) {
    return !(X(i.subarray(0, 32)) || X(i.subarray(32, 64)));
  }
  function D(i) {
    return i instanceof Uint8Array && i.length === h;
  }
  function x(i) {
    return i === void 0 || i instanceof Uint8Array && i.length === A;
  }
  function se(i) {
    let e;
    if (typeof i == "bigint") e = i;
    else if (typeof i == "number" && Number.isSafeInteger(i) && i >= 0) e = BigInt(i);
    else if (typeof i == "string") {
      if (i.length !== 64) throw new Error("Expected 32 bytes of private scalar");
      e = w.hexToNumber(i);
    } else if (i instanceof Uint8Array) {
      if (i.length !== 32) throw new Error("Expected 32 bytes of private scalar");
      e = w.bytesToNumberBE(i);
    } else throw new TypeError("Expected valid private scalar");
    if (e < 0) throw new Error("Expected private scalar >= 0");
    return e;
  }
  function oe(i) {
    return r.secp256k1.utils.normPrivateKeyToScalar(i);
  }
  function ue(i, e) {
    const t = oe(i), u = se(e), d = w.numberToBytesBE(f.mod(t + u, r.secp256k1.CURVE.n), 32);
    return r.secp256k1.utils.isValidPrivateKey(d) ? d : null;
  }
  function O(i, e) {
    const t = oe(i), u = se(e), d = w.numberToBytesBE(f.mod(t - u, r.secp256k1.CURVE.n), 32);
    return r.secp256k1.utils.isValidPrivateKey(d) ? d : null;
  }
  function P(i) {
    const e = oe(i), t = w.numberToBytesBE(r.secp256k1.CURVE.n - e, 32);
    return r.secp256k1.utils.isValidPrivateKey(t) ? t : null;
  }
  function R(i, e, t) {
    const u = we(i), d = se(e), v = p.BASE.multiplyAndAddUnsafe(u, d, H);
    if (!v) throw new Error("Tweaked point at infinity");
    return v.toRawBytes(t);
  }
  function F(i, e, t) {
    const u = we(i), d = typeof e == "string" ? e : w.bytesToHex(e), v = w.hexToNumber(d);
    return u.multiply(v).toRawBytes(t);
  }
  function K(i, e) {
    return i === void 0 ? e !== void 0 ? Ue(e) : true : !!i;
  }
  function z(i) {
    try {
      return i();
    } catch {
      return null;
    }
  }
  function ve(i) {
    return r.schnorr.utils.lift_x(w.bytesToNumberBE(i));
  }
  function we(i) {
    return i.length === 32 ? ve(i) : p.fromHex(i);
  }
  function Ne(i, e) {
    if (i.length === 32 !== e) return false;
    try {
      return e ? !!ve(i) : !!p.fromHex(i);
    } catch {
      return false;
    }
  }
  function ae(i) {
    return Ne(i, false);
  }
  function Ue(i) {
    return Ne(i, false) && i.length === 33;
  }
  function ce(i) {
    return r.secp256k1.utils.isValidPrivateKey(i);
  }
  function ge(i) {
    return Ne(i, true);
  }
  function et(i, e) {
    if (!ge(i)) throw new Error(a);
    if (!B(e)) throw new Error(y);
    return z(() => {
      const t = R(i, e, true);
      return { parity: t[0] % 2 === 1 ? 1 : 0, xOnlyPubkey: t.slice(1) };
    });
  }
  function Ae(i) {
    if (!ae(i)) throw new Error(a);
    return i.slice(1, 33);
  }
  function Be(i, e) {
    if (!ce(i)) throw new Error(g);
    return z(() => r.secp256k1.getPublicKey(i, K(e)));
  }
  function Ie(i) {
    if (!ce(i)) throw new Error(g);
    return Ae(Be(i));
  }
  function Ye(i, e) {
    if (!ae(i)) throw new Error(a);
    return we(i).toRawBytes(K(e, i));
  }
  function Re(i, e, t) {
    if (!ae(i)) throw new Error(a);
    if (!B(e)) throw new Error(y);
    return z(() => F(i, e, K(t, i)));
  }
  function tt(i, e, t) {
    if (!ae(i) || !ae(e)) throw new Error(a);
    return z(() => {
      const u = we(i), d = we(e);
      return u.equals(d.negate()) ? null : u.add(d).toRawBytes(K(t, i));
    });
  }
  function rt(i, e, t) {
    if (!ae(i)) throw new Error(a);
    if (!B(e)) throw new Error(y);
    return z(() => R(i, e, K(t, i)));
  }
  function nt(i, e) {
    if (!ce(i)) throw new Error(g);
    if (!B(e)) throw new Error(y);
    return z(() => ue(i, e));
  }
  function it(i, e) {
    if (!ce(i)) throw new Error(g);
    if (!B(e)) throw new Error(y);
    return z(() => O(i, e));
  }
  function st(i) {
    if (!ce(i)) throw new Error(g);
    return P(i);
  }
  function Qe(i, e, t) {
    if (!ce(e)) throw new Error(g);
    if (!D(i)) throw new Error(o);
    if (!x(t)) throw new Error(b);
    return r.secp256k1.sign(i, e, { extraEntropy: t }).toCompactRawBytes();
  }
  function ot(i, e, t) {
    if (!ce(e)) throw new Error(g);
    if (!D(i)) throw new Error(o);
    if (!x(t)) throw new Error(b);
    const u = r.secp256k1.sign(i, e, { extraEntropy: t });
    return { signature: u.toCompactRawBytes(), recoveryId: u.recovery };
  }
  function ke(i, e, t) {
    if (!ce(e)) throw new Error(g);
    if (!D(i)) throw new Error(o);
    if (!x(t)) throw new Error(b);
    return r.schnorr.sign(i, e, t);
  }
  function He(i, e, t, u) {
    if (!D(i)) throw new Error(s);
    if (!q(e) || !G(e)) throw new Error(c);
    if (t & 2 && !M(e)) throw new Error(_);
    if (!ge(e.subarray(0, 32))) throw new Error(c);
    const v = r.secp256k1.Signature.fromCompact(e).addRecoveryBit(t).recoverPublicKey(i);
    if (!v) throw new Error(c);
    return v.toRawBytes(K(u));
  }
  function Ze(i, e, t, u) {
    if (!ae(e)) throw new Error(a);
    if (!q(t)) throw new Error(c);
    if (!D(i)) throw new Error(o);
    return r.secp256k1.verify(t, i, e, { lowS: u });
  }
  function me(i, e, t) {
    if (!ge(e)) throw new Error(a);
    if (!q(t)) throw new Error(c);
    if (!D(i)) throw new Error(o);
    return r.schnorr.verify(t, i, e);
  }
  return $.isPoint = ae, $.isPointCompressed = Ue, $.isPrivate = ce, $.isXOnlyPoint = ge, $.pointAdd = tt, $.pointAddScalar = rt, $.pointCompress = Ye, $.pointFromScalar = Be, $.pointMultiply = Re, $.privateAdd = nt, $.privateNegate = st, $.privateSub = it, $.recover = He, $.sign = Qe, $.signRecoverable = ot, $.signSchnorr = ke, $.verify = Ze, $.verifySchnorr = me, $.xOnlyPointAddTweak = et, $.xOnlyPointFromPoint = Ae, $.xOnlyPointFromScalar = Ie, $;
}
var $t = Ir();
const kr = hr($t), Ur = ar({ __proto__: null, default: kr }, [$t]);
export {
  $t as d,
  Ur as e,
  hr as g,
  Nr as s
};
