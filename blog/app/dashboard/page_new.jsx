'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dashboard</h1>
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <span className={styles.welcome}>Welcome back,</span>
              <span className={styles.userName}>{session.user?.name}</span>
              <span className={styles.userEmail}>{session.user?.email}</span>
            </div>
            {(session.user?.profilePicture || session.user?.image) && (
              <img 
                src={session.user?.profilePicture || session.user?.image} 
                alt="Profile" 
                className={styles.avatar}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}
            <button 
              onClick={handleSignOut}
              className={styles.signOutButton}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.welcomeCard}>
            <h2>Welcome to your Blog Dashboard</h2>
            <p>You have successfully logged in. This is where you can manage your blog posts, view analytics, and customize your profile.</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📝</div>
              <h3>Create Post</h3>
              <p>Write and publish your blog posts</p>
              <button className={styles.cardButton}>Get Started</button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>📊</div>
              <h3>Analytics</h3>
              <p>View your blog performance and statistics</p>
              <button className={styles.cardButton}>View Stats</button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>👤</div>
              <h3>Profile</h3>
              <p>Manage your account settings and preferences</p>
              <button className={styles.cardButton}>Edit Profile</button>
            </div>

            {/* Debug Session Info - Remove this in production */}
            <div className={styles.card} style={{ background: '#f0f8ff', border: '1px solid #cce7ff' }}>
              <div className={styles.cardIcon}>🔍</div>
              <h3>Session Debug Info</h3>
              <div style={{ fontSize: '12px', textAlign: 'left' }}>
                <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
                <p><strong>Profile Picture:</strong> {session.user?.profilePicture ? '✅ Set' : '❌ Not set'}</p>
                <p><strong>Image (fallback):</strong> {session.user?.image ? '✅ Available' : '❌ Not available'}</p>
                <p><strong>User ID:</strong> {session.user?.id || 'N/A'}</p>
                {session.user?.profilePicture && (
                  <p><strong>Picture URL:</strong> <small>{session.user.profilePicture.substring(0, 50)}...</small></p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.recentActivity}>
            <h3>Recent Activity</h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={styles.activityIcon}>🔐</span>
                <div>
                  <p>Successfully logged in</p>
                  <small>Just now</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
