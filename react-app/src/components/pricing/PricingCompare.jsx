const Check = () => <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="2.5" className="pr-cmp-check"><polyline points="20 6 9 17 4 12"/></svg>
const Dash = () => <span className="pr-cmp-dash">—</span>

const sections = [
  {
    title: 'Listing & Profile',
    rows: [
      { feature: 'Business listing', free: <Check />, pro: <Check />, biz: <Check /> },
      { feature: 'Photos & media', free: 'Up to 5', pro: 'Unlimited', biz: 'Unlimited' },
      { feature: 'Video showcase', free: <Dash />, pro: <Check />, biz: <Check /> },
      { feature: 'Custom branding', free: <Dash />, pro: <Dash />, biz: <Check /> },
      { feature: 'Verified badge', free: <Dash />, pro: <Dash />, biz: <Check /> },
    ]
  },
  {
    title: 'Visibility & Reach',
    rows: [
      { feature: 'Category placement', free: 'Standard', pro: 'Priority', biz: 'Top spot' },
      { feature: 'Search ranking boost', free: <Dash />, pro: '2x', biz: '5x' },
      { feature: 'Featured on homepage', free: <Dash />, pro: <Dash />, biz: <Check /> },
      { feature: 'Best Of eligibility', free: <Check />, pro: <Check />, biz: <Check /> },
      { feature: 'Sponsored placement', free: <Dash />, pro: <Check />, biz: <Check /> },
    ]
  },
  {
    title: 'Reviews & Engagement',
    rows: [
      { feature: 'Receive reviews', free: <Check />, pro: <Check />, biz: <Check /> },
      { feature: 'Reply to reviews', free: <Dash />, pro: <Check />, biz: <Check /> },
      { feature: 'Review request emails', free: <Dash />, pro: '100/mo', biz: 'Unlimited' },
      { feature: 'Review widgets', free: <Dash />, pro: <Check />, biz: <Check /> },
      { feature: 'Social proof badges', free: <Dash />, pro: <Dash />, biz: <Check /> },
    ]
  },
  {
    title: 'Analytics & Support',
    rows: [
      { feature: 'Profile views', free: <Check />, pro: <Check />, biz: <Check /> },
      { feature: 'Click analytics', free: <Dash />, pro: <Check />, biz: <Check /> },
      { feature: 'Competitor insights', free: <Dash />, pro: <Dash />, biz: <Check /> },
      { feature: 'Monthly reports', free: <Dash />, pro: <Check />, biz: <Check /> },
      { feature: 'Support level', free: 'Email', pro: 'Priority', biz: 'Dedicated AM' },
    ]
  },
]

export default function PricingCompare() {
  return (
    <div className="container">
      <div className="pr-compare fade-in">
        <h2 className="pr-compare-title">
          <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          Compare All Features
        </h2>
        <div className="pr-compare-table-wrap">
          <table className="pr-compare-table">
            <thead>
              <tr>
                <th className="pr-cmp-feature-th">Feature</th>
                <th className="pr-cmp-plan-th">Free</th>
                <th className="pr-cmp-plan-th pr-cmp-plan-th--pop">Pro</th>
                <th className="pr-cmp-plan-th">Business</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((sec, si) => (
                <>{/* Fragment key on first row */}
                  <tr className="pr-cmp-section-row" key={`s${si}`}>
                    <td colSpan={4} className="pr-cmp-section-label">{sec.title}</td>
                  </tr>
                  {sec.rows.map((row, ri) => (
                    <tr className="pr-cmp-row" key={`${si}-${ri}`}>
                      <td className="pr-cmp-feature">{row.feature}</td>
                      <td className="pr-cmp-val">{row.free}</td>
                      <td className="pr-cmp-val pr-cmp-val--pop">{row.pro}</td>
                      <td className="pr-cmp-val">{row.biz}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
