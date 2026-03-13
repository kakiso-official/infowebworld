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
import AdminPage from './pages/AdminPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import AdminListingsPage from './pages/AdminListingsPage'
import AdminNewsPage from './pages/AdminNewsPage'
import AdminRevenuePage from './pages/AdminRevenuePage'
import AdminReviewsPage from './pages/AdminReviewsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/listing" element={<ListingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/submit-listing" element={<SubmitListingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog-article" element={<BlogArticlePage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news-article" element={<NewsArticlePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/comparison" element={<ComparisonPage />} />
      <Route path="/alternatives" element={<AlternativesPage />} />
      <Route path="/best-of" element={<BestOfPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/write-review" element={<WriteReviewPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/analytics" element={<DashboardAnalyticsPage />} />
      <Route path="/dashboard/billing" element={<DashboardBillingPage />} />
      <Route path="/dashboard/leads" element={<DashboardLeadsPage />} />
      <Route path="/dashboard/profile" element={<DashboardProfilePage />} />
      <Route path="/dashboard/reviews" element={<DashboardReviewsPage />} />
      <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />
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
