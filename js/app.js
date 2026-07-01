/**
 * App — Entry point
 *
 * Imports all modules and initializes them on DOMContentLoaded.
 * This file should be loaded with <script type="module" src="js/app.js">.
 */

import { initI18n } from './i18n.js';
import { initRouter } from './router.js';
import { initFaq } from './components/faq.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initContactForm } from './components/form.js';
import { initVoiceDemo } from './components/voice-demo.js';
import { initGeoAudit } from './components/geo-audit.js';

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initRouter();
  initMobileMenu();
  initFaq();
  initContactForm();
  initVoiceDemo();
  initGeoAudit();
});