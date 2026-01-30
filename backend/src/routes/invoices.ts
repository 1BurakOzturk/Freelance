import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { zodErrorToMessage } from '../lib/validation.js';

const InvoiceCreate = z.object({
  clientId: z.string().min(1),
  title: z.string().min(1).max(160),
  amountCents: z.number().int().min(0),
  currency: z.string().min(3).max(3).default('TRY'),
  dueDate: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

const InvoiceStatus = z.enum(['DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE']);

const InvoiceUpdate = z.object({
  title: z.string().min(1).max(160).optional(),
  amountCents: z.number().int().min(0).optional(),
  currency: z.string().min(3).max(3).optional(),
  dueDate: z.string().datetime().optional(),
  status: InvoiceStatus.optional(),
  notes: z.string().max(2000).optional(),
  paidAt: z.string().datetime().nullable().optional(),
});

export async function invoiceRoutes(app: FastifyInstance) {
  app.get('/invoices', { preHandler: app.authenticate }, async (req) => {
    const userId = req.authUser!.sub;
    const items = await prisma.invoice.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { dueDate: 'asc' },
    });
    return { items };
  });

  app.post('/invoices', { preHandler: app.authenticate }, async (req, reply) => {
    const parsed = InvoiceCreate.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: zodErrorToMessage(parsed.error) });

    const userId = req.authUser!.sub;

    const client = await prisma.client.findFirst({ where: { id: parsed.data.clientId, userId } });
    if (!client) return reply.code(400).send({ error: 'invalid_client' });

    const item = await prisma.invoice.create({
      data: {
        userId,
        clientId: parsed.data.clientId,
        title: parsed.data.title,
        amountCents: parsed.data.amountCents,
        currency: parsed.data.currency,
        dueDate: new Date(parsed.data.dueDate),
        notes: parsed.data.notes,
      },
      include: { client: true },
    });

    return reply.code(201).send({ item });
  });

  app.patch('/invoices/:id', { preHandler: app.authenticate }, async (req, reply) => {
    const parsed = InvoiceUpdate.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: zodErrorToMessage(parsed.error) });

    const userId = req.authUser!.sub;
    const id = (req.params as any).id as string;

    const existing = await prisma.invoice.findFirst({ where: { id, userId } });
    if (!existing) return reply.code(404).send({ error: 'not_found' });

    const item = await prisma.invoice.update({
      where: { id },
      data: {
        ...('title' in parsed.data ? { title: parsed.data.title } : {}),
        ...('amountCents' in parsed.data ? { amountCents: parsed.data.amountCents } : {}),
        ...('currency' in parsed.data ? { currency: parsed.data.currency } : {}),
        ...('status' in parsed.data ? { status: parsed.data.status as any } : {}),
        ...('notes' in parsed.data ? { notes: parsed.data.notes } : {}),
        ...('dueDate' in parsed.data && parsed.data.dueDate ? { dueDate: new Date(parsed.data.dueDate) } : {}),
        ...('paidAt' in parsed.data ? { paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : null } : {}),
      },
      include: { client: true },
    });

    return reply.send({ item });
  });
}
