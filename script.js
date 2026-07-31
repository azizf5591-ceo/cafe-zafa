/* =====================================================================
   SCRIPT.JS — CAFE ZAFA
   File ini BERDIRI SENDIRI. Tidak mengubah/menambah isi HTML atau CSS
   yang sudah ada secara manual. Semua elemen & style tambahan untuk
   fitur-fitur baru di-generate lewat JS (prefix class "zafa-").

   CARA PAKAI: taruh 1 baris ini sebelum </body> di SETIAP file HTML:
   <script src="script.js" defer></script>
   ===================================================================== */

(function () {
  'use strict';

  /* GANTI nomor ini dengan nomor WhatsApp Cafe Zafa (format 62xxxxxxxxxx) */
  const NOMOR_WA = '62895403940306';

  /* =====================================================================
     0. INJECT CSS UNTUK SEMUA FITUR
     ===================================================================== */
  const zafaStyle = document.createElement('style');
  zafaStyle.id = 'zafa-js-styles';
  zafaStyle.textContent = `
    /* --- Light mode override --- */
    body.zafa-light {
      --bg-main: #fff5f7;
      --bg-card: rgba(247, 37, 133, 0.05);
      --bg-card-hover: rgba(247, 37, 133, 0.09);
      --glass-border: rgba(247, 37, 133, 0.18);
      --text-main: #2b1420;
      --text-sub: #6b4a58;
    }
    body.zafa-light iframe { filter: none; }

    /* --- Tombol mengambang (theme / back-to-top / whatsapp) --- */
    .zafa-theme-btn, .zafa-top-btn, .zafa-wa-btn {
      position: fixed;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2000;
      font-size: 1.3rem;
      text-decoration: none;
    }
    .zafa-theme-btn {
      bottom: 24px;
      right: 24px;
      border: 1px solid var(--glass-border);
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent-pink) 100%);
      color: #fff;
      box-shadow: 0 6px 20px var(--primary-glow);
      transition: transform 0.3s ease;
    }
    .zafa-theme-btn:hover { transform: scale(1.1) rotate(15deg); }

    .zafa-top-btn {
      bottom: 24px;
      right: 88px;
      border: 1px solid var(--glass-border);
      background: rgba(30, 15, 25, 0.75);
      backdrop-filter: blur(10px);
      color: var(--text-main);
      opacity: 0;
      pointer-events: none;
      transform: translateY(15px);
      transition: all 0.35s ease;
    }
    .zafa-top-btn.zafa-show { opacity: 1; pointer-events: auto; transform: translateY(0); }
    .zafa-top-btn:hover { border-color: var(--primary); color: var(--primary); }

    .zafa-wa-btn {
      bottom: 24px;
      left: 24px;
      background: #25D366;
      color: #fff;
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
      transition: transform 0.3s ease;
    }
    .zafa-wa-btn:hover { transform: scale(1.1); }

    /* --- Navbar shrink on scroll --- */
    header.zafa-scrolled nav {
      padding: 8px 22px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.55);
    }
    header nav { transition: padding 0.3s ease, box-shadow 0.3s ease; }

    nav a.zafa-active {
      color: #fff !important;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent-pink) 100%);
      box-shadow: 0 0 12px var(--primary-glow);
    }

    /* --- Badge status buka/tutup --- */
    .zafa-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
      background: rgba(80, 220, 140, 0.15);
      color: #7CFCA0;
      border: 1px solid rgba(80, 220, 140, 0.3);
      white-space: nowrap;
    }
    .zafa-status-badge.zafa-closed {
      background: rgba(255, 77, 109, 0.15);
      color: #ff8fa3;
      border-color: rgba(255, 77, 109, 0.3);
    }

    /* --- Tombol salin alamat --- */
    .zafa-copy-btn {
      display: inline-block;
      margin-top: 10px;
      background: rgba(255, 117, 160, 0.12);
      border: 1px solid var(--glass-border);
      color: var(--accent-light);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .zafa-copy-btn:hover {
      background: var(--accent-pink);
      color: #fff;
    }

    /* --- Scroll reveal --- */
    .zafa-reveal {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
    }
    .zafa-reveal.zafa-in-view {
      opacity: 1;
      transform: translateY(0);
    }

    /* --- Toast notification --- */
    .zafa-toast-wrap {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 3000;
      width: min(90vw, 380px);
    }
    .zafa-toast {
      background: rgba(25, 13, 20, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-left: 4px solid var(--primary);
      color: var(--text-main);
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 0.9rem;
      box-shadow: 0 8px 25px rgba(0,0,0,0.4);
      animation: zafaToastIn 0.35s ease forwards;
    }
    .zafa-toast.zafa-error { border-left-color: #ff4d6d; }
    .zafa-toast.zafa-out { animation: zafaToastOut 0.35s ease forwards; }
    @keyframes zafaToastIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes zafaToastOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }

    /* --- Lightbox galeri foto --- */
    .zafa-lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 5, 8, 0.9);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      padding: 30px;
    }
    .zafa-lightbox-overlay.zafa-open { opacity: 1; pointer-events: auto; }
    .zafa-lightbox-overlay img {
      max-width: 90vw;
      max-height: 85vh;
      border-radius: 14px;
      border: 2px solid var(--glass-border);
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      transform: scale(0.92);
      transition: transform 0.3s ease;
    }
    .zafa-lightbox-overlay.zafa-open img { transform: scale(1); }
    .zafa-lightbox-close {
      position: absolute;
      top: 24px;
      right: 30px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 1px solid var(--glass-border);
      color: #fff;
      font-size: 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    main img { cursor: zoom-in; }
    main img.zafa-qr-img { cursor: default; }

    /* --- Filter & search menu (menu.html) --- */
    .zafa-filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 15px 0 25px 0;
    }
    .zafa-filter-btn {
      background: rgba(255, 117, 160, 0.1);
      border: 1px solid var(--glass-border);
      color: var(--text-sub);
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .zafa-filter-btn:hover { color: var(--text-main); border-color: var(--primary); }
    .zafa-filter-btn.zafa-active {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent-pink) 100%);
      color: #fff;
      border-color: transparent;
    }
    .zafa-hidden-group { display: none !important; }

    .zafa-search-wrap { margin: 20px 0; }
    .zafa-search-input {
      width: 100%;
      padding: 14px 18px;
      background: rgba(20, 10, 18, 0.6);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      color: var(--text-main);
      font-family: var(--font-body);
      font-size: 0.95rem;
    }
    .zafa-search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 15px var(--primary-glow);
    }

    /* --- Testimoni (index.html) --- */
    .zafa-testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }
    .zafa-testimonial-card {
      background: rgba(255, 117, 160, 0.05);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 20px;
    }
    .zafa-testimonial-text {
      font-style: italic;
      color: var(--text-main);
      margin-bottom: 10px;
      font-size: 0.92rem;
    }
    .zafa-testimonial-name {
      color: var(--primary);
      font-weight: 700;
      font-size: 0.85rem;
      margin-bottom: 4px;
    }
    .zafa-testimonial-stars { font-size: 0.85rem; margin: 0; }

    /* --- Kalkulator estimasi pesanan (reservasi.html) --- */
    .zafa-calc-box { margin-top: 10px; }
    .zafa-calc-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px dashed var(--glass-border);
    }
    .zafa-calc-row label { color: var(--text-sub); font-size: 0.9rem; }
    .zafa-calc-price { color: var(--accent-light); font-size: 0.8rem; }
    .zafa-calc-qty {
      width: 70px;
      padding: 8px 10px;
      background: rgba(20, 10, 18, 0.6);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      color: var(--text-main);
      text-align: center;
    }
    .zafa-calc-total {
      margin-top: 12px;
      font-weight: 700;
      color: var(--text-main);
      font-size: 1.05rem;
    }
    .zafa-calc-total strong { color: var(--primary); }

    /* --- QR Code menu --- */
    .zafa-qr-wrap {
      text-align: center;
      margin: 20px 0 35px 0;
      background: var(--bg-card);
      border: 1px solid var(--glass-border);
      border-radius: 18px;
      padding: 20px;
    }
    .zafa-qr-img { border-radius: 10px; background: #fff; padding: 8px; }
    .zafa-qr-caption { font-size: 0.85rem; color: var(--accent-light); margin-top: 10px; margin-bottom: 0; }

    /* --- Countdown promo --- */
    .zafa-countdown-box {
      text-align: center;
      background: linear-gradient(135deg, rgba(255,117,160,0.12) 0%, rgba(247,37,133,0.08) 100%);
      border: 1px solid var(--glass-border);
      border-radius: 18px;
      padding: 20px;
      margin: 20px 0;
    }
    .zafa-countdown-label {
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 8px;
      font-size: 1rem;
    }
    .zafa-countdown-timer {
      font-family: var(--font-title);
      font-size: 1.6rem;
      color: var(--text-main);
      letter-spacing: 1px;
    }

    @media (max-width: 768px) {
      .zafa-theme-btn, .zafa-top-btn, .zafa-wa-btn { width: 46px; height: 46px; font-size: 1.1rem; }
      .zafa-top-btn { right: 78px; }
    }
  `;
  document.head.appendChild(zafaStyle);

  /* =====================================================================
     LOADING SCREEN — jalan paling awal, sebelum fitur lain di-init
     ===================================================================== */
  function initLoadingScreen() {
    const overlay = document.createElement('div');
    overlay.className = 'zafa-loading-screen';
    overlay.style.cssText =
      'position:fixed;inset:0;background:var(--bg-main);display:flex;' +
      'align-items:center;justify-content:center;z-index:9999;transition:opacity .6s ease;';

    const logo = document.createElement('img');
    logo.src = 'logo-cafezafa-svg.svg';
    logo.alt = 'Loading Cafe Zafa';
    logo.style.cssText =
      'width:110px;height:110px;border:none;animation:zafaLogoPop 1s cubic-bezier(0.34,1.56,0.64,1);';
    overlay.appendChild(logo);

    const kf = document.createElement('style');
    kf.textContent = `@keyframes zafaLogoPop {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }`;
    document.head.appendChild(kf);
    document.body.appendChild(overlay);

    function hide() {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => overlay.remove(), 600);
    }
    if (document.readyState === 'complete') {
      setTimeout(hide, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 400));
      setTimeout(hide, 2500); // jaga-jaga kalau ada aset yang lambat/gagal load
    }
  }

  /* =====================================================================
     1. DARK / LIGHT MODE TOGGLE
     ===================================================================== */
  function initThemeToggle() {
    const btn = document.createElement('button');
    btn.className = 'zafa-theme-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Ganti tampilan terang/gelap');

    const saved = localStorage.getItem('zafa-theme');
    if (saved === 'light') document.body.classList.add('zafa-light');
    btn.textContent = document.body.classList.contains('zafa-light') ? '🌙' : '☀️';

    btn.addEventListener('click', () => {
      document.body.classList.toggle('zafa-light');
      const isLight = document.body.classList.contains('zafa-light');
      localStorage.setItem('zafa-theme', isLight ? 'light' : 'dark');
      btn.textContent = isLight ? '🌙' : '☀️';
      zafaToast(isLight ? 'Mode terang aktif' : 'Mode gelap aktif');
    });

    document.body.appendChild(btn);
  }

  /* =====================================================================
     2. SCROLL REVEAL ANIMATION
     ===================================================================== */
  function initScrollReveal() {
    const targets = document.querySelectorAll('main section, main figure, main form, main table');
    if (!targets.length) return;
    targets.forEach((el) => el.classList.add('zafa-reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('zafa-in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* =====================================================================
     3. NAVBAR: SHRINK ON SCROLL + ACTIVE LINK
     ===================================================================== */
  function initNavbar() {
    const header = document.querySelector('header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('zafa-scrolled', window.scrollY > 40);
      });
    }
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach((link) => {
      if (link.getAttribute('href') === currentPage) link.classList.add('zafa-active');
    });
  }

  /* =====================================================================
     4. BADGE STATUS BUKA / TUTUP (jam operasional 09.00 - 22.00 setiap hari)
     ===================================================================== */
  function initOpenBadge() {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    const badge = document.createElement('span');
    badge.className = 'zafa-status-badge';
    nav.appendChild(badge);

    function update() {
      const now = new Date();
      const jamDesimal = now.getHours() + now.getMinutes() / 60;
      const buka = jamDesimal >= 9 && jamDesimal < 22;
      badge.textContent = buka ? '🟢 Buka Sekarang' : '🔴 Tutup';
      badge.classList.toggle('zafa-closed', !buka);
    }
    update();
    setInterval(update, 60000);
  }

  /* =====================================================================
     5. TOMBOL SALIN ALAMAT
     ===================================================================== */
  function initCopyAddress() {
    const address = document.querySelector('footer address');
    if (!address) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'zafa-copy-btn';
    btn.textContent = '📋 Salin Alamat';
    address.appendChild(btn);

    btn.addEventListener('click', () => {
      const text = address.querySelector('p')?.textContent.trim() || address.textContent.trim();
      navigator.clipboard.writeText(text)
        .then(() => zafaToast('Alamat berhasil disalin!'))
        .catch(() => zafaToast('Gagal menyalin alamat', 'error'));
    });
  }

  /* =====================================================================
     6. TOMBOL WHATSAPP MENGAMBANG
     ===================================================================== */
  function initWhatsAppFloat() {
    const btn = document.createElement('a');
    btn.className = 'zafa-wa-btn';
    btn.href = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent('Halo Cafe Zafa, saya mau tanya-tanya nih..')}`;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.setAttribute('aria-label', 'Chat WhatsApp Cafe Zafa');
    btn.textContent = '💬';
    document.body.appendChild(btn);
  }

  /* =====================================================================
     7. TOAST NOTIFICATION
     ===================================================================== */
  let toastWrap = null;
  function zafaToast(message, type = 'success') {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'zafa-toast-wrap';
      document.body.appendChild(toastWrap);
    }
    const toast = document.createElement('div');
    toast.className = 'zafa-toast' + (type === 'error' ? ' zafa-error' : '');
    toast.textContent = message;
    toastWrap.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('zafa-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3200);
  }
  window.zafaToast = zafaToast;

  /* =====================================================================
     8. KALKULATOR ESTIMASI PESANAN (di dalam form reservasi)
     ===================================================================== */
  const MENU_ITEMS = [
    { nama: 'Kopi Susu Gula Aren', harga: 18000 },
    { nama: 'Cappuccino', harga: 20000 },
    { nama: 'Americano', harga: 15000 },
    { nama: 'Nasi Goreng Zafa', harga: 22000 },
    { nama: 'Kentang Goreng', harga: 15000 },
    { nama: 'Croffle', harga: 18000 },
  ];

  function initPriceCalculator() {
    const form = document.querySelector('main form');
    if (!form) return;

    const box = document.createElement('fieldset');
    box.className = 'zafa-calc-box';
    box.innerHTML =
      '<legend>Estimasi Pesanan (opsional)</legend>' +
      MENU_ITEMS.map((item, i) => `
        <div class="zafa-calc-row">
          <label for="zafa-qty-${i}">${item.nama} <span class="zafa-calc-price">(Rp ${item.harga.toLocaleString('id-ID')})</span></label>
          <input type="number" min="0" value="0" data-nama="${item.nama}" data-price="${item.harga}" class="zafa-calc-qty" id="zafa-qty-${i}">
        </div>
      `).join('') +
      '<p class="zafa-calc-total">Total Estimasi: <strong id="zafa-calc-total">Rp 0</strong></p>';

    const submitP = Array.from(form.querySelectorAll('p')).find((p) => p.querySelector('button[type="submit"]'));
    if (submitP) submitP.insertAdjacentElement('beforebegin', box);
    else form.appendChild(box);

    const totalEl = box.querySelector('#zafa-calc-total');
    function recalc() {
      let total = 0;
      box.querySelectorAll('.zafa-calc-qty').forEach((inp) => {
        total += (parseInt(inp.value, 10) || 0) * parseInt(inp.dataset.price, 10);
      });
      totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
    box.addEventListener('input', recalc);
    recalc();
  }

  /* =====================================================================
     9. FORM RESERVASI -> KIRIM VIA WHATSAPP (termasuk estimasi pesanan)
     ===================================================================== */
  function initReservationForm() {
    const form = document.querySelector('main form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const nama = form.querySelector('#nama')?.value.trim();
      const email = form.querySelector('#email')?.value.trim();
      const telepon = form.querySelector('#telepon')?.value.trim();
      const tanggal = form.querySelector('#tanggal')?.value;
      const jam = form.querySelector('#jam')?.value;
      const area = form.querySelector('input[name="area"]:checked');
      const catatan = form.querySelector('#catatan')?.value.trim();
      const areaLabel = area ? form.querySelector(`label[for="${area.id}"]`)?.textContent.trim() : '-';

      const orderLines = [];
      let total = 0;
      form.querySelectorAll('.zafa-calc-qty').forEach((inp) => {
        const qty = parseInt(inp.value, 10) || 0;
        if (qty > 0) {
          const harga = parseInt(inp.dataset.price, 10);
          orderLines.push(`${qty}x ${inp.dataset.nama} - Rp ${(qty * harga).toLocaleString('id-ID')}`);
          total += qty * harga;
        }
      });

      let pesan =
        `Halo Cafe Zafa, saya ingin reservasi meja:\n\n` +
        `Nama: ${nama}\n` +
        `Email: ${email}\n` +
        `Telepon: ${telepon}\n` +
        `Tanggal: ${tanggal}\n` +
        `Jam: ${jam}\n` +
        `Area: ${areaLabel}\n` +
        `Catatan: ${catatan || '-'}`;

      if (orderLines.length) {
        pesan += `\n\nEstimasi Pesanan:\n${orderLines.join('\n')}\nTotal: Rp ${total.toLocaleString('id-ID')}`;
      }

      const waUrl = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;

      zafaToast('Reservasi diproses, mengarahkan ke WhatsApp...');
      setTimeout(() => {
        window.open(waUrl, '_blank');
        form.reset();
      }, 900);
    });
  }

  /* =====================================================================
     10. LIGHTBOX GALERI FOTO
     ===================================================================== */
  function initLightbox() {
    const images = document.querySelectorAll('main img:not(.zafa-qr-img)');
    if (!images.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'zafa-lightbox-overlay';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'zafa-lightbox-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Tutup');
    const imgEl = document.createElement('img');
    overlay.appendChild(closeBtn);
    overlay.appendChild(imgEl);
    document.body.appendChild(overlay);

    function closeLightbox() { overlay.classList.remove('zafa-open'); }

    images.forEach((img) => {
      img.addEventListener('click', () => {
        imgEl.src = img.src;
        imgEl.alt = img.alt;
        overlay.classList.add('zafa-open');
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* =====================================================================
     11. FILTER MENU (khusus menu.html)
     ===================================================================== */
  function initMenuFilter() {
    const sections = document.querySelectorAll('main > section');
    if (!sections.length) return;

    sections.forEach((section) => {
      const h3s = Array.from(section.querySelectorAll('h3'));
      if (!h3s.length) return;

      const groups = h3s.map((h3) => {
        let table = h3.nextElementSibling;
        while (table && table.tagName !== 'TABLE') table = table.nextElementSibling;
        return { h3, table };
      }).filter((g) => g.table);
      if (!groups.length) return;

      const filterBar = document.createElement('div');
      filterBar.className = 'zafa-filter-bar';

      const allBtn = document.createElement('button');
      allBtn.className = 'zafa-filter-btn zafa-active';
      allBtn.type = 'button';
      allBtn.textContent = 'Semua';
      filterBar.appendChild(allBtn);

      groups.forEach((group) => {
        const btn = document.createElement('button');
        btn.className = 'zafa-filter-btn';
        btn.type = 'button';
        btn.textContent = group.h3.textContent.trim();
        filterBar.appendChild(btn);

        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.zafa-filter-btn').forEach((b) => b.classList.remove('zafa-active'));
          btn.classList.add('zafa-active');
          groups.forEach((g) => {
            const show = g === group;
            g.h3.classList.toggle('zafa-hidden-group', !show);
            g.table.classList.toggle('zafa-hidden-group', !show);
          });
        });
      });

      allBtn.addEventListener('click', () => {
        filterBar.querySelectorAll('.zafa-filter-btn').forEach((b) => b.classList.remove('zafa-active'));
        allBtn.classList.add('zafa-active');
        groups.forEach((g) => {
          g.h3.classList.remove('zafa-hidden-group');
          g.table.classList.remove('zafa-hidden-group');
        });
      });

      const h2 = section.querySelector('h2');
      if (h2) h2.insertAdjacentElement('afterend', filterBar);
      else section.insertBefore(filterBar, section.firstChild);
    });
  }

  /* =====================================================================
     12. SEARCH MENU (khusus menu.html)
     ===================================================================== */
  function initMenuSearch() {
    const tables = document.querySelectorAll('main table');
    if (!tables.length) return;

    const main = document.querySelector('main');
    const h1 = main.querySelector('h1');

    const wrap = document.createElement('div');
    wrap.className = 'zafa-search-wrap';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '🔍 Cari menu (contoh: kopi, nasi, croffle)...';
    input.className = 'zafa-search-input';
    wrap.appendChild(input);

    if (h1) h1.insertAdjacentElement('afterend', wrap);
    else main.insertBefore(wrap, main.firstChild);

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();

      if (q) {
        // Reset filter kategori ke "Semua" dulu, biar tabel yang lagi
        // disembunyikan filter gak ikut nyembunyiin hasil pencarian
        document.querySelectorAll('main h3.zafa-hidden-group, main table.zafa-hidden-group')
          .forEach((el) => el.classList.remove('zafa-hidden-group'));
        document.querySelectorAll('.zafa-filter-bar').forEach((bar) => {
          bar.querySelectorAll('.zafa-filter-btn').forEach((b) => b.classList.remove('zafa-active'));
          bar.querySelector('.zafa-filter-btn')?.classList.add('zafa-active'); // tombol "Semua" selalu yang pertama
        });
      }

      document.querySelectorAll('main table tbody tr').forEach((row) => {
        const nama = row.querySelector('td')?.textContent.toLowerCase() || '';
        row.classList.toggle('zafa-hidden-group', Boolean(q) && !nama.includes(q));
      });
    });
  }

  /* =====================================================================
     13. TESTIMONI PELANGGAN (khusus index.html)
     ===================================================================== */
  function initTestimonials() {
    const banner = document.querySelector('img[alt="Banner Cafe Zafa"]');
    if (!banner) return;

    const testimonials = [
      { nama: 'Rina A.', text: 'Tempatnya nyaman banget buat kerja, wifi kenceng dan colokan banyak!', rating: 5 },
      { nama: 'Dimas P.', text: 'Kopi susu gula arennya juara, harga juga bersahabat.', rating: 5 },
      { nama: 'Salsa F.', text: 'Suka banget suasana outdoornya, cocok buat nongkrong sore-sore.', rating: 4 },
    ];

    const section = document.createElement('section');
    section.innerHTML =
      '<h2>Kata Mereka Tentang Zafa</h2>' +
      '<div class="zafa-testimonial-grid">' +
      testimonials.map((t) => `
        <div class="zafa-testimonial-card">
          <p class="zafa-testimonial-text">"${t.text}"</p>
          <p class="zafa-testimonial-name">${t.nama}</p>
          <p class="zafa-testimonial-stars">${'⭐'.repeat(t.rating)}</p>
        </div>
      `).join('') +
      '</div>';

    const main = document.querySelector('main');
    const lastSection = main.querySelector('section:last-of-type');
    if (lastSection) lastSection.insertAdjacentElement('afterend', section);
    else main.appendChild(section);
  }

  /* =====================================================================
     14. QR CODE MENU (khusus menu.html)
     ===================================================================== */
  function initQrCode() {
    const isMenuPage = /menu\.html$/.test(location.pathname);
    if (!isMenuPage) return;

    const main = document.querySelector('main');
    const h1 = main.querySelector('h1');
    if (!h1) return;

    const wrap = document.createElement('div');
    wrap.className = 'zafa-qr-wrap';
    const url = window.location.href;
    wrap.innerHTML =
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}" alt="QR Code Menu Cafe Zafa" class="zafa-qr-img">` +
      `<p class="zafa-qr-caption">Scan buat buka menu ini di HP kamu</p>`;

    h1.insertAdjacentElement('afterend', wrap);
  }

  /* =====================================================================
     15. COUNTDOWN PROMO (khusus index.html)
     ===================================================================== */
  function initCountdownPromo() {
    const banner = document.querySelector('img[alt="Banner Cafe Zafa"]');
    if (!banner) return;

    /* GANTI tanggal & teks promo sesuai yang berlaku di cafe */
    const PROMO_END = new Date('2026-07-30T01:00:00');
    const PROMO_TEXT = 'Diskon 100% UNTUK SEMUA YANG SUPPORT HUBUNGAN AZIZ DAN ZACHRA!';
    if (PROMO_END.getTime() < Date.now()) return;

    const box = document.createElement('div');
    box.className = 'zafa-countdown-box';
    box.innerHTML =
      `<p class="zafa-countdown-label">🔥 ${PROMO_TEXT}</p>` +
      `<div class="zafa-countdown-timer">--</div>`;
    banner.insertAdjacentElement('afterend', box);

    const timerEl = box.querySelector('.zafa-countdown-timer');
    function update() {
      const diff = PROMO_END.getTime() - Date.now();
      if (diff <= 0) { box.remove(); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      timerEl.textContent = `${d}h ${h}j ${m}m ${s}d`;
    }
    update();
    setInterval(update, 1000);
  }

  /* =====================================================================
     16. PARALLAX BANNER (khusus index.html)
     ===================================================================== */
  function initParallaxBanner() {
    const banner = document.querySelector('img[alt="Banner Cafe Zafa"]');
    if (!banner) return;
    window.addEventListener('scroll', () => {
      banner.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    });
  }

  /* =====================================================================
     17. TOMBOL BACK TO TOP
     ===================================================================== */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'zafa-top-btn';
    btn.type = 'button';
    btn.innerHTML = '&uarr;';
    btn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('zafa-show', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
/* =====================================================================
     18. FLOATING CART & QUICK ORDER (WITH EDIT MODAL)
     ===================================================================== */
  function initFloatingCart() {
    let cart = JSON.parse(localStorage.getItem('zafa-cart')) || [];

    function saveAndRender() {
      localStorage.setItem('zafa-cart', JSON.stringify(cart));
      updateCartWidget();
      renderModalItems();
    }

    const rows = document.querySelectorAll('main table tbody tr');
    if (!rows.length) return;

    // Header "Pesan" di tabel
    const tables = document.querySelectorAll('main table');
    tables.forEach((table) => {
      const headerRow = table.querySelector('thead tr');
      if (headerRow && !headerRow.querySelector('.zafa-action-header')) {
        const th = document.createElement('th');
        th.className = 'zafa-action-header';
        th.textContent = 'Pesan';
        headerRow.appendChild(th);
      }
    });

    // Pasang tombol "+ Tambah" di tabel menu
    rows.forEach((row) => {
      const namaMenu = row.children[0]?.textContent.trim();
      const hargaText = row.children[2]?.textContent.trim(); // Kolom ke-3 (Harga)
      const harga = parseInt(hargaText?.replace(/[^0-9]/g, ''), 10) || 0;

      if (!namaMenu || !harga) return;

      const actionTd = document.createElement('td');
      const btnAdd = document.createElement('button');
      btnAdd.type = 'button';
      btnAdd.className = 'zafa-copy-btn';
      btnAdd.style.cssText = 'margin:0; padding:4px 10px; font-size:0.75rem;';
      btnAdd.textContent = '+ Tambah';

      actionTd.appendChild(btnAdd);
      row.appendChild(actionTd);

      btnAdd.addEventListener('click', () => {
        const existing = cart.find((item) => item.nama === namaMenu);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ nama: namaMenu, harga: harga, qty: 1 });
        }

        saveAndRender();
        if (window.zafaToast) window.zafaToast(`${namaMenu} ditambahkan ke keranjang!`);
      });
    });

    // 1. Bar Melayang (Floating Bar)
    const cartBar = document.createElement('div');
    cartBar.className = 'zafa-cart-bar';
    cartBar.style.cssText = `
      position: fixed;
      bottom: 88px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(25, 13, 20, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      padding: 10px 20px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 15px;
      z-index: 2500;
      box-shadow: 0 8px 25px rgba(0,0,0,0.5);
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
      cursor: pointer;
    `;

    cartBar.innerHTML = `
      <span id="zafa-cart-info" style="font-size:0.9rem; font-weight:600; color:var(--text-main);">🛒 0 Item | Rp 0</span>
      <button id="zafa-cart-open" type="button" class="zafa-copy-btn" style="margin:0; background:var(--primary); color:#fff; border:none;">Lihat Keranjang</button>
    `;
    document.body.appendChild(cartBar);

    // 2. Bikin Pop-up / Modal Keranjang
    const modal = document.createElement('div');
    modal.className = 'zafa-cart-modal';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(10, 5, 8, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4500;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      padding: 20px;
    `;

    modal.innerHTML = `
      <div style="background: rgba(25, 13, 20, 0.98); border: 1px solid var(--glass-border); width: min(100%, 420px); border-radius: 18px; padding: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.6); position: relative;">
        <button id="zafa-modal-close" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer;">✕</button>
        <h3 style="margin-top: 0; color: var(--primary); font-size: 1.2rem; margin-bottom: 15px;">🛒 Keranjang Pesanan</h3>
        <div id="zafa-cart-items" style="max-height: 250px; overflow-y: auto; margin-bottom: 15px; display: flex; flex-direction: column; gap: 10px;"></div>
        <div style="border-top: 1px dashed var(--glass-border); padding-top: 12px; display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 15px;">
          <span>Total:</span>
          <span id="zafa-modal-total" style="color: var(--accent-light);">Rp 0</span>
        </div>
        <button id="zafa-modal-checkout" class="zafa-copy-btn" style="width: 100%; padding: 12px; background: var(--primary); color: #fff; border: none; font-size: 0.95rem; text-align: center;">Kirim Pesanan via WhatsApp 💬</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Buka & Tutup Modal
    function openModal() { modal.style.opacity = '1'; modal.style.pointerEvents = 'auto'; }
    function closeModal() { modal.style.opacity = '0'; modal.style.pointerEvents = 'none'; }

    cartBar.addEventListener('click', openModal);
    modal.querySelector('#zafa-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Render daftar item di dalam Modal
    function renderModalItems() {
      const container = modal.querySelector('#zafa-cart-items');
      const modalTotal = modal.querySelector('#zafa-modal-total');
      container.innerHTML = '';

      if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-sub); font-size: 0.85rem;">Keranjang kamu masih kosong.</p>';
        modalTotal.textContent = 'Rp 0';
        closeModal();
        return;
      }

      let total = 0;
      cart.forEach((item, index) => {
        const subtotal = item.qty * item.harga;
        total += subtotal;

        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; background: rgba(255,117,160,0.05); padding: 8px 12px; border-radius: 10px; border: 1px solid var(--glass-border);';
        row.innerHTML = `
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.88rem;">${item.nama}</div>
            <div style="font-size: 0.75rem; color: var(--text-sub);">Rp ${subtotal.toLocaleString('id-ID')}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="zafa-btn-minus" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-weight: bold;">-</button>
            <span style="font-size: 0.85rem; font-weight: bold; min-width: 15px; text-align: center;">${item.qty}</span>
            <button class="zafa-btn-plus" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-weight: bold;">+</button>
            <button class="zafa-btn-del" style="background: rgba(255,77,109,0.2); border: none; color: #ff4d6d; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; margin-left: 5px;">🗑️</button>
          </div>
        `;

        // Event Tombol Kurang (-)
        row.querySelector('.zafa-btn-minus').addEventListener('click', () => {
          if (item.qty > 1) {
            item.qty -= 1;
          } else {
            cart.splice(index, 1);
          }
          saveAndRender();
        });

        // Event Tombol Tambah (+)
        row.querySelector('.zafa-btn-plus').addEventListener('click', () => {
          item.qty += 1;
          saveAndRender();
        });

        // Event Tombol Hapus (🗑️)
        row.querySelector('.zafa-btn-del').addEventListener('click', () => {
          cart.splice(index, 1);
          saveAndRender();
        });

        container.appendChild(row);
      });

      modalTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    function updateCartWidget() {
      const totalItem = cart.reduce((sum, item) => sum + item.qty, 0);
      const totalHarga = cart.reduce((sum, item) => sum + (item.qty * item.harga), 0);

      const infoEl = cartBar.querySelector('#zafa-cart-info');
      if (infoEl) {
        infoEl.textContent = `🛒 ${totalItem} Item | Rp ${totalHarga.toLocaleString('id-ID')}`;
      }

      if (totalItem > 0) {
        cartBar.style.opacity = '1';
        cartBar.style.pointerEvents = 'auto';
      } else {
        cartBar.style.opacity = '0';
        cartBar.style.pointerEvents = 'none';
      }
    }

    // Checkout via WA
    modal.querySelector('#zafa-modal-checkout').addEventListener('click', () => {
      if (!cart.length) return;
      let pesan = `Halo Cafe Zafa, saya mau pesan via web:\n\n`;
      let total = 0;

      cart.forEach((item) => {
        const subtotal = item.qty * item.harga;
        pesan += `• ${item.qty}x ${item.nama} - Rp ${subtotal.toLocaleString('id-ID')}\n`;
        total += subtotal;
      });

      pesan += `\nTotal Pembayaran: Rp ${total.toLocaleString('id-ID')}`;
      const waUrl = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;
      window.open(waUrl, '_blank');
    });

    updateCartWidget();
    renderModalItems();
  }
  /* =====================================================================
     INIT SEMUA FITUR
     ===================================================================== */
  initLoadingScreen();

  function init() {
    initThemeToggle();
    initNavbar();
    initOpenBadge();
    initCopyAddress();
    initWhatsAppFloat();
    initTestimonials();
    initQrCode();
    initCountdownPromo();
    initPriceCalculator();
    initReservationForm();
    initMenuFilter();
    initMenuSearch();
    initLightbox();
    initParallaxBanner();
    initBackToTop();
    initFloatingCart();
    initScrollReveal(); // paling akhir biar nangkep elemen baru yang ditambahin di atas
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();