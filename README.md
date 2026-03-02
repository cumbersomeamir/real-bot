# DealFlow AI

DealFlow AI is a full-stack real estate revenue recovery platform for Indian developers. It combines lead intake, AI qualification, follow-up automation, broker accountability, analytics, and compliance.

## Monorepo Structure

- `frontend/` — Next.js 15 App Router application
- `backend/` — Express + Prisma (MongoDB) + BullMQ API and workers

## Tech Stack

### Frontend

- Next.js 15.1.0
- React 19
- TailwindCSS
- Framer Motion
- Recharts
- Zustand
- NextAuth

### Backend

- Express 4
- Prisma 5 + MongoDB
- BullMQ + Redis
- Socket.IO
- JWT auth + RBAC

## Quick Start

### 1. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

### 3. Start Redis
Run Redis + MongoDB locally (recommended via Docker):

```bash
cd /Users/rajeevkumar/Downloads/real-bot
docker compose up -d
```

### 4. Push schema and seed

MongoDB note: Prisma with MongoDB requires a **replica set** (MongoDB Atlas works out of the box; for local dev you can start a local single-node replica set).

```bash
chmod +x ./scripts/mongo-replset-start.sh
./scripts/mongo-replset-start.sh
```

```bash
cd backend
npm run setup
```

### 5. Run apps

```bash
# Terminal 1
cd backend && npm run dev:all

# Terminal 2
cd frontend && npm run dev
```

### 6. Demo login

- Email: `owner@dealflow.ai`
- Password: `Password@123`

### 7. Verify capabilities quickly

```bash
cd /Users/rajeevkumar/Downloads/real-bot
./scripts/smoke-test.sh
```

### 8. Verify all capabilities (full sweep)

```bash
cd /Users/rajeevkumar/Downloads/real-bot
./scripts/capabilities-check.sh
```

## API Response Contract

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "meta": { "page": 1, "limit": 20, "total": 150 }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number is invalid",
    "details": []
  }
}
```

## Core Modules

1. Lead Intake Engine
2. AI Qualification Engine
3. Automated Follow-Up Engine
4. Broker Accountability System
5. Reactivation Engine
6. Revenue Intelligence Dashboard
7. Admin & Compliance Layer

## Realtime and Queues

- Socket.IO events for lead updates, assignments, and agent activity
- BullMQ queues: lead processing, follow-up, communication, reactivation, scoring, voice calls, reporting

## Future Features (Stubbed)

- AI Chat Assistant
- Webhook Builder
- Custom Report Builder
- Multi-language support
- Mobile app shell
- Channel partner portal
- Client portal
- AI price optimization
- Demand heatmap
- Dynamic ad optimizer
- Sell-through predictor
- Document generation
- Payment tracking
- WhatsApp chatbot builder
- API marketplace

Each has frontend placeholder pages and backend API stubs returning:

```json
{ "status": "not_implemented", "message": "Feature coming soon" }
```
# real-bot
