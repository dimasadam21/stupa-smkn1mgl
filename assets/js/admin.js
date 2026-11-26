/* ==========================================================================
   STUPA SMKN 1 Magelang - Portal Pengelolaan Web (Admin & Super Admin)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const SESSION_KEY = 'stupa_admin_session_obj';
    const ACCOUNTS_KEY = 'stupa_admin_accounts';
    const CUSTOM_KEY = 'stupa_custom_data';
    const SUB_KEY = 'stupa_submissions';
    const LOGS_KEY = 'stupa_audit_logs';

    const DEFAULT_ACCOUNTS = [
        { username: 'superadmin', password: 'stupasuper2026', role: 'superadmin', displayName: 'Pembina / Super Admin STUPA', active: true },
        { username: 'admin', password: 'stupa2026', role: 'admin', displayName: 'Pengelola Web STUPA', active: true }
    ];

    const SECTIONS_META = [
        { id: 'layanan-stupa', label: 'Layanan & Kanal Digital STUPA' },
        { id: 'video-showcase', label: 'Video Showcase & Dokumenter' },
        { id: 'berita-informasi', label: 'Berita & Informasi' },
        { id: 'prosedur-stupa', label: 'Layanan STUPA (Adventure, Agriculture & Kompos)' },
        { id: 'kontak-footer', label: 'Footer, Kontak & Statistik' }
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

    function isManager() {
        const role = getSession()?.role;
        return role === 'admin' || role === 'superadmin';
    }

    function isSuperAdmin() {
        return getSession()?.role === 'superadmin';
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

    const getMergedNewsCategories = () => {
        const c = getCustomData().newsCategories;
        return (Array.isArray(c) && c.length > 0) ? c : [...(window.STUPA_DATA?.newsCategories || [
            { key: 'berita', label: 'Berita' },
            { key: 'ekspedisi', label: 'Ekspedisi' },
            { key: 'pengumuman', label: 'Pengumuman' },
            { key: 'agenda', label: 'Agenda' },
            { key: 'artikel', label: 'Artikel' }
        ])];
    };
    const getMergedNews = () => ({ ...(window.STUPA_DATA?.news || {}), ...(getCustomData().news || {}) });
    const getMergedHero = () => {
        const c = getCustomData().heroSlides;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.heroSlides || [])];
    };
    const getMergedServices = () => {
        const c = getCustomData().services;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.services || [])];
    };
    const getMergedVideos = () => {
        const c = getCustomData().videos;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.videos || [])];
    };
    const getMergedCatalog = () => {
        const c = getCustomData().layananCatalog;
        return Array.isArray(c) ? c : [...(window.STUPA_DATA?.layananCatalog || [])];
    };
    const getMergedSiteMeta = () => ({ ...(window.STUPA_DATA?.siteMeta || {}), ...(getCustomData().siteMeta || {}) });

    // Image Compression & Preview Helpers (Preset + URL + File Upload)
    function compressImageToDataUrl(file, maxWidth = 1280, quality = 0.82) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                const img = new Image();
                img.onload = function () {
                    let w = img.width;
                    let h = img.height;
                    if (w > maxWidth) {
                        h = Math.round((h * maxWidth) / w);
                        w = maxWidth;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    const isPng = file.type === 'image/png';
                    resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = String(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function updateHeroLivePreview() {
        const imgEl = document.getElementById('heroImgPreview');
        const overlayEl = document.getElementById('heroPreviewOverlay');
        const tagEl = document.getElementById('heroPrevTag');
        const titleEl = document.getElementById('heroPrevTitle');
        const descEl = document.getElementById('heroPrevDesc');
        const btnEl = document.getElementById('heroPrevBtn');
        const overlayVal = document.getElementById('heroOverlayVal');

        const urlVal = document.getElementById('heroImageUrl')?.value.trim() || 'assets/images/hero-merbabu.jpg';
        const posVal = document.getElementById('heroPosInput')?.value || 'center';
        const alphaVal = Number(document.getElementById('heroOverlayInput')?.value || 0.92);
        const tagVal = document.getElementById('heroTagInput')?.value.trim() || '';
        const titleVal = document.getElementById('heroTitleInput')?.value.trim() || 'Judul Utama Tampilan Depan';
        const descVal = document.getElementById('heroDescInput')?.value.trim() || 'Tulisan atau deskripsi singkat akan tampil di sini...';
        const btnText = document.getElementById('heroBtnTextInput')?.value.trim() || 'Lihat detail';
        const btnColor = document.getElementById('heroBtnColorInput')?.value || '#F97910';

        if (imgEl) {
            imgEl.src = urlVal;
            imgEl.style.objectPosition = posVal;
        }
        if (overlayEl) {
            overlayEl.style.background = `linear-gradient(to top, rgba(0,26,23,${alphaVal}) 0%, rgba(0,35,31,${(alphaVal * 0.58).toFixed(2)}) 55%, rgba(0,0,0,0.12) 100%)`;
        }
        if (overlayVal) overlayVal.textContent = `${Math.round(alphaVal * 100)}%`;
        if (tagEl) {
            tagEl.textContent = tagVal;
            tagEl.classList.toggle('d-none', !tagVal);
        }
        if (titleEl) titleEl.textContent = titleVal;
        if (descEl) descEl.textContent = descVal;
        if (btnEl) {
            btnEl.innerHTML = `${btnText} &rarr;`;
            btnEl.style.background = btnColor;
        }
    }

    document.addEventListener('change', async function (e) {
        if (e.target.classList.contains('js-img-preset')) {
            const targetEl = document.getElementById(e.target.dataset.target);
            const prevEl = document.getElementById(e.target.dataset.preview);
            if (targetEl) targetEl.value = e.target.value;
            if (prevEl) prevEl.src = e.target.value;
            if (e.target.dataset.target === 'heroImageUrl') updateHeroLivePreview();
        }
        if (e.target.classList.contains('js-img-upload')) {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const isLogo = e.target.dataset.target?.startsWith('metaLogo');
                const dataUrl = await compressImageToDataUrl(file, isLogo ? 400 : 1280, 0.84);
                const targetEl = document.getElementById(e.target.dataset.target);
                const prevEl = document.getElementById(e.target.dataset.preview);
                if (targetEl) targetEl.value = dataUrl;
                if (prevEl) { prevEl.src = dataUrl; prevEl.classList.remove('d-none'); }
                if (e.target.dataset.target === 'heroImageUrl') updateHeroLivePreview();
            } catch {
                alert('Gagal memproses file gambar.');
            }
        }
        if (e.target.classList.contains('js-hero-live')) {
            updateHeroLivePreview();
        }
        if (e.target.classList.contains('js-sub-status')) {
            const list = getSubmissions();
            const idx = Number(e.target.dataset.idx);
            if (list[idx]) {
                list[idx].status = e.target.value;
                localStorage.setItem(SUB_KEY, JSON.stringify(list));
                addAuditLog(`Mengubah status "${list[idx].applicant}" menjadi ${e.target.value}`);
                if (isSuperAdmin()) renderAuditLogs();
            }
        }
        if (e.target.classList.contains('js-sec-toggle') && isSuperAdmin()) {
            const secId = e.target.dataset.sec;
            const custom = getCustomData();
            custom.sectionVisibility = { ...(custom.sectionVisibility || {}), [secId]: e.target.checked };
            saveCustomData(custom);
            addAuditLog(`${e.target.checked ? 'Menampilkan' : 'Menyembunyikan'} seksi "${secId}"`);
            renderAuditLogs();
        }
    });

    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('js-img-url')) {
            const prevEl = document.getElementById(e.target.dataset.preview);
            if (prevEl && e.target.value.trim()) {
                prevEl.src = e.target.value.trim();
                prevEl.classList.remove('d-none');
            }
        }
        if (e.target.classList.contains('js-hero-live')) {
            updateHeroLivePreview();
        }
    });

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
        const servicesAndVideos = getMergedServices().length + getMergedVideos().length;
        const visits = Number(localStorage.getItem('stupa_total_visits') || '12840');

        document.getElementById('statNewsCount').textContent = String(totalNews);
        document.getElementById('statSubCount').textContent = String(submissions.length);
        document.getElementById('statPubCount').textContent = String(servicesAndVideos);
        document.getElementById('statVisitCount').textContent = visits.toLocaleString('id-ID');

        renderSubmissions();
        renderNewsCategoriesManager();
        renderNewsList();
        renderSuperHeroList();
        renderSuperServicesList();
        renderSuperVideosList();
        renderSuperCatalogList();

        const meta = getMergedSiteMeta();
        const rtInput = document.getElementById('runningTextInput');
        if (rtInput) rtInput.value = getCustomData().runningText || meta.runningText || '';
        const leadLayEl = document.getElementById('metaLeadLayananInput');
        if (leadLayEl) leadLayEl.value = meta.secLeadLayanan || '';
        const leadProcEl = document.getElementById('metaLeadProcInput');
        if (leadProcEl) leadProcEl.value = meta.secLeadProsedur || '';
        fillSiteMetaForm(meta);

        if (isSuperAdmin()) {
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
                        ${isSuperAdmin()
                            ? `<button type="button" class="btn btn-outline-danger btn-sm js-del-sub" data-idx="${idx}" title="Hapus"><i class="fas fa-trash"></i></button>`
                            : `<span class="text-muted small">-</span>`}
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderNewsCategoriesManager() {
        const cats = getMergedNewsCategories();
        const selectEl = document.getElementById('newsCatInput');
        const filterEl = document.getElementById('adminNewsFilterCat');
        const pillsEl = document.getElementById('adminNewsCatsList');

        if (selectEl) {
            const prevVal = selectEl.value;
            selectEl.innerHTML = cats.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
            if (cats.some(c => c.key === prevVal)) selectEl.value = prevVal;
        }
        if (filterEl) {
            const prevFilter = filterEl.value || 'all';
            filterEl.innerHTML = `<option value="all">Semua Kategori</option>` + cats.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
            filterEl.value = (prevFilter === 'all' || cats.some(c => c.key === prevFilter)) ? prevFilter : 'all';
        }
        if (pillsEl) {
            pillsEl.innerHTML = cats.map((c, idx) => `
                <span class="badge rounded-pill text-bg-light border px-3 py-2 d-inline-flex align-items-center gap-2" style="color:#005950;">
                    <span>${c.label}</span>
                    <button type="button" class="btn btn-link p-0 text-primary js-edit-news-cat" data-idx="${idx}" title="Ganti Nama Tab" style="font-size:11px;"><i class="fas fa-pen"></i></button>
                    ${cats.length > 1 ? `<button type="button" class="btn-close js-del-news-cat" data-idx="${idx}" title="Hapus Tab" style="font-size:8px;"></button>` : ''}
                </span>
            `).join('');
        }
    }

    function renderNewsList() {
        const listEl = document.getElementById('adminNewsList');
        if (!listEl) return;
        const cats = getMergedNewsCategories();
        const merged = getMergedNews();
        const filterCat = document.getElementById('adminNewsFilterCat')?.value || 'all';
        const searchQ = (document.getElementById('adminNewsFilterSearch')?.value || '').trim().toLowerCase();

        const items = [];
        cats.forEach(c => {
            if (filterCat !== 'all' && filterCat !== c.key) return;
            (merged[c.key] || []).forEach((item, idx) => {
                if (searchQ && !item.title.toLowerCase().includes(searchQ)) return;
                items.push({ cat: c.key, catLabel: c.label, idx, ...item });
            });
        });

        if (items.length === 0) {
            listEl.innerHTML = `<div class="text-center text-muted small py-4 border rounded-3 bg-white">Tidak ada konten pada filter ini.</div>`;
            return;
        }

        listEl.innerHTML = items.map(it => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <img src="${it.image}" alt="" class="rounded-2 flex-shrink-0" style="width:52px;height:38px;object-fit:cover;">
                    <div class="overflow-hidden">
                        <span class="badge text-bg-success text-uppercase" style="font-size:10px;">${it.catLabel}</span>
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${it.title}</div>
                        <div class="text-muted" style="font-size:11px;">${it.date}${it.author ? ` • ${it.author}` : ''}</div>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-shrink-0">
                    ${it.idx > 0 ? `<button type="button" class="btn btn-outline-success btn-sm js-pin-news" data-cat="${it.cat}" data-idx="${it.idx}" title="Naikkan ke Paling Atas"><i class="fas fa-arrow-up"></i></button>` : ''}
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-news" data-cat="${it.cat}" data-idx="${it.idx}" title="Edit"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-news" data-cat="${it.cat}" data-idx="${it.idx}" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('adminNewsFilterCat')?.addEventListener('change', renderNewsList);
    document.getElementById('adminNewsFilterSearch')?.addEventListener('input', renderNewsList);

    function renderSuperHeroList() {
        const el = document.getElementById('superHeroList');
        if (!el) return;
        const slides = getMergedHero();
        el.innerHTML = slides.map((s, idx) => `
            <div class="d-flex justify-content-between align-items-center gap-2 p-2 rounded-3 border bg-white">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <img src="${s.image}" alt="" class="rounded-2 flex-shrink-0" style="width:56px;height:40px;object-fit:cover;object-position:${s.imagePosition || 'center'};">
                    <div class="overflow-hidden">
                        ${idx === 0 ? '<span class="badge text-bg-success me-1" style="font-size:9px;">#1 Utama</span>' : `<span class="badge text-bg-light border me-1" style="font-size:9px;">#${idx + 1}</span>`}
                        ${s.tag ? `<span class="badge text-bg-warning" style="font-size:10px;">${s.tag}</span>` : ''}
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${s.title}</div>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-shrink-0">
                    ${idx > 0 ? `<button type="button" class="btn btn-outline-success btn-sm js-make-first-hero" data-idx="${idx}" title="Jadikan Tampilan Pertama (#1)"><i class="fas fa-arrow-up"></i></button>` : ''}
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-hero" data-idx="${idx}" title="Edit Gambar &amp; Tulisan"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-hero" data-idx="${idx}" ${slides.length <= 1 ? 'disabled' : ''} title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        updateHeroLivePreview();
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
                        <div class="fw-semibold text-truncate" style="font-size:12.5px;color:#005950;">${s.title} <span class="badge text-bg-light border" style="font-size:9px;">${s.actionType === 'form' ? 'Form' : 'Info/Kegiatan'}</span></div>
                        <div class="text-muted text-truncate" style="font-size:11px;">${s.subtitle}</div>
                    </div>
                </div>
                <div class="d-flex gap-1 flex-shrink-0">
                    ${idx > 0 ? `<button type="button" class="btn btn-outline-success btn-sm js-move-srv" data-idx="${idx}" title="Naikkan Urutan"><i class="fas fa-arrow-up"></i></button>` : ''}
                    <button type="button" class="btn btn-outline-primary btn-sm js-edit-srv" data-idx="${idx}" title="Edit Layanan &amp; Isi Kegiatan"><i class="fas fa-pen"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm js-del-srv" data-idx="${idx}" ${list.length <= 1 ? 'disabled' : ''} title="Hapus"><i class="fas fa-trash"></i></button>
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

    function renderSuperCatalogList() {
        const el = document.getElementById('superCatalogList');
        if (!el) return;
        const list = getMergedCatalog();
        if (list.length === 0) {
            el.innerHTML = '<div class="text-muted small py-3 text-center">Belum ada unit layanan. Silakan tambah di formulir sebelah kiri.</div>';
            return;
        }
        el.innerHTML = list.map((unit, idx) => `
            <div class="p-3 rounded-4 bg-white border shadow-sm">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge rounded-pill text-bg-success px-2 py-2"><i class="fas ${unit.icon || 'fa-store'}"></i></span>
                        <div>
                            <div class="fw-bold" style="color:#005950;">${unit.badge}</div>
                            <div class="text-muted small">${unit.subtitle || ''}</div>
                        </div>
                    </div>
                    <div class="d-flex gap-1 flex-shrink-0">
                        ${idx > 0 ? `<button type="button" class="btn btn-outline-success btn-sm js-move-cat" data-idx="${idx}" title="Naikkan Urutan"><i class="fas fa-arrow-up"></i></button>` : ''}
                        <button type="button" class="btn btn-outline-primary btn-sm js-edit-cat" data-idx="${idx}" title="Edit Layanan & Daftar Harga"><i class="fas fa-pen"></i> Edit</button>
                        <button type="button" class="btn btn-outline-danger btn-sm js-del-cat" data-idx="${idx}" title="Hapus"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="small text-muted mb-2">${unit.description || ''}</div>
                <div class="d-flex flex-column gap-1">
                    ${(unit.items || []).map(it => `
                        <div class="d-flex justify-content-between align-items-center px-2 py-1 rounded-2" style="background:#f6fbfa;font-size:12px;">
                            <span class="fw-semibold text-dark">${it.title}</span>
                            ${it.price ? `<span class="badge rounded-pill" style="background:rgba(249,121,16,0.16);color:#c85800;">${it.price}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    function fillSiteMetaForm(meta) {
        const setV = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
        setV('metaLogoSmkInput', meta.logoSmk || 'assets/images/logo-smkn1.png');
        setV('metaLogoStupaInput', meta.logoStupa || 'assets/images/logo-stupa.png');
        setV('metaBrandTitleInput', meta.brandTitle);
        setV('metaBrandSubInput', meta.brandSubtitle);
        setV('metaTitleLayananInput', meta.secTitleLayanan);
        setV('metaTitleBeritaInput', meta.secTitleBerita);
        setV('metaTitleProcInput', meta.secTitleProsedur);
        setV('metaFooterOrgInput', meta.footerOrgName || 'STUPA — Siswa Siswi Teknik\nSatu Pecinta Alam\nSMK Negeri 1 Magelang');
        setV('metaMottoInput', meta.footerMotto);
        setV('metaFooterContactHeading', meta.footerContactHeading || 'Kontak & Sekretariat');
        setV('metaSecInput', meta.secretariatName);
        setV('metaAddr1Input', meta.addressLine1);
        setV('metaAddr2Input', meta.addressLine2);
        setV('metaPhoneInput', meta.phone);
        setV('metaEmailInput', meta.email);
        setV('metaFooterSocialHeading', meta.footerSocialHeading || 'Ikuti Kami');
        setV('metaIgInput', meta.instagramUrl);
        setV('metaYtInput', meta.youtubeUrl);
        setV('metaTtInput', meta.tiktokUrl);
        setV('metaWaInput', meta.whatsappUrl || '#layanan-stupa');
        const showVisEl = document.getElementById('metaShowVisitorInput');
        if (showVisEl) showVisEl.checked = meta.showVisitorStats !== false;
        setV('metaVisitorOnlineInput', meta.visitorOnlineText || '12 Online');
        setV('metaVisitorTodayInput', meta.visitorTodayBase ?? 142);
        setV('metaVisitorTotalInput', Number(localStorage.getItem('stupa_total_visits') || meta.visitorTotalBase || 12840));
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

    // Reset Form Helpers
    function resetNewsForm() {
        document.getElementById('addNewsForm')?.reset();
        document.getElementById('editNewsCat').value = '';
        document.getElementById('editNewsIdx').value = '';
        document.getElementById('newsImageUrl').value = 'assets/images/hero-merbabu.jpg';
        document.getElementById('newsImgPreview').src = 'assets/images/hero-merbabu.jpg';
        document.getElementById('newsFormHeading').innerHTML = '<i class="fas fa-plus-circle me-1"></i> Terbitkan / Edit Berita &amp; Informasi';
        document.getElementById('cancelNewsEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelNewsEditBtn')?.addEventListener('click', resetNewsForm);

    function resetNewsCatForm() {
        document.getElementById('addNewsCatForm')?.reset();
        document.getElementById('editNewsCatIdx').value = '';
        document.getElementById('newsCatSubmitBtn').textContent = 'Tambah Tab';
        document.getElementById('cancelNewsCatEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelNewsCatEditBtn')?.addEventListener('click', resetNewsCatForm);

    function resetHeroForm() {
        document.getElementById('addHeroForm')?.reset();
        document.getElementById('editHeroIdx').value = '';
        document.getElementById('heroImageUrl').value = 'assets/images/hero-merbabu.jpg';
        document.getElementById('heroPosInput').value = 'center';
        document.getElementById('heroOverlayInput').value = '0.92';
        document.getElementById('heroBtnTextInput').value = 'Lihat detail';
        document.getElementById('heroBtnColorInput').value = '#F97910';
        document.getElementById('heroFormHeading').innerHTML = '<i class="fas fa-pen-ruler me-1"></i> Ganti Gambar &amp; Tulisan Tampilan Depan';
        document.getElementById('cancelHeroEditBtn')?.classList.add('d-none');
        updateHeroLivePreview();
    }
    document.getElementById('cancelHeroEditBtn')?.addEventListener('click', resetHeroForm);

    function resetSrvForm() {
        document.getElementById('addServiceForm')?.reset();
        document.getElementById('editSrvIdx').value = '';
        const prev = document.getElementById('srvImgPreview');
        if (prev) { prev.src = 'assets/images/bg-nature-mist.svg'; prev.classList.add('d-none'); }
        document.getElementById('srvFormHeading').innerHTML = '<i class="fas fa-concierge-bell me-1"></i> Tambah / Edit Layanan &amp; Isi Kegiatan';
        document.getElementById('cancelSrvEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelSrvEditBtn')?.addEventListener('click', resetSrvForm);

    function resetVidForm() {
        document.getElementById('addVideoForm')?.reset();
        document.getElementById('editVidIdx').value = '';
        document.getElementById('vidThumbUrl').value = 'assets/images/video-bg-danau.jpg';
        document.getElementById('vidImgPreview').src = 'assets/images/video-bg-danau.jpg';
        document.getElementById('vidFormHeading').innerHTML = '<i class="fas fa-film me-1"></i> Tambah / Edit Video Dokumenter';
        document.getElementById('cancelVidEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelVidEditBtn')?.addEventListener('click', resetVidForm);

    // Kelola Tab Kategori Berita & Informasi (Admin & Super Admin)
    document.getElementById('addNewsCatForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const label = document.getElementById('newsCatManageLabelInput').value.trim();
        const editIdx = document.getElementById('editNewsCatIdx').value;
        if (!label) return;

        const custom = getCustomData();
        const cats = getMergedNewsCategories();
        if (editIdx !== '') {
            const idx = Number(editIdx);
            if (cats[idx]) {
                cats[idx] = { ...cats[idx], label };
                addAuditLog(`Mengubah nama tab berita menjadi "${label}"`);
            }
        } else {
            let key = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('tab-' + Date.now());
            if (cats.some(c => c.key === key)) key = `${key}-${Date.now().toString().slice(-3)}`;
            cats.push({ key, label });
            addAuditLog(`Menambahkan tab kategori berita baru: "${label}"`);
        }
        custom.newsCategories = cats;
        saveCustomData(custom);
        resetNewsCatForm();
        renderDashboard();
    });

    // Web Content Submissions (Available to BOTH Admin & Super Admin)
    document.getElementById('addNewsForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const cat = document.getElementById('newsCatInput').value;
        const dateVal = document.getElementById('newsDateInput').value.trim();
        const authorVal = document.getElementById('newsAuthorInput').value.trim();
        const title = document.getElementById('newsTitleInput').value.trim();
        const image = document.getElementById('newsImageUrl').value.trim();
        const excerpt = document.getElementById('newsExcerptInput').value.trim();
        const content = document.getElementById('newsContentInput').value.trim();
        const editCat = document.getElementById('editNewsCat').value;
        const editIdx = document.getElementById('editNewsIdx').value;

        const custom = getCustomData();
        const merged = getMergedNews();
        const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        const finalDate = dateVal || today;
        const finalAuthor = authorVal || 'Redaksi STUPA SMKN 1 Magelang';

        if (editIdx !== '' && editCat) {
            const oldArr = [...(merged[editCat] || [])];
            const existing = oldArr.splice(Number(editIdx), 1)[0] || {};
            merged[editCat] = oldArr;
            const updatedObj = { ...existing, title, date: finalDate, author: finalAuthor, image, excerpt, content };
            if (editCat === cat) {
                const reordered = [...oldArr];
                reordered.splice(Number(editIdx), 0, updatedObj);
                merged[cat] = reordered;
            } else {
                merged[cat] = [updatedObj, ...(merged[cat] || [])];
            }
            addAuditLog(`Mengedit ${cat}: "${title}"`);
        } else {
            merged[cat] = [{ title, date: finalDate, author: finalAuthor, image, excerpt, content }, ...(merged[cat] || [])];
            addAuditLog(`Menambahkan ${cat}: "${title}"`);
        }
        custom.news = merged;
        saveCustomData(custom);
        resetNewsForm();
        renderDashboard();
    });

    document.getElementById('addHeroForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const tag = document.getElementById('heroTagInput').value.trim();
        const image = document.getElementById('heroImageUrl').value.trim();
        const imagePosition = document.getElementById('heroPosInput').value || 'center';
        const overlayOpacity = Number(document.getElementById('heroOverlayInput').value || 0.92);
        const title = document.getElementById('heroTitleInput').value.trim();
        const description = document.getElementById('heroDescInput').value.trim();
        const buttonText = document.getElementById('heroBtnTextInput').value.trim() || 'Lihat detail';
        const buttonColor = document.getElementById('heroBtnColorInput').value || '#F97910';
        const buttonUrl = document.getElementById('heroBtnUrlInput').value.trim();
        const rawContent = document.getElementById('heroContentInput').value.trim();
        const editIdx = document.getElementById('editHeroIdx').value;

        const custom = getCustomData();
        const slides = getMergedHero();
        const formattedContent = rawContent
            ? `<p class="lead fw-semibold text-teal">${description}</p><p>${rawContent.replace(/\n/g, '</p><p>')}</p>`
            : `<p class="lead fw-semibold text-teal">${description}</p><p>Dipublikasikan melalui Portal Pengelolaan Web STUPA SMKN 1 Magelang.</p>`;

        if (editIdx !== '') {
            const old = slides[Number(editIdx)] || {};
            slides[Number(editIdx)] = {
                ...old,
                tag, title, description, image, imagePosition, overlayOpacity,
                buttonText, buttonColor, buttonUrl,
                content: rawContent ? formattedContent : (old.content || formattedContent)
            };
            addAuditLog(`Mengedit Tampilan Depan: "${title}"`);
        } else {
            slides.unshift({
                id: 'hero-' + Date.now(),
                tag, title, description, image, imagePosition, overlayOpacity,
                buttonText, buttonColor, buttonUrl,
                date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
                author: 'Pengelola Web STUPA SMKN 1 Magelang',
                content: formattedContent
            });
            addAuditLog(`Menambahkan Slide Tampilan Depan: "${title}"`);
        }
        custom.heroSlides = slides;
        saveCustomData(custom);
        resetHeroForm();
        renderDashboard();
        alert('Tampilan depan berhasil disimpan dan langsung aktif di beranda!');
    });

    document.getElementById('addServiceForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const title = document.getElementById('srvTitleInput').value.trim();
        const badge = document.getElementById('srvBadgeInput').value.trim();
        const subtitle = document.getElementById('srvSubtitleInput').value.trim();
        const icon = document.getElementById('srvIconInput').value;
        const actionType = document.getElementById('srvTypeInput').value || 'info';
        const coverImage = document.getElementById('srvImageUrl').value.trim();
        const description = document.getElementById('srvDescInput').value.trim();
        const rawItems = document.getElementById('srvItemsInput').value.split('\n').map(l => l.trim()).filter(Boolean);
        const infoList = rawItems.map((line, i) => {
            const [t, m] = line.split('|').map(x => x.trim());
            return { title: t || `Kegiatan ${i + 1}`, meta: m || '' };
        });
        const linkUrl = document.getElementById('srvLinkUrlInput').value.trim();
        const linkText = document.getElementById('srvLinkTextInput').value.trim();
        const editIdx = document.getElementById('editSrvIdx').value;

        const custom = getCustomData();
        const list = getMergedServices();
        const defaultFields = [
            { name: 'nama', label: 'Nama Lengkap / Kelas', type: 'text', placeholder: 'Masukkan nama lengkap...' },
            { name: 'kontak', label: 'Nomor WhatsApp', type: 'tel', placeholder: '08xxxxxxxxxx' },
            { name: 'catatan', label: 'Keterangan / Keperluan', type: 'textarea', placeholder: 'Tulis rincian permohonan...' }
        ];

        if (editIdx !== '') {
            const old = list[Number(editIdx)] || {};
            list[Number(editIdx)] = {
                ...old,
                title, badge, subtitle, icon, actionType, coverImage, description, linkUrl, linkText,
                infoList: infoList.length > 0 ? infoList : (actionType === 'info' ? [{ title: 'Rincian Kegiatan', meta: description }] : old.infoList),
                fields: actionType === 'form' ? (old.fields || defaultFields) : old.fields,
                submitLabel: actionType === 'form' ? (old.submitLabel || `Kirim ${title}`) : old.submitLabel
            };
            addAuditLog(`Mengedit Layanan/Kegiatan: "${title}"`);
        } else {
            list.push({
                id: 'srv-' + Date.now(),
                icon, title, subtitle, badge, description, coverImage, linkUrl, linkText,
                actionType,
                infoList: infoList.length > 0 ? infoList : [{ title: 'Agenda & Informasi Kegiatan', meta: description }],
                fields: actionType === 'form' ? defaultFields : undefined,
                submitLabel: actionType === 'form' ? `Kirim ${title}` : undefined
            });
            addAuditLog(`Menambahkan Layanan/Kegiatan: "${title}"`);
        }
        custom.services = list;
        saveCustomData(custom);
        resetSrvForm();
        renderDashboard();
    });

    document.getElementById('addVideoForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const title = document.getElementById('vidTitleInput').value.trim();
        const date = document.getElementById('vidDateInput').value.trim();
        const videoUrl = document.getElementById('vidUrlInput').value.trim();
        const thumb = document.getElementById('vidThumbUrl').value.trim();
        const summary = document.getElementById('vidSummaryInput').value.trim();
        const editIdx = document.getElementById('editVidIdx').value;

        const custom = getCustomData();
        const list = getMergedVideos();
        if (editIdx !== '') {
            list[Number(editIdx)] = { ...list[Number(editIdx)], title, date, videoUrl, thumb, summary };
            addAuditLog(`Mengedit Video: "${title}"`);
        } else {
            list.push({
                id: 'vid-' + Date.now(),
                title, date, videoUrl, thumb, summary,
                highlights: ['Dokumentasi STUPA SMKN 1 Magelang']
            });
            addAuditLog(`Menambahkan Video: "${title}"`);
        }
        custom.videos = list;
        saveCustomData(custom);
        resetVidForm();
        renderDashboard();
    });

    function resetCatForm() {
        document.getElementById('catalogForm')?.reset();
        const idxEl = document.getElementById('editCatIdx');
        if (idxEl) idxEl.value = '';
        const prev = document.getElementById('catImgPreview');
        if (prev) { prev.src = 'assets/images/bg-nature-mist.svg'; prev.classList.add('d-none'); }
        const h = document.getElementById('catFormHeading');
        if (h) h.innerHTML = '<i class="fas fa-store me-1"></i> Tambah / Edit Layanan STUPA';
        document.getElementById('cancelCatEditBtn')?.classList.add('d-none');
    }
    document.getElementById('cancelCatEditBtn')?.addEventListener('click', resetCatForm);

    document.getElementById('catalogForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const badge = document.getElementById('catBadgeInput').value.trim();
        const icon = document.getElementById('catIconInput').value;
        const subtitle = document.getElementById('catSubtitleInput').value.trim();
        const description = document.getElementById('catDescInput').value.trim();
        const actionText = document.getElementById('catActionInput').value.trim() || 'Lihat Katalog & Pesan';
        const contact = document.getElementById('catContactInput').value.trim();
        const image = document.getElementById('catImageUrl').value.trim();
        const editIdx = document.getElementById('editCatIdx').value;

        const lines = document.getElementById('catItemsInput').value.split('\n').map(l => l.trim()).filter(Boolean);
        const items = lines.map((line, i) => {
            const parts = line.split('|').map(x => x.trim());
            return {
                title: parts[0] || `Item ${i + 1}`,
                price: parts[1] || '',
                desc: parts[2] || ''
            };
        });

        const custom = getCustomData();
        const list = getMergedCatalog();
        const payload = { badge, subtitle, icon, image, description, contact, actionText, items };
        if (editIdx !== '') {
            list[Number(editIdx)] = { ...list[Number(editIdx)], ...payload };
            addAuditLog(`Mengedit Layanan STUPA: "${badge}"`);
        } else {
            list.push({ id: 'srv-' + Date.now(), ...payload });
            addAuditLog(`Menambahkan Layanan STUPA: "${badge}"`);
        }
        custom.layananCatalog = list;
        saveCustomData(custom);
        resetCatForm();
        renderDashboard();
    });

    document.getElementById('leadLayananForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const custom = getCustomData();
        custom.siteMeta = {
            ...getMergedSiteMeta(),
            secLeadLayanan: document.getElementById('metaLeadLayananInput').value.trim(),
            secLeadProsedur: document.getElementById('metaLeadProcInput').value.trim()
        };
        saveCustomData(custom);
        addAuditLog('Memperbarui subjudul seksi beranda');
        alert('Subjudul seksi beranda berhasil disimpan!');
    });

    document.getElementById('runningTextForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const custom = getCustomData();
        custom.runningText = document.getElementById('runningTextInput').value.trim();
        saveCustomData(custom);
        addAuditLog('Memperbarui Running Text beranda');
        if (isSuperAdmin()) renderAuditLogs();
        alert('Running text berhasil diperbarui!');
    });

    document.getElementById('siteMetaForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isManager()) return;
        const custom = getCustomData();
        custom.siteMeta = {
            ...getMergedSiteMeta(),
            logoSmk: document.getElementById('metaLogoSmkInput').value.trim() || 'assets/images/logo-smkn1.png',
            logoStupa: document.getElementById('metaLogoStupaInput').value.trim() || 'assets/images/logo-stupa.png',
            brandTitle: document.getElementById('metaBrandTitleInput').value.trim(),
            brandSubtitle: document.getElementById('metaBrandSubInput').value.trim(),
            secTitleLayanan: document.getElementById('metaTitleLayananInput').value.trim(),
            secTitleBerita: document.getElementById('metaTitleBeritaInput').value.trim(),
            secTitleProsedur: document.getElementById('metaTitleProcInput').value.trim(),
            footerOrgName: document.getElementById('metaFooterOrgInput').value.trim(),
            footerMotto: document.getElementById('metaMottoInput').value.trim(),
            footerContactHeading: document.getElementById('metaFooterContactHeading').value.trim(),
            secretariatName: document.getElementById('metaSecInput').value.trim(),
            addressLine1: document.getElementById('metaAddr1Input').value.trim(),
            addressLine2: document.getElementById('metaAddr2Input').value.trim(),
            phone: document.getElementById('metaPhoneInput').value.trim(),
            email: document.getElementById('metaEmailInput').value.trim(),
            footerSocialHeading: document.getElementById('metaFooterSocialHeading').value.trim(),
            instagramUrl: document.getElementById('metaIgInput').value.trim() || '#kontak-footer',
            youtubeUrl: document.getElementById('metaYtInput').value.trim() || '#kontak-footer',
            tiktokUrl: document.getElementById('metaTtInput').value.trim() || '#kontak-footer',
            whatsappUrl: document.getElementById('metaWaInput').value.trim() || '#layanan-stupa',
            showVisitorStats: document.getElementById('metaShowVisitorInput')?.checked !== false,
            visitorOnlineText: document.getElementById('metaVisitorOnlineInput').value.trim() || '12 Online',
            visitorTodayBase: Number(document.getElementById('metaVisitorTodayInput').value || 142),
            visitorTotalBase: Number(document.getElementById('metaVisitorTotalInput').value || 12840),
            copyright: document.getElementById('metaCopyInput').value.trim()
        };
        if (custom.siteMeta.visitorTotalBase >= 0) {
            localStorage.setItem('stupa_total_visits', String(custom.siteMeta.visitorTotalBase));
        }
        saveCustomData(custom);
        addAuditLog('Memperbarui Header, Footer, Kontak, Sosmed & Statistik');
        renderDashboard();
        alert('Pengaturan Header, Footer, Kontak, Sosmed & Statistik berhasil diperbarui!');
    });

    // Delegated Click Actions
    document.addEventListener('click', function (e) {
        if (!isManager()) return;

        const editNewsCat = e.target.closest('.js-edit-news-cat');
        if (editNewsCat) {
            const idx = Number(editNewsCat.dataset.idx);
            const c = getMergedNewsCategories()[idx];
            if (!c) return;
            document.getElementById('editNewsCatIdx').value = String(idx);
            document.getElementById('newsCatManageLabelInput').value = c.label;
            document.getElementById('newsCatSubmitBtn').textContent = 'Simpan Tab';
            document.getElementById('cancelNewsCatEditBtn')?.classList.remove('d-none');
            return;
        }
        const delNewsCat = e.target.closest('.js-del-news-cat');
        if (delNewsCat) {
            const cats = getMergedNewsCategories();
            if (cats.length <= 1) return;
            const removed = cats.splice(Number(delNewsCat.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.newsCategories = cats;
            saveCustomData(custom);
            addAuditLog(`Menghapus tab kategori berita: "${removed?.label || '-'}"`);
            renderDashboard();
            return;
        }
        const pinNews = e.target.closest('.js-pin-news');
        if (pinNews) {
            const cat = pinNews.dataset.cat;
            const idx = Number(pinNews.dataset.idx);
            const custom = getCustomData();
            const merged = getMergedNews();
            const list = [...(merged[cat] || [])];
            if (idx > 0 && idx < list.length) {
                const [picked] = list.splice(idx, 1);
                list.unshift(picked);
                custom.news = { ...merged, [cat]: list };
                saveCustomData(custom);
                addAuditLog(`Menaikkan "${picked.title}" ke urutan teratas ${cat}`);
                renderDashboard();
            }
            return;
        }
        const editNews = e.target.closest('.js-edit-news');
        if (editNews) {
            const cat = editNews.dataset.cat;
            const idx = Number(editNews.dataset.idx);
            const item = getMergedNews()[cat]?.[idx];
            if (!item) return;
            document.getElementById('editNewsCat').value = cat;
            document.getElementById('editNewsIdx').value = String(idx);
            document.getElementById('newsCatInput').value = cat;
            document.getElementById('newsDateInput').value = item.date || '';
            document.getElementById('newsAuthorInput').value = item.author || '';
            document.getElementById('newsTitleInput').value = item.title;
            document.getElementById('newsImageUrl').value = item.image;
            document.getElementById('newsImgPreview').src = item.image;
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
        const makeFirstHero = e.target.closest('.js-make-first-hero');
        if (makeFirstHero) {
            const idx = Number(makeFirstHero.dataset.idx);
            const slides = getMergedHero();
            if (idx > 0 && idx < slides.length) {
                const [picked] = slides.splice(idx, 1);
                slides.unshift(picked);
                const custom = getCustomData();
                custom.heroSlides = slides;
                saveCustomData(custom);
                addAuditLog(`Menjadikan "${picked.title}" sebagai Slide Utama #1`);
                renderDashboard();
            }
            return;
        }
        const editHero = e.target.closest('.js-edit-hero');
        if (editHero) {
            const idx = Number(editHero.dataset.idx);
            const s = getMergedHero()[idx];
            if (!s) return;
            document.getElementById('editHeroIdx').value = String(idx);
            document.getElementById('heroTagInput').value = s.tag || '';
            document.getElementById('heroImageUrl').value = s.image || '';
            document.getElementById('heroPosInput').value = s.imagePosition || 'center';
            document.getElementById('heroOverlayInput').value = String(s.overlayOpacity !== undefined ? s.overlayOpacity : 0.92);
            document.getElementById('heroTitleInput').value = s.title || '';
            document.getElementById('heroDescInput').value = s.description || '';
            document.getElementById('heroBtnTextInput').value = s.buttonText || 'Lihat detail';
            document.getElementById('heroBtnColorInput').value = s.buttonColor || '#F97910';
            document.getElementById('heroBtnUrlInput').value = s.buttonUrl || '';
            document.getElementById('heroContentInput').value = (s.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            document.getElementById('heroFormHeading').innerHTML = `<i class="fas fa-pen me-1"></i> Edit Slide Tampilan Depan (#${idx + 1})`;
            document.getElementById('cancelHeroEditBtn')?.classList.remove('d-none');
            updateHeroLivePreview();
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
        const moveSrv = e.target.closest('.js-move-srv');
        if (moveSrv) {
            const idx = Number(moveSrv.dataset.idx);
            const list = getMergedServices();
            if (idx > 0 && idx < list.length) {
                const temp = list[idx - 1];
                list[idx - 1] = list[idx];
                list[idx] = temp;
                const custom = getCustomData();
                custom.services = list;
                saveCustomData(custom);
                addAuditLog(`Menggeser urutan layanan "${list[idx - 1].title}"`);
                renderDashboard();
            }
            return;
        }
        const editSrv = e.target.closest('.js-edit-srv');
        if (editSrv) {
            const idx = Number(editSrv.dataset.idx);
            const s = getMergedServices()[idx];
            if (!s) return;
            document.getElementById('editSrvIdx').value = String(idx);
            document.getElementById('srvTitleInput').value = s.title || '';
            document.getElementById('srvBadgeInput').value = s.badge || '';
            document.getElementById('srvSubtitleInput').value = s.subtitle || '';
            document.getElementById('srvIconInput').value = s.icon || 'fa-compass';
            document.getElementById('srvTypeInput').value = s.actionType || 'info';
            document.getElementById('srvImageUrl').value = s.coverImage || '';
            const prev = document.getElementById('srvImgPreview');
            if (prev) {
                if (s.coverImage) { prev.src = s.coverImage; prev.classList.remove('d-none'); }
                else { prev.classList.add('d-none'); }
            }
            document.getElementById('srvDescInput').value = s.description || '';
            document.getElementById('srvItemsInput').value = (s.infoList || []).map(it => `${it.title} | ${it.meta}`).join('\n');
            document.getElementById('srvLinkUrlInput').value = s.linkUrl || '';
            document.getElementById('srvLinkTextInput').value = s.linkText || '';
            document.getElementById('srvFormHeading').innerHTML = `<i class="fas fa-pen me-1"></i> Edit Layanan &amp; Isi Kegiatan (#${idx + 1})`;
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
            document.getElementById('vidUrlInput').value = v.videoUrl || '';
            document.getElementById('vidThumbUrl').value = v.thumb;
            document.getElementById('vidImgPreview').src = v.thumb;
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
        const moveCat = e.target.closest('.js-move-cat');
        if (moveCat) {
            const idx = Number(moveCat.dataset.idx);
            const list = getMergedCatalog();
            if (idx > 0 && idx < list.length) {
                const temp = list[idx - 1];
                list[idx - 1] = list[idx];
                list[idx] = temp;
                const custom = getCustomData();
                custom.layananCatalog = list;
                saveCustomData(custom);
                addAuditLog(`Menggeser urutan layanan "${list[idx - 1].badge}"`);
                renderDashboard();
            }
            return;
        }
        const editCat = e.target.closest('.js-edit-cat');
        if (editCat) {
            const idx = Number(editCat.dataset.idx);
            const u = getMergedCatalog()[idx];
            if (!u) return;
            document.getElementById('editCatIdx').value = String(idx);
            document.getElementById('catBadgeInput').value = u.badge || '';
            document.getElementById('catIconInput').value = u.icon || 'fa-store';
            document.getElementById('catSubtitleInput').value = u.subtitle || '';
            document.getElementById('catDescInput').value = u.description || '';
            document.getElementById('catActionInput').value = u.actionText || '';
            document.getElementById('catContactInput').value = u.contact || '';
            document.getElementById('catImageUrl').value = u.image || '';
            const prev = document.getElementById('catImgPreview');
            if (prev) {
                if (u.image) { prev.src = u.image; prev.classList.remove('d-none'); }
                else { prev.src = 'assets/images/bg-nature-mist.svg'; prev.classList.add('d-none'); }
            }
            document.getElementById('catItemsInput').value = (u.items || []).map(it =>
                [it.title, it.price, it.desc].filter(x => x !== undefined && x !== '').join(' | ')
            ).join('\n');
            document.getElementById('catFormHeading').innerHTML = '<i class="fas fa-pen me-1"></i> Edit Unit Layanan STUPA';
            document.getElementById('cancelCatEditBtn')?.classList.remove('d-none');
            return;
        }
        const delCat = e.target.closest('.js-del-cat');
        if (delCat) {
            const list = getMergedCatalog();
            const removed = list.splice(Number(delCat.dataset.idx), 1)[0];
            const custom = getCustomData();
            custom.layananCatalog = list;
            saveCustomData(custom);
            addAuditLog(`Menghapus Layanan STUPA: "${removed?.badge || '-'}"`);
            renderDashboard();
            return;
        }

        // SUPER ADMIN ONLY ACTIONS
        if (!isSuperAdmin()) return;

        const delSub = e.target.closest('.js-del-sub');
        if (delSub) {
            const list = getSubmissions();
            const removed = list.splice(Number(delSub.dataset.idx), 1)[0];
            localStorage.setItem(SUB_KEY, JSON.stringify(list));
            addAuditLog(`Menghapus permohonan dari "${removed?.applicant || '-'}"`);
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

    // Super Admin Only Forms & System Controls
    document.getElementById('addUserForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isSuperAdmin()) return;
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

    document.getElementById('changePwdForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = document.getElementById('newAdminPwd').value;
        const sess = getSession();
        if (!isSuperAdmin() || !sess || val.length < 6) return;
        const accounts = getAccounts();
        const target = accounts.find(a => a.username === sess.username);
        if (target) {
            target.password = val;
            saveAccounts(accounts);
            addAuditLog(`Memperbarui kata sandi akun "${sess.username}"`);
            this.reset();
            renderAuditLogs();
            alert('Kata sandi berhasil diperbarui.');
        }
    });

    document.getElementById('exportSubmissionsBtn')?.addEventListener('click', function () {
        if (!isSuperAdmin()) return;
        const blob = new Blob([JSON.stringify(getSubmissions(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'permohonan-layanan-stupa.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('clearLogsBtn')?.addEventListener('click', function () {
        if (!isSuperAdmin()) return;
        localStorage.removeItem(LOGS_KEY);
        renderAuditLogs();
    });

    document.getElementById('exportDataJsBtn')?.addEventListener('click', function () {
        if (!isSuperAdmin()) return;
        const mergedData = {
            newsCategories: getMergedNewsCategories(),
            heroSlides: getMergedHero(),
            services: getMergedServices(),
            videos: getMergedVideos(),
            news: getMergedNews(),
            layananCatalog: getMergedCatalog(),
            siteMeta: {
                ...getMergedSiteMeta(),
                runningText: getCustomData().runningText || getMergedSiteMeta().runningText
            }
        };
        const content = `/* Generated by STUPA SMKN 1 Magelang (${new Date().toLocaleString('id-ID')}) */\nwindow.STUPA_DATA = ${JSON.stringify(mergedData, null, 4)};\n`;
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

    document.getElementById('fullBackupBtn')?.addEventListener('click', function () {
        if (!isSuperAdmin()) return;
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
        if (!isSuperAdmin()) return;
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

    document.getElementById('resetDefaultBtn')?.addEventListener('click', function () {
        if (!isSuperAdmin()) return;
        if (confirm('Kembalikan seluruh konten web ke pengaturan bawaan?')) {
            localStorage.removeItem(CUSTOM_KEY);
            addAuditLog('Mereset seluruh konten web ke bawaan pabrik');
            renderDashboard();
        }
    });
});
