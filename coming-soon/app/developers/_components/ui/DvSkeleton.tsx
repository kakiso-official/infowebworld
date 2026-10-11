/* ═══════════════════════════════════════════════════════════════════════
   Loading skeleton (spec 4.13) for client islands only (search
   suggestions, the Try it panel); server pages never ship skeletons.
   Shimmer stops under reduced motion. Hidden from assistive tech: the
   island announces its own busy state.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvSkeletonProps {
  /** 'lines': text lines; 'rows': avatar + two lines per row. */
  variant?: 'lines' | 'rows'
  count?: number
  /** On navy surfaces (the Try it response area). */
  dark?: boolean
  className?: string
}

/* Varied widths read as text, not as a bar chart. */
const WIDTHS = ['92%', '78%', '85%', '64%', '88%', '72%']

export default function DvSkeleton({ variant = 'lines', count = 3, dark = false, className }: DvSkeletonProps) {
  const cls = `dv-skel${dark ? ' dv-skel--dark' : ''}${className ? ` ${className}` : ''}`
  return (
    <div className={cls} aria-hidden="true">
      {Array.from({ length: count }, (_, i) =>
        variant === 'rows' ? (
          <div key={i} className="dv-skel-row">
            <span className="dv-skel-dot" />
            <span className="dv-skel-text">
              <span className="dv-skel-line" style={{ width: WIDTHS[i % WIDTHS.length] }} />
              <span className="dv-skel-line" style={{ width: '42%', height: 10 }} />
            </span>
          </div>
        ) : (
          <span key={i} className="dv-skel-line" style={{ width: WIDTHS[i % WIDTHS.length] }} />
        ),
      )}
    </div>
  )
}
