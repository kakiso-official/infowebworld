import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function CategoriesLoading() {
  return (
    <>
      <Navbar />
      <section className="cb" style={{ background: '#fff', minHeight: '80vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(.75rem, 2vw, 1.25rem)' }}>
          {/* H1 skeleton */}
          <div className="cd-skel cd-skel--shimmer" style={{ width: '50%', maxWidth: 380, height: 36, borderRadius: 8, marginBottom: 12 }} />

          {/* Description */}
          <div className="cd-skel cd-skel--shimmer" style={{ width: '70%', maxWidth: 460, height: 14, borderRadius: 4, marginBottom: 20 }} />

          {/* Search bar skeleton */}
          <div className="cd-skel cd-skel--shimmer" style={{ width: '100%', maxWidth: 600, height: 50, borderRadius: 999, marginBottom: '2rem' }} />

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem' }}>
            <span className="cd-skel cd-skel--shimmer" style={{ width: 80, height: 28, borderRadius: 999 }} />
            <span className="cd-skel cd-skel--shimmer" style={{ width: 100, height: 28, borderRadius: 999 }} />
            <span className="cd-skel cd-skel--shimmer" style={{ width: 110, height: 28, borderRadius: 999 }} />
          </div>

          {/* Section heading */}
          <div className="cd-skel cd-skel--shimmer" style={{ width: 160, height: 24, borderRadius: 6, marginBottom: '1.25rem' }} />

          {/* Sector cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ border: '2px solid #f0ebe6', borderRadius: 14, overflow: 'hidden' }}>
                <div className="cd-skel cd-skel--shimmer" style={{ height: 56, borderRadius: 0 }} />
                <div style={{ padding: '1rem' }}>
                  {[0, 1, 2, 3].map(j => (
                    <div key={j} className="cd-skel cd-skel--shimmer" style={{ width: `${70 + j * 5}%`, height: 14, borderRadius: 4, marginBottom: 8 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
