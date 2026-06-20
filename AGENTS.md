<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

Sebelum prompt pertama, masukkan blok ini ke file rules AI assistant kamu (.cursorrules,
CLAUDE.md, atau system prompt):
PROJECT RULES — PTESOL

1. UI Components: WAJIB pakai shadcn/ui untuk semua komponen UI (Button, Input,
   Dialog, Form, Table, Card, dll). Jangan bikin komponen custom kalau versi
   shadcn-nya sudah ada. Install via `npx shadcn@latest add <component>`.
2. TypeScript: DILARANG KERAS menggunakan tipe `any` dalam kondisi apapun.

- Gunakan `unknown` + type guard kalau tipe belum pasti.
- Gunakan generic (`<T>`) untuk fungsi reusable.
- Gunakan interface/type yang eksplisit untuk semua props, return value,
  dan response API.
- tsconfig.json HARUS `"strict": true` dan `"noImplicitAny": true`.

3. Validasi: Gunakan Zod untuk semua validasi input form & request body API,
   dan turunkan TypeScript type dari schema Zod (`z.infer<typeof schema>`)
   supaya tidak ada duplikasi tipe.
4. Struktur kode: Next.js App Router. Server Component by default, tambahkan
   `"use client"` HANYA kalau butuh interaktivitas/hooks. Taruh logic
   database & Supabase query di `lib/` atau `server/`, bukan langsung di
   komponen.
5. Database: Semua akses tabel WAJIB lewat Supabase client yang sudah
   di-generate types-nya (`supabase gen types typescript`). Jangan pernah
   expose `service_role key` di client-side. RLS (Row Level Security) wajib
   aktif di semua tabel sebelum fitur dianggap selesai.
6. Error & Loading State: Setiap halaman/fitur yang fetch data harus punya
   `loading.tsx`/skeleton (pakai shadcn `Skeleton`) dan error handling
   (try/catch + pesan error yang jelas ke user, jangan biarkan crash putih).
7. Penamaan: PascalCase untuk komponen & types/interfaces, camelCase untuk
   variabel/fungsi, kebab-case untuk nama file & folder.
8. Environment Variables: Semua secret (Supabase keys, Groq API key, Resend
   key) HARUS lewat `.env.local`, jangan pernah hardcode di kode.
9. Commit: Gunakan Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`)
   setiap selesai satu prompt/fitur.
10. Setiap fitur selesai dikerjakan, tulis singkat checklist manual test
    (apa yang sudah dicoba & berhasil) sebelum lanjut ke prompt berikutnya.
11. Aksesibilitas dasar: semua interactive element punya label/aria yang jelas,
    kontras warna ikut shadcn default theme (sudah WCAG AA-friendly).
12. Struktur Komponen Frontend: DILARANG menumpuk semua logic & JSX di satu
    file page.tsx supaya maintainability tetap terjaga.

- page.tsx HANYA berisi: fetch data awal (kalau Server Component) dan
  compose komponen-komponen kecil. Jangan taruh form besar, tabel
  2
  kompleks, atau logic state di sini.
- Pecah UI per fitur ke folder components/ dengan struktur per domain,
  misal: components/questions/question-table.tsx,
  components/questions/question-form-dialog.tsx,
  components/simulation/timer-badge.tsx,
  components/simulation/question-navigator.tsx.
- Komponen besar (>150 baris) WAJIB dipecah lagi jadi sub-komponen yang
  lebih kecil dan fokus satu tanggung jawab (single responsibility).
- Custom hooks (misal useAntiCheat, useTestTimer, useAutoSave) ditaruh
  di folder hooks/, jangan inline di dalam komponen.
- Tipe/interface props per komponen didefinisikan di file yang sama
  atau di types/ kalau dipakai lintas komponen — tetap tanpa `any`.
- Kalau satu halaman butuh banyak state yang saling terkait, pertimbangkan
  custom hook atau context khusus halaman itu, jangan biarkan page.tsx
  jadi tempat penampungan semua useState.

13. Warna & Theming: DILARANG menggunakan gradasi warna (bg-gradient-\*) dan
    DILARANG hardcode kelas warna Tailwind langsung (misal bg-blue-500,
    text-red-600, bg-white, text-black, dll) di komponen manapun.

- Warna theming dikontrol lewat tweakcn (https://tweakcn.com), jadi
  SELALU pakai CSS variable/semantic token bawaan shadcn:
  bg-background, bg-card, bg-primary, bg-secondary, bg-muted,
  bg-destructive, text-foreground, text-primary, text-muted-foreground,
  border-border, dll — bukan warna statis.
- Kalau butuh varian warna baru di luar token default shadcn, tambahkan
  dulu sebagai CSS variable baru di globals.css / theme config, jangan
  pakai literal Tailwind color class langsung di JSX.
- Tujuannya: begitu saya ganti tema lewat tweakcn, seluruh UI ikut
  berubah otomatis tanpa perlu edit komponen satu-satu.
- Exception yang boleh: warna semantik status non-tema seperti
success/warning (misal indikator benar/salah di practice mode) —
tetap definisikan sebagai CSS variable (--success, --warning), jangan
literal class warna.
Konfirmasi rules ini sudah kamu pahami sebelum mengerjakan prompt apapun.
<!-- END:nextjs-agent-rules -->
