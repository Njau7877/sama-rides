# Claude Code execution prompt

Read CLAUDE.md first and treat it as the project brief.

You are taking over the complete Sama Rides repository. Do not stop at an audit or give me recommendations only. Inspect every file and the existing public Sama Rides site, run the project, identify the actual problems, then implement the strongest coherent version of the app.

Work in this order:
1. Audit the existing code, security, database schema, UI, API and CI. Run install, Prisma validation/generation, typecheck, tests and build. Fix the current implementation's real failures.
2. Make a prioritized plan, then execute it. Use a branch and commits. Do not wait for me to approve ordinary engineering choices.
3. Complete the passenger, driver and operations/admin product surfaces. All screens and buttons must work against real API/database behavior; no fake live data.
4. Harden auth, RBAC, resource ownership, ride lifecycle transitions, dispatch concurrency, payment idempotency, validation, rate limiting, audit logs and error handling.
5. Implement reliable maps/routing, real-time updates, notifications and M-Pesa Daraja through provider adapters. Use sandbox mode when credentials are absent and clearly label it. Never simulate a live payment.
6. Redesign the entire responsive UI to a premium Sama Rides standard, keeping the brand. Test mobile/tablet/desktop and accessibility.
7. Add meaningful automated tests and CI gates. Run the full suite and fix every issue you can reproduce.
8. Update README, environment template, deployment/migration instructions and the final handover report. State what is complete, what awaits real credentials, and what remains.

Important constraints:
- The current repo is an independent rebuild. Do not claim access to the original site's private source/backend.
- Do not break or replace the existing live site. Do not alter DNS or production data.
- Never commit secrets or use real customer data.
- Do not claim deployment, payment integration or production readiness unless actually verified.
- Ask me only for credentials or decisions that cannot safely be inferred. Do not ask me to choose routine technical details.
- Preserve working functionality; refactor where necessary; avoid unnecessary microservices.
- Deliver code and commits, not just a report.

Start by reading CLAUDE.md, then inspect the repository and begin the work.
