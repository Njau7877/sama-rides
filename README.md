# Sama Rides

A Kenya-focused ride-hailing platform foundation. This repository contains a Next.js web application and API, a PostgreSQL/Prisma data model, secure cookie sessions, passenger registration and ride requests, fare estimates, driver availability, admin-assisted driver matching, ride lifecycle controls and payment-recording scaffolding.

## Stack
- Next.js 15 / React 19 / TypeScript
- PostgreSQL + Prisma ORM
- Zod request validation, bcrypt password hashing, signed HTTP-only session cookies
- REST endpoints under `/api`

## Local setup
1. Install Node.js 20.9+ and PostgreSQL.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL`, a random `AUTH_SECRET` of at least 32 characters, and private `ADMIN_NAME`, `ADMIN_PHONE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` values. The admin password must be at least 12 characters.
4. Run `npm install`.
5. Run `npx prisma generate` then `npx prisma db push`.
6. Run `npm run db:seed` once to create the first administrator account.
7. Run `npm run dev`; open http://localhost:3000. The passenger portal is at `/ride`.
8. Check `GET /api/health` for API/database status.

## API
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/rides/estimate`, `POST /api/rides`, `GET /api/rides`
- `GET /api/rides/:id`, `PATCH /api/rides/:id`
- `PATCH /api/drivers/availability`
- `POST /api/drivers/match` (admin-only)
- `GET/POST /api/admin/drivers` (admin-only)
- `POST /api/payments` (cash payment recording; M-Pesa disabled until Daraja credentials and verified callbacks are configured)

## Important before public launch
This is a committed application foundation, not a claim of production readiness. The passenger portal currently accepts manually entered coordinates, distance and ETA. Before carrying live passenger trips: connect a trusted maps/routing provider (never trust client-submitted route distance in production), build the dedicated driver and operations workspaces, add rate limiting and abuse controls, implement driver onboarding/document verification, implement M-Pesa Daraja STK Push and signed callbacks, add real-time location transport, monitoring, backups, privacy/retention controls, automated tests and a security review. Do not use the sample fare values as public pricing without commercial approval.

## Deployment
Deploy the Next.js app to Vercel or another Node-compatible host. Configure environment variables in the host dashboard, then run Prisma migrations as a release step. Never commit real secrets or production database URLs.
