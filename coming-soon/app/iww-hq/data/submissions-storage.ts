/**
 * Real submissions storage — localStorage
 * Form submissions go here, admin reads from here.
 */

const KEY = 'iww_submissions'

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

function read(): RealSubmission[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function write(data: RealSubmission[]) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getAllSubmissions(): RealSubmission[] {
  return read().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export function getSubmissionById(id: string): RealSubmission | null {
  return read().find(s => s.id === id) || null
}

export function addSubmission(data: Omit<RealSubmission, 'id' | 'status' | 'submittedAt'>): RealSubmission {
  const sub: RealSubmission = {
    ...data,
    id: 'S' + String(read().length + 1).padStart(4, '0'),
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
  const all = read()
  all.push(sub)
  write(all)

  // Also save to MySQL database
  fetch('/infowebworld/api.php?action=submission_create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {})

  return sub
}

export function updateSubmissionStatus(id: string, status: RealSubmission['status']) {
  const all = read()
  const idx = all.findIndex(s => s.id === id)
  if (idx >= 0) { all[idx].status = status; write(all) }
}

export function deleteSubmission(id: string) {
  write(read().filter(s => s.id !== id))
}

export function getSubmissionStats() {
  const all = read()
  return {
    total: all.length,
    pending: all.filter(s => s.status === 'pending').length,
    confirmed: all.filter(s => s.status === 'confirmed').length,
    paid: all.filter(s => s.status === 'paid').length,
  }
}
