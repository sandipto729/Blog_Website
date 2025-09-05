'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './forgot-password.module.scss'

const ForgotPassword = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API call for forgot password
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 2000)
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Check Your Email</h1>
            <p className={styles.subtitle}>We've sent a password reset link to {email}</p>
          </div>
          
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>✅</span>
            Password reset instructions have been sent to your email address.
          </div>
          
          <div className={styles.footer}>
            <Link href="/login" className={styles.backLink}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Forgot Password</h1>
          <p className={styles.subtitle}>Enter your email to reset your password</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="Email Address" 
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <span className={styles.inputIcon}>📧</span>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !email}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        
        <div className={styles.footer}>
          <Link href="/login" className={styles.backLink}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
