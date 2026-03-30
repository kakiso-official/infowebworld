import Link from './CountryLink'

export default function BusinessCTA() {
  return (
    <section className="bcta">
      <div className="container">
        <p className="bcta-text">
          <a href="https://infowebworld.com" className="bcta-link">infoWebWorld.com</a> for Business
        </p>
        <Link href="/business" className="bcta-btn">
          Get Listed
          <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </section>
  )
}
