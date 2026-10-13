/* ═══════════════════════════════════════════════════════════════════════════
   Tiny in-memory structures for the collector. The app runs as ONE
   long-lived Node container, so module memory survives between requests;
   both structures are bounded so a traffic spike (or an attack) can only
   cost a fixed amount of memory.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Map with a size cap (least recently used goes first) and per-entry TTL. */
export class LruCache<V> {
  private map = new Map<string, { value: V; expires: number }>()

  constructor(private readonly max: number, private readonly ttlMs: number) {}

  /** undefined = not cached (a cached `null` is a remembered "none"). */
  get(key: string): V | undefined {
    const entry = this.map.get(key)
    if (!entry) return undefined
    if (entry.expires <= Date.now()) {
      this.map.delete(key)
      return undefined
    }
    /* Re-insert so Map order tracks recency. */
    this.map.delete(key)
    this.map.set(key, entry)
    return entry.value
  }

  set(key: string, value: V, ttlMs = this.ttlMs): void {
    this.map.delete(key)
    this.map.set(key, { value, expires: Date.now() + ttlMs })
    if (this.map.size > this.max) {
      const oldest = this.map.keys().next()
      if (!oldest.done) this.map.delete(oldest.value)
    }
  }

  delete(key: string): void {
    this.map.delete(key)
  }

  get size(): number {
    return this.map.size
  }
}

/** Approximate sliding-window counter per key (the classic two-window
    estimate: the previous window weighted by how much of it still overlaps
    the last `windowMs`). O(1) per hit, two numbers per key. */
export class SlidingWindowCounter {
  private map = new Map<string, { start: number; cur: number; prev: number }>()
  private lastSweep = Date.now()

  constructor(private readonly windowMs: number, private readonly maxKeys: number) {}

  /** Adds `n` for `key`; returns the estimated count over the last window. */
  hit(key: string, n: number, now = Date.now()): number {
    const start = now - (now % this.windowMs)
    this.sweep(now, start)
    let e = this.map.get(key)
    if (!e) {
      if (this.map.size >= this.maxKeys * 2) this.map.clear()
      e = { start, cur: 0, prev: 0 }
      this.map.set(key, e)
    } else if (e.start !== start) {
      e.prev = e.start === start - this.windowMs ? e.cur : 0
      e.cur = 0
      e.start = start
    }
    e.cur += n
    const overlap = 1 - (now - start) / this.windowMs
    return e.prev * overlap + e.cur
  }

  private sweep(now: number, start: number): void {
    if (now - this.lastSweep < this.windowMs) return
    this.lastSweep = now
    for (const [key, e] of this.map) {
      if (e.start < start - this.windowMs) this.map.delete(key)
    }
    /* Still too many keys (a flood of distinct IPs): start over rather
       than grow without bound. Fails open for at most one window. */
    if (this.map.size > this.maxKeys) this.map.clear()
  }
}
