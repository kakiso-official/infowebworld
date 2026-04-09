import { I, ic } from './icons'

export default function AiDisclaimer() {
  return (
    <div className="ai-disclaimer">
      <div className="ai-disclaimer-inner">
        <div className="ai-disclaimer-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" fill="url(#aiDisGrad)" />
            <defs><linearGradient id="aiDisGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#3B82F6" /></linearGradient></defs>
          </svg>
        </div>
        <p className="ai-disclaimer-text">
          Please note that we use AI at <strong>InfoWebWorld.com</strong>, so you might spot an occasional mistake! Also, while we are proud to display our clients&apos; logos, doing so doesn&apos;t mean we officially endorse their specific products or services.
        </p>
      </div>
    </div>
  )
}
