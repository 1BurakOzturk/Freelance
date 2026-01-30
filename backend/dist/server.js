import 'dotenv/config';
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { decorateAuth } from './lib/auth.js';
import { authRoutes } from './routes/auth.js';
import { clientRoutes } from './routes/clients.js';
import { invoiceRoutes } from './routes/invoices.js';
const app = Fastify({ logger: true });
await app.register(helmet);
await app.register(cors, {
    origin: (origin, cb) => {
        // Allow no-origin (mobile) and localhost for dev.
        if (!origin)
            return cb(null, true);
        if (origin.includes('localhost'))
            return cb(null, true);
        return cb(null, false);
    },
});
await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
});
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    app.log.error('Missing JWT_SECRET in environment');
    process.exit(1);
}
await app.register(jwt, { secret: JWT_SECRET });
decorateAuth(app);
app.get('/health', async () => ({ ok: true }));
await app.register(authRoutes);
await app.register(clientRoutes);
await app.register(invoiceRoutes);
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || '127.0.0.1';
await app.listen({ port, host });
//# sourceMappingURL=server.js.map