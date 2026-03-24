'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const data = await api.post('/users/register', form)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || '註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">創建帳戶</h1>
          <p className="text-gray-600">開始使用方舟雲計算</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">用戶名</label>
            <input 
              type="text" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary"
              placeholder="您的名字"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">電子郵件</label>
            <input 
              type="email" 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">公司名稱（選填）</label>
            <input 
              type="text" 
              value={form.company}
              onChange={(e) => setForm({...form, company: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary"
              placeholder="公司名稱"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">密碼</label>
            <input 
              type="password" 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
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
            {loading ? '註冊中...' : '立即註冊'}
          </button>
          <p className="text-center text-gray-600 mt-6">
            已有帳戶？ <Link href="/login" className="text-primary hover:underline">立即登入</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
