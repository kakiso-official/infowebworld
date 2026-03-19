import { useState, useMemo } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminFilters from '../components/admin/shared/AdminFilters'
import ReviewStatCards from '../components/admin/reviews/ReviewStatCards'
import ModerationQueue from '../components/admin/reviews/ModerationQueue'
import PlatformRatingDistChart from '../components/admin/reviews/PlatformRatingDistChart'
import SentimentBreakdown from '../components/admin/reviews/SentimentBreakdown'
import ReviewTrendsChart from '../components/admin/reviews/ReviewTrendsChart'
import TopReviewedListings from '../components/admin/reviews/TopReviewedListings'
import ReviewTable from '../components/admin/reviews/ReviewTable'
import { allReviews } from '../data/admin/reviewsData'

export default function AdminReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir('desc')
    }
  }

  const filteredReviews = useMemo(() => {
    let result = [...allReviews]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.author.toLowerCase().includes(q) ||
        r.listing.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }

    if (ratingFilter !== 'all') {
      result = result.filter(r => r.rating === Number(ratingFilter))
    }

    result.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      if (sortBy === 'date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [searchQuery, statusFilter, ratingFilter, sortBy, sortDir])

  return (
    <AdminLayout title="Reviews" subtitle="8 flagged for moderation">
      <ReviewStatCards />
      <ModerationQueue />
      <div className="db-grid-2">
        <PlatformRatingDistChart />
        <SentimentBreakdown />
      </div>
      <div className="db-grid-2">
        <ReviewTrendsChart />
        <TopReviewedListings />
      </div>
      <div className="db-card db-full">
        <AdminFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search reviews by author, listing, or content..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'published', label: 'Published' },
                { value: 'pending', label: 'Pending' },
                { value: 'flagged', label: 'Flagged' },
                { value: 'removed', label: 'Removed' },
              ],
            },
            {
              value: ratingFilter,
              onChange: setRatingFilter,
              options: [
                { value: 'all', label: 'All Ratings' },
                { value: '5', label: '5 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '3', label: '3 Stars' },
                { value: '2', label: '2 Stars' },
                { value: '1', label: '1 Star' },
              ],
            },
          ]}
        />
        <ReviewTable
          reviews={filteredReviews}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </div>
    </AdminLayout>
  )
}
