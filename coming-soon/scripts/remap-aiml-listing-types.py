"""Remap 2,050 AI & ML listing types from old L3 categories to new L3 categories.
Uses keyword matching: old L3 name + listing type L4 name → best matching new L3."""

import re, openpyxl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SEED_CATS = r'F:\infoWebWorld\launching\coming-soon\database\seed-categories-v3.sql'
SEED_LTS = r'F:\infoWebWorld\launching\coming-soon\database\seed-listing-types.sql'
XLSX = r'C:\Users\AADIL PARMAR\Downloads\AI-ML-Taxonomy-900plus.xlsx'
OUTPUT = r'F:\infoWebWorld\launching\coming-soon\database\migration-remap-aiml-listing-types.sql'

def slugify(name):
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

# 1. Parse old categories
cats = []
with open(SEED_CATS, 'r', encoding='utf-8') as f:
    for line in f:
        for cid, name, slug, level, pid in re.findall(r'\((\d+),\s*\'(.*?)\',\s*\'(.*?)\',\s*(\d+),\s*(\d+|NULL)', line):
            cats.append({'id': int(cid), 'name': name, 'slug': slug, 'level': int(level), 'parent_id': int(pid) if pid != 'NULL' else None})

# Find AI & ML old L3 IDs
ai_l1_id = next(c['id'] for c in cats if c['level'] == 1 and 'artificial' in c['name'].lower())
ai_l2_ids = set(c['id'] for c in cats if c['level'] == 2 and c['parent_id'] == ai_l1_id)
ai_l3s = {c['id']: c for c in cats if c['level'] == 3 and c['parent_id'] in ai_l2_ids}

# 2. Parse old listing types
lts = []
with open(SEED_LTS, 'r', encoding='utf-8') as f:
    for line in f:
        for lt_id, cat_id, name, slug, sort in re.findall(r'\((\d+),\s*(\d+),\s*\'(.*?)\',\s*\'(.*?)\',\s*(\d+)\)', line):
            lts.append({'id': int(lt_id), 'cat_id': int(cat_id), 'name': name, 'slug': slug, 'sort': int(sort)})

ai_lts = [lt for lt in lts if lt['cat_id'] in ai_l3s]
print(f'AI & ML listing types to remap: {len(ai_lts)}')

# 3. Read new L3 categories from Excel
wb = openpyxl.load_workbook(XLSX, read_only=True)
ws = wb['AI & ML Navigation']
new_l3s = []  # (l2_name, l3_name, l3_slug)
for row in ws.iter_rows(min_row=2, values_only=True):
    l2 = str(row[2] or '').strip()
    l3 = str(row[3] or '').strip()
    if l2 and l3:
        new_l3s.append({'l2': l2, 'l3': l3, 'slug': slugify(l3)})

print(f'New L3 categories: {len(new_l3s)}')

# 4. Build keyword index for new L3s
def tokenize(text):
    """Extract meaningful keywords from a name."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    stop = {'ai', 'and', 'the', 'for', 'of', 'in', 'to', 'a', 'an', 'with', 'by', 'on', 'is', 'are', 'or', 'tools', 'tool', 'apps', 'app', 'software'}
    return set(w for w in text.split() if w and w not in stop and len(w) > 1)

# For each new L3, build keyword set (from both L2 and L3 name)
new_l3_tokens = []
for nl3 in new_l3s:
    tokens = tokenize(nl3['l3']) | tokenize(nl3['l2'])
    new_l3_tokens.append(tokens)

# 5. Match each old listing type to best new L3
def find_best_l3(lt_name, old_l3_name):
    """Find the best matching new L3 for an old listing type."""
    # Get L4 part (before colon)
    colon = lt_name.find(':')
    l4 = lt_name[:colon].strip() if colon > 0 else lt_name
    l5 = lt_name[colon+1:].strip() if colon > 0 else ''

    # Build search tokens from: old L3 name + L4 + L5
    search = tokenize(old_l3_name) | tokenize(l4) | tokenize(l5)

    best_idx = 0
    best_score = -1

    for i, tokens in enumerate(new_l3_tokens):
        overlap = len(search & tokens)
        # Bonus for L3 name overlap with L4 name
        l4_overlap = len(tokenize(l4) & tokenize(new_l3s[i]['l3']))
        score = overlap * 2 + l4_overlap * 3

        if score > best_score:
            best_score = score
            best_idx = i

    return best_idx, best_score

# Map all listing types
mappings = []  # (lt, new_l3_slug, score)
unmapped = 0
for lt in ai_lts:
    old_l3 = ai_l3s.get(lt['cat_id'])
    old_l3_name = old_l3['name'] if old_l3 else ''
    idx, score = find_best_l3(lt['name'], old_l3_name)
    mappings.append((lt, new_l3s[idx], score))
    if score == 0:
        unmapped += 1

print(f'Mapped: {len(mappings) - unmapped}, Zero-score (fallback): {unmapped}')

# 6. Generate SQL
lines = []
lines.append('-- Remap AI & ML listing types to new L3 categories')
lines.append('-- 2,050 listing types → new L3 category IDs')
lines.append('-- Run AFTER migration-aiml-taxonomy-v2.sql')
lines.append('')

# Group by new L3 slug for cleaner SQL
from collections import defaultdict
by_l3 = defaultdict(list)
for lt, nl3, score in mappings:
    by_l3[nl3['slug']].append(lt)

for l3_slug, lt_list in sorted(by_l3.items()):
    l3_name = next(nl3['l3'] for nl3 in new_l3s if nl3['slug'] == l3_slug)
    lines.append(f'-- {l3_name} ({len(lt_list)} listing types)')

    # Batch insert
    for i in range(0, len(lt_list), 20):
        batch = lt_list[i:i+20]
        lines.append('INSERT INTO listing_types (category_id, name, slug, sort_order) VALUES')
        vals = []
        for j, lt in enumerate(batch):
            esc_name = lt['name'].replace("'", "''")
            sort = (i + j + 1) * 10
            vals.append(f"((SELECT id FROM categories WHERE slug = '{l3_slug}' AND level = 3 LIMIT 1), '{esc_name}', '{lt['slug']}', {sort})")
        lines.append(',\n'.join(vals) + ';')
    lines.append('')

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Written to: {OUTPUT}')
print(f'Total INSERT batches: {sum(1 for l in lines if l.startswith("INSERT"))}')
