const base = 'http://localhost:3000'
const email = `test+${Date.now()}@iww.local`
const password = 'test12345!'

console.log('\n--- 1. Signup ---')
const sRes = await fetch(`${base}/api/auth/signup`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name: 'Aadil Test' }),
})
console.log('status:', sRes.status)
console.log('body:', await sRes.text())

const setCookie = sRes.headers.get('set-cookie') || ''
console.log('set-cookie:', setCookie.slice(0, 80) + '...')
const cookie = setCookie.split(';')[0]

console.log('\n--- 2. /api/auth/me (authed) ---')
const meRes = await fetch(`${base}/api/auth/me`, { headers: { Cookie: cookie } })
console.log('status:', meRes.status)
console.log('body:', await meRes.text())

console.log('\n--- 3. /api/auth/me (anonymous) ---')
const meAnon = await fetch(`${base}/api/auth/me`)
console.log('status:', meAnon.status)
console.log('body:', await meAnon.text())

console.log('\n--- 4. login with same creds ---')
const lRes = await fetch(`${base}/api/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
console.log('status:', lRes.status)
console.log('body:', await lRes.text())

console.log('\n--- 5. logout ---')
const cookie2 = (lRes.headers.get('set-cookie') || '').split(';')[0]
const out = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { Cookie: cookie2 } })
console.log('status:', out.status, await out.text())

console.log('\n--- 6. OAuth start (should redirect or 503 if no creds) ---')
for (const p of ['google', 'facebook', 'reddit', 'linkedin', 'x']) {
  const r = await fetch(`${base}/api/auth/${p}/start`, { redirect: 'manual' })
  const loc = r.headers.get('location')
  console.log(`${p}:`, r.status, loc ? `→ ${new URL(loc).host}` : await r.text())
}
