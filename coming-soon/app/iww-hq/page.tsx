'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { checkSession } from './utils/hash'

export default function AdminIndex() {
  const router = useRouter()
  useEffect(() => {
    if (checkSession()) router.replace('/iww-hq/dashboard')
  }, [router])
  return null // Layout handles the login gate
}
