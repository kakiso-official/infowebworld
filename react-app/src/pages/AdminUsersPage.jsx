import { useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminFilters from '../components/admin/shared/AdminFilters'
import UserStatCards from '../components/admin/users/UserStatCards'
import UserGrowthChart from '../components/admin/users/UserGrowthChart'
import UserTable from '../components/admin/users/UserTable'
import UserBulkActions from '../components/admin/users/UserBulkActions'
import { allUsers } from '../data/admin/usersData'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [selectedIds, setSelectedIds] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  const filtered = allUsers
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => statusFilter === 'all' || u.status === statusFilter)
    .filter(u => planFilter === 'all' || u.plan === planFilter)
    .filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
      if (sortBy === 'listings') cmp = b.listings - a.listings
      if (sortBy === 'reviews') cmp = b.reviews - a.reviews
      return sortDir === 'desc' ? -cmp : cmp
    })

  const handleSort = (key) => {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDir('asc') }
  }

  const handleSelect = (id) => setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])

  const handleSelectAll = (pageIds) => {
    const allSelected = pageIds.every(id => selectedIds.includes(id))
    setSelectedIds(allSelected ? selectedIds.filter(id => !pageIds.includes(id)) : [...new Set([...selectedIds, ...pageIds])])
  }

  return (
    <AdminLayout title="Users" subtitle={`${allUsers.length} registered users`}>
      <UserStatCards />
      <UserGrowthChart />
      <div className="db-card db-full">
        <AdminFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search users..."
          filters={[
            { value: roleFilter, onChange: setRoleFilter, options: [{ value: 'all', label: 'All Roles' }, { value: 'business', label: 'Business' }, { value: 'user', label: 'User' }] },
            { value: statusFilter, onChange: setStatusFilter, options: [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }, { value: 'banned', label: 'Banned' }, { value: 'pending', label: 'Pending' }] },
            { value: planFilter, onChange: setPlanFilter, options: [{ value: 'all', label: 'All Plans' }, { value: 'Enterprise', label: 'Enterprise' }, { value: 'Pro', label: 'Pro' }, { value: 'Basic', label: 'Basic' }, { value: 'Free', label: 'Free' }] },
          ]}
        />
        <UserBulkActions selectedIds={selectedIds} onClear={() => setSelectedIds([])} />
        <UserTable
          users={filtered}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      </div>
    </AdminLayout>
  )
}
