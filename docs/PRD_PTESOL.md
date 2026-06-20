# 📄 Product Requirements Document (PRD)

## PTESOL — Platform Simulasi TOEFL ITP

---

| Informasi         | Detail          |
| ----------------- | --------------- |
| **Versi Dokumen** | 1.0.0           |
| **Tanggal**       | Juni 2025       |
| **Status**        | Draft           |
| **Author**        | —               |
| **Reviewer**      | —               |
| **Platform**      | Web Application |

---

## 📋 Daftar Isi

1. [Overview](#1-overview)
2. [Value Proposition](#2-value-proposition)
3. [Goals & Objectives](#3-goals--objectives)
4. [Target Users & Persona](#4-target-users--persona)
5. [Tech Stack](#5-tech-stack)
6. [Fitur & Spesifikasi](#6-fitur--spesifikasi)
   - 6.1 [Authentication & Authorization](#61-authentication--authorization)
   - 6.2 [Simulasi TOEFL ITP](#62-simulasi-toefl-itp)
   - 6.3 [Anti-Cheat System](#63-anti-cheat-system)
   - 6.4 [Mode Latihan (Practice)](#64-mode-latihan-practice)
   - 6.5 [AI Analysis](#65-ai-analysis)
   - 6.6 [History & Progress Tracking](#66-history--progress-tracking)
   - 6.7 [User Settings](#67-user-settings)
   - 6.8 [Admin Panel](#68-admin-panel)
   - 6.9 [Leaderboard](#69-leaderboard)
   - 6.10 [Sistem Notifikasi](#610-sistem-notifikasi)
   - 6.11 [Export PDF Hasil Test](#611-export-pdf-hasil-test)
7. [Data Model & Relasi](#7-data-model--relasi)
8. [Sistem Konversi Skor TOEFL ITP](#8-sistem-konversi-skor-toefl-itp)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Development Phases](#10-development-phases)

---

## 1. Overview

**PTESOL** (Platform Simulasi TOEFL ITP) adalah aplikasi web yang menyediakan simulasi tes TOEFL ITP _(Institutional Testing Program)_ yang autentik dan gratis untuk mahasiswa. Platform ini dirancang untuk mengatasi keterbatasan platform simulasi TOEFL berbayar yang tersedia di internet, sekaligus memberikan pengalaman tes yang lebih sesuai dengan format resmi TOEFL ITP.

TOEFL ITP terdiri dari tiga seksi utama:

| Seksi                            | Jumlah Soal  | Durasi        |
| -------------------------------- | ------------ | ------------- |
| Listening Comprehension          | 50 soal      | 35 menit      |
| Structure and Written Expression | 40 soal      | 25 menit      |
| Reading Comprehension            | 50 soal      | 55 menit      |
| **Total**                        | **140 soal** | **115 menit** |

Skor akhir berkisar antara **310 – 677** menggunakan sistem konversi resmi ETS.

---

## 2. Value Proposition

| Masalah yang Ada                                  | Solusi PTESOL                                                   |
| ------------------------------------------------- | --------------------------------------------------------------- |
| Platform TOEFL online berbayar & tidak terjangkau | ✅ Gratis untuk seluruh mahasiswa terdaftar                     |
| Soal & format tidak sesuai TOEFL ITP asli         | ✅ Format, jumlah soal, dan timer persis standar ETS            |
| Tidak ada analisis kelemahan personal             | ✅ AI (Groq) memberikan analisis mendalam & rekomendasi belajar |
| Tidak terintegrasi dengan sistem kampus           | ✅ Admin bisa buat sesi khusus per prodi/kelas/event            |
| Skor tidak menggunakan skala resmi                | ✅ Konversi skor otomatis ke skala 310–677                      |
| Tidak ada progress tracking jangka panjang        | ✅ Riwayat lengkap + visualisasi tren skor                      |
| Tidak ada mode latihan mandiri                    | ✅ Practice mode per seksi yang fleksibel                       |

---

## 3. Goals & Objectives

### 🎯 Tujuan Utama

- Menyediakan simulasi TOEFL ITP **gratis** yang autentik untuk mahasiswa
- Membantu mahasiswa meningkatkan skor secara terstruktur dengan panduan AI
- Memfasilitasi admin (dosen/staf) untuk membuat sesi test terorganisir per prodi

### 📊 Metrik Keberhasilan (KPI)

| Metrik                               | Target         |
| ------------------------------------ | -------------- |
| Pengguna aktif dalam 3 bulan pertama | ≥ 500 pengguna |
| Tingkat penyelesaian simulasi        | ≥ 80%          |
| Peningkatan skor setelah 3x latihan  | ≥ 5 poin skor  |
| Rating kepuasan pengguna             | ≥ 4.0 / 5.0    |
| Waktu loading halaman test           | < 2 detik      |

---

## 4. Target Users & Persona

### 👨‍🎓 Persona 1: Mahasiswa (Budi, 20 tahun)

- **Role:** Student
- **Kebutuhan:** Latihan TOEFL gratis, bisa dikerjakan kapan saja
- **Pain point:** Platform online mahal, soal tidak mirip format aslinya, tidak tahu kelemahan sendiri
- **Goals:** Mendapat skor ≥ 500 untuk syarat kelulusan atau beasiswa

### 👩‍💼 Persona 2: Dosen / Staf Akademik (Ibu Sari, 35 tahun)

- **Role:** Admin
- **Kebutuhan:** Membuat sesi test TOEFL untuk mahasiswa prodi tertentu, memantau nilai secara massal
- **Pain point:** Tidak ada tools terintegrasi untuk manajemen test di institusi
- **Goals:** Monitor perkembangan seluruh mahasiswa bimbingan dalam satu dashboard

---

## 5. Tech Stack

| Layer              | Teknologi                    | Keterangan                        |
| ------------------ | ---------------------------- | --------------------------------- |
| **Frontend**       | Next 16 (App Router)         | Framework utama SSR/SSG           |
| **Styling**        | Tailwind CSS + Shadcn/UI     | UI components & utility-first CSS |
| **Database**       | Supabase (PostgreSQL)        | Database + Realtime subscription  |
| **Authentication** | Supabase Auth                | Email/password login + session    |
| **Storage**        | Supabase Storage             | Audio MP3 untuk Listening         |
| **AI**             | Groq API (via Vercel AI-SDK) | Model gratis: llama / mixtral     |
| **Deployment**     | Vercel                       | Hosting + CI/CD                   |
| **Email**          | Resend + Supabase Email      | Notifikasi email                  |
| **PDF Export**     | React-PDF / jsPDF            | Download hasil test               |
| **Excel Import**   | SheetJS (xlsx)               | Bulk import soal oleh admin       |
| **Charts**         | Recharts                     | Visualisasi progress & statistik  |

### Rekomendasi Model Groq (Free Tier)

| Model                     | Kegunaan                         | Kecepatan       |
| ------------------------- | -------------------------------- | --------------- |
| `llama-3.1-8b-instant`    | AI Analysis ringan (default)     | ⚡ Sangat cepat |
| `llama-3.3-70b-versatile` | AI Analysis detail & akurat      | 🐢 Lebih lambat |
| `mixtral-8x7b-32768`      | Alternatif untuk konteks panjang | ⚡ Cepat        |

> **Rekomendasi:** Gunakan `llama-3.1-8b-instant` sebagai default dan sediakan opsi `llama-3.3-70b-versatile` untuk analisis mendalam.

---

## 6. Fitur & Spesifikasi

### 📌 Ringkasan MVP vs Post-MVP

> Skala: ✅ **MVP** = wajib ada di rilis pertama agar produk bisa memberi nilai inti (simulasi + skor resmi). 🔜 **Post-MVP** = ditunda ke iterasi berikutnya.

| #     | Fitur                                             | Status                                               |
| ----- | ------------------------------------------------- | ---------------------------------------------------- |
| 6.1   | Authentication & Authorization                    | ✅ **MVP**                                           |
| 6.2   | Simulasi TOEFL ITP                                | ✅ **MVP**                                           |
| 6.3   | Anti-Cheat System                                 | ✅ **MVP**                                           |
| 6.4   | Mode Latihan (Practice)                           | 🔜 Post-MVP                                          |
| 6.5   | AI Analysis                                       | 🔜 Post-MVP                                          |
| 6.6   | History & Progress Tracking                       | 🔜 Post-MVP                                          |
| 6.7   | User Settings                                     | 🔜 Post-MVP                                          |
| 6.8.1 | Admin — Dashboard                                 | 🔜 Post-MVP                                          |
| 6.8.2 | Admin — Manajemen Soal (CRUD dasar)               | ✅ **MVP** _(bulk import & export Excel → Post-MVP)_ |
| 6.8.3 | Admin — Manajemen Sesi                            | 🔜 Post-MVP                                          |
| 6.8.4 | Admin — Manajemen Pengguna (termasuk unlock akun) | ✅ **MVP**                                           |
| 6.9   | Leaderboard                                       | 🔜 Post-MVP                                          |
| 6.10  | Sistem Notifikasi                                 | 🔜 Post-MVP                                          |
| 6.11  | Export PDF Hasil Test                             | 🔜 Post-MVP                                          |

**Inti MVP:** mahasiswa bisa register/login → mengikuti simulasi TOEFL ITP penuh (3 seksi, timer, anti-cheat) → mendapat skor resmi (310–677) → admin bisa input soal & unlock akun yang terkena pelanggaran. Fitur lain (latihan, AI analysis, history/chart, leaderboard, notifikasi, export PDF, manajemen sesi) menyusul di iterasi berikutnya.

---

### 6.1 Authentication & Authorization · ✅ MVP

#### Roles

| Role        | Deskripsi                                                     |
| ----------- | ------------------------------------------------------------- |
| **Admin**   | Dosen/Staf institusi. Kelola soal, sesi, dan pantau mahasiswa |
| **Student** | Mahasiswa. Ikuti simulasi, latihan, lihat hasil & analisis AI |

#### Fitur Auth

- **Register:** Email, password, nama lengkap, NIM, program studi
- **Login:** Email & password via Supabase Auth
- **Forgot Password:** Reset via tautan email
- **Session Management:** JWT-based via Supabase
- **Role Assignment:** Default `student`; admin diset manual via dashboard
- **Profile:** Edit nama, avatar, program studi, NIM

#### Access Control Matrix

| Fitur                        | Admin                | Student            |
| ---------------------------- | -------------------- | ------------------ |
| Manajemen soal (CRUD)        | ✅                   | ❌                 |
| Buat & kelola sesi test      | ✅                   | ❌                 |
| Lihat nilai semua mahasiswa  | ✅                   | ❌                 |
| Export laporan sesi ke Excel | ✅                   | ❌                 |
| Unlock akun terkunci         | ✅                   | ❌                 |
| Ikuti simulasi TOEFL         | ❌                   | ✅                 |
| Ikuti mode latihan           | ❌                   | ✅                 |
| Lihat AI analysis            | ✅ (milik mahasiswa) | ✅ (milik sendiri) |
| Lihat history test           | ✅ (semua)           | ✅ (sendiri)       |
| Lihat leaderboard            | ✅                   | ✅                 |

---

### 6.2 Simulasi TOEFL ITP · ✅ MVP

#### Format Tes

| Seksi                          | Jumlah Soal | Durasi   | Tipe Input                      |
| ------------------------------ | ----------- | -------- | ------------------------------- |
| Listening Comprehension        | 50 soal     | 35 menit | Audio + pilihan ganda (A/B/C/D) |
| Structure & Written Expression | 40 soal     | 25 menit | Pilihan ganda (A/B/C/D)         |
| Reading Comprehension          | 50 soal     | 55 menit | Teks passage + pilihan ganda    |

#### Alur Simulasi

```
[Halaman Info Test]
       ↓
[Masuk Fullscreen Wajib]
       ↓
[SEKSI 1: Listening — 35 menit]
       ↓ (timer habis / klik selesai seksi)
[Jeda 10 Detik — Tidak bisa kembali]
       ↓
[SEKSI 2: Structure — 25 menit]
       ↓ (timer habis / klik selesai seksi)
[Jeda 10 Detik — Tidak bisa kembali]
       ↓
[SEKSI 3: Reading — 55 menit]
       ↓ (timer habis / klik selesai seksi)
[Submit Otomatis → Kalkulasi Skor]
       ↓
[Halaman Hasil Test]
```

#### Ketentuan Teknis

- **Fullscreen Wajib:** Tes tidak bisa dimulai tanpa fullscreen (via Browser Fullscreen API)
- **Timer Ketat:** Setiap seksi punya countdown. Saat timer habis → otomatis pindah ke seksi berikutnya
- **Auto-save:** Jawaban disimpan ke Supabase secara realtime setiap kali pengguna memilih
- **Audio Listening:** Diputar otomatis satu kali, tidak bisa rewind atau diulang
- **Navigasi Soal:** Bisa navigasi antar soal dalam seksi yang sama (non-linear)
- **One-way Flow:** Setelah seksi selesai, tidak bisa kembali ke seksi sebelumnya

#### Halaman Hasil Test

Setelah test selesai, tampilkan:

- Skor per seksi: raw score & converted score
- Total skor (skala 310–677)
- Persentase jawaban benar per seksi
- Durasi pengerjaan
- Interpretasi skor (kategori: Sangat Tinggi / Tinggi / Menengah / Rendah / Sangat Rendah)
- Tombol: **Lihat AI Analysis** | **Download PDF** | **Kembali ke Dashboard**

---

### 6.3 Anti-Cheat System · ✅ MVP

#### Deteksi Pelanggaran

| Aksi Pengguna          | Event Listener     | Konsekuensi                      |
| ---------------------- | ------------------ | -------------------------------- |
| Tekan `ESC`            | `keydown`          | Test exit + skor 0 + lock 24 jam |
| Tekan `Ctrl+Shift+*`   | `keydown`          | Test exit + skor 0 + lock 24 jam |
| Keluar dari fullscreen | `fullscreenchange` | Test exit + skor 0 + lock 24 jam |
| Klik kanan             | `contextmenu`      | Diblokir selama test (silent)    |
| Copy / Paste           | `copy`, `paste`    | Diblokir selama test (silent)    |

#### Mekanisme Lock Akun

```
1. Pelanggaran terdeteksi
   ↓
2. Test otomatis di-submit (status: 'violated', total_score: 0)
   ↓
3. Update users: is_locked = true, locked_until = NOW() + INTERVAL '24 hours'
   ↓
4. Tampilkan halaman "Akun Dikunci" dengan countdown timer
   ↓
5. Setelah 24 jam: is_locked otomatis false (via Supabase Scheduled Function)
   ↓
6. Mahasiswa bisa mengikuti test kembali
```

#### Halaman "Akun Dikunci"

```
⛔ Akun Anda Dikunci

Anda terdeteksi melakukan pelanggaran saat mengikuti tes TOEFL.
Skor Anda untuk sesi ini: 0

Akun akan terbuka kembali dalam:
[COUNTDOWN: 23:45:12]

Jika Anda merasa ini adalah kesalahan, hubungi admin.
```

> **Catatan:** Admin dapat melakukan unlock manual melalui panel manajemen pengguna.

---

### 6.4 Mode Latihan (Practice) · 🔜 Post-MVP

Mode latihan **tidak** menggunakan anti-cheat ketat, dapat diulang kapan saja, dan tidak mempengaruhi skor resmi.

#### Pilihan Latihan

| Tipe Latihan          | Deskripsi                | Jumlah Soal           |
| --------------------- | ------------------------ | --------------------- |
| **Latihan Listening** | Soal audio pilihan ganda | 10 / 20 / 30 / Custom |
| **Latihan Structure** | Soal grammar & structure | 10 / 20 / 30 / Custom |
| **Latihan Reading**   | Soal passage bacaan      | 10 / 20 / 30 / Custom |

#### Fitur Practice Mode

- Pilih jumlah soal sebelum mulai
- Timer opsional (bisa diaktifkan/dinonaktifkan)
- Setelah submit: tampilkan jawaban benar + penjelasan per soal
- Skor ditampilkan dalam **persentase** (bukan skala 310–677)
- Semua riwayat latihan tersimpan di history

---

### 6.5 AI Analysis · 🔜 Post-MVP

AI menggunakan **Groq API** via **Vercel AI-SDK** untuk menganalisis performa mahasiswa secara personal.

#### Trigger Analisis

- ✅ Otomatis setelah simulasi penuh selesai
- ✅ Manual dari halaman history (re-analyze attempt lama)

#### Prompt Input ke AI

```json
{
  "student_name": "Budi Santoso",
  "test_date": "2025-06-15",
  "listening": {
    "raw_score": 38,
    "converted_score": 52,
    "total_questions": 50,
    "wrong_count": 12
  },
  "structure": {
    "raw_score": 30,
    "converted_score": 55,
    "total_questions": 40,
    "wrong_count": 10
  },
  "reading": {
    "raw_score": 40,
    "converted_score": 57,
    "total_questions": 50,
    "wrong_count": 10
  },
  "total_score": 547
}
```

#### Output AI Analysis (Struktur)

| Bagian                  | Isi                                                                       |
| ----------------------- | ------------------------------------------------------------------------- |
| **Ringkasan Performa**  | Interpretasi skor secara keseluruhan & posisi level bahasa                |
| **Kelemahan per Seksi** | Area spesifik yang perlu diperbaiki (misal: listening detail, verb tense) |
| **Kekuatan**            | Area yang sudah dikuasai dengan baik                                      |
| **Rekomendasi Latihan** | Saran belajar konkret, terstruktur, dan actionable                        |
| **Target Skor**         | Estimasi skor yang bisa dicapai setelah mengikuti rekomendasi             |

#### Tampilan UI

- Card AI Analysis dengan Markdown rendering
- Tombol "Generate Ulang" (re-generate dari data yang sama)
- Hasil disimpan ke database — tidak di-generate ulang setiap buka halaman

---

### 6.6 History & Progress Tracking · 🔜 Post-MVP

#### Halaman History

- Daftar semua attempt (simulasi + latihan) diurutkan terbaru
- Filter: berdasarkan tipe (simulasi/latihan), seksi, rentang tanggal
- Klik detail → lihat hasil lengkap + AI analysis (jika ada)

#### Progress Chart

| Chart           | Deskripsi                                             |
| --------------- | ----------------------------------------------------- |
| **Line Chart**  | Tren total skor dari waktu ke waktu                   |
| **Bar Chart**   | Perbandingan skor per seksi (L / S / R) antar attempt |
| **Radar Chart** | Visualisasi balance antara ketiga seksi               |

---

### 6.7 User Settings · 🔜 Post-MVP

| Setting                        | Opsi                     |
| ------------------------------ | ------------------------ |
| **Tema**                       | Light / Dark / System    |
| **Bahasa**                     | Indonesia / English      |
| **Notifikasi Email**           | On / Off                 |
| **Notifikasi In-App**          | On / Off                 |
| **Sembunyikan di Leaderboard** | On / Off                 |
| **Edit Profil**                | Nama, NIM, Prodi, Avatar |
| **Ganti Password**             | Via re-authentication    |

---

### 6.8 Admin Panel

#### 6.8.1 Dashboard Admin · 🔜 Post-MVP

- Total mahasiswa terdaftar
- Total simulasi yang sudah dilakukan
- Rata-rata skor per prodi
- Distribusi skor (histogram)
- Grafik mahasiswa aktif per hari
- Daftar top performers & students yang perlu perhatian (skor rendah)

#### 6.8.2 Manajemen Soal · ✅ MVP (CRUD dasar; bulk import/export Excel → 🔜 Post-MVP)

**Komponen soal per seksi:**

| Seksi         | Komponen                                                                          |
| ------------- | --------------------------------------------------------------------------------- |
| **Listening** | Upload audio (MP3) + teks soal + 4 opsi jawaban + kunci + penjelasan + difficulty |
| **Structure** | Teks soal / kalimat rumpang + 4 opsi jawaban + kunci + penjelasan + difficulty    |
| **Reading**   | Pilih/buat passage + teks soal + 4 opsi jawaban + kunci + penjelasan + difficulty |

**Fitur manajemen soal:**

- CRUD soal per seksi
- Preview soal sebelum publish
- Tandai soal: `active` / `inactive` / `archived`
- Filter & search soal
- Bulk import via Excel (.xlsx)
- Export soal ke Excel

**Template Excel Bulk Import:**

| Kolom             | Keterangan                                                 |
| ----------------- | ---------------------------------------------------------- |
| `section`         | `listening` / `structure` / `reading`                      |
| `question_text`   | Teks pertanyaan                                            |
| `audio_filename`  | Nama file audio (khusus listening, upload manual terpisah) |
| `passage_title`   | Judul passage (khusus reading)                             |
| `passage_content` | Isi teks bacaan (khusus reading)                           |
| `option_a`        | Pilihan A                                                  |
| `option_b`        | Pilihan B                                                  |
| `option_c`        | Pilihan C                                                  |
| `option_d`        | Pilihan D                                                  |
| `correct_answer`  | `A` / `B` / `C` / `D`                                      |
| `explanation`     | Penjelasan jawaban (opsional)                              |
| `difficulty`      | `easy` / `medium` / `hard`                                 |
| `tags`            | Tag topik, dipisah koma (opsional)                         |

#### 6.8.3 Manajemen Sesi · 🔜 Post-MVP

Admin dapat membuat **sesi test** seperti _"TOEFL Batch Prodi Informatika — Genap 2025"_:

| Field           | Deskripsi                            |
| --------------- | ------------------------------------ |
| Judul Sesi      | Nama event test                      |
| Deskripsi       | Keterangan tambahan                  |
| Program Studi   | Target prodi (bisa lebih dari 1)     |
| Tanggal Mulai   | Kapan sesi dibuka                    |
| Tanggal Selesai | Kapan sesi ditutup                   |
| Maks Peserta    | Batas jumlah mahasiswa (opsional)    |
| Kode Undangan   | Auto-generate kode unik 6–8 karakter |

**Fitur manajemen sesi:**

- Generate kode undangan unik → mahasiswa join via kode
- Lihat daftar peserta yang sudah/belum ikut test
- Export hasil sesi ke Excel (nama, NIM, prodi, skor per seksi, total skor)
- Bandingkan hasil antar sesi

#### 6.8.4 Manajemen Pengguna · ✅ MVP

- Lihat semua akun mahasiswa
- Aktifkan / nonaktifkan akun
- **Unlock manual** akun yang terkunci (override 24 jam)
- Reset password mahasiswa
- Lihat riwayat test mahasiswa

---

### 6.9 Leaderboard · 🔜 Post-MVP

| Tipe          | Deskripsi                                            |
| ------------- | ---------------------------------------------------- |
| **Global**    | Top 50 mahasiswa berdasarkan skor simulasi tertinggi |
| **Per Sesi**  | Ranking mahasiswa dalam satu sesi admin              |
| **Per Prodi** | Ranking berdasarkan program studi                    |

- Kolom: Rank, Nama, Prodi, Skor Tertinggi, Tanggal Test
- Filter: All time / Bulan ini / Minggu ini
- Opsi privasi: mahasiswa bisa menyembunyikan nama dari leaderboard (via user settings)

---

### 6.10 Sistem Notifikasi · 🔜 Post-MVP

| Tipe                 | Trigger                               | Channel        |
| -------------------- | ------------------------------------- | -------------- |
| Sesi baru tersedia   | Admin membuat sesi & assign mahasiswa | In-app + Email |
| Sesi segera berakhir | H-1 dan H-3 jam sebelum `end_date`    | In-app + Email |
| Hasil simulasi siap  | Test selesai disubmit                 | In-app         |
| AI analysis siap     | AI selesai generate                   | In-app         |
| Akun dikunci         | Pelanggaran anti-cheat terdeteksi     | In-app         |
| Akun terbuka kembali | 24 jam setelah lock                   | In-app + Email |
| Reminder latihan     | 3 hari tidak ada aktivitas login      | Email          |

---

### 6.11 Export PDF Hasil Test · 🔜 Post-MVP

PDF dapat didownload setelah simulasi selesai. Berisi:

- Identitas mahasiswa: nama, NIM, program studi
- Tanggal & waktu test
- Skor per seksi (raw score + converted score)
- Total skor (skala 310–677) + kategori
- Tabel ringkasan: jumlah benar / salah per seksi
- Ringkasan AI Analysis (jika tersedia)
- Footer: nama platform + tanggal cetak

---

## 7. Data Model & Relasi

### 7.1 Tabel `users`

| Kolom           | Tipe         | Constraint                      | Keterangan               |
| --------------- | ------------ | ------------------------------- | ------------------------ |
| `id`            | uuid         | PK, default `gen_random_uuid()` |                          |
| `email`         | varchar(255) | UNIQUE, NOT NULL                |                          |
| `full_name`     | varchar(255) | NOT NULL                        |                          |
| `student_id`    | varchar(50)  | NULLABLE                        | NIM mahasiswa            |
| `role`          | enum         | NOT NULL, default `'student'`   | `'admin'` \| `'student'` |
| `program_study` | varchar(100) | NULLABLE                        |                          |
| `faculty`       | varchar(100) | NULLABLE                        |                          |
| `avatar_url`    | text         | NULLABLE                        |                          |
| `is_locked`     | boolean      | NOT NULL, default `false`       |                          |
| `locked_until`  | timestamp    | NULLABLE                        | Waktu unlock otomatis    |
| `created_at`    | timestamp    | NOT NULL, default `NOW()`       |                          |
| `updated_at`    | timestamp    | NOT NULL, default `NOW()`       |                          |

---

### 7.2 Tabel `passages`

| Kolom        | Tipe         | Constraint      | Keterangan          |
| ------------ | ------------ | --------------- | ------------------- |
| `id`         | uuid         | PK              |                     |
| `title`      | varchar(255) | NOT NULL        |                     |
| `content`    | text         | NOT NULL        | Teks bacaan reading |
| `created_by` | uuid         | FK → `users.id` |                     |
| `created_at` | timestamp    | NOT NULL        |                     |
| `updated_at` | timestamp    | NOT NULL        |                     |

---

### 7.3 Tabel `questions`

| Kolom            | Tipe      | Constraint                   | Keterangan                                    |
| ---------------- | --------- | ---------------------------- | --------------------------------------------- |
| `id`             | uuid      | PK                           |                                               |
| `section`        | enum      | NOT NULL                     | `'listening'` \| `'structure'` \| `'reading'` |
| `question_text`  | text      | NULLABLE                     |                                               |
| `audio_url`      | text      | NULLABLE                     | URL Supabase Storage (listening)              |
| `passage_id`     | uuid      | FK → `passages.id`, NULLABLE | Untuk reading                                 |
| `options`        | jsonb     | NOT NULL                     | `{"A":"...","B":"...","C":"...","D":"..."}`   |
| `correct_answer` | char(1)   | NOT NULL                     | `A` / `B` / `C` / `D`                         |
| `explanation`    | text      | NULLABLE                     |                                               |
| `difficulty`     | enum      | NULLABLE                     | `'easy'` \| `'medium'` \| `'hard'`            |
| `tags`           | text[]    | NULLABLE                     |                                               |
| `is_active`      | boolean   | NOT NULL, default `true`     |                                               |
| `created_by`     | uuid      | FK → `users.id`              |                                               |
| `created_at`     | timestamp | NOT NULL                     |                                               |
| `updated_at`     | timestamp | NOT NULL                     |                                               |

---

### 7.4 Tabel `sessions`

| Kolom              | Tipe         | Constraint               | Keterangan         |
| ------------------ | ------------ | ------------------------ | ------------------ |
| `id`               | uuid         | PK                       |                    |
| `title`            | varchar(255) | NOT NULL                 |                    |
| `description`      | text         | NULLABLE                 |                    |
| `program_study`    | varchar(100) | NULLABLE                 |                    |
| `faculty`          | varchar(100) | NULLABLE                 |                    |
| `invite_code`      | varchar(10)  | UNIQUE, NOT NULL         | Kode undangan unik |
| `start_date`       | timestamp    | NOT NULL                 |                    |
| `end_date`         | timestamp    | NOT NULL                 |                    |
| `max_participants` | int          | NULLABLE                 |                    |
| `is_active`        | boolean      | NOT NULL, default `true` |                    |
| `created_by`       | uuid         | FK → `users.id`          | Admin pembuat      |
| `created_at`       | timestamp    | NOT NULL                 |                    |
| `updated_at`       | timestamp    | NOT NULL                 |                    |

---

### 7.5 Tabel `session_participants`

| Kolom        | Tipe      | Constraint                      | Keterangan |
| ------------ | --------- | ------------------------------- | ---------- |
| `id`         | uuid      | PK                              |            |
| `session_id` | uuid      | FK → `sessions.id`              |            |
| `user_id`    | uuid      | FK → `users.id`                 |            |
| `joined_at`  | timestamp | NOT NULL                        |            |
| —            | —         | UNIQUE(`session_id`, `user_id`) |            |

---

### 7.6 Tabel `test_attempts`

| Kolom                  | Tipe        | Constraint                   | Keterangan                                            |
| ---------------------- | ----------- | ---------------------------- | ----------------------------------------------------- |
| `id`                   | uuid        | PK                           |                                                       |
| `user_id`              | uuid        | FK → `users.id`, NOT NULL    |                                                       |
| `session_id`           | uuid        | FK → `sessions.id`, NULLABLE | `null` = simulasi mandiri                             |
| `status`               | enum        | NOT NULL                     | `'in_progress'` \| `'completed'` \| `'violated'`      |
| `current_section`      | enum        | NULLABLE                     | Seksi aktif saat ini                                  |
| `listening_started_at` | timestamp   | NULLABLE                     |                                                       |
| `structure_started_at` | timestamp   | NULLABLE                     |                                                       |
| `reading_started_at`   | timestamp   | NULLABLE                     |                                                       |
| `listening_raw`        | int         | NULLABLE                     | 0–50                                                  |
| `structure_raw`        | int         | NULLABLE                     | 0–40                                                  |
| `reading_raw`          | int         | NULLABLE                     | 0–50                                                  |
| `listening_converted`  | int         | NULLABLE                     | Skala 31–68                                           |
| `structure_converted`  | int         | NULLABLE                     | Skala 31–68                                           |
| `reading_converted`    | int         | NULLABLE                     | Skala 31–67                                           |
| `total_score`          | int         | NULLABLE                     | Skala 310–677                                         |
| `violation_type`       | varchar(50) | NULLABLE                     | `'escape_key'`, `'shortcut_key'`, `'fullscreen_exit'` |
| `started_at`           | timestamp   | NOT NULL                     |                                                       |
| `completed_at`         | timestamp   | NULLABLE                     |                                                       |
| `created_at`           | timestamp   | NOT NULL                     |                                                       |

---

### 7.7 Tabel `test_answers`

| Kolom             | Tipe      | Constraint              | Keterangan                  |
| ----------------- | --------- | ----------------------- | --------------------------- |
| `id`              | uuid      | PK                      |                             |
| `attempt_id`      | uuid      | FK → `test_attempts.id` |                             |
| `question_id`     | uuid      | FK → `questions.id`     |                             |
| `selected_answer` | char(1)   | NULLABLE                | `A`/`B`/`C`/`D` atau `null` |
| `is_correct`      | boolean   | NULLABLE                |                             |
| `answered_at`     | timestamp | NULLABLE                |                             |

---

### 7.8 Tabel `practice_attempts`

| Kolom              | Tipe         | Constraint      | Keterangan                                    |
| ------------------ | ------------ | --------------- | --------------------------------------------- |
| `id`               | uuid         | PK              |                                               |
| `user_id`          | uuid         | FK → `users.id` |                                               |
| `section`          | enum         | NOT NULL        | `'listening'` \| `'structure'` \| `'reading'` |
| `status`           | enum         | NOT NULL        | `'in_progress'` \| `'completed'`              |
| `total_questions`  | int          | NOT NULL        |                                               |
| `correct_count`    | int          | NULLABLE        |                                               |
| `score_percentage` | decimal(5,2) | NULLABLE        | 0.00–100.00                                   |
| `started_at`       | timestamp    | NOT NULL        |                                               |
| `completed_at`     | timestamp    | NULLABLE        |                                               |
| `created_at`       | timestamp    | NOT NULL        |                                               |

---

### 7.9 Tabel `practice_answers`

| Kolom                 | Tipe      | Constraint                  | Keterangan |
| --------------------- | --------- | --------------------------- | ---------- |
| `id`                  | uuid      | PK                          |            |
| `practice_attempt_id` | uuid      | FK → `practice_attempts.id` |            |
| `question_id`         | uuid      | FK → `questions.id`         |            |
| `selected_answer`     | char(1)   | NULLABLE                    |            |
| `is_correct`          | boolean   | NULLABLE                    |            |
| `answered_at`         | timestamp | NULLABLE                    |            |

---

### 7.10 Tabel `ai_analyses`

| Kolom                 | Tipe         | Constraint                            | Keterangan                                 |
| --------------------- | ------------ | ------------------------------------- | ------------------------------------------ |
| `id`                  | uuid         | PK                                    |                                            |
| `user_id`             | uuid         | FK → `users.id`                       |                                            |
| `attempt_id`          | uuid         | FK → `test_attempts.id`, NULLABLE     |                                            |
| `practice_attempt_id` | uuid         | FK → `practice_attempts.id`, NULLABLE |                                            |
| `analysis_type`       | enum         | NOT NULL                              | `'simulation'` \| `'practice'`             |
| `weakness_areas`      | jsonb        | NULLABLE                              | `{"listening": [...], "structure": [...]}` |
| `strengths`           | jsonb        | NULLABLE                              |                                            |
| `recommendations`     | jsonb        | NULLABLE                              | List saran belajar                         |
| `full_analysis`       | text         | NOT NULL                              | Teks lengkap dari AI                       |
| `model_used`          | varchar(100) | NOT NULL                              | e.g. `llama-3.1-8b-instant`                |
| `created_at`          | timestamp    | NOT NULL                              |                                            |

---

### 7.11 Tabel `notifications`

| Kolom        | Tipe         | Constraint                | Keterangan                                                                                                                         |
| ------------ | ------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | uuid         | PK                        |                                                                                                                                    |
| `user_id`    | uuid         | FK → `users.id`           |                                                                                                                                    |
| `title`      | varchar(255) | NOT NULL                  |                                                                                                                                    |
| `message`    | text         | NOT NULL                  |                                                                                                                                    |
| `type`       | enum         | NOT NULL                  | `'session_invite'` \| `'result_ready'` \| `'ai_ready'` \| `'account_locked'` \| `'account_unlocked'` \| `'reminder'` \| `'system'` |
| `is_read`    | boolean      | NOT NULL, default `false` |                                                                                                                                    |
| `metadata`   | jsonb        | NULLABLE                  | Data tambahan (misal: `session_id`)                                                                                                |
| `created_at` | timestamp    | NOT NULL                  |                                                                                                                                    |

---

### 7.12 Tabel `user_settings`

| Kolom                 | Tipe      | Constraint                   | Keterangan                          |
| --------------------- | --------- | ---------------------------- | ----------------------------------- |
| `id`                  | uuid      | PK                           |                                     |
| `user_id`             | uuid      | FK → `users.id`, UNIQUE      |                                     |
| `theme`               | enum      | NOT NULL, default `'system'` | `'light'` \| `'dark'` \| `'system'` |
| `language`            | enum      | NOT NULL, default `'id'`     | `'id'` \| `'en'`                    |
| `email_notifications` | boolean   | NOT NULL, default `true`     |                                     |
| `inapp_notifications` | boolean   | NOT NULL, default `true`     |                                     |
| `hide_leaderboard`    | boolean   | NOT NULL, default `false`    |                                     |
| `updated_at`          | timestamp | NOT NULL                     |                                     |

---

### 7.13 Diagram Relasi (ERD Summary)

```
users ─────────────────────────────────────────────────────────┐
  │                                                             │
  ├──(1:N)──→ test_attempts ──(1:N)──→ test_answers            │
  │                │                                            │
  │                └──(1:1)──→ ai_analyses                      │
  │                                                             │
  ├──(1:N)──→ practice_attempts ──(1:N)──→ practice_answers     │
  │                │                                            │
  │                └──(1:1)──→ ai_analyses                      │
  │                                                             │
  ├──(1:N)──→ session_participants ──→ sessions ────────────────┘
  │                                      │
  │                                      └──(1:N)──→ test_attempts
  │
  ├──(1:N)──→ notifications
  ├──(1:1)──→ user_settings
  ├──(1:N)──→ questions ──→ passages
  └──(1:N)──→ passages

questions ──(1:N)──→ test_answers
questions ──(1:N)──→ practice_answers
passages  ──(1:N)──→ questions
```

---

## 8. Sistem Konversi Skor TOEFL ITP

Total skor dihitung menggunakan formula resmi:

```
Total Score = ROUND((listening_converted + structure_converted + reading_converted) × 10 / 3)
```

Rentang skor akhir: **310 – 677**

---

### 8.1 Tabel Konversi Listening Comprehension (50 soal → skala 31–68)

| Raw | Scaled | Raw | Scaled | Raw | Scaled |
| :-: | :----: | :-: | :----: | :-: | :----: |
| 50  |   68   | 33  |   45   | 16  |   23   |
| 49  |   67   | 32  |   43   | 15  |   21   |
| 48  |   66   | 31  |   42   | 14  |   20   |
| 47  |   65   | 30  |   40   | 13  |   19   |
| 46  |   63   | 29  |   39   | 12  |   18   |
| 45  |   62   | 28  |   38   | 11  |   16   |
| 44  |   61   | 27  |   36   | 10  |   15   |
| 43  |   59   | 26  |   35   |  9  |   14   |
| 42  |   58   | 25  |   34   |  8  |   13   |
| 41  |   56   | 24  |   33   |  7  |   11   |
| 40  |   55   | 23  |   31   |  6  |   10   |
| 39  |   53   | 22  |   30   |  5  |   9    |
| 38  |   52   | 21  |   29   |  4  |   8    |
| 37  |   50   | 20  |   28   |  3  |   6    |
| 36  |   49   | 19  |   26   |  2  |   5    |
| 35  |   48   | 18  |   25   |  1  |   4    |
| 34  |   46   | 17  |   24   |  0  |   31   |

---

### 8.2 Tabel Konversi Structure & Written Expression (40 soal → skala 31–68)

| Raw | Scaled | Raw | Scaled | Raw | Scaled |
| :-: | :----: | :-: | :----: | :-: | :----: |
| 40  |   68   | 27  |   50   | 14  |   32   |
| 39  |   67   | 26  |   49   | 13  |   30   |
| 38  |   66   | 25  |   48   | 12  |   29   |
| 37  |   65   | 24  |   46   | 11  |   27   |
| 36  |   63   | 23  |   45   | 10  |   26   |
| 35  |   62   | 22  |   43   |  9  |   24   |
| 34  |   61   | 21  |   42   |  8  |   23   |
| 33  |   59   | 20  |   40   |  7  |   21   |
| 32  |   57   | 19  |   39   |  6  |   20   |
| 31  |   56   | 18  |   37   |  5  |   19   |
| 30  |   55   | 17  |   36   |  4  |   17   |
| 29  |   53   | 16  |   35   |  3  |   16   |
| 28  |   52   | 15  |   33   |  2  |   15   |
|  —  |   —    |  —  |   —    |  1  |   13   |
|  —  |   —    |  —  |   —    |  0  |   31   |

---

### 8.3 Tabel Konversi Reading Comprehension (50 soal → skala 31–67)

| Raw | Scaled | Raw | Scaled | Raw | Scaled |
| :-: | :----: | :-: | :----: | :-: | :----: |
| 50  |   67   | 33  |   50   | 16  |   33   |
| 49  |   66   | 32  |   49   | 15  |   32   |
| 48  |   65   | 31  |   48   | 14  |   31   |
| 47  |   64   | 30  |   47   | 13  |   30   |
| 46  |   63   | 29  |   46   | 12  |   29   |
| 45  |   62   | 28  |   45   | 11  |   28   |
| 44  |   61   | 27  |   44   | 10  |   27   |
| 43  |   60   | 26  |   43   |  9  |   26   |
| 42  |   59   | 25  |   42   |  8  |   25   |
| 41  |   58   | 24  |   41   |  7  |   24   |
| 40  |   57   | 23  |   40   |  6  |   23   |
| 39  |   56   | 22  |   39   |  5  |   22   |
| 38  |   55   | 21  |   38   |  4  |   21   |
| 37  |   54   | 20  |   37   |  3  |   20   |
| 36  |   53   | 19  |   36   |  2  |   19   |
| 35  |   52   | 18  |   35   |  1  |   18   |
| 34  |   51   | 17  |   34   |  0  |   31   |

---

### 8.4 Contoh Perhitungan Skor

```
Listening  : Raw 38 → Converted 52
Structure  : Raw 30 → Converted 55
Reading    : Raw 40 → Converted 57

Total Score = ROUND((52 + 55 + 57) × 10 / 3)
            = ROUND(164 × 10 / 3)
            = ROUND(546.67)
            = 547
```

### 8.5 Tabel Interpretasi Skor

| Rentang Skor | Kategori      | Level CEFR |
| ------------ | ------------- | ---------- |
| 627 – 677    | Sangat Tinggi | C1 – C2    |
| 543 – 626    | Tinggi        | B2         |
| 460 – 542    | Menengah      | B1         |
| 337 – 459    | Rendah        | A2         |
| 310 – 336    | Sangat Rendah | A1         |

---

## 9. Non-Functional Requirements

### 9.1 Performa

| Indikator                | Target                                |
| ------------------------ | ------------------------------------- |
| Halaman utama loading    | < 2 detik                             |
| Audio mulai diputar      | < 1 detik setelah halaman soal tampil |
| API response submit test | < 3 detik                             |
| Concurrent users         | ≥ 200 pengguna bersamaan              |

### 9.2 Keamanan

- Semua endpoint API dilindungi **Supabase RLS** (Row Level Security)
- **HTTPS** wajib di seluruh endpoint
- Audio file hanya bisa diakses via **Signed URL** Supabase Storage (bukan public URL)
- Validasi input **server-side** untuk semua form submission
- **Rate limiting** pada API routes via Next.js middleware

### 9.3 Ketersediaan

- Uptime target: **99.5%** (Vercel + Supabase SLA)
- Backup database otomatis via Supabase (daily backup)
- Error monitoring via Vercel Analytics / Sentry

### 9.4 Responsivitas

| Platform            | Dukungan                                                             |
| ------------------- | -------------------------------------------------------------------- |
| Desktop (≥ 1024px)  | ✅ Full support — semua fitur termasuk simulasi                      |
| Tablet (768–1023px) | ⚠️ Partial — mode latihan & history; simulasi tidak direkomendasikan |
| Mobile (< 768px)    | ⚠️ Partial — history, profil, leaderboard; simulasi tidak tersedia   |

> Simulasi TOEFL hanya tersedia di desktop karena keterbatasan Fullscreen API pada mobile browser.

### 9.5 Aksesibilitas

- Kontras warna memenuhi **WCAG 2.1 Level AA**
- Keyboard navigasi untuk seluruh interface
- Alt text untuk semua gambar & icon

---

## 10. Development Phases

### Phase 1 — Foundation & Setup (Minggu 1–2)

**Goal:** Project siap dengan autentikasi dan struktur database penuh

- [ ] Setup Next.js 14 + Tailwind CSS + Shadcn/UI
- [ ] Setup Supabase: database schema, RLS policies, Supabase Auth
- [ ] Setup Supabase Storage (bucket audio, konfigurasi signed URL)
- [ ] Implementasi autentikasi: register, login, forgot password
- [ ] Role-based middleware (Admin / Student)
- [ ] Layout dasar: Sidebar, Navbar, Dashboard skeleton
- [ ] Setup Vercel deployment + environment variables

**✅ Deliverable:** Aplikasi live, user bisa register & login dengan role

---

### Phase 2 — Admin Panel & Manajemen Soal (Minggu 3–4)

**Goal:** Admin bisa mengelola soal dan konten platform

- [ ] Admin dashboard & statistik dasar
- [ ] CRUD soal (Listening, Structure, Reading)
- [ ] Upload audio MP3 ke Supabase Storage + preview player
- [ ] Manajemen passage untuk Reading
- [ ] Bulk import soal via Excel (.xlsx) menggunakan SheetJS
- [ ] Manajemen sesi: buat, edit, assign peserta, generate invite code
- [ ] Manajemen pengguna: lihat daftar, lock/unlock akun

**✅ Deliverable:** Admin bisa input soal, buat sesi, dan kelola pengguna

---

### Phase 3 — Simulasi TOEFL ITP (Minggu 5–6)

**Goal:** Fitur inti simulasi berjalan end-to-end

- [ ] Fullscreen mode enforcement (Browser Fullscreen API)
- [ ] Engine test: alur Listening → Structure → Reading
- [ ] Countdown timer per seksi (ketat, auto-submit saat habis)
- [ ] Auto-save jawaban ke Supabase realtime
- [ ] Anti-cheat: deteksi ESC, shortcut keys, fullscreen exit
- [ ] Mekanisme lock akun 24 jam + halaman countdown "Akun Dikunci"
- [ ] Kalkulasi skor & konversi ke skala 310–677 (lookup table)
- [ ] Halaman hasil test (skor per seksi, total, interpretasi)
- [ ] Export PDF hasil test

**✅ Deliverable:** Simulasi TOEFL bisa dijalankan penuh dengan anti-cheat dan skor resmi

---

### Phase 4 — Mode Latihan (Minggu 7)

**Goal:** Mode latihan per seksi tersedia untuk mahasiswa

- [ ] Halaman practice mode (pilih seksi & jumlah soal)
- [ ] Timer opsional (bisa diaktifkan/dinonaktifkan)
- [ ] Submit & tampilkan jawaban benar + penjelasan per soal
- [ ] Simpan riwayat latihan ke database (`practice_attempts`)

**✅ Deliverable:** Mahasiswa bisa berlatih mandiri per seksi kapan saja

---

### Phase 5 — AI Analysis (Minggu 8)

**Goal:** Groq API terintegrasi untuk analisis performa personal

- [ ] Setup Groq API + Vercel AI-SDK
- [ ] Generate AI analysis setelah simulasi selesai (auto-trigger)
- [ ] Tampilkan analisis: kelemahan, kekuatan, rekomendasi belajar
- [ ] Simpan hasil analisis ke tabel `ai_analyses`
- [ ] Tombol "Generate Ulang" dari halaman history

**✅ Deliverable:** AI analysis muncul otomatis setelah setiap simulasi selesai

---

### Phase 6 — History, Progress & Leaderboard (Minggu 9)

**Goal:** Tracking progres dan kompetisi antar mahasiswa

- [ ] Halaman history: daftar simulasi & latihan dengan filter
- [ ] Grafik progress: line chart, bar chart, radar chart (Recharts)
- [ ] Leaderboard: global, per sesi, per prodi
- [ ] Sistem notifikasi in-app (bell icon + panel notifikasi)
- [ ] Email notifikasi via Resend

**✅ Deliverable:** Mahasiswa dapat melihat tren skor dan bersaing di leaderboard

---

### Phase 7 — Settings, Polish & QA (Minggu 10–11)

**Goal:** Sempurnakan UX dan siapkan production

- [ ] Halaman user settings (tema, bahasa, notifikasi, profil)
- [ ] Admin: export Excel hasil sesi test
- [ ] Responsive design (tablet & mobile untuk fitur non-simulasi)
- [ ] Performance optimization: lazy loading, audio preloading, image optimization
- [ ] Error handling & loading states konsisten di semua halaman
- [ ] Unit testing (Vitest) + Integration testing
- [ ] Bug fixing dari QA internal

**✅ Deliverable:** Aplikasi siap untuk UAT (User Acceptance Testing)

---

### Phase 8 — Deployment & Go-Live (Minggu 12)

**Goal:** Aplikasi live di production dan siap digunakan

- [ ] Final deployment ke Vercel production
- [ ] Setup Supabase production environment (terpisah dari dev)
- [ ] Setup monitoring: Vercel Analytics + Supabase Dashboard
- [ ] Seed data awal: soal sample, akun admin default
- [ ] User Acceptance Testing bersama mahasiswa & admin nyata
- [ ] Dokumentasi teknis (README, API docs) & user guide
- [ ] 🚀 **Go-Live!**

**✅ Deliverable:** PTESOL tersedia dan siap digunakan publik

---

## 📌 Ringkasan Timeline

| Phase   | Minggu  | Fokus Utama                        |
| ------- | ------- | ---------------------------------- |
| Phase 1 | 1 – 2   | Foundation, Auth, Database Schema  |
| Phase 2 | 3 – 4   | Admin Panel, Manajemen Soal & Sesi |
| Phase 3 | 5 – 6   | Simulasi TOEFL (core engine)       |
| Phase 4 | 7       | Mode Latihan (Practice)            |
| Phase 5 | 8       | AI Analysis (Groq)                 |
| Phase 6 | 9       | History, Leaderboard, Notifikasi   |
| Phase 7 | 10 – 11 | Polish, Responsive, QA & Bug Fix   |
| Phase 8 | 12      | Deployment & Go-Live               |

**⏱️ Estimasi Total: ~12 Minggu (±3 Bulan)**

---

> 📝 _Dokumen ini bersifat living document dan dapat diperbarui seiring perkembangan dan perubahan kebutuhan proyek._
