export default function CategoriesLoading() {
  return (
    <div className="sk-page">
      <div className="sk-container">
        {/* Title */}
        <div className="sk sk--title" />

        {/* Description */}
        <div className="sk sk--desc" />

        {/* Search */}
        <div className="sk sk--search sk--search-wide" />

        {/* Stat pills */}
        <div className="sk-row sk-row--pills">
          <span className="sk sk--pill" /><span className="sk sk--pill sk--pill-wide" /><span className="sk sk--pill" />
        </div>

        {/* Section heading */}
        <div className="sk sk--section-heading" />

        {/* Sector cards */}
        <div className="sk-grid sk-grid--sectors">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="sk-sector-card">
              <div className="sk sk--sector-header" />
              <div className="sk-sector-body">
                <div className="sk sk--sector-row" />
                <div className="sk sk--sector-row sk--sector-row-md" />
                <div className="sk sk--sector-row sk--sector-row-lg" />
                <div className="sk sk--sector-row sk--sector-row-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
