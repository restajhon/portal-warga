# USER STORY

## Story Metadata

### Title
Warga login ke portal

### Priority
High (FEAT-001, BRD EPIC-001)

### PM Sync
Not synced

## 1. User Need

### As a
Warga RW yang telah diverifikasi

### I want
Login ke portal menggunakan identifier login yang telah diverifikasi pengurus

### So that
Saya dapat mengakses berita, pengumuman, agenda, laporan keuangan, serta mengirim dan memantau laporan saya

### Business Value
Login adalah pintu masuk seluruh nilai portal (informasi, transparansi keuangan, kanal laporan). Tanpa login yang berfungsi dan aman, tidak ada satupun siklus E2E BRD §2.2 yang bisa berjalan. Story ini juga menegakkan prinsip akses terbatas: hanya warga terverifikasi yang dapat melihat konten komunitas (BRD §3B, BO-02).

## 2. Delivery Context

### Assumptions
- Registrasi warga dilakukan dari portal menggunakan email dan password.
- Akun warga harus mengikuti aturan status/verifikasi yang ditetapkan pengurus.
- Pengurus tidak pernah menerima atau melihat password plaintext.

### Dependencies
- FEAT-002 registrasi mandiri dan verifikasi/status akun warga tersedia.
- Internal user ID digunakan sebagai identitas akun permanen; email menjadi identifier login MVP.
- Infrastruktur staging Vercel + DB aktif (PEP S1, ITA §8).

### Out of Scope
- Lupa password mandiri (via email) — dikelola admin RW untuk MVP.
- Login via Google/media sosial/SSO.
- Ganti password mandiri (kandidat US tersendiri; hanya "ubah password" di halaman profil bila disepakati).

## 3. Acceptance

### Acceptance Criteria
1. Halaman login tersedia di root portal untuk pengunjung tanpa sesi aktif; tidak ada konten warga yang tampil sebelum login.
2. Warga dapat login dengan email + password yang dibuat saat registrasi dan sampai ke dashboard sesuai account type/role (warga → dashboard warga; Super Admin/Admin/Operasional → CMS sesuai permission).
3. Kombinasi kredensial salah menampilkan pesan kesalahan generik (tidak membocorkan field mana yang salah) dan tidak membuat sesi.
4. Setelah 5 kali percobaan gagal dalam 10 menit dari satu akun/IP, percobaan berikutnya ditolak sementara (rate limiting) dengan pesan coba lagi nanti [Usulan angka — selaras ITA §6.2].
5. Sesi aktif bertahan hingga 30 hari atau sampai logout (ITA §6.1); logout mengakhiri sesi dan mengembalikan ke halaman login.
6. URL internal portal (dashboard, konten, laporan) mengarahkan pengguna tanpa sesi ke halaman login.
7. Halaman login responsif (smartphone–desktop) dan memberi petunjuk cara menghubungi admin RW bila warga tidak dapat login (mis. belum punya akun).

### Definition of Done
- [ ] Acceptance criteria are met.
- [ ] Story design is reviewed.
- [ ] Story testing scenarios are reviewed.
- [ ] Product Owner accepts the story.

## 4. Traceability

### Related Files
- Design: `e01-us01--warga-login---design.md`
- Testing: `e01-us01--warga-login---testing.md`
- Epic Index: `index.md`

---

<!--
FILE LOCATION: docs/features/phase-01-mvp-portal-warga/e-01---autentikasi-akun/e01-us01--warga-login---story.md
-->
