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

    const getAccounts = () => {
        try {
            const raw = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || 'null');
            if (Array.isArray(raw) && raw.length > 0) return raw;
        } catch { /* fallback */ }
        return DEFAULT_ACCOUNTS.map(a => ({ ...a }));
    };
    const saveAccounts = list => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
    const getSession = () => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
    const getCustomData = () => { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || 'null') || {}; } catch { return {}; } };
    const saveCustomData = obj => localStorage.setItem(CUSTOM_KEY, JSON.stringify(obj));
    const getSubmissions = () => { try { return JSON.parse(localStorage.getItem(SUB_KEY) || '[]'); } catch { return []; } };
    const getAuditLogs = () => { try { return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]'); } catch { return []; } };

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

    const getMergedNews = () => ({ ...(window.STUPA_DATA?.news || {}), ...(getCustomData().news || {}) });
    const getMergedHero = () => {
        const c = getCustomData().heroSlides;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.heroSlides || [])];
    };
    const getMergedPubs = () => {
        const c = getCustomData().publications;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.publications || [])];
    };
    const getMergedServices = () => {
        const c = getCustomData().services;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.services || [])];
    };
    const getMergedVideos = () => {
        const c = getCustomData().videos;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.videos || [])];
    };
    const getMergedPartners = () => {
        const c = getCustomData().partners;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.partners || [])];
    };
    const getMergedProcedures = () => {
        const c = getCustomData().procedures;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.procedures || [])];
    };
    const getMergedSiteMeta = () => ({ ...(window.STUPA_DATA?.siteMeta || {}), ...(getCustomData().siteMeta || {}) });

    // Login Helpers
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
        document.querySelectorAll('.super-only').forEach(el => el.classList.toggle('d-none', !isSuper));
        document.getElementById('nonSuperNotice')?.classList.toggle('d-none', isSuper);
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

    if (getSession()) showDashboard();

    loginForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = document.getElementById('adminUsername')?.value.trim();
        const pass = pwdInput?.value || '';
        const found = getAccounts().find(a => a.username === user && a.password === pass);

        if (!found) {
            loginAlert.textContent = 'Username atau kata sandi tidak sesuai.';
            loginAlert.classList.remove('d-none');
            return;
        }
        if (found.active === false) {
            loginAlert.textContent = 'Akun ini sedang dinonaktifkan oleh Super Admin.';
            loginAlert.classList.remove('d-none');
            return;
        }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            username: found.username,
            role: found.role,
            displayName: found.displayName
        }));
        loginAlert?.classList.add('d-none');
        addAuditLog(`Login berhasil (${found.role})`);
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
        const servicesAndPubs = getMergedServices().length + getMergedPubs().length;
        const visits = Number(localStorage.getItem('stupa_total_visits') || '12840');

        document.getElementById('statNewsCount').textContent = String(totalNews);
        document.getElementById('statSubCount').textContent = String(submissions.length);
        document.getElementById('statPubCount').textContent = String(servicesAndPubs);
        document.getElementById('statVisitCount').textContent = visits.toLocaleString('id-ID');

        renderSubmissions();
        renderNewsList();

        const meta = getMergedSiteMeta();
        const rtInput = document.getElementById('runningTextInput');
        if (rtInput) rtInput.value = getCustomData().runningText || meta.runningText || '';

        if (getSession()?.role === 'superadmin') {
            renderSuperHeroList();
            renderSuperPubList();
            renderSuperServicesList();
            renderSuperVideosList();
            renderSuperPartnersList();
            renderSuperProceduresList();
            fillSiteMetaForm(meta);
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
            const details = Object.entries(item.fields || {}).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('');
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
                        <button type="button" class="btn btn-outline-danger btn-sm js-del-sub" data-idx="${idx}"><i class="fas fa-trash"></i></button>
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
        Object.entries(merged).forEach(([cat, arr]) => (arr || []).forEach((item, idx) => items.push({ cat, idx, ...item })));
        listEl.innerHTML = items.map(it => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <img src="${it.image}" alt="" class="rounded-2 flex-shrink-0" style="width:52px;height:38px;object-fit:cover;">
                    <div class="overflow-hidden">
                        <span class="badge text-bg-success text-uppercase" style="font-size:10px;">${it.cat}</span>
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${it.title}</div>
                        <div class="text-muted" style="font-size:11px;">${it.date}</div>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-shrink-0">
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-news" data-cat="${it.cat}" data-idx="${it.idx}" title="Edit"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-news" data-cat="${it.cat}" data-idx="${it.idx}" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    function renderSuperHeroList() {
        const el = document.getElementById('superHeroList');
        if (!el) return;
        const slides = getMergedHero();
        el.innerHTML = slides.map((s, idx) => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <img src="${s.image}" alt="" class="rounded-2 flex-shrink-0" style="width:50px;height:36px;object-fit:cover;">
                    <div class="overflow-hidden">
                        <span class="badge text-bg-warning" style="font-size:10px;">${s.tag}</span>
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${s.title}</div>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-shrink-0">
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-hero" data-idx="${idx}"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-hero" data-idx="${idx}" ${slides.length <= 1 ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                </div>
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
                <div class="d-flex gap-1 flex-shrink-0">
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-pub" data-idx="${idx}"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-pub" data-idx="${idx}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    function renderSuperServicesList() {
        const el = document.getElementById('superServicesList');
        if (!el) return;
        const list = getMergedServices();
        el.innerHTML = list.map((s, idx) => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <span class="badge text-bg-light border text-success"><i class="fas ${s.icon}"></i></span>
                    <div class="overflow-hidden">
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${s.title}</div>
                        <div class="text-muted text-truncate" style="font-size:11px;">${s.subtitle}</div>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-shrink-0">
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-srv" data-idx="${idx}"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-srv" data-idx="${idx}" ${list.length <= 1 ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    function renderSuperVideosList() {
        const el = document.getElementById('superVideosList');
        if (!el) return;
        const list = getMergedVideos();
        el.innerHTML = list.map((v, idx) => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <img src="${v.thumb}" alt="" class="rounded-2 flex-shrink-0" style="width:48px;height:34px;object-fit:cover;">
                    <div class="overflow-hidden">
                        ${idx === 0 ? '<span class="badge text-bg-warning" style="font-size:9px;">Utama</span>' : ''}
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${v.title}</div>
                        <div class="text-muted" style="font-size:11px;">${v.date}</div>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-shrink-0">
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-vid" data-idx="${idx}"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-vid" data-idx="${idx}" ${list.length <= 1 ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    function renderSuperPartnersList() {
        const el = document.getElementById('superPartnersList');
        if (!el) return;
        const list = getMergedPartners();
        el.innerHTML = list.map((p, idx) => `
            <span class="badge rounded-pill text-bg-light border px-3 py-2 d-inline-flex align-items-center gap-2" style="color:#005950;">
                <i class="fas ${p.icon}"></i> ${p.label}
                <button type="button" class="btn-close ms-1 js-del-partner" data-idx="${idx}" style="font-size:9px;" aria-label="Hapus"></button>
            </span>
        `).join('');
    }

    function renderSuperProceduresList() {
        const el = document.getElementById('superProceduresList');
        if (!el) return;
        const list = getMergedProcedures();
        el.innerHTML = list.map((pr, idx) => `
            <div class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-white border">
                <div>
                    <div class="fw-semibold small" style="color:#005950;">${pr.badge}</div>
                    <div class="text-muted" style="font-size:11px;">${(pr.steps || []).length} langkah alur</div>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm js-del-proc" data-idx="${idx}"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }

    function fillSiteMetaForm(meta) {
        const setV = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
        setV('metaMottoInput', meta.footerMotto);
        setV('metaSecInput', meta.secretariatName);
        setV('metaAddr1Input', meta.addressLine1);
        setV('metaAddr2Input', meta.addressLine2);
        setV('metaPhoneInput', meta.phone);
        setV('metaEmailInput', meta.email);
        setV('metaIgInput', meta.instagramUrl);
        setV('metaYtInput', meta.youtubeUrl);
        setV('metaTtInput', meta.tiktokUrl);
        setV('metaCopyInput', meta.copyright);
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
                    <td><span class="badge ${acc.active !== false ? 'text-bg-light text-success border' : 'text-bg-secondary'}">${acc.active !== false ? 'Aktif' : 'Nonaktif'}</span></td>
                    <td class="text-nowrap">
                        <button type="button" class="btn btn-outline-primary btn-sm js-toggle-user" data-idx="${idx}" ${isSelf ? 'disabled' : ''} title="Aktif/Nonaktifkan"><i class="fas fa-power-off"></i></button>
                        <button type="button" class="btn btn-outline-danger btn-sm js-del-user" data-idx="${idx}" ${isSelf ? 'disabled' : ''} title="Hapus Akun"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderSectionToggles() {
        const wrap = document.getElementById('sectionVisibilityToggles');
        if (!wrap) return;
        const vis = getCustomData().sectionVisibility || {};
        wrap.innerHTML = SECTIONS_META.map(sec => `
            <label class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-white border" style="cursor:pointer;">
                <span class="small fw-semibold" style="color:#005950;">${sec.label}</span>
                <input type="checkbox" class="form-check-input js-sec-toggle" data-sec="${sec.id}" ${vis[sec.id] !== false ? 'checked' : ''}>
            </label>
        `).join('');
    }

    function renderAuditLogs() {
        const el = document.getElementById('auditLogsList');
        if (!el) return;
        const logs = getAuditLogs();
        el.innerHTML = logs.length === 0
            ? `<div class="text-center text-muted small py-4">Belum ada catatan aktivitas.</div>`
            : logs.map(l => `
                <div class="p-2 rounded-3 border bg-white small d-flex justify-content-between align-items-start gap-2">
                    <div><span class="fw-semibold" style="color:#005950;">${l.actor}</span> — ${l.action}</div>
                    <span class="text-muted text-nowrap" style="font-size:11px;">${l.time}</span>
                </div>
            `).join('');
    }

    // Reset form helpers
    function resetNewsForm() {
        document.getElementById('addNewsForm')?.reset();
        document.getElementById('editNewsCat').value = '';
        document.getElementById('editNewsIdx').value = '';
        document.getElementById('newsFormHeading').innerHTML = '<i class="fas fa-plus-circle me-1"></i> Terbitkan Kabar Baru';
        document.getElementById('cancelNewsEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelNewsEditBtn')?.addEventListener('click', resetNewsForm);

    function resetHeroForm() {
        document.getElementById('addHeroForm')?.reset();
        document.getElementById('editHeroIdx').value = '';
        document.getElementById('heroFormHeading').innerHTML = '<i class="fas fa-images me-1"></i> Tambah Slide Hero';
        document.getElementById('cancelHeroEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelHeroEditBtn')?.addEventListener('click', resetHeroForm);

    function resetPubForm() {
        document.getElementById('addPubForm')?.reset();
        document.getElementById('editPubIdx').value = '';
        document.getElementById('pubFormHeading').innerHTML = '<i class="fas fa-book-medical me-1"></i> Tambah Publikasi &amp; Modul';
        document.getElementById('cancelPubEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelPubEditBtn')?.addEventListener('click', resetPubForm);

    function resetSrvForm() {
        document.getElementById('addServiceForm')?.reset();
        document.getElementById('editSrvIdx').value = '';
        document.getElementById('srvFormHeading').innerHTML = '<i class="fas fa-concierge-bell me-1"></i> Tambah / Edit Layanan STUPA';
        document.getElementById('cancelSrvEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelSrvEditBtn')?.addEventListener('click', resetSrvForm);

    function resetVidForm() {
        document.getElementById('addVideoForm')?.reset();
        document.getElementById('editVidIdx').value = '';
        document.getElementById('vidFormHeading').innerHTML = '<i class="fas fa-film me-1"></i> Tambah / Edit Video Dokumenter';
        document.getElementById('cancelVidEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelVidEditBtn')?.addEventListener('click', resetVidForm);

    // Form Submissions (Create + Update)
    document.getElementById('addNewsForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const cat = document.getElementById('newsCatInput').value;
        const title = document.getElementById('newsTitleInput').value.trim();
        const image = document.getElementById('newsImageInput').value;
        const excerpt = document.getElementById('newsExcerptInput').value.trim();
        const content = document.getElementById('newsContentInput').value.trim();
        const editCat = document.getElementById('editNewsCat').value;
        const editIdx = document.getElementById('editNewsIdx').value;

        const custom = getCustomData();
        const merged = getMergedNews();
        const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

        if (editIdx !== '' && editCat) {
            const oldArr = [...(merged[editCat] || [])];
            const existing = oldArr.splice(Number(editIdx), 1)[0] || {};
            merged[editCat] = oldArr;
            merged[cat] = [{ ...existing, title, image, excerpt, content }, ...(merged[cat] || [])];
            if (editCat === cat) {
                // Keep order if same category
                const reordered = [...oldArr];
                reordered.splice(Number(editIdx), 0, { ...existing, title, image, excerpt, content });
                merged[cat] = reordered;
            }
            addAuditLog(`Mengedit ${cat}: "${title}"`);
        } else {
            merged[cat] = [{ title, date: today, image, excerpt, content }, ...(merged[cat] || [])];
            addAuditLog(`Menambahkan ${cat}: "${title}"`);
        }
        custom.news = merged;
        saveCustomData(custom);
        resetNewsForm();
        renderDashboard();
    });

    document.getElementById('addHeroForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const tag = document.getElementById('heroTagInput').value.trim();
        const image = document.getElementById('heroImageInput').value;
        const title = document.getElementById('heroTitleInput').value.trim();
        const description = document.getElementById('heroDescInput').value.trim();
        const editIdx = document.getElementById('editHeroIdx').value;

        const custom = getCustomData();
        const slides = getMergedHero();
        const entry = {
            id: 'hero-' + Date.now(),
            tag, title, description, image,
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
            author: 'Super Admin STUPA SMKN 1 Magelang',
            content: `<p class="lead fw-semibold text-teal">${description}</p><p>Dipublikasikan melalui kendali Super Admin STUPA SMKN 1 Magelang.</p>`
        };
        if (editIdx !== '') {
            slides[Number(editIdx)] = { ...slides[Number(editIdx)], tag, title, description, image };
            addAuditLog(`Mengedit Hero Slide: "${title}"`);
        } else {
            slides.unshift(entry);
            addAuditLog(`Menambahkan Hero Slide: "${title}"`);
        }
        custom.heroSlides = slides;
        saveCustomData(custom);
        resetHeroForm();
        renderDashboard();
    });

    document.getElementById('addPubForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const badge = document.getElementById('pubBadgeInput').value.trim();
        const year = document.getElementById('pubYearInput').value.trim();
        const pages = document.getElementById('pubPagesInput').value.trim();
        const title = document.getElementById('pubTitleInput').value.trim();
        const summary = document.getElementById('pubSummaryInput').value.trim();
        const editIdx = document.getElementById('editPubIdx').value;

        const custom = getCustomData();
        const pubs = getMergedPubs();
        if (editIdx !== '') {
            pubs[Number(editIdx)] = { ...pubs[Number(editIdx)], badge, year, pages, title, summary };
            addAuditLog(`Mengedit Publikasi: "${title}"`);
        } else {
            pubs.unshift({
                id: 'pub-' + Date.now(),
                badge, title, year, pages,
                gradient: 'linear-gradient(145deg, #005950 0%, #00a896 100%)',
                summary
            });
            addAuditLog(`Menambahkan Publikasi: "${title}"`);
        }
        custom.publications = pubs;
        saveCustomData(custom);
        resetPubForm();
        renderDashboard();
    });

    document.getElementById('addServiceForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const title = document.getElementById('srvTitleInput').value.trim();
        const badge = document.getElementById('srvBadgeInput').value.trim();
        const subtitle = document.getElementById('srvSubtitleInput').value.trim();
        const icon = document.getElementById('srvIconInput').value;
        const description = document.getElementById('srvDescInput').value.trim();
        const editIdx = document.getElementById('editSrvIdx').value;

        const custom = getCustomData();
        const list = getMergedServices();
        if (editIdx !== '') {
            list[Number(editIdx)] = { ...list[Number(editIdx)], title, badge, subtitle, icon, description };
            addAuditLog(`Mengedit Layanan: "${title}"`);
        } else {
            list.push({
                id: 'srv-' + Date.now(),
                icon, title, subtitle, badge, description,
                actionType: 'info',
                infoList: [{ title: 'Informasi Layanan', meta: description }]
            });
            addAuditLog(`Menambahkan Layanan: "${title}"`);
        }
        custom.services = list;
        saveCustomData(custom);
        resetSrvForm();
        renderDashboard();
    });

    document.getElementById('addVideoForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const title = document.getElementById('vidTitleInput').value.trim();
        const date = document.getElementById('vidDateInput').value.trim();
        const thumb = document.getElementById('vidThumbInput').value;
        const summary = document.getElementById('vidSummaryInput').value.trim();
        const editIdx = document.getElementById('editVidIdx').value;

        const custom = getCustomData();
        const list = getMergedVideos();
        if (editIdx !== '') {
            list[Number(editIdx)] = { ...list[Number(editIdx)], title, date, thumb, summary };
            addAuditLog(`Mengedit Video: "${title}"`);
        } else {
            list.push({
                id: 'vid-' + Date.now(),
                title, date, thumb, summary,
                highlights: ['Dokumentasi STUPA SMKN 1 Magelang']
            });
            addAuditLog(`Menambahkan Video: "${title}"`);
        }
        custom.videos = list;
        saveCustomData(custom);
        resetVidForm();
        renderDashboard();
    });

    document.getElementById('addPartnerForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const label = document.getElementById('partnerLabelInput').value.trim();
        const icon = document.getElementById('partnerIconInput').value;
        const custom = getCustomData();
        const list = getMergedPartners();
        list.push({ label, icon, href: '#layanan-stupa' });
        custom.partners = list;
        saveCustomData(custom);
        addAuditLog(`Menambahkan Mitra: "${label}"`);
        this.reset();
        renderDashboard();
    });

    document.getElementById('addProcedureForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const badge = document.getElementById('procBadgeInput').value.trim();
        const lines = document.getElementById('procStepsInput').value.split('\n').map(l => l.trim()).filter(Boolean);
        const steps = lines.map((line, i) => {
            const [t, d] = line.split('|').map(x => x.trim());
            return { title: t || `Langkah ${i + 1}`, desc: d || t || '' };
        });
        const custom = getCustomData();
        const list = getMergedProcedures();
        list.push({ id: 'proc-' + Date.now(), badge, icon: 'fa-list-check', steps });
        custom.procedures = list;
        saveCustomData(custom);
        addAuditLog(`Menambahkan Prosedur: "${badge}"`);
        this.reset();
        renderDashboard();
    });

    document.getElementById('siteMetaForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (getSession()?.role !== 'superadmin') return;
        const custom = getCustomData();
        custom.siteMeta = {
            ...getMergedSiteMeta(),
            footerMotto: document.getElementById('metaMottoInput').value.trim(),
            secretariatName: document.getElementById('metaSecInput').value.trim(),
            addressLine1: document.getElementById('metaAddr1Input').value.trim(),
            addressLine2: document.getElementById('metaAddr2Input').value.trim(),
            phone: document.getElementById('metaPhoneInput').value.trim(),
            email: document.getElementById('metaEmailInput').value.trim(),
            instagramUrl: document.getElementById('metaIgInput').value.trim() || '#kontak-footer',
            youtubeUrl: document.getElementById('metaYtInput').value.trim() || '#kontak-footer',
            tiktokUrl: document.getElementById('metaTtInput').value.trim() || '#kontak-footer',
            copyright: document.getElementById('metaCopyInput').value.trim()
        };
        saveCustomData(custom);
        addAuditLog('Memperbarui Identitas, Kontak & Sosmed Web');
        renderAuditLogs();
        alert('Identitas & kontak web berhasil diperbarui!');
    });

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

    // Delegated Click Actions (Edit + Delete)
    document.addEventListener('click', function (e) {
        const editNews = e.target.closest('.js-edit-news');
        if (editNews) {
            const cat = editNews.dataset.cat;
            const idx = Number(editNews.dataset.idx);
            const item = getMergedNews()[cat]?.[idx];
            if (!item) return;
            document.getElementById('editNewsCat').value = cat;
            document.getElementById('editNewsIdx').value = String(idx);
            document.getElementById('newsCatInput').value = cat;
            document.getElementById('newsTitleInput').value = item.title;
            document.getElementById('newsImageInput').value = item.image;
            document.getElementById('newsExcerptInput').value = item.excerpt;
            document.getElementById('newsContentInput').value = item.content;
            document.getElementById('newsFormHeading').innerHTML = '<i class="fas fa-pen me-1"></i> Edit Konten Berita';
            document.getElementById('cancelNewsEditBtn')?.classList.remove('d-none');
            return;
        }
        const delNews = e.target.closest('.js-del-news');
        if (delNews) {
            const cat = delNews.dataset.cat;
            const idx = Number(delNews.dataset.idx);
            const custom = getCustomData();
            const merged = getMergedNews();
            const list = [...(merged[cat] || [])];
            const removed = list.splice(idx, 1)[0];
            custom.news = { ...merged, [cat]: list };
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
        if (getSession()?.role !== 'superadmin') return;

        const editHero = e.target.closest('.js-edit-hero');
        if (editHero) {
            const idx = Number(editHero.dataset.idx);
            const s = getMergedHero()[idx];
            if (!s) return;
            document.getElementById('editHeroIdx').value = String(idx);
            document.getElementById('heroTagInput').value = s.tag;
            document.getElementById('heroImageInput').value = s.image;
            document.getElementById('heroTitleInput').value = s.title;
            document.getElementById('heroDescInput').value = s.description;
            document.getElementById('heroFormHeading').innerHTML = '<i class="fas fa-pen me-1"></i> Edit Slide Hero';
            document.getElementById('cancelHeroEditBtn')?.classList.remove('d-none');
            return;
        }
        const delHero = e.target.closest('.js-del-hero');
        if (delHero) {
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
        const editPub = e.target.closest('.js-edit-pub');
        if (editPub) {
            const idx = Number(editPub.dataset.idx);
            const p = getMergedPubs()[idx];
            if (!p) return;
            document.getElementById('editPubIdx').value = String(idx);
            document.getElementById('pubBadgeInput').value = p.badge;
            document.getElementById('pubYearInput').value = p.year;
            document.getElementById('pubPagesInput').value = p.pages;
            document.getElementById('pubTitleInput').value = p.title;
            document.getElementById('pubSummaryInput').value = p.summary;
            document.getElementById('pubFormHeading').innerHTML = '<i class="fas fa-pen me-1"></i> Edit Publikasi';
            document.getElementById('cancelPubEditBtn')?.classList.remove('d-none');
            return;
        }
        const delPub = e.target.closest('.js-del-pub');
        if (delPub) {
            const pubs = getMergedPubs();
            const removed = pubs.splice(Number(delPub.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.publications = pubs;
            saveCustomData(custom);
            addAuditLog(`Menghapus Publikasi: "${removed?.title || '-'}"`);
            renderDashboard();
            return;
        }
        const editSrv = e.target.closest('.js-edit-srv');
        if (editSrv) {
            const idx = Number(editSrv.dataset.idx);
            const s = getMergedServices()[idx];
            if (!s) return;
            document.getElementById('editSrvIdx').value = String(idx);
            document.getElementById('srvTitleInput').value = s.title;
            document.getElementById('srvBadgeInput').value = s.badge;
            document.getElementById('srvSubtitleInput').value = s.subtitle;
            document.getElementById('srvIconInput').value = s.icon;
            document.getElementById('srvDescInput').value = s.description;
            document.getElementById('srvFormHeading').innerHTML = '<i class="fas fa-pen me-1"></i> Edit Layanan';
            document.getElementById('cancelSrvEditBtn')?.classList.remove('d-none');
            return;
        }
        const delSrv = e.target.closest('.js-del-srv');
        if (delSrv) {
            const list = getMergedServices();
            if (list.length <= 1) return;
            const removed = list.splice(Number(delSrv.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.services = list;
            saveCustomData(custom);
            addAuditLog(`Menghapus Layanan: "${removed?.title || '-'}"`);
            renderDashboard();
            return;
        }
        const editVid = e.target.closest('.js-edit-vid');
        if (editVid) {
            const idx = Number(editVid.dataset.idx);
            const v = getMergedVideos()[idx];
            if (!v) return;
            document.getElementById('editVidIdx').value = String(idx);
            document.getElementById('vidTitleInput').value = v.title;
            document.getElementById('vidDateInput').value = v.date;
            document.getElementById('vidThumbInput').value = v.thumb;
            document.getElementById('vidSummaryInput').value = v.summary;
            document.getElementById('vidFormHeading').innerHTML = '<i class="fas fa-pen me-1"></i> Edit Video';
            document.getElementById('cancelVidEditBtn')?.classList.remove('d-none');
            return;
        }
        const delVid = e.target.closest('.js-del-vid');
        if (delVid) {
            const list = getMergedVideos();
            if (list.length <= 1) return;
            const removed = list.splice(Number(delVid.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.videos = list;
            saveCustomData(custom);
            addAuditLog(`Menghapus Video: "${removed?.title || '-'}"`);
            renderDashboard();
            return;
        }
        const delPartner = e.target.closest('.js-del-partner');
        if (delPartner) {
            const list = getMergedPartners();
            const removed = list.splice(Number(delPartner.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.partners = list;
            saveCustomData(custom);
            addAuditLog(`Menghapus Mitra: "${removed?.label || '-'}"`);
            renderDashboard();
            return;
        }
        const delProc = e.target.closest('.js-del-proc');
        if (delProc) {
            const list = getMergedProcedures();
            const removed = list.splice(Number(delProc.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.procedures = list;
            saveCustomData(custom);
            addAuditLog(`Menghapus Prosedur: "${removed?.badge || '-'}"`);
            renderDashboard();
            return;
        }
        const toggleUser = e.target.closest('.js-toggle-user');
        if (toggleUser) {
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
        if (delUser) {
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

    // Super Admin: Export Permanent data.js
    document.getElementById('exportDataJsBtn')?.addEventListener('click', function () {
        if (getSession()?.role !== 'superadmin') return;
        const mergedData = {
            heroSlides: getMergedHero(),
            services: getMergedServices(),
            videos: getMergedVideos(),
            news: getMergedNews(),
            publications: getMergedPubs(),
            procedures: getMergedProcedures(),
            partners: getMergedPartners(),
            siteMeta: {
                ...getMergedSiteMeta(),
                runningText: getCustomData().runningText || getMergedSiteMeta().runningText
            }
        };
        const content = `/* Generated by Super Admin STUPA SMKN 1 Magelang (${new Date().toLocaleString('id-ID')}) */\nwindow.STUPA_DATA = ${JSON.stringify(mergedData, null, 4)};\n`;
        const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        a.click();
        URL.revokeObjectURL(url);
        addAuditLog('Mengekspor data.js permanen untuk publikasi');
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
        if (confirm('Kembalikan seluruh konten web ke pengaturan bawaan?')) {
            localStorage.removeItem(CUSTOM_KEY);
            addAuditLog('Mereset seluruh konten web ke bawaan pabrik');
            renderDashboard();
        }
    });
});
