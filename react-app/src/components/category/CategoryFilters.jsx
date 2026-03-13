import { useState } from 'react'

const CheckSvg = () => (
  <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
)

const ChevronSvg = () => (
  <svg className="filter-card-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
)

const StarPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

const initialSubcategory = { 'SaaS Platforms': true, 'Cloud Infrastructure': false, 'AI / Machine Learning': false, 'Cybersecurity': false, 'DevOps & CI/CD': false, 'Data Analytics': false }
const subcategoryCounts = { 'SaaS Platforms': 94, 'Cloud Infrastructure': 52, 'AI / Machine Learning': 47, 'Cybersecurity': 38, 'DevOps & CI/CD': 29, 'Data Analytics': 24 }

const initialPricing = { 'Free': false, 'Freemium': true, 'Paid': false, 'Enterprise': false }
const pricingCounts = { 'Free': 31, 'Freemium': 86, 'Paid': 124, 'Enterprise': 43 }

const initialCompanySize = { 'Startup (1-10)': false, 'Small (11-50)': false, 'Mid-size (51-200)': false, 'Enterprise (200+)': false }
const companySizeCounts = { 'Startup (1-10)': 67, 'Small (11-50)': 89, 'Mid-size (51-200)': 72, 'Enterprise (200+)': 56 }

const initialDeployment = { 'Cloud / SaaS': true, 'On-Premise': false, 'Hybrid': false, 'API Only': false }
const deploymentCounts = { 'Cloud / SaaS': 198, 'On-Premise': 34, 'Hybrid': 28, 'API Only': 24 }

export default function CategoryFilters() {
  const [collapsed, setCollapsed] = useState({})
  const [subcategory, setSubcategory] = useState(initialSubcategory)
  const [activeRating, setActiveRating] = useState(4)
  const [pricing, setPricing] = useState(initialPricing)
  const [companySize, setCompanySize] = useState(initialCompanySize)
  const [deployment, setDeployment] = useState(initialDeployment)

  const toggleCollapsed = (key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCheck = (setter, key) => {
    setter(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const clearAll = () => {
    setSubcategory(Object.fromEntries(Object.keys(initialSubcategory).map(k => [k, false])))
    setActiveRating(null)
    setPricing(Object.fromEntries(Object.keys(initialPricing).map(k => [k, false])))
    setCompanySize(Object.fromEntries(Object.keys(initialCompanySize).map(k => [k, false])))
    setDeployment(Object.fromEntries(Object.keys(initialDeployment).map(k => [k, false])))
  }

  const renderCheckboxGroup = (state, setter, counts) => (
    Object.keys(state).map(key => (
      <label className="f-check" key={key}>
        <input type="checkbox" checked={state[key]} onChange={() => toggleCheck(setter, key)} />
        <span className="f-check-box"><CheckSvg /></span>
        {key}
        <span className="f-check-count">{counts[key]}</span>
      </label>
    ))
  )

  const renderStars = (filled) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} viewBox="0 0 24 24" fill={i < filled ? 'var(--gold)' : 'var(--gray-200)'} stroke="none">
          <path d={StarPath}/>
        </svg>
      )
    }
    return stars
  }

  return (
    <>
      <div className="filter-top">
        <span className="filter-top-title">Filters</span>
        <span className="filter-clear" onClick={clearAll}>Clear all</span>
      </div>

      {/* Subcategory */}
      <div className={`filter-card${collapsed.subcategory ? ' collapsed' : ''}`}>
        <div className="filter-card-head" onClick={() => toggleCollapsed('subcategory')}>
          <span className="filter-card-title">Subcategory</span>
          <ChevronSvg />
        </div>
        <div className="filter-card-body">
          {renderCheckboxGroup(subcategory, setSubcategory, subcategoryCounts)}
        </div>
      </div>

      {/* Rating */}
      <div className={`filter-card${collapsed.rating ? ' collapsed' : ''}`}>
        <div className="filter-card-head" onClick={() => toggleCollapsed('rating')}>
          <span className="filter-card-title">Rating</span>
          <ChevronSvg />
        </div>
        <div className="filter-card-body">
          {[4, 3, 2].map(rating => (
            <div
              key={rating}
              className={`f-rating-row${activeRating === rating ? ' active' : ''}`}
              onClick={() => setActiveRating(rating)}
            >
              <div className="f-stars">{renderStars(rating)}</div>
              {rating}.0 &amp; up
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className={`filter-card${collapsed.pricing ? ' collapsed' : ''}`}>
        <div className="filter-card-head" onClick={() => toggleCollapsed('pricing')}>
          <span className="filter-card-title">Pricing</span>
          <ChevronSvg />
        </div>
        <div className="filter-card-body">
          {renderCheckboxGroup(pricing, setPricing, pricingCounts)}
        </div>
      </div>

      {/* Company Size */}
      <div className={`filter-card${collapsed.companySize ? ' collapsed' : ''}`}>
        <div className="filter-card-head" onClick={() => toggleCollapsed('companySize')}>
          <span className="filter-card-title">Company Size</span>
          <ChevronSvg />
        </div>
        <div className="filter-card-body">
          {renderCheckboxGroup(companySize, setCompanySize, companySizeCounts)}
        </div>
      </div>

      {/* Deployment */}
      <div className={`filter-card${collapsed.deployment ? ' collapsed' : ''}`}>
        <div className="filter-card-head" onClick={() => toggleCollapsed('deployment')}>
          <span className="filter-card-title">Deployment</span>
          <ChevronSvg />
        </div>
        <div className="filter-card-body">
          {renderCheckboxGroup(deployment, setDeployment, deploymentCounts)}
        </div>
      </div>
    </>
  )
}
