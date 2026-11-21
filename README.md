# Sama Rides

A Kenya-focused ride-hailing platform foundation. This repository contains a Next.js web application and API, a PostgreSQL/Prisma data model, secure cookie sessions, passenger ride requests, fare estimates, driver availability, admin-assisted driver matching, ride lifecycle controls and payment-recording scaffolding.

## Stack
- Next.js 15 / React 19 / TypeScript
- PostgreSQL + Prisma ORM
- Zod request validation, bcrypt password hashing, signed HTTP-only session cookies
- REST endpoints under `/api`

## Local setup
1. Install Node.js 20.9+ and PostgreSQL.
2. Copy `.env.example` to `.env`; set `DATABASE_URL` and a random `AUTH_SECRET` of at least 32 characters.
3. Run `npm install`.
4. Run `npx prisma generate` then `npx prisma db push`.
5. Run `npm run dev`; open http://localhost:3000.
6. Check `GET /api/health` for API/database status.

## API
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/rides/estimate`, `POST /api/rides`, `GET /api/rides`
- `GET /api/rides/:id`, `PATCH /api/rides/:id`
- `PATCH /api/drivers/availability`
- `POST /api/drivers/match` (admin-only)
- `GET/POST /api/admin/drivers` (admin-only)
- `POST /api/payments` (cash payment recording; M-Pesa disabled until Daraja credentials and verified callbacks are configured)

## Production checklist
This is a committed application foundation, not a claim of production readiness. Before carrying live passenger trips: configure managed PostgreSQL, deploy the app, add rate limiting and abuse controls, implement driver onboarding/document verification and a secure admin bootstrap, integrate a maps/routing provider for trusted distance/ETA (never trust client-submitted route distance in production), implement M-Pesa Daraja STK Push and signed callbacks, add real-time location transport, monitoring, backups, privacy/retention controls, automated tests and a security review. Do not use the sample fare values as public pricing without commercial approval.

## Deployment
Deploy the Next.js app to Vercel or another Node-compatible host. Configure environment variables in the host dashboard, then run Prisma migrations as a release step. Never commit real secrets or production database URLs.
