'use client'
import { useMemo } from 'react'
import BlogStudio from '../BlogStudio'
import { createEmptyPost } from '../../data/blog-storage'

export default function NewPostPage() {
  const initial = useMemo(() => createEmptyPost(), [])
  return <BlogStudio initial={initial} isNew />
}
