/**
 * Mobile Menu
 *
 * Handles hamburger open/close and mobile dropdown toggle.
 */

export function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinksContainer = document.getElementById('navLinksContainer');
  const dropdownToggle = document.getElementById('dropdownToggle');
  const dropdownContainer = document.getElementById('dropdownContainer');

  hamburgerBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    hamburgerBtn.classList.toggle('open');

    if (!navLinksContainer.classList.contains('active')) {
      dropdownContainer.classList.remove('expanded');
    }
  });

  dropdownToggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      e.stopPropagation();
      dropdownContainer.classList.toggle('expanded');
    }
  });
}