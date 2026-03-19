import { useNavigate } from 'react-router-dom'
import { STEPS } from './StepProgress'

export default function StepNavigation({ step, setStep, onSubmit }) {
  const navigate = useNavigate()

  const goStep = (s) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const next = () => goStep(Math.min(step + 1, STEPS.length - 1))
  const prev = () => goStep(Math.max(step - 1, 0))

  return (
    <div className="dcl-nav">
      <div className="dcl-nav-left">
        {step > 0 && (
          <button className="db-btn db-btn--outline" onClick={prev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
        )}
        <span className="dcl-auto-save">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5" style={{ width: 12, height: 12 }}><polyline points="20 6 9 17 4 12"/></svg>
          Draft auto-saved
        </span>
      </div>
      <div className="dcl-nav-right">
        <button className="db-btn db-btn--outline" onClick={() => navigate('/dashboard/listing')}>
          Cancel
        </button>
        {step < STEPS.length - 1 ? (
          <button className="db-btn db-btn--primary" onClick={next}>
            Continue
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        ) : (
          <button className="db-btn db-btn--primary" style={{ background: 'var(--emerald)' }} onClick={onSubmit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Submit Listing
          </button>
        )}
      </div>
    </div>
  )
}
