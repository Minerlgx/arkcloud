'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const data = await api.post('/users/login', { email, password })
      sessionStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">歡迎回來</h1>
          <p className="text-gray-600">登入您的方舟帳戶</p>
        </div>
        
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">電子郵件</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">密碼</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary/90 rounded-xl font-semibold transition-colors disabled:opacity-50 text-white"
          >
            {loading ? '登入中...' : '登入'}
          </button>
          <p className="text-center text-gray-600 mt-6">
            還沒有帳戶？ <Link href="/register" className="text-primary hover:underline">立即註冊</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
