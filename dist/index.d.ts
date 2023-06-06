import * as fastify from 'fastify';
import { FastifyRequest, FastifyPluginAsync } from 'fastify';
import { Session, AuthConfig } from '@auth/core/types';
export { AuthConfig } from '@auth/core/types';

declare const fastifyNextAuth: FastifyPluginAsync<AuthConfig, fastify.RawServerDefault, fastify.FastifyTypeProviderDefault>;

declare module 'fastify' {
    interface FastifyInstance {
        getSession(req: FastifyRequest): Session;
    }
}

export { fastifyNextAuth as default, fastifyNextAuth };
