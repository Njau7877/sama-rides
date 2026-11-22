# Sama Rides — Engineering Handoff

You are the lead engineer responsible for reviewing and completing this repository into the strongest practical Sama Rides ride-hailing platform. The owner wants a complete, coherent product—not a throwaway MVP, disconnected code fragments, or a visual-only mock-up.

## Repository and product context

- Repository: https://github.com/Njau7877/sama-rides
- Existing public service/reference site: https://samas.masomo.website
- This repository is a new, independent implementation. The existing site's private source code, database and backend have not been provided. Do not claim to have recovered or connected to them.
- Preserve the existing Sama Rides brand and the live service while developing this implementation. Do not replace the live site or change production DNS without explicit approval.
- Current stack: Next.js 15, React 19, TypeScript, Prisma 6, PostgreSQL, bcryptjs, jose, Zod. See package.json and prisma/schema.prisma.
- Current UI: landing page at / and passenger portal at /ride.
- Current API routes include authentication, health, passenger rides, ride estimates, driver availability, driver matching and admin driver records.
- Local PostgreSQL compose file: docker-compose.yml. Environment template: .env.example. CI workflow: .github/workflows/ci.yml.
- The current implementation is an early foundation. It is NOT production-ready and must be reviewed before extending it.

## First: inspect and establish the truth

1. Read every file in the repository. Do not assume README claims match implementation.
2. Inspect https://samas.masomo.website as a visual and product reference where publicly accessible. Record actual flows, brand elements, routes and content. Public inspection does not reveal private backend functionality.
3. Run dependency installation, Prisma validation/generation, type checking, linting, tests and production build. Fix all errors before declaring success.
4. Review every API route and authorization boundary. Look for security flaws, incorrect state transitions, race conditions, insecure defaults, fake data and unhandled failures.
5. Produce a short audit and prioritized implementation plan, then continue into implementation without waiting for routine approval. Ask only when a real external credential, legal/commercial decision, or destructive production action is required.
6. Use a feature branch and meaningful commits. Preserve the existing main branch and do not discard working code without a reason.

## Product objective

Build a polished, reliable, Kenya-first ride-hailing product that can compete on customer experience and operational quality. It should serve passengers, drivers, fleet/operations staff and administrators. Design for expansion beyond Kenya without hard-coding Kenya-specific assumptions throughout the domain model.

## Required product surfaces

### Passenger experience
- Responsive, accessible web app with polished mobile-first experience.
- Registration, login, logout, account/profile, secure session handling and account recovery approach.
- Map-based pickup/drop-off selection, place search, address confirmation and route preview.
- Server-calculated fare estimates with transparent fare components and configurable pricing.
- Vehicle classes, nearby driver availability, request/dispatch lifecycle and cancellation rules.
- Real-time driver assignment, driver details, vehicle details, pickup ETA and live trip progress.
- Trip history, receipts, payment status, ratings, support/contact and complaint flows.
- Scheduled rides and multi-stop trips if implemented coherently.
- Safety centre, trip sharing, emergency contact/SOS workflow with honest operational caveats.
- Clear loading, empty, offline, validation, permission-denied and error states.

### Driver experience
- Dedicated driver portal with secure role checks.
- Driver application/onboarding, document and vehicle submission, verification status.
- Online/offline availability, location permission handling, location updates and connection status.
- Incoming ride offers with accept/decline and expiry.
- Navigation handoff, pickup/arrival/start/complete actions with server-side state validation.
- Earnings, trip history, ratings, payout records and support.
- Driver safety and incident reporting.

### Operations and admin
- Role-based admin and operations dashboard, not a hidden generic page.
- Live trip monitoring, dispatch queue, driver map/status and manual reassignment controls.
- Driver/fleet management, verification review and suspension controls.
- Pricing configuration with audit history.
- User support, complaints, cancellations, refunds and incident management.
- Payment reconciliation, operational reports and CSV exports.
- Admin actions must be audited. Protect privileged roles and bootstrap the first admin securely.

## Backend and architecture requirements

- Review whether a modular Next.js API is appropriate or whether a separate service is justified. Avoid unnecessary microservices; use a clean modular architecture first.
- PostgreSQL with real migrations, indexes, constraints and transaction-safe operations.
- Strong validation at all boundaries; server-side fare and route authority.
- Password hashing, secure HTTP-only cookies, CSRF protections where applicable, session rotation/revocation and rate limiting.
- Authorization checks on every protected resource, including ownership and role. Never trust role or user IDs supplied by the browser.
- Robust ride state machine; reject invalid transitions and use transactions/locking/idempotency to prevent double assignment or duplicate payment.
- Real-time updates using a production-suitable WebSocket/realtime service, with reconnect and polling fallback.
- Background jobs for notifications, matching, receipts and retries where appropriate.
- Structured logs, request IDs, audit events, health/readiness endpoints and monitoring hooks.
- Secure file storage for driver documents; do not store private documents in public static folders.
- Data minimization, retention and deletion processes; protect personal location and payment information.
- Tests: unit, API/integration, authorization, ride lifecycle, fare calculation, dispatch concurrency and critical end-to-end flows.

## Kenya-specific integrations

- M-Pesa Daraja STK Push and callback verification, with idempotent payment processing and reconciliation. Implement safely behind environment variables and sandbox mode. Never fake a successful payment or hard-code credentials.
- Support KES, E.164 phone numbers, Africa/Nairobi timezone and local address conventions.
- Maps/routing provider such as Google Maps or Mapbox. Do not invent distances/ETAs or trust coordinates/fare submitted by a client.
- SMS/WhatsApp/email notifications should be provider adapters with environment-configured credentials and delivery status.
- Make provider integrations swappable and testable. If credentials are absent, implement a clear sandbox/mock adapter that cannot be mistaken for live payment or dispatch.

## UI quality bar

- Deliver a distinctive, premium, coherent Sama Rides visual identity.
- Design mobile-first; test common phone, tablet and desktop sizes.
- Use reusable components, consistent spacing, typography, color, accessible contrast and keyboard navigation.
- Use real product interactions, not buttons that do nothing or fake live data.
- Keep forms short and clear; validate inline; display helpful success/failure feedback.
- Include skeletons, empty states, retry states and graceful network failure handling.
- Avoid claiming features are live when provider credentials or deployment are absent.

## Deployment and delivery

- Provide repeatable local setup, Docker development services, environment documentation and migration/seed instructions.
- Prepare production deployment configuration for a suitable frontend host and managed PostgreSQL; document any separate worker/realtime hosting needs.
- Add CI checks for install, Prisma validation, typecheck, lint, tests and build.
- Never commit secrets, real customer data, production database URLs or private keys.
- Do not deploy, migrate production data, alter DNS or incur paid provider costs without explicit owner approval.
- Deliver a final report distinguishing: completed and tested; implemented but awaiting credentials; still outstanding; and deployment steps the owner must perform.
- Include exact commands, required environment variables, integration account requirements and test evidence.
- Do not say "zero errors", "production-ready" or "fully integrated" unless the corresponding checks and real integrations have been verified.

## Definition of done

A feature is done only when its UI, API, database behavior, authorization, validation, error handling and tests work together. The whole app is done only after clean install, Prisma validation, typecheck, lint, tests and production build pass, and core passenger/driver/admin journeys have been exercised. External services must be clearly marked as sandbox or awaiting credentials until actually connected.

Take ownership of the engineering work, make sound decisions, preserve useful existing work, and optimize for a secure, usable, genuinely deployable Sama Rides product.
