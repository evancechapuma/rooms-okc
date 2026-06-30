/* =============================================
   APP.JS — Global shared behavior
   Theme, nav, toasts, modal helpers
   ============================================= */

// ---- Theme ----
(function initTheme() {
  const saved = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', saved || 'light');
})();

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-toggle i').forEach(i => {
    i.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

// ---- Toast ----
let toastContainer;

function showToast(message, type = 'info', duration = 3500) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }

  const icons = {
    success: 'fa-solid fa-circle-check',
    error:   'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info:    'fa-solid fa-circle-info',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="toast__icon"><i class="${icons[type] || icons.info}"></i></div>
    <div class="toast__body"><p class="toast__msg">${message}</p></div>
    <button class="toast__close" aria-label="Dismiss notification"><i class="fa-solid fa-xmark"></i></button>
  `;

  toastContainer.appendChild(toast);

  const dismiss = () => {
    toast.classList.add('is-leaving');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('.toast__close').addEventListener('click', dismiss);
  setTimeout(dismiss, duration);
}

// ---- Modal ----
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  trapFocus(modal);
  const firstFocusable = modal.querySelector('button, [href], input, select, textarea');
  if (firstFocusable) firstFocusable.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function trapFocus(el) {
  const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  el.addEventListener('keydown', function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

// ---- Navbar ----
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  // Theme toggle
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  updateThemeIcon();

  // Hamburger / mobile drawer
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  const drawerClose = document.querySelector('.nav-drawer__close');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.add('is-open');
      drawerClose?.focus();
    });

    drawer.addEventListener('click', e => {
      if (e.target === drawer) drawer.classList.remove('is-open');
    });

    drawerClose?.addEventListener('click', () => drawer.classList.remove('is-open'));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') drawer.classList.remove('is-open');
    });
  }

  // Avatar dropdown
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('[data-dropdown-trigger]');
    if (!trigger) return;
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      dd.classList.toggle('is-open');
    });
  });

  document.addEventListener('click', () => {
    dropdowns.forEach(dd => dd.classList.remove('is-open'));
  });
}

// ---- Favourite toggle ----
function initFavButtons() {
  document.querySelectorAll('.card-listing__fav').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const saved = btn.classList.toggle('is-saved');
      btn.querySelector('i').className = saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      showToast(saved ? 'Added to favourites' : 'Removed from favourites', 'success');
    });
  });
}

// ---- Tabs ----
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    const buttons = tabsEl.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        const container = tabsEl.closest('[data-tabs-container]') || document;
        container.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.toggle('is-active', panel.id === target);
        });
      });
    });
  });
}

// ---- Modals (backdrop + esc close) ----
function initModals() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) backdrop.classList.remove('is-open');
    });
  });

  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.is-open').forEach(m => m.classList.remove('is-open'));
    }
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFavButtons();
  initTabs();
  initModals();
});
