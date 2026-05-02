import type { ReactNode } from 'react'

type Props = { icon: ReactNode; title: string; sub: string }

export default function StepHead({ icon, title, sub }: Props) {
  return (
    <div className="lf2-step-head">
      <div className="lf2-step-head-icon">{icon}</div>
      <h2 className="lf2-step-head-title">{title}</h2>
      <p className="lf2-step-head-sub">{sub}</p>
    </div>
  )
}
