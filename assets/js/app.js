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
        services: (savedCustom && Array.isArray(savedCustom.services)) ? savedCustom.services : baseData.services,
        videos: (savedCustom && Array.isArray(savedCustom.videos)) ? savedCustom.videos : baseData.videos,
        layananCatalog: (savedCustom && Array.isArray(savedCustom.layananCatalog)) ? savedCustom.layananCatalog : (baseData.layananCatalog || []),
        siteMeta: {
            ...(baseData.siteMeta || {}),
            ...(savedCustom && savedCustom.siteMeta ? savedCustom.siteMeta : {})
        },
        newsCategories: (savedCustom && Array.isArray(savedCustom.newsCategories) && savedCustom.newsCategories.length > 0)
            ? savedCustom.newsCategories
            : (baseData.newsCategories || [
                { key: 'berita', label: 'Berita' },
                { key: 'ekspedisi', label: 'Ekspedisi' },
                { key: 'pengumuman', label: 'Pengumuman' },
                { key: 'agenda', label: 'Agenda' },
                { key: 'artikel', label: 'Artikel' }
            ]),
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

    const activeRunningText = (savedCustom && savedCustom.runningText) || data.siteMeta?.runningText;
    if (activeRunningText) {
        document.querySelectorAll('.running-text-track p').forEach((p, idx) => {
            const iconClass = idx === 0 ? 'fa-mountain' : 'fa-leaf';
            p.innerHTML = `<i class="fas ${iconClass} me-2"></i> ${activeRunningText}`;
        });
    }

    // Apply Dynamic Site Meta (Header, Section Titles, Footer & Social Links)
    const meta = data.siteMeta || {};
    const setTxt = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setTxt('headerBrandSub', meta.brandSubtitle);
    setTxt('secTitleLayanan', meta.secTitleLayanan);
    setTxt('secLeadLayanan', meta.secLeadLayanan);
    setTxt('secTitleBerita', meta.secTitleBerita);
    setTxt('secTitleProsedur', meta.secTitleProsedur);
    setTxt('secLeadProsedur', meta.secLeadProsedur);
    setTxt('footerMotto', meta.footerMotto);
    setTxt('footerSecretariatName', meta.secretariatName);
    setTxt('footerAddress1', meta.addressLine1);
    setTxt('footerAddress2', meta.addressLine2);
    setTxt('footerPhone', meta.phone);
    setTxt('footerCopyright', meta.copyright);
    if (meta.brandTitle) {
        const bt = document.getElementById('headerBrandTitle');
        if (bt) bt.innerHTML = meta.brandTitle.replace(/\n/g, '<br>');
    }
    if (meta.logoSmk) {
        const l1 = document.getElementById('headerLogoSmk');
        const l2 = document.getElementById('footerLogoSmk');
        if (l1) l1.src = meta.logoSmk;
        if (l2) l2.src = meta.logoSmk;
    }
    if (meta.logoStupa) {
        const s1 = document.getElementById('headerLogoStupa');
        const s2 = document.getElementById('footerLogoStupa');
        if (s1) s1.src = meta.logoStupa;
        if (s2) s2.src = meta.logoStupa;
    }
    const emailEl = document.getElementById('footerEmail');
    if (emailEl && meta.email) { emailEl.textContent = meta.email; emailEl.href = `mailto:${meta.email}`; }
    const setHref = (id, url) => { const el = document.getElementById(id); if (el && url) { el.href = url; if (url.startsWith('http')) el.target = '_blank'; } };
    setHref('socialIgLink', meta.instagramUrl);
    setHref('socialYtLink', meta.youtubeUrl);
    setHref('socialTtLink', meta.tiktokUrl);

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
        heroContainer.innerHTML = data.heroSlides.map((slide, idx) => {
            const btnLabel = slide.buttonText || 'Lihat detail';
            const btnBg = slide.buttonColor || '#F97910';
            const imgPos = slide.imagePosition || 'center';
            const overlayAlpha = slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.92;
            const actionBtn = slide.buttonUrl
                ? `<a href="${slide.buttonUrl}" ${slide.buttonUrl.startsWith('http') ? 'target="_blank"' : ''} class="btn custom-btn" style="background-color:${btnBg};"><span>${btnLabel}</span><i class="fas fa-arrow-right"></i></a>`
                : `<button type="button" class="btn custom-btn js-open-article" style="background-color:${btnBg};" data-source="hero" data-index="${idx}"><span>${btnLabel}</span><i class="fas fa-arrow-right"></i></button>`;
            return `
                <div class="carousel-item ${idx === 0 ? 'active' : ''}" style="--hero-overlay-alpha:${overlayAlpha};">
                    <img src="${slide.image}" alt="${slide.title}" style="object-position:${imgPos};">
                    <div class="carousel-caption custom-caption">
                        ${slide.tag ? `<span class="hero-tag"><i class="fas fa-leaf"></i> ${slide.tag}</span>` : ''}
                        <h1 class="slide-title">${slide.title}</h1>
                        <p class="slide-description">${slide.description}</p>
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');

        heroIndicators.innerHTML = data.heroSlides.map((slide, idx) => `
            <button type="button" data-bs-target="#carouselBackground" data-bs-slide-to="${idx}"
                class="${idx === 0 ? 'active' : ''}" aria-current="${idx === 0 ? 'true' : 'false'}"
                aria-label="Slide ${idx + 1}: ${slide.tag || slide.title}"></button>
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

    // 5. Render Dynamic Berita & Informasi Tabs + Navbar Dropdown
    const tabMap = data.newsCategories.map(c => ({
        key: c.key,
        label: c.label,
        containerId: `${c.key}-container`
    }));

    const newsTabsEl = document.getElementById('newsTypeTabs');
    const newsContentEl = document.getElementById('newsTypeContent');
    const navNewsDropEl = document.getElementById('navNewsDropdown');

    if (newsTabsEl && newsContentEl) {
        newsTabsEl.innerHTML = tabMap.map((tab, i) => `
            <li class="nav-item" role="presentation">
                <button class="nav-link ${i === 0 ? 'active' : ''}" id="${tab.key}-tab" data-bs-toggle="tab"
                    data-bs-target="#pane-${tab.key}" type="button" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}">
                    ${tab.label}
                </button>
            </li>
        `).join('');

        newsContentEl.innerHTML = tabMap.map((tab, i) => `
            <div class="tab-pane fade ${i === 0 ? 'show active' : ''}" id="pane-${tab.key}" role="tabpanel" aria-labelledby="${tab.key}-tab">
                <div class="berita-grid" id="${tab.containerId}"></div>
                ${i === 0 ? `
                    <div class="text-center">
                        <button type="button" class="berita-more-btn js-toggle-berita">
                            <span>Lihat selengkapnya</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    if (navNewsDropEl) {
        navNewsDropEl.innerHTML = tabMap.map(tab => `
            <li><a class="dropdown-item" href="#berita-informasi" data-switch-tab="${tab.key}-tab">${tab.label}</a></li>
        `).join('');
    }

    let showAllBerita = false;

    function renderBeritaGrid() {
        tabMap.forEach((tab, tabIdx) => {
            const container = document.getElementById(tab.containerId);
            if (!container) return;
            const list = data.news[tab.key] || [];
            const visibleItems = (tabIdx === 0 && !showAllBerita) ? list.slice(0, 6) : list;
            if (visibleItems.length === 0) {
                container.innerHTML = `<div class="col-12 text-center text-muted py-4">Belum ada konten pada kategori ${tab.label}.</div>`;
                return;
            }
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

    document.addEventListener('click', function (e) {
        if (e.target.closest('.js-toggle-berita')) {
            showAllBerita = !showAllBerita;
            renderBeritaGrid();
            showToast(showAllBerita ? 'Menampilkan seluruh arsip kabar terbaru STUPA.' : 'Menampilkan ringkasan kabar terbaru.');
        }
    });

    // 6. Render Layanan Usaha STUPA (Adventure, Agriculture & Kompos)
    const proceduresContainer = document.getElementById('proceduresContainer');
    if (proceduresContainer && Array.isArray(data.layananCatalog)) {
        proceduresContainer.innerHTML = data.layananCatalog.map((unit, uIdx) => `
            <div class="prosedur-step-card js-open-catalog" data-index="${uIdx}" role="button" tabindex="0" title="Klik untuk melihat katalog & pemesanan ${unit.badge}">
                <div class="layanan-usaha-head">
                    <span class="step-badge"><i class="fas ${unit.icon || 'fa-store'} me-1"></i> ${unit.badge}</span>
                    ${unit.subtitle ? `<p class="layanan-usaha-sub">${unit.subtitle}</p>` : ''}
                </div>
                ${unit.image ? `<img src="${unit.image}" alt="${unit.badge}" class="layanan-usaha-cover">` : ''}
                <div class="prosedur-diagram-box">
                    ${(unit.items || []).map((st, idx) => `
                        <div class="flow-step">
                            <span class="flow-num">${idx + 1}</span>
                            <div class="flow-text">
                                <div class="flow-text-top">
                                    <h6>${st.title}</h6>
                                    ${st.price ? `<span class="flow-price">${st.price}</span>` : ''}
                                </div>
                                ${st.desc ? `<p>${st.desc}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="layanan-card-cta">
                    <span><i class="fas fa-bag-shopping me-1"></i> ${unit.actionText || 'Lihat Katalog & Pesan'}</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `).join('');
    }

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

    function openVideoModal(idx) {
        const vid = data.videos[idx];
        if (!vid || !detailModal) return;
        detailTitle.textContent = 'Dokumentasi Visual STUPA';
        let playerHtml = `
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
        `;
        if (vid.videoUrl) {
            const ytMatch = vid.videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
            if (ytMatch) {
                playerHtml = `<div class="ratio ratio-16x9 rounded-4 overflow-hidden mb-3"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" title="${vid.title}" allowfullscreen></iframe></div>`;
            } else {
                playerHtml = `<video controls class="w-100 rounded-4 mb-3" style="max-height:380px;" poster="${vid.thumb}"><source src="${vid.videoUrl}"></video>`;
            }
        }
        detailBody.innerHTML = `
            ${playerHtml}
            <h4 class="fw-bold mb-2" style="color:#005950;">${vid.title}</h4>
            <p class="text-muted small mb-3"><i class="far fa-clock me-1"></i>${vid.date}</p>
            <p class="lh-lg mb-3">${vid.summary}</p>
            <div class="d-flex flex-wrap gap-2">
                ${(vid.highlights || []).map(h => `<span class="badge rounded-pill text-bg-light border px-3 py-2">${h}</span>`).join('')}
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
            ${srv.coverImage ? `<img src="${srv.coverImage}" alt="${srv.title}" class="img-fluid rounded-4 mb-3 w-100" style="max-height:240px;object-fit:cover;">` : ''}
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
            ${srv.linkUrl ? `<div class="mt-3"><a href="${srv.linkUrl}" ${srv.linkUrl.startsWith('http') ? 'target="_blank"' : ''} class="btn custom-btn"><i class="fas fa-external-link-alt"></i> ${srv.linkText || 'Buka Tautan Kegiatan'}</a></div>` : ''}
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

    function openCatalogModal(idx) {
        const unit = (data.layananCatalog || [])[idx];
        if (!unit || !detailModal) return;
        detailTitle.textContent = unit.badge;
        const itemsHtml = (unit.items || []).map((it, i) => `
            <div class="d-flex justify-content-between align-items-start gap-2 p-2 rounded-3 mb-2" style="background:#f6fbfa;border:1px solid rgba(0,89,82,0.1);">
                <div>
                    <div class="fw-bold" style="color:#005950;font-size:13.5px;">${i + 1}. ${it.title}</div>
                    ${it.desc ? `<div class="text-muted" style="font-size:12px;">${it.desc}</div>` : ''}
                </div>
                ${it.price ? `<span class="badge rounded-pill flex-shrink-0" style="background:#F97910;font-size:11.5px;">${it.price}</span>` : ''}
            </div>
        `).join('');
        detailBody.innerHTML = `
            ${unit.image ? `<img src="${unit.image}" alt="${unit.badge}" class="img-fluid rounded-4 mb-3 w-100" style="max-height:220px;object-fit:cover;">` : ''}
            <div class="d-flex align-items-center gap-3 mb-3">
                <div class="d-flex align-items-center justify-content-center rounded-4 flex-shrink-0" style="width:52px;height:52px;background:rgba(0,89,82,0.12);color:#005950;">
                    <i class="fas ${unit.icon || 'fa-store'} fs-4"></i>
                </div>
                <div>
                    <span class="badge rounded-pill mb-1" style="background:#005950;">LAYANAN STUPA</span>
                    <h4 class="fw-bold mb-0" style="color:#005950;">${unit.badge}</h4>
                    ${unit.subtitle ? `<div class="small text-muted">${unit.subtitle}</div>` : ''}
                </div>
            </div>
            ${unit.description ? `<p class="mb-3">${unit.description}</p>` : ''}
            <h6 class="fw-bold mb-2" style="color:#005950;"><i class="fas fa-list-ul me-1"></i> Daftar Pilihan &amp; Harga</h6>
            <div class="mb-3">${itemsHtml || '<p class="text-muted small">Belum ada daftar item.</p>'}</div>
            ${unit.contact ? `<div class="alert py-2 px-3 small mb-3" style="background:#eef7f5;color:#005950;border:1px solid rgba(0,89,82,0.15);"><i class="fas fa-phone-volume me-1"></i> ${unit.contact}</div>` : ''}
            <form id="stupaServiceForm" class="p-3 rounded-4 border" style="background:#fffaf4;" data-service-title="${unit.badge}">
                <h6 class="fw-bold mb-2" style="color:#c85800;"><i class="fas fa-cart-plus me-1"></i> Formulir Pemesanan / Sewa</h6>
                <div class="row g-2 mb-2">
                    <div class="col-md-6">
                        <input type="text" class="form-control form-control-sm rounded-3" name="Nama Pemesan / Kelas" placeholder="Nama lengkap / Kelas / Instansi" required>
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control form-control-sm rounded-3" name="Kontak WhatsApp" placeholder="Nomor WhatsApp aktif" required>
                    </div>
                </div>
                <textarea class="form-control form-control-sm rounded-3 mb-2" name="Detail Pesanan / Sewa" rows="2" placeholder="Tulis barang/tanaman/media tanam yang dipesan, jumlah, dan tanggal..." required></textarea>
                <button type="submit" class="btn custom-btn btn-sm"><i class="fas fa-paper-plane"></i> Kirim Permintaan ke Admin</button>
            </form>
        `;
        detailModal.show();
    }

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
        const vidEl = e.target.closest('.js-open-video');
        if (vidEl) {
            openVideoModal(Number(vidEl.dataset.index));
            return;
        }
        const catalogCard = e.target.closest('.js-open-catalog');
        if (catalogCard) {
            openCatalogModal(Number(catalogCard.dataset.index));
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

    // 8. Live Navbar Search across News & Services
    const searchInput = document.getElementById('navSearchInput');
    const searchResultsEl = document.getElementById('navSearchResults');
    const searchForm = document.getElementById('navSearchForm');

    const searchableItems = [
        ...data.services.map((s, idx) => ({ type: 'Kanal', title: s.title, action: () => openServiceModal(idx) })),
        ...(data.layananCatalog || []).map((c, idx) => ({ type: 'Layanan', title: `${c.badge} — ${c.subtitle || ''}`, action: () => openCatalogModal(idx) })),
        ...data.newsCategories.flatMap(c =>
            (data.news[c.key] || []).map((n, idx) => ({ type: c.label.toUpperCase(), title: n.title, action: () => openArticleModal(c.key, idx) }))
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
