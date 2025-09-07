import React from 'react'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem', margin: '0', color: '#333' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '1rem 0', color: '#666' }}>Page Not Found</h2>
      <p style={{ margin: '1rem 0', color: '#888' }}>The page you're looking for doesn't exist.</p>
      <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '1.1rem' }}>
        ← Back to Home
      </Link>
    </div>
  )
}

export default NotFound
