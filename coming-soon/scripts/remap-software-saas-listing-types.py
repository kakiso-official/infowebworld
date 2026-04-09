#!/usr/bin/env python3
"""
Remap 1,770 Software & SaaS listing types from old L3 categories to new L3 categories.
Reads: existing listing types from MySQL DB + new L3s from Excel
Writes: database/migration-remap-software-saas-listing-types.sql

Algorithm:
  1. Tokenize old L2 + old L3 + L4 (before colon) + L5 (after colon)
  2. Apply synonym normalization (development/developer → develop, etc.)
  3. Tokenize new L2 + new L3 (same normalization)
  4. Score = weighted token overlap with boosts for L4→L3 and L3→L3 matches
  5. Manual overrides for categories with no natural match in new taxonomy
"""

import pymysql
import openpyxl
import re
import os
import sys
from collections import OrderedDict, defaultdict

# Force UTF-8 output on Windows
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

# ─── Config ────────────────────────────────────────────────────────
EXCEL = r"C:\Users\AADIL PARMAR\Downloads\Software-SaaS-Taxonomy-900plus.xlsx"
SHEET = "Software & SaaS Navigation"
L1_SLUG = "software-saas"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "database")
OUT_FILE = os.path.join(OUT_DIR, "migration-remap-software-saas-listing-types.sql")

DB_CONFIG = dict(
    host='server46.hostwhitelabel.com',
    port=3306,
    user='cdbrisgy_infowebworld2026',
    password='infowebworld@2026',
    database='cdbrisgy_infowebworld',
    charset='utf8mb4',
)

# ─── Manual overrides for categories with weak/no match in new taxonomy ─
# (old_l2_name, old_l3_name) → new_l3_slug
MANUAL_OVERRIDES = {
    # Web3/blockchain has no home in the Capterra/G2-style Software taxonomy
    ('Development & IT', 'Web3 Dev'): 'integration-platform-as-a-service',
    # Accessibility tools have no dedicated L3 in the new taxonomy
    ('Customer Support', 'Accessibility'): 'browser-testing-tools',
    # CI/CD, deployments → Developer & Engineering Tools (not phone/LMS)
    ('Development & IT', 'DevOps & Cloud'): 'continuous-integration-tools',
    # Green IT, carbon → Finance, Accounting & Tax: Sustainability Reporting
    ('Development & IT', 'Sustainability Tech'): 'sustainability-reporting-software',
    # Edge computing → IT Infrastructure
    ('Development & IT', 'Edge Computing'): 'it-asset-management-software',
    # Regulatory compliance → Cybersecurity & Identity: Compliance Automation
    ('Legal & Compliance', 'Regulatory'): 'compliance-automation-software',
    # Whistleblower tools → Legal & Professional Services
    ('Legal & Compliance', 'Whistleblower'): 'law-practice-management-software',
    # Intranet → Knowledge Management: Company Knowledge Base
    ('Communication & Collaboration', 'Intranet'): 'company-knowledge-base-software',
    # Notification tools → closest is communication category
    ('Communication & Collaboration', 'Notification'): 'business-phone-systems',
    # Recruiting / ATS → Recruiting & Talent: Applicant Tracking Systems
    ('HR & People', 'Recruiting'): 'applicant-tracking-systems',
    # Immigration → HR: HR compliance
    ('HR & People', 'Immigration'): 'human-resources-information-systems',
    # Crypto & Web3 finance → Finance: Crypto Tax Software
    ('Finance & Accounting', 'Crypto & Web3'): 'crypto-tax-software',
}

# ─── Synonym normalization — maps related word forms to same stem ──
SYNONYMS = {
    # develop- family
    'development': 'develop', 'developer': 'develop', 'developers': 'develop',
    'developing': 'develop',
    # manage- family
    'management': 'manage', 'managing': 'manage', 'manager': 'manage',
    'managers': 'manage', 'managed': 'manage',
    # track- family
    'tracking': 'track', 'tracker': 'track', 'trackers': 'track',
    # test- family
    'testing': 'test', 'tester': 'test', 'tests': 'test',
    # monitor- family
    'monitoring': 'monitor', 'monitors': 'monitor',
    # integrat- family
    'integration': 'integrat', 'integrations': 'integrat', 'integrated': 'integrat',
    # automat- family
    'automation': 'automat', 'automated': 'automat', 'automate': 'automat',
    # schedul- family
    'scheduling': 'schedul', 'scheduler': 'schedul', 'scheduled': 'schedul',
    # account- family
    'accounting': 'account', 'accounts': 'account',
    # analyt- family
    'analytics': 'analytic', 'analysis': 'analytic', 'analyzing': 'analytic',
    # optim- family
    'optimization': 'optim', 'optimizer': 'optim', 'optimizing': 'optim',
    'optimized': 'optim',
    # recruit- family
    'recruiting': 'recruit', 'recruitment': 'recruit', 'recruiter': 'recruit',
    # secur- family
    'security': 'secur', 'securing': 'secur', 'secure': 'secur',
    # communic- family
    'communication': 'communic', 'communications': 'communic',
    # collabor- family
    'collaboration': 'collabor', 'collaborative': 'collabor', 'collaborate': 'collabor',
    # process- family
    'processing': 'process', 'processor': 'process',
    # plural normalization for key domain words
    'platforms': 'platform', 'systems': 'system', 'solutions': 'solution',
    'services': 'service', 'tools': 'tool', 'apps': 'app', 'suites': 'suite',
    # e-commerce normalization
    'ecommerce': 'commerce',
    # plan/planning
    'planning': 'plan', 'planner': 'plan', 'planners': 'plan',
    # report/reporting
    'reporting': 'report', 'reports': 'report',
    # build/builder
    'builders': 'builder', 'building': 'build',
    # generation/generator
    'generation': 'generat', 'generator': 'generat', 'generators': 'generat',
    'generating': 'generat',
}

# ─── Stop words — ONLY true function words, keep domain words ──────
STOP = {
    'and', 'the', 'for', 'of', 'in', 'to', 'a', 'an', 'with', 'by', 'on',
    'is', 'are', 'or', 'its', 'it', 'as', 'at', 'from', 'be', 'has', 'have',
    'software', 'saas',
}

# ─── Helpers ───────────────────────────────────────────────────────
def tokenize(text):
    """Lowercase, strip non-alpha, normalize synonyms, remove stops."""
    s = text.lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    words = s.split()
    result = set()
    for w in words:
        if len(w) <= 1 or w in STOP:
            continue
        # Apply synonym normalization
        w = SYNONYMS.get(w, w)
        result.add(w)
    return result

def slugify(name):
    s = name.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    return s.strip("-")

def esc(val):
    return val.replace("'", "''")

# ─── Step 1: Read existing listing types from DB ───────────────────
print("Connecting to database ...")
conn = pymysql.connect(**DB_CONFIG)
cur = conn.cursor()

cur.execute("""
    SELECT lt.id, lt.name, lt.slug, lt.sort_order,
           c.name AS l3_name, c.slug AS l3_slug,
           p.name AS l2_name, p.slug AS l2_slug
    FROM listing_types lt
    JOIN categories c ON lt.category_id = c.id
    JOIN categories p ON c.parent_id = p.id
    WHERE p.parent_id = (SELECT id FROM categories WHERE slug = %s AND level = 1)
    ORDER BY p.name, c.name, lt.sort_order
""", (L1_SLUG,))

old_listing_types = []
for row in cur.fetchall():
    old_listing_types.append({
        'id': row[0],
        'name': row[1],       # "L4: L5" format
        'slug': row[2],
        'sort_order': row[3],
        'old_l3_name': row[4],
        'old_l3_slug': row[5],
        'old_l2_name': row[6],
        'old_l2_slug': row[7],
    })

conn.close()
print(f"Read {len(old_listing_types)} listing types from DB")

# ─── Step 2: Read new L3 categories from Excel ────────────────────
print(f"Reading {EXCEL} ...")
wb = openpyxl.load_workbook(EXCEL, read_only=True, data_only=True)
ws = wb[SHEET]

new_taxonomy = OrderedDict()   # l2_name -> [l3_name, ...]
for i, row in enumerate(ws.iter_rows(values_only=True), 1):
    if i == 1:
        continue
    l2 = str(row[2]).strip() if row[2] else None
    l3 = str(row[3]).strip() if row[3] else None
    if not l2 or not l3:
        continue
    if l2 not in new_taxonomy:
        new_taxonomy[l2] = []
    new_taxonomy[l2].append(l3)

wb.close()

# Build flat list of new L3s with their L2 parent for matching
new_l3_entries = []
new_l3_by_slug = {}
for l2_name, l3_list in new_taxonomy.items():
    for l3_name in l3_list:
        l3_slug = slugify(l3_name)
        tokens = tokenize(l2_name) | tokenize(l3_name)
        l3_tokens = tokenize(l3_name)
        entry = {
            'l2_name': l2_name,
            'l3_name': l3_name,
            'l3_slug': l3_slug,
            'tokens': tokens,
            'l3_tokens': l3_tokens,
        }
        new_l3_entries.append(entry)
        new_l3_by_slug[l3_slug] = entry

print(f"New taxonomy: {len(new_taxonomy)} L2, {len(new_l3_entries)} L3")

# ─── Step 3: Match each listing type to best new L3 ───────────────
print("Matching listing types to new L3 categories ...")

assignments = defaultdict(list)  # new_l3_slug -> [listing_type, ...]
match_scores = []
manual_count = 0

for lt in old_listing_types:
    key = (lt['old_l2_name'], lt['old_l3_name'])

    # Check manual overrides first
    if key in MANUAL_OVERRIDES:
        target_slug = MANUAL_OVERRIDES[key]
        assignments[target_slug].append(lt)
        match_scores.append(-1)  # flag as manual
        manual_count += 1
        continue

    # Parse L4 and L5 from "L4: L5" name
    parts = lt['name'].split(':', 1)
    l4_part = parts[0].strip()
    l5_part = parts[1].strip() if len(parts) > 1 else ''

    # Build search tokens from ALL available context
    search_tokens = (
        tokenize(lt['old_l2_name']) |
        tokenize(lt['old_l3_name']) |
        tokenize(l4_part) |
        tokenize(l5_part)
    )
    l4_tokens = tokenize(l4_part)
    l5_tokens = tokenize(l5_part) if l5_part else set()
    old_l3_tokens = tokenize(lt['old_l3_name'])

    old_l2_tokens = tokenize(lt['old_l2_name'])

    best_score = -1
    best_match = None

    for entry in new_l3_entries:
        # Base score: overlap between all search tokens and new L3+L2 tokens
        overlap = len(search_tokens & entry['tokens'])

        # Boost: L4 name overlap with new L3 name (most specific match)
        l4_l3_overlap = len(l4_tokens & entry['l3_tokens'])

        # Boost: L5 overlap with new L3 tokens
        l5_l3_overlap = len(l5_tokens & entry['l3_tokens'])

        # Boost: old L3 name overlap with new L3 name (category-level match)
        l3_l3_overlap = len(old_l3_tokens & entry['l3_tokens'])

        # Boost: L2-to-L2 domain affinity (only when 2+ tokens overlap to avoid homonym traps)
        new_l2_tokens = tokenize(entry['l2_name'])
        l2_l2_overlap = len(old_l2_tokens & new_l2_tokens)
        l2_boost = l2_l2_overlap * 4 if l2_l2_overlap >= 2 else l2_l2_overlap * 2
        # Also check old L3 → new L2 affinity (e.g., old L3 "Recruiting" → new L2 "Recruiting & Talent")
        l3_l2_overlap = len(old_l3_tokens & new_l2_tokens)

        score = (overlap * 2) + (l4_l3_overlap * 4) + (l5_l3_overlap * 3) + (l3_l3_overlap * 3) + l2_boost + (l3_l2_overlap * 4)

        if score > best_score:
            best_score = score
            best_match = entry

    match_scores.append(best_score)
    assignments[best_match['l3_slug']].append(lt)

# Stats
real_scores = [s for s in match_scores if s >= 0]
avg_score = sum(real_scores) / len(real_scores) if real_scores else 0
min_score = min(real_scores) if real_scores else 0
max_score = max(real_scores) if real_scores else 0
assigned_l3_count = len(assignments)
unassigned_l3 = len(new_l3_entries) - assigned_l3_count
zero_score_count = sum(1 for s in real_scores if s == 0)

print(f"Matching complete:")
print(f"  Listing types matched: {len(old_listing_types)}")
print(f"  Manual overrides: {manual_count}")
print(f"  Algorithm-matched: {len(old_listing_types) - manual_count}")
print(f"  New L3s with at least 1 listing type: {assigned_l3_count}")
print(f"  New L3s with 0 listing types: {unassigned_l3}")
print(f"  Score range: {min_score} - {max_score}, avg: {avg_score:.1f}")
print(f"  Zero-score matches: {zero_score_count}")

# Show worst matches for review
worst_pairs = [(s, lt) for s, lt in zip(match_scores, old_listing_types) if s >= 0]
worst_pairs.sort(key=lambda x: x[0])
print(f"\nLowest-scoring matches (bottom 15):")
for score, lt in worst_pairs[:15]:
    # Find which L3 it was assigned to
    assigned_l3 = None
    for slug, lts in assignments.items():
        if lt in lts:
            assigned_l3 = slug
            break
    l3_name = new_l3_by_slug.get(assigned_l3, {}).get('l3_name', assigned_l3)
    print(f"  score={score:>2}  [{lt['old_l2_name']}/{lt['old_l3_name']}] {lt['name']}")
    print(f"         -> {l3_name}")

# ─── Step 4: Generate SQL ─────────────────────────────────────────
print(f"\nGenerating SQL ...")

sql_lines = []
sql_lines.append("-- =================================================================")
sql_lines.append("-- Software & SaaS Listing Type Remapping")
sql_lines.append(f"-- {len(old_listing_types)} listing types -> {assigned_l3_count} new L3 categories")
sql_lines.append(f"-- ({manual_count} manual overrides, {len(old_listing_types) - manual_count} algorithm-matched)")
sql_lines.append("-- Generated by remap-software-saas-listing-types.py")
sql_lines.append("-- =================================================================")
sql_lines.append("")
sql_lines.append("-- Run AFTER migration-software-saas-taxonomy.sql")
sql_lines.append("-- (old listing types are deleted in that migration, these are re-inserts)")
sql_lines.append("")

# Track used listing type slugs globally for uniqueness
used_lt_slugs = set()

# Build a lookup from new L3 slug to its name for comments
l3_slug_to_name = {e['l3_slug']: e['l3_name'] for e in new_l3_entries}

total_inserted = 0

# Sort assignments by L3 slug for deterministic output
for l3_slug in sorted(assignments.keys()):
    lts = assignments[l3_slug]
    l3_name = l3_slug_to_name.get(l3_slug, l3_slug)
    sql_lines.append(f"-- {l3_name} ({len(lts)} listing types)")

    # Batch insert in groups of 20
    for batch_start in range(0, len(lts), 20):
        batch = lts[batch_start:batch_start + 20]
        values = []
        for k, lt in enumerate(batch):
            # Ensure slug uniqueness
            lt_slug = lt['slug']
            if lt_slug in used_lt_slugs:
                i = 2
                while f"{lt_slug}-{i}" in used_lt_slugs:
                    i += 1
                lt_slug = f"{lt_slug}-{i}"
            used_lt_slugs.add(lt_slug)

            sort = (batch_start + k + 1) * 10
            values.append(
                f"  ((SELECT id FROM categories WHERE slug = '{l3_slug}' AND level = 3 LIMIT 1), "
                f"'{esc(lt['name'])}', '{esc(lt_slug)}', {sort})"
            )
            total_inserted += 1

        sql_lines.append(
            "INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES"
        )
        sql_lines.append(",\n".join(values) + ";")

    sql_lines.append("")

sql_lines.append("-- === DONE ===")
sql_lines.append(f"-- Total listing types inserted: {total_inserted}")
sql_lines.append(f"-- Verify: SELECT COUNT(*) FROM listing_types lt JOIN categories c ON lt.category_id = c.id")
sql_lines.append(f"--   WHERE c.parent_id IN (SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1));")
sql_lines.append(f"-- Expected: {total_inserted}")

# ─── Write SQL ─────────────────────────────────────────────────────
os.makedirs(OUT_DIR, exist_ok=True)
with open(OUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines) + "\n")

print(f"\nWritten: {OUT_FILE}")
print(f"  {total_inserted} listing types in {len(assignments)} L3 categories")
