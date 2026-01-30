import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { zodErrorToMessage } from '../lib/validation.js';
const ClientCreate = z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(200).optional(),
    phone: z.string().max(50).optional(),
    company: z.string().max(120).optional(),
    notes: z.string().max(2000).optional(),
});
export async function clientRoutes(app) {
    app.get('/clients', { preHandler: app.authenticate }, async (req) => {
        const userId = req.authUser.sub;
        const items = await prisma.client.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
        return { items };
    });
    app.post('/clients', { preHandler: app.authenticate }, async (req, reply) => {
        const parsed = ClientCreate.safeParse(req.body);
        if (!parsed.success)
            return reply.code(400).send({ error: zodErrorToMessage(parsed.error) });
        const userId = req.authUser.sub;
        const item = await prisma.client.create({ data: { userId, ...parsed.data } });
        return reply.code(201).send({ item });
    });
    app.delete('/clients/:id', { preHandler: app.authenticate }, async (req, reply) => {
        const userId = req.authUser.sub;
        const id = req.params.id;
        const existing = await prisma.client.findFirst({ where: { id, userId } });
        if (!existing)
            return reply.code(404).send({ error: 'not_found' });
        await prisma.client.delete({ where: { id } });
        return reply.send({ ok: true });
    });
}
//# sourceMappingURL=clients.js.map