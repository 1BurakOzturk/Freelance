import { z } from 'zod';
import argon2 from 'argon2';
import { prisma } from '../lib/prisma.js';
import { zodErrorToMessage } from '../lib/validation.js';
const RegisterBody = z.object({
    email: z.string().email().max(200),
    password: z.string().min(8).max(200),
});
const LoginBody = RegisterBody;
export async function authRoutes(app) {
    app.post('/auth/register', async (req, reply) => {
        const parsed = RegisterBody.safeParse(req.body);
        if (!parsed.success)
            return reply.code(400).send({ error: zodErrorToMessage(parsed.error) });
        const email = parsed.data.email.toLowerCase();
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists)
            return reply.code(409).send({ error: 'email_already_exists' });
        const password = await argon2.hash(parsed.data.password);
        const user = await prisma.user.create({ data: { email, password } });
        const token = await reply.jwtSign({ sub: user.id, email: user.email }, { expiresIn: '30d' });
        return reply.send({ token, user: { id: user.id, email: user.email } });
    });
    app.post('/auth/login', async (req, reply) => {
        const parsed = LoginBody.safeParse(req.body);
        if (!parsed.success)
            return reply.code(400).send({ error: zodErrorToMessage(parsed.error) });
        const email = parsed.data.email.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return reply.code(401).send({ error: 'invalid_credentials' });
        const ok = await argon2.verify(user.password, parsed.data.password);
        if (!ok)
            return reply.code(401).send({ error: 'invalid_credentials' });
        const token = await reply.jwtSign({ sub: user.id, email: user.email }, { expiresIn: '30d' });
        return reply.send({ token, user: { id: user.id, email: user.email } });
    });
}
//# sourceMappingURL=auth.js.map