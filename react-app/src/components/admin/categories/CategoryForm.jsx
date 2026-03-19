import { useState } from 'react'
import DashboardCard from '../../dashboard/shared/DashboardCard'

export default function CategoryForm({ onAdd }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')

  const handleNameChange = (e) => {
    const val = e.target.value
    setName(val)
    setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name, slug, description, icon })
    setName('')
    setSlug('')
    setDescription('')
    setIcon('')
  }

  return (
    <DashboardCard
      title="Add New Category"
      icon={<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
        <div className="db-form-group" style={{ flex: '1 1 180px' }}>
          <label className="db-form-label">Name</label>
          <input type="text" className="db-form-input" placeholder="Category name" value={name} onChange={handleNameChange} />
        </div>
        <div className="db-form-group" style={{ flex: '1 1 180px' }}>
          <label className="db-form-label">Slug</label>
          <input type="text" className="db-form-input" placeholder="category-slug" value={slug} onChange={e => setSlug(e.target.value)} />
        </div>
        <div className="db-form-group" style={{ flex: '2 1 240px' }}>
          <label className="db-form-label">Description</label>
          <input type="text" className="db-form-input" placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="db-form-group" style={{ flex: '0 1 80px' }}>
          <label className="db-form-label">Icon</label>
          <input type="text" className="db-form-input" placeholder="🔒" value={icon} onChange={e => setIcon(e.target.value)} style={{ textAlign: 'center' }} />
        </div>
        <button type="submit" className="db-btn" style={{ height: 38 }}>Add Category</button>
      </form>
    </DashboardCard>
  )
}
