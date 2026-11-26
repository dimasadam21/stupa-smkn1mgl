/* ==========================================================================
   STUPA SMKN 1 Magelang - Portal Admin Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const SESSION_KEY = 'stupa_admin_session';
    const PWD_KEY = 'stupa_admin_pwd';
    const CUSTOM_KEY = 'stupa_custom_data';
    const SUB_KEY = 'stupa_submissions';

    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginForm = document.getElementById('adminLoginForm');
    const loginAlert = document.getElementById('loginAlert');
    const togglePwdBtn = document.getElementById('togglePwdBtn');
    const pwdInput = document.getElementById('adminPassword');

    function getPassword() {
        return localStorage.getItem(PWD_KEY) || 'stupa2026';
    }

    function getCustomData() {
        try {
            return JSON.parse(localStorage.getItem(CUSTOM_KEY) || 'null') || {};
        } catch {
            return {};
        }
    }

    function saveCustomData(obj) {
        localStorage.setItem(CUSTOM_KEY, JSON.stringify(obj));
    }

    function getSubmissions() {
        try {
            return JSON.parse(localStorage.getItem(SUB_KEY) || '[]');
        } catch {
            return [];
        }
    }

    function getMergedNews() {
        const base = window.STUPA_DATA?.news || {};
        const custom = getCustomData().news || {};
        return { ...base, ...custom };
    }

    togglePwdBtn?.addEventListener('click', function () {
        if (!pwdInput) return;
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        this.innerHTML = `<i class="fas ${isPwd ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });

    function showDashboard() {
        loginView?.classList.add('d-none');
        dashboardView?.classList.remove('d-none');
        logoutBtn?.classList.remove('d-none');
        renderDashboard();
    }

    function showLogin() {
        dashboardView?.classList.add('d-none');
        logoutBtn?.classList.add('d-none');
        loginView?.classList.remove('d-none');
    }

    if (sessionStorage.getItem(SESSION_KEY) === 'active') {
        showDashboard();
    }

    loginForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = document.getElementById('adminUsername')?.value.trim();
        const pass = pwdInput?.value || '';
        if (user === 'admin' && pass === getPassword()) {
            sessionStorage.setItem(SESSION_KEY, 'active');
            loginAlert?.classList.add('d-none');
            showDashboard();
        } else {
            if (loginAlert) {
                loginAlert.textContent = 'Username atau kata sandi tidak sesuai.';
                loginAlert.classList.remove('d-none');
            }
        }
    });

    logoutBtn?.addEventListener('click', function () {
        sessionStorage.removeItem(SESSION_KEY);
        showLogin();
    });

    function renderDashboard() {
        const newsObj = getMergedNews();
        const totalNews = Object.values(newsObj).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        const submissions = getSubmissions();
        const pubs = window.STUPA_DATA?.publications?.length || 0;
        const visits = Number(localStorage.getItem('stupa_total_visits') || '12840');

        document.getElementById('statNewsCount').textContent = String(totalNews);
        document.getElementById('statSubCount').textContent = String(submissions.length);
        document.getElementById('statPubCount').textContent = String(pubs);
        document.getElementById('statVisitCount').textContent = visits.toLocaleString('id-ID');

        renderSubmissions();
        renderNewsList();

        const rtInput = document.getElementById('runningTextInput');
        if (rtInput) {
            rtInput.value = getCustomData().runningText || 'Menapak Rimba dengan Nalar Ilmu, Menjaga Semesta dengan Keteguhan Hati — STUPA SMKN 1 Magelang: Tangguh di Puncak, Santun di Bumi, Unggul dalam Karya Teknik Berkelanjutan!';
        }
    }

    function renderSubmissions() {
        const tbody = document.getElementById('submissionsTableBody');
        if (!tbody) return;
        const list = getSubmissions();
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Belum ada permohonan layanan yang dikirim dari halaman utama.</td></tr>`;
            return;
        }
        tbody.innerHTML = list.map((item, idx) => {
            const details = Object.entries(item.fields || {})
                .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
                .join('');
            return `
                <tr>
                    <td class="small text-muted">${item.createdAt || '-'}</td>
                    <td><span class="badge rounded-pill" style="background:#005950;">${item.service}</span></td>
                    <td class="fw-semibold">${item.applicant}</td>
                    <td class="small">${details}</td>
                    <td>
                        <select class="form-select form-select-sm js-sub-status" data-idx="${idx}" style="min-width:120px;">
                            ${['Menunggu', 'Diproses', 'Disetujui', 'Selesai'].map(st =>
                                `<option value="${st}" ${item.status === st ? 'selected' : ''}>${st}</option>`
                            ).join('')}
                        </select>
                    </td>
                    <td>
                        <button type="button" class="btn btn-outline-danger btn-sm js-del-sub" data-idx="${idx}" aria-label="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderNewsList() {
        const listEl = document.getElementById('adminNewsList');
        if (!listEl) return;
        const merged = getMergedNews();
        const items = [];
        Object.entries(merged).forEach(([cat, arr]) => {
            (arr || []).forEach((item, idx) => items.push({ cat, idx, ...item }));
        });

        listEl.innerHTML = items.map(it => `
            <div class="d-flex justify-content-between align-items-center gap-3 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-3 overflow-hidden">
                    <img src="${it.image}" alt="" class="rounded-2 flex-shrink-0" style="width:56px;height:42px;object-fit:cover;">
                    <div class="overflow-hidden">
                        <span class="badge text-bg-success text-uppercase" style="font-size:10px;">${it.cat}</span>
                        <div class="fw-semibold text-truncate" style="font-size:13px;color:#005950;">${it.title}</div>
                        <div class="text-muted" style="font-size:11px;">${it.date}</div>
                    </div>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm flex-shrink-0 js-del-news" data-cat="${it.cat}" data-idx="${it.idx}" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Add News Form
    document.getElementById('addNewsForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const cat = document.getElementById('newsCatInput').value;
        const title = document.getElementById('newsTitleInput').value.trim();
        const image = document.getElementById('newsImageInput').value;
        const excerpt = document.getElementById('newsExcerptInput').value.trim();
        const content = document.getElementById('newsContentInput').value.trim();
        if (!title) return;

        const custom = getCustomData();
        const merged = getMergedNews();
        const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

        const updatedCatList = [
            { title, date: today, image, excerpt, content },
            ...(merged[cat] || [])
        ];

        custom.news = { ...(custom.news || {}), [cat]: updatedCatList };
        saveCustomData(custom);
        this.reset();
        renderDashboard();
        alert('Konten berhasil disimpan dan langsung aktif di halaman beranda!');
    });

    // Delete News Item & Update Submission Status
    document.addEventListener('click', function (e) {
        const delNews = e.target.closest('.js-del-news');
        if (delNews) {
            const cat = delNews.dataset.cat;
            const idx = Number(delNews.dataset.idx);
            const custom = getCustomData();
            const merged = getMergedNews();
            const list = [...(merged[cat] || [])];
            list.splice(idx, 1);
            custom.news = { ...(custom.news || {}), [cat]: list };
            saveCustomData(custom);
            renderDashboard();
            return;
        }
        const delSub = e.target.closest('.js-del-sub');
        if (delSub) {
            const list = getSubmissions();
            list.splice(Number(delSub.dataset.idx), 1);
            localStorage.setItem(SUB_KEY, JSON.stringify(list));
            renderDashboard();
        }
    });

    document.addEventListener('change', function (e) {
        if (e.target && e.target.classList.contains('js-sub-status')) {
            const list = getSubmissions();
            const idx = Number(e.target.dataset.idx);
            if (list[idx]) {
                list[idx].status = e.target.value;
                localStorage.setItem(SUB_KEY, JSON.stringify(list));
            }
        }
    });

    // Export Submissions
    document.getElementById('exportSubmissionsBtn')?.addEventListener('click', function () {
        const blob = new Blob([JSON.stringify(getSubmissions(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'permohonan-layanan-stupa.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Running Text Form
    document.getElementById('runningTextForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const custom = getCustomData();
        custom.runningText = document.getElementById('runningTextInput').value.trim();
        saveCustomData(custom);
        alert('Running text berhasil diperbarui!');
    });

    // Change Password
    document.getElementById('changePwdForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = document.getElementById('newAdminPwd').value;
        if (val.length >= 6) {
            localStorage.setItem(PWD_KEY, val);
            this.reset();
            alert('Kata sandi admin berhasil diperbarui.');
        }
    });

    // Reset Default Data
    document.getElementById('resetDefaultBtn')?.addEventListener('click', function () {
        if (confirm('Kembalikan konten berita & teks berjalan ke pengaturan bawaan?')) {
            localStorage.removeItem(CUSTOM_KEY);
            renderDashboard();
        }
    });
});
