# PTESOL — Platform Simulasi TOEFL ITP

Platform simulasi TOEFL ITP gratis berbasis web untuk mahasiswa. Mahasiswa dapat mengikuti simulasi penuh (Listening, Structure, Reading) dengan skor resmi 310–677, latihan per seksi, analisis AI, dan leaderboard. Admin (dosen/staf) mengelola soal, sesi test, dan pengguna.

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Setup Lokal](#setup-lokal)
- [Environment Variables](#environment-variables)
- [Supabase — Menjalankan Migrasi](#supabase--menjalankan-migrasi)
- [Seed Data Awal](#seed-data-awal)
- [Struktur Folder](#struktur-folder)
- [Perintah yang Tersedia](#perintah-yang-tersedia)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Supabase Production Setup](#supabase-production-setup)
- [Cara Buat Akun Admin](#cara-buat-akun-admin)
- [Manual Test Checklist](#manual-test-checklist)

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Validasi | Zod v4 |
| Forms | React Hook Form |
| AI | Groq API (`llama-3.3-70b-versatile`) via Vercel AI SDK |
| Email | Resend |
| Excel | SheetJS (xlsx 0.20.3) |
| Analytics | Vercel Analytics + Speed Insights |
| Testing | Vitest |

---

## Prasyarat

- **Node.js** >= 20 (check: `node -v`)
- **npm** >= 10 (check: `npm -v`)
- Akun **Supabase** (gratis) — [supabase.com](https://supabase.com)
- Akun **Vercel** (gratis) — [vercel.com](https://vercel.com)
- Akun **Groq** (gratis) untuk AI Analysis — [console.groq.com](https://console.groq.com)
- (Opsional) Akun **Resend** untuk email — [resend.com](https://resend.com)

---

## Setup Lokal

```bash
# 1. Clone repo
git clone <repo-url>
cd prepm

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.local.example .env.local
# Isi .env.local dengan nilai yang sesuai (lihat Environment Variables di bawah)

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.local.example` ke `.env.local` lalu isi:

```bash
cp .env.local.example .env.local
```

### Wajib (minimal agar app bisa jalan)

| Variabel | Dari mana | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | **Rahasia** — server only |

### Opsional (fitur post-MVP)

| Variabel | Dari mana | Keterangan |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys | Untuk AI Analysis. Tanpa ini, tab AI Analysis tidak muncul |
| `RESEND_API_KEY` | [app.resend.com](https://app.resend.com) → API Keys | Email notifikasi (unlock akun, dll.) |
| `RESEND_FROM` | — | Format: `PTESOL <no-reply@domain.com>` |
| `CRON_SECRET` | `openssl rand -hex 32` | Proteksi `/api/cron/*`. **Wajib di production** |

### Untuk seed script (opsional, ada default-nya)

| Variabel | Default | Keterangan |
|---|---|---|
| `SEED_ADMIN_EMAIL` | `admin@ptesol.dev` | Email akun admin |
| `SEED_ADMIN_PASSWORD` | `Admin@ptesol123!` | Password — **ganti setelah login pertama** |
| `SEED_ADMIN_NAME` | `Admin PTESOL` | Nama tampilan |

> Jangan pernah commit `.env.local` atau `.env.production` ke Git. Sudah di-ignore di `.gitignore`.

---

## Supabase — Menjalankan Migrasi

Migrasi harus dijalankan **berurutan** — setiap file bergantung pada file sebelumnya.

### Cara 1: SQL Editor (Lebih Mudah)

1. Buka [Supabase Dashboard](https://app.supabase.com) → pilih project → **SQL Editor**
2. Copy-paste isi setiap file berikut satu per satu, lalu klik **Run**:

```
supabase/migrations/20260619000000_create_mvp_schema.sql
supabase/migrations/20260620000000_listening_groups.sql
supabase/migrations/20260621000000_practice.sql
supabase/migrations/20260622000000_ai_analyses.sql
supabase/migrations/20260623000000_hide_leaderboard.sql
supabase/migrations/20260624000000_notifications.sql
supabase/migrations/20260625000000_user_settings.sql
supabase/migrations/20260626000000_sessions.sql
```

Pastikan tidak ada error sebelum lanjut ke file berikutnya.

### Cara 2: Supabase CLI

```bash
npm install -g supabase

supabase login

# Link ke project (Project ID ada di: Project Settings → General)
supabase link --project-ref <project-id>

supabase db push
```

### Storage Buckets

Dibuat otomatis oleh migrasi. Verifikasi di Supabase → Storage:

| Bucket | Akses | Keterangan |
|---|---|---|
| `audio` | **Private** | File MP3 soal Listening |
| `avatars` | **Public** | Foto profil mahasiswa |

---

## Seed Data Awal

Seed script membuat **1 akun admin** + **9 soal contoh** (3 per seksi: Listening, Structure, Reading).

### Seed ke Development

```bash
npm run seed
# Membaca .env.local secara otomatis
```

### Seed ke Production

```bash
# Pastikan env production sudah di-export ke shell
export NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Opsional: override credential admin default
export SEED_ADMIN_EMAIL="admin@institusi.ac.id"
export SEED_ADMIN_PASSWORD="PasswordKuat123!"

npm run seed:prod
```

**Yang dibuat:**
- Akun admin langsung aktif, email sudah terverifikasi
- 3 soal Listening (tanpa audio — upload MP3 manual via Admin → Soal)
- 3 soal Structure
- 3 soal Reading dengan 1 passage contoh

> Seed **idempotent** — aman dijalankan berulang kali. Soal/user yang sudah ada dilewati.

---

## Struktur Folder

```
prepm/
├── app/                          # Next.js App Router
│   ├── (admin)/admin/            # Halaman admin (dashboard, questions, passages, sessions, users)
│   ├── (student)/                # Halaman student (dashboard, simulation, practice, history, sessions, leaderboard, settings)
│   ├── (auth)/                   # Halaman auth (login, register, forgot/reset-password)
│   ├── simulation/               # Simulation flow — fullscreen, anti-cheat (di luar student layout)
│   └── api/                      # Route handlers (audio upload, AI analysis streaming, cron)
│
├── components/
│   ├── admin/                    # Komponen admin (questions/, passages/, sessions/, users/, dashboard/)
│   ├── student/                  # Komponen student (sessions/)
│   ├── auth/                     # Form login, register, dll.
│   ├── charts/                   # Chart komponen (Recharts)
│   ├── dashboard/                # PageHeader, StatCard
│   ├── history/                  # HistoryView, DateRangePicker
│   ├── layout/                   # Sidebar, Navbar, nav-config, nav-icons
│   ├── leaderboard/              # LeaderboardView, LeaderboardTable
│   ├── settings/                 # Settings cards (profil, password, tampilan, dll.)
│   ├── simulation/               # Simulation runner, timer, question display, result view
│   └── ui/                       # shadcn/ui komponen (auto-generated — jangan edit manual)
│
├── hooks/                        # Custom React hooks
│   ├── use-anti-cheat.ts         # Deteksi ESC / shortcut / keluar fullscreen
│   ├── use-simulation-section.ts # Timer countdown + auto-advance per seksi
│   └── use-listening-session.ts  # State machine audio per soal Listening
│
├── lib/
│   ├── supabase/                 # Supabase clients (server, client, middleware)
│   ├── validations/              # Zod schemas (question, session, practice, auth, question-import, dll.)
│   ├── ai.ts                     # Groq AI config + system prompt
│   ├── charts.ts                 # Transformasi data untuk chart
│   ├── dates.ts                  # Helper format tanggal bahasa Indonesia
│   ├── excel.ts                  # SheetJS helpers (export hasil, template import, parse)
│   ├── questions.ts              # Label soal + form helpers
│   ├── scoring.ts                # Tabel konversi raw -> converted score TOEFL ITP
│   ├── sessions.ts               # Helper status sesi + form helpers
│   ├── simulation.ts             # Konfigurasi seksi, timer, urutan
│   └── users.ts                  # getInitials, getAccountStatus
│
├── server/
│   ├── actions/                  # Server Actions ("use server")
│   │   ├── auth.ts               # Login, register, forgot/reset password
│   │   ├── questions.ts          # CRUD soal
│   │   ├── passages.ts           # CRUD passage
│   │   ├── sessions.ts           # CRUD sesi + join by code
│   │   ├── question-import.ts    # Bulk import soal dari Excel
│   │   ├── simulation.ts         # Start, finish section, anti-cheat violation
│   │   ├── practice.ts           # Start, submit practice
│   │   └── settings.ts           # Update profil, password, preferensi
│   ├── queries/                  # Query DB read-only
│   └── notifications.ts          # createNotification helper
│
├── scripts/
│   └── seed.ts                   # Seed data awal (admin + soal contoh)
│
├── supabase/
│   └── migrations/               # File SQL migrasi (jalankan berurutan)
│
├── types/                        # TypeScript types (database.types.ts, question, session, user, dll.)
│
├── docs/
│   └── PRD_PTESOL.md             # Product Requirements Document
│
├── .env.local.example            # Template environment variables
├── components.json               # Konfigurasi shadcn/ui
├── next.config.ts
├── tsconfig.json
└── vercel.json                   # Vercel cron config
```

---

## Perintah yang Tersedia

```bash
npm run dev            # Development server di localhost:3000
npm run build          # Production build — cek error sebelum deploy
npm run start          # Jalankan production build lokal
npm run lint           # ESLint
npm run lint:fix       # ESLint + auto-fix
npm run format         # Prettier format semua file
npm run format:check   # Cek format (tanpa mengubah file — untuk CI)
npm run test           # Vitest unit tests (scoring, chart transforms)
npm run seed           # Seed dev database (pakai .env.local)
npm run seed:prod      # Seed production database (pakai env dari shell)
```

---

## Deploy ke Vercel

### Langkah 1 — Import Project

1. Buka [vercel.com](https://vercel.com) → **Add New Project**
2. Import repository dari GitHub
3. Framework: **Next.js** (auto-detect)
4. Root Directory: `.` (biarkan default)
5. Klik **Deploy** (akan gagal karena env vars belum diisi — itu normal)

### Langkah 2 — Tambah Environment Variables

Di Vercel Dashboard → Project → **Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL        → https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   → eyJ...
SUPABASE_SERVICE_ROLE_KEY       → eyJ...
GROQ_API_KEY                    → gsk_...
CRON_SECRET                     → (generate: openssl rand -hex 32)
RESEND_API_KEY                  → re_...          (opsional)
RESEND_FROM                     → PTESOL <no-reply@domain.com>  (opsional)
```

Atau via Vercel CLI:

```bash
npm install -g vercel
vercel login
vercel link

vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add GROQ_API_KEY production
vercel env add CRON_SECRET production
```

### Langkah 3 — Redeploy

Setelah env vars ditambahkan, trigger redeploy:

```bash
vercel --prod
# atau push ke main branch (jika auto-deploy aktif di Vercel)
```

### Langkah 4 — Aktifkan Vercel Analytics

1. Vercel Dashboard → Project → tab **Analytics**
2. Klik **Enable Analytics** dan **Enable Speed Insights**

Analytics sudah di-wire di `app/layout.tsx` — tidak perlu kode tambahan.

### Langkah 5 — Vercel Cron

`vercel.json` sudah mengonfigurasi cron job untuk daily inactive reminder (09:00 WIB):

```json
{ "crons": [{ "path": "/api/cron/inactive-reminder", "schedule": "0 9 * * *" }] }
```

Vercel otomatis mengirim `Authorization: Bearer <CRON_SECRET>` — pastikan `CRON_SECRET` sudah di-set.

---

## Supabase Production Setup

### Buat Project Production Terpisah

1. [app.supabase.com](https://app.supabase.com) → **New Project**
2. Isi nama project, database password (simpan!), region (Singapore untuk Asia Tenggara)
3. Tunggu project aktif (~2 menit)
4. Salin **Project URL** + **API Keys** dari: Project Settings → API

> Gunakan project Supabase **berbeda** untuk development dan production supaya data test tidak bercampur dengan data mahasiswa sungguhan.

### Konfigurasi Auth untuk Production

Di Supabase Dashboard → Authentication → **URL Configuration**:

- **Site URL:** `https://nama-project.vercel.app`
- **Redirect URLs:** tambahkan `https://nama-project.vercel.app/auth/confirm`

Di Authentication → **Email Templates**: pastikan link di template sudah menggunakan domain production, bukan `localhost`.

---

## Cara Buat Akun Admin

Akun admin **tidak bisa dibuat lewat form register publik** — register selalu menghasilkan role `student`. Gunakan salah satu cara berikut:

### Cara 1: Seed Script (untuk setup pertama kali)

```bash
export SEED_ADMIN_EMAIL="admin@institusi.ac.id"
export SEED_ADMIN_PASSWORD="PasswordKuat123!"
npm run seed:prod
```

### Cara 2: SQL di Supabase SQL Editor

Setelah user mendaftar via form biasa, jalankan di SQL Editor:

```sql
-- Ganti dengan UUID user yang ada di tabel auth.users
UPDATE public.users
SET role = 'admin'
WHERE id = '<user-uuid>';
```

### Cara 3: Supabase Table Editor

Supabase Dashboard → Table Editor → tabel `users` → edit kolom `role` → pilih `admin`.

---

## Maintenance Mode

Admin bisa mengaktifkan **Maintenance Mode** dari **`/admin/settings`** (Switch
+ pesan opsional). Saat aktif, semua pengunjung non-admin diarahkan ke
`/maintenance`, sementara admin tetap bisa mengakses `/admin/*` dan `/login`.

### Mematikan secara darurat (jalur cadangan)

Kalau halaman `/admin/settings` sendiri tidak bisa diakses (mis. salah konfigurasi
atau admin terkunci di luar), matikan maintenance mode langsung dari database:

1. Supabase Dashboard → **Table Editor** → tabel **`app_settings`**
2. Pada satu-satunya baris, ubah kolom **`maintenance_mode`** menjadi **`false`** → Save

Atau lewat **SQL Editor**:

```sql
UPDATE public.app_settings SET maintenance_mode = false;
```

> Perubahan berlaku dalam ~10 detik (middleware membaca setting dari cache
> singkat). Tunggu sebentar lalu refresh.

---

## Manual Test Checklist

Setelah setup production, verifikasi poin-poin berikut:

### Auth
- [ ] Register akun baru → terima email verifikasi → login berhasil
- [ ] Forgot password → terima email reset → password berubil
- [ ] Akun admin login → redirect ke `/admin/dashboard`

### Simulasi (Student)
- [ ] Mulai simulasi → fullscreen aktif
- [ ] Listening: audio autoplay per soal, timer 15 detik
- [ ] Structure: timer countdown, navigator soal
- [ ] Reading: passage 2-kolom, timer per seksi
- [ ] Selesai → skor 310–677 muncul di halaman hasil
- [ ] AI Analysis streaming muncul otomatis (butuh `GROQ_API_KEY`)

### Admin
- [ ] CRUD soal (listening/structure/reading), upload audio MP3
- [ ] Import soal dari Excel: unduh template → isi → upload → laporan baris berhasil/gagal
- [ ] Buat sesi → invite code auto-generated → tombol copy berfungsi
- [ ] Student join sesi via kode → muncul di daftar peserta admin
- [ ] Export hasil sesi → file `.xlsx` berisi nama, NIM, skor
- [ ] Nonaktifkan/aktifkan akun student
- [ ] `/admin/settings` → aktifkan Maintenance Mode (muncul AlertDialog konfirmasi)
- [ ] Saat maintenance ON: student diarahkan ke `/maintenance`, admin tetap bisa buka `/admin/*`
- [ ] Matikan Maintenance Mode → student bisa akses dashboard lagi (±10 detik)

### Student
- [ ] Join sesi via kode → tampil di halaman `/sessions`
- [ ] Latihan per seksi + lihat hasil dengan penjelasan jawaban
- [ ] Halaman Riwayat → filter simulasi/latihan/tanggal
- [ ] Leaderboard → nama tersembunyi jika hide_leaderboard aktif
- [ ] Settings → ganti nama, upload avatar, ganti tema (light/dark)

### Infrastruktur
- [ ] Vercel Analytics aktif (tampil di tab Analytics setelah ada traffic)
- [ ] Cron job tercatat di Vercel Logs setiap hari 09:00
