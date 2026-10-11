/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - a tiny syntax tokenizer (spec 3.18).

   Splits shell, JavaScript, Python or JSON text into token spans for the
   code blocks: the server renders them (no client highlighter ships) and
   the Try it panel reuses the JSON tokenizer on live responses.

   Token classes map to the --dv-code-* colours in code.css:
     tk-cmd  shell command          tk-flag CLI flag, HTTP method
     tk-str  string                 tk-kw   keyword, true/false/null
     tk-num  number                 tk-fn   function or method call
     tk-key  object key, keyword arg tk-com  comment

   Rules: the token texts always join back to the exact input (copy never
   depends on this), input that does not parse (a truncated response, an
   unterminated string) still tokenizes, and every pass is linear so a
   64 KB response is cheap. Pure: no DOM, no React.
   ═══════════════════════════════════════════════════════════════════════ */

export type HighlightLang = 'shell' | 'js' | 'python' | 'json'

export type TokenClass = 'tk-cmd' | 'tk-flag' | 'tk-str' | 'tk-kw' | 'tk-num' | 'tk-fn' | 'tk-key' | 'tk-com'

export interface Token {
  text: string
  /** null = plain text. */
  cls: TokenClass | null
}

export const HIGHLIGHT_LANGS: readonly HighlightLang[] = ['shell', 'js', 'python', 'json']

export function isHighlightLang(value: unknown): value is HighlightLang {
  return typeof value === 'string' && (HIGHLIGHT_LANGS as readonly string[]).includes(value)
}

/* Collects tokens, merging neighbours of the same class. */
class TokenSink {
  readonly tokens: Token[] = []

  push(text: string, cls: TokenClass | null): void {
    if (!text) return
    const last = this.tokens[this.tokens.length - 1]
    if (last && last.cls === cls) last.text += text
    else this.tokens.push({ text, cls })
  }
}

/* Index just past a quoted string that opens at `start` (backslash escapes
   honoured). Stops at end of input, and at a newline when `singleLine`. */
function scanQuoted(src: string, start: number, quote: string, singleLine: boolean): number {
  let i = start + quote.length
  while (i < src.length) {
    const c = src[i]
    if (c === '\\') { i += 2; continue }
    if (singleLine && c === '\n') return i
    if (src.startsWith(quote, i)) return i + quote.length
    i++
  }
  return src.length
}

/* Index of the first character at or after `from` that is not a space or
   tab (and not a newline when `newlines`). */
function skipSpace(src: string, from: number, newlines: boolean): number {
  let i = from
  while (i < src.length) {
    const c = src[i]
    if (c === ' ' || c === '\t' || c === '\r' || (newlines && c === '\n')) i++
    else break
  }
  return i
}

const NUMBER_RE = /(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*(?:\.[\d_]*)?|\.\d[\d_]*)(?:[eE][+-]?\d+)?)n?/y
const IDENT_RE = /[A-Za-z_$][\w$]*/y
const WORD_CHAR_RE = /[\w$]/

function matchAt(re: RegExp, src: string, i: number): string | null {
  re.lastIndex = i
  const m = re.exec(src)
  return m ? m[0] : null
}

/* ── Shell ───────────────────────────────────────────────────────────── */

const HTTP_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
const SHELL_OPERATORS = '|&;()<>'

function tokenizeShell(src: string): Token[] {
  const out = new TokenSink()
  let atCommand = true
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '\n') {
      out.push(c, null)
      /* A line ending in '\' continues the same command. */
      if (src[i - 1] !== '\\') atCommand = true
      i++
      continue
    }
    if (c === ' ' || c === '\t' || c === '\r') { out.push(c, null); i++; continue }
    if (c === '#' && (i === 0 || /\s/.test(src[i - 1]))) {
      const end = src.indexOf('\n', i)
      const stop = end === -1 ? src.length : end
      out.push(src.slice(i, stop), 'tk-com')
      i = stop
      continue
    }
    if (c === '"' || c === "'") {
      /* Single quotes take no escapes in sh; double quotes do. */
      const end = c === "'" ? (src.indexOf("'", i + 1) + 1 || src.length) : scanQuoted(src, i, '"', false)
      out.push(src.slice(i, end), 'tk-str')
      atCommand = false
      i = end
      continue
    }
    if (SHELL_OPERATORS.includes(c)) {
      out.push(c, null)
      if (c !== '>' && c !== '<' && c !== ')') atCommand = true
      i++
      continue
    }
    if (c === '\\') { out.push(src.slice(i, i + 2), null); i += 2; continue }

    let j = i
    while (j < src.length && !/[\s"']/.test(src[j]) && !SHELL_OPERATORS.includes(src[j])) j++
    const word = src.slice(i, j)
    let cls: TokenClass | null = null
    if (atCommand && !word.includes('=')) { cls = 'tk-cmd'; atCommand = false }
    else if (atCommand) cls = null                     /* VAR=value before a command */
    else if (/^--?[A-Za-z]/.test(word)) cls = 'tk-flag'
    else if (HTTP_METHODS.has(word)) cls = 'tk-flag'
    else if (/^\d+(?:\.\d+)?$/.test(word)) cls = 'tk-num'
    out.push(word, cls)
    i = j
  }
  return out.tokens
}

/* ── JavaScript ──────────────────────────────────────────────────────── */

const JS_KEYWORDS = new Set([
  'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'delete', 'do',
  'else', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'if', 'import', 'in',
  'instanceof', 'let', 'new', 'null', 'of', 'return', 'static', 'super', 'switch', 'this', 'throw', 'true',
  'try', 'typeof', 'undefined', 'var', 'void', 'while', 'yield',
])

function tokenizeJs(src: string): Token[] {
  const out = new TokenSink()
  /* Last non-space character outside strings and comments: tells an
     object key ('{ a: 1' / ', b: 2' / '(c: 3') from a ternary branch. */
  let prev = ''
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '/' && src[i + 1] === '/') {
      const end = src.indexOf('\n', i)
      const stop = end === -1 ? src.length : end
      out.push(src.slice(i, stop), 'tk-com')
      i = stop
      continue
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      const stop = end === -1 ? src.length : end + 2
      out.push(src.slice(i, stop), 'tk-com')
      i = stop
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      const end = scanQuoted(src, i, c, c !== '`')
      const next = src[skipSpace(src, end, false)]
      out.push(src.slice(i, end), next === ':' && (prev === '{' || prev === ',') ? 'tk-key' : 'tk-str')
      prev = c
      i = end
      continue
    }
    const startsNumber = /\d/.test(c) || (c === '.' && /\d/.test(src[i + 1] ?? ''))
    if (startsNumber && !WORD_CHAR_RE.test(src[i - 1] ?? '')) {
      const num = matchAt(NUMBER_RE, src, i)
      if (num) { out.push(num, 'tk-num'); prev = '0'; i += num.length; continue }
    }
    const ident = matchAt(IDENT_RE, src, i)
    if (ident) {
      const after = skipSpace(src, i + ident.length, false)
      let cls: TokenClass | null = null
      if (JS_KEYWORDS.has(ident) && src[i - 1] !== '.') cls = 'tk-kw'
      else if (src[after] === '(') cls = 'tk-fn'
      else if (src[after] === ':' && src[after + 1] !== ':' && (prev === '{' || prev === ',' || prev === '(')) cls = 'tk-key'
      out.push(ident, cls)
      prev = 'a'
      i += ident.length
      continue
    }
    out.push(c, null)
    if (!/\s/.test(c)) prev = c
    i++
  }
  return out.tokens
}

/* ── Python ──────────────────────────────────────────────────────────── */

const PY_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def',
  'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
])

const PY_STRING_START_RE = /(?:[rRbBuUfF]{1,2})?(?:"""|'''|"|')/y

function tokenizePython(src: string): Token[] {
  const out = new TokenSink()
  let depth = 0
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '#') {
      const end = src.indexOf('\n', i)
      const stop = end === -1 ? src.length : end
      out.push(src.slice(i, stop), 'tk-com')
      i = stop
      continue
    }
    const opener = WORD_CHAR_RE.test(src[i - 1] ?? '') ? null : matchAt(PY_STRING_START_RE, src, i)
    if (opener) {
      const quote = opener.endsWith('"""') ? '"""' : opener.endsWith("'''") ? "'''" : opener[opener.length - 1]
      const end = scanQuoted(src, i + opener.length - quote.length, quote, quote.length === 1)
      out.push(src.slice(i, end), 'tk-str')
      i = end
      continue
    }
    if (/\d/.test(c) && !WORD_CHAR_RE.test(src[i - 1] ?? '')) {
      const num = matchAt(NUMBER_RE, src, i)
      if (num) { out.push(num, 'tk-num'); i += num.length; continue }
    }
    const ident = matchAt(IDENT_RE, src, i)
    if (ident && !ident.includes('$')) {
      const after = skipSpace(src, i + ident.length, false)
      let cls: TokenClass | null = null
      if (PY_KEYWORDS.has(ident) && src[i - 1] !== '.') cls = 'tk-kw'
      else if (src[after] === '(') cls = 'tk-fn'
      else if (depth > 0 && src[after] === '=' && src[after + 1] !== '=') cls = 'tk-key'
      out.push(ident, cls)
      i += ident.length
      continue
    }
    if (c === '(' || c === '[' || c === '{') depth++
    else if ((c === ')' || c === ']' || c === '}') && depth > 0) depth--
    out.push(c, null)
    i++
  }
  return out.tokens
}

/* ── JSON ────────────────────────────────────────────────────────────── */

const JSON_NUMBER_RE = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y
const JSON_LITERAL_RE = /true|false|null/y

function tokenizeJson(src: string): Token[] {
  const out = new TokenSink()
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '"') {
      /* Raw newlines are not allowed inside JSON strings: stopping there
         keeps a truncated response from colouring everything after it. */
      const end = scanQuoted(src, i, '"', true)
      out.push(src.slice(i, end), src[skipSpace(src, end, true)] === ':' ? 'tk-key' : 'tk-str')
      i = end
      continue
    }
    if (c === '-' || (c >= '0' && c <= '9')) {
      const num = matchAt(JSON_NUMBER_RE, src, i)
      if (num) { out.push(num, 'tk-num'); i += num.length; continue }
    }
    if (c === 't' || c === 'f' || c === 'n') {
      const lit = matchAt(JSON_LITERAL_RE, src, i)
      if (lit) { out.push(lit, 'tk-kw'); i += lit.length; continue }
    }
    out.push(c, null)
    i++
  }
  return out.tokens
}

/* ── Public API ──────────────────────────────────────────────────────── */

/** Token spans for `code`. Joining every token's text gives back `code`. */
export function tokenize(code: string, lang: HighlightLang): Token[] {
  switch (lang) {
    case 'shell': return tokenizeShell(code)
    case 'js': return tokenizeJs(code)
    case 'python': return tokenizePython(code)
    case 'json': return tokenizeJson(code)
    default: return code ? [{ text: code, cls: null }] : []
  }
}

/** tokenize() split into lines (no '\n' in any token), for renderers that
 *  draw one element per line, e.g. to put a '$' prompt before each
 *  command. An empty input gives one empty line. */
export function tokenizeLines(code: string, lang: HighlightLang): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokenize(code, lang)) {
    const parts = token.text.split('\n')
    parts.forEach((part, n) => {
      if (n > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ text: part, cls: token.cls })
    })
  }
  return lines
}

/** A JSON text pretty-printed with 2-space indents, or null when it does
 *  not parse (e.g. a response cut at 64 KB): show it as-is then. */
export function prettyJson(raw: string): string | null {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return null
  }
}
