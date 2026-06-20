# Email Templates — PTESOL

Template email ber-brand untuk menggantikan tampilan default Supabase yang polos.

## Cara pakai

1. Buka **Supabase Dashboard → Authentication → Email Templates**
2. Pilih template yang ingin diganti (lihat tabel di bawah)
3. Buka tab **Source** / **`<>`** (HTML), hapus isi default, lalu paste isi file yang sesuai
4. Set **Subject** seperti saran di bawah
5. Klik **Save**

## Pemetaan file

| File | Supabase template | Subject yang disarankan |
|---|---|---|
| `confirm-signup.html` | **Confirm signup** | `Konfirmasi akun PTESOL Anda` |
| `reset-password.html` | **Reset Password** | `Atur ulang kata sandi PTESOL Anda` |

## Catatan

- Warna tombol (`#4b56d2`) disesuaikan dengan token `--primary` (indigo) pada tema app.
  Kalau nanti tema diganti via tweakcn, ganti juga nilai hex di sini agar konsisten —
  email client tidak mendukung CSS variable, jadi warna memang harus hardcode.
- Variabel `{{ .ConfirmationURL }}` diisi otomatis oleh Supabase (sudah termasuk token + redirect).
- Pastikan **Site URL** & **Redirect URLs** sudah benar di Authentication → URL Configuration,
  supaya tautan mengarah ke domain production, bukan `localhost`.
- Preview cepat: buka file `.html` langsung di browser (variabel `{{ .ConfirmationURL }}`
  akan tampil sebagai teks mentah — itu normal, nanti diganti Supabase saat mengirim).
