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
var import_engine = __toESM(require("@fastify/middie/lib/engine"));
var import_authey = require("authey");
var plugin = async (fastify, options) => {
  const middleware = (0, import_authey.createAuthMiddleware)(options);
  const middie = (0, import_engine.default)((err, _req, _res, next) => {
    next(err);
  });
  middie.use(middleware);
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
    middie.run(req.raw, reply.raw, next);
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
