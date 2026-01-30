import 'dotenv/config';
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
const app = Fastify({ logger: true });
await app.register(helmet);
await app.register(cors, {
    origin: (origin, cb) => {
        // Allow same-origin / no-origin (mobile), and local dev.
        if (!origin)
            return cb(null, true);
        if (origin.includes('localhost'))
            return cb(null, true);
        return cb(null, false);
    },
});
await app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
});
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    app.log.error('Missing JWT_SECRET in environment');
    process.exit(1);
}
await app.register(jwt, { secret: JWT_SECRET });
app.get('/health', async () => ({ ok: true }));
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || '127.0.0.1';
await app.listen({ port, host });
//# sourceMappingURL=server.js.map