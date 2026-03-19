import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import ReviewsBanner from '../components/dashboard/reviews/ReviewsBanner'
import ReviewStats from '../components/dashboard/reviews/ReviewStats'
import RatingDistribution from '../components/dashboard/reviews/RatingDistribution'
import ReviewSourcesChart from '../components/dashboard/reviews/ReviewSourcesChart'
import MonthlyTrend from '../components/dashboard/reviews/MonthlyTrend'
import SentimentCloud from '../components/dashboard/reviews/SentimentCloud'
import CompetitorComparison from '../components/dashboard/reviews/CompetitorComparison'
import ReviewList from '../components/dashboard/reviews/ReviewList'
import { reviews } from '../data/dashboard/reviewsData'

export default function DashboardReviewsPage() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedReply, setExpandedReply] = useState(null)

  const unrepliedCount = reviews.filter(r => !r.replied).length

  const filtered = reviews
    .filter(r => {
      if (filter === 'unreplied') return !r.replied
      if (filter === 'positive') return r.sentiment === 'positive'
      if (filter === 'negative') return r.sentiment === 'negative' || r.sentiment === 'mixed'
      if (['5', '4', '3', '2', '1'].includes(filter)) return r.rating === parseInt(filter)
      return true
    })
    .filter(r => !searchQuery || r.text.toLowerCase().includes(searchQuery.toLowerCase()) || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest') return a.rating - b.rating
      if (sortBy === 'helpful') return b.helpful - a.helpful
      return 0
    })

  return (
    <DashboardLayout title="Reviews" subtitle={`${unrepliedCount} awaiting reply`}>
      <ReviewsBanner unrepliedCount={unrepliedCount} />
      <ReviewStats />

      <div className="db-grid-2">
        <RatingDistribution />
        <ReviewSourcesChart />
      </div>

      <div className="db-grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <MonthlyTrend />
        <SentimentCloud />
        <CompetitorComparison />
      </div>

      <ReviewList
        filtered={filtered}
        filter={filter} setFilter={setFilter}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        sortBy={sortBy} setSortBy={setSortBy}
        expandedReply={expandedReply} setExpandedReply={setExpandedReply}
        unrepliedCount={unrepliedCount}
      />
    </DashboardLayout>
  )
}
