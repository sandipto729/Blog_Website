'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CreatePost from '@/component/CreatePost/CreatePost'

const CreatePostPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white'
      }} suppressHydrationWarning={true}>
        <div suppressHydrationWarning={true}>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <CreatePost />
}

export default CreatePostPage
