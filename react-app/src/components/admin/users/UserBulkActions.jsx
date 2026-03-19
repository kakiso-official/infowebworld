import AdminBulkActions from '../shared/AdminBulkActions'

export default function UserBulkActions({ selectedIds, onClear }) {
  return (
    <AdminBulkActions
      count={selectedIds.length}
      onClear={onClear}
      actions={[
        { label: 'Verify Selected', onClick: () => {} },
        { label: 'Change Role', onClick: () => {} },
        { label: 'Suspend', onClick: () => {} },
        { label: 'Ban', onClick: () => {}, danger: true },
      ]}
    />
  )
}
