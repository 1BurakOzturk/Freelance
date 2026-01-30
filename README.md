# PayPrompt

**Problem:** Freelancers & small agencies lose time and cashflow because invoices are not tracked and payment follow-ups are inconsistent.

**Target users:** Solo freelancers, small agencies, consultants.

**Solution:** Mobile-first invoice tracker with due-date reminders, simple client CRM, and a “follow-up timeline” so nothing slips.

## Monorepo
- `backend/` Fastify + Prisma (SQLite by default)
- `mobile/` Expo React Native app

## Security principles
- No hardcoded secrets; use `.env` files.
- Input validation (Zod).
- Auth (JWT) + password hashing.
- Rate limiting and basic security headers.

## Getting started (local)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm run start
```
