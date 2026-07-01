/**
 * Netlify Function — GEO Audit Proxy (Production)
 *
 * Handles both page fetching and Claude API calls server-side.
 * No API keys or third-party proxies exposed to the client.
 *
 * Setup:
 *   1. Place at: netlify/functions/geo-audit.js
 *   2. Netlify dashboard → Environment variables:
 *        ANTHROPIC_API_KEY       = sk-ant-...
 *        ALLOWED_ORIGINS         = https://marquisai.ca,https://www.marquisai.ca
 *        DAILY_AUDIT_LIMIT       = 100        (optional, default 100)
 *   3. Frontend calls: /.netlify/functions/geo-audit
 */

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per cold-start instance)
//
// Netlify functions are stateless across invocations on different instances,
// but a single warm instance handles many requests. This catches rapid abuse
// from a single source during one instance's lifetime. For heavier traffic,
// swap this for Upstash Redis or Netlify Blobs.
// ---------------------------------------------------------------------------
const ipHits = new Map();

function isRateLimited(ip, maxPerWindow = 5, windowMs = 60_000) {
  const now = Date.now();
  const record = ipHits.get(ip);

  if (!record || now - record.start > windowMs) {
    ipHits.set(ip, { start: now, count: 1 });
    return false;
  }

  record.count += 1;
  if (record.count > maxPerWindow) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Allowed-origin check
// ---------------------------------------------------------------------------
function isAllowedOrigin(event) {
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // If no origins configured, allow all (dev mode)
  if (allowed.length === 0) return true;

  const origin = (event.headers.origin || '').toLowerCase();
  const referer = (event.headers.referer || '').toLowerCase();

  return allowed.some(
    (o) => origin === o || origin.startsWith(o) || referer.startsWith(o)
  );
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
const URL_REGEX = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}/;
const MAX_URL_LENGTH = 2000;

function validateInput(body) {
  if (!body || typeof body !== 'object') return 'Invalid request body';
  if (!body.url || typeof body.url !== 'string') return 'Missing URL';
  if (body.url.length > MAX_URL_LENGTH) return 'URL too long';
  if (!URL_REGEX.test(body.url)) return 'Invalid URL format';
  if (!body.lang || !['fr', 'en'].includes(body.lang)) return 'Invalid language';
  return null;
}

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------
const SYSTEM_PROMPTS = {
  fr: `Tu es un expert en GEO (Generative Engine Optimization). Tu analyses des sites web pour évaluer leur visibilité sur les moteurs de recherche IA (ChatGPT, Perplexity, Google AI Overviews).

Réponds UNIQUEMENT en JSON valide, sans backticks, sans texte avant ou après. Format exact :
{
  "score": <number 0-100>,
  "categories": [
    { "name": "<nom>", "score": <number 0-100>, "analysis": "<2-3 phrases>" }
  ],
  "summary": "<2-3 phrases>",
  "top_recommendations": ["<1>", "<2>", "<3>"]
}

Catégories (exactement 5) :
1. Structure sémantique (Schema.org, HTML sémantique, balises)
2. Qualité du contenu (clarté, autorité, format Q&R)
3. Signaux de confiance (mentions externes, liens, réputation)
4. Optimisation locale (Google Business, NAP, avis)
5. Indexabilité IA (accessibilité aux crawlers, sitemap, robots.txt)

Sois honnête. Ne gonfle pas les scores. Base-toi uniquement sur le HTML fourni.`,

  en: `You are a GEO (Generative Engine Optimization) expert. You analyze websites to evaluate their visibility on AI search engines (ChatGPT, Perplexity, Google AI Overviews).

Respond ONLY in valid JSON, no backticks, no text before or after. Exact format:
{
  "score": <number 0-100>,
  "categories": [
    { "name": "<name>", "score": <number 0-100>, "analysis": "<2-3 sentences>" }
  ],
  "summary": "<2-3 sentences>",
  "top_recommendations": ["<1>", "<2>", "<3>"]
}

Categories (exactly 5):
1. Semantic structure (Schema.org, semantic HTML, markup)
2. Content quality (clarity, authority, Q&A format)
3. Trust signals (external mentions, links, reputation)
4. Local optimization (Google Business, NAP, reviews)
5. AI indexability (crawler accessibility, sitemap, robots.txt)

Be honest. Don't inflate scores. Base analysis only on the provided HTML.`,
};

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(event),
    };
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' }, event);
  }

  // Origin check
  if (!isAllowedOrigin(event)) {
    return respond(403, { error: 'Forbidden' }, event);
  }

  // Rate limit (5 requests per minute per IP)
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (isRateLimited(ip, 5, 60_000)) {
    return respond(429, { error: 'Too many requests. Please wait a minute.' }, event);
  }

  // API key check
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return respond(500, { error: 'Service not configured' }, event);
  }

  // Parse + validate input
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return respond(400, { error: 'Invalid JSON' }, event);
  }

  const validationError = validateInput(body);
  if (validationError) {
    return respond(400, { error: validationError }, event);
  }

  try {
    // Step 1: Fetch the target page server-side (no CORS proxy needed)
    let pageContent = '';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const pageRes = await fetch(body.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'MarquisAI-GEO-Audit/1.0',
          Accept: 'text/html',
        },
      });
      clearTimeout(timeout);

      if (pageRes.ok) {
        pageContent = await pageRes.text();
        // Truncate to 15k chars to stay within token limits
        if (pageContent.length > 15000) {
          pageContent = pageContent.substring(0, 15000);
        }
      } else {
        pageContent = `(Page returned HTTP ${pageRes.status} — analyze based on URL only)`;
      }
    } catch (fetchErr) {
      pageContent = `(Could not fetch ${body.url}: ${fetchErr.message} — analyze based on URL only)`;
    }

    // Step 2: Call Claude API
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: SYSTEM_PROMPTS[body.lang] || SYSTEM_PROMPTS.fr,
        messages: [
          {
            role: 'user',
            content: `Analyse ce site web pour un audit GEO :\nURL: ${body.url}\n\nContenu HTML (tronqué) :\n${pageContent}`,
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const errData = await claudeRes.text();
      console.error('Anthropic API error:', claudeRes.status, errData);
      return respond(502, { error: 'AI analysis failed' }, event);
    }

    const claudeData = await claudeRes.json();

    // Step 3: Parse and validate the AI response
    const text = claudeData.content?.map((c) => c.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();

    let audit;
    try {
      audit = JSON.parse(clean);
    } catch {
      console.error('Failed to parse Claude response:', clean.substring(0, 200));
      return respond(502, { error: 'AI returned invalid format' }, event);
    }

    // Sanity-check the response shape
    if (
      typeof audit.score !== 'number' ||
      !Array.isArray(audit.categories) ||
      !Array.isArray(audit.top_recommendations)
    ) {
      return respond(502, { error: 'AI returned unexpected structure' }, event);
    }

    // Clamp scores to 0-100
    audit.score = Math.max(0, Math.min(100, Math.round(audit.score)));
    audit.categories.forEach((cat) => {
      cat.score = Math.max(0, Math.min(100, Math.round(cat.score)));
    });

    return respond(200, audit, event);
  } catch (err) {
    console.error('Unexpected error:', err);
    return respond(500, { error: 'Internal server error' }, event);
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function corsHeaders(event) {
  const origin = event.headers.origin || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function respond(status, body, event) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(event),
    },
    body: JSON.stringify(body),
  };
}