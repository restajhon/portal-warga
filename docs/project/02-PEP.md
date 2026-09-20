# PROJECT EXECUTION PLAN
## Portal Warga RW

---

| Attribute | Value |
|-----------|-------|
| Document ID | PEP-PWR-001 |
| Version | 1.0 |
| Status | Draft |
| Author | Resta |
| Created | 2026-09-20 |
| Last Updated | 2026-09-20 |

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-20 | Resta | Initial draft berdasarkan BRD-PWR-001 v1.0 dan MoM Pak Jono |

---

## 1. Project Overview

### 1.1 Project Snapshot

| Attribute | Value |
|-----------|-------|
| Project Name | Portal Warga RW |
| Project Code | PWR-2026 |
| Project Type | Proyek sosial (non-komersial, tanpa anggaran pengembangan) |
| Start Date | 2026-10-05 [Usulan] |
| End Date | 2027-01-10 [Usulan] |
| Duration | ~3 bulan (7 sprint × 2 minggu) |
| Methodology | Scrum (diadaptasi untuk developer tunggal) |
| Sprint Duration | 2 minggu |
| Total Sprints | 7 sprint (Sprint 0 → Sprint 6) |
| Developer Allocation | 10–20 jam/minggu (side project) |
| BRD Reference | `docs/project/portal-warga-rw/01-BRD.md` (BRD-PWR-001) |
| ITA Reference | `docs/project/portal-warga-rw/03-ITA.md` (akan dibuat via `/haie:ita`) |

### 1.2 Reference Documents

| Document | Location | Status |
|----------|----------|--------|
| MoM | `mom/MoM_Portal_Warga_RW_Pak_Jono.md` | Approved (diskusi awal) |
| BRD | `docs/project/portal-warga-rw/01-BRD.md` | Draft v1.0 (9 Open Questions — Lampiran B BRD) |
| PEP | `docs/project/portal-warga-rw/02-PEP.md` | Dokumen ini |
| ITA | `docs/project/portal-warga-rw/03-ITA.md` | To be created via `/haie:ita` (target: akhir Sprint 0) |

> Catatan: Seluruh tanggal dalam dokumen ini bersifat **[Usulan]** — timeline final menunggu konfirmasi scope MVP bersama Pak Jono (BRD Lampiran B #1, #7). Struktur sprint dan urutan pengerjaan tetap berlaku meskipun tanggal bergeser.

---

## 2. Project Team

### 2.1 Client Team (RW)

| Role | Name | Responsibility |
|------|------|----------------|
| Project Sponsor | Pengurus RW [TBD — pihak berwenang persetujuan akhir perlu dikonfirmasi] | Approval, escalation, persetujuan scope & peluncuran |
| PIC Client | Pak Jono | Komunikasi utama, koordinasi harian, validasi kebutuhan |
| Admin RW | [TBD — nama perlu ditentukan] | Pengelolaan akun warga, konten, laporan warga; peserta UAT |
| Bendahara RW | [TBD — nama perlu ditentukan] | Input keuangan, penyusunan laporan; peserta UAT |
| Perwakilan Warga | [TBD — perlu ditunjuk saat UAT] | UAT dari sisi warga, feedback UX |

### 2.2 Tim Pengembang

| Role | Name | Allocation | Responsibility |
|------|------|------------|----------------|
| PM / Developer / Designer / QA | **Resta** (satu orang, semua peran) | 10–20 jam/minggu | Seluruh pengembangan, desain, testing, dokumentasi, koordinasi dengan RW |

> Catatan: Berbeda dari proyek komersial, proyek ini dikembangkan **mandiri oleh satu developer**. Peran PM/Dev/Designer/QA dipegang penuh oleh Resta. Konsekuensinya: ritme komunikasi disederhanakan (lihat §6), Definition of Done diadaptasi untuk solo development (lihat §8.1), dan timeline memperhitungkan alokasi waktu paruh waktu [Usulan: 10–20 jam/minggu].

### 2.3 RACI Matrix

| Deliverable | Sponsor (Pengurus RW) | PIC (Pak Jono) | Admin & Bendahara | Resta |
|-------------|----------------------|----------------|-------------------|-------|
| Requirements (BRD) | A | R | C | R |
| Architecture & user flow (ITA) | I | C | I | R/A |
| Design (UX/UI) | I | C | C | R |
| Development | I | I | I | R/A |
| Testing & QA | I | I | C | R/A |
| UAT | A | R | R | R |
| Go-Live & Sosialisasi | A | R | R | R |

*R=Responsible, A=Accountable, C=Consulted, I=Informed*

---

## 3. Scope

### 3.1 In Scope

Sumber fitur: BRD-PWR-001 §5.2. Total **23 fitur** terdistribusi ke 5 sprint pengembangan (lihat §5 Sprint Planning dan Lampiran A).

| Epic | Module/Feature Group | Priority | Total FEAT |
|------|----------------------|----------|------------|
| EPIC-001 | Autentikasi & Manajemen Akun (login, verifikasi akun, role, dashboard warga) | Must Have | 5 |
| EPIC-002 | Portal Informasi & CMS Konten (berita, pengumuman, agenda, dokumentasi, perkembangan) | Must Have | 5 |
| EPIC-003 | Keuangan RW (pemasukan/pengeluaran, bukti, rekap saldo, publikasi laporan) | Must Have | 5 |
| EPIC-004 | Laporan Warga (kirim laporan, proses, tanggapan, status, riwayat) | Must Have | 5 |
| EPIC-005 | Pelaporan Warga Sedang Sakit (lapor sakit, pengelolaan, pembatasan akses) | Must Have | 3 |

### 3.2 Out of Scope

Sumber: BRD-PWR-001 §5.3.

| # | Item | Reason | Future Phase? |
|---|------|--------|---------------|
| 1 | Tanda tangan digital | Tidak diperlukan tahap awal (MoM §6) | TBD |
| 2 | Siskamling | Tidak diperlukan tahap awal | TBD |
| 3 | Modul "Saran dan Keluhan – Hallo Pak Lurah" | Tidak digunakan; digantikan modul Laporan Warga (EPIC-004) | Tidak |
| 4 | Free Maintenance | Tidak termasuk | Tidak |
| 5 | Free Upgrade Aplikasi | Tidak termasuk | Tidak |
| 6 | Aplikasi mobile native Android/iOS | Tahap awal responsive web (MoM §3G) | Ya — dipertimbangkan setelah MVP tervalidasi |
| 7 | Pembayaran iuran online | Tidak termasuk tahap awal | Ya — fase berikutnya |
| 8 | Integrasi dengan kelurahan atau pihak eksternal | Tidak termasuk tahap awal | TBD |

### 3.3 Change Control

**Change Request (CR) Process:**

1. Requestor (Pak Jono / pengurus RW / Resta) mengajukan CR melalui kanal komunikasi proyek (WhatsApp/email ke Resta).
2. Resta menilai dampak dalam 3 hari kerja: effort, perubahan timeline, dampak ke modul lain.
3. **Threshold:**
   - Effort ≤ 3 hari kerja → Resta berwenang memutuskan.
   - Effort > 3 hari kerja, atau perubahan yang menambah/mengurangi scope MVP → perlu persetujuan pengurus RW (via Pak Jono).
4. Setelah disetujui → update PEP §5 (sprint plan) dan/atau dokumen SPEC terkait.

---

## 4. Timeline & Milestones

### 4.1 Project Timeline

```
W1-2      W3-4      W5-6      W7-8      W9-10     W11-12    W13-14
|---------|---------|---------|---------|---------|---------|
S0        S1        S2        S3        S4        S5        S6
Setup &   Auth,     Portal    Keuangan  Laporan   Sakit +   UAT &
Scope     Akun &    Info &    RW        Warga     Integrasi Go-Live
          Role      CMS
   ▲         ▲         ▲         ▲         ▲         ▲         ▲
  M1        —         —         —        M2        M3       M4/M5
```

### 4.2 Milestones

| ID | Milestone | Target Date | Deliverables | Status |
|----|-----------|-------------|--------------|--------|
| M1 | Persiapan & Scope Complete | 2026-10-18 [Usulan] | Open questions BRD terjawab bersama Pak Jono; alur pengguna & struktur database usulan; desain awal/prototype; usulan teknologi & infrastruktur | Pending |
| M2 | Modul Inti Selesai | 2026-12-13 [Usulan] | EPIC-001 s.d. EPIC-004 selesai (autentikasi, portal informasi, keuangan, laporan warga) — 20 dari 23 fitur working di staging | Pending |
| M3 | MVP Code-Complete | 2026-12-27 [Usulan] | Seluruh 23 fitur selesai termasuk EPIC-005; smoke test end-to-end lulus; siap UAT | Pending |
| M4 | UAT Complete | 2027-01-10 [Usulan] | UAT dengan pengurus RW & perwakilan warga selesai; sign-off; tidak ada bug critical terbuka | Pending |
| M5 | Go-Live & Sosialisasi | 2027-01-16 [Usulan] | Deployment produksi (domain/hosting sesuai keputusan infrastruktur); panduan pengguna; rencana sosialisasi kepada warga | Pending |

> Catatan libur: Natal (2026-12-25) jatuh di minggu kedua Sprint 5, Tahun Baru (2027-01-01) di minggu kedua Sprint 6. Beban kedua sprint tersebut sengaja lebih ringan (lihat §5) — Sprint 5 hanya 3 fitur + integrasi, Sprint 6 tanpa pengembangan fitur baru.

---

## 5. Sprint Planning

> Story points menggunakan Fibonacci (1, 2, 3, 5, 8) sebagai estimasi awal — akan di-refine saat sprint planning detail. Kapasitas acuan: ~17–19 SP per sprint untuk alokasi 10–20 jam/minggu [Usulan]. Sprint 0 tidak menghasilkan FEAT — berisi aktivitas persiapan.

### Sprint 0 — Persiapan & Discovery
**Duration:** 2026-10-05 — 2026-10-18 (2 minggu)

| # | Activity | Owner | Status |
|---|----------|-------|--------|
| 1 | Konfirmasi scope & prioritas MVP bersama Pak Jono (BRD Lampiran B #1) | Resta + Pak Jono | Planned |
| 2 | Konfirmasi penunjukan Admin RW & Bendahara pengguna CMS | Pak Jono/RW | Planned |
| 3 | Menyusun alur pengguna (user flow) untuk 3 role | Resta | Planned |
| 4 | Menyusun struktur database awal | Resta | Planned |
| 5 | Desain awal & prototype sistem | Resta | Planned |
| 6 | Usulan teknologi & infrastruktur (domain, hosting, storage) untuk dikonfirmasi Pak Jono (BRD Lampiran B #6) | Resta | Planned |
| 7 | ITA authorship dimulai | Resta | Planned |

**Sprint Goal:** Scope final, alur pengguna, struktur data, dan desain awal siap sebelum pengembangan dimulai; keputusan infrastruktur terkonfirmasi.

**Deliverables:**
- [ ] Scope MVP disepakati (catatan konfirmasi Pak Jono)
- [ ] User flow 3 role (warga, admin, bendahara)
- [ ] Struktur database awal (draft)
- [ ] Desain awal / prototype
- [ ] Usulan teknologi & infrastruktur + estimasi biaya operasional
- [ ] ITA draft v0.1
- [ ] **M1: Persiapan & Scope Complete**

---

### Sprint 1 — EPIC-001: Autentikasi, Akun & Role
**Duration:** 2026-10-19 — 2026-11-01 (2 minggu)

| Feature ID | Feature | Story Points | Owner | Status |
|------------|---------|--------------|-------|--------|
| FEAT-001 | Login dan autentikasi pengguna | 5 | Resta | Planned |
| FEAT-002 | Pembuatan & verifikasi akun warga oleh admin (tanpa pendaftaran publik) | 5 | Resta | Planned |
| FEAT-003 | Manajemen data akun warga (data warga, aktivasi/nonaktivasi) | 3 | Resta | Planned |
| FEAT-004 | Manajemen role Admin RW, Bendahara, dan Warga | 3 | Resta | Planned |
| FEAT-005 | Dashboard warga | 3 | Resta | Planned |

**Sprint Goal:** Warga dapat login ke portal dengan akun yang dibuat/dieverifikasi admin; pengurus memiliki role akses yang sesuai; dashboard warga dasar tersedia.

**Deliverables:**
- [ ] E2E: admin membuat akun → warga login → melihat dashboard (di staging)
- [ ] RBAC 3 role berfungsi (warga, admin, bendahara)
- [ ] ITA finalisasi

---

### Sprint 2 — EPIC-002: Portal Informasi & CMS Konten
**Duration:** 2026-11-02 — 2026-11-15 (2 minggu)

| Feature ID | Feature | Story Points | Owner | Status |
|------------|---------|--------------|-------|--------|
| FEAT-006 | CMS berita & pengumuman RW | 5 | Resta | Planned |
| FEAT-007 | CMS agenda & kegiatan RW | 5 | Resta | Planned |
| FEAT-008 | CMS dokumentasi kegiatan | 3 | Resta | Planned |
| FEAT-009 | CMS perkembangan kegiatan/program RW | 3 | Resta | Planned |
| FEAT-010 | Tampilan portal warga untuk membaca informasi (setelah login) | 3 | Resta | Planned |

**Sprint Goal:** Admin RW dapat mengelola dan mempublikasikan konten informasi; warga dapat membaca berita, pengumuman, agenda, dan perkembangan RW setelah login.

**Deliverables:**
- [ ] E2E: admin membuat berita/pengumuman/agenda → warga membacanya di portal (staging)
- [ ] Demo CMS konten untuk Pak Jono/pengurus

---

### Sprint 3 — EPIC-003: Keuangan RW
**Duration:** 2026-11-16 — 2026-11-29 (2 minggu)

| Feature ID | Feature | Story Points | Owner | Status |
|------------|---------|--------------|-------|--------|
| FEAT-011 | Input pemasukan & pengeluaran (kategori, deskripsi, nominal, tanggal) | 5 | Resta | Planned |
| FEAT-012 | Upload bukti transaksi | 3 | Resta | Planned |
| FEAT-013 | Rekap saldo & laporan keuangan berkala | 5 | Resta | Planned |
| FEAT-014 | Publikasi laporan keuangan kepada warga | 3 | Resta | Planned |
| FEAT-015 | Warga melihat laporan keuangan yang telah dipublikasikan | 3 | Resta | Planned |

**Sprint Goal:** Bendahara dapat mencatat transaksi lengkap dengan bukti dan melihat rekap saldo; laporan keuangan dapat dipublikasikan dan dilihat warga.

**Deliverables:**
- [ ] E2E: bendahara input transaksi + bukti → rekap saldo → publikasi laporan → warga melihat (staging)
- [ ] Validasi format laporan keuangan dengan bendahara (BRD Lampiran B #5)

---

### Sprint 4 — EPIC-004: Laporan Warga
**Duration:** 2026-11-30 — 2026-12-13 (2 minggu)

| Feature ID | Feature | Story Points | Owner | Status |
|------------|---------|--------------|-------|--------|
| FEAT-016 | Warga mengirim laporan/keluhan/aspirasi/permintaan bantuan | 5 | Resta | Planned |
| FEAT-017 | Pengurus menerima & memproses laporan warga | 3 | Resta | Planned |
| FEAT-018 | Tanggapan pengurus atas laporan | 3 | Resta | Planned |
| FEAT-019 | Pembaruan status laporan (Terkirim, Sedang ditinjau, Sedang diproses, Selesai, Tidak dapat diproses) | 3 | Resta | Planned |
| FEAT-020 | Riwayat & pemantauan status laporan oleh warga | 3 | Resta | Planned |

**Sprint Goal:** Warga dapat mengirim laporan dan memantau statusnya; pengurus dapat menerima, memproses, menanggapi, dan memperbarui status laporan.

**Deliverables:**
- [ ] E2E: warga kirim laporan → pengurus proses & tanggapi → status berubah → warga melihat tanggapan dan status (staging)
- [ ] Daftar status laporan sesuai BRD (5 status)
- [ ] **M2: Modul Inti Selesai** (EPIC-001–004 selesai)

---

### Sprint 5 — EPIC-005: Pelaporan Warga Sedang Sakit + Integrasi
**Duration:** 2026-12-14 — 2026-12-27 (2 minggu)

| Feature ID | Feature | Story Points | Owner | Status |
|------------|---------|--------------|-------|--------|
| FEAT-021 | Warga melaporkan kondisi/keluhan sedang sakit beserta kebutuhan bantuan | 5 | Resta | Planned |
| FEAT-022 | Pengelolaan data pelaporan warga sakit oleh pengurus berwenang | 3 | Resta | Planned |
| FEAT-023 | Pembatasan akses detail data kesehatan berdasarkan role | 5 | Resta | Planned |
| — | Integrasi E2E smoke test seluruh modul (MVP) | 3 | Resta | Planned |
| — | Bug fix dari internal QA | 3 | Resta | Planned |

**Sprint Goal:** Modul pelaporan sakit selesai dengan pembatasan akses yang benar; seluruh MVP terintegrasi dan lulus smoke test end-to-end.

**Deliverables:**
- [ ] E2E: warga lapor sakit → pengurus berwenang melihat detail → warga lain TIDAK dapat melihat detail (staging)
- [ ] Smoke test seluruh modul lulus
- [ ] **M3: MVP Code-Complete**

---

### Sprint 6 — UAT, Deployment & Handover
**Duration:** 2026-12-28 — 2027-01-10 (2 minggu)

| # | Activity | Owner | Status |
|---|----------|-------|--------|
| 1 | UAT dengan pengurus RW & perwakilan warga (sesuai Action Plan MoM #9) | Resta + Pak Jono/RW | Planned |
| 2 | Bug fix dari UAT | Resta | Planned |
| 3 | Deployment produksi (domain, hosting, storage sesuai keputusan Sprint 0) | Resta | Planned |
| 4 | Penyusunan panduan pengguna (warga & pengurus) | Resta | Planned |
| 5 | Rencana sosialisasi & pelatihan pengurus (Action Plan MoM #10) | Resta + Pak Jono/RW | Planned |
| 6 | Project closure & retrospective | Resta | Planned |

**Sprint Goal:** Sistem live di produksi, lulus UAT, pengurus mampu mengoperasikan CMS, dan rencana sosialisasi kepada warga siap dijalankan.

**Deliverables:**
- [ ] UAT sign-off
- [ ] Production deployment selesai
- [ ] Panduan pengguna warga & pengurus
- [ ] Rencana sosialisasi & jadwal pelatihan pengurus
- [ ] Project closure report
- [ ] **M4: UAT Complete & M5: Go-Live**

---

## 6. Communication Plan

### 6.1 Regular Meetings

| Meeting | Frequency | Participants | Day/Time | Output |
|---------|-----------|--------------|----------|--------|
| Sinkronisasi & Demo | Per sprint (tiap 2 minggu, akhir sprint) | Resta + Pak Jono (± admin/bendahara) | Minggu ke-2, waktu fleksibel | Demo, feedback, keputusan sprint berikutnya |
| UAT Session | Per UAT window (Sprint 6) | Resta + pengurus + perwakilan warga | Disepakati bersama | UAT sign-off |
| Go-Live Review | Sekali (sebelum M5) | Resta + Pak Jono + sponsor | Disepakati bersama | Go-live approval |

### 6.2 Communication Channels

| Purpose | Channel | Participants |
|---------|---------|--------------|
| Komunikasi harian | WhatsApp | Resta + Pak Jono |
| Formal & keputusan | Email / catatan MoM | Resta + pengurus RW |
| Issue tracking | [Usulan: Taiga / GitHub Issues] | Resta |
| Kode & dokumentasi | Git Repository (private) | Resta |

> Ritme disederhanakan dibanding proyek tim penuh: tidak ada daily standup (developer tunggal); demo per sprint menggantikan sprint review; retro dilakukan mandiri saat closure. Kanal issue tracking final dikonfirmasi saat Sprint 0.

---

## 7. Risk Management

### 7.1 Risk Register

*Probability: L=1, M=2, H=3 | Impact: L=1, M=2, H=3, Critical=4 | Score = Probability × Impact*

| ID | Risk | Probability | Impact | Score | Mitigation | Owner | Status |
|----|------|-------------|--------|-------|------------|-------|--------|
| R01 | **Respons/ketersediaan pihak RW lambat** — konfirmasi scope, penunjukan admin/bendahara, dan validasi bisa menunggu balasan berhari-hari | **H (3)** | **M (2)** | **6** | (a) Sprint 0 fokus mengejar jawaban Open Questions BRD; (b) Target tanggal jawaban disepakati di awal sprint; (c) Bekerja dengan asumsi-usulan bertanda [Usulan] sambil menunggu konfirmasi; (d) Jika tidak ada jawaban > 2 minggu → eskalasi via pertemuan langsung | Resta | Open |
| R02 | **Kapasitas developer berkurang** — pekerjaan utama/gangguan personal mengurangi jam kerja proyek di bawah 10 jam/minggu | **M (2)** | **H (3)** | **6** | (a) Timeline memakai asumsi 10–20 jam/minggu dengan buffer; (b) Scope per sprint dijaga kecil (17–19 SP); (c) Jika kapasitas turun > 2 sprint berturut-turut → segera komunikasikan penyesuaian timeline ke Pak Jono; (d) Prioritas fitur Must Have dikerjakan lebih dulu | Resta | Open |
| R03 | **Data awal warga & struktur pengurus tidak siap** — RW belum menyiapkan data terverifikasi saat onboarding akun | **M (2)** | **M (2)** | **4** | (a) Permintaan data diajukan di Sprint 0 (D03); (b) Onboarding akun warga bisa bertahap — MVP bisa dimulai dengan akun pengurus + perwakilan warga uji; (c) Format data disepakati di awal | Resta + Pak Jono | Open |
| R04 | **Keputusan infrastruktur tertunda** — domain, hosting, storage belum dikonfirmasi (termasuk biaya) | **M (2)** | **M (2)** | **4** | (a) Usulan infrastruktur + estimasi biaya disiapkan di Sprint 0 (D04); (b) Pengembangan tetap jalan di staging terlepas dari keputusan produksi; (c) Deployment produksi hanya butuh keputusan di akhir Sprint 5 | Resta | Open |
| R05 | **Adopsi warga rendah** — warga jarang login/enggan memakai portal setelah peluncuran | **M (2)** | **M (2)** | **4** | (a) Rencana sosialisasi disiapkan di Sprint 6 (MoM action #10); (b) Pengurus mempublikasikan informasi penting hanya melalui portal agar ada alasan berkunjung; (c) Pantau metrik BO-02 BRD (≥60% akun aktif 3 bulan) pasca go-live | Resta + Pak Jono | Open |
| R06 | **Privasi data kesehatan (UU PDP)** — detail laporan sakit tampil ke pihak yang tidak berwenang | **L (1)** | **H (3)** | **3** | (a) FEAT-023 pembatasan akses berbasis role wajib lulus skenario negatif UAT (warga lain tidak bisa melihat); (b) Review desain akses di ITA; (c) Pengujian manual khusus role-akses sebelum go-live | Resta | Open |
| R07 | **Libur akhir tahun** — Natal (12-25) & Tahun Baru (01-01) mengurangi kapasitas | **H (3)** | **L (1)** | **3** | (a) Sprint 5 sengaja ringan (3 fitur + integrasi); (b) Sprint 6 tanpa fitur baru — hanya UAT/deployment; (c) Milestone M3/M4 fleksibel bergeser ±1 minggu tanpa mengubah urutan pengerjaan | Resta | Open |

**Top 3 risiko yang perlu perhatian khusus:**
1. **R01 Respons RW lambat** (skor 6) — gate utama untuk scope final dan penunjukan pengguna CMS.
2. **R02 Kapasitas developer** (skor 6) — single point of failure proyek.
3. **R05 Adopsi warga** (skor 4) — menentukan keberhasilan tujuan transparansi & komunikasi (BO-01–04 BRD).

### 7.2 Dependencies

| ID | Dependency | Owner | Due Date | Status | Impact if Delayed |
|----|------------|-------|----------|--------|-------------------|
| D01 | Konfirmasi scope & prioritas MVP (Open Questions BRD #1) | Pak Jono dan Resta | 2026-10-18 (akhir S0) | Open | Blocking start pengembangan fitur (S1) |
| D02 | Penetapan admin RW & bendahara pengguna CMS | Pak Jono/RW | 2026-10-18 (akhir S0) | Open | Blocking UAT role admin/bendahara (S6) |
| D03 | Data awal warga & struktur pengurus terverifikasi | Pak Jono/RW | 2026-11-15 (akhir S2) | Open | Blocking onboarding akun warga; MVP bisa mulai dengan akun uji |
| D04 | Keputusan infrastruktur (domain, hosting, storage) + konfirmasi biaya operasional | Pak Jono/RW | 2026-12-27 (akhir S5) | Open | Blocking deployment produksi (S6) |
| D05 | Format awal laporan keuangan | Bendahara RW | 2026-11-29 (akhir S3) | Open | Blocking FEAT-013/014 finalization |
| D06 | Otoritas persetujuan akhir dari RW (Authority BANT) | Pengurus RW | 2026-10-18 (akhir S0) | Open | Blocking approval BRD/PEP dan keputusan scope |
| D07 | Rencana peluncuran & sosialisasi kepada warga | Pak Jono/RW dan Resta | 2027-01-10 (akhir S6) | Open | Mempengaruhi adopsi pasca go-live (R05) |

---

## 8. Quality Assurance

### 8.1 Definition of Done

**Story Level (solo dev):**
- [ ] Kode selesai & committed
- [ ] Self-review kode sebelum commit (checklist sendiri)
- [ ] Unit test untuk logika inti lulus (target: logika bisnis keuangan & akses role)
- [ ] Deployed ke staging
- [ ] Manual test lulus: happy path + edge case utama
- [ ] Cek responsive (mobile + desktop)

**Sprint Level:**
- [ ] Semua story sprint "Done"
- [ ] Demo ke Pak Jono selesai dengan feedback tercatat
- [ ] Tidak ada bug critical/high terbuka
- [ ] Dokumentasi ter-update

### 8.2 Testing Strategy

| Test Type | Responsibility | When | Tools |
|-----------|----------------|------|-------|
| Unit Test | Resta | Selama pengembangan | Framework unit test stack terpilih (detail di ITA) |
| Manual Test (staging) | Resta | Tiap sprint | Checklist skenario manual |
| E2E Smoke Test | Resta | S5 dan tiap rilis | [Usulan: Playwright/manual] |
| Uji Akses Role (security) | Resta | S5 (EPIC-005) + sebelum go-live | Skenario negatif manual (warga lain tidak bisa lihat detail sakit) |
| Responsive Check | Resta | Tiap sprint | Browser dev tools + perangkat nyata |
| UAT | Pengurus RW + perwakilan warga | S6 | Skenario manual (lihat 01-06-UAT-SCENARIOS) |

---

## 9. Deliverables Tracker

| # | Deliverable | Owner | Due Date | Status |
|---|-------------|-------|----------|--------|
| 1 | BRD | Resta | 2026-09-20 | Draft v1.0 ready — 9 Open Questions pending |
| 2 | PEP (dokumen ini) | Resta | 2026-09-20 | Draft v1.0 |
| 3 | User flow & struktur database awal | Resta | 2026-10-18 (akhir S0) | Not Started |
| 4 | Desain awal / prototype | Resta | 2026-10-18 (akhir S0) | Not Started |
| 5 | ITA | Resta | 2026-11-01 (akhir S1) | Not Started |
| 6 | MVP Code-Complete | Resta | 2026-12-27 (akhir S5) | Not Started |
| 7 | UAT Sign-off | Pengurus RW | 2027-01-10 (akhir S6) | Not Started |
| 8 | Production deployment | Resta | 2027-01-10 (akhir S6) | Not Started |
| 9 | Panduan pengguna (warga & pengurus) | Resta | 2027-01-10 (akhir S6) | Not Started |
| 10 | Rencana sosialisasi & pelatihan pengurus | Resta + Pak Jono/RW | 2027-01-16 (go-live) | Not Started |
| 11 | Project closure report | Resta | 2027-01-10 (akhir S6) | Not Started |

---

## 10. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor (Pengurus RW) | [TBD — pihak berwenang persetujuan akhir perlu dikonfirmasi] | | |
| PIC Client | Pak Jono | | |
| Pengembang | Resta | | |

---

<!--
LIVING DOCUMENT:
- Update sprint status pada setiap sprint review.
- Update risk register minimal per sprint.
- Update deliverables tracker pada setiap milestone.
- Setiap perubahan scope harus melalui Change Control (§3.3) dan update In Scope/Out of Scope (§3.1/§3.2).
- Seluruh tanggal [Usulan] — re-baseline timeline setelah konfirmasi Pak Jono.
-->

---

## Lampiran A — Sprint × Feature Mapping

Quick reference untuk memastikan setiap FEAT di BRD memiliki rumah di sprint plan.

| FEAT ID | Feature Name | EPIC | Sprint |
|---------|--------------|------|--------|
| FEAT-001 | Login dan autentikasi pengguna | EPIC-001 | S1 |
| FEAT-002 | Pembuatan & verifikasi akun warga oleh admin | EPIC-001 | S1 |
| FEAT-003 | Manajemen data akun warga | EPIC-001 | S1 |
| FEAT-004 | Manajemen role Admin RW, Bendahara, dan Warga | EPIC-001 | S1 |
| FEAT-005 | Dashboard warga | EPIC-001 | S1 |
| FEAT-006 | CMS berita & pengumuman RW | EPIC-002 | S2 |
| FEAT-007 | CMS agenda & kegiatan RW | EPIC-002 | S2 |
| FEAT-008 | CMS dokumentasi kegiatan | EPIC-002 | S2 |
| FEAT-009 | CMS perkembangan kegiatan/program RW | EPIC-002 | S2 |
| FEAT-010 | Tampilan portal warga untuk membaca informasi | EPIC-002 | S2 |
| FEAT-011 | Input pemasukan & pengeluaran | EPIC-003 | S3 |
| FEAT-012 | Upload bukti transaksi | EPIC-003 | S3 |
| FEAT-013 | Rekap saldo & laporan keuangan berkala | EPIC-003 | S3 |
| FEAT-014 | Publikasi laporan keuangan kepada warga | EPIC-003 | S3 |
| FEAT-015 | Warga melihat laporan keuangan yang dipublikasikan | EPIC-003 | S3 |
| FEAT-016 | Warga mengirim laporan/keluhan/aspirasi | EPIC-004 | S4 |
| FEAT-017 | Pengurus menerima & memproses laporan warga | EPIC-004 | S4 |
| FEAT-018 | Tanggapan pengurus atas laporan | EPIC-004 | S4 |
| FEAT-019 | Pembaruan status laporan | EPIC-004 | S4 |
| FEAT-020 | Riwayat & pemantauan status laporan oleh warga | EPIC-004 | S4 |
| FEAT-021 | Warga melaporkan kondisi/keluhan sedang sakit | EPIC-005 | S5 |
| FEAT-022 | Pengelolaan data pelaporan warga sakit | EPIC-005 | S5 |
| FEAT-023 | Pembatasan akses detail data kesehatan | EPIC-005 | S5 |

---

## Lampiran B — Asumsi & Pembatas untuk Eksekusi

**Asumsi kunci (jika tidak valid → dampak material):**

1. **Kapasitas Resta 10–20 jam/minggu** sepanjang Oktober 2026 – Januari 2027. Jika kapasitas turun signifikan (pekerjaan utama, kondisi personal), timeline bergeser proporsional — komunikasikan ke Pak Jono segera.
2. **Open Questions BRD terjawab paling lambat akhir Sprint 0 (18 Oktober 2026 [Usulan]).** Jika masih terbuka, pengembangan tetap jalan dengan asumsi-usulan bertanda [Usulan] tetapi risiko rework meningkat.
3. **Pihak RW menyiapkan data awal warga & struktur pengurus paling lambat akhir Sprint 2 (15 November 2026 [Usulan]).** Jika terlambat, onboarding warga bertahap setelah go-live.
4. **Keputusan infrastruktur (domain, hosting, storage) paling lambat akhir Sprint 5 (27 Desember 2026 [Usulan]).** Pengembangan di staging tidak terblokir; hanya deployment produksi yang menunggu.
5. **Pengembangan dimulai sebelum konfirmasi scope final.** MoM menyebut MVP dikembangkan "setelah scope disepakati" — PEP ini mengambil pendekatan bahwa pekerjaan persiapan (S0) jalan paralel dengan konfirmasi, dan konfirmasi scope adalah gate untuk S1.

**Pembatas eksternal yang perlu perhatian:**

- **UU PDP (Undang-Undang Perlindungan Data Pribadi)** — data pribadi warga dan data kesehatan wajib ditangani sesuai regulasi. Detail di ITA §Security.
- **Biaya operasional** — domain, hosting, storage, dan layanan pihak ketiga belum dikonfirmasi (BRD Lampiran B #6); keputusan menunggu usulan Sprint 0.
- **Waktu RW** — pengurus dan bendahara adalah relawan; UAT dan pelatihan perlu dijadwalkan di luar jam kesibukan mereka.
- **Libur akhir tahun** — Natal & Tahun Baru jatuh di Sprint 5–6; milestone M3/M4 fleksibel bergeser ±1 minggu.
