import React from 'react'
import Link from 'next/link'
import styles from './not-found.module.scss'

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Oops! Page Not Found</h2>
        <p className={styles.description}>
          The page you're looking for seems to have wandered off into the digital void. 
          Don't worry, it happens to the best of us!
        </p>
        
        <Link href="/" className={styles.homeButton}>
          <span className={styles.icon}>🏠</span>
          Back to Home
        </Link>

        <div className={styles.features}>
          <Link href="/blog" className={styles.feature}>
            <span className={styles.featureIcon}>📝</span>
            <h3 className={styles.featureTitle}>Latest Blogs</h3>
            <p className={styles.featureDescription}>
              Discover amazing content from our community of writers
            </p>
          </Link>
          
          <Link href="/dashboard" className={styles.feature}>
            <span className={styles.featureIcon}>👤</span>
            <h3 className={styles.featureTitle}>Your Profile</h3>
            <p className={styles.featureDescription}>
              Manage your posts and update your profile settings
            </p>
          </Link>
          
          <Link href="/create-post" className={styles.feature}>
            <span className={styles.featureIcon}>✍️</span>
            <h3 className={styles.featureTitle}>Create Post</h3>
            <p className={styles.featureDescription}>
              Share your thoughts and stories with the world
            </p>
          </Link>

          <Link href="/contact" className={styles.feature}>
            <span className={styles.featureIcon}>📞</span>
            <h3 className={styles.featureTitle}>Contact Us</h3>
            <p className={styles.featureDescription}>
              Get in touch with us for support or feedback
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
