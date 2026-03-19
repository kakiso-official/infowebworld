import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { allLeads } from '../data/dashboard/leadsData'
import LeadsPipelineBanner from '../components/dashboard/leads/LeadsPipelineBanner'
import LeadStatCards from '../components/dashboard/leads/LeadStatCards'
import SalesPipeline from '../components/dashboard/leads/SalesPipeline'
import LeadSourcesTrend from '../components/dashboard/leads/LeadSourcesTrend'
import LeadFilters from '../components/dashboard/leads/LeadFilters'
import LeadGridView from '../components/dashboard/leads/LeadGridView'
import LeadListView from '../components/dashboard/leads/LeadListView'
import LeadActivityFeed from '../components/dashboard/leads/LeadActivityFeed'
import ResponsePerformance from '../components/dashboard/leads/ResponsePerformance'
import TopLeadsTable from '../components/dashboard/leads/TopLeadsTable'

export default function DashboardLeadsPage() {
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('list')

  const filtered = allLeads
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l => !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.company.toLowerCase().includes(searchQuery.toLowerCase()) || l.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'value') return parseInt(b.value.replace(/\D/g, '')) - parseInt(a.value.replace(/\D/g, ''))
      if (sortBy === 'priority') { const o = { high: 0, medium: 1, low: 2 }; return o[a.priority] - o[b.priority] }
      return 0 // date is default order
    })

  const totalValue = allLeads.filter(l => l.status !== 'archived').reduce((a, l) => a + parseInt(l.value.replace(/\D/g, '')), 0)
  const newCount = allLeads.filter(l => l.status === 'new').length
  const contactedCount = allLeads.filter(l => l.status === 'contacted').length
  const convertedCount = allLeads.filter(l => l.status === 'converted').length
  const convRate = Math.round((convertedCount / (allLeads.length - allLeads.filter(l => l.status === 'archived').length)) * 100)

  return (
    <DashboardLayout title="Leads" subtitle={`${newCount} new inquiries`}>
      <LeadsPipelineBanner totalValue={totalValue} newCount={newCount} contactedCount={contactedCount} convRate={convRate} />

      <LeadStatCards newCount={newCount} convRate={convRate} totalValue={totalValue} />

      <div className="db-grid-2">
        <SalesPipeline totalValue={totalValue} convRate={convRate} />
        <LeadSourcesTrend />
      </div>

      {/* Lead List Section */}
      <div className="db-card db-full">
        <LeadFilters filter={filter} setFilter={setFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} setSortBy={setSortBy} viewMode={viewMode} setViewMode={setViewMode} allLeads={allLeads} />
        {viewMode === 'grid' ? (
          <LeadGridView filtered={filtered} expandedId={expandedId} setExpandedId={setExpandedId} />
        ) : (
          <LeadListView filtered={filtered} expandedId={expandedId} setExpandedId={setExpandedId} />
        )}
      </div>

      <div className="db-grid-2">
        <LeadActivityFeed />
        <ResponsePerformance />
      </div>

      <TopLeadsTable />
    </DashboardLayout>
  )
}
