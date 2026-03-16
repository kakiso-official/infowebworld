const STEPS = [
  {
    id: 'search',
    label: 'Find Listing',
    icon: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
  {
    id: 'verify',
    label: 'Verify',
    icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    id: 'plan',
    label: 'Select Plan',
    icon: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    id: 'details',
    label: 'Profile',
    icon: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    id: 'done',
    label: 'All Set',
    icon: <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  },
]

export default function ClaimStepper({ step }) {
  const progress = ((step) / (STEPS.length - 1)) * 100

  return (
    <div className="cl-stepper">
      <div className="cl-stepper-track">
        <div className="cl-stepper-track-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="cl-stepper-inner">
        {STEPS.map((s, i) => {
          const isActive = step === i
          const isCompleted = step > i
          const cls = `cl-step${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`

          return (
            <div key={s.id} className={cls}>
              <div className="cl-step-bubble">
                {isCompleted ? (
                  <svg className="cl-step-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span className="cl-step-icon">{s.icon}</span>
                )}
                {isActive && <span className="cl-step-pulse" />}
              </div>
              <span className="cl-step-label">{s.label}</span>
              {i < STEPS.length - 1 && (
                <div className="cl-step-connector">
                  <div className={`cl-step-connector-fill${isCompleted ? ' filled' : ''}`} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="cl-stepper-progress">
        <div className="cl-stepper-progress-fill" style={{ width: `${progress}%` }} />
        <div className="cl-stepper-progress-glow" style={{ left: `${progress}%` }} />
      </div>
    </div>
  )
}
