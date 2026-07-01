/**
 * FAQ Accordion
 *
 * Handles expand/collapse on .faq-question buttons.
 * Only one item open at a time within the same .faq-list.
 */

export function initFaq() {
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');
      const list = item.closest('.faq-list');

      // Close all siblings
      list.querySelectorAll('.faq-item').forEach((i) => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}