import SharedLayout from '../components/shared/SharedLayout'

export default function NotFoundPage() {
  return (
    <SharedLayout>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '2rem' }}>
        <h1>Not Found</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>Coming soon</p>
      </div>
    </SharedLayout>
  )
}
