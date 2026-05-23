"""Walk the codebase and find any reference to a dead old AI/ML or
software-saas slug (slugs that used to exist in the DB but no longer do
after the v3 / v2 taxonomy rebuilds).

Excludes the generated taxonomy file, migration SQL, exports/, and the
scripts/ folder itself.

Run:  python scripts/find-dead-slug-refs.py
"""
import os
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

dead = set(open("exports/dead-slugs.txt", "r", encoding="utf-8").read().split())
print(f"Dead slug set: {len(dead)}")

SKIP_FILES = {"categories-data.ts", "dead-slugs.txt"}
SKIP_DIRS = {"node_modules", ".git", ".next", "exports", "scripts", "database"}

# Pattern: any token that looks like a slug, sitting inside quotes OR after / in a URL,
# OR as a bare segment between slashes.
PAT = re.compile(r"""(?:['"`/])([a-z][a-z0-9-]{3,})(?=['"`/?#\s)\]}>,;:]|$)""")

hits = []
for base in ["app", "lib"]:
    if not os.path.isdir(base):
        continue
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if f in SKIP_FILES:
                continue
            if not f.endswith((".ts", ".tsx", ".css", ".json", ".mjs", ".js")):
                continue
            p = os.path.join(root, f).replace(os.sep, "/")
            try:
                txt = open(p, "r", encoding="utf-8", errors="ignore").read()
            except Exception:
                continue
            for m in PAT.finditer(txt):
                s = m.group(1)
                if s in dead:
                    line = txt[: m.start()].count("\n") + 1
                    hits.append((p, line, s))

# Group by file
from collections import defaultdict
by_file = defaultdict(list)
for p, ln, s in hits:
    by_file[p].append((ln, s))

print(f"\nFiles with dead-slug references: {len(by_file)}\n")
for p, lst in sorted(by_file.items()):
    print(f"=== {p} ({len(lst)} hit{'s' if len(lst) != 1 else ''}) ===")
    seen = set()
    for ln, s in lst:
        if (ln, s) in seen:
            continue
        seen.add((ln, s))
        print(f"  line {ln}: {s!r}")
    print()

print(f"Total references found: {len(hits)}")
