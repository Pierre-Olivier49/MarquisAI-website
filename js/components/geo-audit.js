/**
 * GEO Audit Tool — Frontend (Production)
 *
 * Sends only a URL and language to the Netlify function.
 * All page fetching and AI analysis happens server-side.
 *
 * Client-side protections:
 *   - 60-second cooldown between audits
 *   - 3 audits per session max
 *   - Input validation before any request
 */

import { getCurrentLang } from '../i18n.js';
import { bindPageLinks } from '../router.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_ENDPOINT = '/.netlify/functions/geo-audit';
const COOLDOWN_MS = 60_000;           // 1 minute between audits
const MAX_PER_SESSION = 3;
const URL_REGEX = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}/;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let auditsThisSession = 0;
let lastAuditTime = 0;

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
export function initGeoAudit() {
  const btn = document.getElementById('auditBtn');
  const urlInput = document.getElementById('auditUrl');

  if (!btn || !urlInput) return;

  btn.addEventListener('click', () => runAudit(urlInput, btn));

  // Enter key in the input
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runAudit(urlInput, btn);
    }
  });
}

// ---------------------------------------------------------------------------
// Main flow
// ---------------------------------------------------------------------------
async function runAudit(urlInput, btn) {
  const url = urlInput.value.trim();
  const lang = getCurrentLang();
  const loading = document.getElementById('auditLoading');
  const results = document.getElementById('auditResults');

  // --- Client-side validation ---

  // URL format
  if (!url || !URL_REGEX.test(url)) {
    showInputError(urlInput, lang === 'fr'
      ? 'Entrez une URL valide (ex: https://www.votresite.com)'
      : 'Enter a valid URL (e.g. https://www.yoursite.com)');
    return;
  }

  // Session limit
  if (auditsThisSession >= MAX_PER_SESSION) {
    showInputError(urlInput, lang === 'fr'
      ? 'Limite atteinte. Contactez-nous pour un audit approfondi.'
      : 'Limit reached. Contact us for an in-depth audit.');
    return;
  }

  // Cooldown
  const elapsed = Date.now() - lastAuditTime;
  if (lastAuditTime && elapsed < COOLDOWN_MS) {
    const secondsLeft = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
    showInputError(urlInput, lang === 'fr'
      ? `Veuillez patienter ${secondsLeft}s avant le prochain audit.`
      : `Please wait ${secondsLeft}s before the next audit.`);
    return;
  }

  // --- Run audit ---
  loading.classList.add('visible');
  results.classList.remove('visible');
  results.innerHTML = '';
  btn.disabled = true;
  btn.style.opacity = '0.5';

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, lang }),
    });

    if (response.status === 429) {
      throw new UserError(lang === 'fr'
        ? 'Trop de requêtes. Réessayez dans une minute.'
        : 'Too many requests. Try again in a minute.');
    }

    if (response.status === 403) {
      throw new UserError(lang === 'fr'
        ? 'Requête non autorisée.'
        : 'Request not authorized.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${response.status}`);
    }

    const audit = await response.json();
    renderResults(audit, lang, results);

    // Track usage
    auditsThisSession++;
    lastAuditTime = Date.now();

  } catch (err) {
    console.error('GEO Audit error:', err);
    results.innerHTML = buildErrorHtml(
      lang,
      err instanceof UserError ? err.message : null
    );
    results.classList.add('visible');
  } finally {
    loading.classList.remove('visible');
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function renderResults(audit, lang, container) {
  const circumference = 2 * Math.PI * 55;
  const offset = circumference - (audit.score / 100) * circumference;
  const scoreColor = audit.score >= 70 ? '#4ade80'
    : audit.score >= 40 ? '#facc15'
    : '#f87171';

  let html = `
    <div class="audit-score-ring">
      <svg viewBox="0 0 120 120">
        <circle class="bg" cx="60" cy="60" r="55"/>
        <circle class="fg" cx="60" cy="60" r="55"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                style="stroke:${scoreColor}"/>
      </svg>
      <div class="audit-score-num">${audit.score}<small>/100</small></div>
    </div>`;

  // Category cards
  for (const cat of audit.categories) {
    const cls = cat.score >= 70 ? 'score-good'
      : cat.score >= 40 ? 'score-ok'
      : 'score-bad';
    html += `
      <div class="audit-category">
        <h4>${escapeHtml(cat.name)}
          <span class="audit-category-score ${cls}">${cat.score}/100</span>
        </h4>
        <p>${escapeHtml(cat.analysis)}</p>
      </div>`;
  }

  // Summary
  html += `
    <div class="audit-category" style="border-color: var(--accent);">
      <h4>${lang === 'fr' ? 'Résumé' : 'Summary'}</h4>
      <p>${escapeHtml(audit.summary)}</p>
    </div>`;

  // Recommendations
  html += `<div class="audit-category">
    <h4>${lang === 'fr' ? 'Recommandations prioritaires' : 'Top Recommendations'}</h4>`;
  audit.top_recommendations.forEach((rec, i) => {
    html += `<p style="margin-bottom: 0.75rem;">${i + 1}. ${escapeHtml(rec)}</p>`;
  });
  html += `</div>`;

  // Remaining audits
  const remaining = MAX_PER_SESSION - auditsThisSession - 1;
  if (remaining >= 0) {
    html += `<p style="text-align: center; color: rgba(255,255,255,0.3); font-size: 0.8rem; margin-top: 1rem;">
      ${lang === 'fr'
        ? `${remaining} audit${remaining !== 1 ? 's' : ''} gratuit${remaining !== 1 ? 's' : ''} restant${remaining !== 1 ? 's' : ''}`
        : `${remaining} free audit${remaining !== 1 ? 's' : ''} remaining`}
    </p>`;
  }

  // CTA
  html += `
    <div style="text-align: center; margin-top: 2rem;">
      <a href="#" data-page="contact" class="btn btn-primary" style="display: inline-flex;">
        ${lang === 'fr' ? 'Obtenir un audit approfondi' : 'Get an in-depth audit'}
      </a>
    </div>`;

  container.innerHTML = html;
  container.classList.add('visible');

  // Re-bind [data-page] links
  bindPageLinks(container);
}

function buildErrorHtml(lang, customMsg) {
  const title = lang === 'fr' ? "Erreur lors de l'analyse" : 'Analysis error';
  const msg = customMsg || (lang === 'fr'
    ? "Impossible d'analyser ce site. Vérifiez l'URL et réessayez, ou contactez-nous pour un audit manuel."
    : 'Unable to analyze this site. Check the URL and try again, or contact us for a manual audit.');

  return `
    <div class="audit-category">
      <h4 style="color: #f87171;">${title}</h4>
      <p>${escapeHtml(msg)}</p>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function showInputError(input, message) {
  input.style.borderColor = 'var(--error)';
  input.placeholder = message;
  input.value = '';
  input.focus();
  setTimeout(() => {
    input.style.borderColor = '';
    input.placeholder = 'https://www.votresite.com';
  }, 3000);
}

/** Prevent XSS from AI-generated content */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Custom error class for user-facing messages */
class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
  }
}