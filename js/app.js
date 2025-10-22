(() => {
  'use strict';

  // Slides
  let currentSlide = 1;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;

  // Controls
  const paginationEl = document.getElementById('pagination');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentSpan = document.getElementById('currentSlide');
  const totalSpan = document.getElementById('totalSlides');
  if (totalSpan) totalSpan.textContent = totalSlides;

  const updateControls = () => {
    if (currentSpan) currentSpan.textContent = currentSlide;
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;
    if (paginationEl) {
      paginationEl.querySelectorAll('button.dot').forEach((d, idx) => {
        const isActive = idx + 1 === currentSlide;
        d.classList.toggle('active', isActive);
        d.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }
  };

  const showSlideImmediate = (index) => {
    slides.forEach((s) => s.classList.remove('active', 'entering', 'leaving'));
    slides[index - 1].classList.add('active');
    currentSlide = index;
    updateControls();
  };

  const animateToSlide = (targetIndex) => {
    if (targetIndex === currentSlide) return;
    if (targetIndex < 1 || targetIndex > totalSlides) return;
    const currentEl = slides[currentSlide - 1];
    const targetEl = slides[targetIndex - 1];
    targetEl.classList.add('entering', 'active');
    void targetEl.offsetWidth;
    currentEl.classList.add('leaving');
    currentEl.addEventListener('transitionend', () => {
      currentEl.classList.remove('active', 'leaving');
      targetEl.classList.remove('entering');
    }, { once: true });
    currentSlide = targetIndex;
    updateControls();
  };

  const changeSlide = (n) => {
    const nextIndex = Math.min(Math.max(1, currentSlide + n), totalSlides);
    animateToSlide(nextIndex);
  };
  // inline handlers removed; navigation is wired via JS listeners

  // Theme toggle (auto/light/dark)
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const systemPrefersDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const renderToggle = (mode) => {
    if (!themeToggleBtn) return;
    let label = 'Auto';
    if (mode === 'light') label = 'Clair';
    if (mode === 'dark') label = 'Sombre';
    themeToggleBtn.textContent = label;
    themeToggleBtn.setAttribute('data-mode', mode);
    themeToggleBtn.setAttribute('aria-pressed', String(mode === 'dark'));
    themeToggleBtn.title = `Th\u00E8me: ${label}`;
  };

  const applyTheme = (mode) => {
    if (mode === 'light' || mode === 'dark') htmlEl.setAttribute('data-theme', mode);
    else htmlEl.removeAttribute('data-theme');
    renderToggle(mode);
  };

  const legacy = localStorage.getItem('theme');
  const savedMode = localStorage.getItem('themeMode');
  let initialMode = savedMode || (legacy ? legacy : 'auto');
  if (!savedMode && legacy) localStorage.setItem('themeMode', legacy);
  applyTheme(initialMode);

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  if (media && media.addEventListener) {
    media.addEventListener('change', () => {
      const mode = localStorage.getItem('themeMode') || 'auto';
      if (mode === 'auto') applyTheme('auto');
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const order = ['auto', 'light', 'dark'];
      const current = themeToggleBtn.getAttribute('data-mode') || 'auto';
      const next = order[(order.indexOf(current) + 1) % order.length];
      localStorage.setItem('themeMode', next);
      applyTheme(next);
    });
  }

  // Keyboard + buttons navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });
  if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

  // Initial state
  showSlideImmediate(currentSlide);

  // Pagination dots + tooltips
  if (paginationEl) {
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= totalSlides; i += 1) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('aria-label', `Aller \u00E0 la diapositive ${i}`);
      b.dataset.index = String(i);
      b.addEventListener('click', () => animateToSlide(i));
      frag.appendChild(b);
    }
    paginationEl.appendChild(frag);

    const tooltip = document.createElement('div');
    tooltip.id = 'dotTooltip';
    tooltip.className = 'dot-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    paginationEl.appendChild(tooltip);

    const getSlideTitle = (idx) => {
      const s = slides[idx - 1];
      if (!s) return `Diapositive ${idx}`;
      const h = s.querySelector('h2, h1, h3');
      return (h && h.textContent && h.textContent.trim()) || `Diapositive ${idx}`;
    };

    const positionTooltip = (btn) => {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    };

    const showTooltip = (btn) => {
      const idx = parseInt(btn.dataset.index || '0', 10) || 0;
      tooltip.textContent = getSlideTitle(idx);
      btn.setAttribute('aria-describedby', 'dotTooltip');
      positionTooltip(btn);
      tooltip.classList.add('show');
    };
    const hideTooltip = () => { tooltip.classList.remove('show'); };

    paginationEl.querySelectorAll('button.dot').forEach((b) => {
      b.addEventListener('mouseenter', () => showTooltip(b));
      b.addEventListener('mouseleave', hideTooltip);
      b.addEventListener('focus', () => showTooltip(b));
      b.addEventListener('blur', hideTooltip);
      b.addEventListener('mousemove', () => positionTooltip(b));
    });

    updateControls();
  }

  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
