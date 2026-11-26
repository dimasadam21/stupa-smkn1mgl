# Panduan Deploy & Sinkron Otomatis STUPA SMKN 1 Magelang (GitHub + Vercel)

Seluruh kode web **STUPA (Siswa Siswi Teknik Satu Pecinta Alam) SMKN 1 Magelang**, konfigurasi `vercel.json`, serta skrip otomatisasi Git sudah disiapkan seperti proyek **Si Voska**.

---

## Langkah 1: Buat Repositori Kosong di GitHub (Sekali Saja)
1. Buka [https://github.com/new](https://github.com/new) (login dengan akun **`dimasadam21`**).
2. Isi **Repository name**: `stupa-smkn1mgl`
3. Pilih **Public** (atau **Private**).
4. **Penting:** Biarkan kosong — *jangan* centang *"Add a README file"*.
5. Klik **Create repository**.

---

## Langkah 2: Push Otomatis ke GitHub
1. Buka folder `d:\Adam\Anti Gravity\STUPA\`.
2. Klik ganda (double-click) **`hubungkan_github_dan_vercel.bat`**, lalu tekan **Enter** untuk memakai remote default:
   `https://github.com/dimasadam21/stupa-smkn1mgl.git`
3. Karena kredensial Git HTTPS Anda sudah tersimpan di Windows (sama seperti Si Voska), seluruh berkas akan langsung ter-upload ke GitHub.

---

## Langkah 3: Hubungkan & Deploy di Vercel (1 Menit)
1. Buka [https://vercel.com/new](https://vercel.com/new) dan login dengan akun GitHub **`dimasadam21`**.
2. Cari repositori **`stupa-smkn1mgl`** lalu klik **Import**.
3. Biarkan pengaturan default (Framework Preset: **Other**, Root Directory: `./`), lalu klik **Deploy**.
4. Dalam ~20 detik, web resmi STUPA akan online 24 jam di tautan permanen seperti:
   `https://stupa-smkn1mgl.vercel.app`

---

## Sinkronisasi Otomatis Saat Edit File (`auto-git-push.bat`)
Kapan pun Anda mengubah konten/foto web:
- Klik ganda **`auto-git-push.bat`** untuk menyalakan pemantau otomatis (*watcher*).
- Setiap kali file disimpan, skrip akan otomatis melakukan `git commit` dan `git push origin main`, dan **Vercel akan otomatis memperbarui tampilan web live** dalam beberapa detik.
