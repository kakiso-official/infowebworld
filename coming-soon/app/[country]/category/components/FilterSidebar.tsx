'use client'
import { I, ic } from './icons'
import type { TagGroup } from '../../../iww-hq/data/tag-storage'

type Props = {
  color: string
  isL3: boolean
  isOpen: boolean
  onClose: () => void
  listingTypes: { slug: string; name: string }[]
  selectedListingType: string
  onListingTypeChange: (slug: string) => void
  tagGroups: TagGroup[]
  selectedTags: Set<string>
  onToggleTag: (slug: string) => void
  openAccordions: Set<string>
  onToggleAccordion: (id: string) => void
  onClearFilters: () => void
  hasAnyFilter: boolean
  getListingTypeCount: (slug: string) => number
  totalAllCount: number
  totalFilteredCount: number
  hasListings: boolean
  demoTagCounts: Map<string, number>
}

/* ── Shared filter content ── */
function FilterContent(p: Props) {
  return (
    <>
      {/* Active filter pills */}
      {p.hasAnyFilter && (
        <div className="cd-sb-active">
          <div className="cd-sb-active-header">
            <span className="cd-sb-active-label">Active Filters</span>
            <button onClick={p.onClearFilters} className="cd-sb-clear-btn" style={{ color: p.color }}>Clear All</button>
          </div>
          <div className="cd-sb-active-pills">
            {p.selectedListingType && (
              <span className="cd-sb-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                {p.listingTypes.find(lt => lt.slug === p.selectedListingType)?.name || p.selectedListingType}
                <button onClick={() => p.onListingTypeChange('')} className="cd-sb-pill-x" style={{ color: p.color }}>
                  <I d={ic.x} size={10} color={p.color} sw={2.5} />
                </button>
              </span>
            )}
            {Array.from(p.selectedTags).map(tagSlug => {
              const tag = p.tagGroups.flatMap(g => g.tags).find(t => t.slug === tagSlug)
              return tag ? (
                <span key={tagSlug} className="cd-sb-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                  {tag.name}
                  <button onClick={() => p.onToggleTag(tagSlug)} className="cd-sb-pill-x" style={{ color: p.color }}>
                    <I d={ic.x} size={10} color={p.color} sw={2.5} />
                  </button>
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Listing type radios */}
      {p.listingTypes.length > 0 && (
        <div className="cd-sb-section">
          <h4 className="cd-sb-section-title">Listing Types</h4>
          <div className="cd-sb-radio-list">
            {[{ slug: '', name: 'All' }, ...p.listingTypes].map(lt => {
              const isActive = lt.slug === '' ? !p.selectedListingType : p.selectedListingType === lt.slug
              const count = lt.slug === '' ? p.totalAllCount : p.getListingTypeCount(lt.slug)
              return (
                <label key={lt.slug || 'all'} className={`cd-sb-radio${isActive ? ' cd-sb-radio--active' : ''}`}>
                  <input type="radio" name="lt" checked={isActive} onChange={() => p.onListingTypeChange(lt.slug)} />
                  <span
                    className="cd-sb-radio-dot"
                    style={isActive ? { borderColor: p.color, background: p.color } : undefined}
                  />
                  <span className="cd-sb-radio-label">{lt.name}</span>
                  <span className="cd-sb-count">{count}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Tag group accordions */}
      {p.tagGroups.map(group => {
        const isOpen = p.openAccordions.has(group.id)
        const selectedInGroup = group.tags.filter(t => p.selectedTags.has(t.slug)).length
        return (
          <div key={group.id} className="cd-sb-section">
            <button className="cd-sb-accordion-btn" onClick={() => p.onToggleAccordion(group.id)}>
              <span className="cd-sb-accordion-left">
                <span className="cd-sb-color-dot" style={{ background: group.color }} />
                <span className="cd-sb-accordion-name">{group.name}</span>
                {selectedInGroup > 0 && (
                  <span className="cd-sb-selected-badge" style={{ background: `${p.color}15`, color: p.color }}>{selectedInGroup}</span>
                )}
              </span>
              <span className="cd-sb-accordion-right">
                <span className="cd-sb-count">{group.tags.length}</span>
                <span className={`cd-sb-chevron${isOpen ? ' cd-sb-chevron--open' : ''}`}>
                  <I d={ic.chevronDown} size={12} color="var(--h-muted)" sw={2} />
                </span>
              </span>
            </button>
            {isOpen && (
              <div className="cd-sb-checkbox-list">
                {group.tags.map(tag => {
                  const checked = p.selectedTags.has(tag.slug)
                  const count = p.hasListings ? 0 : (p.demoTagCounts.get(tag.slug) || 0)
                  return (
                    <label key={tag.id} className="cd-sb-checkbox">
                      <input type="checkbox" checked={checked} onChange={() => p.onToggleTag(tag.slug)} />
                      <span
                        className="cd-sb-checkbox-box"
                        style={checked ? { background: p.color, borderColor: p.color } : undefined}
                      >
                        {checked && <I d={ic.check} size={10} color="#fff" sw={2.5} />}
                      </span>
                      <span className="cd-sb-checkbox-label">{tag.name}</span>
                      {!p.hasListings && count > 0 && <span className="cd-sb-count">{count}</span>}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

/* ── Main component: desktop sidebar + mobile button/drawer ── */
export default function FilterSidebar(p: Props) {
  if (!p.isL3) return null

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="cd-sidebar">
        <FilterContent {...p} />
      </aside>

      {/* Mobile drawer overlay */}
      {p.isOpen && (
        <div className="cd-drawer-overlay" onClick={p.onClose}>
          <div className="cd-drawer" onClick={e => e.stopPropagation()}>
            <div className="cd-drawer-header">
              <h3 className="cd-drawer-title">
                <I d={ic.filter} size={16} color={p.color} sw={2} /> Filters
              </h3>
              <button className="cd-drawer-close" onClick={p.onClose}>
                <I d={ic.x} size={18} color="var(--h-heading)" sw={2} />
              </button>
            </div>
            <div className="cd-drawer-body">
              <FilterContent {...p} />
            </div>
            <div className="cd-drawer-footer">
              <button className="cd-drawer-apply" style={{ background: p.color }} onClick={p.onClose}>
                Show {p.totalFilteredCount} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
