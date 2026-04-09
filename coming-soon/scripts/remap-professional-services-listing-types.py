#!/usr/bin/env python3
"""
Remap 1,100 Professional Services listing types from old L3 to new L3 categories.
"""

import pymysql, openpyxl, re, os, sys
from collections import OrderedDict, defaultdict

sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

EXCEL = r"C:\Users\AADIL PARMAR\Downloads\Professional-Services-Taxonomy-900plus.xlsx"
SHEET = "Pro Services Navigation"
L1_SLUG = "professional-services"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "database")
OUT_FILE = os.path.join(OUT_DIR, "migration-remap-professional-services-listing-types.sql")

DB_CONFIG = dict(
    host='server46.hostwhitelabel.com', port=3306,
    user='cdbrisgy_infowebworld2026', password='infowebworld@2026',
    database='cdbrisgy_infowebworld', charset='utf8mb4',
)

MANUAL_OVERRIDES = {
    # Security services → physical security risk
    ('Security', 'Security Consulting'): 'physical-security-risk-assessors',
    ('Security', 'Security Operations'): 'physical-security-risk-assessors',
    # Cleaning & Maintenance → facilities consulting (cleaning moved to Local Business)
    ('Cleaning & Maintenance', 'Janitorial'): 'facilities-management-consultants',
    ('Cleaning & Maintenance', 'Facility Management'): 'facilities-management-consultants',
    ('Cleaning & Maintenance', 'Pest Control'): 'facilities-management-consultants',
    ('Cleaning & Maintenance', 'Waste Management'): 'environmental-remediation-consultants',
    ('Cleaning & Maintenance', 'Commercial Cleaning'): 'facilities-management-consultants',
    ('Cleaning & Maintenance', 'Exterior Maintenance'): 'facilities-management-consultants',
    # Printing & Signage → brand/visual identity (no signage L3 exists)
    ('Marketing & Creative', 'Printing & Signage'): 'visual-identity-firms',
    # Insurance categories → financial advisors
    ('Insurance', 'Life Insurance'): 'life-insurance-advisors',
    ('Insurance', 'Health Insurance'): 'health-insurance-advisors',
    ('Insurance', 'Commercial Insurance'): 'commercial-insurance-brokers',
}

SYNONYMS = {
    'development': 'develop', 'developer': 'develop', 'developers': 'develop',
    'management': 'manage', 'managing': 'manage', 'manager': 'manage',
    'managers': 'manage', 'managed': 'manage',
    'tracking': 'track', 'tracker': 'track',
    'testing': 'test', 'tester': 'test',
    'consulting': 'consult', 'consultant': 'consult', 'consultants': 'consult',
    'analytics': 'analytic', 'analysis': 'analytic', 'analyzing': 'analytic',
    'optimization': 'optim', 'optimizer': 'optim',
    'security': 'secur', 'securing': 'secur', 'secure': 'secur',
    'marketing': 'market', 'marketers': 'market',
    'agencies': 'agency', 'services': 'service', 'companies': 'company',
    'providers': 'provider',
    'platforms': 'platform', 'systems': 'system', 'solutions': 'solution',
    'tools': 'tool', 'apps': 'app',
    'planning': 'plan', 'planner': 'plan', 'planners': 'plan',
    'reporting': 'report', 'reports': 'report',
    'builders': 'builder', 'building': 'build',
    'accounting': 'account', 'accounts': 'account', 'accountants': 'account',
    'recruiting': 'recruit', 'recruitment': 'recruit', 'recruiter': 'recruit',
    'engineering': 'engineer', 'engineers': 'engineer',
    'architecture': 'architect', 'architects': 'architect', 'architectural': 'architect',
    'translation': 'translat', 'translating': 'translat', 'translator': 'translat',
    'translators': 'translat',
    'investigation': 'investigat', 'investigators': 'investigat', 'investigator': 'investigat',
    'coaching': 'coach', 'coaches': 'coach',
    'training': 'train', 'trainer': 'train', 'trainers': 'train',
    'advisors': 'advisor', 'advisory': 'advisor',
    'lawyers': 'lawyer', 'attorneys': 'attorney',
    'firms': 'firm',
    'specialists': 'specialist',
    'insurance': 'insur',
    'compliance': 'complianc',
    'sustainability': 'sustain', 'sustainable': 'sustain',
    'environmental': 'environ',
    'writing': 'write', 'writer': 'write', 'writers': 'write',
    'editing': 'edit', 'editor': 'edit', 'editors': 'edit',
    'staffing': 'staff',
}

STOP = {
    'and', 'the', 'for', 'of', 'in', 'to', 'a', 'an', 'with', 'by', 'on',
    'is', 'are', 'or', 'its', 'it', 'as', 'at', 'from', 'be', 'has', 'have',
    'software', 'saas',
}

def tokenize(text):
    s = text.lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    result = set()
    for w in s.split():
        if len(w) <= 1 or w in STOP: continue
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

# Step 1: Read DB
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
        'id': row[0], 'name': row[1], 'slug': row[2], 'sort_order': row[3],
        'old_l3_name': row[4], 'old_l3_slug': row[5],
        'old_l2_name': row[6], 'old_l2_slug': row[7],
    })
conn.close()
print(f"Read {len(old_listing_types)} listing types from DB")

# Step 2: Read Excel
print(f"Reading {EXCEL} ...")
wb = openpyxl.load_workbook(EXCEL, read_only=True, data_only=True)
ws = wb[SHEET]

new_taxonomy = OrderedDict()
for i, row in enumerate(ws.iter_rows(values_only=True), 1):
    if i == 1: continue
    l2 = str(row[2]).strip() if row[2] else None
    l3 = str(row[3]).strip() if row[3] else None
    if not l2 or not l3: continue
    if l2 not in new_taxonomy: new_taxonomy[l2] = []
    new_taxonomy[l2].append(l3)
wb.close()

new_l3_entries = []
new_l3_by_slug = {}
for l2_name, l3_list in new_taxonomy.items():
    for l3_name in l3_list:
        l3_slug = slugify(l3_name)
        entry = {
            'l2_name': l2_name, 'l3_name': l3_name, 'l3_slug': l3_slug,
            'tokens': tokenize(l2_name) | tokenize(l3_name),
            'l3_tokens': tokenize(l3_name),
            'l2_tokens': tokenize(l2_name),
        }
        new_l3_entries.append(entry)
        new_l3_by_slug[l3_slug] = entry

print(f"New taxonomy: {len(new_taxonomy)} L2, {len(new_l3_entries)} L3")

# Step 3: Match
print("Matching ...")
assignments = defaultdict(list)
match_scores = []
manual_count = 0

for lt in old_listing_types:
    key = (lt['old_l2_name'], lt['old_l3_name'])
    if key in MANUAL_OVERRIDES:
        assignments[MANUAL_OVERRIDES[key]].append(lt)
        match_scores.append(-1)
        manual_count += 1
        continue

    parts = lt['name'].split(':', 1)
    l4_part = parts[0].strip()
    l5_part = parts[1].strip() if len(parts) > 1 else ''

    search_tokens = tokenize(lt['old_l2_name']) | tokenize(lt['old_l3_name']) | tokenize(l4_part) | tokenize(l5_part)
    l4_tokens = tokenize(l4_part)
    l5_tokens = tokenize(l5_part) if l5_part else set()
    old_l3_tokens = tokenize(lt['old_l3_name'])
    old_l2_tokens = tokenize(lt['old_l2_name'])

    best_score = -1
    best_match = None

    for entry in new_l3_entries:
        overlap = len(search_tokens & entry['tokens'])
        l4_l3_overlap = len(l4_tokens & entry['l3_tokens'])
        l5_l3_overlap = len(l5_tokens & entry['l3_tokens'])
        l3_l3_overlap = len(old_l3_tokens & entry['l3_tokens'])
        l2_l2_overlap = len(old_l2_tokens & entry['l2_tokens'])
        l3_l2_overlap = len(old_l3_tokens & entry['l2_tokens'])
        l2_boost = l2_l2_overlap * 4 if l2_l2_overlap >= 2 else l2_l2_overlap * 2

        score = (overlap * 2) + (l4_l3_overlap * 4) + (l5_l3_overlap * 3) + (l3_l3_overlap * 3) + l2_boost + (l3_l2_overlap * 4)

        if score > best_score:
            best_score = score
            best_match = entry

    match_scores.append(best_score)
    assignments[best_match['l3_slug']].append(lt)

real_scores = [s for s in match_scores if s >= 0]
avg_score = sum(real_scores) / len(real_scores) if real_scores else 0
min_score = min(real_scores) if real_scores else 0
max_score = max(real_scores) if real_scores else 0

print(f"Matching complete:")
print(f"  Total: {len(old_listing_types)}, Manual: {manual_count}, Algorithm: {len(old_listing_types) - manual_count}")
print(f"  New L3s used: {len(assignments)}, Unused: {len(new_l3_entries) - len(assignments)}")
print(f"  Score range: {min_score} - {max_score}, avg: {avg_score:.1f}")
print(f"  Zero-score: {sum(1 for s in real_scores if s == 0)}")

worst = sorted([(s, lt) for s, lt in zip(match_scores, old_listing_types) if s >= 0], key=lambda x: x[0])[:15]
print(f"\nLowest-scoring matches (bottom 15):")
for score, lt in worst:
    assigned_l3 = None
    for slug, lts in assignments.items():
        if lt in lts:
            assigned_l3 = slug
            break
    l3_name = new_l3_by_slug.get(assigned_l3, {}).get('l3_name', assigned_l3)
    print(f"  score={score:>2}  [{lt['old_l2_name']}/{lt['old_l3_name']}] {lt['name']}")
    print(f"         -> {l3_name}")

# Step 4: Generate SQL
print(f"\nGenerating SQL ...")
sql_lines = []
sql_lines.append("-- =================================================================")
sql_lines.append("-- Professional Services Listing Type Remapping")
sql_lines.append(f"-- {len(old_listing_types)} listing types -> {len(assignments)} new L3 categories")
sql_lines.append("-- Generated by remap-professional-services-listing-types.py")
sql_lines.append("-- =================================================================")
sql_lines.append("")
sql_lines.append("-- Run AFTER migration-professional-services-taxonomy.sql")
sql_lines.append("")

used_lt_slugs = set()
l3_slug_to_name = {e['l3_slug']: e['l3_name'] for e in new_l3_entries}
total_inserted = 0

for l3_slug in sorted(assignments.keys()):
    lts = assignments[l3_slug]
    l3_name = l3_slug_to_name.get(l3_slug, l3_slug)
    sql_lines.append(f"-- {l3_name} ({len(lts)} listing types)")

    for batch_start in range(0, len(lts), 20):
        batch = lts[batch_start:batch_start + 20]
        values = []
        for k, lt in enumerate(batch):
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

        sql_lines.append("INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES")
        sql_lines.append(",\n".join(values) + ";")

    sql_lines.append("")

sql_lines.append("-- === DONE ===")
sql_lines.append(f"-- Total: {total_inserted}")

os.makedirs(OUT_DIR, exist_ok=True)
with open(OUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines) + "\n")

print(f"\nWritten: {OUT_FILE}")
print(f"  {total_inserted} listing types in {len(assignments)} L3 categories")
