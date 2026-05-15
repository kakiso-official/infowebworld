import { requireDashboardUser } from '@/lib/user-auth'
import DashboardHeader from '../DashboardHeader'

export const dynamic = 'force-dynamic'

export default async function SettingsPage({
  params,
}: {
  params: Promise<Record<string, never>>
}) {
  await params
  const user = await requireDashboardUser()

  return (
    <div className="dash">
      <DashboardHeader title="Settings" subtitle="Account details and preferences." />

      <section className="set-card">
        <h2 className="set-card-title">Profile</h2>
        <div className="set-rows">
          <div className="set-row">
            <span className="set-row-lbl">Name</span>
            <span className="set-row-val">{user.name || <em>not set</em>}</span>
          </div>
          <div className="set-row">
            <span className="set-row-lbl">Email</span>
            <span className="set-row-val">{user.email}</span>
          </div>
          <div className="set-row">
            <span className="set-row-lbl">Phone</span>
            <span className="set-row-val">
              {user.phone || <em>not on file</em>}
            </span>
          </div>
          <div className="set-row">
            <span className="set-row-lbl">Signed in with</span>
            <span className="set-row-val">
              {user.provider === 'email' ? 'Email & password' : capitalize(user.provider)}
            </span>
          </div>
          <div className="set-row">
            <span className="set-row-lbl">Email verified</span>
            <span className="set-row-val">{user.emailVerified ? 'Yes' : 'No'}</span>
          </div>
          <div className="set-row">
            <span className="set-row-lbl">Member since</span>
            <span className="set-row-val">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="set-note">Profile editing is coming soon. Need help? <a href="/contact">Contact us</a>.</p>
      </section>
    </div>
  )
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
