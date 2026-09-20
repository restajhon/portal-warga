# EPIC INDEX

## Epic Metadata

### Epic Title
Autentikasi & Manajemen Akun

### Priority
Must Have (BRD EPIC-001)

### Owner
Resta

### Target Release / Timeline
Sprint 1 (2026-10-19 — 2026-11-01) [Usulan] — PEP-PWR-001

## 1. Overview

### Epic Summary
Warga dan pengurus RW membutuhkan akses aman ke portal. Warga dapat membuat akun sendiri dari portal menggunakan email dan password, sedangkan pengurus mengelola verifikasi/status akun, role, permission, dan dashboard sesuai kewenangan.

### Business Objective
Membatasi akses sistem hanya untuk warga dan pengurus RW yang telah diverifikasi (BRD §2 tujuan, BO-02) — dasar kepercayaan bahwa konten dan data komunitas hanya dilihat warga setempat.

### Target Users
- Warga RW terverifikasi (menggunakan login dan dashboard)
- Super Admin (mengelola role/permission, approval keuangan, dan audit log)
- Admin (mengelola akun warga, konten, dan layanan warga)
- Operasional (menjalankan tugas operasional sesuai permission)

### Success Metrics
- Warga dapat mendaftarkan akun sendiri tanpa dibuatkan pengurus.
- Login menggunakan email dan password yang dibuat saat registrasi.
- Pengurus dapat memverifikasi, menonaktifkan, dan mengaktifkan akun warga.
- Tidak ada insiden akses tanpa verifikasi.

## 2. Scope

### Scope / Key Capabilities
- Registrasi mandiri warga dengan email dan password.
- Verifikasi/status akun oleh pengurus.
- Login dan sesi pengguna.
- Manajemen data akun warga (data warga, kontak, aktivasi/nonaktivasi).
- Manajemen role pengurus: Super Admin, Admin, dan Operasional.
- Dashboard warga.

### Out of Scope
- Lupa password mandiri / reset via email (kandidat fase berikutnya — recovery MVP dibantu Admin dan dapat dieskalasikan ke Super Admin).
- SSO / login media sosial.
- Multi-RW / multi-tenant.

## 3. Delivery Considerations

### Assumptions
- Akun pertama (admin RW) di-seed oleh developer saat setup; admin berikutnya ditetapkan admin lain.
- Warga menerima kredensial akun secara offline dari pengurus (mis. saat koordinasi RT/RW).

### Dependencies
- Konfirmasi aturan verifikasi akun dan hak akses warga bersama Pak Jono/RW (BRD Lampiran B #4, PEP D-akses).
- Data awal warga & struktur pengurus (PEP D03).

### Risks
- Distribusi kredensial offline memperlambat adopsi bila tidak terorganisir (PEP R03/R05 mitigasi).

## 4. Execution

### User Stories
| Story | Story File | Design File | Testing File | PM Sync |
|-------|------------|-------------|--------------|---------|
| Warga login ke portal | `e01-us01--warga-login---story.md` | `e01-us01--warga-login---design.md` | `e01-us01--warga-login---testing.md` | Not synced |

### Acceptance Criteria / Epic Completion Criteria
- Warga dapat registrasi dengan email/password, login, dan melihat dashboard setelah memenuhi aturan status/verifikasi akun.
- Pengurus dapat memverifikasi, menonaktifkan, dan mengubah role akun pengurus sesuai permission.
- RBAC role pengurus berfungsi: Super Admin, Admin, dan Operasional — masing-masing hanya melihat menu/aksi sesuai permission. Warga adalah account type dengan akses portal warga (ITA §6.3).
- Tidak ada endpoint/URL yang dapat diakses tanpa login (kecuali halaman login & info minimal portal).

---

<!--
FILE LOCATION: docs/features/phase-01-mvp-portal-warga/e-01---autentikasi-akun/index.md

RELATED FILES:
- ../goals.md
- e01-us01--warga-login---story.md
- e01-us01--warga-login---design.md
- e01-us01--warga-login---testing.md
-->
