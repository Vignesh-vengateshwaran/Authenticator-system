import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import type { LoginReq } from '../types'

const LoginPage: React.FC = () => {
  const navigate        = useNavigate()
  const { login }       = useAuth()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginReq>()

  const onSubmit = async (formData: LoginReq) => {
    setError('')
    setLoading(true)

    try {
      // Call backend — now returns full User object
      const user = await authService.login(formData)

      // Save user and go to dashboard
      login(user)
      navigate('/dashboard')

    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No account found with this email.')
      } else if (err.response?.status === 401) {
        setError('Invalid password. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">ShopNow</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Email field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              {...register('mail', {
                required: 'Email is required',
                pattern: {
                  value:   /^\S+@\S+$/i,
                  message: 'Please enter a valid email',
                },
              })}
            />
            {errors.mail && (
              <p className="text-red-500 text-sm mt-1">{errors.mail.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Register link */}
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage