export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Join the Waitlist',
      desc: 'Enter your email and lock in your early bird tier. The earlier you join, the better your rewards.',
      pastel: 'hiw--coral',
      icon: (
        <>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" /><path d="M19 17v4" />
          <path d="M3 5h4" /><path d="M17 19h4" />
        </>
      ),
    },
    {
      num: '02',
      title: 'Share & Move Up',
      desc: 'Get your unique referral link. Each referral moves you up the waitlist and unlocks bonus rewards.',
      pastel: 'hiw--azure',
      icon: (
        <>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </>
      ),
    },
    {
      num: '03',
      title: 'Claim Your Listing',
      desc: 'When we launch, activate your listing in minutes. Upload photos, add details, and go live instantly.',
      pastel: 'hiw--emerald',
      icon: (
        <>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </>
      ),
    },
    {
      num: '04',
      title: 'Grow Your Business',
      desc: 'Get discovered by customers, collect verified reviews, generate leads, and build your online authority.',
      pastel: 'hiw--plum',
      icon: (
        <>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </>
      ),
    },
  ]

  return (
    <section className="hiw-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">How It Works</div>
          <h2 className="hiw-heading">
            Get Listed in <em>4 Simple Steps</em>
          </h2>
          <p className="section-desc">
            From waitlist to fully live listing in minutes — no complicated setup required.
          </p>
        </div>

        <div className="hiw-grid">
          {steps.map(s => (
            <div key={s.num} className={`hiw-card ${s.pastel}`}>
              <div className="hiw-num">{s.num}</div>
              <div className="hiw-bar" />
              <div className="hiw-icon">
                <svg viewBox="0 0 24 24">{s.icon}</svg>
              </div>
              <div className="hiw-title">{s.title}</div>
              <div className="hiw-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
