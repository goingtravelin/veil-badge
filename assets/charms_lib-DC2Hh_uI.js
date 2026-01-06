let i;
function O(e) {
  const t = i.__externref_table_alloc();
  return i.__wbindgen_externrefs.set(t, e), t;
}
function h(e) {
  const t = typeof e;
  if (t == "number" || t == "boolean" || e == null) return `${e}`;
  if (t == "string") return `"${e}"`;
  if (t == "symbol") {
    const c = e.description;
    return c == null ? "Symbol" : `Symbol(${c})`;
  }
  if (t == "function") {
    const c = e.name;
    return typeof c == "string" && c.length > 0 ? `Function(${c})` : "Function";
  }
  if (Array.isArray(e)) {
    const c = e.length;
    let o = "[";
    c > 0 && (o += h(e[0]));
    for (let _ = 1; _ < c; _++) o += ", " + h(e[_]);
    return o += "]", o;
  }
  const n = /\[object ([^\]]+)\]/.exec(toString.call(e));
  let r;
  if (n && n.length > 1) r = n[1];
  else return toString.call(e);
  if (r == "Object") try {
    return "Object(" + JSON.stringify(e) + ")";
  } catch {
    return "Object";
  }
  return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : r;
}
function x(e, t) {
  return e = e >>> 0, w().subarray(e / 1, e / 1 + t);
}
let b = null;
function f() {
  return (b === null || b.buffer.detached === true || b.buffer.detached === void 0 && b.buffer !== i.memory.buffer) && (b = new DataView(i.memory.buffer)), b;
}
function p(e, t) {
  return e = e >>> 0, B(e, t);
}
let g = null;
function w() {
  return (g === null || g.byteLength === 0) && (g = new Uint8Array(i.memory.buffer)), g;
}
function m(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    const r = O(n);
    i.__wbindgen_exn_store(r);
  }
}
function a(e) {
  return e == null;
}
function S(e, t, n) {
  if (n === void 0) {
    const s = d.encode(e), u = t(s.length, 1) >>> 0;
    return w().subarray(u, u + s.length).set(s), y = s.length, u;
  }
  let r = e.length, c = t(r, 1) >>> 0;
  const o = w();
  let _ = 0;
  for (; _ < r; _++) {
    const s = e.charCodeAt(_);
    if (s > 127) break;
    o[c + _] = s;
  }
  if (_ !== r) {
    _ !== 0 && (e = e.slice(_)), c = n(c, r, r = _ + e.length * 3, 1) >>> 0;
    const s = w().subarray(c + _, c + r), u = d.encodeInto(e, s);
    _ += u.written, c = n(c, r, _, 1) >>> 0;
  }
  return y = _, c;
}
function I(e) {
  const t = i.__wbindgen_externrefs.get(e);
  return i.__externref_table_dealloc(e), t;
}
let l = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
l.decode();
const M = 2146435072;
let A = 0;
function B(e, t) {
  return A += t, A >= M && (l = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), l.decode(), A = t), l.decode(w().subarray(e, e + t));
}
const d = new TextEncoder();
"encodeInto" in d || (d.encodeInto = function(e, t) {
  const n = d.encode(e);
  return t.set(n), { read: e.length, written: n.length };
});
let y = 0;
function W(e, t) {
  const n = i.extractAndVerifySpell(e, t);
  if (n[2]) throw I(n[1]);
  return I(n[0]);
}
const F = /* @__PURE__ */ new Set(["basic", "cors", "default"]);
async function T(e, t) {
  if (typeof Response == "function" && e instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function") try {
      return await WebAssembly.instantiateStreaming(e, t);
    } catch (r) {
      if (e.ok && F.has(e.type) && e.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", r);
      else throw r;
    }
    const n = await e.arrayBuffer();
    return await WebAssembly.instantiate(n, t);
  } else {
    const n = await WebAssembly.instantiate(e, t);
    return n instanceof WebAssembly.Instance ? { instance: n, module: e } : n;
  }
}
function E() {
  const e = {};
  return e.wbg = {}, e.wbg.__wbg_Error_52673b7de5a0ca89 = function(t, n) {
    return Error(p(t, n));
  }, e.wbg.__wbg___wbindgen_bigint_get_as_i64_6e32f5e6aff02e1d = function(t, n) {
    const r = n, c = typeof r == "bigint" ? r : void 0;
    f().setBigInt64(t + 8, a(c) ? BigInt(0) : c, true), f().setInt32(t + 0, !a(c), true);
  }, e.wbg.__wbg___wbindgen_boolean_get_dea25b33882b895b = function(t) {
    const n = t, r = typeof n == "boolean" ? n : void 0;
    return a(r) ? 16777215 : r ? 1 : 0;
  }, e.wbg.__wbg___wbindgen_debug_string_adfb662ae34724b6 = function(t, n) {
    const r = h(n), c = S(r, i.__wbindgen_malloc, i.__wbindgen_realloc), o = y;
    f().setInt32(t + 4, o, true), f().setInt32(t + 0, c, true);
  }, e.wbg.__wbg___wbindgen_in_0d3e1e8f0c669317 = function(t, n) {
    return t in n;
  }, e.wbg.__wbg___wbindgen_is_bigint_0e1a2e3f55cfae27 = function(t) {
    return typeof t == "bigint";
  }, e.wbg.__wbg___wbindgen_is_function_8d400b8b1af978cd = function(t) {
    return typeof t == "function";
  }, e.wbg.__wbg___wbindgen_is_object_ce774f3490692386 = function(t) {
    const n = t;
    return typeof n == "object" && n !== null;
  }, e.wbg.__wbg___wbindgen_is_string_704ef9c8fc131030 = function(t) {
    return typeof t == "string";
  }, e.wbg.__wbg___wbindgen_jsval_eq_b6101cc9cef1fe36 = function(t, n) {
    return t === n;
  }, e.wbg.__wbg___wbindgen_jsval_loose_eq_766057600fdd1b0d = function(t, n) {
    return t == n;
  }, e.wbg.__wbg___wbindgen_number_get_9619185a74197f95 = function(t, n) {
    const r = n, c = typeof r == "number" ? r : void 0;
    f().setFloat64(t + 8, a(c) ? 0 : c, true), f().setInt32(t + 0, !a(c), true);
  }, e.wbg.__wbg___wbindgen_string_get_a2a31e16edf96e42 = function(t, n) {
    const r = n, c = typeof r == "string" ? r : void 0;
    var o = a(c) ? 0 : S(c, i.__wbindgen_malloc, i.__wbindgen_realloc), _ = y;
    f().setInt32(t + 4, _, true), f().setInt32(t + 0, o, true);
  }, e.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(t, n) {
    throw new Error(p(t, n));
  }, e.wbg.__wbg_call_abb4ff46ce38be40 = function() {
    return m(function(t, n) {
      return t.call(n);
    }, arguments);
  }, e.wbg.__wbg_done_62ea16af4ce34b24 = function(t) {
    return t.done;
  }, e.wbg.__wbg_entries_83c79938054e065f = function(t) {
    return Object.entries(t);
  }, e.wbg.__wbg_from_29a8414a7a7cd19d = function(t) {
    return Array.from(t);
  }, e.wbg.__wbg_get_6b7bd52aca3f9671 = function(t, n) {
    return t[n >>> 0];
  }, e.wbg.__wbg_get_af9dab7e9603ea93 = function() {
    return m(function(t, n) {
      return Reflect.get(t, n);
    }, arguments);
  }, e.wbg.__wbg_instanceof_ArrayBuffer_f3320d2419cd0355 = function(t) {
    let n;
    try {
      n = t instanceof ArrayBuffer;
    } catch {
      n = false;
    }
    return n;
  }, e.wbg.__wbg_instanceof_Map_084be8da74364158 = function(t) {
    let n;
    try {
      n = t instanceof Map;
    } catch {
      n = false;
    }
    return n;
  }, e.wbg.__wbg_instanceof_Uint8Array_da54ccc9d3e09434 = function(t) {
    let n;
    try {
      n = t instanceof Uint8Array;
    } catch {
      n = false;
    }
    return n;
  }, e.wbg.__wbg_isArray_51fd9e6422c0a395 = function(t) {
    return Array.isArray(t);
  }, e.wbg.__wbg_isSafeInteger_ae7d3f054d55fa16 = function(t) {
    return Number.isSafeInteger(t);
  }, e.wbg.__wbg_iterator_27b7c8b35ab3e86b = function() {
    return Symbol.iterator;
  }, e.wbg.__wbg_length_22ac23eaec9d8053 = function(t) {
    return t.length;
  }, e.wbg.__wbg_length_d45040a40c570362 = function(t) {
    return t.length;
  }, e.wbg.__wbg_new_1ba21ce319a06297 = function() {
    return new Object();
  }, e.wbg.__wbg_new_25f239778d6112b9 = function() {
    return new Array();
  }, e.wbg.__wbg_new_6421f6084cc5bc5a = function(t) {
    return new Uint8Array(t);
  }, e.wbg.__wbg_new_b546ae120718850e = function() {
    return /* @__PURE__ */ new Map();
  }, e.wbg.__wbg_next_138a17bbf04e926c = function(t) {
    return t.next;
  }, e.wbg.__wbg_next_3cfe5c0fe2a4cc53 = function() {
    return m(function(t) {
      return t.next();
    }, arguments);
  }, e.wbg.__wbg_prototypesetcall_dfe9b766cdc1f1fd = function(t, n, r) {
    Uint8Array.prototype.set.call(x(t, n), r);
  }, e.wbg.__wbg_set_3f1d0b984ed272ed = function(t, n, r) {
    t[n] = r;
  }, e.wbg.__wbg_set_7df433eea03a5c14 = function(t, n, r) {
    t[n >>> 0] = r;
  }, e.wbg.__wbg_set_efaaf145b9377369 = function(t, n, r) {
    return t.set(n, r);
  }, e.wbg.__wbg_value_57b7b035e117f7ee = function(t) {
    return t.value;
  }, e.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(t, n) {
    return p(t, n);
  }, e.wbg.__wbindgen_cast_2ddd8a25ff58642a = function(t, n) {
    return BigInt.asUintN(64, t) | n << BigInt(64);
  }, e.wbg.__wbindgen_cast_4625c577ab2ec9ee = function(t) {
    return BigInt.asUintN(64, t);
  }, e.wbg.__wbindgen_cast_9ae0607507abb057 = function(t) {
    return t;
  }, e.wbg.__wbindgen_cast_cb9088102bce6b30 = function(t, n) {
    return x(t, n);
  }, e.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(t) {
    return t;
  }, e.wbg.__wbindgen_cast_e7b45dd881f38ce3 = function(t, n) {
    return BigInt.asUintN(64, t) | BigInt.asUintN(64, n) << BigInt(64);
  }, e.wbg.__wbindgen_init_externref_table = function() {
    const t = i.__wbindgen_externrefs, n = t.grow(4);
    t.set(0, void 0), t.set(n + 0, void 0), t.set(n + 1, null), t.set(n + 2, true), t.set(n + 3, false);
  }, e;
}
function j(e, t) {
  return i = e.exports, U.__wbindgen_wasm_module = t, b = null, g = null, i.__wbindgen_start(), i;
}
function R(e) {
  if (i !== void 0) return i;
  typeof e < "u" && (Object.getPrototypeOf(e) === Object.prototype ? { module: e } = e : console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));
  const t = E();
  e instanceof WebAssembly.Module || (e = new WebAssembly.Module(e));
  const n = new WebAssembly.Instance(e, t);
  return j(n, e);
}
async function U(e) {
  if (i !== void 0) return i;
  typeof e < "u" && (Object.getPrototypeOf(e) === Object.prototype ? { module_or_path: e } = e : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), typeof e > "u" && (e = new URL("/veil-badge/wasm/charms_lib_bg.wasm", import.meta.url));
  const t = E();
  (typeof e == "string" || typeof Request == "function" && e instanceof Request || typeof URL == "function" && e instanceof URL) && (e = fetch(e));
  const { instance: n, module: r } = await T(await e, t);
  return j(n, r);
}
export {
  U as default,
  W as extractAndVerifySpell,
  R as initSync
};
