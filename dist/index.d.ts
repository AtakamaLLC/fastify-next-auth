import { Session, AuthConfig } from '@auth/core/types';
export { AuthConfig } from '@auth/core/types';
import { FastifyRequest, FastifyPluginAsync } from 'fastify';

declare const fastifyNextAuth: FastifyPluginAsync<AuthConfig>;

declare module 'fastify' {
    interface FastifyInstance {
        getSession(req: FastifyRequest): Session;
    }
}

export { fastifyNextAuth as default, fastifyNextAuth };