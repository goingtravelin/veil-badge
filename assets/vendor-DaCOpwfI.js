var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { g as ss } from "./bitcoin-vendor-GUW4GuwG.js";
function cs(e, r) {
  for (var t = 0; t < r.length; t++) {
    const n = r[t];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const a in n) if (a !== "default" && !(a in e)) {
        const o = Object.getOwnPropertyDescriptor(n, a);
        o && Object.defineProperty(e, a, o.get ? o : { enumerable: true, get: () => n[a] });
      }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var Vt = { exports: {} }, Gt = {};
/**
* @license React
* scheduler.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var lo;
function us() {
  return lo || (lo = 1, (function(e) {
    function r(y, z) {
      var D = y.length;
      y.push(z);
      e: for (; 0 < D; ) {
        var I = D - 1 >>> 1, H = y[I];
        if (0 < a(H, z)) y[I] = z, y[D] = H, D = I;
        else break e;
      }
    }
    function t(y) {
      return y.length === 0 ? null : y[0];
    }
    function n(y) {
      if (y.length === 0) return null;
      var z = y[0], D = y.pop();
      if (D !== z) {
        y[0] = D;
        e: for (var I = 0, H = y.length, X = H >>> 1; I < X; ) {
          var Z = 2 * (I + 1) - 1, ee = y[Z], ce = Z + 1, ue = y[ce];
          if (0 > a(ee, D)) ce < H && 0 > a(ue, ee) ? (y[I] = ue, y[ce] = D, I = ce) : (y[I] = ee, y[Z] = D, I = Z);
          else if (ce < H && 0 > a(ue, D)) y[I] = ue, y[ce] = D, I = ce;
          else break e;
        }
      }
      return z;
    }
    function a(y, z) {
      var D = y.sortIndex - z.sortIndex;
      return D !== 0 ? D : y.id - z.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var o = performance;
      e.unstable_now = function() {
        return o.now();
      };
    } else {
      var i = Date, s = i.now();
      e.unstable_now = function() {
        return i.now() - s;
      };
    }
    var f = [], g = [], h = 1, v = null, w = 3, p = false, m = false, x = false, j = typeof setTimeout == "function" ? setTimeout : null, P = typeof clearTimeout == "function" ? clearTimeout : null, S = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function _(y) {
      for (var z = t(g); z !== null; ) {
        if (z.callback === null) n(g);
        else if (z.startTime <= y) n(g), z.sortIndex = z.expirationTime, r(f, z);
        else break;
        z = t(g);
      }
    }
    function M(y) {
      if (x = false, _(y), !m) if (t(f) !== null) m = true, V(W);
      else {
        var z = t(g);
        z !== null && L(M, z.startTime - y);
      }
    }
    function W(y, z) {
      m = false, x && (x = false, P(N), N = -1), p = true;
      var D = w;
      try {
        for (_(z), v = t(f); v !== null && (!(v.expirationTime > z) || y && !q()); ) {
          var I = v.callback;
          if (typeof I == "function") {
            v.callback = null, w = v.priorityLevel;
            var H = I(v.expirationTime <= z);
            z = e.unstable_now(), typeof H == "function" ? v.callback = H : v === t(f) && n(f), _(z);
          } else n(f);
          v = t(f);
        }
        if (v !== null) var X = true;
        else {
          var Z = t(g);
          Z !== null && L(M, Z.startTime - z), X = false;
        }
        return X;
      } finally {
        v = null, w = D, p = false;
      }
    }
    var U = false, R = null, N = -1, k = 5, C = -1;
    function q() {
      return !(e.unstable_now() - C < k);
    }
    function B() {
      if (R !== null) {
        var y = e.unstable_now();
        C = y;
        var z = true;
        try {
          z = R(true, y);
        } finally {
          z ? F() : (U = false, R = null);
        }
      } else U = false;
    }
    var F;
    if (typeof S == "function") F = function() {
      S(B);
    };
    else if (typeof MessageChannel < "u") {
      var G = new MessageChannel(), A = G.port2;
      G.port1.onmessage = B, F = function() {
        A.postMessage(null);
      };
    } else F = function() {
      j(B, 0);
    };
    function V(y) {
      R = y, U || (U = true, F());
    }
    function L(y, z) {
      N = j(function() {
        y(e.unstable_now());
      }, z);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(y) {
      y.callback = null;
    }, e.unstable_continueExecution = function() {
      m || p || (m = true, V(W));
    }, e.unstable_forceFrameRate = function(y) {
      0 > y || 125 < y ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : k = 0 < y ? Math.floor(1e3 / y) : 5;
    }, e.unstable_getCurrentPriorityLevel = function() {
      return w;
    }, e.unstable_getFirstCallbackNode = function() {
      return t(f);
    }, e.unstable_next = function(y) {
      switch (w) {
        case 1:
        case 2:
        case 3:
          var z = 3;
          break;
        default:
          z = w;
      }
      var D = w;
      w = z;
      try {
        return y();
      } finally {
        w = D;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(y, z) {
      switch (y) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          y = 3;
      }
      var D = w;
      w = y;
      try {
        return z();
      } finally {
        w = D;
      }
    }, e.unstable_scheduleCallback = function(y, z, D) {
      var I = e.unstable_now();
      switch (typeof D == "object" && D !== null ? (D = D.delay, D = typeof D == "number" && 0 < D ? I + D : I) : D = I, y) {
        case 1:
          var H = -1;
          break;
        case 2:
          H = 250;
          break;
        case 5:
          H = 1073741823;
          break;
        case 4:
          H = 1e4;
          break;
        default:
          H = 5e3;
      }
      return H = D + H, y = { id: h++, callback: z, priorityLevel: y, startTime: D, expirationTime: H, sortIndex: -1 }, D > I ? (y.sortIndex = D, r(g, y), t(f) === null && y === t(g) && (x ? (P(N), N = -1) : x = true, L(M, D - I))) : (y.sortIndex = H, r(f, y), m || p || (m = true, V(W))), y;
    }, e.unstable_shouldYield = q, e.unstable_wrapCallback = function(y) {
      var z = w;
      return function() {
        var D = w;
        w = z;
        try {
          return y.apply(this, arguments);
        } finally {
          w = D;
        }
      };
    };
  })(Gt)), Gt;
}
var fo;
function Nf() {
  return fo || (fo = 1, Vt.exports = us()), Vt.exports;
}
/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */
function ga(e) {
  return typeof e > "u" || e === null;
}
function ls(e) {
  return typeof e == "object" && e !== null;
}
function fs(e) {
  return Array.isArray(e) ? e : ga(e) ? [] : [e];
}
function ds(e, r) {
  var t, n, a, o;
  if (r) for (o = Object.keys(r), t = 0, n = o.length; t < n; t += 1) a = o[t], e[a] = r[a];
  return e;
}
function hs(e, r) {
  var t = "", n;
  for (n = 0; n < r; n += 1) t += e;
  return t;
}
function ps(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
var ms = ga, gs = ls, bs = fs, ys = hs, vs = ps, ws = ds, Ze = { isNothing: ms, isObject: gs, toArray: bs, repeat: ys, isNegativeZero: vs, extend: ws };
function ba(e, r) {
  var t = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (t += 'in "' + e.mark.name + '" '), t += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !r && e.mark.snippet && (t += `

` + e.mark.snippet), n + " " + t) : n;
}
function dt(e, r) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = r, this.message = ba(this, false), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
dt.prototype = Object.create(Error.prototype);
dt.prototype.constructor = dt;
dt.prototype.toString = function(r) {
  return this.name + ": " + ba(this, r);
};
var pr = dt;
function Wt(e, r, t, n, a) {
  var o = "", i = "", s = Math.floor(a / 2) - 1;
  return n - r > s && (o = " ... ", r = n - s + o.length), t - n > s && (i = " ...", t = n + s - i.length), { str: o + e.slice(r, t).replace(/\t/g, "\u2192") + i, pos: n - r + o.length };
}
function Yt(e, r) {
  return Ze.repeat(" ", r - e.length) + e;
}
function xs(e, r) {
  if (r = Object.create(r || null), !e.buffer) return null;
  r.maxLength || (r.maxLength = 79), typeof r.indent != "number" && (r.indent = 1), typeof r.linesBefore != "number" && (r.linesBefore = 3), typeof r.linesAfter != "number" && (r.linesAfter = 2);
  for (var t = /\r?\n|\r|\0/g, n = [0], a = [], o, i = -1; o = t.exec(e.buffer); ) a.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && i < 0 && (i = n.length - 2);
  i < 0 && (i = n.length - 1);
  var s = "", f, g, h = Math.min(e.line + r.linesAfter, a.length).toString().length, v = r.maxLength - (r.indent + h + 3);
  for (f = 1; f <= r.linesBefore && !(i - f < 0); f++) g = Wt(e.buffer, n[i - f], a[i - f], e.position - (n[i] - n[i - f]), v), s = Ze.repeat(" ", r.indent) + Yt((e.line - f + 1).toString(), h) + " | " + g.str + `
` + s;
  for (g = Wt(e.buffer, n[i], a[i], e.position, v), s += Ze.repeat(" ", r.indent) + Yt((e.line + 1).toString(), h) + " | " + g.str + `
`, s += Ze.repeat("-", r.indent + h + 3 + g.pos) + `^
`, f = 1; f <= r.linesAfter && !(i + f >= a.length); f++) g = Wt(e.buffer, n[i + f], a[i + f], e.position - (n[i] - n[i + f]), v), s += Ze.repeat(" ", r.indent) + Yt((e.line + f + 1).toString(), h) + " | " + g.str + `
`;
  return s.replace(/\n$/, "");
}
var ks = xs, Es = ["kind", "multi", "resolve", "construct", "instanceOf", "predicate", "represent", "representName", "defaultStyle", "styleAliases"], Bs = ["scalar", "sequence", "mapping"];
function Is(e) {
  var r = {};
  return e !== null && Object.keys(e).forEach(function(t) {
    e[t].forEach(function(n) {
      r[String(n)] = t;
    });
  }), r;
}
function _s(e, r) {
  if (r = r || {}, Object.keys(r).forEach(function(t) {
    if (Es.indexOf(t) === -1) throw new pr('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = r, this.tag = e, this.kind = r.kind || null, this.resolve = r.resolve || function() {
    return true;
  }, this.construct = r.construct || function(t) {
    return t;
  }, this.instanceOf = r.instanceOf || null, this.predicate = r.predicate || null, this.represent = r.represent || null, this.representName = r.representName || null, this.defaultStyle = r.defaultStyle || null, this.multi = r.multi || false, this.styleAliases = Is(r.styleAliases || null), Bs.indexOf(this.kind) === -1) throw new pr('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Ye = _s;
function ho(e, r) {
  var t = [];
  return e[r].forEach(function(n) {
    var a = t.length;
    t.forEach(function(o, i) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (a = i);
    }), t[a] = n;
  }), t;
}
function As() {
  var e = { scalar: {}, sequence: {}, mapping: {}, fallback: {}, multi: { scalar: [], sequence: [], mapping: [], fallback: [] } }, r, t;
  function n(a) {
    a.multi ? (e.multi[a.kind].push(a), e.multi.fallback.push(a)) : e[a.kind][a.tag] = e.fallback[a.tag] = a;
  }
  for (r = 0, t = arguments.length; r < t; r += 1) arguments[r].forEach(n);
  return e;
}
function Kn(e) {
  return this.extend(e);
}
Kn.prototype.extend = function(r) {
  var t = [], n = [];
  if (r instanceof Ye) n.push(r);
  else if (Array.isArray(r)) n = n.concat(r);
  else if (r && (Array.isArray(r.implicit) || Array.isArray(r.explicit))) r.implicit && (t = t.concat(r.implicit)), r.explicit && (n = n.concat(r.explicit));
  else throw new pr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  t.forEach(function(o) {
    if (!(o instanceof Ye)) throw new pr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar") throw new pr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi) throw new pr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof Ye)) throw new pr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var a = Object.create(Kn.prototype);
  return a.implicit = (this.implicit || []).concat(t), a.explicit = (this.explicit || []).concat(n), a.compiledImplicit = ho(a, "implicit"), a.compiledExplicit = ho(a, "explicit"), a.compiledTypeMap = As(a.compiledImplicit, a.compiledExplicit), a;
};
var Ss = Kn, Ts = new Ye("tag:yaml.org,2002:str", { kind: "scalar", construct: function(e) {
  return e !== null ? e : "";
} }), zs = new Ye("tag:yaml.org,2002:seq", { kind: "sequence", construct: function(e) {
  return e !== null ? e : [];
} }), Cs = new Ye("tag:yaml.org,2002:map", { kind: "mapping", construct: function(e) {
  return e !== null ? e : {};
} }), js = new Ss({ explicit: [Ts, zs, Cs] });
function Rs(e) {
  if (e === null) return true;
  var r = e.length;
  return r === 1 && e === "~" || r === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Us() {
  return null;
}
function Ns(e) {
  return e === null;
}
var Ls = new Ye("tag:yaml.org,2002:null", { kind: "scalar", resolve: Rs, construct: Us, predicate: Ns, represent: { canonical: function() {
  return "~";
}, lowercase: function() {
  return "null";
}, uppercase: function() {
  return "NULL";
}, camelcase: function() {
  return "Null";
}, empty: function() {
  return "";
} }, defaultStyle: "lowercase" });
function Os(e) {
  if (e === null) return false;
  var r = e.length;
  return r === 4 && (e === "true" || e === "True" || e === "TRUE") || r === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function qs(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Fs(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Ps = new Ye("tag:yaml.org,2002:bool", { kind: "scalar", resolve: Os, construct: qs, predicate: Fs, represent: { lowercase: function(e) {
  return e ? "true" : "false";
}, uppercase: function(e) {
  return e ? "TRUE" : "FALSE";
}, camelcase: function(e) {
  return e ? "True" : "False";
} }, defaultStyle: "lowercase" });
function Ms(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Hs(e) {
  return 48 <= e && e <= 55;
}
function Ds(e) {
  return 48 <= e && e <= 57;
}
function Ks(e) {
  if (e === null) return false;
  var r = e.length, t = 0, n = false, a;
  if (!r) return false;
  if (a = e[t], (a === "-" || a === "+") && (a = e[++t]), a === "0") {
    if (t + 1 === r) return true;
    if (a = e[++t], a === "b") {
      for (t++; t < r; t++) if (a = e[t], a !== "_") {
        if (a !== "0" && a !== "1") return false;
        n = true;
      }
      return n && a !== "_";
    }
    if (a === "x") {
      for (t++; t < r; t++) if (a = e[t], a !== "_") {
        if (!Ms(e.charCodeAt(t))) return false;
        n = true;
      }
      return n && a !== "_";
    }
    if (a === "o") {
      for (t++; t < r; t++) if (a = e[t], a !== "_") {
        if (!Hs(e.charCodeAt(t))) return false;
        n = true;
      }
      return n && a !== "_";
    }
  }
  if (a === "_") return false;
  for (; t < r; t++) if (a = e[t], a !== "_") {
    if (!Ds(e.charCodeAt(t))) return false;
    n = true;
  }
  return !(!n || a === "_");
}
function Vs(e) {
  var r = e, t = 1, n;
  if (r.indexOf("_") !== -1 && (r = r.replace(/_/g, "")), n = r[0], (n === "-" || n === "+") && (n === "-" && (t = -1), r = r.slice(1), n = r[0]), r === "0") return 0;
  if (n === "0") {
    if (r[1] === "b") return t * parseInt(r.slice(2), 2);
    if (r[1] === "x") return t * parseInt(r.slice(2), 16);
    if (r[1] === "o") return t * parseInt(r.slice(2), 8);
  }
  return t * parseInt(r, 10);
}
function Gs(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Ze.isNegativeZero(e);
}
var Ws = new Ye("tag:yaml.org,2002:int", { kind: "scalar", resolve: Ks, construct: Vs, predicate: Gs, represent: { binary: function(e) {
  return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
}, octal: function(e) {
  return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
}, decimal: function(e) {
  return e.toString(10);
}, hexadecimal: function(e) {
  return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
} }, defaultStyle: "decimal", styleAliases: { binary: [2, "bin"], octal: [8, "oct"], decimal: [10, "dec"], hexadecimal: [16, "hex"] } }), Ys = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Xs(e) {
  return !(e === null || !Ys.test(e) || e[e.length - 1] === "_");
}
function Js(e) {
  var r, t;
  return r = e.replace(/_/g, "").toLowerCase(), t = r[0] === "-" ? -1 : 1, "+-".indexOf(r[0]) >= 0 && (r = r.slice(1)), r === ".inf" ? t === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : r === ".nan" ? NaN : t * parseFloat(r, 10);
}
var Zs = /^[-+]?[0-9]+e/;
function Qs(e, r) {
  var t;
  if (isNaN(e)) switch (r) {
    case "lowercase":
      return ".nan";
    case "uppercase":
      return ".NAN";
    case "camelcase":
      return ".NaN";
  }
  else if (Number.POSITIVE_INFINITY === e) switch (r) {
    case "lowercase":
      return ".inf";
    case "uppercase":
      return ".INF";
    case "camelcase":
      return ".Inf";
  }
  else if (Number.NEGATIVE_INFINITY === e) switch (r) {
    case "lowercase":
      return "-.inf";
    case "uppercase":
      return "-.INF";
    case "camelcase":
      return "-.Inf";
  }
  else if (Ze.isNegativeZero(e)) return "-0.0";
  return t = e.toString(10), Zs.test(t) ? t.replace("e", ".e") : t;
}
function $s(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Ze.isNegativeZero(e));
}
var ec = new Ye("tag:yaml.org,2002:float", { kind: "scalar", resolve: Xs, construct: Js, predicate: $s, represent: Qs, defaultStyle: "lowercase" }), rc = js.extend({ implicit: [Ls, Ps, Ws, ec] }), tc = rc, ya = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), va = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function nc(e) {
  return e === null ? false : ya.exec(e) !== null || va.exec(e) !== null;
}
function oc(e) {
  var r, t, n, a, o, i, s, f = 0, g = null, h, v, w;
  if (r = ya.exec(e), r === null && (r = va.exec(e)), r === null) throw new Error("Date resolve error");
  if (t = +r[1], n = +r[2] - 1, a = +r[3], !r[4]) return new Date(Date.UTC(t, n, a));
  if (o = +r[4], i = +r[5], s = +r[6], r[7]) {
    for (f = r[7].slice(0, 3); f.length < 3; ) f += "0";
    f = +f;
  }
  return r[9] && (h = +r[10], v = +(r[11] || 0), g = (h * 60 + v) * 6e4, r[9] === "-" && (g = -g)), w = new Date(Date.UTC(t, n, a, o, i, s, f)), g && w.setTime(w.getTime() - g), w;
}
function ic(e) {
  return e.toISOString();
}
var ac = new Ye("tag:yaml.org,2002:timestamp", { kind: "scalar", resolve: nc, construct: oc, instanceOf: Date, represent: ic });
function sc(e) {
  return e === "<<" || e === null;
}
var cc = new Ye("tag:yaml.org,2002:merge", { kind: "scalar", resolve: sc }), Jn = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function uc(e) {
  if (e === null) return false;
  var r, t, n = 0, a = e.length, o = Jn;
  for (t = 0; t < a; t++) if (r = o.indexOf(e.charAt(t)), !(r > 64)) {
    if (r < 0) return false;
    n += 6;
  }
  return n % 8 === 0;
}
function lc(e) {
  var r, t, n = e.replace(/[\r\n=]/g, ""), a = n.length, o = Jn, i = 0, s = [];
  for (r = 0; r < a; r++) r % 4 === 0 && r && (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)), i = i << 6 | o.indexOf(n.charAt(r));
  return t = a % 4 * 6, t === 0 ? (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)) : t === 18 ? (s.push(i >> 10 & 255), s.push(i >> 2 & 255)) : t === 12 && s.push(i >> 4 & 255), new Uint8Array(s);
}
function fc(e) {
  var r = "", t = 0, n, a, o = e.length, i = Jn;
  for (n = 0; n < o; n++) n % 3 === 0 && n && (r += i[t >> 18 & 63], r += i[t >> 12 & 63], r += i[t >> 6 & 63], r += i[t & 63]), t = (t << 8) + e[n];
  return a = o % 3, a === 0 ? (r += i[t >> 18 & 63], r += i[t >> 12 & 63], r += i[t >> 6 & 63], r += i[t & 63]) : a === 2 ? (r += i[t >> 10 & 63], r += i[t >> 4 & 63], r += i[t << 2 & 63], r += i[64]) : a === 1 && (r += i[t >> 2 & 63], r += i[t << 4 & 63], r += i[64], r += i[64]), r;
}
function dc(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var hc = new Ye("tag:yaml.org,2002:binary", { kind: "scalar", resolve: uc, construct: lc, predicate: dc, represent: fc }), pc = Object.prototype.hasOwnProperty, mc = Object.prototype.toString;
function gc(e) {
  if (e === null) return true;
  var r = [], t, n, a, o, i, s = e;
  for (t = 0, n = s.length; t < n; t += 1) {
    if (a = s[t], i = false, mc.call(a) !== "[object Object]") return false;
    for (o in a) if (pc.call(a, o)) if (!i) i = true;
    else return false;
    if (!i) return false;
    if (r.indexOf(o) === -1) r.push(o);
    else return false;
  }
  return true;
}
function bc(e) {
  return e !== null ? e : [];
}
var yc = new Ye("tag:yaml.org,2002:omap", { kind: "sequence", resolve: gc, construct: bc }), vc = Object.prototype.toString;
function wc(e) {
  if (e === null) return true;
  var r, t, n, a, o, i = e;
  for (o = new Array(i.length), r = 0, t = i.length; r < t; r += 1) {
    if (n = i[r], vc.call(n) !== "[object Object]" || (a = Object.keys(n), a.length !== 1)) return false;
    o[r] = [a[0], n[a[0]]];
  }
  return true;
}
function xc(e) {
  if (e === null) return [];
  var r, t, n, a, o, i = e;
  for (o = new Array(i.length), r = 0, t = i.length; r < t; r += 1) n = i[r], a = Object.keys(n), o[r] = [a[0], n[a[0]]];
  return o;
}
var kc = new Ye("tag:yaml.org,2002:pairs", { kind: "sequence", resolve: wc, construct: xc }), Ec = Object.prototype.hasOwnProperty;
function Bc(e) {
  if (e === null) return true;
  var r, t = e;
  for (r in t) if (Ec.call(t, r) && t[r] !== null) return false;
  return true;
}
function Ic(e) {
  return e !== null ? e : {};
}
var _c = new Ye("tag:yaml.org,2002:set", { kind: "mapping", resolve: Bc, construct: Ic }), Ac = tc.extend({ implicit: [ac, cc], explicit: [hc, yc, kc, _c] }), Or = Object.prototype.hasOwnProperty, Ct = 1, wa = 2, xa = 3, jt = 4, Xt = 1, Sc = 2, po = 3, Tc = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, zc = /[\x85\u2028\u2029]/, Cc = /[,\[\]\{\}]/, ka = /^(?:!|!!|![a-z\-]+!)$/i, Ea = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function mo(e) {
  return Object.prototype.toString.call(e);
}
function sr(e) {
  return e === 10 || e === 13;
}
function Hr(e) {
  return e === 9 || e === 32;
}
function Qe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function rt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function jc(e) {
  var r;
  return 48 <= e && e <= 57 ? e - 48 : (r = e | 32, 97 <= r && r <= 102 ? r - 97 + 10 : -1);
}
function Rc(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Uc(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function go(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "\x85" : e === 95 ? "\xA0" : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Nc(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
}
function Ba(e, r, t) {
  r === "__proto__" ? Object.defineProperty(e, r, { configurable: true, enumerable: true, writable: true, value: t }) : e[r] = t;
}
var Ia = new Array(256), _a = new Array(256);
for (var Gr = 0; Gr < 256; Gr++) Ia[Gr] = go(Gr) ? 1 : 0, _a[Gr] = go(Gr);
function Lc(e, r) {
  this.input = e, this.filename = r.filename || null, this.schema = r.schema || Ac, this.onWarning = r.onWarning || null, this.legacy = r.legacy || false, this.json = r.json || false, this.listener = r.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Aa(e, r) {
  var t = { name: e.filename, buffer: e.input.slice(0, -1), position: e.position, line: e.line, column: e.position - e.lineStart };
  return t.snippet = ks(t), new pr(r, t);
}
function ve(e, r) {
  throw Aa(e, r);
}
function Rt(e, r) {
  e.onWarning && e.onWarning.call(null, Aa(e, r));
}
var bo = { YAML: function(r, t, n) {
  var a, o, i;
  r.version !== null && ve(r, "duplication of %YAML directive"), n.length !== 1 && ve(r, "YAML directive accepts exactly one argument"), a = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), a === null && ve(r, "ill-formed argument of the YAML directive"), o = parseInt(a[1], 10), i = parseInt(a[2], 10), o !== 1 && ve(r, "unacceptable YAML version of the document"), r.version = n[0], r.checkLineBreaks = i < 2, i !== 1 && i !== 2 && Rt(r, "unsupported YAML version of the document");
}, TAG: function(r, t, n) {
  var a, o;
  n.length !== 2 && ve(r, "TAG directive accepts exactly two arguments"), a = n[0], o = n[1], ka.test(a) || ve(r, "ill-formed tag handle (first argument) of the TAG directive"), Or.call(r.tagMap, a) && ve(r, 'there is a previously declared suffix for "' + a + '" tag handle'), Ea.test(o) || ve(r, "ill-formed tag prefix (second argument) of the TAG directive");
  try {
    o = decodeURIComponent(o);
  } catch {
    ve(r, "tag prefix is malformed: " + o);
  }
  r.tagMap[a] = o;
} };
function Lr(e, r, t, n) {
  var a, o, i, s;
  if (r < t) {
    if (s = e.input.slice(r, t), n) for (a = 0, o = s.length; a < o; a += 1) i = s.charCodeAt(a), i === 9 || 32 <= i && i <= 1114111 || ve(e, "expected valid JSON character");
    else Tc.test(s) && ve(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function yo(e, r, t, n) {
  var a, o, i, s;
  for (Ze.isObject(t) || ve(e, "cannot merge mappings; the provided source object is unacceptable"), a = Object.keys(t), i = 0, s = a.length; i < s; i += 1) o = a[i], Or.call(r, o) || (Ba(r, o, t[o]), n[o] = true);
}
function tt(e, r, t, n, a, o, i, s, f) {
  var g, h;
  if (Array.isArray(a)) for (a = Array.prototype.slice.call(a), g = 0, h = a.length; g < h; g += 1) Array.isArray(a[g]) && ve(e, "nested arrays are not supported inside keys"), typeof a == "object" && mo(a[g]) === "[object Object]" && (a[g] = "[object Object]");
  if (typeof a == "object" && mo(a) === "[object Object]" && (a = "[object Object]"), a = String(a), r === null && (r = {}), n === "tag:yaml.org,2002:merge") if (Array.isArray(o)) for (g = 0, h = o.length; g < h; g += 1) yo(e, r, o[g], t);
  else yo(e, r, o, t);
  else !e.json && !Or.call(t, a) && Or.call(r, a) && (e.line = i || e.line, e.lineStart = s || e.lineStart, e.position = f || e.position, ve(e, "duplicated mapping key")), Ba(r, a, o), delete t[a];
  return r;
}
function Zn(e) {
  var r;
  r = e.input.charCodeAt(e.position), r === 10 ? e.position++ : r === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : ve(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Pe(e, r, t) {
  for (var n = 0, a = e.input.charCodeAt(e.position); a !== 0; ) {
    for (; Hr(a); ) a === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), a = e.input.charCodeAt(++e.position);
    if (r && a === 35) do
      a = e.input.charCodeAt(++e.position);
    while (a !== 10 && a !== 13 && a !== 0);
    if (sr(a)) for (Zn(e), a = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; a === 32; ) e.lineIndent++, a = e.input.charCodeAt(++e.position);
    else break;
  }
  return t !== -1 && n !== 0 && e.lineIndent < t && Rt(e, "deficient indentation"), n;
}
function Lt(e) {
  var r = e.position, t;
  return t = e.input.charCodeAt(r), !!((t === 45 || t === 46) && t === e.input.charCodeAt(r + 1) && t === e.input.charCodeAt(r + 2) && (r += 3, t = e.input.charCodeAt(r), t === 0 || Qe(t)));
}
function Qn(e, r) {
  r === 1 ? e.result += " " : r > 1 && (e.result += Ze.repeat(`
`, r - 1));
}
function Oc(e, r, t) {
  var n, a, o, i, s, f, g, h, v = e.kind, w = e.result, p;
  if (p = e.input.charCodeAt(e.position), Qe(p) || rt(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (a = e.input.charCodeAt(e.position + 1), Qe(a) || t && rt(a))) return false;
  for (e.kind = "scalar", e.result = "", o = i = e.position, s = false; p !== 0; ) {
    if (p === 58) {
      if (a = e.input.charCodeAt(e.position + 1), Qe(a) || t && rt(a)) break;
    } else if (p === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Qe(n)) break;
    } else {
      if (e.position === e.lineStart && Lt(e) || t && rt(p)) break;
      if (sr(p)) if (f = e.line, g = e.lineStart, h = e.lineIndent, Pe(e, false, -1), e.lineIndent >= r) {
        s = true, p = e.input.charCodeAt(e.position);
        continue;
      } else {
        e.position = i, e.line = f, e.lineStart = g, e.lineIndent = h;
        break;
      }
    }
    s && (Lr(e, o, i, false), Qn(e, e.line - f), o = i = e.position, s = false), Hr(p) || (i = e.position + 1), p = e.input.charCodeAt(++e.position);
  }
  return Lr(e, o, i, false), e.result ? true : (e.kind = v, e.result = w, false);
}
function qc(e, r) {
  var t, n, a;
  if (t = e.input.charCodeAt(e.position), t !== 39) return false;
  for (e.kind = "scalar", e.result = "", e.position++, n = a = e.position; (t = e.input.charCodeAt(e.position)) !== 0; ) if (t === 39) if (Lr(e, n, e.position, true), t = e.input.charCodeAt(++e.position), t === 39) n = e.position, e.position++, a = e.position;
  else return true;
  else sr(t) ? (Lr(e, n, a, true), Qn(e, Pe(e, false, r)), n = a = e.position) : e.position === e.lineStart && Lt(e) ? ve(e, "unexpected end of the document within a single quoted scalar") : (e.position++, a = e.position);
  ve(e, "unexpected end of the stream within a single quoted scalar");
}
function Fc(e, r) {
  var t, n, a, o, i, s;
  if (s = e.input.charCodeAt(e.position), s !== 34) return false;
  for (e.kind = "scalar", e.result = "", e.position++, t = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34) return Lr(e, t, e.position, true), e.position++, true;
    if (s === 92) {
      if (Lr(e, t, e.position, true), s = e.input.charCodeAt(++e.position), sr(s)) Pe(e, false, r);
      else if (s < 256 && Ia[s]) e.result += _a[s], e.position++;
      else if ((i = Rc(s)) > 0) {
        for (a = i, o = 0; a > 0; a--) s = e.input.charCodeAt(++e.position), (i = jc(s)) >= 0 ? o = (o << 4) + i : ve(e, "expected hexadecimal character");
        e.result += Nc(o), e.position++;
      } else ve(e, "unknown escape sequence");
      t = n = e.position;
    } else sr(s) ? (Lr(e, t, n, true), Qn(e, Pe(e, false, r)), t = n = e.position) : e.position === e.lineStart && Lt(e) ? ve(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  ve(e, "unexpected end of the stream within a double quoted scalar");
}
function Pc(e, r) {
  var t = true, n, a, o, i = e.tag, s, f = e.anchor, g, h, v, w, p, m = /* @__PURE__ */ Object.create(null), x, j, P, S;
  if (S = e.input.charCodeAt(e.position), S === 91) h = 93, p = false, s = [];
  else if (S === 123) h = 125, p = true, s = {};
  else return false;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), S = e.input.charCodeAt(++e.position); S !== 0; ) {
    if (Pe(e, true, r), S = e.input.charCodeAt(e.position), S === h) return e.position++, e.tag = i, e.anchor = f, e.kind = p ? "mapping" : "sequence", e.result = s, true;
    t ? S === 44 && ve(e, "expected the node content, but found ','") : ve(e, "missed comma between flow collection entries"), j = x = P = null, v = w = false, S === 63 && (g = e.input.charCodeAt(e.position + 1), Qe(g) && (v = w = true, e.position++, Pe(e, true, r))), n = e.line, a = e.lineStart, o = e.position, nt(e, r, Ct, false, true), j = e.tag, x = e.result, Pe(e, true, r), S = e.input.charCodeAt(e.position), (w || e.line === n) && S === 58 && (v = true, S = e.input.charCodeAt(++e.position), Pe(e, true, r), nt(e, r, Ct, false, true), P = e.result), p ? tt(e, s, m, j, x, P, n, a, o) : v ? s.push(tt(e, null, m, j, x, P, n, a, o)) : s.push(x), Pe(e, true, r), S = e.input.charCodeAt(e.position), S === 44 ? (t = true, S = e.input.charCodeAt(++e.position)) : t = false;
  }
  ve(e, "unexpected end of the stream within a flow collection");
}
function Mc(e, r) {
  var t, n, a = Xt, o = false, i = false, s = r, f = 0, g = false, h, v;
  if (v = e.input.charCodeAt(e.position), v === 124) n = false;
  else if (v === 62) n = true;
  else return false;
  for (e.kind = "scalar", e.result = ""; v !== 0; ) if (v = e.input.charCodeAt(++e.position), v === 43 || v === 45) Xt === a ? a = v === 43 ? po : Sc : ve(e, "repeat of a chomping mode identifier");
  else if ((h = Uc(v)) >= 0) h === 0 ? ve(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : i ? ve(e, "repeat of an indentation width identifier") : (s = r + h - 1, i = true);
  else break;
  if (Hr(v)) {
    do
      v = e.input.charCodeAt(++e.position);
    while (Hr(v));
    if (v === 35) do
      v = e.input.charCodeAt(++e.position);
    while (!sr(v) && v !== 0);
  }
  for (; v !== 0; ) {
    for (Zn(e), e.lineIndent = 0, v = e.input.charCodeAt(e.position); (!i || e.lineIndent < s) && v === 32; ) e.lineIndent++, v = e.input.charCodeAt(++e.position);
    if (!i && e.lineIndent > s && (s = e.lineIndent), sr(v)) {
      f++;
      continue;
    }
    if (e.lineIndent < s) {
      a === po ? e.result += Ze.repeat(`
`, o ? 1 + f : f) : a === Xt && o && (e.result += `
`);
      break;
    }
    for (n ? Hr(v) ? (g = true, e.result += Ze.repeat(`
`, o ? 1 + f : f)) : g ? (g = false, e.result += Ze.repeat(`
`, f + 1)) : f === 0 ? o && (e.result += " ") : e.result += Ze.repeat(`
`, f) : e.result += Ze.repeat(`
`, o ? 1 + f : f), o = true, i = true, f = 0, t = e.position; !sr(v) && v !== 0; ) v = e.input.charCodeAt(++e.position);
    Lr(e, t, e.position, false);
  }
  return true;
}
function vo(e, r) {
  var t, n = e.tag, a = e.anchor, o = [], i, s = false, f;
  if (e.firstTabInLine !== -1) return false;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), f = e.input.charCodeAt(e.position); f !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ve(e, "tab characters must not be used in indentation")), !(f !== 45 || (i = e.input.charCodeAt(e.position + 1), !Qe(i)))); ) {
    if (s = true, e.position++, Pe(e, true, -1) && e.lineIndent <= r) {
      o.push(null), f = e.input.charCodeAt(e.position);
      continue;
    }
    if (t = e.line, nt(e, r, xa, false, true), o.push(e.result), Pe(e, true, -1), f = e.input.charCodeAt(e.position), (e.line === t || e.lineIndent > r) && f !== 0) ve(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < r) break;
  }
  return s ? (e.tag = n, e.anchor = a, e.kind = "sequence", e.result = o, true) : false;
}
function Hc(e, r, t) {
  var n, a, o, i, s, f, g = e.tag, h = e.anchor, v = {}, w = /* @__PURE__ */ Object.create(null), p = null, m = null, x = null, j = false, P = false, S;
  if (e.firstTabInLine !== -1) return false;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = v), S = e.input.charCodeAt(e.position); S !== 0; ) {
    if (!j && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ve(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (S === 63 || S === 58) && Qe(n)) S === 63 ? (j && (tt(e, v, w, p, m, null, i, s, f), p = m = x = null), P = true, j = true, a = true) : j ? (j = false, a = true) : ve(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, S = n;
    else {
      if (i = e.line, s = e.lineStart, f = e.position, !nt(e, t, wa, false, true)) break;
      if (e.line === o) {
        for (S = e.input.charCodeAt(e.position); Hr(S); ) S = e.input.charCodeAt(++e.position);
        if (S === 58) S = e.input.charCodeAt(++e.position), Qe(S) || ve(e, "a whitespace character is expected after the key-value separator within a block mapping"), j && (tt(e, v, w, p, m, null, i, s, f), p = m = x = null), P = true, j = false, a = false, p = e.tag, m = e.result;
        else if (P) ve(e, "can not read an implicit mapping pair; a colon is missed");
        else return e.tag = g, e.anchor = h, true;
      } else if (P) ve(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else return e.tag = g, e.anchor = h, true;
    }
    if ((e.line === o || e.lineIndent > r) && (j && (i = e.line, s = e.lineStart, f = e.position), nt(e, r, jt, true, a) && (j ? m = e.result : x = e.result), j || (tt(e, v, w, p, m, x, i, s, f), p = m = x = null), Pe(e, true, -1), S = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > r) && S !== 0) ve(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < r) break;
  }
  return j && tt(e, v, w, p, m, null, i, s, f), P && (e.tag = g, e.anchor = h, e.kind = "mapping", e.result = v), P;
}
function Dc(e) {
  var r, t = false, n = false, a, o, i;
  if (i = e.input.charCodeAt(e.position), i !== 33) return false;
  if (e.tag !== null && ve(e, "duplication of a tag property"), i = e.input.charCodeAt(++e.position), i === 60 ? (t = true, i = e.input.charCodeAt(++e.position)) : i === 33 ? (n = true, a = "!!", i = e.input.charCodeAt(++e.position)) : a = "!", r = e.position, t) {
    do
      i = e.input.charCodeAt(++e.position);
    while (i !== 0 && i !== 62);
    e.position < e.length ? (o = e.input.slice(r, e.position), i = e.input.charCodeAt(++e.position)) : ve(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; i !== 0 && !Qe(i); ) i === 33 && (n ? ve(e, "tag suffix cannot contain exclamation marks") : (a = e.input.slice(r - 1, e.position + 1), ka.test(a) || ve(e, "named tag handle cannot contain such characters"), n = true, r = e.position + 1)), i = e.input.charCodeAt(++e.position);
    o = e.input.slice(r, e.position), Cc.test(o) && ve(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Ea.test(o) && ve(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    ve(e, "tag name is malformed: " + o);
  }
  return t ? e.tag = o : Or.call(e.tagMap, a) ? e.tag = e.tagMap[a] + o : a === "!" ? e.tag = "!" + o : a === "!!" ? e.tag = "tag:yaml.org,2002:" + o : ve(e, 'undeclared tag handle "' + a + '"'), true;
}
function Kc(e) {
  var r, t;
  if (t = e.input.charCodeAt(e.position), t !== 38) return false;
  for (e.anchor !== null && ve(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position), r = e.position; t !== 0 && !Qe(t) && !rt(t); ) t = e.input.charCodeAt(++e.position);
  return e.position === r && ve(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(r, e.position), true;
}
function Vc(e) {
  var r, t, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return false;
  for (n = e.input.charCodeAt(++e.position), r = e.position; n !== 0 && !Qe(n) && !rt(n); ) n = e.input.charCodeAt(++e.position);
  return e.position === r && ve(e, "name of an alias node must contain at least one character"), t = e.input.slice(r, e.position), Or.call(e.anchorMap, t) || ve(e, 'unidentified alias "' + t + '"'), e.result = e.anchorMap[t], Pe(e, true, -1), true;
}
function nt(e, r, t, n, a) {
  var o, i, s, f = 1, g = false, h = false, v, w, p, m, x, j;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = i = s = jt === t || xa === t, n && Pe(e, true, -1) && (g = true, e.lineIndent > r ? f = 1 : e.lineIndent === r ? f = 0 : e.lineIndent < r && (f = -1)), f === 1) for (; Dc(e) || Kc(e); ) Pe(e, true, -1) ? (g = true, s = o, e.lineIndent > r ? f = 1 : e.lineIndent === r ? f = 0 : e.lineIndent < r && (f = -1)) : s = false;
  if (s && (s = g || a), (f === 1 || jt === t) && (Ct === t || wa === t ? x = r : x = r + 1, j = e.position - e.lineStart, f === 1 ? s && (vo(e, j) || Hc(e, j, x)) || Pc(e, x) ? h = true : (i && Mc(e, x) || qc(e, x) || Fc(e, x) ? h = true : Vc(e) ? (h = true, (e.tag !== null || e.anchor !== null) && ve(e, "alias node should not have any properties")) : Oc(e, x, Ct === t) && (h = true, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : f === 0 && (h = s && vo(e, j))), e.tag === null) e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && ve(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), v = 0, w = e.implicitTypes.length; v < w; v += 1) if (m = e.implicitTypes[v], m.resolve(e.result)) {
      e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
      break;
    }
  } else if (e.tag !== "!") {
    if (Or.call(e.typeMap[e.kind || "fallback"], e.tag)) m = e.typeMap[e.kind || "fallback"][e.tag];
    else for (m = null, p = e.typeMap.multi[e.kind || "fallback"], v = 0, w = p.length; v < w; v += 1) if (e.tag.slice(0, p[v].tag.length) === p[v].tag) {
      m = p[v];
      break;
    }
    m || ve(e, "unknown tag !<" + e.tag + ">"), e.result !== null && m.kind !== e.kind && ve(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + m.kind + '", not "' + e.kind + '"'), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : ve(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || h;
}
function Gc(e) {
  var r = e.position, t, n, a, o = false, i;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (i = e.input.charCodeAt(e.position)) !== 0 && (Pe(e, true, -1), i = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || i !== 37)); ) {
    for (o = true, i = e.input.charCodeAt(++e.position), t = e.position; i !== 0 && !Qe(i); ) i = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(t, e.position), a = [], n.length < 1 && ve(e, "directive name must not be less than one character in length"); i !== 0; ) {
      for (; Hr(i); ) i = e.input.charCodeAt(++e.position);
      if (i === 35) {
        do
          i = e.input.charCodeAt(++e.position);
        while (i !== 0 && !sr(i));
        break;
      }
      if (sr(i)) break;
      for (t = e.position; i !== 0 && !Qe(i); ) i = e.input.charCodeAt(++e.position);
      a.push(e.input.slice(t, e.position));
    }
    i !== 0 && Zn(e), Or.call(bo, n) ? bo[n](e, n, a) : Rt(e, 'unknown document directive "' + n + '"');
  }
  if (Pe(e, true, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Pe(e, true, -1)) : o && ve(e, "directives end mark is expected"), nt(e, e.lineIndent - 1, jt, false, true), Pe(e, true, -1), e.checkLineBreaks && zc.test(e.input.slice(r, e.position)) && Rt(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Lt(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Pe(e, true, -1));
    return;
  }
  if (e.position < e.length - 1) ve(e, "end of the stream or a document separator is expected");
  else return;
}
function Wc(e, r) {
  e = String(e), r = r || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var t = new Lc(e, r), n = e.indexOf("\0");
  for (n !== -1 && (t.position = n, ve(t, "null byte is not allowed in input")), t.input += "\0"; t.input.charCodeAt(t.position) === 32; ) t.lineIndent += 1, t.position += 1;
  for (; t.position < t.length - 1; ) Gc(t);
  return t.documents;
}
function Yc(e, r) {
  var t = Wc(e, r);
  if (t.length !== 0) {
    if (t.length === 1) return t[0];
    throw new pr("expected a single document in the stream, but found more");
  }
}
var Xc = Yc, Jc = { load: Xc }, Lf = Jc.load, Sa = {}, Ot = {};
Ot.byteLength = $c;
Ot.toByteArray = ru;
Ot.fromByteArray = ou;
var ar = [], tr = [], Zc = typeof Uint8Array < "u" ? Uint8Array : Array, Jt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Wr = 0, Qc = Jt.length; Wr < Qc; ++Wr) ar[Wr] = Jt[Wr], tr[Jt.charCodeAt(Wr)] = Wr;
tr[45] = 62;
tr[95] = 63;
function Ta(e) {
  var r = e.length;
  if (r % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
  var t = e.indexOf("=");
  t === -1 && (t = r);
  var n = t === r ? 0 : 4 - t % 4;
  return [t, n];
}
function $c(e) {
  var r = Ta(e), t = r[0], n = r[1];
  return (t + n) * 3 / 4 - n;
}
function eu(e, r, t) {
  return (r + t) * 3 / 4 - t;
}
function ru(e) {
  var r, t = Ta(e), n = t[0], a = t[1], o = new Zc(eu(e, n, a)), i = 0, s = a > 0 ? n - 4 : n, f;
  for (f = 0; f < s; f += 4) r = tr[e.charCodeAt(f)] << 18 | tr[e.charCodeAt(f + 1)] << 12 | tr[e.charCodeAt(f + 2)] << 6 | tr[e.charCodeAt(f + 3)], o[i++] = r >> 16 & 255, o[i++] = r >> 8 & 255, o[i++] = r & 255;
  return a === 2 && (r = tr[e.charCodeAt(f)] << 2 | tr[e.charCodeAt(f + 1)] >> 4, o[i++] = r & 255), a === 1 && (r = tr[e.charCodeAt(f)] << 10 | tr[e.charCodeAt(f + 1)] << 4 | tr[e.charCodeAt(f + 2)] >> 2, o[i++] = r >> 8 & 255, o[i++] = r & 255), o;
}
function tu(e) {
  return ar[e >> 18 & 63] + ar[e >> 12 & 63] + ar[e >> 6 & 63] + ar[e & 63];
}
function nu(e, r, t) {
  for (var n, a = [], o = r; o < t; o += 3) n = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), a.push(tu(n));
  return a.join("");
}
function ou(e) {
  for (var r, t = e.length, n = t % 3, a = [], o = 16383, i = 0, s = t - n; i < s; i += o) a.push(nu(e, i, i + o > s ? s : i + o));
  return n === 1 ? (r = e[t - 1], a.push(ar[r >> 2] + ar[r << 4 & 63] + "==")) : n === 2 && (r = (e[t - 2] << 8) + e[t - 1], a.push(ar[r >> 10] + ar[r >> 4 & 63] + ar[r << 2 & 63] + "=")), a.join("");
}
var $n = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
$n.read = function(e, r, t, n, a) {
  var o, i, s = a * 8 - n - 1, f = (1 << s) - 1, g = f >> 1, h = -7, v = t ? a - 1 : 0, w = t ? -1 : 1, p = e[r + v];
  for (v += w, o = p & (1 << -h) - 1, p >>= -h, h += s; h > 0; o = o * 256 + e[r + v], v += w, h -= 8) ;
  for (i = o & (1 << -h) - 1, o >>= -h, h += n; h > 0; i = i * 256 + e[r + v], v += w, h -= 8) ;
  if (o === 0) o = 1 - g;
  else {
    if (o === f) return i ? NaN : (p ? -1 : 1) * (1 / 0);
    i = i + Math.pow(2, n), o = o - g;
  }
  return (p ? -1 : 1) * i * Math.pow(2, o - n);
};
$n.write = function(e, r, t, n, a, o) {
  var i, s, f, g = o * 8 - a - 1, h = (1 << g) - 1, v = h >> 1, w = a === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : o - 1, m = n ? 1 : -1, x = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
  for (r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (s = isNaN(r) ? 1 : 0, i = h) : (i = Math.floor(Math.log(r) / Math.LN2), r * (f = Math.pow(2, -i)) < 1 && (i--, f *= 2), i + v >= 1 ? r += w / f : r += w * Math.pow(2, 1 - v), r * f >= 2 && (i++, f /= 2), i + v >= h ? (s = 0, i = h) : i + v >= 1 ? (s = (r * f - 1) * Math.pow(2, a), i = i + v) : (s = r * Math.pow(2, v - 1) * Math.pow(2, a), i = 0)); a >= 8; e[t + p] = s & 255, p += m, s /= 256, a -= 8) ;
  for (i = i << a | s, g += a; g > 0; e[t + p] = i & 255, p += m, i /= 256, g -= 8) ;
  e[t + p - m] |= x * 128;
};
/*!
* The buffer module from node.js, for the browser.
*
* @author   Feross Aboukhadijeh <https://feross.org>
* @license  MIT
*/
(function(e) {
  const r = Ot, t = $n, n = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  e.Buffer = h, e.SlowBuffer = W, e.INSPECT_MAX_BYTES = 50;
  const a = 2147483647;
  e.kMaxLength = a;
  const { Uint8Array: o, ArrayBuffer: i, SharedArrayBuffer: s } = globalThis;
  h.TYPED_ARRAY_SUPPORT = f(), !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  function f() {
    try {
      const b = new o(1), c = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(c, o.prototype), Object.setPrototypeOf(b, c), b.foo() === 42;
    } catch {
      return false;
    }
  }
  Object.defineProperty(h.prototype, "parent", { enumerable: true, get: function() {
    if (h.isBuffer(this)) return this.buffer;
  } }), Object.defineProperty(h.prototype, "offset", { enumerable: true, get: function() {
    if (h.isBuffer(this)) return this.byteOffset;
  } });
  function g(b) {
    if (b > a) throw new RangeError('The value "' + b + '" is invalid for option "size"');
    const c = new o(b);
    return Object.setPrototypeOf(c, h.prototype), c;
  }
  function h(b, c, l) {
    if (typeof b == "number") {
      if (typeof c == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
      return m(b);
    }
    return v(b, c, l);
  }
  h.poolSize = 8192;
  function v(b, c, l) {
    if (typeof b == "string") return x(b, c);
    if (i.isView(b)) return P(b);
    if (b == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof b);
    if (oe(b, i) || b && oe(b.buffer, i) || typeof s < "u" && (oe(b, s) || b && oe(b.buffer, s))) return S(b, c, l);
    if (typeof b == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    const T = b.valueOf && b.valueOf();
    if (T != null && T !== b) return h.from(T, c, l);
    const K = _(b);
    if (K) return K;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof b[Symbol.toPrimitive] == "function") return h.from(b[Symbol.toPrimitive]("string"), c, l);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof b);
  }
  h.from = function(b, c, l) {
    return v(b, c, l);
  }, Object.setPrototypeOf(h.prototype, o.prototype), Object.setPrototypeOf(h, o);
  function w(b) {
    if (typeof b != "number") throw new TypeError('"size" argument must be of type number');
    if (b < 0) throw new RangeError('The value "' + b + '" is invalid for option "size"');
  }
  function p(b, c, l) {
    return w(b), b <= 0 ? g(b) : c !== void 0 ? typeof l == "string" ? g(b).fill(c, l) : g(b).fill(c) : g(b);
  }
  h.alloc = function(b, c, l) {
    return p(b, c, l);
  };
  function m(b) {
    return w(b), g(b < 0 ? 0 : M(b) | 0);
  }
  h.allocUnsafe = function(b) {
    return m(b);
  }, h.allocUnsafeSlow = function(b) {
    return m(b);
  };
  function x(b, c) {
    if ((typeof c != "string" || c === "") && (c = "utf8"), !h.isEncoding(c)) throw new TypeError("Unknown encoding: " + c);
    const l = U(b, c) | 0;
    let T = g(l);
    const K = T.write(b, c);
    return K !== l && (T = T.slice(0, K)), T;
  }
  function j(b) {
    const c = b.length < 0 ? 0 : M(b.length) | 0, l = g(c);
    for (let T = 0; T < c; T += 1) l[T] = b[T] & 255;
    return l;
  }
  function P(b) {
    if (oe(b, o)) {
      const c = new o(b);
      return S(c.buffer, c.byteOffset, c.byteLength);
    }
    return j(b);
  }
  function S(b, c, l) {
    if (c < 0 || b.byteLength < c) throw new RangeError('"offset" is outside of buffer bounds');
    if (b.byteLength < c + (l || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let T;
    return c === void 0 && l === void 0 ? T = new o(b) : l === void 0 ? T = new o(b, c) : T = new o(b, c, l), Object.setPrototypeOf(T, h.prototype), T;
  }
  function _(b) {
    if (h.isBuffer(b)) {
      const c = M(b.length) | 0, l = g(c);
      return l.length === 0 || b.copy(l, 0, 0, c), l;
    }
    if (b.length !== void 0) return typeof b.length != "number" || ne(b.length) ? g(0) : j(b);
    if (b.type === "Buffer" && Array.isArray(b.data)) return j(b.data);
  }
  function M(b) {
    if (b >= a) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a.toString(16) + " bytes");
    return b | 0;
  }
  function W(b) {
    return +b != b && (b = 0), h.alloc(+b);
  }
  h.isBuffer = function(c) {
    return c != null && c._isBuffer === true && c !== h.prototype;
  }, h.compare = function(c, l) {
    if (oe(c, o) && (c = h.from(c, c.offset, c.byteLength)), oe(l, o) && (l = h.from(l, l.offset, l.byteLength)), !h.isBuffer(c) || !h.isBuffer(l)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (c === l) return 0;
    let T = c.length, K = l.length;
    for (let J = 0, Q = Math.min(T, K); J < Q; ++J) if (c[J] !== l[J]) {
      T = c[J], K = l[J];
      break;
    }
    return T < K ? -1 : K < T ? 1 : 0;
  }, h.isEncoding = function(c) {
    switch (String(c).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  }, h.concat = function(c, l) {
    if (!Array.isArray(c)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (c.length === 0) return h.alloc(0);
    let T;
    if (l === void 0) for (l = 0, T = 0; T < c.length; ++T) l += c[T].length;
    const K = h.allocUnsafe(l);
    let J = 0;
    for (T = 0; T < c.length; ++T) {
      let Q = c[T];
      if (oe(Q, o)) J + Q.length > K.length ? (h.isBuffer(Q) || (Q = h.from(Q)), Q.copy(K, J)) : o.prototype.set.call(K, Q, J);
      else if (h.isBuffer(Q)) Q.copy(K, J);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      J += Q.length;
    }
    return K;
  };
  function U(b, c) {
    if (h.isBuffer(b)) return b.length;
    if (i.isView(b) || oe(b, i)) return b.byteLength;
    if (typeof b != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof b);
    const l = b.length, T = arguments.length > 2 && arguments[2] === true;
    if (!T && l === 0) return 0;
    let K = false;
    for (; ; ) switch (c) {
      case "ascii":
      case "latin1":
      case "binary":
        return l;
      case "utf8":
      case "utf-8":
        return Ae(b).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return l * 2;
      case "hex":
        return l >>> 1;
      case "base64":
        return xe(b).length;
      default:
        if (K) return T ? -1 : Ae(b).length;
        c = ("" + c).toLowerCase(), K = true;
    }
  }
  h.byteLength = U;
  function R(b, c, l) {
    let T = false;
    if ((c === void 0 || c < 0) && (c = 0), c > this.length || ((l === void 0 || l > this.length) && (l = this.length), l <= 0) || (l >>>= 0, c >>>= 0, l <= c)) return "";
    for (b || (b = "utf8"); ; ) switch (b) {
      case "hex":
        return H(this, c, l);
      case "utf8":
      case "utf-8":
        return L(this, c, l);
      case "ascii":
        return D(this, c, l);
      case "latin1":
      case "binary":
        return I(this, c, l);
      case "base64":
        return V(this, c, l);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return X(this, c, l);
      default:
        if (T) throw new TypeError("Unknown encoding: " + b);
        b = (b + "").toLowerCase(), T = true;
    }
  }
  h.prototype._isBuffer = true;
  function N(b, c, l) {
    const T = b[c];
    b[c] = b[l], b[l] = T;
  }
  h.prototype.swap16 = function() {
    const c = this.length;
    if (c % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let l = 0; l < c; l += 2) N(this, l, l + 1);
    return this;
  }, h.prototype.swap32 = function() {
    const c = this.length;
    if (c % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let l = 0; l < c; l += 4) N(this, l, l + 3), N(this, l + 1, l + 2);
    return this;
  }, h.prototype.swap64 = function() {
    const c = this.length;
    if (c % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let l = 0; l < c; l += 8) N(this, l, l + 7), N(this, l + 1, l + 6), N(this, l + 2, l + 5), N(this, l + 3, l + 4);
    return this;
  }, h.prototype.toString = function() {
    const c = this.length;
    return c === 0 ? "" : arguments.length === 0 ? L(this, 0, c) : R.apply(this, arguments);
  }, h.prototype.toLocaleString = h.prototype.toString, h.prototype.equals = function(c) {
    if (!h.isBuffer(c)) throw new TypeError("Argument must be a Buffer");
    return this === c ? true : h.compare(this, c) === 0;
  }, h.prototype.inspect = function() {
    let c = "";
    const l = e.INSPECT_MAX_BYTES;
    return c = this.toString("hex", 0, l).replace(/(.{2})/g, "$1 ").trim(), this.length > l && (c += " ... "), "<Buffer " + c + ">";
  }, n && (h.prototype[n] = h.prototype.inspect), h.prototype.compare = function(c, l, T, K, J) {
    if (oe(c, o) && (c = h.from(c, c.offset, c.byteLength)), !h.isBuffer(c)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof c);
    if (l === void 0 && (l = 0), T === void 0 && (T = c ? c.length : 0), K === void 0 && (K = 0), J === void 0 && (J = this.length), l < 0 || T > c.length || K < 0 || J > this.length) throw new RangeError("out of range index");
    if (K >= J && l >= T) return 0;
    if (K >= J) return -1;
    if (l >= T) return 1;
    if (l >>>= 0, T >>>= 0, K >>>= 0, J >>>= 0, this === c) return 0;
    let Q = J - K, ge = T - l;
    const Be = Math.min(Q, ge), Se = this.slice(K, J), ke = c.slice(l, T);
    for (let Ee = 0; Ee < Be; ++Ee) if (Se[Ee] !== ke[Ee]) {
      Q = Se[Ee], ge = ke[Ee];
      break;
    }
    return Q < ge ? -1 : ge < Q ? 1 : 0;
  };
  function k(b, c, l, T, K) {
    if (b.length === 0) return -1;
    if (typeof l == "string" ? (T = l, l = 0) : l > 2147483647 ? l = 2147483647 : l < -2147483648 && (l = -2147483648), l = +l, ne(l) && (l = K ? 0 : b.length - 1), l < 0 && (l = b.length + l), l >= b.length) {
      if (K) return -1;
      l = b.length - 1;
    } else if (l < 0) if (K) l = 0;
    else return -1;
    if (typeof c == "string" && (c = h.from(c, T)), h.isBuffer(c)) return c.length === 0 ? -1 : C(b, c, l, T, K);
    if (typeof c == "number") return c = c & 255, typeof o.prototype.indexOf == "function" ? K ? o.prototype.indexOf.call(b, c, l) : o.prototype.lastIndexOf.call(b, c, l) : C(b, [c], l, T, K);
    throw new TypeError("val must be string, number or Buffer");
  }
  function C(b, c, l, T, K) {
    let J = 1, Q = b.length, ge = c.length;
    if (T !== void 0 && (T = String(T).toLowerCase(), T === "ucs2" || T === "ucs-2" || T === "utf16le" || T === "utf-16le")) {
      if (b.length < 2 || c.length < 2) return -1;
      J = 2, Q /= 2, ge /= 2, l /= 2;
    }
    function Be(ke, Ee) {
      return J === 1 ? ke[Ee] : ke.readUInt16BE(Ee * J);
    }
    let Se;
    if (K) {
      let ke = -1;
      for (Se = l; Se < Q; Se++) if (Be(b, Se) === Be(c, ke === -1 ? 0 : Se - ke)) {
        if (ke === -1 && (ke = Se), Se - ke + 1 === ge) return ke * J;
      } else ke !== -1 && (Se -= Se - ke), ke = -1;
    } else for (l + ge > Q && (l = Q - ge), Se = l; Se >= 0; Se--) {
      let ke = true;
      for (let Ee = 0; Ee < ge; Ee++) if (Be(b, Se + Ee) !== Be(c, Ee)) {
        ke = false;
        break;
      }
      if (ke) return Se;
    }
    return -1;
  }
  h.prototype.includes = function(c, l, T) {
    return this.indexOf(c, l, T) !== -1;
  }, h.prototype.indexOf = function(c, l, T) {
    return k(this, c, l, T, true);
  }, h.prototype.lastIndexOf = function(c, l, T) {
    return k(this, c, l, T, false);
  };
  function q(b, c, l, T) {
    l = Number(l) || 0;
    const K = b.length - l;
    T ? (T = Number(T), T > K && (T = K)) : T = K;
    const J = c.length;
    T > J / 2 && (T = J / 2);
    let Q;
    for (Q = 0; Q < T; ++Q) {
      const ge = parseInt(c.substr(Q * 2, 2), 16);
      if (ne(ge)) return Q;
      b[l + Q] = ge;
    }
    return Q;
  }
  function B(b, c, l, T) {
    return se(Ae(c, b.length - l), b, l, T);
  }
  function F(b, c, l, T) {
    return se(gr(c), b, l, T);
  }
  function G(b, c, l, T) {
    return se(xe(c), b, l, T);
  }
  function A(b, c, l, T) {
    return se(je(c, b.length - l), b, l, T);
  }
  h.prototype.write = function(c, l, T, K) {
    if (l === void 0) K = "utf8", T = this.length, l = 0;
    else if (T === void 0 && typeof l == "string") K = l, T = this.length, l = 0;
    else if (isFinite(l)) l = l >>> 0, isFinite(T) ? (T = T >>> 0, K === void 0 && (K = "utf8")) : (K = T, T = void 0);
    else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    const J = this.length - l;
    if ((T === void 0 || T > J) && (T = J), c.length > 0 && (T < 0 || l < 0) || l > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    K || (K = "utf8");
    let Q = false;
    for (; ; ) switch (K) {
      case "hex":
        return q(this, c, l, T);
      case "utf8":
      case "utf-8":
        return B(this, c, l, T);
      case "ascii":
      case "latin1":
      case "binary":
        return F(this, c, l, T);
      case "base64":
        return G(this, c, l, T);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return A(this, c, l, T);
      default:
        if (Q) throw new TypeError("Unknown encoding: " + K);
        K = ("" + K).toLowerCase(), Q = true;
    }
  }, h.prototype.toJSON = function() {
    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
  };
  function V(b, c, l) {
    return c === 0 && l === b.length ? r.fromByteArray(b) : r.fromByteArray(b.slice(c, l));
  }
  function L(b, c, l) {
    l = Math.min(b.length, l);
    const T = [];
    let K = c;
    for (; K < l; ) {
      const J = b[K];
      let Q = null, ge = J > 239 ? 4 : J > 223 ? 3 : J > 191 ? 2 : 1;
      if (K + ge <= l) {
        let Be, Se, ke, Ee;
        switch (ge) {
          case 1:
            J < 128 && (Q = J);
            break;
          case 2:
            Be = b[K + 1], (Be & 192) === 128 && (Ee = (J & 31) << 6 | Be & 63, Ee > 127 && (Q = Ee));
            break;
          case 3:
            Be = b[K + 1], Se = b[K + 2], (Be & 192) === 128 && (Se & 192) === 128 && (Ee = (J & 15) << 12 | (Be & 63) << 6 | Se & 63, Ee > 2047 && (Ee < 55296 || Ee > 57343) && (Q = Ee));
            break;
          case 4:
            Be = b[K + 1], Se = b[K + 2], ke = b[K + 3], (Be & 192) === 128 && (Se & 192) === 128 && (ke & 192) === 128 && (Ee = (J & 15) << 18 | (Be & 63) << 12 | (Se & 63) << 6 | ke & 63, Ee > 65535 && Ee < 1114112 && (Q = Ee));
        }
      }
      Q === null ? (Q = 65533, ge = 1) : Q > 65535 && (Q -= 65536, T.push(Q >>> 10 & 1023 | 55296), Q = 56320 | Q & 1023), T.push(Q), K += ge;
    }
    return z(T);
  }
  const y = 4096;
  function z(b) {
    const c = b.length;
    if (c <= y) return String.fromCharCode.apply(String, b);
    let l = "", T = 0;
    for (; T < c; ) l += String.fromCharCode.apply(String, b.slice(T, T += y));
    return l;
  }
  function D(b, c, l) {
    let T = "";
    l = Math.min(b.length, l);
    for (let K = c; K < l; ++K) T += String.fromCharCode(b[K] & 127);
    return T;
  }
  function I(b, c, l) {
    let T = "";
    l = Math.min(b.length, l);
    for (let K = c; K < l; ++K) T += String.fromCharCode(b[K]);
    return T;
  }
  function H(b, c, l) {
    const T = b.length;
    (!c || c < 0) && (c = 0), (!l || l < 0 || l > T) && (l = T);
    let K = "";
    for (let J = c; J < l; ++J) K += de[b[J]];
    return K;
  }
  function X(b, c, l) {
    const T = b.slice(c, l);
    let K = "";
    for (let J = 0; J < T.length - 1; J += 2) K += String.fromCharCode(T[J] + T[J + 1] * 256);
    return K;
  }
  h.prototype.slice = function(c, l) {
    const T = this.length;
    c = ~~c, l = l === void 0 ? T : ~~l, c < 0 ? (c += T, c < 0 && (c = 0)) : c > T && (c = T), l < 0 ? (l += T, l < 0 && (l = 0)) : l > T && (l = T), l < c && (l = c);
    const K = this.subarray(c, l);
    return Object.setPrototypeOf(K, h.prototype), K;
  };
  function Z(b, c, l) {
    if (b % 1 !== 0 || b < 0) throw new RangeError("offset is not uint");
    if (b + c > l) throw new RangeError("Trying to access beyond buffer length");
  }
  h.prototype.readUintLE = h.prototype.readUIntLE = function(c, l, T) {
    c = c >>> 0, l = l >>> 0, T || Z(c, l, this.length);
    let K = this[c], J = 1, Q = 0;
    for (; ++Q < l && (J *= 256); ) K += this[c + Q] * J;
    return K;
  }, h.prototype.readUintBE = h.prototype.readUIntBE = function(c, l, T) {
    c = c >>> 0, l = l >>> 0, T || Z(c, l, this.length);
    let K = this[c + --l], J = 1;
    for (; l > 0 && (J *= 256); ) K += this[c + --l] * J;
    return K;
  }, h.prototype.readUint8 = h.prototype.readUInt8 = function(c, l) {
    return c = c >>> 0, l || Z(c, 1, this.length), this[c];
  }, h.prototype.readUint16LE = h.prototype.readUInt16LE = function(c, l) {
    return c = c >>> 0, l || Z(c, 2, this.length), this[c] | this[c + 1] << 8;
  }, h.prototype.readUint16BE = h.prototype.readUInt16BE = function(c, l) {
    return c = c >>> 0, l || Z(c, 2, this.length), this[c] << 8 | this[c + 1];
  }, h.prototype.readUint32LE = h.prototype.readUInt32LE = function(c, l) {
    return c = c >>> 0, l || Z(c, 4, this.length), (this[c] | this[c + 1] << 8 | this[c + 2] << 16) + this[c + 3] * 16777216;
  }, h.prototype.readUint32BE = h.prototype.readUInt32BE = function(c, l) {
    return c = c >>> 0, l || Z(c, 4, this.length), this[c] * 16777216 + (this[c + 1] << 16 | this[c + 2] << 8 | this[c + 3]);
  }, h.prototype.readBigUInt64LE = he(function(c) {
    c = c >>> 0, Ce(c, "offset");
    const l = this[c], T = this[c + 7];
    (l === void 0 || T === void 0) && Oe(c, this.length - 8);
    const K = l + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + this[++c] * 2 ** 24, J = this[++c] + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + T * 2 ** 24;
    return BigInt(K) + (BigInt(J) << BigInt(32));
  }), h.prototype.readBigUInt64BE = he(function(c) {
    c = c >>> 0, Ce(c, "offset");
    const l = this[c], T = this[c + 7];
    (l === void 0 || T === void 0) && Oe(c, this.length - 8);
    const K = l * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + this[++c], J = this[++c] * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + T;
    return (BigInt(K) << BigInt(32)) + BigInt(J);
  }), h.prototype.readIntLE = function(c, l, T) {
    c = c >>> 0, l = l >>> 0, T || Z(c, l, this.length);
    let K = this[c], J = 1, Q = 0;
    for (; ++Q < l && (J *= 256); ) K += this[c + Q] * J;
    return J *= 128, K >= J && (K -= Math.pow(2, 8 * l)), K;
  }, h.prototype.readIntBE = function(c, l, T) {
    c = c >>> 0, l = l >>> 0, T || Z(c, l, this.length);
    let K = l, J = 1, Q = this[c + --K];
    for (; K > 0 && (J *= 256); ) Q += this[c + --K] * J;
    return J *= 128, Q >= J && (Q -= Math.pow(2, 8 * l)), Q;
  }, h.prototype.readInt8 = function(c, l) {
    return c = c >>> 0, l || Z(c, 1, this.length), this[c] & 128 ? (255 - this[c] + 1) * -1 : this[c];
  }, h.prototype.readInt16LE = function(c, l) {
    c = c >>> 0, l || Z(c, 2, this.length);
    const T = this[c] | this[c + 1] << 8;
    return T & 32768 ? T | 4294901760 : T;
  }, h.prototype.readInt16BE = function(c, l) {
    c = c >>> 0, l || Z(c, 2, this.length);
    const T = this[c + 1] | this[c] << 8;
    return T & 32768 ? T | 4294901760 : T;
  }, h.prototype.readInt32LE = function(c, l) {
    return c = c >>> 0, l || Z(c, 4, this.length), this[c] | this[c + 1] << 8 | this[c + 2] << 16 | this[c + 3] << 24;
  }, h.prototype.readInt32BE = function(c, l) {
    return c = c >>> 0, l || Z(c, 4, this.length), this[c] << 24 | this[c + 1] << 16 | this[c + 2] << 8 | this[c + 3];
  }, h.prototype.readBigInt64LE = he(function(c) {
    c = c >>> 0, Ce(c, "offset");
    const l = this[c], T = this[c + 7];
    (l === void 0 || T === void 0) && Oe(c, this.length - 8);
    const K = this[c + 4] + this[c + 5] * 2 ** 8 + this[c + 6] * 2 ** 16 + (T << 24);
    return (BigInt(K) << BigInt(32)) + BigInt(l + this[++c] * 2 ** 8 + this[++c] * 2 ** 16 + this[++c] * 2 ** 24);
  }), h.prototype.readBigInt64BE = he(function(c) {
    c = c >>> 0, Ce(c, "offset");
    const l = this[c], T = this[c + 7];
    (l === void 0 || T === void 0) && Oe(c, this.length - 8);
    const K = (l << 24) + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + this[++c];
    return (BigInt(K) << BigInt(32)) + BigInt(this[++c] * 2 ** 24 + this[++c] * 2 ** 16 + this[++c] * 2 ** 8 + T);
  }), h.prototype.readFloatLE = function(c, l) {
    return c = c >>> 0, l || Z(c, 4, this.length), t.read(this, c, true, 23, 4);
  }, h.prototype.readFloatBE = function(c, l) {
    return c = c >>> 0, l || Z(c, 4, this.length), t.read(this, c, false, 23, 4);
  }, h.prototype.readDoubleLE = function(c, l) {
    return c = c >>> 0, l || Z(c, 8, this.length), t.read(this, c, true, 52, 8);
  }, h.prototype.readDoubleBE = function(c, l) {
    return c = c >>> 0, l || Z(c, 8, this.length), t.read(this, c, false, 52, 8);
  };
  function ee(b, c, l, T, K, J) {
    if (!h.isBuffer(b)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (c > K || c < J) throw new RangeError('"value" argument is out of bounds');
    if (l + T > b.length) throw new RangeError("Index out of range");
  }
  h.prototype.writeUintLE = h.prototype.writeUIntLE = function(c, l, T, K) {
    if (c = +c, l = l >>> 0, T = T >>> 0, !K) {
      const ge = Math.pow(2, 8 * T) - 1;
      ee(this, c, l, T, ge, 0);
    }
    let J = 1, Q = 0;
    for (this[l] = c & 255; ++Q < T && (J *= 256); ) this[l + Q] = c / J & 255;
    return l + T;
  }, h.prototype.writeUintBE = h.prototype.writeUIntBE = function(c, l, T, K) {
    if (c = +c, l = l >>> 0, T = T >>> 0, !K) {
      const ge = Math.pow(2, 8 * T) - 1;
      ee(this, c, l, T, ge, 0);
    }
    let J = T - 1, Q = 1;
    for (this[l + J] = c & 255; --J >= 0 && (Q *= 256); ) this[l + J] = c / Q & 255;
    return l + T;
  }, h.prototype.writeUint8 = h.prototype.writeUInt8 = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 1, 255, 0), this[l] = c & 255, l + 1;
  }, h.prototype.writeUint16LE = h.prototype.writeUInt16LE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 2, 65535, 0), this[l] = c & 255, this[l + 1] = c >>> 8, l + 2;
  }, h.prototype.writeUint16BE = h.prototype.writeUInt16BE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 2, 65535, 0), this[l] = c >>> 8, this[l + 1] = c & 255, l + 2;
  }, h.prototype.writeUint32LE = h.prototype.writeUInt32LE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 4, 4294967295, 0), this[l + 3] = c >>> 24, this[l + 2] = c >>> 16, this[l + 1] = c >>> 8, this[l] = c & 255, l + 4;
  }, h.prototype.writeUint32BE = h.prototype.writeUInt32BE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 4, 4294967295, 0), this[l] = c >>> 24, this[l + 1] = c >>> 16, this[l + 2] = c >>> 8, this[l + 3] = c & 255, l + 4;
  };
  function ce(b, c, l, T, K) {
    _e(c, T, K, b, l, 7);
    let J = Number(c & BigInt(4294967295));
    b[l++] = J, J = J >> 8, b[l++] = J, J = J >> 8, b[l++] = J, J = J >> 8, b[l++] = J;
    let Q = Number(c >> BigInt(32) & BigInt(4294967295));
    return b[l++] = Q, Q = Q >> 8, b[l++] = Q, Q = Q >> 8, b[l++] = Q, Q = Q >> 8, b[l++] = Q, l;
  }
  function ue(b, c, l, T, K) {
    _e(c, T, K, b, l, 7);
    let J = Number(c & BigInt(4294967295));
    b[l + 7] = J, J = J >> 8, b[l + 6] = J, J = J >> 8, b[l + 5] = J, J = J >> 8, b[l + 4] = J;
    let Q = Number(c >> BigInt(32) & BigInt(4294967295));
    return b[l + 3] = Q, Q = Q >> 8, b[l + 2] = Q, Q = Q >> 8, b[l + 1] = Q, Q = Q >> 8, b[l] = Q, l + 8;
  }
  h.prototype.writeBigUInt64LE = he(function(c, l = 0) {
    return ce(this, c, l, BigInt(0), BigInt("0xffffffffffffffff"));
  }), h.prototype.writeBigUInt64BE = he(function(c, l = 0) {
    return ue(this, c, l, BigInt(0), BigInt("0xffffffffffffffff"));
  }), h.prototype.writeIntLE = function(c, l, T, K) {
    if (c = +c, l = l >>> 0, !K) {
      const Be = Math.pow(2, 8 * T - 1);
      ee(this, c, l, T, Be - 1, -Be);
    }
    let J = 0, Q = 1, ge = 0;
    for (this[l] = c & 255; ++J < T && (Q *= 256); ) c < 0 && ge === 0 && this[l + J - 1] !== 0 && (ge = 1), this[l + J] = (c / Q >> 0) - ge & 255;
    return l + T;
  }, h.prototype.writeIntBE = function(c, l, T, K) {
    if (c = +c, l = l >>> 0, !K) {
      const Be = Math.pow(2, 8 * T - 1);
      ee(this, c, l, T, Be - 1, -Be);
    }
    let J = T - 1, Q = 1, ge = 0;
    for (this[l + J] = c & 255; --J >= 0 && (Q *= 256); ) c < 0 && ge === 0 && this[l + J + 1] !== 0 && (ge = 1), this[l + J] = (c / Q >> 0) - ge & 255;
    return l + T;
  }, h.prototype.writeInt8 = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 1, 127, -128), c < 0 && (c = 255 + c + 1), this[l] = c & 255, l + 1;
  }, h.prototype.writeInt16LE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 2, 32767, -32768), this[l] = c & 255, this[l + 1] = c >>> 8, l + 2;
  }, h.prototype.writeInt16BE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 2, 32767, -32768), this[l] = c >>> 8, this[l + 1] = c & 255, l + 2;
  }, h.prototype.writeInt32LE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 4, 2147483647, -2147483648), this[l] = c & 255, this[l + 1] = c >>> 8, this[l + 2] = c >>> 16, this[l + 3] = c >>> 24, l + 4;
  }, h.prototype.writeInt32BE = function(c, l, T) {
    return c = +c, l = l >>> 0, T || ee(this, c, l, 4, 2147483647, -2147483648), c < 0 && (c = 4294967295 + c + 1), this[l] = c >>> 24, this[l + 1] = c >>> 16, this[l + 2] = c >>> 8, this[l + 3] = c & 255, l + 4;
  }, h.prototype.writeBigInt64LE = he(function(c, l = 0) {
    return ce(this, c, l, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), h.prototype.writeBigInt64BE = he(function(c, l = 0) {
    return ue(this, c, l, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ie(b, c, l, T, K, J) {
    if (l + T > b.length) throw new RangeError("Index out of range");
    if (l < 0) throw new RangeError("Index out of range");
  }
  function ae(b, c, l, T, K) {
    return c = +c, l = l >>> 0, K || ie(b, c, l, 4), t.write(b, c, l, T, 23, 4), l + 4;
  }
  h.prototype.writeFloatLE = function(c, l, T) {
    return ae(this, c, l, true, T);
  }, h.prototype.writeFloatBE = function(c, l, T) {
    return ae(this, c, l, false, T);
  };
  function fe(b, c, l, T, K) {
    return c = +c, l = l >>> 0, K || ie(b, c, l, 8), t.write(b, c, l, T, 52, 8), l + 8;
  }
  h.prototype.writeDoubleLE = function(c, l, T) {
    return fe(this, c, l, true, T);
  }, h.prototype.writeDoubleBE = function(c, l, T) {
    return fe(this, c, l, false, T);
  }, h.prototype.copy = function(c, l, T, K) {
    if (!h.isBuffer(c)) throw new TypeError("argument should be a Buffer");
    if (T || (T = 0), !K && K !== 0 && (K = this.length), l >= c.length && (l = c.length), l || (l = 0), K > 0 && K < T && (K = T), K === T || c.length === 0 || this.length === 0) return 0;
    if (l < 0) throw new RangeError("targetStart out of bounds");
    if (T < 0 || T >= this.length) throw new RangeError("Index out of range");
    if (K < 0) throw new RangeError("sourceEnd out of bounds");
    K > this.length && (K = this.length), c.length - l < K - T && (K = c.length - l + T);
    const J = K - T;
    return this === c && typeof o.prototype.copyWithin == "function" ? this.copyWithin(l, T, K) : o.prototype.set.call(c, this.subarray(T, K), l), J;
  }, h.prototype.fill = function(c, l, T, K) {
    if (typeof c == "string") {
      if (typeof l == "string" ? (K = l, l = 0, T = this.length) : typeof T == "string" && (K = T, T = this.length), K !== void 0 && typeof K != "string") throw new TypeError("encoding must be a string");
      if (typeof K == "string" && !h.isEncoding(K)) throw new TypeError("Unknown encoding: " + K);
      if (c.length === 1) {
        const Q = c.charCodeAt(0);
        (K === "utf8" && Q < 128 || K === "latin1") && (c = Q);
      }
    } else typeof c == "number" ? c = c & 255 : typeof c == "boolean" && (c = Number(c));
    if (l < 0 || this.length < l || this.length < T) throw new RangeError("Out of range index");
    if (T <= l) return this;
    l = l >>> 0, T = T === void 0 ? this.length : T >>> 0, c || (c = 0);
    let J;
    if (typeof c == "number") for (J = l; J < T; ++J) this[J] = c;
    else {
      const Q = h.isBuffer(c) ? c : h.from(c, K), ge = Q.length;
      if (ge === 0) throw new TypeError('The value "' + c + '" is invalid for argument "value"');
      for (J = 0; J < T - l; ++J) this[J + l] = Q[J % ge];
    }
    return this;
  };
  const be = {};
  function ye(b, c, l) {
    be[b] = class extends l {
      constructor() {
        super(), Object.defineProperty(this, "message", { value: c.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${b}]`, this.stack, delete this.name;
      }
      get code() {
        return b;
      }
      set code(K) {
        Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: K, writable: true });
      }
      toString() {
        return `${this.name} [${b}]: ${this.message}`;
      }
    };
  }
  ye("ERR_BUFFER_OUT_OF_BOUNDS", function(b) {
    return b ? `${b} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
  }, RangeError), ye("ERR_INVALID_ARG_TYPE", function(b, c) {
    return `The "${b}" argument must be of type number. Received type ${typeof c}`;
  }, TypeError), ye("ERR_OUT_OF_RANGE", function(b, c, l) {
    let T = `The value of "${b}" is out of range.`, K = l;
    return Number.isInteger(l) && Math.abs(l) > 2 ** 32 ? K = te(String(l)) : typeof l == "bigint" && (K = String(l), (l > BigInt(2) ** BigInt(32) || l < -(BigInt(2) ** BigInt(32))) && (K = te(K)), K += "n"), T += ` It must be ${c}. Received ${K}`, T;
  }, RangeError);
  function te(b) {
    let c = "", l = b.length;
    const T = b[0] === "-" ? 1 : 0;
    for (; l >= T + 4; l -= 3) c = `_${b.slice(l - 3, l)}${c}`;
    return `${b.slice(0, l)}${c}`;
  }
  function me(b, c, l) {
    Ce(c, "offset"), (b[c] === void 0 || b[c + l] === void 0) && Oe(c, b.length - (l + 1));
  }
  function _e(b, c, l, T, K, J) {
    if (b > l || b < c) {
      const Q = typeof c == "bigint" ? "n" : "";
      let ge;
      throw c === 0 || c === BigInt(0) ? ge = `>= 0${Q} and < 2${Q} ** ${(J + 1) * 8}${Q}` : ge = `>= -(2${Q} ** ${(J + 1) * 8 - 1}${Q}) and < 2 ** ${(J + 1) * 8 - 1}${Q}`, new be.ERR_OUT_OF_RANGE("value", ge, b);
    }
    me(T, K, J);
  }
  function Ce(b, c) {
    if (typeof b != "number") throw new be.ERR_INVALID_ARG_TYPE(c, "number", b);
  }
  function Oe(b, c, l) {
    throw Math.floor(b) !== b ? (Ce(b, l), new be.ERR_OUT_OF_RANGE("offset", "an integer", b)) : c < 0 ? new be.ERR_BUFFER_OUT_OF_BOUNDS() : new be.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${c}`, b);
  }
  const De = /[^+/0-9A-Za-z-_]/g;
  function Ve(b) {
    if (b = b.split("=")[0], b = b.trim().replace(De, ""), b.length < 2) return "";
    for (; b.length % 4 !== 0; ) b = b + "=";
    return b;
  }
  function Ae(b, c) {
    c = c || 1 / 0;
    let l;
    const T = b.length;
    let K = null;
    const J = [];
    for (let Q = 0; Q < T; ++Q) {
      if (l = b.charCodeAt(Q), l > 55295 && l < 57344) {
        if (!K) {
          if (l > 56319) {
            (c -= 3) > -1 && J.push(239, 191, 189);
            continue;
          } else if (Q + 1 === T) {
            (c -= 3) > -1 && J.push(239, 191, 189);
            continue;
          }
          K = l;
          continue;
        }
        if (l < 56320) {
          (c -= 3) > -1 && J.push(239, 191, 189), K = l;
          continue;
        }
        l = (K - 55296 << 10 | l - 56320) + 65536;
      } else K && (c -= 3) > -1 && J.push(239, 191, 189);
      if (K = null, l < 128) {
        if ((c -= 1) < 0) break;
        J.push(l);
      } else if (l < 2048) {
        if ((c -= 2) < 0) break;
        J.push(l >> 6 | 192, l & 63 | 128);
      } else if (l < 65536) {
        if ((c -= 3) < 0) break;
        J.push(l >> 12 | 224, l >> 6 & 63 | 128, l & 63 | 128);
      } else if (l < 1114112) {
        if ((c -= 4) < 0) break;
        J.push(l >> 18 | 240, l >> 12 & 63 | 128, l >> 6 & 63 | 128, l & 63 | 128);
      } else throw new Error("Invalid code point");
    }
    return J;
  }
  function gr(b) {
    const c = [];
    for (let l = 0; l < b.length; ++l) c.push(b.charCodeAt(l) & 255);
    return c;
  }
  function je(b, c) {
    let l, T, K;
    const J = [];
    for (let Q = 0; Q < b.length && !((c -= 2) < 0); ++Q) l = b.charCodeAt(Q), T = l >> 8, K = l % 256, J.push(K), J.push(T);
    return J;
  }
  function xe(b) {
    return r.toByteArray(Ve(b));
  }
  function se(b, c, l, T) {
    let K;
    for (K = 0; K < T && !(K + l >= c.length || K >= b.length); ++K) c[K + l] = b[K];
    return K;
  }
  function oe(b, c) {
    return b instanceof c || b != null && b.constructor != null && b.constructor.name != null && b.constructor.name === c.name;
  }
  function ne(b) {
    return b !== b;
  }
  const de = (function() {
    const b = "0123456789abcdef", c = new Array(256);
    for (let l = 0; l < 16; ++l) {
      const T = l * 16;
      for (let K = 0; K < 16; ++K) c[T + K] = b[l] + b[K];
    }
    return c;
  })();
  function he(b) {
    return typeof BigInt > "u" ? we : b;
  }
  function we() {
    throw new Error("BigInt not supported");
  }
})(Sa);
const le = Sa.Buffer;
var Zt = {}, wo;
function iu() {
  return wo || (wo = 1, (function(e) {
    Object.defineProperties(e, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
    var r = {}, t = {};
    t.byteLength = h, t.toByteArray = w, t.fromByteArray = x;
    for (var n = [], a = [], o = typeof Uint8Array < "u" ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, f = i.length; s < f; ++s) n[s] = i[s], a[i.charCodeAt(s)] = s;
    a[45] = 62, a[95] = 63;
    function g(S) {
      var _ = S.length;
      if (_ % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var M = S.indexOf("=");
      M === -1 && (M = _);
      var W = M === _ ? 0 : 4 - M % 4;
      return [M, W];
    }
    function h(S) {
      var _ = g(S), M = _[0], W = _[1];
      return (M + W) * 3 / 4 - W;
    }
    function v(S, _, M) {
      return (_ + M) * 3 / 4 - M;
    }
    function w(S) {
      var _, M = g(S), W = M[0], U = M[1], R = new o(v(S, W, U)), N = 0, k = U > 0 ? W - 4 : W, C;
      for (C = 0; C < k; C += 4) _ = a[S.charCodeAt(C)] << 18 | a[S.charCodeAt(C + 1)] << 12 | a[S.charCodeAt(C + 2)] << 6 | a[S.charCodeAt(C + 3)], R[N++] = _ >> 16 & 255, R[N++] = _ >> 8 & 255, R[N++] = _ & 255;
      return U === 2 && (_ = a[S.charCodeAt(C)] << 2 | a[S.charCodeAt(C + 1)] >> 4, R[N++] = _ & 255), U === 1 && (_ = a[S.charCodeAt(C)] << 10 | a[S.charCodeAt(C + 1)] << 4 | a[S.charCodeAt(C + 2)] >> 2, R[N++] = _ >> 8 & 255, R[N++] = _ & 255), R;
    }
    function p(S) {
      return n[S >> 18 & 63] + n[S >> 12 & 63] + n[S >> 6 & 63] + n[S & 63];
    }
    function m(S, _, M) {
      for (var W, U = [], R = _; R < M; R += 3) W = (S[R] << 16 & 16711680) + (S[R + 1] << 8 & 65280) + (S[R + 2] & 255), U.push(p(W));
      return U.join("");
    }
    function x(S) {
      for (var _, M = S.length, W = M % 3, U = [], R = 16383, N = 0, k = M - W; N < k; N += R) U.push(m(S, N, N + R > k ? k : N + R));
      return W === 1 ? (_ = S[M - 1], U.push(n[_ >> 2] + n[_ << 4 & 63] + "==")) : W === 2 && (_ = (S[M - 2] << 8) + S[M - 1], U.push(n[_ >> 10] + n[_ >> 4 & 63] + n[_ << 2 & 63] + "=")), U.join("");
    }
    var j = {};
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    j.read = function(S, _, M, W, U) {
      var R, N, k = U * 8 - W - 1, C = (1 << k) - 1, q = C >> 1, B = -7, F = M ? U - 1 : 0, G = M ? -1 : 1, A = S[_ + F];
      for (F += G, R = A & (1 << -B) - 1, A >>= -B, B += k; B > 0; R = R * 256 + S[_ + F], F += G, B -= 8) ;
      for (N = R & (1 << -B) - 1, R >>= -B, B += W; B > 0; N = N * 256 + S[_ + F], F += G, B -= 8) ;
      if (R === 0) R = 1 - q;
      else {
        if (R === C) return N ? NaN : (A ? -1 : 1) * (1 / 0);
        N = N + Math.pow(2, W), R = R - q;
      }
      return (A ? -1 : 1) * N * Math.pow(2, R - W);
    }, j.write = function(S, _, M, W, U, R) {
      var N, k, C, q = R * 8 - U - 1, B = (1 << q) - 1, F = B >> 1, G = U === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, A = W ? 0 : R - 1, V = W ? 1 : -1, L = _ < 0 || _ === 0 && 1 / _ < 0 ? 1 : 0;
      for (_ = Math.abs(_), isNaN(_) || _ === 1 / 0 ? (k = isNaN(_) ? 1 : 0, N = B) : (N = Math.floor(Math.log(_) / Math.LN2), _ * (C = Math.pow(2, -N)) < 1 && (N--, C *= 2), N + F >= 1 ? _ += G / C : _ += G * Math.pow(2, 1 - F), _ * C >= 2 && (N++, C /= 2), N + F >= B ? (k = 0, N = B) : N + F >= 1 ? (k = (_ * C - 1) * Math.pow(2, U), N = N + F) : (k = _ * Math.pow(2, F - 1) * Math.pow(2, U), N = 0)); U >= 8; S[M + A] = k & 255, A += V, k /= 256, U -= 8) ;
      for (N = N << U | k, q += U; q > 0; S[M + A] = N & 255, A += V, N /= 256, q -= 8) ;
      S[M + A - V] |= L * 128;
    };
    /*!
    * The buffer module from node.js, for the browser.
    *
    * @author   Feross Aboukhadijeh <https://feross.org>
    * @license  MIT
    */
    (function(S) {
      const _ = t, M = j, W = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      S.Buffer = B, S.SlowBuffer = X, S.INSPECT_MAX_BYTES = 50;
      const U = 2147483647;
      S.kMaxLength = U;
      const { Uint8Array: R, ArrayBuffer: N, SharedArrayBuffer: k } = globalThis;
      B.TYPED_ARRAY_SUPPORT = C(), !B.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
      function C() {
        try {
          const E = new R(1), u = { foo: function() {
            return 42;
          } };
          return Object.setPrototypeOf(u, R.prototype), Object.setPrototypeOf(E, u), E.foo() === 42;
        } catch {
          return false;
        }
      }
      Object.defineProperty(B.prototype, "parent", { enumerable: true, get: function() {
        if (B.isBuffer(this)) return this.buffer;
      } }), Object.defineProperty(B.prototype, "offset", { enumerable: true, get: function() {
        if (B.isBuffer(this)) return this.byteOffset;
      } });
      function q(E) {
        if (E > U) throw new RangeError('The value "' + E + '" is invalid for option "size"');
        const u = new R(E);
        return Object.setPrototypeOf(u, B.prototype), u;
      }
      function B(E, u, d) {
        if (typeof E == "number") {
          if (typeof u == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
          return V(E);
        }
        return F(E, u, d);
      }
      B.poolSize = 8192;
      function F(E, u, d) {
        if (typeof E == "string") return L(E, u);
        if (N.isView(E)) return z(E);
        if (E == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof E);
        if ($e(E, N) || E && $e(E.buffer, N) || typeof k < "u" && ($e(E, k) || E && $e(E.buffer, k))) return D(E, u, d);
        if (typeof E == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
        const O = E.valueOf && E.valueOf();
        if (O != null && O !== E) return B.from(O, u, d);
        const Y = I(E);
        if (Y) return Y;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof E[Symbol.toPrimitive] == "function") return B.from(E[Symbol.toPrimitive]("string"), u, d);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof E);
      }
      B.from = function(E, u, d) {
        return F(E, u, d);
      }, Object.setPrototypeOf(B.prototype, R.prototype), Object.setPrototypeOf(B, R);
      function G(E) {
        if (typeof E != "number") throw new TypeError('"size" argument must be of type number');
        if (E < 0) throw new RangeError('The value "' + E + '" is invalid for option "size"');
      }
      function A(E, u, d) {
        return G(E), E <= 0 ? q(E) : u !== void 0 ? typeof d == "string" ? q(E).fill(u, d) : q(E).fill(u) : q(E);
      }
      B.alloc = function(E, u, d) {
        return A(E, u, d);
      };
      function V(E) {
        return G(E), q(E < 0 ? 0 : H(E) | 0);
      }
      B.allocUnsafe = function(E) {
        return V(E);
      }, B.allocUnsafeSlow = function(E) {
        return V(E);
      };
      function L(E, u) {
        if ((typeof u != "string" || u === "") && (u = "utf8"), !B.isEncoding(u)) throw new TypeError("Unknown encoding: " + u);
        const d = Z(E, u) | 0;
        let O = q(d);
        const Y = O.write(E, u);
        return Y !== d && (O = O.slice(0, Y)), O;
      }
      function y(E) {
        const u = E.length < 0 ? 0 : H(E.length) | 0, d = q(u);
        for (let O = 0; O < u; O += 1) d[O] = E[O] & 255;
        return d;
      }
      function z(E) {
        if ($e(E, R)) {
          const u = new R(E);
          return D(u.buffer, u.byteOffset, u.byteLength);
        }
        return y(E);
      }
      function D(E, u, d) {
        if (u < 0 || E.byteLength < u) throw new RangeError('"offset" is outside of buffer bounds');
        if (E.byteLength < u + (d || 0)) throw new RangeError('"length" is outside of buffer bounds');
        let O;
        return u === void 0 && d === void 0 ? O = new R(E) : d === void 0 ? O = new R(E, u) : O = new R(E, u, d), Object.setPrototypeOf(O, B.prototype), O;
      }
      function I(E) {
        if (B.isBuffer(E)) {
          const u = H(E.length) | 0, d = q(u);
          return d.length === 0 || E.copy(d, 0, 0, u), d;
        }
        if (E.length !== void 0) return typeof E.length != "number" || Vr(E.length) ? q(0) : y(E);
        if (E.type === "Buffer" && Array.isArray(E.data)) return y(E.data);
      }
      function H(E) {
        if (E >= U) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + U.toString(16) + " bytes");
        return E | 0;
      }
      function X(E) {
        return +E != E && (E = 0), B.alloc(+E);
      }
      B.isBuffer = function(u) {
        return u != null && u._isBuffer === true && u !== B.prototype;
      }, B.compare = function(u, d) {
        if ($e(u, R) && (u = B.from(u, u.offset, u.byteLength)), $e(d, R) && (d = B.from(d, d.offset, d.byteLength)), !B.isBuffer(u) || !B.isBuffer(d)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (u === d) return 0;
        let O = u.length, Y = d.length;
        for (let $ = 0, re = Math.min(O, Y); $ < re; ++$) if (u[$] !== d[$]) {
          O = u[$], Y = d[$];
          break;
        }
        return O < Y ? -1 : Y < O ? 1 : 0;
      }, B.isEncoding = function(u) {
        switch (String(u).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      }, B.concat = function(u, d) {
        if (!Array.isArray(u)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (u.length === 0) return B.alloc(0);
        let O;
        if (d === void 0) for (d = 0, O = 0; O < u.length; ++O) d += u[O].length;
        const Y = B.allocUnsafe(d);
        let $ = 0;
        for (O = 0; O < u.length; ++O) {
          let re = u[O];
          if ($e(re, R)) $ + re.length > Y.length ? (B.isBuffer(re) || (re = B.from(re)), re.copy(Y, $)) : R.prototype.set.call(Y, re, $);
          else if (B.isBuffer(re)) re.copy(Y, $);
          else throw new TypeError('"list" argument must be an Array of Buffers');
          $ += re.length;
        }
        return Y;
      };
      function Z(E, u) {
        if (B.isBuffer(E)) return E.length;
        if (N.isView(E) || $e(E, N)) return E.byteLength;
        if (typeof E != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof E);
        const d = E.length, O = arguments.length > 2 && arguments[2] === true;
        if (!O && d === 0) return 0;
        let Y = false;
        for (; ; ) switch (u) {
          case "ascii":
          case "latin1":
          case "binary":
            return d;
          case "utf8":
          case "utf-8":
            return Be(E).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return d * 2;
          case "hex":
            return d >>> 1;
          case "base64":
            return Ee(E).length;
          default:
            if (Y) return O ? -1 : Be(E).length;
            u = ("" + u).toLowerCase(), Y = true;
        }
      }
      B.byteLength = Z;
      function ee(E, u, d) {
        let O = false;
        if ((u === void 0 || u < 0) && (u = 0), u > this.length || ((d === void 0 || d > this.length) && (d = this.length), d <= 0) || (d >>>= 0, u >>>= 0, d <= u)) return "";
        for (E || (E = "utf8"); ; ) switch (E) {
          case "hex":
            return Ae(this, u, d);
          case "utf8":
          case "utf-8":
            return _e(this, u, d);
          case "ascii":
            return De(this, u, d);
          case "latin1":
          case "binary":
            return Ve(this, u, d);
          case "base64":
            return me(this, u, d);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return gr(this, u, d);
          default:
            if (O) throw new TypeError("Unknown encoding: " + E);
            E = (E + "").toLowerCase(), O = true;
        }
      }
      B.prototype._isBuffer = true;
      function ce(E, u, d) {
        const O = E[u];
        E[u] = E[d], E[d] = O;
      }
      B.prototype.swap16 = function() {
        const u = this.length;
        if (u % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let d = 0; d < u; d += 2) ce(this, d, d + 1);
        return this;
      }, B.prototype.swap32 = function() {
        const u = this.length;
        if (u % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let d = 0; d < u; d += 4) ce(this, d, d + 3), ce(this, d + 1, d + 2);
        return this;
      }, B.prototype.swap64 = function() {
        const u = this.length;
        if (u % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let d = 0; d < u; d += 8) ce(this, d, d + 7), ce(this, d + 1, d + 6), ce(this, d + 2, d + 5), ce(this, d + 3, d + 4);
        return this;
      }, B.prototype.toString = function() {
        const u = this.length;
        return u === 0 ? "" : arguments.length === 0 ? _e(this, 0, u) : ee.apply(this, arguments);
      }, B.prototype.toLocaleString = B.prototype.toString, B.prototype.equals = function(u) {
        if (!B.isBuffer(u)) throw new TypeError("Argument must be a Buffer");
        return this === u ? true : B.compare(this, u) === 0;
      }, B.prototype.inspect = function() {
        let u = "";
        const d = S.INSPECT_MAX_BYTES;
        return u = this.toString("hex", 0, d).replace(/(.{2})/g, "$1 ").trim(), this.length > d && (u += " ... "), "<Buffer " + u + ">";
      }, W && (B.prototype[W] = B.prototype.inspect), B.prototype.compare = function(u, d, O, Y, $) {
        if ($e(u, R) && (u = B.from(u, u.offset, u.byteLength)), !B.isBuffer(u)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof u);
        if (d === void 0 && (d = 0), O === void 0 && (O = u ? u.length : 0), Y === void 0 && (Y = 0), $ === void 0 && ($ = this.length), d < 0 || O > u.length || Y < 0 || $ > this.length) throw new RangeError("out of range index");
        if (Y >= $ && d >= O) return 0;
        if (Y >= $) return -1;
        if (d >= O) return 1;
        if (d >>>= 0, O >>>= 0, Y >>>= 0, $ >>>= 0, this === u) return 0;
        let re = $ - Y, ze = O - d;
        const qe = Math.min(re, ze), Le = this.slice(Y, $), Fe = u.slice(d, O);
        for (let Re = 0; Re < qe; ++Re) if (Le[Re] !== Fe[Re]) {
          re = Le[Re], ze = Fe[Re];
          break;
        }
        return re < ze ? -1 : ze < re ? 1 : 0;
      };
      function ue(E, u, d, O, Y) {
        if (E.length === 0) return -1;
        if (typeof d == "string" ? (O = d, d = 0) : d > 2147483647 ? d = 2147483647 : d < -2147483648 && (d = -2147483648), d = +d, Vr(d) && (d = Y ? 0 : E.length - 1), d < 0 && (d = E.length + d), d >= E.length) {
          if (Y) return -1;
          d = E.length - 1;
        } else if (d < 0) if (Y) d = 0;
        else return -1;
        if (typeof u == "string" && (u = B.from(u, O)), B.isBuffer(u)) return u.length === 0 ? -1 : ie(E, u, d, O, Y);
        if (typeof u == "number") return u = u & 255, typeof R.prototype.indexOf == "function" ? Y ? R.prototype.indexOf.call(E, u, d) : R.prototype.lastIndexOf.call(E, u, d) : ie(E, [u], d, O, Y);
        throw new TypeError("val must be string, number or Buffer");
      }
      function ie(E, u, d, O, Y) {
        let $ = 1, re = E.length, ze = u.length;
        if (O !== void 0 && (O = String(O).toLowerCase(), O === "ucs2" || O === "ucs-2" || O === "utf16le" || O === "utf-16le")) {
          if (E.length < 2 || u.length < 2) return -1;
          $ = 2, re /= 2, ze /= 2, d /= 2;
        }
        function qe(Fe, Re) {
          return $ === 1 ? Fe[Re] : Fe.readUInt16BE(Re * $);
        }
        let Le;
        if (Y) {
          let Fe = -1;
          for (Le = d; Le < re; Le++) if (qe(E, Le) === qe(u, Fe === -1 ? 0 : Le - Fe)) {
            if (Fe === -1 && (Fe = Le), Le - Fe + 1 === ze) return Fe * $;
          } else Fe !== -1 && (Le -= Le - Fe), Fe = -1;
        } else for (d + ze > re && (d = re - ze), Le = d; Le >= 0; Le--) {
          let Fe = true;
          for (let Re = 0; Re < ze; Re++) if (qe(E, Le + Re) !== qe(u, Re)) {
            Fe = false;
            break;
          }
          if (Fe) return Le;
        }
        return -1;
      }
      B.prototype.includes = function(u, d, O) {
        return this.indexOf(u, d, O) !== -1;
      }, B.prototype.indexOf = function(u, d, O) {
        return ue(this, u, d, O, true);
      }, B.prototype.lastIndexOf = function(u, d, O) {
        return ue(this, u, d, O, false);
      };
      function ae(E, u, d, O) {
        d = Number(d) || 0;
        const Y = E.length - d;
        O ? (O = Number(O), O > Y && (O = Y)) : O = Y;
        const $ = u.length;
        O > $ / 2 && (O = $ / 2);
        let re;
        for (re = 0; re < O; ++re) {
          const ze = parseInt(u.substr(re * 2, 2), 16);
          if (Vr(ze)) return re;
          E[d + re] = ze;
        }
        return re;
      }
      function fe(E, u, d, O) {
        return ur(Be(u, E.length - d), E, d, O);
      }
      function be(E, u, d, O) {
        return ur(Se(u), E, d, O);
      }
      function ye(E, u, d, O) {
        return ur(Ee(u), E, d, O);
      }
      function te(E, u, d, O) {
        return ur(ke(u, E.length - d), E, d, O);
      }
      B.prototype.write = function(u, d, O, Y) {
        if (d === void 0) Y = "utf8", O = this.length, d = 0;
        else if (O === void 0 && typeof d == "string") Y = d, O = this.length, d = 0;
        else if (isFinite(d)) d = d >>> 0, isFinite(O) ? (O = O >>> 0, Y === void 0 && (Y = "utf8")) : (Y = O, O = void 0);
        else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        const $ = this.length - d;
        if ((O === void 0 || O > $) && (O = $), u.length > 0 && (O < 0 || d < 0) || d > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        Y || (Y = "utf8");
        let re = false;
        for (; ; ) switch (Y) {
          case "hex":
            return ae(this, u, d, O);
          case "utf8":
          case "utf-8":
            return fe(this, u, d, O);
          case "ascii":
          case "latin1":
          case "binary":
            return be(this, u, d, O);
          case "base64":
            return ye(this, u, d, O);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return te(this, u, d, O);
          default:
            if (re) throw new TypeError("Unknown encoding: " + Y);
            Y = ("" + Y).toLowerCase(), re = true;
        }
      }, B.prototype.toJSON = function() {
        return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
      };
      function me(E, u, d) {
        return u === 0 && d === E.length ? _.fromByteArray(E) : _.fromByteArray(E.slice(u, d));
      }
      function _e(E, u, d) {
        d = Math.min(E.length, d);
        const O = [];
        let Y = u;
        for (; Y < d; ) {
          const $ = E[Y];
          let re = null, ze = $ > 239 ? 4 : $ > 223 ? 3 : $ > 191 ? 2 : 1;
          if (Y + ze <= d) {
            let qe, Le, Fe, Re;
            switch (ze) {
              case 1:
                $ < 128 && (re = $);
                break;
              case 2:
                qe = E[Y + 1], (qe & 192) === 128 && (Re = ($ & 31) << 6 | qe & 63, Re > 127 && (re = Re));
                break;
              case 3:
                qe = E[Y + 1], Le = E[Y + 2], (qe & 192) === 128 && (Le & 192) === 128 && (Re = ($ & 15) << 12 | (qe & 63) << 6 | Le & 63, Re > 2047 && (Re < 55296 || Re > 57343) && (re = Re));
                break;
              case 4:
                qe = E[Y + 1], Le = E[Y + 2], Fe = E[Y + 3], (qe & 192) === 128 && (Le & 192) === 128 && (Fe & 192) === 128 && (Re = ($ & 15) << 18 | (qe & 63) << 12 | (Le & 63) << 6 | Fe & 63, Re > 65535 && Re < 1114112 && (re = Re));
            }
          }
          re === null ? (re = 65533, ze = 1) : re > 65535 && (re -= 65536, O.push(re >>> 10 & 1023 | 55296), re = 56320 | re & 1023), O.push(re), Y += ze;
        }
        return Oe(O);
      }
      const Ce = 4096;
      function Oe(E) {
        const u = E.length;
        if (u <= Ce) return String.fromCharCode.apply(String, E);
        let d = "", O = 0;
        for (; O < u; ) d += String.fromCharCode.apply(String, E.slice(O, O += Ce));
        return d;
      }
      function De(E, u, d) {
        let O = "";
        d = Math.min(E.length, d);
        for (let Y = u; Y < d; ++Y) O += String.fromCharCode(E[Y] & 127);
        return O;
      }
      function Ve(E, u, d) {
        let O = "";
        d = Math.min(E.length, d);
        for (let Y = u; Y < d; ++Y) O += String.fromCharCode(E[Y]);
        return O;
      }
      function Ae(E, u, d) {
        const O = E.length;
        (!u || u < 0) && (u = 0), (!d || d < 0 || d > O) && (d = O);
        let Y = "";
        for (let $ = u; $ < d; ++$) Y += is[E[$]];
        return Y;
      }
      function gr(E, u, d) {
        const O = E.slice(u, d);
        let Y = "";
        for (let $ = 0; $ < O.length - 1; $ += 2) Y += String.fromCharCode(O[$] + O[$ + 1] * 256);
        return Y;
      }
      B.prototype.slice = function(u, d) {
        const O = this.length;
        u = ~~u, d = d === void 0 ? O : ~~d, u < 0 ? (u += O, u < 0 && (u = 0)) : u > O && (u = O), d < 0 ? (d += O, d < 0 && (d = 0)) : d > O && (d = O), d < u && (d = u);
        const Y = this.subarray(u, d);
        return Object.setPrototypeOf(Y, B.prototype), Y;
      };
      function je(E, u, d) {
        if (E % 1 !== 0 || E < 0) throw new RangeError("offset is not uint");
        if (E + u > d) throw new RangeError("Trying to access beyond buffer length");
      }
      B.prototype.readUintLE = B.prototype.readUIntLE = function(u, d, O) {
        u = u >>> 0, d = d >>> 0, O || je(u, d, this.length);
        let Y = this[u], $ = 1, re = 0;
        for (; ++re < d && ($ *= 256); ) Y += this[u + re] * $;
        return Y;
      }, B.prototype.readUintBE = B.prototype.readUIntBE = function(u, d, O) {
        u = u >>> 0, d = d >>> 0, O || je(u, d, this.length);
        let Y = this[u + --d], $ = 1;
        for (; d > 0 && ($ *= 256); ) Y += this[u + --d] * $;
        return Y;
      }, B.prototype.readUint8 = B.prototype.readUInt8 = function(u, d) {
        return u = u >>> 0, d || je(u, 1, this.length), this[u];
      }, B.prototype.readUint16LE = B.prototype.readUInt16LE = function(u, d) {
        return u = u >>> 0, d || je(u, 2, this.length), this[u] | this[u + 1] << 8;
      }, B.prototype.readUint16BE = B.prototype.readUInt16BE = function(u, d) {
        return u = u >>> 0, d || je(u, 2, this.length), this[u] << 8 | this[u + 1];
      }, B.prototype.readUint32LE = B.prototype.readUInt32LE = function(u, d) {
        return u = u >>> 0, d || je(u, 4, this.length), (this[u] | this[u + 1] << 8 | this[u + 2] << 16) + this[u + 3] * 16777216;
      }, B.prototype.readUint32BE = B.prototype.readUInt32BE = function(u, d) {
        return u = u >>> 0, d || je(u, 4, this.length), this[u] * 16777216 + (this[u + 1] << 16 | this[u + 2] << 8 | this[u + 3]);
      }, B.prototype.readBigUInt64LE = br(function(u) {
        u = u >>> 0, K(u, "offset");
        const d = this[u], O = this[u + 7];
        (d === void 0 || O === void 0) && J(u, this.length - 8);
        const Y = d + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + this[++u] * 2 ** 24, $ = this[++u] + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + O * 2 ** 24;
        return BigInt(Y) + (BigInt($) << BigInt(32));
      }), B.prototype.readBigUInt64BE = br(function(u) {
        u = u >>> 0, K(u, "offset");
        const d = this[u], O = this[u + 7];
        (d === void 0 || O === void 0) && J(u, this.length - 8);
        const Y = d * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + this[++u], $ = this[++u] * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + O;
        return (BigInt(Y) << BigInt(32)) + BigInt($);
      }), B.prototype.readIntLE = function(u, d, O) {
        u = u >>> 0, d = d >>> 0, O || je(u, d, this.length);
        let Y = this[u], $ = 1, re = 0;
        for (; ++re < d && ($ *= 256); ) Y += this[u + re] * $;
        return $ *= 128, Y >= $ && (Y -= Math.pow(2, 8 * d)), Y;
      }, B.prototype.readIntBE = function(u, d, O) {
        u = u >>> 0, d = d >>> 0, O || je(u, d, this.length);
        let Y = d, $ = 1, re = this[u + --Y];
        for (; Y > 0 && ($ *= 256); ) re += this[u + --Y] * $;
        return $ *= 128, re >= $ && (re -= Math.pow(2, 8 * d)), re;
      }, B.prototype.readInt8 = function(u, d) {
        return u = u >>> 0, d || je(u, 1, this.length), this[u] & 128 ? (255 - this[u] + 1) * -1 : this[u];
      }, B.prototype.readInt16LE = function(u, d) {
        u = u >>> 0, d || je(u, 2, this.length);
        const O = this[u] | this[u + 1] << 8;
        return O & 32768 ? O | 4294901760 : O;
      }, B.prototype.readInt16BE = function(u, d) {
        u = u >>> 0, d || je(u, 2, this.length);
        const O = this[u + 1] | this[u] << 8;
        return O & 32768 ? O | 4294901760 : O;
      }, B.prototype.readInt32LE = function(u, d) {
        return u = u >>> 0, d || je(u, 4, this.length), this[u] | this[u + 1] << 8 | this[u + 2] << 16 | this[u + 3] << 24;
      }, B.prototype.readInt32BE = function(u, d) {
        return u = u >>> 0, d || je(u, 4, this.length), this[u] << 24 | this[u + 1] << 16 | this[u + 2] << 8 | this[u + 3];
      }, B.prototype.readBigInt64LE = br(function(u) {
        u = u >>> 0, K(u, "offset");
        const d = this[u], O = this[u + 7];
        (d === void 0 || O === void 0) && J(u, this.length - 8);
        const Y = this[u + 4] + this[u + 5] * 2 ** 8 + this[u + 6] * 2 ** 16 + (O << 24);
        return (BigInt(Y) << BigInt(32)) + BigInt(d + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + this[++u] * 2 ** 24);
      }), B.prototype.readBigInt64BE = br(function(u) {
        u = u >>> 0, K(u, "offset");
        const d = this[u], O = this[u + 7];
        (d === void 0 || O === void 0) && J(u, this.length - 8);
        const Y = (d << 24) + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + this[++u];
        return (BigInt(Y) << BigInt(32)) + BigInt(this[++u] * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + O);
      }), B.prototype.readFloatLE = function(u, d) {
        return u = u >>> 0, d || je(u, 4, this.length), M.read(this, u, true, 23, 4);
      }, B.prototype.readFloatBE = function(u, d) {
        return u = u >>> 0, d || je(u, 4, this.length), M.read(this, u, false, 23, 4);
      }, B.prototype.readDoubleLE = function(u, d) {
        return u = u >>> 0, d || je(u, 8, this.length), M.read(this, u, true, 52, 8);
      }, B.prototype.readDoubleBE = function(u, d) {
        return u = u >>> 0, d || je(u, 8, this.length), M.read(this, u, false, 52, 8);
      };
      function xe(E, u, d, O, Y, $) {
        if (!B.isBuffer(E)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (u > Y || u < $) throw new RangeError('"value" argument is out of bounds');
        if (d + O > E.length) throw new RangeError("Index out of range");
      }
      B.prototype.writeUintLE = B.prototype.writeUIntLE = function(u, d, O, Y) {
        if (u = +u, d = d >>> 0, O = O >>> 0, !Y) {
          const ze = Math.pow(2, 8 * O) - 1;
          xe(this, u, d, O, ze, 0);
        }
        let $ = 1, re = 0;
        for (this[d] = u & 255; ++re < O && ($ *= 256); ) this[d + re] = u / $ & 255;
        return d + O;
      }, B.prototype.writeUintBE = B.prototype.writeUIntBE = function(u, d, O, Y) {
        if (u = +u, d = d >>> 0, O = O >>> 0, !Y) {
          const ze = Math.pow(2, 8 * O) - 1;
          xe(this, u, d, O, ze, 0);
        }
        let $ = O - 1, re = 1;
        for (this[d + $] = u & 255; --$ >= 0 && (re *= 256); ) this[d + $] = u / re & 255;
        return d + O;
      }, B.prototype.writeUint8 = B.prototype.writeUInt8 = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 1, 255, 0), this[d] = u & 255, d + 1;
      }, B.prototype.writeUint16LE = B.prototype.writeUInt16LE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 2, 65535, 0), this[d] = u & 255, this[d + 1] = u >>> 8, d + 2;
      }, B.prototype.writeUint16BE = B.prototype.writeUInt16BE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 2, 65535, 0), this[d] = u >>> 8, this[d + 1] = u & 255, d + 2;
      }, B.prototype.writeUint32LE = B.prototype.writeUInt32LE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 4, 4294967295, 0), this[d + 3] = u >>> 24, this[d + 2] = u >>> 16, this[d + 1] = u >>> 8, this[d] = u & 255, d + 4;
      }, B.prototype.writeUint32BE = B.prototype.writeUInt32BE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 4, 4294967295, 0), this[d] = u >>> 24, this[d + 1] = u >>> 16, this[d + 2] = u >>> 8, this[d + 3] = u & 255, d + 4;
      };
      function se(E, u, d, O, Y) {
        T(u, O, Y, E, d, 7);
        let $ = Number(u & BigInt(4294967295));
        E[d++] = $, $ = $ >> 8, E[d++] = $, $ = $ >> 8, E[d++] = $, $ = $ >> 8, E[d++] = $;
        let re = Number(u >> BigInt(32) & BigInt(4294967295));
        return E[d++] = re, re = re >> 8, E[d++] = re, re = re >> 8, E[d++] = re, re = re >> 8, E[d++] = re, d;
      }
      function oe(E, u, d, O, Y) {
        T(u, O, Y, E, d, 7);
        let $ = Number(u & BigInt(4294967295));
        E[d + 7] = $, $ = $ >> 8, E[d + 6] = $, $ = $ >> 8, E[d + 5] = $, $ = $ >> 8, E[d + 4] = $;
        let re = Number(u >> BigInt(32) & BigInt(4294967295));
        return E[d + 3] = re, re = re >> 8, E[d + 2] = re, re = re >> 8, E[d + 1] = re, re = re >> 8, E[d] = re, d + 8;
      }
      B.prototype.writeBigUInt64LE = br(function(u, d = 0) {
        return se(this, u, d, BigInt(0), BigInt("0xffffffffffffffff"));
      }), B.prototype.writeBigUInt64BE = br(function(u, d = 0) {
        return oe(this, u, d, BigInt(0), BigInt("0xffffffffffffffff"));
      }), B.prototype.writeIntLE = function(u, d, O, Y) {
        if (u = +u, d = d >>> 0, !Y) {
          const qe = Math.pow(2, 8 * O - 1);
          xe(this, u, d, O, qe - 1, -qe);
        }
        let $ = 0, re = 1, ze = 0;
        for (this[d] = u & 255; ++$ < O && (re *= 256); ) u < 0 && ze === 0 && this[d + $ - 1] !== 0 && (ze = 1), this[d + $] = (u / re >> 0) - ze & 255;
        return d + O;
      }, B.prototype.writeIntBE = function(u, d, O, Y) {
        if (u = +u, d = d >>> 0, !Y) {
          const qe = Math.pow(2, 8 * O - 1);
          xe(this, u, d, O, qe - 1, -qe);
        }
        let $ = O - 1, re = 1, ze = 0;
        for (this[d + $] = u & 255; --$ >= 0 && (re *= 256); ) u < 0 && ze === 0 && this[d + $ + 1] !== 0 && (ze = 1), this[d + $] = (u / re >> 0) - ze & 255;
        return d + O;
      }, B.prototype.writeInt8 = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 1, 127, -128), u < 0 && (u = 255 + u + 1), this[d] = u & 255, d + 1;
      }, B.prototype.writeInt16LE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 2, 32767, -32768), this[d] = u & 255, this[d + 1] = u >>> 8, d + 2;
      }, B.prototype.writeInt16BE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 2, 32767, -32768), this[d] = u >>> 8, this[d + 1] = u & 255, d + 2;
      }, B.prototype.writeInt32LE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 4, 2147483647, -2147483648), this[d] = u & 255, this[d + 1] = u >>> 8, this[d + 2] = u >>> 16, this[d + 3] = u >>> 24, d + 4;
      }, B.prototype.writeInt32BE = function(u, d, O) {
        return u = +u, d = d >>> 0, O || xe(this, u, d, 4, 2147483647, -2147483648), u < 0 && (u = 4294967295 + u + 1), this[d] = u >>> 24, this[d + 1] = u >>> 16, this[d + 2] = u >>> 8, this[d + 3] = u & 255, d + 4;
      }, B.prototype.writeBigInt64LE = br(function(u, d = 0) {
        return se(this, u, d, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }), B.prototype.writeBigInt64BE = br(function(u, d = 0) {
        return oe(this, u, d, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function ne(E, u, d, O, Y, $) {
        if (d + O > E.length) throw new RangeError("Index out of range");
        if (d < 0) throw new RangeError("Index out of range");
      }
      function de(E, u, d, O, Y) {
        return u = +u, d = d >>> 0, Y || ne(E, u, d, 4), M.write(E, u, d, O, 23, 4), d + 4;
      }
      B.prototype.writeFloatLE = function(u, d, O) {
        return de(this, u, d, true, O);
      }, B.prototype.writeFloatBE = function(u, d, O) {
        return de(this, u, d, false, O);
      };
      function he(E, u, d, O, Y) {
        return u = +u, d = d >>> 0, Y || ne(E, u, d, 8), M.write(E, u, d, O, 52, 8), d + 8;
      }
      B.prototype.writeDoubleLE = function(u, d, O) {
        return he(this, u, d, true, O);
      }, B.prototype.writeDoubleBE = function(u, d, O) {
        return he(this, u, d, false, O);
      }, B.prototype.copy = function(u, d, O, Y) {
        if (!B.isBuffer(u)) throw new TypeError("argument should be a Buffer");
        if (O || (O = 0), !Y && Y !== 0 && (Y = this.length), d >= u.length && (d = u.length), d || (d = 0), Y > 0 && Y < O && (Y = O), Y === O || u.length === 0 || this.length === 0) return 0;
        if (d < 0) throw new RangeError("targetStart out of bounds");
        if (O < 0 || O >= this.length) throw new RangeError("Index out of range");
        if (Y < 0) throw new RangeError("sourceEnd out of bounds");
        Y > this.length && (Y = this.length), u.length - d < Y - O && (Y = u.length - d + O);
        const $ = Y - O;
        return this === u && typeof R.prototype.copyWithin == "function" ? this.copyWithin(d, O, Y) : R.prototype.set.call(u, this.subarray(O, Y), d), $;
      }, B.prototype.fill = function(u, d, O, Y) {
        if (typeof u == "string") {
          if (typeof d == "string" ? (Y = d, d = 0, O = this.length) : typeof O == "string" && (Y = O, O = this.length), Y !== void 0 && typeof Y != "string") throw new TypeError("encoding must be a string");
          if (typeof Y == "string" && !B.isEncoding(Y)) throw new TypeError("Unknown encoding: " + Y);
          if (u.length === 1) {
            const re = u.charCodeAt(0);
            (Y === "utf8" && re < 128 || Y === "latin1") && (u = re);
          }
        } else typeof u == "number" ? u = u & 255 : typeof u == "boolean" && (u = Number(u));
        if (d < 0 || this.length < d || this.length < O) throw new RangeError("Out of range index");
        if (O <= d) return this;
        d = d >>> 0, O = O === void 0 ? this.length : O >>> 0, u || (u = 0);
        let $;
        if (typeof u == "number") for ($ = d; $ < O; ++$) this[$] = u;
        else {
          const re = B.isBuffer(u) ? u : B.from(u, Y), ze = re.length;
          if (ze === 0) throw new TypeError('The value "' + u + '" is invalid for argument "value"');
          for ($ = 0; $ < O - d; ++$) this[$ + d] = re[$ % ze];
        }
        return this;
      };
      const we = {};
      function b(E, u, d) {
        we[E] = class extends d {
          constructor() {
            super(), Object.defineProperty(this, "message", { value: u.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${E}]`, this.stack, delete this.name;
          }
          get code() {
            return E;
          }
          set code(Y) {
            Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: Y, writable: true });
          }
          toString() {
            return `${this.name} [${E}]: ${this.message}`;
          }
        };
      }
      b("ERR_BUFFER_OUT_OF_BOUNDS", function(E) {
        return E ? `${E} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      }, RangeError), b("ERR_INVALID_ARG_TYPE", function(E, u) {
        return `The "${E}" argument must be of type number. Received type ${typeof u}`;
      }, TypeError), b("ERR_OUT_OF_RANGE", function(E, u, d) {
        let O = `The value of "${E}" is out of range.`, Y = d;
        return Number.isInteger(d) && Math.abs(d) > 2 ** 32 ? Y = c(String(d)) : typeof d == "bigint" && (Y = String(d), (d > BigInt(2) ** BigInt(32) || d < -(BigInt(2) ** BigInt(32))) && (Y = c(Y)), Y += "n"), O += ` It must be ${u}. Received ${Y}`, O;
      }, RangeError);
      function c(E) {
        let u = "", d = E.length;
        const O = E[0] === "-" ? 1 : 0;
        for (; d >= O + 4; d -= 3) u = `_${E.slice(d - 3, d)}${u}`;
        return `${E.slice(0, d)}${u}`;
      }
      function l(E, u, d) {
        K(u, "offset"), (E[u] === void 0 || E[u + d] === void 0) && J(u, E.length - (d + 1));
      }
      function T(E, u, d, O, Y, $) {
        if (E > d || E < u) {
          const re = typeof u == "bigint" ? "n" : "";
          let ze;
          throw u === 0 || u === BigInt(0) ? ze = `>= 0${re} and < 2${re} ** ${($ + 1) * 8}${re}` : ze = `>= -(2${re} ** ${($ + 1) * 8 - 1}${re}) and < 2 ** ${($ + 1) * 8 - 1}${re}`, new we.ERR_OUT_OF_RANGE("value", ze, E);
        }
        l(O, Y, $);
      }
      function K(E, u) {
        if (typeof E != "number") throw new we.ERR_INVALID_ARG_TYPE(u, "number", E);
      }
      function J(E, u, d) {
        throw Math.floor(E) !== E ? (K(E, d), new we.ERR_OUT_OF_RANGE("offset", "an integer", E)) : u < 0 ? new we.ERR_BUFFER_OUT_OF_BOUNDS() : new we.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${u}`, E);
      }
      const Q = /[^+/0-9A-Za-z-_]/g;
      function ge(E) {
        if (E = E.split("=")[0], E = E.trim().replace(Q, ""), E.length < 2) return "";
        for (; E.length % 4 !== 0; ) E = E + "=";
        return E;
      }
      function Be(E, u) {
        u = u || 1 / 0;
        let d;
        const O = E.length;
        let Y = null;
        const $ = [];
        for (let re = 0; re < O; ++re) {
          if (d = E.charCodeAt(re), d > 55295 && d < 57344) {
            if (!Y) {
              if (d > 56319) {
                (u -= 3) > -1 && $.push(239, 191, 189);
                continue;
              } else if (re + 1 === O) {
                (u -= 3) > -1 && $.push(239, 191, 189);
                continue;
              }
              Y = d;
              continue;
            }
            if (d < 56320) {
              (u -= 3) > -1 && $.push(239, 191, 189), Y = d;
              continue;
            }
            d = (Y - 55296 << 10 | d - 56320) + 65536;
          } else Y && (u -= 3) > -1 && $.push(239, 191, 189);
          if (Y = null, d < 128) {
            if ((u -= 1) < 0) break;
            $.push(d);
          } else if (d < 2048) {
            if ((u -= 2) < 0) break;
            $.push(d >> 6 | 192, d & 63 | 128);
          } else if (d < 65536) {
            if ((u -= 3) < 0) break;
            $.push(d >> 12 | 224, d >> 6 & 63 | 128, d & 63 | 128);
          } else if (d < 1114112) {
            if ((u -= 4) < 0) break;
            $.push(d >> 18 | 240, d >> 12 & 63 | 128, d >> 6 & 63 | 128, d & 63 | 128);
          } else throw new Error("Invalid code point");
        }
        return $;
      }
      function Se(E) {
        const u = [];
        for (let d = 0; d < E.length; ++d) u.push(E.charCodeAt(d) & 255);
        return u;
      }
      function ke(E, u) {
        let d, O, Y;
        const $ = [];
        for (let re = 0; re < E.length && !((u -= 2) < 0); ++re) d = E.charCodeAt(re), O = d >> 8, Y = d % 256, $.push(Y), $.push(O);
        return $;
      }
      function Ee(E) {
        return _.toByteArray(ge(E));
      }
      function ur(E, u, d, O) {
        let Y;
        for (Y = 0; Y < O && !(Y + d >= u.length || Y >= E.length); ++Y) u[Y + d] = E[Y];
        return Y;
      }
      function $e(E, u) {
        return E instanceof u || E != null && E.constructor != null && E.constructor.name != null && E.constructor.name === u.name;
      }
      function Vr(E) {
        return E !== E;
      }
      const is = (function() {
        const E = "0123456789abcdef", u = new Array(256);
        for (let d = 0; d < 16; ++d) {
          const O = d * 16;
          for (let Y = 0; Y < 16; ++Y) u[O + Y] = E[d] + E[Y];
        }
        return u;
      })();
      function br(E) {
        return typeof BigInt > "u" ? as : E;
      }
      function as() {
        throw new Error("BigInt not supported");
      }
    })(r);
    const P = r.Buffer;
    e.Blob = r.Blob, e.BlobOptions = r.BlobOptions, e.Buffer = r.Buffer, e.File = r.File, e.FileOptions = r.FileOptions, e.INSPECT_MAX_BYTES = r.INSPECT_MAX_BYTES, e.SlowBuffer = r.SlowBuffer, e.TranscodeEncoding = r.TranscodeEncoding, e.atob = r.atob, e.btoa = r.btoa, e.constants = r.constants, e.default = P, e.isAscii = r.isAscii, e.isUtf8 = r.isUtf8, e.kMaxLength = r.kMaxLength, e.kStringMaxLength = r.kStringMaxLength, e.resolveObjectURL = r.resolveObjectURL, e.transcode = r.transcode;
  })(Zt)), Zt;
}
var Qt, xo;
function eo() {
  if (xo) return Qt;
  xo = 1;
  var e = { Array: function(t) {
    return t != null && t.constructor === Array;
  }, Boolean: function(t) {
    return typeof t == "boolean";
  }, Function: function(t) {
    return typeof t == "function";
  }, Nil: function(t) {
    return t == null;
  }, Number: function(t) {
    return typeof t == "number";
  }, Object: function(t) {
    return typeof t == "object";
  }, String: function(t) {
    return typeof t == "string";
  }, "": function() {
    return true;
  } };
  e.Null = e.Nil;
  for (var r in e) e[r].toJSON = (function(t) {
    return t;
  }).bind(null, r);
  return Qt = e, Qt;
}
var $t, ko;
function za() {
  if (ko) return $t;
  ko = 1;
  var e = eo();
  function r(w) {
    return w.name || w.toString().match(/function (.*?)\s*\(/)[1];
  }
  function t(w) {
    return e.Nil(w) ? "" : r(w.constructor);
  }
  function n(w) {
    return e.Function(w) ? "" : e.String(w) ? JSON.stringify(w) : w && e.Object(w) ? "" : w;
  }
  function a(w, p) {
    Error.captureStackTrace && Error.captureStackTrace(w, p);
  }
  function o(w) {
    return e.Function(w) ? w.toJSON ? w.toJSON() : r(w) : e.Array(w) ? "Array" : w && e.Object(w) ? "Object" : w !== void 0 ? w : "";
  }
  function i(w, p, m) {
    var x = n(p);
    return "Expected " + o(w) + ", got" + (m !== "" ? " " + m : "") + (x !== "" ? " " + x : "");
  }
  function s(w, p, m) {
    m = m || t(p), this.message = i(w, p, m), a(this, s), this.__type = w, this.__value = p, this.__valueTypeName = m;
  }
  s.prototype = Object.create(Error.prototype), s.prototype.constructor = s;
  function f(w, p, m, x, j) {
    var P = '" of type ';
    return p === "key" && (P = '" with key type '), i('property "' + o(m) + P + o(w), x, j);
  }
  function g(w, p, m, x, j) {
    w ? (j = j || t(x), this.message = f(w, m, p, x, j)) : this.message = 'Unexpected property "' + p + '"', a(this, s), this.__label = m, this.__property = p, this.__type = w, this.__value = x, this.__valueTypeName = j;
  }
  g.prototype = Object.create(Error.prototype), g.prototype.constructor = s;
  function h(w, p) {
    return new s(w, {}, p);
  }
  function v(w, p, m) {
    return w instanceof g ? (p = p + "." + w.__property, w = new g(w.__type, p, w.__label, w.__value, w.__valueTypeName)) : w instanceof s && (w = new g(w.__type, p, m, w.__value, w.__valueTypeName)), a(w), w;
  }
  return $t = { TfTypeError: s, TfPropertyTypeError: g, tfCustomError: h, tfSubError: v, tfJSON: o, getValueTypeName: t }, $t;
}
var en, Eo;
function au() {
  if (Eo) return en;
  Eo = 1;
  var e = eo(), r = za();
  function t(U) {
    return le.isBuffer(U);
  }
  function n(U) {
    return typeof U == "string" && /^([0-9a-f]{2})+$/i.test(U);
  }
  function a(U, R) {
    var N = U.toJSON();
    function k(C) {
      if (!U(C)) return false;
      if (C.length === R) return true;
      throw r.tfCustomError(N + "(Length: " + R + ")", N + "(Length: " + C.length + ")");
    }
    return k.toJSON = function() {
      return N;
    }, k;
  }
  var o = a.bind(null, e.Array), i = a.bind(null, t), s = a.bind(null, n), f = a.bind(null, e.String);
  function g(U, R, N) {
    N = N || e.Number;
    function k(C, q) {
      return N(C, q) && C > U && C < R;
    }
    return k.toJSON = function() {
      return `${N.toJSON()} between [${U}, ${R}]`;
    }, k;
  }
  var h = Math.pow(2, 53) - 1;
  function v(U) {
    return typeof U == "number" && isFinite(U);
  }
  function w(U) {
    return U << 24 >> 24 === U;
  }
  function p(U) {
    return U << 16 >> 16 === U;
  }
  function m(U) {
    return (U | 0) === U;
  }
  function x(U) {
    return typeof U == "number" && U >= -h && U <= h && Math.floor(U) === U;
  }
  function j(U) {
    return (U & 255) === U;
  }
  function P(U) {
    return (U & 65535) === U;
  }
  function S(U) {
    return U >>> 0 === U;
  }
  function _(U) {
    return typeof U == "number" && U >= 0 && U <= h && Math.floor(U) === U;
  }
  var M = { ArrayN: o, Buffer: t, BufferN: i, Finite: v, Hex: n, HexN: s, Int8: w, Int16: p, Int32: m, Int53: x, Range: g, StringN: f, UInt8: j, UInt16: P, UInt32: S, UInt53: _ };
  for (var W in M) M[W].toJSON = (function(U) {
    return U;
  }).bind(null, W);
  return en = M, en;
}
var rn, Bo;
function Ff() {
  if (Bo) return rn;
  Bo = 1;
  var e = za(), r = eo(), t = e.tfJSON, n = e.TfTypeError, a = e.TfPropertyTypeError, o = e.tfSubError, i = e.getValueTypeName, s = { arrayOf: function(p, m) {
    p = f(p), m = m || {};
    function x(j, P) {
      return !r.Array(j) || r.Nil(j) || m.minLength !== void 0 && j.length < m.minLength || m.maxLength !== void 0 && j.length > m.maxLength || m.length !== void 0 && j.length !== m.length ? false : j.every(function(S, _) {
        try {
          return g(p, S, P);
        } catch (M) {
          throw o(M, _);
        }
      });
    }
    return x.toJSON = function() {
      var j = "[" + t(p) + "]";
      return m.length !== void 0 ? j += "{" + m.length + "}" : (m.minLength !== void 0 || m.maxLength !== void 0) && (j += "{" + (m.minLength === void 0 ? 0 : m.minLength) + "," + (m.maxLength === void 0 ? 1 / 0 : m.maxLength) + "}"), j;
    }, x;
  }, maybe: function w(p) {
    p = f(p);
    function m(x, j) {
      return r.Nil(x) || p(x, j, w);
    }
    return m.toJSON = function() {
      return "?" + t(p);
    }, m;
  }, map: function(p, m) {
    p = f(p), m && (m = f(m));
    function x(j, P) {
      if (!r.Object(j) || r.Nil(j)) return false;
      for (var S in j) {
        try {
          m && g(m, S, P);
        } catch (M) {
          throw o(M, S, "key");
        }
        try {
          var _ = j[S];
          g(p, _, P);
        } catch (M) {
          throw o(M, S);
        }
      }
      return true;
    }
    return m ? x.toJSON = function() {
      return "{" + t(m) + ": " + t(p) + "}";
    } : x.toJSON = function() {
      return "{" + t(p) + "}";
    }, x;
  }, object: function(p) {
    var m = {};
    for (var x in p) m[x] = f(p[x]);
    function j(P, S) {
      if (!r.Object(P) || r.Nil(P)) return false;
      var _;
      try {
        for (_ in m) {
          var M = m[_], W = P[_];
          g(M, W, S);
        }
      } catch (U) {
        throw o(U, _);
      }
      if (S) {
        for (_ in P) if (!m[_]) throw new a(void 0, _);
      }
      return true;
    }
    return j.toJSON = function() {
      return t(m);
    }, j;
  }, anyOf: function() {
    var p = [].slice.call(arguments).map(f);
    function m(x, j) {
      return p.some(function(P) {
        try {
          return g(P, x, j);
        } catch {
          return false;
        }
      });
    }
    return m.toJSON = function() {
      return p.map(t).join("|");
    }, m;
  }, allOf: function() {
    var p = [].slice.call(arguments).map(f);
    function m(x, j) {
      return p.every(function(P) {
        try {
          return g(P, x, j);
        } catch {
          return false;
        }
      });
    }
    return m.toJSON = function() {
      return p.map(t).join(" & ");
    }, m;
  }, quacksLike: function(p) {
    function m(x) {
      return p === i(x);
    }
    return m.toJSON = function() {
      return p;
    }, m;
  }, tuple: function() {
    var p = [].slice.call(arguments).map(f);
    function m(x, j) {
      return r.Nil(x) || r.Nil(x.length) || j && x.length !== p.length ? false : p.every(function(P, S) {
        try {
          return g(P, x[S], j);
        } catch (_) {
          throw o(_, S);
        }
      });
    }
    return m.toJSON = function() {
      return "(" + p.map(t).join(", ") + ")";
    }, m;
  }, value: function(p) {
    function m(x) {
      return x === p;
    }
    return m.toJSON = function() {
      return p;
    }, m;
  } };
  s.oneOf = s.anyOf;
  function f(w) {
    if (r.String(w)) return w[0] === "?" ? s.maybe(w.slice(1)) : r[w] || s.quacksLike(w);
    if (w && r.Object(w)) {
      if (r.Array(w)) {
        if (w.length !== 1) throw new TypeError("Expected compile() parameter of type Array of length 1");
        return s.arrayOf(w[0]);
      }
      return s.object(w);
    } else if (r.Function(w)) return w;
    return s.value(w);
  }
  function g(w, p, m, x) {
    if (r.Function(w)) {
      if (w(p, m)) return true;
      throw new n(x || w, p);
    }
    return g(f(w), p, m);
  }
  for (var h in r) g[h] = r[h];
  for (h in s) g[h] = s[h];
  var v = au();
  for (h in v) g[h] = v[h];
  return g.compile = f, g.TfTypeError = n, g.TfPropertyTypeError = a, rn = g, rn;
}
var Fr = {}, Xe = {}, Ge = {}, tn = {}, at = {}, Io;
function su() {
  return Io || (Io = 1, Object.defineProperty(at, "__esModule", { value: true }), at.crypto = void 0, at.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0), at;
}
var _o;
function cr() {
  return _o || (_o = 1, (function(e) {
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    Object.defineProperty(e, "__esModule", { value: true }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = t, e.anumber = n, e.abytes = a, e.ahash = o, e.aexists = i, e.aoutput = s, e.u8 = f, e.u32 = g, e.clean = h, e.createView = v, e.rotr = w, e.rotl = p, e.byteSwap = m, e.byteSwap32 = x, e.bytesToHex = S, e.hexToBytes = W, e.asyncLoop = R, e.utf8ToBytes = N, e.bytesToUtf8 = k, e.toBytes = C, e.kdfInputToBytes = q, e.concatBytes = B, e.checkOpts = F, e.createHasher = A, e.createOptHasher = V, e.createXOFer = L, e.randomBytes = y;
    const r = su();
    function t(z) {
      return z instanceof Uint8Array || ArrayBuffer.isView(z) && z.constructor.name === "Uint8Array";
    }
    function n(z) {
      if (!Number.isSafeInteger(z) || z < 0) throw new Error("positive integer expected, got " + z);
    }
    function a(z, ...D) {
      if (!t(z)) throw new Error("Uint8Array expected");
      if (D.length > 0 && !D.includes(z.length)) throw new Error("Uint8Array expected of length " + D + ", got length=" + z.length);
    }
    function o(z) {
      if (typeof z != "function" || typeof z.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
      n(z.outputLen), n(z.blockLen);
    }
    function i(z, D = true) {
      if (z.destroyed) throw new Error("Hash instance has been destroyed");
      if (D && z.finished) throw new Error("Hash#digest() has already been called");
    }
    function s(z, D) {
      a(z);
      const I = D.outputLen;
      if (z.length < I) throw new Error("digestInto() expects output buffer of length at least " + I);
    }
    function f(z) {
      return new Uint8Array(z.buffer, z.byteOffset, z.byteLength);
    }
    function g(z) {
      return new Uint32Array(z.buffer, z.byteOffset, Math.floor(z.byteLength / 4));
    }
    function h(...z) {
      for (let D = 0; D < z.length; D++) z[D].fill(0);
    }
    function v(z) {
      return new DataView(z.buffer, z.byteOffset, z.byteLength);
    }
    function w(z, D) {
      return z << 32 - D | z >>> D;
    }
    function p(z, D) {
      return z << D | z >>> 32 - D >>> 0;
    }
    e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    function m(z) {
      return z << 24 & 4278190080 | z << 8 & 16711680 | z >>> 8 & 65280 | z >>> 24 & 255;
    }
    e.swap8IfBE = e.isLE ? (z) => z : (z) => m(z), e.byteSwapIfBE = e.swap8IfBE;
    function x(z) {
      for (let D = 0; D < z.length; D++) z[D] = m(z[D]);
      return z;
    }
    e.swap32IfBE = e.isLE ? (z) => z : x;
    const j = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P = Array.from({ length: 256 }, (z, D) => D.toString(16).padStart(2, "0"));
    function S(z) {
      if (a(z), j) return z.toHex();
      let D = "";
      for (let I = 0; I < z.length; I++) D += P[z[I]];
      return D;
    }
    const _ = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function M(z) {
      if (z >= _._0 && z <= _._9) return z - _._0;
      if (z >= _.A && z <= _.F) return z - (_.A - 10);
      if (z >= _.a && z <= _.f) return z - (_.a - 10);
    }
    function W(z) {
      if (typeof z != "string") throw new Error("hex string expected, got " + typeof z);
      if (j) return Uint8Array.fromHex(z);
      const D = z.length, I = D / 2;
      if (D % 2) throw new Error("hex string expected, got unpadded hex of length " + D);
      const H = new Uint8Array(I);
      for (let X = 0, Z = 0; X < I; X++, Z += 2) {
        const ee = M(z.charCodeAt(Z)), ce = M(z.charCodeAt(Z + 1));
        if (ee === void 0 || ce === void 0) {
          const ue = z[Z] + z[Z + 1];
          throw new Error('hex string expected, got non-hex character "' + ue + '" at index ' + Z);
        }
        H[X] = ee * 16 + ce;
      }
      return H;
    }
    const U = async () => {
    };
    e.nextTick = U;
    async function R(z, D, I) {
      let H = Date.now();
      for (let X = 0; X < z; X++) {
        I(X);
        const Z = Date.now() - H;
        Z >= 0 && Z < D || (await (0, e.nextTick)(), H += Z);
      }
    }
    function N(z) {
      if (typeof z != "string") throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(z));
    }
    function k(z) {
      return new TextDecoder().decode(z);
    }
    function C(z) {
      return typeof z == "string" && (z = N(z)), a(z), z;
    }
    function q(z) {
      return typeof z == "string" && (z = N(z)), a(z), z;
    }
    function B(...z) {
      let D = 0;
      for (let H = 0; H < z.length; H++) {
        const X = z[H];
        a(X), D += X.length;
      }
      const I = new Uint8Array(D);
      for (let H = 0, X = 0; H < z.length; H++) {
        const Z = z[H];
        I.set(Z, X), X += Z.length;
      }
      return I;
    }
    function F(z, D) {
      if (D !== void 0 && {}.toString.call(D) !== "[object Object]") throw new Error("options should be object or undefined");
      return Object.assign(z, D);
    }
    class G {
    }
    e.Hash = G;
    function A(z) {
      const D = (H) => z().update(C(H)).digest(), I = z();
      return D.outputLen = I.outputLen, D.blockLen = I.blockLen, D.create = () => z(), D;
    }
    function V(z) {
      const D = (H, X) => z(X).update(C(H)).digest(), I = z({});
      return D.outputLen = I.outputLen, D.blockLen = I.blockLen, D.create = (H) => z(H), D;
    }
    function L(z) {
      const D = (H, X) => z(X).update(C(H)).digest(), I = z({});
      return D.outputLen = I.outputLen, D.blockLen = I.blockLen, D.create = (H) => z(H), D;
    }
    e.wrapConstructor = A, e.wrapConstructorWithOpts = V, e.wrapXOFConstructorWithOpts = L;
    function y(z = 32) {
      if (r.crypto && typeof r.crypto.getRandomValues == "function") return r.crypto.getRandomValues(new Uint8Array(z));
      if (r.crypto && typeof r.crypto.randomBytes == "function") return Uint8Array.from(r.crypto.randomBytes(z));
      throw new Error("crypto.getRandomValues must be defined");
    }
  })(tn)), tn;
}
var Ao;
function Ca() {
  if (Ao) return Ge;
  Ao = 1, Object.defineProperty(Ge, "__esModule", { value: true }), Ge.SHA512_IV = Ge.SHA384_IV = Ge.SHA224_IV = Ge.SHA256_IV = Ge.HashMD = void 0, Ge.setBigUint64 = r, Ge.Chi = t, Ge.Maj = n;
  const e = cr();
  function r(o, i, s, f) {
    if (typeof o.setBigUint64 == "function") return o.setBigUint64(i, s, f);
    const g = BigInt(32), h = BigInt(4294967295), v = Number(s >> g & h), w = Number(s & h), p = f ? 4 : 0, m = f ? 0 : 4;
    o.setUint32(i + p, v, f), o.setUint32(i + m, w, f);
  }
  function t(o, i, s) {
    return o & i ^ ~o & s;
  }
  function n(o, i, s) {
    return o & i ^ o & s ^ i & s;
  }
  class a extends e.Hash {
    constructor(i, s, f, g) {
      super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = i, this.outputLen = s, this.padOffset = f, this.isLE = g, this.buffer = new Uint8Array(i), this.view = (0, e.createView)(this.buffer);
    }
    update(i) {
      (0, e.aexists)(this), i = (0, e.toBytes)(i), (0, e.abytes)(i);
      const { view: s, buffer: f, blockLen: g } = this, h = i.length;
      for (let v = 0; v < h; ) {
        const w = Math.min(g - this.pos, h - v);
        if (w === g) {
          const p = (0, e.createView)(i);
          for (; g <= h - v; v += g) this.process(p, v);
          continue;
        }
        f.set(i.subarray(v, v + w), this.pos), this.pos += w, v += w, this.pos === g && (this.process(s, 0), this.pos = 0);
      }
      return this.length += i.length, this.roundClean(), this;
    }
    digestInto(i) {
      (0, e.aexists)(this), (0, e.aoutput)(i, this), this.finished = true;
      const { buffer: s, view: f, blockLen: g, isLE: h } = this;
      let { pos: v } = this;
      s[v++] = 128, (0, e.clean)(this.buffer.subarray(v)), this.padOffset > g - v && (this.process(f, 0), v = 0);
      for (let j = v; j < g; j++) s[j] = 0;
      r(f, g - 8, BigInt(this.length * 8), h), this.process(f, 0);
      const w = (0, e.createView)(i), p = this.outputLen;
      if (p % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      const m = p / 4, x = this.get();
      if (m > x.length) throw new Error("_sha2: outputLen bigger than state");
      for (let j = 0; j < m; j++) w.setUint32(4 * j, x[j], h);
    }
    digest() {
      const { buffer: i, outputLen: s } = this;
      this.digestInto(i);
      const f = i.slice(0, s);
      return this.destroy(), f;
    }
    _cloneInto(i) {
      i || (i = new this.constructor()), i.set(...this.get());
      const { blockLen: s, buffer: f, length: g, finished: h, destroyed: v, pos: w } = this;
      return i.destroyed = v, i.finished = h, i.length = g, i.pos = w, g % s && i.buffer.set(f), i;
    }
    clone() {
      return this._cloneInto();
    }
  }
  return Ge.HashMD = a, Ge.SHA256_IV = Uint32Array.from([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), Ge.SHA224_IV = Uint32Array.from([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]), Ge.SHA384_IV = Uint32Array.from([3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428]), Ge.SHA512_IV = Uint32Array.from([1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209]), Ge;
}
var So;
function ja() {
  if (So) return Xe;
  So = 1, Object.defineProperty(Xe, "__esModule", { value: true }), Xe.ripemd160 = Xe.RIPEMD160 = Xe.md5 = Xe.MD5 = Xe.sha1 = Xe.SHA1 = void 0;
  const e = Ca(), r = cr(), t = Uint32Array.from([1732584193, 4023233417, 2562383102, 271733878, 3285377520]), n = new Uint32Array(80);
  class a extends e.HashMD {
    constructor() {
      super(64, 20, 8, false), this.A = t[0] | 0, this.B = t[1] | 0, this.C = t[2] | 0, this.D = t[3] | 0, this.E = t[4] | 0;
    }
    get() {
      const { A: k, B: C, C: q, D: B, E: F } = this;
      return [k, C, q, B, F];
    }
    set(k, C, q, B, F) {
      this.A = k | 0, this.B = C | 0, this.C = q | 0, this.D = B | 0, this.E = F | 0;
    }
    process(k, C) {
      for (let V = 0; V < 16; V++, C += 4) n[V] = k.getUint32(C, false);
      for (let V = 16; V < 80; V++) n[V] = (0, r.rotl)(n[V - 3] ^ n[V - 8] ^ n[V - 14] ^ n[V - 16], 1);
      let { A: q, B, C: F, D: G, E: A } = this;
      for (let V = 0; V < 80; V++) {
        let L, y;
        V < 20 ? (L = (0, e.Chi)(B, F, G), y = 1518500249) : V < 40 ? (L = B ^ F ^ G, y = 1859775393) : V < 60 ? (L = (0, e.Maj)(B, F, G), y = 2400959708) : (L = B ^ F ^ G, y = 3395469782);
        const z = (0, r.rotl)(q, 5) + L + A + y + n[V] | 0;
        A = G, G = F, F = (0, r.rotl)(B, 30), B = q, q = z;
      }
      q = q + this.A | 0, B = B + this.B | 0, F = F + this.C | 0, G = G + this.D | 0, A = A + this.E | 0, this.set(q, B, F, G, A);
    }
    roundClean() {
      (0, r.clean)(n);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0), (0, r.clean)(this.buffer);
    }
  }
  Xe.SHA1 = a, Xe.sha1 = (0, r.createHasher)(() => new a());
  const o = Math.pow(2, 32), i = Array.from({ length: 64 }, (N, k) => Math.floor(o * Math.abs(Math.sin(k + 1)))), s = t.slice(0, 4), f = new Uint32Array(16);
  class g extends e.HashMD {
    constructor() {
      super(64, 16, 8, true), this.A = s[0] | 0, this.B = s[1] | 0, this.C = s[2] | 0, this.D = s[3] | 0;
    }
    get() {
      const { A: k, B: C, C: q, D: B } = this;
      return [k, C, q, B];
    }
    set(k, C, q, B) {
      this.A = k | 0, this.B = C | 0, this.C = q | 0, this.D = B | 0;
    }
    process(k, C) {
      for (let A = 0; A < 16; A++, C += 4) f[A] = k.getUint32(C, true);
      let { A: q, B, C: F, D: G } = this;
      for (let A = 0; A < 64; A++) {
        let V, L, y;
        A < 16 ? (V = (0, e.Chi)(B, F, G), L = A, y = [7, 12, 17, 22]) : A < 32 ? (V = (0, e.Chi)(G, B, F), L = (5 * A + 1) % 16, y = [5, 9, 14, 20]) : A < 48 ? (V = B ^ F ^ G, L = (3 * A + 5) % 16, y = [4, 11, 16, 23]) : (V = F ^ (B | ~G), L = 7 * A % 16, y = [6, 10, 15, 21]), V = V + q + i[A] + f[L], q = G, G = F, F = B, B = B + (0, r.rotl)(V, y[A % 4]);
      }
      q = q + this.A | 0, B = B + this.B | 0, F = F + this.C | 0, G = G + this.D | 0, this.set(q, B, F, G);
    }
    roundClean() {
      (0, r.clean)(f);
    }
    destroy() {
      this.set(0, 0, 0, 0), (0, r.clean)(this.buffer);
    }
  }
  Xe.MD5 = g, Xe.md5 = (0, r.createHasher)(() => new g());
  const h = Uint8Array.from([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), v = Uint8Array.from(new Array(16).fill(0).map((N, k) => k)), w = v.map((N) => (9 * N + 5) % 16), p = (() => {
    const C = [[v], [w]];
    for (let q = 0; q < 4; q++) for (let B of C) B.push(B[q].map((F) => h[F]));
    return C;
  })(), m = p[0], x = p[1], j = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map((N) => Uint8Array.from(N)), P = m.map((N, k) => N.map((C) => j[k][C])), S = x.map((N, k) => N.map((C) => j[k][C])), _ = Uint32Array.from([0, 1518500249, 1859775393, 2400959708, 2840853838]), M = Uint32Array.from([1352829926, 1548603684, 1836072691, 2053994217, 0]);
  function W(N, k, C, q) {
    return N === 0 ? k ^ C ^ q : N === 1 ? k & C | ~k & q : N === 2 ? (k | ~C) ^ q : N === 3 ? k & q | C & ~q : k ^ (C | ~q);
  }
  const U = new Uint32Array(16);
  class R extends e.HashMD {
    constructor() {
      super(64, 20, 8, true), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      const { h0: k, h1: C, h2: q, h3: B, h4: F } = this;
      return [k, C, q, B, F];
    }
    set(k, C, q, B, F) {
      this.h0 = k | 0, this.h1 = C | 0, this.h2 = q | 0, this.h3 = B | 0, this.h4 = F | 0;
    }
    process(k, C) {
      for (let I = 0; I < 16; I++, C += 4) U[I] = k.getUint32(C, true);
      let q = this.h0 | 0, B = q, F = this.h1 | 0, G = F, A = this.h2 | 0, V = A, L = this.h3 | 0, y = L, z = this.h4 | 0, D = z;
      for (let I = 0; I < 5; I++) {
        const H = 4 - I, X = _[I], Z = M[I], ee = m[I], ce = x[I], ue = P[I], ie = S[I];
        for (let ae = 0; ae < 16; ae++) {
          const fe = (0, r.rotl)(q + W(I, F, A, L) + U[ee[ae]] + X, ue[ae]) + z | 0;
          q = z, z = L, L = (0, r.rotl)(A, 10) | 0, A = F, F = fe;
        }
        for (let ae = 0; ae < 16; ae++) {
          const fe = (0, r.rotl)(B + W(H, G, V, y) + U[ce[ae]] + Z, ie[ae]) + D | 0;
          B = D, D = y, y = (0, r.rotl)(V, 10) | 0, V = G, G = fe;
        }
      }
      this.set(this.h1 + A + y | 0, this.h2 + L + D | 0, this.h3 + z + B | 0, this.h4 + q + G | 0, this.h0 + F + V | 0);
    }
    roundClean() {
      (0, r.clean)(U);
    }
    destroy() {
      this.destroyed = true, (0, r.clean)(this.buffer), this.set(0, 0, 0, 0, 0);
    }
  }
  return Xe.RIPEMD160 = R, Xe.ripemd160 = (0, r.createHasher)(() => new R()), Xe;
}
var To;
function Pf() {
  if (To) return Fr;
  To = 1, Object.defineProperty(Fr, "__esModule", { value: true }), Fr.ripemd160 = Fr.RIPEMD160 = void 0;
  const e = ja();
  return Fr.RIPEMD160 = e.RIPEMD160, Fr.ripemd160 = e.ripemd160, Fr;
}
var Pr = {}, zo;
function Mf() {
  if (zo) return Pr;
  zo = 1, Object.defineProperty(Pr, "__esModule", { value: true }), Pr.sha1 = Pr.SHA1 = void 0;
  const e = ja();
  return Pr.SHA1 = e.SHA1, Pr.sha1 = e.sha1, Pr;
}
var nr = {}, Ue = {}, Ie = {}, Co;
function cu() {
  if (Co) return Ie;
  Co = 1, Object.defineProperty(Ie, "__esModule", { value: true }), Ie.toBig = Ie.shrSL = Ie.shrSH = Ie.rotrSL = Ie.rotrSH = Ie.rotrBL = Ie.rotrBH = Ie.rotr32L = Ie.rotr32H = Ie.rotlSL = Ie.rotlSH = Ie.rotlBL = Ie.rotlBH = Ie.add5L = Ie.add5H = Ie.add4L = Ie.add4H = Ie.add3L = Ie.add3H = void 0, Ie.add = P, Ie.fromBig = t, Ie.split = n;
  const e = BigInt(2 ** 32 - 1), r = BigInt(32);
  function t(k, C = false) {
    return C ? { h: Number(k & e), l: Number(k >> r & e) } : { h: Number(k >> r & e) | 0, l: Number(k & e) | 0 };
  }
  function n(k, C = false) {
    const q = k.length;
    let B = new Uint32Array(q), F = new Uint32Array(q);
    for (let G = 0; G < q; G++) {
      const { h: A, l: V } = t(k[G], C);
      [B[G], F[G]] = [A, V];
    }
    return [B, F];
  }
  const a = (k, C) => BigInt(k >>> 0) << r | BigInt(C >>> 0);
  Ie.toBig = a;
  const o = (k, C, q) => k >>> q;
  Ie.shrSH = o;
  const i = (k, C, q) => k << 32 - q | C >>> q;
  Ie.shrSL = i;
  const s = (k, C, q) => k >>> q | C << 32 - q;
  Ie.rotrSH = s;
  const f = (k, C, q) => k << 32 - q | C >>> q;
  Ie.rotrSL = f;
  const g = (k, C, q) => k << 64 - q | C >>> q - 32;
  Ie.rotrBH = g;
  const h = (k, C, q) => k >>> q - 32 | C << 64 - q;
  Ie.rotrBL = h;
  const v = (k, C) => C;
  Ie.rotr32H = v;
  const w = (k, C) => k;
  Ie.rotr32L = w;
  const p = (k, C, q) => k << q | C >>> 32 - q;
  Ie.rotlSH = p;
  const m = (k, C, q) => C << q | k >>> 32 - q;
  Ie.rotlSL = m;
  const x = (k, C, q) => C << q - 32 | k >>> 64 - q;
  Ie.rotlBH = x;
  const j = (k, C, q) => k << q - 32 | C >>> 64 - q;
  Ie.rotlBL = j;
  function P(k, C, q, B) {
    const F = (C >>> 0) + (B >>> 0);
    return { h: k + q + (F / 2 ** 32 | 0) | 0, l: F | 0 };
  }
  const S = (k, C, q) => (k >>> 0) + (C >>> 0) + (q >>> 0);
  Ie.add3L = S;
  const _ = (k, C, q, B) => C + q + B + (k / 2 ** 32 | 0) | 0;
  Ie.add3H = _;
  const M = (k, C, q, B) => (k >>> 0) + (C >>> 0) + (q >>> 0) + (B >>> 0);
  Ie.add4L = M;
  const W = (k, C, q, B, F) => C + q + B + F + (k / 2 ** 32 | 0) | 0;
  Ie.add4H = W;
  const U = (k, C, q, B, F) => (k >>> 0) + (C >>> 0) + (q >>> 0) + (B >>> 0) + (F >>> 0);
  Ie.add5L = U;
  const R = (k, C, q, B, F, G) => C + q + B + F + G + (k / 2 ** 32 | 0) | 0;
  Ie.add5H = R;
  const N = { fromBig: t, split: n, toBig: a, shrSH: o, shrSL: i, rotrSH: s, rotrSL: f, rotrBH: g, rotrBL: h, rotr32H: v, rotr32L: w, rotlSH: p, rotlSL: m, rotlBH: x, rotlBL: j, add: P, add3L: S, add3H: _, add4L: M, add4H: W, add5H: R, add5L: U };
  return Ie.default = N, Ie;
}
var jo;
function ro() {
  if (jo) return Ue;
  jo = 1, Object.defineProperty(Ue, "__esModule", { value: true }), Ue.sha512_224 = Ue.sha512_256 = Ue.sha384 = Ue.sha512 = Ue.sha224 = Ue.sha256 = Ue.SHA512_256 = Ue.SHA512_224 = Ue.SHA384 = Ue.SHA512 = Ue.SHA224 = Ue.SHA256 = void 0;
  const e = Ca(), r = cu(), t = cr(), n = Uint32Array.from([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), a = new Uint32Array(64);
  class o extends e.HashMD {
    constructor(_ = 32) {
      super(64, _, 8, false), this.A = e.SHA256_IV[0] | 0, this.B = e.SHA256_IV[1] | 0, this.C = e.SHA256_IV[2] | 0, this.D = e.SHA256_IV[3] | 0, this.E = e.SHA256_IV[4] | 0, this.F = e.SHA256_IV[5] | 0, this.G = e.SHA256_IV[6] | 0, this.H = e.SHA256_IV[7] | 0;
    }
    get() {
      const { A: _, B: M, C: W, D: U, E: R, F: N, G: k, H: C } = this;
      return [_, M, W, U, R, N, k, C];
    }
    set(_, M, W, U, R, N, k, C) {
      this.A = _ | 0, this.B = M | 0, this.C = W | 0, this.D = U | 0, this.E = R | 0, this.F = N | 0, this.G = k | 0, this.H = C | 0;
    }
    process(_, M) {
      for (let F = 0; F < 16; F++, M += 4) a[F] = _.getUint32(M, false);
      for (let F = 16; F < 64; F++) {
        const G = a[F - 15], A = a[F - 2], V = (0, t.rotr)(G, 7) ^ (0, t.rotr)(G, 18) ^ G >>> 3, L = (0, t.rotr)(A, 17) ^ (0, t.rotr)(A, 19) ^ A >>> 10;
        a[F] = L + a[F - 7] + V + a[F - 16] | 0;
      }
      let { A: W, B: U, C: R, D: N, E: k, F: C, G: q, H: B } = this;
      for (let F = 0; F < 64; F++) {
        const G = (0, t.rotr)(k, 6) ^ (0, t.rotr)(k, 11) ^ (0, t.rotr)(k, 25), A = B + G + (0, e.Chi)(k, C, q) + n[F] + a[F] | 0, L = ((0, t.rotr)(W, 2) ^ (0, t.rotr)(W, 13) ^ (0, t.rotr)(W, 22)) + (0, e.Maj)(W, U, R) | 0;
        B = q, q = C, C = k, k = N + A | 0, N = R, R = U, U = W, W = A + L | 0;
      }
      W = W + this.A | 0, U = U + this.B | 0, R = R + this.C | 0, N = N + this.D | 0, k = k + this.E | 0, C = C + this.F | 0, q = q + this.G | 0, B = B + this.H | 0, this.set(W, U, R, N, k, C, q, B);
    }
    roundClean() {
      (0, t.clean)(a);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, t.clean)(this.buffer);
    }
  }
  Ue.SHA256 = o;
  class i extends o {
    constructor() {
      super(28), this.A = e.SHA224_IV[0] | 0, this.B = e.SHA224_IV[1] | 0, this.C = e.SHA224_IV[2] | 0, this.D = e.SHA224_IV[3] | 0, this.E = e.SHA224_IV[4] | 0, this.F = e.SHA224_IV[5] | 0, this.G = e.SHA224_IV[6] | 0, this.H = e.SHA224_IV[7] | 0;
    }
  }
  Ue.SHA224 = i;
  const s = r.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((S) => BigInt(S))), f = s[0], g = s[1], h = new Uint32Array(80), v = new Uint32Array(80);
  class w extends e.HashMD {
    constructor(_ = 64) {
      super(128, _, 16, false), this.Ah = e.SHA512_IV[0] | 0, this.Al = e.SHA512_IV[1] | 0, this.Bh = e.SHA512_IV[2] | 0, this.Bl = e.SHA512_IV[3] | 0, this.Ch = e.SHA512_IV[4] | 0, this.Cl = e.SHA512_IV[5] | 0, this.Dh = e.SHA512_IV[6] | 0, this.Dl = e.SHA512_IV[7] | 0, this.Eh = e.SHA512_IV[8] | 0, this.El = e.SHA512_IV[9] | 0, this.Fh = e.SHA512_IV[10] | 0, this.Fl = e.SHA512_IV[11] | 0, this.Gh = e.SHA512_IV[12] | 0, this.Gl = e.SHA512_IV[13] | 0, this.Hh = e.SHA512_IV[14] | 0, this.Hl = e.SHA512_IV[15] | 0;
    }
    get() {
      const { Ah: _, Al: M, Bh: W, Bl: U, Ch: R, Cl: N, Dh: k, Dl: C, Eh: q, El: B, Fh: F, Fl: G, Gh: A, Gl: V, Hh: L, Hl: y } = this;
      return [_, M, W, U, R, N, k, C, q, B, F, G, A, V, L, y];
    }
    set(_, M, W, U, R, N, k, C, q, B, F, G, A, V, L, y) {
      this.Ah = _ | 0, this.Al = M | 0, this.Bh = W | 0, this.Bl = U | 0, this.Ch = R | 0, this.Cl = N | 0, this.Dh = k | 0, this.Dl = C | 0, this.Eh = q | 0, this.El = B | 0, this.Fh = F | 0, this.Fl = G | 0, this.Gh = A | 0, this.Gl = V | 0, this.Hh = L | 0, this.Hl = y | 0;
    }
    process(_, M) {
      for (let I = 0; I < 16; I++, M += 4) h[I] = _.getUint32(M), v[I] = _.getUint32(M += 4);
      for (let I = 16; I < 80; I++) {
        const H = h[I - 15] | 0, X = v[I - 15] | 0, Z = r.rotrSH(H, X, 1) ^ r.rotrSH(H, X, 8) ^ r.shrSH(H, X, 7), ee = r.rotrSL(H, X, 1) ^ r.rotrSL(H, X, 8) ^ r.shrSL(H, X, 7), ce = h[I - 2] | 0, ue = v[I - 2] | 0, ie = r.rotrSH(ce, ue, 19) ^ r.rotrBH(ce, ue, 61) ^ r.shrSH(ce, ue, 6), ae = r.rotrSL(ce, ue, 19) ^ r.rotrBL(ce, ue, 61) ^ r.shrSL(ce, ue, 6), fe = r.add4L(ee, ae, v[I - 7], v[I - 16]), be = r.add4H(fe, Z, ie, h[I - 7], h[I - 16]);
        h[I] = be | 0, v[I] = fe | 0;
      }
      let { Ah: W, Al: U, Bh: R, Bl: N, Ch: k, Cl: C, Dh: q, Dl: B, Eh: F, El: G, Fh: A, Fl: V, Gh: L, Gl: y, Hh: z, Hl: D } = this;
      for (let I = 0; I < 80; I++) {
        const H = r.rotrSH(F, G, 14) ^ r.rotrSH(F, G, 18) ^ r.rotrBH(F, G, 41), X = r.rotrSL(F, G, 14) ^ r.rotrSL(F, G, 18) ^ r.rotrBL(F, G, 41), Z = F & A ^ ~F & L, ee = G & V ^ ~G & y, ce = r.add5L(D, X, ee, g[I], v[I]), ue = r.add5H(ce, z, H, Z, f[I], h[I]), ie = ce | 0, ae = r.rotrSH(W, U, 28) ^ r.rotrBH(W, U, 34) ^ r.rotrBH(W, U, 39), fe = r.rotrSL(W, U, 28) ^ r.rotrBL(W, U, 34) ^ r.rotrBL(W, U, 39), be = W & R ^ W & k ^ R & k, ye = U & N ^ U & C ^ N & C;
        z = L | 0, D = y | 0, L = A | 0, y = V | 0, A = F | 0, V = G | 0, { h: F, l: G } = r.add(q | 0, B | 0, ue | 0, ie | 0), q = k | 0, B = C | 0, k = R | 0, C = N | 0, R = W | 0, N = U | 0;
        const te = r.add3L(ie, fe, ye);
        W = r.add3H(te, ue, ae, be), U = te | 0;
      }
      ({ h: W, l: U } = r.add(this.Ah | 0, this.Al | 0, W | 0, U | 0)), { h: R, l: N } = r.add(this.Bh | 0, this.Bl | 0, R | 0, N | 0), { h: k, l: C } = r.add(this.Ch | 0, this.Cl | 0, k | 0, C | 0), { h: q, l: B } = r.add(this.Dh | 0, this.Dl | 0, q | 0, B | 0), { h: F, l: G } = r.add(this.Eh | 0, this.El | 0, F | 0, G | 0), { h: A, l: V } = r.add(this.Fh | 0, this.Fl | 0, A | 0, V | 0), { h: L, l: y } = r.add(this.Gh | 0, this.Gl | 0, L | 0, y | 0), { h: z, l: D } = r.add(this.Hh | 0, this.Hl | 0, z | 0, D | 0), this.set(W, U, R, N, k, C, q, B, F, G, A, V, L, y, z, D);
    }
    roundClean() {
      (0, t.clean)(h, v);
    }
    destroy() {
      (0, t.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  Ue.SHA512 = w;
  class p extends w {
    constructor() {
      super(48), this.Ah = e.SHA384_IV[0] | 0, this.Al = e.SHA384_IV[1] | 0, this.Bh = e.SHA384_IV[2] | 0, this.Bl = e.SHA384_IV[3] | 0, this.Ch = e.SHA384_IV[4] | 0, this.Cl = e.SHA384_IV[5] | 0, this.Dh = e.SHA384_IV[6] | 0, this.Dl = e.SHA384_IV[7] | 0, this.Eh = e.SHA384_IV[8] | 0, this.El = e.SHA384_IV[9] | 0, this.Fh = e.SHA384_IV[10] | 0, this.Fl = e.SHA384_IV[11] | 0, this.Gh = e.SHA384_IV[12] | 0, this.Gl = e.SHA384_IV[13] | 0, this.Hh = e.SHA384_IV[14] | 0, this.Hl = e.SHA384_IV[15] | 0;
    }
  }
  Ue.SHA384 = p;
  const m = Uint32Array.from([2352822216, 424955298, 1944164710, 2312950998, 502970286, 855612546, 1738396948, 1479516111, 258812777, 2077511080, 2011393907, 79989058, 1067287976, 1780299464, 286451373, 2446758561]), x = Uint32Array.from([573645204, 4230739756, 2673172387, 3360449730, 596883563, 1867755857, 2520282905, 1497426621, 2519219938, 2827943907, 3193839141, 1401305490, 721525244, 746961066, 246885852, 2177182882]);
  class j extends w {
    constructor() {
      super(28), this.Ah = m[0] | 0, this.Al = m[1] | 0, this.Bh = m[2] | 0, this.Bl = m[3] | 0, this.Ch = m[4] | 0, this.Cl = m[5] | 0, this.Dh = m[6] | 0, this.Dl = m[7] | 0, this.Eh = m[8] | 0, this.El = m[9] | 0, this.Fh = m[10] | 0, this.Fl = m[11] | 0, this.Gh = m[12] | 0, this.Gl = m[13] | 0, this.Hh = m[14] | 0, this.Hl = m[15] | 0;
    }
  }
  Ue.SHA512_224 = j;
  class P extends w {
    constructor() {
      super(32), this.Ah = x[0] | 0, this.Al = x[1] | 0, this.Bh = x[2] | 0, this.Bl = x[3] | 0, this.Ch = x[4] | 0, this.Cl = x[5] | 0, this.Dh = x[6] | 0, this.Dl = x[7] | 0, this.Eh = x[8] | 0, this.El = x[9] | 0, this.Fh = x[10] | 0, this.Fl = x[11] | 0, this.Gh = x[12] | 0, this.Gl = x[13] | 0, this.Hh = x[14] | 0, this.Hl = x[15] | 0;
    }
  }
  return Ue.SHA512_256 = P, Ue.sha256 = (0, t.createHasher)(() => new o()), Ue.sha224 = (0, t.createHasher)(() => new i()), Ue.sha512 = (0, t.createHasher)(() => new w()), Ue.sha384 = (0, t.createHasher)(() => new p()), Ue.sha512_256 = (0, t.createHasher)(() => new P()), Ue.sha512_224 = (0, t.createHasher)(() => new j()), Ue;
}
var Ro;
function Ra() {
  if (Ro) return nr;
  Ro = 1, Object.defineProperty(nr, "__esModule", { value: true }), nr.sha224 = nr.SHA224 = nr.sha256 = nr.SHA256 = void 0;
  const e = ro();
  return nr.SHA256 = e.SHA256, nr.sha256 = e.sha256, nr.SHA224 = e.SHA224, nr.sha224 = e.sha224, nr;
}
var nn, Uo;
function uu() {
  if (Uo) return nn;
  Uo = 1;
  function e(r) {
    if (r.length >= 255) throw new TypeError("Alphabet too long");
    for (var t = new Uint8Array(256), n = 0; n < t.length; n++) t[n] = 255;
    for (var a = 0; a < r.length; a++) {
      var o = r.charAt(a), i = o.charCodeAt(0);
      if (t[i] !== 255) throw new TypeError(o + " is ambiguous");
      t[i] = a;
    }
    var s = r.length, f = r.charAt(0), g = Math.log(s) / Math.log(256), h = Math.log(256) / Math.log(s);
    function v(m) {
      if (m instanceof Uint8Array || (ArrayBuffer.isView(m) ? m = new Uint8Array(m.buffer, m.byteOffset, m.byteLength) : Array.isArray(m) && (m = Uint8Array.from(m))), !(m instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
      if (m.length === 0) return "";
      for (var x = 0, j = 0, P = 0, S = m.length; P !== S && m[P] === 0; ) P++, x++;
      for (var _ = (S - P) * h + 1 >>> 0, M = new Uint8Array(_); P !== S; ) {
        for (var W = m[P], U = 0, R = _ - 1; (W !== 0 || U < j) && R !== -1; R--, U++) W += 256 * M[R] >>> 0, M[R] = W % s >>> 0, W = W / s >>> 0;
        if (W !== 0) throw new Error("Non-zero carry");
        j = U, P++;
      }
      for (var N = _ - j; N !== _ && M[N] === 0; ) N++;
      for (var k = f.repeat(x); N < _; ++N) k += r.charAt(M[N]);
      return k;
    }
    function w(m) {
      if (typeof m != "string") throw new TypeError("Expected String");
      if (m.length === 0) return new Uint8Array();
      for (var x = 0, j = 0, P = 0; m[x] === f; ) j++, x++;
      for (var S = (m.length - x) * g + 1 >>> 0, _ = new Uint8Array(S); m[x]; ) {
        var M = m.charCodeAt(x);
        if (M > 255) return;
        var W = t[M];
        if (W === 255) return;
        for (var U = 0, R = S - 1; (W !== 0 || U < P) && R !== -1; R--, U++) W += s * _[R] >>> 0, _[R] = W % 256 >>> 0, W = W / 256 >>> 0;
        if (W !== 0) throw new Error("Non-zero carry");
        P = U, x++;
      }
      for (var N = S - P; N !== S && _[N] === 0; ) N++;
      for (var k = new Uint8Array(j + (S - N)), C = j; N !== S; ) k[C++] = _[N++];
      return k;
    }
    function p(m) {
      var x = w(m);
      if (x) return x;
      throw new Error("Non-base" + s + " character");
    }
    return { encode: v, decodeUnsafe: w, decode: p };
  }
  return nn = e, nn;
}
var on, No;
function lu() {
  return No || (No = 1, on = uu()("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")), on;
}
var an, Lo;
function fu() {
  if (Lo) return an;
  Lo = 1;
  var e = lu();
  return an = function(r) {
    function t(i) {
      var s = Uint8Array.from(i), f = r(s), g = s.length + 4, h = new Uint8Array(g);
      return h.set(s, 0), h.set(f.subarray(0, 4), s.length), e.encode(h, g);
    }
    function n(i) {
      var s = i.slice(0, -4), f = i.slice(-4), g = r(s);
      if (!(f[0] ^ g[0] | f[1] ^ g[1] | f[2] ^ g[2] | f[3] ^ g[3])) return s;
    }
    function a(i) {
      var s = e.decodeUnsafe(i);
      if (s) return n(s);
    }
    function o(i) {
      var s = e.decode(i), f = n(s);
      if (!f) throw new Error("Invalid checksum");
      return f;
    }
    return { encode: t, decode: o, decodeUnsafe: a };
  }, an;
}
var sn, Oo;
function Hf() {
  if (Oo) return sn;
  Oo = 1;
  var { sha256: e } = Ra(), r = fu();
  function t(n) {
    return e(e(n));
  }
  return sn = r(t), sn;
}
var Mr = {}, qo;
function Df() {
  if (qo) return Mr;
  qo = 1, Object.defineProperty(Mr, "__esModule", { value: true }), Mr.bech32m = Mr.bech32 = void 0;
  const e = "qpzry9x8gf2tvdw0s3jn54khce6mua7l", r = {};
  for (let g = 0; g < e.length; g++) {
    const h = e.charAt(g);
    r[h] = g;
  }
  function t(g) {
    const h = g >> 25;
    return (g & 33554431) << 5 ^ -(h >> 0 & 1) & 996825010 ^ -(h >> 1 & 1) & 642813549 ^ -(h >> 2 & 1) & 513874426 ^ -(h >> 3 & 1) & 1027748829 ^ -(h >> 4 & 1) & 705979059;
  }
  function n(g) {
    let h = 1;
    for (let v = 0; v < g.length; ++v) {
      const w = g.charCodeAt(v);
      if (w < 33 || w > 126) return "Invalid prefix (" + g + ")";
      h = t(h) ^ w >> 5;
    }
    h = t(h);
    for (let v = 0; v < g.length; ++v) {
      const w = g.charCodeAt(v);
      h = t(h) ^ w & 31;
    }
    return h;
  }
  function a(g, h, v, w) {
    let p = 0, m = 0;
    const x = (1 << v) - 1, j = [];
    for (let P = 0; P < g.length; ++P) for (p = p << h | g[P], m += h; m >= v; ) m -= v, j.push(p >> m & x);
    if (w) m > 0 && j.push(p << v - m & x);
    else {
      if (m >= h) return "Excess padding";
      if (p << v - m & x) return "Non-zero padding";
    }
    return j;
  }
  function o(g) {
    return a(g, 8, 5, true);
  }
  function i(g) {
    const h = a(g, 5, 8, false);
    if (Array.isArray(h)) return h;
  }
  function s(g) {
    const h = a(g, 5, 8, false);
    if (Array.isArray(h)) return h;
    throw new Error(h);
  }
  function f(g) {
    let h;
    g === "bech32" ? h = 1 : h = 734539939;
    function v(x, j, P) {
      if (P = P || 90, x.length + 7 + j.length > P) throw new TypeError("Exceeds length limit");
      x = x.toLowerCase();
      let S = n(x);
      if (typeof S == "string") throw new Error(S);
      let _ = x + "1";
      for (let M = 0; M < j.length; ++M) {
        const W = j[M];
        if (W >> 5 !== 0) throw new Error("Non 5-bit word");
        S = t(S) ^ W, _ += e.charAt(W);
      }
      for (let M = 0; M < 6; ++M) S = t(S);
      S ^= h;
      for (let M = 0; M < 6; ++M) {
        const W = S >> (5 - M) * 5 & 31;
        _ += e.charAt(W);
      }
      return _;
    }
    function w(x, j) {
      if (j = j || 90, x.length < 8) return x + " too short";
      if (x.length > j) return "Exceeds length limit";
      const P = x.toLowerCase(), S = x.toUpperCase();
      if (x !== P && x !== S) return "Mixed-case string " + x;
      x = P;
      const _ = x.lastIndexOf("1");
      if (_ === -1) return "No separator character for " + x;
      if (_ === 0) return "Missing prefix for " + x;
      const M = x.slice(0, _), W = x.slice(_ + 1);
      if (W.length < 6) return "Data too short";
      let U = n(M);
      if (typeof U == "string") return U;
      const R = [];
      for (let N = 0; N < W.length; ++N) {
        const k = W.charAt(N), C = r[k];
        if (C === void 0) return "Unknown character " + k;
        U = t(U) ^ C, !(N + 6 >= W.length) && R.push(C);
      }
      return U !== h ? "Invalid checksum for " + x : { prefix: M, words: R };
    }
    function p(x, j) {
      const P = w(x, j);
      if (typeof P == "object") return P;
    }
    function m(x, j) {
      const P = w(x, j);
      if (typeof P == "object") return P;
      throw new Error(P);
    }
    return { decodeUnsafe: p, decode: m, encode: v, toWords: o, fromWordsUnsafe: i, fromWords: s };
  }
  return Mr.bech32 = f("bech32"), Mr.bech32m = f("bech32m"), Mr;
}
var mt = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Fo;
function du() {
  return Fo || (Fo = 1, (function(e, r) {
    var t = iu(), n = t.Buffer;
    function a(i, s) {
      for (var f in i) s[f] = i[f];
    }
    n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? e.exports = t : (a(t, r), r.Buffer = o);
    function o(i, s, f) {
      return n(i, s, f);
    }
    o.prototype = Object.create(n.prototype), a(n, o), o.from = function(i, s, f) {
      if (typeof i == "number") throw new TypeError("Argument must not be a number");
      return n(i, s, f);
    }, o.alloc = function(i, s, f) {
      if (typeof i != "number") throw new TypeError("Argument must be a number");
      var g = n(i);
      return s !== void 0 ? typeof f == "string" ? g.fill(s, f) : g.fill(s) : g.fill(0), g;
    }, o.allocUnsafe = function(i) {
      if (typeof i != "number") throw new TypeError("Argument must be a number");
      return n(i);
    }, o.allocUnsafeSlow = function(i) {
      if (typeof i != "number") throw new TypeError("Argument must be a number");
      return t.SlowBuffer(i);
    };
  })(mt, mt.exports)), mt.exports;
}
var cn, Po;
function Kf() {
  if (Po) return cn;
  Po = 1;
  var e = du().Buffer, r = 9007199254740991;
  function t(i) {
    if (i < 0 || i > r || i % 1 !== 0) throw new RangeError("value out of range");
  }
  function n(i, s, f) {
    if (t(i), s || (s = e.allocUnsafe(o(i))), !e.isBuffer(s)) throw new TypeError("buffer must be a Buffer instance");
    return f || (f = 0), i < 253 ? (s.writeUInt8(i, f), n.bytes = 1) : i <= 65535 ? (s.writeUInt8(253, f), s.writeUInt16LE(i, f + 1), n.bytes = 3) : i <= 4294967295 ? (s.writeUInt8(254, f), s.writeUInt32LE(i, f + 1), n.bytes = 5) : (s.writeUInt8(255, f), s.writeUInt32LE(i >>> 0, f + 1), s.writeUInt32LE(i / 4294967296 | 0, f + 5), n.bytes = 9), s;
  }
  function a(i, s) {
    if (!e.isBuffer(i)) throw new TypeError("buffer must be a Buffer instance");
    s || (s = 0);
    var f = i.readUInt8(s);
    if (f < 253) return a.bytes = 1, f;
    if (f === 253) return a.bytes = 3, i.readUInt16LE(s + 1);
    if (f === 254) return a.bytes = 5, i.readUInt32LE(s + 1);
    a.bytes = 9;
    var g = i.readUInt32LE(s + 1), h = i.readUInt32LE(s + 5), v = h * 4294967296 + g;
    return t(v), v;
  }
  function o(i) {
    return t(i), i < 253 ? 1 : i <= 65535 ? 3 : i <= 4294967295 ? 5 : 9;
  }
  return cn = { encode: n, decode: a, encodingLength: o }, cn;
}
var gt = {}, bt = {}, un = {}, Yr = {}, Xr = {}, ln = {}, Mo;
function Ke() {
  return Mo || (Mo = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: true }), (function(r) {
      r[r.UNSIGNED_TX = 0] = "UNSIGNED_TX", r[r.GLOBAL_XPUB = 1] = "GLOBAL_XPUB";
    })(e.GlobalTypes || (e.GlobalTypes = {})), e.GLOBAL_TYPE_NAMES = ["unsignedTx", "globalXpub"], (function(r) {
      r[r.NON_WITNESS_UTXO = 0] = "NON_WITNESS_UTXO", r[r.WITNESS_UTXO = 1] = "WITNESS_UTXO", r[r.PARTIAL_SIG = 2] = "PARTIAL_SIG", r[r.SIGHASH_TYPE = 3] = "SIGHASH_TYPE", r[r.REDEEM_SCRIPT = 4] = "REDEEM_SCRIPT", r[r.WITNESS_SCRIPT = 5] = "WITNESS_SCRIPT", r[r.BIP32_DERIVATION = 6] = "BIP32_DERIVATION", r[r.FINAL_SCRIPTSIG = 7] = "FINAL_SCRIPTSIG", r[r.FINAL_SCRIPTWITNESS = 8] = "FINAL_SCRIPTWITNESS", r[r.POR_COMMITMENT = 9] = "POR_COMMITMENT", r[r.TAP_KEY_SIG = 19] = "TAP_KEY_SIG", r[r.TAP_SCRIPT_SIG = 20] = "TAP_SCRIPT_SIG", r[r.TAP_LEAF_SCRIPT = 21] = "TAP_LEAF_SCRIPT", r[r.TAP_BIP32_DERIVATION = 22] = "TAP_BIP32_DERIVATION", r[r.TAP_INTERNAL_KEY = 23] = "TAP_INTERNAL_KEY", r[r.TAP_MERKLE_ROOT = 24] = "TAP_MERKLE_ROOT";
    })(e.InputTypes || (e.InputTypes = {})), e.INPUT_TYPE_NAMES = ["nonWitnessUtxo", "witnessUtxo", "partialSig", "sighashType", "redeemScript", "witnessScript", "bip32Derivation", "finalScriptSig", "finalScriptWitness", "porCommitment", "tapKeySig", "tapScriptSig", "tapLeafScript", "tapBip32Derivation", "tapInternalKey", "tapMerkleRoot"], (function(r) {
      r[r.REDEEM_SCRIPT = 0] = "REDEEM_SCRIPT", r[r.WITNESS_SCRIPT = 1] = "WITNESS_SCRIPT", r[r.BIP32_DERIVATION = 2] = "BIP32_DERIVATION", r[r.TAP_INTERNAL_KEY = 5] = "TAP_INTERNAL_KEY", r[r.TAP_TREE = 6] = "TAP_TREE", r[r.TAP_BIP32_DERIVATION = 7] = "TAP_BIP32_DERIVATION";
    })(e.OutputTypes || (e.OutputTypes = {})), e.OUTPUT_TYPE_NAMES = ["redeemScript", "witnessScript", "bip32Derivation", "tapInternalKey", "tapTree", "tapBip32Derivation"];
  })(ln)), ln;
}
var yr = {}, Ho;
function hu() {
  if (Ho) return yr;
  Ho = 1, Object.defineProperty(yr, "__esModule", { value: true });
  const e = Ke(), r = (i) => [...Array(i).keys()];
  function t(i) {
    if (i.key[0] !== e.GlobalTypes.GLOBAL_XPUB) throw new Error("Decode Error: could not decode globalXpub with key 0x" + i.key.toString("hex"));
    if (i.key.length !== 79 || ![2, 3].includes(i.key[46])) throw new Error("Decode Error: globalXpub has invalid extended pubkey in key 0x" + i.key.toString("hex"));
    if (i.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Global GLOBAL_XPUB value length should be multiple of 4");
    const s = i.key.slice(1), f = { masterFingerprint: i.value.slice(0, 4), extendedPubkey: s, path: "m" };
    for (const g of r(i.value.length / 4 - 1)) {
      const h = i.value.readUInt32LE(g * 4 + 4), v = !!(h & 2147483648), w = h & 2147483647;
      f.path += "/" + w.toString(10) + (v ? "'" : "");
    }
    return f;
  }
  yr.decode = t;
  function n(i) {
    const s = le.from([e.GlobalTypes.GLOBAL_XPUB]), f = le.concat([s, i.extendedPubkey]), g = i.path.split("/"), h = le.allocUnsafe(g.length * 4);
    i.masterFingerprint.copy(h, 0);
    let v = 4;
    return g.slice(1).forEach((w) => {
      const p = w.slice(-1) === "'";
      let m = 2147483647 & parseInt(p ? w.slice(0, -1) : w, 10);
      p && (m += 2147483648), h.writeUInt32LE(m, v), v += 4;
    }), { key: f, value: h };
  }
  yr.encode = n, yr.expected = "{ masterFingerprint: Buffer; extendedPubkey: Buffer; path: string; }";
  function a(i) {
    const s = i.extendedPubkey, f = i.masterFingerprint, g = i.path;
    return le.isBuffer(s) && s.length === 78 && [2, 3].indexOf(s[45]) > -1 && le.isBuffer(f) && f.length === 4 && typeof g == "string" && !!g.match(/^m(\/\d+'?)*$/);
  }
  yr.check = a;
  function o(i, s, f) {
    const g = s.extendedPubkey.toString("hex");
    return f.has(g) ? false : (f.add(g), i.filter((h) => h.extendedPubkey.equals(s.extendedPubkey)).length === 0);
  }
  return yr.canAddToArray = o, yr;
}
var yt = {}, Do;
function pu() {
  if (Do) return yt;
  Do = 1, Object.defineProperty(yt, "__esModule", { value: true });
  const e = Ke();
  function r(t) {
    return { key: le.from([e.GlobalTypes.UNSIGNED_TX]), value: t.toBuffer() };
  }
  return yt.encode = r, yt;
}
var vr = {}, Ko;
function mu() {
  if (Ko) return vr;
  Ko = 1, Object.defineProperty(vr, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.FINAL_SCRIPTSIG) throw new Error("Decode Error: could not decode finalScriptSig with key 0x" + o.key.toString("hex"));
    return o.value;
  }
  vr.decode = r;
  function t(o) {
    return { key: le.from([e.InputTypes.FINAL_SCRIPTSIG]), value: o };
  }
  vr.encode = t, vr.expected = "Buffer";
  function n(o) {
    return le.isBuffer(o);
  }
  vr.check = n;
  function a(o, i) {
    return !!o && !!i && o.finalScriptSig === void 0;
  }
  return vr.canAdd = a, vr;
}
var wr = {}, Vo;
function gu() {
  if (Vo) return wr;
  Vo = 1, Object.defineProperty(wr, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.FINAL_SCRIPTWITNESS) throw new Error("Decode Error: could not decode finalScriptWitness with key 0x" + o.key.toString("hex"));
    return o.value;
  }
  wr.decode = r;
  function t(o) {
    return { key: le.from([e.InputTypes.FINAL_SCRIPTWITNESS]), value: o };
  }
  wr.encode = t, wr.expected = "Buffer";
  function n(o) {
    return le.isBuffer(o);
  }
  wr.check = n;
  function a(o, i) {
    return !!o && !!i && o.finalScriptWitness === void 0;
  }
  return wr.canAdd = a, wr;
}
var xr = {}, Go;
function bu() {
  if (Go) return xr;
  Go = 1, Object.defineProperty(xr, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.NON_WITNESS_UTXO) throw new Error("Decode Error: could not decode nonWitnessUtxo with key 0x" + o.key.toString("hex"));
    return o.value;
  }
  xr.decode = r;
  function t(o) {
    return { key: le.from([e.InputTypes.NON_WITNESS_UTXO]), value: o };
  }
  xr.encode = t, xr.expected = "Buffer";
  function n(o) {
    return le.isBuffer(o);
  }
  xr.check = n;
  function a(o, i) {
    return !!o && !!i && o.nonWitnessUtxo === void 0;
  }
  return xr.canAdd = a, xr;
}
var kr = {}, Wo;
function yu() {
  if (Wo) return kr;
  Wo = 1, Object.defineProperty(kr, "__esModule", { value: true });
  const e = Ke();
  function r(i) {
    if (i.key[0] !== e.InputTypes.PARTIAL_SIG) throw new Error("Decode Error: could not decode partialSig with key 0x" + i.key.toString("hex"));
    if (!(i.key.length === 34 || i.key.length === 66) || ![2, 3, 4].includes(i.key[1])) throw new Error("Decode Error: partialSig has invalid pubkey in key 0x" + i.key.toString("hex"));
    return { pubkey: i.key.slice(1), signature: i.value };
  }
  kr.decode = r;
  function t(i) {
    const s = le.from([e.InputTypes.PARTIAL_SIG]);
    return { key: le.concat([s, i.pubkey]), value: i.signature };
  }
  kr.encode = t, kr.expected = "{ pubkey: Buffer; signature: Buffer; }";
  function n(i) {
    return le.isBuffer(i.pubkey) && le.isBuffer(i.signature) && [33, 65].includes(i.pubkey.length) && [2, 3, 4].includes(i.pubkey[0]) && a(i.signature);
  }
  kr.check = n;
  function a(i) {
    if (!le.isBuffer(i) || i.length < 9 || i[0] !== 48 || i.length !== i[1] + 3 || i[2] !== 2) return false;
    const s = i[3];
    if (s > 33 || s < 1 || i[3 + s + 1] !== 2) return false;
    const f = i[3 + s + 2];
    return !(f > 33 || f < 1 || i.length !== 3 + s + 2 + f + 2);
  }
  function o(i, s, f) {
    const g = s.pubkey.toString("hex");
    return f.has(g) ? false : (f.add(g), i.filter((h) => h.pubkey.equals(s.pubkey)).length === 0);
  }
  return kr.canAddToArray = o, kr;
}
var Er = {}, Yo;
function vu() {
  if (Yo) return Er;
  Yo = 1, Object.defineProperty(Er, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.POR_COMMITMENT) throw new Error("Decode Error: could not decode porCommitment with key 0x" + o.key.toString("hex"));
    return o.value.toString("utf8");
  }
  Er.decode = r;
  function t(o) {
    return { key: le.from([e.InputTypes.POR_COMMITMENT]), value: le.from(o, "utf8") };
  }
  Er.encode = t, Er.expected = "string";
  function n(o) {
    return typeof o == "string";
  }
  Er.check = n;
  function a(o, i) {
    return !!o && !!i && o.porCommitment === void 0;
  }
  return Er.canAdd = a, Er;
}
var Br = {}, Xo;
function wu() {
  if (Xo) return Br;
  Xo = 1, Object.defineProperty(Br, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.SIGHASH_TYPE) throw new Error("Decode Error: could not decode sighashType with key 0x" + o.key.toString("hex"));
    return o.value.readUInt32LE(0);
  }
  Br.decode = r;
  function t(o) {
    const i = le.from([e.InputTypes.SIGHASH_TYPE]), s = le.allocUnsafe(4);
    return s.writeUInt32LE(o, 0), { key: i, value: s };
  }
  Br.encode = t, Br.expected = "number";
  function n(o) {
    return typeof o == "number";
  }
  Br.check = n;
  function a(o, i) {
    return !!o && !!i && o.sighashType === void 0;
  }
  return Br.canAdd = a, Br;
}
var Ir = {}, Jo;
function xu() {
  if (Jo) return Ir;
  Jo = 1, Object.defineProperty(Ir, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.TAP_KEY_SIG || o.key.length !== 1) throw new Error("Decode Error: could not decode tapKeySig with key 0x" + o.key.toString("hex"));
    if (!n(o.value)) throw new Error("Decode Error: tapKeySig not a valid 64-65-byte BIP340 signature");
    return o.value;
  }
  Ir.decode = r;
  function t(o) {
    return { key: le.from([e.InputTypes.TAP_KEY_SIG]), value: o };
  }
  Ir.encode = t, Ir.expected = "Buffer";
  function n(o) {
    return le.isBuffer(o) && (o.length === 64 || o.length === 65);
  }
  Ir.check = n;
  function a(o, i) {
    return !!o && !!i && o.tapKeySig === void 0;
  }
  return Ir.canAdd = a, Ir;
}
var _r = {}, Zo;
function ku() {
  if (Zo) return _r;
  Zo = 1, Object.defineProperty(_r, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.TAP_LEAF_SCRIPT) throw new Error("Decode Error: could not decode tapLeafScript with key 0x" + o.key.toString("hex"));
    if ((o.key.length - 2) % 32 !== 0) throw new Error("Decode Error: tapLeafScript has invalid control block in key 0x" + o.key.toString("hex"));
    const i = o.value[o.value.length - 1];
    if ((o.key[1] & 254) !== i) throw new Error("Decode Error: tapLeafScript bad leaf version in key 0x" + o.key.toString("hex"));
    const s = o.value.slice(0, -1);
    return { controlBlock: o.key.slice(1), script: s, leafVersion: i };
  }
  _r.decode = r;
  function t(o) {
    const i = le.from([e.InputTypes.TAP_LEAF_SCRIPT]), s = le.from([o.leafVersion]);
    return { key: le.concat([i, o.controlBlock]), value: le.concat([o.script, s]) };
  }
  _r.encode = t, _r.expected = "{ controlBlock: Buffer; leafVersion: number, script: Buffer; }";
  function n(o) {
    return le.isBuffer(o.controlBlock) && (o.controlBlock.length - 1) % 32 === 0 && (o.controlBlock[0] & 254) === o.leafVersion && le.isBuffer(o.script);
  }
  _r.check = n;
  function a(o, i, s) {
    const f = i.controlBlock.toString("hex");
    return s.has(f) ? false : (s.add(f), o.filter((g) => g.controlBlock.equals(i.controlBlock)).length === 0);
  }
  return _r.canAddToArray = a, _r;
}
var Ar = {}, Qo;
function Eu() {
  if (Qo) return Ar;
  Qo = 1, Object.defineProperty(Ar, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.TAP_MERKLE_ROOT || o.key.length !== 1) throw new Error("Decode Error: could not decode tapMerkleRoot with key 0x" + o.key.toString("hex"));
    if (!n(o.value)) throw new Error("Decode Error: tapMerkleRoot not a 32-byte hash");
    return o.value;
  }
  Ar.decode = r;
  function t(o) {
    return { key: le.from([e.InputTypes.TAP_MERKLE_ROOT]), value: o };
  }
  Ar.encode = t, Ar.expected = "Buffer";
  function n(o) {
    return le.isBuffer(o) && o.length === 32;
  }
  Ar.check = n;
  function a(o, i) {
    return !!o && !!i && o.tapMerkleRoot === void 0;
  }
  return Ar.canAdd = a, Ar;
}
var Sr = {}, $o;
function Bu() {
  if ($o) return Sr;
  $o = 1, Object.defineProperty(Sr, "__esModule", { value: true });
  const e = Ke();
  function r(o) {
    if (o.key[0] !== e.InputTypes.TAP_SCRIPT_SIG) throw new Error("Decode Error: could not decode tapScriptSig with key 0x" + o.key.toString("hex"));
    if (o.key.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid key 0x" + o.key.toString("hex"));
    if (o.value.length !== 64 && o.value.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid signature in key 0x" + o.key.toString("hex"));
    const i = o.key.slice(1, 33), s = o.key.slice(33);
    return { pubkey: i, leafHash: s, signature: o.value };
  }
  Sr.decode = r;
  function t(o) {
    const i = le.from([e.InputTypes.TAP_SCRIPT_SIG]);
    return { key: le.concat([i, o.pubkey, o.leafHash]), value: o.signature };
  }
  Sr.encode = t, Sr.expected = "{ pubkey: Buffer; leafHash: Buffer; signature: Buffer; }";
  function n(o) {
    return le.isBuffer(o.pubkey) && le.isBuffer(o.leafHash) && le.isBuffer(o.signature) && o.pubkey.length === 32 && o.leafHash.length === 32 && (o.signature.length === 64 || o.signature.length === 65);
  }
  Sr.check = n;
  function a(o, i, s) {
    const f = i.pubkey.toString("hex") + i.leafHash.toString("hex");
    return s.has(f) ? false : (s.add(f), o.filter((g) => g.pubkey.equals(i.pubkey) && g.leafHash.equals(i.leafHash)).length === 0);
  }
  return Sr.canAddToArray = a, Sr;
}
var Tr = {}, lr = {}, Jr = {}, ei;
function pt() {
  if (ei) return Jr;
  ei = 1, Object.defineProperty(Jr, "__esModule", { value: true });
  const e = 9007199254740991;
  function r(o) {
    if (o < 0 || o > e || o % 1 !== 0) throw new RangeError("value out of range");
  }
  function t(o, i, s) {
    if (r(o), i || (i = le.allocUnsafe(a(o))), !le.isBuffer(i)) throw new TypeError("buffer must be a Buffer instance");
    return s || (s = 0), o < 253 ? (i.writeUInt8(o, s), Object.assign(t, { bytes: 1 })) : o <= 65535 ? (i.writeUInt8(253, s), i.writeUInt16LE(o, s + 1), Object.assign(t, { bytes: 3 })) : o <= 4294967295 ? (i.writeUInt8(254, s), i.writeUInt32LE(o, s + 1), Object.assign(t, { bytes: 5 })) : (i.writeUInt8(255, s), i.writeUInt32LE(o >>> 0, s + 1), i.writeUInt32LE(o / 4294967296 | 0, s + 5), Object.assign(t, { bytes: 9 })), i;
  }
  Jr.encode = t;
  function n(o, i) {
    if (!le.isBuffer(o)) throw new TypeError("buffer must be a Buffer instance");
    i || (i = 0);
    const s = o.readUInt8(i);
    if (s < 253) return Object.assign(n, { bytes: 1 }), s;
    if (s === 253) return Object.assign(n, { bytes: 3 }), o.readUInt16LE(i + 1);
    if (s === 254) return Object.assign(n, { bytes: 5 }), o.readUInt32LE(i + 1);
    {
      Object.assign(n, { bytes: 9 });
      const f = o.readUInt32LE(i + 1), h = o.readUInt32LE(i + 5) * 4294967296 + f;
      return r(h), h;
    }
  }
  Jr.decode = n;
  function a(o) {
    return r(o), o < 253 ? 1 : o <= 65535 ? 3 : o <= 4294967295 ? 5 : 9;
  }
  return Jr.encodingLength = a, Jr;
}
var ri;
function to() {
  if (ri) return lr;
  ri = 1, Object.defineProperty(lr, "__esModule", { value: true });
  const e = pt();
  lr.range = (s) => [...Array(s).keys()];
  function r(s) {
    if (s.length < 1) return s;
    let f = s.length - 1, g = 0;
    for (let h = 0; h < s.length / 2; h++) g = s[h], s[h] = s[f], s[f] = g, f--;
    return s;
  }
  lr.reverseBuffer = r;
  function t(s) {
    const f = s.map(n);
    return f.push(le.from([0])), le.concat(f);
  }
  lr.keyValsToBuffer = t;
  function n(s) {
    const f = s.key.length, g = s.value.length, h = e.encodingLength(f), v = e.encodingLength(g), w = le.allocUnsafe(h + f + v + g);
    return e.encode(f, w, 0), s.key.copy(w, h), e.encode(g, w, h + f), s.value.copy(w, h + f + v), w;
  }
  lr.keyValToBuffer = n;
  function a(s, f) {
    if (typeof s != "number") throw new Error("cannot write a non-number as a number");
    if (s < 0) throw new Error("specified a negative value for writing an unsigned value");
    if (s > f) throw new Error("RangeError: value out of range");
    if (Math.floor(s) !== s) throw new Error("value has a fractional component");
  }
  function o(s, f) {
    const g = s.readUInt32LE(f);
    let h = s.readUInt32LE(f + 4);
    return h *= 4294967296, a(h + g, 9007199254740991), h + g;
  }
  lr.readUInt64LE = o;
  function i(s, f, g) {
    return a(f, 9007199254740991), s.writeInt32LE(f & -1, g), s.writeUInt32LE(Math.floor(f / 4294967296), g + 4), g + 8;
  }
  return lr.writeUInt64LE = i, lr;
}
var ti;
function Iu() {
  if (ti) return Tr;
  ti = 1, Object.defineProperty(Tr, "__esModule", { value: true });
  const e = Ke(), r = to(), t = pt();
  function n(s) {
    if (s.key[0] !== e.InputTypes.WITNESS_UTXO) throw new Error("Decode Error: could not decode witnessUtxo with key 0x" + s.key.toString("hex"));
    const f = r.readUInt64LE(s.value, 0);
    let g = 8;
    const h = t.decode(s.value, g);
    g += t.encodingLength(h);
    const v = s.value.slice(g);
    if (v.length !== h) throw new Error("Decode Error: WITNESS_UTXO script is not proper length");
    return { script: v, value: f };
  }
  Tr.decode = n;
  function a(s) {
    const { script: f, value: g } = s, h = t.encodingLength(f.length), v = le.allocUnsafe(8 + h + f.length);
    return r.writeUInt64LE(v, g, 0), t.encode(f.length, v, 8), f.copy(v, 8 + h), { key: le.from([e.InputTypes.WITNESS_UTXO]), value: v };
  }
  Tr.encode = a, Tr.expected = "{ script: Buffer; value: number; }";
  function o(s) {
    return le.isBuffer(s.script) && typeof s.value == "number";
  }
  Tr.check = o;
  function i(s, f) {
    return !!s && !!f && s.witnessUtxo === void 0;
  }
  return Tr.canAdd = i, Tr;
}
var zr = {}, ni;
function _u() {
  if (ni) return zr;
  ni = 1, Object.defineProperty(zr, "__esModule", { value: true });
  const e = Ke(), r = pt();
  function t(i) {
    if (i.key[0] !== e.OutputTypes.TAP_TREE || i.key.length !== 1) throw new Error("Decode Error: could not decode tapTree with key 0x" + i.key.toString("hex"));
    let s = 0;
    const f = [];
    for (; s < i.value.length; ) {
      const g = i.value[s++], h = i.value[s++], v = r.decode(i.value, s);
      s += r.encodingLength(v), f.push({ depth: g, leafVersion: h, script: i.value.slice(s, s + v) }), s += v;
    }
    return { leaves: f };
  }
  zr.decode = t;
  function n(i) {
    const s = le.from([e.OutputTypes.TAP_TREE]), f = [].concat(...i.leaves.map((g) => [le.of(g.depth, g.leafVersion), r.encode(g.script.length), g.script]));
    return { key: s, value: le.concat(f) };
  }
  zr.encode = n, zr.expected = "{ leaves: [{ depth: number; leafVersion: number, script: Buffer; }] }";
  function a(i) {
    return Array.isArray(i.leaves) && i.leaves.every((s) => s.depth >= 0 && s.depth <= 128 && (s.leafVersion & 254) === s.leafVersion && le.isBuffer(s.script));
  }
  zr.check = a;
  function o(i, s) {
    return !!i && !!s && i.tapTree === void 0;
  }
  return zr.canAdd = o, zr;
}
var vt = {}, oi;
function Ua() {
  if (oi) return vt;
  oi = 1, Object.defineProperty(vt, "__esModule", { value: true });
  const e = (n) => [...Array(n).keys()], r = (n) => n.length === 33 && [2, 3].includes(n[0]) || n.length === 65 && n[0] === 4;
  function t(n, a = r) {
    function o(h) {
      if (h.key[0] !== n) throw new Error("Decode Error: could not decode bip32Derivation with key 0x" + h.key.toString("hex"));
      const v = h.key.slice(1);
      if (!a(v)) throw new Error("Decode Error: bip32Derivation has invalid pubkey in key 0x" + h.key.toString("hex"));
      if (h.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Input BIP32_DERIVATION value length should be multiple of 4");
      const w = { masterFingerprint: h.value.slice(0, 4), pubkey: v, path: "m" };
      for (const p of e(h.value.length / 4 - 1)) {
        const m = h.value.readUInt32LE(p * 4 + 4), x = !!(m & 2147483648), j = m & 2147483647;
        w.path += "/" + j.toString(10) + (x ? "'" : "");
      }
      return w;
    }
    function i(h) {
      const v = le.from([n]), w = le.concat([v, h.pubkey]), p = h.path.split("/"), m = le.allocUnsafe(p.length * 4);
      h.masterFingerprint.copy(m, 0);
      let x = 4;
      return p.slice(1).forEach((j) => {
        const P = j.slice(-1) === "'";
        let S = 2147483647 & parseInt(P ? j.slice(0, -1) : j, 10);
        P && (S += 2147483648), m.writeUInt32LE(S, x), x += 4;
      }), { key: w, value: m };
    }
    const s = "{ masterFingerprint: Buffer; pubkey: Buffer; path: string; }";
    function f(h) {
      return le.isBuffer(h.pubkey) && le.isBuffer(h.masterFingerprint) && typeof h.path == "string" && a(h.pubkey) && h.masterFingerprint.length === 4;
    }
    function g(h, v, w) {
      const p = v.pubkey.toString("hex");
      return w.has(p) ? false : (w.add(p), h.filter((m) => m.pubkey.equals(v.pubkey)).length === 0);
    }
    return { decode: o, encode: i, check: f, expected: s, canAddToArray: g };
  }
  return vt.makeConverter = t, vt;
}
var wt = {}, ii;
function Au() {
  if (ii) return wt;
  ii = 1, Object.defineProperty(wt, "__esModule", { value: true });
  function e(r) {
    return t;
    function t(n) {
      let a;
      if (r.includes(n.key[0]) && (a = n.key.slice(1), !(a.length === 33 || a.length === 65) || ![2, 3, 4].includes(a[0]))) throw new Error("Format Error: invalid pubkey in key 0x" + n.key.toString("hex"));
      return a;
    }
  }
  return wt.makeChecker = e, wt;
}
var xt = {}, ai;
function Su() {
  if (ai) return xt;
  ai = 1, Object.defineProperty(xt, "__esModule", { value: true });
  function e(r) {
    function t(s) {
      if (s.key[0] !== r) throw new Error("Decode Error: could not decode redeemScript with key 0x" + s.key.toString("hex"));
      return s.value;
    }
    function n(s) {
      return { key: le.from([r]), value: s };
    }
    const a = "Buffer";
    function o(s) {
      return le.isBuffer(s);
    }
    function i(s, f) {
      return !!s && !!f && s.redeemScript === void 0;
    }
    return { decode: t, encode: n, check: o, expected: a, canAdd: i };
  }
  return xt.makeConverter = e, xt;
}
var kt = {}, si;
function Tu() {
  if (si) return kt;
  si = 1, Object.defineProperty(kt, "__esModule", { value: true });
  const e = pt(), r = Ua(), t = (a) => a.length === 32;
  function n(a) {
    const o = r.makeConverter(a, t);
    function i(h) {
      const v = e.decode(h.value), w = e.encodingLength(v), p = o.decode({ key: h.key, value: h.value.slice(w + v * 32) }), m = new Array(v);
      for (let x = 0, j = w; x < v; x++, j += 32) m[x] = h.value.slice(j, j + 32);
      return Object.assign({}, p, { leafHashes: m });
    }
    function s(h) {
      const v = o.encode(h), w = e.encodingLength(h.leafHashes.length), p = le.allocUnsafe(w);
      e.encode(h.leafHashes.length, p);
      const m = le.concat([p, ...h.leafHashes, v.value]);
      return Object.assign({}, v, { value: m });
    }
    const f = "{ masterFingerprint: Buffer; pubkey: Buffer; path: string; leafHashes: Buffer[]; }";
    function g(h) {
      return Array.isArray(h.leafHashes) && h.leafHashes.every((v) => le.isBuffer(v) && v.length === 32) && o.check(h);
    }
    return { decode: i, encode: s, check: g, expected: f, canAddToArray: o.canAddToArray };
  }
  return kt.makeConverter = n, kt;
}
var Et = {}, ci;
function zu() {
  if (ci) return Et;
  ci = 1, Object.defineProperty(Et, "__esModule", { value: true });
  function e(r) {
    function t(s) {
      if (s.key[0] !== r || s.key.length !== 1) throw new Error("Decode Error: could not decode tapInternalKey with key 0x" + s.key.toString("hex"));
      if (s.value.length !== 32) throw new Error("Decode Error: tapInternalKey not a 32-byte x-only pubkey");
      return s.value;
    }
    function n(s) {
      return { key: le.from([r]), value: s };
    }
    const a = "Buffer";
    function o(s) {
      return le.isBuffer(s) && s.length === 32;
    }
    function i(s, f) {
      return !!s && !!f && s.tapInternalKey === void 0;
    }
    return { decode: t, encode: n, check: o, expected: a, canAdd: i };
  }
  return Et.makeConverter = e, Et;
}
var Bt = {}, ui;
function Cu() {
  if (ui) return Bt;
  ui = 1, Object.defineProperty(Bt, "__esModule", { value: true });
  function e(r) {
    function t(s) {
      if (s.key[0] !== r) throw new Error("Decode Error: could not decode witnessScript with key 0x" + s.key.toString("hex"));
      return s.value;
    }
    function n(s) {
      return { key: le.from([r]), value: s };
    }
    const a = "Buffer";
    function o(s) {
      return le.isBuffer(s);
    }
    function i(s, f) {
      return !!s && !!f && s.witnessScript === void 0;
    }
    return { decode: t, encode: n, check: o, expected: a, canAdd: i };
  }
  return Bt.makeConverter = e, Bt;
}
var li;
function no() {
  if (li) return Xr;
  li = 1, Object.defineProperty(Xr, "__esModule", { value: true });
  const e = Ke(), r = hu(), t = pu(), n = mu(), a = gu(), o = bu(), i = yu(), s = vu(), f = wu(), g = xu(), h = ku(), v = Eu(), w = Bu(), p = Iu(), m = _u(), x = Ua(), j = Au(), P = Su(), S = Tu(), _ = zu(), M = Cu(), W = { unsignedTx: t, globalXpub: r, checkPubkey: j.makeChecker([]) };
  Xr.globals = W;
  const U = { nonWitnessUtxo: o, partialSig: i, sighashType: f, finalScriptSig: n, finalScriptWitness: a, porCommitment: s, witnessUtxo: p, bip32Derivation: x.makeConverter(e.InputTypes.BIP32_DERIVATION), redeemScript: P.makeConverter(e.InputTypes.REDEEM_SCRIPT), witnessScript: M.makeConverter(e.InputTypes.WITNESS_SCRIPT), checkPubkey: j.makeChecker([e.InputTypes.PARTIAL_SIG, e.InputTypes.BIP32_DERIVATION]), tapKeySig: g, tapScriptSig: w, tapLeafScript: h, tapBip32Derivation: S.makeConverter(e.InputTypes.TAP_BIP32_DERIVATION), tapInternalKey: _.makeConverter(e.InputTypes.TAP_INTERNAL_KEY), tapMerkleRoot: v };
  Xr.inputs = U;
  const R = { bip32Derivation: x.makeConverter(e.OutputTypes.BIP32_DERIVATION), redeemScript: P.makeConverter(e.OutputTypes.REDEEM_SCRIPT), witnessScript: M.makeConverter(e.OutputTypes.WITNESS_SCRIPT), checkPubkey: j.makeChecker([e.OutputTypes.BIP32_DERIVATION]), tapBip32Derivation: S.makeConverter(e.OutputTypes.TAP_BIP32_DERIVATION), tapTree: m, tapInternalKey: _.makeConverter(e.OutputTypes.TAP_INTERNAL_KEY) };
  return Xr.outputs = R, Xr;
}
var fi;
function ju() {
  if (fi) return Yr;
  fi = 1, Object.defineProperty(Yr, "__esModule", { value: true });
  const e = no(), r = to(), t = pt(), n = Ke();
  function a(s, f) {
    let g = 0;
    function h() {
      const R = t.decode(s, g);
      g += t.encodingLength(R);
      const N = s.slice(g, g + R);
      return g += R, N;
    }
    function v() {
      const R = s.readUInt32BE(g);
      return g += 4, R;
    }
    function w() {
      const R = s.readUInt8(g);
      return g += 1, R;
    }
    function p() {
      const R = h(), N = h();
      return { key: R, value: N };
    }
    function m() {
      if (g >= s.length) throw new Error("Format Error: Unexpected End of PSBT");
      const R = s.readUInt8(g) === 0;
      return R && g++, R;
    }
    if (v() !== 1886610036) throw new Error("Format Error: Invalid Magic Number");
    if (w() !== 255) throw new Error("Format Error: Magic Number must be followed by 0xff separator");
    const x = [], j = {};
    for (; !m(); ) {
      const R = p(), N = R.key.toString("hex");
      if (j[N]) throw new Error("Format Error: Keys must be unique for global keymap: key " + N);
      j[N] = 1, x.push(R);
    }
    const P = x.filter((R) => R.key[0] === n.GlobalTypes.UNSIGNED_TX);
    if (P.length !== 1) throw new Error("Format Error: Only one UNSIGNED_TX allowed");
    const S = f(P[0].value), { inputCount: _, outputCount: M } = S.getInputOutputCounts(), W = [], U = [];
    for (const R of r.range(_)) {
      const N = {}, k = [];
      for (; !m(); ) {
        const C = p(), q = C.key.toString("hex");
        if (N[q]) throw new Error("Format Error: Keys must be unique for each input: input index " + R + " key " + q);
        N[q] = 1, k.push(C);
      }
      W.push(k);
    }
    for (const R of r.range(M)) {
      const N = {}, k = [];
      for (; !m(); ) {
        const C = p(), q = C.key.toString("hex");
        if (N[q]) throw new Error("Format Error: Keys must be unique for each output: output index " + R + " key " + q);
        N[q] = 1, k.push(C);
      }
      U.push(k);
    }
    return i(S, { globalMapKeyVals: x, inputKeyVals: W, outputKeyVals: U });
  }
  Yr.psbtFromBuffer = a;
  function o(s, f, g) {
    if (!f.equals(le.from([g]))) throw new Error(`Format Error: Invalid ${s} key: ${f.toString("hex")}`);
  }
  Yr.checkKeyBuffer = o;
  function i(s, { globalMapKeyVals: f, inputKeyVals: g, outputKeyVals: h }) {
    const v = { unsignedTx: s };
    let w = 0;
    for (const P of f) switch (P.key[0]) {
      case n.GlobalTypes.UNSIGNED_TX:
        if (o("global", P.key, n.GlobalTypes.UNSIGNED_TX), w > 0) throw new Error("Format Error: GlobalMap has multiple UNSIGNED_TX");
        w++;
        break;
      case n.GlobalTypes.GLOBAL_XPUB:
        v.globalXpub === void 0 && (v.globalXpub = []), v.globalXpub.push(e.globals.globalXpub.decode(P));
        break;
      default:
        v.unknownKeyVals || (v.unknownKeyVals = []), v.unknownKeyVals.push(P);
    }
    const p = g.length, m = h.length, x = [], j = [];
    for (const P of r.range(p)) {
      const S = {};
      for (const _ of g[P]) switch (e.inputs.checkPubkey(_), _.key[0]) {
        case n.InputTypes.NON_WITNESS_UTXO:
          if (o("input", _.key, n.InputTypes.NON_WITNESS_UTXO), S.nonWitnessUtxo !== void 0) throw new Error("Format Error: Input has multiple NON_WITNESS_UTXO");
          S.nonWitnessUtxo = e.inputs.nonWitnessUtxo.decode(_);
          break;
        case n.InputTypes.WITNESS_UTXO:
          if (o("input", _.key, n.InputTypes.WITNESS_UTXO), S.witnessUtxo !== void 0) throw new Error("Format Error: Input has multiple WITNESS_UTXO");
          S.witnessUtxo = e.inputs.witnessUtxo.decode(_);
          break;
        case n.InputTypes.PARTIAL_SIG:
          S.partialSig === void 0 && (S.partialSig = []), S.partialSig.push(e.inputs.partialSig.decode(_));
          break;
        case n.InputTypes.SIGHASH_TYPE:
          if (o("input", _.key, n.InputTypes.SIGHASH_TYPE), S.sighashType !== void 0) throw new Error("Format Error: Input has multiple SIGHASH_TYPE");
          S.sighashType = e.inputs.sighashType.decode(_);
          break;
        case n.InputTypes.REDEEM_SCRIPT:
          if (o("input", _.key, n.InputTypes.REDEEM_SCRIPT), S.redeemScript !== void 0) throw new Error("Format Error: Input has multiple REDEEM_SCRIPT");
          S.redeemScript = e.inputs.redeemScript.decode(_);
          break;
        case n.InputTypes.WITNESS_SCRIPT:
          if (o("input", _.key, n.InputTypes.WITNESS_SCRIPT), S.witnessScript !== void 0) throw new Error("Format Error: Input has multiple WITNESS_SCRIPT");
          S.witnessScript = e.inputs.witnessScript.decode(_);
          break;
        case n.InputTypes.BIP32_DERIVATION:
          S.bip32Derivation === void 0 && (S.bip32Derivation = []), S.bip32Derivation.push(e.inputs.bip32Derivation.decode(_));
          break;
        case n.InputTypes.FINAL_SCRIPTSIG:
          o("input", _.key, n.InputTypes.FINAL_SCRIPTSIG), S.finalScriptSig = e.inputs.finalScriptSig.decode(_);
          break;
        case n.InputTypes.FINAL_SCRIPTWITNESS:
          o("input", _.key, n.InputTypes.FINAL_SCRIPTWITNESS), S.finalScriptWitness = e.inputs.finalScriptWitness.decode(_);
          break;
        case n.InputTypes.POR_COMMITMENT:
          o("input", _.key, n.InputTypes.POR_COMMITMENT), S.porCommitment = e.inputs.porCommitment.decode(_);
          break;
        case n.InputTypes.TAP_KEY_SIG:
          o("input", _.key, n.InputTypes.TAP_KEY_SIG), S.tapKeySig = e.inputs.tapKeySig.decode(_);
          break;
        case n.InputTypes.TAP_SCRIPT_SIG:
          S.tapScriptSig === void 0 && (S.tapScriptSig = []), S.tapScriptSig.push(e.inputs.tapScriptSig.decode(_));
          break;
        case n.InputTypes.TAP_LEAF_SCRIPT:
          S.tapLeafScript === void 0 && (S.tapLeafScript = []), S.tapLeafScript.push(e.inputs.tapLeafScript.decode(_));
          break;
        case n.InputTypes.TAP_BIP32_DERIVATION:
          S.tapBip32Derivation === void 0 && (S.tapBip32Derivation = []), S.tapBip32Derivation.push(e.inputs.tapBip32Derivation.decode(_));
          break;
        case n.InputTypes.TAP_INTERNAL_KEY:
          o("input", _.key, n.InputTypes.TAP_INTERNAL_KEY), S.tapInternalKey = e.inputs.tapInternalKey.decode(_);
          break;
        case n.InputTypes.TAP_MERKLE_ROOT:
          o("input", _.key, n.InputTypes.TAP_MERKLE_ROOT), S.tapMerkleRoot = e.inputs.tapMerkleRoot.decode(_);
          break;
        default:
          S.unknownKeyVals || (S.unknownKeyVals = []), S.unknownKeyVals.push(_);
      }
      x.push(S);
    }
    for (const P of r.range(m)) {
      const S = {};
      for (const _ of h[P]) switch (e.outputs.checkPubkey(_), _.key[0]) {
        case n.OutputTypes.REDEEM_SCRIPT:
          if (o("output", _.key, n.OutputTypes.REDEEM_SCRIPT), S.redeemScript !== void 0) throw new Error("Format Error: Output has multiple REDEEM_SCRIPT");
          S.redeemScript = e.outputs.redeemScript.decode(_);
          break;
        case n.OutputTypes.WITNESS_SCRIPT:
          if (o("output", _.key, n.OutputTypes.WITNESS_SCRIPT), S.witnessScript !== void 0) throw new Error("Format Error: Output has multiple WITNESS_SCRIPT");
          S.witnessScript = e.outputs.witnessScript.decode(_);
          break;
        case n.OutputTypes.BIP32_DERIVATION:
          S.bip32Derivation === void 0 && (S.bip32Derivation = []), S.bip32Derivation.push(e.outputs.bip32Derivation.decode(_));
          break;
        case n.OutputTypes.TAP_INTERNAL_KEY:
          o("output", _.key, n.OutputTypes.TAP_INTERNAL_KEY), S.tapInternalKey = e.outputs.tapInternalKey.decode(_);
          break;
        case n.OutputTypes.TAP_TREE:
          o("output", _.key, n.OutputTypes.TAP_TREE), S.tapTree = e.outputs.tapTree.decode(_);
          break;
        case n.OutputTypes.TAP_BIP32_DERIVATION:
          S.tapBip32Derivation === void 0 && (S.tapBip32Derivation = []), S.tapBip32Derivation.push(e.outputs.tapBip32Derivation.decode(_));
          break;
        default:
          S.unknownKeyVals || (S.unknownKeyVals = []), S.unknownKeyVals.push(_);
      }
      j.push(S);
    }
    return { globalMap: v, inputs: x, outputs: j };
  }
  return Yr.psbtFromKeyVals = i, Yr;
}
var st = {}, di;
function Ru() {
  if (di) return st;
  di = 1, Object.defineProperty(st, "__esModule", { value: true });
  const e = no(), r = to();
  function t({ globalMap: i, inputs: s, outputs: f }) {
    const { globalKeyVals: g, inputKeyVals: h, outputKeyVals: v } = o({ globalMap: i, inputs: s, outputs: f }), w = r.keyValsToBuffer(g), p = (P) => P.length === 0 ? [le.from([0])] : P.map(r.keyValsToBuffer), m = p(h), x = p(v), j = le.allocUnsafe(5);
    return j.writeUIntBE(482972169471, 0, 5), le.concat([j, w].concat(m, x));
  }
  st.psbtToBuffer = t;
  const n = (i, s) => i.key.compare(s.key);
  function a(i, s) {
    const f = /* @__PURE__ */ new Set(), g = Object.entries(i).reduce((v, [w, p]) => {
      if (w === "unknownKeyVals") return v;
      const m = s[w];
      if (m === void 0) return v;
      const x = (Array.isArray(p) ? p : [p]).map(m.encode);
      return x.map((P) => P.key.toString("hex")).forEach((P) => {
        if (f.has(P)) throw new Error("Serialize Error: Duplicate key: " + P);
        f.add(P);
      }), v.concat(x);
    }, []), h = i.unknownKeyVals ? i.unknownKeyVals.filter((v) => !f.has(v.key.toString("hex"))) : [];
    return g.concat(h).sort(n);
  }
  function o({ globalMap: i, inputs: s, outputs: f }) {
    return { globalKeyVals: a(i, e.globals), inputKeyVals: s.map((g) => a(g, e.inputs)), outputKeyVals: f.map((g) => a(g, e.outputs)) };
  }
  return st.psbtToKeyVals = o, st;
}
var hi;
function Na() {
  return hi || (hi = 1, (function(e) {
    function r(t) {
      for (var n in t) e.hasOwnProperty(n) || (e[n] = t[n]);
    }
    Object.defineProperty(e, "__esModule", { value: true }), r(ju()), r(Ru());
  })(un)), un;
}
var pi;
function Uu() {
  if (pi) return bt;
  pi = 1, Object.defineProperty(bt, "__esModule", { value: true });
  const e = Na();
  function r(o) {
    const i = o[0], s = e.psbtToKeyVals(i), f = o.slice(1);
    if (f.length === 0) throw new Error("Combine: Nothing to combine");
    const g = n(i);
    if (g === void 0) throw new Error("Combine: Self missing transaction");
    const h = a(s.globalKeyVals), v = s.inputKeyVals.map(a), w = s.outputKeyVals.map(a);
    for (const p of f) {
      const m = n(p);
      if (m === void 0 || !m.toBuffer().equals(g.toBuffer())) throw new Error("Combine: One of the Psbts does not have the same transaction.");
      const x = e.psbtToKeyVals(p);
      a(x.globalKeyVals).forEach(t(h, s.globalKeyVals, x.globalKeyVals)), x.inputKeyVals.map(a).forEach((_, M) => _.forEach(t(v[M], s.inputKeyVals[M], x.inputKeyVals[M]))), x.outputKeyVals.map(a).forEach((_, M) => _.forEach(t(w[M], s.outputKeyVals[M], x.outputKeyVals[M])));
    }
    return e.psbtFromKeyVals(g, { globalMapKeyVals: s.globalKeyVals, inputKeyVals: s.inputKeyVals, outputKeyVals: s.outputKeyVals });
  }
  bt.combine = r;
  function t(o, i, s) {
    return (f) => {
      if (o.has(f)) return;
      const g = s.filter((h) => h.key.toString("hex") === f)[0];
      i.push(g), o.add(f);
    };
  }
  function n(o) {
    return o.globalMap.unsignedTx;
  }
  function a(o) {
    const i = /* @__PURE__ */ new Set();
    return o.forEach((s) => {
      const f = s.key.toString("hex");
      if (i.has(f)) throw new Error("Combine: KeyValue Map keys should be unique");
      i.add(f);
    }), i;
  }
  return bt;
}
var fn = {}, mi;
function Nu() {
  return mi || (mi = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: true });
    const r = no();
    function t(p, m) {
      const x = p[m];
      if (x === void 0) throw new Error(`No input #${m}`);
      return x;
    }
    e.checkForInput = t;
    function n(p, m) {
      const x = p[m];
      if (x === void 0) throw new Error(`No output #${m}`);
      return x;
    }
    e.checkForOutput = n;
    function a(p, m, x) {
      if (p.key[0] < x) throw new Error("Use the method for your specific key instead of addUnknownKeyVal*");
      if (m && m.filter((j) => j.key.equals(p.key)).length !== 0) throw new Error(`Duplicate Key: ${p.key.toString("hex")}`);
    }
    e.checkHasKey = a;
    function o(p) {
      let m = 0;
      return Object.keys(p).forEach((x) => {
        Number(isNaN(Number(x))) && m++;
      }), m;
    }
    e.getEnumLength = o;
    function i(p, m) {
      let x = false;
      if (m.nonWitnessUtxo || m.witnessUtxo) {
        const j = !!m.redeemScript, P = !!m.witnessScript, S = !j || !!m.finalScriptSig, _ = !P || !!m.finalScriptWitness, M = !!m.finalScriptSig || !!m.finalScriptWitness;
        x = S && _ && M;
      }
      if (x === false) throw new Error(`Input #${p} has too much or too little data to clean`);
    }
    e.inputCheckUncleanFinalized = i;
    function s(p, m, x, j) {
      throw new Error(`Data for ${p} key ${m} is incorrect: Expected ${x} and got ${JSON.stringify(j)}`);
    }
    function f(p) {
      return (m, x) => {
        for (const j of Object.keys(m)) {
          const P = m[j], { canAdd: S, canAddToArray: _, check: M, expected: W } = r[p + "s"][j] || {}, U = !!_;
          if (M) if (U) {
            if (!Array.isArray(P) || x[j] && !Array.isArray(x[j])) throw new Error(`Key type ${j} must be an array`);
            P.every(M) || s(p, j, W, P);
            const R = x[j] || [], N = /* @__PURE__ */ new Set();
            if (!P.every((k) => _(R, k, N))) throw new Error("Can not add duplicate data to array");
            x[j] = R.concat(P);
          } else {
            if (M(P) || s(p, j, W, P), !S(x, P)) throw new Error(`Can not add duplicate data to ${p}`);
            x[j] = P;
          }
        }
      };
    }
    e.updateGlobal = f("global"), e.updateInput = f("input"), e.updateOutput = f("output");
    function g(p, m) {
      const x = p.length - 1, j = t(p, x);
      e.updateInput(m, j);
    }
    e.addInputAttributes = g;
    function h(p, m) {
      const x = p.length - 1, j = n(p, x);
      e.updateOutput(m, j);
    }
    e.addOutputAttributes = h;
    function v(p, m) {
      if (!le.isBuffer(m) || m.length < 4) throw new Error("Set Version: Invalid Transaction");
      return m.writeUInt32LE(p, 0), m;
    }
    e.defaultVersionSetter = v;
    function w(p, m) {
      if (!le.isBuffer(m) || m.length < 4) throw new Error("Set Locktime: Invalid Transaction");
      return m.writeUInt32LE(p, m.length - 4), m;
    }
    e.defaultLocktimeSetter = w;
  })(fn)), fn;
}
var gi;
function Vf() {
  if (gi) return gt;
  gi = 1, Object.defineProperty(gt, "__esModule", { value: true });
  const e = Uu(), r = Na(), t = Ke(), n = Nu();
  class a {
    constructor(i) {
      this.inputs = [], this.outputs = [], this.globalMap = { unsignedTx: i };
    }
    static fromBase64(i, s) {
      const f = le.from(i, "base64");
      return this.fromBuffer(f, s);
    }
    static fromHex(i, s) {
      const f = le.from(i, "hex");
      return this.fromBuffer(f, s);
    }
    static fromBuffer(i, s) {
      const f = r.psbtFromBuffer(i, s), g = new this(f.globalMap.unsignedTx);
      return Object.assign(g, f), g;
    }
    toBase64() {
      return this.toBuffer().toString("base64");
    }
    toHex() {
      return this.toBuffer().toString("hex");
    }
    toBuffer() {
      return r.psbtToBuffer(this);
    }
    updateGlobal(i) {
      return n.updateGlobal(i, this.globalMap), this;
    }
    updateInput(i, s) {
      const f = n.checkForInput(this.inputs, i);
      return n.updateInput(s, f), this;
    }
    updateOutput(i, s) {
      const f = n.checkForOutput(this.outputs, i);
      return n.updateOutput(s, f), this;
    }
    addUnknownKeyValToGlobal(i) {
      return n.checkHasKey(i, this.globalMap.unknownKeyVals, n.getEnumLength(t.GlobalTypes)), this.globalMap.unknownKeyVals || (this.globalMap.unknownKeyVals = []), this.globalMap.unknownKeyVals.push(i), this;
    }
    addUnknownKeyValToInput(i, s) {
      const f = n.checkForInput(this.inputs, i);
      return n.checkHasKey(s, f.unknownKeyVals, n.getEnumLength(t.InputTypes)), f.unknownKeyVals || (f.unknownKeyVals = []), f.unknownKeyVals.push(s), this;
    }
    addUnknownKeyValToOutput(i, s) {
      const f = n.checkForOutput(this.outputs, i);
      return n.checkHasKey(s, f.unknownKeyVals, n.getEnumLength(t.OutputTypes)), f.unknownKeyVals || (f.unknownKeyVals = []), f.unknownKeyVals.push(s), this;
    }
    addInput(i) {
      this.globalMap.unsignedTx.addInput(i), this.inputs.push({ unknownKeyVals: [] });
      const s = i.unknownKeyVals || [], f = this.inputs.length - 1;
      if (!Array.isArray(s)) throw new Error("unknownKeyVals must be an Array");
      return s.forEach((g) => this.addUnknownKeyValToInput(f, g)), n.addInputAttributes(this.inputs, i), this;
    }
    addOutput(i) {
      this.globalMap.unsignedTx.addOutput(i), this.outputs.push({ unknownKeyVals: [] });
      const s = i.unknownKeyVals || [], f = this.outputs.length - 1;
      if (!Array.isArray(s)) throw new Error("unknownKeyVals must be an Array");
      return s.forEach((g) => this.addUnknownKeyValToOutput(f, g)), n.addOutputAttributes(this.outputs, i), this;
    }
    clearFinalizedInput(i) {
      const s = n.checkForInput(this.inputs, i);
      n.inputCheckUncleanFinalized(i, s);
      for (const f of Object.keys(s)) ["witnessUtxo", "nonWitnessUtxo", "finalScriptSig", "finalScriptWitness", "unknownKeyVals"].includes(f) || delete s[f];
      return this;
    }
    combine(...i) {
      const s = e.combine([this].concat(i));
      return Object.assign(this, s), this;
    }
    getTransaction() {
      return this.globalMap.unsignedTx.toBuffer();
    }
  }
  return gt.Psbt = a, gt;
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Lu(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function bi(e) {
  if (!Number.isSafeInteger(e) || e < 0) throw new Error("positive integer expected, got " + e);
}
function qt(e, ...r) {
  if (!Lu(e)) throw new Error("Uint8Array expected");
  if (r.length > 0 && !r.includes(e.length)) throw new Error("Uint8Array expected of length " + r + ", got length=" + e.length);
}
function Ou(e) {
  if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
  bi(e.outputLen), bi(e.blockLen);
}
function Ut(e, r = true) {
  if (e.destroyed) throw new Error("Hash instance has been destroyed");
  if (r && e.finished) throw new Error("Hash#digest() has already been called");
}
function qu(e, r) {
  qt(e);
  const t = r.outputLen;
  if (e.length < t) throw new Error("digestInto() expects output buffer of length at least " + t);
}
function qr(...e) {
  for (let r = 0; r < e.length; r++) e[r].fill(0);
}
function dn(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function or(e, r) {
  return e << 32 - r | e >>> r;
}
function It(e, r) {
  return e << r | e >>> 32 - r >>> 0;
}
function Fu(e) {
  if (typeof e != "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function oo(e) {
  return typeof e == "string" && (e = Fu(e)), qt(e), e;
}
class La {
}
function io(e) {
  const r = (n) => e().update(oo(n)).digest(), t = e();
  return r.outputLen = t.outputLen, r.blockLen = t.blockLen, r.create = () => e(), r;
}
class Oa extends La {
  constructor(r, t) {
    super(), this.finished = false, this.destroyed = false, Ou(r);
    const n = oo(t);
    if (this.iHash = r.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const a = this.blockLen, o = new Uint8Array(a);
    o.set(n.length > a ? r.create().update(n).digest() : n);
    for (let i = 0; i < o.length; i++) o[i] ^= 54;
    this.iHash.update(o), this.oHash = r.create();
    for (let i = 0; i < o.length; i++) o[i] ^= 106;
    this.oHash.update(o), qr(o);
  }
  update(r) {
    return Ut(this), this.iHash.update(r), this;
  }
  digestInto(r) {
    Ut(this), qt(r, this.outputLen), this.finished = true, this.iHash.digestInto(r), this.oHash.update(r), this.oHash.digestInto(r), this.destroy();
  }
  digest() {
    const r = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(r), r;
  }
  _cloneInto(r) {
    r || (r = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: n, finished: a, destroyed: o, blockLen: i, outputLen: s } = this;
    return r = r, r.finished = a, r.destroyed = o, r.blockLen = i, r.outputLen = s, r.oHash = t._cloneInto(r.oHash), r.iHash = n._cloneInto(r.iHash), r;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
  }
}
const qa = (e, r, t) => new Oa(e, r).update(t).digest();
qa.create = (e, r) => new Oa(e, r);
function Pu(e, r, t, n) {
  if (typeof e.setBigUint64 == "function") return e.setBigUint64(r, t, n);
  const a = BigInt(32), o = BigInt(4294967295), i = Number(t >> a & o), s = Number(t & o), f = n ? 4 : 0, g = n ? 0 : 4;
  e.setUint32(r + f, i, n), e.setUint32(r + g, s, n);
}
function Mu(e, r, t) {
  return e & r ^ ~e & t;
}
function Hu(e, r, t) {
  return e & r ^ e & t ^ r & t;
}
class ao extends La {
  constructor(r, t, n, a) {
    super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = r, this.outputLen = t, this.padOffset = n, this.isLE = a, this.buffer = new Uint8Array(r), this.view = dn(this.buffer);
  }
  update(r) {
    Ut(this), r = oo(r), qt(r);
    const { view: t, buffer: n, blockLen: a } = this, o = r.length;
    for (let i = 0; i < o; ) {
      const s = Math.min(a - this.pos, o - i);
      if (s === a) {
        const f = dn(r);
        for (; a <= o - i; i += a) this.process(f, i);
        continue;
      }
      n.set(r.subarray(i, i + s), this.pos), this.pos += s, i += s, this.pos === a && (this.process(t, 0), this.pos = 0);
    }
    return this.length += r.length, this.roundClean(), this;
  }
  digestInto(r) {
    Ut(this), qu(r, this), this.finished = true;
    const { buffer: t, view: n, blockLen: a, isLE: o } = this;
    let { pos: i } = this;
    t[i++] = 128, qr(this.buffer.subarray(i)), this.padOffset > a - i && (this.process(n, 0), i = 0);
    for (let v = i; v < a; v++) t[v] = 0;
    Pu(n, a - 8, BigInt(this.length * 8), o), this.process(n, 0);
    const s = dn(r), f = this.outputLen;
    if (f % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const g = f / 4, h = this.get();
    if (g > h.length) throw new Error("_sha2: outputLen bigger than state");
    for (let v = 0; v < g; v++) s.setUint32(4 * v, h[v], o);
  }
  digest() {
    const { buffer: r, outputLen: t } = this;
    this.digestInto(r);
    const n = r.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(r) {
    r || (r = new this.constructor()), r.set(...this.get());
    const { blockLen: t, buffer: n, length: a, finished: o, destroyed: i, pos: s } = this;
    return r.destroyed = i, r.finished = o, r.length = a, r.pos = s, a % t && r.buffer.set(n), r;
  }
  clone() {
    return this._cloneInto();
  }
}
const Cr = Uint32Array.from([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]), We = Uint32Array.from([1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209]), Du = Uint8Array.from([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fa = Uint8Array.from(new Array(16).fill(0).map((e, r) => r)), Ku = Fa.map((e) => (9 * e + 5) % 16), Pa = (() => {
  const t = [[Fa], [Ku]];
  for (let n = 0; n < 4; n++) for (let a of t) a.push(a[n].map((o) => Du[o]));
  return t;
})(), Ma = Pa[0], Ha = Pa[1], Da = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map((e) => Uint8Array.from(e)), Vu = Ma.map((e, r) => e.map((t) => Da[r][t])), Gu = Ha.map((e, r) => e.map((t) => Da[r][t])), Wu = Uint32Array.from([0, 1518500249, 1859775393, 2400959708, 2840853838]), Yu = Uint32Array.from([1352829926, 1548603684, 1836072691, 2053994217, 0]);
function yi(e, r, t, n) {
  return e === 0 ? r ^ t ^ n : e === 1 ? r & t | ~r & n : e === 2 ? (r | ~t) ^ n : e === 3 ? r & n | t & ~n : r ^ (t | ~n);
}
const _t = new Uint32Array(16);
class Xu extends ao {
  constructor() {
    super(64, 20, 8, true), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: r, h1: t, h2: n, h3: a, h4: o } = this;
    return [r, t, n, a, o];
  }
  set(r, t, n, a, o) {
    this.h0 = r | 0, this.h1 = t | 0, this.h2 = n | 0, this.h3 = a | 0, this.h4 = o | 0;
  }
  process(r, t) {
    for (let p = 0; p < 16; p++, t += 4) _t[p] = r.getUint32(t, true);
    let n = this.h0 | 0, a = n, o = this.h1 | 0, i = o, s = this.h2 | 0, f = s, g = this.h3 | 0, h = g, v = this.h4 | 0, w = v;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, x = Wu[p], j = Yu[p], P = Ma[p], S = Ha[p], _ = Vu[p], M = Gu[p];
      for (let W = 0; W < 16; W++) {
        const U = It(n + yi(p, o, s, g) + _t[P[W]] + x, _[W]) + v | 0;
        n = v, v = g, g = It(s, 10) | 0, s = o, o = U;
      }
      for (let W = 0; W < 16; W++) {
        const U = It(a + yi(m, i, f, h) + _t[S[W]] + j, M[W]) + w | 0;
        a = w, w = h, h = It(f, 10) | 0, f = i, i = U;
      }
    }
    this.set(this.h1 + s + h | 0, this.h2 + g + w | 0, this.h3 + v + a | 0, this.h4 + n + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    qr(_t);
  }
  destroy() {
    this.destroyed = true, qr(this.buffer), this.set(0, 0, 0, 0, 0);
  }
}
const Ju = io(() => new Xu()), Zu = Ju, At = BigInt(2 ** 32 - 1), vi = BigInt(32);
function Qu(e, r = false) {
  return r ? { h: Number(e & At), l: Number(e >> vi & At) } : { h: Number(e >> vi & At) | 0, l: Number(e & At) | 0 };
}
function $u(e, r = false) {
  const t = e.length;
  let n = new Uint32Array(t), a = new Uint32Array(t);
  for (let o = 0; o < t; o++) {
    const { h: i, l: s } = Qu(e[o], r);
    [n[o], a[o]] = [i, s];
  }
  return [n, a];
}
const wi = (e, r, t) => e >>> t, xi = (e, r, t) => e << 32 - t | r >>> t, Zr = (e, r, t) => e >>> t | r << 32 - t, Qr = (e, r, t) => e << 32 - t | r >>> t, St = (e, r, t) => e << 64 - t | r >>> t - 32, Tt = (e, r, t) => e >>> t - 32 | r << 64 - t;
function fr(e, r, t, n) {
  const a = (r >>> 0) + (n >>> 0);
  return { h: e + t + (a / 2 ** 32 | 0) | 0, l: a | 0 };
}
const el = (e, r, t) => (e >>> 0) + (r >>> 0) + (t >>> 0), rl = (e, r, t, n) => r + t + n + (e / 2 ** 32 | 0) | 0, tl = (e, r, t, n) => (e >>> 0) + (r >>> 0) + (t >>> 0) + (n >>> 0), nl = (e, r, t, n, a) => r + t + n + a + (e / 2 ** 32 | 0) | 0, ol = (e, r, t, n, a) => (e >>> 0) + (r >>> 0) + (t >>> 0) + (n >>> 0) + (a >>> 0), il = (e, r, t, n, a, o) => r + t + n + a + o + (e / 2 ** 32 | 0) | 0, al = Uint32Array.from([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), jr = new Uint32Array(64);
class sl extends ao {
  constructor(r = 32) {
    super(64, r, 8, false), this.A = Cr[0] | 0, this.B = Cr[1] | 0, this.C = Cr[2] | 0, this.D = Cr[3] | 0, this.E = Cr[4] | 0, this.F = Cr[5] | 0, this.G = Cr[6] | 0, this.H = Cr[7] | 0;
  }
  get() {
    const { A: r, B: t, C: n, D: a, E: o, F: i, G: s, H: f } = this;
    return [r, t, n, a, o, i, s, f];
  }
  set(r, t, n, a, o, i, s, f) {
    this.A = r | 0, this.B = t | 0, this.C = n | 0, this.D = a | 0, this.E = o | 0, this.F = i | 0, this.G = s | 0, this.H = f | 0;
  }
  process(r, t) {
    for (let v = 0; v < 16; v++, t += 4) jr[v] = r.getUint32(t, false);
    for (let v = 16; v < 64; v++) {
      const w = jr[v - 15], p = jr[v - 2], m = or(w, 7) ^ or(w, 18) ^ w >>> 3, x = or(p, 17) ^ or(p, 19) ^ p >>> 10;
      jr[v] = x + jr[v - 7] + m + jr[v - 16] | 0;
    }
    let { A: n, B: a, C: o, D: i, E: s, F: f, G: g, H: h } = this;
    for (let v = 0; v < 64; v++) {
      const w = or(s, 6) ^ or(s, 11) ^ or(s, 25), p = h + w + Mu(s, f, g) + al[v] + jr[v] | 0, x = (or(n, 2) ^ or(n, 13) ^ or(n, 22)) + Hu(n, a, o) | 0;
      h = g, g = f, f = s, s = i + p | 0, i = o, o = a, a = n, n = p + x | 0;
    }
    n = n + this.A | 0, a = a + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, s = s + this.E | 0, f = f + this.F | 0, g = g + this.G | 0, h = h + this.H | 0, this.set(n, a, o, i, s, f, g, h);
  }
  roundClean() {
    qr(jr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), qr(this.buffer);
  }
}
const Ka = $u(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((e) => BigInt(e))), cl = Ka[0], ul = Ka[1], Rr = new Uint32Array(80), Ur = new Uint32Array(80);
class ll extends ao {
  constructor(r = 64) {
    super(128, r, 16, false), this.Ah = We[0] | 0, this.Al = We[1] | 0, this.Bh = We[2] | 0, this.Bl = We[3] | 0, this.Ch = We[4] | 0, this.Cl = We[5] | 0, this.Dh = We[6] | 0, this.Dl = We[7] | 0, this.Eh = We[8] | 0, this.El = We[9] | 0, this.Fh = We[10] | 0, this.Fl = We[11] | 0, this.Gh = We[12] | 0, this.Gl = We[13] | 0, this.Hh = We[14] | 0, this.Hl = We[15] | 0;
  }
  get() {
    const { Ah: r, Al: t, Bh: n, Bl: a, Ch: o, Cl: i, Dh: s, Dl: f, Eh: g, El: h, Fh: v, Fl: w, Gh: p, Gl: m, Hh: x, Hl: j } = this;
    return [r, t, n, a, o, i, s, f, g, h, v, w, p, m, x, j];
  }
  set(r, t, n, a, o, i, s, f, g, h, v, w, p, m, x, j) {
    this.Ah = r | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = a | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = s | 0, this.Dl = f | 0, this.Eh = g | 0, this.El = h | 0, this.Fh = v | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = x | 0, this.Hl = j | 0;
  }
  process(r, t) {
    for (let _ = 0; _ < 16; _++, t += 4) Rr[_] = r.getUint32(t), Ur[_] = r.getUint32(t += 4);
    for (let _ = 16; _ < 80; _++) {
      const M = Rr[_ - 15] | 0, W = Ur[_ - 15] | 0, U = Zr(M, W, 1) ^ Zr(M, W, 8) ^ wi(M, W, 7), R = Qr(M, W, 1) ^ Qr(M, W, 8) ^ xi(M, W, 7), N = Rr[_ - 2] | 0, k = Ur[_ - 2] | 0, C = Zr(N, k, 19) ^ St(N, k, 61) ^ wi(N, k, 6), q = Qr(N, k, 19) ^ Tt(N, k, 61) ^ xi(N, k, 6), B = tl(R, q, Ur[_ - 7], Ur[_ - 16]), F = nl(B, U, C, Rr[_ - 7], Rr[_ - 16]);
      Rr[_] = F | 0, Ur[_] = B | 0;
    }
    let { Ah: n, Al: a, Bh: o, Bl: i, Ch: s, Cl: f, Dh: g, Dl: h, Eh: v, El: w, Fh: p, Fl: m, Gh: x, Gl: j, Hh: P, Hl: S } = this;
    for (let _ = 0; _ < 80; _++) {
      const M = Zr(v, w, 14) ^ Zr(v, w, 18) ^ St(v, w, 41), W = Qr(v, w, 14) ^ Qr(v, w, 18) ^ Tt(v, w, 41), U = v & p ^ ~v & x, R = w & m ^ ~w & j, N = ol(S, W, R, ul[_], Ur[_]), k = il(N, P, M, U, cl[_], Rr[_]), C = N | 0, q = Zr(n, a, 28) ^ St(n, a, 34) ^ St(n, a, 39), B = Qr(n, a, 28) ^ Tt(n, a, 34) ^ Tt(n, a, 39), F = n & o ^ n & s ^ o & s, G = a & i ^ a & f ^ i & f;
      P = x | 0, S = j | 0, x = p | 0, j = m | 0, p = v | 0, m = w | 0, { h: v, l: w } = fr(g | 0, h | 0, k | 0, C | 0), g = s | 0, h = f | 0, s = o | 0, f = i | 0, o = n | 0, i = a | 0;
      const A = el(C, B, G);
      n = rl(A, k, q, F), a = A | 0;
    }
    ({ h: n, l: a } = fr(this.Ah | 0, this.Al | 0, n | 0, a | 0)), { h: o, l: i } = fr(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: s, l: f } = fr(this.Ch | 0, this.Cl | 0, s | 0, f | 0), { h: g, l: h } = fr(this.Dh | 0, this.Dl | 0, g | 0, h | 0), { h: v, l: w } = fr(this.Eh | 0, this.El | 0, v | 0, w | 0), { h: p, l: m } = fr(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: x, l: j } = fr(this.Gh | 0, this.Gl | 0, x | 0, j | 0), { h: P, l: S } = fr(this.Hh | 0, this.Hl | 0, P | 0, S | 0), this.set(n, a, o, i, s, f, g, h, v, w, p, m, x, j, P, S);
  }
  roundClean() {
    qr(Rr, Ur);
  }
  destroy() {
    qr(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const fl = io(() => new sl()), dl = io(() => new ll()), Nt = fl, hl = dl;
function pl(e) {
  return Zu(Nt(e));
}
function ki(e, r) {
  return qa(hl, e, r);
}
const Va = "0123456789abcdefABCDEF";
Va.split("").map((e) => e.codePointAt(0));
const Ei = Array(256).fill(true).map((e, r) => {
  const t = String.fromCodePoint(r), n = Va.indexOf(t);
  return n < 0 ? void 0 : n < 16 ? n : n - 6;
}), Ga = new TextEncoder();
new TextDecoder();
function ml(e) {
  return Ga.encode(e);
}
function gl(e) {
  const r = e.reduce((a, o) => a + o.length, 0), t = new Uint8Array(r);
  let n = 0;
  for (const a of e) t.set(a, n), n += a.length;
  return t;
}
function bl(e) {
  const r = Ga.encode(e || ""), t = new Uint8Array(Math.floor(r.length / 2));
  let n;
  for (n = 0; n < t.length; n++) {
    const a = Ei[r[n * 2]], o = Ei[r[n * 2 + 1]];
    if (a === void 0 || o === void 0) break;
    t[n] = a << 4 | o;
  }
  return n === t.length ? t : t.slice(0, n);
}
function dr(e, r) {
  const t = Math.min(e.length, r.length);
  for (let n = 0; n < t; ++n) if (e[n] !== r[n]) return e[n] < r[n] ? -1 : 1;
  return e.length === r.length ? 0 : e.length > r.length ? 1 : -1;
}
function Bi(e, r, t) {
  if (r + 1 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
  if (t > 255) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= 255. Received ${t}`);
  e[r] = t;
}
function $r(e, r, t, n) {
  if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
  if (n = n.toUpperCase(), t > 4294967295) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${4294967295}. Received ${t}`);
  n === "LE" ? (e[r] = t & 255, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255) : (e[r] = t >> 24 & 255, e[r + 1] = t >> 16 & 255, e[r + 2] = t >> 8 & 255, e[r + 3] = t & 255);
}
function ct(e, r, t) {
  if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
  if (t = t.toUpperCase(), t === "LE") {
    let n = 0;
    return n = (n << 8) + e[r + 3] >>> 0, n = (n << 8) + e[r + 2] >>> 0, n = (n << 8) + e[r + 1] >>> 0, n = (n << 8) + e[r] >>> 0, n;
  } else {
    let n = 0;
    return n = (n << 8) + e[r] >>> 0, n = (n << 8) + e[r + 1] >>> 0, n = (n << 8) + e[r + 2] >>> 0, n = (n << 8) + e[r + 3] >>> 0, n;
  }
}
const Te = (e) => bl(e);
function yl(e) {
  if (Me(e.isPoint(Te("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"))), Me(!e.isPoint(Te("030000000000000000000000000000000000000000000000000000000000000005"))), Me(e.isPrivate(Te("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"))), Me(e.isPrivate(Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140"))), Me(!e.isPrivate(Te("0000000000000000000000000000000000000000000000000000000000000000"))), Me(!e.isPrivate(Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"))), Me(!e.isPrivate(Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364142"))), Me(dr(e.pointFromScalar(Te("b1121e4088a66a28f5b6b0f5844943ecd9f610196d7bb83b25214b60452c09af")), Te("02b07ba9dca9523b7ef4bd97703d43d20399eb698e194704791a25ce77a400df99")) === 0), e.xOnlyPointAddTweak) {
    Me(e.xOnlyPointAddTweak(Te("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === null);
    let r = e.xOnlyPointAddTweak(Te("1617d38ed8d8657da4d4761e8057bc396ea9e4b9d29776d4be096016dbd2509b"), Te("a8397a935f0dfceba6ba9618f6451ef4d80637abf4e6af2669fbc9de6a8fd2ac"));
    Me(dr(r.xOnlyPubkey, Te("e478f99dab91052ab39a33ea35fd5e6e4933f4d28023cd597c9a1f6760346adf")) === 0 && r.parity === 1), r = e.xOnlyPointAddTweak(Te("2c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991"), Te("823c3cd2142744b075a87eade7e1b8678ba308d566226a0056ca2b7a76f86b47"));
  }
  Me(dr(e.pointAddScalar(Te("0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), Te("0000000000000000000000000000000000000000000000000000000000000003")), Te("02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5")) === 0), Me(dr(e.privateAdd(Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036413e"), Te("0000000000000000000000000000000000000000000000000000000000000002")), Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === 0), e.privateNegate && (Me(dr(e.privateNegate(Te("0000000000000000000000000000000000000000000000000000000000000001")), Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === 0), Me(dr(e.privateNegate(Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036413e")), Te("0000000000000000000000000000000000000000000000000000000000000003")) === 0), Me(dr(e.privateNegate(Te("b1121e4088a66a28f5b6b0f5844943ecd9f610196d7bb83b25214b60452c09af")), Te("4eede1bf775995d70a494f0a7bb6bc11e0b8cccd41cce8009ab1132c8b0a3792")) === 0)), Me(dr(e.sign(Te("5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed"), Te("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")), Te("54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5")) === 0), Me(e.verify(Te("5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed"), Te("0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), Te("54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5"))), e.signSchnorr && Me(dr(e.signSchnorr(Te("7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c"), Te("c90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b14e5c9"), Te("c87aa53824b4d7ae2eb035a2b5bbbccc080e76cdc6d1692c4b0b62d798e6d906")), Te("5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7")) === 0), e.verifySchnorr && Me(e.verifySchnorr(Te("7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c"), Te("dd308afec5777e13121fa72b9cc1b7cc0139715309b086c960e18fd969774eb8"), Te("5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7")));
}
function Me(e) {
  if (!e) throw new Error("ecc library invalid");
}
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Vn(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Wa(e, r) {
  return Array.isArray(r) ? r.length === 0 ? true : e ? r.every((t) => typeof t == "string") : r.every((t) => Number.isSafeInteger(t)) : false;
}
function vl(e) {
  if (typeof e != "function") throw new Error("function expected");
  return true;
}
function Gn(e, r) {
  if (typeof r != "string") throw new Error(`${e}: string expected`);
  return true;
}
function so(e) {
  if (!Number.isSafeInteger(e)) throw new Error(`invalid integer: ${e}`);
}
function Wn(e) {
  if (!Array.isArray(e)) throw new Error("array expected");
}
function Ya(e, r) {
  if (!Wa(true, r)) throw new Error(`${e}: array of strings expected`);
}
function wl(e, r) {
  if (!Wa(false, r)) throw new Error(`${e}: array of numbers expected`);
}
function Xa(...e) {
  const r = (o) => o, t = (o, i) => (s) => o(i(s)), n = e.map((o) => o.encode).reduceRight(t, r), a = e.map((o) => o.decode).reduce(t, r);
  return { encode: n, decode: a };
}
function xl(e) {
  const r = typeof e == "string" ? e.split("") : e, t = r.length;
  Ya("alphabet", r);
  const n = new Map(r.map((a, o) => [a, o]));
  return { encode: (a) => (Wn(a), a.map((o) => {
    if (!Number.isSafeInteger(o) || o < 0 || o >= t) throw new Error(`alphabet.encode: digit index outside alphabet "${o}". Allowed: ${e}`);
    return r[o];
  })), decode: (a) => (Wn(a), a.map((o) => {
    Gn("alphabet.decode", o);
    const i = n.get(o);
    if (i === void 0) throw new Error(`Unknown letter: "${o}". Allowed: ${e}`);
    return i;
  })) };
}
function kl(e = "") {
  return Gn("join", e), { encode: (r) => (Ya("join.decode", r), r.join(e)), decode: (r) => (Gn("join.decode", r), r.split(e)) };
}
function Ii(e, r, t) {
  if (r < 2) throw new Error(`convertRadix: invalid from=${r}, base cannot be less than 2`);
  if (t < 2) throw new Error(`convertRadix: invalid to=${t}, base cannot be less than 2`);
  if (Wn(e), !e.length) return [];
  let n = 0;
  const a = [], o = Array.from(e, (s) => {
    if (so(s), s < 0 || s >= r) throw new Error(`invalid integer: ${s}`);
    return s;
  }), i = o.length;
  for (; ; ) {
    let s = 0, f = true;
    for (let g = n; g < i; g++) {
      const h = o[g], v = r * s, w = v + h;
      if (!Number.isSafeInteger(w) || v / r !== s || w - h !== v) throw new Error("convertRadix: carry overflow");
      const p = w / t;
      s = w % t;
      const m = Math.floor(p);
      if (o[g] = m, !Number.isSafeInteger(m) || m * t + s !== w) throw new Error("convertRadix: carry overflow");
      if (f) m ? f = false : n = g;
      else continue;
    }
    if (a.push(s), f) break;
  }
  for (let s = 0; s < e.length - 1 && e[s] === 0; s++) a.push(0);
  return a.reverse();
}
function El(e) {
  so(e);
  const r = 2 ** 8;
  return { encode: (t) => {
    if (!Vn(t)) throw new Error("radix.encode input should be Uint8Array");
    return Ii(Array.from(t), r, e);
  }, decode: (t) => (wl("radix.decode", t), Uint8Array.from(Ii(t, e, r))) };
}
function Bl(e, r) {
  return so(e), vl(r), { encode(t) {
    if (!Vn(t)) throw new Error("checksum.encode: input should be Uint8Array");
    const n = r(t).slice(0, e), a = new Uint8Array(t.length + e);
    return a.set(t), a.set(n, t.length), a;
  }, decode(t) {
    if (!Vn(t)) throw new Error("checksum.decode: input should be Uint8Array");
    const n = t.slice(0, -e), a = t.slice(-e), o = r(n).slice(0, e);
    for (let i = 0; i < e; i++) if (o[i] !== a[i]) throw new Error("Invalid checksum");
    return n;
  } };
}
const Il = (e) => Xa(El(58), xl(e), kl("")), _l = Il("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), Al = (e) => Xa(Bl(4, (r) => e(e(r))), _l), Sl = Al;
var hn;
function Tl(e) {
  return { lang: (e == null ? void 0 : e.lang) ?? (hn == null ? void 0 : hn.lang), message: e == null ? void 0 : e.message, abortEarly: (e == null ? void 0 : e.abortEarly) ?? (hn == null ? void 0 : hn.abortEarly), abortPipeEarly: (e == null ? void 0 : e.abortPipeEarly) ?? (hn == null ? void 0 : hn.abortPipeEarly) };
}
var zl;
function Cl(e) {
  return zl == null ? void 0 : zl.get(e);
}
var jl;
function Rl(e) {
  return jl == null ? void 0 : jl.get(e);
}
var Ul;
function Nl(e, r) {
  var _a2;
  return (_a2 = Ul == null ? void 0 : Ul.get(e)) == null ? void 0 : _a2.get(r);
}
function ht(e) {
  var _a2, _b;
  const r = typeof e;
  return r === "string" ? `"${e}"` : r === "number" || r === "bigint" || r === "boolean" ? `${e}` : r === "object" || r === "function" ? (e && ((_b = (_a2 = Object.getPrototypeOf(e)) == null ? void 0 : _a2.constructor) == null ? void 0 : _b.name)) ?? "null" : r;
}
function mr(e, r, t, n, a) {
  const o = a && "input" in a ? a.input : t.value, i = (a == null ? void 0 : a.expected) ?? e.expects ?? null, s = (a == null ? void 0 : a.received) ?? ht(o), f = { kind: e.kind, type: e.type, input: o, expected: i, received: s, message: `Invalid ${r}: ${i ? `Expected ${i} but r` : "R"}eceived ${s}`, requirement: e.requirement, path: a == null ? void 0 : a.path, issues: a == null ? void 0 : a.issues, lang: n.lang, abortEarly: n.abortEarly, abortPipeEarly: n.abortPipeEarly }, g = e.kind === "schema", h = (a == null ? void 0 : a.message) ?? e.message ?? Nl(e.reference, f.lang) ?? (g ? Rl(f.lang) : null) ?? n.message ?? Cl(f.lang);
  h && (f.message = typeof h == "function" ? h(f) : h), g && (t.typed = false), t.issues ? t.issues.push(f) : t.issues = [f];
}
var Ll = class extends Error {
  constructor(e) {
    super(e[0].message);
    __publicField(this, "issues");
    this.name = "ValiError", this.issues = e;
  }
};
function Ft(e) {
  return { kind: "validation", type: "integer", reference: Ft, async: false, expects: null, requirement: Number.isInteger, message: e, _run(r, t) {
    return r.typed && !this.requirement(r.value) && mr(this, "integer", r, t), r;
  } };
}
function co(e, r) {
  return { kind: "validation", type: "length", reference: co, async: false, expects: `${e}`, requirement: e, message: r, _run(t, n) {
    return t.typed && t.value.length !== this.requirement && mr(this, "length", t, n, { received: `${t.value.length}` }), t;
  } };
}
function Pt(e, r) {
  return { kind: "validation", type: "max_value", reference: Pt, async: false, expects: `<=${e instanceof Date ? e.toJSON() : ht(e)}`, requirement: e, message: r, _run(t, n) {
    return t.typed && t.value > this.requirement && mr(this, "value", t, n, { received: t.value instanceof Date ? t.value.toJSON() : ht(t.value) }), t;
  } };
}
function Mt(e, r) {
  return { kind: "validation", type: "min_value", reference: Mt, async: false, expects: `>=${e instanceof Date ? e.toJSON() : ht(e)}`, requirement: e, message: r, _run(t, n) {
    return t.typed && t.value < this.requirement && mr(this, "value", t, n, { received: t.value instanceof Date ? t.value.toJSON() : ht(t.value) }), t;
  } };
}
function Ja(e, r) {
  return { kind: "validation", type: "regex", reference: Ja, async: false, expects: `${e}`, requirement: e, message: r, _run(t, n) {
    return t.typed && !this.requirement.test(t.value) && mr(this, "format", t, n), t;
  } };
}
function Ht(e, r) {
  return { kind: "schema", type: "instance", reference: Ht, expects: e.name, async: false, class: e, message: r, _run(t, n) {
    return t.value instanceof this.class ? t.typed = true : mr(this, "type", t, n), t;
  } };
}
function Dt(e) {
  return { kind: "schema", type: "number", reference: Dt, expects: "number", async: false, message: e, _run(r, t) {
    return typeof r.value == "number" && !isNaN(r.value) ? r.typed = true : mr(this, "type", r, t), r;
  } };
}
function Yn(e, r) {
  return { kind: "schema", type: "object", reference: Yn, expects: "Object", async: false, entries: e, message: r, _run(t, n) {
    var _a2;
    const a = t.value;
    if (a && typeof a == "object") {
      t.typed = true, t.value = {};
      for (const o in this.entries) {
        const i = a[o], s = this.entries[o]._run({ typed: false, value: i }, n);
        if (s.issues) {
          const f = { type: "object", origin: "value", input: a, key: o, value: i };
          for (const g of s.issues) g.path ? g.path.unshift(f) : g.path = [f], (_a2 = t.issues) == null ? void 0 : _a2.push(g);
          if (t.issues || (t.issues = s.issues), n.abortEarly) {
            t.typed = false;
            break;
          }
        }
        s.typed || (t.typed = false), (s.value !== void 0 || o in a) && (t.value[o] = s.value);
      }
    } else mr(this, "type", t, n);
    return t;
  } };
}
function Za(e) {
  return { kind: "schema", type: "string", reference: Za, expects: "string", async: false, message: e, _run(r, t) {
    return typeof r.value == "string" ? r.typed = true : mr(this, "type", r, t), r;
  } };
}
function hr(e, r, t) {
  const n = e._run({ typed: false, value: r }, Tl(t));
  if (n.issues) throw new Ll(n.issues);
  return n.value;
}
function ot(...e) {
  return { ...e[0], pipe: e, _run(r, t) {
    for (const n of e) if (n.kind !== "metadata") {
      if (r.issues && (n.kind === "schema" || n.kind === "transformation")) {
        r.typed = false;
        break;
      }
      (!r.issues || !t.abortEarly && !t.abortPipeEarly) && (r = n._run(r, t));
    }
    return r;
  } };
}
const Xn = ot(Dt(), Ft(), Mt(0), Pt(4294967295)), Ol = ot(Dt(), Ft(), Mt(0), Pt(2147483647)), ql = ot(Dt(), Ft(), Mt(0), Pt(255)), pn = ot(Ht(Uint8Array), co(32)), Fl = ot(Ht(Uint8Array), co(33)), Pl = Yn({ wif: ql, bip32: Yn({ public: Xn, private: Xn }) }), Ml = ot(Za(), Ja(/^(m\/)?(\d+'?\/)*\d+'?$/));
function Hl(e) {
  if (e.length >= 255) throw new TypeError("Alphabet too long");
  const r = new Uint8Array(256);
  for (let g = 0; g < r.length; g++) r[g] = 255;
  for (let g = 0; g < e.length; g++) {
    const h = e.charAt(g), v = h.charCodeAt(0);
    if (r[v] !== 255) throw new TypeError(h + " is ambiguous");
    r[v] = g;
  }
  const t = e.length, n = e.charAt(0), a = Math.log(t) / Math.log(256), o = Math.log(256) / Math.log(t);
  function i(g) {
    if (g instanceof Uint8Array || (ArrayBuffer.isView(g) ? g = new Uint8Array(g.buffer, g.byteOffset, g.byteLength) : Array.isArray(g) && (g = Uint8Array.from(g))), !(g instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (g.length === 0) return "";
    let h = 0, v = 0, w = 0;
    const p = g.length;
    for (; w !== p && g[w] === 0; ) w++, h++;
    const m = (p - w) * o + 1 >>> 0, x = new Uint8Array(m);
    for (; w !== p; ) {
      let S = g[w], _ = 0;
      for (let M = m - 1; (S !== 0 || _ < v) && M !== -1; M--, _++) S += 256 * x[M] >>> 0, x[M] = S % t >>> 0, S = S / t >>> 0;
      if (S !== 0) throw new Error("Non-zero carry");
      v = _, w++;
    }
    let j = m - v;
    for (; j !== m && x[j] === 0; ) j++;
    let P = n.repeat(h);
    for (; j < m; ++j) P += e.charAt(x[j]);
    return P;
  }
  function s(g) {
    if (typeof g != "string") throw new TypeError("Expected String");
    if (g.length === 0) return new Uint8Array();
    let h = 0, v = 0, w = 0;
    for (; g[h] === n; ) v++, h++;
    const p = (g.length - h) * a + 1 >>> 0, m = new Uint8Array(p);
    for (; h < g.length; ) {
      const S = g.charCodeAt(h);
      if (S > 255) return;
      let _ = r[S];
      if (_ === 255) return;
      let M = 0;
      for (let W = p - 1; (_ !== 0 || M < w) && W !== -1; W--, M++) _ += t * m[W] >>> 0, m[W] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0) throw new Error("Non-zero carry");
      w = M, h++;
    }
    let x = p - w;
    for (; x !== p && m[x] === 0; ) x++;
    const j = new Uint8Array(v + (p - x));
    let P = v;
    for (; x !== p; ) j[P++] = m[x++];
    return j;
  }
  function f(g) {
    const h = s(g);
    if (h) return h;
    throw new Error("Non-base" + t + " character");
  }
  return { encode: i, decodeUnsafe: s, decode: f };
}
var Dl = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const mn = Hl(Dl);
function Kl(e) {
  function r(o) {
    var i = Uint8Array.from(o), s = e(i), f = i.length + 4, g = new Uint8Array(f);
    return g.set(i, 0), g.set(s.subarray(0, 4), i.length), mn.encode(g);
  }
  function t(o) {
    var i = o.slice(0, -4), s = o.slice(-4), f = e(i);
    if (!(s[0] ^ f[0] | s[1] ^ f[1] | s[2] ^ f[2] | s[3] ^ f[3])) return i;
  }
  function n(o) {
    var i = mn.decodeUnsafe(o);
    if (i != null) return t(i);
  }
  function a(o) {
    var i = mn.decode(o), s = t(i);
    if (s == null) throw new Error("Invalid checksum");
    return s;
  }
  return { encode: r, decode: a, decodeUnsafe: n };
}
function Vl(e) {
  return Nt(Nt(e));
}
const Gl = Kl(Vl);
function Wl(e, r, t) {
  if (r.length !== 32) throw new TypeError("Invalid privateKey length");
  var n = new Uint8Array(34), a = new DataView(n.buffer);
  return a.setUint8(0, e), n.set(r, 1), n[33] = 1, n;
}
function Yl(e) {
  return Gl.encode(Wl(e.version, e.privateKey));
}
const _i = Sl(Nt), Ai = { encode: (e) => _i.encode(e), decode: (e) => _i.decode(e) };
function Gf(e) {
  yl(e);
  const r = { messagePrefix: `Bitcoin Signed Message:
`, bech32: "bc", bip32: { public: 76067358, private: 76066276 }, pubKeyHash: 0, scriptHash: 5, wif: 128 }, t = 2147483648;
  function n(w) {
    return w.length === 32 ? w : w.slice(1, 33);
  }
  class a {
    constructor(p, m) {
      __publicField(this, "__D");
      __publicField(this, "__Q");
      __publicField(this, "lowR", false);
      this.__D = p, this.__Q = m;
    }
    get publicKey() {
      return this.__Q === void 0 && (this.__Q = e.pointFromScalar(this.__D, true)), this.__Q;
    }
    get privateKey() {
      return this.__D;
    }
    sign(p, m) {
      if (!this.privateKey) throw new Error("Missing private key");
      if (m === void 0 && (m = this.lowR), m === false) return e.sign(p, this.privateKey);
      {
        let x = e.sign(p, this.privateKey);
        const j = new Uint8Array(32);
        let P = 0;
        for (; x[0] > 127; ) P++, $r(j, 0, P, "LE"), x = e.sign(p, this.privateKey, j);
        return x;
      }
    }
    signSchnorr(p) {
      if (!this.privateKey) throw new Error("Missing private key");
      if (!e.signSchnorr) throw new Error("signSchnorr not supported by ecc library");
      return e.signSchnorr(p, this.privateKey);
    }
    verify(p, m) {
      return e.verify(p, this.publicKey, m);
    }
    verifySchnorr(p, m) {
      if (!e.verifySchnorr) throw new Error("verifySchnorr not supported by ecc library");
      return e.verifySchnorr(p, this.publicKey.subarray(1, 33), m);
    }
  }
  class o extends a {
    constructor(p, m, x, j, P = 0, S = 0, _ = 0) {
      super(p, m);
      __publicField(this, "chainCode");
      __publicField(this, "network");
      __publicField(this, "__DEPTH");
      __publicField(this, "__INDEX");
      __publicField(this, "__PARENT_FINGERPRINT");
      this.chainCode = x, this.network = j, this.__DEPTH = P, this.__INDEX = S, this.__PARENT_FINGERPRINT = _, hr(Pl, j);
    }
    get depth() {
      return this.__DEPTH;
    }
    get index() {
      return this.__INDEX;
    }
    get parentFingerprint() {
      return this.__PARENT_FINGERPRINT;
    }
    get identifier() {
      return pl(this.publicKey);
    }
    get fingerprint() {
      return this.identifier.slice(0, 4);
    }
    get compressed() {
      return true;
    }
    isNeutered() {
      return this.__D === void 0;
    }
    neutered() {
      return h(this.publicKey, this.chainCode, this.network, this.depth, this.index, this.parentFingerprint);
    }
    toBase58() {
      const p = this.network, m = this.isNeutered() ? p.bip32.public : p.bip32.private, x = new Uint8Array(78);
      return $r(x, 0, m, "BE"), Bi(x, 4, this.depth), $r(x, 5, this.parentFingerprint, "BE"), $r(x, 9, this.index, "BE"), x.set(this.chainCode, 13), this.isNeutered() ? x.set(this.publicKey, 45) : (Bi(x, 45, 0), x.set(this.privateKey, 46)), Ai.encode(x);
    }
    toWIF() {
      if (!this.privateKey) throw new TypeError("Missing private key");
      return Yl({ version: this.network.wif, privateKey: this.privateKey });
    }
    derive(p) {
      hr(Xn, p);
      const m = p >= t, x = new Uint8Array(37);
      if (m) {
        if (this.isNeutered()) throw new TypeError("Missing private key for hardened child key");
        x[0] = 0, x.set(this.privateKey, 1), $r(x, 33, p, "BE");
      } else x.set(this.publicKey, 0), $r(x, 33, p, "BE");
      const j = ki(this.chainCode, x), P = j.slice(0, 32), S = j.slice(32);
      if (!e.isPrivate(P)) return this.derive(p + 1);
      let _;
      if (this.isNeutered()) {
        const M = e.pointAddScalar(this.publicKey, P, true);
        if (M === null) return this.derive(p + 1);
        _ = h(M, S, this.network, this.depth + 1, p, ct(this.fingerprint, 0, "BE"));
      } else {
        const M = e.privateAdd(this.privateKey, P);
        if (M == null) return this.derive(p + 1);
        _ = f(M, S, this.network, this.depth + 1, p, ct(this.fingerprint, 0, "BE"));
      }
      return _;
    }
    deriveHardened(p) {
      if (typeof hr(Ol, p) == "number") return this.derive(p + t);
      throw new TypeError("Expected UInt31, got " + p);
    }
    derivePath(p) {
      hr(Ml, p);
      let m = p.split("/");
      if (m[0] === "m") {
        if (this.parentFingerprint) throw new TypeError("Expected master, got child");
        m = m.slice(1);
      }
      return m.reduce((x, j) => {
        let P;
        return j.slice(-1) === "'" ? (P = parseInt(j.slice(0, -1), 10), x.deriveHardened(P)) : (P = parseInt(j, 10), x.derive(P));
      }, this);
    }
    tweak(p) {
      return this.privateKey ? this.tweakFromPrivateKey(p) : this.tweakFromPublicKey(p);
    }
    tweakFromPublicKey(p) {
      const m = n(this.publicKey);
      if (!e.xOnlyPointAddTweak) throw new Error("xOnlyPointAddTweak not supported by ecc library");
      const x = e.xOnlyPointAddTweak(m, p);
      if (!x || x.xOnlyPubkey === null) throw new Error("Cannot tweak public key!");
      const j = Uint8Array.from([x.parity === 0 ? 2 : 3]), P = gl([j, x.xOnlyPubkey]);
      return new a(void 0, P);
    }
    tweakFromPrivateKey(p) {
      const m = this.publicKey[0] === 3 || this.publicKey[0] === 4 && (this.publicKey[64] & 1) === 1, x = (() => {
        if (m) {
          if (e.privateNegate) return e.privateNegate(this.privateKey);
          throw new Error("privateNegate not supported by ecc library");
        } else return this.privateKey;
      })(), j = e.privateAdd(x, p);
      if (!j) throw new Error("Invalid tweaked private key!");
      return new a(j, void 0);
    }
  }
  function i(w, p) {
    const m = Ai.decode(w);
    if (m.length !== 78) throw new TypeError("Invalid buffer length");
    p = p || r;
    const x = ct(m, 0, "BE");
    if (x !== p.bip32.private && x !== p.bip32.public) throw new TypeError("Invalid network version");
    const j = m[4], P = ct(m, 5, "BE");
    if (j === 0 && P !== 0) throw new TypeError("Invalid parent fingerprint");
    const S = ct(m, 9, "BE");
    if (j === 0 && S !== 0) throw new TypeError("Invalid index");
    const _ = m.slice(13, 45);
    let M;
    if (x === p.bip32.private) {
      if (m[45] !== 0) throw new TypeError("Invalid private key");
      const W = m.slice(46, 78);
      M = f(W, _, p, j, S, P);
    } else {
      const W = m.slice(45, 78);
      M = h(W, _, p, j, S, P);
    }
    return M;
  }
  function s(w, p, m) {
    return f(w, p, m);
  }
  function f(w, p, m, x, j, P) {
    if (hr(pn, w), hr(pn, p), m = m || r, !e.isPrivate(w)) throw new TypeError("Private key not in range [1, n)");
    return new o(w, void 0, p, m, x, j, P);
  }
  function g(w, p, m) {
    return h(w, p, m);
  }
  function h(w, p, m, x, j, P) {
    if (hr(Fl, w), hr(pn, p), m = m || r, !e.isPoint(w)) throw new TypeError("Point is not on the curve");
    return new o(void 0, w, p, m, x, j, P);
  }
  function v(w, p) {
    if (hr(Ht(Uint8Array), w), w.length < 16) throw new TypeError("Seed should be at least 128 bits");
    if (w.length > 64) throw new TypeError("Seed should be at most 512 bits");
    p = p || r;
    const m = ki(ml("Bitcoin seed"), w), x = m.slice(0, 32), j = m.slice(32);
    return s(x, j, p);
  }
  return { fromSeed: v, fromBase58: i, fromPublicKey: g, fromPrivateKey: s };
}
var er = {}, He = {}, Si;
function Xl() {
  if (Si) return He;
  Si = 1, Object.defineProperty(He, "__esModule", { value: true }), He.sha512_256 = He.SHA512_256 = He.sha512_224 = He.SHA512_224 = He.sha384 = He.SHA384 = He.sha512 = He.SHA512 = void 0;
  const e = ro();
  return He.SHA512 = e.SHA512, He.sha512 = e.sha512, He.SHA384 = e.SHA384, He.sha384 = e.sha384, He.SHA512_224 = e.SHA512_224, He.sha512_224 = e.sha512_224, He.SHA512_256 = e.SHA512_256, He.sha512_256 = e.sha512_256, He;
}
var ut = {}, gn = {}, Ti;
function Qa() {
  return Ti || (Ti = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: true }), e.hmac = e.HMAC = void 0;
    const r = cr();
    class t extends r.Hash {
      constructor(o, i) {
        super(), this.finished = false, this.destroyed = false, (0, r.ahash)(o);
        const s = (0, r.toBytes)(i);
        if (this.iHash = o.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
        const f = this.blockLen, g = new Uint8Array(f);
        g.set(s.length > f ? o.create().update(s).digest() : s);
        for (let h = 0; h < g.length; h++) g[h] ^= 54;
        this.iHash.update(g), this.oHash = o.create();
        for (let h = 0; h < g.length; h++) g[h] ^= 106;
        this.oHash.update(g), (0, r.clean)(g);
      }
      update(o) {
        return (0, r.aexists)(this), this.iHash.update(o), this;
      }
      digestInto(o) {
        (0, r.aexists)(this), (0, r.abytes)(o, this.outputLen), this.finished = true, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
      }
      digest() {
        const o = new Uint8Array(this.oHash.outputLen);
        return this.digestInto(o), o;
      }
      _cloneInto(o) {
        o || (o = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash: i, iHash: s, finished: f, destroyed: g, blockLen: h, outputLen: v } = this;
        return o = o, o.finished = f, o.destroyed = g, o.blockLen = h, o.outputLen = v, o.oHash = i._cloneInto(o.oHash), o.iHash = s._cloneInto(o.iHash), o;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
      }
    }
    e.HMAC = t;
    const n = (a, o, i) => new t(a, o).update(i).digest();
    e.hmac = n, e.hmac.create = (a, o) => new t(a, o);
  })(gn)), gn;
}
var zi;
function Jl() {
  if (zi) return ut;
  zi = 1, Object.defineProperty(ut, "__esModule", { value: true }), ut.pbkdf2 = a, ut.pbkdf2Async = o;
  const e = Qa(), r = cr();
  function t(i, s, f, g) {
    (0, r.ahash)(i);
    const h = (0, r.checkOpts)({ dkLen: 32, asyncTick: 10 }, g), { c: v, dkLen: w, asyncTick: p } = h;
    if ((0, r.anumber)(v), (0, r.anumber)(w), (0, r.anumber)(p), v < 1) throw new Error("iterations (c) should be >= 1");
    const m = (0, r.kdfInputToBytes)(s), x = (0, r.kdfInputToBytes)(f), j = new Uint8Array(w), P = e.hmac.create(i, m), S = P._cloneInto().update(x);
    return { c: v, dkLen: w, asyncTick: p, DK: j, PRF: P, PRFSalt: S };
  }
  function n(i, s, f, g, h) {
    return i.destroy(), s.destroy(), g && g.destroy(), (0, r.clean)(h), f;
  }
  function a(i, s, f, g) {
    const { c: h, dkLen: v, DK: w, PRF: p, PRFSalt: m } = t(i, s, f, g);
    let x;
    const j = new Uint8Array(4), P = (0, r.createView)(j), S = new Uint8Array(p.outputLen);
    for (let _ = 1, M = 0; M < v; _++, M += p.outputLen) {
      const W = w.subarray(M, M + p.outputLen);
      P.setInt32(0, _, false), (x = m._cloneInto(x)).update(j).digestInto(S), W.set(S.subarray(0, W.length));
      for (let U = 1; U < h; U++) {
        p._cloneInto(x).update(S).digestInto(S);
        for (let R = 0; R < W.length; R++) W[R] ^= S[R];
      }
    }
    return n(p, m, w, x, S);
  }
  async function o(i, s, f, g) {
    const { c: h, dkLen: v, asyncTick: w, DK: p, PRF: m, PRFSalt: x } = t(i, s, f, g);
    let j;
    const P = new Uint8Array(4), S = (0, r.createView)(P), _ = new Uint8Array(m.outputLen);
    for (let M = 1, W = 0; W < v; M++, W += m.outputLen) {
      const U = p.subarray(W, W + m.outputLen);
      S.setInt32(0, M, false), (j = x._cloneInto(j)).update(P).digestInto(_), U.set(_.subarray(0, U.length)), await (0, r.asyncLoop)(h - 1, w, () => {
        m._cloneInto(j).update(_).digestInto(_);
        for (let R = 0; R < U.length; R++) U[R] ^= _[R];
      });
    }
    return n(m, x, p, j, _);
  }
  return ut;
}
var Je = {};
const Zl = JSON.parse('["abdikace","abeceda","adresa","agrese","akce","aktovka","alej","alkohol","amputace","ananas","andulka","anekdota","anketa","antika","anulovat","archa","arogance","asfalt","asistent","aspirace","astma","astronom","atlas","atletika","atol","autobus","azyl","babka","bachor","bacil","baculka","badatel","bageta","bagr","bahno","bakterie","balada","baletka","balkon","balonek","balvan","balza","bambus","bankomat","barbar","baret","barman","baroko","barva","baterka","batoh","bavlna","bazalka","bazilika","bazuka","bedna","beran","beseda","bestie","beton","bezinka","bezmoc","beztak","bicykl","bidlo","biftek","bikiny","bilance","biograf","biolog","bitva","bizon","blahobyt","blatouch","blecha","bledule","blesk","blikat","blizna","blokovat","bloudit","blud","bobek","bobr","bodlina","bodnout","bohatost","bojkot","bojovat","bokorys","bolest","borec","borovice","bota","boubel","bouchat","bouda","boule","bourat","boxer","bradavka","brambora","branka","bratr","brepta","briketa","brko","brloh","bronz","broskev","brunetka","brusinka","brzda","brzy","bublina","bubnovat","buchta","buditel","budka","budova","bufet","bujarost","bukvice","buldok","bulva","bunda","bunkr","burza","butik","buvol","buzola","bydlet","bylina","bytovka","bzukot","capart","carevna","cedr","cedule","cejch","cejn","cela","celer","celkem","celnice","cenina","cennost","cenovka","centrum","cenzor","cestopis","cetka","chalupa","chapadlo","charita","chata","chechtat","chemie","chichot","chirurg","chlad","chleba","chlubit","chmel","chmura","chobot","chochol","chodba","cholera","chomout","chopit","choroba","chov","chrapot","chrlit","chrt","chrup","chtivost","chudina","chutnat","chvat","chvilka","chvost","chyba","chystat","chytit","cibule","cigareta","cihelna","cihla","cinkot","cirkus","cisterna","citace","citrus","cizinec","cizost","clona","cokoliv","couvat","ctitel","ctnost","cudnost","cuketa","cukr","cupot","cvaknout","cval","cvik","cvrkot","cyklista","daleko","dareba","datel","datum","dcera","debata","dechovka","decibel","deficit","deflace","dekl","dekret","demokrat","deprese","derby","deska","detektiv","dikobraz","diktovat","dioda","diplom","disk","displej","divadlo","divoch","dlaha","dlouho","dluhopis","dnes","dobro","dobytek","docent","dochutit","dodnes","dohled","dohoda","dohra","dojem","dojnice","doklad","dokola","doktor","dokument","dolar","doleva","dolina","doma","dominant","domluvit","domov","donutit","dopad","dopis","doplnit","doposud","doprovod","dopustit","dorazit","dorost","dort","dosah","doslov","dostatek","dosud","dosyta","dotaz","dotek","dotknout","doufat","doutnat","dovozce","dozadu","doznat","dozorce","drahota","drak","dramatik","dravec","draze","drdol","drobnost","drogerie","drozd","drsnost","drtit","drzost","duben","duchovno","dudek","duha","duhovka","dusit","dusno","dutost","dvojice","dvorec","dynamit","ekolog","ekonomie","elektron","elipsa","email","emise","emoce","empatie","epizoda","epocha","epopej","epos","esej","esence","eskorta","eskymo","etiketa","euforie","evoluce","exekuce","exkurze","expedice","exploze","export","extrakt","facka","fajfka","fakulta","fanatik","fantazie","farmacie","favorit","fazole","federace","fejeton","fenka","fialka","figurant","filozof","filtr","finance","finta","fixace","fjord","flanel","flirt","flotila","fond","fosfor","fotbal","fotka","foton","frakce","freska","fronta","fukar","funkce","fyzika","galeje","garant","genetika","geolog","gilotina","glazura","glejt","golem","golfista","gotika","graf","gramofon","granule","grep","gril","grog","groteska","guma","hadice","hadr","hala","halenka","hanba","hanopis","harfa","harpuna","havran","hebkost","hejkal","hejno","hejtman","hektar","helma","hematom","herec","herna","heslo","hezky","historik","hladovka","hlasivky","hlava","hledat","hlen","hlodavec","hloh","hloupost","hltat","hlubina","hluchota","hmat","hmota","hmyz","hnis","hnojivo","hnout","hoblina","hoboj","hoch","hodiny","hodlat","hodnota","hodovat","hojnost","hokej","holinka","holka","holub","homole","honitba","honorace","horal","horda","horizont","horko","horlivec","hormon","hornina","horoskop","horstvo","hospoda","hostina","hotovost","houba","houf","houpat","houska","hovor","hradba","hranice","hravost","hrazda","hrbolek","hrdina","hrdlo","hrdost","hrnek","hrobka","hromada","hrot","hrouda","hrozen","hrstka","hrubost","hryzat","hubenost","hubnout","hudba","hukot","humr","husita","hustota","hvozd","hybnost","hydrant","hygiena","hymna","hysterik","idylka","ihned","ikona","iluze","imunita","infekce","inflace","inkaso","inovace","inspekce","internet","invalida","investor","inzerce","ironie","jablko","jachta","jahoda","jakmile","jakost","jalovec","jantar","jarmark","jaro","jasan","jasno","jatka","javor","jazyk","jedinec","jedle","jednatel","jehlan","jekot","jelen","jelito","jemnost","jenom","jepice","jeseter","jevit","jezdec","jezero","jinak","jindy","jinoch","jiskra","jistota","jitrnice","jizva","jmenovat","jogurt","jurta","kabaret","kabel","kabinet","kachna","kadet","kadidlo","kahan","kajak","kajuta","kakao","kaktus","kalamita","kalhoty","kalibr","kalnost","kamera","kamkoliv","kamna","kanibal","kanoe","kantor","kapalina","kapela","kapitola","kapka","kaple","kapota","kapr","kapusta","kapybara","karamel","karotka","karton","kasa","katalog","katedra","kauce","kauza","kavalec","kazajka","kazeta","kazivost","kdekoliv","kdesi","kedluben","kemp","keramika","kino","klacek","kladivo","klam","klapot","klasika","klaun","klec","klenba","klepat","klesnout","klid","klima","klisna","klobouk","klokan","klopa","kloub","klubovna","klusat","kluzkost","kmen","kmitat","kmotr","kniha","knot","koalice","koberec","kobka","kobliha","kobyla","kocour","kohout","kojenec","kokos","koktejl","kolaps","koleda","kolize","kolo","komando","kometa","komik","komnata","komora","kompas","komunita","konat","koncept","kondice","konec","konfese","kongres","konina","konkurs","kontakt","konzerva","kopanec","kopie","kopnout","koprovka","korbel","korektor","kormidlo","koroptev","korpus","koruna","koryto","korzet","kosatec","kostka","kotel","kotleta","kotoul","koukat","koupelna","kousek","kouzlo","kovboj","koza","kozoroh","krabice","krach","krajina","kralovat","krasopis","kravata","kredit","krejcar","kresba","kreveta","kriket","kritik","krize","krkavec","krmelec","krmivo","krocan","krok","kronika","kropit","kroupa","krovka","krtek","kruhadlo","krupice","krutost","krvinka","krychle","krypta","krystal","kryt","kudlanka","kufr","kujnost","kukla","kulajda","kulich","kulka","kulomet","kultura","kuna","kupodivu","kurt","kurzor","kutil","kvalita","kvasinka","kvestor","kynolog","kyselina","kytara","kytice","kytka","kytovec","kyvadlo","labrador","lachtan","ladnost","laik","lakomec","lamela","lampa","lanovka","lasice","laso","lastura","latinka","lavina","lebka","leckdy","leden","lednice","ledovka","ledvina","legenda","legie","legrace","lehce","lehkost","lehnout","lektvar","lenochod","lentilka","lepenka","lepidlo","letadlo","letec","letmo","letokruh","levhart","levitace","levobok","libra","lichotka","lidojed","lidskost","lihovina","lijavec","lilek","limetka","linie","linka","linoleum","listopad","litina","litovat","lobista","lodivod","logika","logoped","lokalita","loket","lomcovat","lopata","lopuch","lord","losos","lotr","loudal","louh","louka","louskat","lovec","lstivost","lucerna","lucifer","lump","lusk","lustrace","lvice","lyra","lyrika","lysina","madam","madlo","magistr","mahagon","majetek","majitel","majorita","makak","makovice","makrela","malba","malina","malovat","malvice","maminka","mandle","manko","marnost","masakr","maskot","masopust","matice","matrika","maturita","mazanec","mazivo","mazlit","mazurka","mdloba","mechanik","meditace","medovina","melasa","meloun","mentolka","metla","metoda","metr","mezera","migrace","mihnout","mihule","mikina","mikrofon","milenec","milimetr","milost","mimika","mincovna","minibar","minomet","minulost","miska","mistr","mixovat","mladost","mlha","mlhovina","mlok","mlsat","mluvit","mnich","mnohem","mobil","mocnost","modelka","modlitba","mohyla","mokro","molekula","momentka","monarcha","monokl","monstrum","montovat","monzun","mosaz","moskyt","most","motivace","motorka","motyka","moucha","moudrost","mozaika","mozek","mozol","mramor","mravenec","mrkev","mrtvola","mrzet","mrzutost","mstitel","mudrc","muflon","mulat","mumie","munice","muset","mutace","muzeum","muzikant","myslivec","mzda","nabourat","nachytat","nadace","nadbytek","nadhoz","nadobro","nadpis","nahlas","nahnat","nahodile","nahradit","naivita","najednou","najisto","najmout","naklonit","nakonec","nakrmit","nalevo","namazat","namluvit","nanometr","naoko","naopak","naostro","napadat","napevno","naplnit","napnout","naposled","naprosto","narodit","naruby","narychlo","nasadit","nasekat","naslepo","nastat","natolik","navenek","navrch","navzdory","nazvat","nebe","nechat","necky","nedaleko","nedbat","neduh","negace","nehet","nehoda","nejen","nejprve","neklid","nelibost","nemilost","nemoc","neochota","neonka","nepokoj","nerost","nerv","nesmysl","nesoulad","netvor","neuron","nevina","nezvykle","nicota","nijak","nikam","nikdy","nikl","nikterak","nitro","nocleh","nohavice","nominace","nora","norek","nositel","nosnost","nouze","noviny","novota","nozdra","nuda","nudle","nuget","nutit","nutnost","nutrie","nymfa","obal","obarvit","obava","obdiv","obec","obehnat","obejmout","obezita","obhajoba","obilnice","objasnit","objekt","obklopit","oblast","oblek","obliba","obloha","obluda","obnos","obohatit","obojek","obout","obrazec","obrna","obruba","obrys","obsah","obsluha","obstarat","obuv","obvaz","obvinit","obvod","obvykle","obyvatel","obzor","ocas","ocel","ocenit","ochladit","ochota","ochrana","ocitnout","odboj","odbyt","odchod","odcizit","odebrat","odeslat","odevzdat","odezva","odhadce","odhodit","odjet","odjinud","odkaz","odkoupit","odliv","odluka","odmlka","odolnost","odpad","odpis","odplout","odpor","odpustit","odpykat","odrazka","odsoudit","odstup","odsun","odtok","odtud","odvaha","odveta","odvolat","odvracet","odznak","ofina","ofsajd","ohlas","ohnisko","ohrada","ohrozit","ohryzek","okap","okenice","oklika","okno","okouzlit","okovy","okrasa","okres","okrsek","okruh","okupant","okurka","okusit","olejnina","olizovat","omak","omeleta","omezit","omladina","omlouvat","omluva","omyl","onehdy","opakovat","opasek","operace","opice","opilost","opisovat","opora","opozice","opravdu","oproti","orbital","orchestr","orgie","orlice","orloj","ortel","osada","oschnout","osika","osivo","oslava","oslepit","oslnit","oslovit","osnova","osoba","osolit","ospalec","osten","ostraha","ostuda","ostych","osvojit","oteplit","otisk","otop","otrhat","otrlost","otrok","otruby","otvor","ovanout","ovar","oves","ovlivnit","ovoce","oxid","ozdoba","pachatel","pacient","padouch","pahorek","pakt","palanda","palec","palivo","paluba","pamflet","pamlsek","panenka","panika","panna","panovat","panstvo","pantofle","paprika","parketa","parodie","parta","paruka","paryba","paseka","pasivita","pastelka","patent","patrona","pavouk","pazneht","pazourek","pecka","pedagog","pejsek","peklo","peloton","penalta","pendrek","penze","periskop","pero","pestrost","petarda","petice","petrolej","pevnina","pexeso","pianista","piha","pijavice","pikle","piknik","pilina","pilnost","pilulka","pinzeta","pipeta","pisatel","pistole","pitevna","pivnice","pivovar","placenta","plakat","plamen","planeta","plastika","platit","plavidlo","plaz","plech","plemeno","plenta","ples","pletivo","plevel","plivat","plnit","plno","plocha","plodina","plomba","plout","pluk","plyn","pobavit","pobyt","pochod","pocit","poctivec","podat","podcenit","podepsat","podhled","podivit","podklad","podmanit","podnik","podoba","podpora","podraz","podstata","podvod","podzim","poezie","pohanka","pohnutka","pohovor","pohroma","pohyb","pointa","pojistka","pojmout","pokazit","pokles","pokoj","pokrok","pokuta","pokyn","poledne","polibek","polknout","poloha","polynom","pomalu","pominout","pomlka","pomoc","pomsta","pomyslet","ponechat","ponorka","ponurost","popadat","popel","popisek","poplach","poprosit","popsat","popud","poradce","porce","porod","porucha","poryv","posadit","posed","posila","poskok","poslanec","posoudit","pospolu","postava","posudek","posyp","potah","potkan","potlesk","potomek","potrava","potupa","potvora","poukaz","pouto","pouzdro","povaha","povidla","povlak","povoz","povrch","povstat","povyk","povzdech","pozdrav","pozemek","poznatek","pozor","pozvat","pracovat","prahory","praktika","prales","praotec","praporek","prase","pravda","princip","prkno","probudit","procento","prodej","profese","prohra","projekt","prolomit","promile","pronikat","propad","prorok","prosba","proton","proutek","provaz","prskavka","prsten","prudkost","prut","prvek","prvohory","psanec","psovod","pstruh","ptactvo","puberta","puch","pudl","pukavec","puklina","pukrle","pult","pumpa","punc","pupen","pusa","pusinka","pustina","putovat","putyka","pyramida","pysk","pytel","racek","rachot","radiace","radnice","radon","raft","ragby","raketa","rakovina","rameno","rampouch","rande","rarach","rarita","rasovna","rastr","ratolest","razance","razidlo","reagovat","reakce","recept","redaktor","referent","reflex","rejnok","reklama","rekord","rekrut","rektor","reputace","revize","revma","revolver","rezerva","riskovat","riziko","robotika","rodokmen","rohovka","rokle","rokoko","romaneto","ropovod","ropucha","rorejs","rosol","rostlina","rotmistr","rotoped","rotunda","roubenka","roucho","roup","roura","rovina","rovnice","rozbor","rozchod","rozdat","rozeznat","rozhodce","rozinka","rozjezd","rozkaz","rozloha","rozmar","rozpad","rozruch","rozsah","roztok","rozum","rozvod","rubrika","ruchadlo","rukavice","rukopis","ryba","rybolov","rychlost","rydlo","rypadlo","rytina","ryzost","sadista","sahat","sako","samec","samizdat","samota","sanitka","sardinka","sasanka","satelit","sazba","sazenice","sbor","schovat","sebranka","secese","sedadlo","sediment","sedlo","sehnat","sejmout","sekera","sekta","sekunda","sekvoje","semeno","seno","servis","sesadit","seshora","seskok","seslat","sestra","sesuv","sesypat","setba","setina","setkat","setnout","setrvat","sever","seznam","shoda","shrnout","sifon","silnice","sirka","sirotek","sirup","situace","skafandr","skalisko","skanzen","skaut","skeptik","skica","skladba","sklenice","sklo","skluz","skoba","skokan","skoro","skripta","skrz","skupina","skvost","skvrna","slabika","sladidlo","slanina","slast","slavnost","sledovat","slepec","sleva","slezina","slib","slina","sliznice","slon","sloupek","slovo","sluch","sluha","slunce","slupka","slza","smaragd","smetana","smilstvo","smlouva","smog","smrad","smrk","smrtka","smutek","smysl","snad","snaha","snob","sobota","socha","sodovka","sokol","sopka","sotva","souboj","soucit","soudce","souhlas","soulad","soumrak","souprava","soused","soutok","souviset","spalovna","spasitel","spis","splav","spodek","spojenec","spolu","sponzor","spornost","spousta","sprcha","spustit","sranda","sraz","srdce","srna","srnec","srovnat","srpen","srst","srub","stanice","starosta","statika","stavba","stehno","stezka","stodola","stolek","stopa","storno","stoupat","strach","stres","strhnout","strom","struna","studna","stupnice","stvol","styk","subjekt","subtropy","suchar","sudost","sukno","sundat","sunout","surikata","surovina","svah","svalstvo","svetr","svatba","svazek","svisle","svitek","svoboda","svodidlo","svorka","svrab","sykavka","sykot","synek","synovec","sypat","sypkost","syrovost","sysel","sytost","tabletka","tabule","tahoun","tajemno","tajfun","tajga","tajit","tajnost","taktika","tamhle","tampon","tancovat","tanec","tanker","tapeta","tavenina","tazatel","technika","tehdy","tekutina","telefon","temnota","tendence","tenista","tenor","teplota","tepna","teprve","terapie","termoska","textil","ticho","tiskopis","titulek","tkadlec","tkanina","tlapka","tleskat","tlukot","tlupa","tmel","toaleta","topinka","topol","torzo","touha","toulec","tradice","traktor","tramp","trasa","traverza","trefit","trest","trezor","trhavina","trhlina","trochu","trojice","troska","trouba","trpce","trpitel","trpkost","trubec","truchlit","truhlice","trus","trvat","tudy","tuhnout","tuhost","tundra","turista","turnaj","tuzemsko","tvaroh","tvorba","tvrdost","tvrz","tygr","tykev","ubohost","uboze","ubrat","ubrousek","ubrus","ubytovna","ucho","uctivost","udivit","uhradit","ujednat","ujistit","ujmout","ukazatel","uklidnit","uklonit","ukotvit","ukrojit","ulice","ulita","ulovit","umyvadlo","unavit","uniforma","uniknout","upadnout","uplatnit","uplynout","upoutat","upravit","uran","urazit","usednout","usilovat","usmrtit","usnadnit","usnout","usoudit","ustlat","ustrnout","utahovat","utkat","utlumit","utonout","utopenec","utrousit","uvalit","uvolnit","uvozovka","uzdravit","uzel","uzenina","uzlina","uznat","vagon","valcha","valoun","vana","vandal","vanilka","varan","varhany","varovat","vcelku","vchod","vdova","vedro","vegetace","vejce","velbloud","veletrh","velitel","velmoc","velryba","venkov","veranda","verze","veselka","veskrze","vesnice","vespodu","vesta","veterina","veverka","vibrace","vichr","videohra","vidina","vidle","vila","vinice","viset","vitalita","vize","vizitka","vjezd","vklad","vkus","vlajka","vlak","vlasec","vlevo","vlhkost","vliv","vlnovka","vloupat","vnucovat","vnuk","voda","vodivost","vodoznak","vodstvo","vojensky","vojna","vojsko","volant","volba","volit","volno","voskovka","vozidlo","vozovna","vpravo","vrabec","vracet","vrah","vrata","vrba","vrcholek","vrhat","vrstva","vrtule","vsadit","vstoupit","vstup","vtip","vybavit","vybrat","vychovat","vydat","vydra","vyfotit","vyhledat","vyhnout","vyhodit","vyhradit","vyhubit","vyjasnit","vyjet","vyjmout","vyklopit","vykonat","vylekat","vymazat","vymezit","vymizet","vymyslet","vynechat","vynikat","vynutit","vypadat","vyplatit","vypravit","vypustit","vyrazit","vyrovnat","vyrvat","vyslovit","vysoko","vystavit","vysunout","vysypat","vytasit","vytesat","vytratit","vyvinout","vyvolat","vyvrhel","vyzdobit","vyznat","vzadu","vzbudit","vzchopit","vzdor","vzduch","vzdychat","vzestup","vzhledem","vzkaz","vzlykat","vznik","vzorek","vzpoura","vztah","vztek","xylofon","zabrat","zabydlet","zachovat","zadarmo","zadusit","zafoukat","zahltit","zahodit","zahrada","zahynout","zajatec","zajet","zajistit","zaklepat","zakoupit","zalepit","zamezit","zamotat","zamyslet","zanechat","zanikat","zaplatit","zapojit","zapsat","zarazit","zastavit","zasunout","zatajit","zatemnit","zatknout","zaujmout","zavalit","zavelet","zavinit","zavolat","zavrtat","zazvonit","zbavit","zbrusu","zbudovat","zbytek","zdaleka","zdarma","zdatnost","zdivo","zdobit","zdroj","zdvih","zdymadlo","zelenina","zeman","zemina","zeptat","zezadu","zezdola","zhatit","zhltnout","zhluboka","zhotovit","zhruba","zima","zimnice","zjemnit","zklamat","zkoumat","zkratka","zkumavka","zlato","zlehka","zloba","zlom","zlost","zlozvyk","zmapovat","zmar","zmatek","zmije","zmizet","zmocnit","zmodrat","zmrzlina","zmutovat","znak","znalost","znamenat","znovu","zobrazit","zotavit","zoubek","zoufale","zplodit","zpomalit","zprava","zprostit","zprudka","zprvu","zrada","zranit","zrcadlo","zrnitost","zrno","zrovna","zrychlit","zrzavost","zticha","ztratit","zubovina","zubr","zvednout","zvenku","zvesela","zvon","zvrat","zvukovod","zvyk"]'), Ql = JSON.parse('["\u7684","\u4E00","\u662F","\u5728","\u4E0D","\u4E86","\u6709","\u548C","\u4EBA","\u8FD9","\u4E2D","\u5927","\u4E3A","\u4E0A","\u4E2A","\u56FD","\u6211","\u4EE5","\u8981","\u4ED6","\u65F6","\u6765","\u7528","\u4EEC","\u751F","\u5230","\u4F5C","\u5730","\u4E8E","\u51FA","\u5C31","\u5206","\u5BF9","\u6210","\u4F1A","\u53EF","\u4E3B","\u53D1","\u5E74","\u52A8","\u540C","\u5DE5","\u4E5F","\u80FD","\u4E0B","\u8FC7","\u5B50","\u8BF4","\u4EA7","\u79CD","\u9762","\u800C","\u65B9","\u540E","\u591A","\u5B9A","\u884C","\u5B66","\u6CD5","\u6240","\u6C11","\u5F97","\u7ECF","\u5341","\u4E09","\u4E4B","\u8FDB","\u7740","\u7B49","\u90E8","\u5EA6","\u5BB6","\u7535","\u529B","\u91CC","\u5982","\u6C34","\u5316","\u9AD8","\u81EA","\u4E8C","\u7406","\u8D77","\u5C0F","\u7269","\u73B0","\u5B9E","\u52A0","\u91CF","\u90FD","\u4E24","\u4F53","\u5236","\u673A","\u5F53","\u4F7F","\u70B9","\u4ECE","\u4E1A","\u672C","\u53BB","\u628A","\u6027","\u597D","\u5E94","\u5F00","\u5B83","\u5408","\u8FD8","\u56E0","\u7531","\u5176","\u4E9B","\u7136","\u524D","\u5916","\u5929","\u653F","\u56DB","\u65E5","\u90A3","\u793E","\u4E49","\u4E8B","\u5E73","\u5F62","\u76F8","\u5168","\u8868","\u95F4","\u6837","\u4E0E","\u5173","\u5404","\u91CD","\u65B0","\u7EBF","\u5185","\u6570","\u6B63","\u5FC3","\u53CD","\u4F60","\u660E","\u770B","\u539F","\u53C8","\u4E48","\u5229","\u6BD4","\u6216","\u4F46","\u8D28","\u6C14","\u7B2C","\u5411","\u9053","\u547D","\u6B64","\u53D8","\u6761","\u53EA","\u6CA1","\u7ED3","\u89E3","\u95EE","\u610F","\u5EFA","\u6708","\u516C","\u65E0","\u7CFB","\u519B","\u5F88","\u60C5","\u8005","\u6700","\u7ACB","\u4EE3","\u60F3","\u5DF2","\u901A","\u5E76","\u63D0","\u76F4","\u9898","\u515A","\u7A0B","\u5C55","\u4E94","\u679C","\u6599","\u8C61","\u5458","\u9769","\u4F4D","\u5165","\u5E38","\u6587","\u603B","\u6B21","\u54C1","\u5F0F","\u6D3B","\u8BBE","\u53CA","\u7BA1","\u7279","\u4EF6","\u957F","\u6C42","\u8001","\u5934","\u57FA","\u8D44","\u8FB9","\u6D41","\u8DEF","\u7EA7","\u5C11","\u56FE","\u5C71","\u7EDF","\u63A5","\u77E5","\u8F83","\u5C06","\u7EC4","\u89C1","\u8BA1","\u522B","\u5979","\u624B","\u89D2","\u671F","\u6839","\u8BBA","\u8FD0","\u519C","\u6307","\u51E0","\u4E5D","\u533A","\u5F3A","\u653E","\u51B3","\u897F","\u88AB","\u5E72","\u505A","\u5FC5","\u6218","\u5148","\u56DE","\u5219","\u4EFB","\u53D6","\u636E","\u5904","\u961F","\u5357","\u7ED9","\u8272","\u5149","\u95E8","\u5373","\u4FDD","\u6CBB","\u5317","\u9020","\u767E","\u89C4","\u70ED","\u9886","\u4E03","\u6D77","\u53E3","\u4E1C","\u5BFC","\u5668","\u538B","\u5FD7","\u4E16","\u91D1","\u589E","\u4E89","\u6D4E","\u9636","\u6CB9","\u601D","\u672F","\u6781","\u4EA4","\u53D7","\u8054","\u4EC0","\u8BA4","\u516D","\u5171","\u6743","\u6536","\u8BC1","\u6539","\u6E05","\u7F8E","\u518D","\u91C7","\u8F6C","\u66F4","\u5355","\u98CE","\u5207","\u6253","\u767D","\u6559","\u901F","\u82B1","\u5E26","\u5B89","\u573A","\u8EAB","\u8F66","\u4F8B","\u771F","\u52A1","\u5177","\u4E07","\u6BCF","\u76EE","\u81F3","\u8FBE","\u8D70","\u79EF","\u793A","\u8BAE","\u58F0","\u62A5","\u6597","\u5B8C","\u7C7B","\u516B","\u79BB","\u534E","\u540D","\u786E","\u624D","\u79D1","\u5F20","\u4FE1","\u9A6C","\u8282","\u8BDD","\u7C73","\u6574","\u7A7A","\u5143","\u51B5","\u4ECA","\u96C6","\u6E29","\u4F20","\u571F","\u8BB8","\u6B65","\u7FA4","\u5E7F","\u77F3","\u8BB0","\u9700","\u6BB5","\u7814","\u754C","\u62C9","\u6797","\u5F8B","\u53EB","\u4E14","\u7A76","\u89C2","\u8D8A","\u7EC7","\u88C5","\u5F71","\u7B97","\u4F4E","\u6301","\u97F3","\u4F17","\u4E66","\u5E03","\u590D","\u5BB9","\u513F","\u987B","\u9645","\u5546","\u975E","\u9A8C","\u8FDE","\u65AD","\u6DF1","\u96BE","\u8FD1","\u77FF","\u5343","\u5468","\u59D4","\u7D20","\u6280","\u5907","\u534A","\u529E","\u9752","\u7701","\u5217","\u4E60","\u54CD","\u7EA6","\u652F","\u822C","\u53F2","\u611F","\u52B3","\u4FBF","\u56E2","\u5F80","\u9178","\u5386","\u5E02","\u514B","\u4F55","\u9664","\u6D88","\u6784","\u5E9C","\u79F0","\u592A","\u51C6","\u7CBE","\u503C","\u53F7","\u7387","\u65CF","\u7EF4","\u5212","\u9009","\u6807","\u5199","\u5B58","\u5019","\u6BDB","\u4EB2","\u5FEB","\u6548","\u65AF","\u9662","\u67E5","\u6C5F","\u578B","\u773C","\u738B","\u6309","\u683C","\u517B","\u6613","\u7F6E","\u6D3E","\u5C42","\u7247","\u59CB","\u5374","\u4E13","\u72B6","\u80B2","\u5382","\u4EAC","\u8BC6","\u9002","\u5C5E","\u5706","\u5305","\u706B","\u4F4F","\u8C03","\u6EE1","\u53BF","\u5C40","\u7167","\u53C2","\u7EA2","\u7EC6","\u5F15","\u542C","\u8BE5","\u94C1","\u4EF7","\u4E25","\u9996","\u5E95","\u6DB2","\u5B98","\u5FB7","\u968F","\u75C5","\u82CF","\u5931","\u5C14","\u6B7B","\u8BB2","\u914D","\u5973","\u9EC4","\u63A8","\u663E","\u8C08","\u7F6A","\u795E","\u827A","\u5462","\u5E2D","\u542B","\u4F01","\u671B","\u5BC6","\u6279","\u8425","\u9879","\u9632","\u4E3E","\u7403","\u82F1","\u6C27","\u52BF","\u544A","\u674E","\u53F0","\u843D","\u6728","\u5E2E","\u8F6E","\u7834","\u4E9A","\u5E08","\u56F4","\u6CE8","\u8FDC","\u5B57","\u6750","\u6392","\u4F9B","\u6CB3","\u6001","\u5C01","\u53E6","\u65BD","\u51CF","\u6811","\u6EB6","\u600E","\u6B62","\u6848","\u8A00","\u58EB","\u5747","\u6B66","\u56FA","\u53F6","\u9C7C","\u6CE2","\u89C6","\u4EC5","\u8D39","\u7D27","\u7231","\u5DE6","\u7AE0","\u65E9","\u671D","\u5BB3","\u7EED","\u8F7B","\u670D","\u8BD5","\u98DF","\u5145","\u5175","\u6E90","\u5224","\u62A4","\u53F8","\u8DB3","\u67D0","\u7EC3","\u5DEE","\u81F4","\u677F","\u7530","\u964D","\u9ED1","\u72AF","\u8D1F","\u51FB","\u8303","\u7EE7","\u5174","\u4F3C","\u4F59","\u575A","\u66F2","\u8F93","\u4FEE","\u6545","\u57CE","\u592B","\u591F","\u9001","\u7B14","\u8239","\u5360","\u53F3","\u8D22","\u5403","\u5BCC","\u6625","\u804C","\u89C9","\u6C49","\u753B","\u529F","\u5DF4","\u8DDF","\u867D","\u6742","\u98DE","\u68C0","\u5438","\u52A9","\u5347","\u9633","\u4E92","\u521D","\u521B","\u6297","\u8003","\u6295","\u574F","\u7B56","\u53E4","\u5F84","\u6362","\u672A","\u8DD1","\u7559","\u94A2","\u66FE","\u7AEF","\u8D23","\u7AD9","\u7B80","\u8FF0","\u94B1","\u526F","\u5C3D","\u5E1D","\u5C04","\u8349","\u51B2","\u627F","\u72EC","\u4EE4","\u9650","\u963F","\u5BA3","\u73AF","\u53CC","\u8BF7","\u8D85","\u5FAE","\u8BA9","\u63A7","\u5DDE","\u826F","\u8F74","\u627E","\u5426","\u7EAA","\u76CA","\u4F9D","\u4F18","\u9876","\u7840","\u8F7D","\u5012","\u623F","\u7A81","\u5750","\u7C89","\u654C","\u7565","\u5BA2","\u8881","\u51B7","\u80DC","\u7EDD","\u6790","\u5757","\u5242","\u6D4B","\u4E1D","\u534F","\u8BC9","\u5FF5","\u9648","\u4ECD","\u7F57","\u76D0","\u53CB","\u6D0B","\u9519","\u82E6","\u591C","\u5211","\u79FB","\u9891","\u9010","\u9760","\u6DF7","\u6BCD","\u77ED","\u76AE","\u7EC8","\u805A","\u6C7D","\u6751","\u4E91","\u54EA","\u65E2","\u8DDD","\u536B","\u505C","\u70C8","\u592E","\u5BDF","\u70E7","\u8FC5","\u5883","\u82E5","\u5370","\u6D32","\u523B","\u62EC","\u6FC0","\u5B54","\u641E","\u751A","\u5BA4","\u5F85","\u6838","\u6821","\u6563","\u4FB5","\u5427","\u7532","\u6E38","\u4E45","\u83DC","\u5473","\u65E7","\u6A21","\u6E56","\u8D27","\u635F","\u9884","\u963B","\u6BEB","\u666E","\u7A33","\u4E59","\u5988","\u690D","\u606F","\u6269","\u94F6","\u8BED","\u6325","\u9152","\u5B88","\u62FF","\u5E8F","\u7EB8","\u533B","\u7F3A","\u96E8","\u5417","\u9488","\u5218","\u554A","\u6025","\u5531","\u8BEF","\u8BAD","\u613F","\u5BA1","\u9644","\u83B7","\u8336","\u9C9C","\u7CAE","\u65A4","\u5B69","\u8131","\u786B","\u80A5","\u5584","\u9F99","\u6F14","\u7236","\u6E10","\u8840","\u6B22","\u68B0","\u638C","\u6B4C","\u6C99","\u521A","\u653B","\u8C13","\u76FE","\u8BA8","\u665A","\u7C92","\u4E71","\u71C3","\u77DB","\u4E4E","\u6740","\u836F","\u5B81","\u9C81","\u8D35","\u949F","\u7164","\u8BFB","\u73ED","\u4F2F","\u9999","\u4ECB","\u8FEB","\u53E5","\u4E30","\u57F9","\u63E1","\u5170","\u62C5","\u5F26","\u86CB","\u6C89","\u5047","\u7A7F","\u6267","\u7B54","\u4E50","\u8C01","\u987A","\u70DF","\u7F29","\u5F81","\u8138","\u559C","\u677E","\u811A","\u56F0","\u5F02","\u514D","\u80CC","\u661F","\u798F","\u4E70","\u67D3","\u4E95","\u6982","\u6162","\u6015","\u78C1","\u500D","\u7956","\u7687","\u4FC3","\u9759","\u8865","\u8BC4","\u7FFB","\u8089","\u8DF5","\u5C3C","\u8863","\u5BBD","\u626C","\u68C9","\u5E0C","\u4F24","\u64CD","\u5782","\u79CB","\u5B9C","\u6C22","\u5957","\u7763","\u632F","\u67B6","\u4EAE","\u672B","\u5BAA","\u5E86","\u7F16","\u725B","\u89E6","\u6620","\u96F7","\u9500","\u8BD7","\u5EA7","\u5C45","\u6293","\u88C2","\u80DE","\u547C","\u5A18","\u666F","\u5A01","\u7EFF","\u6676","\u539A","\u76DF","\u8861","\u9E21","\u5B59","\u5EF6","\u5371","\u80F6","\u5C4B","\u4E61","\u4E34","\u9646","\u987E","\u6389","\u5440","\u706F","\u5C81","\u63AA","\u675F","\u8010","\u5267","\u7389","\u8D75","\u8DF3","\u54E5","\u5B63","\u8BFE","\u51EF","\u80E1","\u989D","\u6B3E","\u7ECD","\u5377","\u9F50","\u4F1F","\u84B8","\u6B96","\u6C38","\u5B97","\u82D7","\u5DDD","\u7089","\u5CA9","\u5F31","\u96F6","\u6768","\u594F","\u6CBF","\u9732","\u6746","\u63A2","\u6ED1","\u9547","\u996D","\u6D53","\u822A","\u6000","\u8D76","\u5E93","\u593A","\u4F0A","\u7075","\u7A0E","\u9014","\u706D","\u8D5B","\u5F52","\u53EC","\u9F13","\u64AD","\u76D8","\u88C1","\u9669","\u5EB7","\u552F","\u5F55","\u83CC","\u7EAF","\u501F","\u7CD6","\u76D6","\u6A2A","\u7B26","\u79C1","\u52AA","\u5802","\u57DF","\u67AA","\u6DA6","\u5E45","\u54C8","\u7ADF","\u719F","\u866B","\u6CFD","\u8111","\u58E4","\u78B3","\u6B27","\u904D","\u4FA7","\u5BE8","\u6562","\u5F7B","\u8651","\u659C","\u8584","\u5EAD","\u7EB3","\u5F39","\u9972","\u4F38","\u6298","\u9EA6","\u6E7F","\u6697","\u8377","\u74E6","\u585E","\u5E8A","\u7B51","\u6076","\u6237","\u8BBF","\u5854","\u5947","\u900F","\u6881","\u5200","\u65CB","\u8FF9","\u5361","\u6C2F","\u9047","\u4EFD","\u6BD2","\u6CE5","\u9000","\u6D17","\u6446","\u7070","\u5F69","\u5356","\u8017","\u590F","\u62E9","\u5FD9","\u94DC","\u732E","\u786C","\u4E88","\u7E41","\u5708","\u96EA","\u51FD","\u4EA6","\u62BD","\u7BC7","\u9635","\u9634","\u4E01","\u5C3A","\u8FFD","\u5806","\u96C4","\u8FCE","\u6CDB","\u7238","\u697C","\u907F","\u8C0B","\u5428","\u91CE","\u732A","\u65D7","\u7D2F","\u504F","\u5178","\u9986","\u7D22","\u79E6","\u8102","\u6F6E","\u7237","\u8C46","\u5FFD","\u6258","\u60CA","\u5851","\u9057","\u6108","\u6731","\u66FF","\u7EA4","\u7C97","\u503E","\u5C1A","\u75DB","\u695A","\u8C22","\u594B","\u8D2D","\u78E8","\u541B","\u6C60","\u65C1","\u788E","\u9AA8","\u76D1","\u6355","\u5F1F","\u66B4","\u5272","\u8D2F","\u6B8A","\u91CA","\u8BCD","\u4EA1","\u58C1","\u987F","\u5B9D","\u5348","\u5C18","\u95FB","\u63ED","\u70AE","\u6B8B","\u51AC","\u6865","\u5987","\u8B66","\u7EFC","\u62DB","\u5434","\u4ED8","\u6D6E","\u906D","\u5F90","\u60A8","\u6447","\u8C37","\u8D5E","\u7BB1","\u9694","\u8BA2","\u7537","\u5439","\u56ED","\u7EB7","\u5510","\u8D25","\u5B8B","\u73BB","\u5DE8","\u8015","\u5766","\u8363","\u95ED","\u6E7E","\u952E","\u51E1","\u9A7B","\u9505","\u6551","\u6069","\u5265","\u51DD","\u78B1","\u9F7F","\u622A","\u70BC","\u9EBB","\u7EBA","\u7981","\u5E9F","\u76DB","\u7248","\u7F13","\u51C0","\u775B","\u660C","\u5A5A","\u6D89","\u7B52","\u5634","\u63D2","\u5CB8","\u6717","\u5E84","\u8857","\u85CF","\u59D1","\u8D38","\u8150","\u5974","\u5566","\u60EF","\u4E58","\u4F19","\u6062","\u5300","\u7EB1","\u624E","\u8FA9","\u8033","\u5F6A","\u81E3","\u4EBF","\u7483","\u62B5","\u8109","\u79C0","\u8428","\u4FC4","\u7F51","\u821E","\u5E97","\u55B7","\u7EB5","\u5BF8","\u6C57","\u6302","\u6D2A","\u8D3A","\u95EA","\u67EC","\u7206","\u70EF","\u6D25","\u7A3B","\u5899","\u8F6F","\u52C7","\u50CF","\u6EDA","\u5398","\u8499","\u82B3","\u80AF","\u5761","\u67F1","\u8361","\u817F","\u4EEA","\u65C5","\u5C3E","\u8F67","\u51B0","\u8D21","\u767B","\u9ECE","\u524A","\u94BB","\u52D2","\u9003","\u969C","\u6C28","\u90ED","\u5CF0","\u5E01","\u6E2F","\u4F0F","\u8F68","\u4EA9","\u6BD5","\u64E6","\u83AB","\u523A","\u6D6A","\u79D8","\u63F4","\u682A","\u5065","\u552E","\u80A1","\u5C9B","\u7518","\u6CE1","\u7761","\u7AE5","\u94F8","\u6C64","\u9600","\u4F11","\u6C47","\u820D","\u7267","\u7ED5","\u70B8","\u54F2","\u78F7","\u7EE9","\u670B","\u6DE1","\u5C16","\u542F","\u9677","\u67F4","\u5448","\u5F92","\u989C","\u6CEA","\u7A0D","\u5FD8","\u6CF5","\u84DD","\u62D6","\u6D1E","\u6388","\u955C","\u8F9B","\u58EE","\u950B","\u8D2B","\u865A","\u5F2F","\u6469","\u6CF0","\u5E7C","\u5EF7","\u5C0A","\u7A97","\u7EB2","\u5F04","\u96B6","\u7591","\u6C0F","\u5BAB","\u59D0","\u9707","\u745E","\u602A","\u5C24","\u7434","\u5FAA","\u63CF","\u819C","\u8FDD","\u5939","\u8170","\u7F18","\u73E0","\u7A77","\u68EE","\u679D","\u7AF9","\u6C9F","\u50AC","\u7EF3","\u5FC6","\u90A6","\u5269","\u5E78","\u6D46","\u680F","\u62E5","\u7259","\u8D2E","\u793C","\u6EE4","\u94A0","\u7EB9","\u7F62","\u62CD","\u54B1","\u558A","\u8896","\u57C3","\u52E4","\u7F5A","\u7126","\u6F5C","\u4F0D","\u58A8","\u6B32","\u7F1D","\u59D3","\u520A","\u9971","\u4EFF","\u5956","\u94DD","\u9B3C","\u4E3D","\u8DE8","\u9ED8","\u6316","\u94FE","\u626B","\u559D","\u888B","\u70AD","\u6C61","\u5E55","\u8BF8","\u5F27","\u52B1","\u6885","\u5976","\u6D01","\u707E","\u821F","\u9274","\u82EF","\u8BBC","\u62B1","\u6BC1","\u61C2","\u5BD2","\u667A","\u57D4","\u5BC4","\u5C4A","\u8DC3","\u6E21","\u6311","\u4E39","\u8270","\u8D1D","\u78B0","\u62D4","\u7239","\u6234","\u7801","\u68A6","\u82BD","\u7194","\u8D64","\u6E14","\u54ED","\u656C","\u9897","\u5954","\u94C5","\u4EF2","\u864E","\u7A00","\u59B9","\u4E4F","\u73CD","\u7533","\u684C","\u9075","\u5141","\u9686","\u87BA","\u4ED3","\u9B4F","\u9510","\u6653","\u6C2E","\u517C","\u9690","\u788D","\u8D6B","\u62E8","\u5FE0","\u8083","\u7F38","\u7275","\u62A2","\u535A","\u5DE7","\u58F3","\u5144","\u675C","\u8BAF","\u8BDA","\u78A7","\u7965","\u67EF","\u9875","\u5DE1","\u77E9","\u60B2","\u704C","\u9F84","\u4F26","\u7968","\u5BFB","\u6842","\u94FA","\u5723","\u6050","\u6070","\u90D1","\u8DA3","\u62AC","\u8352","\u817E","\u8D34","\u67D4","\u6EF4","\u731B","\u9614","\u8F86","\u59BB","\u586B","\u64A4","\u50A8","\u7B7E","\u95F9","\u6270","\u7D2B","\u7802","\u9012","\u620F","\u540A","\u9676","\u4F10","\u5582","\u7597","\u74F6","\u5A46","\u629A","\u81C2","\u6478","\u5FCD","\u867E","\u8721","\u90BB","\u80F8","\u5DE9","\u6324","\u5076","\u5F03","\u69FD","\u52B2","\u4E73","\u9093","\u5409","\u4EC1","\u70C2","\u7816","\u79DF","\u4E4C","\u8230","\u4F34","\u74DC","\u6D45","\u4E19","\u6682","\u71E5","\u6A61","\u67F3","\u8FF7","\u6696","\u724C","\u79E7","\u80C6","\u8BE6","\u7C27","\u8E0F","\u74F7","\u8C31","\u5446","\u5BBE","\u7CCA","\u6D1B","\u8F89","\u6124","\u7ADE","\u9699","\u6012","\u7C98","\u4E43","\u7EEA","\u80A9","\u7C4D","\u654F","\u6D82","\u7199","\u7686","\u4FA6","\u60AC","\u6398","\u4EAB","\u7EA0","\u9192","\u72C2","\u9501","\u6DC0","\u6068","\u7272","\u9738","\u722C","\u8D4F","\u9006","\u73A9","\u9675","\u795D","\u79D2","\u6D59","\u8C8C","\u5F79","\u5F7C","\u6089","\u9E2D","\u8D8B","\u51E4","\u6668","\u755C","\u8F88","\u79E9","\u5375","\u7F72","\u68AF","\u708E","\u6EE9","\u68CB","\u9A71","\u7B5B","\u5CE1","\u5192","\u5565","\u5BFF","\u8BD1","\u6D78","\u6CC9","\u5E3D","\u8FDF","\u7845","\u7586","\u8D37","\u6F0F","\u7A3F","\u51A0","\u5AE9","\u80C1","\u82AF","\u7262","\u53DB","\u8680","\u5965","\u9E23","\u5CAD","\u7F8A","\u51ED","\u4E32","\u5858","\u7ED8","\u9175","\u878D","\u76C6","\u9521","\u5E99","\u7B79","\u51BB","\u8F85","\u6444","\u88AD","\u7B4B","\u62D2","\u50DA","\u65F1","\u94BE","\u9E1F","\u6F06","\u6C88","\u7709","\u758F","\u6DFB","\u68D2","\u7A57","\u785D","\u97E9","\u903C","\u626D","\u4FA8","\u51C9","\u633A","\u7897","\u683D","\u7092","\u676F","\u60A3","\u998F","\u529D","\u8C6A","\u8FBD","\u52C3","\u9E3F","\u65E6","\u540F","\u62DC","\u72D7","\u57CB","\u8F8A","\u63A9","\u996E","\u642C","\u9A82","\u8F9E","\u52FE","\u6263","\u4F30","\u848B","\u7ED2","\u96FE","\u4E08","\u6735","\u59C6","\u62DF","\u5B87","\u8F91","\u9655","\u96D5","\u507F","\u84C4","\u5D07","\u526A","\u5021","\u5385","\u54AC","\u9A76","\u85AF","\u5237","\u65A5","\u756A","\u8D4B","\u5949","\u4F5B","\u6D47","\u6F2B","\u66FC","\u6247","\u9499","\u6843","\u6276","\u4ED4","\u8FD4","\u4FD7","\u4E8F","\u8154","\u978B","\u68F1","\u8986","\u6846","\u6084","\u53D4","\u649E","\u9A97","\u52D8","\u65FA","\u6CB8","\u5B64","\u5410","\u5B5F","\u6E20","\u5C48","\u75BE","\u5999","\u60DC","\u4EF0","\u72E0","\u80C0","\u8C10","\u629B","\u9709","\u6851","\u5C97","\u561B","\u8870","\u76D7","\u6E17","\u810F","\u8D56","\u6D8C","\u751C","\u66F9","\u9605","\u808C","\u54E9","\u5389","\u70C3","\u7EAC","\u6BC5","\u6628","\u4F2A","\u75C7","\u716E","\u53F9","\u9489","\u642D","\u830E","\u7B3C","\u9177","\u5077","\u5F13","\u9525","\u6052","\u6770","\u5751","\u9F3B","\u7FFC","\u7EB6","\u53D9","\u72F1","\u902E","\u7F50","\u7EDC","\u68DA","\u6291","\u81A8","\u852C","\u5BFA","\u9AA4","\u7A46","\u51B6","\u67AF","\u518C","\u5C38","\u51F8","\u7EC5","\u576F","\u727A","\u7130","\u8F70","\u6B23","\u664B","\u7626","\u5FA1","\u952D","\u9526","\u4E27","\u65EC","\u953B","\u5784","\u641C","\u6251","\u9080","\u4EAD","\u916F","\u8FC8","\u8212","\u8106","\u9176","\u95F2","\u5FE7","\u915A","\u987D","\u7FBD","\u6DA8","\u5378","\u4ED7","\u966A","\u8F9F","\u60E9","\u676D","\u59DA","\u809A","\u6349","\u98D8","\u6F02","\u6606","\u6B3A","\u543E","\u90CE","\u70F7","\u6C41","\u5475","\u9970","\u8427","\u96C5","\u90AE","\u8FC1","\u71D5","\u6492","\u59FB","\u8D74","\u5BB4","\u70E6","\u503A","\u5E10","\u6591","\u94C3","\u65E8","\u9187","\u8463","\u997C","\u96CF","\u59FF","\u62CC","\u5085","\u8179","\u59A5","\u63C9","\u8D24","\u62C6","\u6B6A","\u8461","\u80FA","\u4E22","\u6D69","\u5FBD","\u6602","\u57AB","\u6321","\u89C8","\u8D2A","\u6170","\u7F34","\u6C6A","\u614C","\u51AF","\u8BFA","\u59DC","\u8C0A","\u51F6","\u52A3","\u8BEC","\u8000","\u660F","\u8EBA","\u76C8","\u9A91","\u4E54","\u6EAA","\u4E1B","\u5362","\u62B9","\u95F7","\u54A8","\u522E","\u9A7E","\u7F06","\u609F","\u6458","\u94D2","\u63B7","\u9887","\u5E7B","\u67C4","\u60E0","\u60E8","\u4F73","\u4EC7","\u814A","\u7A9D","\u6DA4","\u5251","\u77A7","\u5821","\u6CFC","\u8471","\u7F69","\u970D","\u635E","\u80CE","\u82CD","\u6EE8","\u4FE9","\u6345","\u6E58","\u780D","\u971E","\u90B5","\u8404","\u75AF","\u6DEE","\u9042","\u718A","\u7CAA","\u70D8","\u5BBF","\u6863","\u6208","\u9A73","\u5AC2","\u88D5","\u5F99","\u7BAD","\u6350","\u80A0","\u6491","\u6652","\u8FA8","\u6BBF","\u83B2","\u644A","\u6405","\u9171","\u5C4F","\u75AB","\u54C0","\u8521","\u5835","\u6CAB","\u76B1","\u7545","\u53E0","\u9601","\u83B1","\u6572","\u8F96","\u94A9","\u75D5","\u575D","\u5DF7","\u997F","\u7978","\u4E18","\u7384","\u6E9C","\u66F0","\u903B","\u5F6D","\u5C1D","\u537F","\u59A8","\u8247","\u541E","\u97E6","\u6028","\u77EE","\u6B47"]'), $l = JSON.parse('["\u7684","\u4E00","\u662F","\u5728","\u4E0D","\u4E86","\u6709","\u548C","\u4EBA","\u9019","\u4E2D","\u5927","\u70BA","\u4E0A","\u500B","\u570B","\u6211","\u4EE5","\u8981","\u4ED6","\u6642","\u4F86","\u7528","\u5011","\u751F","\u5230","\u4F5C","\u5730","\u65BC","\u51FA","\u5C31","\u5206","\u5C0D","\u6210","\u6703","\u53EF","\u4E3B","\u767C","\u5E74","\u52D5","\u540C","\u5DE5","\u4E5F","\u80FD","\u4E0B","\u904E","\u5B50","\u8AAA","\u7522","\u7A2E","\u9762","\u800C","\u65B9","\u5F8C","\u591A","\u5B9A","\u884C","\u5B78","\u6CD5","\u6240","\u6C11","\u5F97","\u7D93","\u5341","\u4E09","\u4E4B","\u9032","\u8457","\u7B49","\u90E8","\u5EA6","\u5BB6","\u96FB","\u529B","\u88E1","\u5982","\u6C34","\u5316","\u9AD8","\u81EA","\u4E8C","\u7406","\u8D77","\u5C0F","\u7269","\u73FE","\u5BE6","\u52A0","\u91CF","\u90FD","\u5169","\u9AD4","\u5236","\u6A5F","\u7576","\u4F7F","\u9EDE","\u5F9E","\u696D","\u672C","\u53BB","\u628A","\u6027","\u597D","\u61C9","\u958B","\u5B83","\u5408","\u9084","\u56E0","\u7531","\u5176","\u4E9B","\u7136","\u524D","\u5916","\u5929","\u653F","\u56DB","\u65E5","\u90A3","\u793E","\u7FA9","\u4E8B","\u5E73","\u5F62","\u76F8","\u5168","\u8868","\u9593","\u6A23","\u8207","\u95DC","\u5404","\u91CD","\u65B0","\u7DDA","\u5167","\u6578","\u6B63","\u5FC3","\u53CD","\u4F60","\u660E","\u770B","\u539F","\u53C8","\u9EBC","\u5229","\u6BD4","\u6216","\u4F46","\u8CEA","\u6C23","\u7B2C","\u5411","\u9053","\u547D","\u6B64","\u8B8A","\u689D","\u53EA","\u6C92","\u7D50","\u89E3","\u554F","\u610F","\u5EFA","\u6708","\u516C","\u7121","\u7CFB","\u8ECD","\u5F88","\u60C5","\u8005","\u6700","\u7ACB","\u4EE3","\u60F3","\u5DF2","\u901A","\u4E26","\u63D0","\u76F4","\u984C","\u9EE8","\u7A0B","\u5C55","\u4E94","\u679C","\u6599","\u8C61","\u54E1","\u9769","\u4F4D","\u5165","\u5E38","\u6587","\u7E3D","\u6B21","\u54C1","\u5F0F","\u6D3B","\u8A2D","\u53CA","\u7BA1","\u7279","\u4EF6","\u9577","\u6C42","\u8001","\u982D","\u57FA","\u8CC7","\u908A","\u6D41","\u8DEF","\u7D1A","\u5C11","\u5716","\u5C71","\u7D71","\u63A5","\u77E5","\u8F03","\u5C07","\u7D44","\u898B","\u8A08","\u5225","\u5979","\u624B","\u89D2","\u671F","\u6839","\u8AD6","\u904B","\u8FB2","\u6307","\u5E7E","\u4E5D","\u5340","\u5F37","\u653E","\u6C7A","\u897F","\u88AB","\u5E79","\u505A","\u5FC5","\u6230","\u5148","\u56DE","\u5247","\u4EFB","\u53D6","\u64DA","\u8655","\u968A","\u5357","\u7D66","\u8272","\u5149","\u9580","\u5373","\u4FDD","\u6CBB","\u5317","\u9020","\u767E","\u898F","\u71B1","\u9818","\u4E03","\u6D77","\u53E3","\u6771","\u5C0E","\u5668","\u58D3","\u5FD7","\u4E16","\u91D1","\u589E","\u722D","\u6FDF","\u968E","\u6CB9","\u601D","\u8853","\u6975","\u4EA4","\u53D7","\u806F","\u4EC0","\u8A8D","\u516D","\u5171","\u6B0A","\u6536","\u8B49","\u6539","\u6E05","\u7F8E","\u518D","\u63A1","\u8F49","\u66F4","\u55AE","\u98A8","\u5207","\u6253","\u767D","\u6559","\u901F","\u82B1","\u5E36","\u5B89","\u5834","\u8EAB","\u8ECA","\u4F8B","\u771F","\u52D9","\u5177","\u842C","\u6BCF","\u76EE","\u81F3","\u9054","\u8D70","\u7A4D","\u793A","\u8B70","\u8072","\u5831","\u9B25","\u5B8C","\u985E","\u516B","\u96E2","\u83EF","\u540D","\u78BA","\u624D","\u79D1","\u5F35","\u4FE1","\u99AC","\u7BC0","\u8A71","\u7C73","\u6574","\u7A7A","\u5143","\u6CC1","\u4ECA","\u96C6","\u6EAB","\u50B3","\u571F","\u8A31","\u6B65","\u7FA4","\u5EE3","\u77F3","\u8A18","\u9700","\u6BB5","\u7814","\u754C","\u62C9","\u6797","\u5F8B","\u53EB","\u4E14","\u7A76","\u89C0","\u8D8A","\u7E54","\u88DD","\u5F71","\u7B97","\u4F4E","\u6301","\u97F3","\u773E","\u66F8","\u5E03","\u590D","\u5BB9","\u5152","\u9808","\u969B","\u5546","\u975E","\u9A57","\u9023","\u65B7","\u6DF1","\u96E3","\u8FD1","\u7926","\u5343","\u9031","\u59D4","\u7D20","\u6280","\u5099","\u534A","\u8FA6","\u9752","\u7701","\u5217","\u7FD2","\u97FF","\u7D04","\u652F","\u822C","\u53F2","\u611F","\u52DE","\u4FBF","\u5718","\u5F80","\u9178","\u6B77","\u5E02","\u514B","\u4F55","\u9664","\u6D88","\u69CB","\u5E9C","\u7A31","\u592A","\u6E96","\u7CBE","\u503C","\u865F","\u7387","\u65CF","\u7DAD","\u5283","\u9078","\u6A19","\u5BEB","\u5B58","\u5019","\u6BDB","\u89AA","\u5FEB","\u6548","\u65AF","\u9662","\u67E5","\u6C5F","\u578B","\u773C","\u738B","\u6309","\u683C","\u990A","\u6613","\u7F6E","\u6D3E","\u5C64","\u7247","\u59CB","\u537B","\u5C08","\u72C0","\u80B2","\u5EE0","\u4EAC","\u8B58","\u9069","\u5C6C","\u5713","\u5305","\u706B","\u4F4F","\u8ABF","\u6EFF","\u7E23","\u5C40","\u7167","\u53C3","\u7D05","\u7D30","\u5F15","\u807D","\u8A72","\u9435","\u50F9","\u56B4","\u9996","\u5E95","\u6DB2","\u5B98","\u5FB7","\u96A8","\u75C5","\u8607","\u5931","\u723E","\u6B7B","\u8B1B","\u914D","\u5973","\u9EC3","\u63A8","\u986F","\u8AC7","\u7F6A","\u795E","\u85DD","\u5462","\u5E2D","\u542B","\u4F01","\u671B","\u5BC6","\u6279","\u71DF","\u9805","\u9632","\u8209","\u7403","\u82F1","\u6C27","\u52E2","\u544A","\u674E","\u53F0","\u843D","\u6728","\u5E6B","\u8F2A","\u7834","\u4E9E","\u5E2B","\u570D","\u6CE8","\u9060","\u5B57","\u6750","\u6392","\u4F9B","\u6CB3","\u614B","\u5C01","\u53E6","\u65BD","\u6E1B","\u6A39","\u6EB6","\u600E","\u6B62","\u6848","\u8A00","\u58EB","\u5747","\u6B66","\u56FA","\u8449","\u9B5A","\u6CE2","\u8996","\u50C5","\u8CBB","\u7DCA","\u611B","\u5DE6","\u7AE0","\u65E9","\u671D","\u5BB3","\u7E8C","\u8F15","\u670D","\u8A66","\u98DF","\u5145","\u5175","\u6E90","\u5224","\u8B77","\u53F8","\u8DB3","\u67D0","\u7DF4","\u5DEE","\u81F4","\u677F","\u7530","\u964D","\u9ED1","\u72AF","\u8CA0","\u64CA","\u8303","\u7E7C","\u8208","\u4F3C","\u9918","\u5805","\u66F2","\u8F38","\u4FEE","\u6545","\u57CE","\u592B","\u5920","\u9001","\u7B46","\u8239","\u4F54","\u53F3","\u8CA1","\u5403","\u5BCC","\u6625","\u8077","\u89BA","\u6F22","\u756B","\u529F","\u5DF4","\u8DDF","\u96D6","\u96DC","\u98DB","\u6AA2","\u5438","\u52A9","\u6607","\u967D","\u4E92","\u521D","\u5275","\u6297","\u8003","\u6295","\u58DE","\u7B56","\u53E4","\u5F91","\u63DB","\u672A","\u8DD1","\u7559","\u92FC","\u66FE","\u7AEF","\u8CAC","\u7AD9","\u7C21","\u8FF0","\u9322","\u526F","\u76E1","\u5E1D","\u5C04","\u8349","\u885D","\u627F","\u7368","\u4EE4","\u9650","\u963F","\u5BA3","\u74B0","\u96D9","\u8ACB","\u8D85","\u5FAE","\u8B93","\u63A7","\u5DDE","\u826F","\u8EF8","\u627E","\u5426","\u7D00","\u76CA","\u4F9D","\u512A","\u9802","\u790E","\u8F09","\u5012","\u623F","\u7A81","\u5750","\u7C89","\u6575","\u7565","\u5BA2","\u8881","\u51B7","\u52DD","\u7D55","\u6790","\u584A","\u5291","\u6E2C","\u7D72","\u5354","\u8A34","\u5FF5","\u9673","\u4ECD","\u7F85","\u9E7D","\u53CB","\u6D0B","\u932F","\u82E6","\u591C","\u5211","\u79FB","\u983B","\u9010","\u9760","\u6DF7","\u6BCD","\u77ED","\u76AE","\u7D42","\u805A","\u6C7D","\u6751","\u96F2","\u54EA","\u65E2","\u8DDD","\u885B","\u505C","\u70C8","\u592E","\u5BDF","\u71D2","\u8FC5","\u5883","\u82E5","\u5370","\u6D32","\u523B","\u62EC","\u6FC0","\u5B54","\u641E","\u751A","\u5BA4","\u5F85","\u6838","\u6821","\u6563","\u4FB5","\u5427","\u7532","\u904A","\u4E45","\u83DC","\u5473","\u820A","\u6A21","\u6E56","\u8CA8","\u640D","\u9810","\u963B","\u6BEB","\u666E","\u7A69","\u4E59","\u5ABD","\u690D","\u606F","\u64F4","\u9280","\u8A9E","\u63EE","\u9152","\u5B88","\u62FF","\u5E8F","\u7D19","\u91AB","\u7F3A","\u96E8","\u55CE","\u91DD","\u5289","\u554A","\u6025","\u5531","\u8AA4","\u8A13","\u9858","\u5BE9","\u9644","\u7372","\u8336","\u9BAE","\u7CE7","\u65A4","\u5B69","\u812B","\u786B","\u80A5","\u5584","\u9F8D","\u6F14","\u7236","\u6F38","\u8840","\u6B61","\u68B0","\u638C","\u6B4C","\u6C99","\u525B","\u653B","\u8B02","\u76FE","\u8A0E","\u665A","\u7C92","\u4E82","\u71C3","\u77DB","\u4E4E","\u6BBA","\u85E5","\u5BE7","\u9B6F","\u8CB4","\u9418","\u7164","\u8B80","\u73ED","\u4F2F","\u9999","\u4ECB","\u8FEB","\u53E5","\u8C50","\u57F9","\u63E1","\u862D","\u64D4","\u5F26","\u86CB","\u6C89","\u5047","\u7A7F","\u57F7","\u7B54","\u6A02","\u8AB0","\u9806","\u7159","\u7E2E","\u5FB5","\u81C9","\u559C","\u677E","\u8173","\u56F0","\u7570","\u514D","\u80CC","\u661F","\u798F","\u8CB7","\u67D3","\u4E95","\u6982","\u6162","\u6015","\u78C1","\u500D","\u7956","\u7687","\u4FC3","\u975C","\u88DC","\u8A55","\u7FFB","\u8089","\u8E10","\u5C3C","\u8863","\u5BEC","\u63DA","\u68C9","\u5E0C","\u50B7","\u64CD","\u5782","\u79CB","\u5B9C","\u6C2B","\u5957","\u7763","\u632F","\u67B6","\u4EAE","\u672B","\u61B2","\u6176","\u7DE8","\u725B","\u89F8","\u6620","\u96F7","\u92B7","\u8A69","\u5EA7","\u5C45","\u6293","\u88C2","\u80DE","\u547C","\u5A18","\u666F","\u5A01","\u7DA0","\u6676","\u539A","\u76DF","\u8861","\u96DE","\u5B6B","\u5EF6","\u5371","\u81A0","\u5C4B","\u9109","\u81E8","\u9678","\u9867","\u6389","\u5440","\u71C8","\u6B72","\u63AA","\u675F","\u8010","\u5287","\u7389","\u8D99","\u8DF3","\u54E5","\u5B63","\u8AB2","\u51F1","\u80E1","\u984D","\u6B3E","\u7D39","\u5377","\u9F4A","\u5049","\u84B8","\u6B96","\u6C38","\u5B97","\u82D7","\u5DDD","\u7210","\u5CA9","\u5F31","\u96F6","\u694A","\u594F","\u6CBF","\u9732","\u687F","\u63A2","\u6ED1","\u93AE","\u98EF","\u6FC3","\u822A","\u61F7","\u8D95","\u5EAB","\u596A","\u4F0A","\u9748","\u7A05","\u9014","\u6EC5","\u8CFD","\u6B78","\u53EC","\u9F13","\u64AD","\u76E4","\u88C1","\u96AA","\u5EB7","\u552F","\u9304","\u83CC","\u7D14","\u501F","\u7CD6","\u84CB","\u6A6B","\u7B26","\u79C1","\u52AA","\u5802","\u57DF","\u69CD","\u6F64","\u5E45","\u54C8","\u7ADF","\u719F","\u87F2","\u6FA4","\u8166","\u58E4","\u78B3","\u6B50","\u904D","\u5074","\u5BE8","\u6562","\u5FB9","\u616E","\u659C","\u8584","\u5EAD","\u7D0D","\u5F48","\u98FC","\u4F38","\u6298","\u9EA5","\u6FD5","\u6697","\u8377","\u74E6","\u585E","\u5E8A","\u7BC9","\u60E1","\u6236","\u8A2A","\u5854","\u5947","\u900F","\u6881","\u5200","\u65CB","\u8DE1","\u5361","\u6C2F","\u9047","\u4EFD","\u6BD2","\u6CE5","\u9000","\u6D17","\u64FA","\u7070","\u5F69","\u8CE3","\u8017","\u590F","\u64C7","\u5FD9","\u9285","\u737B","\u786C","\u4E88","\u7E41","\u5708","\u96EA","\u51FD","\u4EA6","\u62BD","\u7BC7","\u9663","\u9670","\u4E01","\u5C3A","\u8FFD","\u5806","\u96C4","\u8FCE","\u6CDB","\u7238","\u6A13","\u907F","\u8B00","\u5678","\u91CE","\u8C6C","\u65D7","\u7D2F","\u504F","\u5178","\u9928","\u7D22","\u79E6","\u8102","\u6F6E","\u723A","\u8C46","\u5FFD","\u6258","\u9A5A","\u5851","\u907A","\u6108","\u6731","\u66FF","\u7E96","\u7C97","\u50BE","\u5C1A","\u75DB","\u695A","\u8B1D","\u596E","\u8CFC","\u78E8","\u541B","\u6C60","\u65C1","\u788E","\u9AA8","\u76E3","\u6355","\u5F1F","\u66B4","\u5272","\u8CAB","\u6B8A","\u91CB","\u8A5E","\u4EA1","\u58C1","\u9813","\u5BF6","\u5348","\u5875","\u805E","\u63ED","\u70AE","\u6B98","\u51AC","\u6A4B","\u5A66","\u8B66","\u7D9C","\u62DB","\u5433","\u4ED8","\u6D6E","\u906D","\u5F90","\u60A8","\u6416","\u8C37","\u8D0A","\u7BB1","\u9694","\u8A02","\u7537","\u5439","\u5712","\u7D1B","\u5510","\u6557","\u5B8B","\u73BB","\u5DE8","\u8015","\u5766","\u69AE","\u9589","\u7063","\u9375","\u51E1","\u99D0","\u934B","\u6551","\u6069","\u525D","\u51DD","\u9E7C","\u9F52","\u622A","\u7149","\u9EBB","\u7D21","\u7981","\u5EE2","\u76DB","\u7248","\u7DE9","\u6DE8","\u775B","\u660C","\u5A5A","\u6D89","\u7B52","\u5634","\u63D2","\u5CB8","\u6717","\u838A","\u8857","\u85CF","\u59D1","\u8CBF","\u8150","\u5974","\u5566","\u6163","\u4E58","\u5925","\u6062","\u52FB","\u7D17","\u624E","\u8FAF","\u8033","\u5F6A","\u81E3","\u5104","\u7483","\u62B5","\u8108","\u79C0","\u85A9","\u4FC4","\u7DB2","\u821E","\u5E97","\u5674","\u7E31","\u5BF8","\u6C57","\u639B","\u6D2A","\u8CC0","\u9583","\u67EC","\u7206","\u70EF","\u6D25","\u7A3B","\u7246","\u8EDF","\u52C7","\u50CF","\u6EFE","\u5398","\u8499","\u82B3","\u80AF","\u5761","\u67F1","\u76EA","\u817F","\u5100","\u65C5","\u5C3E","\u8ECB","\u51B0","\u8CA2","\u767B","\u9ECE","\u524A","\u947D","\u52D2","\u9003","\u969C","\u6C28","\u90ED","\u5CF0","\u5E63","\u6E2F","\u4F0F","\u8ECC","\u755D","\u7562","\u64E6","\u83AB","\u523A","\u6D6A","\u79D8","\u63F4","\u682A","\u5065","\u552E","\u80A1","\u5CF6","\u7518","\u6CE1","\u7761","\u7AE5","\u9444","\u6E6F","\u95A5","\u4F11","\u532F","\u820D","\u7267","\u7E5E","\u70B8","\u54F2","\u78F7","\u7E3E","\u670B","\u6DE1","\u5C16","\u555F","\u9677","\u67F4","\u5448","\u5F92","\u984F","\u6DDA","\u7A0D","\u5FD8","\u6CF5","\u85CD","\u62D6","\u6D1E","\u6388","\u93E1","\u8F9B","\u58EF","\u92D2","\u8CA7","\u865B","\u5F4E","\u6469","\u6CF0","\u5E7C","\u5EF7","\u5C0A","\u7A97","\u7DB1","\u5F04","\u96B8","\u7591","\u6C0F","\u5BAE","\u59D0","\u9707","\u745E","\u602A","\u5C24","\u7434","\u5FAA","\u63CF","\u819C","\u9055","\u593E","\u8170","\u7DE3","\u73E0","\u7AAE","\u68EE","\u679D","\u7AF9","\u6E9D","\u50AC","\u7E69","\u61B6","\u90A6","\u5269","\u5E78","\u6F3F","\u6B04","\u64C1","\u7259","\u8CAF","\u79AE","\u6FFE","\u9209","\u7D0B","\u7F77","\u62CD","\u54B1","\u558A","\u8896","\u57C3","\u52E4","\u7F70","\u7126","\u6F5B","\u4F0D","\u58A8","\u6B32","\u7E2B","\u59D3","\u520A","\u98FD","\u4EFF","\u734E","\u92C1","\u9B3C","\u9E97","\u8DE8","\u9ED8","\u6316","\u93C8","\u6383","\u559D","\u888B","\u70AD","\u6C61","\u5E55","\u8AF8","\u5F27","\u52F5","\u6885","\u5976","\u6F54","\u707D","\u821F","\u9451","\u82EF","\u8A1F","\u62B1","\u6BC0","\u61C2","\u5BD2","\u667A","\u57D4","\u5BC4","\u5C46","\u8E8D","\u6E21","\u6311","\u4E39","\u8271","\u8C9D","\u78B0","\u62D4","\u7239","\u6234","\u78BC","\u5922","\u82BD","\u7194","\u8D64","\u6F01","\u54ED","\u656C","\u9846","\u5954","\u925B","\u4EF2","\u864E","\u7A00","\u59B9","\u4E4F","\u73CD","\u7533","\u684C","\u9075","\u5141","\u9686","\u87BA","\u5009","\u9B4F","\u92B3","\u66C9","\u6C2E","\u517C","\u96B1","\u7919","\u8D6B","\u64A5","\u5FE0","\u8085","\u7F38","\u727D","\u6436","\u535A","\u5DE7","\u6BBC","\u5144","\u675C","\u8A0A","\u8AA0","\u78A7","\u7965","\u67EF","\u9801","\u5DE1","\u77E9","\u60B2","\u704C","\u9F61","\u502B","\u7968","\u5C0B","\u6842","\u92EA","\u8056","\u6050","\u6070","\u912D","\u8DA3","\u62AC","\u8352","\u9A30","\u8CBC","\u67D4","\u6EF4","\u731B","\u95CA","\u8F1B","\u59BB","\u586B","\u64A4","\u5132","\u7C3D","\u9B27","\u64FE","\u7D2B","\u7802","\u905E","\u6232","\u540A","\u9676","\u4F10","\u9935","\u7642","\u74F6","\u5A46","\u64AB","\u81C2","\u6478","\u5FCD","\u8766","\u881F","\u9130","\u80F8","\u978F","\u64E0","\u5076","\u68C4","\u69FD","\u52C1","\u4E73","\u9127","\u5409","\u4EC1","\u721B","\u78DA","\u79DF","\u70CF","\u8266","\u4F34","\u74DC","\u6DFA","\u4E19","\u66AB","\u71E5","\u6A61","\u67F3","\u8FF7","\u6696","\u724C","\u79E7","\u81BD","\u8A73","\u7C27","\u8E0F","\u74F7","\u8B5C","\u5446","\u8CD3","\u7CCA","\u6D1B","\u8F1D","\u61A4","\u7AF6","\u9699","\u6012","\u7C98","\u4E43","\u7DD2","\u80A9","\u7C4D","\u654F","\u5857","\u7199","\u7686","\u5075","\u61F8","\u6398","\u4EAB","\u7CFE","\u9192","\u72C2","\u9396","\u6DC0","\u6068","\u7272","\u9738","\u722C","\u8CDE","\u9006","\u73A9","\u9675","\u795D","\u79D2","\u6D59","\u8C8C","\u5F79","\u5F7C","\u6089","\u9D28","\u8DA8","\u9CF3","\u6668","\u755C","\u8F29","\u79E9","\u5375","\u7F72","\u68AF","\u708E","\u7058","\u68CB","\u9A45","\u7BE9","\u5CFD","\u5192","\u5565","\u58FD","\u8B6F","\u6D78","\u6CC9","\u5E3D","\u9072","\u77FD","\u7586","\u8CB8","\u6F0F","\u7A3F","\u51A0","\u5AE9","\u8105","\u82AF","\u7262","\u53DB","\u8755","\u5967","\u9CF4","\u5DBA","\u7F8A","\u6191","\u4E32","\u5858","\u7E6A","\u9175","\u878D","\u76C6","\u932B","\u5EDF","\u7C4C","\u51CD","\u8F14","\u651D","\u8972","\u7B4B","\u62D2","\u50DA","\u65F1","\u9240","\u9CE5","\u6F06","\u6C88","\u7709","\u758F","\u6DFB","\u68D2","\u7A57","\u785D","\u97D3","\u903C","\u626D","\u50D1","\u6DBC","\u633A","\u7897","\u683D","\u7092","\u676F","\u60A3","\u993E","\u52F8","\u8C6A","\u907C","\u52C3","\u9D3B","\u65E6","\u540F","\u62DC","\u72D7","\u57CB","\u8F25","\u63A9","\u98F2","\u642C","\u7F75","\u8FAD","\u52FE","\u6263","\u4F30","\u8523","\u7D68","\u9727","\u4E08","\u6735","\u59C6","\u64EC","\u5B87","\u8F2F","\u965D","\u96D5","\u511F","\u84C4","\u5D07","\u526A","\u5021","\u5EF3","\u54AC","\u99DB","\u85AF","\u5237","\u65A5","\u756A","\u8CE6","\u5949","\u4F5B","\u6F86","\u6F2B","\u66FC","\u6247","\u9223","\u6843","\u6276","\u4ED4","\u8FD4","\u4FD7","\u8667","\u8154","\u978B","\u68F1","\u8986","\u6846","\u6084","\u53D4","\u649E","\u9A19","\u52D8","\u65FA","\u6CB8","\u5B64","\u5410","\u5B5F","\u6E20","\u5C48","\u75BE","\u5999","\u60DC","\u4EF0","\u72E0","\u8139","\u8AE7","\u62CB","\u9EF4","\u6851","\u5D17","\u561B","\u8870","\u76DC","\u6EF2","\u81DF","\u8CF4","\u6E67","\u751C","\u66F9","\u95B1","\u808C","\u54E9","\u53B2","\u70F4","\u7DEF","\u6BC5","\u6628","\u507D","\u75C7","\u716E","\u5606","\u91D8","\u642D","\u8396","\u7C60","\u9177","\u5077","\u5F13","\u9310","\u6046","\u5091","\u5751","\u9F3B","\u7FFC","\u7DB8","\u6558","\u7344","\u902E","\u7F50","\u7D61","\u68DA","\u6291","\u81A8","\u852C","\u5BFA","\u9A5F","\u7A46","\u51B6","\u67AF","\u518A","\u5C4D","\u51F8","\u7D33","\u576F","\u72A7","\u7130","\u8F5F","\u6B23","\u6649","\u7626","\u79A6","\u9320","\u9326","\u55AA","\u65EC","\u935B","\u58DF","\u641C","\u64B2","\u9080","\u4EAD","\u916F","\u9081","\u8212","\u8106","\u9176","\u9592","\u6182","\u915A","\u9811","\u7FBD","\u6F32","\u5378","\u4ED7","\u966A","\u95E2","\u61F2","\u676D","\u59DA","\u809A","\u6349","\u98C4","\u6F02","\u6606","\u6B3A","\u543E","\u90CE","\u70F7","\u6C41","\u5475","\u98FE","\u856D","\u96C5","\u90F5","\u9077","\u71D5","\u6492","\u59FB","\u8D74","\u5BB4","\u7169","\u50B5","\u5E33","\u6591","\u9234","\u65E8","\u9187","\u8463","\u9905","\u96DB","\u59FF","\u62CC","\u5085","\u8179","\u59A5","\u63C9","\u8CE2","\u62C6","\u6B6A","\u8461","\u80FA","\u4E1F","\u6D69","\u5FBD","\u6602","\u588A","\u64CB","\u89BD","\u8CAA","\u6170","\u7E73","\u6C6A","\u614C","\u99AE","\u8AFE","\u59DC","\u8ABC","\u5147","\u52A3","\u8AA3","\u8000","\u660F","\u8EBA","\u76C8","\u9A0E","\u55AC","\u6EAA","\u53E2","\u76E7","\u62B9","\u60B6","\u8AEE","\u522E","\u99D5","\u7E9C","\u609F","\u6458","\u927A","\u64F2","\u9817","\u5E7B","\u67C4","\u60E0","\u6158","\u4F73","\u4EC7","\u81D8","\u7AA9","\u6ECC","\u528D","\u77A7","\u5821","\u6F51","\u8525","\u7F69","\u970D","\u6488","\u80CE","\u84BC","\u6FF1","\u5006","\u6345","\u6E58","\u780D","\u971E","\u90B5","\u8404","\u760B","\u6DEE","\u9042","\u718A","\u7CDE","\u70D8","\u5BBF","\u6A94","\u6208","\u99C1","\u5AC2","\u88D5","\u5F99","\u7BAD","\u6350","\u8178","\u6490","\u66EC","\u8FA8","\u6BBF","\u84EE","\u6524","\u652A","\u91AC","\u5C4F","\u75AB","\u54C0","\u8521","\u5835","\u6CAB","\u76BA","\u66A2","\u758A","\u95A3","\u840A","\u6572","\u8F44","\u9264","\u75D5","\u58E9","\u5DF7","\u9913","\u798D","\u4E18","\u7384","\u6E9C","\u66F0","\u908F","\u5F6D","\u5617","\u537F","\u59A8","\u8247","\u541E","\u97CB","\u6028","\u77EE","\u6B47"]'), ef = JSON.parse('["\u1100\u1161\u1100\u1167\u11A8","\u1100\u1161\u1101\u1173\u11B7","\u1100\u1161\u1102\u1161\u11AB","\u1100\u1161\u1102\u1173\u11BC","\u1100\u1161\u1103\u1173\u11A8","\u1100\u1161\u1105\u1173\u110E\u1175\u11B7","\u1100\u1161\u1106\u116E\u11B7","\u1100\u1161\u1107\u1161\u11BC","\u1100\u1161\u1109\u1161\u11BC","\u1100\u1161\u1109\u1173\u11B7","\u1100\u1161\u110B\u116E\u11AB\u1103\u1166","\u1100\u1161\u110B\u1173\u11AF","\u1100\u1161\u110B\u1175\u1103\u1173","\u1100\u1161\u110B\u1175\u11B8","\u1100\u1161\u110C\u1161\u11BC","\u1100\u1161\u110C\u1165\u11BC","\u1100\u1161\u110C\u1169\u11A8","\u1100\u1161\u110C\u116E\u11A8","\u1100\u1161\u11A8\u110B\u1169","\u1100\u1161\u11A8\u110C\u1161","\u1100\u1161\u11AB\u1100\u1167\u11A8","\u1100\u1161\u11AB\u1107\u116E","\u1100\u1161\u11AB\u1109\u1165\u11B8","\u1100\u1161\u11AB\u110C\u1161\u11BC","\u1100\u1161\u11AB\u110C\u1165\u11B8","\u1100\u1161\u11AB\u1111\u1161\u11AB","\u1100\u1161\u11AF\u1103\u1173\u11BC","\u1100\u1161\u11AF\u1107\u1175","\u1100\u1161\u11AF\u1109\u1162\u11A8","\u1100\u1161\u11AF\u110C\u1173\u11BC","\u1100\u1161\u11B7\u1100\u1161\u11A8","\u1100\u1161\u11B7\u1100\u1175","\u1100\u1161\u11B7\u1109\u1169","\u1100\u1161\u11B7\u1109\u116E\u1109\u1165\u11BC","\u1100\u1161\u11B7\u110C\u1161","\u1100\u1161\u11B7\u110C\u1165\u11BC","\u1100\u1161\u11B8\u110C\u1161\u1100\u1175","\u1100\u1161\u11BC\u1102\u1161\u11B7","\u1100\u1161\u11BC\u1103\u1161\u11BC","\u1100\u1161\u11BC\u1103\u1169","\u1100\u1161\u11BC\u1105\u1167\u11A8\u1112\u1175","\u1100\u1161\u11BC\u1107\u1167\u11AB","\u1100\u1161\u11BC\u1107\u116E\u11A8","\u1100\u1161\u11BC\u1109\u1161","\u1100\u1161\u11BC\u1109\u116E\u1105\u1163\u11BC","\u1100\u1161\u11BC\u110B\u1161\u110C\u1175","\u1100\u1161\u11BC\u110B\u116F\u11AB\u1103\u1169","\u1100\u1161\u11BC\u110B\u1174","\u1100\u1161\u11BC\u110C\u1166","\u1100\u1161\u11BC\u110C\u1169","\u1100\u1161\u11C0\u110B\u1175","\u1100\u1162\u1100\u116E\u1105\u1175","\u1100\u1162\u1102\u1161\u1105\u1175","\u1100\u1162\u1107\u1161\u11BC","\u1100\u1162\u1107\u1167\u11AF","\u1100\u1162\u1109\u1165\u11AB","\u1100\u1162\u1109\u1165\u11BC","\u1100\u1162\u110B\u1175\u11AB","\u1100\u1162\u11A8\u1100\u116A\u11AB\u110C\u1165\u11A8","\u1100\u1165\u1109\u1175\u11AF","\u1100\u1165\u110B\u1162\u11A8","\u1100\u1165\u110B\u116E\u11AF","\u1100\u1165\u110C\u1175\u11BA","\u1100\u1165\u1111\u116E\u11B7","\u1100\u1165\u11A8\u110C\u1165\u11BC","\u1100\u1165\u11AB\u1100\u1161\u11BC","\u1100\u1165\u11AB\u1106\u116E\u11AF","\u1100\u1165\u11AB\u1109\u1165\u11AF","\u1100\u1165\u11AB\u110C\u1169","\u1100\u1165\u11AB\u110E\u116E\u11A8","\u1100\u1165\u11AF\u110B\u1173\u11B7","\u1100\u1165\u11B7\u1109\u1161","\u1100\u1165\u11B7\u1110\u1169","\u1100\u1166\u1109\u1175\u1111\u1161\u11AB","\u1100\u1166\u110B\u1175\u11B7","\u1100\u1167\u110B\u116E\u11AF","\u1100\u1167\u11AB\u1112\u1162","\u1100\u1167\u11AF\u1100\u116A","\u1100\u1167\u11AF\u1100\u116E\u11A8","\u1100\u1167\u11AF\u1105\u1169\u11AB","\u1100\u1167\u11AF\u1109\u1165\u11A8","\u1100\u1167\u11AF\u1109\u1173\u11BC","\u1100\u1167\u11AF\u1109\u1175\u11B7","\u1100\u1167\u11AF\u110C\u1165\u11BC","\u1100\u1167\u11AF\u1112\u1169\u11AB","\u1100\u1167\u11BC\u1100\u1168","\u1100\u1167\u11BC\u1100\u1169","\u1100\u1167\u11BC\u1100\u1175","\u1100\u1167\u11BC\u1105\u1167\u11A8","\u1100\u1167\u11BC\u1107\u1169\u11A8\u1100\u116E\u11BC","\u1100\u1167\u11BC\u1107\u1175","\u1100\u1167\u11BC\u1109\u1161\u11BC\u1103\u1169","\u1100\u1167\u11BC\u110B\u1167\u11BC","\u1100\u1167\u11BC\u110B\u116E","\u1100\u1167\u11BC\u110C\u1162\u11BC","\u1100\u1167\u11BC\u110C\u1166","\u1100\u1167\u11BC\u110C\u116E","\u1100\u1167\u11BC\u110E\u1161\u11AF","\u1100\u1167\u11BC\u110E\u1175","\u1100\u1167\u11BC\u1112\u1163\u11BC","\u1100\u1167\u11BC\u1112\u1165\u11B7","\u1100\u1168\u1100\u1169\u11A8","\u1100\u1168\u1103\u1161\u11AB","\u1100\u1168\u1105\u1161\u11AB","\u1100\u1168\u1109\u1161\u11AB","\u1100\u1168\u1109\u1169\u11A8","\u1100\u1168\u110B\u1163\u11A8","\u1100\u1168\u110C\u1165\u11AF","\u1100\u1168\u110E\u1173\u11BC","\u1100\u1168\u1112\u116C\u11A8","\u1100\u1169\u1100\u1162\u11A8","\u1100\u1169\u1100\u116E\u1105\u1167","\u1100\u1169\u1100\u116E\u11BC","\u1100\u1169\u1100\u1173\u11B8","\u1100\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC","\u1100\u1169\u1106\u116E\u1109\u1175\u11AB","\u1100\u1169\u1106\u1175\u11AB","\u1100\u1169\u110B\u1163\u11BC\u110B\u1175","\u1100\u1169\u110C\u1161\u11BC","\u1100\u1169\u110C\u1165\u11AB","\u1100\u1169\u110C\u1175\u11B8","\u1100\u1169\u110E\u116E\u11BA\u1100\u1161\u1105\u116E","\u1100\u1169\u1110\u1169\u11BC","\u1100\u1169\u1112\u1163\u11BC","\u1100\u1169\u11A8\u1109\u1175\u11A8","\u1100\u1169\u11AF\u1106\u1169\u11A8","\u1100\u1169\u11AF\u110D\u1161\u1100\u1175","\u1100\u1169\u11AF\u1111\u1173","\u1100\u1169\u11BC\u1100\u1161\u11AB","\u1100\u1169\u11BC\u1100\u1162","\u1100\u1169\u11BC\u1100\u1167\u11A8","\u1100\u1169\u11BC\u1100\u116E\u11AB","\u1100\u1169\u11BC\u1100\u1173\u11B8","\u1100\u1169\u11BC\u1100\u1175","\u1100\u1169\u11BC\u1103\u1169\u11BC","\u1100\u1169\u11BC\u1106\u116E\u110B\u116F\u11AB","\u1100\u1169\u11BC\u1107\u116E","\u1100\u1169\u11BC\u1109\u1161","\u1100\u1169\u11BC\u1109\u1175\u11A8","\u1100\u1169\u11BC\u110B\u1165\u11B8","\u1100\u1169\u11BC\u110B\u1167\u11AB","\u1100\u1169\u11BC\u110B\u116F\u11AB","\u1100\u1169\u11BC\u110C\u1161\u11BC","\u1100\u1169\u11BC\u110D\u1161","\u1100\u1169\u11BC\u110E\u1162\u11A8","\u1100\u1169\u11BC\u1110\u1169\u11BC","\u1100\u1169\u11BC\u1111\u1169","\u1100\u1169\u11BC\u1112\u1161\u11BC","\u1100\u1169\u11BC\u1112\u1172\u110B\u1175\u11AF","\u1100\u116A\u1106\u1169\u11A8","\u1100\u116A\u110B\u1175\u11AF","\u1100\u116A\u110C\u1161\u11BC","\u1100\u116A\u110C\u1165\u11BC","\u1100\u116A\u1112\u1161\u11A8","\u1100\u116A\u11AB\u1100\u1162\u11A8","\u1100\u116A\u11AB\u1100\u1168","\u1100\u116A\u11AB\u1100\u116A\u11BC","\u1100\u116A\u11AB\u1102\u1167\u11B7","\u1100\u116A\u11AB\u1105\u1161\u11B7","\u1100\u116A\u11AB\u1105\u1167\u11AB","\u1100\u116A\u11AB\u1105\u1175","\u1100\u116A\u11AB\u1109\u1173\u11B8","\u1100\u116A\u11AB\u1109\u1175\u11B7","\u1100\u116A\u11AB\u110C\u1165\u11B7","\u1100\u116A\u11AB\u110E\u1161\u11AF","\u1100\u116A\u11BC\u1100\u1167\u11BC","\u1100\u116A\u11BC\u1100\u1169","\u1100\u116A\u11BC\u110C\u1161\u11BC","\u1100\u116A\u11BC\u110C\u116E","\u1100\u116C\u1105\u1169\u110B\u116E\u11B7","\u1100\u116C\u11BC\u110C\u1161\u11BC\u1112\u1175","\u1100\u116D\u1100\u116A\u1109\u1165","\u1100\u116D\u1106\u116E\u11AB","\u1100\u116D\u1107\u1169\u11A8","\u1100\u116D\u1109\u1175\u11AF","\u1100\u116D\u110B\u1163\u11BC","\u1100\u116D\u110B\u1172\u11A8","\u1100\u116D\u110C\u1161\u11BC","\u1100\u116D\u110C\u1175\u11A8","\u1100\u116D\u1110\u1169\u11BC","\u1100\u116D\u1112\u116A\u11AB","\u1100\u116D\u1112\u116E\u11AB","\u1100\u116E\u1100\u1167\u11BC","\u1100\u116E\u1105\u1173\u11B7","\u1100\u116E\u1106\u1165\u11BC","\u1100\u116E\u1107\u1167\u11AF","\u1100\u116E\u1107\u116E\u11AB","\u1100\u116E\u1109\u1165\u11A8","\u1100\u116E\u1109\u1165\u11BC","\u1100\u116E\u1109\u1169\u11A8","\u1100\u116E\u110B\u1167\u11A8","\u1100\u116E\u110B\u1175\u11B8","\u1100\u116E\u110E\u1165\u11BC","\u1100\u116E\u110E\u1166\u110C\u1165\u11A8","\u1100\u116E\u11A8\u1100\u1161","\u1100\u116E\u11A8\u1100\u1175","\u1100\u116E\u11A8\u1102\u1162","\u1100\u116E\u11A8\u1105\u1175\u11B8","\u1100\u116E\u11A8\u1106\u116E\u11AF","\u1100\u116E\u11A8\u1106\u1175\u11AB","\u1100\u116E\u11A8\u1109\u116E","\u1100\u116E\u11A8\u110B\u1165","\u1100\u116E\u11A8\u110B\u116A\u11BC","\u1100\u116E\u11A8\u110C\u1165\u11A8","\u1100\u116E\u11A8\u110C\u1166","\u1100\u116E\u11A8\u1112\u116C","\u1100\u116E\u11AB\u1103\u1162","\u1100\u116E\u11AB\u1109\u1161","\u1100\u116E\u11AB\u110B\u1175\u11AB","\u1100\u116E\u11BC\u1100\u1173\u11A8\u110C\u1165\u11A8","\u1100\u116F\u11AB\u1105\u1175","\u1100\u116F\u11AB\u110B\u1171","\u1100\u116F\u11AB\u1110\u116E","\u1100\u1171\u1100\u116E\u11A8","\u1100\u1171\u1109\u1175\u11AB","\u1100\u1172\u110C\u1165\u11BC","\u1100\u1172\u110E\u1175\u11A8","\u1100\u1172\u11AB\u1112\u1167\u11BC","\u1100\u1173\u1102\u1161\u11AF","\u1100\u1173\u1102\u1163\u11BC","\u1100\u1173\u1102\u1173\u11AF","\u1100\u1173\u1105\u1165\u1102\u1161","\u1100\u1173\u1105\u116E\u11B8","\u1100\u1173\u1105\u1173\u11BA","\u1100\u1173\u1105\u1175\u11B7","\u1100\u1173\u110C\u1166\u1109\u1165\u110B\u1163","\u1100\u1173\u1110\u1169\u1105\u1169\u11A8","\u1100\u1173\u11A8\u1107\u1169\u11A8","\u1100\u1173\u11A8\u1112\u1175","\u1100\u1173\u11AB\u1100\u1165","\u1100\u1173\u11AB\u1100\u116D","\u1100\u1173\u11AB\u1105\u1162","\u1100\u1173\u11AB\u1105\u1169","\u1100\u1173\u11AB\u1106\u116E","\u1100\u1173\u11AB\u1107\u1169\u11AB","\u1100\u1173\u11AB\u110B\u116F\u11AB","\u1100\u1173\u11AB\u110B\u1172\u11A8","\u1100\u1173\u11AB\u110E\u1165","\u1100\u1173\u11AF\u110A\u1175","\u1100\u1173\u11AF\u110C\u1161","\u1100\u1173\u11B7\u1100\u1161\u11BC\u1109\u1161\u11AB","\u1100\u1173\u11B7\u1100\u1169","\u1100\u1173\u11B7\u1102\u1167\u11AB","\u1100\u1173\u11B7\u1106\u1166\u1103\u1161\u11AF","\u1100\u1173\u11B7\u110B\u1162\u11A8","\u1100\u1173\u11B7\u110B\u1167\u11AB","\u1100\u1173\u11B7\u110B\u116D\u110B\u1175\u11AF","\u1100\u1173\u11B7\u110C\u1175","\u1100\u1173\u11BC\u110C\u1165\u11BC\u110C\u1165\u11A8","\u1100\u1175\u1100\u1161\u11AB","\u1100\u1175\u1100\u116A\u11AB","\u1100\u1175\u1102\u1167\u11B7","\u1100\u1175\u1102\u1173\u11BC","\u1100\u1175\u1103\u1169\u11A8\u1100\u116D","\u1100\u1175\u1103\u116E\u11BC","\u1100\u1175\u1105\u1169\u11A8","\u1100\u1175\u1105\u1173\u11B7","\u1100\u1175\u1107\u1165\u11B8","\u1100\u1175\u1107\u1169\u11AB","\u1100\u1175\u1107\u116E\u11AB","\u1100\u1175\u1108\u1173\u11B7","\u1100\u1175\u1109\u116E\u11A8\u1109\u1161","\u1100\u1175\u1109\u116E\u11AF","\u1100\u1175\u110B\u1165\u11A8","\u1100\u1175\u110B\u1165\u11B8","\u1100\u1175\u110B\u1169\u11AB","\u1100\u1175\u110B\u116E\u11AB","\u1100\u1175\u110B\u116F\u11AB","\u1100\u1175\u110C\u1165\u11A8","\u1100\u1175\u110C\u116E\u11AB","\u1100\u1175\u110E\u1175\u11B7","\u1100\u1175\u1112\u1169\u11AB","\u1100\u1175\u1112\u116C\u11A8","\u1100\u1175\u11AB\u1100\u1173\u11B8","\u1100\u1175\u11AB\u110C\u1161\u11BC","\u1100\u1175\u11AF\u110B\u1175","\u1100\u1175\u11B7\u1107\u1161\u11B8","\u1100\u1175\u11B7\u110E\u1175","\u1100\u1175\u11B7\u1111\u1169\u1100\u1169\u11BC\u1112\u1161\u11BC","\u1101\u1161\u11A8\u1103\u116E\u1100\u1175","\u1101\u1161\u11B7\u1108\u1161\u11A8","\u1101\u1162\u1103\u1161\u11AF\u110B\u1173\u11B7","\u1101\u1162\u1109\u1169\u1100\u1173\u11B7","\u1101\u1165\u11B8\u110C\u1175\u11AF","\u1101\u1169\u11A8\u1103\u1162\u1100\u1175","\u1101\u1169\u11BE\u110B\u1175\u11C1","\u1102\u1161\u1103\u1173\u11AF\u110B\u1175","\u1102\u1161\u1105\u1161\u11AB\u1112\u1175","\u1102\u1161\u1106\u1165\u110C\u1175","\u1102\u1161\u1106\u116E\u11AF","\u1102\u1161\u110E\u1175\u11B7\u1107\u1161\u11AB","\u1102\u1161\u1112\u1173\u11AF","\u1102\u1161\u11A8\u110B\u1167\u11B8","\u1102\u1161\u11AB\u1107\u1161\u11BC","\u1102\u1161\u11AF\u1100\u1162","\u1102\u1161\u11AF\u110A\u1175","\u1102\u1161\u11AF\u110D\u1161","\u1102\u1161\u11B7\u1102\u1167","\u1102\u1161\u11B7\u1103\u1162\u1106\u116E\u11AB","\u1102\u1161\u11B7\u1106\u1162","\u1102\u1161\u11B7\u1109\u1161\u11AB","\u1102\u1161\u11B7\u110C\u1161","\u1102\u1161\u11B7\u1111\u1167\u11AB","\u1102\u1161\u11B7\u1112\u1161\u11A8\u1109\u1162\u11BC","\u1102\u1161\u11BC\u1107\u1175","\u1102\u1161\u11C0\u1106\u1161\u11AF","\u1102\u1162\u1102\u1167\u11AB","\u1102\u1162\u110B\u116D\u11BC","\u1102\u1162\u110B\u1175\u11AF","\u1102\u1162\u11B7\u1107\u1175","\u1102\u1162\u11B7\u1109\u1162","\u1102\u1162\u11BA\u1106\u116E\u11AF","\u1102\u1162\u11BC\u1103\u1169\u11BC","\u1102\u1162\u11BC\u1106\u1167\u11AB","\u1102\u1162\u11BC\u1107\u1161\u11BC","\u1102\u1162\u11BC\u110C\u1161\u11BC\u1100\u1169","\u1102\u1166\u11A8\u1110\u1161\u110B\u1175","\u1102\u1166\u11BA\u110D\u1162","\u1102\u1169\u1103\u1169\u11BC","\u1102\u1169\u1105\u1161\u11AB\u1109\u1162\u11A8","\u1102\u1169\u1105\u1167\u11A8","\u1102\u1169\u110B\u1175\u11AB","\u1102\u1169\u11A8\u110B\u1173\u11B7","\u1102\u1169\u11A8\u110E\u1161","\u1102\u1169\u11A8\u1112\u116A","\u1102\u1169\u11AB\u1105\u1175","\u1102\u1169\u11AB\u1106\u116E\u11AB","\u1102\u1169\u11AB\u110C\u1162\u11BC","\u1102\u1169\u11AF\u110B\u1175","\u1102\u1169\u11BC\u1100\u116E","\u1102\u1169\u11BC\u1103\u1161\u11B7","\u1102\u1169\u11BC\u1106\u1175\u11AB","\u1102\u1169\u11BC\u1107\u116E","\u1102\u1169\u11BC\u110B\u1165\u11B8","\u1102\u1169\u11BC\u110C\u1161\u11BC","\u1102\u1169\u11BC\u110E\u1169\u11AB","\u1102\u1169\u11C1\u110B\u1175","\u1102\u116E\u11AB\u1103\u1169\u11BC\u110C\u1161","\u1102\u116E\u11AB\u1106\u116E\u11AF","\u1102\u116E\u11AB\u110A\u1165\u11B8","\u1102\u1172\u110B\u116D\u11A8","\u1102\u1173\u1101\u1175\u11B7","\u1102\u1173\u11A8\u1103\u1162","\u1102\u1173\u11BC\u1103\u1169\u11BC\u110C\u1165\u11A8","\u1102\u1173\u11BC\u1105\u1167\u11A8","\u1103\u1161\u1107\u1161\u11BC","\u1103\u1161\u110B\u1163\u11BC\u1109\u1165\u11BC","\u1103\u1161\u110B\u1173\u11B7","\u1103\u1161\u110B\u1175\u110B\u1165\u1110\u1173","\u1103\u1161\u1112\u1162\u11BC","\u1103\u1161\u11AB\u1100\u1168","\u1103\u1161\u11AB\u1100\u1169\u11AF","\u1103\u1161\u11AB\u1103\u1169\u11A8","\u1103\u1161\u11AB\u1106\u1161\u11BA","\u1103\u1161\u11AB\u1109\u116E\u11AB","\u1103\u1161\u11AB\u110B\u1165","\u1103\u1161\u11AB\u110B\u1171","\u1103\u1161\u11AB\u110C\u1165\u11B7","\u1103\u1161\u11AB\u110E\u1166","\u1103\u1161\u11AB\u110E\u116E","\u1103\u1161\u11AB\u1111\u1167\u11AB","\u1103\u1161\u11AB\u1111\u116E\u11BC","\u1103\u1161\u11AF\u1100\u1163\u11AF","\u1103\u1161\u11AF\u1105\u1165","\u1103\u1161\u11AF\u1105\u1167\u11A8","\u1103\u1161\u11AF\u1105\u1175","\u1103\u1161\u11B0\u1100\u1169\u1100\u1175","\u1103\u1161\u11B7\u1103\u1161\u11BC","\u1103\u1161\u11B7\u1107\u1162","\u1103\u1161\u11B7\u110B\u116D","\u1103\u1161\u11B7\u110B\u1175\u11B7","\u1103\u1161\u11B8\u1107\u1167\u11AB","\u1103\u1161\u11B8\u110C\u1161\u11BC","\u1103\u1161\u11BC\u1100\u1173\u11AB","\u1103\u1161\u11BC\u1107\u116E\u11AB\u1100\u1161\u11AB","\u1103\u1161\u11BC\u110B\u1167\u11AB\u1112\u1175","\u1103\u1161\u11BC\u110C\u1161\u11BC","\u1103\u1162\u1100\u1172\u1106\u1169","\u1103\u1162\u1102\u1161\u11BD","\u1103\u1162\u1103\u1161\u11AB\u1112\u1175","\u1103\u1162\u1103\u1161\u11B8","\u1103\u1162\u1103\u1169\u1109\u1175","\u1103\u1162\u1105\u1163\u11A8","\u1103\u1162\u1105\u1163\u11BC","\u1103\u1162\u1105\u1172\u11A8","\u1103\u1162\u1106\u116E\u11AB","\u1103\u1162\u1107\u116E\u1107\u116E\u11AB","\u1103\u1162\u1109\u1175\u11AB","\u1103\u1162\u110B\u1173\u11BC","\u1103\u1162\u110C\u1161\u11BC","\u1103\u1162\u110C\u1165\u11AB","\u1103\u1162\u110C\u1165\u11B8","\u1103\u1162\u110C\u116E\u11BC","\u1103\u1162\u110E\u1162\u11A8","\u1103\u1162\u110E\u116E\u11AF","\u1103\u1162\u110E\u116E\u11BC","\u1103\u1162\u1110\u1169\u11BC\u1105\u1167\u11BC","\u1103\u1162\u1112\u1161\u11A8","\u1103\u1162\u1112\u1161\u11AB\u1106\u1175\u11AB\u1100\u116E\u11A8","\u1103\u1162\u1112\u1161\u11B8\u1109\u1175\u11AF","\u1103\u1162\u1112\u1167\u11BC","\u1103\u1165\u11BC\u110B\u1165\u1105\u1175","\u1103\u1166\u110B\u1175\u1110\u1173","\u1103\u1169\u1103\u1162\u110E\u1166","\u1103\u1169\u1103\u1165\u11A8","\u1103\u1169\u1103\u116E\u11A8","\u1103\u1169\u1106\u1161\u11BC","\u1103\u1169\u1109\u1165\u1100\u116A\u11AB","\u1103\u1169\u1109\u1175\u11B7","\u1103\u1169\u110B\u116E\u11B7","\u1103\u1169\u110B\u1175\u11B8","\u1103\u1169\u110C\u1161\u1100\u1175","\u1103\u1169\u110C\u1165\u1112\u1175","\u1103\u1169\u110C\u1165\u11AB","\u1103\u1169\u110C\u116E\u11BC","\u1103\u1169\u110E\u1161\u11A8","\u1103\u1169\u11A8\u1100\u1161\u11B7","\u1103\u1169\u11A8\u1105\u1175\u11B8","\u1103\u1169\u11A8\u1109\u1165","\u1103\u1169\u11A8\u110B\u1175\u11AF","\u1103\u1169\u11A8\u110E\u1161\u11BC\u110C\u1165\u11A8","\u1103\u1169\u11BC\u1112\u116A\u110E\u1162\u11A8","\u1103\u1171\u11BA\u1106\u1169\u1109\u1173\u11B8","\u1103\u1171\u11BA\u1109\u1161\u11AB","\u1104\u1161\u11AF\u110B\u1161\u110B\u1175","\u1106\u1161\u1102\u116E\u1105\u1161","\u1106\u1161\u1102\u1173\u11AF","\u1106\u1161\u1103\u1161\u11BC","\u1106\u1161\u1105\u1161\u1110\u1169\u11AB","\u1106\u1161\u1105\u1167\u11AB","\u1106\u1161\u1106\u116E\u1105\u1175","\u1106\u1161\u1109\u1161\u110C\u1175","\u1106\u1161\u110B\u1163\u11A8","\u1106\u1161\u110B\u116D\u1102\u1166\u110C\u1173","\u1106\u1161\u110B\u1173\u11AF","\u1106\u1161\u110B\u1173\u11B7","\u1106\u1161\u110B\u1175\u110F\u1173","\u1106\u1161\u110C\u116E\u11BC","\u1106\u1161\u110C\u1175\u1106\u1161\u11A8","\u1106\u1161\u110E\u1161\u11AB\u1100\u1161\u110C\u1175","\u1106\u1161\u110E\u1161\u11AF","\u1106\u1161\u1112\u1173\u11AB","\u1106\u1161\u11A8\u1100\u1165\u11AF\u1105\u1175","\u1106\u1161\u11A8\u1102\u1162","\u1106\u1161\u11A8\u1109\u1161\u11BC","\u1106\u1161\u11AB\u1102\u1161\u11B7","\u1106\u1161\u11AB\u1103\u116E","\u1106\u1161\u11AB\u1109\u1166","\u1106\u1161\u11AB\u110B\u1163\u11A8","\u1106\u1161\u11AB\u110B\u1175\u11AF","\u1106\u1161\u11AB\u110C\u1165\u11B7","\u1106\u1161\u11AB\u110C\u1169\u11A8","\u1106\u1161\u11AB\u1112\u116A","\u1106\u1161\u11AD\u110B\u1175","\u1106\u1161\u11AF\u1100\u1175","\u1106\u1161\u11AF\u110A\u1173\u11B7","\u1106\u1161\u11AF\u1110\u116E","\u1106\u1161\u11B7\u1103\u1162\u1105\u1169","\u1106\u1161\u11BC\u110B\u116F\u11AB\u1100\u1167\u11BC","\u1106\u1162\u1102\u1167\u11AB","\u1106\u1162\u1103\u1161\u11AF","\u1106\u1162\u1105\u1167\u11A8","\u1106\u1162\u1107\u1165\u11AB","\u1106\u1162\u1109\u1173\u110F\u1165\u11B7","\u1106\u1162\u110B\u1175\u11AF","\u1106\u1162\u110C\u1161\u11BC","\u1106\u1162\u11A8\u110C\u116E","\u1106\u1165\u11A8\u110B\u1175","\u1106\u1165\u11AB\u110C\u1165","\u1106\u1165\u11AB\u110C\u1175","\u1106\u1165\u11AF\u1105\u1175","\u1106\u1166\u110B\u1175\u11AF","\u1106\u1167\u1102\u1173\u1105\u1175","\u1106\u1167\u110E\u1175\u11AF","\u1106\u1167\u11AB\u1103\u1161\u11B7","\u1106\u1167\u11AF\u110E\u1175","\u1106\u1167\u11BC\u1103\u1161\u11AB","\u1106\u1167\u11BC\u1105\u1167\u11BC","\u1106\u1167\u11BC\u110B\u1168","\u1106\u1167\u11BC\u110B\u1174","\u1106\u1167\u11BC\u110C\u1165\u11AF","\u1106\u1167\u11BC\u110E\u1175\u11BC","\u1106\u1167\u11BC\u1112\u1161\u11B7","\u1106\u1169\u1100\u1173\u11B7","\u1106\u1169\u1102\u1175\u1110\u1165","\u1106\u1169\u1103\u1166\u11AF","\u1106\u1169\u1103\u1173\u11AB","\u1106\u1169\u1107\u1165\u11B7","\u1106\u1169\u1109\u1173\u11B8","\u1106\u1169\u110B\u1163\u11BC","\u1106\u1169\u110B\u1175\u11B7","\u1106\u1169\u110C\u1169\u1105\u1175","\u1106\u1169\u110C\u1175\u11B8","\u1106\u1169\u1110\u116E\u11BC\u110B\u1175","\u1106\u1169\u11A8\u1100\u1165\u11AF\u110B\u1175","\u1106\u1169\u11A8\u1105\u1169\u11A8","\u1106\u1169\u11A8\u1109\u1161","\u1106\u1169\u11A8\u1109\u1169\u1105\u1175","\u1106\u1169\u11A8\u1109\u116E\u11B7","\u1106\u1169\u11A8\u110C\u1165\u11A8","\u1106\u1169\u11A8\u1111\u116D","\u1106\u1169\u11AF\u1105\u1162","\u1106\u1169\u11B7\u1106\u1162","\u1106\u1169\u11B7\u1106\u116E\u1100\u1166","\u1106\u1169\u11B7\u1109\u1161\u11AF","\u1106\u1169\u11B7\u1109\u1169\u11A8","\u1106\u1169\u11B7\u110C\u1175\u11BA","\u1106\u1169\u11B7\u1110\u1169\u11BC","\u1106\u1169\u11B8\u1109\u1175","\u1106\u116E\u1100\u116A\u11AB\u1109\u1175\u11B7","\u1106\u116E\u1100\u116E\u11BC\u1112\u116A","\u1106\u116E\u1103\u1165\u110B\u1171","\u1106\u116E\u1103\u1165\u11B7","\u1106\u116E\u1105\u1173\u11C1","\u1106\u116E\u1109\u1173\u11AB","\u1106\u116E\u110B\u1165\u11BA","\u1106\u116E\u110B\u1167\u11A8","\u1106\u116E\u110B\u116D\u11BC","\u1106\u116E\u110C\u1169\u1100\u1165\u11AB","\u1106\u116E\u110C\u1175\u1100\u1162","\u1106\u116E\u110E\u1165\u11A8","\u1106\u116E\u11AB\u1100\u116E","\u1106\u116E\u11AB\u1103\u1173\u11A8","\u1106\u116E\u11AB\u1107\u1165\u11B8","\u1106\u116E\u11AB\u1109\u1165","\u1106\u116E\u11AB\u110C\u1166","\u1106\u116E\u11AB\u1112\u1161\u11A8","\u1106\u116E\u11AB\u1112\u116A","\u1106\u116E\u11AF\u1100\u1161","\u1106\u116E\u11AF\u1100\u1165\u11AB","\u1106\u116E\u11AF\u1100\u1167\u11AF","\u1106\u116E\u11AF\u1100\u1169\u1100\u1175","\u1106\u116E\u11AF\u1105\u1169\u11AB","\u1106\u116E\u11AF\u1105\u1175\u1112\u1161\u11A8","\u1106\u116E\u11AF\u110B\u1173\u11B7","\u1106\u116E\u11AF\u110C\u1175\u11AF","\u1106\u116E\u11AF\u110E\u1166","\u1106\u1175\u1100\u116E\u11A8","\u1106\u1175\u1103\u1175\u110B\u1165","\u1106\u1175\u1109\u1161\u110B\u1175\u11AF","\u1106\u1175\u1109\u116E\u11AF","\u1106\u1175\u110B\u1167\u11A8","\u1106\u1175\u110B\u116D\u11BC\u1109\u1175\u11AF","\u1106\u1175\u110B\u116E\u11B7","\u1106\u1175\u110B\u1175\u11AB","\u1106\u1175\u1110\u1175\u11BC","\u1106\u1175\u1112\u1169\u11AB","\u1106\u1175\u11AB\u1100\u1161\u11AB","\u1106\u1175\u11AB\u110C\u1169\u11A8","\u1106\u1175\u11AB\u110C\u116E","\u1106\u1175\u11AE\u110B\u1173\u11B7","\u1106\u1175\u11AF\u1100\u1161\u1105\u116E","\u1106\u1175\u11AF\u1105\u1175\u1106\u1175\u1110\u1165","\u1106\u1175\u11C0\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u1100\u1161\u110C\u1175","\u1107\u1161\u1100\u116E\u1102\u1175","\u1107\u1161\u1102\u1161\u1102\u1161","\u1107\u1161\u1102\u1173\u11AF","\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u1103\u1161\u11BA\u1100\u1161","\u1107\u1161\u1105\u1161\u11B7","\u1107\u1161\u110B\u1175\u1105\u1165\u1109\u1173","\u1107\u1161\u1110\u1161\u11BC","\u1107\u1161\u11A8\u1106\u116E\u11AF\u1100\u116A\u11AB","\u1107\u1161\u11A8\u1109\u1161","\u1107\u1161\u11A8\u1109\u116E","\u1107\u1161\u11AB\u1103\u1162","\u1107\u1161\u11AB\u1103\u1173\u1109\u1175","\u1107\u1161\u11AB\u1106\u1161\u11AF","\u1107\u1161\u11AB\u1107\u1161\u11AF","\u1107\u1161\u11AB\u1109\u1165\u11BC","\u1107\u1161\u11AB\u110B\u1173\u11BC","\u1107\u1161\u11AB\u110C\u1161\u11BC","\u1107\u1161\u11AB\u110C\u116E\u11A8","\u1107\u1161\u11AB\u110C\u1175","\u1107\u1161\u11AB\u110E\u1161\u11AB","\u1107\u1161\u11AE\u110E\u1175\u11B7","\u1107\u1161\u11AF\u1100\u1161\u1105\u1161\u11A8","\u1107\u1161\u11AF\u1100\u1165\u11AF\u110B\u1173\u11B7","\u1107\u1161\u11AF\u1100\u1167\u11AB","\u1107\u1161\u11AF\u1103\u1161\u11AF","\u1107\u1161\u11AF\u1105\u1166","\u1107\u1161\u11AF\u1106\u1169\u11A8","\u1107\u1161\u11AF\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u11AF\u1109\u1162\u11BC","\u1107\u1161\u11AF\u110B\u1173\u11B7","\u1107\u1161\u11AF\u110C\u1161\u1100\u116E\u11A8","\u1107\u1161\u11AF\u110C\u1165\u11AB","\u1107\u1161\u11AF\u1110\u1169\u11B8","\u1107\u1161\u11AF\u1111\u116D","\u1107\u1161\u11B7\u1112\u1161\u1102\u1173\u11AF","\u1107\u1161\u11B8\u1100\u1173\u1105\u1173\u11BA","\u1107\u1161\u11B8\u1106\u1161\u11BA","\u1107\u1161\u11B8\u1109\u1161\u11BC","\u1107\u1161\u11B8\u1109\u1169\u11C0","\u1107\u1161\u11BC\u1100\u1173\u11B7","\u1107\u1161\u11BC\u1106\u1167\u11AB","\u1107\u1161\u11BC\u1106\u116E\u11AB","\u1107\u1161\u11BC\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u11BC\u1107\u1165\u11B8","\u1107\u1161\u11BC\u1109\u1169\u11BC","\u1107\u1161\u11BC\u1109\u1175\u11A8","\u1107\u1161\u11BC\u110B\u1161\u11AB","\u1107\u1161\u11BC\u110B\u116E\u11AF","\u1107\u1161\u11BC\u110C\u1175","\u1107\u1161\u11BC\u1112\u1161\u11A8","\u1107\u1161\u11BC\u1112\u1162","\u1107\u1161\u11BC\u1112\u1163\u11BC","\u1107\u1162\u1100\u1167\u11BC","\u1107\u1162\u1101\u1169\u11B8","\u1107\u1162\u1103\u1161\u11AF","\u1107\u1162\u1103\u1173\u1106\u1175\u11AB\u1110\u1165\u11AB","\u1107\u1162\u11A8\u1103\u116E\u1109\u1161\u11AB","\u1107\u1162\u11A8\u1109\u1162\u11A8","\u1107\u1162\u11A8\u1109\u1165\u11BC","\u1107\u1162\u11A8\u110B\u1175\u11AB","\u1107\u1162\u11A8\u110C\u1166","\u1107\u1162\u11A8\u1112\u116A\u110C\u1165\u11B7","\u1107\u1165\u1105\u1173\u11BA","\u1107\u1165\u1109\u1165\u11BA","\u1107\u1165\u1110\u1173\u11AB","\u1107\u1165\u11AB\u1100\u1162","\u1107\u1165\u11AB\u110B\u1167\u11A8","\u1107\u1165\u11AB\u110C\u1175","\u1107\u1165\u11AB\u1112\u1169","\u1107\u1165\u11AF\u1100\u1173\u11B7","\u1107\u1165\u11AF\u1105\u1166","\u1107\u1165\u11AF\u110A\u1165","\u1107\u1165\u11B7\u110B\u1171","\u1107\u1165\u11B7\u110B\u1175\u11AB","\u1107\u1165\u11B7\u110C\u116C","\u1107\u1165\u11B8\u1105\u1172\u11AF","\u1107\u1165\u11B8\u110B\u116F\u11AB","\u1107\u1165\u11B8\u110C\u1165\u11A8","\u1107\u1165\u11B8\u110E\u1175\u11A8","\u1107\u1166\u110B\u1175\u110C\u1175\u11BC","\u1107\u1166\u11AF\u1110\u1173","\u1107\u1167\u11AB\u1100\u1167\u11BC","\u1107\u1167\u11AB\u1103\u1169\u11BC","\u1107\u1167\u11AB\u1106\u1167\u11BC","\u1107\u1167\u11AB\u1109\u1175\u11AB","\u1107\u1167\u11AB\u1112\u1169\u1109\u1161","\u1107\u1167\u11AB\u1112\u116A","\u1107\u1167\u11AF\u1103\u1169","\u1107\u1167\u11AF\u1106\u1167\u11BC","\u1107\u1167\u11AF\u110B\u1175\u11AF","\u1107\u1167\u11BC\u1109\u1175\u11AF","\u1107\u1167\u11BC\u110B\u1161\u1105\u1175","\u1107\u1167\u11BC\u110B\u116F\u11AB","\u1107\u1169\u1100\u116A\u11AB","\u1107\u1169\u1102\u1165\u1109\u1173","\u1107\u1169\u1105\u1161\u1109\u1162\u11A8","\u1107\u1169\u1105\u1161\u11B7","\u1107\u1169\u1105\u1173\u11B7","\u1107\u1169\u1109\u1161\u11BC","\u1107\u1169\u110B\u1161\u11AB","\u1107\u1169\u110C\u1161\u1100\u1175","\u1107\u1169\u110C\u1161\u11BC","\u1107\u1169\u110C\u1165\u11AB","\u1107\u1169\u110C\u1169\u11AB","\u1107\u1169\u1110\u1169\u11BC","\u1107\u1169\u1111\u1167\u11AB\u110C\u1165\u11A8","\u1107\u1169\u1112\u1165\u11B7","\u1107\u1169\u11A8\u1103\u1169","\u1107\u1169\u11A8\u1109\u1161","\u1107\u1169\u11A8\u1109\u116E\u11BC\u110B\u1161","\u1107\u1169\u11A8\u1109\u1173\u11B8","\u1107\u1169\u11A9\u110B\u1173\u11B7","\u1107\u1169\u11AB\u1100\u1167\u11A8\u110C\u1165\u11A8","\u1107\u1169\u11AB\u1105\u1162","\u1107\u1169\u11AB\u1107\u116E","\u1107\u1169\u11AB\u1109\u1161","\u1107\u1169\u11AB\u1109\u1165\u11BC","\u1107\u1169\u11AB\u110B\u1175\u11AB","\u1107\u1169\u11AB\u110C\u1175\u11AF","\u1107\u1169\u11AF\u1111\u1166\u11AB","\u1107\u1169\u11BC\u1109\u1161","\u1107\u1169\u11BC\u110C\u1175","\u1107\u1169\u11BC\u1110\u116E","\u1107\u116E\u1100\u1173\u11AB","\u1107\u116E\u1101\u1173\u1105\u1165\u110B\u116E\u11B7","\u1107\u116E\u1103\u1161\u11B7","\u1107\u116E\u1103\u1169\u11BC\u1109\u1161\u11AB","\u1107\u116E\u1106\u116E\u11AB","\u1107\u116E\u1107\u116E\u11AB","\u1107\u116E\u1109\u1161\u11AB","\u1107\u116E\u1109\u1161\u11BC","\u1107\u116E\u110B\u1165\u11BF","\u1107\u116E\u110B\u1175\u11AB","\u1107\u116E\u110C\u1161\u11A8\u110B\u116D\u11BC","\u1107\u116E\u110C\u1161\u11BC","\u1107\u116E\u110C\u1165\u11BC","\u1107\u116E\u110C\u1169\u11A8","\u1107\u116E\u110C\u1175\u1105\u1165\u11AB\u1112\u1175","\u1107\u116E\u110E\u1175\u11AB","\u1107\u116E\u1110\u1161\u11A8","\u1107\u116E\u1111\u116E\u11B7","\u1107\u116E\u1112\u116C\u110C\u1161\u11BC","\u1107\u116E\u11A8\u1107\u116E","\u1107\u116E\u11A8\u1112\u1161\u11AB","\u1107\u116E\u11AB\u1102\u1169","\u1107\u116E\u11AB\u1105\u1163\u11BC","\u1107\u116E\u11AB\u1105\u1175","\u1107\u116E\u11AB\u1106\u1167\u11BC","\u1107\u116E\u11AB\u1109\u1165\u11A8","\u1107\u116E\u11AB\u110B\u1163","\u1107\u116E\u11AB\u110B\u1171\u1100\u1175","\u1107\u116E\u11AB\u1111\u1175\u11AF","\u1107\u116E\u11AB\u1112\u1169\u11BC\u1109\u1162\u11A8","\u1107\u116E\u11AF\u1100\u1169\u1100\u1175","\u1107\u116E\u11AF\u1100\u116A","\u1107\u116E\u11AF\u1100\u116D","\u1107\u116E\u11AF\u1101\u1169\u11BE","\u1107\u116E\u11AF\u1106\u1161\u11AB","\u1107\u116E\u11AF\u1107\u1165\u11B8","\u1107\u116E\u11AF\u1107\u1175\u11BE","\u1107\u116E\u11AF\u110B\u1161\u11AB","\u1107\u116E\u11AF\u110B\u1175\u110B\u1175\u11A8","\u1107\u116E\u11AF\u1112\u1162\u11BC","\u1107\u1173\u1105\u1162\u11AB\u1103\u1173","\u1107\u1175\u1100\u1173\u11A8","\u1107\u1175\u1102\u1161\u11AB","\u1107\u1175\u1102\u1175\u11AF","\u1107\u1175\u1103\u116E\u11AF\u1100\u1175","\u1107\u1175\u1103\u1175\u110B\u1169","\u1107\u1175\u1105\u1169\u1109\u1169","\u1107\u1175\u1106\u1161\u11AB","\u1107\u1175\u1106\u1167\u11BC","\u1107\u1175\u1106\u1175\u11AF","\u1107\u1175\u1107\u1161\u1105\u1161\u11B7","\u1107\u1175\u1107\u1175\u11B7\u1107\u1161\u11B8","\u1107\u1175\u1109\u1161\u11BC","\u1107\u1175\u110B\u116D\u11BC","\u1107\u1175\u110B\u1172\u11AF","\u1107\u1175\u110C\u116E\u11BC","\u1107\u1175\u1110\u1161\u1106\u1175\u11AB","\u1107\u1175\u1111\u1161\u11AB","\u1107\u1175\u11AF\u1103\u1175\u11BC","\u1107\u1175\u11BA\u1106\u116E\u11AF","\u1107\u1175\u11BA\u1107\u1161\u11BC\u110B\u116E\u11AF","\u1107\u1175\u11BA\u110C\u116E\u11AF\u1100\u1175","\u1107\u1175\u11BE\u1101\u1161\u11AF","\u1108\u1161\u11AF\u1100\u1161\u11AB\u1109\u1162\u11A8","\u1108\u1161\u11AF\u1105\u1162","\u1108\u1161\u11AF\u1105\u1175","\u1109\u1161\u1100\u1165\u11AB","\u1109\u1161\u1100\u1168\u110C\u1165\u11AF","\u1109\u1161\u1102\u1161\u110B\u1175","\u1109\u1161\u1102\u1163\u11BC","\u1109\u1161\u1105\u1161\u11B7","\u1109\u1161\u1105\u1161\u11BC","\u1109\u1161\u1105\u1175\u11B8","\u1109\u1161\u1106\u1169\u1102\u1175\u11B7","\u1109\u1161\u1106\u116E\u11AF","\u1109\u1161\u1107\u1161\u11BC","\u1109\u1161\u1109\u1161\u11BC","\u1109\u1161\u1109\u1162\u11BC\u1112\u116A\u11AF","\u1109\u1161\u1109\u1165\u11AF","\u1109\u1161\u1109\u1173\u11B7","\u1109\u1161\u1109\u1175\u11AF","\u1109\u1161\u110B\u1165\u11B8","\u1109\u1161\u110B\u116D\u11BC","\u1109\u1161\u110B\u116F\u11AF","\u1109\u1161\u110C\u1161\u11BC","\u1109\u1161\u110C\u1165\u11AB","\u1109\u1161\u110C\u1175\u11AB","\u1109\u1161\u110E\u1169\u11AB","\u1109\u1161\u110E\u116E\u11AB\u1100\u1175","\u1109\u1161\u1110\u1161\u11BC","\u1109\u1161\u1110\u116E\u1105\u1175","\u1109\u1161\u1112\u1173\u11AF","\u1109\u1161\u11AB\u1100\u1175\u11AF","\u1109\u1161\u11AB\u1107\u116E\u110B\u1175\u11AB\u1100\u116A","\u1109\u1161\u11AB\u110B\u1165\u11B8","\u1109\u1161\u11AB\u110E\u1162\u11A8","\u1109\u1161\u11AF\u1105\u1175\u11B7","\u1109\u1161\u11AF\u110B\u1175\u11AB","\u1109\u1161\u11AF\u110D\u1161\u11A8","\u1109\u1161\u11B7\u1100\u1168\u1110\u1161\u11BC","\u1109\u1161\u11B7\u1100\u116E\u11A8","\u1109\u1161\u11B7\u1109\u1175\u11B8","\u1109\u1161\u11B7\u110B\u116F\u11AF","\u1109\u1161\u11B7\u110E\u1169\u11AB","\u1109\u1161\u11BC\u1100\u116A\u11AB","\u1109\u1161\u11BC\u1100\u1173\u11B7","\u1109\u1161\u11BC\u1103\u1162","\u1109\u1161\u11BC\u1105\u1172","\u1109\u1161\u11BC\u1107\u1161\u11AB\u1100\u1175","\u1109\u1161\u11BC\u1109\u1161\u11BC","\u1109\u1161\u11BC\u1109\u1175\u11A8","\u1109\u1161\u11BC\u110B\u1165\u11B8","\u1109\u1161\u11BC\u110B\u1175\u11AB","\u1109\u1161\u11BC\u110C\u1161","\u1109\u1161\u11BC\u110C\u1165\u11B7","\u1109\u1161\u11BC\u110E\u1165","\u1109\u1161\u11BC\u110E\u116E","\u1109\u1161\u11BC\u1110\u1162","\u1109\u1161\u11BC\u1111\u116D","\u1109\u1161\u11BC\u1111\u116E\u11B7","\u1109\u1161\u11BC\u1112\u116A\u11BC","\u1109\u1162\u1107\u1167\u11A8","\u1109\u1162\u11A8\u1101\u1161\u11AF","\u1109\u1162\u11A8\u110B\u1167\u11AB\u1111\u1175\u11AF","\u1109\u1162\u11BC\u1100\u1161\u11A8","\u1109\u1162\u11BC\u1106\u1167\u11BC","\u1109\u1162\u11BC\u1106\u116E\u11AF","\u1109\u1162\u11BC\u1107\u1161\u11BC\u1109\u1169\u11BC","\u1109\u1162\u11BC\u1109\u1161\u11AB","\u1109\u1162\u11BC\u1109\u1165\u11AB","\u1109\u1162\u11BC\u1109\u1175\u11AB","\u1109\u1162\u11BC\u110B\u1175\u11AF","\u1109\u1162\u11BC\u1112\u116A\u11AF","\u1109\u1165\u1105\u1161\u11B8","\u1109\u1165\u1105\u1173\u11AB","\u1109\u1165\u1106\u1167\u11BC","\u1109\u1165\u1106\u1175\u11AB","\u1109\u1165\u1107\u1175\u1109\u1173","\u1109\u1165\u110B\u1163\u11BC","\u1109\u1165\u110B\u116E\u11AF","\u1109\u1165\u110C\u1165\u11A8","\u1109\u1165\u110C\u1165\u11B7","\u1109\u1165\u110D\u1169\u11A8","\u1109\u1165\u110F\u1173\u11AF","\u1109\u1165\u11A8\u1109\u1161","\u1109\u1165\u11A8\u110B\u1172","\u1109\u1165\u11AB\u1100\u1165","\u1109\u1165\u11AB\u1106\u116E\u11AF","\u1109\u1165\u11AB\u1107\u1162","\u1109\u1165\u11AB\u1109\u1162\u11BC","\u1109\u1165\u11AB\u1109\u116E","\u1109\u1165\u11AB\u110B\u116F\u11AB","\u1109\u1165\u11AB\u110C\u1161\u11BC","\u1109\u1165\u11AB\u110C\u1165\u11AB","\u1109\u1165\u11AB\u1110\u1162\u11A8","\u1109\u1165\u11AB\u1111\u116E\u11BC\u1100\u1175","\u1109\u1165\u11AF\u1100\u1165\u110C\u1175","\u1109\u1165\u11AF\u1102\u1161\u11AF","\u1109\u1165\u11AF\u1105\u1165\u11BC\u1110\u1161\u11BC","\u1109\u1165\u11AF\u1106\u1167\u11BC","\u1109\u1165\u11AF\u1106\u116E\u11AB","\u1109\u1165\u11AF\u1109\u1161","\u1109\u1165\u11AF\u110B\u1161\u11A8\u1109\u1161\u11AB","\u1109\u1165\u11AF\u110E\u1175","\u1109\u1165\u11AF\u1110\u1161\u11BC","\u1109\u1165\u11B8\u110A\u1175","\u1109\u1165\u11BC\u1100\u1169\u11BC","\u1109\u1165\u11BC\u1103\u1161\u11BC","\u1109\u1165\u11BC\u1106\u1167\u11BC","\u1109\u1165\u11BC\u1107\u1167\u11AF","\u1109\u1165\u11BC\u110B\u1175\u11AB","\u1109\u1165\u11BC\u110C\u1161\u11BC","\u1109\u1165\u11BC\u110C\u1165\u11A8","\u1109\u1165\u11BC\u110C\u1175\u11AF","\u1109\u1165\u11BC\u1112\u1161\u11B7","\u1109\u1166\u1100\u1173\u11B7","\u1109\u1166\u1106\u1175\u1102\u1161","\u1109\u1166\u1109\u1161\u11BC","\u1109\u1166\u110B\u116F\u11AF","\u1109\u1166\u110C\u1169\u11BC\u1103\u1162\u110B\u116A\u11BC","\u1109\u1166\u1110\u1161\u11A8","\u1109\u1166\u11AB\u1110\u1165","\u1109\u1166\u11AB\u1110\u1175\u1106\u1175\u1110\u1165","\u1109\u1166\u11BA\u110D\u1162","\u1109\u1169\u1100\u1172\u1106\u1169","\u1109\u1169\u1100\u1173\u11A8\u110C\u1165\u11A8","\u1109\u1169\u1100\u1173\u11B7","\u1109\u1169\u1102\u1161\u1100\u1175","\u1109\u1169\u1102\u1167\u11AB","\u1109\u1169\u1103\u1173\u11A8","\u1109\u1169\u1106\u1161\u11BC","\u1109\u1169\u1106\u116E\u11AB","\u1109\u1169\u1109\u1165\u11AF","\u1109\u1169\u1109\u1169\u11A8","\u1109\u1169\u110B\u1161\u1100\u116A","\u1109\u1169\u110B\u116D\u11BC","\u1109\u1169\u110B\u116F\u11AB","\u1109\u1169\u110B\u1173\u11B7","\u1109\u1169\u110C\u116E\u11BC\u1112\u1175","\u1109\u1169\u110C\u1175\u1111\u116E\u11B7","\u1109\u1169\u110C\u1175\u11AF","\u1109\u1169\u1111\u116E\u11BC","\u1109\u1169\u1112\u1167\u11BC","\u1109\u1169\u11A8\u1103\u1161\u11B7","\u1109\u1169\u11A8\u1103\u1169","\u1109\u1169\u11A8\u110B\u1169\u11BA","\u1109\u1169\u11AB\u1100\u1161\u1105\u1161\u11A8","\u1109\u1169\u11AB\u1100\u1175\u11AF","\u1109\u1169\u11AB\u1102\u1167","\u1109\u1169\u11AB\u1102\u1175\u11B7","\u1109\u1169\u11AB\u1103\u1173\u11BC","\u1109\u1169\u11AB\u1106\u1169\u11A8","\u1109\u1169\u11AB\u1108\u1167\u11A8","\u1109\u1169\u11AB\u1109\u1175\u11AF","\u1109\u1169\u11AB\u110C\u1175\u11AF","\u1109\u1169\u11AB\u1110\u1169\u11B8","\u1109\u1169\u11AB\u1112\u1162","\u1109\u1169\u11AF\u110C\u1175\u11A8\u1112\u1175","\u1109\u1169\u11B7\u110A\u1175","\u1109\u1169\u11BC\u110B\u1161\u110C\u1175","\u1109\u1169\u11BC\u110B\u1175","\u1109\u1169\u11BC\u1111\u1167\u11AB","\u1109\u116C\u1100\u1169\u1100\u1175","\u1109\u116D\u1111\u1175\u11BC","\u1109\u116E\u1100\u1165\u11AB","\u1109\u116E\u1102\u1167\u11AB","\u1109\u116E\u1103\u1161\u11AB","\u1109\u116E\u1103\u1169\u11BA\u1106\u116E\u11AF","\u1109\u116E\u1103\u1169\u11BC\u110C\u1165\u11A8","\u1109\u116E\u1106\u1167\u11AB","\u1109\u116E\u1106\u1167\u11BC","\u1109\u116E\u1107\u1161\u11A8","\u1109\u116E\u1109\u1161\u11BC","\u1109\u116E\u1109\u1165\u11A8","\u1109\u116E\u1109\u116E\u11AF","\u1109\u116E\u1109\u1175\u1105\u1169","\u1109\u116E\u110B\u1165\u11B8","\u1109\u116E\u110B\u1167\u11B7","\u1109\u116E\u110B\u1167\u11BC","\u1109\u116E\u110B\u1175\u11B8","\u1109\u116E\u110C\u116E\u11AB","\u1109\u116E\u110C\u1175\u11B8","\u1109\u116E\u110E\u116E\u11AF","\u1109\u116E\u110F\u1165\u11BA","\u1109\u116E\u1111\u1175\u11AF","\u1109\u116E\u1112\u1161\u11A8","\u1109\u116E\u1112\u1165\u11B7\u1109\u1162\u11BC","\u1109\u116E\u1112\u116A\u1100\u1175","\u1109\u116E\u11A8\u1102\u1167","\u1109\u116E\u11A8\u1109\u1169","\u1109\u116E\u11A8\u110C\u1166","\u1109\u116E\u11AB\u1100\u1161\u11AB","\u1109\u116E\u11AB\u1109\u1165","\u1109\u116E\u11AB\u1109\u116E","\u1109\u116E\u11AB\u1109\u1175\u11A8\u1100\u1161\u11AB","\u1109\u116E\u11AB\u110B\u1171","\u1109\u116E\u11AE\u1100\u1161\u1105\u1161\u11A8","\u1109\u116E\u11AF\u1107\u1167\u11BC","\u1109\u116E\u11AF\u110C\u1175\u11B8","\u1109\u116E\u11BA\u110C\u1161","\u1109\u1173\u1102\u1175\u11B7","\u1109\u1173\u1106\u116E\u11AF","\u1109\u1173\u1109\u1173\u1105\u1169","\u1109\u1173\u1109\u1173\u11BC","\u1109\u1173\u110B\u1170\u1110\u1165","\u1109\u1173\u110B\u1171\u110E\u1175","\u1109\u1173\u110F\u1166\u110B\u1175\u1110\u1173","\u1109\u1173\u1110\u1172\u1103\u1175\u110B\u1169","\u1109\u1173\u1110\u1173\u1105\u1166\u1109\u1173","\u1109\u1173\u1111\u1169\u110E\u1173","\u1109\u1173\u11AF\u110D\u1165\u11A8","\u1109\u1173\u11AF\u1111\u1173\u11B7","\u1109\u1173\u11B8\u1100\u116A\u11AB","\u1109\u1173\u11B8\u1100\u1175","\u1109\u1173\u11BC\u1100\u1162\u11A8","\u1109\u1173\u11BC\u1105\u1175","\u1109\u1173\u11BC\u1107\u116E","\u1109\u1173\u11BC\u110B\u116D\u11BC\u110E\u1161","\u1109\u1173\u11BC\u110C\u1175\u11AB","\u1109\u1175\u1100\u1161\u11A8","\u1109\u1175\u1100\u1161\u11AB","\u1109\u1175\u1100\u1169\u11AF","\u1109\u1175\u1100\u1173\u11B7\u110E\u1175","\u1109\u1175\u1102\u1161\u1105\u1175\u110B\u1169","\u1109\u1175\u1103\u1162\u11A8","\u1109\u1175\u1105\u1175\u110C\u1173","\u1109\u1175\u1106\u1166\u11AB\u1110\u1173","\u1109\u1175\u1106\u1175\u11AB","\u1109\u1175\u1107\u116E\u1106\u1169","\u1109\u1175\u1109\u1165\u11AB","\u1109\u1175\u1109\u1165\u11AF","\u1109\u1175\u1109\u1173\u1110\u1166\u11B7","\u1109\u1175\u110B\u1161\u1107\u1165\u110C\u1175","\u1109\u1175\u110B\u1165\u1106\u1165\u1102\u1175","\u1109\u1175\u110B\u116F\u11AF","\u1109\u1175\u110B\u1175\u11AB","\u1109\u1175\u110B\u1175\u11AF","\u1109\u1175\u110C\u1161\u11A8","\u1109\u1175\u110C\u1161\u11BC","\u1109\u1175\u110C\u1165\u11AF","\u1109\u1175\u110C\u1165\u11B7","\u1109\u1175\u110C\u116E\u11BC","\u1109\u1175\u110C\u1173\u11AB","\u1109\u1175\u110C\u1175\u11B8","\u1109\u1175\u110E\u1165\u11BC","\u1109\u1175\u1112\u1161\u11B8","\u1109\u1175\u1112\u1165\u11B7","\u1109\u1175\u11A8\u1100\u116E","\u1109\u1175\u11A8\u1100\u1175","\u1109\u1175\u11A8\u1103\u1161\u11BC","\u1109\u1175\u11A8\u1105\u1163\u11BC","\u1109\u1175\u11A8\u1105\u116D\u1111\u116E\u11B7","\u1109\u1175\u11A8\u1106\u116E\u11AF","\u1109\u1175\u11A8\u1108\u1161\u11BC","\u1109\u1175\u11A8\u1109\u1161","\u1109\u1175\u11A8\u1109\u1162\u11BC\u1112\u116A\u11AF","\u1109\u1175\u11A8\u110E\u1169","\u1109\u1175\u11A8\u1110\u1161\u11A8","\u1109\u1175\u11A8\u1111\u116E\u11B7","\u1109\u1175\u11AB\u1100\u1169","\u1109\u1175\u11AB\u1100\u1172","\u1109\u1175\u11AB\u1102\u1167\u11B7","\u1109\u1175\u11AB\u1106\u116E\u11AB","\u1109\u1175\u11AB\u1107\u1161\u11AF","\u1109\u1175\u11AB\u1107\u1175","\u1109\u1175\u11AB\u1109\u1161","\u1109\u1175\u11AB\u1109\u1166","\u1109\u1175\u11AB\u110B\u116D\u11BC","\u1109\u1175\u11AB\u110C\u1166\u1111\u116E\u11B7","\u1109\u1175\u11AB\u110E\u1165\u11BC","\u1109\u1175\u11AB\u110E\u1166","\u1109\u1175\u11AB\u1112\u116A","\u1109\u1175\u11AF\u1100\u1161\u11B7","\u1109\u1175\u11AF\u1102\u1162","\u1109\u1175\u11AF\u1105\u1167\u11A8","\u1109\u1175\u11AF\u1105\u1168","\u1109\u1175\u11AF\u1106\u1161\u11BC","\u1109\u1175\u11AF\u1109\u116E","\u1109\u1175\u11AF\u1109\u1173\u11B8","\u1109\u1175\u11AF\u1109\u1175","\u1109\u1175\u11AF\u110C\u1161\u11BC","\u1109\u1175\u11AF\u110C\u1165\u11BC","\u1109\u1175\u11AF\u110C\u1175\u11AF\u110C\u1165\u11A8","\u1109\u1175\u11AF\u110E\u1165\u11AB","\u1109\u1175\u11AF\u110E\u1166","\u1109\u1175\u11AF\u110F\u1165\u11BA","\u1109\u1175\u11AF\u1110\u1162","\u1109\u1175\u11AF\u1111\u1162","\u1109\u1175\u11AF\u1112\u1165\u11B7","\u1109\u1175\u11AF\u1112\u1167\u11AB","\u1109\u1175\u11B7\u1105\u1175","\u1109\u1175\u11B7\u1107\u116E\u1105\u1173\u11B7","\u1109\u1175\u11B7\u1109\u1161","\u1109\u1175\u11B7\u110C\u1161\u11BC","\u1109\u1175\u11B7\u110C\u1165\u11BC","\u1109\u1175\u11B7\u1111\u1161\u11AB","\u110A\u1161\u11BC\u1103\u116E\u11BC\u110B\u1175","\u110A\u1175\u1105\u1173\u11B7","\u110A\u1175\u110B\u1161\u11BA","\u110B\u1161\u1100\u1161\u110A\u1175","\u110B\u1161\u1102\u1161\u110B\u116E\u11AB\u1109\u1165","\u110B\u1161\u1103\u1173\u1102\u1175\u11B7","\u110B\u1161\u1103\u1173\u11AF","\u110B\u1161\u1109\u1171\u110B\u116E\u11B7","\u110B\u1161\u1109\u1173\u1111\u1161\u11AF\u1110\u1173","\u110B\u1161\u1109\u1175\u110B\u1161","\u110B\u1161\u110B\u116E\u11AF\u1105\u1165","\u110B\u1161\u110C\u1165\u110A\u1175","\u110B\u1161\u110C\u116E\u11B7\u1106\u1161","\u110B\u1161\u110C\u1175\u11A8","\u110B\u1161\u110E\u1175\u11B7","\u110B\u1161\u1111\u1161\u1110\u1173","\u110B\u1161\u1111\u1173\u1105\u1175\u110F\u1161","\u110B\u1161\u1111\u1173\u11B7","\u110B\u1161\u1112\u1169\u11B8","\u110B\u1161\u1112\u1173\u11AB","\u110B\u1161\u11A8\u1100\u1175","\u110B\u1161\u11A8\u1106\u1169\u11BC","\u110B\u1161\u11A8\u1109\u116E","\u110B\u1161\u11AB\u1100\u1162","\u110B\u1161\u11AB\u1100\u1167\u11BC","\u110B\u1161\u11AB\u1100\u116A","\u110B\u1161\u11AB\u1102\u1162","\u110B\u1161\u11AB\u1102\u1167\u11BC","\u110B\u1161\u11AB\u1103\u1169\u11BC","\u110B\u1161\u11AB\u1107\u1161\u11BC","\u110B\u1161\u11AB\u1107\u116E","\u110B\u1161\u11AB\u110C\u116E","\u110B\u1161\u11AF\u1105\u116E\u1106\u1175\u1102\u1172\u11B7","\u110B\u1161\u11AF\u110F\u1169\u110B\u1169\u11AF","\u110B\u1161\u11B7\u1109\u1175","\u110B\u1161\u11B7\u110F\u1165\u11BA","\u110B\u1161\u11B8\u1105\u1167\u11A8","\u110B\u1161\u11C1\u1102\u1161\u11AF","\u110B\u1161\u11C1\u1106\u116E\u11AB","\u110B\u1162\u110B\u1175\u11AB","\u110B\u1162\u110C\u1165\u11BC","\u110B\u1162\u11A8\u1109\u116E","\u110B\u1162\u11AF\u1107\u1165\u11B7","\u110B\u1163\u1100\u1161\u11AB","\u110B\u1163\u1103\u1161\u11AB","\u110B\u1163\u110B\u1169\u11BC","\u110B\u1163\u11A8\u1100\u1161\u11AB","\u110B\u1163\u11A8\u1100\u116E\u11A8","\u110B\u1163\u11A8\u1109\u1169\u11A8","\u110B\u1163\u11A8\u1109\u116E","\u110B\u1163\u11A8\u110C\u1165\u11B7","\u110B\u1163\u11A8\u1111\u116E\u11B7","\u110B\u1163\u11A8\u1112\u1169\u11AB\u1102\u1167","\u110B\u1163\u11BC\u1102\u1167\u11B7","\u110B\u1163\u11BC\u1105\u1167\u11A8","\u110B\u1163\u11BC\u1106\u1161\u11AF","\u110B\u1163\u11BC\u1107\u1162\u110E\u116E","\u110B\u1163\u11BC\u110C\u116E","\u110B\u1163\u11BC\u1111\u1161","\u110B\u1165\u1103\u116E\u11B7","\u110B\u1165\u1105\u1167\u110B\u116E\u11B7","\u110B\u1165\u1105\u1173\u11AB","\u110B\u1165\u110C\u1166\u11BA\u1107\u1161\u11B7","\u110B\u1165\u110D\u1162\u11BB\u1103\u1173\u11AB","\u110B\u1165\u110D\u1165\u1103\u1161\u1100\u1161","\u110B\u1165\u110D\u1165\u11AB\u110C\u1175","\u110B\u1165\u11AB\u1102\u1175","\u110B\u1165\u11AB\u1103\u1165\u11A8","\u110B\u1165\u11AB\u1105\u1169\u11AB","\u110B\u1165\u11AB\u110B\u1165","\u110B\u1165\u11AF\u1100\u116E\u11AF","\u110B\u1165\u11AF\u1105\u1173\u11AB","\u110B\u1165\u11AF\u110B\u1173\u11B7","\u110B\u1165\u11AF\u1111\u1175\u11BA","\u110B\u1165\u11B7\u1106\u1161","\u110B\u1165\u11B8\u1106\u116E","\u110B\u1165\u11B8\u110C\u1169\u11BC","\u110B\u1165\u11B8\u110E\u1166","\u110B\u1165\u11BC\u1103\u1165\u11BC\u110B\u1175","\u110B\u1165\u11BC\u1106\u1161\u11BC","\u110B\u1165\u11BC\u1110\u1165\u1105\u1175","\u110B\u1165\u11BD\u1100\u1173\u110C\u1166","\u110B\u1166\u1102\u1165\u110C\u1175","\u110B\u1166\u110B\u1165\u110F\u1165\u11AB","\u110B\u1166\u11AB\u110C\u1175\u11AB","\u110B\u1167\u1100\u1165\u11AB","\u110B\u1167\u1100\u1169\u1109\u1162\u11BC","\u110B\u1167\u1100\u116A\u11AB","\u110B\u1167\u1100\u116E\u11AB","\u110B\u1167\u1100\u116F\u11AB","\u110B\u1167\u1103\u1162\u1109\u1162\u11BC","\u110B\u1167\u1103\u1165\u11B2","\u110B\u1167\u1103\u1169\u11BC\u1109\u1162\u11BC","\u110B\u1167\u1103\u1173\u11AB","\u110B\u1167\u1105\u1169\u11AB","\u110B\u1167\u1105\u1173\u11B7","\u110B\u1167\u1109\u1165\u11BA","\u110B\u1167\u1109\u1165\u11BC","\u110B\u1167\u110B\u116A\u11BC","\u110B\u1167\u110B\u1175\u11AB","\u110B\u1167\u110C\u1165\u11AB\u1112\u1175","\u110B\u1167\u110C\u1175\u11A8\u110B\u116F\u11AB","\u110B\u1167\u1112\u1161\u11A8\u1109\u1162\u11BC","\u110B\u1167\u1112\u1162\u11BC","\u110B\u1167\u11A8\u1109\u1161","\u110B\u1167\u11A8\u1109\u1175","\u110B\u1167\u11A8\u1112\u1161\u11AF","\u110B\u1167\u11AB\u1100\u1167\u11AF","\u110B\u1167\u11AB\u1100\u116E","\u110B\u1167\u11AB\u1100\u1173\u11A8","\u110B\u1167\u11AB\u1100\u1175","\u110B\u1167\u11AB\u1105\u1161\u11A8","\u110B\u1167\u11AB\u1109\u1165\u11AF","\u110B\u1167\u11AB\u1109\u1166","\u110B\u1167\u11AB\u1109\u1169\u11A8","\u110B\u1167\u11AB\u1109\u1173\u11B8","\u110B\u1167\u11AB\u110B\u1162","\u110B\u1167\u11AB\u110B\u1168\u110B\u1175\u11AB","\u110B\u1167\u11AB\u110B\u1175\u11AB","\u110B\u1167\u11AB\u110C\u1161\u11BC","\u110B\u1167\u11AB\u110C\u116E","\u110B\u1167\u11AB\u110E\u116E\u11AF","\u110B\u1167\u11AB\u1111\u1175\u11AF","\u110B\u1167\u11AB\u1112\u1161\u11B8","\u110B\u1167\u11AB\u1112\u1172","\u110B\u1167\u11AF\u1100\u1175","\u110B\u1167\u11AF\u1106\u1162","\u110B\u1167\u11AF\u1109\u116C","\u110B\u1167\u11AF\u1109\u1175\u11B7\u1112\u1175","\u110B\u1167\u11AF\u110C\u1165\u11BC","\u110B\u1167\u11AF\u110E\u1161","\u110B\u1167\u11AF\u1112\u1173\u11AF","\u110B\u1167\u11B7\u1105\u1167","\u110B\u1167\u11B8\u1109\u1165","\u110B\u1167\u11BC\u1100\u116E\u11A8","\u110B\u1167\u11BC\u1102\u1161\u11B7","\u110B\u1167\u11BC\u1109\u1161\u11BC","\u110B\u1167\u11BC\u110B\u1163\u11BC","\u110B\u1167\u11BC\u110B\u1167\u11A8","\u110B\u1167\u11BC\u110B\u116E\u11BC","\u110B\u1167\u11BC\u110B\u116F\u11AB\u1112\u1175","\u110B\u1167\u11BC\u1112\u1161","\u110B\u1167\u11BC\u1112\u1163\u11BC","\u110B\u1167\u11BC\u1112\u1169\u11AB","\u110B\u1167\u11BC\u1112\u116A","\u110B\u1167\u11C1\u1100\u116E\u1105\u1175","\u110B\u1167\u11C1\u1107\u1161\u11BC","\u110B\u1167\u11C1\u110C\u1175\u11B8","\u110B\u1168\u1100\u1161\u11B7","\u110B\u1168\u1100\u1173\u11B7","\u110B\u1168\u1107\u1161\u11BC","\u110B\u1168\u1109\u1161\u11AB","\u110B\u1168\u1109\u1161\u11BC","\u110B\u1168\u1109\u1165\u11AB","\u110B\u1168\u1109\u116E\u11AF","\u110B\u1168\u1109\u1173\u11B8","\u110B\u1168\u1109\u1175\u11A8\u110C\u1161\u11BC","\u110B\u1168\u110B\u1163\u11A8","\u110B\u1168\u110C\u1165\u11AB","\u110B\u1168\u110C\u1165\u11AF","\u110B\u1168\u110C\u1165\u11BC","\u110B\u1168\u110F\u1165\u11AB\u1103\u1162","\u110B\u1168\u11BA\u1102\u1161\u11AF","\u110B\u1169\u1102\u1173\u11AF","\u110B\u1169\u1105\u1161\u11A8","\u110B\u1169\u1105\u1162\u11BA\u1103\u1169\u11BC\u110B\u1161\u11AB","\u110B\u1169\u1105\u1166\u11AB\u110C\u1175","\u110B\u1169\u1105\u1169\u110C\u1175","\u110B\u1169\u1105\u1173\u11AB\u1107\u1161\u11AF","\u110B\u1169\u1107\u1173\u11AB","\u110B\u1169\u1109\u1175\u11B8","\u110B\u1169\u110B\u1167\u11B7","\u110B\u1169\u110B\u116F\u11AF","\u110B\u1169\u110C\u1165\u11AB","\u110B\u1169\u110C\u1175\u11A8","\u110B\u1169\u110C\u1175\u11BC\u110B\u1165","\u110B\u1169\u1111\u1166\u1105\u1161","\u110B\u1169\u1111\u1175\u1109\u1173\u1110\u1166\u11AF","\u110B\u1169\u1112\u1175\u1105\u1167","\u110B\u1169\u11A8\u1109\u1161\u11BC","\u110B\u1169\u11A8\u1109\u116E\u1109\u116E","\u110B\u1169\u11AB\u1100\u1161\u11BD","\u110B\u1169\u11AB\u1105\u1161\u110B\u1175\u11AB","\u110B\u1169\u11AB\u1106\u1169\u11B7","\u110B\u1169\u11AB\u110C\u1169\u11BC\u110B\u1175\u11AF","\u110B\u1169\u11AB\u1110\u1169\u11BC","\u110B\u1169\u11AF\u1100\u1161\u110B\u1173\u11AF","\u110B\u1169\u11AF\u1105\u1175\u11B7\u1111\u1175\u11A8","\u110B\u1169\u11AF\u1112\u1162","\u110B\u1169\u11BA\u110E\u1161\u1105\u1175\u11B7","\u110B\u116A\u110B\u1175\u1109\u1167\u110E\u1173","\u110B\u116A\u110B\u1175\u11AB","\u110B\u116A\u11AB\u1109\u1165\u11BC","\u110B\u116A\u11AB\u110C\u1165\u11AB","\u110B\u116A\u11BC\u1107\u1175","\u110B\u116A\u11BC\u110C\u1161","\u110B\u116B\u1102\u1163\u1112\u1161\u1106\u1167\u11AB","\u110B\u116B\u11AB\u110C\u1175","\u110B\u116C\u1100\u1161\u11BA\u110C\u1175\u11B8","\u110B\u116C\u1100\u116E\u11A8","\u110B\u116C\u1105\u1169\u110B\u116E\u11B7","\u110B\u116C\u1109\u1161\u11B7\u110E\u1169\u11AB","\u110B\u116C\u110E\u116E\u11AF","\u110B\u116C\u110E\u1175\u11B7","\u110B\u116C\u1112\u1161\u11AF\u1106\u1165\u1102\u1175","\u110B\u116C\u11AB\u1107\u1161\u11AF","\u110B\u116C\u11AB\u1109\u1169\u11AB","\u110B\u116C\u11AB\u110D\u1169\u11A8","\u110B\u116D\u1100\u1173\u11B7","\u110B\u116D\u110B\u1175\u11AF","\u110B\u116D\u110C\u1173\u11B7","\u110B\u116D\u110E\u1165\u11BC","\u110B\u116D\u11BC\u1100\u1175","\u110B\u116D\u11BC\u1109\u1165","\u110B\u116D\u11BC\u110B\u1165","\u110B\u116E\u1109\u1161\u11AB","\u110B\u116E\u1109\u1165\u11AB","\u110B\u116E\u1109\u1173\u11BC","\u110B\u116E\u110B\u1167\u11AB\u1112\u1175","\u110B\u116E\u110C\u1165\u11BC","\u110B\u116E\u110E\u1166\u1100\u116E\u11A8","\u110B\u116E\u1111\u1167\u11AB","\u110B\u116E\u11AB\u1103\u1169\u11BC","\u110B\u116E\u11AB\u1106\u1167\u11BC","\u110B\u116E\u11AB\u1107\u1161\u11AB","\u110B\u116E\u11AB\u110C\u1165\u11AB","\u110B\u116E\u11AB\u1112\u1162\u11BC","\u110B\u116E\u11AF\u1109\u1161\u11AB","\u110B\u116E\u11AF\u110B\u1173\u11B7","\u110B\u116E\u11B7\u110C\u1175\u11A8\u110B\u1175\u11B7","\u110B\u116E\u11BA\u110B\u1165\u1105\u1173\u11AB","\u110B\u116E\u11BA\u110B\u1173\u11B7","\u110B\u116F\u1102\u1161\u11A8","\u110B\u116F\u11AB\u1100\u1169","\u110B\u116F\u11AB\u1105\u1162","\u110B\u116F\u11AB\u1109\u1165","\u110B\u116F\u11AB\u1109\u116E\u11BC\u110B\u1175","\u110B\u116F\u11AB\u110B\u1175\u11AB","\u110B\u116F\u11AB\u110C\u1161\u11BC","\u110B\u116F\u11AB\u1111\u1175\u1109\u1173","\u110B\u116F\u11AF\u1100\u1173\u11B8","\u110B\u116F\u11AF\u1103\u1173\u110F\u1165\u11B8","\u110B\u116F\u11AF\u1109\u1166","\u110B\u116F\u11AF\u110B\u116D\u110B\u1175\u11AF","\u110B\u1170\u110B\u1175\u1110\u1165","\u110B\u1171\u1107\u1161\u11AB","\u110B\u1171\u1107\u1165\u11B8","\u110B\u1171\u1109\u1165\u11BC","\u110B\u1171\u110B\u116F\u11AB","\u110B\u1171\u1112\u1165\u11B7","\u110B\u1171\u1112\u1167\u11B8","\u110B\u1171\u11BA\u1109\u1161\u1105\u1161\u11B7","\u110B\u1172\u1102\u1161\u11AB\u1112\u1175","\u110B\u1172\u1105\u1165\u11B8","\u110B\u1172\u1106\u1167\u11BC","\u110B\u1172\u1106\u116E\u11AF","\u110B\u1172\u1109\u1161\u11AB","\u110B\u1172\u110C\u1165\u11A8","\u110B\u1172\u110E\u1175\u110B\u116F\u11AB","\u110B\u1172\u1112\u1161\u11A8","\u110B\u1172\u1112\u1162\u11BC","\u110B\u1172\u1112\u1167\u11BC","\u110B\u1172\u11A8\u1100\u116E\u11AB","\u110B\u1172\u11A8\u1109\u1161\u11BC","\u110B\u1172\u11A8\u1109\u1175\u11B8","\u110B\u1172\u11A8\u110E\u1166","\u110B\u1173\u11AB\u1112\u1162\u11BC","\u110B\u1173\u11B7\u1105\u1167\u11A8","\u110B\u1173\u11B7\u1105\u116D","\u110B\u1173\u11B7\u1107\u1161\u11AB","\u110B\u1173\u11B7\u1109\u1165\u11BC","\u110B\u1173\u11B7\u1109\u1175\u11A8","\u110B\u1173\u11B7\u110B\u1161\u11A8","\u110B\u1173\u11B7\u110C\u116E","\u110B\u1174\u1100\u1167\u11AB","\u110B\u1174\u1102\u1169\u11AB","\u110B\u1174\u1106\u116E\u11AB","\u110B\u1174\u1107\u1169\u11A8","\u110B\u1174\u1109\u1175\u11A8","\u110B\u1174\u1109\u1175\u11B7","\u110B\u1174\u110B\u116C\u1105\u1169","\u110B\u1174\u110B\u116D\u11A8","\u110B\u1174\u110B\u116F\u11AB","\u110B\u1174\u1112\u1161\u11A8","\u110B\u1175\u1100\u1165\u11BA","\u110B\u1175\u1100\u1169\u11BA","\u110B\u1175\u1102\u1167\u11B7","\u110B\u1175\u1102\u1169\u11B7","\u110B\u1175\u1103\u1161\u11AF","\u110B\u1175\u1103\u1162\u1105\u1169","\u110B\u1175\u1103\u1169\u11BC","\u110B\u1175\u1105\u1165\u11C2\u1100\u1166","\u110B\u1175\u1105\u1167\u11A8\u1109\u1165","\u110B\u1175\u1105\u1169\u11AB\u110C\u1165\u11A8","\u110B\u1175\u1105\u1173\u11B7","\u110B\u1175\u1106\u1175\u11AB","\u110B\u1175\u1107\u1161\u11AF\u1109\u1169","\u110B\u1175\u1107\u1167\u11AF","\u110B\u1175\u1107\u116E\u11AF","\u110B\u1175\u1108\u1161\u11AF","\u110B\u1175\u1109\u1161\u11BC","\u110B\u1175\u1109\u1165\u11BC","\u110B\u1175\u1109\u1173\u11AF","\u110B\u1175\u110B\u1163\u1100\u1175","\u110B\u1175\u110B\u116D\u11BC","\u110B\u1175\u110B\u116E\u11BA","\u110B\u1175\u110B\u116F\u11AF","\u110B\u1175\u110B\u1173\u11A8\u1100\u1169","\u110B\u1175\u110B\u1175\u11A8","\u110B\u1175\u110C\u1165\u11AB","\u110B\u1175\u110C\u116E\u11BC","\u110B\u1175\u1110\u1173\u11AE\u1102\u1161\u11AF","\u110B\u1175\u1110\u1173\u11AF","\u110B\u1175\u1112\u1169\u11AB","\u110B\u1175\u11AB\u1100\u1161\u11AB","\u110B\u1175\u11AB\u1100\u1167\u11A8","\u110B\u1175\u11AB\u1100\u1169\u11BC","\u110B\u1175\u11AB\u1100\u116E","\u110B\u1175\u11AB\u1100\u1173\u11AB","\u110B\u1175\u11AB\u1100\u1175","\u110B\u1175\u11AB\u1103\u1169","\u110B\u1175\u11AB\u1105\u1172","\u110B\u1175\u11AB\u1106\u116E\u11AF","\u110B\u1175\u11AB\u1109\u1162\u11BC","\u110B\u1175\u11AB\u1109\u116B","\u110B\u1175\u11AB\u110B\u1167\u11AB","\u110B\u1175\u11AB\u110B\u116F\u11AB","\u110B\u1175\u11AB\u110C\u1162","\u110B\u1175\u11AB\u110C\u1169\u11BC","\u110B\u1175\u11AB\u110E\u1165\u11AB","\u110B\u1175\u11AB\u110E\u1166","\u110B\u1175\u11AB\u1110\u1165\u1102\u1166\u11BA","\u110B\u1175\u11AB\u1112\u1161","\u110B\u1175\u11AB\u1112\u1167\u11BC","\u110B\u1175\u11AF\u1100\u1169\u11B8","\u110B\u1175\u11AF\u1100\u1175","\u110B\u1175\u11AF\u1103\u1161\u11AB","\u110B\u1175\u11AF\u1103\u1162","\u110B\u1175\u11AF\u1103\u1173\u11BC","\u110B\u1175\u11AF\u1107\u1161\u11AB","\u110B\u1175\u11AF\u1107\u1169\u11AB","\u110B\u1175\u11AF\u1107\u116E","\u110B\u1175\u11AF\u1109\u1161\u11BC","\u110B\u1175\u11AF\u1109\u1162\u11BC","\u110B\u1175\u11AF\u1109\u1169\u11AB","\u110B\u1175\u11AF\u110B\u116D\u110B\u1175\u11AF","\u110B\u1175\u11AF\u110B\u116F\u11AF","\u110B\u1175\u11AF\u110C\u1165\u11BC","\u110B\u1175\u11AF\u110C\u1169\u11BC","\u110B\u1175\u11AF\u110C\u116E\u110B\u1175\u11AF","\u110B\u1175\u11AF\u110D\u1175\u11A8","\u110B\u1175\u11AF\u110E\u1166","\u110B\u1175\u11AF\u110E\u1175","\u110B\u1175\u11AF\u1112\u1162\u11BC","\u110B\u1175\u11AF\u1112\u116C\u110B\u116D\u11BC","\u110B\u1175\u11B7\u1100\u1173\u11B7","\u110B\u1175\u11B7\u1106\u116E","\u110B\u1175\u11B8\u1103\u1162","\u110B\u1175\u11B8\u1105\u1167\u11A8","\u110B\u1175\u11B8\u1106\u1161\u11BA","\u110B\u1175\u11B8\u1109\u1161","\u110B\u1175\u11B8\u1109\u116E\u11AF","\u110B\u1175\u11B8\u1109\u1175","\u110B\u1175\u11B8\u110B\u116F\u11AB","\u110B\u1175\u11B8\u110C\u1161\u11BC","\u110B\u1175\u11B8\u1112\u1161\u11A8","\u110C\u1161\u1100\u1161\u110B\u116D\u11BC","\u110C\u1161\u1100\u1167\u11A8","\u110C\u1161\u1100\u1173\u11A8","\u110C\u1161\u1103\u1169\u11BC","\u110C\u1161\u1105\u1161\u11BC","\u110C\u1161\u1107\u116E\u1109\u1175\u11B7","\u110C\u1161\u1109\u1175\u11A8","\u110C\u1161\u1109\u1175\u11AB","\u110C\u1161\u110B\u1167\u11AB","\u110C\u1161\u110B\u116F\u11AB","\u110C\u1161\u110B\u1172\u11AF","\u110C\u1161\u110C\u1165\u11AB\u1100\u1165","\u110C\u1161\u110C\u1165\u11BC","\u110C\u1161\u110C\u1169\u11AB\u1109\u1175\u11B7","\u110C\u1161\u1111\u1161\u11AB","\u110C\u1161\u11A8\u1100\u1161","\u110C\u1161\u11A8\u1102\u1167\u11AB","\u110C\u1161\u11A8\u1109\u1165\u11BC","\u110C\u1161\u11A8\u110B\u1165\u11B8","\u110C\u1161\u11A8\u110B\u116D\u11BC","\u110C\u1161\u11A8\u110B\u1173\u11AB\u1104\u1161\u11AF","\u110C\u1161\u11A8\u1111\u116E\u11B7","\u110C\u1161\u11AB\u1103\u1175","\u110C\u1161\u11AB\u1104\u1173\u11A8","\u110C\u1161\u11AB\u110E\u1175","\u110C\u1161\u11AF\u1106\u1169\u11BA","\u110C\u1161\u11B7\u1101\u1161\u11AB","\u110C\u1161\u11B7\u1109\u116E\u1112\u1161\u11B7","\u110C\u1161\u11B7\u1109\u1175","\u110C\u1161\u11B7\u110B\u1169\u11BA","\u110C\u1161\u11B7\u110C\u1161\u1105\u1175","\u110C\u1161\u11B8\u110C\u1175","\u110C\u1161\u11BC\u1100\u116A\u11AB","\u110C\u1161\u11BC\u1100\u116E\u11AB","\u110C\u1161\u11BC\u1100\u1175\u1100\u1161\u11AB","\u110C\u1161\u11BC\u1105\u1162","\u110C\u1161\u11BC\u1105\u1168","\u110C\u1161\u11BC\u1105\u1173","\u110C\u1161\u11BC\u1106\u1161","\u110C\u1161\u11BC\u1106\u1167\u11AB","\u110C\u1161\u11BC\u1106\u1169","\u110C\u1161\u11BC\u1106\u1175","\u110C\u1161\u11BC\u1107\u1175","\u110C\u1161\u11BC\u1109\u1161","\u110C\u1161\u11BC\u1109\u1169","\u110C\u1161\u11BC\u1109\u1175\u11A8","\u110C\u1161\u11BC\u110B\u1162\u110B\u1175\u11AB","\u110C\u1161\u11BC\u110B\u1175\u11AB","\u110C\u1161\u11BC\u110C\u1165\u11B7","\u110C\u1161\u11BC\u110E\u1161","\u110C\u1161\u11BC\u1112\u1161\u11A8\u1100\u1173\u11B7","\u110C\u1162\u1102\u1173\u11BC","\u110C\u1162\u1108\u1161\u11AF\u1105\u1175","\u110C\u1162\u1109\u1161\u11AB","\u110C\u1162\u1109\u1162\u11BC","\u110C\u1162\u110C\u1161\u11A8\u1102\u1167\u11AB","\u110C\u1162\u110C\u1165\u11BC","\u110C\u1162\u110E\u1162\u1100\u1175","\u110C\u1162\u1111\u1161\u11AB","\u110C\u1162\u1112\u1161\u11A8","\u110C\u1162\u1112\u116A\u11AF\u110B\u116D\u11BC","\u110C\u1165\u1100\u1165\u11BA","\u110C\u1165\u1100\u1169\u1105\u1175","\u110C\u1165\u1100\u1169\u11BA","\u110C\u1165\u1102\u1167\u11A8","\u110C\u1165\u1105\u1165\u11AB","\u110C\u1165\u1105\u1165\u11C2\u1100\u1166","\u110C\u1165\u1107\u1165\u11AB","\u110C\u1165\u110B\u116E\u11AF","\u110C\u1165\u110C\u1165\u11AF\u1105\u1169","\u110C\u1165\u110E\u116E\u11A8","\u110C\u1165\u11A8\u1100\u1173\u11A8","\u110C\u1165\u11A8\u1103\u1161\u11BC\u1112\u1175","\u110C\u1165\u11A8\u1109\u1165\u11BC","\u110C\u1165\u11A8\u110B\u116D\u11BC","\u110C\u1165\u11A8\u110B\u1173\u11BC","\u110C\u1165\u11AB\u1100\u1162","\u110C\u1165\u11AB\u1100\u1169\u11BC","\u110C\u1165\u11AB\u1100\u1175","\u110C\u1165\u11AB\u1103\u1161\u11AF","\u110C\u1165\u11AB\u1105\u1161\u1103\u1169","\u110C\u1165\u11AB\u1106\u1161\u11BC","\u110C\u1165\u11AB\u1106\u116E\u11AB","\u110C\u1165\u11AB\u1107\u1161\u11AB","\u110C\u1165\u11AB\u1107\u116E","\u110C\u1165\u11AB\u1109\u1166","\u110C\u1165\u11AB\u1109\u1175","\u110C\u1165\u11AB\u110B\u116D\u11BC","\u110C\u1165\u11AB\u110C\u1161","\u110C\u1165\u11AB\u110C\u1162\u11BC","\u110C\u1165\u11AB\u110C\u116E","\u110C\u1165\u11AB\u110E\u1165\u11AF","\u110C\u1165\u11AB\u110E\u1166","\u110C\u1165\u11AB\u1110\u1169\u11BC","\u110C\u1165\u11AB\u1112\u1167","\u110C\u1165\u11AB\u1112\u116E","\u110C\u1165\u11AF\u1103\u1162","\u110C\u1165\u11AF\u1106\u1161\u11BC","\u110C\u1165\u11AF\u1107\u1161\u11AB","\u110C\u1165\u11AF\u110B\u1163\u11A8","\u110C\u1165\u11AF\u110E\u1161","\u110C\u1165\u11B7\u1100\u1165\u11B7","\u110C\u1165\u11B7\u1109\u116E","\u110C\u1165\u11B7\u1109\u1175\u11B7","\u110C\u1165\u11B7\u110B\u116F\u11AB","\u110C\u1165\u11B7\u110C\u1165\u11B7","\u110C\u1165\u11B7\u110E\u1161","\u110C\u1165\u11B8\u1100\u1173\u11AB","\u110C\u1165\u11B8\u1109\u1175","\u110C\u1165\u11B8\u110E\u1169\u11A8","\u110C\u1165\u11BA\u1100\u1161\u1105\u1161\u11A8","\u110C\u1165\u11BC\u1100\u1165\u110C\u1161\u11BC","\u110C\u1165\u11BC\u1103\u1169","\u110C\u1165\u11BC\u1105\u1172\u110C\u1161\u11BC","\u110C\u1165\u11BC\u1105\u1175","\u110C\u1165\u11BC\u1106\u1161\u11AF","\u110C\u1165\u11BC\u1106\u1167\u11AB","\u110C\u1165\u11BC\u1106\u116E\u11AB","\u110C\u1165\u11BC\u1107\u1161\u11AB\u1103\u1162","\u110C\u1165\u11BC\u1107\u1169","\u110C\u1165\u11BC\u1107\u116E","\u110C\u1165\u11BC\u1107\u1175","\u110C\u1165\u11BC\u1109\u1161\u11BC","\u110C\u1165\u11BC\u1109\u1165\u11BC","\u110C\u1165\u11BC\u110B\u1169","\u110C\u1165\u11BC\u110B\u116F\u11AB","\u110C\u1165\u11BC\u110C\u1161\u11BC","\u110C\u1165\u11BC\u110C\u1175","\u110C\u1165\u11BC\u110E\u1175","\u110C\u1165\u11BC\u1112\u116A\u11A8\u1112\u1175","\u110C\u1166\u1100\u1169\u11BC","\u110C\u1166\u1100\u116A\u110C\u1165\u11B7","\u110C\u1166\u1103\u1162\u1105\u1169","\u110C\u1166\u1106\u1169\u11A8","\u110C\u1166\u1107\u1161\u11AF","\u110C\u1166\u1107\u1165\u11B8","\u110C\u1166\u1109\u1161\u11BA\u1102\u1161\u11AF","\u110C\u1166\u110B\u1161\u11AB","\u110C\u1166\u110B\u1175\u11AF","\u110C\u1166\u110C\u1161\u11A8","\u110C\u1166\u110C\u116E\u1103\u1169","\u110C\u1166\u110E\u116E\u11AF","\u110C\u1166\u1111\u116E\u11B7","\u110C\u1166\u1112\u1161\u11AB","\u110C\u1169\u1100\u1161\u11A8","\u110C\u1169\u1100\u1165\u11AB","\u110C\u1169\u1100\u1173\u11B7","\u110C\u1169\u1100\u1175\u11BC","\u110C\u1169\u1106\u1167\u11BC","\u110C\u1169\u1106\u1175\u1105\u116D","\u110C\u1169\u1109\u1161\u11BC","\u110C\u1169\u1109\u1165\u11AB","\u110C\u1169\u110B\u116D\u11BC\u1112\u1175","\u110C\u1169\u110C\u1165\u11AF","\u110C\u1169\u110C\u1165\u11BC","\u110C\u1169\u110C\u1175\u11A8","\u110C\u1169\u11AB\u1103\u1162\u11BA\u1106\u1161\u11AF","\u110C\u1169\u11AB\u110C\u1162","\u110C\u1169\u11AF\u110B\u1165\u11B8","\u110C\u1169\u11AF\u110B\u1173\u11B7","\u110C\u1169\u11BC\u1100\u116D","\u110C\u1169\u11BC\u1105\u1169","\u110C\u1169\u11BC\u1105\u1172","\u110C\u1169\u11BC\u1109\u1169\u1105\u1175","\u110C\u1169\u11BC\u110B\u1165\u11B8\u110B\u116F\u11AB","\u110C\u1169\u11BC\u110C\u1169\u11BC","\u110C\u1169\u11BC\u1112\u1161\u11B8","\u110C\u116A\u1109\u1165\u11A8","\u110C\u116C\u110B\u1175\u11AB","\u110C\u116E\u1100\u116A\u11AB\u110C\u1165\u11A8","\u110C\u116E\u1105\u1173\u11B7","\u110C\u116E\u1106\u1161\u11AF","\u110C\u116E\u1106\u1165\u1102\u1175","\u110C\u116E\u1106\u1165\u11A8","\u110C\u116E\u1106\u116E\u11AB","\u110C\u116E\u1106\u1175\u11AB","\u110C\u116E\u1107\u1161\u11BC","\u110C\u116E\u1107\u1167\u11AB","\u110C\u116E\u1109\u1175\u11A8","\u110C\u116E\u110B\u1175\u11AB","\u110C\u116E\u110B\u1175\u11AF","\u110C\u116E\u110C\u1161\u11BC","\u110C\u116E\u110C\u1165\u11AB\u110C\u1161","\u110C\u116E\u1110\u1162\u11A8","\u110C\u116E\u11AB\u1107\u1175","\u110C\u116E\u11AF\u1100\u1165\u1105\u1175","\u110C\u116E\u11AF\u1100\u1175","\u110C\u116E\u11AF\u1106\u116E\u1102\u1174","\u110C\u116E\u11BC\u1100\u1161\u11AB","\u110C\u116E\u11BC\u1100\u1168\u1107\u1161\u11BC\u1109\u1169\u11BC","\u110C\u116E\u11BC\u1100\u116E\u11A8","\u110C\u116E\u11BC\u1102\u1167\u11AB","\u110C\u116E\u11BC\u1103\u1161\u11AB","\u110C\u116E\u11BC\u1103\u1169\u11A8","\u110C\u116E\u11BC\u1107\u1161\u11AB","\u110C\u116E\u11BC\u1107\u116E","\u110C\u116E\u11BC\u1109\u1166","\u110C\u116E\u11BC\u1109\u1169\u1100\u1175\u110B\u1165\u11B8","\u110C\u116E\u11BC\u1109\u116E\u11AB","\u110C\u116E\u11BC\u110B\u1161\u11BC","\u110C\u116E\u11BC\u110B\u116D","\u110C\u116E\u11BC\u1112\u1161\u11A8\u1100\u116D","\u110C\u1173\u11A8\u1109\u1165\u11A8","\u110C\u1173\u11A8\u1109\u1175","\u110C\u1173\u11AF\u1100\u1165\u110B\u116E\u11B7","\u110C\u1173\u11BC\u1100\u1161","\u110C\u1173\u11BC\u1100\u1165","\u110C\u1173\u11BC\u1100\u116F\u11AB","\u110C\u1173\u11BC\u1109\u1161\u11BC","\u110C\u1173\u11BC\u1109\u1166","\u110C\u1175\u1100\u1161\u11A8","\u110C\u1175\u1100\u1161\u11B8","\u110C\u1175\u1100\u1167\u11BC","\u110C\u1175\u1100\u1173\u11A8\u1112\u1175","\u110C\u1175\u1100\u1173\u11B7","\u110C\u1175\u1100\u1173\u11B8","\u110C\u1175\u1102\u1173\u11BC","\u110C\u1175\u1105\u1173\u11B7\u1100\u1175\u11AF","\u110C\u1175\u1105\u1175\u1109\u1161\u11AB","\u110C\u1175\u1107\u1161\u11BC","\u110C\u1175\u1107\u116E\u11BC","\u110C\u1175\u1109\u1175\u11A8","\u110C\u1175\u110B\u1167\u11A8","\u110C\u1175\u110B\u116E\u1100\u1162","\u110C\u1175\u110B\u116F\u11AB","\u110C\u1175\u110C\u1165\u11A8","\u110C\u1175\u110C\u1165\u11B7","\u110C\u1175\u110C\u1175\u11AB","\u110C\u1175\u110E\u116E\u11AF","\u110C\u1175\u11A8\u1109\u1165\u11AB","\u110C\u1175\u11A8\u110B\u1165\u11B8","\u110C\u1175\u11A8\u110B\u116F\u11AB","\u110C\u1175\u11A8\u110C\u1161\u11BC","\u110C\u1175\u11AB\u1100\u1173\u11B8","\u110C\u1175\u11AB\u1103\u1169\u11BC","\u110C\u1175\u11AB\u1105\u1169","\u110C\u1175\u11AB\u1105\u116D","\u110C\u1175\u11AB\u1105\u1175","\u110C\u1175\u11AB\u110D\u1161","\u110C\u1175\u11AB\u110E\u1161\u11AF","\u110C\u1175\u11AB\u110E\u116E\u11AF","\u110C\u1175\u11AB\u1110\u1169\u11BC","\u110C\u1175\u11AB\u1112\u1162\u11BC","\u110C\u1175\u11AF\u1106\u116E\u11AB","\u110C\u1175\u11AF\u1107\u1167\u11BC","\u110C\u1175\u11AF\u1109\u1165","\u110C\u1175\u11B7\u110C\u1161\u11A8","\u110C\u1175\u11B8\u1103\u1161\u11AB","\u110C\u1175\u11B8\u110B\u1161\u11AB","\u110C\u1175\u11B8\u110C\u116E\u11BC","\u110D\u1161\u110C\u1173\u11BC","\u110D\u1175\u1101\u1165\u1100\u1175","\u110E\u1161\u1102\u1161\u11B7","\u110E\u1161\u1105\u1161\u1105\u1175","\u110E\u1161\u1105\u1163\u11BC","\u110E\u1161\u1105\u1175\u11B7","\u110E\u1161\u1107\u1167\u11AF","\u110E\u1161\u1109\u1165\u11AB","\u110E\u1161\u110E\u1173\u11B7","\u110E\u1161\u11A8\u1100\u1161\u11A8","\u110E\u1161\u11AB\u1106\u116E\u11AF","\u110E\u1161\u11AB\u1109\u1165\u11BC","\u110E\u1161\u11B7\u1100\u1161","\u110E\u1161\u11B7\u1100\u1175\u1105\u1173\u11B7","\u110E\u1161\u11B7\u1109\u1162","\u110E\u1161\u11B7\u1109\u1165\u11A8","\u110E\u1161\u11B7\u110B\u1167","\u110E\u1161\u11B7\u110B\u116C","\u110E\u1161\u11B7\u110C\u1169","\u110E\u1161\u11BA\u110C\u1161\u11AB","\u110E\u1161\u11BC\u1100\u1161","\u110E\u1161\u11BC\u1100\u1169","\u110E\u1161\u11BC\u1100\u116E","\u110E\u1161\u11BC\u1106\u116E\u11AB","\u110E\u1161\u11BC\u1107\u1161\u11A9","\u110E\u1161\u11BC\u110C\u1161\u11A8","\u110E\u1161\u11BC\u110C\u1169","\u110E\u1162\u1102\u1165\u11AF","\u110E\u1162\u110C\u1165\u11B7","\u110E\u1162\u11A8\u1100\u1161\u1107\u1161\u11BC","\u110E\u1162\u11A8\u1107\u1161\u11BC","\u110E\u1162\u11A8\u1109\u1161\u11BC","\u110E\u1162\u11A8\u110B\u1175\u11B7","\u110E\u1162\u11B7\u1111\u1175\u110B\u1165\u11AB","\u110E\u1165\u1107\u1165\u11AF","\u110E\u1165\u110B\u1173\u11B7","\u110E\u1165\u11AB\u1100\u116E\u11A8","\u110E\u1165\u11AB\u1103\u116E\u11BC","\u110E\u1165\u11AB\u110C\u1161\u11BC","\u110E\u1165\u11AB\u110C\u1162","\u110E\u1165\u11AB\u110E\u1165\u11AB\u1112\u1175","\u110E\u1165\u11AF\u1103\u1169","\u110E\u1165\u11AF\u110C\u1165\u1112\u1175","\u110E\u1165\u11AF\u1112\u1161\u11A8","\u110E\u1165\u11BA\u1102\u1161\u11AF","\u110E\u1165\u11BA\u110D\u1162","\u110E\u1165\u11BC\u1102\u1167\u11AB","\u110E\u1165\u11BC\u1107\u1161\u110C\u1175","\u110E\u1165\u11BC\u1109\u1169","\u110E\u1165\u11BC\u110E\u116E\u11AB","\u110E\u1166\u1100\u1168","\u110E\u1166\u1105\u1167\u11A8","\u110E\u1166\u110B\u1169\u11AB","\u110E\u1166\u110B\u1172\u11A8","\u110E\u1166\u110C\u116E\u11BC","\u110E\u1166\u1112\u1165\u11B7","\u110E\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC","\u110E\u1169\u1107\u1161\u11AB","\u110E\u1169\u1107\u1161\u11B8","\u110E\u1169\u1109\u1161\u11BC\u1112\u116A","\u110E\u1169\u1109\u116E\u11AB","\u110E\u1169\u110B\u1167\u1105\u1173\u11B7","\u110E\u1169\u110B\u116F\u11AB","\u110E\u1169\u110C\u1165\u1102\u1167\u11A8","\u110E\u1169\u110C\u1165\u11B7","\u110E\u1169\u110E\u1165\u11BC","\u110E\u1169\u110F\u1169\u11AF\u1105\u1175\u11BA","\u110E\u1169\u11BA\u1107\u116E\u11AF","\u110E\u1169\u11BC\u1100\u1161\u11A8","\u110E\u1169\u11BC\u1105\u1175","\u110E\u1169\u11BC\u110C\u1161\u11BC","\u110E\u116A\u11AF\u110B\u1167\u11BC","\u110E\u116C\u1100\u1173\u11AB","\u110E\u116C\u1109\u1161\u11BC","\u110E\u116C\u1109\u1165\u11AB","\u110E\u116C\u1109\u1175\u11AB","\u110E\u116C\u110B\u1161\u11A8","\u110E\u116C\u110C\u1169\u11BC","\u110E\u116E\u1109\u1165\u11A8","\u110E\u116E\u110B\u1165\u11A8","\u110E\u116E\u110C\u1175\u11AB","\u110E\u116E\u110E\u1165\u11AB","\u110E\u116E\u110E\u1173\u11A8","\u110E\u116E\u11A8\u1100\u116E","\u110E\u116E\u11A8\u1109\u1169","\u110E\u116E\u11A8\u110C\u1166","\u110E\u116E\u11A8\u1112\u1161","\u110E\u116E\u11AF\u1100\u1173\u11AB","\u110E\u116E\u11AF\u1107\u1161\u11AF","\u110E\u116E\u11AF\u1109\u1161\u11AB","\u110E\u116E\u11AF\u1109\u1175\u11AB","\u110E\u116E\u11AF\u110B\u1167\u11AB","\u110E\u116E\u11AF\u110B\u1175\u11B8","\u110E\u116E\u11AF\u110C\u1161\u11BC","\u110E\u116E\u11AF\u1111\u1161\u11AB","\u110E\u116E\u11BC\u1100\u1167\u11A8","\u110E\u116E\u11BC\u1100\u1169","\u110E\u116E\u11BC\u1103\u1169\u11AF","\u110E\u116E\u11BC\u1107\u116E\u11AB\u1112\u1175","\u110E\u116E\u11BC\u110E\u1165\u11BC\u1103\u1169","\u110E\u1171\u110B\u1165\u11B8","\u110E\u1171\u110C\u1175\u11A8","\u110E\u1171\u1112\u1163\u11BC","\u110E\u1175\u110B\u1163\u11A8","\u110E\u1175\u11AB\u1100\u116E","\u110E\u1175\u11AB\u110E\u1165\u11A8","\u110E\u1175\u11AF\u1109\u1175\u11B8","\u110E\u1175\u11AF\u110B\u116F\u11AF","\u110E\u1175\u11AF\u1111\u1161\u11AB","\u110E\u1175\u11B7\u1103\u1162","\u110E\u1175\u11B7\u1106\u116E\u11A8","\u110E\u1175\u11B7\u1109\u1175\u11AF","\u110E\u1175\u11BA\u1109\u1169\u11AF","\u110E\u1175\u11BC\u110E\u1161\u11AB","\u110F\u1161\u1106\u1166\u1105\u1161","\u110F\u1161\u110B\u116E\u11AB\u1110\u1165","\u110F\u1161\u11AF\u1100\u116E\u11A8\u1109\u116E","\u110F\u1162\u1105\u1175\u11A8\u1110\u1165","\u110F\u1162\u11B7\u1111\u1165\u1109\u1173","\u110F\u1162\u11B7\u1111\u1166\u110B\u1175\u11AB","\u110F\u1165\u1110\u1173\u11AB","\u110F\u1165\u11AB\u1103\u1175\u1109\u1167\u11AB","\u110F\u1165\u11AF\u1105\u1165","\u110F\u1165\u11B7\u1111\u1172\u1110\u1165","\u110F\u1169\u1101\u1175\u1105\u1175","\u110F\u1169\u1106\u1175\u1103\u1175","\u110F\u1169\u11AB\u1109\u1165\u1110\u1173","\u110F\u1169\u11AF\u1105\u1161","\u110F\u1169\u11B7\u1111\u1173\u11AF\u1105\u1166\u11A8\u1109\u1173","\u110F\u1169\u11BC\u1102\u1161\u1106\u116E\u11AF","\u110F\u116B\u1100\u1161\u11B7","\u110F\u116E\u1103\u1166\u1110\u1161","\u110F\u1173\u1105\u1175\u11B7","\u110F\u1173\u11AB\u1100\u1175\u11AF","\u110F\u1173\u11AB\u1104\u1161\u11AF","\u110F\u1173\u11AB\u1109\u1169\u1105\u1175","\u110F\u1173\u11AB\u110B\u1161\u1103\u1173\u11AF","\u110F\u1173\u11AB\u110B\u1165\u1106\u1165\u1102\u1175","\u110F\u1173\u11AB\u110B\u1175\u11AF","\u110F\u1173\u11AB\u110C\u1165\u11AF","\u110F\u1173\u11AF\u1105\u1162\u1109\u1175\u11A8","\u110F\u1173\u11AF\u1105\u1165\u11B8","\u110F\u1175\u11AF\u1105\u1169","\u1110\u1161\u110B\u1175\u11B8","\u1110\u1161\u110C\u1161\u1100\u1175","\u1110\u1161\u11A8\u1100\u116E","\u1110\u1161\u11A8\u110C\u1161","\u1110\u1161\u11AB\u1109\u1162\u11BC","\u1110\u1162\u1100\u116F\u11AB\u1103\u1169","\u1110\u1162\u110B\u1163\u11BC","\u1110\u1162\u1111\u116E\u11BC","\u1110\u1162\u11A8\u1109\u1175","\u1110\u1162\u11AF\u1105\u1165\u11AB\u1110\u1173","\u1110\u1165\u1102\u1165\u11AF","\u1110\u1165\u1106\u1175\u1102\u1165\u11AF","\u1110\u1166\u1102\u1175\u1109\u1173","\u1110\u1166\u1109\u1173\u1110\u1173","\u1110\u1166\u110B\u1175\u1107\u1173\u11AF","\u1110\u1166\u11AF\u1105\u1166\u1107\u1175\u110C\u1165\u11AB","\u1110\u1169\u1105\u1169\u11AB","\u1110\u1169\u1106\u1161\u1110\u1169","\u1110\u1169\u110B\u116D\u110B\u1175\u11AF","\u1110\u1169\u11BC\u1100\u1168","\u1110\u1169\u11BC\u1100\u116A","\u1110\u1169\u11BC\u1105\u1169","\u1110\u1169\u11BC\u1109\u1175\u11AB","\u1110\u1169\u11BC\u110B\u1167\u11A8","\u1110\u1169\u11BC\u110B\u1175\u11AF","\u1110\u1169\u11BC\u110C\u1161\u11BC","\u1110\u1169\u11BC\u110C\u1166","\u1110\u1169\u11BC\u110C\u1173\u11BC","\u1110\u1169\u11BC\u1112\u1161\u11B8","\u1110\u1169\u11BC\u1112\u116A","\u1110\u116C\u1100\u1173\u11AB","\u1110\u116C\u110B\u116F\u11AB","\u1110\u116C\u110C\u1175\u11A8\u1100\u1173\u11B7","\u1110\u1171\u1100\u1175\u11B7","\u1110\u1173\u1105\u1165\u11A8","\u1110\u1173\u11A8\u1100\u1173\u11B8","\u1110\u1173\u11A8\u1107\u1167\u11AF","\u1110\u1173\u11A8\u1109\u1165\u11BC","\u1110\u1173\u11A8\u1109\u116E","\u1110\u1173\u11A8\u110C\u1175\u11BC","\u1110\u1173\u11A8\u1112\u1175","\u1110\u1173\u11AB\u1110\u1173\u11AB\u1112\u1175","\u1110\u1175\u1109\u1167\u110E\u1173","\u1111\u1161\u1105\u1161\u11AB\u1109\u1162\u11A8","\u1111\u1161\u110B\u1175\u11AF","\u1111\u1161\u110E\u116E\u11AF\u1109\u1169","\u1111\u1161\u11AB\u1100\u1167\u11AF","\u1111\u1161\u11AB\u1103\u1161\u11AB","\u1111\u1161\u11AB\u1106\u1162","\u1111\u1161\u11AB\u1109\u1161","\u1111\u1161\u11AF\u1109\u1175\u11B8","\u1111\u1161\u11AF\u110B\u116F\u11AF","\u1111\u1161\u11B8\u1109\u1169\u11BC","\u1111\u1162\u1109\u1167\u11AB","\u1111\u1162\u11A8\u1109\u1173","\u1111\u1162\u11A8\u1109\u1175\u1106\u1175\u11AF\u1105\u1175","\u1111\u1162\u11AB\u1110\u1175","\u1111\u1165\u1109\u1166\u11AB\u1110\u1173","\u1111\u1166\u110B\u1175\u11AB\u1110\u1173","\u1111\u1167\u11AB\u1100\u1167\u11AB","\u1111\u1167\u11AB\u110B\u1174","\u1111\u1167\u11AB\u110C\u1175","\u1111\u1167\u11AB\u1112\u1175","\u1111\u1167\u11BC\u1100\u1161","\u1111\u1167\u11BC\u1100\u1172\u11AB","\u1111\u1167\u11BC\u1109\u1162\u11BC","\u1111\u1167\u11BC\u1109\u1169","\u1111\u1167\u11BC\u110B\u1163\u11BC","\u1111\u1167\u11BC\u110B\u1175\u11AF","\u1111\u1167\u11BC\u1112\u116A","\u1111\u1169\u1109\u1173\u1110\u1165","\u1111\u1169\u110B\u1175\u11AB\u1110\u1173","\u1111\u1169\u110C\u1161\u11BC","\u1111\u1169\u1112\u1161\u11B7","\u1111\u116D\u1106\u1167\u11AB","\u1111\u116D\u110C\u1165\u11BC","\u1111\u116D\u110C\u116E\u11AB","\u1111\u116D\u1112\u1167\u11AB","\u1111\u116E\u11B7\u1106\u1169\u11A8","\u1111\u116E\u11B7\u110C\u1175\u11AF","\u1111\u116E\u11BC\u1100\u1167\u11BC","\u1111\u116E\u11BC\u1109\u1169\u11A8","\u1111\u116E\u11BC\u1109\u1173\u11B8","\u1111\u1173\u1105\u1161\u11BC\u1109\u1173","\u1111\u1173\u1105\u1175\u11AB\u1110\u1165","\u1111\u1173\u11AF\u1105\u1161\u1109\u1173\u1110\u1175\u11A8","\u1111\u1175\u1100\u1169\u11AB","\u1111\u1175\u1106\u1161\u11BC","\u1111\u1175\u110B\u1161\u1102\u1169","\u1111\u1175\u11AF\u1105\u1173\u11B7","\u1111\u1175\u11AF\u1109\u116E","\u1111\u1175\u11AF\u110B\u116D","\u1111\u1175\u11AF\u110C\u1161","\u1111\u1175\u11AF\u1110\u1169\u11BC","\u1111\u1175\u11BC\u1100\u1168","\u1112\u1161\u1102\u1173\u1102\u1175\u11B7","\u1112\u1161\u1102\u1173\u11AF","\u1112\u1161\u1103\u1173\u110B\u1170\u110B\u1165","\u1112\u1161\u1105\u116E\u11BA\u1107\u1161\u11B7","\u1112\u1161\u1107\u1161\u11AB\u1100\u1175","\u1112\u1161\u1109\u116E\u11A8\u110C\u1175\u11B8","\u1112\u1161\u1109\u116E\u11AB","\u1112\u1161\u110B\u1167\u1110\u1173\u11AB","\u1112\u1161\u110C\u1175\u1106\u1161\u11AB","\u1112\u1161\u110E\u1165\u11AB","\u1112\u1161\u1111\u116E\u11B7","\u1112\u1161\u1111\u1175\u11AF","\u1112\u1161\u11A8\u1100\u116A","\u1112\u1161\u11A8\u1100\u116D","\u1112\u1161\u11A8\u1100\u1173\u11B8","\u1112\u1161\u11A8\u1100\u1175","\u1112\u1161\u11A8\u1102\u1167\u11AB","\u1112\u1161\u11A8\u1105\u1167\u11A8","\u1112\u1161\u11A8\u1107\u1165\u11AB","\u1112\u1161\u11A8\u1107\u116E\u1106\u1169","\u1112\u1161\u11A8\u1107\u1175","\u1112\u1161\u11A8\u1109\u1162\u11BC","\u1112\u1161\u11A8\u1109\u116E\u11AF","\u1112\u1161\u11A8\u1109\u1173\u11B8","\u1112\u1161\u11A8\u110B\u116D\u11BC\u1111\u116E\u11B7","\u1112\u1161\u11A8\u110B\u116F\u11AB","\u1112\u1161\u11A8\u110B\u1171","\u1112\u1161\u11A8\u110C\u1161","\u1112\u1161\u11A8\u110C\u1165\u11B7","\u1112\u1161\u11AB\u1100\u1168","\u1112\u1161\u11AB\u1100\u1173\u11AF","\u1112\u1161\u11AB\u1101\u1165\u1107\u1165\u11AB\u110B\u1166","\u1112\u1161\u11AB\u1102\u1161\u11BD","\u1112\u1161\u11AB\u1102\u116E\u11AB","\u1112\u1161\u11AB\u1103\u1169\u11BC\u110B\u1161\u11AB","\u1112\u1161\u11AB\u1104\u1162","\u1112\u1161\u11AB\u1105\u1161\u1109\u1161\u11AB","\u1112\u1161\u11AB\u1106\u1161\u1103\u1175","\u1112\u1161\u11AB\u1106\u116E\u11AB","\u1112\u1161\u11AB\u1107\u1165\u11AB","\u1112\u1161\u11AB\u1107\u1169\u11A8","\u1112\u1161\u11AB\u1109\u1175\u11A8","\u1112\u1161\u11AB\u110B\u1167\u1105\u1173\u11B7","\u1112\u1161\u11AB\u110D\u1169\u11A8","\u1112\u1161\u11AF\u1106\u1165\u1102\u1175","\u1112\u1161\u11AF\u110B\u1161\u1107\u1165\u110C\u1175","\u1112\u1161\u11AF\u110B\u1175\u11AB","\u1112\u1161\u11B7\u1101\u1166","\u1112\u1161\u11B7\u1107\u116E\u1105\u1169","\u1112\u1161\u11B8\u1100\u1167\u11A8","\u1112\u1161\u11B8\u1105\u1175\u110C\u1165\u11A8","\u1112\u1161\u11BC\u1100\u1169\u11BC","\u1112\u1161\u11BC\u1100\u116E","\u1112\u1161\u11BC\u1109\u1161\u11BC","\u1112\u1161\u11BC\u110B\u1174","\u1112\u1162\u1100\u1167\u11AF","\u1112\u1162\u1100\u116E\u11AB","\u1112\u1162\u1103\u1161\u11B8","\u1112\u1162\u1103\u1161\u11BC","\u1112\u1162\u1106\u116E\u11AF","\u1112\u1162\u1109\u1165\u11A8","\u1112\u1162\u1109\u1165\u11AF","\u1112\u1162\u1109\u116E\u110B\u116D\u11A8\u110C\u1161\u11BC","\u1112\u1162\u110B\u1161\u11AB","\u1112\u1162\u11A8\u1109\u1175\u11B7","\u1112\u1162\u11AB\u1103\u1173\u1107\u1162\u11A8","\u1112\u1162\u11B7\u1107\u1165\u1100\u1165","\u1112\u1162\u11BA\u1107\u1167\u11C0","\u1112\u1162\u11BA\u1109\u1161\u11AF","\u1112\u1162\u11BC\u1103\u1169\u11BC","\u1112\u1162\u11BC\u1107\u1169\u11A8","\u1112\u1162\u11BC\u1109\u1161","\u1112\u1162\u11BC\u110B\u116E\u11AB","\u1112\u1162\u11BC\u110B\u1171","\u1112\u1163\u11BC\u1100\u1175","\u1112\u1163\u11BC\u1109\u1161\u11BC","\u1112\u1163\u11BC\u1109\u116E","\u1112\u1165\u1105\u1161\u11A8","\u1112\u1165\u110B\u116D\u11BC","\u1112\u1166\u11AF\u1100\u1175","\u1112\u1167\u11AB\u1100\u116A\u11AB","\u1112\u1167\u11AB\u1100\u1173\u11B7","\u1112\u1167\u11AB\u1103\u1162","\u1112\u1167\u11AB\u1109\u1161\u11BC","\u1112\u1167\u11AB\u1109\u1175\u11AF","\u1112\u1167\u11AB\u110C\u1161\u11BC","\u1112\u1167\u11AB\u110C\u1162","\u1112\u1167\u11AB\u110C\u1175","\u1112\u1167\u11AF\u110B\u1162\u11A8","\u1112\u1167\u11B8\u1105\u1167\u11A8","\u1112\u1167\u11BC\u1107\u116E","\u1112\u1167\u11BC\u1109\u1161","\u1112\u1167\u11BC\u1109\u116E","\u1112\u1167\u11BC\u1109\u1175\u11A8","\u1112\u1167\u11BC\u110C\u1166","\u1112\u1167\u11BC\u1110\u1162","\u1112\u1167\u11BC\u1111\u1167\u11AB","\u1112\u1168\u1110\u1162\u11A8","\u1112\u1169\u1100\u1175\u1109\u1175\u11B7","\u1112\u1169\u1102\u1161\u11B7","\u1112\u1169\u1105\u1161\u11BC\u110B\u1175","\u1112\u1169\u1107\u1161\u11A8","\u1112\u1169\u1110\u1166\u11AF","\u1112\u1169\u1112\u1173\u11B8","\u1112\u1169\u11A8\u1109\u1175","\u1112\u1169\u11AF\u1105\u1169","\u1112\u1169\u11B7\u1111\u1166\u110B\u1175\u110C\u1175","\u1112\u1169\u11BC\u1107\u1169","\u1112\u1169\u11BC\u1109\u116E","\u1112\u1169\u11BC\u110E\u1161","\u1112\u116A\u1106\u1167\u11AB","\u1112\u116A\u1107\u116E\u11AB","\u1112\u116A\u1109\u1161\u11AF","\u1112\u116A\u110B\u116D\u110B\u1175\u11AF","\u1112\u116A\u110C\u1161\u11BC","\u1112\u116A\u1112\u1161\u11A8","\u1112\u116A\u11A8\u1107\u1169","\u1112\u116A\u11A8\u110B\u1175\u11AB","\u1112\u116A\u11A8\u110C\u1161\u11BC","\u1112\u116A\u11A8\u110C\u1165\u11BC","\u1112\u116A\u11AB\u1100\u1161\u11B8","\u1112\u116A\u11AB\u1100\u1167\u11BC","\u1112\u116A\u11AB\u110B\u1167\u11BC","\u1112\u116A\u11AB\u110B\u1172\u11AF","\u1112\u116A\u11AB\u110C\u1161","\u1112\u116A\u11AF\u1100\u1175","\u1112\u116A\u11AF\u1103\u1169\u11BC","\u1112\u116A\u11AF\u1107\u1161\u11AF\u1112\u1175","\u1112\u116A\u11AF\u110B\u116D\u11BC","\u1112\u116A\u11AF\u110D\u1161\u11A8","\u1112\u116C\u1100\u1167\u11AB","\u1112\u116C\u1100\u116A\u11AB","\u1112\u116C\u1107\u1169\u11A8","\u1112\u116C\u1109\u1162\u11A8","\u1112\u116C\u110B\u116F\u11AB","\u1112\u116C\u110C\u1161\u11BC","\u1112\u116C\u110C\u1165\u11AB","\u1112\u116C\u11BA\u1109\u116E","\u1112\u116C\u11BC\u1103\u1161\u11AB\u1107\u1169\u1103\u1169","\u1112\u116D\u110B\u1172\u11AF\u110C\u1165\u11A8","\u1112\u116E\u1107\u1161\u11AB","\u1112\u116E\u110E\u116E\u11BA\u1100\u1161\u1105\u116E","\u1112\u116E\u11AB\u1105\u1167\u11AB","\u1112\u116F\u11AF\u110A\u1175\u11AB","\u1112\u1172\u1109\u1175\u11A8","\u1112\u1172\u110B\u1175\u11AF","\u1112\u1172\u11BC\u1102\u1162","\u1112\u1173\u1105\u1173\u11B7","\u1112\u1173\u11A8\u1107\u1162\u11A8","\u1112\u1173\u11A8\u110B\u1175\u11AB","\u1112\u1173\u11AB\u110C\u1165\u11A8","\u1112\u1173\u11AB\u1112\u1175","\u1112\u1173\u11BC\u1106\u1175","\u1112\u1173\u11BC\u1107\u116E\u11AB","\u1112\u1174\u1100\u1169\u11A8","\u1112\u1174\u1106\u1161\u11BC","\u1112\u1174\u1109\u1162\u11BC","\u1112\u1174\u11AB\u1109\u1162\u11A8","\u1112\u1175\u11B7\u1101\u1165\u11BA"]'), rf = JSON.parse('["abaisser","abandon","abdiquer","abeille","abolir","aborder","aboutir","aboyer","abrasif","abreuver","abriter","abroger","abrupt","absence","absolu","absurde","abusif","abyssal","acade\u0301mie","acajou","acarien","accabler","accepter","acclamer","accolade","accroche","accuser","acerbe","achat","acheter","aciduler","acier","acompte","acque\u0301rir","acronyme","acteur","actif","actuel","adepte","ade\u0301quat","adhe\u0301sif","adjectif","adjuger","admettre","admirer","adopter","adorer","adoucir","adresse","adroit","adulte","adverbe","ae\u0301rer","ae\u0301ronef","affaire","affecter","affiche","affreux","affubler","agacer","agencer","agile","agiter","agrafer","agre\u0301able","agrume","aider","aiguille","ailier","aimable","aisance","ajouter","ajuster","alarmer","alchimie","alerte","alge\u0300bre","algue","alie\u0301ner","aliment","alle\u0301ger","alliage","allouer","allumer","alourdir","alpaga","altesse","alve\u0301ole","amateur","ambigu","ambre","ame\u0301nager","amertume","amidon","amiral","amorcer","amour","amovible","amphibie","ampleur","amusant","analyse","anaphore","anarchie","anatomie","ancien","ane\u0301antir","angle","angoisse","anguleux","animal","annexer","annonce","annuel","anodin","anomalie","anonyme","anormal","antenne","antidote","anxieux","apaiser","ape\u0301ritif","aplanir","apologie","appareil","appeler","apporter","appuyer","aquarium","aqueduc","arbitre","arbuste","ardeur","ardoise","argent","arlequin","armature","armement","armoire","armure","arpenter","arracher","arriver","arroser","arsenic","arte\u0301riel","article","aspect","asphalte","aspirer","assaut","asservir","assiette","associer","assurer","asticot","astre","astuce","atelier","atome","atrium","atroce","attaque","attentif","attirer","attraper","aubaine","auberge","audace","audible","augurer","aurore","automne","autruche","avaler","avancer","avarice","avenir","averse","aveugle","aviateur","avide","avion","aviser","avoine","avouer","avril","axial","axiome","badge","bafouer","bagage","baguette","baignade","balancer","balcon","baleine","balisage","bambin","bancaire","bandage","banlieue","bannie\u0300re","banquier","barbier","baril","baron","barque","barrage","bassin","bastion","bataille","bateau","batterie","baudrier","bavarder","belette","be\u0301lier","belote","be\u0301ne\u0301fice","berceau","berger","berline","bermuda","besace","besogne","be\u0301tail","beurre","biberon","bicycle","bidule","bijou","bilan","bilingue","billard","binaire","biologie","biopsie","biotype","biscuit","bison","bistouri","bitume","bizarre","blafard","blague","blanchir","blessant","blinder","blond","bloquer","blouson","bobard","bobine","boire","boiser","bolide","bonbon","bondir","bonheur","bonifier","bonus","bordure","borne","botte","boucle","boueux","bougie","boulon","bouquin","bourse","boussole","boutique","boxeur","branche","brasier","brave","brebis","bre\u0300che","breuvage","bricoler","brigade","brillant","brioche","brique","brochure","broder","bronzer","brousse","broyeur","brume","brusque","brutal","bruyant","buffle","buisson","bulletin","bureau","burin","bustier","butiner","butoir","buvable","buvette","cabanon","cabine","cachette","cadeau","cadre","cafe\u0301ine","caillou","caisson","calculer","calepin","calibre","calmer","calomnie","calvaire","camarade","came\u0301ra","camion","campagne","canal","caneton","canon","cantine","canular","capable","caporal","caprice","capsule","capter","capuche","carabine","carbone","caresser","caribou","carnage","carotte","carreau","carton","cascade","casier","casque","cassure","causer","caution","cavalier","caverne","caviar","ce\u0301dille","ceinture","ce\u0301leste","cellule","cendrier","censurer","central","cercle","ce\u0301re\u0301bral","cerise","cerner","cerveau","cesser","chagrin","chaise","chaleur","chambre","chance","chapitre","charbon","chasseur","chaton","chausson","chavirer","chemise","chenille","che\u0301quier","chercher","cheval","chien","chiffre","chignon","chime\u0300re","chiot","chlorure","chocolat","choisir","chose","chouette","chrome","chute","cigare","cigogne","cimenter","cine\u0301ma","cintrer","circuler","cirer","cirque","citerne","citoyen","citron","civil","clairon","clameur","claquer","classe","clavier","client","cligner","climat","clivage","cloche","clonage","cloporte","cobalt","cobra","cocasse","cocotier","coder","codifier","coffre","cogner","cohe\u0301sion","coiffer","coincer","cole\u0300re","colibri","colline","colmater","colonel","combat","come\u0301die","commande","compact","concert","conduire","confier","congeler","connoter","consonne","contact","convexe","copain","copie","corail","corbeau","cordage","corniche","corpus","correct","corte\u0300ge","cosmique","costume","coton","coude","coupure","courage","couteau","couvrir","coyote","crabe","crainte","cravate","crayon","cre\u0301ature","cre\u0301diter","cre\u0301meux","creuser","crevette","cribler","crier","cristal","crite\u0300re","croire","croquer","crotale","crucial","cruel","crypter","cubique","cueillir","cuille\u0300re","cuisine","cuivre","culminer","cultiver","cumuler","cupide","curatif","curseur","cyanure","cycle","cylindre","cynique","daigner","damier","danger","danseur","dauphin","de\u0301battre","de\u0301biter","de\u0301border","de\u0301brider","de\u0301butant","de\u0301caler","de\u0301cembre","de\u0301chirer","de\u0301cider","de\u0301clarer","de\u0301corer","de\u0301crire","de\u0301cupler","de\u0301dale","de\u0301ductif","de\u0301esse","de\u0301fensif","de\u0301filer","de\u0301frayer","de\u0301gager","de\u0301givrer","de\u0301glutir","de\u0301grafer","de\u0301jeuner","de\u0301lice","de\u0301loger","demander","demeurer","de\u0301molir","de\u0301nicher","de\u0301nouer","dentelle","de\u0301nuder","de\u0301part","de\u0301penser","de\u0301phaser","de\u0301placer","de\u0301poser","de\u0301ranger","de\u0301rober","de\u0301sastre","descente","de\u0301sert","de\u0301signer","de\u0301sobe\u0301ir","dessiner","destrier","de\u0301tacher","de\u0301tester","de\u0301tourer","de\u0301tresse","devancer","devenir","deviner","devoir","diable","dialogue","diamant","dicter","diffe\u0301rer","dige\u0301rer","digital","digne","diluer","dimanche","diminuer","dioxyde","directif","diriger","discuter","disposer","dissiper","distance","divertir","diviser","docile","docteur","dogme","doigt","domaine","domicile","dompter","donateur","donjon","donner","dopamine","dortoir","dorure","dosage","doseur","dossier","dotation","douanier","double","douceur","douter","doyen","dragon","draper","dresser","dribbler","droiture","duperie","duplexe","durable","durcir","dynastie","e\u0301blouir","e\u0301carter","e\u0301charpe","e\u0301chelle","e\u0301clairer","e\u0301clipse","e\u0301clore","e\u0301cluse","e\u0301cole","e\u0301conomie","e\u0301corce","e\u0301couter","e\u0301craser","e\u0301cre\u0301mer","e\u0301crivain","e\u0301crou","e\u0301cume","e\u0301cureuil","e\u0301difier","e\u0301duquer","effacer","effectif","effigie","effort","effrayer","effusion","e\u0301galiser","e\u0301garer","e\u0301jecter","e\u0301laborer","e\u0301largir","e\u0301lectron","e\u0301le\u0301gant","e\u0301le\u0301phant","e\u0301le\u0300ve","e\u0301ligible","e\u0301litisme","e\u0301loge","e\u0301lucider","e\u0301luder","emballer","embellir","embryon","e\u0301meraude","e\u0301mission","emmener","e\u0301motion","e\u0301mouvoir","empereur","employer","emporter","emprise","e\u0301mulsion","encadrer","enche\u0300re","enclave","encoche","endiguer","endosser","endroit","enduire","e\u0301nergie","enfance","enfermer","enfouir","engager","engin","englober","e\u0301nigme","enjamber","enjeu","enlever","ennemi","ennuyeux","enrichir","enrobage","enseigne","entasser","entendre","entier","entourer","entraver","e\u0301nume\u0301rer","envahir","enviable","envoyer","enzyme","e\u0301olien","e\u0301paissir","e\u0301pargne","e\u0301patant","e\u0301paule","e\u0301picerie","e\u0301pide\u0301mie","e\u0301pier","e\u0301pilogue","e\u0301pine","e\u0301pisode","e\u0301pitaphe","e\u0301poque","e\u0301preuve","e\u0301prouver","e\u0301puisant","e\u0301querre","e\u0301quipe","e\u0301riger","e\u0301rosion","erreur","e\u0301ruption","escalier","espadon","espe\u0300ce","espie\u0300gle","espoir","esprit","esquiver","essayer","essence","essieu","essorer","estime","estomac","estrade","e\u0301tage\u0300re","e\u0301taler","e\u0301tanche","e\u0301tatique","e\u0301teindre","e\u0301tendoir","e\u0301ternel","e\u0301thanol","e\u0301thique","ethnie","e\u0301tirer","e\u0301toffer","e\u0301toile","e\u0301tonnant","e\u0301tourdir","e\u0301trange","e\u0301troit","e\u0301tude","euphorie","e\u0301valuer","e\u0301vasion","e\u0301ventail","e\u0301vidence","e\u0301viter","e\u0301volutif","e\u0301voquer","exact","exage\u0301rer","exaucer","exceller","excitant","exclusif","excuse","exe\u0301cuter","exemple","exercer","exhaler","exhorter","exigence","exiler","exister","exotique","expe\u0301dier","explorer","exposer","exprimer","exquis","extensif","extraire","exulter","fable","fabuleux","facette","facile","facture","faiblir","falaise","fameux","famille","farceur","farfelu","farine","farouche","fasciner","fatal","fatigue","faucon","fautif","faveur","favori","fe\u0301brile","fe\u0301conder","fe\u0301de\u0301rer","fe\u0301lin","femme","fe\u0301mur","fendoir","fe\u0301odal","fermer","fe\u0301roce","ferveur","festival","feuille","feutre","fe\u0301vrier","fiasco","ficeler","fictif","fide\u0300le","figure","filature","filetage","filie\u0300re","filleul","filmer","filou","filtrer","financer","finir","fiole","firme","fissure","fixer","flairer","flamme","flasque","flatteur","fle\u0301au","fle\u0300che","fleur","flexion","flocon","flore","fluctuer","fluide","fluvial","folie","fonderie","fongible","fontaine","forcer","forgeron","formuler","fortune","fossile","foudre","fouge\u0300re","fouiller","foulure","fourmi","fragile","fraise","franchir","frapper","frayeur","fre\u0301gate","freiner","frelon","fre\u0301mir","fre\u0301ne\u0301sie","fre\u0300re","friable","friction","frisson","frivole","froid","fromage","frontal","frotter","fruit","fugitif","fuite","fureur","furieux","furtif","fusion","futur","gagner","galaxie","galerie","gambader","garantir","gardien","garnir","garrigue","gazelle","gazon","ge\u0301ant","ge\u0301latine","ge\u0301lule","gendarme","ge\u0301ne\u0301ral","ge\u0301nie","genou","gentil","ge\u0301ologie","ge\u0301ome\u0300tre","ge\u0301ranium","germe","gestuel","geyser","gibier","gicler","girafe","givre","glace","glaive","glisser","globe","gloire","glorieux","golfeur","gomme","gonfler","gorge","gorille","goudron","gouffre","goulot","goupille","gourmand","goutte","graduel","graffiti","graine","grand","grappin","gratuit","gravir","grenat","griffure","griller","grimper","grogner","gronder","grotte","groupe","gruger","grutier","gruye\u0300re","gue\u0301pard","guerrier","guide","guimauve","guitare","gustatif","gymnaste","gyrostat","habitude","hachoir","halte","hameau","hangar","hanneton","haricot","harmonie","harpon","hasard","he\u0301lium","he\u0301matome","herbe","he\u0301risson","hermine","he\u0301ron","he\u0301siter","heureux","hiberner","hibou","hilarant","histoire","hiver","homard","hommage","homoge\u0300ne","honneur","honorer","honteux","horde","horizon","horloge","hormone","horrible","houleux","housse","hublot","huileux","humain","humble","humide","humour","hurler","hydromel","hygie\u0300ne","hymne","hypnose","idylle","ignorer","iguane","illicite","illusion","image","imbiber","imiter","immense","immobile","immuable","impact","impe\u0301rial","implorer","imposer","imprimer","imputer","incarner","incendie","incident","incliner","incolore","indexer","indice","inductif","ine\u0301dit","ineptie","inexact","infini","infliger","informer","infusion","inge\u0301rer","inhaler","inhiber","injecter","injure","innocent","inoculer","inonder","inscrire","insecte","insigne","insolite","inspirer","instinct","insulter","intact","intense","intime","intrigue","intuitif","inutile","invasion","inventer","inviter","invoquer","ironique","irradier","irre\u0301el","irriter","isoler","ivoire","ivresse","jaguar","jaillir","jambe","janvier","jardin","jauger","jaune","javelot","jetable","jeton","jeudi","jeunesse","joindre","joncher","jongler","joueur","jouissif","journal","jovial","joyau","joyeux","jubiler","jugement","junior","jupon","juriste","justice","juteux","juve\u0301nile","kayak","kimono","kiosque","label","labial","labourer","lace\u0301rer","lactose","lagune","laine","laisser","laitier","lambeau","lamelle","lampe","lanceur","langage","lanterne","lapin","largeur","larme","laurier","lavabo","lavoir","lecture","le\u0301gal","le\u0301ger","le\u0301gume","lessive","lettre","levier","lexique","le\u0301zard","liasse","libe\u0301rer","libre","licence","licorne","lie\u0300ge","lie\u0300vre","ligature","ligoter","ligue","limer","limite","limonade","limpide","line\u0301aire","lingot","lionceau","liquide","lisie\u0300re","lister","lithium","litige","littoral","livreur","logique","lointain","loisir","lombric","loterie","louer","lourd","loutre","louve","loyal","lubie","lucide","lucratif","lueur","lugubre","luisant","lumie\u0300re","lunaire","lundi","luron","lutter","luxueux","machine","magasin","magenta","magique","maigre","maillon","maintien","mairie","maison","majorer","malaxer","male\u0301fice","malheur","malice","mallette","mammouth","mandater","maniable","manquant","manteau","manuel","marathon","marbre","marchand","mardi","maritime","marqueur","marron","marteler","mascotte","massif","mate\u0301riel","matie\u0300re","matraque","maudire","maussade","mauve","maximal","me\u0301chant","me\u0301connu","me\u0301daille","me\u0301decin","me\u0301diter","me\u0301duse","meilleur","me\u0301lange","me\u0301lodie","membre","me\u0301moire","menacer","mener","menhir","mensonge","mentor","mercredi","me\u0301rite","merle","messager","mesure","me\u0301tal","me\u0301te\u0301ore","me\u0301thode","me\u0301tier","meuble","miauler","microbe","miette","mignon","migrer","milieu","million","mimique","mince","mine\u0301ral","minimal","minorer","minute","miracle","miroiter","missile","mixte","mobile","moderne","moelleux","mondial","moniteur","monnaie","monotone","monstre","montagne","monument","moqueur","morceau","morsure","mortier","moteur","motif","mouche","moufle","moulin","mousson","mouton","mouvant","multiple","munition","muraille","mure\u0300ne","murmure","muscle","muse\u0301um","musicien","mutation","muter","mutuel","myriade","myrtille","myste\u0300re","mythique","nageur","nappe","narquois","narrer","natation","nation","nature","naufrage","nautique","navire","ne\u0301buleux","nectar","ne\u0301faste","ne\u0301gation","ne\u0301gliger","ne\u0301gocier","neige","nerveux","nettoyer","neurone","neutron","neveu","niche","nickel","nitrate","niveau","noble","nocif","nocturne","noirceur","noisette","nomade","nombreux","nommer","normatif","notable","notifier","notoire","nourrir","nouveau","novateur","novembre","novice","nuage","nuancer","nuire","nuisible","nume\u0301ro","nuptial","nuque","nutritif","obe\u0301ir","objectif","obliger","obscur","observer","obstacle","obtenir","obturer","occasion","occuper","oce\u0301an","octobre","octroyer","octupler","oculaire","odeur","odorant","offenser","officier","offrir","ogive","oiseau","oisillon","olfactif","olivier","ombrage","omettre","onctueux","onduler","one\u0301reux","onirique","opale","opaque","ope\u0301rer","opinion","opportun","opprimer","opter","optique","orageux","orange","orbite","ordonner","oreille","organe","orgueil","orifice","ornement","orque","ortie","osciller","osmose","ossature","otarie","ouragan","ourson","outil","outrager","ouvrage","ovation","oxyde","oxyge\u0300ne","ozone","paisible","palace","palmare\u0300s","palourde","palper","panache","panda","pangolin","paniquer","panneau","panorama","pantalon","papaye","papier","papoter","papyrus","paradoxe","parcelle","paresse","parfumer","parler","parole","parrain","parsemer","partager","parure","parvenir","passion","paste\u0300que","paternel","patience","patron","pavillon","pavoiser","payer","paysage","peigne","peintre","pelage","pe\u0301lican","pelle","pelouse","peluche","pendule","pe\u0301ne\u0301trer","pe\u0301nible","pensif","pe\u0301nurie","pe\u0301pite","pe\u0301plum","perdrix","perforer","pe\u0301riode","permuter","perplexe","persil","perte","peser","pe\u0301tale","petit","pe\u0301trir","peuple","pharaon","phobie","phoque","photon","phrase","physique","piano","pictural","pie\u0300ce","pierre","pieuvre","pilote","pinceau","pipette","piquer","pirogue","piscine","piston","pivoter","pixel","pizza","placard","plafond","plaisir","planer","plaque","plastron","plateau","pleurer","plexus","pliage","plomb","plonger","pluie","plumage","pochette","poe\u0301sie","poe\u0300te","pointe","poirier","poisson","poivre","polaire","policier","pollen","polygone","pommade","pompier","ponctuel","ponde\u0301rer","poney","portique","position","posse\u0301der","posture","potager","poteau","potion","pouce","poulain","poumon","pourpre","poussin","pouvoir","prairie","pratique","pre\u0301cieux","pre\u0301dire","pre\u0301fixe","pre\u0301lude","pre\u0301nom","pre\u0301sence","pre\u0301texte","pre\u0301voir","primitif","prince","prison","priver","proble\u0300me","proce\u0301der","prodige","profond","progre\u0300s","proie","projeter","prologue","promener","propre","prospe\u0300re","prote\u0301ger","prouesse","proverbe","prudence","pruneau","psychose","public","puceron","puiser","pulpe","pulsar","punaise","punitif","pupitre","purifier","puzzle","pyramide","quasar","querelle","question","quie\u0301tude","quitter","quotient","racine","raconter","radieux","ragondin","raideur","raisin","ralentir","rallonge","ramasser","rapide","rasage","ratisser","ravager","ravin","rayonner","re\u0301actif","re\u0301agir","re\u0301aliser","re\u0301animer","recevoir","re\u0301citer","re\u0301clamer","re\u0301colter","recruter","reculer","recycler","re\u0301diger","redouter","refaire","re\u0301flexe","re\u0301former","refrain","refuge","re\u0301galien","re\u0301gion","re\u0301glage","re\u0301gulier","re\u0301ite\u0301rer","rejeter","rejouer","relatif","relever","relief","remarque","reme\u0300de","remise","remonter","remplir","remuer","renard","renfort","renifler","renoncer","rentrer","renvoi","replier","reporter","reprise","reptile","requin","re\u0301serve","re\u0301sineux","re\u0301soudre","respect","rester","re\u0301sultat","re\u0301tablir","retenir","re\u0301ticule","retomber","retracer","re\u0301union","re\u0301ussir","revanche","revivre","re\u0301volte","re\u0301vulsif","richesse","rideau","rieur","rigide","rigoler","rincer","riposter","risible","risque","rituel","rival","rivie\u0300re","rocheux","romance","rompre","ronce","rondin","roseau","rosier","rotatif","rotor","rotule","rouge","rouille","rouleau","routine","royaume","ruban","rubis","ruche","ruelle","rugueux","ruiner","ruisseau","ruser","rustique","rythme","sabler","saboter","sabre","sacoche","safari","sagesse","saisir","salade","salive","salon","saluer","samedi","sanction","sanglier","sarcasme","sardine","saturer","saugrenu","saumon","sauter","sauvage","savant","savonner","scalpel","scandale","sce\u0301le\u0301rat","sce\u0301nario","sceptre","sche\u0301ma","science","scinder","score","scrutin","sculpter","se\u0301ance","se\u0301cable","se\u0301cher","secouer","se\u0301cre\u0301ter","se\u0301datif","se\u0301duire","seigneur","se\u0301jour","se\u0301lectif","semaine","sembler","semence","se\u0301minal","se\u0301nateur","sensible","sentence","se\u0301parer","se\u0301quence","serein","sergent","se\u0301rieux","serrure","se\u0301rum","service","se\u0301same","se\u0301vir","sevrage","sextuple","side\u0301ral","sie\u0300cle","sie\u0301ger","siffler","sigle","signal","silence","silicium","simple","since\u0300re","sinistre","siphon","sirop","sismique","situer","skier","social","socle","sodium","soigneux","soldat","soleil","solitude","soluble","sombre","sommeil","somnoler","sonde","songeur","sonnette","sonore","sorcier","sortir","sosie","sottise","soucieux","soudure","souffle","soulever","soupape","source","soutirer","souvenir","spacieux","spatial","spe\u0301cial","sphe\u0300re","spiral","stable","station","sternum","stimulus","stipuler","strict","studieux","stupeur","styliste","sublime","substrat","subtil","subvenir","succe\u0300s","sucre","suffixe","sugge\u0301rer","suiveur","sulfate","superbe","supplier","surface","suricate","surmener","surprise","sursaut","survie","suspect","syllabe","symbole","syme\u0301trie","synapse","syntaxe","syste\u0300me","tabac","tablier","tactile","tailler","talent","talisman","talonner","tambour","tamiser","tangible","tapis","taquiner","tarder","tarif","tartine","tasse","tatami","tatouage","taupe","taureau","taxer","te\u0301moin","temporel","tenaille","tendre","teneur","tenir","tension","terminer","terne","terrible","te\u0301tine","texte","the\u0300me","the\u0301orie","the\u0301rapie","thorax","tibia","tie\u0300de","timide","tirelire","tiroir","tissu","titane","titre","tituber","toboggan","tole\u0301rant","tomate","tonique","tonneau","toponyme","torche","tordre","tornade","torpille","torrent","torse","tortue","totem","toucher","tournage","tousser","toxine","traction","trafic","tragique","trahir","train","trancher","travail","tre\u0300fle","tremper","tre\u0301sor","treuil","triage","tribunal","tricoter","trilogie","triomphe","tripler","triturer","trivial","trombone","tronc","tropical","troupeau","tuile","tulipe","tumulte","tunnel","turbine","tuteur","tutoyer","tuyau","tympan","typhon","typique","tyran","ubuesque","ultime","ultrason","unanime","unifier","union","unique","unitaire","univers","uranium","urbain","urticant","usage","usine","usuel","usure","utile","utopie","vacarme","vaccin","vagabond","vague","vaillant","vaincre","vaisseau","valable","valise","vallon","valve","vampire","vanille","vapeur","varier","vaseux","vassal","vaste","vecteur","vedette","ve\u0301ge\u0301tal","ve\u0301hicule","veinard","ve\u0301loce","vendredi","ve\u0301ne\u0301rer","venger","venimeux","ventouse","verdure","ve\u0301rin","vernir","verrou","verser","vertu","veston","ve\u0301te\u0301ran","ve\u0301tuste","vexant","vexer","viaduc","viande","victoire","vidange","vide\u0301o","vignette","vigueur","vilain","village","vinaigre","violon","vipe\u0300re","virement","virtuose","virus","visage","viseur","vision","visqueux","visuel","vital","vitesse","viticole","vitrine","vivace","vivipare","vocation","voguer","voile","voisin","voiture","volaille","volcan","voltiger","volume","vorace","vortex","voter","vouloir","voyage","voyelle","wagon","xe\u0301non","yacht","ze\u0300bre","ze\u0301nith","zeste","zoologie"]'), tf = JSON.parse('["abaco","abbaglio","abbinato","abete","abisso","abolire","abrasivo","abrogato","accadere","accenno","accusato","acetone","achille","acido","acqua","acre","acrilico","acrobata","acuto","adagio","addebito","addome","adeguato","aderire","adipe","adottare","adulare","affabile","affetto","affisso","affranto","aforisma","afoso","africano","agave","agente","agevole","aggancio","agire","agitare","agonismo","agricolo","agrumeto","aguzzo","alabarda","alato","albatro","alberato","albo","albume","alce","alcolico","alettone","alfa","algebra","aliante","alibi","alimento","allagato","allegro","allievo","allodola","allusivo","almeno","alogeno","alpaca","alpestre","altalena","alterno","alticcio","altrove","alunno","alveolo","alzare","amalgama","amanita","amarena","ambito","ambrato","ameba","america","ametista","amico","ammasso","ammenda","ammirare","ammonito","amore","ampio","ampliare","amuleto","anacardo","anagrafe","analista","anarchia","anatra","anca","ancella","ancora","andare","andrea","anello","angelo","angolare","angusto","anima","annegare","annidato","anno","annuncio","anonimo","anticipo","anzi","apatico","apertura","apode","apparire","appetito","appoggio","approdo","appunto","aprile","arabica","arachide","aragosta","araldica","arancio","aratura","arazzo","arbitro","archivio","ardito","arenile","argento","argine","arguto","aria","armonia","arnese","arredato","arringa","arrosto","arsenico","arso","artefice","arzillo","asciutto","ascolto","asepsi","asettico","asfalto","asino","asola","aspirato","aspro","assaggio","asse","assoluto","assurdo","asta","astenuto","astice","astratto","atavico","ateismo","atomico","atono","attesa","attivare","attorno","attrito","attuale","ausilio","austria","autista","autonomo","autunno","avanzato","avere","avvenire","avviso","avvolgere","azione","azoto","azzimo","azzurro","babele","baccano","bacino","baco","badessa","badilata","bagnato","baita","balcone","baldo","balena","ballata","balzano","bambino","bandire","baraonda","barbaro","barca","baritono","barlume","barocco","basilico","basso","batosta","battuto","baule","bava","bavosa","becco","beffa","belgio","belva","benda","benevole","benigno","benzina","bere","berlina","beta","bibita","bici","bidone","bifido","biga","bilancia","bimbo","binocolo","biologo","bipede","bipolare","birbante","birra","biscotto","bisesto","bisnonno","bisonte","bisturi","bizzarro","blando","blatta","bollito","bonifico","bordo","bosco","botanico","bottino","bozzolo","braccio","bradipo","brama","branca","bravura","bretella","brevetto","brezza","briglia","brillante","brindare","broccolo","brodo","bronzina","brullo","bruno","bubbone","buca","budino","buffone","buio","bulbo","buono","burlone","burrasca","bussola","busta","cadetto","caduco","calamaro","calcolo","calesse","calibro","calmo","caloria","cambusa","camerata","camicia","cammino","camola","campale","canapa","candela","cane","canino","canotto","cantina","capace","capello","capitolo","capogiro","cappero","capra","capsula","carapace","carcassa","cardo","carisma","carovana","carretto","cartolina","casaccio","cascata","caserma","caso","cassone","castello","casuale","catasta","catena","catrame","cauto","cavillo","cedibile","cedrata","cefalo","celebre","cellulare","cena","cenone","centesimo","ceramica","cercare","certo","cerume","cervello","cesoia","cespo","ceto","chela","chiaro","chicca","chiedere","chimera","china","chirurgo","chitarra","ciao","ciclismo","cifrare","cigno","cilindro","ciottolo","circa","cirrosi","citrico","cittadino","ciuffo","civetta","civile","classico","clinica","cloro","cocco","codardo","codice","coerente","cognome","collare","colmato","colore","colposo","coltivato","colza","coma","cometa","commando","comodo","computer","comune","conciso","condurre","conferma","congelare","coniuge","connesso","conoscere","consumo","continuo","convegno","coperto","copione","coppia","copricapo","corazza","cordata","coricato","cornice","corolla","corpo","corredo","corsia","cortese","cosmico","costante","cottura","covato","cratere","cravatta","creato","credere","cremoso","crescita","creta","criceto","crinale","crisi","critico","croce","cronaca","crostata","cruciale","crusca","cucire","cuculo","cugino","cullato","cupola","curatore","cursore","curvo","cuscino","custode","dado","daino","dalmata","damerino","daniela","dannoso","danzare","datato","davanti","davvero","debutto","decennio","deciso","declino","decollo","decreto","dedicato","definito","deforme","degno","delegare","delfino","delirio","delta","demenza","denotato","dentro","deposito","derapata","derivare","deroga","descritto","deserto","desiderio","desumere","detersivo","devoto","diametro","dicembre","diedro","difeso","diffuso","digerire","digitale","diluvio","dinamico","dinnanzi","dipinto","diploma","dipolo","diradare","dire","dirotto","dirupo","disagio","discreto","disfare","disgelo","disposto","distanza","disumano","dito","divano","divelto","dividere","divorato","doblone","docente","doganale","dogma","dolce","domato","domenica","dominare","dondolo","dono","dormire","dote","dottore","dovuto","dozzina","drago","druido","dubbio","dubitare","ducale","duna","duomo","duplice","duraturo","ebano","eccesso","ecco","eclissi","economia","edera","edicola","edile","editoria","educare","egemonia","egli","egoismo","egregio","elaborato","elargire","elegante","elencato","eletto","elevare","elfico","elica","elmo","elsa","eluso","emanato","emblema","emesso","emiro","emotivo","emozione","empirico","emulo","endemico","enduro","energia","enfasi","enoteca","entrare","enzima","epatite","epilogo","episodio","epocale","eppure","equatore","erario","erba","erboso","erede","eremita","erigere","ermetico","eroe","erosivo","errante","esagono","esame","esanime","esaudire","esca","esempio","esercito","esibito","esigente","esistere","esito","esofago","esortato","esoso","espanso","espresso","essenza","esso","esteso","estimare","estonia","estroso","esultare","etilico","etnico","etrusco","etto","euclideo","europa","evaso","evidenza","evitato","evoluto","evviva","fabbrica","faccenda","fachiro","falco","famiglia","fanale","fanfara","fango","fantasma","fare","farfalla","farinoso","farmaco","fascia","fastoso","fasullo","faticare","fato","favoloso","febbre","fecola","fede","fegato","felpa","feltro","femmina","fendere","fenomeno","fermento","ferro","fertile","fessura","festivo","fetta","feudo","fiaba","fiducia","fifa","figurato","filo","finanza","finestra","finire","fiore","fiscale","fisico","fiume","flacone","flamenco","flebo","flemma","florido","fluente","fluoro","fobico","focaccia","focoso","foderato","foglio","folata","folclore","folgore","fondente","fonetico","fonia","fontana","forbito","forchetta","foresta","formica","fornaio","foro","fortezza","forzare","fosfato","fosso","fracasso","frana","frassino","fratello","freccetta","frenata","fresco","frigo","frollino","fronde","frugale","frutta","fucilata","fucsia","fuggente","fulmine","fulvo","fumante","fumetto","fumoso","fune","funzione","fuoco","furbo","furgone","furore","fuso","futile","gabbiano","gaffe","galateo","gallina","galoppo","gambero","gamma","garanzia","garbo","garofano","garzone","gasdotto","gasolio","gastrico","gatto","gaudio","gazebo","gazzella","geco","gelatina","gelso","gemello","gemmato","gene","genitore","gennaio","genotipo","gergo","ghepardo","ghiaccio","ghisa","giallo","gilda","ginepro","giocare","gioiello","giorno","giove","girato","girone","gittata","giudizio","giurato","giusto","globulo","glutine","gnomo","gobba","golf","gomito","gommone","gonfio","gonna","governo","gracile","grado","grafico","grammo","grande","grattare","gravoso","grazia","greca","gregge","grifone","grigio","grinza","grotta","gruppo","guadagno","guaio","guanto","guardare","gufo","guidare","ibernato","icona","identico","idillio","idolo","idra","idrico","idrogeno","igiene","ignaro","ignorato","ilare","illeso","illogico","illudere","imballo","imbevuto","imbocco","imbuto","immane","immerso","immolato","impacco","impeto","impiego","importo","impronta","inalare","inarcare","inattivo","incanto","incendio","inchino","incisivo","incluso","incontro","incrocio","incubo","indagine","india","indole","inedito","infatti","infilare","inflitto","ingaggio","ingegno","inglese","ingordo","ingrosso","innesco","inodore","inoltrare","inondato","insano","insetto","insieme","insonnia","insulina","intasato","intero","intonaco","intuito","inumidire","invalido","invece","invito","iperbole","ipnotico","ipotesi","ippica","iride","irlanda","ironico","irrigato","irrorare","isolato","isotopo","isterico","istituto","istrice","italia","iterare","labbro","labirinto","lacca","lacerato","lacrima","lacuna","laddove","lago","lampo","lancetta","lanterna","lardoso","larga","laringe","lastra","latenza","latino","lattuga","lavagna","lavoro","legale","leggero","lembo","lentezza","lenza","leone","lepre","lesivo","lessato","lesto","letterale","leva","levigato","libero","lido","lievito","lilla","limatura","limitare","limpido","lineare","lingua","liquido","lira","lirica","lisca","lite","litigio","livrea","locanda","lode","logica","lombare","londra","longevo","loquace","lorenzo","loto","lotteria","luce","lucidato","lumaca","luminoso","lungo","lupo","luppolo","lusinga","lusso","lutto","macabro","macchina","macero","macinato","madama","magico","maglia","magnete","magro","maiolica","malafede","malgrado","malinteso","malsano","malto","malumore","mana","mancia","mandorla","mangiare","manifesto","mannaro","manovra","mansarda","mantide","manubrio","mappa","maratona","marcire","maretta","marmo","marsupio","maschera","massaia","mastino","materasso","matricola","mattone","maturo","mazurca","meandro","meccanico","mecenate","medesimo","meditare","mega","melassa","melis","melodia","meninge","meno","mensola","mercurio","merenda","merlo","meschino","mese","messere","mestolo","metallo","metodo","mettere","miagolare","mica","micelio","michele","microbo","midollo","miele","migliore","milano","milite","mimosa","minerale","mini","minore","mirino","mirtillo","miscela","missiva","misto","misurare","mitezza","mitigare","mitra","mittente","mnemonico","modello","modifica","modulo","mogano","mogio","mole","molosso","monastero","monco","mondina","monetario","monile","monotono","monsone","montato","monviso","mora","mordere","morsicato","mostro","motivato","motosega","motto","movenza","movimento","mozzo","mucca","mucosa","muffa","mughetto","mugnaio","mulatto","mulinello","multiplo","mummia","munto","muovere","murale","musa","muscolo","musica","mutevole","muto","nababbo","nafta","nanometro","narciso","narice","narrato","nascere","nastrare","naturale","nautica","naviglio","nebulosa","necrosi","negativo","negozio","nemmeno","neofita","neretto","nervo","nessuno","nettuno","neutrale","neve","nevrotico","nicchia","ninfa","nitido","nobile","nocivo","nodo","nome","nomina","nordico","normale","norvegese","nostrano","notare","notizia","notturno","novella","nucleo","nulla","numero","nuovo","nutrire","nuvola","nuziale","oasi","obbedire","obbligo","obelisco","oblio","obolo","obsoleto","occasione","occhio","occidente","occorrere","occultare","ocra","oculato","odierno","odorare","offerta","offrire","offuscato","oggetto","oggi","ognuno","olandese","olfatto","oliato","oliva","ologramma","oltre","omaggio","ombelico","ombra","omega","omissione","ondoso","onere","onice","onnivoro","onorevole","onta","operato","opinione","opposto","oracolo","orafo","ordine","orecchino","orefice","orfano","organico","origine","orizzonte","orma","ormeggio","ornativo","orologio","orrendo","orribile","ortensia","ortica","orzata","orzo","osare","oscurare","osmosi","ospedale","ospite","ossa","ossidare","ostacolo","oste","otite","otre","ottagono","ottimo","ottobre","ovale","ovest","ovino","oviparo","ovocito","ovunque","ovviare","ozio","pacchetto","pace","pacifico","padella","padrone","paese","paga","pagina","palazzina","palesare","pallido","palo","palude","pandoro","pannello","paolo","paonazzo","paprica","parabola","parcella","parere","pargolo","pari","parlato","parola","partire","parvenza","parziale","passivo","pasticca","patacca","patologia","pattume","pavone","peccato","pedalare","pedonale","peggio","peloso","penare","pendice","penisola","pennuto","penombra","pensare","pentola","pepe","pepita","perbene","percorso","perdonato","perforare","pergamena","periodo","permesso","perno","perplesso","persuaso","pertugio","pervaso","pesatore","pesista","peso","pestifero","petalo","pettine","petulante","pezzo","piacere","pianta","piattino","piccino","picozza","piega","pietra","piffero","pigiama","pigolio","pigro","pila","pilifero","pillola","pilota","pimpante","pineta","pinna","pinolo","pioggia","piombo","piramide","piretico","pirite","pirolisi","pitone","pizzico","placebo","planare","plasma","platano","plenario","pochezza","poderoso","podismo","poesia","poggiare","polenta","poligono","pollice","polmonite","polpetta","polso","poltrona","polvere","pomice","pomodoro","ponte","popoloso","porfido","poroso","porpora","porre","portata","posa","positivo","possesso","postulato","potassio","potere","pranzo","prassi","pratica","precluso","predica","prefisso","pregiato","prelievo","premere","prenotare","preparato","presenza","pretesto","prevalso","prima","principe","privato","problema","procura","produrre","profumo","progetto","prolunga","promessa","pronome","proposta","proroga","proteso","prova","prudente","prugna","prurito","psiche","pubblico","pudica","pugilato","pugno","pulce","pulito","pulsante","puntare","pupazzo","pupilla","puro","quadro","qualcosa","quasi","querela","quota","raccolto","raddoppio","radicale","radunato","raffica","ragazzo","ragione","ragno","ramarro","ramingo","ramo","randagio","rantolare","rapato","rapina","rappreso","rasatura","raschiato","rasente","rassegna","rastrello","rata","ravveduto","reale","recepire","recinto","recluta","recondito","recupero","reddito","redimere","regalato","registro","regola","regresso","relazione","remare","remoto","renna","replica","reprimere","reputare","resa","residente","responso","restauro","rete","retina","retorica","rettifica","revocato","riassunto","ribadire","ribelle","ribrezzo","ricarica","ricco","ricevere","riciclato","ricordo","ricreduto","ridicolo","ridurre","rifasare","riflesso","riforma","rifugio","rigare","rigettato","righello","rilassato","rilevato","rimanere","rimbalzo","rimedio","rimorchio","rinascita","rincaro","rinforzo","rinnovo","rinomato","rinsavito","rintocco","rinuncia","rinvenire","riparato","ripetuto","ripieno","riportare","ripresa","ripulire","risata","rischio","riserva","risibile","riso","rispetto","ristoro","risultato","risvolto","ritardo","ritegno","ritmico","ritrovo","riunione","riva","riverso","rivincita","rivolto","rizoma","roba","robotico","robusto","roccia","roco","rodaggio","rodere","roditore","rogito","rollio","romantico","rompere","ronzio","rosolare","rospo","rotante","rotondo","rotula","rovescio","rubizzo","rubrica","ruga","rullino","rumine","rumoroso","ruolo","rupe","russare","rustico","sabato","sabbiare","sabotato","sagoma","salasso","saldatura","salgemma","salivare","salmone","salone","saltare","saluto","salvo","sapere","sapido","saporito","saraceno","sarcasmo","sarto","sassoso","satellite","satira","satollo","saturno","savana","savio","saziato","sbadiglio","sbalzo","sbancato","sbarra","sbattere","sbavare","sbendare","sbirciare","sbloccato","sbocciato","sbrinare","sbruffone","sbuffare","scabroso","scadenza","scala","scambiare","scandalo","scapola","scarso","scatenare","scavato","scelto","scenico","scettro","scheda","schiena","sciarpa","scienza","scindere","scippo","sciroppo","scivolo","sclerare","scodella","scolpito","scomparto","sconforto","scoprire","scorta","scossone","scozzese","scriba","scrollare","scrutinio","scuderia","scultore","scuola","scuro","scusare","sdebitare","sdoganare","seccatura","secondo","sedano","seggiola","segnalato","segregato","seguito","selciato","selettivo","sella","selvaggio","semaforo","sembrare","seme","seminato","sempre","senso","sentire","sepolto","sequenza","serata","serbato","sereno","serio","serpente","serraglio","servire","sestina","setola","settimana","sfacelo","sfaldare","sfamato","sfarzoso","sfaticato","sfera","sfida","sfilato","sfinge","sfocato","sfoderare","sfogo","sfoltire","sforzato","sfratto","sfruttato","sfuggito","sfumare","sfuso","sgabello","sgarbato","sgonfiare","sgorbio","sgrassato","sguardo","sibilo","siccome","sierra","sigla","signore","silenzio","sillaba","simbolo","simpatico","simulato","sinfonia","singolo","sinistro","sino","sintesi","sinusoide","sipario","sisma","sistole","situato","slitta","slogatura","sloveno","smarrito","smemorato","smentito","smeraldo","smilzo","smontare","smottato","smussato","snellire","snervato","snodo","sobbalzo","sobrio","soccorso","sociale","sodale","soffitto","sogno","soldato","solenne","solido","sollazzo","solo","solubile","solvente","somatico","somma","sonda","sonetto","sonnifero","sopire","soppeso","sopra","sorgere","sorpasso","sorriso","sorso","sorteggio","sorvolato","sospiro","sosta","sottile","spada","spalla","spargere","spatola","spavento","spazzola","specie","spedire","spegnere","spelatura","speranza","spessore","spettrale","spezzato","spia","spigoloso","spillato","spinoso","spirale","splendido","sportivo","sposo","spranga","sprecare","spronato","spruzzo","spuntino","squillo","sradicare","srotolato","stabile","stacco","staffa","stagnare","stampato","stantio","starnuto","stasera","statuto","stelo","steppa","sterzo","stiletto","stima","stirpe","stivale","stizzoso","stonato","storico","strappo","stregato","stridulo","strozzare","strutto","stuccare","stufo","stupendo","subentro","succoso","sudore","suggerito","sugo","sultano","suonare","superbo","supporto","surgelato","surrogato","sussurro","sutura","svagare","svedese","sveglio","svelare","svenuto","svezia","sviluppo","svista","svizzera","svolta","svuotare","tabacco","tabulato","tacciare","taciturno","tale","talismano","tampone","tannino","tara","tardivo","targato","tariffa","tarpare","tartaruga","tasto","tattico","taverna","tavolata","tazza","teca","tecnico","telefono","temerario","tempo","temuto","tendone","tenero","tensione","tentacolo","teorema","terme","terrazzo","terzetto","tesi","tesserato","testato","tetro","tettoia","tifare","tigella","timbro","tinto","tipico","tipografo","tiraggio","tiro","titanio","titolo","titubante","tizio","tizzone","toccare","tollerare","tolto","tombola","tomo","tonfo","tonsilla","topazio","topologia","toppa","torba","tornare","torrone","tortora","toscano","tossire","tostatura","totano","trabocco","trachea","trafila","tragedia","tralcio","tramonto","transito","trapano","trarre","trasloco","trattato","trave","treccia","tremolio","trespolo","tributo","tricheco","trifoglio","trillo","trincea","trio","tristezza","triturato","trivella","tromba","trono","troppo","trottola","trovare","truccato","tubatura","tuffato","tulipano","tumulto","tunisia","turbare","turchino","tuta","tutela","ubicato","uccello","uccisore","udire","uditivo","uffa","ufficio","uguale","ulisse","ultimato","umano","umile","umorismo","uncinetto","ungere","ungherese","unicorno","unificato","unisono","unitario","unte","uovo","upupa","uragano","urgenza","urlo","usanza","usato","uscito","usignolo","usuraio","utensile","utilizzo","utopia","vacante","vaccinato","vagabondo","vagliato","valanga","valgo","valico","valletta","valoroso","valutare","valvola","vampata","vangare","vanitoso","vano","vantaggio","vanvera","vapore","varano","varcato","variante","vasca","vedetta","vedova","veduto","vegetale","veicolo","velcro","velina","velluto","veloce","venato","vendemmia","vento","verace","verbale","vergogna","verifica","vero","verruca","verticale","vescica","vessillo","vestale","veterano","vetrina","vetusto","viandante","vibrante","vicenda","vichingo","vicinanza","vidimare","vigilia","vigneto","vigore","vile","villano","vimini","vincitore","viola","vipera","virgola","virologo","virulento","viscoso","visione","vispo","vissuto","visura","vita","vitello","vittima","vivanda","vivido","viziare","voce","voga","volatile","volere","volpe","voragine","vulcano","zampogna","zanna","zappato","zattera","zavorra","zefiro","zelante","zelo","zenzero","zerbino","zibetto","zinco","zircone","zitto","zolla","zotico","zucchero","zufolo","zulu","zuppa"]'), nf = JSON.parse('["a\u0301baco","abdomen","abeja","abierto","abogado","abono","aborto","abrazo","abrir","abuelo","abuso","acabar","academia","acceso","accio\u0301n","aceite","acelga","acento","aceptar","a\u0301cido","aclarar","acne\u0301","acoger","acoso","activo","acto","actriz","actuar","acudir","acuerdo","acusar","adicto","admitir","adoptar","adorno","aduana","adulto","ae\u0301reo","afectar","aficio\u0301n","afinar","afirmar","a\u0301gil","agitar","agoni\u0301a","agosto","agotar","agregar","agrio","agua","agudo","a\u0301guila","aguja","ahogo","ahorro","aire","aislar","ajedrez","ajeno","ajuste","alacra\u0301n","alambre","alarma","alba","a\u0301lbum","alcalde","aldea","alegre","alejar","alerta","aleta","alfiler","alga","algodo\u0301n","aliado","aliento","alivio","alma","almeja","almi\u0301bar","altar","alteza","altivo","alto","altura","alumno","alzar","amable","amante","amapola","amargo","amasar","a\u0301mbar","a\u0301mbito","ameno","amigo","amistad","amor","amparo","amplio","ancho","anciano","ancla","andar","ande\u0301n","anemia","a\u0301ngulo","anillo","a\u0301nimo","ani\u0301s","anotar","antena","antiguo","antojo","anual","anular","anuncio","an\u0303adir","an\u0303ejo","an\u0303o","apagar","aparato","apetito","apio","aplicar","apodo","aporte","apoyo","aprender","aprobar","apuesta","apuro","arado","aran\u0303a","arar","a\u0301rbitro","a\u0301rbol","arbusto","archivo","arco","arder","ardilla","arduo","a\u0301rea","a\u0301rido","aries","armoni\u0301a","arne\u0301s","aroma","arpa","arpo\u0301n","arreglo","arroz","arruga","arte","artista","asa","asado","asalto","ascenso","asegurar","aseo","asesor","asiento","asilo","asistir","asno","asombro","a\u0301spero","astilla","astro","astuto","asumir","asunto","atajo","ataque","atar","atento","ateo","a\u0301tico","atleta","a\u0301tomo","atraer","atroz","atu\u0301n","audaz","audio","auge","aula","aumento","ausente","autor","aval","avance","avaro","ave","avellana","avena","avestruz","avio\u0301n","aviso","ayer","ayuda","ayuno","azafra\u0301n","azar","azote","azu\u0301car","azufre","azul","baba","babor","bache","bahi\u0301a","baile","bajar","balanza","balco\u0301n","balde","bambu\u0301","banco","banda","ban\u0303o","barba","barco","barniz","barro","ba\u0301scula","basto\u0301n","basura","batalla","bateri\u0301a","batir","batuta","bau\u0301l","bazar","bebe\u0301","bebida","bello","besar","beso","bestia","bicho","bien","bingo","blanco","bloque","blusa","boa","bobina","bobo","boca","bocina","boda","bodega","boina","bola","bolero","bolsa","bomba","bondad","bonito","bono","bonsa\u0301i","borde","borrar","bosque","bote","boti\u0301n","bo\u0301veda","bozal","bravo","brazo","brecha","breve","brillo","brinco","brisa","broca","broma","bronce","brote","bruja","brusco","bruto","buceo","bucle","bueno","buey","bufanda","bufo\u0301n","bu\u0301ho","buitre","bulto","burbuja","burla","burro","buscar","butaca","buzo\u0301n","caballo","cabeza","cabina","cabra","cacao","cada\u0301ver","cadena","caer","cafe\u0301","cai\u0301da","caima\u0301n","caja","cajo\u0301n","cal","calamar","calcio","caldo","calidad","calle","calma","calor","calvo","cama","cambio","camello","camino","campo","ca\u0301ncer","candil","canela","canguro","canica","canto","can\u0303a","can\u0303o\u0301n","caoba","caos","capaz","capita\u0301n","capote","captar","capucha","cara","carbo\u0301n","ca\u0301rcel","careta","carga","carin\u0303o","carne","carpeta","carro","carta","casa","casco","casero","caspa","castor","catorce","catre","caudal","causa","cazo","cebolla","ceder","cedro","celda","ce\u0301lebre","celoso","ce\u0301lula","cemento","ceniza","centro","cerca","cerdo","cereza","cero","cerrar","certeza","ce\u0301sped","cetro","chacal","chaleco","champu\u0301","chancla","chapa","charla","chico","chiste","chivo","choque","choza","chuleta","chupar","ciclo\u0301n","ciego","cielo","cien","cierto","cifra","cigarro","cima","cinco","cine","cinta","cipre\u0301s","circo","ciruela","cisne","cita","ciudad","clamor","clan","claro","clase","clave","cliente","clima","cli\u0301nica","cobre","coccio\u0301n","cochino","cocina","coco","co\u0301digo","codo","cofre","coger","cohete","coji\u0301n","cojo","cola","colcha","colegio","colgar","colina","collar","colmo","columna","combate","comer","comida","co\u0301modo","compra","conde","conejo","conga","conocer","consejo","contar","copa","copia","corazo\u0301n","corbata","corcho","cordo\u0301n","corona","correr","coser","cosmos","costa","cra\u0301neo","cra\u0301ter","crear","crecer","crei\u0301do","crema","cri\u0301a","crimen","cripta","crisis","cromo","cro\u0301nica","croqueta","crudo","cruz","cuadro","cuarto","cuatro","cubo","cubrir","cuchara","cuello","cuento","cuerda","cuesta","cueva","cuidar","culebra","culpa","culto","cumbre","cumplir","cuna","cuneta","cuota","cupo\u0301n","cu\u0301pula","curar","curioso","curso","curva","cutis","dama","danza","dar","dardo","da\u0301til","deber","de\u0301bil","de\u0301cada","decir","dedo","defensa","definir","dejar","delfi\u0301n","delgado","delito","demora","denso","dental","deporte","derecho","derrota","desayuno","deseo","desfile","desnudo","destino","desvi\u0301o","detalle","detener","deuda","di\u0301a","diablo","diadema","diamante","diana","diario","dibujo","dictar","diente","dieta","diez","difi\u0301cil","digno","dilema","diluir","dinero","directo","dirigir","disco","disen\u0303o","disfraz","diva","divino","doble","doce","dolor","domingo","don","donar","dorado","dormir","dorso","dos","dosis","drago\u0301n","droga","ducha","duda","duelo","duen\u0303o","dulce","du\u0301o","duque","durar","dureza","duro","e\u0301bano","ebrio","echar","eco","ecuador","edad","edicio\u0301n","edificio","editor","educar","efecto","eficaz","eje","ejemplo","elefante","elegir","elemento","elevar","elipse","e\u0301lite","elixir","elogio","eludir","embudo","emitir","emocio\u0301n","empate","empen\u0303o","empleo","empresa","enano","encargo","enchufe","enci\u0301a","enemigo","enero","enfado","enfermo","engan\u0303o","enigma","enlace","enorme","enredo","ensayo","ensen\u0303ar","entero","entrar","envase","envi\u0301o","e\u0301poca","equipo","erizo","escala","escena","escolar","escribir","escudo","esencia","esfera","esfuerzo","espada","espejo","espi\u0301a","esposa","espuma","esqui\u0301","estar","este","estilo","estufa","etapa","eterno","e\u0301tica","etnia","evadir","evaluar","evento","evitar","exacto","examen","exceso","excusa","exento","exigir","exilio","existir","e\u0301xito","experto","explicar","exponer","extremo","fa\u0301brica","fa\u0301bula","fachada","fa\u0301cil","factor","faena","faja","falda","fallo","falso","faltar","fama","familia","famoso","farao\u0301n","farmacia","farol","farsa","fase","fatiga","fauna","favor","fax","febrero","fecha","feliz","feo","feria","feroz","fe\u0301rtil","fervor","festi\u0301n","fiable","fianza","fiar","fibra","ficcio\u0301n","ficha","fideo","fiebre","fiel","fiera","fiesta","figura","fijar","fijo","fila","filete","filial","filtro","fin","finca","fingir","finito","firma","flaco","flauta","flecha","flor","flota","fluir","flujo","flu\u0301or","fobia","foca","fogata","fogo\u0301n","folio","folleto","fondo","forma","forro","fortuna","forzar","fosa","foto","fracaso","fra\u0301gil","franja","frase","fraude","frei\u0301r","freno","fresa","fri\u0301o","frito","fruta","fuego","fuente","fuerza","fuga","fumar","funcio\u0301n","funda","furgo\u0301n","furia","fusil","fu\u0301tbol","futuro","gacela","gafas","gaita","gajo","gala","galeri\u0301a","gallo","gamba","ganar","gancho","ganga","ganso","garaje","garza","gasolina","gastar","gato","gavila\u0301n","gemelo","gemir","gen","ge\u0301nero","genio","gente","geranio","gerente","germen","gesto","gigante","gimnasio","girar","giro","glaciar","globo","gloria","gol","golfo","goloso","golpe","goma","gordo","gorila","gorra","gota","goteo","gozar","grada","gra\u0301fico","grano","grasa","gratis","grave","grieta","grillo","gripe","gris","grito","grosor","gru\u0301a","grueso","grumo","grupo","guante","guapo","guardia","guerra","gui\u0301a","guin\u0303o","guion","guiso","guitarra","gusano","gustar","haber","ha\u0301bil","hablar","hacer","hacha","hada","hallar","hamaca","harina","haz","hazan\u0303a","hebilla","hebra","hecho","helado","helio","hembra","herir","hermano","he\u0301roe","hervir","hielo","hierro","hi\u0301gado","higiene","hijo","himno","historia","hocico","hogar","hoguera","hoja","hombre","hongo","honor","honra","hora","hormiga","horno","hostil","hoyo","hueco","huelga","huerta","hueso","huevo","huida","huir","humano","hu\u0301medo","humilde","humo","hundir","huraca\u0301n","hurto","icono","ideal","idioma","i\u0301dolo","iglesia","iglu\u0301","igual","ilegal","ilusio\u0301n","imagen","ima\u0301n","imitar","impar","imperio","imponer","impulso","incapaz","i\u0301ndice","inerte","infiel","informe","ingenio","inicio","inmenso","inmune","innato","insecto","instante","intere\u0301s","i\u0301ntimo","intuir","inu\u0301til","invierno","ira","iris","ironi\u0301a","isla","islote","jabali\u0301","jabo\u0301n","jamo\u0301n","jarabe","jardi\u0301n","jarra","jaula","jazmi\u0301n","jefe","jeringa","jinete","jornada","joroba","joven","joya","juerga","jueves","juez","jugador","jugo","juguete","juicio","junco","jungla","junio","juntar","ju\u0301piter","jurar","justo","juvenil","juzgar","kilo","koala","labio","lacio","lacra","lado","ladro\u0301n","lagarto","la\u0301grima","laguna","laico","lamer","la\u0301mina","la\u0301mpara","lana","lancha","langosta","lanza","la\u0301piz","largo","larva","la\u0301stima","lata","la\u0301tex","latir","laurel","lavar","lazo","leal","leccio\u0301n","leche","lector","leer","legio\u0301n","legumbre","lejano","lengua","lento","len\u0303a","leo\u0301n","leopardo","lesio\u0301n","letal","letra","leve","leyenda","libertad","libro","licor","li\u0301der","lidiar","lienzo","liga","ligero","lima","li\u0301mite","limo\u0301n","limpio","lince","lindo","li\u0301nea","lingote","lino","linterna","li\u0301quido","liso","lista","litera","litio","litro","llaga","llama","llanto","llave","llegar","llenar","llevar","llorar","llover","lluvia","lobo","locio\u0301n","loco","locura","lo\u0301gica","logro","lombriz","lomo","lonja","lote","lucha","lucir","lugar","lujo","luna","lunes","lupa","lustro","luto","luz","maceta","macho","madera","madre","maduro","maestro","mafia","magia","mago","mai\u0301z","maldad","maleta","malla","malo","mama\u0301","mambo","mamut","manco","mando","manejar","manga","maniqui\u0301","manjar","mano","manso","manta","man\u0303ana","mapa","ma\u0301quina","mar","marco","marea","marfil","margen","marido","ma\u0301rmol","marro\u0301n","martes","marzo","masa","ma\u0301scara","masivo","matar","materia","matiz","matriz","ma\u0301ximo","mayor","mazorca","mecha","medalla","medio","me\u0301dula","mejilla","mejor","melena","melo\u0301n","memoria","menor","mensaje","mente","menu\u0301","mercado","merengue","me\u0301rito","mes","meso\u0301n","meta","meter","me\u0301todo","metro","mezcla","miedo","miel","miembro","miga","mil","milagro","militar","millo\u0301n","mimo","mina","minero","mi\u0301nimo","minuto","miope","mirar","misa","miseria","misil","mismo","mitad","mito","mochila","mocio\u0301n","moda","modelo","moho","mojar","molde","moler","molino","momento","momia","monarca","moneda","monja","monto","mon\u0303o","morada","morder","moreno","morir","morro","morsa","mortal","mosca","mostrar","motivo","mover","mo\u0301vil","mozo","mucho","mudar","mueble","muela","muerte","muestra","mugre","mujer","mula","muleta","multa","mundo","mun\u0303eca","mural","muro","mu\u0301sculo","museo","musgo","mu\u0301sica","muslo","na\u0301car","nacio\u0301n","nadar","naipe","naranja","nariz","narrar","nasal","natal","nativo","natural","na\u0301usea","naval","nave","navidad","necio","ne\u0301ctar","negar","negocio","negro","neo\u0301n","nervio","neto","neutro","nevar","nevera","nicho","nido","niebla","nieto","nin\u0303ez","nin\u0303o","ni\u0301tido","nivel","nobleza","noche","no\u0301mina","noria","norma","norte","nota","noticia","novato","novela","novio","nube","nuca","nu\u0301cleo","nudillo","nudo","nuera","nueve","nuez","nulo","nu\u0301mero","nutria","oasis","obeso","obispo","objeto","obra","obrero","observar","obtener","obvio","oca","ocaso","oce\u0301ano","ochenta","ocho","ocio","ocre","octavo","octubre","oculto","ocupar","ocurrir","odiar","odio","odisea","oeste","ofensa","oferta","oficio","ofrecer","ogro","oi\u0301do","oi\u0301r","ojo","ola","oleada","olfato","olivo","olla","olmo","olor","olvido","ombligo","onda","onza","opaco","opcio\u0301n","o\u0301pera","opinar","oponer","optar","o\u0301ptica","opuesto","oracio\u0301n","orador","oral","o\u0301rbita","orca","orden","oreja","o\u0301rgano","orgi\u0301a","orgullo","oriente","origen","orilla","oro","orquesta","oruga","osadi\u0301a","oscuro","osezno","oso","ostra","oton\u0303o","otro","oveja","o\u0301vulo","o\u0301xido","oxi\u0301geno","oyente","ozono","pacto","padre","paella","pa\u0301gina","pago","pai\u0301s","pa\u0301jaro","palabra","palco","paleta","pa\u0301lido","palma","paloma","palpar","pan","panal","pa\u0301nico","pantera","pan\u0303uelo","papa\u0301","papel","papilla","paquete","parar","parcela","pared","parir","paro","pa\u0301rpado","parque","pa\u0301rrafo","parte","pasar","paseo","pasio\u0301n","paso","pasta","pata","patio","patria","pausa","pauta","pavo","payaso","peato\u0301n","pecado","pecera","pecho","pedal","pedir","pegar","peine","pelar","peldan\u0303o","pelea","peligro","pellejo","pelo","peluca","pena","pensar","pen\u0303o\u0301n","peo\u0301n","peor","pepino","pequen\u0303o","pera","percha","perder","pereza","perfil","perico","perla","permiso","perro","persona","pesa","pesca","pe\u0301simo","pestan\u0303a","pe\u0301talo","petro\u0301leo","pez","pezun\u0303a","picar","picho\u0301n","pie","piedra","pierna","pieza","pijama","pilar","piloto","pimienta","pino","pintor","pinza","pin\u0303a","piojo","pipa","pirata","pisar","piscina","piso","pista","pito\u0301n","pizca","placa","plan","plata","playa","plaza","pleito","pleno","plomo","pluma","plural","pobre","poco","poder","podio","poema","poesi\u0301a","poeta","polen","polici\u0301a","pollo","polvo","pomada","pomelo","pomo","pompa","poner","porcio\u0301n","portal","posada","poseer","posible","poste","potencia","potro","pozo","prado","precoz","pregunta","premio","prensa","preso","previo","primo","pri\u0301ncipe","prisio\u0301n","privar","proa","probar","proceso","producto","proeza","profesor","programa","prole","promesa","pronto","propio","pro\u0301ximo","prueba","pu\u0301blico","puchero","pudor","pueblo","puerta","puesto","pulga","pulir","pulmo\u0301n","pulpo","pulso","puma","punto","pun\u0303al","pun\u0303o","pupa","pupila","pure\u0301","quedar","queja","quemar","querer","queso","quieto","qui\u0301mica","quince","quitar","ra\u0301bano","rabia","rabo","racio\u0301n","radical","rai\u0301z","rama","rampa","rancho","rango","rapaz","ra\u0301pido","rapto","rasgo","raspa","rato","rayo","raza","razo\u0301n","reaccio\u0301n","realidad","reban\u0303o","rebote","recaer","receta","rechazo","recoger","recreo","recto","recurso","red","redondo","reducir","reflejo","reforma","refra\u0301n","refugio","regalo","regir","regla","regreso","rehe\u0301n","reino","rei\u0301r","reja","relato","relevo","relieve","relleno","reloj","remar","remedio","remo","rencor","rendir","renta","reparto","repetir","reposo","reptil","res","rescate","resina","respeto","resto","resumen","retiro","retorno","retrato","reunir","reve\u0301s","revista","rey","rezar","rico","riego","rienda","riesgo","rifa","ri\u0301gido","rigor","rinco\u0301n","rin\u0303o\u0301n","ri\u0301o","riqueza","risa","ritmo","rito","rizo","roble","roce","rociar","rodar","rodeo","rodilla","roer","rojizo","rojo","romero","romper","ron","ronco","ronda","ropa","ropero","rosa","rosca","rostro","rotar","rubi\u0301","rubor","rudo","rueda","rugir","ruido","ruina","ruleta","rulo","rumbo","rumor","ruptura","ruta","rutina","sa\u0301bado","saber","sabio","sable","sacar","sagaz","sagrado","sala","saldo","salero","salir","salmo\u0301n","salo\u0301n","salsa","salto","salud","salvar","samba","sancio\u0301n","sandi\u0301a","sanear","sangre","sanidad","sano","santo","sapo","saque","sardina","sarte\u0301n","sastre","sata\u0301n","sauna","saxofo\u0301n","seccio\u0301n","seco","secreto","secta","sed","seguir","seis","sello","selva","semana","semilla","senda","sensor","sen\u0303al","sen\u0303or","separar","sepia","sequi\u0301a","ser","serie","sermo\u0301n","servir","sesenta","sesio\u0301n","seta","setenta","severo","sexo","sexto","sidra","siesta","siete","siglo","signo","si\u0301laba","silbar","silencio","silla","si\u0301mbolo","simio","sirena","sistema","sitio","situar","sobre","socio","sodio","sol","solapa","soldado","soledad","so\u0301lido","soltar","solucio\u0301n","sombra","sondeo","sonido","sonoro","sonrisa","sopa","soplar","soporte","sordo","sorpresa","sorteo","soste\u0301n","so\u0301tano","suave","subir","suceso","sudor","suegra","suelo","suen\u0303o","suerte","sufrir","sujeto","sulta\u0301n","sumar","superar","suplir","suponer","supremo","sur","surco","suren\u0303o","surgir","susto","sutil","tabaco","tabique","tabla","tabu\u0301","taco","tacto","tajo","talar","talco","talento","talla","talo\u0301n","taman\u0303o","tambor","tango","tanque","tapa","tapete","tapia","tapo\u0301n","taquilla","tarde","tarea","tarifa","tarjeta","tarot","tarro","tarta","tatuaje","tauro","taza","tazo\u0301n","teatro","techo","tecla","te\u0301cnica","tejado","tejer","tejido","tela","tele\u0301fono","tema","temor","templo","tenaz","tender","tener","tenis","tenso","teori\u0301a","terapia","terco","te\u0301rmino","ternura","terror","tesis","tesoro","testigo","tetera","texto","tez","tibio","tiburo\u0301n","tiempo","tienda","tierra","tieso","tigre","tijera","tilde","timbre","ti\u0301mido","timo","tinta","ti\u0301o","ti\u0301pico","tipo","tira","tiro\u0301n","tita\u0301n","ti\u0301tere","ti\u0301tulo","tiza","toalla","tobillo","tocar","tocino","todo","toga","toldo","tomar","tono","tonto","topar","tope","toque","to\u0301rax","torero","tormenta","torneo","toro","torpedo","torre","torso","tortuga","tos","tosco","toser","to\u0301xico","trabajo","tractor","traer","tra\u0301fico","trago","traje","tramo","trance","trato","trauma","trazar","tre\u0301bol","tregua","treinta","tren","trepar","tres","tribu","trigo","tripa","triste","triunfo","trofeo","trompa","tronco","tropa","trote","trozo","truco","trueno","trufa","tuberi\u0301a","tubo","tuerto","tumba","tumor","tu\u0301nel","tu\u0301nica","turbina","turismo","turno","tutor","ubicar","u\u0301lcera","umbral","unidad","unir","universo","uno","untar","un\u0303a","urbano","urbe","urgente","urna","usar","usuario","u\u0301til","utopi\u0301a","uva","vaca","vaci\u0301o","vacuna","vagar","vago","vaina","vajilla","vale","va\u0301lido","valle","valor","va\u0301lvula","vampiro","vara","variar","varo\u0301n","vaso","vecino","vector","vehi\u0301culo","veinte","vejez","vela","velero","veloz","vena","vencer","venda","veneno","vengar","venir","venta","venus","ver","verano","verbo","verde","vereda","verja","verso","verter","vi\u0301a","viaje","vibrar","vicio","vi\u0301ctima","vida","vi\u0301deo","vidrio","viejo","viernes","vigor","vil","villa","vinagre","vino","vin\u0303edo","violi\u0301n","viral","virgo","virtud","visor","vi\u0301spera","vista","vitamina","viudo","vivaz","vivero","vivir","vivo","volca\u0301n","volumen","volver","voraz","votar","voto","voz","vuelo","vulgar","yacer","yate","yegua","yema","yerno","yeso","yodo","yoga","yogur","zafiro","zanja","zapato","zarza","zona","zorro","zumo","zurdo"]'), of = JSON.parse('["\u3042\u3044\u3053\u304F\u3057\u3093","\u3042\u3044\u3055\u3064","\u3042\u3044\u305F\u3099","\u3042\u304A\u305D\u3099\u3089","\u3042\u304B\u3061\u3083\u3093","\u3042\u304D\u308B","\u3042\u3051\u304B\u3099\u305F","\u3042\u3051\u308B","\u3042\u3053\u304B\u3099\u308C\u308B","\u3042\u3055\u3044","\u3042\u3055\u3072","\u3042\u3057\u3042\u3068","\u3042\u3057\u3099\u308F\u3046","\u3042\u3059\u3099\u304B\u308B","\u3042\u3059\u3099\u304D","\u3042\u305D\u3075\u3099","\u3042\u305F\u3048\u308B","\u3042\u305F\u305F\u3081\u308B","\u3042\u305F\u308A\u307E\u3048","\u3042\u305F\u308B","\u3042\u3064\u3044","\u3042\u3064\u304B\u3046","\u3042\u3063\u3057\u3085\u304F","\u3042\u3064\u307E\u308A","\u3042\u3064\u3081\u308B","\u3042\u3066\u306A","\u3042\u3066\u306F\u307E\u308B","\u3042\u3072\u308B","\u3042\u3075\u3099\u3089","\u3042\u3075\u3099\u308B","\u3042\u3075\u308C\u308B","\u3042\u307E\u3044","\u3042\u307E\u3068\u3099","\u3042\u307E\u3084\u304B\u3059","\u3042\u307E\u308A","\u3042\u307F\u3082\u306E","\u3042\u3081\u308A\u304B","\u3042\u3084\u307E\u308B","\u3042\u3086\u3080","\u3042\u3089\u3044\u304F\u3099\u307E","\u3042\u3089\u3057","\u3042\u3089\u3059\u3057\u3099","\u3042\u3089\u305F\u3081\u308B","\u3042\u3089\u3086\u308B","\u3042\u3089\u308F\u3059","\u3042\u308A\u304B\u3099\u3068\u3046","\u3042\u308F\u305B\u308B","\u3042\u308F\u3066\u308B","\u3042\u3093\u3044","\u3042\u3093\u304B\u3099\u3044","\u3042\u3093\u3053","\u3042\u3093\u305B\u3099\u3093","\u3042\u3093\u3066\u3044","\u3042\u3093\u306A\u3044","\u3042\u3093\u307E\u308A","\u3044\u3044\u305F\u3099\u3059","\u3044\u304A\u3093","\u3044\u304B\u3099\u3044","\u3044\u304B\u3099\u304F","\u3044\u304D\u304A\u3044","\u3044\u304D\u306A\u308A","\u3044\u304D\u3082\u306E","\u3044\u304D\u308B","\u3044\u304F\u3057\u3099","\u3044\u304F\u3075\u3099\u3093","\u3044\u3051\u306F\u3099\u306A","\u3044\u3051\u3093","\u3044\u3053\u3046","\u3044\u3053\u304F","\u3044\u3053\u3064","\u3044\u3055\u307E\u3057\u3044","\u3044\u3055\u3093","\u3044\u3057\u304D","\u3044\u3057\u3099\u3085\u3046","\u3044\u3057\u3099\u3087\u3046","\u3044\u3057\u3099\u308F\u308B","\u3044\u3059\u3099\u307F","\u3044\u3059\u3099\u308C","\u3044\u305B\u3044","\u3044\u305B\u3048\u3072\u3099","\u3044\u305B\u304B\u3044","\u3044\u305B\u304D","\u3044\u305B\u3099\u3093","\u3044\u305D\u3046\u308D\u3046","\u3044\u305D\u304B\u3099\u3057\u3044","\u3044\u305F\u3099\u3044","\u3044\u305F\u3099\u304F","\u3044\u305F\u3059\u3099\u3089","\u3044\u305F\u307F","\u3044\u305F\u308A\u3042","\u3044\u3061\u304A\u3046","\u3044\u3061\u3057\u3099","\u3044\u3061\u3068\u3099","\u3044\u3061\u306F\u3099","\u3044\u3061\u3075\u3099","\u3044\u3061\u308A\u3085\u3046","\u3044\u3064\u304B","\u3044\u3063\u3057\u3085\u3093","\u3044\u3063\u305B\u3044","\u3044\u3063\u305D\u3046","\u3044\u3063\u305F\u3093","\u3044\u3063\u3061","\u3044\u3063\u3066\u3044","\u3044\u3063\u307B\u309A\u3046","\u3044\u3066\u3055\u3099","\u3044\u3066\u3093","\u3044\u3068\u3099\u3046","\u3044\u3068\u3053","\u3044\u306A\u3044","\u3044\u306A\u304B","\u3044\u306D\u3080\u308A","\u3044\u306E\u3061","\u3044\u306E\u308B","\u3044\u306F\u3064","\u3044\u306F\u3099\u308B","\u3044\u306F\u3093","\u3044\u3072\u3099\u304D","\u3044\u3072\u3093","\u3044\u3075\u304F","\u3044\u3078\u3093","\u3044\u307B\u3046","\u3044\u307F\u3093","\u3044\u3082\u3046\u3068","\u3044\u3082\u305F\u308C","\u3044\u3082\u308A","\u3044\u3084\u304B\u3099\u308B","\u3044\u3084\u3059","\u3044\u3088\u304B\u3093","\u3044\u3088\u304F","\u3044\u3089\u3044","\u3044\u3089\u3059\u3068","\u3044\u308A\u304F\u3099\u3061","\u3044\u308A\u3087\u3046","\u3044\u308C\u3044","\u3044\u308C\u3082\u306E","\u3044\u308C\u308B","\u3044\u308D\u3048\u3093\u3072\u309A\u3064","\u3044\u308F\u3044","\u3044\u308F\u3046","\u3044\u308F\u304B\u3093","\u3044\u308F\u306F\u3099","\u3044\u308F\u3086\u308B","\u3044\u3093\u3051\u3099\u3093\u307E\u3081","\u3044\u3093\u3055\u3064","\u3044\u3093\u3057\u3087\u3046","\u3044\u3093\u3088\u3046","\u3046\u3048\u304D","\u3046\u3048\u308B","\u3046\u304A\u3055\u3099","\u3046\u304B\u3099\u3044","\u3046\u304B\u3075\u3099","\u3046\u304B\u3078\u3099\u308B","\u3046\u304D\u308F","\u3046\u304F\u3089\u3044\u306A","\u3046\u304F\u308C\u308C","\u3046\u3051\u305F\u307E\u308F\u308B","\u3046\u3051\u3064\u3051","\u3046\u3051\u3068\u308B","\u3046\u3051\u3082\u3064","\u3046\u3051\u308B","\u3046\u3053\u3099\u304B\u3059","\u3046\u3053\u3099\u304F","\u3046\u3053\u3093","\u3046\u3055\u304D\u3099","\u3046\u3057\u306A\u3046","\u3046\u3057\u308D\u304B\u3099\u307F","\u3046\u3059\u3044","\u3046\u3059\u304D\u3099","\u3046\u3059\u304F\u3099\u3089\u3044","\u3046\u3059\u3081\u308B","\u3046\u305B\u3064","\u3046\u3061\u3042\u308F\u305B","\u3046\u3061\u304B\u3099\u308F","\u3046\u3061\u304D","\u3046\u3061\u3085\u3046","\u3046\u3063\u304B\u308A","\u3046\u3064\u304F\u3057\u3044","\u3046\u3063\u305F\u3048\u308B","\u3046\u3064\u308B","\u3046\u3068\u3099\u3093","\u3046\u306A\u304D\u3099","\u3046\u306A\u3057\u3099","\u3046\u306A\u3059\u3099\u304F","\u3046\u306A\u308B","\u3046\u306D\u308B","\u3046\u306E\u3046","\u3046\u3075\u3099\u3051\u3099","\u3046\u3075\u3099\u3053\u3099\u3048","\u3046\u307E\u308C\u308B","\u3046\u3081\u308B","\u3046\u3082\u3046","\u3046\u3084\u307E\u3046","\u3046\u3088\u304F","\u3046\u3089\u304B\u3099\u3048\u3059","\u3046\u3089\u304F\u3099\u3061","\u3046\u3089\u306A\u3044","\u3046\u308A\u3042\u3051\u3099","\u3046\u308A\u304D\u308C","\u3046\u308B\u3055\u3044","\u3046\u308C\u3057\u3044","\u3046\u308C\u3086\u304D","\u3046\u308C\u308B","\u3046\u308D\u3053","\u3046\u308F\u304D","\u3046\u308F\u3055","\u3046\u3093\u3053\u3046","\u3046\u3093\u3061\u3093","\u3046\u3093\u3066\u3093","\u3046\u3093\u3068\u3099\u3046","\u3048\u3044\u3048\u3093","\u3048\u3044\u304B\u3099","\u3048\u3044\u304D\u3087\u3046","\u3048\u3044\u3053\u3099","\u3048\u3044\u305B\u3044","\u3048\u3044\u3075\u3099\u3093","\u3048\u3044\u3088\u3046","\u3048\u3044\u308F","\u3048\u304A\u308A","\u3048\u304B\u3099\u304A","\u3048\u304B\u3099\u304F","\u3048\u304D\u305F\u3044","\u3048\u304F\u305B\u308B","\u3048\u3057\u3083\u304F","\u3048\u3059\u3066","\u3048\u3064\u3089\u3093","\u3048\u306E\u304F\u3099","\u3048\u307B\u3046\u307E\u304D","\u3048\u307B\u3093","\u3048\u307E\u304D","\u3048\u3082\u3057\u3099","\u3048\u3082\u306E","\u3048\u3089\u3044","\u3048\u3089\u3075\u3099","\u3048\u308A\u3042","\u3048\u3093\u3048\u3093","\u3048\u3093\u304B\u3044","\u3048\u3093\u304D\u3099","\u3048\u3093\u3051\u3099\u304D","\u3048\u3093\u3057\u3085\u3046","\u3048\u3093\u305B\u3099\u3064","\u3048\u3093\u305D\u304F","\u3048\u3093\u3061\u3087\u3046","\u3048\u3093\u3068\u3064","\u304A\u3044\u304B\u3051\u308B","\u304A\u3044\u3053\u3059","\u304A\u3044\u3057\u3044","\u304A\u3044\u3064\u304F","\u304A\u3046\u3048\u3093","\u304A\u3046\u3055\u307E","\u304A\u3046\u3057\u3099","\u304A\u3046\u305B\u3064","\u304A\u3046\u305F\u3044","\u304A\u3046\u3075\u304F","\u304A\u3046\u3078\u3099\u3044","\u304A\u3046\u3088\u3046","\u304A\u3048\u308B","\u304A\u304A\u3044","\u304A\u304A\u3046","\u304A\u304A\u3068\u3099\u304A\u308A","\u304A\u304A\u3084","\u304A\u304A\u3088\u305D","\u304A\u304B\u3048\u308A","\u304A\u304B\u3059\u3099","\u304A\u304B\u3099\u3080","\u304A\u304B\u308F\u308A","\u304A\u304D\u3099\u306A\u3046","\u304A\u304D\u308B","\u304A\u304F\u3055\u307E","\u304A\u304F\u3057\u3099\u3087\u3046","\u304A\u304F\u308A\u304B\u3099\u306A","\u304A\u304F\u308B","\u304A\u304F\u308C\u308B","\u304A\u3053\u3059","\u304A\u3053\u306A\u3046","\u304A\u3053\u308B","\u304A\u3055\u3048\u308B","\u304A\u3055\u306A\u3044","\u304A\u3055\u3081\u308B","\u304A\u3057\u3044\u308C","\u304A\u3057\u3048\u308B","\u304A\u3057\u3099\u304D\u3099","\u304A\u3057\u3099\u3055\u3093","\u304A\u3057\u3083\u308C","\u304A\u305D\u3089\u304F","\u304A\u305D\u308F\u308B","\u304A\u305F\u304B\u3099\u3044","\u304A\u305F\u304F","\u304A\u305F\u3099\u3084\u304B","\u304A\u3061\u3064\u304F","\u304A\u3063\u3068","\u304A\u3064\u308A","\u304A\u3066\u3099\u304B\u3051","\u304A\u3068\u3057\u3082\u306E","\u304A\u3068\u306A\u3057\u3044","\u304A\u3068\u3099\u308A","\u304A\u3068\u3099\u308D\u304B\u3059","\u304A\u306F\u3099\u3055\u3093","\u304A\u307E\u3044\u308A","\u304A\u3081\u3066\u3099\u3068\u3046","\u304A\u3082\u3044\u3066\u3099","\u304A\u3082\u3046","\u304A\u3082\u305F\u3044","\u304A\u3082\u3061\u3083","\u304A\u3084\u3064","\u304A\u3084\u3086\u3072\u3099","\u304A\u3088\u307B\u3099\u3059","\u304A\u3089\u3093\u305F\u3099","\u304A\u308D\u3059","\u304A\u3093\u304B\u3099\u304F","\u304A\u3093\u3051\u3044","\u304A\u3093\u3057\u3083","\u304A\u3093\u305B\u3093","\u304A\u3093\u305F\u3099\u3093","\u304A\u3093\u3061\u3085\u3046","\u304A\u3093\u3068\u3099\u3051\u3044","\u304B\u3042\u3064","\u304B\u3044\u304B\u3099","\u304B\u3099\u3044\u304D","\u304B\u3099\u3044\u3051\u3093","\u304B\u3099\u3044\u3053\u3046","\u304B\u3044\u3055\u3064","\u304B\u3044\u3057\u3083","\u304B\u3044\u3059\u3044\u3088\u304F","\u304B\u3044\u305B\u3099\u3093","\u304B\u3044\u305D\u3099\u3046\u3068\u3099","\u304B\u3044\u3064\u3046","\u304B\u3044\u3066\u3093","\u304B\u3044\u3068\u3046","\u304B\u3044\u3075\u304F","\u304B\u3099\u3044\u3078\u304D","\u304B\u3044\u307B\u3046","\u304B\u3044\u3088\u3046","\u304B\u3099\u3044\u3089\u3044","\u304B\u3044\u308F","\u304B\u3048\u308B","\u304B\u304A\u308A","\u304B\u304B\u3048\u308B","\u304B\u304B\u3099\u304F","\u304B\u304B\u3099\u3057","\u304B\u304B\u3099\u307F","\u304B\u304F\u3053\u3099","\u304B\u304F\u3068\u304F","\u304B\u3055\u3099\u308B","\u304B\u3099\u305D\u3099\u3046","\u304B\u305F\u3044","\u304B\u305F\u3061","\u304B\u3099\u3061\u3087\u3046","\u304B\u3099\u3063\u304D\u3085\u3046","\u304B\u3099\u3063\u3053\u3046","\u304B\u3099\u3063\u3055\u3093","\u304B\u3099\u3063\u3057\u3087\u3046","\u304B\u306A\u3055\u3099\u308F\u3057","\u304B\u306E\u3046","\u304B\u3099\u306F\u304F","\u304B\u3075\u3099\u304B","\u304B\u307B\u3046","\u304B\u307B\u3053\u3099","\u304B\u307E\u3046","\u304B\u307E\u307B\u3099\u3053","\u304B\u3081\u308C\u304A\u3093","\u304B\u3086\u3044","\u304B\u3088\u3046\u3072\u3099","\u304B\u3089\u3044","\u304B\u308B\u3044","\u304B\u308D\u3046","\u304B\u308F\u304F","\u304B\u308F\u3089","\u304B\u3099\u3093\u304B","\u304B\u3093\u3051\u3044","\u304B\u3093\u3053\u3046","\u304B\u3093\u3057\u3083","\u304B\u3093\u305D\u3046","\u304B\u3093\u305F\u3093","\u304B\u3093\u3061","\u304B\u3099\u3093\u306F\u3099\u308B","\u304D\u3042\u3044","\u304D\u3042\u3064","\u304D\u3044\u308D","\u304D\u3099\u3044\u3093","\u304D\u3046\u3044","\u304D\u3046\u3093","\u304D\u3048\u308B","\u304D\u304A\u3046","\u304D\u304A\u304F","\u304D\u304A\u3061","\u304D\u304A\u3093","\u304D\u304B\u3044","\u304D\u304B\u304F","\u304D\u304B\u3093\u3057\u3083","\u304D\u304D\u3066","\u304D\u304F\u306F\u3099\u308A","\u304D\u304F\u3089\u3051\u3099","\u304D\u3051\u3093\u305B\u3044","\u304D\u3053\u3046","\u304D\u3053\u3048\u308B","\u304D\u3053\u304F","\u304D\u3055\u3044","\u304D\u3055\u304F","\u304D\u3055\u307E","\u304D\u3055\u3089\u304D\u3099","\u304D\u3099\u3057\u3099\u304B\u304B\u3099\u304F","\u304D\u3099\u3057\u304D","\u304D\u3099\u3057\u3099\u305F\u3044\u3051\u3093","\u304D\u3099\u3057\u3099\u306B\u3063\u3066\u3044","\u304D\u3099\u3057\u3099\u3085\u3064\u3057\u3083","\u304D\u3059\u3046","\u304D\u305B\u3044","\u304D\u305B\u304D","\u304D\u305B\u3064","\u304D\u305D\u3046","\u304D\u305D\u3099\u304F","\u304D\u305D\u3099\u3093","\u304D\u305F\u3048\u308B","\u304D\u3061\u3087\u3046","\u304D\u3064\u3048\u3093","\u304D\u3099\u3063\u3061\u308A","\u304D\u3064\u3064\u304D","\u304D\u3064\u306D","\u304D\u3066\u3044","\u304D\u3068\u3099\u3046","\u304D\u3068\u3099\u304F","\u304D\u306A\u3044","\u304D\u306A\u304B\u3099","\u304D\u306A\u3053","\u304D\u306C\u3053\u3099\u3057","\u304D\u306D\u3093","\u304D\u306E\u3046","\u304D\u306E\u3057\u305F","\u304D\u306F\u304F","\u304D\u3072\u3099\u3057\u3044","\u304D\u3072\u3093","\u304D\u3075\u304F","\u304D\u3075\u3099\u3093","\u304D\u307B\u3099\u3046","\u304D\u307B\u3093","\u304D\u307E\u308B","\u304D\u307F\u3064","\u304D\u3080\u3059\u3099\u304B\u3057\u3044","\u304D\u3081\u308B","\u304D\u3082\u305F\u3099\u3081\u3057","\u304D\u3082\u3061","\u304D\u3082\u306E","\u304D\u3083\u304F","\u304D\u3084\u304F","\u304D\u3099\u3085\u3046\u306B\u304F","\u304D\u3088\u3046","\u304D\u3087\u3046\u308A\u3085\u3046","\u304D\u3089\u3044","\u304D\u3089\u304F","\u304D\u308A\u3093","\u304D\u308C\u3044","\u304D\u308C\u3064","\u304D\u308D\u304F","\u304D\u3099\u308D\u3093","\u304D\u308F\u3081\u308B","\u304D\u3099\u3093\u3044\u308D","\u304D\u3093\u304B\u304F\u3057\u3099","\u304D\u3093\u3057\u3099\u3087","\u304D\u3093\u3088\u3046\u3072\u3099","\u304F\u3099\u3042\u3044","\u304F\u3044\u3059\u3099","\u304F\u3046\u304B\u3093","\u304F\u3046\u304D","\u304F\u3046\u304F\u3099\u3093","\u304F\u3046\u3053\u3046","\u304F\u3099\u3046\u305B\u3044","\u304F\u3046\u305D\u3046","\u304F\u3099\u3046\u305F\u3089","\u304F\u3046\u3075\u304F","\u304F\u3046\u307B\u3099","\u304F\u304B\u3093","\u304F\u304D\u3087\u3046","\u304F\u3051\u3099\u3093","\u304F\u3099\u3053\u3046","\u304F\u3055\u3044","\u304F\u3055\u304D","\u304F\u3055\u306F\u3099\u306A","\u304F\u3055\u308B","\u304F\u3057\u3083\u307F","\u304F\u3057\u3087\u3046","\u304F\u3059\u306E\u304D","\u304F\u3059\u308A\u3086\u3072\u3099","\u304F\u305B\u3051\u3099","\u304F\u305B\u3093","\u304F\u3099\u305F\u3044\u3066\u304D","\u304F\u305F\u3099\u3055\u308B","\u304F\u305F\u3072\u3099\u308C\u308B","\u304F\u3061\u3053\u307F","\u304F\u3061\u3055\u304D","\u304F\u3064\u3057\u305F","\u304F\u3099\u3063\u3059\u308A","\u304F\u3064\u308D\u304F\u3099","\u304F\u3068\u3046\u3066\u3093","\u304F\u3068\u3099\u304F","\u304F\u306A\u3093","\u304F\u306D\u304F\u306D","\u304F\u306E\u3046","\u304F\u3075\u3046","\u304F\u307F\u3042\u308F\u305B","\u304F\u307F\u305F\u3066\u308B","\u304F\u3081\u308B","\u304F\u3084\u304F\u3057\u3087","\u304F\u3089\u3059","\u304F\u3089\u3078\u3099\u308B","\u304F\u308B\u307E","\u304F\u308C\u308B","\u304F\u308D\u3046","\u304F\u308F\u3057\u3044","\u304F\u3099\u3093\u304B\u3093","\u304F\u3099\u3093\u3057\u3087\u304F","\u304F\u3099\u3093\u305F\u3044","\u304F\u3099\u3093\u3066","\u3051\u3042\u306A","\u3051\u3044\u304B\u304F","\u3051\u3044\u3051\u3093","\u3051\u3044\u3053","\u3051\u3044\u3055\u3064","\u3051\u3099\u3044\u3057\u3099\u3085\u3064","\u3051\u3044\u305F\u3044","\u3051\u3099\u3044\u306E\u3046\u3057\u3099\u3093","\u3051\u3044\u308C\u304D","\u3051\u3044\u308D","\u3051\u304A\u3068\u3059","\u3051\u304A\u308A\u3082\u306E","\u3051\u3099\u304D\u304B","\u3051\u3099\u304D\u3051\u3099\u3093","\u3051\u3099\u304D\u305F\u3099\u3093","\u3051\u3099\u304D\u3061\u3093","\u3051\u3099\u304D\u3068\u3064","\u3051\u3099\u304D\u306F","\u3051\u3099\u304D\u3084\u304F","\u3051\u3099\u3053\u3046","\u3051\u3099\u3053\u304F\u3057\u3099\u3087\u3046","\u3051\u3099\u3055\u3099\u3044","\u3051\u3055\u304D","\u3051\u3099\u3055\u3099\u3093","\u3051\u3057\u304D","\u3051\u3057\u3053\u3099\u3080","\u3051\u3057\u3087\u3046","\u3051\u3099\u3059\u3068","\u3051\u305F\u306F\u3099","\u3051\u3061\u3083\u3063\u3075\u309A","\u3051\u3061\u3089\u3059","\u3051\u3064\u3042\u3064","\u3051\u3064\u3044","\u3051\u3064\u3048\u304D","\u3051\u3063\u3053\u3093","\u3051\u3064\u3057\u3099\u3087","\u3051\u3063\u305B\u304D","\u3051\u3063\u3066\u3044","\u3051\u3064\u307E\u3064","\u3051\u3099\u3064\u3088\u3046\u3072\u3099","\u3051\u3099\u3064\u308C\u3044","\u3051\u3064\u308D\u3093","\u3051\u3099\u3068\u3099\u304F","\u3051\u3068\u306F\u3099\u3059","\u3051\u3068\u308B","\u3051\u306A\u3051\u3099","\u3051\u306A\u3059","\u3051\u306A\u307F","\u3051\u306C\u304D","\u3051\u3099\u306D\u3064","\u3051\u306D\u3093","\u3051\u306F\u3044","\u3051\u3099\u3072\u3093","\u3051\u3075\u3099\u304B\u3044","\u3051\u3099\u307B\u3099\u304F","\u3051\u307E\u308A","\u3051\u307F\u304B\u308B","\u3051\u3080\u3057","\u3051\u3080\u308A","\u3051\u3082\u306E","\u3051\u3089\u3044","\u3051\u308D\u3051\u308D","\u3051\u308F\u3057\u3044","\u3051\u3093\u3044","\u3051\u3093\u3048\u3064","\u3051\u3093\u304A","\u3051\u3093\u304B","\u3051\u3099\u3093\u304D","\u3051\u3093\u3051\u3099\u3093","\u3051\u3093\u3053\u3046","\u3051\u3093\u3055\u304F","\u3051\u3093\u3057\u3085\u3046","\u3051\u3093\u3059\u3046","\u3051\u3099\u3093\u305D\u3046","\u3051\u3093\u3061\u304F","\u3051\u3093\u3066\u3044","\u3051\u3093\u3068\u3046","\u3051\u3093\u306A\u3044","\u3051\u3093\u306B\u3093","\u3051\u3099\u3093\u3075\u3099\u3064","\u3051\u3093\u307E","\u3051\u3093\u307F\u3093","\u3051\u3093\u3081\u3044","\u3051\u3093\u3089\u3093","\u3051\u3093\u308A","\u3053\u3042\u304F\u307E","\u3053\u3044\u306C","\u3053\u3044\u3072\u3099\u3068","\u3053\u3099\u3046\u3044","\u3053\u3046\u3048\u3093","\u3053\u3046\u304A\u3093","\u3053\u3046\u304B\u3093","\u3053\u3099\u3046\u304D\u3085\u3046","\u3053\u3099\u3046\u3051\u3044","\u3053\u3046\u3053\u3046","\u3053\u3046\u3055\u3044","\u3053\u3046\u3057\u3099","\u3053\u3046\u3059\u3044","\u3053\u3099\u3046\u305B\u3044","\u3053\u3046\u305D\u304F","\u3053\u3046\u305F\u3044","\u3053\u3046\u3061\u3083","\u3053\u3046\u3064\u3046","\u3053\u3046\u3066\u3044","\u3053\u3046\u3068\u3099\u3046","\u3053\u3046\u306A\u3044","\u3053\u3046\u306F\u3044","\u3053\u3099\u3046\u307B\u3046","\u3053\u3099\u3046\u307E\u3093","\u3053\u3046\u3082\u304F","\u3053\u3046\u308A\u3064","\u3053\u3048\u308B","\u3053\u304A\u308A","\u3053\u3099\u304B\u3044","\u3053\u3099\u304B\u3099\u3064","\u3053\u3099\u304B\u3093","\u3053\u304F\u3053\u3099","\u3053\u304F\u3055\u3044","\u3053\u304F\u3068\u3046","\u3053\u304F\u306A\u3044","\u3053\u304F\u306F\u304F","\u3053\u304F\u3099\u307E","\u3053\u3051\u3044","\u3053\u3051\u308B","\u3053\u3053\u306E\u304B","\u3053\u3053\u308D","\u3053\u3055\u3081","\u3053\u3057\u3064","\u3053\u3059\u3046","\u3053\u305B\u3044","\u3053\u305B\u304D","\u3053\u305B\u3099\u3093","\u3053\u305D\u305F\u3099\u3066","\u3053\u305F\u3044","\u3053\u305F\u3048\u308B","\u3053\u305F\u3064","\u3053\u3061\u3087\u3046","\u3053\u3063\u304B","\u3053\u3064\u3053\u3064","\u3053\u3064\u306F\u3099\u3093","\u3053\u3064\u3075\u3099","\u3053\u3066\u3044","\u3053\u3066\u3093","\u3053\u3068\u304B\u3099\u3089","\u3053\u3068\u3057","\u3053\u3068\u306F\u3099","\u3053\u3068\u308A","\u3053\u306A\u3053\u3099\u306A","\u3053\u306D\u3053\u306D","\u3053\u306E\u307E\u307E","\u3053\u306E\u307F","\u3053\u306E\u3088","\u3053\u3099\u306F\u3093","\u3053\u3072\u3064\u3057\u3099","\u3053\u3075\u3046","\u3053\u3075\u3093","\u3053\u307B\u3099\u308C\u308B","\u3053\u3099\u307E\u3042\u3075\u3099\u3089","\u3053\u307E\u304B\u3044","\u3053\u3099\u307E\u3059\u308A","\u3053\u307E\u3064\u306A","\u3053\u307E\u308B","\u3053\u3080\u304D\u3099\u3053","\u3053\u3082\u3057\u3099","\u3053\u3082\u3061","\u3053\u3082\u306E","\u3053\u3082\u3093","\u3053\u3084\u304F","\u3053\u3084\u307E","\u3053\u3086\u3046","\u3053\u3086\u3072\u3099","\u3053\u3088\u3044","\u3053\u3088\u3046","\u3053\u308A\u308B","\u3053\u308C\u304F\u3057\u3087\u3093","\u3053\u308D\u3063\u3051","\u3053\u308F\u3082\u3066","\u3053\u308F\u308C\u308B","\u3053\u3093\u3044\u3093","\u3053\u3093\u304B\u3044","\u3053\u3093\u304D","\u3053\u3093\u3057\u3085\u3046","\u3053\u3093\u3059\u3044","\u3053\u3093\u305F\u3099\u3066","\u3053\u3093\u3068\u3093","\u3053\u3093\u306A\u3093","\u3053\u3093\u3072\u3099\u306B","\u3053\u3093\u307B\u309A\u3093","\u3053\u3093\u307E\u3051","\u3053\u3093\u3084","\u3053\u3093\u308C\u3044","\u3053\u3093\u308F\u304F","\u3055\u3099\u3044\u3048\u304D","\u3055\u3044\u304B\u3044","\u3055\u3044\u304D\u3093","\u3055\u3099\u3044\u3051\u3099\u3093","\u3055\u3099\u3044\u3053","\u3055\u3044\u3057\u3087","\u3055\u3044\u305B\u3044","\u3055\u3099\u3044\u305F\u304F","\u3055\u3099\u3044\u3061\u3085\u3046","\u3055\u3044\u3066\u304D","\u3055\u3099\u3044\u308A\u3087\u3046","\u3055\u3046\u306A","\u3055\u304B\u3044\u3057","\u3055\u304B\u3099\u3059","\u3055\u304B\u306A","\u3055\u304B\u307F\u3061","\u3055\u304B\u3099\u308B","\u3055\u304D\u3099\u3087\u3046","\u3055\u304F\u3057","\u3055\u304F\u3072\u3093","\u3055\u304F\u3089","\u3055\u3053\u304F","\u3055\u3053\u3064","\u3055\u3059\u3099\u304B\u308B","\u3055\u3099\u305B\u304D","\u3055\u305F\u3093","\u3055\u3064\u3048\u3044","\u3055\u3099\u3064\u304A\u3093","\u3055\u3099\u3063\u304B","\u3055\u3099\u3064\u304B\u3099\u304F","\u3055\u3063\u304D\u3087\u304F","\u3055\u3099\u3063\u3057","\u3055\u3064\u3057\u3099\u3093","\u3055\u3099\u3063\u305D\u3046","\u3055\u3064\u305F\u306F\u3099","\u3055\u3064\u307E\u3044\u3082","\u3055\u3066\u3044","\u3055\u3068\u3044\u3082","\u3055\u3068\u3046","\u3055\u3068\u304A\u3084","\u3055\u3068\u3057","\u3055\u3068\u308B","\u3055\u306E\u3046","\u3055\u306F\u3099\u304F","\u3055\u3072\u3099\u3057\u3044","\u3055\u3078\u3099\u3064","\u3055\u307B\u3046","\u3055\u307B\u3068\u3099","\u3055\u307E\u3059","\u3055\u307F\u3057\u3044","\u3055\u307F\u305F\u3099\u308C","\u3055\u3080\u3051","\u3055\u3081\u308B","\u3055\u3084\u3048\u3093\u3068\u3099\u3046","\u3055\u3086\u3046","\u3055\u3088\u3046","\u3055\u3088\u304F","\u3055\u3089\u305F\u3099","\u3055\u3099\u308B\u305D\u306F\u3099","\u3055\u308F\u3084\u304B","\u3055\u308F\u308B","\u3055\u3093\u3044\u3093","\u3055\u3093\u304B","\u3055\u3093\u304D\u3083\u304F","\u3055\u3093\u3053\u3046","\u3055\u3093\u3055\u3044","\u3055\u3099\u3093\u3057\u3087","\u3055\u3093\u3059\u3046","\u3055\u3093\u305B\u3044","\u3055\u3093\u305D","\u3055\u3093\u3061","\u3055\u3093\u307E","\u3055\u3093\u307F","\u3055\u3093\u3089\u3093","\u3057\u3042\u3044","\u3057\u3042\u3051\u3099","\u3057\u3042\u3055\u3063\u3066","\u3057\u3042\u308F\u305B","\u3057\u3044\u304F","\u3057\u3044\u3093","\u3057\u3046\u3061","\u3057\u3048\u3044","\u3057\u304A\u3051","\u3057\u304B\u3044","\u3057\u304B\u304F","\u3057\u3099\u304B\u3093","\u3057\u3053\u3099\u3068","\u3057\u3059\u3046","\u3057\u3099\u305F\u3099\u3044","\u3057\u305F\u3046\u3051","\u3057\u305F\u304D\u3099","\u3057\u305F\u3066","\u3057\u305F\u307F","\u3057\u3061\u3087\u3046","\u3057\u3061\u308A\u3093","\u3057\u3063\u304B\u308A","\u3057\u3064\u3057\u3099","\u3057\u3064\u3082\u3093","\u3057\u3066\u3044","\u3057\u3066\u304D","\u3057\u3066\u3064","\u3057\u3099\u3066\u3093","\u3057\u3099\u3068\u3099\u3046","\u3057\u306A\u304D\u3099\u308C","\u3057\u306A\u3082\u306E","\u3057\u306A\u3093","\u3057\u306D\u307E","\u3057\u306D\u3093","\u3057\u306E\u304F\u3099","\u3057\u306E\u3075\u3099","\u3057\u306F\u3044","\u3057\u306F\u3099\u304B\u308A","\u3057\u306F\u3064","\u3057\u306F\u3089\u3044","\u3057\u306F\u3093","\u3057\u3072\u3087\u3046","\u3057\u3075\u304F","\u3057\u3099\u3075\u3099\u3093","\u3057\u3078\u3044","\u3057\u307B\u3046","\u3057\u307B\u3093","\u3057\u307E\u3046","\u3057\u307E\u308B","\u3057\u307F\u3093","\u3057\u3080\u3051\u308B","\u3057\u3099\u3080\u3057\u3087","\u3057\u3081\u3044","\u3057\u3081\u308B","\u3057\u3082\u3093","\u3057\u3083\u3044\u3093","\u3057\u3083\u3046\u3093","\u3057\u3083\u304A\u3093","\u3057\u3099\u3083\u304B\u3099\u3044\u3082","\u3057\u3084\u304F\u3057\u3087","\u3057\u3083\u304F\u307B\u3046","\u3057\u3083\u3051\u3093","\u3057\u3083\u3053","\u3057\u3083\u3055\u3099\u3044","\u3057\u3083\u3057\u3093","\u3057\u3083\u305B\u3093","\u3057\u3083\u305D\u3046","\u3057\u3083\u305F\u3044","\u3057\u3083\u3061\u3087\u3046","\u3057\u3083\u3063\u304D\u3093","\u3057\u3099\u3083\u307E","\u3057\u3083\u308A\u3093","\u3057\u3083\u308C\u3044","\u3057\u3099\u3086\u3046","\u3057\u3099\u3085\u3046\u3057\u3087","\u3057\u3085\u304F\u306F\u304F","\u3057\u3099\u3085\u3057\u3093","\u3057\u3085\u3063\u305B\u304D","\u3057\u3085\u307F","\u3057\u3085\u3089\u306F\u3099","\u3057\u3099\u3085\u3093\u306F\u3099\u3093","\u3057\u3087\u3046\u304B\u3044","\u3057\u3087\u304F\u305F\u304F","\u3057\u3087\u3063\u3051\u3093","\u3057\u3087\u3068\u3099\u3046","\u3057\u3087\u3082\u3064","\u3057\u3089\u305B\u308B","\u3057\u3089\u3078\u3099\u308B","\u3057\u3093\u304B","\u3057\u3093\u3053\u3046","\u3057\u3099\u3093\u3057\u3099\u3083","\u3057\u3093\u305B\u3044\u3057\u3099","\u3057\u3093\u3061\u304F","\u3057\u3093\u308A\u3093","\u3059\u3042\u3051\u3099","\u3059\u3042\u3057","\u3059\u3042\u306A","\u3059\u3099\u3042\u3093","\u3059\u3044\u3048\u3044","\u3059\u3044\u304B","\u3059\u3044\u3068\u3046","\u3059\u3099\u3044\u3075\u3099\u3093","\u3059\u3044\u3088\u3046\u3072\u3099","\u3059\u3046\u304B\u3099\u304F","\u3059\u3046\u3057\u3099\u3064","\u3059\u3046\u305B\u3093","\u3059\u304A\u3068\u3099\u308A","\u3059\u304D\u307E","\u3059\u304F\u3046","\u3059\u304F\u306A\u3044","\u3059\u3051\u308B","\u3059\u3053\u3099\u3044","\u3059\u3053\u3057","\u3059\u3099\u3055\u3093","\u3059\u3059\u3099\u3057\u3044","\u3059\u3059\u3080","\u3059\u3059\u3081\u308B","\u3059\u3063\u304B\u308A","\u3059\u3099\u3063\u3057\u308A","\u3059\u3099\u3063\u3068","\u3059\u3066\u304D","\u3059\u3066\u308B","\u3059\u306D\u308B","\u3059\u306E\u3053","\u3059\u306F\u305F\u3099","\u3059\u306F\u3099\u3089\u3057\u3044","\u3059\u3099\u3072\u3087\u3046","\u3059\u3099\u3075\u3099\u306C\u308C","\u3059\u3075\u3099\u308A","\u3059\u3075\u308C","\u3059\u3078\u3099\u3066","\u3059\u3078\u3099\u308B","\u3059\u3099\u307B\u3046","\u3059\u307B\u3099\u3093","\u3059\u307E\u3044","\u3059\u3081\u3057","\u3059\u3082\u3046","\u3059\u3084\u304D","\u3059\u3089\u3059\u3089","\u3059\u308B\u3081","\u3059\u308C\u3061\u304B\u3099\u3046","\u3059\u308D\u3063\u3068","\u3059\u308F\u308B","\u3059\u3093\u305B\u3099\u3093","\u3059\u3093\u307B\u309A\u3046","\u305B\u3042\u3075\u3099\u3089","\u305B\u3044\u304B\u3064","\u305B\u3044\u3051\u3099\u3093","\u305B\u3044\u3057\u3099","\u305B\u3044\u3088\u3046","\u305B\u304A\u3046","\u305B\u304B\u3044\u304B\u3093","\u305B\u304D\u306B\u3093","\u305B\u304D\u3080","\u305B\u304D\u3086","\u305B\u304D\u3089\u3093\u3046\u3093","\u305B\u3051\u3093","\u305B\u3053\u3046","\u305B\u3059\u3057\u3099","\u305B\u305F\u3044","\u305B\u305F\u3051","\u305B\u3063\u304B\u304F","\u305B\u3063\u304D\u3083\u304F","\u305B\u3099\u3063\u304F","\u305B\u3063\u3051\u3093","\u305B\u3063\u3053\u3064","\u305B\u3063\u3055\u305F\u304F\u307E","\u305B\u3064\u305D\u3099\u304F","\u305B\u3064\u305F\u3099\u3093","\u305B\u3064\u3066\u3099\u3093","\u305B\u3063\u306F\u309A\u3093","\u305B\u3064\u3072\u3099","\u305B\u3064\u3075\u3099\u3093","\u305B\u3064\u3081\u3044","\u305B\u3064\u308A\u3064","\u305B\u306A\u304B","\u305B\u306E\u3072\u3099","\u305B\u306F\u306F\u3099","\u305B\u3072\u3099\u308D","\u305B\u307B\u3099\u306D","\u305B\u307E\u3044","\u305B\u307E\u308B","\u305B\u3081\u308B","\u305B\u3082\u305F\u308C","\u305B\u308A\u3075","\u305B\u3099\u3093\u3042\u304F","\u305B\u3093\u3044","\u305B\u3093\u3048\u3044","\u305B\u3093\u304B","\u305B\u3093\u304D\u3087","\u305B\u3093\u304F","\u305B\u3093\u3051\u3099\u3093","\u305B\u3099\u3093\u3053\u3099","\u305B\u3093\u3055\u3044","\u305B\u3093\u3057\u3085","\u305B\u3093\u3059\u3044","\u305B\u3093\u305B\u3044","\u305B\u3093\u305D\u3099","\u305B\u3093\u305F\u304F","\u305B\u3093\u3061\u3087\u3046","\u305B\u3093\u3066\u3044","\u305B\u3093\u3068\u3046","\u305B\u3093\u306C\u304D","\u305B\u3093\u306D\u3093","\u305B\u3093\u306F\u309A\u3044","\u305B\u3099\u3093\u3075\u3099","\u305B\u3099\u3093\u307B\u309A\u3046","\u305B\u3093\u3080","\u305B\u3093\u3081\u3093\u3057\u3099\u3087","\u305B\u3093\u3082\u3093","\u305B\u3093\u3084\u304F","\u305B\u3093\u3086\u3046","\u305B\u3093\u3088\u3046","\u305B\u3099\u3093\u3089","\u305B\u3099\u3093\u308A\u3083\u304F","\u305B\u3093\u308C\u3044","\u305B\u3093\u308D","\u305D\u3042\u304F","\u305D\u3044\u3068\u3051\u3099\u308B","\u305D\u3044\u306D","\u305D\u3046\u304B\u3099\u3093\u304D\u3087\u3046","\u305D\u3046\u304D","\u305D\u3046\u3053\u3099","\u305D\u3046\u3057\u3093","\u305D\u3046\u305F\u3099\u3093","\u305D\u3046\u306A\u3093","\u305D\u3046\u3072\u3099","\u305D\u3046\u3081\u3093","\u305D\u3046\u308A","\u305D\u3048\u3082\u306E","\u305D\u3048\u3093","\u305D\u304B\u3099\u3044","\u305D\u3051\u3099\u304D","\u305D\u3053\u3046","\u305D\u3053\u305D\u3053","\u305D\u3055\u3099\u3044","\u305D\u3057\u306A","\u305D\u305B\u3044","\u305D\u305B\u3093","\u305D\u305D\u304F\u3099","\u305D\u305F\u3099\u3066\u308B","\u305D\u3064\u3046","\u305D\u3064\u3048\u3093","\u305D\u3063\u304B\u3093","\u305D\u3064\u304D\u3099\u3087\u3046","\u305D\u3063\u3051\u3064","\u305D\u3063\u3053\u3046","\u305D\u3063\u305B\u3093","\u305D\u3063\u3068","\u305D\u3068\u304B\u3099\u308F","\u305D\u3068\u3064\u3099\u3089","\u305D\u306A\u3048\u308B","\u305D\u306A\u305F","\u305D\u3075\u307B\u3099","\u305D\u307B\u3099\u304F","\u305D\u307B\u3099\u308D","\u305D\u307E\u3064","\u305D\u307E\u308B","\u305D\u3080\u304F","\u305D\u3080\u308A\u3048","\u305D\u3081\u308B","\u305D\u3082\u305D\u3082","\u305D\u3088\u304B\u305B\u3099","\u305D\u3089\u307E\u3081","\u305D\u308D\u3046","\u305D\u3093\u304B\u3044","\u305D\u3093\u3051\u3044","\u305D\u3093\u3055\u3099\u3044","\u305D\u3093\u3057\u3064","\u305D\u3093\u305D\u3099\u304F","\u305D\u3093\u3061\u3087\u3046","\u305D\u3099\u3093\u3072\u3099","\u305D\u3099\u3093\u3075\u3099\u3093","\u305D\u3093\u307F\u3093","\u305F\u3042\u3044","\u305F\u3044\u3044\u3093","\u305F\u3044\u3046\u3093","\u305F\u3044\u3048\u304D","\u305F\u3044\u304A\u3046","\u305F\u3099\u3044\u304B\u3099\u304F","\u305F\u3044\u304D","\u305F\u3044\u304F\u3099\u3046","\u305F\u3044\u3051\u3093","\u305F\u3044\u3053","\u305F\u3044\u3055\u3099\u3044","\u305F\u3099\u3044\u3057\u3099\u3087\u3046\u3075\u3099","\u305F\u3099\u3044\u3059\u304D","\u305F\u3044\u305B\u3064","\u305F\u3044\u305D\u3046","\u305F\u3099\u3044\u305F\u3044","\u305F\u3044\u3061\u3087\u3046","\u305F\u3044\u3066\u3044","\u305F\u3099\u3044\u3068\u3099\u3053\u308D","\u305F\u3044\u306A\u3044","\u305F\u3044\u306D\u3064","\u305F\u3044\u306E\u3046","\u305F\u3044\u306F\u3093","\u305F\u3099\u3044\u3072\u3087\u3046","\u305F\u3044\u3075\u3046","\u305F\u3044\u3078\u3093","\u305F\u3044\u307B","\u305F\u3044\u307E\u3064\u306F\u3099\u306A","\u305F\u3044\u307F\u3093\u304F\u3099","\u305F\u3044\u3080","\u305F\u3044\u3081\u3093","\u305F\u3044\u3084\u304D","\u305F\u3044\u3088\u3046","\u305F\u3044\u3089","\u305F\u3044\u308A\u3087\u304F","\u305F\u3044\u308B","\u305F\u3044\u308F\u3093","\u305F\u3046\u3048","\u305F\u3048\u308B","\u305F\u304A\u3059","\u305F\u304A\u308B","\u305F\u304A\u308C\u308B","\u305F\u304B\u3044","\u305F\u304B\u306D","\u305F\u304D\u3072\u3099","\u305F\u304F\u3055\u3093","\u305F\u3053\u304F","\u305F\u3053\u3084\u304D","\u305F\u3055\u3044","\u305F\u3057\u3055\u3099\u3093","\u305F\u3099\u3057\u3099\u3083\u308C","\u305F\u3059\u3051\u308B","\u305F\u3059\u3099\u3055\u308F\u308B","\u305F\u305D\u304B\u3099\u308C","\u305F\u305F\u304B\u3046","\u305F\u305F\u304F","\u305F\u305F\u3099\u3057\u3044","\u305F\u305F\u307F","\u305F\u3061\u306F\u3099\u306A","\u305F\u3099\u3063\u304B\u3044","\u305F\u3099\u3063\u304D\u3083\u304F","\u305F\u3099\u3063\u3053","\u305F\u3099\u3063\u3057\u3085\u3064","\u305F\u3099\u3063\u305F\u3044","\u305F\u3066\u308B","\u305F\u3068\u3048\u308B","\u305F\u306A\u306F\u3099\u305F","\u305F\u306B\u3093","\u305F\u306C\u304D","\u305F\u306E\u3057\u307F","\u305F\u306F\u3064","\u305F\u3075\u3099\u3093","\u305F\u3078\u3099\u308B","\u305F\u307B\u3099\u3046","\u305F\u307E\u3053\u3099","\u305F\u307E\u308B","\u305F\u3099\u3080\u308B","\u305F\u3081\u3044\u304D","\u305F\u3081\u3059","\u305F\u3081\u308B","\u305F\u3082\u3064","\u305F\u3084\u3059\u3044","\u305F\u3088\u308B","\u305F\u3089\u3059","\u305F\u308A\u304D\u307B\u3093\u304B\u3099\u3093","\u305F\u308A\u3087\u3046","\u305F\u308A\u308B","\u305F\u308B\u3068","\u305F\u308C\u308B","\u305F\u308C\u3093\u3068","\u305F\u308D\u3063\u3068","\u305F\u308F\u3080\u308C\u308B","\u305F\u3099\u3093\u3042\u3064","\u305F\u3093\u3044","\u305F\u3093\u304A\u3093","\u305F\u3093\u304B","\u305F\u3093\u304D","\u305F\u3093\u3051\u3093","\u305F\u3093\u3053\u3099","\u305F\u3093\u3055\u3093","\u305F\u3093\u3057\u3099\u3087\u3046\u3072\u3099","\u305F\u3099\u3093\u305B\u3044","\u305F\u3093\u305D\u304F","\u305F\u3093\u305F\u3044","\u305F\u3099\u3093\u3061","\u305F\u3093\u3066\u3044","\u305F\u3093\u3068\u3046","\u305F\u3099\u3093\u306A","\u305F\u3093\u306B\u3093","\u305F\u3099\u3093\u306D\u3064","\u305F\u3093\u306E\u3046","\u305F\u3093\u3072\u309A\u3093","\u305F\u3099\u3093\u307B\u3099\u3046","\u305F\u3093\u307E\u3064","\u305F\u3093\u3081\u3044","\u305F\u3099\u3093\u308C\u3064","\u305F\u3099\u3093\u308D","\u305F\u3099\u3093\u308F","\u3061\u3042\u3044","\u3061\u3042\u3093","\u3061\u3044\u304D","\u3061\u3044\u3055\u3044","\u3061\u3048\u3093","\u3061\u304B\u3044","\u3061\u304B\u3089","\u3061\u304D\u3085\u3046","\u3061\u304D\u3093","\u3061\u3051\u3044\u3059\u3099","\u3061\u3051\u3093","\u3061\u3053\u304F","\u3061\u3055\u3044","\u3061\u3057\u304D","\u3061\u3057\u308A\u3087\u3046","\u3061\u305B\u3044","\u3061\u305D\u3046","\u3061\u305F\u3044","\u3061\u305F\u3093","\u3061\u3061\u304A\u3084","\u3061\u3064\u3057\u3099\u3087","\u3061\u3066\u304D","\u3061\u3066\u3093","\u3061\u306C\u304D","\u3061\u306C\u308A","\u3061\u306E\u3046","\u3061\u3072\u3087\u3046","\u3061\u3078\u3044\u305B\u3093","\u3061\u307B\u3046","\u3061\u307E\u305F","\u3061\u307F\u3064","\u3061\u307F\u3068\u3099\u308D","\u3061\u3081\u3044\u3068\u3099","\u3061\u3083\u3093\u3053\u306A\u3078\u3099","\u3061\u3085\u3046\u3044","\u3061\u3086\u308A\u3087\u304F","\u3061\u3087\u3046\u3057","\u3061\u3087\u3055\u304F\u3051\u3093","\u3061\u3089\u3057","\u3061\u3089\u307F","\u3061\u308A\u304B\u3099\u307F","\u3061\u308A\u3087\u3046","\u3061\u308B\u3068\u3099","\u3061\u308F\u308F","\u3061\u3093\u305F\u3044","\u3061\u3093\u3082\u304F","\u3064\u3044\u304B","\u3064\u3044\u305F\u3061","\u3064\u3046\u304B","\u3064\u3046\u3057\u3099\u3087\u3046","\u3064\u3046\u306F\u3093","\u3064\u3046\u308F","\u3064\u304B\u3046","\u3064\u304B\u308C\u308B","\u3064\u304F\u306D","\u3064\u304F\u308B","\u3064\u3051\u306D","\u3064\u3051\u308B","\u3064\u3053\u3099\u3046","\u3064\u305F\u3048\u308B","\u3064\u3064\u3099\u304F","\u3064\u3064\u3057\u3099","\u3064\u3064\u3080","\u3064\u3068\u3081\u308B","\u3064\u306A\u304B\u3099\u308B","\u3064\u306A\u307F","\u3064\u306D\u3064\u3099\u306D","\u3064\u306E\u308B","\u3064\u3075\u3099\u3059","\u3064\u307E\u3089\u306A\u3044","\u3064\u307E\u308B","\u3064\u307F\u304D","\u3064\u3081\u305F\u3044","\u3064\u3082\u308A","\u3064\u3082\u308B","\u3064\u3088\u3044","\u3064\u308B\u307B\u3099","\u3064\u308B\u307F\u304F","\u3064\u308F\u3082\u306E","\u3064\u308F\u308A","\u3066\u3042\u3057","\u3066\u3042\u3066","\u3066\u3042\u307F","\u3066\u3044\u304A\u3093","\u3066\u3044\u304B","\u3066\u3044\u304D","\u3066\u3044\u3051\u3044","\u3066\u3044\u3053\u304F","\u3066\u3044\u3055\u3064","\u3066\u3044\u3057","\u3066\u3044\u305B\u3044","\u3066\u3044\u305F\u3044","\u3066\u3044\u3068\u3099","\u3066\u3044\u306D\u3044","\u3066\u3044\u3072\u3087\u3046","\u3066\u3044\u3078\u3093","\u3066\u3044\u307B\u3099\u3046","\u3066\u3046\u3061","\u3066\u304A\u304F\u308C","\u3066\u304D\u3068\u3046","\u3066\u304F\u3072\u3099","\u3066\u3099\u3053\u307B\u3099\u3053","\u3066\u3055\u304D\u3099\u3087\u3046","\u3066\u3055\u3051\u3099","\u3066\u3059\u308A","\u3066\u305D\u3046","\u3066\u3061\u304B\u3099\u3044","\u3066\u3061\u3087\u3046","\u3066\u3064\u304B\u3099\u304F","\u3066\u3064\u3064\u3099\u304D","\u3066\u3099\u3063\u306F\u309A","\u3066\u3064\u307B\u3099\u3046","\u3066\u3064\u3084","\u3066\u3099\u306C\u304B\u3048","\u3066\u306C\u304D","\u3066\u306C\u304F\u3099\u3044","\u3066\u306E\u3072\u3089","\u3066\u306F\u3044","\u3066\u3075\u3099\u304F\u308D","\u3066\u3075\u305F\u3099","\u3066\u307B\u3068\u3099\u304D","\u3066\u307B\u3093","\u3066\u307E\u3048","\u3066\u307E\u304D\u3059\u3099\u3057","\u3066\u307F\u3057\u3099\u304B","\u3066\u307F\u3084\u3051\u3099","\u3066\u3089\u3059","\u3066\u308C\u3072\u3099","\u3066\u308F\u3051","\u3066\u308F\u305F\u3057","\u3066\u3099\u3093\u3042\u3064","\u3066\u3093\u3044\u3093","\u3066\u3093\u304B\u3044","\u3066\u3093\u304D","\u3066\u3093\u304F\u3099","\u3066\u3093\u3051\u3093","\u3066\u3093\u3053\u3099\u304F","\u3066\u3093\u3055\u3044","\u3066\u3093\u3057","\u3066\u3093\u3059\u3046","\u3066\u3099\u3093\u3061","\u3066\u3093\u3066\u304D","\u3066\u3093\u3068\u3046","\u3066\u3093\u306A\u3044","\u3066\u3093\u3075\u309A\u3089","\u3066\u3093\u307B\u3099\u3046\u305F\u3099\u3044","\u3066\u3093\u3081\u3064","\u3066\u3093\u3089\u3093\u304B\u3044","\u3066\u3099\u3093\u308A\u3087\u304F","\u3066\u3099\u3093\u308F","\u3068\u3099\u3042\u3044","\u3068\u3044\u308C","\u3068\u3099\u3046\u304B\u3093","\u3068\u3046\u304D\u3085\u3046","\u3068\u3099\u3046\u304F\u3099","\u3068\u3046\u3057","\u3068\u3046\u3080\u304D\u3099","\u3068\u304A\u3044","\u3068\u304A\u304B","\u3068\u304A\u304F","\u3068\u304A\u3059","\u3068\u304A\u308B","\u3068\u304B\u3044","\u3068\u304B\u3059","\u3068\u304D\u304A\u308A","\u3068\u304D\u3068\u3099\u304D","\u3068\u304F\u3044","\u3068\u304F\u3057\u3085\u3046","\u3068\u304F\u3066\u3093","\u3068\u304F\u306B","\u3068\u304F\u3078\u3099\u3064","\u3068\u3051\u3044","\u3068\u3051\u308B","\u3068\u3053\u3084","\u3068\u3055\u304B","\u3068\u3057\u3087\u304B\u3093","\u3068\u305D\u3046","\u3068\u305F\u3093","\u3068\u3061\u3085\u3046","\u3068\u3063\u304D\u3085\u3046","\u3068\u3063\u304F\u3093","\u3068\u3064\u305B\u3099\u3093","\u3068\u3064\u306B\u3085\u3046","\u3068\u3068\u3099\u3051\u308B","\u3068\u3068\u306E\u3048\u308B","\u3068\u306A\u3044","\u3068\u306A\u3048\u308B","\u3068\u306A\u308A","\u3068\u306E\u3055\u307E","\u3068\u306F\u3099\u3059","\u3068\u3099\u3075\u3099\u304B\u3099\u308F","\u3068\u307B\u3046","\u3068\u307E\u308B","\u3068\u3081\u308B","\u3068\u3082\u305F\u3099\u3061","\u3068\u3082\u308B","\u3068\u3099\u3088\u3046\u3072\u3099","\u3068\u3089\u3048\u308B","\u3068\u3093\u304B\u3064","\u3068\u3099\u3093\u3075\u3099\u308A","\u306A\u3044\u304B\u304F","\u306A\u3044\u3053\u3046","\u306A\u3044\u3057\u3087","\u306A\u3044\u3059","\u306A\u3044\u305B\u3093","\u306A\u3044\u305D\u3046","\u306A\u304A\u3059","\u306A\u304B\u3099\u3044","\u306A\u304F\u3059","\u306A\u3051\u3099\u308B","\u306A\u3053\u3046\u3068\u3099","\u306A\u3055\u3051","\u306A\u305F\u3066\u3099\u3053\u3053","\u306A\u3063\u3068\u3046","\u306A\u3064\u3084\u3059\u307F","\u306A\u306A\u304A\u3057","\u306A\u306B\u3053\u3099\u3068","\u306A\u306B\u3082\u306E","\u306A\u306B\u308F","\u306A\u306E\u304B","\u306A\u3075\u305F\u3099","\u306A\u307E\u3044\u304D","\u306A\u307E\u3048","\u306A\u307E\u307F","\u306A\u307F\u305F\u3099","\u306A\u3081\u3089\u304B","\u306A\u3081\u308B","\u306A\u3084\u3080","\u306A\u3089\u3046","\u306A\u3089\u3072\u3099","\u306A\u3089\u3075\u3099","\u306A\u308C\u308B","\u306A\u308F\u3068\u3072\u3099","\u306A\u308F\u306F\u3099\u308A","\u306B\u3042\u3046","\u306B\u3044\u304B\u3099\u305F","\u306B\u3046\u3051","\u306B\u304A\u3044","\u306B\u304B\u3044","\u306B\u304B\u3099\u3066","\u306B\u304D\u3072\u3099","\u306B\u304F\u3057\u307F","\u306B\u304F\u307E\u3093","\u306B\u3051\u3099\u308B","\u306B\u3055\u3093\u304B\u305F\u3093\u305D","\u306B\u3057\u304D","\u306B\u305B\u3082\u306E","\u306B\u3061\u3057\u3099\u3087\u3046","\u306B\u3061\u3088\u3046\u3072\u3099","\u306B\u3063\u304B","\u306B\u3063\u304D","\u306B\u3063\u3051\u3044","\u306B\u3063\u3053\u3046","\u306B\u3063\u3055\u3093","\u306B\u3063\u3057\u3087\u304F","\u306B\u3063\u3059\u3046","\u306B\u3063\u305B\u304D","\u306B\u3063\u3066\u3044","\u306B\u306A\u3046","\u306B\u307B\u3093","\u306B\u307E\u3081","\u306B\u3082\u3064","\u306B\u3084\u308A","\u306B\u3085\u3046\u3044\u3093","\u306B\u308A\u3093\u3057\u3083","\u306B\u308F\u3068\u308A","\u306B\u3093\u3044","\u306B\u3093\u304B","\u306B\u3093\u304D","\u306B\u3093\u3051\u3099\u3093","\u306B\u3093\u3057\u304D","\u306B\u3093\u3059\u3099\u3046","\u306B\u3093\u305D\u3046","\u306B\u3093\u305F\u3044","\u306B\u3093\u3061","\u306B\u3093\u3066\u3044","\u306B\u3093\u306B\u304F","\u306B\u3093\u3075\u309A","\u306B\u3093\u307E\u308A","\u306B\u3093\u3080","\u306B\u3093\u3081\u3044","\u306B\u3093\u3088\u3046","\u306C\u3044\u304F\u304D\u3099","\u306C\u304B\u3059","\u306C\u304F\u3099\u3044\u3068\u308B","\u306C\u304F\u3099\u3046","\u306C\u304F\u3082\u308A","\u306C\u3059\u3080","\u306C\u307E\u3048\u3072\u3099","\u306C\u3081\u308A","\u306C\u3089\u3059","\u306C\u3093\u3061\u3083\u304F","\u306D\u3042\u3051\u3099","\u306D\u3044\u304D","\u306D\u3044\u308B","\u306D\u3044\u308D","\u306D\u304F\u3099\u305B","\u306D\u304F\u305F\u3044","\u306D\u304F\u3089","\u306D\u3053\u305B\u3099","\u306D\u3053\u3080","\u306D\u3055\u3051\u3099","\u306D\u3059\u3053\u3099\u3059","\u306D\u305D\u3078\u3099\u308B","\u306D\u305F\u3099\u3093","\u306D\u3064\u3044","\u306D\u3063\u3057\u3093","\u306D\u3064\u305D\u3099\u3046","\u306D\u3063\u305F\u3044\u304D\u3099\u3087","\u306D\u3075\u3099\u305D\u304F","\u306D\u3075\u305F\u3099","\u306D\u307B\u3099\u3046","\u306D\u307B\u308A\u306F\u307B\u308A","\u306D\u307E\u304D","\u306D\u307E\u308F\u3057","\u306D\u307F\u307F","\u306D\u3080\u3044","\u306D\u3080\u305F\u3044","\u306D\u3082\u3068","\u306D\u3089\u3046","\u306D\u308F\u3055\u3099","\u306D\u3093\u3044\u308A","\u306D\u3093\u304A\u3057","\u306D\u3093\u304B\u3093","\u306D\u3093\u304D\u3093","\u306D\u3093\u304F\u3099","\u306D\u3093\u3055\u3099","\u306D\u3093\u3057","\u306D\u3093\u3061\u3083\u304F","\u306D\u3093\u3068\u3099","\u306D\u3093\u3072\u309A","\u306D\u3093\u3075\u3099\u3064","\u306D\u3093\u307E\u3064","\u306D\u3093\u308A\u3087\u3046","\u306D\u3093\u308C\u3044","\u306E\u3044\u3059\u3099","\u306E\u304A\u3064\u3099\u307E","\u306E\u304B\u3099\u3059","\u306E\u304D\u306A\u307F","\u306E\u3053\u304D\u3099\u308A","\u306E\u3053\u3059","\u306E\u3053\u308B","\u306E\u305B\u308B","\u306E\u305D\u3099\u304F","\u306E\u305D\u3099\u3080","\u306E\u305F\u307E\u3046","\u306E\u3061\u307B\u3068\u3099","\u306E\u3063\u304F","\u306E\u306F\u3099\u3059","\u306E\u306F\u3089","\u306E\u3078\u3099\u308B","\u306E\u307B\u3099\u308B","\u306E\u307F\u3082\u306E","\u306E\u3084\u307E","\u306E\u3089\u3044\u306C","\u306E\u3089\u306D\u3053","\u306E\u308A\u3082\u306E","\u306E\u308A\u3086\u304D","\u306E\u308C\u3093","\u306E\u3093\u304D","\u306F\u3099\u3042\u3044","\u306F\u3042\u304F","\u306F\u3099\u3042\u3055\u3093","\u306F\u3099\u3044\u304B","\u306F\u3099\u3044\u304F","\u306F\u3044\u3051\u3093","\u306F\u3044\u3053\u3099","\u306F\u3044\u3057\u3093","\u306F\u3044\u3059\u3044","\u306F\u3044\u305B\u3093","\u306F\u3044\u305D\u3046","\u306F\u3044\u3061","\u306F\u3099\u3044\u306F\u3099\u3044","\u306F\u3044\u308C\u3064","\u306F\u3048\u308B","\u306F\u304A\u308B","\u306F\u304B\u3044","\u306F\u3099\u304B\u308A","\u306F\u304B\u308B","\u306F\u304F\u3057\u3085","\u306F\u3051\u3093","\u306F\u3053\u3075\u3099","\u306F\u3055\u307F","\u306F\u3055\u3093","\u306F\u3057\u3053\u3099","\u306F\u3099\u3057\u3087","\u306F\u3057\u308B","\u306F\u305B\u308B","\u306F\u309A\u305D\u3053\u3093","\u306F\u305D\u3093","\u306F\u305F\u3093","\u306F\u3061\u307F\u3064","\u306F\u3064\u304A\u3093","\u306F\u3063\u304B\u304F","\u306F\u3064\u3099\u304D","\u306F\u3063\u304D\u308A","\u306F\u3063\u304F\u3064","\u306F\u3063\u3051\u3093","\u306F\u3063\u3053\u3046","\u306F\u3063\u3055\u3093","\u306F\u3063\u3057\u3093","\u306F\u3063\u305F\u3064","\u306F\u3063\u3061\u3085\u3046","\u306F\u3063\u3066\u3093","\u306F\u3063\u3072\u309A\u3087\u3046","\u306F\u3063\u307B\u309A\u3046","\u306F\u306A\u3059","\u306F\u306A\u3072\u3099","\u306F\u306B\u304B\u3080","\u306F\u3075\u3099\u3089\u3057","\u306F\u307F\u304B\u3099\u304D","\u306F\u3080\u304B\u3046","\u306F\u3081\u3064","\u306F\u3084\u3044","\u306F\u3084\u3057","\u306F\u3089\u3046","\u306F\u308D\u3046\u3043\u3093","\u306F\u308F\u3044","\u306F\u3093\u3044","\u306F\u3093\u3048\u3044","\u306F\u3093\u304A\u3093","\u306F\u3093\u304B\u304F","\u306F\u3093\u304D\u3087\u3046","\u306F\u3099\u3093\u304F\u3099\u307F","\u306F\u3093\u3053","\u306F\u3093\u3057\u3083","\u306F\u3093\u3059\u3046","\u306F\u3093\u305F\u3099\u3093","\u306F\u309A\u3093\u3061","\u306F\u309A\u3093\u3064","\u306F\u3093\u3066\u3044","\u306F\u3093\u3068\u3057","\u306F\u3093\u306E\u3046","\u306F\u3093\u306F\u309A","\u306F\u3093\u3075\u3099\u3093","\u306F\u3093\u3078\u309A\u3093","\u306F\u3093\u307B\u3099\u3046\u304D","\u306F\u3093\u3081\u3044","\u306F\u3093\u3089\u3093","\u306F\u3093\u308D\u3093","\u3072\u3044\u304D","\u3072\u3046\u3093","\u3072\u3048\u308B","\u3072\u304B\u304F","\u3072\u304B\u308A","\u3072\u304B\u308B","\u3072\u304B\u3093","\u3072\u304F\u3044","\u3072\u3051\u3064","\u3072\u3053\u3046\u304D","\u3072\u3053\u304F","\u3072\u3055\u3044","\u3072\u3055\u3057\u3075\u3099\u308A","\u3072\u3055\u3093","\u3072\u3099\u3057\u3099\u3085\u3064\u304B\u3093","\u3072\u3057\u3087","\u3072\u305D\u304B","\u3072\u305D\u3080","\u3072\u305F\u3080\u304D","\u3072\u305F\u3099\u308A","\u3072\u305F\u308B","\u3072\u3064\u304D\u3099","\u3072\u3063\u3053\u3057","\u3072\u3063\u3057","\u3072\u3064\u3057\u3099\u3085\u3072\u3093","\u3072\u3063\u3059","\u3072\u3064\u305B\u3099\u3093","\u3072\u309A\u3063\u305F\u308A","\u3072\u309A\u3063\u3061\u308A","\u3072\u3064\u3088\u3046","\u3072\u3066\u3044","\u3072\u3068\u3053\u3099\u307F","\u3072\u306A\u307E\u3064\u308A","\u3072\u306A\u3093","\u3072\u306D\u308B","\u3072\u306F\u3093","\u3072\u3072\u3099\u304F","\u3072\u3072\u3087\u3046","\u3072\u307B\u3046","\u3072\u307E\u308F\u308A","\u3072\u307E\u3093","\u3072\u307F\u3064","\u3072\u3081\u3044","\u3072\u3081\u3057\u3099\u3057","\u3072\u3084\u3051","\u3072\u3084\u3059","\u3072\u3088\u3046","\u3072\u3099\u3087\u3046\u304D","\u3072\u3089\u304B\u3099\u306A","\u3072\u3089\u304F","\u3072\u308A\u3064","\u3072\u308A\u3087\u3046","\u3072\u308B\u307E","\u3072\u308B\u3084\u3059\u307F","\u3072\u308C\u3044","\u3072\u308D\u3044","\u3072\u308D\u3046","\u3072\u308D\u304D","\u3072\u308D\u3086\u304D","\u3072\u3093\u304B\u304F","\u3072\u3093\u3051\u3064","\u3072\u3093\u3053\u3093","\u3072\u3093\u3057\u3085","\u3072\u3093\u305D\u3046","\u3072\u309A\u3093\u3061","\u3072\u3093\u306F\u309A\u3093","\u3072\u3099\u3093\u307B\u3099\u3046","\u3075\u3042\u3093","\u3075\u3044\u3046\u3061","\u3075\u3046\u3051\u3044","\u3075\u3046\u305B\u3093","\u3075\u309A\u3046\u305F\u308D\u3046","\u3075\u3046\u3068\u3046","\u3075\u3046\u3075","\u3075\u3048\u308B","\u3075\u304A\u3093","\u3075\u304B\u3044","\u3075\u304D\u3093","\u3075\u304F\u3055\u3099\u3064","\u3075\u304F\u3075\u3099\u304F\u308D","\u3075\u3053\u3046","\u3075\u3055\u3044","\u3075\u3057\u304D\u3099","\u3075\u3057\u3099\u307F","\u3075\u3059\u307E","\u3075\u305B\u3044","\u3075\u305B\u304F\u3099","\u3075\u305D\u304F","\u3075\u3099\u305F\u306B\u304F","\u3075\u305F\u3093","\u3075\u3061\u3087\u3046","\u3075\u3064\u3046","\u3075\u3064\u304B","\u3075\u3063\u304B\u3064","\u3075\u3063\u304D","\u3075\u3063\u3053\u304F","\u3075\u3099\u3068\u3099\u3046","\u3075\u3068\u308B","\u3075\u3068\u3093","\u3075\u306E\u3046","\u3075\u306F\u3044","\u3075\u3072\u3087\u3046","\u3075\u3078\u3093","\u3075\u307E\u3093","\u3075\u307F\u3093","\u3075\u3081\u3064","\u3075\u3081\u3093","\u3075\u3088\u3046","\u3075\u308A\u3053","\u3075\u308A\u308B","\u3075\u308B\u3044","\u3075\u3093\u3044\u304D","\u3075\u3099\u3093\u304B\u3099\u304F","\u3075\u3099\u3093\u304F\u3099","\u3075\u3093\u3057\u3064","\u3075\u3099\u3093\u305B\u304D","\u3075\u3093\u305D\u3046","\u3075\u3099\u3093\u307B\u309A\u3046","\u3078\u3044\u3042\u3093","\u3078\u3044\u304A\u3093","\u3078\u3044\u304B\u3099\u3044","\u3078\u3044\u304D","\u3078\u3044\u3051\u3099\u3093","\u3078\u3044\u3053\u3046","\u3078\u3044\u3055","\u3078\u3044\u3057\u3083","\u3078\u3044\u305B\u3064","\u3078\u3044\u305D","\u3078\u3044\u305F\u304F","\u3078\u3044\u3066\u3093","\u3078\u3044\u306D\u3064","\u3078\u3044\u308F","\u3078\u304D\u304B\u3099","\u3078\u3053\u3080","\u3078\u3099\u306B\u3044\u308D","\u3078\u3099\u306B\u3057\u3087\u3046\u304B\u3099","\u3078\u3089\u3059","\u3078\u3093\u304B\u3093","\u3078\u3099\u3093\u304D\u3087\u3046","\u3078\u3099\u3093\u3053\u3099\u3057","\u3078\u3093\u3055\u3044","\u3078\u3093\u305F\u3044","\u3078\u3099\u3093\u308A","\u307B\u3042\u3093","\u307B\u3044\u304F","\u307B\u3099\u3046\u304D\u3099\u3087","\u307B\u3046\u3053\u304F","\u307B\u3046\u305D\u3046","\u307B\u3046\u307B\u3046","\u307B\u3046\u3082\u3093","\u307B\u3046\u308A\u3064","\u307B\u3048\u308B","\u307B\u304A\u3093","\u307B\u304B\u3093","\u307B\u304D\u3087\u3046","\u307B\u3099\u304D\u3093","\u307B\u304F\u308D","\u307B\u3051\u3064","\u307B\u3051\u3093","\u307B\u3053\u3046","\u307B\u3053\u308B","\u307B\u3057\u3044","\u307B\u3057\u3064","\u307B\u3057\u3085","\u307B\u3057\u3087\u3046","\u307B\u305B\u3044","\u307B\u305D\u3044","\u307B\u305D\u304F","\u307B\u305F\u3066","\u307B\u305F\u308B","\u307B\u309A\u3061\u3075\u3099\u304F\u308D","\u307B\u3063\u304D\u3087\u304F","\u307B\u3063\u3055","\u307B\u3063\u305F\u3093","\u307B\u3068\u3093\u3068\u3099","\u307B\u3081\u308B","\u307B\u3093\u3044","\u307B\u3093\u304D","\u307B\u3093\u3051","\u307B\u3093\u3057\u3064","\u307B\u3093\u3084\u304F","\u307E\u3044\u306B\u3061","\u307E\u304B\u3044","\u307E\u304B\u305B\u308B","\u307E\u304B\u3099\u308B","\u307E\u3051\u308B","\u307E\u3053\u3068","\u307E\u3055\u3064","\u307E\u3057\u3099\u3081","\u307E\u3059\u304F","\u307E\u305B\u3099\u308B","\u307E\u3064\u308A","\u307E\u3068\u3081","\u307E\u306A\u3075\u3099","\u307E\u306C\u3051","\u307E\u306D\u304F","\u307E\u307B\u3046","\u307E\u3082\u308B","\u307E\u3086\u3051\u3099","\u307E\u3088\u3046","\u307E\u308D\u3084\u304B","\u307E\u308F\u3059","\u307E\u308F\u308A","\u307E\u308F\u308B","\u307E\u3093\u304B\u3099","\u307E\u3093\u304D\u3064","\u307E\u3093\u305D\u3099\u304F","\u307E\u3093\u306A\u304B","\u307F\u3044\u3089","\u307F\u3046\u3061","\u307F\u3048\u308B","\u307F\u304B\u3099\u304F","\u307F\u304B\u305F","\u307F\u304B\u3093","\u307F\u3051\u3093","\u307F\u3053\u3093","\u307F\u3057\u3099\u304B\u3044","\u307F\u3059\u3044","\u307F\u3059\u3048\u308B","\u307F\u305B\u308B","\u307F\u3063\u304B","\u307F\u3064\u304B\u308B","\u307F\u3064\u3051\u308B","\u307F\u3066\u3044","\u307F\u3068\u3081\u308B","\u307F\u306A\u3068","\u307F\u306A\u307F\u304B\u3055\u3044","\u307F\u306D\u3089\u308B","\u307F\u306E\u3046","\u307F\u306E\u304B\u3099\u3059","\u307F\u307B\u3093","\u307F\u3082\u3068","\u307F\u3084\u3051\u3099","\u307F\u3089\u3044","\u307F\u308A\u3087\u304F","\u307F\u308F\u304F","\u307F\u3093\u304B","\u307F\u3093\u305D\u3099\u304F","\u3080\u3044\u304B","\u3080\u3048\u304D","\u3080\u3048\u3093","\u3080\u304B\u3044","\u3080\u304B\u3046","\u3080\u304B\u3048","\u3080\u304B\u3057","\u3080\u304D\u3099\u3061\u3083","\u3080\u3051\u308B","\u3080\u3051\u3099\u3093","\u3080\u3055\u307B\u3099\u308B","\u3080\u3057\u3042\u3064\u3044","\u3080\u3057\u306F\u3099","\u3080\u3057\u3099\u3085\u3093","\u3080\u3057\u308D","\u3080\u3059\u3046","\u3080\u3059\u3053","\u3080\u3059\u3075\u3099","\u3080\u3059\u3081","\u3080\u305B\u308B","\u3080\u305B\u3093","\u3080\u3061\u3085\u3046","\u3080\u306A\u3057\u3044","\u3080\u306E\u3046","\u3080\u3084\u307F","\u3080\u3088\u3046","\u3080\u3089\u3055\u304D","\u3080\u308A\u3087\u3046","\u3080\u308D\u3093","\u3081\u3044\u3042\u3093","\u3081\u3044\u3046\u3093","\u3081\u3044\u3048\u3093","\u3081\u3044\u304B\u304F","\u3081\u3044\u304D\u3087\u304F","\u3081\u3044\u3055\u3044","\u3081\u3044\u3057","\u3081\u3044\u305D\u3046","\u3081\u3044\u3075\u3099\u3064","\u3081\u3044\u308C\u3044","\u3081\u3044\u308F\u304F","\u3081\u304F\u3099\u307E\u308C\u308B","\u3081\u3055\u3099\u3059","\u3081\u3057\u305F","\u3081\u3059\u3099\u3089\u3057\u3044","\u3081\u305F\u3099\u3064","\u3081\u307E\u3044","\u3081\u3084\u3059","\u3081\u3093\u304D\u3087","\u3081\u3093\u305B\u304D","\u3081\u3093\u3068\u3099\u3046","\u3082\u3046\u3057\u3042\u3051\u3099\u308B","\u3082\u3046\u3068\u3099\u3046\u3051\u3093","\u3082\u3048\u308B","\u3082\u304F\u3057","\u3082\u304F\u3066\u304D","\u3082\u304F\u3088\u3046\u3072\u3099","\u3082\u3061\u308D\u3093","\u3082\u3068\u3099\u308B","\u3082\u3089\u3046","\u3082\u3093\u304F","\u3082\u3093\u305F\u3099\u3044","\u3084\u304A\u3084","\u3084\u3051\u308B","\u3084\u3055\u3044","\u3084\u3055\u3057\u3044","\u3084\u3059\u3044","\u3084\u3059\u305F\u308D\u3046","\u3084\u3059\u307F","\u3084\u305B\u308B","\u3084\u305D\u3046","\u3084\u305F\u3044","\u3084\u3061\u3093","\u3084\u3063\u3068","\u3084\u3063\u306F\u309A\u308A","\u3084\u3075\u3099\u308B","\u3084\u3081\u308B","\u3084\u3084\u3053\u3057\u3044","\u3084\u3088\u3044","\u3084\u308F\u3089\u304B\u3044","\u3086\u3046\u304D","\u3086\u3046\u3072\u3099\u3093\u304D\u3087\u304F","\u3086\u3046\u3078\u3099","\u3086\u3046\u3081\u3044","\u3086\u3051\u3064","\u3086\u3057\u3085\u3064","\u3086\u305B\u3093","\u3086\u305D\u3046","\u3086\u305F\u304B","\u3086\u3061\u3083\u304F","\u3086\u3066\u3099\u308B","\u3086\u306B\u3085\u3046","\u3086\u3072\u3099\u308F","\u3086\u3089\u3044","\u3086\u308C\u308B","\u3088\u3046\u3044","\u3088\u3046\u304B","\u3088\u3046\u304D\u3085\u3046","\u3088\u3046\u3057\u3099","\u3088\u3046\u3059","\u3088\u3046\u3061\u3048\u3093","\u3088\u304B\u305B\u3099","\u3088\u304B\u3093","\u3088\u304D\u3093","\u3088\u304F\u305B\u3044","\u3088\u304F\u307B\u3099\u3046","\u3088\u3051\u3044","\u3088\u3053\u3099\u308C\u308B","\u3088\u3055\u3093","\u3088\u3057\u3085\u3046","\u3088\u305D\u3046","\u3088\u305D\u304F","\u3088\u3063\u304B","\u3088\u3066\u3044","\u3088\u3068\u3099\u304B\u3099\u308F\u304F","\u3088\u306D\u3064","\u3088\u3084\u304F","\u3088\u3086\u3046","\u3088\u308D\u3053\u3075\u3099","\u3088\u308D\u3057\u3044","\u3089\u3044\u3046","\u3089\u304F\u304B\u3099\u304D","\u3089\u304F\u3053\u3099","\u3089\u304F\u3055\u3064","\u3089\u304F\u305F\u3099","\u3089\u3057\u3093\u306F\u3099\u3093","\u3089\u305B\u3093","\u3089\u305D\u3099\u304F","\u3089\u305F\u3044","\u3089\u3063\u304B","\u3089\u308C\u3064","\u308A\u3048\u304D","\u308A\u304B\u3044","\u308A\u304D\u3055\u304F","\u308A\u304D\u305B\u3064","\u308A\u304F\u304F\u3099\u3093","\u308A\u304F\u3064","\u308A\u3051\u3093","\u308A\u3053\u3046","\u308A\u305B\u3044","\u308A\u305D\u3046","\u308A\u305D\u304F","\u308A\u3066\u3093","\u308A\u306D\u3093","\u308A\u3086\u3046","\u308A\u3085\u3046\u304B\u3099\u304F","\u308A\u3088\u3046","\u308A\u3087\u3046\u308A","\u308A\u3087\u304B\u3093","\u308A\u3087\u304F\u3061\u3083","\u308A\u3087\u3053\u3046","\u308A\u308A\u304F","\u308A\u308C\u304D","\u308A\u308D\u3093","\u308A\u3093\u3053\u3099","\u308B\u3044\u3051\u3044","\u308B\u3044\u3055\u3044","\u308B\u3044\u3057\u3099","\u308B\u3044\u305B\u304D","\u308B\u3059\u306F\u3099\u3093","\u308B\u308A\u304B\u3099\u308F\u3089","\u308C\u3044\u304B\u3093","\u308C\u3044\u304D\u3099","\u308C\u3044\u305B\u3044","\u308C\u3044\u305D\u3099\u3046\u3053","\u308C\u3044\u3068\u3046","\u308C\u3044\u307B\u3099\u3046","\u308C\u304D\u3057","\u308C\u304D\u305F\u3099\u3044","\u308C\u3093\u3042\u3044","\u308C\u3093\u3051\u3044","\u308C\u3093\u3053\u3093","\u308C\u3093\u3055\u3044","\u308C\u3093\u3057\u3085\u3046","\u308C\u3093\u305D\u3099\u304F","\u308C\u3093\u3089\u304F","\u308D\u3046\u304B","\u308D\u3046\u3053\u3099","\u308D\u3046\u3057\u3099\u3093","\u308D\u3046\u305D\u304F","\u308D\u304F\u304B\u3099","\u308D\u3053\u3064","\u308D\u3057\u3099\u3046\u3089","\u308D\u3057\u3085\u3064","\u308D\u305B\u3093","\u308D\u3066\u3093","\u308D\u3081\u3093","\u308D\u308C\u3064","\u308D\u3093\u304D\u3099","\u308D\u3093\u306F\u309A","\u308D\u3093\u3075\u3099\u3093","\u308D\u3093\u308A","\u308F\u304B\u3059","\u308F\u304B\u3081","\u308F\u304B\u3084\u307E","\u308F\u304B\u308C\u308B","\u308F\u3057\u3064","\u308F\u3057\u3099\u307E\u3057","\u308F\u3059\u308C\u3082\u306E","\u308F\u3089\u3046","\u308F\u308C\u308B"]'), af = JSON.parse('["abacate","abaixo","abalar","abater","abduzir","abelha","aberto","abismo","abotoar","abranger","abreviar","abrigar","abrupto","absinto","absoluto","absurdo","abutre","acabado","acalmar","acampar","acanhar","acaso","aceitar","acelerar","acenar","acervo","acessar","acetona","achatar","acidez","acima","acionado","acirrar","aclamar","aclive","acolhida","acomodar","acoplar","acordar","acumular","acusador","adaptar","adega","adentro","adepto","adequar","aderente","adesivo","adeus","adiante","aditivo","adjetivo","adjunto","admirar","adorar","adquirir","adubo","adverso","advogado","aeronave","afastar","aferir","afetivo","afinador","afivelar","aflito","afluente","afrontar","agachar","agarrar","agasalho","agenciar","agilizar","agiota","agitado","agora","agradar","agreste","agrupar","aguardar","agulha","ajoelhar","ajudar","ajustar","alameda","alarme","alastrar","alavanca","albergue","albino","alcatra","aldeia","alecrim","alegria","alertar","alface","alfinete","algum","alheio","aliar","alicate","alienar","alinhar","aliviar","almofada","alocar","alpiste","alterar","altitude","alucinar","alugar","aluno","alusivo","alvo","amaciar","amador","amarelo","amassar","ambas","ambiente","ameixa","amenizar","amido","amistoso","amizade","amolador","amontoar","amoroso","amostra","amparar","ampliar","ampola","anagrama","analisar","anarquia","anatomia","andaime","anel","anexo","angular","animar","anjo","anomalia","anotado","ansioso","anterior","anuidade","anunciar","anzol","apagador","apalpar","apanhado","apego","apelido","apertada","apesar","apetite","apito","aplauso","aplicada","apoio","apontar","aposta","aprendiz","aprovar","aquecer","arame","aranha","arara","arcada","ardente","areia","arejar","arenito","aresta","argiloso","argola","arma","arquivo","arraial","arrebate","arriscar","arroba","arrumar","arsenal","arterial","artigo","arvoredo","asfaltar","asilado","aspirar","assador","assinar","assoalho","assunto","astral","atacado","atadura","atalho","atarefar","atear","atender","aterro","ateu","atingir","atirador","ativo","atoleiro","atracar","atrevido","atriz","atual","atum","auditor","aumentar","aura","aurora","autismo","autoria","autuar","avaliar","avante","avaria","avental","avesso","aviador","avisar","avulso","axila","azarar","azedo","azeite","azulejo","babar","babosa","bacalhau","bacharel","bacia","bagagem","baiano","bailar","baioneta","bairro","baixista","bajular","baleia","baliza","balsa","banal","bandeira","banho","banir","banquete","barato","barbado","baronesa","barraca","barulho","baseado","bastante","batata","batedor","batida","batom","batucar","baunilha","beber","beijo","beirada","beisebol","beldade","beleza","belga","beliscar","bendito","bengala","benzer","berimbau","berlinda","berro","besouro","bexiga","bezerro","bico","bicudo","bienal","bifocal","bifurcar","bigorna","bilhete","bimestre","bimotor","biologia","biombo","biosfera","bipolar","birrento","biscoito","bisneto","bispo","bissexto","bitola","bizarro","blindado","bloco","bloquear","boato","bobagem","bocado","bocejo","bochecha","boicotar","bolada","boletim","bolha","bolo","bombeiro","bonde","boneco","bonita","borbulha","borda","boreal","borracha","bovino","boxeador","branco","brasa","braveza","breu","briga","brilho","brincar","broa","brochura","bronzear","broto","bruxo","bucha","budismo","bufar","bule","buraco","busca","busto","buzina","cabana","cabelo","cabide","cabo","cabrito","cacau","cacetada","cachorro","cacique","cadastro","cadeado","cafezal","caiaque","caipira","caixote","cajado","caju","calafrio","calcular","caldeira","calibrar","calmante","calota","camada","cambista","camisa","camomila","campanha","camuflar","canavial","cancelar","caneta","canguru","canhoto","canivete","canoa","cansado","cantar","canudo","capacho","capela","capinar","capotar","capricho","captador","capuz","caracol","carbono","cardeal","careca","carimbar","carneiro","carpete","carreira","cartaz","carvalho","casaco","casca","casebre","castelo","casulo","catarata","cativar","caule","causador","cautelar","cavalo","caverna","cebola","cedilha","cegonha","celebrar","celular","cenoura","censo","centeio","cercar","cerrado","certeiro","cerveja","cetim","cevada","chacota","chaleira","chamado","chapada","charme","chatice","chave","chefe","chegada","cheiro","cheque","chicote","chifre","chinelo","chocalho","chover","chumbo","chutar","chuva","cicatriz","ciclone","cidade","cidreira","ciente","cigana","cimento","cinto","cinza","ciranda","circuito","cirurgia","citar","clareza","clero","clicar","clone","clube","coado","coagir","cobaia","cobertor","cobrar","cocada","coelho","coentro","coeso","cogumelo","coibir","coifa","coiote","colar","coleira","colher","colidir","colmeia","colono","coluna","comando","combinar","comentar","comitiva","comover","complexo","comum","concha","condor","conectar","confuso","congelar","conhecer","conjugar","consumir","contrato","convite","cooperar","copeiro","copiador","copo","coquetel","coragem","cordial","corneta","coronha","corporal","correio","cortejo","coruja","corvo","cosseno","costela","cotonete","couro","couve","covil","cozinha","cratera","cravo","creche","credor","creme","crer","crespo","criada","criminal","crioulo","crise","criticar","crosta","crua","cruzeiro","cubano","cueca","cuidado","cujo","culatra","culminar","culpar","cultura","cumprir","cunhado","cupido","curativo","curral","cursar","curto","cuspir","custear","cutelo","damasco","datar","debater","debitar","deboche","debulhar","decalque","decimal","declive","decote","decretar","dedal","dedicado","deduzir","defesa","defumar","degelo","degrau","degustar","deitado","deixar","delator","delegado","delinear","delonga","demanda","demitir","demolido","dentista","depenado","depilar","depois","depressa","depurar","deriva","derramar","desafio","desbotar","descanso","desenho","desfiado","desgaste","desigual","deslize","desmamar","desova","despesa","destaque","desviar","detalhar","detentor","detonar","detrito","deusa","dever","devido","devotado","dezena","diagrama","dialeto","didata","difuso","digitar","dilatado","diluente","diminuir","dinastia","dinheiro","diocese","direto","discreta","disfarce","disparo","disquete","dissipar","distante","ditador","diurno","diverso","divisor","divulgar","dizer","dobrador","dolorido","domador","dominado","donativo","donzela","dormente","dorsal","dosagem","dourado","doutor","drenagem","drible","drogaria","duelar","duende","dueto","duplo","duquesa","durante","duvidoso","eclodir","ecoar","ecologia","edificar","edital","educado","efeito","efetivar","ejetar","elaborar","eleger","eleitor","elenco","elevador","eliminar","elogiar","embargo","embolado","embrulho","embutido","emenda","emergir","emissor","empatia","empenho","empinado","empolgar","emprego","empurrar","emulador","encaixe","encenado","enchente","encontro","endeusar","endossar","enfaixar","enfeite","enfim","engajado","engenho","englobar","engomado","engraxar","enguia","enjoar","enlatar","enquanto","enraizar","enrolado","enrugar","ensaio","enseada","ensino","ensopado","entanto","enteado","entidade","entortar","entrada","entulho","envergar","enviado","envolver","enxame","enxerto","enxofre","enxuto","epiderme","equipar","ereto","erguido","errata","erva","ervilha","esbanjar","esbelto","escama","escola","escrita","escuta","esfinge","esfolar","esfregar","esfumado","esgrima","esmalte","espanto","espelho","espiga","esponja","espreita","espumar","esquerda","estaca","esteira","esticar","estofado","estrela","estudo","esvaziar","etanol","etiqueta","euforia","europeu","evacuar","evaporar","evasivo","eventual","evidente","evoluir","exagero","exalar","examinar","exato","exausto","excesso","excitar","exclamar","executar","exemplo","exibir","exigente","exonerar","expandir","expelir","expirar","explanar","exposto","expresso","expulsar","externo","extinto","extrato","fabricar","fabuloso","faceta","facial","fada","fadiga","faixa","falar","falta","familiar","fandango","fanfarra","fantoche","fardado","farelo","farinha","farofa","farpa","fartura","fatia","fator","favorita","faxina","fazenda","fechado","feijoada","feirante","felino","feminino","fenda","feno","fera","feriado","ferrugem","ferver","festejar","fetal","feudal","fiapo","fibrose","ficar","ficheiro","figurado","fileira","filho","filme","filtrar","firmeza","fisgada","fissura","fita","fivela","fixador","fixo","flacidez","flamingo","flanela","flechada","flora","flutuar","fluxo","focal","focinho","fofocar","fogo","foguete","foice","folgado","folheto","forjar","formiga","forno","forte","fosco","fossa","fragata","fralda","frango","frasco","fraterno","freira","frente","fretar","frieza","friso","fritura","fronha","frustrar","fruteira","fugir","fulano","fuligem","fundar","fungo","funil","furador","furioso","futebol","gabarito","gabinete","gado","gaiato","gaiola","gaivota","galega","galho","galinha","galocha","ganhar","garagem","garfo","gargalo","garimpo","garoupa","garrafa","gasoduto","gasto","gata","gatilho","gaveta","gazela","gelado","geleia","gelo","gemada","gemer","gemido","generoso","gengiva","genial","genoma","genro","geologia","gerador","germinar","gesso","gestor","ginasta","gincana","gingado","girafa","girino","glacial","glicose","global","glorioso","goela","goiaba","golfe","golpear","gordura","gorjeta","gorro","gostoso","goteira","governar","gracejo","gradual","grafite","gralha","grampo","granada","gratuito","graveto","graxa","grego","grelhar","greve","grilo","grisalho","gritaria","grosso","grotesco","grudado","grunhido","gruta","guache","guarani","guaxinim","guerrear","guiar","guincho","guisado","gula","guloso","guru","habitar","harmonia","haste","haver","hectare","herdar","heresia","hesitar","hiato","hibernar","hidratar","hiena","hino","hipismo","hipnose","hipoteca","hoje","holofote","homem","honesto","honrado","hormonal","hospedar","humorado","iate","ideia","idoso","ignorado","igreja","iguana","ileso","ilha","iludido","iluminar","ilustrar","imagem","imediato","imenso","imersivo","iminente","imitador","imortal","impacto","impedir","implante","impor","imprensa","impune","imunizar","inalador","inapto","inativo","incenso","inchar","incidir","incluir","incolor","indeciso","indireto","indutor","ineficaz","inerente","infantil","infestar","infinito","inflamar","informal","infrator","ingerir","inibido","inicial","inimigo","injetar","inocente","inodoro","inovador","inox","inquieto","inscrito","inseto","insistir","inspetor","instalar","insulto","intacto","integral","intimar","intocado","intriga","invasor","inverno","invicto","invocar","iogurte","iraniano","ironizar","irreal","irritado","isca","isento","isolado","isqueiro","italiano","janeiro","jangada","janta","jararaca","jardim","jarro","jasmim","jato","javali","jazida","jejum","joaninha","joelhada","jogador","joia","jornal","jorrar","jovem","juba","judeu","judoca","juiz","julgador","julho","jurado","jurista","juro","justa","labareda","laboral","lacre","lactante","ladrilho","lagarta","lagoa","laje","lamber","lamentar","laminar","lampejo","lanche","lapidar","lapso","laranja","lareira","largura","lasanha","lastro","lateral","latido","lavanda","lavoura","lavrador","laxante","lazer","lealdade","lebre","legado","legendar","legista","leigo","leiloar","leitura","lembrete","leme","lenhador","lentilha","leoa","lesma","leste","letivo","letreiro","levar","leveza","levitar","liberal","libido","liderar","ligar","ligeiro","limitar","limoeiro","limpador","linda","linear","linhagem","liquidez","listagem","lisura","litoral","livro","lixa","lixeira","locador","locutor","lojista","lombo","lona","longe","lontra","lorde","lotado","loteria","loucura","lousa","louvar","luar","lucidez","lucro","luneta","lustre","lutador","luva","macaco","macete","machado","macio","madeira","madrinha","magnata","magreza","maior","mais","malandro","malha","malote","maluco","mamilo","mamoeiro","mamute","manada","mancha","mandato","manequim","manhoso","manivela","manobrar","mansa","manter","manusear","mapeado","maquinar","marcador","maresia","marfim","margem","marinho","marmita","maroto","marquise","marreco","martelo","marujo","mascote","masmorra","massagem","mastigar","matagal","materno","matinal","matutar","maxilar","medalha","medida","medusa","megafone","meiga","melancia","melhor","membro","memorial","menino","menos","mensagem","mental","merecer","mergulho","mesada","mesclar","mesmo","mesquita","mestre","metade","meteoro","metragem","mexer","mexicano","micro","migalha","migrar","milagre","milenar","milhar","mimado","minerar","minhoca","ministro","minoria","miolo","mirante","mirtilo","misturar","mocidade","moderno","modular","moeda","moer","moinho","moita","moldura","moleza","molho","molinete","molusco","montanha","moqueca","morango","morcego","mordomo","morena","mosaico","mosquete","mostarda","motel","motim","moto","motriz","muda","muito","mulata","mulher","multar","mundial","munido","muralha","murcho","muscular","museu","musical","nacional","nadador","naja","namoro","narina","narrado","nascer","nativa","natureza","navalha","navegar","navio","neblina","nebuloso","negativa","negociar","negrito","nervoso","neta","neural","nevasca","nevoeiro","ninar","ninho","nitidez","nivelar","nobreza","noite","noiva","nomear","nominal","nordeste","nortear","notar","noticiar","noturno","novelo","novilho","novo","nublado","nudez","numeral","nupcial","nutrir","nuvem","obcecado","obedecer","objetivo","obrigado","obscuro","obstetra","obter","obturar","ocidente","ocioso","ocorrer","oculista","ocupado","ofegante","ofensiva","oferenda","oficina","ofuscado","ogiva","olaria","oleoso","olhar","oliveira","ombro","omelete","omisso","omitir","ondulado","oneroso","ontem","opcional","operador","oponente","oportuno","oposto","orar","orbitar","ordem","ordinal","orfanato","orgasmo","orgulho","oriental","origem","oriundo","orla","ortodoxo","orvalho","oscilar","ossada","osso","ostentar","otimismo","ousadia","outono","outubro","ouvido","ovelha","ovular","oxidar","oxigenar","pacato","paciente","pacote","pactuar","padaria","padrinho","pagar","pagode","painel","pairar","paisagem","palavra","palestra","palheta","palito","palmada","palpitar","pancada","panela","panfleto","panqueca","pantanal","papagaio","papelada","papiro","parafina","parcial","pardal","parede","partida","pasmo","passado","pastel","patamar","patente","patinar","patrono","paulada","pausar","peculiar","pedalar","pedestre","pediatra","pedra","pegada","peitoral","peixe","pele","pelicano","penca","pendurar","peneira","penhasco","pensador","pente","perceber","perfeito","pergunta","perito","permitir","perna","perplexo","persiana","pertence","peruca","pescado","pesquisa","pessoa","petiscar","piada","picado","piedade","pigmento","pilastra","pilhado","pilotar","pimenta","pincel","pinguim","pinha","pinote","pintar","pioneiro","pipoca","piquete","piranha","pires","pirueta","piscar","pistola","pitanga","pivete","planta","plaqueta","platina","plebeu","plumagem","pluvial","pneu","poda","poeira","poetisa","polegada","policiar","poluente","polvilho","pomar","pomba","ponderar","pontaria","populoso","porta","possuir","postal","pote","poupar","pouso","povoar","praia","prancha","prato","praxe","prece","predador","prefeito","premiar","prensar","preparar","presilha","pretexto","prevenir","prezar","primata","princesa","prisma","privado","processo","produto","profeta","proibido","projeto","prometer","propagar","prosa","protetor","provador","publicar","pudim","pular","pulmonar","pulseira","punhal","punir","pupilo","pureza","puxador","quadra","quantia","quarto","quase","quebrar","queda","queijo","quente","querido","quimono","quina","quiosque","rabanada","rabisco","rachar","racionar","radial","raiar","rainha","raio","raiva","rajada","ralado","ramal","ranger","ranhura","rapadura","rapel","rapidez","raposa","raquete","raridade","rasante","rascunho","rasgar","raspador","rasteira","rasurar","ratazana","ratoeira","realeza","reanimar","reaver","rebaixar","rebelde","rebolar","recado","recente","recheio","recibo","recordar","recrutar","recuar","rede","redimir","redonda","reduzida","reenvio","refinar","refletir","refogar","refresco","refugiar","regalia","regime","regra","reinado","reitor","rejeitar","relativo","remador","remendo","remorso","renovado","reparo","repelir","repleto","repolho","represa","repudiar","requerer","resenha","resfriar","resgatar","residir","resolver","respeito","ressaca","restante","resumir","retalho","reter","retirar","retomada","retratar","revelar","revisor","revolta","riacho","rica","rigidez","rigoroso","rimar","ringue","risada","risco","risonho","robalo","rochedo","rodada","rodeio","rodovia","roedor","roleta","romano","roncar","rosado","roseira","rosto","rota","roteiro","rotina","rotular","rouco","roupa","roxo","rubro","rugido","rugoso","ruivo","rumo","rupestre","russo","sabor","saciar","sacola","sacudir","sadio","safira","saga","sagrada","saibro","salada","saleiro","salgado","saliva","salpicar","salsicha","saltar","salvador","sambar","samurai","sanar","sanfona","sangue","sanidade","sapato","sarda","sargento","sarjeta","saturar","saudade","saxofone","sazonal","secar","secular","seda","sedento","sediado","sedoso","sedutor","segmento","segredo","segundo","seiva","seleto","selvagem","semanal","semente","senador","senhor","sensual","sentado","separado","sereia","seringa","serra","servo","setembro","setor","sigilo","silhueta","silicone","simetria","simpatia","simular","sinal","sincero","singular","sinopse","sintonia","sirene","siri","situado","soberano","sobra","socorro","sogro","soja","solda","soletrar","solteiro","sombrio","sonata","sondar","sonegar","sonhador","sono","soprano","soquete","sorrir","sorteio","sossego","sotaque","soterrar","sovado","sozinho","suavizar","subida","submerso","subsolo","subtrair","sucata","sucesso","suco","sudeste","sufixo","sugador","sugerir","sujeito","sulfato","sumir","suor","superior","suplicar","suposto","suprimir","surdina","surfista","surpresa","surreal","surtir","suspiro","sustento","tabela","tablete","tabuada","tacho","tagarela","talher","talo","talvez","tamanho","tamborim","tampa","tangente","tanto","tapar","tapioca","tardio","tarefa","tarja","tarraxa","tatuagem","taurino","taxativo","taxista","teatral","tecer","tecido","teclado","tedioso","teia","teimar","telefone","telhado","tempero","tenente","tensor","tentar","termal","terno","terreno","tese","tesoura","testado","teto","textura","texugo","tiara","tigela","tijolo","timbrar","timidez","tingido","tinteiro","tiragem","titular","toalha","tocha","tolerar","tolice","tomada","tomilho","tonel","tontura","topete","tora","torcido","torneio","torque","torrada","torto","tostar","touca","toupeira","toxina","trabalho","tracejar","tradutor","trafegar","trajeto","trama","trancar","trapo","traseiro","tratador","travar","treino","tremer","trepidar","trevo","triagem","tribo","triciclo","tridente","trilogia","trindade","triplo","triturar","triunfal","trocar","trombeta","trova","trunfo","truque","tubular","tucano","tudo","tulipa","tupi","turbo","turma","turquesa","tutelar","tutorial","uivar","umbigo","unha","unidade","uniforme","urologia","urso","urtiga","urubu","usado","usina","usufruir","vacina","vadiar","vagaroso","vaidoso","vala","valente","validade","valores","vantagem","vaqueiro","varanda","vareta","varrer","vascular","vasilha","vassoura","vazar","vazio","veado","vedar","vegetar","veicular","veleiro","velhice","veludo","vencedor","vendaval","venerar","ventre","verbal","verdade","vereador","vergonha","vermelho","verniz","versar","vertente","vespa","vestido","vetorial","viaduto","viagem","viajar","viatura","vibrador","videira","vidraria","viela","viga","vigente","vigiar","vigorar","vilarejo","vinco","vinheta","vinil","violeta","virada","virtude","visitar","visto","vitral","viveiro","vizinho","voador","voar","vogal","volante","voleibol","voltagem","volumoso","vontade","vulto","vuvuzela","xadrez","xarope","xeque","xeretar","xerife","xingar","zangado","zarpar","zebu","zelador","zombar","zoologia","zumbido"]'), sf = JSON.parse('["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel","base","basic","basket","battle","beach","bean","beauty","because","become","beef","before","begin","behave","behind","believe","below","belt","bench","benefit","best","betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood","blossom","blouse","blue","blur","blush","board","boat","body","boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm","camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","chat","cheap","check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice","choose","chronic","chuckle","chunk","churn","cigar","cinnamon","circle","citizen","city","civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","come","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool","copper","copy","coral","core","corn","correct","cost","cotton","couch","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater","crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crunch","crush","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash","daughter","dawn","day","deal","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","else","embark","embody","embrace","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","era","erase","erode","erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence","evil","evoke","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire","explain","expose","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm","fashion","fat","fatal","father","fatigue","fault","favorite","feature","february","federal","fee","feed","feel","female","fence","festival","fetch","fever","few","fiber","fiction","field","figure","file","film","filter","final","find","fine","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","flag","flame","flash","flat","flavor","flee","flight","flip","float","flock","floor","flower","fluid","flush","fly","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap","garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge","gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","girl","give","glad","glance","glare","glass","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose","gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape","grass","gravity","great","green","grid","grief","grit","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair","half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat","have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello","helmet","help","hen","hero","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub","huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt","husband","hybrid","ice","icon","idea","identify","idle","ignore","ill","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","inch","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","injury","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","iron","island","isolate","issue","item","ivory","jacket","jaguar","jar","jazz","jealous","jeans","jelly","jewel","job","join","joke","journey","joy","judge","juice","jump","jungle","junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid","kidney","kind","kingdom","kiss","kit","kitchen","kite","kitten","kiwi","knee","knife","knock","know","lab","label","labor","ladder","lady","lake","lamp","language","laptop","large","later","latin","laugh","laundry","lava","law","lawn","lawsuit","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","life","lift","light","like","limb","limit","link","lion","liquid","list","little","live","lizard","load","loan","lobster","local","lock","logic","lonely","long","loop","lottery","loud","lounge","love","loyal","lucky","luggage","lumber","lunar","lunch","luxury","lyrics","machine","mad","magic","magnet","maid","mail","main","major","make","mammal","man","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","marriage","mask","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","meat","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merry","mesh","message","metal","method","middle","midnight","milk","million","mimic","mind","minimum","minor","minute","miracle","mirror","misery","miss","mistake","mix","mixed","mixture","mobile","model","modify","mom","moment","monitor","monkey","monster","month","moon","moral","more","morning","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mule","multiply","muscle","museum","mushroom","music","must","mutual","myself","mystery","myth","naive","name","napkin","narrow","nasty","nation","nature","near","neck","need","negative","neglect","neither","nephew","nerve","nest","net","network","neutral","never","news","next","nice","night","noble","noise","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","oak","obey","object","oblige","obscure","observe","obtain","obvious","occur","ocean","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","one","onion","online","only","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pair","palace","palm","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peace","peanut","pear","peasant","pelican","pen","penalty","pencil","people","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pig","pigeon","pill","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","poverty","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quit","quiz","quote","rabbit","raccoon","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","right","rigid","ring","riot","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","rough","round","route","royal","rubber","rude","rug","rule","run","runway","rural","sad","saddle","sadness","safe","sail","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","scare","scatter","scene","scheme","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","sea","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","shell","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","shop","short","shoulder","shove","shrimp","shrug","shuffle","shy","sibling","sick","side","siege","sight","sign","silent","silk","silly","silver","similar","simple","since","sing","siren","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","skull","slab","slam","sleep","slender","slice","slide","slight","slim","slogan","slot","slow","slush","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sorry","sort","soul","sound","soup","source","south","space","spare","spatial","spawn","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","split","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","such","sudden","suffer","sugar","suggest","suit","summer","sun","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","swear","sweet","swift","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","tail","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","that","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","toe","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","top","topic","topple","torch","tornado","tortoise","toss","total","tourist","toward","tower","town","toy","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","true","truly","trumpet","trust","truth","try","tube","tuition","tumble","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","ugly","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","van","vanish","vapor","various","vast","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","vote","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","way","wealth","weapon","wear","weasel","weather","web","wedding","weekend","weird","welcome","west","wet","whale","what","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","word","work","world","worry","worth","wrap","wreck","wrestle","wrist","write","wrong","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"]');
var Ci;
function ji() {
  if (Ci) return Je;
  Ci = 1, Object.defineProperty(Je, "__esModule", { value: true });
  const e = {};
  Je.wordlists = e;
  let r;
  Je._default = r;
  try {
    Je._default = r = Zl, e.czech = r;
  } catch {
  }
  try {
    Je._default = r = Ql, e.chinese_simplified = r;
  } catch {
  }
  try {
    Je._default = r = $l, e.chinese_traditional = r;
  } catch {
  }
  try {
    Je._default = r = ef, e.korean = r;
  } catch {
  }
  try {
    Je._default = r = rf, e.french = r;
  } catch {
  }
  try {
    Je._default = r = tf, e.italian = r;
  } catch {
  }
  try {
    Je._default = r = nf, e.spanish = r;
  } catch {
  }
  try {
    Je._default = r = of, e.japanese = r, e.JA = r;
  } catch {
  }
  try {
    Je._default = r = af, e.portuguese = r;
  } catch {
  }
  try {
    Je._default = r = sf, e.english = r, e.EN = r;
  } catch {
  }
  return Je;
}
var Ri;
function cf() {
  if (Ri) return er;
  Ri = 1, Object.defineProperty(er, "__esModule", { value: true });
  const e = Ra(), r = Xl(), t = Jl(), n = cr(), a = ji();
  let o = a._default;
  const i = "Invalid mnemonic", s = "Invalid entropy", f = "Invalid mnemonic checksum", g = `A wordlist is required but a default could not be found.
Please pass a 2048 word array explicitly.`;
  function h(k) {
    return (k || "").normalize("NFKD");
  }
  function v(k, C, q) {
    for (; k.length < q; ) k = C + k;
    return k;
  }
  function w(k) {
    return parseInt(k, 2);
  }
  function p(k) {
    return k.map((C) => v(C.toString(2), "0", 8)).join("");
  }
  function m(k) {
    const q = k.length * 8 / 32, B = e.sha256(Uint8Array.from(k));
    return p(Array.from(B)).slice(0, q);
  }
  function x(k) {
    return "mnemonic" + (k || "");
  }
  function j(k, C) {
    const q = Uint8Array.from(le.from(h(k), "utf8")), B = Uint8Array.from(le.from(x(h(C)), "utf8")), F = t.pbkdf2(r.sha512, q, B, { c: 2048, dkLen: 64 });
    return le.from(F);
  }
  er.mnemonicToSeedSync = j;
  function P(k, C) {
    const q = Uint8Array.from(le.from(h(k), "utf8")), B = Uint8Array.from(le.from(x(h(C)), "utf8"));
    return t.pbkdf2Async(r.sha512, q, B, { c: 2048, dkLen: 64 }).then((F) => le.from(F));
  }
  er.mnemonicToSeed = P;
  function S(k, C) {
    if (C = C || o, !C) throw new Error(g);
    const q = h(k).split(" ");
    if (q.length % 3 !== 0) throw new Error(i);
    const B = q.map((z) => {
      const D = C.indexOf(z);
      if (D === -1) throw new Error(i);
      return v(D.toString(2), "0", 11);
    }).join(""), F = Math.floor(B.length / 33) * 32, G = B.slice(0, F), A = B.slice(F), V = G.match(/(.{1,8})/g).map(w);
    if (V.length < 16) throw new Error(s);
    if (V.length > 32) throw new Error(s);
    if (V.length % 4 !== 0) throw new Error(s);
    const L = le.from(V);
    if (m(L) !== A) throw new Error(f);
    return L.toString("hex");
  }
  er.mnemonicToEntropy = S;
  function _(k, C) {
    if (le.isBuffer(k) || (k = le.from(k, "hex")), C = C || o, !C) throw new Error(g);
    if (k.length < 16) throw new TypeError(s);
    if (k.length > 32) throw new TypeError(s);
    if (k.length % 4 !== 0) throw new TypeError(s);
    const q = p(Array.from(k)), B = m(k), A = (q + B).match(/(.{1,11})/g).map((V) => {
      const L = w(V);
      return C[L];
    });
    return C[0] === "\u3042\u3044\u3053\u304F\u3057\u3093" ? A.join("\u3000") : A.join(" ");
  }
  er.entropyToMnemonic = _;
  function M(k, C, q) {
    if (k = k || 128, k % 32 !== 0) throw new TypeError(s);
    return C = C || ((B) => le.from(n.randomBytes(B))), _(C(k / 8), q);
  }
  er.generateMnemonic = M;
  function W(k, C) {
    try {
      S(k, C);
    } catch {
      return false;
    }
    return true;
  }
  er.validateMnemonic = W;
  function U(k) {
    const C = a.wordlists[k];
    if (C) o = C;
    else throw new Error('Could not find wordlist for language "' + k + '"');
  }
  er.setDefaultWordlist = U;
  function R() {
    if (!o) throw new Error("No Default Wordlist set");
    return Object.keys(a.wordlists).filter((k) => k === "JA" || k === "EN" ? false : a.wordlists[k].every((C, q) => C === o[q]))[0];
  }
  er.getDefaultWordlist = R;
  var N = ji();
  return er.wordlists = N.wordlists, er;
}
var Wf = cf(), bn = {}, lt = {}, yn = {}, vn = {}, Ui;
function it() {
  return Ui || (Ui = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: true }), e.notImplemented = e.bitMask = e.utf8ToBytes = e.randomBytes = e.isBytes = e.hexToBytes = e.concatBytes = e.bytesToUtf8 = e.bytesToHex = e.anumber = e.abytes = void 0, e.abool = o, e._abool2 = i, e._abytes2 = s, e.numberToHexUnpadded = f, e.hexToNumber = g, e.bytesToNumberBE = h, e.bytesToNumberLE = v, e.numberToBytesBE = w, e.numberToBytesLE = p, e.numberToVarBytesBE = m, e.ensureBytes = x, e.equalBytes = j, e.copyBytes = P, e.asciiToBytes = S, e.inRange = M, e.aInRange = W, e.bitLen = U, e.bitGet = R, e.bitSet = N, e.createHmacDrbg = C, e.validateObject = B, e.isHash = F, e._validateObject = G, e.memoized = V;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const r = cr();
    var t = cr();
    Object.defineProperty(e, "abytes", { enumerable: true, get: function() {
      return t.abytes;
    } }), Object.defineProperty(e, "anumber", { enumerable: true, get: function() {
      return t.anumber;
    } }), Object.defineProperty(e, "bytesToHex", { enumerable: true, get: function() {
      return t.bytesToHex;
    } }), Object.defineProperty(e, "bytesToUtf8", { enumerable: true, get: function() {
      return t.bytesToUtf8;
    } }), Object.defineProperty(e, "concatBytes", { enumerable: true, get: function() {
      return t.concatBytes;
    } }), Object.defineProperty(e, "hexToBytes", { enumerable: true, get: function() {
      return t.hexToBytes;
    } }), Object.defineProperty(e, "isBytes", { enumerable: true, get: function() {
      return t.isBytes;
    } }), Object.defineProperty(e, "randomBytes", { enumerable: true, get: function() {
      return t.randomBytes;
    } }), Object.defineProperty(e, "utf8ToBytes", { enumerable: true, get: function() {
      return t.utf8ToBytes;
    } });
    const n = BigInt(0), a = BigInt(1);
    function o(L, y) {
      if (typeof y != "boolean") throw new Error(L + " boolean expected, got " + y);
    }
    function i(L, y = "") {
      if (typeof L != "boolean") {
        const z = y && `"${y}"`;
        throw new Error(z + "expected boolean, got type=" + typeof L);
      }
      return L;
    }
    function s(L, y, z = "") {
      const D = (0, r.isBytes)(L), I = L == null ? void 0 : L.length, H = y !== void 0;
      if (!D || H && I !== y) {
        const X = z && `"${z}" `, Z = H ? ` of length ${y}` : "", ee = D ? `length=${I}` : `type=${typeof L}`;
        throw new Error(X + "expected Uint8Array" + Z + ", got " + ee);
      }
      return L;
    }
    function f(L) {
      const y = L.toString(16);
      return y.length & 1 ? "0" + y : y;
    }
    function g(L) {
      if (typeof L != "string") throw new Error("hex string expected, got " + typeof L);
      return L === "" ? n : BigInt("0x" + L);
    }
    function h(L) {
      return g((0, r.bytesToHex)(L));
    }
    function v(L) {
      return (0, r.abytes)(L), g((0, r.bytesToHex)(Uint8Array.from(L).reverse()));
    }
    function w(L, y) {
      return (0, r.hexToBytes)(L.toString(16).padStart(y * 2, "0"));
    }
    function p(L, y) {
      return w(L, y).reverse();
    }
    function m(L) {
      return (0, r.hexToBytes)(f(L));
    }
    function x(L, y, z) {
      let D;
      if (typeof y == "string") try {
        D = (0, r.hexToBytes)(y);
      } catch (H) {
        throw new Error(L + " must be hex string or Uint8Array, cause: " + H);
      }
      else if ((0, r.isBytes)(y)) D = Uint8Array.from(y);
      else throw new Error(L + " must be hex string or Uint8Array");
      const I = D.length;
      if (typeof z == "number" && I !== z) throw new Error(L + " of length " + z + " expected, got " + I);
      return D;
    }
    function j(L, y) {
      if (L.length !== y.length) return false;
      let z = 0;
      for (let D = 0; D < L.length; D++) z |= L[D] ^ y[D];
      return z === 0;
    }
    function P(L) {
      return Uint8Array.from(L);
    }
    function S(L) {
      return Uint8Array.from(L, (y, z) => {
        const D = y.charCodeAt(0);
        if (y.length !== 1 || D > 127) throw new Error(`string contains non-ASCII character "${L[z]}" with code ${D} at position ${z}`);
        return D;
      });
    }
    const _ = (L) => typeof L == "bigint" && n <= L;
    function M(L, y, z) {
      return _(L) && _(y) && _(z) && y <= L && L < z;
    }
    function W(L, y, z, D) {
      if (!M(y, z, D)) throw new Error("expected valid " + L + ": " + z + " <= n < " + D + ", got " + y);
    }
    function U(L) {
      let y;
      for (y = 0; L > n; L >>= a, y += 1) ;
      return y;
    }
    function R(L, y) {
      return L >> BigInt(y) & a;
    }
    function N(L, y, z) {
      return L | (z ? a : n) << BigInt(y);
    }
    const k = (L) => (a << BigInt(L)) - a;
    e.bitMask = k;
    function C(L, y, z) {
      if (typeof L != "number" || L < 2) throw new Error("hashLen must be a number");
      if (typeof y != "number" || y < 2) throw new Error("qByteLen must be a number");
      if (typeof z != "function") throw new Error("hmacFn must be a function");
      const D = (fe) => new Uint8Array(fe), I = (fe) => Uint8Array.of(fe);
      let H = D(L), X = D(L), Z = 0;
      const ee = () => {
        H.fill(1), X.fill(0), Z = 0;
      }, ce = (...fe) => z(X, H, ...fe), ue = (fe = D(0)) => {
        X = ce(I(0), fe), H = ce(), fe.length !== 0 && (X = ce(I(1), fe), H = ce());
      }, ie = () => {
        if (Z++ >= 1e3) throw new Error("drbg: tried 1000 values");
        let fe = 0;
        const be = [];
        for (; fe < y; ) {
          H = ce();
          const ye = H.slice();
          be.push(ye), fe += H.length;
        }
        return (0, r.concatBytes)(...be);
      };
      return (fe, be) => {
        ee(), ue(fe);
        let ye;
        for (; !(ye = be(ie())); ) ue();
        return ee(), ye;
      };
    }
    const q = { bigint: (L) => typeof L == "bigint", function: (L) => typeof L == "function", boolean: (L) => typeof L == "boolean", string: (L) => typeof L == "string", stringOrUint8Array: (L) => typeof L == "string" || (0, r.isBytes)(L), isSafeInteger: (L) => Number.isSafeInteger(L), array: (L) => Array.isArray(L), field: (L, y) => y.Fp.isValid(L), hash: (L) => typeof L == "function" && Number.isSafeInteger(L.outputLen) };
    function B(L, y, z = {}) {
      const D = (I, H, X) => {
        const Z = q[H];
        if (typeof Z != "function") throw new Error("invalid validator function");
        const ee = L[I];
        if (!(X && ee === void 0) && !Z(ee, L)) throw new Error("param " + String(I) + " is invalid. Expected " + H + ", got " + ee);
      };
      for (const [I, H] of Object.entries(y)) D(I, H, false);
      for (const [I, H] of Object.entries(z)) D(I, H, true);
      return L;
    }
    function F(L) {
      return typeof L == "function" && Number.isSafeInteger(L.outputLen);
    }
    function G(L, y, z = {}) {
      if (!L || typeof L != "object") throw new Error("expected valid options object");
      function D(I, H, X) {
        const Z = L[I];
        if (X && Z === void 0) return;
        const ee = typeof Z;
        if (ee !== H || Z === null) throw new Error(`param "${I}" is invalid: expected ${H}, got ${ee}`);
      }
      Object.entries(y).forEach(([I, H]) => D(I, H, false)), Object.entries(z).forEach(([I, H]) => D(I, H, true));
    }
    const A = () => {
      throw new Error("not implemented");
    };
    e.notImplemented = A;
    function V(L) {
      const y = /* @__PURE__ */ new WeakMap();
      return (z, ...D) => {
        const I = y.get(z);
        if (I !== void 0) return I;
        const H = L(z, ...D);
        return y.set(z, H), H;
      };
    }
  })(vn)), vn;
}
var rr = {}, Ne = {}, Ni;
function Kt() {
  if (Ni) return Ne;
  Ni = 1, Object.defineProperty(Ne, "__esModule", { value: true }), Ne.isNegativeLE = void 0, Ne.mod = v, Ne.pow = w, Ne.pow2 = p, Ne.invert = m, Ne.tonelliShanks = _, Ne.FpSqrt = M, Ne.validateField = R, Ne.FpPow = N, Ne.FpInvertBatch = k, Ne.FpDiv = C, Ne.FpLegendre = q, Ne.FpIsSquare = B, Ne.nLength = F, Ne.Field = G, Ne.FpSqrtOdd = A, Ne.FpSqrtEven = V, Ne.hashToPrivateScalar = L, Ne.getFieldBytesLength = y, Ne.getMinHashLength = z, Ne.mapHashToField = D;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const e = it(), r = BigInt(0), t = BigInt(1), n = BigInt(2), a = BigInt(3), o = BigInt(4), i = BigInt(5), s = BigInt(7), f = BigInt(8), g = BigInt(9), h = BigInt(16);
  function v(I, H) {
    const X = I % H;
    return X >= r ? X : H + X;
  }
  function w(I, H, X) {
    return N(G(X), I, H);
  }
  function p(I, H, X) {
    let Z = I;
    for (; H-- > r; ) Z *= Z, Z %= X;
    return Z;
  }
  function m(I, H) {
    if (I === r) throw new Error("invert: expected non-zero number");
    if (H <= r) throw new Error("invert: expected positive modulus, got " + H);
    let X = v(I, H), Z = H, ee = r, ce = t;
    for (; X !== r; ) {
      const ie = Z / X, ae = Z % X, fe = ee - ce * ie;
      Z = X, X = ae, ee = ce, ce = fe;
    }
    if (Z !== t) throw new Error("invert: does not exist");
    return v(ee, H);
  }
  function x(I, H, X) {
    if (!I.eql(I.sqr(H), X)) throw new Error("Cannot find square root");
  }
  function j(I, H) {
    const X = (I.ORDER + t) / o, Z = I.pow(H, X);
    return x(I, Z, H), Z;
  }
  function P(I, H) {
    const X = (I.ORDER - i) / f, Z = I.mul(H, n), ee = I.pow(Z, X), ce = I.mul(H, ee), ue = I.mul(I.mul(ce, n), ee), ie = I.mul(ce, I.sub(ue, I.ONE));
    return x(I, ie, H), ie;
  }
  function S(I) {
    const H = G(I), X = _(I), Z = X(H, H.neg(H.ONE)), ee = X(H, Z), ce = X(H, H.neg(Z)), ue = (I + s) / h;
    return (ie, ae) => {
      let fe = ie.pow(ae, ue), be = ie.mul(fe, Z);
      const ye = ie.mul(fe, ee), te = ie.mul(fe, ce), me = ie.eql(ie.sqr(be), ae), _e = ie.eql(ie.sqr(ye), ae);
      fe = ie.cmov(fe, be, me), be = ie.cmov(te, ye, _e);
      const Ce = ie.eql(ie.sqr(be), ae), Oe = ie.cmov(fe, be, Ce);
      return x(ie, Oe, ae), Oe;
    };
  }
  function _(I) {
    if (I < a) throw new Error("sqrt is not defined for small field");
    let H = I - t, X = 0;
    for (; H % n === r; ) H /= n, X++;
    let Z = n;
    const ee = G(I);
    for (; q(ee, Z) === 1; ) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
    if (X === 1) return j;
    let ce = ee.pow(Z, H);
    const ue = (H + t) / n;
    return function(ae, fe) {
      if (ae.is0(fe)) return fe;
      if (q(ae, fe) !== 1) throw new Error("Cannot find square root");
      let be = X, ye = ae.mul(ae.ONE, ce), te = ae.pow(fe, H), me = ae.pow(fe, ue);
      for (; !ae.eql(te, ae.ONE); ) {
        if (ae.is0(te)) return ae.ZERO;
        let _e = 1, Ce = ae.sqr(te);
        for (; !ae.eql(Ce, ae.ONE); ) if (_e++, Ce = ae.sqr(Ce), _e === be) throw new Error("Cannot find square root");
        const Oe = t << BigInt(be - _e - 1), De = ae.pow(ye, Oe);
        be = _e, ye = ae.sqr(De), te = ae.mul(te, ye), me = ae.mul(me, De);
      }
      return me;
    };
  }
  function M(I) {
    return I % o === a ? j : I % f === i ? P : I % h === g ? S(I) : _(I);
  }
  const W = (I, H) => (v(I, H) & t) === t;
  Ne.isNegativeLE = W;
  const U = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
  function R(I) {
    const H = { ORDER: "bigint", MASK: "bigint", BYTES: "number", BITS: "number" }, X = U.reduce((Z, ee) => (Z[ee] = "function", Z), H);
    return (0, e._validateObject)(I, X), I;
  }
  function N(I, H, X) {
    if (X < r) throw new Error("invalid exponent, negatives unsupported");
    if (X === r) return I.ONE;
    if (X === t) return H;
    let Z = I.ONE, ee = H;
    for (; X > r; ) X & t && (Z = I.mul(Z, ee)), ee = I.sqr(ee), X >>= t;
    return Z;
  }
  function k(I, H, X = false) {
    const Z = new Array(H.length).fill(X ? I.ZERO : void 0), ee = H.reduce((ue, ie, ae) => I.is0(ie) ? ue : (Z[ae] = ue, I.mul(ue, ie)), I.ONE), ce = I.inv(ee);
    return H.reduceRight((ue, ie, ae) => I.is0(ie) ? ue : (Z[ae] = I.mul(ue, Z[ae]), I.mul(ue, ie)), ce), Z;
  }
  function C(I, H, X) {
    return I.mul(H, typeof X == "bigint" ? m(X, I.ORDER) : I.inv(X));
  }
  function q(I, H) {
    const X = (I.ORDER - t) / n, Z = I.pow(H, X), ee = I.eql(Z, I.ONE), ce = I.eql(Z, I.ZERO), ue = I.eql(Z, I.neg(I.ONE));
    if (!ee && !ce && !ue) throw new Error("invalid Legendre symbol result");
    return ee ? 1 : ce ? 0 : -1;
  }
  function B(I, H) {
    return q(I, H) === 1;
  }
  function F(I, H) {
    H !== void 0 && (0, e.anumber)(H);
    const X = H !== void 0 ? H : I.toString(2).length, Z = Math.ceil(X / 8);
    return { nBitLength: X, nByteLength: Z };
  }
  function G(I, H, X = false, Z = {}) {
    if (I <= r) throw new Error("invalid field: expected ORDER > 0, got " + I);
    let ee, ce, ue = false, ie;
    if (typeof H == "object" && H != null) {
      if (Z.sqrt || X) throw new Error("cannot specify opts in two arguments");
      const te = H;
      te.BITS && (ee = te.BITS), te.sqrt && (ce = te.sqrt), typeof te.isLE == "boolean" && (X = te.isLE), typeof te.modFromBytes == "boolean" && (ue = te.modFromBytes), ie = te.allowedLengths;
    } else typeof H == "number" && (ee = H), Z.sqrt && (ce = Z.sqrt);
    const { nBitLength: ae, nByteLength: fe } = F(I, ee);
    if (fe > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let be;
    const ye = Object.freeze({ ORDER: I, isLE: X, BITS: ae, BYTES: fe, MASK: (0, e.bitMask)(ae), ZERO: r, ONE: t, allowedLengths: ie, create: (te) => v(te, I), isValid: (te) => {
      if (typeof te != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof te);
      return r <= te && te < I;
    }, is0: (te) => te === r, isValidNot0: (te) => !ye.is0(te) && ye.isValid(te), isOdd: (te) => (te & t) === t, neg: (te) => v(-te, I), eql: (te, me) => te === me, sqr: (te) => v(te * te, I), add: (te, me) => v(te + me, I), sub: (te, me) => v(te - me, I), mul: (te, me) => v(te * me, I), pow: (te, me) => N(ye, te, me), div: (te, me) => v(te * m(me, I), I), sqrN: (te) => te * te, addN: (te, me) => te + me, subN: (te, me) => te - me, mulN: (te, me) => te * me, inv: (te) => m(te, I), sqrt: ce || ((te) => (be || (be = M(I)), be(ye, te))), toBytes: (te) => X ? (0, e.numberToBytesLE)(te, fe) : (0, e.numberToBytesBE)(te, fe), fromBytes: (te, me = true) => {
      if (ie) {
        if (!ie.includes(te.length) || te.length > fe) throw new Error("Field.fromBytes: expected " + ie + " bytes, got " + te.length);
        const Ce = new Uint8Array(fe);
        Ce.set(te, X ? 0 : Ce.length - te.length), te = Ce;
      }
      if (te.length !== fe) throw new Error("Field.fromBytes: expected " + fe + " bytes, got " + te.length);
      let _e = X ? (0, e.bytesToNumberLE)(te) : (0, e.bytesToNumberBE)(te);
      if (ue && (_e = v(_e, I)), !me && !ye.isValid(_e)) throw new Error("invalid field element: outside of range 0..ORDER");
      return _e;
    }, invertBatch: (te) => k(ye, te), cmov: (te, me, _e) => _e ? me : te });
    return Object.freeze(ye);
  }
  function A(I, H) {
    if (!I.isOdd) throw new Error("Field doesn't have isOdd");
    const X = I.sqrt(H);
    return I.isOdd(X) ? X : I.neg(X);
  }
  function V(I, H) {
    if (!I.isOdd) throw new Error("Field doesn't have isOdd");
    const X = I.sqrt(H);
    return I.isOdd(X) ? I.neg(X) : X;
  }
  function L(I, H, X = false) {
    I = (0, e.ensureBytes)("privateHash", I);
    const Z = I.length, ee = F(H).nByteLength + 8;
    if (ee < 24 || Z < ee || Z > 1024) throw new Error("hashToPrivateScalar: expected " + ee + "-1024 bytes of input, got " + Z);
    const ce = X ? (0, e.bytesToNumberLE)(I) : (0, e.bytesToNumberBE)(I);
    return v(ce, H - t) + t;
  }
  function y(I) {
    if (typeof I != "bigint") throw new Error("field order must be bigint");
    const H = I.toString(2).length;
    return Math.ceil(H / 8);
  }
  function z(I) {
    const H = y(I);
    return H + Math.ceil(H / 2);
  }
  function D(I, H, X = false) {
    const Z = I.length, ee = y(H), ce = z(H);
    if (Z < 16 || Z < ce || Z > 1024) throw new Error("expected " + ce + "-1024 bytes of input, got " + Z);
    const ue = X ? (0, e.bytesToNumberLE)(I) : (0, e.bytesToNumberBE)(I), ie = v(ue, H - t) + t;
    return X ? (0, e.numberToBytesLE)(ie, ee) : (0, e.numberToBytesBE)(ie, ee);
  }
  return Ne;
}
var Li;
function uf() {
  if (Li) return rr;
  Li = 1, Object.defineProperty(rr, "__esModule", { value: true }), rr.wNAF = void 0, rr.negateCt = a, rr.normalizeZ = o, rr.mulEndoUnsafe = j, rr.pippenger = P, rr.precomputeMSMUnsafe = S, rr.validateBasic = _, rr._createCurveFields = W;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const e = it(), r = Kt(), t = BigInt(0), n = BigInt(1);
  function a(U, R) {
    const N = R.negate();
    return U ? N : R;
  }
  function o(U, R) {
    const N = (0, r.FpInvertBatch)(U.Fp, R.map((k) => k.Z));
    return R.map((k, C) => U.fromAffine(k.toAffine(N[C])));
  }
  function i(U, R) {
    if (!Number.isSafeInteger(U) || U <= 0 || U > R) throw new Error("invalid window size, expected [1.." + R + "], got W=" + U);
  }
  function s(U, R) {
    i(U, R);
    const N = Math.ceil(R / U) + 1, k = 2 ** (U - 1), C = 2 ** U, q = (0, e.bitMask)(U), B = BigInt(U);
    return { windows: N, windowSize: k, mask: q, maxNumber: C, shiftBy: B };
  }
  function f(U, R, N) {
    const { windowSize: k, mask: C, maxNumber: q, shiftBy: B } = N;
    let F = Number(U & C), G = U >> B;
    F > k && (F -= q, G += n);
    const A = R * k, V = A + Math.abs(F) - 1, L = F === 0, y = F < 0, z = R % 2 !== 0;
    return { nextN: G, offset: V, isZero: L, isNeg: y, isNegF: z, offsetF: A };
  }
  function g(U, R) {
    if (!Array.isArray(U)) throw new Error("array expected");
    U.forEach((N, k) => {
      if (!(N instanceof R)) throw new Error("invalid point at index " + k);
    });
  }
  function h(U, R) {
    if (!Array.isArray(U)) throw new Error("array of scalars expected");
    U.forEach((N, k) => {
      if (!R.isValid(N)) throw new Error("invalid scalar at index " + k);
    });
  }
  const v = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap();
  function p(U) {
    return w.get(U) || 1;
  }
  function m(U) {
    if (U !== t) throw new Error("invalid wNAF");
  }
  class x {
    constructor(R, N) {
      this.BASE = R.BASE, this.ZERO = R.ZERO, this.Fn = R.Fn, this.bits = N;
    }
    _unsafeLadder(R, N, k = this.ZERO) {
      let C = R;
      for (; N > t; ) N & n && (k = k.add(C)), C = C.double(), N >>= n;
      return k;
    }
    precomputeWindow(R, N) {
      const { windows: k, windowSize: C } = s(N, this.bits), q = [];
      let B = R, F = B;
      for (let G = 0; G < k; G++) {
        F = B, q.push(F);
        for (let A = 1; A < C; A++) F = F.add(B), q.push(F);
        B = F.double();
      }
      return q;
    }
    wNAF(R, N, k) {
      if (!this.Fn.isValid(k)) throw new Error("invalid scalar");
      let C = this.ZERO, q = this.BASE;
      const B = s(R, this.bits);
      for (let F = 0; F < B.windows; F++) {
        const { nextN: G, offset: A, isZero: V, isNeg: L, isNegF: y, offsetF: z } = f(k, F, B);
        k = G, V ? q = q.add(a(y, N[z])) : C = C.add(a(L, N[A]));
      }
      return m(k), { p: C, f: q };
    }
    wNAFUnsafe(R, N, k, C = this.ZERO) {
      const q = s(R, this.bits);
      for (let B = 0; B < q.windows && k !== t; B++) {
        const { nextN: F, offset: G, isZero: A, isNeg: V } = f(k, B, q);
        if (k = F, !A) {
          const L = N[G];
          C = C.add(V ? L.negate() : L);
        }
      }
      return m(k), C;
    }
    getPrecomputes(R, N, k) {
      let C = v.get(N);
      return C || (C = this.precomputeWindow(N, R), R !== 1 && (typeof k == "function" && (C = k(C)), v.set(N, C))), C;
    }
    cached(R, N, k) {
      const C = p(R);
      return this.wNAF(C, this.getPrecomputes(C, R, k), N);
    }
    unsafe(R, N, k, C) {
      const q = p(R);
      return q === 1 ? this._unsafeLadder(R, N, C) : this.wNAFUnsafe(q, this.getPrecomputes(q, R, k), N, C);
    }
    createCache(R, N) {
      i(N, this.bits), w.set(R, N), v.delete(R);
    }
    hasCache(R) {
      return p(R) !== 1;
    }
  }
  rr.wNAF = x;
  function j(U, R, N, k) {
    let C = R, q = U.ZERO, B = U.ZERO;
    for (; N > t || k > t; ) N & n && (q = q.add(C)), k & n && (B = B.add(C)), C = C.double(), N >>= n, k >>= n;
    return { p1: q, p2: B };
  }
  function P(U, R, N, k) {
    g(N, U), h(k, R);
    const C = N.length, q = k.length;
    if (C !== q) throw new Error("arrays of points and scalars must have equal length");
    const B = U.ZERO, F = (0, e.bitLen)(BigInt(C));
    let G = 1;
    F > 12 ? G = F - 3 : F > 4 ? G = F - 2 : F > 0 && (G = 2);
    const A = (0, e.bitMask)(G), V = new Array(Number(A) + 1).fill(B), L = Math.floor((R.BITS - 1) / G) * G;
    let y = B;
    for (let z = L; z >= 0; z -= G) {
      V.fill(B);
      for (let I = 0; I < q; I++) {
        const H = k[I], X = Number(H >> BigInt(z) & A);
        V[X] = V[X].add(N[I]);
      }
      let D = B;
      for (let I = V.length - 1, H = B; I > 0; I--) H = H.add(V[I]), D = D.add(H);
      if (y = y.add(D), z !== 0) for (let I = 0; I < G; I++) y = y.double();
    }
    return y;
  }
  function S(U, R, N, k) {
    i(k, R.BITS), g(N, U);
    const C = U.ZERO, q = 2 ** k - 1, B = Math.ceil(R.BITS / k), F = (0, e.bitMask)(k), G = N.map((A) => {
      const V = [];
      for (let L = 0, y = A; L < q; L++) V.push(y), y = y.add(A);
      return V;
    });
    return (A) => {
      if (h(A, R), A.length > N.length) throw new Error("array of scalars must be smaller than array of points");
      let V = C;
      for (let L = 0; L < B; L++) {
        if (V !== C) for (let z = 0; z < k; z++) V = V.double();
        const y = BigInt(B * k - (L + 1) * k);
        for (let z = 0; z < A.length; z++) {
          const D = A[z], I = Number(D >> y & F);
          I && (V = V.add(G[z][I - 1]));
        }
      }
      return V;
    };
  }
  function _(U) {
    return (0, r.validateField)(U.Fp), (0, e.validateObject)(U, { n: "bigint", h: "bigint", Gx: "field", Gy: "field" }, { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" }), Object.freeze({ ...(0, r.nLength)(U.n, U.nBitLength), ...U, p: U.Fp.ORDER });
  }
  function M(U, R, N) {
    if (R) {
      if (R.ORDER !== U) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      return (0, r.validateField)(R), R;
    } else return (0, r.Field)(U, { isLE: N });
  }
  function W(U, R, N = {}, k) {
    if (k === void 0 && (k = U === "edwards"), !R || typeof R != "object") throw new Error(`expected valid ${U} CURVE object`);
    for (const G of ["p", "n", "h"]) {
      const A = R[G];
      if (!(typeof A == "bigint" && A > t)) throw new Error(`CURVE.${G} must be positive bigint`);
    }
    const C = M(R.p, N.Fp, k), q = M(R.n, N.Fn, k), F = ["Gx", "Gy", "a", U === "weierstrass" ? "b" : "d"];
    for (const G of F) if (!C.isValid(R[G])) throw new Error(`CURVE.${G} must be valid field element of CURVE.Fp`);
    return R = Object.freeze(Object.assign({}, R)), { CURVE: R, Fp: C, Fn: q };
  }
  return rr;
}
var Oi;
function $a() {
  return Oi || (Oi = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: true }), e.DER = e.DERErr = void 0, e._splitEndoScalar = s, e._normFnElement = j, e.weierstrassN = P, e.SWUFpSqrtRatio = _, e.mapToCurveSimpleSWU = M, e.ecdh = U, e.ecdsa = R, e.weierstrassPoints = N, e._legacyHelperEquat = q, e.weierstrass = G;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const r = Qa(), t = cr(), n = it(), a = uf(), o = Kt(), i = (A, V) => (A + (A >= 0 ? V : -V) / p) / V;
    function s(A, V, L) {
      const [[y, z], [D, I]] = V, H = i(I * A, L), X = i(-z * A, L);
      let Z = A - H * y - X * D, ee = -H * z - X * I;
      const ce = Z < v, ue = ee < v;
      ce && (Z = -Z), ue && (ee = -ee);
      const ie = (0, n.bitMask)(Math.ceil((0, n.bitLen)(L) / 2)) + w;
      if (Z < v || Z >= ie || ee < v || ee >= ie) throw new Error("splitScalar (endomorphism): failed, k=" + A);
      return { k1neg: ce, k1: Z, k2neg: ue, k2: ee };
    }
    function f(A) {
      if (!["compact", "recovered", "der"].includes(A)) throw new Error('Signature format must be "compact", "recovered", or "der"');
      return A;
    }
    function g(A, V) {
      const L = {};
      for (let y of Object.keys(V)) L[y] = A[y] === void 0 ? V[y] : A[y];
      return (0, n._abool2)(L.lowS, "lowS"), (0, n._abool2)(L.prehash, "prehash"), L.format !== void 0 && f(L.format), L;
    }
    class h extends Error {
      constructor(V = "") {
        super(V);
      }
    }
    e.DERErr = h, e.DER = { Err: h, _tlv: { encode: (A, V) => {
      const { Err: L } = e.DER;
      if (A < 0 || A > 256) throw new L("tlv.encode: wrong tag");
      if (V.length & 1) throw new L("tlv.encode: unpadded data");
      const y = V.length / 2, z = (0, n.numberToHexUnpadded)(y);
      if (z.length / 2 & 128) throw new L("tlv.encode: long form length too big");
      const D = y > 127 ? (0, n.numberToHexUnpadded)(z.length / 2 | 128) : "";
      return (0, n.numberToHexUnpadded)(A) + D + z + V;
    }, decode(A, V) {
      const { Err: L } = e.DER;
      let y = 0;
      if (A < 0 || A > 256) throw new L("tlv.encode: wrong tag");
      if (V.length < 2 || V[y++] !== A) throw new L("tlv.decode: wrong tlv");
      const z = V[y++], D = !!(z & 128);
      let I = 0;
      if (!D) I = z;
      else {
        const X = z & 127;
        if (!X) throw new L("tlv.decode(long): indefinite length not supported");
        if (X > 4) throw new L("tlv.decode(long): byte length is too big");
        const Z = V.subarray(y, y + X);
        if (Z.length !== X) throw new L("tlv.decode: length bytes not complete");
        if (Z[0] === 0) throw new L("tlv.decode(long): zero leftmost byte");
        for (const ee of Z) I = I << 8 | ee;
        if (y += X, I < 128) throw new L("tlv.decode(long): not minimal encoding");
      }
      const H = V.subarray(y, y + I);
      if (H.length !== I) throw new L("tlv.decode: wrong value length");
      return { v: H, l: V.subarray(y + I) };
    } }, _int: { encode(A) {
      const { Err: V } = e.DER;
      if (A < v) throw new V("integer: negative integers are not allowed");
      let L = (0, n.numberToHexUnpadded)(A);
      if (Number.parseInt(L[0], 16) & 8 && (L = "00" + L), L.length & 1) throw new V("unexpected DER parsing assertion: unpadded hex");
      return L;
    }, decode(A) {
      const { Err: V } = e.DER;
      if (A[0] & 128) throw new V("invalid signature integer: negative");
      if (A[0] === 0 && !(A[1] & 128)) throw new V("invalid signature integer: unnecessary leading zero");
      return (0, n.bytesToNumberBE)(A);
    } }, toSig(A) {
      const { Err: V, _int: L, _tlv: y } = e.DER, z = (0, n.ensureBytes)("signature", A), { v: D, l: I } = y.decode(48, z);
      if (I.length) throw new V("invalid signature: left bytes after parsing");
      const { v: H, l: X } = y.decode(2, D), { v: Z, l: ee } = y.decode(2, X);
      if (ee.length) throw new V("invalid signature: left bytes after parsing");
      return { r: L.decode(H), s: L.decode(Z) };
    }, hexFromSig(A) {
      const { _tlv: V, _int: L } = e.DER, y = V.encode(2, L.encode(A.r)), z = V.encode(2, L.encode(A.s)), D = y + z;
      return V.encode(48, D);
    } };
    const v = BigInt(0), w = BigInt(1), p = BigInt(2), m = BigInt(3), x = BigInt(4);
    function j(A, V) {
      const { BYTES: L } = A;
      let y;
      if (typeof V == "bigint") y = V;
      else {
        let z = (0, n.ensureBytes)("private key", V);
        try {
          y = A.fromBytes(z);
        } catch {
          throw new Error(`invalid private key: expected ui8a of size ${L}, got ${typeof V}`);
        }
      }
      if (!A.isValidNot0(y)) throw new Error("invalid private key: out of range [1..N-1]");
      return y;
    }
    function P(A, V = {}) {
      const L = (0, a._createCurveFields)("weierstrass", A, V), { Fp: y, Fn: z } = L;
      let D = L.CURVE;
      const { h: I, n: H } = D;
      (0, n._validateObject)(V, {}, { allowInfinityPoint: "boolean", clearCofactor: "function", isTorsionFree: "function", fromBytes: "function", toBytes: "function", endo: "object", wrapPrivateKey: "boolean" });
      const { endo: X } = V;
      if (X && (!y.is0(D.a) || typeof X.beta != "bigint" || !Array.isArray(X.basises))) throw new Error('invalid endo: expected "beta": bigint and "basises": array');
      const Z = W(y, z);
      function ee() {
        if (!y.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
      }
      function ce(xe, se, oe) {
        const { x: ne, y: de } = se.toAffine(), he = y.toBytes(ne);
        if ((0, n._abool2)(oe, "isCompressed"), oe) {
          ee();
          const we = !y.isOdd(de);
          return (0, n.concatBytes)(S(we), he);
        } else return (0, n.concatBytes)(Uint8Array.of(4), he, y.toBytes(de));
      }
      function ue(xe) {
        (0, n._abytes2)(xe, void 0, "Point");
        const { publicKey: se, publicKeyUncompressed: oe } = Z, ne = xe.length, de = xe[0], he = xe.subarray(1);
        if (ne === se && (de === 2 || de === 3)) {
          const we = y.fromBytes(he);
          if (!y.isValid(we)) throw new Error("bad point: is not on curve, wrong x");
          const b = fe(we);
          let c;
          try {
            c = y.sqrt(b);
          } catch (K) {
            const J = K instanceof Error ? ": " + K.message : "";
            throw new Error("bad point: is not on curve, sqrt error" + J);
          }
          ee();
          const l = y.isOdd(c);
          return (de & 1) === 1 !== l && (c = y.neg(c)), { x: we, y: c };
        } else if (ne === oe && de === 4) {
          const we = y.BYTES, b = y.fromBytes(he.subarray(0, we)), c = y.fromBytes(he.subarray(we, we * 2));
          if (!be(b, c)) throw new Error("bad point: is not on curve");
          return { x: b, y: c };
        } else throw new Error(`bad point: got length ${ne}, expected compressed=${se} or uncompressed=${oe}`);
      }
      const ie = V.toBytes || ce, ae = V.fromBytes || ue;
      function fe(xe) {
        const se = y.sqr(xe), oe = y.mul(se, xe);
        return y.add(y.add(oe, y.mul(xe, D.a)), D.b);
      }
      function be(xe, se) {
        const oe = y.sqr(se), ne = fe(xe);
        return y.eql(oe, ne);
      }
      if (!be(D.Gx, D.Gy)) throw new Error("bad curve params: generator point");
      const ye = y.mul(y.pow(D.a, m), x), te = y.mul(y.sqr(D.b), BigInt(27));
      if (y.is0(y.add(ye, te))) throw new Error("bad curve params: a or b");
      function me(xe, se, oe = false) {
        if (!y.isValid(se) || oe && y.is0(se)) throw new Error(`bad point coordinate ${xe}`);
        return se;
      }
      function _e(xe) {
        if (!(xe instanceof Ae)) throw new Error("ProjectivePoint expected");
      }
      function Ce(xe) {
        if (!X || !X.basises) throw new Error("no endo");
        return s(xe, X.basises, z.ORDER);
      }
      const Oe = (0, n.memoized)((xe, se) => {
        const { X: oe, Y: ne, Z: de } = xe;
        if (y.eql(de, y.ONE)) return { x: oe, y: ne };
        const he = xe.is0();
        se == null && (se = he ? y.ONE : y.inv(de));
        const we = y.mul(oe, se), b = y.mul(ne, se), c = y.mul(de, se);
        if (he) return { x: y.ZERO, y: y.ZERO };
        if (!y.eql(c, y.ONE)) throw new Error("invZ was invalid");
        return { x: we, y: b };
      }), De = (0, n.memoized)((xe) => {
        if (xe.is0()) {
          if (V.allowInfinityPoint && !y.is0(xe.Y)) return;
          throw new Error("bad point: ZERO");
        }
        const { x: se, y: oe } = xe.toAffine();
        if (!y.isValid(se) || !y.isValid(oe)) throw new Error("bad point: x or y not field elements");
        if (!be(se, oe)) throw new Error("bad point: equation left != right");
        if (!xe.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
        return true;
      });
      function Ve(xe, se, oe, ne, de) {
        return oe = new Ae(y.mul(oe.X, xe), oe.Y, oe.Z), se = (0, a.negateCt)(ne, se), oe = (0, a.negateCt)(de, oe), se.add(oe);
      }
      class Ae {
        constructor(se, oe, ne) {
          this.X = me("x", se), this.Y = me("y", oe, true), this.Z = me("z", ne), Object.freeze(this);
        }
        static CURVE() {
          return D;
        }
        static fromAffine(se) {
          const { x: oe, y: ne } = se || {};
          if (!se || !y.isValid(oe) || !y.isValid(ne)) throw new Error("invalid affine point");
          if (se instanceof Ae) throw new Error("projective point not allowed");
          return y.is0(oe) && y.is0(ne) ? Ae.ZERO : new Ae(oe, ne, y.ONE);
        }
        static fromBytes(se) {
          const oe = Ae.fromAffine(ae((0, n._abytes2)(se, void 0, "point")));
          return oe.assertValidity(), oe;
        }
        static fromHex(se) {
          return Ae.fromBytes((0, n.ensureBytes)("pointHex", se));
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        precompute(se = 8, oe = true) {
          return je.createCache(this, se), oe || this.multiply(m), this;
        }
        assertValidity() {
          De(this);
        }
        hasEvenY() {
          const { y: se } = this.toAffine();
          if (!y.isOdd) throw new Error("Field doesn't support isOdd");
          return !y.isOdd(se);
        }
        equals(se) {
          _e(se);
          const { X: oe, Y: ne, Z: de } = this, { X: he, Y: we, Z: b } = se, c = y.eql(y.mul(oe, b), y.mul(he, de)), l = y.eql(y.mul(ne, b), y.mul(we, de));
          return c && l;
        }
        negate() {
          return new Ae(this.X, y.neg(this.Y), this.Z);
        }
        double() {
          const { a: se, b: oe } = D, ne = y.mul(oe, m), { X: de, Y: he, Z: we } = this;
          let b = y.ZERO, c = y.ZERO, l = y.ZERO, T = y.mul(de, de), K = y.mul(he, he), J = y.mul(we, we), Q = y.mul(de, he);
          return Q = y.add(Q, Q), l = y.mul(de, we), l = y.add(l, l), b = y.mul(se, l), c = y.mul(ne, J), c = y.add(b, c), b = y.sub(K, c), c = y.add(K, c), c = y.mul(b, c), b = y.mul(Q, b), l = y.mul(ne, l), J = y.mul(se, J), Q = y.sub(T, J), Q = y.mul(se, Q), Q = y.add(Q, l), l = y.add(T, T), T = y.add(l, T), T = y.add(T, J), T = y.mul(T, Q), c = y.add(c, T), J = y.mul(he, we), J = y.add(J, J), T = y.mul(J, Q), b = y.sub(b, T), l = y.mul(J, K), l = y.add(l, l), l = y.add(l, l), new Ae(b, c, l);
        }
        add(se) {
          _e(se);
          const { X: oe, Y: ne, Z: de } = this, { X: he, Y: we, Z: b } = se;
          let c = y.ZERO, l = y.ZERO, T = y.ZERO;
          const K = D.a, J = y.mul(D.b, m);
          let Q = y.mul(oe, he), ge = y.mul(ne, we), Be = y.mul(de, b), Se = y.add(oe, ne), ke = y.add(he, we);
          Se = y.mul(Se, ke), ke = y.add(Q, ge), Se = y.sub(Se, ke), ke = y.add(oe, de);
          let Ee = y.add(he, b);
          return ke = y.mul(ke, Ee), Ee = y.add(Q, Be), ke = y.sub(ke, Ee), Ee = y.add(ne, de), c = y.add(we, b), Ee = y.mul(Ee, c), c = y.add(ge, Be), Ee = y.sub(Ee, c), T = y.mul(K, ke), c = y.mul(J, Be), T = y.add(c, T), c = y.sub(ge, T), T = y.add(ge, T), l = y.mul(c, T), ge = y.add(Q, Q), ge = y.add(ge, Q), Be = y.mul(K, Be), ke = y.mul(J, ke), ge = y.add(ge, Be), Be = y.sub(Q, Be), Be = y.mul(K, Be), ke = y.add(ke, Be), Q = y.mul(ge, ke), l = y.add(l, Q), Q = y.mul(Ee, ke), c = y.mul(Se, c), c = y.sub(c, Q), Q = y.mul(Se, ge), T = y.mul(Ee, T), T = y.add(T, Q), new Ae(c, l, T);
        }
        subtract(se) {
          return this.add(se.negate());
        }
        is0() {
          return this.equals(Ae.ZERO);
        }
        multiply(se) {
          const { endo: oe } = V;
          if (!z.isValidNot0(se)) throw new Error("invalid scalar: out of range");
          let ne, de;
          const he = (we) => je.cached(this, we, (b) => (0, a.normalizeZ)(Ae, b));
          if (oe) {
            const { k1neg: we, k1: b, k2neg: c, k2: l } = Ce(se), { p: T, f: K } = he(b), { p: J, f: Q } = he(l);
            de = K.add(Q), ne = Ve(oe.beta, T, J, we, c);
          } else {
            const { p: we, f: b } = he(se);
            ne = we, de = b;
          }
          return (0, a.normalizeZ)(Ae, [ne, de])[0];
        }
        multiplyUnsafe(se) {
          const { endo: oe } = V, ne = this;
          if (!z.isValid(se)) throw new Error("invalid scalar: out of range");
          if (se === v || ne.is0()) return Ae.ZERO;
          if (se === w) return ne;
          if (je.hasCache(this)) return this.multiply(se);
          if (oe) {
            const { k1neg: de, k1: he, k2neg: we, k2: b } = Ce(se), { p1: c, p2: l } = (0, a.mulEndoUnsafe)(Ae, ne, he, b);
            return Ve(oe.beta, c, l, de, we);
          } else return je.unsafe(ne, se);
        }
        multiplyAndAddUnsafe(se, oe, ne) {
          const de = this.multiplyUnsafe(oe).add(se.multiplyUnsafe(ne));
          return de.is0() ? void 0 : de;
        }
        toAffine(se) {
          return Oe(this, se);
        }
        isTorsionFree() {
          const { isTorsionFree: se } = V;
          return I === w ? true : se ? se(Ae, this) : je.unsafe(this, H).is0();
        }
        clearCofactor() {
          const { clearCofactor: se } = V;
          return I === w ? this : se ? se(Ae, this) : this.multiplyUnsafe(I);
        }
        isSmallOrder() {
          return this.multiplyUnsafe(I).is0();
        }
        toBytes(se = true) {
          return (0, n._abool2)(se, "isCompressed"), this.assertValidity(), ie(Ae, this, se);
        }
        toHex(se = true) {
          return (0, n.bytesToHex)(this.toBytes(se));
        }
        toString() {
          return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
        }
        get px() {
          return this.X;
        }
        get py() {
          return this.X;
        }
        get pz() {
          return this.Z;
        }
        toRawBytes(se = true) {
          return this.toBytes(se);
        }
        _setWindowSize(se) {
          this.precompute(se);
        }
        static normalizeZ(se) {
          return (0, a.normalizeZ)(Ae, se);
        }
        static msm(se, oe) {
          return (0, a.pippenger)(Ae, z, se, oe);
        }
        static fromPrivateKey(se) {
          return Ae.BASE.multiply(j(z, se));
        }
      }
      Ae.BASE = new Ae(D.Gx, D.Gy, y.ONE), Ae.ZERO = new Ae(y.ZERO, y.ONE, y.ZERO), Ae.Fp = y, Ae.Fn = z;
      const gr = z.BITS, je = new a.wNAF(Ae, V.endo ? Math.ceil(gr / 2) : gr);
      return Ae.BASE.precompute(8), Ae;
    }
    function S(A) {
      return Uint8Array.of(A ? 2 : 3);
    }
    function _(A, V) {
      const L = A.ORDER;
      let y = v;
      for (let ae = L - w; ae % p === v; ae /= p) y += w;
      const z = y, D = p << z - w - w, I = D * p, H = (L - w) / I, X = (H - w) / p, Z = I - w, ee = D, ce = A.pow(V, H), ue = A.pow(V, (H + w) / p);
      let ie = (ae, fe) => {
        let be = ce, ye = A.pow(fe, Z), te = A.sqr(ye);
        te = A.mul(te, fe);
        let me = A.mul(ae, te);
        me = A.pow(me, X), me = A.mul(me, ye), ye = A.mul(me, fe), te = A.mul(me, ae);
        let _e = A.mul(te, ye);
        me = A.pow(_e, ee);
        let Ce = A.eql(me, A.ONE);
        ye = A.mul(te, ue), me = A.mul(_e, be), te = A.cmov(ye, te, Ce), _e = A.cmov(me, _e, Ce);
        for (let Oe = z; Oe > w; Oe--) {
          let De = Oe - p;
          De = p << De - w;
          let Ve = A.pow(_e, De);
          const Ae = A.eql(Ve, A.ONE);
          ye = A.mul(te, be), be = A.mul(be, be), Ve = A.mul(_e, be), te = A.cmov(ye, te, Ae), _e = A.cmov(Ve, _e, Ae);
        }
        return { isValid: Ce, value: te };
      };
      if (A.ORDER % x === m) {
        const ae = (A.ORDER - m) / x, fe = A.sqrt(A.neg(V));
        ie = (be, ye) => {
          let te = A.sqr(ye);
          const me = A.mul(be, ye);
          te = A.mul(te, me);
          let _e = A.pow(te, ae);
          _e = A.mul(_e, me);
          const Ce = A.mul(_e, fe), Oe = A.mul(A.sqr(_e), ye), De = A.eql(Oe, be);
          let Ve = A.cmov(Ce, _e, De);
          return { isValid: De, value: Ve };
        };
      }
      return ie;
    }
    function M(A, V) {
      (0, o.validateField)(A);
      const { A: L, B: y, Z: z } = V;
      if (!A.isValid(L) || !A.isValid(y) || !A.isValid(z)) throw new Error("mapToCurveSimpleSWU: invalid opts");
      const D = _(A, z);
      if (!A.isOdd) throw new Error("Field does not have .isOdd()");
      return (I) => {
        let H, X, Z, ee, ce, ue, ie, ae;
        H = A.sqr(I), H = A.mul(H, z), X = A.sqr(H), X = A.add(X, H), Z = A.add(X, A.ONE), Z = A.mul(Z, y), ee = A.cmov(z, A.neg(X), !A.eql(X, A.ZERO)), ee = A.mul(ee, L), X = A.sqr(Z), ue = A.sqr(ee), ce = A.mul(ue, L), X = A.add(X, ce), X = A.mul(X, Z), ue = A.mul(ue, ee), ce = A.mul(ue, y), X = A.add(X, ce), ie = A.mul(H, Z);
        const { isValid: fe, value: be } = D(X, ue);
        ae = A.mul(H, I), ae = A.mul(ae, be), ie = A.cmov(ie, Z, fe), ae = A.cmov(ae, be, fe);
        const ye = A.isOdd(I) === A.isOdd(ae);
        ae = A.cmov(A.neg(ae), ae, ye);
        const te = (0, o.FpInvertBatch)(A, [ee], true)[0];
        return ie = A.mul(ie, te), { x: ie, y: ae };
      };
    }
    function W(A, V) {
      return { secretKey: V.BYTES, publicKey: 1 + A.BYTES, publicKeyUncompressed: 1 + 2 * A.BYTES, publicKeyHasPrefix: true, signature: 2 * V.BYTES };
    }
    function U(A, V = {}) {
      const { Fn: L } = A, y = V.randomBytes || n.randomBytes, z = Object.assign(W(A.Fp, L), { seed: (0, o.getMinHashLength)(L.ORDER) });
      function D(ie) {
        try {
          return !!j(L, ie);
        } catch {
          return false;
        }
      }
      function I(ie, ae) {
        const { publicKey: fe, publicKeyUncompressed: be } = z;
        try {
          const ye = ie.length;
          return ae === true && ye !== fe || ae === false && ye !== be ? false : !!A.fromBytes(ie);
        } catch {
          return false;
        }
      }
      function H(ie = y(z.seed)) {
        return (0, o.mapHashToField)((0, n._abytes2)(ie, z.seed, "seed"), L.ORDER);
      }
      function X(ie, ae = true) {
        return A.BASE.multiply(j(L, ie)).toBytes(ae);
      }
      function Z(ie) {
        const ae = H(ie);
        return { secretKey: ae, publicKey: X(ae) };
      }
      function ee(ie) {
        if (typeof ie == "bigint") return false;
        if (ie instanceof A) return true;
        const { secretKey: ae, publicKey: fe, publicKeyUncompressed: be } = z;
        if (L.allowedLengths || ae === fe) return;
        const ye = (0, n.ensureBytes)("key", ie).length;
        return ye === fe || ye === be;
      }
      function ce(ie, ae, fe = true) {
        if (ee(ie) === true) throw new Error("first arg must be private key");
        if (ee(ae) === false) throw new Error("second arg must be public key");
        const be = j(L, ie);
        return A.fromHex(ae).multiply(be).toBytes(fe);
      }
      return Object.freeze({ getPublicKey: X, getSharedSecret: ce, keygen: Z, Point: A, utils: { isValidSecretKey: D, isValidPublicKey: I, randomSecretKey: H, isValidPrivateKey: D, randomPrivateKey: H, normPrivateKeyToScalar: (ie) => j(L, ie), precompute(ie = 8, ae = A.BASE) {
        return ae.precompute(ie, false);
      } }, lengths: z });
    }
    function R(A, V, L = {}) {
      (0, t.ahash)(V), (0, n._validateObject)(L, {}, { hmac: "function", lowS: "boolean", randomBytes: "function", bits2int: "function", bits2int_modN: "function" });
      const y = L.randomBytes || n.randomBytes, z = L.hmac || ((oe, ...ne) => (0, r.hmac)(V, oe, (0, n.concatBytes)(...ne))), { Fp: D, Fn: I } = A, { ORDER: H, BITS: X } = I, { keygen: Z, getPublicKey: ee, getSharedSecret: ce, utils: ue, lengths: ie } = U(A, L), ae = { prehash: false, lowS: typeof L.lowS == "boolean" ? L.lowS : false, format: void 0, extraEntropy: false }, fe = "compact";
      function be(oe) {
        const ne = H >> w;
        return oe > ne;
      }
      function ye(oe, ne) {
        if (!I.isValidNot0(ne)) throw new Error(`invalid signature ${oe}: out of range 1..Point.Fn.ORDER`);
        return ne;
      }
      function te(oe, ne) {
        f(ne);
        const de = ie.signature, he = ne === "compact" ? de : ne === "recovered" ? de + 1 : void 0;
        return (0, n._abytes2)(oe, he, `${ne} signature`);
      }
      class me {
        constructor(ne, de, he) {
          this.r = ye("r", ne), this.s = ye("s", de), he != null && (this.recovery = he), Object.freeze(this);
        }
        static fromBytes(ne, de = fe) {
          te(ne, de);
          let he;
          if (de === "der") {
            const { r: l, s: T } = e.DER.toSig((0, n._abytes2)(ne));
            return new me(l, T);
          }
          de === "recovered" && (he = ne[0], de = "compact", ne = ne.subarray(1));
          const we = I.BYTES, b = ne.subarray(0, we), c = ne.subarray(we, we * 2);
          return new me(I.fromBytes(b), I.fromBytes(c), he);
        }
        static fromHex(ne, de) {
          return this.fromBytes((0, n.hexToBytes)(ne), de);
        }
        addRecoveryBit(ne) {
          return new me(this.r, this.s, ne);
        }
        recoverPublicKey(ne) {
          const de = D.ORDER, { r: he, s: we, recovery: b } = this;
          if (b == null || ![0, 1, 2, 3].includes(b)) throw new Error("recovery id invalid");
          if (H * p < de && b > 1) throw new Error("recovery id is ambiguous for h>1 curve");
          const l = b === 2 || b === 3 ? he + H : he;
          if (!D.isValid(l)) throw new Error("recovery id 2 or 3 invalid");
          const T = D.toBytes(l), K = A.fromBytes((0, n.concatBytes)(S((b & 1) === 0), T)), J = I.inv(l), Q = Ce((0, n.ensureBytes)("msgHash", ne)), ge = I.create(-Q * J), Be = I.create(we * J), Se = A.BASE.multiplyUnsafe(ge).add(K.multiplyUnsafe(Be));
          if (Se.is0()) throw new Error("point at infinify");
          return Se.assertValidity(), Se;
        }
        hasHighS() {
          return be(this.s);
        }
        toBytes(ne = fe) {
          if (f(ne), ne === "der") return (0, n.hexToBytes)(e.DER.hexFromSig(this));
          const de = I.toBytes(this.r), he = I.toBytes(this.s);
          if (ne === "recovered") {
            if (this.recovery == null) throw new Error("recovery bit must be present");
            return (0, n.concatBytes)(Uint8Array.of(this.recovery), de, he);
          }
          return (0, n.concatBytes)(de, he);
        }
        toHex(ne) {
          return (0, n.bytesToHex)(this.toBytes(ne));
        }
        assertValidity() {
        }
        static fromCompact(ne) {
          return me.fromBytes((0, n.ensureBytes)("sig", ne), "compact");
        }
        static fromDER(ne) {
          return me.fromBytes((0, n.ensureBytes)("sig", ne), "der");
        }
        normalizeS() {
          return this.hasHighS() ? new me(this.r, I.neg(this.s), this.recovery) : this;
        }
        toDERRawBytes() {
          return this.toBytes("der");
        }
        toDERHex() {
          return (0, n.bytesToHex)(this.toBytes("der"));
        }
        toCompactRawBytes() {
          return this.toBytes("compact");
        }
        toCompactHex() {
          return (0, n.bytesToHex)(this.toBytes("compact"));
        }
      }
      const _e = L.bits2int || function(ne) {
        if (ne.length > 8192) throw new Error("input is too large");
        const de = (0, n.bytesToNumberBE)(ne), he = ne.length * 8 - X;
        return he > 0 ? de >> BigInt(he) : de;
      }, Ce = L.bits2int_modN || function(ne) {
        return I.create(_e(ne));
      }, Oe = (0, n.bitMask)(X);
      function De(oe) {
        return (0, n.aInRange)("num < 2^" + X, oe, v, Oe), I.toBytes(oe);
      }
      function Ve(oe, ne) {
        return (0, n._abytes2)(oe, void 0, "message"), ne ? (0, n._abytes2)(V(oe), void 0, "prehashed message") : oe;
      }
      function Ae(oe, ne, de) {
        if (["recovered", "canonical"].some((ge) => ge in de)) throw new Error("sign() legacy options not supported");
        const { lowS: he, prehash: we, extraEntropy: b } = g(de, ae);
        oe = Ve(oe, we);
        const c = Ce(oe), l = j(I, ne), T = [De(l), De(c)];
        if (b != null && b !== false) {
          const ge = b === true ? y(ie.secretKey) : b;
          T.push((0, n.ensureBytes)("extraEntropy", ge));
        }
        const K = (0, n.concatBytes)(...T), J = c;
        function Q(ge) {
          const Be = _e(ge);
          if (!I.isValidNot0(Be)) return;
          const Se = I.inv(Be), ke = A.BASE.multiply(Be).toAffine(), Ee = I.create(ke.x);
          if (Ee === v) return;
          const ur = I.create(Se * I.create(J + Ee * l));
          if (ur === v) return;
          let $e = (ke.x === Ee ? 0 : 2) | Number(ke.y & w), Vr = ur;
          return he && be(ur) && (Vr = I.neg(ur), $e ^= 1), new me(Ee, Vr, $e);
        }
        return { seed: K, k2sig: Q };
      }
      function gr(oe, ne, de = {}) {
        oe = (0, n.ensureBytes)("message", oe);
        const { seed: he, k2sig: we } = Ae(oe, ne, de);
        return (0, n.createHmacDrbg)(V.outputLen, I.BYTES, z)(he, we);
      }
      function je(oe) {
        let ne;
        const de = typeof oe == "string" || (0, n.isBytes)(oe), he = !de && oe !== null && typeof oe == "object" && typeof oe.r == "bigint" && typeof oe.s == "bigint";
        if (!de && !he) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
        if (he) ne = new me(oe.r, oe.s);
        else if (de) {
          try {
            ne = me.fromBytes((0, n.ensureBytes)("sig", oe), "der");
          } catch (we) {
            if (!(we instanceof e.DER.Err)) throw we;
          }
          if (!ne) try {
            ne = me.fromBytes((0, n.ensureBytes)("sig", oe), "compact");
          } catch {
            return false;
          }
        }
        return ne || false;
      }
      function xe(oe, ne, de, he = {}) {
        const { lowS: we, prehash: b, format: c } = g(he, ae);
        if (de = (0, n.ensureBytes)("publicKey", de), ne = Ve((0, n.ensureBytes)("message", ne), b), "strict" in he) throw new Error("options.strict was renamed to lowS");
        const l = c === void 0 ? je(oe) : me.fromBytes((0, n.ensureBytes)("sig", oe), c);
        if (l === false) return false;
        try {
          const T = A.fromBytes(de);
          if (we && l.hasHighS()) return false;
          const { r: K, s: J } = l, Q = Ce(ne), ge = I.inv(J), Be = I.create(Q * ge), Se = I.create(K * ge), ke = A.BASE.multiplyUnsafe(Be).add(T.multiplyUnsafe(Se));
          return ke.is0() ? false : I.create(ke.x) === K;
        } catch {
          return false;
        }
      }
      function se(oe, ne, de = {}) {
        const { prehash: he } = g(de, ae);
        return ne = Ve(ne, he), me.fromBytes(oe, "recovered").recoverPublicKey(ne).toBytes();
      }
      return Object.freeze({ keygen: Z, getPublicKey: ee, getSharedSecret: ce, utils: ue, lengths: ie, Point: A, sign: gr, verify: xe, recoverPublicKey: se, Signature: me, hash: V });
    }
    function N(A) {
      const { CURVE: V, curveOpts: L } = k(A), y = P(V, L);
      return B(A, y);
    }
    function k(A) {
      const V = { a: A.a, b: A.b, p: A.Fp.ORDER, n: A.n, h: A.h, Gx: A.Gx, Gy: A.Gy }, L = A.Fp;
      let y = A.allowedPrivateKeyLengths ? Array.from(new Set(A.allowedPrivateKeyLengths.map((I) => Math.ceil(I / 2)))) : void 0;
      const z = (0, o.Field)(V.n, { BITS: A.nBitLength, allowedLengths: y, modFromBytes: A.wrapPrivateKey }), D = { Fp: L, Fn: z, allowInfinityPoint: A.allowInfinityPoint, endo: A.endo, isTorsionFree: A.isTorsionFree, clearCofactor: A.clearCofactor, fromBytes: A.fromBytes, toBytes: A.toBytes };
      return { CURVE: V, curveOpts: D };
    }
    function C(A) {
      const { CURVE: V, curveOpts: L } = k(A), y = { hmac: A.hmac, randomBytes: A.randomBytes, lowS: A.lowS, bits2int: A.bits2int, bits2int_modN: A.bits2int_modN };
      return { CURVE: V, curveOpts: L, hash: A.hash, ecdsaOpts: y };
    }
    function q(A, V, L) {
      function y(z) {
        const D = A.sqr(z), I = A.mul(D, z);
        return A.add(A.add(I, A.mul(z, V)), L);
      }
      return y;
    }
    function B(A, V) {
      const { Fp: L, Fn: y } = V;
      function z(I) {
        return (0, n.inRange)(I, w, y.ORDER);
      }
      const D = q(L, A.a, A.b);
      return Object.assign({}, { CURVE: A, Point: V, ProjectivePoint: V, normPrivateKeyToScalar: (I) => j(y, I), weierstrassEquation: D, isWithinCurveOrder: z });
    }
    function F(A, V) {
      const L = V.Point;
      return Object.assign({}, V, { ProjectivePoint: L, CURVE: Object.assign({}, A, (0, o.nLength)(L.Fn.ORDER, L.Fn.BITS)) });
    }
    function G(A) {
      const { CURVE: V, curveOpts: L, hash: y, ecdsaOpts: z } = C(A), D = P(V, L), I = R(D, y, z);
      return F(A, I);
    }
  })(yn)), yn;
}
var qi;
function lf() {
  if (qi) return lt;
  qi = 1, Object.defineProperty(lt, "__esModule", { value: true }), lt.getHash = r, lt.createCurve = t;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const e = $a();
  function r(n) {
    return { hash: n };
  }
  function t(n, a) {
    const o = (i) => (0, e.weierstrass)({ ...n, hash: i });
    return { ...o(a), create: o };
  }
  return lt;
}
var wn = {}, Fi;
function ff() {
  return Fi || (Fi = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: true }), e._DST_scalar = void 0, e.expand_message_xmd = f, e.expand_message_xof = g, e.hash_to_field = h, e.isogenyMap = v, e.createHasher = w;
    const r = it(), t = Kt(), n = r.bytesToNumberBE;
    function a(p, m) {
      if (i(p), i(m), p < 0 || p >= 1 << 8 * m) throw new Error("invalid I2OSP input: " + p);
      const x = Array.from({ length: m }).fill(0);
      for (let j = m - 1; j >= 0; j--) x[j] = p & 255, p >>>= 8;
      return new Uint8Array(x);
    }
    function o(p, m) {
      const x = new Uint8Array(p.length);
      for (let j = 0; j < p.length; j++) x[j] = p[j] ^ m[j];
      return x;
    }
    function i(p) {
      if (!Number.isSafeInteger(p)) throw new Error("number expected");
    }
    function s(p) {
      if (!(0, r.isBytes)(p) && typeof p != "string") throw new Error("DST must be Uint8Array or string");
      return typeof p == "string" ? (0, r.utf8ToBytes)(p) : p;
    }
    function f(p, m, x, j) {
      (0, r.abytes)(p), i(x), m = s(m), m.length > 255 && (m = j((0, r.concatBytes)((0, r.utf8ToBytes)("H2C-OVERSIZE-DST-"), m)));
      const { outputLen: P, blockLen: S } = j, _ = Math.ceil(x / P);
      if (x > 65535 || _ > 255) throw new Error("expand_message_xmd: invalid lenInBytes");
      const M = (0, r.concatBytes)(m, a(m.length, 1)), W = a(0, S), U = a(x, 2), R = new Array(_), N = j((0, r.concatBytes)(W, p, U, a(0, 1), M));
      R[0] = j((0, r.concatBytes)(N, a(1, 1), M));
      for (let C = 1; C <= _; C++) {
        const q = [o(N, R[C - 1]), a(C + 1, 1), M];
        R[C] = j((0, r.concatBytes)(...q));
      }
      return (0, r.concatBytes)(...R).slice(0, x);
    }
    function g(p, m, x, j, P) {
      if ((0, r.abytes)(p), i(x), m = s(m), m.length > 255) {
        const S = Math.ceil(2 * j / 8);
        m = P.create({ dkLen: S }).update((0, r.utf8ToBytes)("H2C-OVERSIZE-DST-")).update(m).digest();
      }
      if (x > 65535 || m.length > 255) throw new Error("expand_message_xof: invalid lenInBytes");
      return P.create({ dkLen: x }).update(p).update(a(x, 2)).update(m).update(a(m.length, 1)).digest();
    }
    function h(p, m, x) {
      (0, r._validateObject)(x, { p: "bigint", m: "number", k: "number", hash: "function" });
      const { p: j, k: P, m: S, hash: _, expand: M, DST: W } = x;
      if (!(0, r.isHash)(x.hash)) throw new Error("expected valid hash");
      (0, r.abytes)(p), i(m);
      const U = j.toString(2).length, R = Math.ceil((U + P) / 8), N = m * S * R;
      let k;
      if (M === "xmd") k = f(p, W, N, _);
      else if (M === "xof") k = g(p, W, N, P, _);
      else if (M === "_internal_pass") k = p;
      else throw new Error('expand must be "xmd" or "xof"');
      const C = new Array(m);
      for (let q = 0; q < m; q++) {
        const B = new Array(S);
        for (let F = 0; F < S; F++) {
          const G = R * (F + q * S), A = k.subarray(G, G + R);
          B[F] = (0, t.mod)(n(A), j);
        }
        C[q] = B;
      }
      return C;
    }
    function v(p, m) {
      const x = m.map((j) => Array.from(j).reverse());
      return (j, P) => {
        const [S, _, M, W] = x.map((N) => N.reduce((k, C) => p.add(p.mul(k, j), C))), [U, R] = (0, t.FpInvertBatch)(p, [_, W], true);
        return j = p.mul(S, U), P = p.mul(P, p.mul(M, R)), { x: j, y: P };
      };
    }
    e._DST_scalar = (0, r.utf8ToBytes)("HashToScalar-");
    function w(p, m, x) {
      if (typeof m != "function") throw new Error("mapToCurve() must be defined");
      function j(S) {
        return p.fromAffine(m(S));
      }
      function P(S) {
        const _ = S.clearCofactor();
        return _.equals(p.ZERO) ? p.ZERO : (_.assertValidity(), _);
      }
      return { defaults: x, hashToCurve(S, _) {
        const M = Object.assign({}, x, _), W = h(S, 2, M), U = j(W[0]), R = j(W[1]);
        return P(U.add(R));
      }, encodeToCurve(S, _) {
        const M = x.encodeDST ? { DST: x.encodeDST } : {}, W = Object.assign({}, x, M, _), U = h(S, 1, W), R = j(U[0]);
        return P(R);
      }, mapToCurve(S) {
        if (!Array.isArray(S)) throw new Error("expected array of bigints");
        for (const _ of S) if (typeof _ != "bigint") throw new Error("expected array of bigints");
        return P(j(S));
      }, hashToScalar(S, _) {
        const M = p.Fn.ORDER, W = Object.assign({}, x, { p: M, m: 1, DST: e._DST_scalar }, _);
        return h(S, 1, W)[0][0];
      } };
    }
  })(wn)), wn;
}
var Pi;
function Yf() {
  return Pi || (Pi = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: true }), e.encodeToCurve = e.hashToCurve = e.secp256k1_hasher = e.schnorr = e.secp256k1 = void 0;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const r = ro(), t = cr(), n = lf(), a = ff(), o = Kt(), i = $a(), s = it(), f = { p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), h: BigInt(1), a: BigInt(0), b: BigInt(7), Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8") }, g = { beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"), basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]] }, h = BigInt(0), v = BigInt(1), w = BigInt(2);
    function p(F) {
      const G = f.p, A = BigInt(3), V = BigInt(6), L = BigInt(11), y = BigInt(22), z = BigInt(23), D = BigInt(44), I = BigInt(88), H = F * F * F % G, X = H * H * F % G, Z = (0, o.pow2)(X, A, G) * X % G, ee = (0, o.pow2)(Z, A, G) * X % G, ce = (0, o.pow2)(ee, w, G) * H % G, ue = (0, o.pow2)(ce, L, G) * ce % G, ie = (0, o.pow2)(ue, y, G) * ue % G, ae = (0, o.pow2)(ie, D, G) * ie % G, fe = (0, o.pow2)(ae, I, G) * ae % G, be = (0, o.pow2)(fe, D, G) * ie % G, ye = (0, o.pow2)(be, A, G) * X % G, te = (0, o.pow2)(ye, z, G) * ue % G, me = (0, o.pow2)(te, V, G) * H % G, _e = (0, o.pow2)(me, w, G);
      if (!m.eql(m.sqr(_e), F)) throw new Error("Cannot find square root");
      return _e;
    }
    const m = (0, o.Field)(f.p, { sqrt: p });
    e.secp256k1 = (0, n.createCurve)({ ...f, Fp: m, lowS: true, endo: g }, r.sha256);
    const x = {};
    function j(F, ...G) {
      let A = x[F];
      if (A === void 0) {
        const V = (0, r.sha256)((0, s.utf8ToBytes)(F));
        A = (0, s.concatBytes)(V, V), x[F] = A;
      }
      return (0, r.sha256)((0, s.concatBytes)(A, ...G));
    }
    const P = (F) => F.toBytes(true).slice(1), S = e.secp256k1.Point, _ = (F) => F % w === h;
    function M(F) {
      const { Fn: G, BASE: A } = S, V = (0, i._normFnElement)(G, F), L = A.multiply(V);
      return { scalar: _(L.y) ? V : G.neg(V), bytes: P(L) };
    }
    function W(F) {
      const G = m;
      if (!G.isValidNot0(F)) throw new Error("invalid x: Fail if x \u2265 p");
      const A = G.create(F * F), V = G.create(A * F + BigInt(7));
      let L = G.sqrt(V);
      _(L) || (L = G.neg(L));
      const y = S.fromAffine({ x: F, y: L });
      return y.assertValidity(), y;
    }
    const U = s.bytesToNumberBE;
    function R(...F) {
      return S.Fn.create(U(j("BIP0340/challenge", ...F)));
    }
    function N(F) {
      return M(F).bytes;
    }
    function k(F, G, A = (0, t.randomBytes)(32)) {
      const { Fn: V } = S, L = (0, s.ensureBytes)("message", F), { bytes: y, scalar: z } = M(G), D = (0, s.ensureBytes)("auxRand", A, 32), I = V.toBytes(z ^ U(j("BIP0340/aux", D))), H = j("BIP0340/nonce", I, y, L), { bytes: X, scalar: Z } = M(H), ee = R(X, y, L), ce = new Uint8Array(64);
      if (ce.set(X, 0), ce.set(V.toBytes(V.create(Z + ee * z)), 32), !C(ce, L, y)) throw new Error("sign: Invalid signature produced");
      return ce;
    }
    function C(F, G, A) {
      const { Fn: V, BASE: L } = S, y = (0, s.ensureBytes)("signature", F, 64), z = (0, s.ensureBytes)("message", G), D = (0, s.ensureBytes)("publicKey", A, 32);
      try {
        const I = W(U(D)), H = U(y.subarray(0, 32));
        if (!(0, s.inRange)(H, v, f.p)) return false;
        const X = U(y.subarray(32, 64));
        if (!(0, s.inRange)(X, v, f.n)) return false;
        const Z = R(V.toBytes(H), P(I), z), ee = L.multiplyUnsafe(X).add(I.multiplyUnsafe(V.neg(Z))), { x: ce, y: ue } = ee.toAffine();
        return !(ee.is0() || !_(ue) || ce !== H);
      } catch {
        return false;
      }
    }
    e.schnorr = (() => {
      const A = (L = (0, t.randomBytes)(48)) => (0, o.mapHashToField)(L, f.n);
      e.secp256k1.utils.randomSecretKey;
      function V(L) {
        const y = A(L);
        return { secretKey: y, publicKey: N(y) };
      }
      return { keygen: V, getPublicKey: N, sign: k, verify: C, Point: S, utils: { randomSecretKey: A, randomPrivateKey: A, taggedHash: j, lift_x: W, pointToBytes: P, numberToBytesBE: s.numberToBytesBE, bytesToNumberBE: s.bytesToNumberBE, mod: o.mod }, lengths: { secretKey: 32, publicKey: 32, publicKeyHasPrefix: false, signature: 64, seed: 48 } };
    })();
    const q = (0, a.isogenyMap)(m, [["0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7", "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581", "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262", "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"], ["0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b", "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14", "0x0000000000000000000000000000000000000000000000000000000000000001"], ["0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c", "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3", "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931", "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"], ["0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b", "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573", "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f", "0x0000000000000000000000000000000000000000000000000000000000000001"]].map((F) => F.map((G) => BigInt(G)))), B = (0, i.mapToCurveSimpleSWU)(m, { A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"), B: BigInt("1771"), Z: m.create(BigInt("-11")) });
    e.secp256k1_hasher = (0, a.createHasher)(e.secp256k1.Point, (F) => {
      const { x: G, y: A } = B(m.create(F[0]));
      return q(G, A);
    }, { DST: "secp256k1_XMD:SHA-256_SSWU_RO_", encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_", p: m.ORDER, m: 1, k: 128, expand: "xmd", hash: r.sha256 }), e.hashToCurve = e.secp256k1_hasher.hashToCurve, e.encodeToCurve = e.secp256k1_hasher.encodeToCurve;
  })(bn)), bn;
}
var pe = {}, Mi;
function Xf() {
  if (Mi) return pe;
  Mi = 1, Object.defineProperty(pe, "__esModule", { value: true }), pe.isHash = pe.validateObject = pe.memoized = pe.notImplemented = pe.createHmacDrbg = pe.bitMask = pe.bitSet = pe.bitGet = pe.bitLen = pe.aInRange = pe.inRange = pe.asciiToBytes = pe.copyBytes = pe.equalBytes = pe.ensureBytes = pe.numberToVarBytesBE = pe.numberToBytesLE = pe.numberToBytesBE = pe.bytesToNumberLE = pe.bytesToNumberBE = pe.hexToNumber = pe.numberToHexUnpadded = pe.abool = pe.utf8ToBytes = pe.randomBytes = pe.isBytes = pe.hexToBytes = pe.concatBytes = pe.bytesToUtf8 = pe.bytesToHex = pe.anumber = pe.abytes = void 0;
  const e = it();
  return pe.abytes = e.abytes, pe.anumber = e.anumber, pe.bytesToHex = e.bytesToHex, pe.bytesToUtf8 = e.bytesToUtf8, pe.concatBytes = e.concatBytes, pe.hexToBytes = e.hexToBytes, pe.isBytes = e.isBytes, pe.randomBytes = e.randomBytes, pe.utf8ToBytes = e.utf8ToBytes, pe.abool = e.abool, pe.numberToHexUnpadded = e.numberToHexUnpadded, pe.hexToNumber = e.hexToNumber, pe.bytesToNumberBE = e.bytesToNumberBE, pe.bytesToNumberLE = e.bytesToNumberLE, pe.numberToBytesBE = e.numberToBytesBE, pe.numberToBytesLE = e.numberToBytesLE, pe.numberToVarBytesBE = e.numberToVarBytesBE, pe.ensureBytes = e.ensureBytes, pe.equalBytes = e.equalBytes, pe.copyBytes = e.copyBytes, pe.asciiToBytes = e.asciiToBytes, pe.inRange = e.inRange, pe.aInRange = e.aInRange, pe.bitLen = e.bitLen, pe.bitGet = e.bitGet, pe.bitSet = e.bitSet, pe.bitMask = e.bitMask, pe.createHmacDrbg = e.createHmacDrbg, pe.notImplemented = e.notImplemented, pe.memoized = e.memoized, pe.validateObject = e.validateObject, pe.isHash = e.isHash, pe;
}
var et = {}, xn, Hi;
function df() {
  return Hi || (Hi = 1, xn = function() {
    return typeof Promise == "function" && Promise.prototype && Promise.prototype.then;
  }), xn;
}
var kn = {}, Nr = {}, Di;
function Dr() {
  if (Di) return Nr;
  Di = 1;
  let e;
  const r = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
  return Nr.getSymbolSize = function(n) {
    if (!n) throw new Error('"version" cannot be null or undefined');
    if (n < 1 || n > 40) throw new Error('"version" should be in range from 1 to 40');
    return n * 4 + 17;
  }, Nr.getSymbolTotalCodewords = function(n) {
    return r[n];
  }, Nr.getBCHDigit = function(t) {
    let n = 0;
    for (; t !== 0; ) n++, t >>>= 1;
    return n;
  }, Nr.setToSJISFunction = function(n) {
    if (typeof n != "function") throw new Error('"toSJISFunc" is not a valid function.');
    e = n;
  }, Nr.isKanjiModeEnabled = function() {
    return typeof e < "u";
  }, Nr.toSJIS = function(n) {
    return e(n);
  }, Nr;
}
var En = {}, Ki;
function uo() {
  return Ki || (Ki = 1, (function(e) {
    e.L = { bit: 1 }, e.M = { bit: 0 }, e.Q = { bit: 3 }, e.H = { bit: 2 };
    function r(t) {
      if (typeof t != "string") throw new Error("Param is not a string");
      switch (t.toLowerCase()) {
        case "l":
        case "low":
          return e.L;
        case "m":
        case "medium":
          return e.M;
        case "q":
        case "quartile":
          return e.Q;
        case "h":
        case "high":
          return e.H;
        default:
          throw new Error("Unknown EC Level: " + t);
      }
    }
    e.isValid = function(n) {
      return n && typeof n.bit < "u" && n.bit >= 0 && n.bit < 4;
    }, e.from = function(n, a) {
      if (e.isValid(n)) return n;
      try {
        return r(n);
      } catch {
        return a;
      }
    };
  })(En)), En;
}
var Bn, Vi;
function hf() {
  if (Vi) return Bn;
  Vi = 1;
  function e() {
    this.buffer = [], this.length = 0;
  }
  return e.prototype = { get: function(r) {
    const t = Math.floor(r / 8);
    return (this.buffer[t] >>> 7 - r % 8 & 1) === 1;
  }, put: function(r, t) {
    for (let n = 0; n < t; n++) this.putBit((r >>> t - n - 1 & 1) === 1);
  }, getLengthInBits: function() {
    return this.length;
  }, putBit: function(r) {
    const t = Math.floor(this.length / 8);
    this.buffer.length <= t && this.buffer.push(0), r && (this.buffer[t] |= 128 >>> this.length % 8), this.length++;
  } }, Bn = e, Bn;
}
var In, Gi;
function pf() {
  if (Gi) return In;
  Gi = 1;
  function e(r) {
    if (!r || r < 1) throw new Error("BitMatrix size must be defined and greater than 0");
    this.size = r, this.data = new Uint8Array(r * r), this.reservedBit = new Uint8Array(r * r);
  }
  return e.prototype.set = function(r, t, n, a) {
    const o = r * this.size + t;
    this.data[o] = n, a && (this.reservedBit[o] = true);
  }, e.prototype.get = function(r, t) {
    return this.data[r * this.size + t];
  }, e.prototype.xor = function(r, t, n) {
    this.data[r * this.size + t] ^= n;
  }, e.prototype.isReserved = function(r, t) {
    return this.reservedBit[r * this.size + t];
  }, In = e, In;
}
var _n = {}, Wi;
function mf() {
  return Wi || (Wi = 1, (function(e) {
    const r = Dr().getSymbolSize;
    e.getRowColCoords = function(n) {
      if (n === 1) return [];
      const a = Math.floor(n / 7) + 2, o = r(n), i = o === 145 ? 26 : Math.ceil((o - 13) / (2 * a - 2)) * 2, s = [o - 7];
      for (let f = 1; f < a - 1; f++) s[f] = s[f - 1] - i;
      return s.push(6), s.reverse();
    }, e.getPositions = function(n) {
      const a = [], o = e.getRowColCoords(n), i = o.length;
      for (let s = 0; s < i; s++) for (let f = 0; f < i; f++) s === 0 && f === 0 || s === 0 && f === i - 1 || s === i - 1 && f === 0 || a.push([o[s], o[f]]);
      return a;
    };
  })(_n)), _n;
}
var An = {}, Yi;
function gf() {
  if (Yi) return An;
  Yi = 1;
  const e = Dr().getSymbolSize, r = 7;
  return An.getPositions = function(n) {
    const a = e(n);
    return [[0, 0], [a - r, 0], [0, a - r]];
  }, An;
}
var Sn = {}, Xi;
function bf() {
  return Xi || (Xi = 1, (function(e) {
    e.Patterns = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
    const r = { N1: 3, N2: 3, N3: 40, N4: 10 };
    e.isValid = function(a) {
      return a != null && a !== "" && !isNaN(a) && a >= 0 && a <= 7;
    }, e.from = function(a) {
      return e.isValid(a) ? parseInt(a, 10) : void 0;
    }, e.getPenaltyN1 = function(a) {
      const o = a.size;
      let i = 0, s = 0, f = 0, g = null, h = null;
      for (let v = 0; v < o; v++) {
        s = f = 0, g = h = null;
        for (let w = 0; w < o; w++) {
          let p = a.get(v, w);
          p === g ? s++ : (s >= 5 && (i += r.N1 + (s - 5)), g = p, s = 1), p = a.get(w, v), p === h ? f++ : (f >= 5 && (i += r.N1 + (f - 5)), h = p, f = 1);
        }
        s >= 5 && (i += r.N1 + (s - 5)), f >= 5 && (i += r.N1 + (f - 5));
      }
      return i;
    }, e.getPenaltyN2 = function(a) {
      const o = a.size;
      let i = 0;
      for (let s = 0; s < o - 1; s++) for (let f = 0; f < o - 1; f++) {
        const g = a.get(s, f) + a.get(s, f + 1) + a.get(s + 1, f) + a.get(s + 1, f + 1);
        (g === 4 || g === 0) && i++;
      }
      return i * r.N2;
    }, e.getPenaltyN3 = function(a) {
      const o = a.size;
      let i = 0, s = 0, f = 0;
      for (let g = 0; g < o; g++) {
        s = f = 0;
        for (let h = 0; h < o; h++) s = s << 1 & 2047 | a.get(g, h), h >= 10 && (s === 1488 || s === 93) && i++, f = f << 1 & 2047 | a.get(h, g), h >= 10 && (f === 1488 || f === 93) && i++;
      }
      return i * r.N3;
    }, e.getPenaltyN4 = function(a) {
      let o = 0;
      const i = a.data.length;
      for (let f = 0; f < i; f++) o += a.data[f];
      return Math.abs(Math.ceil(o * 100 / i / 5) - 10) * r.N4;
    };
    function t(n, a, o) {
      switch (n) {
        case e.Patterns.PATTERN000:
          return (a + o) % 2 === 0;
        case e.Patterns.PATTERN001:
          return a % 2 === 0;
        case e.Patterns.PATTERN010:
          return o % 3 === 0;
        case e.Patterns.PATTERN011:
          return (a + o) % 3 === 0;
        case e.Patterns.PATTERN100:
          return (Math.floor(a / 2) + Math.floor(o / 3)) % 2 === 0;
        case e.Patterns.PATTERN101:
          return a * o % 2 + a * o % 3 === 0;
        case e.Patterns.PATTERN110:
          return (a * o % 2 + a * o % 3) % 2 === 0;
        case e.Patterns.PATTERN111:
          return (a * o % 3 + (a + o) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + n);
      }
    }
    e.applyMask = function(a, o) {
      const i = o.size;
      for (let s = 0; s < i; s++) for (let f = 0; f < i; f++) o.isReserved(f, s) || o.xor(f, s, t(a, f, s));
    }, e.getBestMask = function(a, o) {
      const i = Object.keys(e.Patterns).length;
      let s = 0, f = 1 / 0;
      for (let g = 0; g < i; g++) {
        o(g), e.applyMask(g, a);
        const h = e.getPenaltyN1(a) + e.getPenaltyN2(a) + e.getPenaltyN3(a) + e.getPenaltyN4(a);
        e.applyMask(g, a), h < f && (f = h, s = g);
      }
      return s;
    };
  })(Sn)), Sn;
}
var zt = {}, Ji;
function es() {
  if (Ji) return zt;
  Ji = 1;
  const e = uo(), r = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81], t = [7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
  return zt.getBlocksCount = function(a, o) {
    switch (o) {
      case e.L:
        return r[(a - 1) * 4 + 0];
      case e.M:
        return r[(a - 1) * 4 + 1];
      case e.Q:
        return r[(a - 1) * 4 + 2];
      case e.H:
        return r[(a - 1) * 4 + 3];
      default:
        return;
    }
  }, zt.getTotalCodewordsCount = function(a, o) {
    switch (o) {
      case e.L:
        return t[(a - 1) * 4 + 0];
      case e.M:
        return t[(a - 1) * 4 + 1];
      case e.Q:
        return t[(a - 1) * 4 + 2];
      case e.H:
        return t[(a - 1) * 4 + 3];
      default:
        return;
    }
  }, zt;
}
var Tn = {}, ft = {}, Zi;
function yf() {
  if (Zi) return ft;
  Zi = 1;
  const e = new Uint8Array(512), r = new Uint8Array(256);
  return (function() {
    let n = 1;
    for (let a = 0; a < 255; a++) e[a] = n, r[n] = a, n <<= 1, n & 256 && (n ^= 285);
    for (let a = 255; a < 512; a++) e[a] = e[a - 255];
  })(), ft.log = function(n) {
    if (n < 1) throw new Error("log(" + n + ")");
    return r[n];
  }, ft.exp = function(n) {
    return e[n];
  }, ft.mul = function(n, a) {
    return n === 0 || a === 0 ? 0 : e[r[n] + r[a]];
  }, ft;
}
var Qi;
function vf() {
  return Qi || (Qi = 1, (function(e) {
    const r = yf();
    e.mul = function(n, a) {
      const o = new Uint8Array(n.length + a.length - 1);
      for (let i = 0; i < n.length; i++) for (let s = 0; s < a.length; s++) o[i + s] ^= r.mul(n[i], a[s]);
      return o;
    }, e.mod = function(n, a) {
      let o = new Uint8Array(n);
      for (; o.length - a.length >= 0; ) {
        const i = o[0];
        for (let f = 0; f < a.length; f++) o[f] ^= r.mul(a[f], i);
        let s = 0;
        for (; s < o.length && o[s] === 0; ) s++;
        o = o.slice(s);
      }
      return o;
    }, e.generateECPolynomial = function(n) {
      let a = new Uint8Array([1]);
      for (let o = 0; o < n; o++) a = e.mul(a, new Uint8Array([1, r.exp(o)]));
      return a;
    };
  })(Tn)), Tn;
}
var zn, $i;
function wf() {
  if ($i) return zn;
  $i = 1;
  const e = vf();
  function r(t) {
    this.genPoly = void 0, this.degree = t, this.degree && this.initialize(this.degree);
  }
  return r.prototype.initialize = function(n) {
    this.degree = n, this.genPoly = e.generateECPolynomial(this.degree);
  }, r.prototype.encode = function(n) {
    if (!this.genPoly) throw new Error("Encoder not initialized");
    const a = new Uint8Array(n.length + this.degree);
    a.set(n);
    const o = e.mod(a, this.genPoly), i = this.degree - o.length;
    if (i > 0) {
      const s = new Uint8Array(this.degree);
      return s.set(o, i), s;
    }
    return o;
  }, zn = r, zn;
}
var Cn = {}, jn = {}, Rn = {}, ea;
function rs() {
  return ea || (ea = 1, Rn.isValid = function(r) {
    return !isNaN(r) && r >= 1 && r <= 40;
  }), Rn;
}
var ir = {}, ra;
function ts() {
  if (ra) return ir;
  ra = 1;
  const e = "[0-9]+", r = "[A-Z $%*+\\-./:]+";
  let t = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  t = t.replace(/u/g, "\\u");
  const n = "(?:(?![A-Z0-9 $%*+\\-./:]|" + t + `)(?:.|[\r
]))+`;
  ir.KANJI = new RegExp(t, "g"), ir.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g"), ir.BYTE = new RegExp(n, "g"), ir.NUMERIC = new RegExp(e, "g"), ir.ALPHANUMERIC = new RegExp(r, "g");
  const a = new RegExp("^" + t + "$"), o = new RegExp("^" + e + "$"), i = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  return ir.testKanji = function(f) {
    return a.test(f);
  }, ir.testNumeric = function(f) {
    return o.test(f);
  }, ir.testAlphanumeric = function(f) {
    return i.test(f);
  }, ir;
}
var ta;
function Kr() {
  return ta || (ta = 1, (function(e) {
    const r = rs(), t = ts();
    e.NUMERIC = { id: "Numeric", bit: 1, ccBits: [10, 12, 14] }, e.ALPHANUMERIC = { id: "Alphanumeric", bit: 2, ccBits: [9, 11, 13] }, e.BYTE = { id: "Byte", bit: 4, ccBits: [8, 16, 16] }, e.KANJI = { id: "Kanji", bit: 8, ccBits: [8, 10, 12] }, e.MIXED = { bit: -1 }, e.getCharCountIndicator = function(o, i) {
      if (!o.ccBits) throw new Error("Invalid mode: " + o);
      if (!r.isValid(i)) throw new Error("Invalid version: " + i);
      return i >= 1 && i < 10 ? o.ccBits[0] : i < 27 ? o.ccBits[1] : o.ccBits[2];
    }, e.getBestModeForData = function(o) {
      return t.testNumeric(o) ? e.NUMERIC : t.testAlphanumeric(o) ? e.ALPHANUMERIC : t.testKanji(o) ? e.KANJI : e.BYTE;
    }, e.toString = function(o) {
      if (o && o.id) return o.id;
      throw new Error("Invalid mode");
    }, e.isValid = function(o) {
      return o && o.bit && o.ccBits;
    };
    function n(a) {
      if (typeof a != "string") throw new Error("Param is not a string");
      switch (a.toLowerCase()) {
        case "numeric":
          return e.NUMERIC;
        case "alphanumeric":
          return e.ALPHANUMERIC;
        case "kanji":
          return e.KANJI;
        case "byte":
          return e.BYTE;
        default:
          throw new Error("Unknown mode: " + a);
      }
    }
    e.from = function(o, i) {
      if (e.isValid(o)) return o;
      try {
        return n(o);
      } catch {
        return i;
      }
    };
  })(jn)), jn;
}
var na;
function xf() {
  return na || (na = 1, (function(e) {
    const r = Dr(), t = es(), n = uo(), a = Kr(), o = rs(), i = 7973, s = r.getBCHDigit(i);
    function f(w, p, m) {
      for (let x = 1; x <= 40; x++) if (p <= e.getCapacity(x, m, w)) return x;
    }
    function g(w, p) {
      return a.getCharCountIndicator(w, p) + 4;
    }
    function h(w, p) {
      let m = 0;
      return w.forEach(function(x) {
        const j = g(x.mode, p);
        m += j + x.getBitsLength();
      }), m;
    }
    function v(w, p) {
      for (let m = 1; m <= 40; m++) if (h(w, m) <= e.getCapacity(m, p, a.MIXED)) return m;
    }
    e.from = function(p, m) {
      return o.isValid(p) ? parseInt(p, 10) : m;
    }, e.getCapacity = function(p, m, x) {
      if (!o.isValid(p)) throw new Error("Invalid QR Code version");
      typeof x > "u" && (x = a.BYTE);
      const j = r.getSymbolTotalCodewords(p), P = t.getTotalCodewordsCount(p, m), S = (j - P) * 8;
      if (x === a.MIXED) return S;
      const _ = S - g(x, p);
      switch (x) {
        case a.NUMERIC:
          return Math.floor(_ / 10 * 3);
        case a.ALPHANUMERIC:
          return Math.floor(_ / 11 * 2);
        case a.KANJI:
          return Math.floor(_ / 13);
        case a.BYTE:
        default:
          return Math.floor(_ / 8);
      }
    }, e.getBestVersionForData = function(p, m) {
      let x;
      const j = n.from(m, n.M);
      if (Array.isArray(p)) {
        if (p.length > 1) return v(p, j);
        if (p.length === 0) return 1;
        x = p[0];
      } else x = p;
      return f(x.mode, x.getLength(), j);
    }, e.getEncodedBits = function(p) {
      if (!o.isValid(p) || p < 7) throw new Error("Invalid QR Code version");
      let m = p << 12;
      for (; r.getBCHDigit(m) - s >= 0; ) m ^= i << r.getBCHDigit(m) - s;
      return p << 12 | m;
    };
  })(Cn)), Cn;
}
var Un = {}, oa;
function kf() {
  if (oa) return Un;
  oa = 1;
  const e = Dr(), r = 1335, t = 21522, n = e.getBCHDigit(r);
  return Un.getEncodedBits = function(o, i) {
    const s = o.bit << 3 | i;
    let f = s << 10;
    for (; e.getBCHDigit(f) - n >= 0; ) f ^= r << e.getBCHDigit(f) - n;
    return (s << 10 | f) ^ t;
  }, Un;
}
var Nn = {}, Ln, ia;
function Ef() {
  if (ia) return Ln;
  ia = 1;
  const e = Kr();
  function r(t) {
    this.mode = e.NUMERIC, this.data = t.toString();
  }
  return r.getBitsLength = function(n) {
    return 10 * Math.floor(n / 3) + (n % 3 ? n % 3 * 3 + 1 : 0);
  }, r.prototype.getLength = function() {
    return this.data.length;
  }, r.prototype.getBitsLength = function() {
    return r.getBitsLength(this.data.length);
  }, r.prototype.write = function(n) {
    let a, o, i;
    for (a = 0; a + 3 <= this.data.length; a += 3) o = this.data.substr(a, 3), i = parseInt(o, 10), n.put(i, 10);
    const s = this.data.length - a;
    s > 0 && (o = this.data.substr(a), i = parseInt(o, 10), n.put(i, s * 3 + 1));
  }, Ln = r, Ln;
}
var On, aa;
function Bf() {
  if (aa) return On;
  aa = 1;
  const e = Kr(), r = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];
  function t(n) {
    this.mode = e.ALPHANUMERIC, this.data = n;
  }
  return t.getBitsLength = function(a) {
    return 11 * Math.floor(a / 2) + 6 * (a % 2);
  }, t.prototype.getLength = function() {
    return this.data.length;
  }, t.prototype.getBitsLength = function() {
    return t.getBitsLength(this.data.length);
  }, t.prototype.write = function(a) {
    let o;
    for (o = 0; o + 2 <= this.data.length; o += 2) {
      let i = r.indexOf(this.data[o]) * 45;
      i += r.indexOf(this.data[o + 1]), a.put(i, 11);
    }
    this.data.length % 2 && a.put(r.indexOf(this.data[o]), 6);
  }, On = t, On;
}
var qn, sa;
function If() {
  if (sa) return qn;
  sa = 1;
  const e = Kr();
  function r(t) {
    this.mode = e.BYTE, typeof t == "string" ? this.data = new TextEncoder().encode(t) : this.data = new Uint8Array(t);
  }
  return r.getBitsLength = function(n) {
    return n * 8;
  }, r.prototype.getLength = function() {
    return this.data.length;
  }, r.prototype.getBitsLength = function() {
    return r.getBitsLength(this.data.length);
  }, r.prototype.write = function(t) {
    for (let n = 0, a = this.data.length; n < a; n++) t.put(this.data[n], 8);
  }, qn = r, qn;
}
var Fn, ca;
function _f() {
  if (ca) return Fn;
  ca = 1;
  const e = Kr(), r = Dr();
  function t(n) {
    this.mode = e.KANJI, this.data = n;
  }
  return t.getBitsLength = function(a) {
    return a * 13;
  }, t.prototype.getLength = function() {
    return this.data.length;
  }, t.prototype.getBitsLength = function() {
    return t.getBitsLength(this.data.length);
  }, t.prototype.write = function(n) {
    let a;
    for (a = 0; a < this.data.length; a++) {
      let o = r.toSJIS(this.data[a]);
      if (o >= 33088 && o <= 40956) o -= 33088;
      else if (o >= 57408 && o <= 60351) o -= 49472;
      else throw new Error("Invalid SJIS character: " + this.data[a] + `
Make sure your charset is UTF-8`);
      o = (o >>> 8 & 255) * 192 + (o & 255), n.put(o, 13);
    }
  }, Fn = t, Fn;
}
var Pn = { exports: {} }, ua;
function Af() {
  return ua || (ua = 1, (function(e) {
    var r = { single_source_shortest_paths: function(t, n, a) {
      var o = {}, i = {};
      i[n] = 0;
      var s = r.PriorityQueue.make();
      s.push(n, 0);
      for (var f, g, h, v, w, p, m, x, j; !s.empty(); ) {
        f = s.pop(), g = f.value, v = f.cost, w = t[g] || {};
        for (h in w) w.hasOwnProperty(h) && (p = w[h], m = v + p, x = i[h], j = typeof i[h] > "u", (j || x > m) && (i[h] = m, s.push(h, m), o[h] = g));
      }
      if (typeof a < "u" && typeof i[a] > "u") {
        var P = ["Could not find a path from ", n, " to ", a, "."].join("");
        throw new Error(P);
      }
      return o;
    }, extract_shortest_path_from_predecessor_list: function(t, n) {
      for (var a = [], o = n; o; ) a.push(o), t[o], o = t[o];
      return a.reverse(), a;
    }, find_path: function(t, n, a) {
      var o = r.single_source_shortest_paths(t, n, a);
      return r.extract_shortest_path_from_predecessor_list(o, a);
    }, PriorityQueue: { make: function(t) {
      var n = r.PriorityQueue, a = {}, o;
      t = t || {};
      for (o in n) n.hasOwnProperty(o) && (a[o] = n[o]);
      return a.queue = [], a.sorter = t.sorter || n.default_sorter, a;
    }, default_sorter: function(t, n) {
      return t.cost - n.cost;
    }, push: function(t, n) {
      var a = { value: t, cost: n };
      this.queue.push(a), this.queue.sort(this.sorter);
    }, pop: function() {
      return this.queue.shift();
    }, empty: function() {
      return this.queue.length === 0;
    } } };
    e.exports = r;
  })(Pn)), Pn.exports;
}
var la;
function Sf() {
  return la || (la = 1, (function(e) {
    const r = Kr(), t = Ef(), n = Bf(), a = If(), o = _f(), i = ts(), s = Dr(), f = Af();
    function g(P) {
      return unescape(encodeURIComponent(P)).length;
    }
    function h(P, S, _) {
      const M = [];
      let W;
      for (; (W = P.exec(_)) !== null; ) M.push({ data: W[0], index: W.index, mode: S, length: W[0].length });
      return M;
    }
    function v(P) {
      const S = h(i.NUMERIC, r.NUMERIC, P), _ = h(i.ALPHANUMERIC, r.ALPHANUMERIC, P);
      let M, W;
      return s.isKanjiModeEnabled() ? (M = h(i.BYTE, r.BYTE, P), W = h(i.KANJI, r.KANJI, P)) : (M = h(i.BYTE_KANJI, r.BYTE, P), W = []), S.concat(_, M, W).sort(function(R, N) {
        return R.index - N.index;
      }).map(function(R) {
        return { data: R.data, mode: R.mode, length: R.length };
      });
    }
    function w(P, S) {
      switch (S) {
        case r.NUMERIC:
          return t.getBitsLength(P);
        case r.ALPHANUMERIC:
          return n.getBitsLength(P);
        case r.KANJI:
          return o.getBitsLength(P);
        case r.BYTE:
          return a.getBitsLength(P);
      }
    }
    function p(P) {
      return P.reduce(function(S, _) {
        const M = S.length - 1 >= 0 ? S[S.length - 1] : null;
        return M && M.mode === _.mode ? (S[S.length - 1].data += _.data, S) : (S.push(_), S);
      }, []);
    }
    function m(P) {
      const S = [];
      for (let _ = 0; _ < P.length; _++) {
        const M = P[_];
        switch (M.mode) {
          case r.NUMERIC:
            S.push([M, { data: M.data, mode: r.ALPHANUMERIC, length: M.length }, { data: M.data, mode: r.BYTE, length: M.length }]);
            break;
          case r.ALPHANUMERIC:
            S.push([M, { data: M.data, mode: r.BYTE, length: M.length }]);
            break;
          case r.KANJI:
            S.push([M, { data: M.data, mode: r.BYTE, length: g(M.data) }]);
            break;
          case r.BYTE:
            S.push([{ data: M.data, mode: r.BYTE, length: g(M.data) }]);
        }
      }
      return S;
    }
    function x(P, S) {
      const _ = {}, M = { start: {} };
      let W = ["start"];
      for (let U = 0; U < P.length; U++) {
        const R = P[U], N = [];
        for (let k = 0; k < R.length; k++) {
          const C = R[k], q = "" + U + k;
          N.push(q), _[q] = { node: C, lastCount: 0 }, M[q] = {};
          for (let B = 0; B < W.length; B++) {
            const F = W[B];
            _[F] && _[F].node.mode === C.mode ? (M[F][q] = w(_[F].lastCount + C.length, C.mode) - w(_[F].lastCount, C.mode), _[F].lastCount += C.length) : (_[F] && (_[F].lastCount = C.length), M[F][q] = w(C.length, C.mode) + 4 + r.getCharCountIndicator(C.mode, S));
          }
        }
        W = N;
      }
      for (let U = 0; U < W.length; U++) M[W[U]].end = 0;
      return { map: M, table: _ };
    }
    function j(P, S) {
      let _;
      const M = r.getBestModeForData(P);
      if (_ = r.from(S, M), _ !== r.BYTE && _.bit < M.bit) throw new Error('"' + P + '" cannot be encoded with mode ' + r.toString(_) + `.
 Suggested mode is: ` + r.toString(M));
      switch (_ === r.KANJI && !s.isKanjiModeEnabled() && (_ = r.BYTE), _) {
        case r.NUMERIC:
          return new t(P);
        case r.ALPHANUMERIC:
          return new n(P);
        case r.KANJI:
          return new o(P);
        case r.BYTE:
          return new a(P);
      }
    }
    e.fromArray = function(S) {
      return S.reduce(function(_, M) {
        return typeof M == "string" ? _.push(j(M, null)) : M.data && _.push(j(M.data, M.mode)), _;
      }, []);
    }, e.fromString = function(S, _) {
      const M = v(S, s.isKanjiModeEnabled()), W = m(M), U = x(W, _), R = f.find_path(U.map, "start", "end"), N = [];
      for (let k = 1; k < R.length - 1; k++) N.push(U.table[R[k]].node);
      return e.fromArray(p(N));
    }, e.rawSplit = function(S) {
      return e.fromArray(v(S, s.isKanjiModeEnabled()));
    };
  })(Nn)), Nn;
}
var fa;
function Tf() {
  if (fa) return kn;
  fa = 1;
  const e = Dr(), r = uo(), t = hf(), n = pf(), a = mf(), o = gf(), i = bf(), s = es(), f = wf(), g = xf(), h = kf(), v = Kr(), w = Sf();
  function p(U, R) {
    const N = U.size, k = o.getPositions(R);
    for (let C = 0; C < k.length; C++) {
      const q = k[C][0], B = k[C][1];
      for (let F = -1; F <= 7; F++) if (!(q + F <= -1 || N <= q + F)) for (let G = -1; G <= 7; G++) B + G <= -1 || N <= B + G || (F >= 0 && F <= 6 && (G === 0 || G === 6) || G >= 0 && G <= 6 && (F === 0 || F === 6) || F >= 2 && F <= 4 && G >= 2 && G <= 4 ? U.set(q + F, B + G, true, true) : U.set(q + F, B + G, false, true));
    }
  }
  function m(U) {
    const R = U.size;
    for (let N = 8; N < R - 8; N++) {
      const k = N % 2 === 0;
      U.set(N, 6, k, true), U.set(6, N, k, true);
    }
  }
  function x(U, R) {
    const N = a.getPositions(R);
    for (let k = 0; k < N.length; k++) {
      const C = N[k][0], q = N[k][1];
      for (let B = -2; B <= 2; B++) for (let F = -2; F <= 2; F++) B === -2 || B === 2 || F === -2 || F === 2 || B === 0 && F === 0 ? U.set(C + B, q + F, true, true) : U.set(C + B, q + F, false, true);
    }
  }
  function j(U, R) {
    const N = U.size, k = g.getEncodedBits(R);
    let C, q, B;
    for (let F = 0; F < 18; F++) C = Math.floor(F / 3), q = F % 3 + N - 8 - 3, B = (k >> F & 1) === 1, U.set(C, q, B, true), U.set(q, C, B, true);
  }
  function P(U, R, N) {
    const k = U.size, C = h.getEncodedBits(R, N);
    let q, B;
    for (q = 0; q < 15; q++) B = (C >> q & 1) === 1, q < 6 ? U.set(q, 8, B, true) : q < 8 ? U.set(q + 1, 8, B, true) : U.set(k - 15 + q, 8, B, true), q < 8 ? U.set(8, k - q - 1, B, true) : q < 9 ? U.set(8, 15 - q - 1 + 1, B, true) : U.set(8, 15 - q - 1, B, true);
    U.set(k - 8, 8, 1, true);
  }
  function S(U, R) {
    const N = U.size;
    let k = -1, C = N - 1, q = 7, B = 0;
    for (let F = N - 1; F > 0; F -= 2) for (F === 6 && F--; ; ) {
      for (let G = 0; G < 2; G++) if (!U.isReserved(C, F - G)) {
        let A = false;
        B < R.length && (A = (R[B] >>> q & 1) === 1), U.set(C, F - G, A), q--, q === -1 && (B++, q = 7);
      }
      if (C += k, C < 0 || N <= C) {
        C -= k, k = -k;
        break;
      }
    }
  }
  function _(U, R, N) {
    const k = new t();
    N.forEach(function(G) {
      k.put(G.mode.bit, 4), k.put(G.getLength(), v.getCharCountIndicator(G.mode, U)), G.write(k);
    });
    const C = e.getSymbolTotalCodewords(U), q = s.getTotalCodewordsCount(U, R), B = (C - q) * 8;
    for (k.getLengthInBits() + 4 <= B && k.put(0, 4); k.getLengthInBits() % 8 !== 0; ) k.putBit(0);
    const F = (B - k.getLengthInBits()) / 8;
    for (let G = 0; G < F; G++) k.put(G % 2 ? 17 : 236, 8);
    return M(k, U, R);
  }
  function M(U, R, N) {
    const k = e.getSymbolTotalCodewords(R), C = s.getTotalCodewordsCount(R, N), q = k - C, B = s.getBlocksCount(R, N), F = k % B, G = B - F, A = Math.floor(k / B), V = Math.floor(q / B), L = V + 1, y = A - V, z = new f(y);
    let D = 0;
    const I = new Array(B), H = new Array(B);
    let X = 0;
    const Z = new Uint8Array(U.buffer);
    for (let ae = 0; ae < B; ae++) {
      const fe = ae < G ? V : L;
      I[ae] = Z.slice(D, D + fe), H[ae] = z.encode(I[ae]), D += fe, X = Math.max(X, fe);
    }
    const ee = new Uint8Array(k);
    let ce = 0, ue, ie;
    for (ue = 0; ue < X; ue++) for (ie = 0; ie < B; ie++) ue < I[ie].length && (ee[ce++] = I[ie][ue]);
    for (ue = 0; ue < y; ue++) for (ie = 0; ie < B; ie++) ee[ce++] = H[ie][ue];
    return ee;
  }
  function W(U, R, N, k) {
    let C;
    if (Array.isArray(U)) C = w.fromArray(U);
    else if (typeof U == "string") {
      let A = R;
      if (!A) {
        const V = w.rawSplit(U);
        A = g.getBestVersionForData(V, N);
      }
      C = w.fromString(U, A || 40);
    } else throw new Error("Invalid data");
    const q = g.getBestVersionForData(C, N);
    if (!q) throw new Error("The amount of data is too big to be stored in a QR Code");
    if (!R) R = q;
    else if (R < q) throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + q + `.
`);
    const B = _(R, N, C), F = e.getSymbolSize(R), G = new n(F);
    return p(G, R), m(G), x(G, R), P(G, N, 0), R >= 7 && j(G, R), S(G, B), isNaN(k) && (k = i.getBestMask(G, P.bind(null, G, N))), i.applyMask(k, G), P(G, N, k), { modules: G, version: R, errorCorrectionLevel: N, maskPattern: k, segments: C };
  }
  return kn.create = function(R, N) {
    if (typeof R > "u" || R === "") throw new Error("No input text");
    let k = r.M, C, q;
    return typeof N < "u" && (k = r.from(N.errorCorrectionLevel, r.M), C = g.from(N.version), q = i.from(N.maskPattern), N.toSJISFunc && e.setToSJISFunction(N.toSJISFunc)), W(R, C, k, q);
  }, kn;
}
var Mn = {}, Hn = {}, da;
function ns() {
  return da || (da = 1, (function(e) {
    function r(t) {
      if (typeof t == "number" && (t = t.toString()), typeof t != "string") throw new Error("Color should be defined as hex string");
      let n = t.slice().replace("#", "").split("");
      if (n.length < 3 || n.length === 5 || n.length > 8) throw new Error("Invalid hex color: " + t);
      (n.length === 3 || n.length === 4) && (n = Array.prototype.concat.apply([], n.map(function(o) {
        return [o, o];
      }))), n.length === 6 && n.push("F", "F");
      const a = parseInt(n.join(""), 16);
      return { r: a >> 24 & 255, g: a >> 16 & 255, b: a >> 8 & 255, a: a & 255, hex: "#" + n.slice(0, 6).join("") };
    }
    e.getOptions = function(n) {
      n || (n = {}), n.color || (n.color = {});
      const a = typeof n.margin > "u" || n.margin === null || n.margin < 0 ? 4 : n.margin, o = n.width && n.width >= 21 ? n.width : void 0, i = n.scale || 4;
      return { width: o, scale: o ? 4 : i, margin: a, color: { dark: r(n.color.dark || "#000000ff"), light: r(n.color.light || "#ffffffff") }, type: n.type, rendererOpts: n.rendererOpts || {} };
    }, e.getScale = function(n, a) {
      return a.width && a.width >= n + a.margin * 2 ? a.width / (n + a.margin * 2) : a.scale;
    }, e.getImageWidth = function(n, a) {
      const o = e.getScale(n, a);
      return Math.floor((n + a.margin * 2) * o);
    }, e.qrToImageData = function(n, a, o) {
      const i = a.modules.size, s = a.modules.data, f = e.getScale(i, o), g = Math.floor((i + o.margin * 2) * f), h = o.margin * f, v = [o.color.light, o.color.dark];
      for (let w = 0; w < g; w++) for (let p = 0; p < g; p++) {
        let m = (w * g + p) * 4, x = o.color.light;
        if (w >= h && p >= h && w < g - h && p < g - h) {
          const j = Math.floor((w - h) / f), P = Math.floor((p - h) / f);
          x = v[s[j * i + P] ? 1 : 0];
        }
        n[m++] = x.r, n[m++] = x.g, n[m++] = x.b, n[m] = x.a;
      }
    };
  })(Hn)), Hn;
}
var ha;
function zf() {
  return ha || (ha = 1, (function(e) {
    const r = ns();
    function t(a, o, i) {
      a.clearRect(0, 0, o.width, o.height), o.style || (o.style = {}), o.height = i, o.width = i, o.style.height = i + "px", o.style.width = i + "px";
    }
    function n() {
      try {
        return document.createElement("canvas");
      } catch {
        throw new Error("You need to specify a canvas element");
      }
    }
    e.render = function(o, i, s) {
      let f = s, g = i;
      typeof f > "u" && (!i || !i.getContext) && (f = i, i = void 0), i || (g = n()), f = r.getOptions(f);
      const h = r.getImageWidth(o.modules.size, f), v = g.getContext("2d"), w = v.createImageData(h, h);
      return r.qrToImageData(w.data, o, f), t(v, g, h), v.putImageData(w, 0, 0), g;
    }, e.renderToDataURL = function(o, i, s) {
      let f = s;
      typeof f > "u" && (!i || !i.getContext) && (f = i, i = void 0), f || (f = {});
      const g = e.render(o, i, f), h = f.type || "image/png", v = f.rendererOpts || {};
      return g.toDataURL(h, v.quality);
    };
  })(Mn)), Mn;
}
var Dn = {}, pa;
function Cf() {
  if (pa) return Dn;
  pa = 1;
  const e = ns();
  function r(a, o) {
    const i = a.a / 255, s = o + '="' + a.hex + '"';
    return i < 1 ? s + " " + o + '-opacity="' + i.toFixed(2).slice(1) + '"' : s;
  }
  function t(a, o, i) {
    let s = a + o;
    return typeof i < "u" && (s += " " + i), s;
  }
  function n(a, o, i) {
    let s = "", f = 0, g = false, h = 0;
    for (let v = 0; v < a.length; v++) {
      const w = Math.floor(v % o), p = Math.floor(v / o);
      !w && !g && (g = true), a[v] ? (h++, v > 0 && w > 0 && a[v - 1] || (s += g ? t("M", w + i, 0.5 + p + i) : t("m", f, 0), f = 0, g = false), w + 1 < o && a[v + 1] || (s += t("h", h), h = 0)) : f++;
    }
    return s;
  }
  return Dn.render = function(o, i, s) {
    const f = e.getOptions(i), g = o.modules.size, h = o.modules.data, v = g + f.margin * 2, w = f.color.light.a ? "<path " + r(f.color.light, "fill") + ' d="M0 0h' + v + "v" + v + 'H0z"/>' : "", p = "<path " + r(f.color.dark, "stroke") + ' d="' + n(h, g, f.margin) + '"/>', m = 'viewBox="0 0 ' + v + " " + v + '"', j = '<svg xmlns="http://www.w3.org/2000/svg" ' + (f.width ? 'width="' + f.width + '" height="' + f.width + '" ' : "") + m + ' shape-rendering="crispEdges">' + w + p + `</svg>
`;
    return typeof s == "function" && s(null, j), j;
  }, Dn;
}
var ma;
function jf() {
  if (ma) return et;
  ma = 1;
  const e = df(), r = Tf(), t = zf(), n = Cf();
  function a(o, i, s, f, g) {
    const h = [].slice.call(arguments, 1), v = h.length, w = typeof h[v - 1] == "function";
    if (!w && !e()) throw new Error("Callback required as last argument");
    if (w) {
      if (v < 2) throw new Error("Too few arguments provided");
      v === 2 ? (g = s, s = i, i = f = void 0) : v === 3 && (i.getContext && typeof g > "u" ? (g = f, f = void 0) : (g = f, f = s, s = i, i = void 0));
    } else {
      if (v < 1) throw new Error("Too few arguments provided");
      return v === 1 ? (s = i, i = f = void 0) : v === 2 && !i.getContext && (f = s, s = i, i = void 0), new Promise(function(p, m) {
        try {
          const x = r.create(s, f);
          p(o(x, i, f));
        } catch (x) {
          m(x);
        }
      });
    }
    try {
      const p = r.create(s, f);
      g(null, o(p, i, f));
    } catch (p) {
      g(p);
    }
  }
  return et.create = r.create, et.toCanvas = a.bind(null, t.render), et.toDataURL = a.bind(null, t.renderToDataURL), et.toString = a.bind(null, function(o, i, s) {
    return n.render(o, s);
  }), et;
}
var os = jf();
const Rf = ss(os), Jf = cs({ __proto__: null, default: Rf }, [os]);
export {
  le as B,
  Ff as a,
  Jf as b,
  Pf as c,
  Mf as d,
  Ra as e,
  Hf as f,
  Df as g,
  Kf as h,
  pt as i,
  Vf as j,
  Nu as k,
  Yf as l,
  Xf as m,
  Kt as n,
  Nf as o,
  Lf as p,
  Gf as q,
  iu as r,
  Wf as s
};
