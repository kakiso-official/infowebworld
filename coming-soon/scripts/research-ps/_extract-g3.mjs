/* Extracts the HR/Coaching/Training (g3) company array from the persisted
   agent tool-result file → scripts/research-ps/g3.json. Run once at merge time.
   Robust: finds the first '[' that begins an array-of-objects, then string-aware
   bracket-matches its close (ignores any prose before/after). */
import { readFileSync, writeFileSync } from 'node:fs'

const SRC = String.raw`C:\Users\AADIL PARMAR\.claude\projects\F--infoWebWorld-launching-coming-soon\d14e8fa5-aacd-4267-9c17-68c137a5c96c\tool-results\toolu_01S24gaXMhq8wMPEmmSHKU6A.json`

let text
try {
  const raw = readFileSync(SRC, 'utf8')
  let j = null
  try { j = JSON.parse(raw) } catch { /* not json-wrapped */ }
  if (Array.isArray(j)) text = j.map((x) => (x && x.text) || '').join('\n')
  else if (j && j.text) text = j.text
  else text = raw
} catch (e) { console.error('read failed:', e.message); process.exit(1) }

/* find first '[' immediately followed (ws-skipped) by '{' = array-of-objects */
let start = -1
for (let i = 0; i < text.length; i++) {
  if (text[i] !== '[') continue
  let k = i + 1
  while (k < text.length && /\s/.test(text[k])) k++
  if (text[k] === '{') { start = i; break }
}
if (start < 0) { console.error('no array-of-objects found in g3 source'); process.exit(1) }

/* string-aware bracket match to the closing ']' */
let depth = 0, inStr = false, esc = false, end = -1
for (let i = start; i < text.length; i++) {
  const ch = text[i]
  if (inStr) {
    if (esc) esc = false
    else if (ch === '\\') esc = true
    else if (ch === '"') inStr = false
  } else if (ch === '"') inStr = true
  else if (ch === '[') depth++
  else if (ch === ']') { depth--; if (depth === 0) { end = i; break } }
}
if (end < 0) { console.error('unbalanced array in g3 source'); process.exit(1) }

let arr
try { arr = JSON.parse(text.slice(start, end + 1)) } catch (e) { console.error('parse failed:', e.message); process.exit(1) }
writeFileSync(new URL('./g3.json', import.meta.url), JSON.stringify(arr))
console.log('g3 extracted:', arr.length, 'firms')
