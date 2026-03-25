'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const ADMIN_EMAIL = 'liurui@cloudta.com.cn'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 只允许指定邮箱
      if (email !== ADMIN_EMAIL) {
        setError('您沒有管理員權限')
        setLoading(false)
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || '登錄失敗')
        setLoading(false)
        return
      }

      sessionStorage.setItem('admin', JSON.stringify(data.user))
      router.push('/admin/dashboard')
    } catch (err) {
      setError('連接服務器失敗，請稍後重試')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6 bg-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">管理後台</h1>
          <p className="text-slate-400">方舟雲計算 管理系統</p>
        </div>
        
        <form onSubmit={handleLogin} className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-2">管理員郵箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="liurui@cloudta.com.cn"
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-2">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-semibold transition-colors"
          >
            {loading ? '登錄中...' : '登錄'}
          </button>
        </form>
      </div>
    </div>
  )
}
