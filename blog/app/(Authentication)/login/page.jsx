'use client'
import React, { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.scss'

const Login = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const email = e.target.email.value.trim()
    const password = e.target.password.value

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        // Redirect will happen via useEffect when session updates
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true)
      setError('')
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (err) {
      console.error(`${provider} login error:`, err)
      setError(`Failed to login with ${provider}`)
      setLoading(false)
    }
  }

  // Show loading while checking authentication status
  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (status === 'authenticated') {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
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
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              required
              disabled={loading}
              className={styles.input}
            />
            <span className={styles.inputIcon}>📧</span>
          </div>

          <div className={styles.inputGroup}>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              disabled={loading}
              className={styles.input}
            />
            <span className={styles.inputIcon}>🔒</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>OR</span>
        </div>

        <div className={styles.socialButtons}>
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className={`${styles.socialButton} ${styles.googleButton}`}
          >
            <span className={styles.socialIcon}>🌐</span>
            Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
            className={`${styles.socialButton} ${styles.githubButton}`}
          >
            <span className={styles.socialIcon}>👨‍💻</span>
            Continue with GitHub
          </button>
        </div>

        <div className={styles.footer}>
          <p className={styles.signupLink}>
            Don't have an account?{' '}
            <Link href="/signup" className={styles.link}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
