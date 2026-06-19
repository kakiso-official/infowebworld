/** Structural check: every INSERT's column count must equal its value count.
 *  Tokenizes respecting MySQL single-quoted strings ('' = escaped quote) and
 *  paren/bracket/brace nesting. Catches the one failure mode that breaks a paste. */
import { readFileSync } from 'node:fs'

const FILES = [
  'database/seed-xlsx-aiml-products.sql',
  'database/seed-xlsx-companies.sql',
  'database/seed-xlsx-local-businesses.sql',
]

function splitTopLevel(s) {
  const out = []; let depth = 0, inStr = false, cur = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (inStr) {
      if (ch === "'") { if (s[i + 1] === "'") { cur += "''"; i++; continue } inStr = false; cur += ch; continue }
      cur += ch; continue
    }
    if (ch === "'") { inStr = true; cur += ch; continue }
    if (ch === '(' || ch === '[' || ch === '{') { depth++; cur += ch; continue }
    if (ch === ')' || ch === ']' || ch === '}') { depth--; cur += ch; continue }
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue }
    cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

// scan for the statement-ending ; at depth 0, not in a string
function findStmtEnd(s, start) {
  let depth = 0, inStr = false
  for (let i = start; i < s.length; i++) {
    const ch = s[i]
    if (inStr) { if (ch === "'") { if (s[i + 1] === "'") { i++; continue } inStr = false } continue }
    if (ch === "'") { inStr = true; continue }
    if (ch === '(' || ch === '[' || ch === '{') depth++
    else if (ch === ')' || ch === ']' || ch === '}') depth--
    else if (ch === ';' && depth === 0) return i
  }
  return -1
}

let totalInserts = 0, mismatches = 0
const MARK = 'INSERT INTO submissions ('
const SEL = ') SELECT'
for (const file of FILES) {
  const src = readFileSync(file, 'utf8')
  let idx = 0, n = 0
  while ((idx = src.indexOf(MARK, idx)) !== -1) {
    const colStart = idx + MARK.length
    const selIdx = src.indexOf(SEL, colStart)
    const colSection = src.slice(colStart, selIdx)
    const valStart = selIdx + SEL.length
    const end = findStmtEnd(src, valStart)
    const valSection = src.slice(valStart, end)
    const cols = splitTopLevel(colSection)
    const vals = splitTopLevel(valSection)
    n++; totalInserts++
    if (cols.length !== vals.length) {
      mismatches++
      const name = (src.slice(idx - 80, idx).match(/-- ([^\n(]+)/g) || []).pop() || `#${n}`
      console.log(`  ❌ ${file} ${name}: ${cols.length} cols vs ${vals.length} vals`)
    }
    idx = end
  }
  console.log(`${file}: ${n} inserts checked`)
}
console.log(`\n=== ${totalInserts} inserts, ${mismatches} mismatches ===`)
if (mismatches === 0) console.log('✅ every INSERT has matching column/value counts')
