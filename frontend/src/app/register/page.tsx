'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
      // 真实注册 - 调用后端 API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || '註冊失敗')
        setLoading(false)
        return
      }
      
      // 保存用户信息
      sessionStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || '註冊失敗，請稍後重試')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // TODO: 实现社交登录
    alert(`${provider} 註冊功能即將上線`)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <h2 className="text-4xl font-bold mb-4">開始您的 AI 之旅</h2>
          <p className="text-xl text-white/80 mb-8">
            加入方舟算力，釋放無限可能
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <span>免費試用 5 小時</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <span>無需信用卡</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <span>秒級部署</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <span>7x24 客戶支援</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <img src="/images/logo.png" alt="ArkCloud" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">方舟算力</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2 text-gray-900">創建帳戶</h1>
          <p className="text-gray-600 mb-8">開始使用方舟雲計算</p>
          
          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('Apple')}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm font-medium">Apple</span>
            </button>
            <button
              onClick={() => handleSocialLogin('LINE')}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00B900">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.915C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              <span className="text-sm font-medium">LINE</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">或使用電子郵件</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">用戶名</label>
              <input 
                type="text" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="您的名字"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
              <input 
                type="email" 
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">公司名稱（選填）</label>
              <input 
                type="text" 
                value={form.company}
                onChange={(e) => setForm({...form, company: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="公司名稱"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
              <input 
                type="password" 
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500 mt-1">至少 8 位，包含大小寫字母和數字</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" required />
              <span className="text-sm text-gray-600">
                我已閱讀並同意 <Link href="/terms" className="text-blue-600 hover:underline">服務條款</Link> 和 <Link href="/privacy" className="text-blue-600 hover:underline">隱私政策</Link>
              </span>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors disabled:opacity-50 text-white"
            >
              {loading ? '註冊中...' : '立即註冊'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            已有帳戶？ <Link href="/login" className="text-blue-600 hover:underline font-medium">立即登入</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
