@echo off
chcp 65001 >nul
echo ==============================================================================
echo    PENGHUBUNG GITHUB DAN VERCEL - STUPA (SMKN 1 MAGELANG)
echo ==============================================================================
echo.
set "DEFAULT_REPO=https://github.com/dimasadam21/stupa-smkn1mgl.git"
echo Default repositori: %DEFAULT_REPO%
set /p "CUSTOM_REPO=Tekan ENTER untuk pakai default, atau tempel URL repo GitHub lain: "

if not "%CUSTOM_REPO%"=="" (
    git remote set-url origin "%CUSTOM_REPO%" 2>nul || git remote add origin "%CUSTOM_REPO%"
    set "TARGET_REPO=%CUSTOM_REPO%"
) else (
    git remote set-url origin "%DEFAULT_REPO%" 2>nul || git remote add origin "%DEFAULT_REPO%"
    set "TARGET_REPO=%DEFAULT_REPO%"
)

echo.
echo Terhubung ke: %TARGET_REPO%
echo.
echo [1/3] Menyiapkan seluruh berkas terbaru...
git add -A

echo.
echo [2/3] Melakukan commit ke Git...
git diff --cached --quiet
if %ERRORLEVEL% NEQ 0 (
    git commit -m "Update otomatis Web STUPA SMKN 1 Magelang untuk Vercel"
) else (
    echo Tidak ada perubahan baru untuk di-commit.
)

echo.
echo [3/3] Mengunggah (Push) ke GitHub (main)...
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==============================================================================
    echo [SUKSES!] Seluruh kode STUPA SMKN 1 Magelang berhasil diunggah ke GitHub!
    echo.
    echo Langkah Vercel:
    echo   - Jika sudah terhubung ke Vercel, web otomatis diperbarui dalam beberapa detik.
    echo   - Jika baru pertama kali, buka https://vercel.com/new lalu Import repo ini.
    echo ==============================================================================
) else (
    echo.
    echo [PERHATIAN] Gagal push ke GitHub. Pastikan:
    echo   1. Repositori kosong sudah dibuat di https://github.com/new
    echo      (contoh nama: stupa-smkn1mgl, tanpa centang Add README).
    echo   2. URL remote sesuai dengan akun GitHub Anda.
)

echo.
pause
