import '../styles/categories.css'

export default function CategoryLoading() {
  return (
    <div className="sk-page">
      <div className="sk-container">
        {/* Breadcrumb */}
        <div className="sk-row sk-row--breadcrumb">
          <span className="sk sk--sm" /><span className="sk sk--md" /><span className="sk sk--lg" />
        </div>

        {/* Title */}
        <div className="sk sk--title" />

        {/* Description */}
        <div className="sk sk--desc" />
        <div className="sk sk--desc sk--desc-short" />

        {/* Stat pills */}
        <div className="sk-row sk-row--pills">
          <span className="sk sk--pill" /><span className="sk sk--pill sk--pill-wide" />
        </div>

        {/* Search bar */}
        <div className="sk sk--search" />

        {/* Chips */}
        <div className="sk-row sk-row--chips">
          <span className="sk sk--chip" /><span className="sk sk--chip sk--chip-lg" />
          <span className="sk sk--chip sk--chip-sm" /><span className="sk sk--chip" />
          <span className="sk sk--chip sk--chip-lg" /><span className="sk sk--chip sk--chip-sm" />
        </div>

        {/* Cards */}
        <div className="sk-cards">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="sk-card">
              <div className="sk-card-head">
                <div className="sk sk--avatar" />
                <div className="sk-card-info">
                  <div className="sk sk--card-title" />
                  <div className="sk sk--card-sub" />
                </div>
              </div>
              <div className="sk sk--card-line" />
              <div className="sk sk--card-line sk--card-line-short" />
              <div className="sk-card-actions">
                <span className="sk sk--btn" /><span className="sk sk--btn sk--btn-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
