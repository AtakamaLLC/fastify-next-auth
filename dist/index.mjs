// src/index.ts
import fastifyPlugin from "fastify-plugin";
import Middie from "@fastify/middie/lib/engine";
import { createAuthMiddleware, getSession } from "authey";
var plugin = async (fastify, options) => {
  const middleware = createAuthMiddleware(options);
  const middie = Middie((err, _req, _res, next) => {
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
