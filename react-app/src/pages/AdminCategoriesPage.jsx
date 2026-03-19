import { useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminFilters from '../components/admin/shared/AdminFilters'
import CategoryStatCards from '../components/admin/categories/CategoryStatCards'
import CategoryForm from '../components/admin/categories/CategoryForm'
import CategoryTable from '../components/admin/categories/CategoryTable'
import CategoryPerformanceChart from '../components/admin/categories/CategoryPerformanceChart'
import CategoryHealthList from '../components/admin/categories/CategoryHealthList'
import { allCategories } from '../data/admin/categoriesData'

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  const filtered = allCategories
    .filter(c => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.slug.includes(q) || c.description.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  return (
    <AdminLayout title="Categories" subtitle="42 categories">
      <CategoryStatCards />
      <CategoryForm onAdd={() => {}} />
      <div className="db-card db-full">
        <AdminFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search categories..."
          filters={[]}
        />
        <CategoryTable
          categories={filtered}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </div>
      <div className="db-grid-2">
        <CategoryPerformanceChart />
        <CategoryHealthList />
      </div>
    </AdminLayout>
  )
}
