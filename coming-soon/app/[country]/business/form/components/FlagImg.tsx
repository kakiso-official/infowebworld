'use client'
import { useState } from 'react'

export default function FlagImg({ iso }: { iso: string }) {
  const [err, setErr] = useState(false)
  if (err) return <span className="lf2-flag-fallback">{iso}</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      alt={iso}
      className="lf2-flag-img"
      onError={() => setErr(true)}
    />
  )
}
