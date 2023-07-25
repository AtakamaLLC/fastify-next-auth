"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  fastifyNextAuth: () => fastifyNextAuth
});
module.exports = __toCommonJS(src_exports);
var import_fastify_plugin = __toESM(require("fastify-plugin"));
var import_authey = require("authey");

// src/middie.js
var import_reusify = __toESM(require("reusify"));
var import_path_to_regexp = require("path-to-regexp");
function middie(complete) {
  const middlewares = [];
  const pool = (0, import_reusify.default)(Holder);
  return {
    use,
    run
  };
  function use(url, f) {
    if (f === void 0) {
      f = url;
      url = null;
    }
    let regexp;
    if (url) {
      regexp = (0, import_path_to_regexp.pathToRegexp)(sanitizePrefixUrl(url), [], {
        end: false,
        strict: false
      });
    }
    if (Array.isArray(f)) {
      for (const val of f) {
        middlewares.push({
          regexp,
          fn: val
        });
      }
    } else {
      middlewares.push({
        regexp,
        fn: f
      });
    }
    return this;
  }
  function run(req, res, ctx) {
    if (!middlewares.length) {
      complete(null, req, res, ctx);
      return;
    }
    req.originalUrl = req.url;
    const holder = pool.get();
    holder.req = req;
    holder.res = res;
    holder.url = sanitizeUrl(req.url);
    holder.context = ctx;
    holder.done();
  }
  function Holder() {
    this.next = null;
    this.req = null;
    this.res = null;
    this.url = null;
    this.context = null;
    this.i = 0;
    const that = this;
    this.done = function(err) {
      const req = that.req;
      const res = that.res;
      const url = that.url;
      const context = that.context;
      const i = that.i++;
      req.url = req.originalUrl;
      if (res.finished === true || res.writableEnded === true) {
        that.req = null;
        that.res = null;
        that.context = null;
        that.i = 0;
        pool.release(that);
        return;
      }
      if (err || middlewares.length === i) {
        complete(err, req, res, context);
        that.req = null;
        that.res = null;
        that.context = null;
        that.i = 0;
        pool.release(that);
      } else {
        const middleware = middlewares[i];
        const fn = middleware.fn;
        const regexp = middleware.regexp;
        if (regexp) {
          const result = regexp.exec(url);
          if (result) {
            req.url = req.url.replace(result[0], "");
            if (req.url[0] !== "/")
              req.url = `/${req.url}`;
            fn(req, res, that.done);
          } else {
            that.done();
          }
        } else {
          fn(req, res, that.done);
        }
      }
    };
  }
}
function sanitizeUrl(url) {
  for (let i = 0, len = url.length; i < len; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 63 || charCode === 35)
      return url.slice(0, i);
  }
  return url;
}
function sanitizePrefixUrl(url) {
  if (url === "")
    return url;
  if (url === "/")
    return "";
  if (url[url.length - 1] === "/")
    return url.slice(0, -1);
  return url;
}
var middie_default = middie;

// src/index.ts
var plugin = async (fastify, options) => {
  const middleware = (0, import_authey.createAuthMiddleware)(options);
  const middie2 = middie_default((err, _req, _res, next) => {
    next(err);
  });
  middie2.use(middleware);
  function runMiddie(req, reply, next) {
    req.raw.originalUrl = req.raw.url;
    req.raw.id = req.id;
    req.raw.hostname = req.hostname;
    req.raw.ip = req.ip;
    req.raw.ips = req.ips;
    req.raw.log = req.log;
    req.raw.body = req.body;
    req.raw.query = req.query;
    reply.raw.log = req.log;
    for (const [key, val] of Object.entries(reply.getHeaders())) {
      reply.raw.setHeader(key, val);
    }
    middie2.run(req.raw, reply.raw, next);
  }
  fastify.addHook("onRequest", runMiddie);
  fastify.decorate("getSession", function(req) {
    return (0, import_authey.getSession)(req.raw, options);
  });
};
var fastifyNextAuth = (0, import_fastify_plugin.default)(plugin, {
  fastify: "4.x",
  name: "fastify-next-auth"
});
var src_default = fastifyNextAuth;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fastifyNextAuth
});
/*!
 * Original code by Fastify
 * MIT Licensed, Copyright 2017-2018 Fastify, see https://github.com/fastify/middie/blob/master/LICENSE for details
 *
 * Credits to the Fastify team for the middleware support logic:
 * https://github.com/fastify/middie/blob/master/lib/engine.js
 */
