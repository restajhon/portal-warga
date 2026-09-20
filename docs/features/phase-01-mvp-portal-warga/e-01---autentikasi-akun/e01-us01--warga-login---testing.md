# STORY TESTING

## Related Story

- Story: `e01-us01--warga-login---story.md`
- Design: `e01-us01--warga-login---design.md`
- Epic: `index.md`
- Status: Draft
- Owner: Resta (QA)

## Test Scope

In Scope:
- Login berhasil dengan kredensial benar dan diarahkan ke dashboard sesuai role.
- Penolakan kredensial salah, akun nonaktif, dan rate limiting.
- Perlindungan konten: tanpa sesi, URL internal mengarahkan ke login; tidak ada kebocoran data.
- Durasi sesi dan logout.

Out of Scope:
- Pembuatan akun oleh admin (US e01-us02, FEAT-002).
- Manajemen role & profil (US lain di epic ini).
- Performa di bawah beban tinggi (skala RW; NFR performance di ITA).

## Gherkin Scenarios

```gherkin
Feature: Warga login ke portal

  Background:
    Given pengurus telah membuat dan memverifikasi akun warga "Budi" dengan status aktif

  @happy-path
  Scenario: Warga login dengan kredensial benar
    When Budi membuka portal dan mengisi email serta password yang benar lalu menekan "Masuk"
    Then sesi login dibuat untuk Budi
    And Budi diarahkan ke dashboard warga
    And Budi melihat navigasi portal (beranda, keuangan, laporan saya)

  @happy-path
  Scenario: Pengurus login dan diarahkan ke CMS
    Given pengurus "Pak Jono" memiliki akun aktif dengan role `admin`
    When Pak Jono login dengan kredensial yang benar
    Then Pak Jono diarahkan ke CMS Pengurus RW sesuai permission, bukan dashboard warga

  @validation
  Scenario: Kredensial salah ditolak tanpa membocorkan field mana yang keliru
    When Budi login dengan password yang salah
    Then pesan "Username atau password salah" tampil
    And sesi tidak dibuat
    And pesan tidak menyebutkan secara spesifik username atau password mana yang salah

  @validation
  Scenario: Field kosong tidak disubmit
    When Budi menekan "Masuk" tanpa mengisi password
    Then submit ditahan dan field wajib ditandai dengan pesan isian diperlukan

  @validation
  Scenario: Akun nonaktif tidak dapat login
    Given akun warga "Budi" berstatus nonaktif
    When Budi login dengan kredensial yang benar
    Then pesan bahwa akun tidak aktif tampil dengan arahan menghubungi admin RW
    And sesi tidak dibuat

  @error-handling
  Scenario: Percobaan gagal berulang dibatasi (rate limiting)
    When Budi gagal login 5 kali berturut-turut dalam 10 menit
    Then percobaan berikutnya ditolak dengan pesan coba lagi nanti
    And penolakan berakhir otomatis setelah jeda waktu berlalu

  @error-handling
  Scenario: Akses URL internal tanpa sesi dialihkan ke login
    Given Budi belum login
    When Budi membuka URL internal portal secara langsung
    Then Budi diarahkan ke halaman login
    And tidak ada konten warga yang tampil di perjalanan

  @error-handling
  Scenario: Logout mengakhiri sesi
    Given Budi sedang login
    When Budi menekan logout
    Then sesi Budi berakhir
    And membuka kembali URL internal mengarahkan ke login

  @error-handling
  Scenario: Sesi kedaluwarsa
    Given sesi Budi telah melewati masa berlaku 30 hari
    When Budi membuka portal
    Then Budi diarahkan ke halaman login tanpa pesan error yang menakutkan
```

## QA Automation Notes

- Suggested test type: Playwright (E2E) + manual responsive check
- Suggested priority: P1
- Key selectors or interaction targets:
  - CTA "Masuk" (UX-01)
  - Input email & password + toggle lihat (UX-02, UX-03)
  - Area pesan error di atas CTA
- Assertions:
  - URL dashboard sesuai role setelah login sukses (warga vs CMS pengurus).
  - Teks error generik sama untuk "email salah" vs "password salah" (anti user-enumeration).
  - Setelah logout, akses URL internal dialihkan ke `/login`.
  - LocalStorage/browser tidak menyimpan password.

## Test Data

- Akun warga aktif (email uji: `budi@example.test`, password dibuat saat registrasi).
- Akun warga baru/nonaktif untuk verifikasi aturan status setelah registrasi.
- Akun Super Admin aktif (role `super_admin`) — verifikasi routing CMS dan akses audit log.
- Akun Admin aktif (role `admin`) — verifikasi routing CMS dan permission administrasi.
- Akun Operasional aktif (role `operasional`) — verifikasi routing CMS dan permission operasional.
- Akun warga aktif untuk skenario rate limiting (dapat direset antar-run).

## Open QA Questions

- Apakah rate limiting juga perlu diuji pada level IP (bukan hanya per akun)? [Usulan: per akun + per IP ringan]
- Perlukah pengujian sesi 30 hari diakselerasi (konfigurasi TTL uji) untuk Sprint? [Usulan: ya, via env var uji]

---

<!--
FILE LOCATION: docs/features/phase-01-mvp-portal-warga/e-01---autentikasi-akun/e01-us01--warga-login---testing.md

RELATED FILES:
- e01-us01--warga-login---story.md
- e01-us01--warga-login---design.md
-->
