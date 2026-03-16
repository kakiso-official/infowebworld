import { useState } from 'react'

const METHODS = [
  { id: 'email', title: 'Business Email Verification', desc: "We'll send a verification link to the email associated with this business domain.", tag: 'Fastest', tagColor: 'var(--emerald)', time: '~2 minutes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg> },
  { id: 'dns', title: 'DNS Record Verification', desc: "Add a TXT record to your domain's DNS settings to prove ownership.", tag: 'Technical', tagColor: 'var(--azure)', time: '~10 minutes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="6" rx="2"/><rect x="2" y="15" width="20" height="6" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/></svg> },
  { id: 'html', title: 'HTML Meta Tag', desc: "Add a meta tag to your website's homepage to verify domain control.", tag: 'Developer-friendly', tagColor: 'var(--plum)', time: '~5 minutes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg> },
  { id: 'document', title: 'Official Document Upload', desc: 'Upload a business registration, utility bill, or official letterhead.', tag: 'Manual review', tagColor: 'var(--amber)', time: '24-48 hours', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
]

export default function StepVerify({ listing, onVerified, onBack }) {
  const [method, setMethod] = useState(null)
  const [state, setState] = useState('idle') // idle | sending | sent | verified
  const [codeInput, setCodeInput] = useState(['', '', '', '', '', ''])

  const handleSend = () => {
    setState('sending')
    setTimeout(() => setState('sent'), 1200)
  }

  const handleCodeChange = (idx, val) => {
    if (val.length > 1) val = val.slice(-1)
    const next = [...codeInput]
    next[idx] = val
    setCodeInput(next)
    // Auto-focus next input
    if (val && idx < 5) {
      const el = document.getElementById(`cl-otp-${idx + 1}`)
      el?.focus()
    }
    // Auto-verify when all 6 digits filled
    if (next.every(d => d !== '')) {
      setTimeout(() => setState('verified'), 800)
    }
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !codeInput[idx] && idx > 0) {
      const el = document.getElementById(`cl-otp-${idx - 1}`)
      el?.focus()
    }
  }

  const handleVerifyAction = () => {
    setState('sending')
    setTimeout(() => setState('verified'), 2000)
  }

  return (
    <div className="cl-step-content">
      {/* Selected listing bar */}
      <div className="cl-selected">
        <div className="cl-selected-logo" style={{ background: `linear-gradient(135deg, ${listing.color}, ${listing.color}88)` }}>
          {listing.logo}
        </div>
        <div className="cl-selected-info">
          <div className="cl-selected-name">{listing.name}</div>
          <div className="cl-selected-tagline">{listing.tagline}</div>
        </div>
        <button className="cl-selected-change" onClick={onBack}>Change</button>
      </div>

      <div className="cl-card">
        <div className="cl-card-header">
          <div className="cl-card-icon" style={{ background: 'rgba(47,174,106,.08)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h3>Verify You Own This Business</h3>
            <p>Choose a verification method to prove ownership</p>
          </div>
        </div>

        {/* Methods grid */}
        <div className="cl-verify-grid">
          {METHODS.map(m => (
            <div key={m.id} className={`cl-verify-card${method === m.id ? ' selected' : ''}`} onClick={() => { setMethod(m.id); setState('idle'); setCodeInput(['','','','','','']) }}>
              <div className="cl-verify-card-top">
                <div className="cl-verify-icon">{m.icon}</div>
                <span className="cl-verify-tag" style={{ color: m.tagColor, background: `${m.tagColor}15` }}>{m.tag}</span>
              </div>
              <div className="cl-verify-title">{m.title}</div>
              <div className="cl-verify-desc">{m.desc}</div>
              <div className="cl-verify-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {m.time}
              </div>
              <div className="cl-verify-radio"><div className="cl-verify-radio-dot"></div></div>
            </div>
          ))}
        </div>

        {/* === Email Flow === */}
        {method === 'email' && (
          <div className="cl-verify-action">
            {state === 'idle' && (
              <>
                <div className="cl-verify-email-preview">
                  <div className="cl-verify-email-label">We'll send a 6-digit code to:</div>
                  <div className="cl-verify-email-addr">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>
                    admin@{listing.url}
                  </div>
                </div>
                <button className="cl-verify-send-btn" onClick={handleSend}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Send Verification Code
                </button>
              </>
            )}
            {state === 'sending' && (
              <div className="cl-verify-pending">
                <div className="cl-verify-pending-spinner"></div>
                <div className="cl-verify-pending-text">
                  <h4>Sending verification code...</h4>
                  <p>Please wait while we send the code to <strong>admin@{listing.url}</strong></p>
                </div>
              </div>
            )}
            {state === 'sent' && (
              <div className="cl-otp-section">
                <div className="cl-otp-header">
                  <div className="cl-otp-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>
                  </div>
                  <div>
                    <h4>Enter Verification Code</h4>
                    <p>We sent a 6-digit code to <strong>admin@{listing.url}</strong></p>
                  </div>
                </div>
                <div className="cl-otp-inputs">
                  {codeInput.map((d, i) => (
                    <input
                      key={i}
                      id={`cl-otp-${i}`}
                      className="cl-otp-digit"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleCodeChange(i, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={e => handleKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <div className="cl-otp-footer">
                  <span>Didn't receive the code?</span>
                  <button className="cl-otp-resend" onClick={handleSend}>Resend Code</button>
                </div>
              </div>
            )}
            {state === 'verified' && (
              <div className="cl-verify-success">
                <div className="cl-verify-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <h4>Ownership Verified!</h4>
                  <p>You've been confirmed as the owner of <strong>{listing.name}</strong></p>
                </div>
                <button className="cl-verify-continue-btn" onClick={onVerified}>
                  Continue to Complete Profile
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* === DNS Flow === */}
        {method === 'dns' && (
          <div className="cl-verify-action">
            {state !== 'verified' ? (
              <div className="cl-verify-dns">
                <div className="cl-verify-dns-label">Add this TXT record to your domain's DNS settings:</div>
                <div className="cl-verify-code-block">
                  <div className="cl-verify-code-row"><span className="cl-verify-code-key">Type:</span> TXT</div>
                  <div className="cl-verify-code-row"><span className="cl-verify-code-key">Host:</span> @</div>
                  <div className="cl-verify-code-row"><span className="cl-verify-code-key">Value:</span> infowebworld-verify=a8f3k9d2m7</div>
                </div>
                <button className="cl-verify-send-btn" onClick={handleVerifyAction} disabled={state === 'sending'}>
                  {state === 'sending' ? <><div className="cl-mini-spinner"></div> Checking...</> : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Check DNS Record</>}
                </button>
              </div>
            ) : (
              <div className="cl-verify-success">
                <div className="cl-verify-success-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div><h4>DNS Verified!</h4><p>Domain ownership confirmed for <strong>{listing.url}</strong></p></div>
                <button className="cl-verify-continue-btn" onClick={onVerified}>Continue to Complete Profile <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            )}
          </div>
        )}

        {/* === HTML Flow === */}
        {method === 'html' && (
          <div className="cl-verify-action">
            {state !== 'verified' ? (
              <div className="cl-verify-dns">
                <div className="cl-verify-dns-label">Add this meta tag inside the {'<head>'} of your homepage:</div>
                <div className="cl-verify-code-block">
                  <div className="cl-verify-code-row" style={{ wordBreak: 'break-all' }}>{'<meta name="infowebworld-verify" content="a8f3k9d2m7" />'}</div>
                </div>
                <button className="cl-verify-send-btn" onClick={handleVerifyAction} disabled={state === 'sending'}>
                  {state === 'sending' ? <><div className="cl-mini-spinner"></div> Verifying...</> : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Verify Meta Tag</>}
                </button>
              </div>
            ) : (
              <div className="cl-verify-success">
                <div className="cl-verify-success-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div><h4>Meta Tag Verified!</h4><p>HTML verification successful for <strong>{listing.url}</strong></p></div>
                <button className="cl-verify-continue-btn" onClick={onVerified}>Continue to Complete Profile <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            )}
          </div>
        )}

        {/* === Document Upload Flow === */}
        {method === 'document' && (
          <div className="cl-verify-action">
            {state !== 'verified' ? (
              <div className="cl-verify-upload">
                <div className="cl-verify-upload-zone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <div className="cl-verify-upload-text">
                    <span>Drag & drop your document here</span>
                    <span className="cl-verify-upload-hint">or click to browse files</span>
                  </div>
                  <div className="cl-verify-upload-formats">Accepted: PDF, JPG, PNG (max 10MB)</div>
                </div>
                <div className="cl-verify-upload-examples">
                  <div className="cl-verify-upload-examples-title">Accepted documents:</div>
                  <ul>
                    <li>Business registration certificate</li>
                    <li>Utility bill with business name & address</li>
                    <li>Official company letterhead</li>
                    <li>Tax registration document</li>
                  </ul>
                </div>
                <button className="cl-verify-send-btn" onClick={handleVerifyAction} disabled={state === 'sending'}>
                  {state === 'sending' ? <><div className="cl-mini-spinner"></div> Uploading...</> : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Upload & Submit for Review</>}
                </button>
              </div>
            ) : (
              <div className="cl-verify-success">
                <div className="cl-verify-success-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div><h4>Document Submitted!</h4><p>Our team will verify your ownership within 24-48 hours.</p></div>
                <button className="cl-verify-continue-btn" onClick={onVerified}>Continue to Complete Profile <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
