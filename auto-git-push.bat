@echo off
title STUPA SMKN 1 Magelang - Auto Git Commit and Push
echo ==============================================================
echo        STUPA - AUTO GIT COMMIT ^& PUSH OTOMATIS
echo ==============================================================
echo.
echo Memulai watcher otomatis...
echo Setiap kali Anda menyimpan file, perubahan akan otomatis
echo di-commit dan di-push ke remote repository GitHub (origin/main).
echo Vercel akan otomatis melakukan deploy ulang setiap kali ada push.
echo.
node scripts/auto-git-push.mjs
pause
