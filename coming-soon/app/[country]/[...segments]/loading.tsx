import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function CategoryLoading() {
  return (
    <>
      <Navbar />
      <section className="cd-page" style={{ background: '#fff', minHeight: '80vh' }}>
        <div className="cd-wrap" style={{ maxWidth: 1340, margin: '0 auto', padding: '0 clamp(.75rem, 2vw, 1.25rem)' }}>
          {/* Breadcrumb skeleton */}
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.6rem', paddingTop: '.5rem' }}>
            <span className="cd-skel cd-skel--shimmer" style={{ width: 40, height: 12, borderRadius: 4 }} />
            <span className="cd-skel cd-skel--shimmer" style={{ width: 70, height: 12, borderRadius: 4 }} />
            <span className="cd-skel cd-skel--shimmer" style={{ width: 100, height: 12, borderRadius: 4 }} />
          </div>

          {/* H1 skeleton */}
          <div className="cd-skel cd-skel--shimmer" style={{ width: '60%', maxWidth: 420, height: 32, borderRadius: 8, marginBottom: 12 }} />

          {/* Description skeleton */}
          <div className="cd-skel cd-skel--shimmer" style={{ width: '80%', maxWidth: 520, height: 14, borderRadius: 4, marginBottom: 6 }} />
          <div className="cd-skel cd-skel--shimmer" style={{ width: '55%', maxWidth: 360, height: 14, borderRadius: 4, marginBottom: 16 }} />

          {/* Stat pills skeleton */}
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
            <span className="cd-skel cd-skel--shimmer" style={{ width: 90, height: 28, borderRadius: 999 }} />
            <span className="cd-skel cd-skel--shimmer" style={{ width: 110, height: 28, borderRadius: 999 }} />
          </div>

          {/* Search bar skeleton */}
          <div className="cd-skel cd-skel--shimmer" style={{ width: '100%', maxWidth: 440, height: 46, borderRadius: 999, marginBottom: '1.5rem' }} />

          {/* Subcategory chips skeleton */}
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' as const, marginBottom: '1.5rem' }}>
            {[80, 100, 70, 90, 110, 75].map((w, i) => (
              <span key={i} className="cd-skel cd-skel--shimmer" style={{ width: w, height: 30, borderRadius: 999 }} />
            ))}
          </div>

          {/* Listing cards skeleton */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ border: '2px solid #f0ebe6', borderRadius: 14, padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '.75rem', marginBottom: '.75rem' }}>
                  <div className="cd-skel cd-skel--shimmer" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="cd-skel cd-skel--shimmer" style={{ width: '70%', height: 16, borderRadius: 4, marginBottom: 6 }} />
                    <div className="cd-skel cd-skel--shimmer" style={{ width: '90%', height: 12, borderRadius: 4 }} />
                  </div>
                </div>
                <div className="cd-skel cd-skel--shimmer" style={{ width: '100%', height: 12, borderRadius: 4, marginBottom: 6 }} />
                <div className="cd-skel cd-skel--shimmer" style={{ width: '80%', height: 12, borderRadius: 4, marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <span className="cd-skel cd-skel--shimmer" style={{ width: 100, height: 32, borderRadius: 8 }} />
                  <span className="cd-skel cd-skel--shimmer" style={{ width: 80, height: 32, borderRadius: 8 }} />
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
