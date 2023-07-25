// src/index.ts
import fastifyPlugin from "fastify-plugin";
import { createAuthMiddleware, getSession } from "authey";

// src/middie.js
import reusify from "reusify";
import { pathToRegexp } from "path-to-regexp";
function middie(complete) {
  const middlewares = [];
  const pool = reusify(Holder);
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
      regexp = pathToRegexp(sanitizePrefixUrl(url), [], {
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
  const middleware = createAuthMiddleware(options);
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
    return getSession(req.raw, options);
  });
};
var fastifyNextAuth = fastifyPlugin(plugin, {
  fastify: "4.x",
  name: "fastify-next-auth"
});
var src_default = fastifyNextAuth;
export {
  src_default as default,
  fastifyNextAuth
};
/*!
 * Original code by Fastify
 * MIT Licensed, Copyright 2017-2018 Fastify, see https://github.com/fastify/middie/blob/master/LICENSE for details
 *
 * Credits to the Fastify team for the middleware support logic:
 * https://github.com/fastify/middie/blob/master/lib/engine.js
 */
