import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

interface RegisterForm {
  name:            string
  mail:            string
  password:        string
  confirmPassword: string
  role:            'USER' | 'ADMIN'
}

const RegisterPage: React.FC = () => {
  const navigate        = useNavigate()
  const { login }       = useAuth()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { role: 'USER' },
  })
  const passwordValue = watch('password')

  const onSubmit = async (formData: RegisterForm) => {
    setError('')
    setLoading(true)

    try { 
      const savedUser = await authService.register({
        name:     formData.name,
        mail:     formData.mail,
        password: formData.password,
        role:     formData.role,
      })
      const saved = localStorage.getItem('registeredUsers')
      const users = saved ? JSON.parse(saved) : []
      const updated = [...users.filter((u: any) => u.mail !== savedUser.mail), savedUser]
      localStorage.setItem('registeredUsers', JSON.stringify(updated))

      login(savedUser)
      navigate('/dashboard')

    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">ShopNow</h1>
          <p className="text-gray-500 mt-1">Create a new account</p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              {...register('name', {
                required:  'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              {...register('password', {
                required:  'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Repeat your password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              {...register('confirmPassword' as any, {
                required: 'Please confirm your password',
                validate: (value: string) =>
                  value === passwordValue || 'Passwords do not match',
              })}
            />
            {(errors as any).confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {(errors as any).confirmPassword.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Account Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 border border-gray-300 rounded px-4 py-3 cursor-pointer flex-1 hover:border-blue-400">
                <input
                  type="radio"
                  value="USER"
                  {...register('role')}
                />
                <div>
                  <p className="font-medium text-gray-800">👤 User</p>
                  <p className="text-gray-500 text-sm">Shop and browse</p>
                </div>
              </label>

              <label className="flex items-center gap-2 border border-gray-300 rounded px-4 py-3 cursor-pointer flex-1 hover:border-blue-400">
                <input
                  type="radio"
                  value="ADMIN"
                  {...register('role')}
                />
                <div>
                  <p className="font-medium text-gray-800">👑 Admin</p>
                  <p className="text-gray-500 text-sm">Manage store</p>
                </div>
              </label>

            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage