export default function Comparison() {
  return (
    <section className="comparison-section" id="compare">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Compare</div>
          <h2 className="section-title">How We Stack Up Against <em>Others</em></h2>
          <p className="section-desc">
            See why InfoWebWorld is the best choice for businesses that want real results.
          </p>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="comparison-highlight">InfoWebWorld</th>
                <th>G2</th>
                <th>Product Hunt</th>
                <th>AI Directories</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dofollow Backlinks</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-partial">Some</td>
              </tr>
              <tr>
                <td>Verified Reviews</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-check">&#10003;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
              </tr>
              <tr>
                <td>80+ Industries</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-partial">Tech only</td>
                <td className="comparison-partial">Tech only</td>
                <td className="comparison-partial">AI only</td>
              </tr>
              <tr>
                <td>Lead Generation</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-check">&#10003;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
              </tr>
              <tr>
                <td>Multi-Country (12+)</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-partial">Limited</td>
                <td className="comparison-check">&#10003;</td>
                <td className="comparison-cross">&#10005;</td>
              </tr>
              <tr>
                <td>Daily News Feed</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
              </tr>
              <tr>
                <td>Analytics Dashboard</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-check">&#10003;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-partial">Basic</td>
              </tr>
              <tr>
                <td>Lifetime Plan</td>
                <td className="comparison-highlight comparison-check">$240</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-partial">Varies</td>
              </tr>
              <tr>
                <td>Founding Member Perks</td>
                <td className="comparison-highlight comparison-check">&#10003;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
                <td className="comparison-cross">&#10005;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
