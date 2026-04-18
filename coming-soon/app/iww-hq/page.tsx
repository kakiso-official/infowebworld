'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminIndex() {
  const router = useRouter()
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'same-origin', cache: 'no-store' })
      .then((res) => {
        if (res.ok) router.replace('/iww-hq/dashboard')
      })
      .catch(() => {})
  }, [router])
  return null // Layout handles the login gate
}
