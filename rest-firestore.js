/* ===== REST Firestore Client (جایگزین کامل SDK استریمی) ===== */
function createRestFirestore(projectId, relayBase) {
  var DB = relayBase + '/v1/projects/' + projectId + '/databases/(default)/documents';
  var DBROOT = relayBase + '/v1/projects/' + projectId + '/databases/(default)';

  function authHeaders() {
    var u = firebase.auth().currentUser;
    if (!u) return Promise.resolve({ 'Content-Type': 'application/json' });
    return u.getIdToken().then(function (t) {
      return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t };
    });
  }
  function autoId() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var s = '';
    for (var i = 0; i < 20; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  }
  function jsToVal(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(jsToVal) } };
    if (typeof v === 'object') return { mapValue: { fields: jsToFields(v) } };
    return { stringValue: String(v) };
  }
  function jsToFields(obj) {
    var f = {};
    for (var k in obj) if (obj[k] !== undefined) f[k] = jsToVal(obj[k]);
    return f;
  }
  function valToJs(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return parseInt(v.integerValue, 10);
    if ('doubleValue' in v) return v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('nullValue' in v) return null;
    if ('timestampValue' in v) return v.timestampValue;
    if ('mapValue' in v) return fieldsToJs(v.mapValue.fields || {});
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(valToJs);
    return null;
  }
  function fieldsToJs(fields) {
    var o = {};
    for (var k in fields) o[k] = valToJs(fields[k]);
    return o;
  }
  function nameToId(name) { var p = name.split('/'); return p[p.length - 1]; }
  function fetchJson(url, opts) {
    return fetch(url, opts).then(function (r) {
      if (r.status === 404) return { __notFound: true };
      return r.json().then(function (j) { if (!r.ok) throw (j.error || j); return j; });
    });
  }

  function DocRef(path) {
    this.path = path;
    this.id = nameToId(path);
  }
  DocRef.prototype.collection = function (name) { return new ColRef(this.path + '/' + name); };
  DocRef.prototype.get = function () {
    var self = this;
    return authHeaders().then(function (h) {
      return fetchJson(DB + '/' + self.path, { headers: h });
    }).then(function (j) {
      if (j.__notFound) return { exists: false, data: function () { return undefined; }, id: self.id, ref: self };
      return { exists: true, data: function () { return fieldsToJs(j.fields || {}); }, id: self.id, ref: self };
    });
  };
  DocRef.prototype.set = function (data, opts) {
    var self = this;
    var merge = opts && opts.merge;
    return authHeaders().then(function (h) {
      var url = DB + '/' + self.path;
      if (merge) url += '?' + Object.keys(data).map(function (k) { return 'updateMask.fieldPaths=' + encodeURIComponent(k); }).join('&');
      return fetchJson(url, { method: 'PATCH', headers: h, body: JSON.stringify({ fields: jsToFields(data) }) });
    });
  };
  DocRef.prototype.update = function (obj) { return this.set(obj, { merge: true }); };
  DocRef.prototype.delete = function () {
    var self = this;
    return authHeaders().then(function (h) { return fetchJson(DB + '/' + self.path, { method: 'DELETE', headers: h }); });
  };

  function ColRef(path) {
    this.path = path;
    this._where = null; this._order = null; this._limit = null;
  }
  ColRef.prototype.doc = function (id) {
    return new DocRef(this.path + '/' + (id || autoId()));
  };
  ColRef.prototype.where = function (field, op, value) {
    var c = new ColRef(this.path); c._where = { field: field, op: op, value: value };
    c._order = this._order; c._limit = this._limit; return c;
  };
  ColRef.prototype.orderBy = function (field, dir) {
    var c = new ColRef(this.path); c._where = this._where;
    c._order = { field: field, dir: (dir === 'desc' ? 'DESCENDING' : 'ASCENDING') };
    c._limit = this._limit; return c;
  };
  ColRef.prototype.limit = function (n) {
    var c = new ColRef(this.path); c._where = this._where; c._order = this._order; c._limit = n; return c;
  };
  var OPMAP = { '==': 'EQUAL', '!=': 'NOT_EQUAL', '<': 'LESS_THAN', '<=': 'LESS_THAN_OR_EQUAL', '>': 'GREATER_THAN', '>=': 'GREATER_THAN_OR_EQUAL' };
  ColRef.prototype.get = function () {
    var self = this;
    var segs = this.path.split('/');
    var collectionId = segs[segs.length - 1];
    var parentPath = segs.slice(0, -1).join('/');
    var sq = { from: [{ collectionId: collectionId }] };
    if (this._where) {
      sq.where = { fieldFilter: { field: { fieldPath: this._where.field }, op: OPMAP[this._where.op] || 'EQUAL', value: jsToVal(this._where.value) } };
    }
    if (this._order) sq.orderBy = [{ field: { fieldPath: this._order.field }, direction: this._order.dir }];
    if (this._limit) sq.limit = this._limit;
    return authHeaders().then(function (h) {
      var url = DB + (parentPath ? '/' + parentPath : '') + ':runQuery';
      return fetchJson(url, { method: 'POST', headers: h, body: JSON.stringify({ structuredQuery: sq }) });
    }).then(function (rows) {
      var docs = [];
      (rows || []).forEach(function (row) {
        if (!row.document) return;
        var id = nameToId(row.document.name);
        var data = fieldsToJs(row.document.fields || {});
        docs.push({ id: id, data: function () { return data; }, ref: new DocRef(self.path + '/' + id) });
      });
      return {
        docs: docs, empty: docs.length === 0,
        forEach: function (fn) { docs.forEach(fn); }
      };
    });
  };

  function Batch() {
    this.writes = [];
  }
  Batch.prototype.set = function (ref, data, opts) {
    var merge = opts && opts.merge;
    var w = { update: { name: DBROOT.replace(relayBase + '/v1/', relayBase + '/v1/') , fields: jsToFields(data) } };
    w.update.name = 'projects/' + projectId + '/databases/(default)/documents/' + ref.path;
    if (merge) w.updateMask = { fieldPaths: Object.keys(data) };
    this.writes.push(w); return this;
  };
  Batch.prototype.update = function (ref, obj) {
    var w = { update: { name: 'projects/' + projectId + '/databases/(default)/documents/' + ref.path, fields: jsToFields(obj) }, updateMask: { fieldPaths: Object.keys(obj) } };
    this.writes.push(w); return this;
  };
  Batch.prototype.delete = function (ref) {
    this.writes.push({ delete: 'projects/' + projectId + '/databases/(default)/documents/' + ref.path });
    return this;
  };
  Batch.prototype.commit = function () {
    var w = this.writes;
    return authHeaders().then(function (h) {
      return fetchJson(DB + ':commit', { method: 'POST', headers: h, body: JSON.stringify({ writes: w }) });
    });
  };

  return {
    collection: function (name) { return new ColRef(name); },
    batch: function () { return new Batch(); }
  };
}
