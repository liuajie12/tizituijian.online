/**
 * 梯子推荐指南 - Main JavaScript
 * Features: 3-column sync, TOC active scrollspy, Reading progress, Coupon copy, Filter tags, Search modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressAndTOC();
  initSidebarDirSearch();
  initCopyCoupons();
  initFaqAccordion();
  initFilterPills();
  initBackToTop();
  initSearchModal();
  initMobileMenu();
});

// 1. Reading Progress & Outline (TOC) Active Scrollspy
function initReadingProgressAndTOC() {
  const progressBar = document.getElementById('readingProgress');
  const percentText = document.getElementById('readingPercent');
  const tocList = document.getElementById('tocList');
  const contentBody = document.querySelector('.content-body');

  if (!contentBody || !tocList) return;

  // Auto-build TOC if empty or check existing
  const reviewItems = contentBody.querySelectorAll('.airport-review-item, h2');
  if (reviewItems.length > 0 && tocList.children.length === 0) {
    reviewItems.forEach((el, index) => {
      let targetId = el.id;
      let text = '';

      if (el.classList.contains('airport-review-item')) {
        const h3 = el.querySelector('h3');
        text = h3 ? h3.childNodes[0].textContent.trim() : `评测 #${index + 1}`;
      } else if (el.tagName === 'H2') {
        if (!el.id) el.id = 'section-' + (index + 1);
        targetId = el.id;
        text = el.textContent.replace(/^#+\s*/, '').trim();
      }

      if (targetId && text) {
        const li = document.createElement('li');
        li.className = 'toc-item';
        const a = document.createElement('a');
        a.href = '#' + targetId;
        a.textContent = text;
        li.appendChild(a);
        tocList.appendChild(li);
      }
    });
  }

  const tocLinks = tocList.querySelectorAll('.toc-item a');
  const dirLinks = document.querySelectorAll('.nav-directory-list .nav-dir-item');

  function updateScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0;

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
    if (percentText) {
      percentText.textContent = progress + '%';
    }

    // Scrollspy for active heading or airport item
    let activeId = '';
    reviewItems.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top <= 160) {
        activeId = el.id;
      }
    });

    tocLinks.forEach(link => {
      const parent = link.closest('.toc-item');
      if (link.getAttribute('href') === '#' + activeId) {
        parent.classList.add('active');
      } else {
        parent.classList.remove('active');
      }
    });

    dirLinks.forEach(item => {
      const a = item.querySelector('a');
      if (a && a.getAttribute('href') === '#' + activeId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

// 1.1 Sidebar Directory Quick Filter
function initSidebarDirSearch() {
  const searchInput = document.getElementById('sidebarDirSearch');
  const dirItems = document.querySelectorAll('#reviewDirList .nav-dir-item, .nav-directory-list .nav-dir-item');

  if (!searchInput || dirItems.length === 0) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    dirItems.forEach(item => {
      const text = (item.getAttribute('data-search') || item.textContent).toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

// 2. One-click Coupon Code Copy
function initCopyCoupons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = btn.getAttribute('data-code') || btn.parentElement.querySelector('.coupon-code')?.textContent.trim();
      if (!code) return;

      navigator.clipboard.writeText(code).then(() => {
        showToast(`已复制优惠码: ${code}`);
        const originalText = btn.textContent;
        btn.textContent = '✓ 已复制';
        btn.style.color = '#2e9e6b';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = '';
        }, 2000);
      }).catch(() => {
        showToast(`复制失败，请手动复制: ${code}`);
      });
    });
  });
}

// Global Toast message
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// 3. FAQ Accordion Toggle
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      item.classList.toggle('open');
    });
  });
}

// 4. Matrix Filter Pills
function initFilterPills() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.airport-card');

  if (filterPills.length === 0 || cards.length === 0) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterVal = pill.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 5. Back to top button
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 6. Quick Search Modal (Ctrl + K)
function initSearchModal() {
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  if (!searchBtn || !searchModal) return;

  function openSearch() {
    searchModal.classList.add('open');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 50);
    }
  }

  function closeSearch() {
    searchModal.classList.remove('open');
  }

  searchBtn.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });

  // Client-side quick filter in modal
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const results = document.querySelectorAll('.search-result-item');
      results.forEach(res => {
        const text = res.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          res.style.display = 'block';
        } else {
          res.style.display = 'none';
        }
      });
    });
  }
}

// 7. Mobile Navigation Drawer
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNavDrawer');
  if (!mobileBtn || !mobileNav) return;

  mobileBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}
