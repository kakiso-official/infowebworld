const STEPS = [
  { id: 'business', label: 'Business Info' },
  { id: 'media', label: 'Media & Branding' },
  { id: 'product', label: 'Product Details' },
  { id: 'company', label: 'Company' },
  { id: 'review', label: 'Review & Submit' },
]

export default function StepProgress({ step, totalSteps, goStep }) {
  const progress = ((step + 1) / totalSteps) * 100

  return (
    <div className="db-card db-full">
      <div className="db-card-body" style={{ padding: '16px 20px' }}>
        <div className="dcl-steps">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`dcl-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
              onClick={() => i <= step && goStep(i)}
            >
              <div className="dcl-step-num">
                {i < step
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span>{i + 1}</span>
                }
              </div>
              <span className="dcl-step-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="dcl-progress">
          <div className="dcl-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

export { STEPS }
