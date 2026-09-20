# Portal Warga RW

Portal warga dan CMS pengurus RW berbasis Next.js.

## Current phase

Phase 01 — foundation dan autentikasi warga.

Role pengurus:

- `SUPER_ADMIN`
- `ADMIN`
- `OPERASIONAL`

`WARGA` adalah account type, bukan role pengurus. Audit log hanya dapat dilihat Super Admin. Password awal dibuat sendiri oleh warga melalui activation flow dan tidak pernah dapat dilihat pengurus.

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

## Documentation

Requirement dan arsitektur berada di `docs/project/`. Feature documentation fase MVP berada di `docs/features/`.
