/* =====================================================================
 * codeforge.js
 * Lightweight UI enhancements. Vanilla JS, no dependencies.
 *
 * Provides:
 *   - Mobile sidebar drawer
 *   - Theme toggle (dark / light) with localStorage persistence
 *   - Toast queue           (window.cfToast(msg, type))
 *   - Command palette stub  (Ctrl+K / Cmd+K opens search)
 *   - Copy-to-clipboard     [data-cf-copy="<value>"]
 *   - Auto-dismiss flash    [data-cf-flash]
 * ===================================================================== */
(function () {
  'use strict';

  /* ---------------- Theme ---------------- */
  var THEME_KEY = 'cf-theme';
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function setStoredTheme(t) {
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* ignore */ }
  }
  var stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    setStoredTheme(next);
  }

  /* ---------------- Sidebar drawer ---------------- */
  function bindDrawer() {
    var sidebar = document.querySelector('.cf-sidebar');
    var trigger = document.querySelector('[data-cf-drawer-toggle]');
    if (!sidebar || !trigger) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'cf-drawer-backdrop';
    document.body.appendChild(backdrop);

    function open() {
      sidebar.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.classList.add('cf-drawer-open');
    }
    function close() {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.classList.remove('cf-drawer-open');
    }
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar.classList.contains('is-open') ? close() : open();
    });
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) close();
    });
  }

  /* ---------------- Toasts ---------------- */
  function ensureToastStack() {
    var stack = document.querySelector('.cf-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'cf-toast-stack';
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    return stack;
  }
  function cfToast(message, type, opts) {
    opts = opts || {};
    var duration = typeof opts.duration === 'number' ? opts.duration : 3500;
    var stack = ensureToastStack();
    var t = document.createElement('div');
    t.className = 'cf-toast' + (type ? ' cf-toast--' + type : '');
    var body = document.createElement('div');
    body.textContent = message;
    var close = document.createElement('button');
    close.className = 'cf-toast__close';
    close.setAttribute('aria-label', 'Dismiss');
    close.textContent = '\u2715';
    close.addEventListener('click', dismiss);
    t.appendChild(body);
    t.appendChild(close);
    stack.appendChild(t);
    var timer = setTimeout(dismiss, duration);
    function dismiss() {
      clearTimeout(timer);
      t.style.opacity = '0';
      t.style.transform = 'translateX(8px)';
      setTimeout(function () { t.parentNode && t.parentNode.removeChild(t); }, 180);
    }
  }
  window.cfToast = cfToast;

  /* ---------------- Copy to clipboard ---------------- */
  function bindCopy() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cf-copy]');
      if (!t) return;
      e.preventDefault();
      var value = t.getAttribute('data-cf-copy') || t.textContent.trim();
      var ok = function () { cfToast('Copied to clipboard', 'success', { duration: 2000 }); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(ok).catch(function () {
          cfToast('Copy failed', 'error');
        });
      } else {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); ok(); } catch (err) { cfToast('Copy failed', 'error'); }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------------- Auto-dismiss flash messages ---------------- */
  function bindFlash() {
    document.querySelectorAll('[data-cf-flash]').forEach(function (el) {
      var d = parseInt(el.getAttribute('data-cf-flash-duration') || '5000', 10);
      setTimeout(function () {
        el.style.transition = 'opacity 240ms ease, transform 240ms ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-4px)';
        setTimeout(function () { el.parentNode && el.parentNode.removeChild(el); }, 280);
      }, d);
    });
  }

  /* ---------------- Theme toggle ---------------- */
  function bindThemeToggle() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cf-theme-toggle]');
      if (!t) return;
      e.preventDefault();
      toggleTheme();
    });
  }

  /* ---------------- Command palette stub ---------------- */
  function bindCmdPalette() {
    document.addEventListener('keydown', function (e) {
      var meta = e.ctrlKey || e.metaKey;
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        var search = document.querySelector('.cf-topbar__search input, [data-cf-search]');
        if (search) { search.focus(); search.select && search.select(); return; }
      }
    });
  }

  /* ---------------- Boot ---------------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    bindDrawer();
    bindCopy();
    bindFlash();
    bindThemeToggle();
    bindCmdPalette();
  });
})();
