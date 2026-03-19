import { useState, useMemo } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminFilters from '../components/admin/shared/AdminFilters'
import NewsStatCards from '../components/admin/news/NewsStatCards'
import ArticleTable from '../components/admin/news/ArticleTable'
import TopPerformingArticles from '../components/admin/news/TopPerformingArticles'
import ContentCalendar from '../components/admin/news/ContentCalendar'
import NewsCategoryBreakdown from '../components/admin/news/NewsCategoryBreakdown'
import { allArticles } from '../data/admin/newsData'

export default function AdminNewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('views')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let result = [...allArticles]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      result = result.filter(a => a.category === categoryFilter)
    }

    result.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      if (aVal == null) aVal = ''
      if (bVal == null) bVal = ''
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [searchQuery, statusFilter, categoryFilter, sortBy, sortDir])

  return (
    <AdminLayout title="News" subtitle="Content management">
      <NewsStatCards />
      <div className="db-card db-full">
        <AdminFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search articles..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
                { value: 'scheduled', label: 'Scheduled' },
              ],
            },
            {
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: [
                { value: 'all', label: 'All Categories' },
                { value: 'Guides', label: 'Guides' },
                { value: 'Industry Trends', label: 'Industry Trends' },
                { value: 'Reviews', label: 'Reviews' },
                { value: 'Best Practices', label: 'Best Practices' },
                { value: 'Reports', label: 'Reports' },
                { value: 'Compliance', label: 'Compliance' },
              ],
            },
          ]}
        />
        <ArticleTable articles={filtered} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
      </div>
      <TopPerformingArticles />
      <div className="db-grid-2">
        <ContentCalendar />
        <NewsCategoryBreakdown />
      </div>
    </AdminLayout>
  )
}
