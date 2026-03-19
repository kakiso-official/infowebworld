import { useState, useMemo } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminFilters from '../components/admin/shared/AdminFilters'
import ListingStatCards from '../components/admin/listings/ListingStatCards'
import PendingApprovalQueue from '../components/admin/listings/PendingApprovalQueue'
import ListingTable from '../components/admin/listings/ListingTable'
import CategoryDistChart from '../components/admin/listings/CategoryDistChart'
import QualityScoresChart from '../components/admin/listings/QualityScoresChart'
import { allListings } from '../data/admin/listingsData'

export default function AdminListingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [selectedIds, setSelectedIds] = useState([])

  const categories = useMemo(() => {
    const cats = [...new Set(allListings.map(l => l.category))].sort()
    return [{ value: 'all', label: 'All Categories' }, ...cats.map(c => ({ value: c, label: c }))]
  }, [])

  const filtered = useMemo(() => {
    let list = [...allListings]

    if (statusFilter !== 'all') {
      list = list.filter(l => l.status === statusFilter)
    }
    if (categoryFilter !== 'all') {
      list = list.filter(l => l.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(l => l.name.toLowerCase().includes(q) || l.owner.toLowerCase().includes(q))
    }

    list.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [search, statusFilter, categoryFilter, sortBy, sortDir])

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSelectAll = (ids) => {
    const allSelected = ids.every(id => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds(prev => prev.filter(x => !ids.includes(x)))
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...ids])])
    }
  }

  const pendingCount = allListings.filter(l => l.status === 'pending').length

  return (
    <AdminLayout title="Listings" subtitle={`${pendingCount} pending approval`}>
      <ListingStatCards />
      <PendingApprovalQueue />

      <div className="db-card db-full">
        <AdminFilters
          searchQuery={search}
          setSearchQuery={setSearch}
          searchPlaceholder="Search listings by name or owner..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'suspended', label: 'Suspended' },
              ],
            },
            {
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: categories,
            },
          ]}
        />
        <ListingTable
          listings={filtered}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />
      </div>

      <div className="db-grid-2">
        <CategoryDistChart />
        <QualityScoresChart />
      </div>
    </AdminLayout>
  )
}
