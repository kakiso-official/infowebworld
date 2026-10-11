#!/usr/bin/env node
/**
 * Verify the "Free APIs & SDKs" dataset before it ships on InfoWebWorld.
 *
 * Inputs (scratchpad, not in the repo):
 *   - free-apis-base.json        all public-apis/public-apis rows + liveness
 *   - free-apis-tier1.json       the 270 candidate ids picked for deep enrichment
 *   - enrich/out-*.json          Haiku-enriched detail records for those 270 ids
 *   - free-apis-patches.json     optional array of manual audit corrections, applied last
 *
 * What this script actually checks against the real world (nothing is invented):
 *   1. Every SDK's package registry (npm/PyPI/Go/Maven/NuGet/RubyGems/Packagist/
 *      crates.io/pub.dev/CocoaPods) -- records version + last-publish date where the
 *      registry exposes one, and DROPS any SDK the registry says doesn't exist.
 *   2. Every no-key sample endpoint: GET it, record ok/status/contentType/bytes/cors,
 *      and whether it is actually "tryable" (reachable + CORS-friendly) from the browser.
 *   3. docsUrl / pricingUrl / freeTier.sourceUrl / statusUrl / openapiUrl: each must
 *      resolve (2xx/3xx stays, 401/403/429 is a WAF -- kept as 'blocked', anything else
 *      is nulled out rather than shown as a dead link).
 *   4. provider.githubOrg: verified in batched GitHub GraphQL calls; nulled if the org
 *      does not exist.
 *
 * Output: free-apis-verified.json ({ source, generatedAt, categories, apis }) and a
 * free-apis-verify-report.md with full counts.
 *
 * Usage: node scripts/developers/verify-free-apis.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { readdirSync, existsSync, writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SCRATCH_DIR =
  'C:/Users/AADIL PARMAR/AppData/Local/Temp/claude/F--infoWebWorld-launching-coming-soon/c4f80252-7fec-429c-8b95-1285fe8331e8/scratchpad/devhub/data';
const ENRICH_DIR = path.join(SCRATCH_DIR, 'enrich');

const IN_BASE = path.join(SCRATCH_DIR, 'free-apis-base.json');
const IN_TIER1 = path.join(SCRATCH_DIR, 'free-apis-tier1.json');
const IN_PATCHES = path.join(SCRATCH_DIR, 'free-apis-patches.json');

const OUT_JSON = path.join(SCRATCH_DIR, 'free-apis-verified.json');
const OUT_REPORT = path.join(SCRATCH_DIR, 'free-apis-verify-report.md');

const GENERATED_AT = '2026-10-11';
const SITE_ORIGIN = 'https://www.infowebworld.com';

const CONCURRENCY = 10;
const TIMEOUT_MS = 10_000;
const MAX_SAMPLE_BYTES = 5 * 1024 * 1024; // 5 MB cap while measuring sample bodies

// Honest UA for registry APIs (crates.io requires a contact UA; others don't care).
const REGISTRY_UA = `InfoWebWorld-DevHub-Verify/1.0 (+${SITE_ORIGIN})`;
// Browser-like UA for resolve/sample checks against arbitrary third-party sites,
// matching the convention already used by build-free-apis-base.mjs.
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchWithTimeout(url, opts = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { redirect: 'follow', signal: controller.signal, ...opts });
  } finally {
    clearTimeout(timer);
  }
}

/** GET a URL, reading at most `cap` bytes of the body. */
async function getCapped(url, headers, cap = MAX_SAMPLE_BYTES) {
  const res = await fetchWithTimeout(url, { headers });
  let bytes = 0;
  let truncated = false;
  if (res.body) {
    const reader = res.body.getReader();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes >= cap) {
        truncated = true;
        try {
          await reader.cancel();
        } catch {
          /* ignore */
        }
        break;
      }
    }
  }
  return { res, bytes, truncated };
}

async function fetchJson(url, headers) {
  try {
    const res = await fetchWithTimeout(url, { headers });
    if (!res.ok) return { ok: false, status: res.status, json: null };
    const json = await res.json();
    return { ok: true, status: res.status, json };
  } catch (err) {
    return { ok: false, status: null, json: null, error: String(err?.message || err) };
  }
}

/** Run `items` through `worker` with bounded concurrency. */
async function runPool(items, concurrency, worker, label) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let completed = 0;

  async function runOne() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
      completed++;
      if (label && (completed % 25 === 0 || completed === items.length)) {
        process.stderr.write(`  ${label}: ${completed}/${items.length}\n`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runOne());
  await Promise.all(workers);
  return results;
}

function getPath(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setPath(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

// ---------------------------------------------------------------------------
// 1. SDK registry verification
// ---------------------------------------------------------------------------

function goCaseEncode(modulePath) {
  return modulePath.replace(/[A-Z]/g, (c) => '!' + c.toLowerCase());
}

async function checkNpm(pkg) {
  const r = await fetchJson(`https://registry.npmjs.org/${pkg}`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  const latest = r.json?.['dist-tags']?.latest ?? null;
  const lastPublish = latest ? r.json?.time?.[latest] ?? null : null;
  return { exists: true, version: latest, lastPublish };
}

async function checkPypi(pkg) {
  const r = await fetchJson(`https://pypi.org/pypi/${pkg}/json`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  const version = r.json?.info?.version ?? null;
  const releaseFiles = version ? r.json?.releases?.[version] : null;
  const lastPublish = Array.isArray(releaseFiles) && releaseFiles[0]?.upload_time_iso_8601
    ? releaseFiles[0].upload_time_iso_8601
    : null;
  return { exists: true, version, lastPublish };
}

async function checkGo(modulePath) {
  const encoded = goCaseEncode(modulePath);
  const r = await fetchJson(`https://proxy.golang.org/${encoded}/@latest`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) {
    if (r.status === 404 || r.status === 410 || r.status === 400) return { exists: false, note: `HTTP ${r.status}` };
    return { exists: null, note: r.status ? `HTTP ${r.status}` : r.error };
  }
  return { exists: true, version: r.json?.Version ?? null, lastPublish: r.json?.Time ?? null };
}

async function checkMaven(pkg) {
  const [group, artifact] = pkg.includes(':') ? pkg.split(':') : [null, pkg];
  const q = group
    ? `g:${encodeURIComponent(group)}+AND+a:${encodeURIComponent(artifact)}`
    : `a:${encodeURIComponent(artifact)}`;
  const r = await fetchJson(`https://search.maven.org/solrsearch/select?q=${q}&wt=json`, {
    'User-Agent': REGISTRY_UA,
  });
  if (!r.ok) return { exists: null, note: r.status ? `HTTP ${r.status}` : r.error };
  const numFound = r.json?.response?.numFound ?? 0;
  if (numFound === 0) return { exists: false, note: 'not found in Maven Central' };
  const doc = r.json.response.docs[0];
  const version = doc.latestVersion ?? doc.v ?? null;
  const lastPublish = doc.timestamp ? new Date(doc.timestamp).toISOString() : null;
  return { exists: true, version, lastPublish };
}

async function checkNuget(pkg) {
  const r = await fetchJson(`https://api.nuget.org/v3-flatcontainer/${pkg.toLowerCase()}/index.json`, {
    'User-Agent': REGISTRY_UA,
  });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  const versions = r.json?.versions ?? [];
  if (!versions.length) return { exists: false, note: 'empty version list' };
  return { exists: true, version: versions[versions.length - 1], lastPublish: null };
}

async function checkRubygems(pkg) {
  const r = await fetchJson(`https://rubygems.org/api/v1/gems/${pkg}.json`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  return { exists: true, version: r.json?.version ?? null, lastPublish: r.json?.version_created_at ?? null };
}

async function checkPackagist(pkg) {
  if (!pkg.includes('/')) return { exists: null, note: 'package name missing vendor/ prefix' };
  const r = await fetchJson(`https://repo.packagist.org/p2/${pkg}.json`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  const entries = r.json?.packages?.[pkg];
  if (!Array.isArray(entries) || !entries.length) return { exists: false, note: 'no releases' };
  const latest = entries[0];
  return { exists: true, version: latest.version ?? null, lastPublish: latest.time ?? null };
}

async function checkCrates(pkg) {
  const r = await fetchJson(`https://crates.io/api/v1/crates/${pkg}`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  const crate = r.json?.crate;
  if (!crate) return { exists: false, note: 'no crate object' };
  return { exists: true, version: crate.max_version ?? null, lastPublish: crate.updated_at ?? null };
}

async function checkPub(pkg) {
  const r = await fetchJson(`https://pub.dev/api/packages/${pkg}`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  const latest = r.json?.latest;
  return { exists: true, version: latest?.version ?? null, lastPublish: latest?.published ?? null };
}

async function checkCocoapods(pkg) {
  const r = await fetchJson(`https://trunk.cocoapods.org/api/v1/pods/${pkg}`, { 'User-Agent': REGISTRY_UA });
  if (!r.ok) return { exists: r.status === 404 ? false : null, note: r.status ? `HTTP ${r.status}` : r.error };
  const versions = Array.isArray(r.json) ? r.json : r.json?.versions;
  const latest = Array.isArray(versions) && versions.length ? versions[versions.length - 1] : null;
  return { exists: true, version: latest?.name ?? null, lastPublish: latest?.created_at ?? null };
}

const REGISTRY_CHECKERS = {
  npm: checkNpm,
  pypi: checkPypi,
  go: checkGo,
  maven: checkMaven,
  nuget: checkNuget,
  rubygems: checkRubygems,
  packagist: checkPackagist,
  crates: checkCrates,
  pub: checkPub,
  cocoapods: checkCocoapods,
};

async function verifySdk(sdk) {
  const checker = REGISTRY_CHECKERS[sdk.registry];
  if (!checker) {
    // Registry not covered by a known public API (cpan, cran, swiftpm, other, ...):
    // we cannot confirm or deny existence, so we keep it but flag it as unverified
    // rather than inventing a verdict.
    return { ...sdk, verified: null, verifyNote: `registry '${sdk.registry}' not checked (unsupported)` };
  }
  try {
    const result = await checker(sdk.package);
    if (result.exists === false) {
      return { ...sdk, verified: false, verifyNote: result.note ?? 'not found' };
    }
    return {
      ...sdk,
      verified: result.exists === true ? true : null,
      ...(result.version !== undefined ? { registryVersion: result.version ?? null } : {}),
      ...(result.lastPublish !== undefined ? { lastPublish: result.lastPublish ?? null } : {}),
      ...(result.exists === null ? { verifyNote: result.note } : {}),
    };
  } catch (err) {
    return { ...sdk, verified: null, verifyNote: `check failed: ${String(err?.message || err)}` };
  }
}

// ---------------------------------------------------------------------------
// 2. No-key sample endpoint checks
// ---------------------------------------------------------------------------

async function checkSample(sample) {
  try {
    const { res, bytes, truncated } = await getCapped(sample.url, {
      'User-Agent': BROWSER_UA,
      Origin: SITE_ORIGIN,
      Accept: 'application/json, text/plain, */*',
    });
    const ok = res.status >= 200 && res.status < 400;
    const contentType = res.headers.get('content-type') || null;
    const acao = res.headers.get('access-control-allow-origin');
    const cors = acao === '*' || acao === SITE_ORIGIN;
    const contentLengthHeader = res.headers.get('content-length');
    const finalBytes = contentLengthHeader ? Number(contentLengthHeader) : bytes;
    return {
      ok,
      status: res.status,
      contentType,
      bytes: Number.isFinite(finalBytes) ? finalBytes : bytes,
      truncated,
      cors,
      tryable: ok && cors,
    };
  } catch (err) {
    return {
      ok: false,
      status: null,
      contentType: null,
      bytes: 0,
      cors: false,
      tryable: false,
      error: String(err?.message || err),
    };
  }
}

// ---------------------------------------------------------------------------
// 3. docsUrl / pricingUrl / freeTier.sourceUrl / statusUrl / openapiUrl checks
// ---------------------------------------------------------------------------

async function resolveUrl(url) {
  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/json,*/*;q=0.8' },
    });
    const status = res.status;
    if (status >= 200 && status < 400) return { keep: true, status, blocked: false };
    if (status === 401 || status === 403 || status === 429) return { keep: true, status, blocked: true };
    return { keep: false, status, blocked: false };
  } catch (err) {
    return { keep: false, status: null, blocked: false, error: String(err?.message || err) };
  }
}

const URL_FIELDS = ['docsUrl', 'pricingUrl', 'freeTier.sourceUrl', 'statusUrl', 'openapiUrl'];

// ---------------------------------------------------------------------------
// 4. provider.githubOrg verification (batched GitHub GraphQL)
// ---------------------------------------------------------------------------

function ghGraphqlBatch(logins) {
  const tmpFile = path.join(SCRATCH_DIR, `.tmp-gql-${process.pid}-${Date.now()}.graphql`);
  const fields = logins
    .map((login, i) => `  org${i}: repositoryOwner(login: ${JSON.stringify(login)}) { login }`)
    .join('\n');
  const query = `query {\n${fields}\n}`;
  writeFileSync(tmpFile, query, 'utf8');
  try {
    const out = execFileSync('gh', ['api', 'graphql', '-F', `query=@${path.basename(tmpFile)}`], {
      cwd: SCRATCH_DIR,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    const parsed = JSON.parse(out);
    const data = parsed.data || {};
    const result = new Map();
    logins.forEach((login, i) => {
      result.set(login, Boolean(data[`org${i}`]));
    });
    return result;
  } catch (err) {
    // Treat a hard failure (rate limit, network) as "unknown" for every login in
    // this batch rather than guessing -- caller keeps the field as-is on unknown.
    const result = new Map();
    logins.forEach((login) => result.set(login, undefined));
    process.stderr.write(`  github graphql batch failed: ${String(err?.message || err)}\n`);
    return result;
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
      /* ignore */
    }
  }
}

async function verifyGithubOrgs(orgs) {
  const unique = [...new Set(orgs)];
  const BATCH = 40;
  const verdict = new Map();
  for (let i = 0; i < unique.length; i += BATCH) {
    const batch = unique.slice(i, i + BATCH);
    const result = ghGraphqlBatch(batch);
    for (const [login, exists] of result) verdict.set(login, exists);
    process.stderr.write(`  github orgs: ${Math.min(i + BATCH, unique.length)}/${unique.length}\n`);
  }
  return verdict;
}

// ---------------------------------------------------------------------------
// Load inputs
// ---------------------------------------------------------------------------

async function loadInputs() {
  const base = JSON.parse(await readFile(IN_BASE, 'utf8'));
  const tier1 = JSON.parse(await readFile(IN_TIER1, 'utf8'));

  const enrichFiles = existsSync(ENRICH_DIR)
    ? readdirSync(ENRICH_DIR)
        .filter((f) => /^out-.*\.json$/.test(f))
        .sort()
    : [];

  const enriched = [];
  for (const f of enrichFiles) {
    const records = JSON.parse(await readFile(path.join(ENRICH_DIR, f), 'utf8'));
    if (Array.isArray(records)) enriched.push(...records);
  }

  let patches = [];
  if (existsSync(IN_PATCHES)) {
    try {
      patches = JSON.parse(await readFile(IN_PATCHES, 'utf8'));
      if (!Array.isArray(patches)) patches = [];
    } catch (err) {
      process.stderr.write(`  warning: failed to parse patches file: ${String(err?.message || err)}\n`);
      patches = [];
    }
  }

  return { base, tier1, enriched, patches };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  process.stderr.write('Loading inputs...\n');
  const { base, tier1, enriched, patches } = await loadInputs();

  const baseById = new Map(base.apis.map((a) => [a.id, a]));
  const tier1ById = new Map(tier1.map((t) => [t.id, t]));
  const enrichedById = new Map(enriched.map((e) => [e.id, e]));

  const stats = {
    tier1Count: tier1.length,
    enrichedInputCount: enriched.length,
    sdksChecked: 0,
    sdksDropped: 0,
    sdksVerifiedTrue: 0,
    sdksUnverifiable: 0,
    sdksByRegistryDropped: {},
    samplesChecked: 0,
    samplesOk: 0,
    samplesTryable: 0,
    urlFieldsChecked: 0,
    urlFieldsNulled: 0,
    urlFieldsBlocked: 0,
    githubOrgsChecked: 0,
    githubOrgsNulled: 0,
    githubOrgsUnknown: 0,
    enrichedRecords: 0,
    basicRecords: 0,
    droppedDead: 0,
    flaggedUnknown: 0,
    patchesApplied: 0,
  };

  // --- Build the full list of SDK verification tasks -----------------------
  process.stderr.write('Verifying SDKs against package registries...\n');
  const sdkTasks = [];
  for (const rec of enriched) {
    for (let i = 0; i < (rec.sdks || []).length; i++) {
      sdkTasks.push({ id: rec.id, index: i, sdk: rec.sdks[i] });
    }
  }
  const sdkResults = await runPool(
    sdkTasks,
    CONCURRENCY,
    async (task) => ({ id: task.id, index: task.index, result: await verifySdk(task.sdk) }),
    'sdks',
  );
  const sdkResultsByApi = new Map();
  for (const r of sdkResults) {
    if (!sdkResultsByApi.has(r.id)) sdkResultsByApi.set(r.id, new Map());
    sdkResultsByApi.get(r.id).set(r.index, r.result);
    stats.sdksChecked++;
    if (r.result.verified === false) {
      stats.sdksDropped++;
      const reg = r.result.registry;
      stats.sdksByRegistryDropped[reg] = (stats.sdksByRegistryDropped[reg] || 0) + 1;
    } else if (r.result.verified === true) {
      stats.sdksVerifiedTrue++;
    } else {
      stats.sdksUnverifiable++;
    }
  }

  // --- Sample endpoint checks (needsKey === false only) ---------------------
  process.stderr.write('Checking no-key sample endpoints...\n');
  const sampleTasks = enriched.filter((rec) => rec.sample && rec.sample.needsKey === false);
  const sampleResults = await runPool(
    sampleTasks,
    CONCURRENCY,
    async (rec) => ({ id: rec.id, check: await checkSample(rec.sample) }),
    'samples',
  );
  const sampleCheckById = new Map(sampleResults.map((r) => [r.id, r.check]));
  stats.samplesChecked = sampleResults.length;
  stats.samplesOk = sampleResults.filter((r) => r.check.ok).length;
  stats.samplesTryable = sampleResults.filter((r) => r.check.tryable).length;

  // --- docsUrl / pricingUrl / freeTier.sourceUrl / statusUrl / openapiUrl ---
  process.stderr.write('Resolving docs/pricing/status/openapi URLs...\n');
  const urlTasks = [];
  for (const rec of enriched) {
    for (const field of URL_FIELDS) {
      const value = getPath(rec, field);
      if (value) urlTasks.push({ id: rec.id, field, url: value });
    }
  }
  const urlResults = await runPool(
    urlTasks,
    CONCURRENCY,
    async (task) => ({ ...task, check: await resolveUrl(task.url) }),
    'urls',
  );
  const urlResultsByApi = new Map();
  for (const r of urlResults) {
    if (!urlResultsByApi.has(r.id)) urlResultsByApi.set(r.id, new Map());
    urlResultsByApi.get(r.id).set(r.field, r.check);
    stats.urlFieldsChecked++;
    if (!r.check.keep) stats.urlFieldsNulled++;
    else if (r.check.blocked) stats.urlFieldsBlocked++;
  }

  // --- provider.githubOrg verification --------------------------------------
  process.stderr.write('Verifying provider.githubOrg via GitHub GraphQL...\n');
  const orgLogins = enriched
    .map((rec) => rec.provider && rec.provider.githubOrg)
    .filter((org) => typeof org === 'string' && org.length > 0);
  const orgVerdict = await verifyGithubOrgs(orgLogins);
  stats.githubOrgsChecked = new Set(orgLogins).size;
  for (const v of orgVerdict.values()) {
    if (v === false) stats.githubOrgsNulled++;
    else if (v === undefined) stats.githubOrgsUnknown++;
  }

  // --- Assemble enriched records ---------------------------------------------
  const enrichedOut = [];
  for (const rec of enriched) {
    const baseRec = baseById.get(rec.id);
    const tier1Rec = tier1ById.get(rec.id);
    const out = JSON.parse(JSON.stringify(rec)); // deep clone, we mutate freely below

    // Carry forward basic/base metadata so every record is self-contained.
    out.slug = baseRec?.slug ?? out.id;
    out.description = baseRec?.description ?? out.summary ?? null;
    out.auth = baseRec?.auth ?? (out.auth && out.auth.type) ?? 'unknown';
    out.https = baseRec?.https ?? true;
    out.category = baseRec?.category ?? tier1Rec?.category ?? null;
    out.link = baseRec?.link ?? out.provider?.website ?? tier1Rec?.link ?? null;
    out.discoverySource = tier1Rec?.source ?? 'public-apis';

    // SDKs: drop confirmed-nonexistent, annotate the rest.
    const sdkVerdicts = sdkResultsByApi.get(rec.id) || new Map();
    out.sdks = (rec.sdks || [])
      .map((sdk, i) => sdkVerdicts.get(i) ?? { ...sdk, verified: null, verifyNote: 'not checked' })
      .filter((sdk) => sdk.verified !== false);

    // Sample: attach the live check result.
    if (rec.sample) {
      if (rec.sample.needsKey === false) {
        out.sample = { ...rec.sample, check: sampleCheckById.get(rec.id) ?? null };
      } else {
        out.sample = { ...rec.sample, check: null };
      }
    }

    // URL fields: null the dead ones, keep blocked ones with a flag.
    const urlVerdicts = urlResultsByApi.get(rec.id) || new Map();
    for (const field of URL_FIELDS) {
      const check = urlVerdicts.get(field);
      if (!check) continue;
      if (!check.keep) {
        setPath(out, field, null);
      } else if (check.blocked) {
        setPath(out, field + 'Blocked', true);
      }
    }

    // provider.githubOrg: null if confirmed not to exist.
    if (out.provider && out.provider.githubOrg) {
      const verdict = orgVerdict.get(out.provider.githubOrg);
      if (verdict === false) out.provider.githubOrg = null;
    }

    out.enriched = true;
    out.lastVerified = GENERATED_AT;
    enrichedOut.push(out);
  }
  stats.enrichedRecords = enrichedOut.length;

  // --- Basic records: every other base API, minus dead ones ------------------
  const basicOut = [];
  for (const apiRec of base.apis) {
    if (tier1ById.has(apiRec.id)) continue; // already produced as an enriched record
    const status = apiRec.liveness?.status;
    if (status === 'dead') {
      stats.droppedDead++;
      continue;
    }
    const basic = {
      id: apiRec.id,
      slug: apiRec.slug,
      name: apiRec.name,
      description: apiRec.description,
      auth: apiRec.auth,
      authRaw: apiRec.authRaw,
      https: apiRec.https,
      cors: apiRec.cors,
      link: apiRec.link,
      category: apiRec.category,
      discoverySource: 'public-apis',
      enriched: false,
      liveness: { status: apiRec.liveness?.status ?? null, httpStatus: apiRec.liveness?.httpStatus ?? null },
    };
    if (status === 'unknown') {
      basic.flagged = 'unknown-liveness';
      stats.flaggedUnknown++;
    }
    basicOut.push(basic);
  }
  stats.basicRecords = basicOut.length;

  let apis = [...enrichedOut, ...basicOut];

  // --- Apply manual patches last ---------------------------------------------
  if (patches.length) {
    const apisById = new Map(apis.map((a) => [a.id, a]));
    for (const patch of patches) {
      const target = apisById.get(patch.id);
      if (!target) {
        process.stderr.write(`  patch skipped, unknown id: ${patch.id}\n`);
        continue;
      }
      setPath(target, patch.path, patch.value);
      target.patches = target.patches || [];
      target.patches.push({ path: patch.path, reason: patch.reason, source: patch.source });
      stats.patchesApplied++;
    }
  }

  // --- Categories (recomputed from the final kept set) ------------------------
  const categoryMap = new Map();
  for (const a of apis) {
    const cat = a.category || { name: 'Uncategorized', slug: 'uncategorized' };
    const key = cat.slug;
    if (!categoryMap.has(key)) {
      categoryMap.set(key, { name: cat.name, slug: cat.slug, count: 0, enrichedCount: 0 });
    }
    const entry = categoryMap.get(key);
    entry.count++;
    if (a.enriched) entry.enrichedCount++;
  }
  const categories = [...categoryMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  const output = {
    source: {
      base: base.source,
      verifiedAgainst: [
        'registry.npmjs.org',
        'pypi.org',
        'proxy.golang.org',
        'search.maven.org',
        'api.nuget.org',
        'rubygems.org',
        'repo.packagist.org',
        'crates.io',
        'pub.dev',
        'trunk.cocoapods.org',
        'api.github.com (graphql)',
      ],
    },
    generatedAt: GENERATED_AT,
    categories,
    apis,
  };

  await writeFile(OUT_JSON, JSON.stringify(output, null, 2), 'utf8');
  process.stderr.write(`Wrote ${OUT_JSON}\n`);

  const report = buildReport(stats, categories, apis);
  await writeFile(OUT_REPORT, report, 'utf8');
  process.stderr.write(`Wrote ${OUT_REPORT}\n`);

  process.stderr.write(
    `\nDone. ${stats.enrichedRecords} enriched + ${stats.basicRecords} basic = ${apis.length} APIs kept; ` +
      `${stats.droppedDead} dead dropped; ${stats.sdksDropped} SDKs dropped.\n`,
  );

  return { stats, apisCount: apis.length };
}

function buildReport(stats, categories, apis) {
  const lines = [];
  lines.push('# Free APIs & SDKs - Verification Report');
  lines.push('');
  lines.push(`Generated: ${GENERATED_AT}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Tier-1 candidates (deep enrichment input): ${stats.tier1Count}`);
  lines.push(`- Enriched records produced: ${stats.enrichedRecords}`);
  lines.push(`- Basic records kept from the base list: ${stats.basicRecords}`);
  lines.push(`- Dead base APIs dropped: ${stats.droppedDead}`);
  lines.push(`- Base APIs flagged unknown-liveness (kept, flagged): ${stats.flaggedUnknown}`);
  lines.push(`- Total APIs in final dataset: ${apis.length}`);
  lines.push(`- Manual patches applied: ${stats.patchesApplied}`);
  lines.push('');
  lines.push('## SDK registry verification');
  lines.push('');
  lines.push(`- SDKs checked: ${stats.sdksChecked}`);
  lines.push(`- Confirmed to exist (version/last-publish recorded where available): ${stats.sdksVerifiedTrue}`);
  lines.push(`- Dropped (registry returned "not found"): ${stats.sdksDropped}`);
  lines.push(`- Unverifiable (unsupported registry or network/API error, kept flagged): ${stats.sdksUnverifiable}`);
  if (Object.keys(stats.sdksByRegistryDropped).length) {
    lines.push('');
    lines.push('Dropped by registry:');
    for (const [reg, n] of Object.entries(stats.sdksByRegistryDropped).sort((a, b) => b[1] - a[1])) {
      lines.push(`  - ${reg}: ${n}`);
    }
  }
  lines.push('');
  lines.push('## No-key sample endpoint checks');
  lines.push('');
  lines.push(`- Samples checked (needsKey === false): ${stats.samplesChecked}`);
  lines.push(`- Reachable (2xx/3xx): ${stats.samplesOk}`);
  lines.push(`- Tryable from the browser (reachable + CORS allows ${SITE_ORIGIN} or *): ${stats.samplesTryable}`);
  lines.push('');
  lines.push('## Link checks (docsUrl / pricingUrl / freeTier.sourceUrl / statusUrl / openapiUrl)');
  lines.push('');
  lines.push(`- URL fields checked: ${stats.urlFieldsChecked}`);
  lines.push(`- Nulled (dead / non-2xx-3xx-401-403-429): ${stats.urlFieldsNulled}`);
  lines.push(`- Kept but flagged blocked (401/403/429, likely a WAF): ${stats.urlFieldsBlocked}`);
  lines.push('');
  lines.push('## provider.githubOrg verification (GitHub GraphQL)');
  lines.push('');
  lines.push(`- Distinct orgs checked: ${stats.githubOrgsChecked}`);
  lines.push(`- Nulled (org does not exist): ${stats.githubOrgsNulled}`);
  lines.push(`- Unknown (GraphQL batch failed, kept as-is): ${stats.githubOrgsUnknown}`);
  lines.push('');
  lines.push('## Per-category counts (final dataset)');
  lines.push('');
  lines.push('| Category | Total | Enriched |');
  lines.push('|---|---|---|');
  for (const c of categories) {
    lines.push(`| ${c.name} | ${c.count} | ${c.enrichedCount} |`);
  }
  lines.push('');
  return lines.join('\n');
}

main().catch((err) => {
  process.stderr.write(`\nFATAL: ${err?.stack || err}\n`);
  process.exitCode = 1;
});
