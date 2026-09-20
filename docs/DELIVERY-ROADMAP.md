# End-to-End Delivery Roadmap
## Portal Warga RW

Status: Working roadmap
Branch: `feature/phase-01-foundation`

## Delivery order

### Phase 0 — Foundation and technical hardening

- Finalize Prisma domain model and migrations
- Auth.js session, registration, login, logout, password recovery plan
- RBAC server-side helpers for Warga, Admin, Operasional, Super Admin
- Audit log foundation
- Shared UI shell and responsive design tokens
- Error handling, rate limiting, validation, and secure response policy
- Seed development data without committed credentials

Gate: lint, unit tests, build, schema review, security review.

### Phase 1 — EPIC-001 Auth & account management

- Self-registration warga with email/password
- Login/logout and protected dashboard
- Account status and profile
- Admin account verification/status management
- Pengurus role management
- Role-based routing and permission checks

Acceptance: warga can register, log in, reach dashboard, and cannot access CMS-only routes; pengurus routes enforce role permissions.

### Phase 2 — EPIC-002 Information portal and CMS

- News and announcements CRUD
- Agenda and activity CRUD
- Documentation upload and listing
- Program/progress updates
- Warga information feed and detail pages
- Publish/draft visibility rules

Acceptance: pengurus can draft/publish content and warga only sees published content after login.

### Phase 3 — EPIC-003 RW finance

- Income/expense transaction entry
- Categories, amount, date, description
- Internal transfer receipt upload
- Running balance and period summaries
- Finance report draft, approval, and publication
- Warga read-only published reports
- PDF/XLSX export

Acceptance: transaction totals reconcile, evidence is internal-only, Super Admin approval is required for publication, and warga cannot access internal evidence.

### Phase 4 — EPIC-004 citizen reports

- Warga create report/complaint/aspiration/help request
- Pengurus inbox and triage
- Response/timeline
- Status transitions: submitted, reviewing, processing, resolved, unable to process
- Warga history and status tracking
- Reporter edit rules; no reporter deletion

Acceptance: every transition is authorized and auditable; warga can only see their own reports and permitted public responses.

### Phase 5 — EPIC-005 sickness reports

- Warga submit sickness report and assistance need
- Restricted management view
- Server-side field-level protection for health details
- Role/permission matrix for sensitive access
- Access audit for every detail view
- Redacted list view and safe notifications

Acceptance: health details never appear in public/warga responses and every authorized detail access is logged.

### Phase 6 — QA, release, and operations

- Unit, integration, and Playwright E2E suites
- Accessibility and responsive checks
- Security checks: auth, RBAC, enumeration, rate limiting, upload validation
- QA/staging deployment
- Regression and UAT with representative warga/pengurus scenarios
- Release candidate approval by Tech Lead
- Production deployment
- Smoke test and monitoring

## Delivery gates per feature

1. Ticket with acceptance criteria
2. Technical refinement with Tech Lead, Developer, and QA
3. Breakdown, estimate, and PIC
4. Implementation with tests
5. Pull Request and code review
6. Merge to development/staging
7. QA test
8. Bug loop until QA Passed
9. Release candidate approval
10. Production smoke test

## Definition of Done

- Acceptance criteria pass
- Server-side authorization exists
- Validation and generic security errors exist
- Unit/integration tests exist for business logic
- E2E coverage exists for critical happy/error paths
- No secret or sensitive data committed
- Documentation and migration notes updated
- `npm run lint`, `npm run test`, and `npm run build` pass
- QA Passed recorded before release
