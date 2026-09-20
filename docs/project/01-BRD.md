# BUSINESS REQUIREMENTS DOCUMENT
## Portal Warga RW

---

| Attribute | Value |
|-----------|-------|
| Document ID | BRD-PWR-001 |
| Version | 1.0 |
| Status | Draft |
| Author | Resta |
| Created | 2026-09-20 |
| Last Updated | 2026-09-20 |

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-20 | Resta | Initial draft berdasarkan MoM diskusi dengan Pak Jono (`mom/MoM_Portal_Warga_RW_Pak_Jono.md`) |

---

## 1. Executive Summary

### 1.1 Background

Pengurus RW saat ini menyampaikan informasi kepada warga dan mengelola administrasi lingkungan secara manual — baik penyebaran berita dan pengumuman, pencatatan keuangan, maupun penampungan keluhan dan aspirasi warga. Proses manual ini membuat informasi tidak selalu sampai merata, laporan keuangan sulit diakses warga secara berkala, dan laporan warga tidak memiliki kanal yang terstruktur serta terlacak statusnya.

Pengurus RW berencana membangun sebuah **portal warga** berbasis website untuk membantu penyampaian informasi, pelaporan warga, serta pengelolaan laporan keuangan secara lebih tertib dan transparan. Pengembangan sistem ini merupakan **inisiatif sosial** untuk membantu lingkungan sekitar: belum tersedia anggaran pengembangan, dan sistem akan dikembangkan secara **mandiri oleh Resta** dengan pendekatan bertahap dimulai dari MVP.

Portal ini mengambil inspirasi dari [RTRW Online](https://rtrwonline.id/), namun tahap awal **tidak ditujukan menyalin seluruh fiturnya** — melainkan membangun versi MVP yang sesuai kebutuhan RW dan realistis dikembangkan secara mandiri (misalnya fitur data COVID-19 pada referensi disesuaikan menjadi pelaporan warga yang sedang sakit).

### 1.2 Proposed Solution

Membangun **website Portal Warga RW** berbasis responsive web (belum aplikasi mobile native) yang terdiri dari dua sisi:

1. **Portal Warga (frontend).** Warga login untuk membaca berita, pengumuman, agenda, dan perkembangan kegiatan RW; melihat laporan keuangan yang telah dipublikasikan; serta mengirimkan laporan, aspirasi, dan laporan kondisi sedang sakit beserta status penanganannya.
2. **CMS Pengurus RW (backend).** Admin RW mengelola akun dan akses warga (tanpa pendaftaran publik bebas — akun dibuat/dieverifikasi admin), mengelola konten informasi, serta menerima dan memproses laporan warga. Bendahara mencatat transaksi keuangan (pemasukan/pengeluaran beserta bukti) dan menyiapkan laporan keuangan untuk dipublikasikan.

Akses dibatasi hanya untuk warga dan pengurus RW yang telah diverifikasi. Detail data kesehatan pada modul pelaporan warga sakit hanya dapat diakses pengurus yang berwenang dan tidak ditampilkan terbuka kepada seluruh warga.

### 1.3 Key Benefits

| # | Benefit | Description |
|---|---------|-------------|
| 1 | Pusat informasi digital RW | Berita, pengumuman, agenda, dokumentasi, dan perkembangan kegiatan RW tersedia dalam satu tempat yang dapat diakses warga kapan saja. |
| 2 | Transparansi keuangan | Transaksi keuangan RW tercatat terstruktur dengan bukti, dan laporan keuangan dapat dipublikasikan serta dilihat warga secara berkala. |
| 3 | Kanal komunikasi dua arah yang terlacak | Warga dapat menyampaikan laporan, keluhan, dan aspirasi dengan status yang dapat dipantau; pengurus dapat menanggapi secara terstruktur. |
| 4 | Akses terbatas dan terverifikasi | Hanya warga dan pengurus RW yang diverifikasi admin yang dapat mengakses portal, menjaga privasi konten dan data komunitas. |
| 5 | Nyaman digunakan di perangkat apa pun | Responsive web yang dapat digunakan dengan baik melalui smartphone, tablet, maupun laptop/desktop tanpa perlu instalasi aplikasi. |
| 6 | Peduli warga yang sedang sakit | Kondisi warga yang sedang sakit dan kebutuhan bantuannya dapat dilaporkan dan ditindaklanjuti pengurus dengan menjaga privasi data kesehatan. |

---

## 2. Business Objectives

### 2.1 Business Goals

| ID | Objective | Target | Measurement |
|----|-----------|--------|-------------|
| BO-01 | Menyediakan pusat informasi digital bagi warga RW | 100% pengumuman dan berita resmi RW dipublikasikan melalui portal (tidak lagi bergantung pada penyebaran manual) [Usulan] | Audit konten berkala oleh pengurus RW |
| BO-02 | Adopsi portal oleh warga terverifikasi | ≥ 60% warga/KK target memiliki akun aktif dan pernah login dalam 3 bulan pertama setelah peluncuran [Usulan] | Jumlah akun aktif / total data awal warga yang disiapkan RW |
| BO-03 | Respons pengurus terhadap laporan warga | 100% laporan warga mulai ditinjau (status berubah dari Terkirim) dalam ≤ 3 hari kerja [Usulan] | Rekap waktu respons laporan dari sistem |
| BO-04 | Transparansi laporan keuangan | Laporan keuangan dipublikasikan minimal 1 kali per bulan dan mencakup 100% transaksi yang tercatat [Usulan] | Kelengkapan periode publikasi vs rekap transaksi |
| BO-05 | Aksesibilitas lintas perangkat | Portal dapat digunakan dengan baik melalui smartphone, tablet, dan desktop | Pengujian responsive + feedback warga saat uji coba |

> Catatan: Seluruh angka target di atas merupakan **usulan awal** dari hasil diskusi kebutuhan — belum ada angka kuantitatif yang disepakati dalam MoM. Angka final perlu dikonfirmasi bersama Pak Jono/pengurus RW saat konfirmasi scope MVP.

### 2.2 Success Criteria

Proyek dianggap berhasil jika:

1. MVP portal warga live dan lulus uji coba bersama pengurus RW dan perwakilan warga.
2. Satu siklus end-to-end informasi berjalan: pengurus membuat berita/pengumuman/agenda → warga login → warga membaca informasi tersebut.
3. Satu siklus end-to-end laporan warga berjalan: warga mengirim laporan → pengurus menerima dan memproses → pengurus menanggapi → status laporan berubah hingga selesai → warga dapat melihat status dan tanggapan.
4. Satu siklus end-to-end keuangan berjalan: bendahara mencatat transaksi (dengan bukti) → rekap saldo tersaji → laporan dipublikasikan → warga dapat melihat laporan keuangan.
5. Akun warga hanya dapat dibuat/diverifikasi oleh admin RW — tidak ada pendaftaran publik bebas.
6. Detail data kesehatan warga yang sedang sakit tidak pernah tampil secara terbuka kepada seluruh warga — hanya pengurus berwenang.
7. Portal dapat digunakan dengan baik melalui smartphone maupun desktop (responsive).

---

## 3. Stakeholders

| Stakeholder | Role | Interest Level | Contact |
|-------------|------|----------------|---------|
| Pengurus RW | Sponsor & Business Owner [TBD — pihak berwenang persetujuan akhir perlu dikonfirmasi] | High | [TBD] |
| Pak Jono | PIC Client — penyampai kebutuhan awal | High | [TBD] |
| Admin RW | Pengelola CMS, akun warga, konten, dan laporan warga [TBD — nama perlu ditentukan] | High | [TBD] |
| Bendahara RW | Pencatat transaksi dan penyusun laporan keuangan [TBD — nama perlu ditentukan] | High | [TBD] |
| Warga RW | End User — pembaca informasi dan pengirim laporan (perwakilan terlibat uji coba) | Medium | [TBD] |
| Resta | Pengembang (mandiri) | High | Internal |

> Catatan: Berdasarkan BANT, Pak Jono saat ini menjadi PIC penyampai kebutuhan, namun pihak yang memiliki kewenangan persetujuan akhir dari RW masih perlu dikonfirmasi. Nama admin RW dan bendahara yang akan menggunakan CMS juga masih menunggu penetapan dari pihak RW.

---

## 4. Current State vs Future State

### 4.1 Current State (As-Is)

**Pain Points:**

| # | Problem | Impact | Frequency |
|---|---------|--------|-----------|
| 1 | Penyampaian informasi RW (berita, pengumuman, agenda kegiatan) dilakukan manual | Informasi tidak selalu sampai merata ke seluruh warga; tidak ada tempat terpusat untuk melihat histori informasi dan dokumentasi kegiatan | Per pengumuman/agenda |
| 2 | Pencatatan keuangan RW manual tanpa sistem | Rekap saldo dan penyusunan laporan memakan waktu; transparansi kepada warga terbatas; bukti transaksi sulit dilacak | Harian/bulanan |
| 3 | Laporan, keluhan, dan aspirasi warga tidak memiliki kanal terstruktur | Tidak ada pelacakan status laporan; tanggapan pengurus tidak terdokumentasi rapi | Per laporan |
| 4 | Tidak ada data warga terverifikasi secara digital | Sulit membatasi akses informasi komunitas hanya untuk warga setempat | Berkelanjutan |

### 4.2 Future State (To-Be)

**Improvements:**

| # | Improvement | Expected Benefit |
|---|-------------|------------------|
| 1 | Portal informasi digital dengan CMS pengurus | Warga mengakses berita, pengumuman, agenda, dokumentasi, dan perkembangan kegiatan kapan saja; pengurus mempublikasikan informasi secara mandiri |
| 2 | Modul keuangan dengan pencatatan transaksi terstruktur dan publikasi laporan | Transparansi keuangan meningkat; warga dapat memantau laporan keuangan yang telah dipublikasikan |
| 3 | Modul Laporan Warga dengan alur status terlacak | Komunikasi dua arah yang rapi; warga dapat memantau status laporan (Terkirim → Selesai/dsb) dan membaca tanggapan pengurus |
| 4 | Akun warga yang dibuat/dieverifikasi admin | Akses portal benar-benar terbatas untuk warga setempat; konten komunitas tidak tampil publik |
| 5 | Modul pelaporan warga yang sedang sakit dengan akses terbatas | Kebutuhan bantuan warga sakit dapat ditindaklanjuti pengurus dengan menjaga privasi data kesehatan |
| 6 | Responsive web untuk mobile dan desktop | Warga nyaman mengakses portal dari perangkat yang dimiliki tanpa instalasi aplikasi |

---

## 5. Epic & Feature Overview

> Detailed user stories dan acceptance criteria akan diturunkan ke SPEC documents melalui `/pm:feature`. Bagian ini hanya berisi daftar epic dan ringkasan fitur tingkat tinggi.

### 5.1 Epic List

| Epic ID | Epic Name | Description | Priority |
|---------|-----------|-------------|----------|
| EPIC-001 | Autentikasi & Manajemen Akun | Login pengguna, pembuatan dan verifikasi akun warga oleh admin (tanpa pendaftaran publik), manajemen role Admin RW / Bendahara / Warga, serta dashboard warga. | Must Have |
| EPIC-002 | Portal Informasi & CMS Konten | CMS pengurus untuk mengelola berita, pengumuman, agenda dan kegiatan, dokumentasi, serta perkembangan program RW — ditampilkan kepada warga yang login. | Must Have |
| EPIC-003 | Keuangan RW | Pencatatan pemasukan/pengeluaran dengan kategori, deskripsi, nominal, tanggal, dan bukti transaksi; rekap saldo; penyusunan dan publikasi laporan keuangan kepada warga. | Must Have |
| EPIC-004 | Laporan Warga | Kanal laporan, keluhan, aspirasi, dan permintaan bantuan dari warga kepada pengurus, dengan alur penerimaan, tanggapan, dan pembaruan status yang terlacak. Tidak menggunakan konsep/nama "Saran dan Keluhan – Hallo Pak Lurah". | Must Have |
| EPIC-005 | Pelaporan Warga Sedang Sakit | Pelaporan kondisi/keluhan kesehatan warga beserta kebutuhan bantuan. Detail data kesehatan hanya dapat diakses pengurus yang berwenang, tidak ditampilkan terbuka kepada seluruh warga. | Must Have |

### 5.2 Feature Summary per Epic

> Daftar fitur di bawah ini bersifat indikatif dan akan dirinci lebih lanjut pada SPEC documents. ID fitur akan diterbitkan ulang melalui `/pm:feature`.

#### EPIC-001: Autentikasi & Manajemen Akun

| Feature ID | Feature Name | Priority | SPEC Reference |
|------------|--------------|----------|----------------|
| FEAT-001 | Login dan autentikasi pengguna | Must Have | `docs/features/001-akun/01-feature---business.md` |
| FEAT-002 | Pembuatan & verifikasi akun warga oleh admin (tanpa pendaftaran publik) | Must Have | `docs/features/001-akun/02-feature---business.md` |
| FEAT-003 | Manajemen data akun warga (data warga, aktivasi/nonaktivasi) | Must Have | `docs/features/001-akun/03-feature---business.md` |
| FEAT-004 | Manajemen role Admin RW, Bendahara, dan Warga | Must Have | `docs/features/001-akun/04-feature---business.md` |
| FEAT-005 | Dashboard warga | Must Have | `docs/features/001-akun/05-feature---business.md` |

#### EPIC-002: Portal Informasi & CMS Konten

| Feature ID | Feature Name | Priority | SPEC Reference |
|------------|--------------|----------|----------------|
| FEAT-006 | CMS berita & pengumuman RW | Must Have | `docs/features/002-konten/01-feature---business.md` |
| FEAT-007 | CMS agenda & kegiatan RW | Must Have | `docs/features/002-konten/02-feature---business.md` |
| FEAT-008 | CMS dokumentasi kegiatan | Must Have | `docs/features/002-konten/03-feature---business.md` |
| FEAT-009 | CMS perkembangan kegiatan/program RW | Must Have | `docs/features/002-konten/04-feature---business.md` |
| FEAT-010 | Tampilan portal warga untuk membaca informasi (setelah login) | Must Have | `docs/features/002-konten/05-feature---business.md` |

#### EPIC-003: Keuangan RW

| Feature ID | Feature Name | Priority | SPEC Reference |
|------------|--------------|----------|----------------|
| FEAT-011 | Input pemasukan & pengeluaran (kategori, deskripsi, nominal, tanggal) | Must Have | `docs/features/003-keuangan/01-feature---business.md` |
| FEAT-012 | Upload bukti transaksi | Must Have | `docs/features/003-keuangan/02-feature---business.md` |
| FEAT-013 | Rekap saldo & laporan keuangan berkala | Must Have | `docs/features/003-keuangan/03-feature---business.md` |
| FEAT-014 | Publikasi laporan keuangan kepada warga | Must Have | `docs/features/003-keuangan/04-feature---business.md` |
| FEAT-015 | Warga melihat laporan keuangan yang telah dipublikasikan | Must Have | `docs/features/003-keuangan/05-feature---business.md` |

#### EPIC-004: Laporan Warga

| Feature ID | Feature Name | Priority | SPEC Reference |
|------------|--------------|----------|----------------|
| FEAT-016 | Warga mengirim laporan/keluhan/aspirasi/permintaan bantuan | Must Have | `docs/features/004-laporan/01-feature---business.md` |
| FEAT-017 | Pengurus menerima & memproses laporan warga | Must Have | `docs/features/004-laporan/02-feature---business.md` |
| FEAT-018 | Tanggapan pengurus atas laporan | Must Have | `docs/features/004-laporan/03-feature---business.md` |
| FEAT-019 | Pembaruan status laporan (Terkirim, Sedang ditinjau, Sedang diproses, Selesai, Tidak dapat diproses) | Must Have | `docs/features/004-laporan/04-feature---business.md` |
| FEAT-020 | Riwayat & pemantauan status laporan oleh warga | Must Have | `docs/features/004-laporan/05-feature---business.md` |

#### EPIC-005: Pelaporan Warga Sedang Sakit

| Feature ID | Feature Name | Priority | SPEC Reference |
|------------|--------------|----------|----------------|
| FEAT-021 | Warga melaporkan kondisi/keluhan sedang sakit beserta kebutuhan bantuan | Must Have | `docs/features/005-sakit/01-feature---business.md` |
| FEAT-022 | Pengelolaan data pelaporan warga sakit oleh pengurus berwenang | Must Have | `docs/features/005-sakit/02-feature---business.md` |
| FEAT-023 | Pembatasan akses detail data kesehatan berdasarkan role | Must Have | `docs/features/005-sakit/03-feature---business.md` |

### 5.3 Out of Scope (Tahap Awal)

Fitur berikut **tidak termasuk** scope tahap awal dan tidak dikembangkan dalam MVP:

| # | Item | Catatan |
|---|------|---------|
| 1 | Tanda tangan digital | Tidak diperlukan tahap awal |
| 2 | Siskamling | Tidak diperlukan tahap awal |
| 3 | Modul "Saran dan Keluhan – Hallo Pak Lurah" | Tidak digunakan; kebutuhan serupa diwakili modul Laporan Warga (EPIC-004) |
| 4 | Free Maintenance | Tidak termasuk |
| 5 | Free Upgrade Aplikasi | Tidak termasuk |
| 6 | Aplikasi mobile native Android/iOS | Tahap awal cukup responsive web |
| 7 | Pembayaran iuran online | Tidak termasuk tahap awal |
| 8 | Integrasi dengan kelurahan atau pihak eksternal | Tidak termasuk tahap awal |

---

## 6. Non-Functional Requirements

> Spesifikasi teknis tepat akan dirinci dalam dokumen ITA (`/haie:ita`). Bagian ini menjelaskan kebutuhan bisnis yang harus dipenuhi solusi. Pilihan domain, hosting, storage, dan backup masih menunggu konfirmasi dan menjadi input ITA.

| Category | Requirement | Target |
|----------|-------------|--------|
| **Performance** | Waktu muat halaman portal | < 3 detik pada koneksi internet seluler standar [Usulan] |
| **Availability** | Ketersediaan sistem | ≥ 99% (menyesuaikan layanan hosting yang dipilih [TBD]) |
| **Security** | Autentikasi | Login username/password; tanpa pendaftaran publik — akun dibuat/dieverifikasi admin RW |
| **Security** | Akses berbasis role | Admin RW, Bendahara, dan Warga memiliki hak akses berbeda sesuai perannya |
| **Security** | Privasi data kesehatan | Detail data pelaporan warga sakit hanya dapat diakses pengurus berwenang; tidak ditampilkan terbuka kepada seluruh warga |
| **Security** | Enkripsi transmisi | HTTPS/TLS untuk seluruh komunikasi klien-server [Usulan] |
| **Compliance** | Kepatuhan UU PDP | Data pribadi warga dan data kesehatan ditangani sesuai regulasi perlindungan data pribadi Indonesia |
| **Usability** | Responsif | Dapat digunakan dengan baik melalui smartphone, tablet, dan laptop/desktop |
| **Usability** | Dukungan browser | Browser modern (Chrome, Firefox, Safari, Edge — 2 versi terbaru) |
| **Scalability** | Skala pengguna | Seluruh warga dan pengurus satu RW (ratusan akun; concurrent users kecil) |
| **Maintainability** | Kode mudah dipelihara | Dikembangkan mandiri oleh satu developer — struktur sederhana dan terdokumentasi |

---

## 7. Constraints & Assumptions

### 7.1 Constraints

| # | Constraint | Impact |
|---|------------|--------|
| 1 | Belum ada anggaran pengembangan (kegiatan sosial) | Scope dibatasi pada MVP; fitur di luar scope awal ditunda; solusi memaksimalkan komponen tanpa biaya atau biaya rendah |
| 2 | Dikembangkan mandiri oleh satu developer (Resta) | Kapasitas terbatas — prioritas fitur ketat, pengembangan bertahap, timeline realistis terhadap waktu sampingan |
| 3 | Kebutuhan domain, hosting, storage, dan layanan pihak ketiga belum dikonfirmasi | Keputusan infrastruktur dan biaya operasional menunggu pembahasan terpisah; mempengaruhi ketersediaan sistem |
| 4 | Timeline belum ditentukan (menunggu scope final, data awal, dan pelibatan pihak) | Target waktu baru dapat ditetapkan setelah konfirmasi; tidak ada komitmen tanggal pada tahap ini |
| 5 | Tahap awal berupa responsive web (bukan aplikasi native) | Pengalaman pengguna mengikuti batas responsive web; aplikasi native menjadi pertimbangan masa depan |

### 7.2 Key Assumptions

| # | Assumption | Risk if Invalid |
|---|------------|-----------------|
| 1 | RW menyediakan data awal warga dan struktur pengurus yang telah diverifikasi | Jika terlambat/kurang lengkap, onboarding akun warga tertunda — adopsi portal melambat |
| 2 | Pak Jono dapat mengoordinasikan keputusan dengan pengurus RW | Jika tidak, setiap konfirmasi scope/akses menjadi lambat; perlu ditetapkan pengambil keputusan final |
| 3 | Warga memiliki smartphone/komputer dan koneksi internet memadai | Jika sebagian warga tidak terjangkau, informasi penting masih perlu kanal manual pendamping |
| 4 | Bendahara bersedia mencatat transaksi rutin melalui CMS | Jika input tidak konsisten, laporan keuangan tidak mutakhir dan transparansi tidak tercapai |
| 5 | Admin RW aktif memverifikasi akun dan mengelola konten | Jika admin tidak aktif, warga baru tidak dapat masuk dan informasi berhenti mengalir — adopsi stagnan |
| 6 | Layanan hosting pihak ketiga yang terjangkau tersedia untuk skala RW | Jika tidak, perlu solusi infrastruktur alternatif dengan konsekuensi biaya/keterbatasan |

---

## 8. Glossary

| Term | Definition |
|------|------------|
| BRD | Business Requirements Document — dokumen kebutuhan bisnis tingkat tinggi |
| Bendahara | Pengurus RW yang bertanggung jawab atas pencatatan keuangan dan penyusunan laporan |
| CMS | Content Management System — dasbor untuk mengelola konten digital portal |
| ITA | Information Technology Architecture — dokumen arsitektur teknis |
| Laporan Warga | Modul kanal laporan, keluhan, aspirasi, dan permintaan bantuan warga kepada pengurus RW |
| MVP | Minimum Viable Product — versi produk dengan fitur inti yang cukup untuk memberi nilai dan divalidasi |
| Portal Warga | Website informasi dan interaksi antara warga dan pengurus RW yang dibangun dalam proyek ini |
| Pengurus RW | Struktur pengurus lingkungan RW, termasuk Admin RW dan Bendahara |
| RW | Rukun Warga — satuan wilayah pembagian masyarakat di Indonesia di bawah kelurahan |
| UU PDP | Undang-Undang Perlindungan Data Pribadi (Indonesia) |
| Warga | Penduduk yang bertempat tinggal di wilayah RW dan telah diverifikasi untuk mengakses portal |

---

## 9. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor (Pengurus RW) | [TBD — pihak berwenang persetujuan akhir perlu dikonfirmasi] | | |
| PIC Client | Pak Jono | | |
| Pengembang | Resta | | |

---

<!--
DOCUMENT NOTES:
- Detailed User Stories → See docs/features/<epic>/<feature>---business.md (akan dibuat melalui /pm:feature)
- Project Timeline → See docs/project/02-PEP.md (belum dibuat)
- Technical Architecture & Infrastruktur (domain, hosting, storage, backup) → See docs/project/03-ITA.md (belum dibuat)
- Data Model → See docs/project/03-ITA.md Section 6 (belum dibuat)
- Sumber kebutuhan → mom/MoM_Portal_Warga_RW_Pak_Jono.md
-->

---

## Lampiran A — Ringkasan Kebutuhan per Role

**Warga (login):**

1. Melihat berita, pengumuman, agenda, dan perkembangan RW.
2. Melihat laporan keuangan yang telah dipublikasikan.
3. Mengirim laporan atau aspirasi.
4. Mengirim laporan sedang sakit.
5. Melihat status laporan yang telah dikirim.

**Admin RW:**

1. Mengelola akun dan akses warga.
2. Mengelola berita, pengumuman, agenda, serta dokumentasi.
3. Menerima dan memproses laporan warga.
4. Mengelola data pelaporan warga yang sedang sakit.
5. Mempublikasikan informasi kepada warga.

**Bendahara:**

1. Menginput pemasukan dan pengeluaran.
2. Mengupload bukti transaksi.
3. Melihat rekap dan saldo keuangan.
4. Menyiapkan laporan keuangan untuk dipublikasikan.

---

## Lampiran B — Daftar Item yang Masih Perlu Dikonfirmasi (Open Questions)

| # | Item | PIC Konfirmasi | Dampak jika tidak diselesaikan |
|---|------|----------------|-------------------------------|
| 1 | Konfirmasi scope dan prioritas fitur MVP | Pak Jono dan Resta | Scope BRD belum final; perencanaan sprint tidak bisa dimulai |
| 2 | Penetapan admin RW dan bendahara pengguna CMS | Pak Jono/RW | Tidak jelas siapa pengelola sistem saat go-live |
| 3 | Penyiapan data awal warga dan struktur pengurus | Pak Jono/RW | Onboarding akun warga tertunda |
| 4 | Aturan verifikasi akun dan hak akses warga | Pak Jono/RW dan Resta | Desain alur akun (EPIC-001) belum bisa dirinci |
| 5 | Format awal laporan keuangan | Bendahara RW | Struktur modul keuangan (EPIC-003) belum bisa dirinci |
| 6 | Kebutuhan domain, hosting, storage, backup, dan layanan pihak ketiga (termasuk biaya operasional) | Pak Jono/RW dan Resta | Keputusan infrastruktur di ITA tertunda; ketersediaan sistem belum pasti |
| 7 | Target timeline pengembangan dan peluncuran | Pak Jono/RW dan Resta | Tidak ada baseline jadwal untuk PEP |
| 8 | Pihak berwenang persetujuan akhir dari RW (Authority dalam BANT) | Pengurus RW | Proses approval dokumen dan keputusan scope tidak jalan |
| 9 | Rencana sosialisasi kepada warga saat peluncuran | Pak Jono/RW | Adopsi portal oleh warga berisiko rendah |
