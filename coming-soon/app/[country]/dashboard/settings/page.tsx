import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { queryOne } from '@/lib/db'
import { USER_COOKIE_NAME } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = await params
  const store = await cookies()
  const token = store.get(USER_COOKIE_NAME)?.value
  if (!token) redirect(`/${country}/business`)

  const user = await queryOne<{
    email: string; name: string | null; provider: string
    created_at: string; email_verified: number
  }>(
    `SELECT u.email, u.name, u.provider, u.created_at, u.email_verified
     FROM business_sessions s JOIN business_users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1`,
    [token]
  )
  if (!user) redirect(`/${country}/business`)

  return (
    <div className="dash">
      <header className="ds-page-head">
        <div>
          <h1 className="ds-page-title">Settings</h1>
          <p className="ds-page-sub">Account details and preferences.</p>
        </div>
      </header>

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
            <span className="set-row-lbl">Signed in with</span>
            <span className="set-row-val">
              {user.provider === 'email' ? 'Email & password' : capitalize(user.provider)}
            </span>
          </div>
          <div className="set-row">
            <span className="set-row-lbl">Email verified</span>
            <span className="set-row-val">{user.email_verified ? 'Yes' : 'No'}</span>
          </div>
          <div className="set-row">
            <span className="set-row-lbl">Member since</span>
            <span className="set-row-val">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="set-note">Profile editing is coming soon. Need help? <a href={`/${country}/contact`}>Contact us</a>.</p>
      </section>
    </div>
  )
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
