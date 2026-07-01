/**
 * Contact Form
 *
 * Client-side validation with inline error messages.
 * Submits via FormSubmit.co (no backend required).
 */

import { getCurrentLang } from '../i18n.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\(\)\+]{7,}$/;

/**
 * Validate a single .form-group and toggle error state.
 * @returns {boolean} whether the field is valid
 */
function validateField(group) {
  const input = group.querySelector('.form-control');
  const name = input.name;
  let valid = true;

  if (input.hasAttribute('required') && !input.value.trim()) {
    valid = false;
  } else if (name === 'courriel' && input.value.trim()) {
    valid = EMAIL_REGEX.test(input.value.trim());
  } else if (name === 'telephone' && input.value.trim()) {
    valid = PHONE_REGEX.test(input.value.trim());
  }

  group.classList.toggle('has-error', !valid);
  input.classList.toggle('error', !valid);
  return valid;
}

export function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !submitBtn) return;

  // Live validation on blur + clear-on-fix on input
  form.querySelectorAll('.form-control').forEach((input) => {
    input.addEventListener('blur', () => validateField(input.closest('.form-group')));
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group.classList.contains('has-error')) validateField(group);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    form.querySelectorAll('.form-group').forEach((group) => {
      if (!validateField(group)) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.form-group.has-error .form-control');
      if (firstError) firstError.focus();
      return;
    }

    // Disable button
    const lang = getCurrentLang();
    const originalText = submitBtn.innerText;
    submitBtn.innerText = lang === 'fr' ? 'Envoi en cours...' : 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(
        'https://formsubmit.co/ajax/pierreoliviermarquis49@gmail.com',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _subject: 'Nouveau lead — Marquis AI' }),
        }
      );

      if (!response.ok) throw new Error('Send failed');

      // Success state
      submitBtn.innerText = lang === 'fr' ? '✓ Demande envoyée' : '✓ Request sent';
      submitBtn.style.background = 'var(--success)';
      submitBtn.style.borderColor = 'var(--success)';
      submitBtn.style.opacity = '1';

      setTimeout(() => {
        resetButton(submitBtn, originalText);
        form.reset();
        form.querySelectorAll('.form-group').forEach((g) => {
          g.classList.remove('has-error');
          g.querySelector('.form-control').classList.remove('error');
        });
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      submitBtn.innerText = lang === 'fr' ? 'Erreur, réessayez' : 'Error, try again';
      submitBtn.style.background = 'var(--error)';
      submitBtn.style.borderColor = 'var(--error)';
      setTimeout(() => resetButton(submitBtn, originalText), 3000);
    }
  });
}

function resetButton(btn, text) {
  btn.innerText = text;
  btn.disabled = false;
  btn.style.background = '';
  btn.style.borderColor = '';
  btn.style.opacity = '';
  btn.style.cursor = '';
}