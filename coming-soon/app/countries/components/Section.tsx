import type { ReactNode } from 'react'

/* Section shell for the country pages: H2 + optional sub + optional
   right-aligned action, then content. `tone` alternates the bands
   (white / the palette wash) the same way the homepage sections do. */
export default function Section({
  id, title, sub, action, tone = 'white', children, wide = false,
}: {
  id: string
  title: string
  sub?: ReactNode
  action?: ReactNode
  tone?: 'white' | 'wash'
  wide?: boolean
  children: ReactNode
}) {
  return (
    <section id={id} className={`cdir-sec cdir-sec--${tone}`} aria-labelledby={`${id}-h`}>
      <div className={'cdir-sec-inner' + (wide ? ' cdir-sec-inner--wide' : '')}>
        <header className="cdir-sec-head">
          <div className="cdir-sec-head-text">
            <h2 id={`${id}-h`} className="cdir-sec-title">{title}</h2>
            {sub ? <p className="cdir-sec-sub">{sub}</p> : null}
          </div>
          {action ? <div className="cdir-sec-action">{action}</div> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
