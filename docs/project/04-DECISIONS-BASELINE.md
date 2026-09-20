# DECISIONS BASELINE
## Portal Warga RW

Document ID: DEC-PWR-001  
Version: 1.0  
Status: Baseline keputusan terbaru  
Tanggal: 2026-09-20  

Dokumen ini menjadi baseline koreksi terhadap BRD, PEP, dan ITA sebelum implementasi coding dimulai.

---

## 1. Role & Access Model

Sistem memiliki **tepat 3 role pengurus**:

| Role | Tanggung jawab utama |
|---|---|
| **Super Admin** | Akses tertinggi; mengelola role dan akses; menyetujui laporan keuangan; satu-satunya role yang dapat melihat audit log |
| **Admin** | Mengelola akun warga sesuai kewenangan, konten, laporan warga, dan data laporan sakit sesuai kewenangan |
| **Operasional** | Menjalankan tugas operasional yang ditugaskan, termasuk transaksi keuangan dan tindak lanjut layanan warga |

`Warga` bukan role pengurus. Warga adalah tipe akun/pemilik data yang dapat login dan menggunakan portal warga.

### Aturan penting

- Hanya Super Admin yang dapat mengakses audit log.
- Hanya Super Admin yang dapat menyetujui dan mempublikasikan laporan keuangan.
- Admin dan Operasional tidak dapat mengakses audit log.
- Admin dan Operasional tidak dapat melihat password dalam bentuk apa pun.
- Akses detail laporan kesehatan diberikan berdasarkan permission khusus; minimal Super Admin dan Admin yang ditugaskan. Operasional tidak otomatis mendapat akses.
- Permission laporan kesehatan harus diverifikasi pada setiap server action/API, bukan hanya disembunyikan di UI.

---

## 2. Authentication & Account Lifecycle

### Username

Username login dapat berupa:

- Nomor telepon; atau
- Email.

Untuk tahap awal, satu nomor telepon hanya boleh dimiliki satu akun warga.

### Password awal

- Admin membuat atau mengaktifkan akun warga.
- Warga sendiri membuat password awal melalui activation/setup flow.
- Admin tidak pernah melihat, menerima, atau dapat mengambil password warga.
- Database hanya menyimpan password hash.

### Solusi ketika nomor telepon berubah

Gunakan **internal immutable user ID** sebagai identitas akun utama. Nomor telepon dan email hanya dianggap sebagai login identifier yang dapat berubah.

Flow yang direkomendasikan:

1. Warga masih dapat login menggunakan password yang ada.
2. Warga membuka Profil → Data Kontak → Ubah Nomor Telepon.
3. Warga memasukkan nomor baru.
4. Sistem mengirim OTP ke nomor baru.
5. Setelah OTP benar, nomor lama dinonaktifkan dan nomor baru menjadi identifier aktif.
6. Sistem menyimpan riwayat perubahan kontak di audit log.
7. Jika warga kehilangan akses ke nomor lama dan tidak dapat login, Admin melakukan verifikasi manual menggunakan:
   - Nama lengkap;
   - Alamat/RT;
   - KTP atau bukti domisili sesuai kebijakan RW.
8. Setelah verifikasi manual, Admin hanya dapat memulai recovery/ubah contact flow; Admin tidak pernah mengatur atau melihat password baru.
9. Jika verifikasi meragukan, kasus dieskalasikan ke Super Admin.

### Data akun minimum

- Internal user ID yang tidak berubah
- Nama lengkap
- Email nullable
- Nomor telepon nullable tetapi minimal salah satu identifier login wajib tersedia
- Alamat
- RT
- Status verifikasi
- Status akun
- Password hash
- `phone_verified_at`
- `email_verified_at`
- `contact_changed_at`

---

## 3. Verification

Verifikasi warga dapat memakai salah satu atau kombinasi berikut sesuai kebijakan RW:

- KTP; atau
- Alamat dan RT; atau
- Bukti domisili jika diperlukan.

Dokumen identitas harus disimpan dengan akses terbatas dan tidak ditampilkan ke warga lain.

---

## 4. Citizen Reports

- Pelapor **tidak dapat menghapus** laporan.
- Pelapor **masih dapat mengedit** laporan.
- Edit hanya diperbolehkan sebelum laporan berstatus `Selesai` atau `Tidak dapat diproses`, kecuali ada keputusan bisnis lain.
- Setiap edit menyimpan `updated_at` dan idealnya riwayat perubahan.
- Pengurus dapat memproses dan memperbarui status laporan.

Status standar:

1. Terkirim
2. Sedang ditinjau
3. Sedang diproses
4. Selesai
5. Tidak dapat diproses

---

## 5. Health/Sick Reports

- Data kesehatan disimpan selama mungkin untuk kebutuhan operasional saat ini.
- Data kesehatan tidak ditampilkan kepada warga lain.
- Akses detail harus menggunakan permission server-side.
- Semua akses terhadap detail data kesehatan dicatat.
- Audit log untuk aktivitas sensitif hanya dapat dilihat Super Admin.
- Keputusan retensi jangka panjang tetap perlu ditinjau kembali bersama pemilik proses karena data kesehatan termasuk data sensitif berdasarkan UU PDP.

---

## 6. Finance

### Transaction rules

- Transaksi yang sudah dicatat masih dapat diedit oleh pengurus yang memiliki permission.
- Tipe transaksi: `Pemasukan` atau `Pengeluaran`.
- Metode pembayaran hanya:
  - `Cash`
  - `Transfer`
- Bukti transaksi bersifat internal.
- Bukti transfer hanya dapat dilihat oleh pengurus, bukan warga.
- Perubahan transaksi perlu mencatat siapa dan kapan perubahan dilakukan.

### Finance report approval

- Bendahara tidak digunakan sebagai role sistem terpisah.
- Tugas keuangan dijalankan oleh role Operasional atau role lain yang diberi permission keuangan.
- Laporan keuangan dapat berstatus:
  - Draft
  - Menunggu persetujuan
  - Disetujui
  - Dipublikasikan
  - Dikunci/diarsipkan
- Hanya Super Admin yang dapat menyetujui dan mempublikasikan laporan keuangan.
- Laporan keuangan dapat diunduh dalam format:
  - PDF
  - Excel/XLSX
- Warga hanya dapat melihat laporan yang sudah dipublikasikan.

### Finance fields tambahan

- `payment_method`: `cash | transfer`
- `proof_file_path` atau object-storage reference
- `proof_visibility`: internal-only
- `created_by`
- `updated_by`
- `approved_by`
- `approved_at`
- `published_by`
- `published_at`

---

## 7. Audit Log

Audit log minimal mencatat:

- Login berhasil/gagal
- Perubahan role atau permission
- Perubahan nomor telepon/email
- Verifikasi akun
- Perubahan transaksi
- Persetujuan dan publikasi laporan keuangan
- Akses detail laporan kesehatan
- Perubahan status laporan warga
- Aktivitas sensitif lainnya

**Viewer audit log: Super Admin saja.**

---

## 8. Locked Timeline Baseline

Timeline dikunci menggunakan baseline PEP berikut:

| Sprint/Milestone | Periode/Target | Fokus |
|---|---|---|
| Sprint 0 | 5–18 Oktober 2026 | Discovery, finalisasi scope, role, user flow, database, ITA |
| Sprint 1 | 19 Oktober–1 November 2026 | Auth, akun, role, dashboard warga |
| Sprint 2 | 2–15 November 2026 | Portal informasi dan CMS konten |
| Sprint 3 | 16–29 November 2026 | Keuangan RW |
| Sprint 4 | 30 November–13 Desember 2026 | Laporan warga |
| Sprint 5 | 14–27 Desember 2026 | Laporan sakit, integrasi, smoke test |
| Sprint 6 | 28 Desember 2026–10 Januari 2027 | UAT, bug fix, deployment, handover |
| Go-live | **16 Januari 2027** | Peluncuran produksi dan sosialisasi |

### Milestone terkunci

- M1 Scope & architecture complete: **18 Oktober 2026**
- M2 Modul inti complete: **13 Desember 2026**
- M3 MVP code-complete: **27 Desember 2026**
- M4 UAT complete: **10 Januari 2027**
- M5 Go-live & sosialisasi: **16 Januari 2027**
- Project end: **16 Januari 2027**

Tanggal di atas menjadi baseline perencanaan. Jika kapasitas developer berubah atau ada keterlambatan approval RW, perubahan harus dicatat sebagai change request dan baseline baru.

---

## 9. Required ITA Corrections

ITA v1.0 harus dikoreksi pada bagian berikut sebelum coding:

1. Ganti enum role lama `admin_rw | bendahara | warga` menjadi role pengurus `super_admin | admin | operasional`, dengan warga sebagai account type.
2. Ganti seluruh referensi Admin RW/Bendahara pada role matrix.
3. Tambahkan permission matrix yang eksplisit.
4. Ubah account lifecycle agar warga membuat password awal sendiri.
5. Tambahkan contact-change/recovery flow untuk nomor telepon berubah.
6. Tambahkan `payment_method` dengan pilihan `cash | transfer`.
7. Tambahkan status approval laporan keuangan dan approval oleh Super Admin.
8. Tambahkan export PDF/XLSX.
9. Tegaskan bukti transfer internal-only.
10. Tegaskan audit log hanya dapat dilihat Super Admin.
11. Tambahkan aturan edit/tidak bisa hapus untuk laporan warga.
12. Perbarui seluruh referensi timeline dan project end.
