/**
 * Voice Demo
 *
 * Interactive phone-call simulation showing how the AI agent
 * handles an appointment booking conversation.
 */

import { getCurrentLang } from '../i18n.js';

const CONVERSATIONS = {
  fr: [
    { role: 'ai',   text: 'Bonjour ! Clinique Santé Plus, comment puis-je vous aider ?', delay: 1500 },
    { role: 'user', text: "Oui bonjour, j'aimerais prendre un rendez-vous avec le Dr. Tremblay.", delay: 3000 },
    { role: 'ai',   text: "Bien sûr. Le Dr. Tremblay a une disponibilité jeudi à 14h ou vendredi à 10h. Qu'est-ce qui vous convient ?", delay: 3500 },
    { role: 'user', text: "Jeudi à 14h, c'est parfait.", delay: 2000 },
    { role: 'ai',   text: "C'est noté. Rendez-vous jeudi à 14h avec Dr. Tremblay. Vous allez recevoir un SMS de confirmation sous peu. Bonne journée !", delay: 4000 },
  ],
  en: [
    { role: 'ai',   text: 'Hello! Health Plus Clinic, how can I help you?', delay: 1500 },
    { role: 'user', text: "Hi, I'd like to book an appointment with Dr. Tremblay.", delay: 3000 },
    { role: 'ai',   text: 'Of course. Dr. Tremblay is available Thursday at 2 PM or Friday at 10 AM. Which works for you?', delay: 3500 },
    { role: 'user', text: 'Thursday at 2 PM works great.', delay: 2000 },
    { role: 'ai',   text: "Got it. Appointment booked for Thursday at 2 PM with Dr. Tremblay. You'll receive a confirmation text shortly. Have a great day!", delay: 4000 },
  ],
};

let isActive = false;
let timeoutIds = [];

export function initVoiceDemo() {
  const btn = document.getElementById('voiceDemoBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (isActive) {
      endDemo();
    } else {
      startDemo();
    }
  });
}

function startDemo() {
  const btn = document.getElementById('voiceDemoBtn');
  const status = document.getElementById('voiceDemoStatus');
  const wave = document.getElementById('voiceDemoWave');
  const transcript = document.getElementById('voiceDemoTranscript');
  const lang = getCurrentLang();

  isActive = true;
  btn.className = 'voice-demo-btn voice-demo-hangup';
  btn.innerHTML = '✕';
  wave.classList.add('active');
  transcript.innerHTML = '';
  status.textContent = lang === 'fr' ? 'Appel en cours...' : 'Call in progress...';

  const convo = CONVERSATIONS[lang] || CONVERSATIONS.fr;
  let totalDelay = 500;

  convo.forEach((msg, i) => {
    const id = setTimeout(() => {
      if (!isActive) return;

      const div = document.createElement('div');
      div.className = `msg msg-${msg.role}`;
      div.textContent = msg.text;
      transcript.appendChild(div);
      transcript.scrollTop = transcript.scrollHeight;

      // Auto-end after last message
      if (i === convo.length - 1) {
        const endId = setTimeout(() => { if (isActive) endDemo(); }, 2000);
        timeoutIds.push(endId);
      }
    }, totalDelay);

    timeoutIds.push(id);
    totalDelay += msg.delay;
  });
}

function endDemo() {
  const btn = document.getElementById('voiceDemoBtn');
  const status = document.getElementById('voiceDemoStatus');
  const wave = document.getElementById('voiceDemoWave');
  const lang = getCurrentLang();

  isActive = false;
  timeoutIds.forEach(clearTimeout);
  timeoutIds = [];

  btn.className = 'voice-demo-btn voice-demo-call';
  btn.innerHTML = '📞';
  wave.classList.remove('active');
  status.textContent = lang === 'fr' ? 'Appuyez pour simuler un appel' : 'Press to simulate a call';
}