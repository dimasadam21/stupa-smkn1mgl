/* ==========================================================================
   STUPA SMKN 1 Magelang - Portal Admin & Super Admin Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const SESSION_KEY = 'stupa_admin_session_obj';
    const ACCOUNTS_KEY = 'stupa_admin_accounts';
    const CUSTOM_KEY = 'stupa_custom_data';
    const SUB_KEY = 'stupa_submissions';
    const LOGS_KEY = 'stupa_audit_logs';

    const DEFAULT_ACCOUNTS = [
        { username: 'superadmin', password: 'stupasuper2026', role: 'superadmin', displayName: 'Pembina / Super Admin STUPA', active: true },
        { username: 'admin', password: 'stupa2026', role: 'admin', displayName: 'Pengurus Harian STUPA', active: true }
    ];

    const SECTIONS_META = [
        { id: 'layanan-stupa', label: 'Layanan & Kanal Digital STUPA' },
        { id: 'video-showcase', label: 'Video Showcase & Dokumenter' },
        { id: 'berita-informasi', label: 'Berita & Informasi' },
        { id: 'publikasi-stupa', label: 'Publikasi & Modul Ekspedisi' },
        { id: 'prosedur-stupa', label: 'Prosedur Kegiatan & Layanan' },
        { id: 'mitra-stupa', label: 'Mitra & Jejaring Konservasi' }
    ];

    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    const logoutBtn = document.getElementById('logoutBtn');
    const activeRoleBadge = document.getElementById('activeRoleBadge');
    const loginForm = document.getElementById('adminLoginForm');
    const loginAlert = document.getElementById('loginAlert');
    const togglePwdBtn = document.getElementById('togglePwdBtn');
    const pwdInput = document.getElementById('adminPassword');

    function getAccounts() {
        try {
            const raw = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || 'null');
            if (Array.isArray(raw) && raw.length > 0) return raw;
        } catch {
            // fallback
        }
        return DEFAULT_ACCOUNTS.map(a => ({ ...a }));
    }

    function saveAccounts(list) {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
    }

    function getSession() {
        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
        } catch {
            return null;
        }
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

    function getAuditLogs() {
        try {
            return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
        } catch {
            return [];
        }
    }

    function addAuditLog(action) {
        const sess = getSession();
        const logs = getAuditLogs();
        logs.unshift({
            time: new Date().toLocaleString('id-ID'),
            actor: sess ? `${sess.username} (${sess.role.toUpperCase()})` : 'SISTEM',
            action
        });
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 120)));
    }

    function getMergedNews() {
        const base = window.STUPA_DATA?.news || {};
        const custom = getCustomData().news || {};
        return { ...base, ...custom };
    }

    function getMergedHero() {
        const custom = getCustomData().heroSlides;
        return Array.isArray(custom) ? custom : [...(window.STUPA_DATA?.heroSlides || [])];
    }

    function getMergedPubs() {
        const custom = getCustomData().publications;
        return Array.isArray(custom) ? custom : [...(window.STUPA_DATA?.publications || [])];
    }

    // Quick fill buttons on login card
    document.querySelectorAll('.js-fill-login').forEach(btn => {
        btn.addEventListener('click', function () {
            document.getElementById('adminUsername').value = this.dataset.u;
            pwdInput.value = this.dataset.p;
        });
    });

    togglePwdBtn?.addEventListener('click', function () {
        if (!pwdInput) return;
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        this.innerHTML = `<i class="fas ${isPwd ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });

    function applyRoleUI(session) {
        const isSuper = session.role === 'superadmin';
        document.querySelectorAll('.super-only').forEach(el => {
            el.classList.toggle('d-none', !isSuper);
        });
        const nonSuperNotice = document.getElementById('nonSuperNotice');
        if (nonSuperNotice) nonSuperNotice.classList.toggle('d-none', isSuper);

        if (activeRoleBadge) {
            activeRoleBadge.className = `role-pill ${isSuper ? 'superadmin' : 'admin'}`;
            activeRoleBadge.innerHTML = `<i class="fas ${isSuper ? 'fa-crown' : 'fa-user-shield'}"></i> ${isSuper ? 'SUPER ADMIN' : 'ADMIN'} • ${session.username}`;
        }
    }

    function showDashboard() {
        const session = getSession();
        if (!session) return;
        loginView?.classList.add('d-none');
        dashboardView?.classList.remove('d-none');
        logoutBtn?.classList.remove('d-none');
        applyRoleUI(session);
        renderDashboard();
    }

    function showLogin() {
        dashboardView?.classList.add('d-none');
        logoutBtn?.classList.add('d-none');
        activeRoleBadge?.classList.add('d-none');
        loginView?.classList.remove('d-none');
    }

    if (getSession()) {
        showDashboard();
    }

    loginForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = document.getElementById('adminUsername')?.value.trim();
        const pass = pwdInput?.value || '';
        const accounts = getAccounts();
        const found = accounts.find(a => a.username === user && a.password === pass);

        if (!found) {
            if (loginAlert) {
                loginAlert.textContent = 'Username atau kata sandi tidak sesuai.';
                loginAlert.classList.remove('d-none');
            }
            return;
        }
        if (found.active === false) {
            if (loginAlert) {
                loginAlert.textContent = 'Akun ini sedang dinonaktifkan oleh Super Admin.';
                loginAlert.classList.remove('d-none');
            }
            return;
        }

        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            username: found.username,
            role: found.role,
            displayName: found.displayName
        }));
        loginAlert?.classList.add('d-none');
        addAuditLog(`Login berhasil ke Portal (${found.role})`);
        showDashboard();
    });

    logoutBtn?.addEventListener('click', function () {
        addAuditLog('Logout dari Portal');
        sessionStorage.removeItem(SESSION_KEY);
        showLogin();
    });

    function renderDashboard() {
        const newsObj = getMergedNews();
        const totalNews = Object.values(newsObj).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        const submissions = getSubmissions();
        const pubs = getMergedPubs();
        const visits = Number(localStorage.getItem('stupa_total_visits') || '12840');

        document.getElementById('statNewsCount').textContent = String(totalNews);
        document.getElementById('statSubCount').textContent = String(submissions.length);
        document.getElementById('statPubCount').textContent = String(pubs.length);
        document.getElementById('statVisitCount').textContent = visits.toLocaleString('id-ID');

        renderSubmissions();
        renderNewsList();

        const rtInput = document.getElementById('runningTextInput');
        if (rtInput) {
            rtInput.value = getCustomData().runningText || 'Menapak Rimba dengan Nalar Ilmu, Menjaga Semesta dengan Keteguhan Hati — STUPA SMKN 1 Magelang: Tangguh di Puncak, Santun di Bumi, Unggul dalam Karya Teknik Berkelanjutan!';
        }

        if (getSession()?.role === 'superadmin') {
            renderSuperHeroList();
            renderSuperPubList();
            renderSuperUsersTable();
            renderSectionToggles();
            renderAuditLogs();
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

    // SUPER ADMIN RENDERERS
    function renderSuperHeroList() {
        const el = document.getElementById('superHeroList');
        if (!el) return;
        const slides = getMergedHero();
        el.innerHTML = slides.map((s, idx) => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <img src="${s.image}" alt="" class="rounded-2 flex-shrink-0" style="width:52px;height:36px;object-fit:cover;">
                    <div class="overflow-hidden">
                        <span class="badge text-bg-warning" style="font-size:10px;">${s.tag}</span>
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${s.title}</div>
                    </div>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm js-del-hero" data-idx="${idx}" ${slides.length <= 1 ? 'disabled title="Minimal 1 slide"' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    function renderSuperPubList() {
        const el = document.getElementById('superPubList');
        if (!el) return;
        const pubs = getMergedPubs();
        el.innerHTML = pubs.map((p, idx) => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="overflow-hidden">
                    <span class="badge text-bg-secondary" style="font-size:10px;">${p.badge}</span>
                    <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${p.title}</div>
                    <div class="text-muted" style="font-size:11px;">${p.year} • ${p.pages}</div>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm flex-shrink-0 js-del-pub" data-idx="${idx}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    function renderSuperUsersTable() {
        const tbody = document.getElementById('superUsersTableBody');
        if (!tbody) return;
        const accounts = getAccounts();
        const current = getSession();
        tbody.innerHTML = accounts.map((acc, idx) => {
            const isSelf = current && acc.username === current.username;
            return `
                <tr>
                    <td class="fw-semibold"><code>${acc.username}</code></td>
                    <td class="small">${acc.displayName}</td>
                    <td><span class="badge rounded-pill ${acc.role === 'superadmin' ? 'text-bg-warning' : 'text-bg-success'}">${acc.role}</span></td>
                    <td>
                        <span class="badge ${acc.active !== false ? 'text-bg-light text-success border' : 'text-bg-secondary'}">
                            ${acc.active !== false ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </td>
                    <td class="text-nowrap">
                        <button type="button" class="btn btn-outline-primary btn-sm js-toggle-user" data-idx="${idx}" ${isSelf ? 'disabled' : ''} title="Aktif/Nonaktifkan">
                            <i class="fas fa-power-off"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm js-del-user" data-idx="${idx}" ${isSelf ? 'disabled' : ''} title="Hapus Akun">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderSectionToggles() {
        const wrap = document.getElementById('sectionVisibilityToggles');
        if (!wrap) return;
        const vis = getCustomData().sectionVisibility || {};
        wrap.innerHTML = SECTIONS_META.map(sec => {
            const checked = vis[sec.id] !== false;
            return `
                <label class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-white border" style="cursor:pointer;">
                    <span class="small fw-semibold" style="color:#005950;">${sec.label}</span>
                    <input type="checkbox" class="form-check-input js-sec-toggle" data-sec="${sec.id}" ${checked ? 'checked' : ''}>
                </label>
            `;
        }).join('');
    }

    function renderAuditLogs() {
        const el = document.getElementById('auditLogsList');
        if (!el) return;
        const logs = getAuditLogs();
        if (logs.length === 0) {
            el.innerHTML = `<div class="text-center text-muted small py-4">Belum ada catatan aktivitas.</div>`;
            return;
        }
        el.innerHTML = logs.map(l => `
            <div class="p-2 rounded-3 border bg-white small d-flex justify-content-between align-items-start gap-2">
                <div>
                    <span class="fw-semibold" style="color:#005950;">${l.actor}</span> — ${l.action}
                </div>
                <span class="text-muted text-nowrap" style="font-size:11px;">${l.time}</span>
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
        const updatedCatList = [{ title, date: today, image, excerpt, content }, ...(merged[cat] || [])];

        custom.news = { ...(custom.news || {}), [cat]: updatedCatList };
        saveCustomData(custom);
        addAuditLog(`Menambahkan ${cat}: "${title}"`);
        this.reset();
        renderDashboard();
        alert('Konten berhasil disimpan dan langsung aktif di halaman beranda!');
    });

    // Super Admin: Add Hero Slide
    document.getElementById('addHeroForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const tag = document.getElementById('heroTagInput').value.trim();
        const image = document.getElementById('heroImageInput').value;
        const title = document.getElementById('heroTitleInput').value.trim();
        const description = document.getElementById('heroDescInput').value.trim();

        const custom = getCustomData();
        const slides = getMergedHero();
        slides.unshift({
            id: 'hero-' + Date.now(),
            tag,
            title,
            description,
            image,
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
            author: 'Super Admin STUPA SMKN 1 Magelang',
            content: `<p class="lead fw-semibold text-teal">${description}</p><p>Dipublikasikan melalui kendali Super Admin STUPA SMKN 1 Magelang.</p>`
        });
        custom.heroSlides = slides;
        saveCustomData(custom);
        addAuditLog(`Menambahkan Hero Slide: "${title}"`);
        this.reset();
        renderDashboard();
    });

    // Super Admin: Add Publication
    document.getElementById('addPubForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const badge = document.getElementById('pubBadgeInput').value.trim();
        const year = document.getElementById('pubYearInput').value.trim();
        const pages = document.getElementById('pubPagesInput').value.trim();
        const title = document.getElementById('pubTitleInput').value.trim();
        const summary = document.getElementById('pubSummaryInput').value.trim();

        const custom = getCustomData();
        const pubs = getMergedPubs();
        pubs.unshift({
            id: 'pub-' + Date.now(),
            badge,
            title,
            year,
            pages,
            gradient: 'linear-gradient(145deg, #005950 0%, #00a896 100%)',
            summary
        });
        custom.publications = pubs;
        saveCustomData(custom);
        addAuditLog(`Menambahkan Publikasi: "${title}"`);
        this.reset();
        renderDashboard();
    });

    // Super Admin: Add Account
    document.getElementById('addUserForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const username = document.getElementById('newUserUsername').value.trim().toLowerCase();
        const password = document.getElementById('newUserPassword').value;
        const role = document.getElementById('newUserRole').value;
        const displayName = document.getElementById('newUserDisplay').value.trim();

        const accounts = getAccounts();
        if (accounts.some(a => a.username === username)) {
            alert('Username sudah terdaftar.');
            return;
        }
        accounts.push({ username, password, role, displayName, active: true });
        saveAccounts(accounts);
        addAuditLog(`Membuat akun ${role} baru: "${username}"`);
        this.reset();
        renderSuperUsersTable();
        renderAuditLogs();
    });

    // Delegated Click Actions
    document.addEventListener('click', function (e) {
        const delNews = e.target.closest('.js-del-news');
        if (delNews) {
            const cat = delNews.dataset.cat;
            const idx = Number(delNews.dataset.idx);
            const custom = getCustomData();
            const merged = getMergedNews();
            const list = [...(merged[cat] || [])];
            const removed = list.splice(idx, 1)[0];
            custom.news = { ...(custom.news || {}), [cat]: list };
            saveCustomData(custom);
            addAuditLog(`Menghapus ${cat}: "${removed?.title || idx}"`);
            renderDashboard();
            return;
        }
        const delSub = e.target.closest('.js-del-sub');
        if (delSub) {
            const list = getSubmissions();
            const removed = list.splice(Number(delSub.dataset.idx), 1)[0];
            localStorage.setItem(SUB_KEY, JSON.stringify(list));
            addAuditLog(`Menghapus permohonan dari "${removed?.applicant || '-'}"`);
            renderDashboard();
            return;
        }
        const delHero = e.target.closest('.js-del-hero');
        if (delHero && getSession()?.role === 'superadmin') {
            const slides = getMergedHero();
            if (slides.length <= 1) return;
            const removed = slides.splice(Number(delHero.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.heroSlides = slides;
            saveCustomData(custom);
            addAuditLog(`Menghapus Hero Slide: "${removed?.title || '-'}"`);
            renderDashboard();
            return;
        }
        const delPub = e.target.closest('.js-del-pub');
        if (delPub && getSession()?.role === 'superadmin') {
            const pubs = getMergedPubs();
            const removed = pubs.splice(Number(delPub.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.publications = pubs;
            saveCustomData(custom);
            addAuditLog(`Menghapus Publikasi: "${removed?.title || '-'}"`);
            renderDashboard();
            return;
        }
        const toggleUser = e.target.closest('.js-toggle-user');
        if (toggleUser && getSession()?.role === 'superadmin') {
            const accounts = getAccounts();
            const acc = accounts[Number(toggleUser.dataset.idx)];
            if (acc) {
                acc.active = acc.active === false;
                saveAccounts(accounts);
                addAuditLog(`${acc.active ? 'Mengaktifkan' : 'Menonaktifkan'} akun "${acc.username}"`);
                renderSuperUsersTable();
                renderAuditLogs();
            }
            return;
        }
        const delUser = e.target.closest('.js-del-user');
        if (delUser && getSession()?.role === 'superadmin') {
            const accounts = getAccounts();
            const removed = accounts.splice(Number(delUser.dataset.idx), 1)[0];
            saveAccounts(accounts);
            addAuditLog(`Menghapus akun "${removed?.username || '-'}"`);
            renderSuperUsersTable();
            renderAuditLogs();
        }
    });

    // Delegated Change Events
    document.addEventListener('change', function (e) {
        if (e.target && e.target.classList.contains('js-sub-status')) {
            const list = getSubmissions();
            const idx = Number(e.target.dataset.idx);
            if (list[idx]) {
                list[idx].status = e.target.value;
                localStorage.setItem(SUB_KEY, JSON.stringify(list));
                addAuditLog(`Mengubah status "${list[idx].applicant}" menjadi ${e.target.value}`);
                if (getSession()?.role === 'superadmin') renderAuditLogs();
            }
        }
        if (e.target && e.target.classList.contains('js-sec-toggle') && getSession()?.role === 'superadmin') {
            const secId = e.target.dataset.sec;
            const custom = getCustomData();
            custom.sectionVisibility = { ...(custom.sectionVisibility || {}), [secId]: e.target.checked };
            saveCustomData(custom);
            addAuditLog(`${e.target.checked ? 'Menampilkan' : 'Menyembunyikan'} seksi "${secId}"`);
            renderAuditLogs();
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
        addAuditLog('Memperbarui Running Text beranda');
        if (getSession()?.role === 'superadmin') renderAuditLogs();
        alert('Running text berhasil diperbarui!');
    });

    // Change Own Password
    document.getElementById('changePwdForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = document.getElementById('newAdminPwd').value;
        const sess = getSession();
        if (val.length >= 6 && sess) {
            const accounts = getAccounts();
            const target = accounts.find(a => a.username === sess.username);
            if (target) {
                target.password = val;
                saveAccounts(accounts);
                addAuditLog(`Memperbarui kata sandi akun "${sess.username}"`);
                this.reset();
                if (sess.role === 'superadmin') renderAuditLogs();
                alert('Kata sandi berhasil diperbarui.');
            }
        }
    });

    // Super Admin: Clear Logs
    document.getElementById('clearLogsBtn')?.addEventListener('click', function () {
        if (getSession()?.role !== 'superadmin') return;
        localStorage.removeItem(LOGS_KEY);
        renderAuditLogs();
    });

    // Super Admin: Full Backup & Restore
    document.getElementById('fullBackupBtn')?.addEventListener('click', function () {
        if (getSession()?.role !== 'superadmin') return;
        const backup = {
            exportedAt: new Date().toISOString(),
            customData: getCustomData(),
            submissions: getSubmissions(),
            accounts: getAccounts(),
            logs: getAuditLogs()
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stupa-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addAuditLog('Mengunduh backup penuh sistem');
        renderAuditLogs();
    });

    document.getElementById('restoreBackupInput')?.addEventListener('change', function (e) {
        if (getSession()?.role !== 'superadmin') return;
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function () {
            try {
                const parsed = JSON.parse(String(reader.result));
                if (parsed.customData) localStorage.setItem(CUSTOM_KEY, JSON.stringify(parsed.customData));
                if (Array.isArray(parsed.submissions)) localStorage.setItem(SUB_KEY, JSON.stringify(parsed.submissions));
                if (Array.isArray(parsed.accounts)) localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(parsed.accounts));
                addAuditLog(`Memulihkan data sistem dari file "${file.name}"`);
                renderDashboard();
                alert('Backup berhasil dipulihkan!');
            } catch {
                alert('Format file backup JSON tidak valid.');
            }
        };
        reader.readAsText(file);
    });

    // Super Admin: Reset Default Data
    document.getElementById('resetDefaultBtn')?.addEventListener('click', function () {
        if (getSession()?.role !== 'superadmin') return;
        if (confirm('Kembalikan konten hero, berita, publikasi & visibilitas seksi ke pengaturan bawaan?')) {
            localStorage.removeItem(CUSTOM_KEY);
            addAuditLog('Mereset seluruh konten web ke bawaan pabrik');
            renderDashboard();
        }
    });
});
