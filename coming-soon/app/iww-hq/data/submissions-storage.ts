/**
 * Submissions storage — reads/writes from MySQL via api.php
 */

const API = '/infowebworld/api.php'

export type RealSubmission = {
  id: string
  companyName: string
  contactName: string
  email: string
  phoneCode: string
  phone: string
  website: string
  category: string
  country: string
  city: string
  tagline: string
  description: string
  founded: string
  employees: string
  plan: string
  status: 'pending' | 'confirmed' | 'paid' | 'rejected'
  submittedAt: string
}

/** Map DB snake_case row to camelCase RealSubmission */
function mapRow(r: Record<string, unknown>): RealSubmission {
  return {
    id: String(r.id ?? ''),
    companyName: String(r.company_name ?? ''),
    contactName: String(r.contact_name ?? ''),
    email: String(r.email ?? ''),
    phoneCode: String(r.phone_code ?? '+1'),
    phone: String(r.phone ?? ''),
    website: String(r.website ?? ''),
    category: String(r.category_name ?? r.category ?? ''),
    country: String(r.country_name ?? r.country ?? ''),
    city: String(r.city ?? ''),
    tagline: String(r.tagline ?? ''),
    description: String(r.description ?? ''),
    founded: String(r.founded_year ?? ''),
    employees: String(r.team_size ?? ''),
    plan: String(r.plan_slug ?? r.plan ?? ''),
    status: (r.status as RealSubmission['status']) || 'pending',
    submittedAt: String(r.created_at ?? ''),
  }
}

export async function fetchAllSubmissions(): Promise<RealSubmission[]> {
  try {
    const res = await fetch(`${API}?action=submission_list`)
    if (!res.ok) throw new Error('API error')
    const rows: Record<string, unknown>[] = await res.json()
    return rows.map(mapRow)
  } catch {
    return []
  }
}

export async function fetchSubmissionStats(): Promise<{ total: number; pending: number; confirmed: number; paid: number }> {
  const subs = await fetchAllSubmissions()
  return {
    total: subs.length,
    pending: subs.filter(s => s.status === 'pending').length,
    confirmed: subs.filter(s => s.status === 'confirmed').length,
    paid: subs.filter(s => s.status === 'paid').length,
  }
}

export async function updateSubmissionStatus(id: string, status: RealSubmission['status']): Promise<void> {
  await fetch(`${API}?action=submission_status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: Number(id), status }),
  }).catch(() => {})
}

export async function deleteSubmission(id: string): Promise<void> {
  await fetch(`${API}?action=submission_delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: Number(id) }),
  }).catch(() => {})
}

export function addSubmission(data: Omit<RealSubmission, 'id' | 'status' | 'submittedAt'>): RealSubmission {
  const sub: RealSubmission = {
    ...data,
    id: 'new',
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }

  fetch(`${API}?action=submission_create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {})

  return sub
}
