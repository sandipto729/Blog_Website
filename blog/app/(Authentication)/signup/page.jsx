'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './signup.module.scss'

const signup = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [success, setSuccess] = useState(false)
    
    const calculatePasswordStrength = (pwd) => {
        let strength = 0
        if (pwd.length >= 8) strength++
        if (/[a-z]/.test(pwd)) strength++
        if (/[A-Z]/.test(pwd)) strength++
        if (/[0-9]/.test(pwd)) strength++
        if (/[^A-Za-z0-9]/.test(pwd)) strength++
        return strength
    }
    
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        setPasswordStrength(calculatePasswordStrength(newPassword))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
        const confirmPassword = e.target.confirmPassword.value

        if(password !== confirmPassword) {
            setError('Password and Confirm Password do not match')
            setLoading(false)
            return
        }

        if(password.length < 6) {
            setError('Password must be at least 6 characters long')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            })
            
            const data = await response.json()
            
            if(response.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/login')
                }, 2000) // Show success message for 2 seconds before redirecting
            } else {
                setError(data.message || 'Something went wrong')
            }
        } catch (err) {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }
    
  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join our blog community today</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>✅</span>
            Account created successfully! Redirecting to login...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              className={styles.input}
              required 
              minLength={2}
            />
            <span className={styles.inputIcon}>👤</span>
          </div>
          
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              className={styles.input}
              required 
            />
            <span className={styles.inputIcon}>📧</span>
          </div>
          
          <div className={styles.inputGroup}>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className={styles.input}
              value={password}
              onChange={handlePasswordChange}
              required 
            />
            <span className={styles.inputIcon}>🔒</span>
          </div>
          
          {password && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthBar}>
                <div 
                  className={`${styles.strengthFill} ${styles[`strength${passwordStrength}`]}`}
                  style={{width: `${(passwordStrength / 5) * 100}%`}}
                ></div>
              </div>
              <span className={styles.strengthText}>
                {passwordStrength === 0 && 'Very Weak'}
                {passwordStrength === 1 && 'Weak'}
                {passwordStrength === 2 && 'Fair'}
                {passwordStrength === 3 && 'Good'}
                {passwordStrength === 4 && 'Strong'}
                {passwordStrength === 5 && 'Very Strong'}
              </span>
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              className={`${styles.input} ${confirmPassword && password !== confirmPassword ? styles.mismatch : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
            <span className={styles.inputIcon}>🔒</span>
          </div>
          
          {confirmPassword && password !== confirmPassword && (
            <div className={styles.passwordMismatch}>
              <span className={styles.errorIcon}>⚠️</span>
              Passwords do not match
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className={styles.footer}>
          <p className={styles.loginLink}>
            Already have an account? 
            <Link href="/login" className={styles.link}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default signup
