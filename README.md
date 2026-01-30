# PayPrompt

Mobile-first invoice tracker for freelancers: clients, invoices, and due-date tracking.

## Monorepo
- `backend/` Fastify + Prisma (SQLite by default)
- `mobile/` Expo React Native app

## Quickstart (local)

### 1) Backend

```bash
cd backend
cp .env.example .env
# IMPORTANT: set a strong JWT_SECRET
npm install
npm run db   # runs prisma migrate dev
npm run dev
```

Health check:

```bash
curl http://127.0.0.1:4000/health
```

### 2) Mobile

```bash
cd mobile
npm install
npm run start
```

Notes:
- Android emulator needs `http://10.0.2.2:4000` to reach the host machine.
- iOS simulator can use `http://localhost:4000`.
- Real device must use your LAN IP (e.g. `http://192.168.1.122:4000`).

The app shows the active API base URL under **Settings → Connection**.

## API routes
- `POST /auth/register` → `{ email, password }`
- `POST /auth/login` → `{ email, password }`
- `GET /clients` (auth)
- `POST /clients` (auth)
- `DELETE /clients/:id` (auth)
- `GET /invoices` (auth)
- `POST /invoices` (auth)
- `PATCH /invoices/:id` (auth)
