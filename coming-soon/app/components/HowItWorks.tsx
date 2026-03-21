export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Join the Waitlist',
      desc: 'Enter your email and lock in your early bird tier. The earlier you join, the better your rewards.',
      color: '#E8553D',
      icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    },
    {
      num: '02',
      title: 'Share & Move Up',
      desc: 'Get your referral link. Each referral moves you up the waitlist and unlocks bonus rewards.',
      color: '#4361EE',
      icon: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
    },
    {
      num: '03',
      title: 'Claim Your Listing',
      desc: 'When we launch, activate your listing in minutes. Upload photos, add details, and go live instantly.',
      color: '#2FAE6A',
      icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></>,
    },
    {
      num: '04',
      title: 'Grow Your Business',
      desc: 'Get discovered by customers, collect reviews, generate leads, and build your online authority.',
      color: '#8B5CF6',
      icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    },
  ]

  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">How It Works</div>
          <h2 className="section-title">Get Listed in <em>4 Simple Steps</em></h2>
          <p className="section-desc">
            From waitlist to fully live listing in minutes — no complicated setup required.
          </p>
        </div>

        <div className="how-grid">
          {steps.map(s => (
            <div key={s.num} className="how-step">
              <div className="how-num">{s.num}</div>
              <div className="how-icon" style={{ background: s.color }}>
                <svg viewBox="0 0 24 24">{s.icon}</svg>
              </div>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
