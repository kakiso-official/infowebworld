"""Generate SQL migration for AI & ML taxonomy v2 (43 L2 + 1298 L3)"""
import re
import openpyxl

XLSX = r'C:\Users\AADIL PARMAR\Downloads\AI-ML-Taxonomy-900plus.xlsx'
OUTPUT = r'F:\infoWebWorld\launching\coming-soon\database\migration-aiml-taxonomy-v2.sql'
L1_SLUG = 'artificial-intelligence-ml'

def slugify(name):
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

# Read Excel
wb = openpyxl.load_workbook(XLSX, read_only=True)
ws = wb['AI & ML Navigation']

l2_order = []
l2_l3s = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    l2 = str(row[2] or '').strip()
    l3 = str(row[3] or '').strip()
    if not l2 or not l3:
        continue
    if l2 not in l2_l3s:
        l2_l3s[l2] = []
        l2_order.append(l2)
    l2_l3s[l2].append(l3)

# Slug tracker
all_slugs = set()
def unique_slug(name, parent_name=None):
    s = slugify(name)
    if s not in all_slugs:
        all_slugs.add(s)
        return s
    if parent_name:
        s2 = slugify(f'{name} {parent_name}')
        if s2 not in all_slugs:
            all_slugs.add(s2)
            return s2
    i = 2
    while f'{s}-{i}' in all_slugs:
        i += 1
    s3 = f'{s}-{i}'
    all_slugs.add(s3)
    return s3

def esc(s):
    return s.replace("'", "''")

lines = []
lines.append('-- AI & ML Taxonomy Migration V2: 43 L2 + 1298 L3')
lines.append('-- Run in phpMyAdmin ONE SECTION AT A TIME')
lines.append('-- Back up the categories table before running!')
lines.append('')

# Step 1: Clean SEO content
lines.append('-- ═══ STEP 1: Delete orphaned SEO content for old AI&ML L2/L3 ═══')
lines.append('')
lines.append(f"DELETE sc FROM category_seo_content sc")
lines.append(f"JOIN categories c ON c.id = sc.category_id")
lines.append(f"WHERE c.level IN (2, 3)")
lines.append(f"AND c.id IN (")
lines.append(f"  SELECT id FROM (")
lines.append(f"    SELECT c2.id FROM categories c2 WHERE c2.level = 2 AND c2.parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1)")
lines.append(f"    UNION")
lines.append(f"    SELECT c3.id FROM categories c3 JOIN categories c2 ON c3.parent_id = c2.id WHERE c2.level = 2 AND c2.parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1)")
lines.append(f"  ) AS ids")
lines.append(f");")
lines.append('')

# Step 2: Nullify submissions
lines.append('-- ═══ STEP 2: Nullify submission category_id for AI&ML (preserves listings) ═══')
lines.append('')
lines.append(f"UPDATE submissions SET category_id = NULL")
lines.append(f"WHERE category_id IN (")
lines.append(f"  SELECT id FROM (")
lines.append(f"    SELECT c3.id FROM categories c3 JOIN categories c2 ON c3.parent_id = c2.id WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1)")
lines.append(f"    UNION")
lines.append(f"    SELECT c2.id FROM categories c2 WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1)")
lines.append(f"  ) AS ids")
lines.append(f");")
lines.append('')

# Step 3: Delete listing types
lines.append('-- ═══ STEP 3: Delete listing types for old AI&ML L3s ═══')
lines.append('')
lines.append(f"DELETE lt FROM listing_types lt")
lines.append(f"JOIN categories c3 ON lt.category_id = c3.id")
lines.append(f"JOIN categories c2 ON c3.parent_id = c2.id")
lines.append(f"WHERE c2.parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1);")
lines.append('')

# Step 4: Delete old L3
lines.append('-- ═══ STEP 4: Delete old L3 categories ═══')
lines.append('')
lines.append(f"DELETE FROM categories WHERE level = 3 AND parent_id IN (")
lines.append(f"  SELECT id FROM (SELECT c2.id FROM categories c2 WHERE c2.level = 2 AND c2.parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1)) AS ids")
lines.append(f");")
lines.append('')

# Step 5: Delete old L2
lines.append('-- ═══ STEP 5: Delete old L2 categories ═══')
lines.append('')
lines.append(f"DELETE FROM categories WHERE level = 2 AND parent_id = (SELECT id FROM (SELECT id FROM categories WHERE slug = '{L1_SLUG}' AND level = 1) AS tmp);")
lines.append('')

# Step 6: Insert new L2s
lines.append('-- ═══ STEP 6: Insert 43 new L2 categories ═══')
lines.append('')
l2_slugs = {}
for i, l2_name in enumerate(l2_order):
    slug = unique_slug(l2_name)
    l2_slugs[l2_name] = slug
    sort = (i + 1) * 10
    lines.append(f"INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)")
    lines.append(f"SELECT '{esc(l2_name)}', '{slug}', 2, id, 1, 1, 1, {sort}")
    lines.append(f"FROM categories WHERE slug = '{L1_SLUG}' AND level = 1;")
lines.append('')

# Step 7: Insert new L3s
lines.append('-- ═══ STEP 7: Insert 1298 new L3 subcategories ═══')
lines.append('')
for l2_name in l2_order:
    l2_slug = l2_slugs[l2_name]
    lines.append(f'-- {l2_name} ({len(l2_l3s[l2_name])} L3s)')
    for j, l3_name in enumerate(l2_l3s[l2_name]):
        slug = unique_slug(l3_name, l2_name)
        sort = (j + 1) * 10
        lines.append(f"INSERT INTO categories (name, slug, level, parent_id, is_active, is_launched, is_navigation, sort_order)")
        lines.append(f"SELECT '{esc(l3_name)}', '{slug}', 3, id, 1, 1, 1, {sort}")
        lines.append(f"FROM categories WHERE slug = '{l2_slug}' AND level = 2;")
    lines.append('')

# Step 8: Reassign submissions
lines.append('-- ═══ STEP 8: Reassign AI chatbot submissions to new L3 ═══')
lines.append('')
lines.append(f"UPDATE submissions SET category_id = (SELECT id FROM categories WHERE slug = 'all-purpose-ai-chat-companions' AND level = 3 LIMIT 1)")
lines.append(f"WHERE category_id IS NULL AND company_name IN ('ChatGPT by OpenAI', 'Intercom', 'Tidio', 'Ada', 'Botpress');")
lines.append('')

# Verify
lines.append('-- ═══ VERIFY ═══')
lines.append(f"-- SELECT level, COUNT(*) FROM categories")
lines.append(f"-- WHERE parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}')")
lines.append(f"-- OR parent_id IN (SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = '{L1_SLUG}'))")
lines.append(f"-- GROUP BY level;")
lines.append(f"-- Expected: level 2 = 43, level 3 = 1298")

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'L2 categories: {len(l2_order)}')
print(f'L3 subcategories: {sum(len(v) for v in l2_l3s.values())}')
print(f'Unique slugs: {len(all_slugs)}')
print(f'Written to: {OUTPUT}')
