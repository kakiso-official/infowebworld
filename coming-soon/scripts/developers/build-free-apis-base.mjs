#!/usr/bin/env node
/**
 * Build the base dataset for InfoWebWorld's "Free APIs & SDKs" section from the
 * public-apis/public-apis README (MIT licensed, curated list of public APIs).
 *
 * Pipeline:
 *   1. Download the README (raw, from `main`/`master`).
 *   2. Parse every "### Category" section whose table has the standard
 *      API | Description | Auth | HTTPS | CORS columns.
 *   3. Normalize each row into a stable record (id/slug, name, description,
 *      auth, https, cors, link, category).
 *   4. Liveness-check every unique link (bounded concurrency, timeout, retry,
 *      capped response read, parked-domain detection).
 *   5. Write the base dataset JSON + a human-readable Markdown report.
 *
 * Nothing here is invented: every API record and every "alive"/"dead" verdict
 * comes directly from the README or from an actual HTTP response. Links we
 * cannot classify confidently are marked 'unknown', never guessed.
 *
 * Usage: node scripts/developers/build-free-apis-base.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const REPO = 'public-apis/public-apis';
const README_URLS = [
  `https://raw.githubusercontent.com/${REPO}/master/README.md`,
  `https://raw.githubusercontent.com/${REPO}/main/README.md`,
];
const LICENSE_URL = `https://raw.githubusercontent.com/${REPO}/master/LICENSE`;

const SCRATCH_DIR =
  'C:/Users/AADIL PARMAR/AppData/Local/Temp/claude/F--infoWebWorld-launching-coming-soon/c4f80252-7fec-429c-8b95-1285fe8331e8/scratchpad/devhub/data';
const OUT_JSON = path.join(SCRATCH_DIR, 'free-apis-base.json');
const OUT_REPORT = path.join(SCRATCH_DIR, 'free-apis-base-report.md');

const CONCURRENCY = 16;
const TIMEOUT_MS = 15_000;
const MAX_BYTES = 256 * 1024; // 256 KB
const MAX_ATTEMPTS = 2; // first try + 1 retry

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

// Known literal auth tokens the README uses (kept verbatim when matched).
const KNOWN_AUTH = new Set(['apiKey', 'OAuth', 'X-Mashape-Key', 'User-Agent']);

// Parking / for-sale / placeholder page signatures. These are checked against
// both the page <title> and the first 256 KB of body text, case-insensitively.
const PARKING_PATTERNS = [
  /domain\s+(is|may be)\s+for sale/i,
  /this domain is (parked|for sale)/i,
  /buy this domain/i,
  /this web\s*page is parked/i,
  /parkingcrew/i,
  /sedoparking|sedo\.com\/(search|terms)/i,
  /hugedomains\.com/i,
  /godaddy\.com\/domains\/searchresults/i,
  /future home of something (quite cool|truly amazing)/i,
  /this domain name (is|was) registered/i,
  /courtesy of.*domain (parking|name)/i,
  /the domain .* (is|has) expired/i,
  /renew (your|this) domain/i,
  /dan\.com/i, // Dan.com parked-domain marketplace
  /afternic\.com/i,
];

// Signals that a 5xx/503 is a bot/WAF challenge rather than a truly dead site.
const WAF_PATTERNS = [
  /checking your browser/i,
  /attention required.*cloudflare/i,
  /cf-browser-verification/i,
  /ddos protection by/i,
  /please enable cookies/i,
  /captcha/i,
  /access denied/i,
  /just a moment/i,
];

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

/** GET a URL, following redirects, capped at MAX_BYTES, with a hard timeout. */
async function fetchCapped(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const finalUrl = res.url || url;
    const status = res.status;
    const headers = res.headers;

    let bodyText = '';
    if (res.body) {
      const reader = res.body.getReader();
      let received = 0;
      const chunks = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
        }
        if (received >= MAX_BYTES) {
          try {
            await reader.cancel();
          } catch {
            /* ignore */
          }
          break;
        }
      }
      try {
        bodyText = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8');
      } catch {
        bodyText = '';
      }
    }

    return { finalUrl, status, headers, bodyText };
  } finally {
    clearTimeout(timer);
  }
}

function extractTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html || '');
  if (!m) return null;
  return m[1].replace(/\s+/g, ' ').trim().slice(0, 300) || null;
}

function extractMetaDescription(html) {
  if (!html) return null;
  const re =
    /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i;
  const m = re.exec(html);
  const val = m ? m[1] ?? m[2] : null;
  if (!val) return null;
  return val.replace(/\s+/g, ' ').trim().slice(0, 500) || null;
}

function looksParked(title, body) {
  const hay = `${title || ''}\n${(body || '').slice(0, 20_000)}`;
  return PARKING_PATTERNS.some((re) => re.test(hay));
}

function looksLikeWafChallenge(headers, title, body) {
  const server = headers?.get?.('server') || '';
  const cfRay = headers?.get?.('cf-ray');
  const hay = `${title || ''}\n${(body || '').slice(0, 20_000)}`;
  if (cfRay && /cloudflare/i.test(server)) {
    if (WAF_PATTERNS.some((re) => re.test(hay))) return true;
  }
  return WAF_PATTERNS.some((re) => re.test(hay));
}

/** Classify one URL's liveness. Never throws; always resolves to a verdict. */
async function checkLink(url) {
  let lastErr = null;
  let lastResult = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await fetchCapped(url);
      lastResult = result;

      const { finalUrl, status, headers, bodyText } = result;
      const title = extractTitle(bodyText);
      const description = extractMetaDescription(bodyText);

      if (status >= 200 && status < 300) {
        if (looksParked(title, bodyText)) {
          return {
            status: 'dead',
            httpStatus: status,
            finalUrl,
            reason: 'parked-domain',
            title,
            description: null,
          };
        }
        return { status: 'alive', httpStatus: status, finalUrl, reason: null, title, description };
      }

      if (status === 404 || status === 410) {
        return { status: 'dead', httpStatus: status, finalUrl, reason: 'not-found', title, description: null };
      }

      if (status === 401 || status === 403 || status === 429) {
        return {
          status: 'blocked',
          httpStatus: status,
          finalUrl,
          reason: 'auth-or-rate-limit-wall',
          title,
          description: null,
        };
      }

      if (status === 503) {
        if (looksLikeWafChallenge(headers, title, bodyText)) {
          return { status: 'blocked', httpStatus: status, finalUrl, reason: 'waf-challenge', title, description: null };
        }
        // Ambiguous: could be a transient outage. Retry once before calling it dead.
        if (attempt < MAX_ATTEMPTS) continue;
        return { status: 'dead', httpStatus: status, finalUrl, reason: 'persistent-5xx', title, description: null };
      }

      if (status >= 500) {
        if (attempt < MAX_ATTEMPTS) continue;
        return { status: 'dead', httpStatus: status, finalUrl, reason: 'persistent-5xx', title, description: null };
      }

      if (status >= 300 && status < 400) {
        // Should be rare: fetch() follows redirects itself; this means an
        // unresolved redirect (e.g. missing Location) or a redirect loop cap.
        if (attempt < MAX_ATTEMPTS) continue;
        return { status: 'unknown', httpStatus: status, finalUrl, reason: 'unresolved-redirect', title, description: null };
      }

      // Any other status we don't have a specific rule for.
      if (attempt < MAX_ATTEMPTS) continue;
      return { status: 'unknown', httpStatus: status, finalUrl, reason: 'unclassified-status', title, description: null };
    } catch (err) {
      lastErr = err;
      const code = err?.cause?.code || err?.code;

      if (err?.name === 'AbortError') {
        if (attempt < MAX_ATTEMPTS) continue;
        return { status: 'unknown', httpStatus: null, finalUrl: url, reason: 'timeout', title: null, description: null };
      }
      if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
        return { status: 'dead', httpStatus: null, finalUrl: url, reason: 'dns-failure', title: null, description: null };
      }
      if (code === 'ECONNREFUSED') {
        return {
          status: 'dead',
          httpStatus: null,
          finalUrl: url,
          reason: 'connection-refused',
          title: null,
          description: null,
        };
      }
      if (
        code === 'CERT_HAS_EXPIRED' ||
        code === 'ERR_TLS_CERT_ALTNAME_INVALID' ||
        code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
        code === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
        /certificate|SSL|TLS/i.test(err?.message || '')
      ) {
        return { status: 'dead', httpStatus: null, finalUrl: url, reason: 'tls-failure', title: null, description: null };
      }
      // Unknown network error: retry once, then give up as 'unknown'.
      if (attempt < MAX_ATTEMPTS) continue;
      return {
        status: 'unknown',
        httpStatus: null,
        finalUrl: url,
        reason: code || err?.message || 'network-error',
        title: null,
        description: null,
      };
    }
  }

  // Should not be reached, but keep a safe fallback.
  return {
    status: 'unknown',
    httpStatus: lastResult?.status ?? null,
    finalUrl: lastResult?.finalUrl ?? url,
    reason: lastErr?.message || 'unresolved',
    title: null,
    description: null,
  };
}

/** Run `items` through `worker` with bounded concurrency. */
async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let completed = 0;

  async function runOne() {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
      completed++;
      if (completed % 50 === 0 || completed === items.length) {
        process.stderr.write(`  liveness: ${completed}/${items.length}\n`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runOne());
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Slugify
// ---------------------------------------------------------------------------

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function uniqueSlug(base, usedSlugs) {
  let slug = base || 'api';
  let n = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${n}`;
    n++;
  }
  usedSlugs.add(slug);
  return slug;
}

// ---------------------------------------------------------------------------
// README parsing
// ---------------------------------------------------------------------------

/** Split a markdown table row into cells, respecting escaped "\|". */
function splitRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  // Split on unescaped pipes.
  const cells = trimmed.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
  return cells;
}

function parseLinkCell(cell) {
  const m = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(cell);
  if (m) return { name: m[1].trim(), url: m[2].trim() };
  // No markdown link: treat the whole cell as a name with no verifiable URL.
  const name = cell.replace(/[`*]/g, '').trim();
  return { name: name || null, url: null };
}

function normalizeAuth(cell) {
  const raw = (cell || '').replace(/`/g, '').trim();
  if (!raw || /^no$/i.test(raw)) return { auth: 'none', authRaw: raw || 'No' };
  for (const known of KNOWN_AUTH) {
    if (raw.toLowerCase() === known.toLowerCase()) return { auth: known, authRaw: raw };
  }
  return { auth: 'other', authRaw: raw };
}

function normalizeHttps(cell) {
  const raw = (cell || '').trim();
  if (/^yes$/i.test(raw)) return true;
  if (/^no$/i.test(raw)) return false;
  return null; // unknown / unexpected value
}

function normalizeCors(cell) {
  const raw = (cell || '').trim().toLowerCase();
  if (raw === 'yes') return 'yes';
  if (raw === 'no') return 'no';
  return 'unknown';
}

/**
 * Parse the README into { categories: [{name,slug}], rows: [...] }.
 * Only "### Heading" sections whose immediately-following table has both an
 * HTTPS and a CORS column are treated as API category sections (this
 * excludes the APILayer promo table and the MCP Servers table, which use a
 * different column set).
 */
function parseReadme(markdown) {
  const lines = markdown.split(/\r?\n/);
  const rows = [];
  const categories = new Map(); // slug -> { name, slug, count }

  let i = 0;
  while (i < lines.length) {
    const headingMatch = /^###\s+(.+?)\s*$/.exec(lines[i]);
    if (!headingMatch) {
      i++;
      continue;
    }
    const categoryName = headingMatch[1].trim();
    i++;

    // Skip blank lines between heading and table header.
    while (i < lines.length && lines[i].trim() === '') i++;

    const headerLine = lines[i] || '';
    const isApiTable = /HTTPS/i.test(headerLine) && /CORS/i.test(headerLine);
    if (!isApiTable) {
      // Not a standard API category table (e.g. APILayer promo, MCP Servers).
      continue;
    }

    i++; // header line
    // separator line, e.g. |:---|:---|:---|:---|:---|
    if (/^\|?\s*:?-+/.test(lines[i] || '')) i++;

    const categorySlug = slugify(categoryName);
    if (!categories.has(categorySlug)) {
      categories.set(categorySlug, { name: categoryName, slug: categorySlug, count: 0 });
    }

    // Data rows until a blank line, the "Back to Index" marker, or next heading.
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '') break;
      if (/Back to Index/i.test(line)) break;
      if (/^###\s+/.test(line)) break;
      if (!line.trim().startsWith('|')) break;

      const cells = splitRow(line);
      if (cells.length >= 5) {
        const [nameCell, descCell, authCell, httpsCell, corsCell] = cells;
        const { name, url } = parseLinkCell(nameCell);
        if (name) {
          const { auth, authRaw } = normalizeAuth(authCell);
          rows.push({
            categoryName,
            categorySlug,
            name,
            description: (descCell || '').trim() || null,
            auth,
            authRaw,
            https: normalizeHttps(httpsCell),
            cors: normalizeCors(corsCell),
            link: url,
          });
          categories.get(categorySlug).count++;
        }
      }
      i++;
    }
  }

  return { categories: [...categories.values()], rows };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  await mkdir(SCRATCH_DIR, { recursive: true });

  process.stderr.write('Fetching LICENSE...\n');
  const licenseText = await fetchText(LICENSE_URL);
  const copyrightMatch = /^Copyright\s+\(c\)\s+.+$/im.exec(licenseText);
  const copyright = copyrightMatch ? copyrightMatch[0].trim() : null;
  const licenseLine = licenseText.split(/\r?\n/)[0]?.trim() || null;

  process.stderr.write('Fetching README...\n');
  let readme = null;
  let readmeErr = null;
  for (const url of README_URLS) {
    try {
      readme = await fetchText(url);
      break;
    } catch (err) {
      readmeErr = err;
    }
  }
  if (!readme) throw readmeErr || new Error('Could not fetch README from master or main.');

  process.stderr.write('Parsing README tables...\n');
  const { categories, rows } = parseReadme(readme);
  process.stderr.write(`Parsed ${rows.length} API rows across ${categories.length} categories.\n`);

  // Normalize into the final API records with unique slugs.
  const usedSlugs = new Set();
  const apis = rows.map((r) => {
    const baseSlug = slugify(r.name);
    const slug = uniqueSlug(baseSlug, usedSlugs);
    return {
      id: slug,
      slug,
      name: r.name,
      description: r.description,
      auth: r.auth,
      authRaw: r.authRaw,
      https: r.https,
      cors: r.cors,
      link: r.link,
      category: { name: r.categoryName, slug: r.categorySlug },
      liveness: null, // filled in below
    };
  });

  // Liveness-check every unique link (many APIs can share a link; dedupe the
  // network work, then fan the result back out to every record).
  const uniqueLinks = [...new Set(apis.map((a) => a.link).filter(Boolean))];
  process.stderr.write(`Liveness-checking ${uniqueLinks.length} unique links (concurrency ${CONCURRENCY})...\n`);

  const checkedAt = new Date().toISOString();
  const linkResults = await runPool(uniqueLinks, CONCURRENCY, async (url) => {
    const verdict = await checkLink(url);
    return { url, ...verdict, checkedAt };
  });
  const linkMap = new Map(linkResults.map((r) => [r.url, r]));

  for (const api of apis) {
    if (!api.link) {
      api.liveness = { status: 'unknown', httpStatus: null, finalUrl: null, reason: 'no-link', title: null, description: null, checkedAt };
      continue;
    }
    api.liveness = linkMap.get(api.link) || {
      status: 'unknown',
      httpStatus: null,
      finalUrl: api.link,
      reason: 'not-checked',
      title: null,
      description: null,
      checkedAt,
    };
  }

  // Roll up per-category alive counts.
  const categoryAliveCount = new Map();
  for (const api of apis) {
    if (api.liveness.status === 'alive') {
      categoryAliveCount.set(api.category.slug, (categoryAliveCount.get(api.category.slug) || 0) + 1);
    }
  }
  const categoriesOut = categories
    .map((c) => ({ name: c.name, slug: c.slug, count: c.count, aliveCount: categoryAliveCount.get(c.slug) || 0 }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const statusTotals = { alive: 0, blocked: 0, dead: 0, unknown: 0 };
  for (const api of apis) statusTotals[api.liveness.status] = (statusTotals[api.liveness.status] || 0) + 1;

  const dataset = {
    source: {
      repo: `https://github.com/${REPO}`,
      license: licenseLine,
      copyright,
      fetchedAt: new Date().toISOString(),
    },
    categories: categoriesOut,
    apis,
  };

  await writeFile(OUT_JSON, JSON.stringify(dataset, null, 2), 'utf8');
  process.stderr.write(`Wrote ${OUT_JSON}\n`);

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------

  const deadExamples = apis.filter((a) => a.liveness.status === 'dead').slice(0, 25);
  const parkedExamples = apis.filter((a) => a.liveness.reason === 'parked-domain').slice(0, 25);
  const unknownExamples = apis.filter((a) => a.liveness.status === 'unknown').slice(0, 15);

  const reasonCounts = new Map();
  for (const api of apis) {
    if (api.liveness.status === 'dead' || api.liveness.status === 'blocked') {
      const key = `${api.liveness.status}:${api.liveness.reason}`;
      reasonCounts.set(key, (reasonCounts.get(key) || 0) + 1);
    }
  }

  const lines = [];
  lines.push('# Free APIs base dataset report');
  lines.push('');
  lines.push(`Source: ${dataset.source.repo}`);
  lines.push(`License: ${dataset.source.license}`);
  lines.push(`Copyright: ${dataset.source.copyright}`);
  lines.push(`Fetched: ${dataset.source.fetchedAt}`);
  lines.push('');
  lines.push('## Totals');
  lines.push('');
  lines.push(`- Total API rows parsed: ${apis.length}`);
  lines.push(`- Unique links checked: ${uniqueLinks.length}`);
  lines.push(`- Categories: ${categoriesOut.length}`);
  lines.push(`- Alive: ${statusTotals.alive}`);
  lines.push(`- Blocked (probably alive, bot/WAF/rate-limit wall): ${statusTotals.blocked}`);
  lines.push(`- Dead: ${statusTotals.dead}`);
  lines.push(`- Unknown: ${statusTotals.unknown}`);
  lines.push('');
  lines.push('## Dead / blocked reasons');
  lines.push('');
  for (const [key, count] of [...reasonCounts.entries()].sort((a, b) => b[1] - a[1])) {
    lines.push(`- ${key}: ${count}`);
  }
  lines.push('');
  lines.push('## By category');
  lines.push('');
  lines.push('| Category | Total | Alive |');
  lines.push('|:---|---:|---:|');
  for (const c of categoriesOut) {
    lines.push(`| ${c.name} | ${c.count} | ${c.aliveCount} |`);
  }
  lines.push('');
  lines.push('## Dead link examples');
  lines.push('');
  for (const a of deadExamples) {
    lines.push(`- **${a.name}** (${a.category.name}) — ${a.link} — ${a.liveness.reason} (HTTP ${a.liveness.httpStatus ?? 'n/a'})`);
  }
  lines.push('');
  lines.push('## Parked-domain examples');
  lines.push('');
  if (parkedExamples.length === 0) {
    lines.push('- None detected.');
  } else {
    for (const a of parkedExamples) {
      lines.push(`- **${a.name}** (${a.category.name}) — ${a.link} — title: "${a.liveness.title || ''}"`);
    }
  }
  lines.push('');
  lines.push('## Unknown (timeout / unresolved) examples');
  lines.push('');
  for (const a of unknownExamples) {
    lines.push(`- **${a.name}** (${a.category.name}) — ${a.link} — ${a.liveness.reason}`);
  }
  lines.push('');

  await writeFile(OUT_REPORT, lines.join('\n'), 'utf8');
  process.stderr.write(`Wrote ${OUT_REPORT}\n`);

  process.stderr.write(
    `\nDone. apis=${apis.length} categories=${categoriesOut.length} alive=${statusTotals.alive} blocked=${statusTotals.blocked} dead=${statusTotals.dead} unknown=${statusTotals.unknown}\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
