'use client'
import React, { useState, useRef, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from './dashboard.module.scss'
import { clearSessionCache, forceSessionRefresh } from '../../../lib/sessionUtils'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { data: session, status, update: updateSession } = useSession()
  const router = useRouter()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    profilePicture: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        bio: session.user.bio || '',
        location: session.user.location || '',
        website: session.user.website || '',
        profilePicture: session.user.profilePicture || session.user.image || ''
      })
    }
  }, [session])

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          name: data.user.name || '',
          bio: data.user.bio || '',
          location: data.user.location || '',
          website: data.user.website || '',
          profilePicture: data.user.profilePicture || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }, [])

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsUploading(true)
    
    const uploadPromise = (async () => {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(prev => ({ ...prev, profilePicture: data.url }))
        return 'Profile picture uploaded successfully!'
      } else {
        throw new Error('Upload failed')
      }
    })()

    toast.promise(
      uploadPromise,
      {
        loading: 'Uploading profile picture...',
        success: 'Profile picture uploaded!',
        error: 'Failed to upload image. Please try again.'
      }
    )

    try {
      await uploadPromise
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleProfileUpdate = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Close modal immediately
        setShowProfileModal(false)
        
        // Clear all session cache
        clearSessionCache()
        
        // Force session refresh
        await forceSessionRefresh()
        
        toast.success('Profile updated successfully! Page will refresh to show changes.')
        
        // Hard reload as final backup
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

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

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.welcomeCard}>
            <h1>Dashboard</h1>
            <h2>Welcome back, {session.user?.name}!</h2>
            <p>Manage your blog posts, view analytics, and customize your profile from your personal dashboard.</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📝</div>
              <h3>Create Post</h3>
              <p>Write and publish your blog posts with our intuitive editor</p>
              <button 
                className={styles.cardButton}
                onClick={() => router.push('/create-post')}
              >
                Start Writing
              </button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>📊</div>
              <h3>Analytics</h3>
              <p>View your blog performance, readership stats, and engagement metrics</p>
              <button className={styles.cardButton}>View Analytics</button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>👤</div>
              <h3>Profile Settings</h3>
              <p>Update your profile information, bio, and profile picture</p>
              <button 
                className={styles.cardButton}
                onClick={() => setShowProfileModal(true)}
              >
                Edit Profile
              </button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>📚</div>
              <h3>My Posts</h3>
              <p>Manage and edit your published blog posts and drafts</p>
              <button 
                className={styles.cardButton}
                onClick={() => router.push(`/post/${session?.user?.id}`)}
              >
                Manage Posts
              </button>
            </div>
          </div>

          <div className={styles.recentActivity}>
            <h3>Recent Activity</h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={styles.activityIcon}>�</span>
                <div>
                  <p>Successfully logged in</p>
                  <small>Just now</small>
                </div>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityIcon}>👤</span>
                <div>
                  <p>Profile viewed</p>
                  <small>5 minutes ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Profile Update Modal */}
      {showProfileModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProfileModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Profile</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowProfileModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Profile Picture</label>
                <div className={styles.imageUpload}>
                  {profileData.profilePicture && (
                    <div className={styles.currentImage}>
                      <img 
                        src={profileData.profilePicture} 
                        alt="Current profile"
                      />
                      <span>Current profile picture</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadButton}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Choose New Picture'}
                  </button>
                  {isUploading && (
                    <p className={styles.uploadProgress}>Uploading image to Azure...</p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={styles.input}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className={styles.textarea}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={styles.input}
                  placeholder="Where are you based?"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Website</label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className={styles.input}
                  placeholder="https://your-website.com"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.saveButton}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
