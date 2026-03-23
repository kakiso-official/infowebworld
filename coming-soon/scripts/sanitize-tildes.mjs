/**
 * Post-build script: replaces ~ (tilde) in filenames and all references.
 *
 * cPanel file managers mangle tildes during zip extraction, causing 404s
 * for Next.js Turbopack chunks that use ~ in their names.
 *
 * Run after `next build`:  node scripts/sanitize-tildes.mjs
 */
import { readdir, rename, readFile, writeFile, stat } from 'fs/promises'
import { join, basename, dirname } from 'path'

const OUT = 'out'
const FROM = '~'
const TO = '-t-'

// ── collect every file path under a directory ──
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const paths = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) paths.push(...(await walk(full)))
    else paths.push(full)
  }
  return paths
}

// ── 1. rename files (deepest first so parent dirs still resolve) ──
async function renameFiles(files) {
  const renames = new Map() // oldBasename → newBasename

  // Sort deepest-first so child renames happen before parent dir renames
  const toRename = files
    .filter(f => basename(f).includes(FROM))
    .sort((a, b) => b.split(/[\\/]/).length - a.split(/[\\/]/).length)

  for (const oldPath of toRename) {
    const dir = dirname(oldPath)
    const oldName = basename(oldPath)
    const newName = oldName.replaceAll(FROM, TO)
    const newPath = join(dir, newName)

    await rename(oldPath, newPath)
    renames.set(oldName, newName)
  }

  return renames
}

// ── 2. update references inside text files ──
async function updateReferences(files, renames) {
  const textExts = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt'])

  // Build a single regex that matches any old filename
  const oldNames = [...renames.keys()].map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!oldNames.length) return 0

  const re = new RegExp(oldNames.join('|'), 'g')
  let touched = 0

  // Re-walk because filenames changed
  const current = await walk(OUT)

  for (const f of current) {
    const ext = f.slice(f.lastIndexOf('.')).toLowerCase()
    if (!textExts.has(ext)) continue

    const src = await readFile(f, 'utf8')
    const out = src.replace(re, m => renames.get(m) ?? m)
    if (out !== src) {
      await writeFile(f, out, 'utf8')
      touched++
    }
  }
  return touched
}

// ── main ──
const files = await walk(OUT)
const tildeCount = files.filter(f => basename(f).includes(FROM)).length

if (!tildeCount) {
  console.log('✓ No tildes found — nothing to do.')
  process.exit(0)
}

console.log(`Found ${tildeCount} files with ~ in their names. Sanitizing...`)

const renames = await renameFiles(files)
console.log(`  Renamed ${renames.size} files  (~ → ${TO})`)

const touched = await updateReferences(files, renames)
console.log(`  Updated references in ${touched} text files`)
console.log('✓ Done — safe to zip and upload.')
