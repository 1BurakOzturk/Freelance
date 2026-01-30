import type { FastifyInstance } from 'fastify';
export type AuthUser = {
    sub: string;
    email: string;
};
declare module 'fastify' {
    interface FastifyRequest {
        authUser?: AuthUser;
    }
    interface FastifyInstance {
        authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
export declare function decorateAuth(app: FastifyInstance): void;
//# sourceMappingURL=auth.d.ts.map