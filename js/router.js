/**
 * Router — SPA page navigation
 *
 * Handles [data-page] click events, page transitions,
 * nav active states, and dark-mode toggling per page.
 *
 * Usage:
 *   import { initRouter, navigateTo } from './router.js';
 *   initRouter();
 */

const DARK_PAGES = ['home', 'about', 'privacy', 'terms'];

let currentPageId = 'home';
let nav;
let pages;

export function initRouter() {
  nav = document.getElementById('mainNav');
  pages = document.querySelectorAll('.page');

  // Set initial dark-mode
  nav.classList.add('dark-mode');

  // Bind all [data-page] triggers (including those in footer, cards, etc.)
  bindPageLinks(document);
}

/**
 * Bind click handlers on all [data-page] elements inside a root.
 * Called once for the full document, and again when dynamic content
 * (like audit results) is injected.
 */
export function bindPageLinks(root) {
  root.querySelectorAll('[data-page]').forEach((trigger) => {
    // Avoid double-binding
    if (trigger._routerBound) return;
    trigger._routerBound = true;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(trigger.getAttribute('data-page'));

      // Close mobile menu if open
      const navLinks = document.getElementById('navLinksContainer');
      const hamburger = document.getElementById('hamburgerBtn');
      const dropdown = document.getElementById('dropdownContainer');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
        dropdown.classList.remove('expanded');
      }
    });
  });
}

export function navigateTo(pageId) {
  if (pageId === currentPageId) return;
  currentPageId = pageId;

  const targetPage = document.getElementById('page-' + pageId);
  if (!targetPage) return;

  // Update nav active link
  document.querySelectorAll('.nav-links > a').forEach((l) => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-links > a[data-page="${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Dark-mode per page
  if (DARK_PAGES.includes(pageId)) {
    nav.classList.add('dark-mode');
  } else {
    nav.classList.remove('dark-mode');
  }

  // Transition pages
  const activePage = document.querySelector('.page.visible');
  if (activePage) {
    activePage.classList.remove('visible');
    setTimeout(() => {
      pages.forEach((p) => p.classList.remove('active'));
      targetPage.classList.add('active');
      void targetPage.offsetWidth; // force reflow
      targetPage.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 300);
  } else {
    pages.forEach((p) => p.classList.remove('active'));
    targetPage.classList.add('active');
    void targetPage.offsetWidth;
    targetPage.classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

export function getCurrentPage() {
  return currentPageId;
}