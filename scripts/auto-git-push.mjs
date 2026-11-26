import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_DIR = process.cwd();
const DEBOUNCE_MS = 3000;
let timeoutId = null;
let isSyncing = false;

function getTimestamp() {
  const now = new Date();
  return (
    now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-') + ' WIB'
  );
}

function runCommand(cmd) {
  try {
    return execSync(cmd, { cwd: PROJECT_DIR, stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function syncGit() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const status = runCommand('git status --porcelain');
    if (!status) {
      isSyncing = false;
      return;
    }

    console.log(`\n[${getTimestamp()}] Terdeteksi perubahan file:`);
    const lines = status.split('\n').map(l => l.trim()).filter(Boolean);
    const changedFiles = lines.slice(0, 5).join(', ');
    console.log(`  File: ${changedFiles}${lines.length > 5 ? ' ...dan lainnya' : ''}`);

    runCommand('git add -A');

    const commitMsg = `auto: update ${getTimestamp()} [${changedFiles.slice(0, 50)}]`;
    const commitResult = runCommand(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    if (commitResult !== null) {
      console.log(`  [OK] Commit berhasil: "${commitMsg}"`);
    }

    const remotes = runCommand('git remote');
    if (remotes && remotes.includes('origin')) {
      const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD') || 'main';
      console.log(`  [PUSH] Mengunggah ke origin/${currentBranch}...`);
      try {
        execSync(`git push -u origin ${currentBranch}`, {
          cwd: PROJECT_DIR,
          stdio: 'pipe',
          encoding: 'utf8'
        });
        console.log(`  [SUKSES] Berhasil push ke GitHub origin/${currentBranch}! Vercel akan auto-deploy.`);
      } catch (pushErr) {
        console.error(`  [GAGAL] Push ke origin gagal (pastikan repo GitHub sudah dibuat):`, pushErr.message || pushErr);
      }
    } else {
      console.log('  [INFO] Remote origin belum diset. Jalankan hubungkan_github_dan_vercel.bat terlebih dahulu.');
    }
  } catch (err) {
    console.error('  [ERROR] Terjadi kesalahan saat auto sync:', err.message);
  } finally {
    isSyncing = false;
  }
}

function scheduleSync(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (
    normalized.includes('.git') ||
    normalized.includes('node_modules') ||
    normalized.endsWith('.log') ||
    normalized.endsWith('.tmp')
  ) {
    return;
  }

  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(syncGit, DEBOUNCE_MS);
}

console.log('========================================================');
console.log('    STUPA SMKN 1 MAGELANG - AUTO GIT PUSH DAEMON');
console.log('========================================================');
console.log(`Direktori : ${PROJECT_DIR}`);
console.log(`Debounce  : ${DEBOUNCE_MS / 1000} detik`);
console.log('Status    : AKTIF memantau perubahan file...\n');

const watchTargets = ['index.html', 'assets', 'vercel.json', 'README.md'];

watchTargets.forEach(item => {
  const targetPath = path.join(PROJECT_DIR, item);
  if (!fs.existsSync(targetPath)) return;

  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    fs.watch(targetPath, { recursive: true }, (_eventType, filename) => {
      if (filename) scheduleSync(path.join(item, filename));
    });
  } else {
    fs.watch(targetPath, () => scheduleSync(item));
  }
});

syncGit();
