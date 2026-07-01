/**
 * i18n — Internationalization module
 *
 * Stores English translations (French is the HTML default).
 * Caches original FR text on init so language can be toggled losslessly.
 *
 * Usage:
 *   import { initI18n, setLanguage, getCurrentLang } from './i18n.js';
 *   initI18n();
 *   setLanguage('en');
 */

const translations = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.voice': 'AI Voice Agent',
    'nav.geo': 'GEO (AI Engines)',
    'nav.llm': 'Private LLM',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cta': 'Free demo',

    // Home — hero
    'home.tag': 'AI Studio · Montréal',
    'home.hero1': 'Your missed calls',
    'home.hero2': 'cost more than we do.',
    'home.sub': 'A voice agent that picks up when you can\'t. SEO built for AI search engines. A private ChatGPT that shares nothing. Three tools, one team in Montréal.',
    'home.cta1': 'Start a project',
    'home.cta2': 'See the products',

    // Home — products
    'home.prod_tag': 'What we do',
    'home.prod_title': 'Three problems.<br>Three solutions.',
    'home.card1_title': 'AI Voice Agent',
    'home.card1_desc': 'Picks up the phone for you, books appointments, and routes urgent calls. Also handles texts and emails.',
    'home.card2_title': 'GEO — AI Engines',
    'home.card2_desc': 'When someone asks ChatGPT "best plumber in Montréal," it\'s your name that comes up. Next-gen search optimization.',
    'home.card3_title': 'Private Secure LLM',
    'home.card3_desc': 'A private ChatGPT installed on your servers. Your team asks questions, the AI answers — and your data stays home.',
    'home.card_link': 'Learn more',

    // Home — automation
    'home.auto_tag': 'The problem',
    'home.auto_title': 'Your employees do work<br>that machines should handle.',
    'home.auto_p1': 'Answering the same phone questions. Digging through 200 files to find a contract. Waiting for a client to stumble on your website. This isn\'t strategic work — it\'s time burning.',
    'home.auto_p2': 'Our three products cover three scenarios: the voice agent takes calls while you work, GEO brings clients while you sleep, the LLM finds information in seconds instead of minutes.',
    'home.val1_title': 'No more missed calls',
    'home.val1_desc': 'The agent books appointments, answers recurring questions, and frees your receptionist for cases that need a human.',
    'home.val2_title': 'Instant search',
    'home.val2_desc': 'The private LLM finds a specific paragraph in a 300-page file in 2 seconds. No more manual digging.',
    'home.val3_title': 'Clients on autopilot',
    'home.val3_desc': 'GEO places you in AI engine responses. Clients come in without you lifting a finger.',

    // Home — trust
    'home.trust1': 'Availability',
    'home.trust2': 'Data in Canada',
    'home.trust3': 'Response time',
    'home.trust4': 'Lines of code to write',

    // About
    'about.tag': 'About',
    'about.title': 'We build tools<br>that disappear.',
    'about.desc': 'Marquis AI is an artificial intelligence studio in Montréal. We work with SMBs, clinics, law firms, and restaurants. Our job: install systems that work silently, without your clients noticing.',
    'about.cta': 'Contact us',
    'about.mission_tag': 'Our approach',
    'about.mission_title': 'If it doesn\'t solve a real problem,<br>we don\'t deploy it.',
    'about.mission_p1': 'We don\'t sell technology to impress. We sit with you for a day, observe how your business operates, and identify tasks that waste time for no reason. Then we propose a solution — and it\'s often simpler than what you imagined.',
    'about.mission_p2': 'We stay after installation. An AI system evolves with your business: we adjust it, update it, respond when things break. No hidden fees, no three-year lock-in.',
    'about.v1_title': 'Measurable results',
    'about.v1_desc': 'We don\'t deploy anything we can\'t measure. Every system has clear metrics from month one.',
    'about.v2_title': 'Data sovereignty',
    'about.v2_desc': 'Your data stays with you. We don\'t resell it or host it abroad. Compliant with Quebec\'s Law 25.',
    'about.v3_title': 'Built for SMBs',
    'about.v3_desc': 'Our pricing and processes are designed for teams of 5 to 200 people, not multinationals.',
    'about.approach_title': 'How we work',
    'about.approach_desc': 'We start with a day of observation at your business. We note bottlenecks, repetitive tasks, missed calls, searches that take too long. Then we propose a clear plan with a fixed budget and realistic timeline.',
    'about.why_mtl_title': 'Why Montréal',
    'about.why_mtl_desc': 'Montréal is a global AI research hub. We recruit top local talent and deploy cutting-edge technology adapted to the Quebec market — in French, in English, and in compliance with local laws.',
    'about.principles_title': 'Our commitments',
    'about.p1_t': 'Listen first',
    'about.p1_d': 'A day in your operations before any proposal.',
    'about.p2_t': 'Fast delivery',
    'about.p2_d': 'Weeks, not months. Your operations don\'t stop.',
    'about.p3_t': 'Full transparency',
    'about.p3_d': 'You understand what you\'re buying. Every component is explained.',
    'about.p4_t': 'Ongoing support',
    'about.p4_d': 'We stay involved long after launch.',
    'about.p5_t': 'Law 25 compliant',
    'about.p5_d': 'Data hosted in Canada. Audit documentation included.',
    'about.p6_t': 'Clear pricing',
    'about.p6_d': 'No hidden fees. No contractual lock-in.',

    // Voice
    'voice.tag': 'AI Voice Agent',
    'voice.title': 'It answers the phone.<br>You keep working.',
    'voice.desc': 'A virtual receptionist that handles incoming calls, texts, and emails. Books appointments, answers common questions, and routes complex cases to your team.',
    'voice.cta': 'Request a demo',
    'voice.problem_title': 'The problem',
    'voice.problem_desc': 'Every missed call is a client going to your competitor. Rush hours, lunches, evenings, weekends — nobody picks up. Meanwhile, the phone rings into the void and your revenue takes the hit.',
    'voice.solution_title': 'What we install',
    'voice.solution_desc': 'An agent trained on your services, prices, and hours. It responds in under 3 seconds, in French or English. Books appointments in real time, sends SMS confirmations, and transfers emergencies to your team. Everything is logged and accessible in a dashboard.',
    'voice.features_title': 'What\'s included',
    'voice.f1_t': 'Instant response',    'voice.f1_d': 'Under 3 seconds, 24/7.',
    'voice.f2_t': 'Voice, text, and email', 'voice.f2_d': 'A single agent handles all three communication channels.',
    'voice.f3_t': 'Appointment booking',  'voice.f3_d': 'Direct sync with your calendar and CRM.',
    'voice.f4_t': 'Natively bilingual',   'voice.f4_d': 'Quebec French and English, with seamless mid-call switching.',
    'voice.f5_t': 'Smart routing',        'voice.f5_d': 'Complex cases are sent to the right team member.',
    'voice.f6_t': 'Automatic reminders',  'voice.f6_d': 'SMS confirmation and reminder 24h before the appointment.',
    'voice.demo_tag': 'Try it',
    'voice.demo_title': 'Test the agent live',
    'voice.demo_desc': 'Simulation of an incoming call. See how the agent handles an appointment booking.',
    'voice.demo_status_idle': 'Press to simulate a call',
    'voice.channel_voice': 'Voice',
    'voice.channel_text': 'Text / SMS',
    'voice.channel_email': 'Email',
    'voice.faq_tag': 'FAQ',
    'voice.faq_title': 'FAQ — AI Voice Agent',
    'voice.faq1_q': 'Does it sound like a robot?',
    'voice.faq1_a': 'No. We use the most advanced voice synthesis models on the market. The voice is natural and handles intonation. Most callers won\'t notice the difference, especially for short interactions like booking an appointment.',
    'voice.faq2_q': 'Does it understand Quebec French?',
    'voice.faq2_a': 'Yes. The model is tuned for local accents, expressions, and vocabulary. It also switches to English if the caller changes language mid-call.',
    'voice.faq3_q': 'How long does installation take?',
    'voice.faq3_a': 'Between 3 and 7 business days. This includes process analysis, agent configuration, booking system integration, and real-world testing.',
    'voice.faq4_q': 'What if the question is too complex?',
    'voice.faq4_a': 'The agent recognizes its limits. If a request is beyond its scope, it transparently transfers the call to a human on your team.',
    'voice.faq5_q': 'Do I need to change my phone number?',
    'voice.faq5_a': 'No. We connect to your existing line via call forwarding or SIP integration. Your clients keep calling the same number.',
    'voice.faq6_q': 'Is it compatible with my CRM?',
    'voice.faq6_a': 'Yes. We have integrations for popular CRMs (Jobber, Mindbody, Cliniko, etc.). For custom systems, our team builds the bridge via API.',
    'voice.faq7_q': 'How is data handled?',
    'voice.faq7_a': 'Calls are processed and stored on Canadian servers. Transcripts are encrypted. Compliant with Quebec\'s Law 25 on personal information protection.',
    'voice.faq8_q': 'Are there hidden fees?',
    'voice.faq8_a': 'No. Transparent monthly subscription that includes usage, maintenance, updates, and support. Telecom costs (depending on your carrier) are the only external charges.',

    // GEO
    'geo.tag': 'GEO — Generative Engine Optimization',
    'geo.title': 'Be the answer,<br>not a blue link.',
    'geo.desc': 'People don\'t search Google like they used to. They ask questions to ChatGPT, Perplexity, and Google AI. If your business isn\'t in their answers, it\'s invisible.',
    'geo.cta': 'Free GEO audit',
    'geo.evolution_title': 'Search has changed',
    'geo.evolution_desc': 'Users no longer click links. They ask a question and read the AI-generated answer. If your business isn\'t in these engines\' knowledge base, you\'re invisible to a growing share of potential clients.',
    'geo.method_title': 'Our method',
    'geo.method_desc': 'We structure your data, optimize your content for "generative answer" formats, and build the trust signal network needed for AI algorithms to consider you a reliable source in your field and region.',
    'geo.process_title': 'The GEO process',
    'geo.f1_t': 'AI visibility audit', 'geo.f1_d': 'We measure your current presence on ChatGPT, Perplexity, and Google AI.',
    'geo.f2_t': 'Semantic structuring',  'geo.f2_d': 'Advanced Schema.org markup and optimized content architecture.',
    'geo.f3_t': 'Citation network',      'geo.f3_d': 'Mentions on high-trust sources for language models.',
    'geo.f4_t': 'AI-oriented rewriting',  'geo.f4_d': 'Content structured to be "digestible" by generative algorithms.',
    'geo.f5_t': 'Monthly tracking',      'geo.f5_d': 'Report of your appearances in AI responses, month after month.',
    'geo.f6_t': 'Google Business optimized', 'geo.f6_d': 'Optimization for "Zero-Click" local searches.',
    'geo.audit_tag': 'Free tool',
    'geo.audit_title': 'Automatic GEO Audit',
    'geo.audit_desc': 'Enter your website address. Our AI will analyze your presence and give you a detailed diagnosis with concrete recommendations.',
    'geo.audit_btn': 'Run audit',
    'geo.audit_disclaimer': '⚠️ This audit is automatically generated by artificial intelligence. It provides a preliminary assessment based on your website\'s public data and does not constitute a complete professional diagnosis. For an in-depth analysis and personalized action plan, contact our team.',
    'geo.audit_loading': 'Analysis in progress — this may take 30 to 60 seconds...',
    'geo.faq_tag': 'FAQ',
    'geo.faq_title': 'FAQ — GEO (AI Engines)',
    'geo.faq1_q': 'What\'s the difference between SEO and GEO?',
    'geo.faq1_a': 'SEO optimizes your site for traditional results (blue links). GEO optimizes your content to be read, understood, and cited by AI models like ChatGPT, Perplexity, or Google AI Overviews. GEO doesn\'t replace SEO — it complements it.',
    'geo.faq2_q': 'How long to see results?',
    'geo.faq2_a': 'First GEO results typically appear within 4 to 8 weeks, faster than traditional SEO (6 to 12 months). AI engines update their knowledge base regularly.',
    'geo.faq3_q': 'Can you guarantee a ChatGPT citation?',
    'geo.faq3_a': 'No serious consultant guarantees 100% citation. The algorithms are proprietary and change regularly. We guarantee a measurable improvement of your "trust signal" — which results in citations in the vast majority of cases.',
    'geo.faq4_q': 'Do I need a website?',
    'geo.faq4_a': 'Yes, a structured website is the foundation. If you don\'t have one, we can create it. If you do, we\'ll rework it in depth so AI crawlers can easily understand it.',
    'geo.faq5_q': 'Does it work for local businesses?',
    'geo.faq5_a': 'That\'s where GEO is most powerful. "Best real estate lawyer in Montréal" — if your firm is well positioned, the AI will cite your name.',
    'geo.faq6_q': 'How do you measure results?',
    'geo.faq6_a': 'We query different AI models with targeted queries related to your industry. Monthly report with your citation rate, competitive positioning, and authority evolution.',

    // LLM
    'llm.tag': 'Private Secure LLM',
    'llm.title': 'ChatGPT, but<br>at your office.',
    'llm.desc': 'Your sensitive data — legal, medical, financial — never leaves your infrastructure. Your employees get the power of AI without the confidentiality risks.',
    'llm.cta': 'Assess compatibility',
    'llm.problem_title': 'The confidentiality problem',
    'llm.problem_desc': 'Law firms, clinics, and accounting firms can\'t send confidential documents to ChatGPT. Data passes through American servers, the compliance risks with Law 25 are too high. AI becomes a liability instead of an asset.',
    'llm.solution_title': 'What we install',
    'llm.solution_desc': 'A performant open-source language model, connected to your local network or private cloud. Your employees query your documents, draft or summarize files — with an interface as simple as ChatGPT and absolute security.',
    'llm.features_title': 'Technical advantages',
    'llm.f1_t': 'Private hosting',        'llm.f1_d': 'On your physical servers or a private cloud you control.',
    'llm.f2_t': 'Zero data leaks',        'llm.f2_d': 'No information passes through any public network.',
    'llm.f3_t': 'Built-in RAG',           'llm.f3_d': 'The AI queries your PDFs, Word docs, and internal databases to find answers.',
    'llm.f4_t': 'Law 25 compliant',       'llm.f4_d': 'Audit documentation included. Data localized in Canada.',
    'llm.f5_t': 'Intuitive interface',    'llm.f5_d': 'If your employees can use ChatGPT, they can use this.',
    'llm.f6_t': 'Adapted vocabulary',     'llm.f6_d': 'The model learns the legal, medical, or financial jargon of your field.',
    'llm.faq_tag': 'FAQ',
    'llm.faq_title': 'FAQ — Private LLM',
    'llm.faq1_q': 'Why not ChatGPT Enterprise?',
    'llm.faq1_a': 'ChatGPT Enterprise guarantees your data isn\'t used for training, but it still passes through American servers. For law firms or clinics subject to Law 25, that risk level is often deemed unacceptable. Our solution keeps data physically at your location.',
    'llm.faq2_q': 'Is it as smart as ChatGPT?',
    'llm.faq2_a': 'Modern open-source models perform very close to GPT-4, especially for specialized tasks. Plus, since the system is connected to YOUR documents (RAG), it often answers with more precision than a generalist model on your own files.',
    'llm.faq3_q': 'What hardware do we need?',
    'llm.faq3_a': 'For a small team, a local server ($3,000-$5,000) is enough. For hundreds of users, a private cloud (AWS VPC, Azure Private) is better. We do the free hardware audit at the first meeting.',
    'llm.faq4_q': 'How long for deployment?',
    'llm.faq4_a': 'About 2 to 4 weeks. Installation, model configuration, document indexing, security testing, and team training. Ongoing support included afterwards.',
    'llm.faq5_q': 'Are new documents indexed automatically?',
    'llm.faq5_a': 'Yes. When you add a PDF to the monitored folder, it\'s indexed in seconds and becomes a knowledge source for the AI. No technical intervention required.',

    // Contact
    'contact.tag': 'Contact',
    'contact.title': 'One hour is enough to see clearly.',
    'contact.desc': 'We sit with you, identify what we can automate, and honestly tell you if it\'s worth it. The consultation is free.',
    'contact.phone_label': 'Phone',
    'contact.email_label': 'Email',
    'contact.location_label': 'Office',
    'contact.location_value': 'Montréal, QC',
    'contact.form_name': 'Full name',
    'contact.form_company': 'Company',
    'contact.form_email': 'Email',
    'contact.form_phone': 'Phone',
    'contact.form_service': 'Service needed',
    'contact.form_message': 'Message',
    'contact.form_select': '— Select —',
    'contact.form_opt_voice': 'AI Voice Agent',
    'contact.form_opt_geo': 'GEO (AI Engines)',
    'contact.form_opt_llm': 'Private LLM',
    'contact.form_opt_other': 'Other / Multiple services',
    'contact.form_submit': 'Send request',
    'contact.form_msg_placeholder': 'Briefly describe your main challenge...',
    'contact.err_name': 'Please enter your name.',
    'contact.err_company': 'Please enter your company name.',
    'contact.err_email': 'Please enter a valid email address.',
    'contact.err_phone': 'Please enter a valid phone number.',
    'contact.err_service': 'Please select a service.',

    // Legal
    'privacy.tag': 'Legal',
    'privacy.title': 'Privacy Policy',
    'privacy.updated': 'Last updated: June 30, 2026',
    'terms.tag': 'Legal',
    'terms.title': 'Terms of Service',
    'terms.updated': 'Last updated: June 30, 2026',

    // Footer
    'footer.desc': 'Artificial intelligence studio in Montréal. We build systems that work for local businesses.',
    'footer.products': 'Products',
    'footer.voice': 'AI Voice Agent',
    'footer.geo': 'GEO',
    'footer.llm': 'Private LLM',
    'footer.company': 'Company',
    'footer.home': 'Home',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms of Service',
    'footer.copy': '© 2026 Marquis AI · Marquis Logiciels Inc. · All rights reserved',
    'footer.made': 'Built in Montréal',
  },
};

/** Cached original FR innerHTML for each [data-i18n] element */
const frTexts = {};

let currentLang = 'fr';

/** Call once on DOMContentLoaded to snapshot original FR text */
export function initI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    frTexts[el.getAttribute('data-i18n')] = el.innerHTML;
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
}

/** Switch the entire page to `lang` ('fr' | 'en') */
export function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (lang === 'en' && translations.en[key]) {
      el.innerHTML = translations.en[key];
    } else if (lang === 'fr' && frTexts[key]) {
      el.innerHTML = frTexts[key];
    }
  });

  // Placeholders
  document.querySelectorAll('[data-placeholder-i18n]').forEach((el) => {
    const key = el.getAttribute('data-placeholder-i18n');
    if (lang === 'en' && translations.en[key]) {
      el.placeholder = translations.en[key];
    } else if (lang === 'fr') {
      if (key === 'contact.form_msg_placeholder') {
        el.placeholder = 'Décrivez brièvement votre défi principal...';
      }
    }
  });
}

/** Return current language code */
export function getCurrentLang() {
  return currentLang;
}