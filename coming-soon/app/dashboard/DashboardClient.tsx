'use client'
import Link from 'next/link'
import { I, ic } from '../components/icons'

/**
 * Dashboard overview — Goodfirms-style 3-card grow hero. Replaces the
 * earlier 7-section feature tile grid (those pages were placeholder
 * skeletons and the section overview added noise without action).
 *
 * Each card is a primary CTA into one of three flows: list a company,
 * list a product, or write a review. The form at /dashboard/new uses
 * smart hero gating to pick the right mode based on the user's
 * existing listings, so both list cards point to the same destination.
 *
 * No DashboardHeader on this page — the hero IS the page header.
 */
export default function DashboardClient() {
  return (
    <>
      <section className="dash-grow" aria-labelledby="dash-grow-title">
        <div className="dash-grow-inner">
          <h2 id="dash-grow-title" className="dash-grow-title">
            Grow Your Business with InfoWebWorld
          </h2>
          <p className="dash-grow-sub">
            Choose how you want to get started on the platform.
          </p>

          <div className="dash-grow-grid">
            <article className="dash-grow-card dash-grow-card--orange">
              <span className="dash-grow-icon" aria-hidden="true">
                <I d={ic.building} size={20} sw={1.8} />
              </span>
              <h3 className="dash-grow-card-title">List Your Company</h3>
              <p className="dash-grow-card-desc">
                Create your company profile, showcase your services, and get
                discovered by buyers worldwide.
              </p>
              <Link
                href="/dashboard/new?mode=company"
                className="dash-grow-btn dash-grow-btn--orange"
              >
                Get Started
              </Link>
            </article>

            <article className="dash-grow-card dash-grow-card--blue">
              <span className="dash-grow-icon" aria-hidden="true">
                <I d={ic.package} size={20} sw={1.8} />
              </span>
              <h3 className="dash-grow-card-title">List Your Product</h3>
              <p className="dash-grow-card-desc">
                Add your software product to InfoWebWorld and reach thousands of
                potential buyers every month.
              </p>
              <Link
                href="/dashboard/new?mode=product"
                className="dash-grow-btn dash-grow-btn--blue"
              >
                Get Started
              </Link>
            </article>

            <article className="dash-grow-card dash-grow-card--green">
              <span className="dash-grow-icon" aria-hidden="true">
                <I d={ic.star} size={20} sw={1.8} />
              </span>
              <h3 className="dash-grow-card-title">Write a Review</h3>
              <p className="dash-grow-card-desc">
                Share your experience working with a company and help other
                buyers make informed decisions.
              </p>
              <Link
                href="/write-review"
                className="dash-grow-btn dash-grow-btn--ghost"
              >
                Submit a Review
              </Link>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
