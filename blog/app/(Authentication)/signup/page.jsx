'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const signup = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    
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
                router.push('/login')
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
    <div>
      <h1>Signup Page</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Signup'}
        </button>
      </form>
      <p>Already have an account? <Link href="/login">Log in</Link></p>
    </div>
  )
}

export default signup
