import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export type AuthUser = { sub: string; email: string };

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: AuthUser;
  }

  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// NOTE: We intentionally *do not* register this as a Fastify plugin to avoid
// encapsulation issues. Call `decorateAuth(app)` on the root instance.
export function decorateAuth(app: FastifyInstance) {
  app.decorate('authenticate', async (req: FastifyRequest, _reply: FastifyReply) => {
    const decoded = await req.jwtVerify<AuthUser>();
    req.authUser = decoded;
  });
}
