/* ==========================================================================
   STUPA SMKN 1 Magelang - Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const baseData = window.STUPA_DATA;
    if (!baseData) return;

    // Merge optional CMS overrides saved by Admin Portal
    let savedCustom = null;
    try {
        savedCustom = JSON.parse(localStorage.getItem('stupa_custom_data') || 'null');
    } catch (_) {
        savedCustom = null;
    }

    const data = {
        ...baseData,
        heroSlides: (savedCustom && Array.isArray(savedCustom.heroSlides)) ? savedCustom.heroSlides : baseData.heroSlides,
        publications: (savedCustom && Array.isArray(savedCustom.publications)) ? savedCustom.publications : baseData.publications,
        news: {
            ...baseData.news,
            ...(savedCustom && savedCustom.news ? savedCustom.news : {})
        }
    };

    if (savedCustom && savedCustom.sectionVisibility) {
        Object.entries(savedCustom.sectionVisibility).forEach(([secId, isVisible]) => {
            const secEl = document.getElementById(secId);
            if (secEl) secEl.classList.toggle('d-none', isVisible === false);
        });
    }

    if (savedCustom && savedCustom.runningText) {
        document.querySelectorAll('.running-text-track p').forEach((p, idx) => {
            const iconClass = idx === 0 ? 'fa-mountain' : 'fa-leaf';
            p.innerHTML = `<i class="fas ${iconClass} me-2"></i> ${savedCustom.runningText}`;
        });
    }

    // 1. Navbar scroll state & Back-to-top visibility
    const mainNav = document.getElementById('mainNavbar');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScroll() {
        if (window.scrollY > 40) {
            mainNav?.classList.add('scrolled');
        } else {
            mainNav?.classList.remove('scrolled');
        }
        if (window.scrollY > 240) {
            backToTopBtn?.classList.add('show');
        } else {
            backToTopBtn?.classList.remove('show');
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    backToTopBtn?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 2. Render Hero Carousel Slides
    const heroContainer = document.getElementById('carouselItemsContainer');
    const heroIndicators = document.getElementById('heroIndicators');
    if (heroContainer && heroIndicators) {
        heroContainer.innerHTML = data.heroSlides.map((slide, idx) => `
            <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <img src="${slide.image}" alt="${slide.title}">
                <div class="carousel-caption custom-caption">
                    <span class="hero-tag"><i class="fas fa-leaf"></i> ${slide.tag}</span>
                    <h1 class="slide-title">${slide.title}</h1>
                    <p class="slide-description">${slide.description}</p>
                    <button type="button" class="btn custom-btn js-open-article" data-source="hero" data-index="${idx}">
                        <span>Lihat detail</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `).join('');

        heroIndicators.innerHTML = data.heroSlides.map((slide, idx) => `
            <button type="button" data-bs-target="#carouselBackground" data-bs-slide-to="${idx}"
                class="${idx === 0 ? 'active' : ''}" aria-current="${idx === 0 ? 'true' : 'false'}"
                aria-label="Slide ${idx + 1}: ${slide.tag}"></button>
        `).join('');
    }

    // 3. Render 6 Layanan & Portal Digital STUPA Cards
    const servicesContainer = document.getElementById('servicesGridContainer');
    if (servicesContainer) {
        servicesContainer.innerHTML = data.services.map((srv, idx) => `
            <div class="custom-card js-open-service" role="button" tabindex="0" data-index="${idx}">
                <div class="service-icon-box">
                    <i class="fas ${srv.icon}"></i>
                </div>
                <h5>${srv.title}</h5>
                <p>${srv.subtitle}</p>
            </div>
        `).join('');
    }

    // 4. Render Video Showcase Section
    const mainVideo = data.videos[0];
    const videoSectionEl = document.getElementById('videoShowcaseSection');
    const mainVideoTitle = document.getElementById('mainVideoTitle');
    const mainVideoDesc = document.getElementById('mainVideoDesc');
    const mainVideoBtn = document.getElementById('mainVideoPlayBtn');
    const videoCardsRow = document.getElementById('videoCardsRow');

    if (videoSectionEl && mainVideo) {
        videoSectionEl.style.backgroundImage = `url('${mainVideo.thumb}')`;
        if (mainVideoTitle) mainVideoTitle.textContent = mainVideo.title;
        if (mainVideoDesc) mainVideoDesc.textContent = mainVideo.summary;
        if (mainVideoBtn) mainVideoBtn.dataset.index = '0';
    }

    if (videoCardsRow) {
        videoCardsRow.innerHTML = data.videos.slice(1).map((vid, idx) => `
            <div class="col-lg-4 col-md-6">
                <div class="video-card js-open-video" role="button" tabindex="0" data-index="${idx + 1}">
                    <img src="${vid.thumb}" alt="${vid.title}" loading="lazy">
                    <div class="video-card-play"><i class="fas fa-play ms-1"></i></div>
                    <div class="video-card-overlay">
                        <h5 class="video-card-title">${vid.title}</h5>
                        <p class="video-card-date">${vid.date}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 5. Render Berita & Informasi Tabs
    const tabMap = [
        { key: 'berita', label: 'Berita', containerId: 'berita-container' },
        { key: 'ekspedisi', label: 'Ekspedisi', containerId: 'ekspedisi-container' },
        { key: 'pengumuman', label: 'Pengumuman', containerId: 'pengumuman-container' },
        { key: 'agenda', label: 'Agenda', containerId: 'agenda-container' },
        { key: 'artikel', label: 'Artikel', containerId: 'artikel-container' }
    ];

    let showAllBerita = false;

    function renderBeritaGrid() {
        tabMap.forEach(tab => {
            const container = document.getElementById(tab.containerId);
            if (!container) return;
            const list = data.news[tab.key] || [];
            const visibleItems = (tab.key === 'berita' && !showAllBerita) ? list.slice(0, 6) : list;
            container.innerHTML = visibleItems.map((item, idx) => `
                <article class="berita-card js-open-article" role="button" tabindex="0" data-source="${tab.key}" data-index="${idx}">
                    <div class="berita-card-img-wrap">
                        <img src="${item.image}" class="berita-card-img" alt="${item.title}" loading="lazy">
                        <span class="berita-cat-pill">${tab.label}</span>
                    </div>
                    <div class="berita-card-body">
                        <h3 class="berita-card-title">${item.title}</h3>
                        <p class="berita-card-excerpt">${item.excerpt}</p>
                        <div class="berita-card-meta">
                            <span><i class="far fa-calendar-alt me-1"></i>${item.date}</span>
                            <span class="fw-semibold text-success">Baca <i class="fas fa-chevron-right ms-1" style="font-size:10px"></i></span>
                        </div>
                    </div>
                </article>
            `).join('');
        });
    }
    renderBeritaGrid();

    document.querySelectorAll('.js-toggle-berita').forEach(btn => {
        btn.addEventListener('click', function () {
            showAllBerita = !showAllBerita;
            renderBeritaGrid();
            showToast(showAllBerita ? 'Menampilkan seluruh arsip kabar terbaru STUPA.' : 'Menampilkan ringkasan kabar terbaru.');
        });
    });

    // 6. Render Publikasi & Modul Grid (4 visible initially, toggleable to all 8)
    let showAllPublikasi = false;
    const publikasiListEl = document.getElementById('publikasi-list');
    const pubLoadMoreBtn = document.getElementById('publikasi-load-more');

    function renderPublikasi() {
        if (!publikasiListEl) return;
        const items = showAllPublikasi ? data.publications : data.publications.slice(0, 4);
        publikasiListEl.innerHTML = items.map((pub, idx) => `
            <div class="publikasi-card js-open-pub" role="button" tabindex="0" data-index="${idx}">
                <div class="publikasi-cover" style="background: ${pub.gradient};">
                    <span class="publikasi-cover-badge">${pub.badge}</span>
                    <h4 class="publikasi-cover-title">${pub.title}</h4>
                    <div class="publikasi-cover-foot">
                        <span>${pub.year}</span>
                        <span>${pub.pages}</span>
                    </div>
                </div>
            </div>
        `).join('');
        if (pubLoadMoreBtn) {
            const btnText = pubLoadMoreBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = showAllPublikasi ? 'Tampilkan lebih ringkas' : 'Tampilkan lebih banyak';
            }
        }
    }
    renderPublikasi();

    pubLoadMoreBtn?.addEventListener('click', function () {
        showAllPublikasi = !showAllPublikasi;
        renderPublikasi();
    });

    // 7. Interactive Reader / Detail Modal
    const detailModalEl = document.getElementById('stupaDetailModal');
    const detailModal = detailModalEl ? new bootstrap.Modal(detailModalEl) : null;
    const detailTitle = document.getElementById('stupaDetailTitle');
    const detailBody = document.getElementById('stupaDetailBody');

    function openArticleModal(source, idx) {
        let item = null;
        if (source === 'hero') {
            item = data.heroSlides[idx];
        } else if (data.news[source]) {
            item = data.news[source][idx];
        }
        if (!item || !detailModal) return;

        detailTitle.textContent = item.tag || source.toUpperCase();
        detailBody.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="img-fluid rounded-4 mb-3 w-100" style="max-height:360px;object-fit:cover;">
            <div class="d-flex flex-wrap gap-3 text-muted small mb-2">
                <span><i class="far fa-calendar-alt me-1 text-success"></i>${item.date}</span>
                <span><i class="fas fa-feather-pointed me-1 text-success"></i>${item.author || 'Redaksi STUPA SMKN 1 Magelang'}</span>
            </div>
            <h4 class="fw-bold mb-3" style="color:#005950;">${item.title}</h4>
            <div class="lh-lg" style="color:#2e4240;">
                ${item.content || `<p>${item.excerpt}</p>`}
            </div>
        `;
        detailModal.show();
    }

    function openPublicationModal(idx) {
        const pub = data.publications[idx];
        if (!pub || !detailModal) return;
        detailTitle.textContent = 'Arsip & Modul STUPA';
        detailBody.innerHTML = `
            <div class="row g-4 align-items-center">
                <div class="col-md-5">
                    <div class="publikasi-cover rounded-4 shadow" style="background:${pub.gradient}; min-height:280px;">
                        <span class="publikasi-cover-badge">${pub.badge}</span>
                        <h4 class="publikasi-cover-title">${pub.title}</h4>
                        <div class="publikasi-cover-foot">
                            <span>${pub.year}</span>
                            <span>${pub.pages}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-7">
                    <span class="badge rounded-pill mb-2" style="background:#005950;">${pub.badge}</span>
                    <h4 class="fw-bold mb-2" style="color:#005950;">${pub.title}</h4>
                    <p class="text-muted small mb-3">${pub.year} • ${pub.pages} • Penerbitan Internal STUPA SMKN 1 Magelang</p>
                    <p class="lh-lg mb-4">${pub.summary}</p>
                    <button type="button" class="btn custom-btn js-download-pub" data-title="${pub.title}">
                        <i class="fas fa-file-arrow-down"></i> Unduh Ringkasan Modul (.txt)
                    </button>
                </div>
            </div>
        `;
        detailModal.show();
    }

    function openVideoModal(idx) {
        const vid = data.videos[idx];
        if (!vid || !detailModal) return;
        detailTitle.textContent = 'Dokumentasi Visual STUPA';
        detailBody.innerHTML = `
            <div class="position-relative rounded-4 overflow-hidden mb-3 bg-dark">
                <img src="${vid.thumb}" alt="${vid.title}" class="img-fluid w-100" style="max-height:360px;object-fit:cover;opacity:0.82;">
                <div class="position-absolute top-50 start-50 translate-middle text-center text-white px-3">
                    <div class="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle"
                         style="width:68px;height:68px;background:rgba(249,121,16,0.92);border:2px solid #fff;">
                        <i class="fas fa-film fs-4"></i>
                    </div>
                    <span class="badge bg-dark bg-opacity-75 px-3 py-2 rounded-pill">Pratinjau Dokumenter Lapangan</span>
                </div>
            </div>
            <h4 class="fw-bold mb-2" style="color:#005950;">${vid.title}</h4>
            <p class="text-muted small mb-3"><i class="far fa-clock me-1"></i>${vid.date}</p>
            <p class="lh-lg mb-3">${vid.summary}</p>
            <div class="d-flex flex-wrap gap-2">
                ${vid.highlights.map(h => `<span class="badge rounded-pill text-bg-light border px-3 py-2">${h}</span>`).join('')}
            </div>
        `;
        detailModal.show();
    }

    function openServiceModal(idx) {
        const srv = data.services[idx];
        if (!srv || !detailModal) return;
        detailTitle.textContent = srv.title;

        let extraHtml = '';
        if (srv.actionType === 'form') {
            const fieldsHtml = srv.fields.map(f => {
                if (f.type === 'textarea') {
                    return `
                        <div class="mb-3">
                            <label class="form-label fw-semibold small text-dark">${f.label}</label>
                            <textarea class="form-control rounded-3" name="${f.name}" rows="3" placeholder="${f.placeholder}" required></textarea>
                        </div>
                    `;
                }
                if (f.type === 'select') {
                    return `
                        <div class="mb-3">
                            <label class="form-label fw-semibold small text-dark">${f.label}</label>
                            <select class="form-select rounded-3" name="${f.name}">
                                ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                            </select>
                        </div>
                    `;
                }
                return `
                    <div class="mb-3">
                        <label class="form-label fw-semibold small text-dark">${f.label}</label>
                        <input type="${f.type}" class="form-control rounded-3" name="${f.name}" placeholder="${f.placeholder}" required>
                    </div>
                `;
            }).join('');

            extraHtml = `
                <form id="stupaServiceForm" data-service-title="${srv.title}" class="mt-3 p-3 rounded-4" style="background:#f5faf9;border:1px solid rgba(0,89,82,0.12);">
                    ${fieldsHtml}
                    <button type="submit" class="btn custom-btn w-100 justify-content-center py-2">
                        <i class="fas fa-paper-plane"></i> ${srv.submitLabel}
                    </button>
                </form>
            `;
        } else if (srv.infoList) {
            extraHtml = `
                <div class="d-flex flex-column gap-2 mt-3">
                    ${srv.infoList.map(info => `
                        <div class="p-3 rounded-3" style="background:#f5faf9;border-left:4px solid #00a896;">
                            <div class="fw-bold" style="color:#005950;">${info.title}</div>
                            <div class="small text-muted mt-1">${info.meta}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        detailBody.innerHTML = `
            <div class="d-flex align-items-center gap-3 mb-3">
                <div class="service-icon-box mb-0" style="width:56px;height:56px;font-size:22px;">
                    <i class="fas ${srv.icon}"></i>
                </div>
                <div>
                    <span class="badge rounded-pill mb-1" style="background:#00a896;">${srv.badge}</span>
                    <h4 class="fw-bold mb-0" style="color:#005950;">${srv.title}</h4>
                </div>
            </div>
            <p class="lh-lg mb-2">${srv.description}</p>
            ${extraHtml}
        `;
        detailModal.show();
    }

    // Event delegation for dynamic cards & buttons
    document.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute('role') === 'button') {
            e.preventDefault();
            e.target.click();
        }
    });

    document.addEventListener('click', function (e) {
        const articleEl = e.target.closest('.js-open-article');
        if (articleEl) {
            openArticleModal(articleEl.dataset.source, Number(articleEl.dataset.index));
            return;
        }
        const serviceEl = e.target.closest('.js-open-service');
        if (serviceEl) {
            openServiceModal(Number(serviceEl.dataset.index));
            return;
        }
        const pubEl = e.target.closest('.js-open-pub');
        if (pubEl) {
            openPublicationModal(Number(pubEl.dataset.index));
            return;
        }
        const vidEl = e.target.closest('.js-open-video');
        if (vidEl) {
            openVideoModal(Number(vidEl.dataset.index));
            return;
        }
        const dlBtn = e.target.closest('.js-download-pub');
        if (dlBtn) {
            const title = dlBtn.dataset.title || 'Modul-STUPA';
            const pub = data.publications.find(p => p.title === title);
            const text = `STUPA SMKN 1 MAGELANG\nSiswa Siswi Teknik Satu Pecinta Alam\n========================================\nJudul: ${title}\nKategori: ${pub?.badge || 'Publikasi'}\nEdisi: ${pub?.year || '2026'}\n\nRingkasan:\n${pub?.summary || ''}\n\nSekretariat: Jl. Cawang No. 2, Magelang Selatan`;
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Ringkasan modul berhasil diunduh.');
            return;
        }
        const procCard = e.target.closest('.prosedur-step-card');
        if (procCard) {
            const titleText = procCard.querySelector('.step-badge')?.textContent || 'Prosedur STUPA';
            detailTitle.textContent = titleText;
            detailBody.innerHTML = procCard.querySelector('.prosedur-diagram-box')?.innerHTML || '';
            detailModal?.show();
        }
    });

    // Handle service form submission cleanly & persist to Admin Inbox
    document.addEventListener('submit', function (e) {
        if (e.target && e.target.id === 'stupaServiceForm') {
            e.preventDefault();
            const formData = new FormData(e.target);
            const payload = {};
            formData.forEach((val, key) => { payload[key] = String(val); });
            const firstVal = formData.values().next().value || 'Sahabat Alam';
            const serviceTitle = e.target.dataset.serviceTitle || 'Layanan STUPA';

            try {
                const existing = JSON.parse(localStorage.getItem('stupa_submissions') || '[]');
                existing.unshift({
                    id: 'SUB-' + Date.now(),
                    service: serviceTitle,
                    applicant: String(firstVal),
                    fields: payload,
                    status: 'Menunggu',
                    createdAt: new Date().toLocaleString('id-ID')
                });
                localStorage.setItem('stupa_submissions', JSON.stringify(existing));
            } catch (_) {
                // Ignore storage quota errors
            }

            detailModal?.hide();
            showToast(`Terima kasih, ${firstVal}! Permohonan Anda telah tercatat di sistem layanan STUPA.`);
        }
    });

    // 8. Live Navbar Search across News, Services & Publications
    const searchInput = document.getElementById('navSearchInput');
    const searchResultsEl = document.getElementById('navSearchResults');
    const searchForm = document.getElementById('navSearchForm');

    const searchableItems = [
        ...data.services.map((s, idx) => ({ type: 'Layanan', title: s.title, action: () => openServiceModal(idx) })),
        ...data.publications.map((p, idx) => ({ type: 'Publikasi', title: p.title, action: () => openPublicationModal(idx) })),
        ...Object.entries(data.news).flatMap(([cat, arr]) =>
            arr.map((n, idx) => ({ type: cat.toUpperCase(), title: n.title, action: () => openArticleModal(cat, idx) }))
        )
    ];

    function updateSearchDropdown(query) {
        if (!searchResultsEl) return;
        const q = query.trim().toLowerCase();
        if (!q) {
            searchResultsEl.classList.remove('open');
            searchResultsEl.innerHTML = '';
            return;
        }
        const matches = searchableItems.filter(it => it.title.toLowerCase().includes(q)).slice(0, 7);
        if (matches.length === 0) {
            searchResultsEl.innerHTML = `<div class="p-3 small text-muted text-center">Tidak ditemukan hasil untuk "${query}"</div>`;
        } else {
            searchResultsEl.innerHTML = matches.map((m, i) => `
                <div class="nav-search-item" data-match-idx="${i}">
                    <span class="nav-search-badge">${m.type}</span>
                    <span class="nav-search-title">${m.title}</span>
                </div>
            `).join('');
            searchResultsEl.querySelectorAll('.nav-search-item').forEach((el, i) => {
                el.addEventListener('click', function () {
                    searchResultsEl.classList.remove('open');
                    matches[i].action();
                });
            });
        }
        searchResultsEl.classList.add('open');
    }

    searchInput?.addEventListener('input', function () {
        updateSearchDropdown(this.value);
    });

    searchForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (searchInput) updateSearchDropdown(searchInput.value);
    });

    document.addEventListener('click', function (e) {
        if (searchForm && !searchForm.contains(e.target)) {
            searchResultsEl?.classList.remove('open');
        }
    });

    // 9. Persistent Local Visitor Counter
    const todayEl = document.getElementById('visitorToday');
    const totalEl = document.getElementById('visitorTotal');
    try {
        const storedTotal = Number(localStorage.getItem('stupa_total_visits') || '12840') + 1;
        localStorage.setItem('stupa_total_visits', String(storedTotal));
        if (todayEl) todayEl.textContent = String(142 + (storedTotal % 35));
        if (totalEl) totalEl.textContent = storedTotal.toLocaleString('id-ID');
    } catch (_) {
        if (todayEl) todayEl.textContent = '148';
        if (totalEl) totalEl.textContent = '12.841';
    }

    // 10. Toast Notification Helper
    const toastEl = document.getElementById('stupaToast');
    const toastTextEl = document.getElementById('stupaToastText');
    let toastTimer = null;

    function showToast(msg) {
        if (!toastEl || !toastTextEl) return;
        toastTextEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 4500);
    }

    // 11. Navbar Dropdown Shortcuts to Open Specific Modals/Tabs
    document.querySelectorAll('[data-open-service]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            openServiceModal(Number(this.dataset.openService));
        });
    });

    document.querySelectorAll('[data-switch-tab]').forEach(link => {
        link.addEventListener('click', function () {
            const tabId = this.dataset.switchTab;
            const tabBtn = document.getElementById(tabId);
            if (tabBtn) {
                bootstrap.Tab.getOrCreateInstance(tabBtn).show();
            }
        });
    });
});
