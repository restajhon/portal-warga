# PHASE GOALS

## Phase Name

MVP Portal Warga RW

## Business Goals

- Menyediakan pusat informasi digital RW (berita, pengumuman, agenda, dokumentasi, perkembangan kegiatan) yang hanya dapat diakses warga terverifikasi.
- Menyelenggarakan transparansi keuangan RW melalui pencatatan transaksi terstruktur dan publikasi laporan berkala.
- Membuka kanal komunikasi dua arah yang terlacak antara warga dan pengurus (Laporan Warga).
- Memungkinkan pelaporan warga yang sedang sakit dengan menjaga privasi data kesehatan.

## Success Criteria

- Seluruh 23 fitur Must Have (BRD §5.2) berfungsi dan lulus UAT bersama pengurus RW dan perwakilan warga (PEP M4).
- Tiga siklus end-to-end berjalan: informasi, keuangan, dan laporan warga (BRD §2.2 poin 2–4).
- Tidak ada akses tanpa verifikasi; detail data kesehatan tidak pernah tampil kepada warga lain (BRD §2.2 poin 5–6).
- Portal nyaman digunakan di smartphone maupun desktop.

## Included Epics

| Epic | Epic Folder | Sprint (PEP) | Status |
|------|-------------|--------------|--------|
| EPIC-001 Autentikasi & Manajemen Akun | `e-01---autentikasi-akun/` | S1 | In Progress |
| EPIC-002 Portal Informasi & CMS Konten | `e-02---portal-informasi-cms/` | S2 | Planned |
| EPIC-003 Keuangan RW | `e-03---keuangan-rw/` | S3 | Planned |
| EPIC-004 Laporan Warga | `e-04---laporan-warga/` | S4 | Planned |
| EPIC-005 Pelaporan Warga Sedang Sakit | `e-05---pelaporan-sakit/` | S5 | Planned |

> Folder epic e-02 s.d. e-05 akan dibuat saat epic terkait mulai dikerjakan (run `/pm:feature` per epic).

## Out of Scope

- Tanda tangan digital, siskamling, modul "Saran dan Keluhan – Hallo Pak Lurah" (BRD §5.3).
- Aplikasi mobile native, pembayaran iuran online, integrasi kelurahan/pihak eksternal.

## Dependencies

- Konfirmasi scope MVP bersama Pak Jono (PEP D01 — akhir Sprint 0).
- Data awal warga & struktur pengurus dari RW (PEP D03 — akhir Sprint 2).
- Keputusan infrastruktur produksi domain/hosting (PEP D04 — akhir Sprint 5).

## Risks

- Respons pihak RW lambat menghambat konfirmasi scope dan UAT (PEP R01).
- Kapasitas developer tunggal berkurang (PEP R02).
- Data awal warga tidak siap saat onboarding (PEP R03).

---

<!--
FILE LOCATION: docs/features/phase-01-mvp-portal-warga/goals.md

RELATED FILES:
- ../../project/portal-warga-rw/01-BRD.md (BRD-PWR-001)
- ../../project/portal-warga-rw/02-PEP.md (PEP-PWR-001)
-->
