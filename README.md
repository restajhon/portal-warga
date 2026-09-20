# Portal Warga RW

Portal warga dan CMS pengurus RW berbasis Next.js.

## Current phase

Phase 01 — foundation dan autentikasi warga.

Role pengurus:

- `SUPER_ADMIN`
- `ADMIN`
- `OPERASIONAL`

`WARGA` adalah account type, bukan role pengurus. Warga dapat membuat akun sendiri dari portal menggunakan email dan password. Pengurus dapat memverifikasi, menonaktifkan, atau mengaktifkan akun sesuai kewenangan. Audit log hanya dapat dilihat Super Admin. Password tidak pernah dapat dilihat pengurus.

## Local setup

```bash
npm install
cp .env.example .env
# isi DATABASE_URL untuk database PostgreSQL development
npm run db:generate
npm run dev
```

## Verification commands

```bash
npm run lint
npm run test
npm run build
```

## Development workflow

Workflow wajib: `docs/DEVELOPMENT-WORKFLOW.md` — technical refinement → breakdown/assignment → development → self-test → PR/code review → staging → QA → release approval → production smoke test → monitoring.

## Documentation

Requirement dan arsitektur berada di `docs/project/`. Feature documentation fase MVP berada di `docs/features/`.

