import { Routes, Route } from 'react-router-dom'
import './styles/shared.css'

import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ListingPage from './pages/ListingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SubmitListingPage from './pages/SubmitListingPage'
import SearchPage from './pages/SearchPage'
import PricingPage from './pages/PricingPage'
import BlogPage from './pages/BlogPage'
import BlogArticlePage from './pages/BlogArticlePage'
import NewsPage from './pages/NewsPage'
import NewsArticlePage from './pages/NewsArticlePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ComparisonPage from './pages/ComparisonPage'
import AlternativesPage from './pages/AlternativesPage'
import BestOfPage from './pages/BestOfPage'
import ProfilePage from './pages/ProfilePage'
import WriteReviewPage from './pages/WriteReviewPage'
import DashboardPage from './pages/DashboardPage'
import DashboardAnalyticsPage from './pages/DashboardAnalyticsPage'
import DashboardBillingPage from './pages/DashboardBillingPage'
import DashboardLeadsPage from './pages/DashboardLeadsPage'
import DashboardProfilePage from './pages/DashboardProfilePage'
import DashboardReviewsPage from './pages/DashboardReviewsPage'
import DashboardSettingsPage from './pages/DashboardSettingsPage'
import DashboardListingPage from './pages/DashboardListingPage'
import DashboardCreateListingPage from './pages/DashboardCreateListingPage'
import AdminPage from './pages/AdminPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import AdminListingsPage from './pages/AdminListingsPage'
import AdminNewsPage from './pages/AdminNewsPage'
import AdminRevenuePage from './pages/AdminRevenuePage'
import AdminReviewsPage from './pages/AdminReviewsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AccountPage from './pages/AccountPage'
import AccountReviewsPage from './pages/AccountReviewsPage'
import AccountSavedPage from './pages/AccountSavedPage'
import AccountNotificationsPage from './pages/AccountNotificationsPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import ClaimListingPage from './pages/ClaimListingPage'
import NotFoundPage from './pages/NotFoundPage'

/* ── Country Landing Pages ── */
import IndiaLandingPage from './pages/landing/IndiaLandingPage'
import EuropeLandingPage from './pages/landing/EuropeLandingPage'
import AustraliaLandingPage from './pages/landing/AustraliaLandingPage'
import CanadaLandingPage from './pages/landing/CanadaLandingPage'
import UKLandingPage from './pages/landing/UKLandingPage'

/* Country code → news countryCode mapping */
const countryNewsMap = { in: 'in', eu: 'eu', au: 'au', ca: 'ca', uk: 'uk' }

/* Public pages that should work under every country prefix */
function PublicRoutes({ prefix = '', countryCode = 'us' }) {
  const p = prefix ? `/${prefix}` : ''
  const nc = countryNewsMap[countryCode] || 'us'
  return (
    <>
      <Route path={`${p}/category`} element={<CategoryPage />} />
      <Route path={`${p}/listing`} element={<ListingPage />} />
      <Route path={`${p}/signin`} element={<SignInPage />} />
      <Route path={`${p}/signup`} element={<SignUpPage />} />
      <Route path={`${p}/submit-listing`} element={<SubmitListingPage />} />
      <Route path={`${p}/search`} element={<SearchPage />} />
      <Route path={`${p}/pricing`} element={<PricingPage />} />
      <Route path={`${p}/blog`} element={<BlogPage />} />
      <Route path={`${p}/blog-article`} element={<BlogArticlePage />} />
      <Route path={`${p}/news`} element={<NewsPage countryCode={nc} />} />
      <Route path={`${p}/news-article`} element={<NewsArticlePage />} />
      <Route path={`${p}/about`} element={<AboutPage />} />
      <Route path={`${p}/contact`} element={<ContactPage />} />
      <Route path={`${p}/comparison`} element={<ComparisonPage />} />
      <Route path={`${p}/alternatives`} element={<AlternativesPage />} />
      <Route path={`${p}/best-of`} element={<BestOfPage />} />
      <Route path={`${p}/profile`} element={<ProfilePage />} />
      <Route path={`${p}/write-review`} element={<WriteReviewPage />} />
      <Route path={`${p}/claim-listing`} element={<ClaimListingPage />} />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* ── Country-Specific Landings ── */}
      <Route path="/en-in" element={<IndiaLandingPage />} />
      <Route path="/en-eu" element={<EuropeLandingPage />} />
      <Route path="/en-au" element={<AustraliaLandingPage />} />
      <Route path="/en-ca" element={<CanadaLandingPage />} />
      <Route path="/en-uk" element={<UKLandingPage />} />

      {/* ── Public pages — root (US) ── */}
      {PublicRoutes({ prefix: '', countryCode: 'us' })}

      {/* ── Public pages — per country ── */}
      {PublicRoutes({ prefix: 'en-in', countryCode: 'in' })}
      {PublicRoutes({ prefix: 'en-eu', countryCode: 'eu' })}
      {PublicRoutes({ prefix: 'en-au', countryCode: 'au' })}
      {PublicRoutes({ prefix: 'en-ca', countryCode: 'ca' })}
      {PublicRoutes({ prefix: 'en-uk', countryCode: 'uk' })}

      {/* ── Dashboard (no country prefix needed) ── */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/listing" element={<DashboardListingPage />} />
      <Route path="/dashboard/listing/create" element={<DashboardCreateListingPage />} />
      <Route path="/dashboard/analytics" element={<DashboardAnalyticsPage />} />
      <Route path="/dashboard/billing" element={<DashboardBillingPage />} />
      <Route path="/dashboard/leads" element={<DashboardLeadsPage />} />
      <Route path="/dashboard/profile" element={<DashboardProfilePage />} />
      <Route path="/dashboard/reviews" element={<DashboardReviewsPage />} />
      <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/reviews" element={<AccountReviewsPage />} />
      <Route path="/account/saved" element={<AccountSavedPage />} />
      <Route path="/account/notifications" element={<AccountNotificationsPage />} />
      <Route path="/account/settings" element={<AccountSettingsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      <Route path="/admin/listings" element={<AdminListingsPage />} />
      <Route path="/admin/news" element={<AdminNewsPage />} />
      <Route path="/admin/revenue" element={<AdminRevenuePage />} />
      <Route path="/admin/reviews" element={<AdminReviewsPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
